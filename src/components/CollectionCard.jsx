import { RARITY_COLORS } from "../data/animals";
import { canEvolve, getEvolutionFor } from "../data/evolutions";
import { getMasteryTier, getMasteryProgress, MASTERY_TIERS } from "../data/mastery";

export default function CollectionCard({ animal, count, onEvolve, masteryHatches = 0 }) {
  const r = RARITY_COLORS[animal.rarity];
  const evo = getEvolutionFor(animal.id);
  const showEvolve = evo && canEvolve(animal.id, count);

  const masteryTier = getMasteryTier(masteryHatches);
  const masteryInfo = getMasteryProgress(masteryHatches);
  const isGoldenMaster = masteryTier >= 4;

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
      border: `1px solid ${isGoldenMaster ? "#ffcc00" : animal.color}${isGoldenMaster ? "88" : "44"}`,
      borderRadius: 12,
      padding: "10px 12px",
      display: "flex", alignItems: "center", gap: 10,
      position: "relative", overflow: "hidden",
      boxShadow: isGoldenMaster ? "0 0 8px rgba(255,204,0,0.2)" : "none",
    }}>
      <div style={{ fontSize: 28 }}>{animal.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>
          {animal.name}
          {animal.evolved && <span style={{ color: "#ff88ff", marginLeft: 4, fontSize: "0.6rem" }}>★</span>}
          {isGoldenMaster && <span style={{ color: "#ffcc00", marginLeft: 4, fontSize: "0.6rem" }}>🥇</span>}
        </div>
        <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: r?.text || "#aaa" }}>{animal.rarity}</div>
        {animal.element && (
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", marginTop: 1 }}>
            {animal.element}
          </div>
        )}
        {/* Mastery progress */}
        {masteryHatches > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 3, overflow: "hidden", maxWidth: 50 }}>
              <div style={{
                height: "100%", width: `${Math.min(masteryInfo.progress, 1) * 100}%`,
                background: masteryTier >= 3 ? "#ffcc00" : masteryTier >= 2 ? "#88dd88" : "#ffaa44",
                borderRadius: 999,
              }} />
            </div>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.48rem" }}>
              {masteryTier > 0 && MASTERY_TIERS[masteryTier - 1]?.icon}
              T{masteryTier}
            </span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        <div style={{
          background: `${animal.color}33`, border: `1px solid ${animal.color}66`,
          borderRadius: 999, padding: "2px 8px",
          color: animal.color, fontSize: "0.72rem", fontWeight: 700,
        }}>×{count}</div>
        {showEvolve && onEvolve && (
          <button
            onClick={(e) => { e.stopPropagation(); onEvolve(animal.id); }}
            style={{
              background: `linear-gradient(135deg, #ff44ff, #aa00ff)`,
              border: "none", borderRadius: 999, padding: "2px 8px",
              color: "#fff", fontSize: "0.58rem", fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.05em",
            }}
          >EVOLVE</button>
        )}
      </div>
    </div>
  );
}
