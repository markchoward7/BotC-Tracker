"""API Spec."""

from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin
from flasgger import APISpec, Swagger
from flask import Flask


def serve_spec(app: Flask):
    """Generate and serve the API spec."""
    spec = APISpec(
        title="Holocron",
        version="0.1",
        openapi_version=app.config["SWAGGER"]["openapi"],
        plugins=[
            FlaskPlugin(),
            MarshmallowPlugin(),
        ],
    )

    with app.test_request_context():
        for rule in app.url_map.iter_rules():
            spec.path(view=app.view_functions[rule.endpoint])

    template = spec.to_flasgger(
        app,
    )
    swagger_config = {
        "headers": [],
        "specs_route": "/api",
        "endpoint": "flasgger",
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json",
                "model_filter": lambda tag: True,
            }
        ],
    }
    Swagger(
        app,
        template=template,
        config=swagger_config,
    )
