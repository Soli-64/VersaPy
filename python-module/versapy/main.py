
from .src.config import load_config
from .src.api.server import start_server
from .src.api.event import command_name_valid
from fastapi import FastAPI
import sys, threading as th, webview, socketio, asyncio

def is_frozen():
    return getattr(sys, 'frozen', False)

MODE = "prod" if is_frozen() else "dev"

sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
app = socketio.ASGIApp(sio, FastAPI())

registry = {}
signals = {}
events = {}

# decorators

def expose(func):
    """Decorator exposing a function via SocketIO."""
    registry[func.__name__] = func
    return func

def event(func):
    name = func.__name__
    events[name] = None
    if not command_name_valid(name):
        print(
            f"Error: wrong exposed function name: {name} \n \
              Refer to doc for function reserved names. \n" 
            )
        return None

    async def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        events[name] = result
        await sio.emit(name, result)
        return result
    return wrapper

def signal(func):
    name = func.__name__
    signals[name] = None

    async def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        signals[name] = result
        await sio.emit("signal_update", {
            "name": name, 
            "value": result
        })
        return result
    return wrapper

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

def run_app(debug=True):

    global MODE

    config = load_config(MODE)

    th.Thread(target=lambda: start_server(app, config), daemon=True).start()

    window = webview.create_window(
        title=config.WINDOW_TITLE,
        url=config.FRONT_URL,
        width=config.WINDOW_WIDTH,
        height=config.WINDOW_HEIGHT,
        resizable=config.WINDOW_RESIZABLE,
        fullscreen=config.WINDOW_FULLSCREEN
    )

    webview.start(debug=debug if not is_frozen() else False)
