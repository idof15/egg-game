import { useState, useEffect, useCallback } from "react";
import { useGameState } from "./hooks/useGameState";
import HomeScreen from "./components/screens/HomeScreen";
import HatchScreen from "./components/screens/HatchScreen";
import RevealScreen from "./components/screens/RevealScreen";
import CollectionScreen from "./components/screens/CollectionScreen";
import ShopScreen from "./components/screens/ShopScreen";
import MiniGame from "./components/MiniGame";
import { playAchievementSound } from "./utils/sound";
import "./styles/animations.css";

export default function EggGame() {
  const {
    state, dispatch, level, levelXP, shopEffects, prestigeMultiplier,
    elementCounts, synergyEffects, buffEffects, masteryBonuses,
  } = useGameState();
  const [toasts, setToasts] = useState([]);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameType, setMiniGameType] = useState(null);

  // Achievement toast notifications
  useEffect(() => {
    if (state._newAchievements && state._newAchievements.length > 0) {
      if (state.settings.soundEnabled) playAchievementSound();
      const newToasts = state._newAchievements.map(ach => ({
        id: ach.id,
        text: `${ach.icon} ${ach.name}`,
        desc: ach.desc,
      }));
      setToasts(prev => [...prev, ...newToasts]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => !newToasts.find(n => n.id === t.id)));
      }, 3500);
      dispatch({ type: "CLEAR_NOTIFICATIONS" });
    }
  }, [state._newAchievements]);

  // Evolution notification
  useEffect(() => {
    if (state._evolvedAnimal) {
      const evo = state._evolvedAnimal;
      setToasts(prev => [...prev, { id: `evo-${evo.id}`, text: `✨ ${evo.name} evolved!`, desc: evo.desc }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== `evo-${evo.id}`));
      }, 3500);
      dispatch({ type: "CLEAR_NOTIFICATIONS" });
    }
  }, [state._evolvedAnimal]);

  // Quest completion toast
  useEffect(() => {
    if (state._questRewards) {
      const r = state._questRewards;
      const parts = [];
      if (r.coins) parts.push(`+${r.coins} coins`);
      if (r.gems) parts.push(`+${r.gems} gems`);
      setToasts(prev => [...prev, { id: `quest-${Date.now()}`, text: `📜 Quest Complete!`, desc: parts.join(", ") }]);
      setTimeout(() => setToasts(prev => prev.filter(t => !t.id.startsWith("quest-"))), 3500);
      dispatch({ type: "CLEAR_NOTIFICATIONS" });
    }
  }, [state._questRewards]);

  // Mini-game every 5th hatch + 10% random chance
  useEffect(() => {
    if (state.stats.totalHatches > 0 && state.screen === "reveal") {
      const isFifth = state.stats.totalHatches % 5 === 0;
      const randomChance = Math.random() < 0.1;
      if (isFifth || randomChance) {
        // Pick a random mini-game type
        const types = ["quickTap", "patternMemory", "elementMatch", "eggCatch", "luckySpin"];
        const picked = types[Math.floor(Math.random() * types.length)];
        const timer = setTimeout(() => {
          setMiniGameType(picked);
          setShowMiniGame(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [state.stats.totalHatches, state.screen]);

  const handleMiniGameDone = useCallback((reward, perfect = false) => {
    setShowMiniGame(false);
    setMiniGameType(null);
    if (reward > 0) {
      dispatch({ type: "MINI_GAME_REWARD", coins: reward, perfect });
      setToasts(prev => [...prev, { id: `mg-${Date.now()}`, text: `⚡ +${reward} coins!`, desc: perfect ? "Perfect! Mini-game bonus" : "Mini-game bonus" }]);
      setTimeout(() => setToasts(prev => prev.filter(t => !t.id.startsWith("mg-"))), 3000);
    }
  }, [dispatch]);

  // Keyboard shortcuts (Phase 4B)
  useEffect(() => {
    const handleKey = (e) => {
      // Don't capture when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (key === "h") dispatch({ type: "SET_SCREEN", screen: "home" });
      else if (key === "c") dispatch({ type: "SET_SCREEN", screen: "collection" });
      else if (key === "s") dispatch({ type: "SET_SCREEN", screen: "shop" });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch]);

  return (
    <>
      {state.screen === "home" && (
        <HomeScreen
          state={state} dispatch={dispatch} level={level}
          shopEffects={shopEffects} synergyEffects={synergyEffects} buffEffects={buffEffects}
        />
      )}
      {state.screen === "hatch" && (
        <HatchScreen
          state={state} dispatch={dispatch} level={level} levelXP={levelXP}
          shopEffects={shopEffects} synergyEffects={synergyEffects} buffEffects={buffEffects}
        />
      )}
      {state.screen === "reveal" && (
        <RevealScreen state={state} dispatch={dispatch} level={level} shopEffects={shopEffects} buffEffects={buffEffects} />
      )}
      {state.screen === "collection" && (
        <CollectionScreen
          state={state} dispatch={dispatch} level={level} levelXP={levelXP}
          elementCounts={elementCounts} synergyEffects={synergyEffects} masteryBonuses={masteryBonuses}
        />
      )}
      {state.screen === "shop" && (
        <ShopScreen state={state} dispatch={dispatch} />
      )}

      {/* Mini-game overlay */}
      {showMiniGame && (
        <MiniGame
          gameType={miniGameType || "quickTap"}
          level={level}
          gems={state.gems}
          onComplete={handleMiniGameDone}
          onSkip={() => { setShowMiniGame(false); setMiniGameType(null); }}
        />
      )}

      {/* Toast notifications */}
      <div style={{
        position: "fixed", top: 16, right: 16,
        display: "flex", flexDirection: "column", gap: 8,
        zIndex: 2000, pointerEvents: "none",
      }}>
        {toasts.map(toast => (
          <div key={toast.id} role="alert" style={{
            background: "linear-gradient(135deg, rgba(40,30,10,0.95), rgba(20,15,5,0.95))",
            border: "1px solid rgba(255,180,60,0.4)",
            borderRadius: 12, padding: "0.6rem 1rem",
            color: "#ffdd88", fontSize: "0.82rem", fontWeight: 700,
            animation: "toastIn 0.3s ease",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            maxWidth: 260,
          }}>
            <div>{toast.text}</div>
            {toast.desc && <div style={{ color: "rgba(255,180,60,0.5)", fontSize: "0.68rem", fontWeight: 400, marginTop: 2 }}>{toast.desc}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
