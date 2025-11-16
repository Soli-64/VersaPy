
from .src.config import load_config
from .src.api.server import start_server
from .src.api.event import command_name_valid
from .src.api.shared_value import SharedValue as _SharedValue
from .src.storage.engine import StorageEngine
from .src.storage.preferences import PreferencesStorage
from fastapi import FastAPI
import sys, threading as th, webview, socketio, asyncio

MODE = "prod" if getattr(sys, 'frozen', False) else "dev"

class VersaPyApp:

    def __init__(self):

        self.sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
        self.app = socketio.ASGIApp(self.sio, FastAPI())

        self.api_endpoints = {}
        self.events = {}
        self.shared_value = {}

        self.config = load_config(MODE)

        self.storage = StorageEngine(f"{self.config.PROJECT_NAME}.db")
        self.preferences = PreferencesStorage(self.config.PROJECT_NAME)

        self.sio.on("invoke", self.__invoke)

    # private methods
    async def __invoke(self, sid, data):
        func_name = data.get("func")
        args = data.get("args", {})
        if func_name not in self.api_endpoints:
            await self.sio.emit("response", {"error": "Function not found"}, to=sid)
            return
        try:
            f = self.api_endpoints[func_name]
            result = await f(**args) if asyncio.iscoroutinefunction(f) else f(**args)
            await self.sio.emit("response", {"result": result}, to=sid)
        except Exception as e:
            await self.sio.emit("response", {"error": str(e)}, to=sid)

    # decorators
    def expose(self, func):
        self.api_endpoints[func.__name__] = func
        return func

    def event(self, func):
        name = func.__name__
        self.events[name] = None
        if not command_name_valid(name):
            print(
                f"Error: wrong exposed function name: {name} \n \
                Refer to doc for function reserved names. \n" 
                )
            return None

        async def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            self.events[name] = result
            await self.sio.emit(name, result)
            return result
        return wrapper

    # methods
    def SharedValue(self, key, init_value, on_change_cb):
        
        def edit_sv_registry(_key, _value):
            if not self.shared_value[_key]:
                self.shared_value[_key] = _value
            self.shared_value[_key] = _value

        def get_on_registry(key_):
            return self.shared_value[key_]

        self.shared_value[key] = init_value
        sv = _SharedValue(self.sio, key, init_value, edit_sv_registry, get_on_registry)
        
        sv.on_change = on_change_cb

        def on_change(_):
            received_key, received_value = _["value_key"], _ ["value"]
            print("receive:", received_value)
            if received_key == key:
                edit_sv_registry(key, received_value)
                on_change_cb(received_value)

        self.sio.on("front_update_shared_value", lambda a,b: on_change(b))

        return sv

    # run app
    def run(self, debug=True):

        th.Thread(target=lambda: start_server(self.app, self.config), daemon=True).start()

        window = webview.create_window(
            title=self.config.WINDOW_TITLE,
            url=self.config.FRONT_URL,
            width=self.config.WINDOW_WIDTH,
            height=self.config.WINDOW_HEIGHT,
            resizable=self.config.WINDOW_RESIZABLE,
            fullscreen=self.config.WINDOW_FULLSCREEN
        )

        webview.start(debug=debug if MODE=="dev" else False)
