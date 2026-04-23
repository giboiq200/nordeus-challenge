import { useState } from "react";
import "./LevelUp.css";

const CHOICES = [
  {
    key: "health",
    icon: "❤",
    name: "Vitality",
    desc: "Increases maximum Health",
    value: "+20 HP",
    bonus: { health: 20 },
  },
  {
    key: "attack",
    icon: "⚔",
    name: "Strength",
    desc: "Increases physical damage",
    value: "+6 ATK",
    bonus: { attack: 6 },
  },
  {
    key: "defense",
    icon: "🛡",
    name: "Endurance",
    desc: "Reduces incoming physical damage",
    value: "+4 DEF",
    bonus: { defense: 4 },
  },
  {
    key: "magic",
    icon: "✨",
    name: "Arcane Power",
    desc: "Increases magic damage and healing",
    value: "+6 MAG",
    bonus: { magic: 6 },
  },
];

function LevelUp({ newLevel, onConfirm }) {
  const [selected, setSelected] = useState(null);

  function handleConfirm() {
    if (!selected) return;
    onConfirm(selected.bonus);
  }

  return (
    <div className="lu-overlay">
      <div className="lu-card">
        <div className="lu-header">
          <span className="lu-header-icon">⬆</span>
          <h2>LEVEL UP!</h2>
          <p>Level {newLevel - 1} → Level {newLevel} · Choose a stat to boost</p>
        </div>

        <div className="lu-section">
          <div className="lu-section-title">Choose Your Boost</div>
          <div className="lu-choices">
            {CHOICES.map((choice) => (
              <div
                key={choice.key}
                className={`lu-choice ${selected?.key === choice.key ? "selected" : ""}`}
                onClick={() => setSelected(choice)}
              >
                <div className="lu-choice-icon">{choice.icon}</div>
                <div className="lu-choice-info">
                  <div className="lu-choice-name">{choice.name}</div>
                  <div className="lu-choice-desc">{choice.desc}</div>
                </div>
                <div className="lu-choice-value">{choice.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lu-buttons">
          <button
            className={`lu-btn ${selected ? "active" : ""}`}
            onClick={handleConfirm}
            disabled={!selected}
          >
            ✓ Confirm Choice
          </button>
        </div>
      </div>
    </div>
  );
}

export default LevelUp;