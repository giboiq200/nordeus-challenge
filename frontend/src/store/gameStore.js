import { create } from "zustand";
import { fetchRunConfig } from "../services/api";

const HERO_BASE_STATS = {
  health: 120,
  attack: 18,
  defense: 12,
  magic: 12,
};

const XP_TO_LEVEL_UP = 150;

const LEVEL_UP_STATS = {
  health: 20,
  attack: 4,
  defense: 3,
  magic: 3,
};

export const useGameStore = create((set, get) => ({
  // --- Run state ---
  runConfig: null,
  currentMonsterIndex: 0,
  gameScreen: "mainMenu",

  // --- Hero state ---
  hero: {
    id: "hero",
    name: "Knight",
    sprite: "hero5",
    level: 1,
    xp: 0,
    xpToLevelUp: XP_TO_LEVEL_UP,
    current_hp: HERO_BASE_STATS.health,
    max_hp: HERO_BASE_STATS.health,
    attack: HERO_BASE_STATS.attack,
    defense: HERO_BASE_STATS.defense,
    magic: HERO_BASE_STATS.magic,
    equippedMoves: [],
    learnedMoves: [],
    active_effects: [],
  },

  // --- Post battle ---
  lastLearnedMove: null,
  battleResult: null,

  // ============================================================
  // AKCIJE
  // ============================================================

  startNewRun: async () => {
    const config = await fetchRunConfig();
    const defaultMoves = config.hero_default_moves;

    set({
      runConfig: config,
      currentMonsterIndex: 0,
      gameScreen: "characterSelect",
      lastLearnedMove: null,
      battleResult: null,
      hero: {
        id: "hero",
        name: "Knight",
        sprite: "hero5",
        level: 1,
        xp: 0,
        xpToLevelUp: XP_TO_LEVEL_UP,
        current_hp: HERO_BASE_STATS.health,
        max_hp: HERO_BASE_STATS.health,
        attack: HERO_BASE_STATS.attack,
        defense: HERO_BASE_STATS.defense,
        magic: HERO_BASE_STATS.magic,
        equippedMoves: defaultMoves,
        learnedMoves: defaultMoves,
        active_effects: [],
      },
    });
  },

  selectHero: (spriteKey, name) => {
    set((state) => ({
      hero: { ...state.hero, sprite: spriteKey, name },
      gameScreen: "map",
    }));
  },

  goToScreen: (screen) => set({ gameScreen: screen }),

  enterBattle: () => set({ gameScreen: "battle" }),

  onBattleWin: (learnedMove, xpGained) => {
    const { hero, currentMonsterIndex } = get();

    let newXp = hero.xp + xpGained;
    let newLevel = hero.level;
    let newStats = {
      max_hp: hero.max_hp,
      attack: hero.attack,
      defense: hero.defense,
      magic: hero.magic,
    };

    if (newXp >= hero.xpToLevelUp) {
      newXp = newXp - hero.xpToLevelUp;
      newLevel += 1;
      newStats.max_hp += LEVEL_UP_STATS.health;
      newStats.attack += LEVEL_UP_STATS.attack;
      newStats.defense += LEVEL_UP_STATS.defense;
      newStats.magic += LEVEL_UP_STATS.magic;
    }

    const alreadyLearned = hero.learnedMoves.some((m) => m.id === learnedMove.id);
    const newLearnedMoves = alreadyLearned
      ? hero.learnedMoves
      : [...hero.learnedMoves, learnedMove];

    set({
      lastLearnedMove: learnedMove,
      battleResult: "win",
      currentMonsterIndex: currentMonsterIndex + 1,
      gameScreen: "postBattle",
      hero: {
        ...hero,
        level: newLevel,
        xp: newXp,
        xpToLevelUp: XP_TO_LEVEL_UP,
        current_hp: newStats.max_hp,
        max_hp: newStats.max_hp,
        attack: newStats.attack,
        defense: newStats.defense,
        magic: newStats.magic,
        learnedMoves: newLearnedMoves,
        active_effects: [],
      },
    });
  },

  onBattleLose: () => {
    set({ battleResult: "lose", gameScreen: "postBattle" });
  },

  equipMove: (move) => {
    const { hero } = get();
    const alreadyEquipped = hero.equippedMoves.some((m) => m.id === move.id);

    if (alreadyEquipped) {
      set({
        hero: {
          ...hero,
          equippedMoves: hero.equippedMoves.filter((m) => m.id !== move.id),
        },
      });
    } else if (hero.equippedMoves.length < 4) {
      set({
        hero: {
          ...hero,
          equippedMoves: [...hero.equippedMoves, move],
        },
      });
    }
  },

  getCurrentMonster: () => {
    const { runConfig, currentMonsterIndex } = get();
    if (!runConfig) return null;
    return runConfig.monsters[currentMonsterIndex] || null;
  },
}));