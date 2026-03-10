import { useEffect } from "react";
import { RARITY_COLORS } from "../../data/animals";
import { pickEgg } from "../../utils/pickEgg";
import { playRevealSound } from "../../utils/sound";

export default function RevealScreen({ state, dispatch, level, shopEffects, buffEffects }) {
  const animal = state.currentAnimal;
  const rewards = state._lastRewards;

  useEffect(() => {
    if (animal && state.settings.soundEnabled) {
      playRevealSound(animal.rarity);
    }
    if (animal && state.settings.hapticEnabled && navigator.vibrate) {
      if (animal.rarity === "MYTHIC" || animal.rarity === "LEGENDARY") {
        navigator.vibrate([50, 100, 50, 100, 100]);
      } else {
        navigator.vibrate(40);
      }
    }
  }, []);

  if (!animal) return null;

  const r = RARITY_COLORS[animal.rarity];
  const isNew = rewards?.isNew;

  const totalRarityBoost = shopEffects.rarityBoost + (buffEffects?.rarityBoost || 0);

  const startHatch = (eggType) => {
    const picked = pickEgg(state.collection, level, eggType, totalRarityBoost);
    dispatch({ type: "START_HATCH", animal: picked, eggType });
  };

  return (
    <div style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: `radial-gradient(ellipse at center, ${animal.bg[0]} 0%, ${animal.bg[1]} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Palatino Linotype', Palatino, serif",
      animation: "screenFadeIn 0.3s ease",
    }}>
      {/* Legendary/Mythic rays */}
      {(animal.rarity === "LEGENDARY" || animal.rarity === "MYTHIC") && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          width: "600px", height: "600px",
          background: `conic-gradient(from 0deg, transparent 0%, ${animal.glow}22 10%, transparent 20%)`,
          animation: "legendaryRays 8s linear infinite",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Stars */}
      {Array.from({ length: 25 }, (_, i) => (
        <div key={i} style={{
          position: "fixed", borderRadius: "50%", background: i % 3 === 0 ? animal.color : "#fff",
          width: 2, height: 2,
          left: `${(i * 41 + 7) % 100}%`, top: `${(i * 57 + 11) % 100}%`,
          opacity: 0.3 + Math.random() * 0.5,
        }} />
      ))}

      {/* Imperfect hatch warning */}
      {rewards?.imperfect && (
        <div style={{
          position: "absolute", top: "4%",
          background: "rgba(255,50,50,0.15)",
          border: "1px solid rgba(255,50,50,0.3)",
          borderRadius: 999, padding: "0.3rem 1rem",
          color: "#ff8888", fontSize: "0.65rem", letterSpacing: "0.1em",
          animation: "fadeUp 0.5s ease",
        }}>🌡️ Imperfect Hatch — Reduced rewards</div>
      )}

      {/* NEW badge */}
      {isNew && (
        <div style={{
          position: "absolute", top: "8%",
          background: `linear-gradient(135deg, ${r.from}, ${r.to})`,
          borderRadius: 999, padding: "0.4rem 1.4rem",
          color: "#fff", fontSize: "0.75rem", letterSpacing: "0.2em",
          fontWeight: 700, textTransform: "uppercase",
          boxShadow: `0 0 20px ${animal.glow}88`,
          animation: "fadeUp 0.5s ease 0.2s both",
        }}>✨ NEW!</div>
      )}

      {/* Animal emoji */}
      <div aria-live="polite" style={{
        fontSize: "clamp(7rem, 20vw, 11rem)", lineHeight: 1,
        animation: "hatchPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, animalFloat 3s ease-in-out 0.8s infinite",
        filter: `drop-shadow(0 0 30px ${animal.glow}) drop-shadow(0 0 60px ${animal.color}88)`,
        "--gc": animal.glow,
      }}>
        {animal.emoji}
      </div>

      {/* Info */}
      <div style={{ textAlign: "center", padding: "0 1.5rem", animation: "fadeUp 0.5s ease 0.4s both", opacity: 0 }}>
        <h2 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)", letterSpacing: "0.15em",
          margin: "1rem 0 0.2rem", textTransform: "uppercase",
          color: (animal.rarity === "LEGENDARY" || animal.rarity === "MYTHIC") ? "transparent" : animal.color,
          background: (animal.rarity === "LEGENDARY" || animal.rarity === "MYTHIC")
            ? `linear-gradient(90deg, ${animal.color}, #fff, ${animal.color})`
            : "none",
          WebkitBackgroundClip: (animal.rarity === "LEGENDARY" || animal.rarity === "MYTHIC") ? "text" : "none",
          WebkitTextFillColor: (animal.rarity === "LEGENDARY" || animal.rarity === "MYTHIC") ? "transparent" : animal.color,
          backgroundSize: "200%",
          animation: (animal.rarity === "LEGENDARY" || animal.rarity === "MYTHIC") ? "shimmer 1.5s ease-in-out infinite" : "none",
        }}>{animal.name}</h2>

        <div style={{
          display: "inline-block",
          background: `linear-gradient(135deg, ${r.from}44, ${r.to}44)`,
          border: `1px solid ${r.from}88`,
          borderRadius: 999, padding: "0.25rem 1rem",
          color: r.text, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase",
          marginBottom: "0.6rem",
        }}>{animal.rarity}</div>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontStyle: "italic", marginBottom: "0.4rem" }}>{animal.desc}</p>

        {/* Rewards */}
        {rewards && (
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", marginBottom: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ color: animal.color, fontSize: "0.8rem" }}>+{rewards.xp} XP</span>
            <span style={{ color: "#ffdd44", fontSize: "0.8rem" }}>+{rewards.coins} 🪙</span>
            {rewards.gems > 0 && <span style={{ color: "#aa88ff", fontSize: "0.8rem" }}>+{rewards.gems} 💎</span>}
          </div>
        )}

        {animal.element && (
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
            Element: {animal.element}
          </span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.5s ease 0.6s both", opacity: 0, marginTop: "1.5rem" }}>
        <button className="rev-btn" onClick={() => startHatch(state.selectedEggType)} style={{
          background: `linear-gradient(135deg, ${animal.color}, ${animal.glow})`,
          border: "none", borderRadius: 999, padding: "0.85rem 2rem",
          color: "#fff", fontSize: "0.9rem", letterSpacing: "0.15em",
          fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
          fontWeight: 700, transition: "transform 0.15s ease",
          boxShadow: `0 0 25px ${animal.glow}66`,
          minHeight: 44, touchAction: "manipulation",
        }}>🥚 Hatch Again</button>
        <button className="rev-btn" onClick={() => dispatch({ type: "SET_SCREEN", screen: "collection" })} style={{
          background: "transparent", border: `1px solid ${animal.color}66`,
          borderRadius: 999, padding: "0.85rem 2rem",
          color: animal.color, fontSize: "0.9rem", letterSpacing: "0.15em",
          fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
          transition: "transform 0.15s ease",
          minHeight: 44, touchAction: "manipulation",
        }}>📖 Collection</button>
      </div>
    </div>
  );
}
