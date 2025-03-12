from .base_command import Command
from .system_commands import (
    Date,
    Whoami,
    Hostname,
    Env,
    Clear,
    Help
)
from .file_commands import PWD, LS, CD, Cat  # Добавляем импорт из file_commands
from .editor_commands import Nano  # Добавляем импорт Nano
from .system_info import About

__all__ = [
    'Command',
    'Date', 
    'Whoami',
    'Hostname',
    'Env',
    'Clear',
    'Help',
    'PWD',
    'LS',
    'CD', 
    'Cat',
    'Nano',
    'About'
]