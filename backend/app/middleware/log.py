"""Request logging middleware."""

import logging

from flask import request

from app.config import REQUEST_IP_HEADER


def log_request() -> None:
    """Log request info."""
    logging.info(f"{request.headers[REQUEST_IP_HEADER]} - {request.path}")
