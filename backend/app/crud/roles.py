"""BaseCRUD extension and instance for Role model."""

import logging
from typing import Any, Dict, List

from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions import BotCIntegrityError
from app.models import Role

from ._base import BaseCRUD


class RolesCRUD(BaseCRUD[Role]):
    """BaseCRUD extension and instance for Role model."""

    def get_entity_by_name(self, session, name: str) -> Role:
        """Get role by name."""
        result = session.scalars(select(Role).where(Role.name == name)).first()
        if result is None:
            raise BotCIntegrityError("Role name", f"Invalid name: {name}")
        return result

    @staticmethod
    def create_entity(session: Session, json: Dict[str, Any]) -> Role:
        """Insert role in database."""
        new_role = Role(name=json["name"], team=json["team"], id=json.get("id", None))

        try:
            session.add(new_role)
            session.commit()
            session.refresh(new_role)
        except IntegrityError as err:
            if "psycopg2.errors.UniqueViolation" in str(err):
                raise BotCIntegrityError("name", "already in use") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_role

    @staticmethod
    def create_entities(session: Session, json: List[Dict[str, Any]]) -> List[Role]:
        """Insert multiple roles in database."""
        new_roles = [
            Role(name=entry["name"], team=entry["team"], id=entry["id"])
            for entry in json
        ]

        try:
            session.add_all(new_roles)
            session.commit()
            session.execute(
                text("SELECT SETVAL('roles_id_seq', (SELECT MAX(id) FROM roles));")
            )
            for role in new_roles:
                session.refresh(role)
        except IntegrityError as err:
            if "psycopg2.errors.UniqueViolation" in str(err):
                raise BotCIntegrityError("name", "duplicate detected") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_roles

    def update_entity(self, session: Session, json: Dict[str, Any], id_: int) -> Role:
        """Update role in database."""
        role: Role = self.get_entity(session, id_)
        role.name = json["name"]
        role.team = json["team"]

        try:
            session.add(role)
            session.commit()
            session.refresh(role)
        except IntegrityError as err:
            if "psycopg2.errors.UniqueViolation" in str(err):
                raise BotCIntegrityError("name", "already in use") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err

        return role


roles_crud = RolesCRUD(Role)
