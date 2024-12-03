import importlib
import pkgutil
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict

import typer


class BaseCommand(ABC):
    """Base class for all management commands"""

    name: str = ""
    help: str = ""

    @abstractmethod
    def handle(self, *args: Any, **options: Dict[str, Any]) -> None:
        """
        The actual logic of the command. This method must be implemented by
        all concrete command classes.
        """
        pass


class CommandRegistry:
    """Registry for storing and managing commands"""

    def __init__(self):
        self.commands = {}

    def register(self, command_class):
        """Register a new command"""
        command = command_class()
        self.commands[command.name] = command

    def get_command(self, name):
        """Get a command by name"""
        return self.commands.get(name)

    def list_commands(self):
        """List all registered commands"""
        return list(self.commands.keys())


def get_command_app(registry: CommandRegistry):
    """Create a new Typer app for a specific command"""
    app = typer.Typer()

    @app.callback()
    def callback():
        """Command description goes here"""
        pass

    return app


class ManagementUtility:
    """
    Main class for handling management commands
    """

    def __init__(self):
        self.registry = CommandRegistry()
        self.app = typer.Typer()
        self.load_commands()

    def load_commands(self):
        """Load all commands from the management/commands directory"""
        commands_dir = Path("management/commands")
        if not commands_dir.exists():
            return

        for module_info in pkgutil.iter_modules([str(commands_dir)]):
            module = importlib.import_module(f"management.commands.{module_info.name}")
            for item_name in dir(module):
                item = getattr(module, item_name)
                try:
                    if (isinstance(item, type) and
                            issubclass(item, BaseCommand) and
                            item != BaseCommand):
                        self.registry.register(item)
                except TypeError:
                    continue

    def setup_commands(self):
        """Set up Typer CLI commands"""
        for name, command in self.registry.commands.items():
            # Create a new Typer app for each command
            command_app = get_command_app(self.registry)

            @command_app.command(name="run")
            def run_command():
                command.handle()

            # Add the command app as a sub-command to the main app
            self.app.add_typer(command_app, name=command.name, help=command.help)

    def execute(self):
        """Execute the management command"""
        self.setup_commands()
        self.app()


def execute_from_command_line():
    """Entry point for running management commands"""
    utility = ManagementUtility()
    utility.execute()


if __name__ == "__main__":
    execute_from_command_line()
