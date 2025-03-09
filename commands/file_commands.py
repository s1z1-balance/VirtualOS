from typing import List
from .base_command import Command

def get_basename(path: str) -> str:
    return path.split('/')[-1]

class PWD(Command):
    def execute(self, args: List[str]) -> str:
        return self.fs.get_current_path()

class LS(Command):
    def execute(self, args: List[str]) -> str:
        path = args[0] if args else self.fs.get_current_path()
        path_parts = self.fs.resolve_path(path)
        node = self.fs.get_node(path_parts)
        
        if node is None:
            return f"ls: cannot access '{path}': No such file or directory"
        elif isinstance(node, str):
            return get_basename(path)  # Используем собственную функцию
        else:
            files = sorted(node.keys())
            formatted_files = []
            for f in files:
                if isinstance(node[f], dict):
                    formatted_files.append(f"\033[1;34m{f}/\033[0m")
                elif f.startswith('.'):
                    formatted_files.append(f"\033[1;37m{f}\033[0m")
                else:
                    formatted_files.append(f)
            return "  ".join(formatted_files)

class CD(Command):
    def execute(self, args: List[str]) -> str:
        if not args:
            self.fs.current_dir = self.fs.resolve_path(self.fs.env_vars['HOME'])
            self.fs.update_env_pwd()
            return ''
        
        new_path = args[0]
        resolved_path = self.fs.resolve_path(new_path)
        node = self.fs.get_node(resolved_path)
        
        if node is None:
            return f"cd: no such directory: {new_path}"
        elif isinstance(node, str):
            return f"cd: not a directory: {new_path}"
        else:
            self.fs.current_dir = resolved_path
            self.fs.update_env_pwd()
            return ''

class Cat(Command):
    def execute(self, args: List[str]) -> str:
        if not args:
            return "Usage: cat <filename>"
        
        outputs = []
        for path in args:
            path_parts = self.fs.resolve_path(path)
            node = self.fs.get_node(path_parts)
            
            if node is None:
                outputs.append(f"cat: {path}: No such file or directory")
            elif isinstance(node, dict):
                outputs.append(f"cat: {path}: Is a directory")
            else:
                outputs.append(node)
        
        return '\n'.join(outputs)