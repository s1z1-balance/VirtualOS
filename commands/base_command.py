from abc import ABC, abstractmethod
from typing import List

class Command(ABC):
    def __init__(self, fs, env):
        self.fs = fs
        self.env = env

    @abstractmethod
    def execute(self, args: List[str]) -> str:
        pass