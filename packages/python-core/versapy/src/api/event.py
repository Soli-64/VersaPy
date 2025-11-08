
def command_name_valid(name):

    reserved_names = [
        "signal", "event", "signal_update"
    ]

    return not (name in reserved_names)
