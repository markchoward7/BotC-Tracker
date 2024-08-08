"""Script routes."""

from typing import Any, List, Mapping, Tuple, cast

from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from app.crud import scripts_crud, scripts_roles_crud
from app.database import generate_session
from app.exceptions import BotCIntegrityError
from app.schemas import RoleSchema, ScriptSchema, ScriptsRolesSchema

schema = ScriptSchema()
role_schema = RoleSchema()
scripts_roles_schema = ScriptsRolesSchema()


def list_scripts() -> Tuple[Any, int]:
    """List scripts route.

    ---
    get:
      description: List scripts
      responses:
        200:
          description: List scripts
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/Script'
    """
    with generate_session() as session:
        raw_scripts = scripts_crud.get_entities(session)
        scripts = [schema.dump(script) for script in raw_scripts]
    result = {"result": scripts}
    return jsonify(result), 200


def create_script() -> Tuple[Any, int]:
    """Create script route.

    ---
    post:
      description: Create script
      requestBody:
        content:
          application/json:
            schema: ScriptSchema
      responses:
        201:
          description: The script was successfully created
          content:
            application/json:
              schema: ScriptSchema
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
            raw_script = scripts_crud.create_entity(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_script)
    return jsonify(result), 201


def create_script_bulk() -> Tuple[Any, int]:
    """Create multiple scripts route.

    ---
    post:
      description: Create multiple scripts
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Script'
      responses:
        201:
          description: The scripts were successfully created
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/Script'
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
            raw_scripts = scripts_crud.create_entities(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_scripts, many=True)
    return jsonify(result), 201


def get_script(script_id: str) -> Tuple[Any, int]:
    """Get script by id route.

    ---
    get:
      description: Get script
      parameters:
        - in: path
          name: script_id
          schema:
            type: integer
          required: true
          description: ID of the script
      responses:
        200:
          description: Get script
          content:
            application/json:
              schema: ScriptSchema
        404:
          description: Script not found
    """
    with generate_session() as session:
        try:
            raw_script = scripts_crud.get_entity(session, int(script_id))
        except BotCIntegrityError:
            return "Resource not found", 404
        result = schema.dump(raw_script)
    return jsonify(result), 200


def update_script(script_id: str) -> Tuple[Any, int]:
    """Update script route.

    ---
    put:
      description: Update script
      parameters:
        - in: path
          name: script_id
          schema:
            type: integer
          required: true
          description: ID of the script
      requestBody:
        content:
          application/json:
            schema: ScriptSchema
      responses:
        200:
          description: The script was successfully updated
          content:
            application/json:
              schema: ScriptSchema
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
            raw_script = scripts_crud.update_entity(session, data, int(script_id))
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_script)
    return jsonify(result), 200


def delete_script(script_id: str) -> Tuple[Any, int]:
    """Delete script route.

    ---
    delete:
      description: Delete script
      parameters:
        - in: path
          name: script_id
          schema:
            type: integer
          required: true
          description: ID of the script
      responses:
        204:
          description: The script was successfully deleted
    """
    with generate_session() as session:
        scripts_crud.delete_entity(session, int(script_id))
    return "", 204


def create_scripts_roles() -> Tuple[Any, int]:
    """Create role mapping for script route.

    ---
    post:
      description: Create role used in scripts
      requestBody:
        content:
          application/json:
            schema: ScriptsRolesSchema
      responses:
        201:
          description: The script role was successfully created
          content:
            application/json:
              schema: ScriptsRolesSchema
        400:
          description: Failure due to invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
    """
    try:
        data = scripts_roles_schema.load(cast(Mapping[str, Any], request.json))
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            raw_scripts_roles = scripts_roles_crud.create_entity(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_scripts_roles)
    return jsonify(result), 201


def create_scripts_roles_bulk() -> Tuple[Any, int]:
    """Create role mappings for multiple scripts route.

    ---
    post:
      description: Bulk create roles used in scripts
      reqestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schema/ScriptsRoles'
      responses:
        201:
          description: The script roles were successfully created
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/ScriptsRoles'
        400:
          description: Failure due to invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
    """
    try:
        data = scripts_roles_schema.load(
            cast(List[Mapping[str, Any]], request.json), many=True
        )
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            raw_scripts_roles = scripts_roles_crud.create_entities(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_scripts_roles, many=True)
    return jsonify({"result": result}), 201


def set_script_roles(script_id: str) -> Tuple[Any, int]:
    """Set roles for script route.

    ---
    post:
      description: Set the roles used in a script
      parameters:
        - in: path
          name: script_id
          schema:
            type: integer
          required: true
          description: ID of the script
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Role'
      responses:
        200:
          description: The script roles were successfully set
          content:
            application/json:
              schema: ScriptSchema
        400:
          description: Failure due to an invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
        404:
          description: Script not found
    """
    try:
        data = role_schema.load(cast(List[Mapping[str, Any]], request.json), many=True)
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            scripts_roles_crud.create_entities_for_script(session, data, int(script_id))
        except BotCIntegrityError as err:
            return err.messages, 400
        try:
            raw_script = scripts_crud.get_entity(session, int(script_id))
        except BotCIntegrityError:
            return "Resource not found", 404
        result = schema.dump(raw_script)
    return jsonify(result), 200


def create_router() -> Blueprint:
    """Router factory."""
    router = Blueprint("scripts", __name__, url_prefix="/scripts")
    router.route("", methods=["GET"])(list_scripts)
    router.route("", methods=["POST"])(create_script)
    router.route("/bulk", methods=["POST"])(create_script_bulk)
    router.route("/roles", methods=["POST"])(create_scripts_roles)
    router.route("/roles/bulk", methods=["POST"])(create_scripts_roles_bulk)
    router.route("/<script_id>", methods=["GET"])(get_script)
    router.route("/<script_id>", methods=["PUT"])(update_script)
    router.route("/<script_id>", methods=["DELETE"])(delete_script)
    router.route("/<script_id>/roles", methods=["POST"])(set_script_roles)
    return router
