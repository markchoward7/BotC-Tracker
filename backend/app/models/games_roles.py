"""Games and Roles join table."""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ._base import MetadataBase, ModelBase

if TYPE_CHECKING:
    from .game import Game
    from .role import Role


class GamesRoles(MetadataBase, ModelBase):
    """Table for Games and Roles many-to-many relationship."""

    __tablename__ = "games_roles"

    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"))
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

    game: Mapped["Game"] = relationship(back_populates="roles", init=False)
    role: Mapped["Role"] = relationship(init=False)
