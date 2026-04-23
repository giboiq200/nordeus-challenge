import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Dohvata konfiguraciju cele runde (5 monstera + hero default)
export const fetchRunConfig = async () => {
  const res = await api.get("/run/config");
  return res.data;
};

// Salje stanje borbe, dobija monster potez
export const fetchMonsterMove = async (battleState) => {
  const res = await api.post("/battle/monster-move", battleState);
  return res.data;
};

// Dohvata nagradu nakon pobede (learned move + xp)
export const fetchBattleReward = async (monsterId) => {
  const res = await api.get(`/battle/reward/${monsterId}`);
  return res.data;
};