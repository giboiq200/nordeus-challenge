import random
from models import Move, MoveType, EffectType, CharacterState, ActiveEffect
from game_config import LEVEL_UP_STATS

# ============================================================
# BUFF / DEBUFF MULTIPLIKATORI
# ============================================================

BUFF_MULTIPLIER = 1.3    # +30% stat
DEBUFF_MULTIPLIER = 0.7  # -30% stat
DARK_PACT_HP_COST = 15   # koliko HP košta Dark Pact

# ============================================================
# HELPER - efektivni stat (uzima u obzir aktivne efekte)
# ============================================================

def get_effective_stat(character: CharacterState, stat: str) -> float:
    base = getattr(character, stat)
    multiplier = 1.0
    for effect in character.active_effects:
        if effect.stat == stat:
            multiplier *= effect.modifier
    return base * multiplier

# ============================================================
# DAMAGE FORMULA
# ============================================================

def calculate_damage(move: Move, attacker: CharacterState, defender: CharacterState) -> int:
    if move.type == MoveType.PHYSICAL:
        attack = get_effective_stat(attacker, "attack")
        defense = get_effective_stat(defender, "defense")
        damage = (attack / 100) * move.base_value * 2
        damage = damage * (100 / (100 + defense))
        return max(1, int(damage))

    elif move.type == MoveType.MAGIC:
        magic = get_effective_stat(attacker, "magic")
        damage = (magic / 100) * move.base_value * 2
        return max(1, int(damage))

    return 0

# ============================================================
# HEAL FORMULA
# ============================================================

def calculate_heal(move: Move, healer: CharacterState) -> int:
    magic = get_effective_stat(healer, "magic")
    heal = (magic / 100) * move.base_value * 2
    return max(1, int(heal))

# ============================================================
# PRIMENA POTEZA
# vraca (novi_attacker, novi_defender, opis sta se desilo)
# ============================================================

def apply_move(move: Move, attacker: CharacterState, defender: CharacterState):
    attacker = attacker.model_copy(deep=True)
    defender = defender.model_copy(deep=True)
    log = ""

    # --- tick buff trajanja na pocetku poteza attackera ---
    attacker.active_effects = tick_effects(attacker.active_effects)

    if move.effect == EffectType.DAMAGE:
        dmg = calculate_damage(move, attacker, defender)
        defender.current_hp = max(0, defender.current_hp - dmg)
        log = f"{attacker.name} used {move.name} for {dmg} damage!"

    elif move.effect == EffectType.HEAL:
        heal = calculate_heal(move, attacker)
        attacker.current_hp = min(attacker.max_hp, attacker.current_hp + heal)
        log = f"{attacker.name} used {move.name} and healed {heal} HP!"

    elif move.effect == EffectType.DRAIN:
        dmg = calculate_damage(move, attacker, defender)
        defender.current_hp = max(0, defender.current_hp - dmg)
        attacker.current_hp = min(attacker.max_hp, attacker.current_hp + dmg)
        log = f"{attacker.name} used {move.name}, dealing {dmg} damage and healing {dmg} HP!"

    elif move.effect == EffectType.BUFF_ATTACK:
        attacker.active_effects.append(ActiveEffect(
            stat="attack", modifier=BUFF_MULTIPLIER, turns_remaining=move.buff_duration or 2
        ))
        log = f"{attacker.name} used {move.name}! Attack increased for {move.buff_duration} turns."

    elif move.effect == EffectType.BUFF_DEFENSE:
        attacker.active_effects.append(ActiveEffect(
            stat="defense", modifier=BUFF_MULTIPLIER, turns_remaining=move.buff_duration or 2
        ))
        log = f"{attacker.name} used {move.name}! Defense increased for {move.buff_duration} turns."

    elif move.effect == EffectType.BUFF_MAGIC:
        if move.id == "dark_pact":
            attacker.current_hp = max(1, attacker.current_hp - DARK_PACT_HP_COST)
        attacker.active_effects.append(ActiveEffect(
            stat="magic", modifier=BUFF_MULTIPLIER, turns_remaining=move.buff_duration or 2
        ))
        log = f"{attacker.name} used {move.name}! Magic increased for {move.buff_duration} turns."

    elif move.effect == EffectType.DEBUFF_ATTACK:
        defender.active_effects.append(ActiveEffect(
            stat="attack", modifier=DEBUFF_MULTIPLIER, turns_remaining=move.buff_duration or 2
        ))
        log = f"{attacker.name} used {move.name}! {defender.name}'s Attack decreased for {move.buff_duration} turns."

    elif move.effect == EffectType.DEBUFF_DEFENSE:
        defender.active_effects.append(ActiveEffect(
            stat="defense", modifier=DEBUFF_MULTIPLIER, turns_remaining=move.buff_duration or 2
        ))
        log = f"{attacker.name} used {move.name}! {defender.name}'s Defense decreased for {move.buff_duration} turns."

    elif move.effect == EffectType.DEBUFF_MAGIC:
        defender.active_effects.append(ActiveEffect(
            stat="magic", modifier=DEBUFF_MULTIPLIER, turns_remaining=move.buff_duration or 2
        ))
        log = f"{attacker.name} used {move.name}! {defender.name}'s Magic decreased for {move.buff_duration} turns."

    return attacker, defender, log

# ============================================================
# TICK EFEKTI - smanjuje trajanje, uklanja istekle
# ============================================================

def tick_effects(effects: list[ActiveEffect]) -> list[ActiveEffect]:
    updated = []
    for effect in effects:
        effect = effect.model_copy()
        effect.turns_remaining -= 1
        if effect.turns_remaining > 0:
            updated.append(effect)
    return updated

# ============================================================
# MONSTER AI - bira potez
# ============================================================

def choose_monster_move(monster: CharacterState, hero: CharacterState, available_moves: list[Move]) -> Move:
    hp_percent = monster.current_hp / monster.max_hp

    # ako je monster ispod 30% HP, preferira heal/drain ako ima
    if hp_percent < 0.3:
        heal_moves = [m for m in available_moves if m.effect in [EffectType.HEAL, EffectType.DRAIN]]
        if heal_moves:
            return random.choice(heal_moves)

    # ako nema aktivnih buffova, razmotri buff poteze
    has_attack_buff = any(e.stat == "attack" and e.modifier > 1 for e in monster.active_effects)
    has_magic_buff = any(e.stat == "magic" and e.modifier > 1 for e in monster.active_effects)

    if not has_attack_buff and not has_magic_buff and hp_percent > 0.5:
        buff_moves = [m for m in available_moves if m.effect in [
            EffectType.BUFF_ATTACK, EffectType.BUFF_MAGIC
        ]]
        if buff_moves and random.random() < 0.35:
            return random.choice(buff_moves)

    # inace random potez
    return random.choice(available_moves)

# ============================================================
# LEVEL UP
# ============================================================

def apply_level_up(hero_stats: dict, current_level: int) -> dict:
    new_stats = hero_stats.copy()
    new_stats["health"] += LEVEL_UP_STATS["health"]
    new_stats["attack"] += LEVEL_UP_STATS["attack"]
    new_stats["defense"] += LEVEL_UP_STATS["defense"]
    new_stats["magic"] += LEVEL_UP_STATS["magic"]
    new_stats["level"] = current_level + 1
    return new_stats