import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { fetchMonsterMove, fetchBattleReward } from "../../services/api";
import { BATTLE_BACKGROUNDS } from "../../assets/backgrounds/BattleBackgrounds";
//character selection
import hero1Sprite from "../../assets/sprites/hero1.png";
import hero2Sprite from "../../assets/sprites/hero2.png";
import hero3Sprite from "../../assets/sprites/hero3.png";
import hero4Sprite from "../../assets/sprites/hero4.png";
import hero5Sprite from "../../assets/sprites/hero5.png";
//enemies
import goblinWarrior  from "../../assets/sprites/goblin_warrior.png";
import goblinMage     from "../../assets/sprites/goblin_mage.png";
import giantSpider    from "../../assets/sprites/giant_spider.png";
import witchSprite    from "../../assets/sprites/witch.png";
import dragonSprite   from "../../assets/sprites/dragon.png";

import "./Battle.css";

const HERO_SPRITES = {
  hero1: hero1Sprite,
  hero2: hero2Sprite,
  hero3: hero3Sprite,
  hero4: hero4Sprite,
  hero5: hero5Sprite,
};

const TURN_DELAY = 1000;

const MONSTER_SPRITES = {
  goblin_warrior: goblinWarrior,
  goblin_mage:    goblinMage,
  giant_spider:   giantSpider,
  witch:          witchSprite,
  dragon:         dragonSprite,
};

function HPBar({ current, max }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? "#4caf50" : pct > 25 ? "#f4c542" : "#e05252";
  return (
    <div className="hp-bar">
      <div className="hp-bar__fill" style={{ width: `${pct}%`, background: color }} />
      <span className="hp-bar__text">{current} / {max}</span>
    </div>
  );
}

function buildHeroState(hero) {
  return {
    id: hero.id, name: hero.name,
    current_hp: hero.current_hp, max_hp: hero.max_hp,
    attack: hero.attack, defense: hero.defense, magic: hero.magic,
    active_effects: [],
  };
}

function buildMonsterState(monster) {
  return {
    id: monster.id, name: monster.name,
    current_hp: monster.health, max_hp: monster.health,
    attack: monster.attack, defense: monster.defense, magic: monster.magic,
    active_effects: [],
  };
}

function Battle() {
  const { hero, getCurrentMonster, onBattleWin, onBattleLose, goToScreen } = useGameStore();
  const monster = getCurrentMonster();

  const [heroState, setHeroState]       = useState(() => buildHeroState(hero));
  const [monsterState, setMonsterState] = useState(() => buildMonsterState(monster));
  const [battleLog, setBattleLog]       = useState(["Battle started! Choose your move."]);
  const [phase, setPhase]               = useState("player");
  const [isAnimating, setIsAnimating]   = useState(false);
  const [heroAnim, setHeroAnim]         = useState("");
  const [monsterAnim, setMonsterAnim]   = useState("");
  const [floatingText, setFloatingText] = useState(null);
  const [tooltip, setTooltip]           = useState(null);

  const addLog = (msg) => setBattleLog(prev => [...prev, msg]);

  function showFloat(text, isHero) {
    setFloatingText({ text, isHero, key: Date.now() });
    setTimeout(() => setFloatingText(null), 900);
  }

  function triggerAnim(setAnim, name) {
    setAnim(name);
    setTimeout(() => setAnim(""), 400);
  }

  function getEffective(char, stat) {
    let base = char[stat];
    let mult = 1.0;
    for (const e of char.active_effects) {
      if (e.stat === stat) mult *= e.modifier;
    }
    return base * mult;
  }

  function calcDamage(move, attacker, defender) {
    if (move.type === "physical") {
      const atk = getEffective(attacker, "attack");
      const def = getEffective(defender, "defense");
      return Math.max(1, Math.floor((atk / 100) * move.base_value * 2 * (100 / (100 + def))));
    } else if (move.type === "magic") {
      const mag = getEffective(attacker, "magic");
      return Math.max(1, Math.floor((mag / 100) * move.base_value * 2));
    }
    return 0;
  }

  function calcHeal(move, healer) {
    return Math.max(1, Math.floor((getEffective(healer, "magic") / 100) * move.base_value * 2));
  }

  function tickEffects(effects) {
    return effects
      .map(e => ({ ...e, turns_remaining: e.turns_remaining - 1 }))
      .filter(e => e.turns_remaining > 0);
  }

  function applyMove(move, attacker, setAttacker, defender, setDefender, attackerIsHero) {
    const atk = { ...attacker, active_effects: tickEffects(attacker.active_effects) };
    let def = { ...defender };
    let log = "";

    if (move.effect === "damage") {
      const dmg = calcDamage(move, atk, def);
      def.current_hp = Math.max(0, def.current_hp - dmg);
      log = `${atk.name} used ${move.name} for ${dmg} damage!`;
      showFloat(`-${dmg}`, !attackerIsHero);
      triggerAnim(attackerIsHero ? setHeroAnim : setMonsterAnim, "attack");
      triggerAnim(attackerIsHero ? setMonsterAnim : setHeroAnim, "hit");
    } else if (move.effect === "heal") {
      const heal = calcHeal(move, atk);
      atk.current_hp = Math.min(atk.max_hp, atk.current_hp + heal);
      log = `${atk.name} used ${move.name} and healed ${heal} HP!`;
      showFloat(`+${heal} HP`, attackerIsHero);
      triggerAnim(attackerIsHero ? setHeroAnim : setMonsterAnim, "heal");
    } else if (move.effect === "drain") {
      const dmg = calcDamage(move, atk, def);
      def.current_hp = Math.max(0, def.current_hp - dmg);
      atk.current_hp = Math.min(atk.max_hp, atk.current_hp + dmg);
      log = `${atk.name} used ${move.name}, dealt ${dmg} and healed ${dmg} HP!`;
      showFloat(`-${dmg}`, !attackerIsHero);
      triggerAnim(attackerIsHero ? setMonsterAnim : setHeroAnim, "hit");
    } else if (move.effect === "buff_attack") {
      atk.active_effects = [...atk.active_effects, { stat: "attack", modifier: 1.3, turns_remaining: move.buff_duration || 2 }];
      log = `${atk.name} used ${move.name}! Attack +30% for ${move.buff_duration} turns.`;
      triggerAnim(attackerIsHero ? setHeroAnim : setMonsterAnim, "buff");
    } else if (move.effect === "buff_defense") {
      atk.active_effects = [...atk.active_effects, { stat: "defense", modifier: 1.3, turns_remaining: move.buff_duration || 2 }];
      log = `${atk.name} used ${move.name}! Defense +30% for ${move.buff_duration} turns.`;
      triggerAnim(attackerIsHero ? setHeroAnim : setMonsterAnim, "buff");
    } else if (move.effect === "buff_magic") {
      if (move.id === "dark_pact") atk.current_hp = Math.max(1, atk.current_hp - 15);
      atk.active_effects = [...atk.active_effects, { stat: "magic", modifier: 1.3, turns_remaining: move.buff_duration || 2 }];
      log = `${atk.name} used ${move.name}! Magic +30% for ${move.buff_duration} turns.`;
      triggerAnim(attackerIsHero ? setHeroAnim : setMonsterAnim, "buff");
    } else if (move.effect === "debuff_attack") {
      def.active_effects = [...def.active_effects, { stat: "attack", modifier: 0.7, turns_remaining: move.buff_duration || 2 }];
      log = `${atk.name} used ${move.name}! ${def.name}'s Attack -30%.`;
    } else if (move.effect === "debuff_defense") {
      def.active_effects = [...def.active_effects, { stat: "defense", modifier: 0.7, turns_remaining: move.buff_duration || 2 }];
      log = `${atk.name} used ${move.name}! ${def.name}'s Defense -30%.`;
    } else if (move.effect === "debuff_magic") {
      def.active_effects = [...def.active_effects, { stat: "magic", modifier: 0.7, turns_remaining: move.buff_duration || 2 }];
      log = `${atk.name} used ${move.name}! ${def.name}'s Magic -30%.`;
    }

    setAttacker(atk);
    setDefender(def);
    addLog(log);
    return { newAttacker: atk, newDefender: def };
  }

  async function handleHeroMove(move) {
    if (phase !== "player" || isAnimating) return;
    setIsAnimating(true);
    setPhase("monster");

    const { newAttacker: newHero, newDefender: newMonster } = applyMove(
      move, heroState, setHeroState, monsterState, setMonsterState, true
    );

    if (newMonster.current_hp <= 0) {
      addLog(`You defeated ${monster.name}!`);
      setPhase("end");
      setIsAnimating(false);
      const reward = await fetchBattleReward(monster.id);
      onBattleWin(reward.learned_move, reward.xp_gained);
      return;
    }

    setTimeout(async () => {
      try {
        const res = await fetchMonsterMove({
          monster_id: monster.id,
          hero: {
            id: newHero.id, name: newHero.name,
            current_hp: newHero.current_hp, max_hp: newHero.max_hp,
            attack: newHero.attack, defense: newHero.defense, magic: newHero.magic,
            active_effects: newHero.active_effects,
          },
          monster: {
            id: newMonster.id, name: newMonster.name,
            current_hp: newMonster.current_hp, max_hp: newMonster.max_hp,
            attack: newMonster.attack, defense: newMonster.defense, magic: newMonster.magic,
            active_effects: newMonster.active_effects,
          },
          turn_number: 1,
        });

        const { newDefender: finalHero } = applyMove(
          res.move, newMonster, setMonsterState, newHero, setHeroState, false
        );

        if (finalHero.current_hp <= 0) {
          addLog(`You were defeated by ${monster.name}!`);
          setPhase("end");
          setTimeout(() => onBattleLose(), 1500);
        } else {
          setPhase("player");
          addLog("Your turn! Choose a move.");
        }
      } catch {
        addLog("Error getting monster move.");
        setPhase("player");
      }
      setIsAnimating(false);
    }, TURN_DELAY);
  }

  if (!monster) return null;

  const bgImage = BATTLE_BACKGROUNDS[monster.id] || BATTLE_BACKGROUNDS.goblin_warrior;
  const monsterSprite = MONSTER_SPRITES[monster.id];

  return (
    <div className="battle">

      {/* BACKGROUND */}
      <div
        className="battle__bg"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* ARENA */}
      <div className="battle__arena">

        {/* MONSTER */}
        <div className="battle__combatant battle__combatant--monster">
          <div className="battle__name-tag enemy">
            🔴 {monster.name}
          </div>
          <div className={`battle__sprite-wrap ${monsterAnim}`}>
            {monsterSprite
              ? <img src={monsterSprite} alt={monster.name} className="battle__sprite-img monster-facing"/>
              : <div className="battle__sprite-fallback">👾</div>
            }
            {floatingText && !floatingText.isHero && (
              <div key={floatingText.key} className={`battle__float ${floatingText.text.startsWith("+") ? "heal" : "damage"}`}>
                {floatingText.text}
              </div>
            )}
          </div>
          <HPBar current={monsterState.current_hp} max={monsterState.max_hp} />
          {monsterState.active_effects.length > 0 && (
            <div className="battle__effects">
              {monsterState.active_effects.map((e, i) => (
                <span key={i} className={`effect-badge ${e.modifier > 1 ? "buff" : "debuff"}`}>
                  {e.modifier > 1 ? "▲" : "▼"} {e.stat} ({e.turns_remaining})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* VS */}
        <div className="battle__vs">VS</div>

        {/* HERO */}
        <div className="battle__combatant battle__combatant--hero">
          <div className="battle__name-tag hero">
            🟢 Knight — Lv.{hero.level}
          </div>
          <div className={`battle__sprite-wrap ${heroAnim}`}>
            <img src={HERO_SPRITES[hero.sprite] || hero5Sprite} alt={hero.name} className="battle__sprite-img"/>
            {floatingText && floatingText.isHero && (
              <div key={floatingText.key} className={`battle__float ${floatingText.text.startsWith("+") ? "heal" : "damage"}`}>
                {floatingText.text}
              </div>
            )}
          </div>
          <HPBar current={heroState.current_hp} max={heroState.max_hp} />

          {heroState.active_effects.length > 0 && (
            <div className="battle__effects">
              {heroState.active_effects.map((e, i) => (
                <span key={i} className={`effect-badge ${e.modifier > 1 ? "buff" : "debuff"}`}>
                  {e.modifier > 1 ? "▲" : "▼"} {e.stat} ({e.turns_remaining})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BATTLE LOG */}
      <div className="battle__log">
        {battleLog.slice(-5).map((msg, i, arr) => (
          <div key={i} className={`battle__log-entry ${i === arr.length - 1 ? "latest" : ""}`}>
            {msg}
          </div>
        ))}
      </div>

      {/* PHASE INDICATOR */}
      <div className="battle__phase">
        {phase === "player"  && "⚡ Your turn — choose a move"}
        {phase === "monster" && "⏳ Enemy is acting..."}
        {phase === "end"     && "⚔ Battle over!"}
      </div>

      {/* MOVES */}
      <div className="battle__moves">
        <div className="battle__moves-grid">
          {hero.equippedMoves.map((move) => (
            <div key={move.id} className="battle__move-wrapper">
              <button
                className={`move-btn move-btn--${move.type}`}
                onClick={() => handleHeroMove(move)}
                disabled={phase !== "player" || isAnimating}
                onMouseEnter={() => setTooltip(move)}
                onMouseLeave={() => setTooltip(null)}
              >
                <span className="move-btn__name">{move.name}</span>
                <span className="move-btn__meta">
                  {move.type === "physical" ? "⚔ Physical" : move.type === "magic" ? "✨ Magic" : "◆ Utility"}
                </span>
              </button>
              {tooltip?.id === move.id && (
                <div className="move-tooltip">
                  <div className="move-tooltip__name">{move.name}</div>
                  <div className="move-tooltip__desc">{move.description}</div>
                  <div className="move-tooltip__effect">{move.effect.replace(/_/g, " ")}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="battle__retreat" onClick={() => goToScreen("map")}>
        ← Back to Map
      </button>
    </div>
  );
}

export default Battle;