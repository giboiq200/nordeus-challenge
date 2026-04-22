import { create } from "zustand";
import { fetchRunConfig } from "../services/api";

const HERO_BASE_STATS = {
  health: 100,
  attack: 15,
  defense: 10,
  magic: 10,
};

const XP_TO_LEVEL_UP = 150;

const LEVEL_UP_STATS = {
  health: 15,
  attack: 3,
  defense: 2,
  magic: 2,
};

export const useGameStore = create((set, get) => ({
  // --- Run state ---
  runConfig: null,
  currentMonsterIndex: 0,
  gameScreen: "mainMenu", // mainMenu | map | battle | postBattle

  // --- Hero state ---
  hero: {
    id: "hero",
    name: "Knight",
    level: 1,
    xp: 0,
    xpToLevelUp: XP_TO_LEVEL_UP,
    current_hp: HERO_BASE_STATS.health,
    max_hp: HERO_BASE_STATS.health,
    attack: HERO_BASE_STATS.attack,
    defense: HERO_BASE_STATS.defense,
    magic: HERO_BASE_STATS.magic,
    equippedMoves: [],   // max 4 poteza
    learnedMoves: [],    // svi nauceni potezi
    active_effects: [],
  },

  // --- Post battle ---
  lastLearnedMove: null,
  battleResult: null, // "win" | "lose"

  // ============================================================
  // AKCIJE
  // ============================================================

  // Pokretanje nove runde
  startNewRun: async () => {
    const config = await fetchRunConfig();

    const defaultMoves = config.hero_default_moves;

    set({
      runConfig: config,
      currentMonsterIndex: 0,
      gameScreen: "map",
      lastLearnedMove: null,
      battleResult: null,
      hero: {
        id: "hero",
        name: "Knight",
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

  // Navigacija na ekrane
  goToScreen: (screen) => set({ gameScreen: screen }),

  // Ulazak u borbu
  enterBattle: () => set({ gameScreen: "battle" }),

  // Kad hero pobedi
  onBattleWin: (learnedMove, xpGained) => {
    const { hero, currentMonsterIndex, runConfig } = get();

    // XP i level up
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

    // dodaj learned move ako vec nije naucen
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
        current_hp: newStats.max_hp, // full HP nakon pobede
        max_hp: newStats.max_hp,
        attack: newStats.attack,
        defense: newStats.defense,
        magic: newStats.magic,
        learnedMoves: newLearnedMoves,
        active_effects: [],
      },
    });
  },

  // Kad hero izgubi
  onBattleLose: () => {
    set({ battleResult: "lose", gameScreen: "postBattle" });
  },

  // Equip/unequip move
  equipMove: (move) => {
    const { hero } = get();
    const alreadyEquipped = hero.equippedMoves.some((m) => m.id === move.id);

    if (alreadyEquipped) {
      // unequip
      set({
        hero: {
          ...hero,
          equippedMoves: hero.equippedMoves.filter((m) => m.id !== move.id),
        },
      });
    } else if (hero.equippedMoves.length < 4) {
      // equip ako ima mesta
      set({
        hero: {
          ...hero,
          equippedMoves: [...hero.equippedMoves, move],
        },
      });
    }
  },

  // Trenutni monster
  getCurrentMonster: () => {
    const { runConfig, currentMonsterIndex } = get();
    if (!runConfig) return null;
    return runConfig.monsters[currentMonsterIndex] || null;
  },
}));