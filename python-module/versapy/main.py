
from .storage import ProjectStorage
from .config import handle_config
from dotenv import load_dotenv
import os, time, socket, sys, threading as th, webview, socketio, asyncio

from fastapi import FastAPI

def is_frozen():
    return getattr(sys, 'frozen', False)

load_dotenv(".env")

MODE = "prod" if is_frozen() else "dev"

params = {}
if MODE == "prod":
    params["async_mode"] = "eventlet"

sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
app = FastAPI()
app = socketio.ASGIApp(sio, app)

registry = {}

storage = None

def expose(func):
    """Decorator exposing a function via HTTP API."""
    registry[func.__name__] = func
    return func

@sio.event
async def invoke(sid, data):
    func_name = data.get("func")
    args = data.get("args", {})

    if func_name not in registry:
        await sio.emit("response", {"error": "Function not found"}, to=sid)
        return
    
    try:
        f = registry[func_name]
        result = await f(**args) if asyncio.iscoroutinefunction(f) else f(**args)
        await sio.emit("response", {"result": result}, to=sid)
    except Exception as e:
        await sio.emit("response", {"error": str(e)}, to=sid)

@expose
def set_value(key: str, value):
    storage.set(key, value)
    return f"Saved {key} = {value}"

@expose
def get_value(key: str):
    return storage.get(key, None)

def start_server(config):
    import uvicorn
    uvicorn.run(app, host=config.BACK_HOST, port=config.BACK_PORT)

def run_versapy(debug=True):

    global storage

    MODE = "prod" if is_frozen() else "dev"

    print(MODE)

    config = None
    front_uri = "http://localhost:5173"

    if MODE == "prod":
        config = handle_config("./_internal/versapy.config.json")
        front_uri = "./dist/index.html"
    else:
        config = handle_config("./versapy.config.json")
        front_uri = config.FRONT_URL

    storage = ProjectStorage(config.PROJECT_NAME)

    th.Thread(target=lambda: start_server(config), daemon=True).start()

    print(front_uri)

    window = webview.create_window(
        title=config.WINDOW_TITLE,
        url=front_uri,
        width=config.WINDOW_WIDTH,
        height=config.WINDOW_HEIGHT,
        resizable=config.WINDOW_RESIZABLE,
        fullscreen=config.WINDOW_FULLSCREEN
    )

    webview.start(debug=debug if not is_frozen() else False)
