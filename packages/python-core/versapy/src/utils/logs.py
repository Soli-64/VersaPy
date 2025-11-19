

from typing import Any
from dataclasses import dataclass

class LogType:
    ERROR="error"
    WARNING="warning"
    INFO="info"
    SUCCESS="success"
    DEBUG="debug"

class LogFlags:
    VERSAPY="[VPY]"
    PYWEBVIEW="[WBV]"
    UVICORN="[UVI]"
    SIO="[SIO]"
    UNKNOWN="[?]"

class Log:

    TYPES = LogType()
    FLAGS = LogFlags()

    @staticmethod
    def custom(main_flag: str, sub_flag: str, _type: str, content: Any):
        """
            Custom log function: 
        """

        print(f"{main_flag} {_type} - {sub_flag}: {content}")
