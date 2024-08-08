"""Role routes."""

from typing import Any, List, Mapping, Tuple, cast

from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from app.crud import roles_crud
from app.database import generate_session
from app.exceptions import BotCIntegrityError
from app.schemas import RoleSchema

schema = RoleSchema()


def list_roles() -> Tuple[Any, int]:
    """List roles route.

    ---
    get:
      description: List roles
      responses:
        200:
          description: List roles
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/Role'
    """
    with generate_session() as session:
        raw_roles = roles_crud.get_entities(session)
        roles = [schema.dump(role) for role in raw_roles]
    result = {"result": roles}
    return jsonify(result), 200


def create_role() -> Tuple[Any, int]:
    """Create role route.

    ---
    post:
      description: Create role
      requestBody:
        content:
          application/json:
            schema: RoleSchema
      responses:
        201:
          description: The role was successfully created
          content:
            application/json:
              schema: RoleSchema
        400:
          description: Failure due to invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
    """
    try:
        data = schema.load(cast(Mapping[str, Any], request.json))
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            raw_role = roles_crud.create_entity(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_role)
    return jsonify(result), 201


def create_role_bulk() -> Tuple[Any, int]:
    """Create multiple roles route.

    ---
    post:
      description: Create multiple roles
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Role'
      responses:
        201:
          description: The roles were successfully created
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/Role'
        400:
          description: Failure due to invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
    """
    try:
        data = schema.load(cast(List[Mapping[str, Any]], request.json), many=True)
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            raw_roles = roles_crud.create_entities(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_roles, many=True)
    return jsonify(result), 201


def get_role(role_id: str) -> Tuple[Any, int]:
    """Get role by id route.

    ---
    get:
      description: Get role
      parameters:
        - in: path
          name: role_id
          schema:
            type: integer
          required: true
          description: ID of the role
      responses:
        200:
          description: Get role
          content:
            application/json:
              schema: RoleSchema
        404:
          description: Role not found
    """
    with generate_session() as session:
        try:
            raw_role = roles_crud.get_entity(session, int(role_id))
        except BotCIntegrityError:
            return "Resource not found", 404
        result = schema.dump(raw_role)
    return jsonify(result), 200


def update_role(role_id: str) -> Tuple[Any, int]:
    """Update role route.

    ---
    put:
      description: Update role
      parameters:
        - in: path
          name: role_id
          schema:
            type: integer
          required: true
          description: ID of the role
      requestBody:
        content:
          application/json:
            schema: RoleSchema
      responses:
        200:
          description: The role was successfully updated
          content:
            application/json:
              schema: RoleSchema
        400:
          description: Failure due to an invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
    """
    try:
        data = schema.load(cast(Mapping[str, Any], request.json))
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            raw_role = roles_crud.update_entity(session, data, int(role_id))
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_role)
    return jsonify(result), 200


def delete_role(role_id: str) -> Tuple[Any, int]:
    """Delete role route.

    ---
    delete:
      description: Delete role
      parameters:
        - in: path
          name: role_id
          schema:
            type: integer
          required: true
          description: ID of the role
      responses:
        204:
          description: The role was successfully deleted
    """
    with generate_session() as session:
        roles_crud.delete_entity(session, int(role_id))
    return "", 204


def create_router() -> Blueprint:
    """Router factory."""
    router = Blueprint("roles", __name__, url_prefix="/roles")
    router.route("", methods=["GET"])(list_roles)
    router.route("", methods=["POST"])(create_role)
    router.route("/bulk", methods=["POST"])(create_role_bulk)
    router.route("/<role_id>", methods=["GET"])(get_role)
    router.route("/<role_id>", methods=["PUT"])(update_role)
    router.route("/<role_id>", methods=["DELETE"])(delete_role)
    return router
