from datetime import datetime
from typing import Dict, List, Union

class VirtualFileSystem:
    def __init__(self):
        self.current_time = datetime.strptime("2025-03-08 14:13:12", "%Y-%m-%d %H:%M:%S")
        self.fs: Dict[str, Union[Dict, str]] = {
            '/': {
                'home': {
                    'user': {
                        'documents': {
                            'welcome.txt': 'Welcome to Virtual OS!\nThis is a sample text file.'
                        },
                        'downloads': {},
                        '.bashrc': 'export PATH="/usr/local/bin:$PATH"'
                    }
                },
                'usr': {
                    'local': {
                        'bin': {}
                    }
                },
                'etc': {
                    'passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash',
                    'hostname': 's1z1-balance-vos'
                }
            }
        }
        self.current_dir = ['/']
        self.env_vars = {
            'PATH': '/usr/local/bin:/usr/bin',
            'HOME': '/home/user',
            'USER': 's1z1-balance',
            'SHELL': '/bin/bash',
            'TERM': 'xterm-256color',
            'LANG': 'en_US.UTF-8',
            'PWD': '/',
            'LOGNAME': 's1z1-balance',
            'CURRENT_TIME': self.current_time.strftime("%Y-%m-%d %H:%M:%S")
        }

    def get_current_path(self) -> str:
        return '/'.join(self.current_dir) if len(self.current_dir) > 1 else '/'

    def resolve_path(self, path: str) -> List[str]:
        if not path:
            return self.current_dir.copy()
            
        if path.startswith('/'):
            resolved = ['']
            path = path[1:]
        else:
            resolved = self.current_dir.copy()

        if not path:
            return resolved

        parts = path.split('/')
        for part in parts:
            if part == '' or part == '.':
                continue
            elif part == '..':
                if len(resolved) > 1:
                    resolved.pop()
            else:
                resolved.append(part)
        
        return resolved

    def get_node(self, path_parts: List[str]) -> Union[Dict, str, None]:
        current = self.fs['/']
        for part in path_parts[1:]:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return None
        return current

    def update_env_pwd(self):
        self.env_vars['PWD'] = self.get_current_path()
        self.current_time = datetime.strptime("2025-03-08 14:13:12", "%Y-%m-%d %H:%M:%S")
        self.env_vars['CURRENT_TIME'] = self.current_time.strftime("%Y-%m-%d %H:%M:%S")