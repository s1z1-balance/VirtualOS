from .base_command import Command
from .system_commands import (
    Date,
    Whoami,
    Hostname,
    Env,
    Clear,
    Help,
    PWD
)
from .system_info import About  # Добавляем импорт

__all__ = [
    'Command',
    'Date',
    'Whoami',
    'Hostname',
    'Env',
    'Clear',
    'Help',
    'PWD',
    'About'  # Добавляем в список
]