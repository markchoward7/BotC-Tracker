"""Game routes."""

from typing import Any, List, Mapping, Tuple, cast

from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from app.crud import games_crud, games_roles_crud
from app.database import generate_session
from app.exceptions import BotCIntegrityError
from app.schemas import GameSchema, GamesRolesSchema, RoleSchema

schema = GameSchema()
role_schema = RoleSchema()
games_roles_schema = GamesRolesSchema()


def list_games() -> Tuple[Any, int]:
    """List games route.

    ---
    get:
      description: List games
      responses:
        200:
          description: List games
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/Game'
    """
    with generate_session() as session:
        raw_games = games_crud.get_entities(session)
        games = [schema.dump(game) for game in raw_games]
    result = {"result": games}
    return jsonify(result), 200


def create_game() -> Tuple[Any, int]:
    """Create game route.

    ---
    post:
      description: Create game
      requestBody:
        content:
          application/json:
            schema: GameSchema
      responses:
        201:
          description: The game was successfully created
          content:
            application/json:
              schema: GameSchema
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
            raw_game = games_crud.create_entity(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_game)
    return jsonify(result), 201


def create_game_bulk() -> Tuple[Any, int]:
    """Create multiple games route.

    ---
    post:
      description: Create multiple games
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Game'
      responses:
        201:
          description: The games were successfully created
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/Game'
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
            raw_games = games_crud.create_entities(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_games, many=True)
    return jsonify({"result": result}), 201


def get_game(game_id: str) -> Tuple[Any, int]:
    """Get game by id route.

    ---
    get:
      description: Get game
      parameters:
        - in: path
          name: game_id
          schema:
            type: integer
          required: true
          description: ID of the game
      responses:
        200:
          description: Get game
          content:
            application/json:
              schema: GameSchema
        404:
          description: Game not found
    """
    with generate_session() as session:
        try:
            raw_game = games_crud.get_entity(session, int(game_id))
        except BotCIntegrityError:
            return "Resource not found", 404
        result = schema.dump(raw_game)
    return jsonify(result), 200


def update_game(game_id: str) -> Tuple[Any, int]:
    """Update game route.

    ---
    put:
      description: Update game
      parameters:
        - in: path
          name: game_id
          schema:
            type: integer
          required: true
          description: ID of the game
      requestBody:
        content:
          application/json:
            schema: GameSchema
      responses:
        200:
          description: The game was successfully updated
          content:
            application/json:
              schema: GameSchema
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
            raw_game = games_crud.update_entity(session, data, int(game_id))
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_game)
    return jsonify(result), 200


def delete_game(game_id: str) -> Tuple[Any, int]:
    """Delete game route.

    ---
    delete:
      description: Delete game
      parameters:
        - in: path
          name: game_id
          schema:
            type: integer
          required: true
          description: ID of the game
      responses:
        204:
          description: The game was successfully deleted
    """
    with generate_session() as session:
        games_crud.delete_entity(session, int(game_id))
    return "", 204


def create_games_roles() -> Tuple[Any, int]:
    """Create role mapping for game route.

    ---
    post:
      description: Create role used in games
      requestBody:
        content:
          application/json:
            schema: GamesRolesSchema
      responses:
        201:
          description: The game role was successfully created
          content:
            application/json:
              schema: GamesRolesSchema
        400:
          description: Failure due to invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
    """
    try:
        data = games_roles_schema.load(cast(Mapping[str, Any], request.json))
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            raw_games_roles = games_roles_crud.create_entity(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_games_roles)
    return jsonify(result), 201


def create_games_roles_bulk() -> Tuple[Any, int]:
    """Create role mappings for multiple games route.

    ---
    post:
      description: Bulk create roles used in games
      reqestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schema/GamesRoles'
      responses:
        201:
          description: The game roles were successfully created
          content:
            application/json:
              schema:
                properties:
                  result:
                    type: array
                    items:
                      $ref: '#/components/schemas/GamesRoles'
        400:
          description: Failure due to invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
    """
    try:
        data = games_roles_schema.load(
            cast(List[Mapping[str, Any]], request.json), many=True
        )
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            raw_games_roles = games_roles_crud.create_entities(session, data)
        except BotCIntegrityError as err:
            return err.messages, 400
        result = schema.dump(raw_games_roles, many=True)
    return jsonify({"result": result}), 201


def set_game_roles(game_id: str) -> Tuple[Any, int]:
    """Set roles for game route.

    ---
    post:
      description: Set the roles used in a game
      parameters:
        - in: path
          name: game_id
          schema:
            type: integer
          required: true
          description: ID of the game
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Role'
      responses:
        200:
          description: The games roles were successfully set
          content:
            application/json:
              schema: GameSchema
        400:
          description: Failure due to an invalid request
          content:
            application/json:
              schema: ValidationErrorSchema
        404:
          description: Game not found
    """
    try:
        data = role_schema.load(cast(List[Mapping[str, Any]], request.json), many=True)
    except ValidationError as err:
        return err.messages, 400
    with generate_session() as session:
        try:
            games_roles_crud.create_entities_for_game(session, data, int(game_id))
        except BotCIntegrityError as err:
            return err.messages, 400
        try:
            raw_game = games_crud.get_entity(session, int(game_id))
        except BotCIntegrityError:
            return "Resource not found", 404
        result = schema.dump(raw_game)
    return jsonify(result), 200


def create_router() -> Blueprint:
    """Router factory."""
    router = Blueprint("games", __name__, url_prefix="/games")
    router.route("", methods=["GET"])(list_games)
    router.route("", methods=["POST"])(create_game)
    router.route("/bulk", methods=["POST"])(create_game_bulk)
    router.route("/roles", methods=["POST"])(create_games_roles)
    router.route("/roles/bulk", methods=["POST"])(create_games_roles_bulk)
    router.route("/<game_id>", methods=["GET"])(get_game)
    router.route("/<game_id>", methods=["PUT"])(update_game)
    router.route("/<game_id>", methods=["DELETE"])(delete_game)
    router.route("/<game_id>/roles", methods=["POST"])(set_game_roles)
    return router
