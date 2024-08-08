"""Application configuration."""

import os

DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASS = os.environ.get("DB_PASS", "postgres")
DB_HOST = os.environ.get("DB_HOST", "database")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ.get("DB_NAME", "postgres")

SWAGGER = {
    "openapi": os.environ.get("OPENAPI_VERSION", "3.0.2"),
    "static_url_path": "/api/flasgger_static",
}

REQUEST_IP_HEADER = os.environ.get("REQUEST_IP_HEADER", "X-Forwarded-For")
