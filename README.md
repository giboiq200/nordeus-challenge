# Nordeus Challenge

A turn-based RPG browser game built as a full stack challenge for the Nordeus Job Fair 2026.

The player controls a hero fighting through a gauntlet of 5 monsters. Beat them all to win the run. After each victory, learn one of the monster's moves and equip it before the next fight.

🎮 **[Play the game](https://nordeus-challenge.vercel.app/)**

---

## Tech Stack

**Frontend** — React (Vite), Zustand, CSS

**Backend** — Python, FastAPI, Uvicorn, Pydantic

**Deployment** — Frontend on Vercel, Backend on Render

---

## Features

### Core Gameplay
- Turn-based combat — hero picks a move, monster responds, back and forth until someone's HP hits zero
- 5 unique monsters with increasing difficulty: Goblin Warrior, Giant Spider, Goblin Mage, Witch, Dragon
- 4 stats for every character: Health, Attack, Defense, Magic
- Physical moves scale off Attack and are reduced by Defense; Magic moves scale off Magic and bypass Defense entirely
- Buff and debuff system — Attack, Defense, and Magic can be boosted or lowered for a set number of turns
- Hero starts at Level 1 with a default moveset (Slash, Shield Up, Battle Cry, Second Wind)
- XP system — earn XP each battle, level up after enough XP
- Move learning — defeat a monster to learn one of its moves at random
- Move management — equip up to 4 moves from everything learned so far

### Progression
- **Hero class selection** — choose from 5 different heroes before starting a run
- **Attribute choices on level up** — instead of fixed stat increases, choose which stat to boost each level (Vitality, Strength, Endurance or Arcane Power)

### UI / UX
- Dark fantasy art style inspired by Slay the Spire
- Unique pixel art sprite for each character and hero
- Unique illustrated battle background for each monster encounter
- Floating damage and heal numbers during combat
- Attack, hit, buff and heal animations on sprites
- Move tooltips on hover showing description and effect type
- Battle log showing the last 5 actions
- Map screen showing the full run path with defeated, current and locked encounters
- Post-battle screen showing XP gained, move learned and hero stats
- Loading screen with animated messages while the server wakes up

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
│   ├── battle_logic.py    # Damage formulas, buff system, monster AI
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── assets/
        │   ├── sprites/          # Pixel art character sprites
        │   └── backgrounds/      # Battle background images per monster
        ├── components/
        │   ├── MainMenu/
        │   ├── CharacterSelect/
        │   ├── Map/
        │   ├── Battle/
        │   ├── PostBattle/
        │   ├── MoveManager/
        │   ├── LevelUp/
        │   └── LoadingScreen/
        ├── services/
        │   └── api.js            # All API calls
        └── store/
            └── gameStore.js      # Global state (Zustand)
```

---

## Getting Started Locally

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

pip install -r requirements.txt
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

- **Hero class selection** — character select screen before each run (Game Designer bonus #15)
- **Attribute choices on level up** — player chooses which stat to boost on level up (bonus #2)
- **Move tooltips on hover** — shows description and effect type (bonus #1)
- **Smarter monster AI** — heals when low HP, buffs when healthy (bonus #8)
- **Battle log** — running list of the last 5 actions during a fight (bonus #6)
- **Battle animations** — hit flash, attack slide, buff glow, floating damage numbers (bonus #7)
- **Unique battle backgrounds** — each monster encounter has its own illustrated environment (bonus #13)

---

## Notes

The backend is hosted on Render's free tier, which spins down after inactivity. The first load after a period of inactivity may take up to 60 seconds — a loading screen is shown during this time.

---

## Author

Built for the Nordeus Job Fair 2026 Full Stack Challenge.
