"""Schema for GamesRoles relationship."""

from marshmallow import fields

from ._base import SchemaBase


class GamesRolesSchema(SchemaBase):
    """Schema for GamesRoles relationship."""

    role_id = fields.Integer()
    game_id = fields.Integer()
    game = fields.Nested("GameSchema", exclude=("roles",))
    role = fields.Nested("RoleSchema")
