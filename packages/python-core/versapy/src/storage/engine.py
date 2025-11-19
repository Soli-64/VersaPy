import sqlite3
import json
from ..utils.system import get_app_storage_path

class StorageEngine:
    
    def __init__(self, project_name):
        storage_path = get_app_storage_path()
        self.path = storage_path / f"{project_name}-storage.db"
        self.conn = sqlite3.connect(self.path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS models (
                model TEXT,
                data TEXT
            )
        """)
        self.conn.commit()

    def load(self, model_name):
        cur = self.conn.execute(
            "SELECT data FROM models WHERE model=?", (model_name,)
        )
        row = cur.fetchone()
        return json.loads(row[0]) if row else None

    def save(self, model_name, data):
        json_data = json.dumps(data)
        self.conn.execute(
            "REPLACE INTO models (model, data) VALUES (?, ?)",
            (model_name, json_data)
        )
        self.conn.commit()
