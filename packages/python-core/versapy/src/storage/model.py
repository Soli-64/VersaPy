from pydantic import BaseModel
from .engine import engine
from .field import Field

class Model(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        validate_assignment = True  # re-valide quand on change un champ
        extra = "forbid"

    @classmethod
    def load(cls):
        """Charge depuis la DB ou crée un modèle avec valeurs par défaut."""
        data = engine.load(cls.__name__)

        if data is None:
            # fabrication des defaults
            defaults = {}
            for k, field in cls.__annotations__.items():
                attr = getattr(cls, k, None)
                if isinstance(attr, Field):
                    defaults[k] = attr.default
            return cls(**defaults)

        return cls(**data)

    def save(self):
        """Sauvegarde dans la DB."""
        engine.save(self.__class__.__name__, self.dict())