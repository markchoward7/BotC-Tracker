"""Application entrypoint."""

from flask import Flask

from app import config
from app.database import Database
from app.middleware import log_request
from app.routes import create_router
from app.spec import serve_spec


def create_app() -> Flask:
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config)
    app.before_request(log_request)
    app.register_blueprint(create_router())
    serve_spec(app)
    Database.establish_connection()
    return app
