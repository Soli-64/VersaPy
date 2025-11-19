
from typing import Callable
from .src.config import load_config
from .src.api.server import start_server
from .src.api.event import command_name_valid
from .src.api.shared_value import SharedValue as _SharedValue
from .src.storage.engine import StorageEngine
from .src.storage.preferences import PreferencesStorage
from fastapi import FastAPI
from .src.utils.logs import Log
from .src.storage.model import Model
from .src.storage.field import Field
import sys, threading as th, webview, socketio, asyncio

MODE = "prod" if getattr(sys, 'frozen', False) else "dev"

class VersaPyApp:

    def __init__(self):

        self.sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
        self.app = socketio.ASGIApp(self.sio, FastAPI())

        self.commands = {}
        self.shared_values = {}

        self.config = load_config(MODE)

        self.storage = StorageEngine(self.config.PROJECT_NAME)
        self.preferences = PreferencesStorage(self.config.PROJECT_NAME)

        self.sio.on("invoke", self.__invoke)

    # private methods
    async def __invoke(self, sid, data):
        func_name = data.get("func")
        args = data.get("args", {})
        if func_name not in self.commands:
            await self.sio.emit("response", {"error": "Function not found"}, to=sid)
            return
        try:
            f = self.commands[func_name]
            result = await f(**args) if asyncio.iscoroutinefunction(f) else f(**args)
            await self.sio.emit("response", {"result": result}, to=sid)
        except Exception as e:
            await self.sio.emit("response", {"error": str(e)}, to=sid)

    def __expose_fn(self, command: str, fn: Callable):
        self.commands[command] = fn

    def __get_sv_init_val(self, key):
        return self.shared_values[key]

    # decorators
    def expose(self, fn: Callable):
        self.__expose_fn(fn.__name__, fn)
        return fn

    # methods
    def SharedValue(self, key, init_value, on_change_cb):
        
        self.shared_values[key] = init_value
        
        sv = _SharedValue(self, key, init_value)
        sv.on_change = on_change_cb

        def on_update(_):
            received_key, received_value = _["value_key"], _ ["value"]
            if received_key == key:
                self.shared_values[key] = received_value
                on_change_cb(received_value)
        
        self.__expose_fn("get_shared_value", self.__get_sv_init_val)
        self.sio.on("front_update_shared_value", lambda a,b: on_update(b))

        return sv

    def store(self, model: Model):
        model.__save(self.storage)

    def get(self, model: Model):
        model.__load(self.storage)

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
