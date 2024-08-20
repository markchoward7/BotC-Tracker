"""Schema for Game model."""

from marshmallow import fields

from app.models import Alignment

from ._base import SchemaBase
from .games_roles import GamesRolesSchema


class GameSchema(SchemaBase):
    """Schema for Game model."""

    player_count = fields.Integer()
    date = fields.Date()
    is_in_person = fields.Boolean()
    notes = fields.String(allow_none=True)
    winning_team = fields.Enum(Alignment, by_value=True)
    script_id = fields.Integer()
    roles = fields.Pluck(GamesRolesSchema, "role", many=True, dump_only=True)
    drunk_saw_role_id = fields.Integer(allow_none=True)
