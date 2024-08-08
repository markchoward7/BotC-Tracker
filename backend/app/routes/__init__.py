"""Routes."""

from flask import Blueprint

from .games import create_router as create_game_router
from .roles import create_router as create_role_router
from .scripts import create_router as create_script_router


def create_router() -> Blueprint:
    """Router factory."""
    router = Blueprint("api", __name__, url_prefix="/api")
    router.register_blueprint(create_game_router())
    router.register_blueprint(create_role_router())
    router.register_blueprint(create_script_router())
    return router
