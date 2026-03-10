import { useState, useEffect, useCallback } from "react";
import EggSVG from "../EggSVG";
import { ANIMALS, getAvailableAnimals } from "../../data/animals";
import { EGG_TYPES } from "../../data/eggTypes";
import { pickEgg } from "../../utils/pickEgg";
import QuestPanel from "../QuestPanel";

export default function HomeScreen({ state, dispatch, level, shopEffects, synergyEffects, buffEffects }) {
  const [showEggSelect, setShowEggSelect] = useState(false);

  const totalRarityBoost = shopEffects.rarityBoost + (synergyEffects?.rarityBoost || 0) + (buffEffects?.rarityBoost || 0);

  const startHatch = useCallback((eggType) => {
    const picked = pickEgg(state.collection, level, eggType, totalRarityBoost);
    dispatch({ type: "START_HATCH", animal: picked, eggType });
    setShowEggSelect(false);
  }, [state.collection, level, dispatch, totalRarityBoost]);

  // Keyboard egg quick-select (1-4)
  useEffect(() => {
    const handleKey = (e) => {
      if (!showEggSelect) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= EGG_TYPES.length) {
        const egg = EGG_TYPES[num - 1];
        const canAfford = egg.cost === 0 || state.coins >= egg.cost;
        if (canAfford) startHatch(egg);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showEggSelect, state.coins, startHatch]);

  const available = getAvailableAnimals(level);
  const totalAnimals = available.length;

  // Recent hatches strip
  const recentHatches = state.recentHatches || [];

  return (
    <div style={{
      minHeight: "100vh", background: "radial-gradient(ellipse at 50% 30%, #180d02 0%, #050300 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Palatino Linotype', Palatino, serif",
      padding: "2rem", boxSizing: "border-box", position: "relative", overflow: "hidden",
      animation: "screenFadeIn 0.3s ease",
    }}>
      {/* Stars */}
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} style={{
          position: "fixed", borderRadius: "50%", background: "#fff",
          width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2,
          left: `${(i * 41 + 7) % 100}%`, top: `${(i * 57 + 11) % 100}%`,
          animation: `starTwinkle ${2 + (i % 5) * 0.7}s ease-in-out infinite`,
          animationDelay: `${(i * 0.23) % 4}s`,
        }} />
      ))}

      {/* Prestige badge */}
      {state.prestigeCount > 0 && (
        <div style={{
          position: "absolute", top: "3%", right: "4%",
          background: "linear-gradient(135deg, #ff44ff22, #aa00ff22)",
          border: "1px solid #ff44ff44",
          borderRadius: 999, padding: "0.3rem 0.8rem",
          color: "#ff88ff", fontSize: "0.7rem", letterSpacing: "0.1em",
        }}>⭐ Prestige {state.prestigeCount}</div>
      )}

      {/* Currency display */}
      <div style={{
        position: "absolute", top: "3%", left: "4%",
        display: "flex", gap: "0.8rem",
      }}>
        <span style={{ color: "#ffdd44", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
          🪙 {state.coins}
        </span>
        <span style={{ color: "#aa88ff", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
          💎 {state.gems}
        </span>
      </div>

      {/* Daily streak */}
      {state._dailyReward && (
        <div style={{
          position: "absolute", top: "8%",
          background: "linear-gradient(135deg, #44220088, #22110088)",
          border: "1px solid #ffaa4444",
          borderRadius: 12, padding: "0.5rem 1rem",
          color: "#ffdd88", fontSize: "0.75rem", textAlign: "center",
          animation: "fadeUp 0.5s ease",
        }}>
          📅 Day {state._dailyReward.streak} streak! +{state._dailyReward.coins} coins
          {state._dailyReward.gems > 0 && ` +${state._dailyReward.gems} gems`}
        </div>
      )}

      <div style={{ animation: "eggBob 3s ease-in-out infinite", marginBottom: "2rem" }}>
        <EggSVG crackLevel={0} wobble={0} />
      </div>

      <h1 style={{
        fontSize: "clamp(2rem, 6vw, 3.2rem)", letterSpacing: "0.2em",
        textTransform: "uppercase", margin: "0 0 0.2em",
        background: "linear-gradient(90deg, #ffaa44, #ffdd88, #ffaa44)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        animation: "shimmer 2.5s ease-in-out infinite",
      }}>EGG HATCHER</h1>

      <p style={{ color: "rgba(220,180,80,0.6)", letterSpacing: "0.25em", fontSize: "0.78rem", marginBottom: "1.2rem", textTransform: "uppercase" }}>
        Crack · Collect · Complete
      </p>

      {/* Recent hatches strip */}
      {recentHatches.length > 0 && (
        <div style={{
          display: "flex", gap: "0.3rem", marginBottom: "1rem",
          background: "rgba(255,255,255,0.03)", borderRadius: 999,
          padding: "0.3rem 0.8rem", border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {recentHatches.map((emoji, i) => (
            <span key={i} style={{ fontSize: "1.1rem", opacity: 0.5 + (i / recentHatches.length) * 0.5 }}>{emoji}</span>
          ))}
        </div>
      )}

      {/* Animal preview */}
      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem" }}>
        {available.slice(0, 5).map((a, i) => (
          <div key={a.id} style={{
            fontSize: "2rem", animation: `eggBob ${2.2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`, filter: `drop-shadow(0 0 8px ${a.glow})`,
            opacity: 0.85,
          }}>{a.emoji}</div>
        ))}
        <div style={{ fontSize: "2rem", opacity: 0.5 }}>❓</div>
      </div>

      {/* Main hatch button */}
      <button className="home-btn" onClick={() => setShowEggSelect(true)} style={{
        background: "linear-gradient(135deg, #ff6600, #ff3300)",
        border: "none", borderRadius: 999, padding: "1rem 3rem",
        color: "#fff", fontSize: "1.1rem", letterSpacing: "0.18em",
        fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
        boxShadow: "0 0 30px #ff440066, 0 4px 20px rgba(0,0,0,0.5)",
        fontWeight: 700, minHeight: 44, touchAction: "manipulation",
      }}
        role="button" aria-label="Hatch an egg"
      >🥚 Hatch Egg</button>

      {/* Egg selection popup */}
      {showEggSelect && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowEggSelect(false)}>
          <div style={{
            background: "linear-gradient(135deg, #1a1200, #0a0800)",
            border: "1px solid rgba(255,180,60,0.3)",
            borderRadius: 16, padding: "1.5rem", maxWidth: 360, width: "90%",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: "#ffdd88", fontSize: "1rem", letterSpacing: "0.15em", margin: "0 0 1rem", textTransform: "uppercase", textAlign: "center" }}>
              Choose Your Egg
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {EGG_TYPES.map((egg, idx) => {
                const canAfford = egg.cost === 0 || state.coins >= egg.cost;
                return (
                  <button
                    key={egg.id}
                    onClick={() => canAfford && startHatch(egg)}
                    disabled={!canAfford}
                    style={{
                      background: canAfford
                        ? `linear-gradient(135deg, ${egg.color}22, ${egg.glow}11)`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${canAfford ? egg.color + "44" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 12, padding: "0.7rem 1rem",
                      display: "flex", alignItems: "center", gap: "0.8rem",
                      cursor: canAfford ? "pointer" : "not-allowed",
                      opacity: canAfford ? 1 : 0.4,
                      fontFamily: "inherit", textAlign: "left",
                      minHeight: 44, touchAction: "manipulation",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{egg.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700 }}>{egg.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>
                        {egg.desc}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ color: egg.cost === 0 ? "#88dd88" : "#ffdd44", fontSize: "0.75rem", fontWeight: 700 }}>
                        {egg.cost === 0 ? "FREE" : `🪙${egg.cost}`}
                      </span>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.55rem" }}>
                        [{idx + 1}]
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quest panel */}
      {state.questProgress && (
        <div style={{ width: "min(360px, 90vw)", marginTop: "1rem" }}>
          <QuestPanel quests={state.questProgress} />
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.8rem" }}>
        {state.collection.length > 0 && (
          <button className="home-btn" onClick={() => dispatch({ type: "SET_SCREEN", screen: "collection" })} style={{
            background: "transparent",
            border: "1px solid rgba(255,180,60,0.3)", borderRadius: 999,
            padding: "0.7rem 1.5rem", color: "rgba(255,180,60,0.8)",
            fontSize: "0.82rem", letterSpacing: "0.12em",
            fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
            minHeight: 44, touchAction: "manipulation",
          }}>📖 Collection ({state.collection.length}/{totalAnimals})</button>
        )}
        <button className="home-btn" onClick={() => dispatch({ type: "SET_SCREEN", screen: "shop" })} style={{
          background: "transparent",
          border: "1px solid rgba(100,200,100,0.3)", borderRadius: 999,
          padding: "0.7rem 1.5rem", color: "rgba(100,200,100,0.8)",
          fontSize: "0.82rem", letterSpacing: "0.12em",
          fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
          minHeight: 44, touchAction: "manipulation",
        }}>🛒 Shop</button>
      </div>

      <p style={{ color: "rgba(255,180,60,0.35)", fontSize: "0.68rem", marginTop: "1rem", letterSpacing: "0.1em" }}>
        {totalAnimals} creatures to discover · Level {level} · [H]ome [C]ollection [S]hop
      </p>
    </div>
  );
}
