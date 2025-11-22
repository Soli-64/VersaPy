import sqlite3
import json
from .model import Model
from ..utils.system import get_app_storage_path

class StorageEngine:
    
    def __init__(self, app, project_name):
        storage_path = get_app_storage_path(project_name)
        self.app = app
        self.path = storage_path / f"{project_name}-storage.db"
        try:
            self.conn = sqlite3.connect(
                self.path,
                check_same_thread=False,
                timeout=10.0
                )
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
        except sqlite3.Error as e:
            print(f"Error initializing StorageEngine: {e}")
            self.conn = None
    
    def get_all(self, model_instance: Model) -> list[Model]:
        if not self.conn:
            return []
        name = model_instance(self.app, _config=True).__class__.__name__
        try:
            models = [
                model_instance(self.app, _id=r[0], **json.loads(r[1])) 
                for r in self.conn.execute(
                    "SELECT id, data FROM models WHERE model=?", (name,)
                ).fetchall()
            ]
            return models
        except sqlite3.Error as e:
            print(f"Error getting all models: {e}")
            return []

    def get(self, model_instance: Model, model_id: int) -> Model | None:
        if not self.conn:
            return None
        try:
            cur = self.conn.execute(
                "SELECT data FROM models WHERE id=?", (model_id,)
            )
            row = cur.fetchone()
            if not row:
                return None
            return model_instance(self.app, _id=model_id, **json.loads(row[0]))
        except sqlite3.Error as e:
            print(f"Error getting model by ID: {e}")
            return None
    
    def _create(self, model_instance: Model):
        if not self.conn:
            return None
        print("Model created")
        model_name = model_instance.__class__.__name__
        json_data = json.dumps(model_instance.model_dump())
        try:
            cur = self.conn.execute(
                "INSERT INTO models (model, data) VALUES (?, ?)",
                (model_name, json_data)
            )
            self.conn.commit()
            model_instance.id = cur.lastrowid
            return model_instance.id
        except sqlite3.Error as e:
            print(f"Error creating model: {e}")
            return None

    def _save(self, model_id, data):
        if not self.conn:
            return
        json_data = json.dumps(data)
        try:
            self.conn.execute(
                "UPDATE models SET data=? WHERE id=?",
                (json_data, model_id)
            )
            self.conn.commit()
        except sqlite3.Error as e:
            print(f"Error saving model: {e}")

    def _delete(self, model_id):
        if not self.conn:
            return
        try:
            self.conn.execute(
                "DELETE FROM models WHERE id=?", (model_id,)
            )
            self.conn.commit()
        except sqlite3.Error as e:
            print(f"Error deleting model: {e}")
