# Full Stack RPG Game

A turn-based RPG browser game built as a full stack challenge for the Nordeus Job Fair 2026.

The player controls a knight fighting through a gauntlet of 5 monsters. Beat them all to win the run. After each victory, learn one of the monster's moves and equip it before the next fight.

---

## Tech Stack

**Frontend** — React (Vite), Zustand, CSS

**Backend** — Python, FastAPI, Uvicorn, Pydantic

---

## Features

### Core
- Turn-based combat — hero picks a move, monster responds, back and forth until someone's HP hits zero
- 5 unique monsters with increasing difficulty: Goblin Warrior, Giant Spider, Goblin Mage, Witch, Dragon
- 4 stats for every character: Health, Attack, Defense, Magic
- Physical moves scale off Attack and are reduced by Defense; Magic moves scale off Magic and bypass Defense
- Buff and debuff system — Attack, Defense, and Magic can be boosted or lowered for a set number of turns
- Hero starts at Level 1 with a default Knight moveset (Slash, Shield Up, Battle Cry, Second Wind)
- XP system — earn XP each battle, level up to increase all stats
- Move learning — defeat a monster to learn one of its moves at random
- Move management — equip up to 4 moves from everything learned so far

### UI / UX
- Dark fantasy art style inspired by Slay the Spire
- Unique pixel art sprite for each character
- Unique illustrated battle background for each monster encounter
- Floating damage and heal numbers during combat
- Attack, hit, buff, and heal animations on sprites
- Move tooltips on hover showing description and effect type
- Battle log showing the last 5 actions
- Map screen showing the full run path with defeated, current, and locked encounters
- Post-battle screen showing XP gained, move learned, and hero stats

### Server-side
- `GET /run/config` — returns the full run configuration (5 monsters, stats, movesets, hero defaults)
- `POST /battle/monster-move` — receives current battle state, returns the monster's chosen move
- `GET /battle/reward/{monster_id}` — returns a random move learned from the defeated monster and XP gained
- Monster AI with situational awareness — prioritizes healing when low HP, considers buffing when healthy

---

## Project Structure

```
/
├── backend/
│   ├── main.py            # FastAPI app and routes
│   ├── models.py          # Pydantic models
│   ├── game_config.py     # All monsters, moves, and hero defaults
│   └── battle_logic.py    # Damage formulas, buff system, monster AI
│
└── frontend/
    └── src/
        ├── assets/
        │   ├── sprites/       # Pixel art character sprites
        │   └── backgrounds/   # Battle background images
        ├── components/
        │   ├── MainMenu/
        │   ├── Map/
        │   ├── Battle/
        │   ├── PostBattle/
        │   └── MoveManager/
        ├── services/
        │   └── api.js         # All API calls
        └── store/
            └── gameStore.js   # Global state (Zustand)
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac / Linux
source venv/bin/activate

pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

API runs at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Game Systems

### Stats
| Stat | Effect |
|---|---|
| Health | Hit points — reach zero and you lose |
| Attack | Scales physical move damage |
| Defense | Reduces incoming physical damage |
| Magic | Scales magic damage and healing, bypasses Defense |

### Move Types
| Type | Scales with | Blocked by |
|---|---|---|
| Physical | Attack | Defense |
| Magic | Magic | Nothing |
| Utility | — | — |

### Monsters
| # | Monster | Difficulty |
|---|---|---|
| 1 | Goblin Warrior | Easy |
| 2 | Giant Spider | Easy-Medium |
| 3 | Goblin Mage | Medium |
| 4 | Witch | Hard |
| 5 | Dragon | Boss |

---

## Bonus Features Implemented

- Move tooltips on hover (Game Designer bonus #1)
- Situational monster AI — heals when low HP, buffs when healthy (bonus #8)
- Full battle log showing last 5 actions (bonus #6)
- Hit animations and floating damage numbers (bonus #7)
- Unique battle backgrounds per encounter (bonus #13 — environmental flavor)

---

## Author

Built for the Nordeus Job Fair 2026 Full Stack Challenge.
