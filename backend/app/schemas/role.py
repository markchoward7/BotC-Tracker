"""Schema for Role model."""

from marshmallow import fields

from app.models import RoleType

from ._base import SchemaBase


class RoleSchema(SchemaBase):
    """Schema for Role model."""

    name = fields.String()
    team = fields.Enum(RoleType, by_value=True, allow_none=True)
