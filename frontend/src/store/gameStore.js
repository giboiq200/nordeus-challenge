import { create } from "zustand";
import { fetchRunConfig } from "../services/api";

const HERO_BASE_STATS = {
  health: 100,
  attack: 15,
  defense: 10,
  magic: 10,
};

const XP_TO_LEVEL_UP = 150;

export const useGameStore = create((set, get) => ({
  // --- Run state ---
  runConfig: null,
  currentMonsterIndex: 0,
  gameScreen: "mainMenu",
  pendingLevelUp: false,
  pendingLevelUpLevel: null,

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
      pendingLevelUp: false,
      pendingLevelUpLevel: null,
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
    let didLevelUp = false;

    if (newXp >= hero.xpToLevelUp) {
      newXp = newXp - hero.xpToLevelUp;
      newLevel += 1;
      didLevelUp = true;
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
      pendingLevelUp: didLevelUp,
      pendingLevelUpLevel: didLevelUp ? newLevel : null,
      hero: {
        ...hero,
        level: newLevel,
        xp: newXp,
        xpToLevelUp: XP_TO_LEVEL_UP,
        current_hp: hero.max_hp,
        max_hp: hero.max_hp,
        learnedMoves: newLearnedMoves,
        active_effects: [],
      },
    });
  },

  onBattleLose: () => {
    set({ battleResult: "lose", gameScreen: "postBattle" });
  },

  applyLevelUpBonus: (bonus) => {
    const { hero } = get();
    const newMaxHp = hero.max_hp + (bonus.health || 0);

    set({
      pendingLevelUp: false,
      pendingLevelUpLevel: null,
      hero: {
        ...hero,
        max_hp: newMaxHp,
        current_hp: newMaxHp,
        attack: hero.attack + (bonus.attack || 0),
        defense: hero.defense + (bonus.defense || 0),
        magic: hero.magic + (bonus.magic || 0),
      },
    });
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