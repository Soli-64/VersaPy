

class SharedValue:

    def __init__(self, app, key, init_value):
        self.app = app
        self.sio = self.app.sio
        self.key = key
        self.value = init_value

    def on_change(self):
        pass

    def get(self):
        return self.app.shared_values[self.key]

    async def set(self, value):
        self.value = value
        self.app.shared_values[self.key] = self.value
        options = {"value_key": self.key, "value": value}
        await self.sio.emit("back_update_shared_value", options)
        self.on_change(value)
