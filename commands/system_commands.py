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
            'date': 'Show current date and time',
            'whoami': 'Print current user name',
            'hostname': 'Show system\'s host name',
            'env': 'Display environment variables',
            'clear': 'Clear terminal screen',
            'pwd': 'Print working directory',
            'help': 'Show this help message',
            'about': 'Show system information and documentation'  # Добавляем описание
        }
        
        return '\n'.join([f"{cmd}: {desc}" for cmd, desc in commands_help.items()])