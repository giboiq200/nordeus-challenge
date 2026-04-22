import { useGameStore } from "../../store/gameStore";
import "./MoveManager.css";

function MoveManager({ onClose }) {
  const { hero, equipMove } = useGameStore();

  return (
    <div className="move-manager-overlay" onClick={onClose}>
      <div className="move-manager" onClick={(e) => e.stopPropagation()}>
        <div className="move-manager__header">
          <h2>📋 Move Manager</h2>
          <button className="move-manager__close" onClick={onClose}>✕</button>
        </div>

        <p className="move-manager__hint">
          Equip up to 4 moves. Click to equip/unequip.
        </p>

        <div className="move-manager__section">
          <h3>Equipped ({hero.equippedMoves.length}/4)</h3>
          <div className="move-manager__moves">
            {hero.equippedMoves.map((move) => (
              <div
                key={move.id}
                className="move-card equipped"
                onClick={() => equipMove(move)}
              >
                <div className="move-card__name">{move.name}</div>
                <div className="move-card__type">{move.type}</div>
                <div className="move-card__desc">{move.description}</div>
                <div className="move-card__unequip">Click to unequip</div>
              </div>
            ))}
          </div>
        </div>

        <div className="move-manager__section">
          <h3>All Learned Moves ({hero.learnedMoves.length})</h3>
          <div className="move-manager__moves">
            {hero.learnedMoves.map((move) => {
              const isEquipped = hero.equippedMoves.some((m) => m.id === move.id);
              const isFull = hero.equippedMoves.length >= 4;

              return (
                <div
                  key={move.id}
                  className={`move-card ${isEquipped ? "equipped" : ""} ${!isEquipped && isFull ? "disabled" : ""}`}
                  onClick={() => (!isFull || isEquipped) && equipMove(move)}
                >
                  <div className="move-card__name">{move.name}</div>
                  <div className="move-card__type">{move.type}</div>
                  <div className="move-card__desc">{move.description}</div>
                  {isEquipped && <div className="move-card__badge">✅ Equipped</div>}
                  {!isEquipped && isFull && <div className="move-card__badge">🔒 Full</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoveManager;