import sqlite3
import json
from .model import Model
from ..utils.system import get_app_storage_path

class StorageEngine:
    
    def __init__(self, app, project_name):
        storage_path = get_app_storage_path(project_name)
        self.app = app
        self.path = storage_path / f"{project_name}-storage.db"
        self.conn = sqlite3.connect(self.path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS models (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model TEXT NOT NULL,
                data TEXT NOT NULL,
                created_at TEXT,
                updated_at TEXT
            )
        """)
        self.conn.commit()
    
    def get_all(self, model_instance: Model) -> list[Model]:
        name = model_instance(self.app, _config=True).__class__.__name__
        print(name)
        models = [
            model_instance(self.app, _id=r[0], **json.loads(r[1])) 
            for r in self.conn.execute(
                "SELECT id, data FROM models WHERE model=?", (name,)
            ).fetchall()
        ]
        return models

    def get(self, model_id):
        cur = self.conn.execute(
            "SELECT data FROM models WHERE id=?", (model_id,)
        )
        row = cur.fetchone()
        return json.loads(row[0]) if row else None
    
    def _create(self, model_instance: Model):
        print("Model created")
        model_name = model_instance.__class__.__name__
        json_data = json.dumps(model_instance.model_dump())
        cur = self.conn.execute(
            "INSERT INTO models (model, data) VALUES (?, ?)",
            (model_name, json_data)
        )
        self.conn.commit()
        model_instance.id = cur.lastrowid
        return model_instance.id

    def _save(self, model_id, data):
        json_data = json.dumps(data)
        self.conn.execute(
            "UPDATE models SET data=? WHERE id=?",
            (json_data, model_id)
        )
        self.conn.commit()
