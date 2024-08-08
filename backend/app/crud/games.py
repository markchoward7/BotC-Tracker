"""BaseCRUD extension and instance for Game model."""

import logging
from typing import Any, Dict, List

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.exceptions import BotCIntegrityError
from app.models import Game

from ._base import BaseCRUD


class GamesCRUD(BaseCRUD[Game]):
    """BaseCRUD extension and instance for Game model."""

    @staticmethod
    def create_entity(session: Session, json: Dict[str, Any]) -> Game:
        """Insert game in database."""
        new_game = Game(
            player_count=json["player_count"],
            date=json["date"],
            is_in_person=json["is_in_person"],
            notes=json["notes"],
            winning_team=json["winning_team"],
            script_id=json["script_id"],
            id=json.get("id", None),
        )

        try:
            session.add(new_game)
            session.commit()
            session.refresh(new_game)
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("script_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_game

    @staticmethod
    def create_entities(session: Session, json: List[Dict[str, Any]]) -> List[Game]:
        """Insert multiple games in database."""
        new_games = [
            Game(
                player_count=entry["player_count"],
                date=entry["date"],
                is_in_person=entry["is_in_person"],
                notes=entry["notes"],
                winning_team=entry["winning_team"],
                script_id=entry["script_id"],
                id=entry["id"],
            )
            for entry in json
        ]

        try:
            session.add_all(new_games)
            session.commit()
            session.execute(
                text("SELECT SETVAL('games_id_seq', (SELECT MAX(id) FROM games));")
            )
            for game in new_games:
                session.refresh(game)
        except IntegrityError as err:
            if "psycopg2.errors.UniqueViolation" in str(err):
                raise BotCIntegrityError("script_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err
        return new_games

    def update_entity(self, session: Session, json: Dict[str, Any], id_: int) -> Game:
        """Update game in database."""
        game: Game = self.get_entity(session, id_)
        game.player_count = json["player_count"]
        game.date = json["date"]
        game.is_in_person = json["is_in_person"]
        game.notes = json["notes"]
        game.winning_team = json["winning_team"]
        game.script_id = json["script_id"]

        try:
            session.add(game)
            session.commit()
            session.refresh(game)
        except IntegrityError as err:
            if "psycopg2.errors.ForeignKeyViolation" in str(err):
                raise BotCIntegrityError("script_id", "not found") from err
            logging.error(str(err))
            raise BotCIntegrityError("unknown", "unknown, see logs") from err

        return game


games_crud = GamesCRUD(Game)
