
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
import sys
import threading as th
import webview
import socketio
import asyncio
import os
import http.server
import socketserver

MODE = "prod" if getattr(sys, 'frozen', False) else "dev"

class VersaPyApp:

    def __init__(self):

        self.sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
        self.app = socketio.ASGIApp(self.sio, FastAPI())

        self.commands = {}
        self.shared_values = {}

        self.config = load_config(MODE)

        self.storage = StorageEngine(self, self.config.PROJECT_NAME)
        self.preferences = PreferencesStorage(self.config.PROJECT_NAME)

        self.sio.on("invoke", self.__invoke)

    # private methods
    async def __invoke(self, sid, data):
        func_name = data.get("func")
        args = data.get("args", {})
        req_id = data.get("id")
        if func_name not in self.commands:
            # include request id when available so client can correlate
            payload = {"error": "Function not found"}
            if req_id is not None:
                payload["id"] = req_id
            await self.sio.emit("response", payload, to=sid)
            return
        try:
            f = self.commands[func_name]
            result = await f(**args) if asyncio.iscoroutinefunction(f) else f(**args)
            # include request id in success response when provided
            payload = {"result": result}
            if req_id is not None:
                payload["id"] = req_id
            await self.sio.emit("response", payload, to=sid)
        except Exception as e:
            payload = {"error": str(e)}
            if req_id is not None:
                payload["id"] = req_id
            await self.sio.emit("response", payload, to=sid)

    def __expose_fn(self, command: str, fn: Callable):
        self.commands[command] = fn

    def __get_sv_init_val(self, key):
        return self.shared_values[key]

    def __start_static_server(self):
        os.chdir("./_internal/dist")

        handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("127.0.0.1", 9867), handler)

        th.Thread(target=httpd.serve_forever, daemon=True).start()

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

    def get_all(self, model: Model):
        return self.storage.get_all(model)

    def get(self, model: Model, model_id: int):
        return self.storage.get(model, model_id)

    # run app
    def run(self, debug=True):

        th.Thread(target=lambda: start_server(self.app, self.config), daemon=True).start()

        if MODE == "prod":
            self.__start_static_server()

        window = webview.create_window(
            title=self.config.WINDOW_TITLE,
            url=self.config.FRONT_URL,
            width=self.config.WINDOW_WIDTH,
            height=self.config.WINDOW_HEIGHT,
            resizable=self.config.WINDOW_RESIZABLE,
            fullscreen=self.config.WINDOW_FULLSCREEN
        )

        webview.start(debug=debug if MODE=="dev" else False)
