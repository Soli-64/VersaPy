import os
import sys
from pathlib import Path

def get_app_storage_path():
    """
    Returns the application storage path depending on the OS.
    """
    if sys.platform == "win32":
        path = Path(os.environ["APPDATA"]) / "VersaPy"
    else:
        path = Path.home() / ".versapy"
    
    if not path.exists():
        path.mkdir(parents=True)
        
    return path
