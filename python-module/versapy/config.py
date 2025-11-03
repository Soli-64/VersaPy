import json, os
from dataclasses import dataclass

@dataclass
class Config:
    PROJECT_NAME: str
    FRONT_URL: str
    BACK_HOST: str
    BACK_PORT: int
    WINDOW_TITLE: str
    WINDOW_WIDTH: int
    WINDOW_HEIGHT: int
    WINDOW_FULLSCREEN: bool
    WINDOW_RESIZABLE: bool

def handle_config(path):

    with open(path, "r") as f:
        config = json.load(f)
    
    PROJECT_NAME = config.get("project_name", "MyVersaPyProject")
    FRONT_URL = config.get("front_url", "http://localhost:5173")

    # BACK_HOST = os.getenv("BACK_HOST", "127.0.0.1")
    # BACK_PORT = os.getenv("BACK_PORT", 5000)
    BACK_HOST = config["backend"].get("host", "localhost")
    BACK_PORT = config["backend"].get("port", 5000)

    print(BACK_HOST, BACK_PORT)

    WINDOW_TITLE = config["window"].get("title", "My VersaPy App")
    WINDOW_WIDTH = config["window"].get("width", 1024)
    WINDOW_HEIGHT = config["window"].get("height", 768)
    WINDOW_FULLSCREEN = config["window"].get("fullscreen", False)
    WINDOW_RESIZABLE = config["window"].get("resizable", True)

    return Config(
        PROJECT_NAME=PROJECT_NAME,
        BACK_HOST=BACK_HOST,
        BACK_PORT=BACK_PORT,
        FRONT_URL=FRONT_URL,
        WINDOW_TITLE=WINDOW_TITLE,
        WINDOW_WIDTH=WINDOW_WIDTH,
        WINDOW_HEIGHT=WINDOW_HEIGHT,
        WINDOW_FULLSCREEN=WINDOW_FULLSCREEN,
        WINDOW_RESIZABLE=WINDOW_RESIZABLE,
    )
