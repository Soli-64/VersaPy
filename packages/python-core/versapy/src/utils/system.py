import os
import sys
from pathlib import Path

def get_app_storage_path(prj_name: str) -> Path:
    """
    Returns the application storage path depending on the OS.
    """
    if sys.platform == "win32":
        path = Path(os.environ["APPDATA"]) / prj_name
    else:
        path = Path.home() / f".{prj_name}"
    
    if not path.exists():
        path.mkdir(parents=True)
        
    return path
