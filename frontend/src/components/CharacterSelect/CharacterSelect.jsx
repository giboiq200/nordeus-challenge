import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import "./CharacterSelect.css";

import hero1 from "../../assets/sprites/hero1.png";
import hero2 from "../../assets/sprites/hero2.png";
import hero3 from "../../assets/sprites/hero3.png";
import hero4 from "../../assets/sprites/hero4.png";
import hero5 from "../../assets/sprites/hero5.png";

const HEROES = [
  { key: "hero1", name: "Ironclad",  sprite: hero1 },
  { key: "hero2", name: "Rogue",     sprite: hero2 },
  { key: "hero3", name: "Crusader",  sprite: hero3 },
  { key: "hero4", name: "Ranger",    sprite: hero4 },
  { key: "hero5", name: "Knight",    sprite: hero5 },
];

function CharacterSelect() {
  const { selectHero, goToScreen } = useGameStore();
  const [selected, setSelected] = useState(null);

  function handleConfirm() {
    if (!selected) return;
    selectHero(selected.key, selected.name);
  }

  return (
    <div className="cs">
      <div className="cs__bg" />

      <div className="cs__content">
        <div className="cs__header">
          <div className="cs__corner tl"/><div className="cs__corner tr"/>
          <p className="cs__subtitle">— Choose Your Hero —</p>
          <h1 className="cs__title">WHO WILL YOU BE?</h1>
        </div>

        <div className="cs__heroes">
          {HEROES.map((hero) => {
            const isSelected = selected?.key === hero.key;
            return (
              <div
                key={hero.key}
                className={`cs__hero-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelected(hero)}
              >
                <div className="cs__hero-pedestal">
                  <div className={`cs__hero-glow glow--${hero.key}`} />
                  <img
                    src={hero.sprite}
                    alt={hero.name}
                    className="cs__hero-sprite"
                  />
                </div>
                <div className="cs__hero-name">{hero.name}</div>
                {isSelected && <div className="cs__hero-selected-badge">✓</div>}
              </div>
            );
          })}
        </div>

        <div className="cs__footer">
          {selected ? (
            <div className="cs__selected-info">
              <span className="cs__selected-label">Selected:</span>
              <span className="cs__selected-name">{selected.name}</span>
            </div>
          ) : (
            <p className="cs__hint">Click a hero to select</p>
          )}

          <div className="cs__buttons">
            <button
              className="cs__btn-confirm"
              onClick={handleConfirm}
              disabled={!selected}
            >
              ▶ Begin Gauntlet
            </button>
            <button
              className="cs__btn-back"
              onClick={() => goToScreen("mainMenu")}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterSelect;