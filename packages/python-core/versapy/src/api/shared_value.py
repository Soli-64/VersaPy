

class SharedValue:

    def __init__(self, sio, key, init_value, edit_registry):
        self.sio = sio
        self.key = key
        self.value = init_value
        self.edit_registry = edit_registry

    def register_sio(self):
        @self.sio.on("front_update_share_value")
        def change(options):
            if options.get("value_key") != self.key:
                    return
            self.value = options["value"]
            self.edit_registry(self.key, self.value)
            self.on_change()
            print("Received:", self.value)

    def on_change(self):
        pass

    def set_change(self, value):
        self.value = value
        self.edit_registry(self.key, value)
        options = {"value_key": self.key, "value": value}
        print("Emit:", self.value)
        self.sio.emit("back_update_shared_value", options)
        self.on_change()


