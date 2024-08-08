"""Schema for Script model."""

from marshmallow import fields

from ._base import SchemaBase
from .scripts_roles import ScriptsRolesSchema


class ScriptSchema(SchemaBase):
    """Schema for Script model."""

    name = fields.String()
    roles = fields.Pluck(ScriptsRolesSchema, "role", many=True, dump_only=True)
