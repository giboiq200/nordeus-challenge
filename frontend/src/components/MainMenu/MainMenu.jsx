import { useGameStore } from "../../store/gameStore";
import SwordLogo from "../../assets/SwordLogo";
import "./MainMenu.css";

function MainMenu() {
  const startNewRun = useGameStore((state) => state.startNewRun);

  return (
    <div className="main-menu">
      <div className="main-menu__bg">
        <div className="main-menu__stars"/>
        <div className="main-menu__mountains"/>
      </div>

      <div className="main-menu__content">
        <div className="main-menu__logo-area">
          <div className="main-menu__corner tl"/>
          <div className="main-menu__corner tr"/>

          <h1 className="main-menu__title">Nordeus</h1>
          <h2 className="main-menu__subtitle">Challenge</h2>
          <div className="main-menu__divider">
            <div className="main-menu__divider-line"/>
            <div className="main-menu__divider-gem"/>
            <div className="main-menu__divider-line"/>
          </div>
          <p className="main-menu__tagline">Face 5 monsters. Survive them all.</p>
        </div>

        <div className="main-menu__sword">
          <SwordLogo/>
        </div>

        <div className="main-menu__buttons">
          <button className="main-menu__btn-start" onClick={startNewRun}>
            ▶  START NEW RUN
          </button>
          <button className="main-menu__btn-exit" onClick={() => window.close()}>
            ✕  EXIT
          </button>
        </div>

        <div className="main-menu__corner bl"/>
        <div className="main-menu__corner br"/>
      </div>
    </div>
  );
}

export default MainMenu;