"""Schema for ScriptsRoles relationship."""

from marshmallow import fields

from ._base import SchemaBase


class ScriptsRolesSchema(SchemaBase):
    """Schema for ScriptsRoles relationship."""

    role_id = fields.Integer()
    script_id = fields.Integer()
    script = fields.Nested("ScriptSchema", exclude=("roles",))
    role = fields.Nested("RoleSchema")
