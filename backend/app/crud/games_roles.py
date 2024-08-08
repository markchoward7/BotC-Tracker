"""BaseCRUD extension and instance for GamesRoles relationship."""

import logging
from typing import Any, Dict, List, Sequence

from sqlalchemy import delete, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions import BotCIntegrityError
from app.models import GamesRoles, Role

from ._base import BaseCRUD
from .roles import roles_crud


class GamesRolesCRUD(BaseCRUD[GamesRoles]):
    """BaseCRUD extension and instance for GamesRole model."""

    def get_entities_for_game(
        self, session: Session, game_id: int
    ) -> Sequence[GamesRoles]:
        """Get entities with a given game id."""
        result = session.scalars(
            select(GamesRoles).where(GamesRoles.game_id == game_id)
        ).all()
        if result is None:
            raise BotCIntegrityError("GamesRoles game_id", f"Invalid id: {game_id}")
        return result

    @staticmethod
    def create_entity(session: Session, json: Dict[str, Any]) -> GamesRoles:
        """Insert game role mapping in database."""
        new_games_roles = GamesRoles(
            game_id=json["game_id"], role_id=json["role_id"], id=json.get("id", None)
        )

        try:
            session.add(new_games_roles)
            session.commit()
            session.refresh(new_games_roles)
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("game_id or role_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_games_roles

    @staticmethod
    def create_entities(
        session: Session, json: List[Dict[str, Any]]
    ) -> List[GamesRoles]:
        """Insert multiple game role mappings in database."""
        new_games_roles = [
            GamesRoles(
                game_id=entry["game_id"],
                role_id=entry["role_id"],
                id=entry.get("id", None),
            )
            for entry in json
        ]

        try:
            session.add_all(new_games_roles)
            session.commit()
            session.execute(
                text(
                    "SELECT SETVAL('games_roles_id_seq', (SELECT MAX(id) FROM games_roles));"
                )
            )
            for games_roles in new_games_roles:
                session.refresh(games_roles)
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("game_id or role_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_games_roles

    def create_entities_for_game(
        self, session: Session, json: Sequence[Dict[str, Any]], game_id: int
    ):
        """Insert multiple game role mappings for one game in database."""
        new_roles: List[Role] = [
            roles_crud.get_entity_by_name(session, entry["name"]) for entry in json
        ]
        new_game_roles = [
            GamesRoles(game_id=game_id, role_id=role.id, id=None) for role in new_roles
        ]
        new_game_roles_ids = [role.id for role in new_roles]
        old_game_roles = self.get_entities_for_game(session, game_id)
        old_game_role_ids = [role.role.id for role in old_game_roles]
        roles_to_remove = [
            role for role in old_game_roles if role.role.id not in new_game_roles_ids
        ]
        roles_to_add = [
            role for role in new_game_roles if role.role_id not in old_game_role_ids
        ]

        try:
            for new_game_role in roles_to_add:
                session.add(new_game_role)
            for old_game_role in roles_to_remove:
                session.execute(
                    delete(GamesRoles).where(GamesRoles.id == old_game_role.id)
                )
            session.commit()
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("game_id or role_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err


games_roles_crud = GamesRolesCRUD(GamesRoles)
