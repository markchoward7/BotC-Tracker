"""Game model."""

import enum
from datetime import datetime
from typing import List, Optional

from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ._base import MetadataBase, ModelBase
from .games_roles import GamesRoles


class Alignment(enum.Enum):
    """Enum for 'winning_team' field of Game."""

    EVIL = "EVIL"
    GOOD = "GOOD"


class Game(MetadataBase, ModelBase):
    """Model class."""

    __tablename__ = "games"

    player_count: Mapped[int]
    date: Mapped[datetime]
    is_in_person: Mapped[bool]
    notes: Mapped[Optional[str]]

    winning_team: Mapped[Alignment] = mapped_column(
        Enum(Alignment, create_constraint=True, name="alignment")
    )
    script_id: Mapped[int] = mapped_column(ForeignKey("scripts.id", ondelete="CASCADE"))
    roles: Mapped[List["GamesRoles"]] = relationship(
        default_factory=list, back_populates="game"
    )
