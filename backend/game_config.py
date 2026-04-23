from models import Move, MonsterConfig, MoveType, EffectType


# --- KNIGHT (default) ---
SLASH = Move(id="slash", name="Slash", type=MoveType.PHYSICAL, effect=EffectType.DAMAGE,
             base_value=20, description="A swift sword strike.")
SHIELD_UP = Move(id="shield_up", name="Shield Up", type=MoveType.NONE, effect=EffectType.BUFF_DEFENSE,
                 base_value=0, buff_duration=2, description="Raise your shield, boosting Defense for 2 turns.")
BATTLE_CRY = Move(id="battle_cry", name="Battle Cry", type=MoveType.NONE, effect=EffectType.BUFF_ATTACK,
                  base_value=0, buff_duration=2, description="A war cry that boosts Attack for 2 turns.")
SECOND_WIND = Move(id="second_wind", name="Second Wind", type=MoveType.MAGIC, effect=EffectType.HEAL,
                   base_value=15, description="Recover health using inner magic.")

# --- WITCH ---
SHADOW_BOLT = Move(id="shadow_bolt", name="Shadow Bolt", type=MoveType.MAGIC, effect=EffectType.DAMAGE,
                   base_value=28, description="A bolt of dark magic that ignores Defense.")
DRAIN_LIFE = Move(id="drain_life", name="Drain Life", type=MoveType.MAGIC, effect=EffectType.DRAIN,
                  base_value=12, description="Deals magic damage and heals the caster for the same amount.")
CURSE = Move(id="curse", name="Curse", type=MoveType.NONE, effect=EffectType.DEBUFF_ATTACK,
             base_value=0, buff_duration=2, description="Curses the target, lowering their Attack for 2 turns.")
DARK_PACT = Move(id="dark_pact", name="Dark Pact", type=MoveType.NONE, effect=EffectType.BUFF_MAGIC,
                 base_value=0, buff_duration=2, description="Sacrifice HP to boost Magic for 2 turns.")

# --- GIANT SPIDER ---
BITE = Move(id="bite", name="Bite", type=MoveType.PHYSICAL, effect=EffectType.DAMAGE,
            base_value=18, description="A venomous bite that deals moderate damage.")
WEB_THROW = Move(id="web_throw", name="Web Throw", type=MoveType.PHYSICAL, effect=EffectType.DEBUFF_DEFENSE,
                 base_value=10, buff_duration=2, description="Slows the target with webbing, lowering their Defense.")
POUNCE = Move(id="pounce", name="Pounce", type=MoveType.PHYSICAL, effect=EffectType.DAMAGE,
              base_value=28, description="Leaps at the enemy for heavy damage.")
SKITTER = Move(id="skitter", name="Skitter", type=MoveType.NONE, effect=EffectType.BUFF_DEFENSE,
               base_value=0, buff_duration=2, description="Scurries defensively, raising Defense for 2 turns.")

# --- DRAGON ---
FLAME_BREATH = Move(id="flame_breath", name="Flame Breath", type=MoveType.MAGIC, effect=EffectType.DAMAGE,
                    base_value=35, description="Breathes fire for heavy magic damage.")
CLAW_SWIPE = Move(id="claw_swipe", name="Claw Swipe", type=MoveType.PHYSICAL, effect=EffectType.DAMAGE,
                  base_value=22, description="A powerful claw attack.")
INTIMIDATE = Move(id="intimidate", name="Intimidate", type=MoveType.NONE, effect=EffectType.DEBUFF_ATTACK,
                  base_value=0, buff_duration=2, description="Frightens the target, lowering their Attack for 2 turns.")
DRAGON_SCALES = Move(id="dragon_scales", name="Dragon Scales", type=MoveType.NONE, effect=EffectType.BUFF_DEFENSE,
                     base_value=0, buff_duration=2, description="Hardens scales, raising Defense for 2 turns.")

# --- GOBLIN WARRIOR ---
RUSTY_BLADE = Move(id="rusty_blade", name="Rusty Blade", type=MoveType.PHYSICAL, effect=EffectType.DAMAGE,
                   base_value=18, description="A rusty but effective blade strike.")
DIRTY_KICK = Move(id="dirty_kick", name="Dirty Kick", type=MoveType.PHYSICAL, effect=EffectType.DEBUFF_DEFENSE,
                  base_value=8, buff_duration=2, description="A cheap kick that lowers the target's Defense.")
FRENZY = Move(id="frenzy", name="Frenzy", type=MoveType.NONE, effect=EffectType.BUFF_ATTACK,
              base_value=0, buff_duration=2, description="Enters a frenzy, raising Attack for 2 turns.")
HEADBUTT = Move(id="headbutt", name="Headbutt", type=MoveType.PHYSICAL, effect=EffectType.DAMAGE,
                base_value=28, description="A reckless headbutt for heavy damage.")

# --- GOBLIN MAGE ---
FIREBOLT = Move(id="firebolt", name="Firebolt", type=MoveType.MAGIC, effect=EffectType.DAMAGE,
                base_value=20, description="A bolt of fire magic.")
ARCANE_SURGE = Move(id="arcane_surge", name="Arcane Surge", type=MoveType.NONE, effect=EffectType.BUFF_MAGIC,
                    base_value=0, buff_duration=2, description="Surges with arcane power, raising Magic for 2 turns.")
MANA_DRAIN = Move(id="mana_drain", name="Mana Drain", type=MoveType.MAGIC, effect=EffectType.DEBUFF_MAGIC,
                  base_value=10, buff_duration=2, description="Drains the target's magical energy.")
HEX_SHIELD = Move(id="hex_shield", name="Hex Shield", type=MoveType.NONE, effect=EffectType.BUFF_DEFENSE,
                  base_value=0, buff_duration=2, description="A magical shield that raises Defense for 2 turns.")

# ============================================================
# MONSTER DEFINICIJE (po težini, od lakšeg ka težem)
# ============================================================

MONSTERS = [
    MonsterConfig(
        id="goblin_warrior", name="Goblin Warrior", sprite="goblin_warrior.png",
        health=75, attack=12, defense=5, magic=3,
        moves=[RUSTY_BLADE, DIRTY_KICK, FRENZY, HEADBUTT]
    ),
    MonsterConfig(
        id="giant_spider", name="Giant Spider", sprite="giant_spider.png",
        health=85, attack=14, defense=8, magic=3,
        moves=[BITE, WEB_THROW, POUNCE, SKITTER]
    ),
    MonsterConfig(
        id="goblin_mage", name="Goblin Mage", sprite="goblin_mage.png",
        health=95, attack=10, defense=5, magic=16,
        moves=[FIREBOLT, ARCANE_SURGE, MANA_DRAIN, HEX_SHIELD]
    ),
    MonsterConfig(
        id="witch", name="Witch", sprite="witch.png",
        health=70, attack=7, defense=6, magic=20,
        moves=[SHADOW_BOLT, DRAIN_LIFE, CURSE, DARK_PACT]
    ),
    MonsterConfig(
        id="dragon", name="Dragon", sprite="dragon.png",
        health=110, attack=20, defense=15, magic=22,
        moves=[FLAME_BREATH, CLAW_SWIPE, INTIMIDATE, DRAGON_SCALES]
    ),
]

# ============================================================
# HERO DEFAULT KONFIGURACIJA
# ============================================================

HERO_DEFAULT_MOVES = [SLASH, SHIELD_UP, BATTLE_CRY, SECOND_WIND]

HERO_BASE_STATS = {
    "health": 100,
    "attack": 15,
    "defense": 10,
    "magic": 10,
}

LEVEL_UP_STATS = {
    "health": 15,
    "attack": 3,
    "defense": 2,
    "magic": 2,
}

XP_PER_BATTLE = 100
XP_TO_LEVEL_UP = 150