from pydantic import BaseModel
from typing import Optional
from enum import Enum

class MoveType(str, Enum):
    PHYSICAL = "physical"
    MAGIC = "magic"
    NONE = "none"

class EffectType(str, Enum):
    DAMAGE = "damage"
    HEAL = "heal"
    BUFF_ATTACK = "buff_attack"
    BUFF_DEFENSE = "buff_defense"
    BUFF_MAGIC = "buff_magic"
    DEBUFF_ATTACK = "debuff_attack"
    DEBUFF_DEFENSE = "debuff_defense"
    DEBUFF_MAGIC = "debuff_magic"
    DRAIN = "drain"  # damage + self heal

class Move(BaseModel):
    id: str
    name: str
    type: MoveType
    effect: EffectType
    base_value: int
    buff_duration: Optional[int] = None
    description: str

class MonsterConfig(BaseModel):
    id: str
    name: str
    health: int
    attack: int
    defense: int
    magic: int
    moves: list[Move]
    sprite: str  # ime fajla za sprite

class RunConfig(BaseModel):
    monsters: list[MonsterConfig]
    hero_default_moves: list[Move]
    hero_base_stats: dict

class ActiveEffect(BaseModel):
    stat: str
    modifier: float  # npr 1.3 = +30%, 0.7 = -30%
    turns_remaining: int

class CharacterState(BaseModel):
    id: str
    name: str
    current_hp: int
    max_hp: int
    attack: int
    defense: int
    magic: int
    active_effects: list[ActiveEffect] = []

class BattleStateRequest(BaseModel):
    monster_id: str
    hero: CharacterState
    monster: CharacterState
    turn_number: int