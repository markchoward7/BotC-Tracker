"""BaseCRUD extension and instance for Script model."""

import logging
from typing import Any, Dict, List

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions import BotCIntegrityError
from app.models import Script

from ._base import BaseCRUD


class ScriptsCRUD(BaseCRUD[Script]):
    """BaseCRUD extension and instance for Script model."""

    @staticmethod
    def create_entity(session: Session, json: Dict[str, Any]) -> Script:
        """Insert script in database."""
        new_script = Script(name=json["name"], id=json.get("id", None))

        try:
            session.add(new_script)
            session.commit()
            session.refresh(new_script)
        except IntegrityError as err:
            if "psycopg2.errors.UniqueViolation" in str(err):
                raise BotCIntegrityError("name", "already in use") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_script

    @staticmethod
    def create_entities(session: Session, json: List[Dict[str, Any]]) -> List[Script]:
        """Insert multiple scripts in database."""
        new_scripts = [Script(name=entry["name"], id=entry["id"]) for entry in json]

        try:
            session.add_all(new_scripts)
            session.commit()
            session.execute(
                text("SELECT SETVAL('scripts_id_seq', (SELECT MAX(id) FROM scripts));")
            )
            for script in new_scripts:
                session.refresh(script)
        except IntegrityError as err:
            if "psycopg2.errors.UniqueViolation" in str(err):
                raise BotCIntegrityError("name", "duplicate detected") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_scripts

    def update_entity(self, session: Session, json: Dict[str, Any], id_: int) -> Script:
        """Update script in database."""
        script: Script = self.get_entity(session, id_)
        script.name = json["name"]

        try:
            session.add(script)
            session.commit()
            session.refresh(script)
        except IntegrityError as err:
            if "psycopg2.errors.UniqueViolation" in str(err):
                raise BotCIntegrityError("name", "already in use") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err

        return script


scripts_crud = ScriptsCRUD(Script)
