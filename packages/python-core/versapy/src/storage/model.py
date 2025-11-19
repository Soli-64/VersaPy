from pydantic import BaseModel
from .field import Field

class Model(BaseModel):

    class Config:
        arbitrary_types_allowed = True
        validate_assignment = True
        extra = "forbid"

    @classmethod
    def __load(cls, storage_engine):
        data = storage_engine.load(cls.__name__)

        if data is None:
            defaults = {}
            for k, field in cls.__annotations__.items():
                attr = getattr(cls, k, None)
                if isinstance(attr, Field):
                    defaults[k] = attr.default
            return cls(**defaults)

        return cls(**data)

    def __save(self, storage_engine):
        storage_engine.save(self.__class__.__name__, self.dict())
        