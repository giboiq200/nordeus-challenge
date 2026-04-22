import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import MoveManager from "../MoveManager/MoveManager";
import "./Map.css";

const MONSTER_ICONS = {
  goblin_warrior: "⚔",
  giant_spider: "🕷",
  goblin_mage: "🧙",
  witch: "🧙‍♀️",
  dragon: "🐉",
};

function Map() {
  const { runConfig, currentMonsterIndex, hero, enterBattle, goToScreen } = useGameStore();
  const [showMoveManager, setShowMoveManager] = useState(false);

  if (!runConfig) return null;

  const isRunComplete = currentMonsterIndex >= runConfig.monsters.length;
  const reversedMonsters = [...runConfig.monsters].reverse();

  return (
    <div className="map">
      {/* TOP BAR */}
      <div className="map-topbar">
        <div className="map-topbar-name">⚔ {hero.name}</div>
        <div className="map-topbar-stat">❤ <span>{hero.current_hp}/{hero.max_hp}</span></div>
        <div className="map-topbar-stat">⚔ <span>{hero.attack}</span></div>
        <div className="map-topbar-stat">🛡 <span>{hero.defense}</span></div>
        <div className="map-topbar-stat">✨ <span>{hero.magic}</span></div>
        <div className="map-topbar-stat">Lv. <span>{hero.level}</span></div>
        <div className="map-topbar-xp">
          <span className="map-topbar-xp-label">XP</span>
          <div className="map-xp-bar">
            <div
              className="map-xp-fill"
              style={{ width: `${(hero.xp / hero.xpToLevelUp) * 100}%` }}
            />
          </div>
          <span className="map-topbar-xp-label">{hero.xp}/{hero.xpToLevelUp}</span>
        </div>
      </div>

      {isRunComplete ? (
        <div className="map-victory">
          <div className="map-victory-icon">🏆</div>
          <h2>Gauntlet Complete!</h2>
          <p>You defeated all 5 monsters!</p>
          <button className="map-btn-primary" onClick={() => goToScreen("mainMenu")}>
            Back to Main Menu
          </button>
        </div>
      ) : (
        <div className="map-body">
          {/* PATH */}
          <div className="map-path-area">
            {reversedMonsters.map((monster, reversedIndex) => {
              const index = runConfig.monsters.length - 1 - reversedIndex;
              const isDefeated = index < currentMonsterIndex;
              const isCurrent = index === currentMonsterIndex;
              const isLocked = index > currentMonsterIndex;
              const stepNumber = index + 1;

              return (
                <div key={monster.id} className="map-node-row">
                  {reversedIndex !== 0 && <div className="map-connector" />}

                  <div
                    className={`map-node ${isDefeated ? "defeated" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                    onClick={() => isCurrent && enterBattle()}
                  >
                    <div className="map-node-icon">
                      {MONSTER_ICONS[monster.id] || "👾"}
                    </div>
                    <div className="map-node-name">{monster.name}</div>
                    {isDefeated && <div className="map-node-check">✓</div>}
                  </div>
                  <div className="map-step-label">{stepNumber}</div>
                </div>
              );
            })}
          </div>

          {/* SIDEBAR */}
          <div className="map-sidebar">
            <div className="map-sidebar-section">
              <div className="map-sidebar-title">Equipped Moves</div>
              {hero.equippedMoves.map((move) => (
                <div key={move.id} className="map-move-badge">
                  <span>{move.name}</span>
                  <div className={`move-type-dot ${move.type}`} />
                </div>
              ))}
              {hero.equippedMoves.length === 0 && (
                <div className="map-no-moves">No moves equipped</div>
              )}
            </div>

            <div className="map-sidebar-buttons">
              <button className="map-btn-primary" onClick={enterBattle}>
                ⚔ Enter Battle
              </button>
              <button className="map-btn-secondary" onClick={() => setShowMoveManager(true)}>
                📋 Manage Moves
              </button>
            </div>
          </div>
        </div>
      )}

      {showMoveManager && (
        <MoveManager onClose={() => setShowMoveManager(false)} />
      )}
    </div>
  );
}

export default Map;