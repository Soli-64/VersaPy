
def command_name_valid(name):

    reserved_names = [
        "event", "back_update_shared_value", "back_update_shared_value", "shared_value_init"
    ]

    return not (name in reserved_names)
