"""Script model."""

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from ._base import MetadataBase, ModelBase
from .scripts_roles import ScriptsRoles


class Script(MetadataBase, ModelBase):
    """Model class."""

    __tablename__ = "scripts"

    name: Mapped[str] = mapped_column(unique=True)
    roles: Mapped[List["ScriptsRoles"]] = relationship(
        default_factory=list, back_populates="script"
    )
