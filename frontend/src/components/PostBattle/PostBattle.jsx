import { useState, useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import LevelUp from "../LevelUp/LevelUp";
import "./PostBattle.css";

function PostBattle() {
  const {
    battleResult, lastLearnedMove, hero,
    currentMonsterIndex, runConfig,
    goToScreen, enterBattle,
    pendingLevelUp, pendingLevelUpLevel, applyLevelUpBonus
  } = useGameStore();

  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (pendingLevelUp && !isRunComplete) {
      setTimeout(() => setShowLevelUp(true), 600);
    }
  }, [pendingLevelUp]);

  function handleLevelUpConfirm(bonus) {
    applyLevelUpBonus(bonus);
    setShowLevelUp(false);
  }

  const isRunComplete = currentMonsterIndex >= (runConfig?.monsters?.length || 5);
  const defeatedMonster = battleResult === "lose"
    ? runConfig?.monsters[currentMonsterIndex]
    : runConfig?.monsters[currentMonsterIndex - 1];

  if (battleResult === "lose") {
    return (
      <div className="pb">
        <div className="pb-card">
          <div className="pb-header lose">
            <div className="pb-corner tl"/><div className="pb-corner tr"/>
            <div className="pb-header-icon">💀</div>
            <h2>DEFEATED</h2>
            <p>{defeatedMonster?.name} was too powerful</p>
          </div>

          <div className="pb-section">
            <div className="pb-section-title">Hero Stats</div>
            <div className="pb-stats">
              <div className="pb-stat"><span className="pb-stat-label">❤ Health</span><span className="pb-stat-val">0 / {hero.max_hp}</span></div>
              <div className="pb-stat"><span className="pb-stat-label">⚔ Attack</span><span className="pb-stat-val">{hero.attack}</span></div>
              <div className="pb-stat"><span className="pb-stat-label">🛡 Defense</span><span className="pb-stat-val">{hero.defense}</span></div>
              <div className="pb-stat"><span className="pb-stat-label">✨ Magic</span><span className="pb-stat-val">{hero.magic}</span></div>
            </div>
          </div>

          <div className="pb-buttons">
            <button className="pb-btn-primary" onClick={() => goToScreen("map")}>
              ← Back to Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isRunComplete) {
    return (
      <div className="pb">
        <div className="pb-card">
          <div className="pb-header victory">
            <div className="pb-corner tl"/><div className="pb-corner tr"/>
            <div className="pb-header-icon">🏆</div>
            <h2>GAUNTLET COMPLETE</h2>
            <p>All 5 monsters defeated</p>
          </div>

          <div className="pb-section">
            <div className="pb-section-title">Final Stats</div>
            <div className="pb-stats">
              <div className="pb-stat"><span className="pb-stat-label">⭐ Level</span><span className="pb-stat-val">{hero.level}</span></div>
              <div className="pb-stat"><span className="pb-stat-label">📖 Moves</span><span className="pb-stat-val">{hero.learnedMoves.length}</span></div>
              <div className="pb-stat"><span className="pb-stat-label">⚔ Attack</span><span className="pb-stat-val">{hero.attack}</span></div>
              <div className="pb-stat"><span className="pb-stat-label">✨ Magic</span><span className="pb-stat-val">{hero.magic}</span></div>
            </div>
          </div>

          <div className="pb-buttons">
            <button className="pb-btn-primary" onClick={() => goToScreen("mainMenu")}>
              🏠 Main Menu
            </button>
          </div>
        </div>

        {showLevelUp && (
          <LevelUp
            newLevel={pendingLevelUpLevel}
            onConfirm={handleLevelUpConfirm}
          />
        )}
      </div>
    );
  }

  return (
    <div className="pb">
      <div className="pb-card">

        <div className="pb-header win">
          <div className="pb-corner tl"/><div className="pb-corner tr"/>
          <div className="pb-header-icon">⚔</div>
          <h2>VICTORY</h2>
          <p>{defeatedMonster?.name} defeated</p>
        </div>

        <div className="pb-section">
          <div className="pb-section-title">Experience</div>
          <div className="pb-xp-row">
            <span>+100 XP gained</span>
            <span className="pb-xp-level">Level {hero.level}</span>
          </div>
          <div className="pb-xp-bar">
            <div
              className="pb-xp-fill"
              style={{ width: `${(hero.xp / hero.xpToLevelUp) * 100}%` }}
            />
          </div>
          <div className="pb-xp-sub">{hero.xp} / {hero.xpToLevelUp} XP</div>
        </div>

        {lastLearnedMove && (
          <div className="pb-section">
            <div className="pb-section-title">New Move Learned</div>
            <div className={`pb-move pb-move--${lastLearnedMove.type}`}>
              <div className="pb-move-header">
                <div className="pb-move-name">{lastLearnedMove.name}</div>
                <div className="pb-move-type">
                  {lastLearnedMove.type === "physical" ? "⚔ Physical"
                    : lastLearnedMove.type === "magic" ? "✨ Magic"
                    : "◆ Utility"}
                </div>
              </div>
              <div className="pb-move-desc">{lastLearnedMove.description}</div>
              <div className="pb-move-hint">Available in Move Manager before next battle</div>
            </div>
          </div>
        )}

        <div className="pb-section">
          <div className="pb-section-title">Hero Stats</div>
          <div className="pb-stats">
            <div className="pb-stat">
              <span className="pb-stat-label">❤ Health</span>
              <span className="pb-stat-val">{hero.current_hp} / {hero.max_hp}</span>
            </div>
            <div className="pb-stat">
              <span className="pb-stat-label">⚔ Attack</span>
              <span className="pb-stat-val">{hero.attack}</span>
            </div>
            <div className="pb-stat">
              <span className="pb-stat-label">🛡 Defense</span>
              <span className="pb-stat-val">{hero.defense}</span>
            </div>
            <div className="pb-stat">
              <span className="pb-stat-label">✨ Magic</span>
              <span className="pb-stat-val">{hero.magic}</span>
            </div>
          </div>
        </div>

        <div className="pb-buttons">
          <button className="pb-btn-primary" onClick={() => goToScreen("map")}>
            → Continue to Map
          </button>
        </div>

      </div>

      {showLevelUp && (
        <LevelUp
          newLevel={pendingLevelUpLevel}
          onConfirm={handleLevelUpConfirm}
        />
      )}
    </div>
  );
}

export default PostBattle;