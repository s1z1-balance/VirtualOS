from typing import List
from .base_command import Command
from datetime import datetime

class About(Command):
    def execute(self, args: List[str]) -> str:
        # Стилизованный ASCII-арт логотип
        logo = """
\033[34m   _    ___      __            __   ____  _____ 
  | |  / (_)____/ /___  ____  / /  / __ \\/ ___/
  | | / / / ___/ __/ / / /_ \\/ /  / / / /\\__ \\ 
  | |/ / / /  / /_/ /_/ /__/ / /__/ /_/ /___/ / 
  |___/_/_/   \\__/\\__,_/____/_____\\____//____/  \033[0m
        \033[33mDeveloped by s1z1-balance\033[0m
"""
        # Базовые файлы документации
        docs = {
            'welcome.txt': 'Welcome to Virtual OS!\ndev: s1z1-balance, github: github.com/s1z1-balance',
            'virtualosforks.txt': 'Virtual OS is a simple virtual file system. You can fork it on GitHub. Good Luck!',
            'howtoaddyourcommands.txt': 'guide in dev/commands.md'
        }

        if not args:
            # Основная информация о системе
            system_info = [
                f"{logo}",
                f"\033[1mSystem Information\033[0m",
                f"╔══════════════════════════════════════",
                f"║ \033[1mVirtual OS\033[0m v1.0.0",
                f"║ Time: {self.env.get('CURRENT_TIME', '2025-03-09 08:32:14')} UTC",
                f"║ User: {self.env.get('USER', 's1z1-balance')}",
                f"║",
                f"║ \033[1mDocumentation\033[0m",
                f"║ /home/user/documents/welcome.txt",
                f"║ /home/user/documents/virtualosforks.txt",
                f"║ /home/user/documents/howtoaddyourcommands.txt",
                f"║",
                f"║ \033[1mRepository\033[0m",
                f"║ github.com/s1z1-balance/WebTerminal",
                f"╚══════════════════════════════════════",
                f"",
                f"Use '\033[1;32mabout help\033[0m' for more information"
            ]
            return "\n".join(system_info)

        elif args[0] == "help":
            help_info = [
                f"\033[1mAvailable Commands:\033[0m",
                f"  about         - Show system information",
                f"  about help    - Show this help message",
                f"  about docs    - Show documentation",
                f"  about time    - Show current time",
                f"  about version - Show version information"
            ]
            return "\n".join(help_info)

        elif args[0] == "docs":
            doc_info = [
                f"\033[1mDocumentation:\033[0m",
                f"═══════════════",
            ]
            for filename, content in docs.items():
                doc_info.append(f"\033[1m{filename}\033[0m")
                doc_info.append(f"{content}")
                doc_info.append("───────────────")
            return "\n".join(doc_info)

        elif args[0] == "time":
            return f"Current Time (UTC): {self.env.get('CURRENT_TIME', '2025-03-09 08:32:14')}"

        elif args[0] == "version":
            version_info = [
                f"\033[1mVirtual OS\033[0m v1.0.0",
                f"Built: March 2025",
                f"Developer: s1z1-balance",
                f"Repository: github.com/s1z1-balance/WebTerminal",
                f"",
                f"Languages:",
                f"- Python    (Backend)",
                f"- JavaScript (Frontend)",
                f"- HTML/CSS   (Interface)"
            ]
            return "\n".join(version_info)

        else:
            return f"Unknown argument: {args[0]}\nUse 'about help' for available commands"