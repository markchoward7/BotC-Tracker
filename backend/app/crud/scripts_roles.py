"""BaseCRUD extension and instance for ScriptsRoles relationship."""

import logging
from typing import Any, Dict, List, Sequence

from sqlalchemy import delete, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions import BotCIntegrityError
from app.models import Role, ScriptsRoles

from ._base import BaseCRUD
from .roles import roles_crud


class ScriptsRolesCRUD(BaseCRUD[ScriptsRoles]):
    """BaseCRUD extension and instance for ScriptsRole model."""

    def get_entities_for_script(
        self, session: Session, script_id: int
    ) -> Sequence[ScriptsRoles]:
        """Get entities with a given script id."""
        result = session.scalars(
            select(ScriptsRoles).where(ScriptsRoles.script_id == script_id)
        ).all()
        if result is None:
            raise BotCIntegrityError(
                "ScriptsRoles script_id", f"Invalid id: {script_id}"
            )
        return result

    @staticmethod
    def create_entity(session: Session, json: Dict[str, Any]) -> ScriptsRoles:
        """Insert script role mapping in database."""
        new_scripts_roles = ScriptsRoles(
            script_id=json["script_id"],
            role_id=json["role_id"],
            id=json.get("id", None),
        )

        try:
            session.add(new_scripts_roles)
            session.commit()
            session.refresh(new_scripts_roles)
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("script_id or role_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_scripts_roles

    @staticmethod
    def create_entities(
        session: Session, json: List[Dict[str, Any]]
    ) -> List[ScriptsRoles]:
        """Insert multiple script roll mappings in database."""
        new_scripts_roles = [
            ScriptsRoles(
                script_id=entry["script_id"],
                role_id=entry["role_id"],
                id=entry.get("id", None),
            )
            for entry in json
        ]

        try:
            session.add_all(new_scripts_roles)
            session.commit()
            session.execute(
                text(
                    "SELECT SETVAL('scripts_roles_id_seq', (SELECT MAX(id) FROM scripts_roles));"
                )
            )
            for scripts_roles in new_scripts_roles:
                session.refresh(scripts_roles)
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("script_id or role_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_scripts_roles

    def create_entities_for_script(
        self, session: Session, json: List[Dict[str, Any]], script_id: int
    ):
        """Insert multiple script role mappings for one script in database."""
        new_roles: List[Role] = [
            roles_crud.get_entity_by_name(session, entry["name"]) for entry in json
        ]
        new_script_roles = [
            ScriptsRoles(script_id=script_id, role_id=role.id, id=None)
            for role in new_roles
        ]
        new_script_role_ids = [role.id for role in new_roles]
        old_script_roles = self.get_entities_for_script(session, script_id)
        old_script_role_ids = [role.role.id for role in old_script_roles]
        roles_to_remove = [
            role for role in old_script_roles if role.role.id not in new_script_role_ids
        ]
        roles_to_add = [
            role for role in new_script_roles if role.role_id not in old_script_role_ids
        ]

        try:
            for new_script_role in roles_to_add:
                session.add(new_script_role)
            for old_script_role in roles_to_remove:
                session.execute(
                    delete(ScriptsRoles).where(ScriptsRoles.id == old_script_role.id)
                )
            session.commit()
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("script_id or role_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err


scripts_roles_crud = ScriptsRolesCRUD(ScriptsRoles)
