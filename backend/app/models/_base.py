"""Base classes for migration metadata and model inheritance."""

from sqlalchemy.orm import DeclarativeBase, Mapped, MappedAsDataclass, mapped_column
from sqlalchemy.sql.expression import func


def on_update():
    """Handle on update timestamp.

    Separate function due to oddities in pylint and sqlalchemy.
    """
    # false positive
    # pylint: disable-next=not-callable
    return func.current_timestamp()


class MetadataBase(DeclarativeBase):
    """Class to hold model metadata."""


class ModelBase(MappedAsDataclass, kw_only=True):
    """Class for model inheritance."""

    id: Mapped[int] = mapped_column(primary_key=True)
