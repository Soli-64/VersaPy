
import json, os, threading

class PreferencesStorage:
    """JSON file-based storage for basic key-value storage"""

    def __init__(self, project_name: str):
        self.project_name = project_name
        self._lock = threading.Lock()
        self._base_dir = os.path.join(os.path.expanduser("~"), ".versapy")
        os.makedirs(self._base_dir, exist_ok=True)
        self._file_path = os.path.join(self._base_dir, f"{self.project_name}.json")

    def _load(self) -> dict:
        if not os.path.exists(self._file_path):
            return {}
        with open(self._file_path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}

    def _save(self, data: dict):
        with self._lock:
            with open(self._file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

    def set(self, key: str, value):
        data = self._load()
        data[key] = value
        self._save(data)

    def get(self, key: str, default=None):
        data = self._load()
        return data.get(key, default)

    def delete(self, key: str):
        data = self._load()
        if key in data:
            del data[key]
            self._save(data)

    def list_keys(self):
        data = self._load()
        return list(data.keys())
