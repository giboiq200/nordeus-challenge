import { useEffect, useState } from "react";
import "./LoadingScreen.css";

const MESSAGES = [
  "Waking up the server...",
  "Sharpening swords...",
  "Summoning monsters...",
  "Preparing the gauntlet...",
  "Almost ready...",
];

function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);

    const dotsTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(msgTimer);
      clearInterval(dotsTimer);
    };
  }, []);

  return (
    <div className="loading">
      <div className="loading__bg" />
      <div className="loading__content">
        <div className="loading__sword">⚔</div>
        <h2 className="loading__title">Nordeus Challenge</h2>
        <div className="loading__spinner">
          <div className="loading__spinner-inner" />
        </div>
        <p className="loading__message">{MESSAGES[msgIndex]}{dots}</p>
        <p className="loading__hint">First load may take up to 60 seconds</p>
      </div>
    </div>
  );
}

export default LoadingScreen;