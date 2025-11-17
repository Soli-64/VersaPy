

class SharedValue:

    def __init__(self, sio, key, init_value, edit_registry, get_on_registry):
        self.sio = sio
        self.key = key
        self.value = init_value
        self.edit_registry = edit_registry
        self.get_on_registry = get_on_registry

    def on_change(self):
        pass

    def get(self):
        return self.get_on_registry(self.key)

    async def set(self, value):
        self.value = value
        self.edit_registry(self.key, value)
        options = {"value_key": self.key, "value": value}
        print("Emit:", self.value)
        await self.sio.emit("back_update_shared_value", options)
        self.on_change(value)
