import { useGameStore } from "./store/gameStore";
import MainMenu from "./components/MainMenu/MainMenu";
import Map from "./components/Map/Map";
import Battle from "./components/Battle/Battle";
import PostBattle from "./components/PostBattle/PostBattle";
import CharacterSelect from "./components/CharacterSelect/CharacterSelect";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import "./App.css";

function App() {
  const gameScreen = useGameStore((state) => state.gameScreen);
  const isLoading = useGameStore((state) => state.isLoading);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="app">
      {gameScreen === "mainMenu" && <MainMenu />}
      {gameScreen === "characterSelect" && <CharacterSelect />}
      {gameScreen === "map" && <Map />}
      {gameScreen === "battle" && <Battle />}
      {gameScreen === "postBattle" && <PostBattle />}
    </div>
  );
}

export default App;