from datetime import datetime
from typing import List
from .base_command import Command
import pytz

class Date(Command):
    def execute(self, args: List[str]) -> str:
        timezone = pytz.timezone('Europe/Berlin')
        local_time = datetime.now(timezone)
        return local_time.strftime('%Y-%m-%d %H:%M:%S')

class Whoami(Command):
    def execute(self, args: List[str]) -> str:
        return self.env['USER']

class Hostname(Command):
    def execute(self, args: List[str]) -> str:
        return self.fs.get_node(['/','etc','hostname'])

class Env(Command):
    def execute(self, args: List[str]) -> str:
        return '\n'.join([f"{k}={v}" for k, v in self.env.items()])

class Clear(Command):
    def execute(self, args: List[str]) -> str:
        return '\x1B[2J\x1B[H'

class Help(Command):
    def execute(self, args: List[str]) -> str:
        commands_help = {
            'pwd': 'Print current working directory',
            'ls': 'List directory contents',
            'cd': 'Change directory',
            'echo': 'Display a message or variable',
            'cat': 'Show file contents',
            'mkdir': 'Create a new directory',
            'touch': 'Create a new empty file',
            'rm': 'Remove file or directory',
            'date': 'Show current date and time',
            'whoami': 'Print current user name',
            'hostname': 'Show system\'s host name',
            'env': 'Display environment variables',
            'nano': 'Text editor',
            'clear': 'Clear terminal screen',
            'help': 'Show this help message'
        }
        return '\n'.join([f"{cmd}: {desc}" for cmd, desc in commands_help.items()])