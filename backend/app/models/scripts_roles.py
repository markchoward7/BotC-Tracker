"""Scripts and Roles join table."""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ._base import MetadataBase, ModelBase

if TYPE_CHECKING:
    from .role import Role
    from .script import Script


class ScriptsRoles(MetadataBase, ModelBase):
    """Table for Scripts and Roles many-to-many relationship."""

    __tablename__ = "scripts_roles"

    script_id: Mapped[int] = mapped_column(ForeignKey("scripts.id"))
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

    script: Mapped["Script"] = relationship(back_populates="roles", init=False)
    role: Mapped["Role"] = relationship(init=False)
