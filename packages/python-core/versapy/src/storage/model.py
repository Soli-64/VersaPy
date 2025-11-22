from pydantic import BaseModel

class Model(BaseModel):

    id: int | None = None

    class Config:
        arbitrary_types_allowed = True
        validate_assignment = True
        extra = "forbid"

    def __init__(self, app, _id=None, _config=None, **data):
        super().__init__(**data)
        print("Model __init__")
        if _id is not None:
            self.id = _id
        if _config is not None:
            return
        self._storage = app.storage
        self.__save()

    def update(self, **data):
        for key, value in data.items():
            setattr(self, key, value)
        self.__save()

    def __save(self):
        if self.id is None:
            self.id = self._storage._create(self)
        else:
            self._storage._save(self.id, self.model_dump())

    def delete(self):
        if self.id is not None:
            self._storage._delete(self.id)
            self.id = None
    