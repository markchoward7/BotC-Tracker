"""Role model."""

import enum

from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column

from ._base import MetadataBase, ModelBase


class RoleType(enum.Enum):
    """Enum for 'team' field of Role."""

    DEMON = "DEMON"
    MINION = "MINION"
    OUTSIDER = "OUTSIDER"
    TOWNSFOLK = "TOWNSFOLK"


class Role(MetadataBase, ModelBase):
    """Model class."""

    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(unique=True)
    team: Mapped[RoleType] = mapped_column(
        Enum(RoleType, create_constraint=True, name="roletype")
    )
