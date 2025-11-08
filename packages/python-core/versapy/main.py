
from .src.config import load_config
from .src.api.server import start_server
from .src.api.event import command_name_valid
from .src.api.shared_value import SharedValue as _SharedValue
from fastapi import FastAPI
import sys, threading as th, webview, socketio, asyncio

def is_frozen():
    return getattr(sys, 'frozen', False)

MODE = "prod" if is_frozen() else "dev"

sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
app = socketio.ASGIApp(sio, FastAPI())

api_endpoints = {}
events = {}
shared_value = {}

# decorators

def expose(func):
    """Decorator exposing a function via SocketIO."""
    api_endpoints[func.__name__] = func
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

def SharedValue(key, init_value, on_change_cb):
    def edit_sv_registry(_key, _value):
        if not shared_value[_key]:
            shared_value[_key] = None
        shared_value[_key] = _value

    sv = _SharedValue(sio, key, init_value, edit_sv_registry)
    sv.on_change = on_change_cb
    sv.register_sio()

    return sv

@sio.event
async def invoke(sid, data):
    func_name = data.get("func")
    args = data.get("args", {})
    if func_name not in api_endpoints:
        await sio.emit("response", {"error": "Function not found"}, to=sid)
        return
    try:
        f = api_endpoints[func_name]
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
