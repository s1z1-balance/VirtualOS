from typing import List
from .base_command import Command

class Nano(Command):
    def __init__(self, fs, env):
        super().__init__(fs, env)
        self.editor_state = {
            'active': False,
            'current_file': None,
            'content': None
        }

    def execute(self, args: List[str]) -> str:
        if not args:
            return "Usage: nano <filename>"
        
        filename = args[0]
        path_parts = self.fs.resolve_path(filename)
        parent_parts = path_parts[:-1]
        file_name = path_parts[-1]
        
        parent = self.fs.get_node(parent_parts)
        
        if parent is None:
            return f"nano: directory '{'/'.join(parent_parts)}' does not exist"
        elif not isinstance(parent, dict):
            return f"nano: '{'/'.join(parent_parts)}' is not a directory"
        
        current_content = ''
        if file_name in parent:
            if isinstance(parent[file_name], dict):
                return f"nano: '{filename}' is a directory"
            current_content = parent[file_name]
        
        self.editor_state = {
            'active': True,
            'current_file': filename,
            'content': current_content
        }
        
        return f"NANO_OPEN|{filename}|{current_content}"

    def save_file(self, filename: str, content: str) -> str:
        try:
            path_parts = self.fs.resolve_path(filename)
            parent_parts = path_parts[:-1]
            file_name = path_parts[-1]
            
            parent = self.fs.get_node(parent_parts)
            if parent is None or not isinstance(parent, dict):
                return "Error: Invalid path"
            
            parent[file_name] = content
            self.editor_state = {
                'active': False,
                'current_file': None,
                'content': None
            }
            return "File saved successfully"
        except Exception as e:
            return f"Error saving file: {str(e)}"