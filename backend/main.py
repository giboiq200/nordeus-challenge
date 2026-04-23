from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random

from models import RunConfig, BattleStateRequest, Move
from game_config import MONSTERS, HERO_DEFAULT_MOVES, HERO_BASE_STATS, XP_PER_BATTLE, XP_TO_LEVEL_UP
from battle_logic import choose_monster_move

app = FastAPI(title="RPG Battle API")

# CORS - da React moze da komunicira sa backendom
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://nordeus-challenge.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# GET /run/config
# Vraca konfiguraciju cele runde (5 monstera + hero default)
# ============================================================

@app.get("/run/config", response_model=RunConfig)
def get_run_config():
    return RunConfig(
        monsters=MONSTERS,
        hero_default_moves=HERO_DEFAULT_MOVES,
        hero_base_stats=HERO_BASE_STATS,
    )

# ============================================================
# POST /battle/monster-move
# Prima trenutno stanje borbe, vraca potez monstera
# ============================================================

@app.post("/battle/monster-move")
def get_monster_move(battle_state: BattleStateRequest):
    # pronadji monstера po id-u
    monster_config = next(
        (m for m in MONSTERS if m.id == battle_state.monster_id), None
    )
    if not monster_config:
        raise HTTPException(status_code=404, detail="Monster not found")

    chosen_move = choose_monster_move(
        monster=battle_state.monster,
        hero=battle_state.hero,
        available_moves=monster_config.moves,
    )

    return {
        "move": chosen_move,
        "message": f"{battle_state.monster.name} used {chosen_move.name}!"
    }

# ============================================================
# GET /battle/reward
# Vraca random move koji hero uci od pobedenog monstera
# ============================================================

@app.get("/battle/reward/{monster_id}")
def get_battle_reward(monster_id: str):
    monster_config = next(
        (m for m in MONSTERS if m.id == monster_id), None
    )
    if not monster_config:
        raise HTTPException(status_code=404, detail="Monster not found")

    learned_move = random.choice(monster_config.moves)

    return {
        "learned_move": learned_move,
        "xp_gained": XP_PER_BATTLE,
        "xp_to_level_up": XP_TO_LEVEL_UP,
    }

# ============================================================
# Health check
# ============================================================

@app.get("/")
def root():
    return {"status": "RPG API is running!"}