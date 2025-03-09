from typing import Dict
import shlex
from commands import *
from .fs import VirtualFileSystem

class VirtualOS:
    def __init__(self):
        self.fs = VirtualFileSystem()
        self.commands = {
            'date': Date(self.fs, self.fs.env_vars),
            'whoami': Whoami(self.fs, self.fs.env_vars),
            'hostname': Hostname(self.fs, self.fs.env_vars),
            'env': Env(self.fs, self.fs.env_vars),
            'clear': Clear(self.fs, self.fs.env_vars),
            'help': Help(self.fs, self.fs.env_vars),
            'pwd': PWD(self.fs, self.fs.env_vars),
            'about': About(self.fs, self.fs.env_vars)  # Добавляем команду
        }

    def execute(self, command_line: str) -> str:
        try:
            args = shlex.split(command_line)
            if not args:
                return ''
            
            command = args[0].lower()
            if command in self.commands:
                return self.commands[command].execute(args[1:])
            else:
                return f"Command not found: {command}\nType 'help' for available commands."
        except Exception as e:
            return f"Error executing command: {str(e)}"