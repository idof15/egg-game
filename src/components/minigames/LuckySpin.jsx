import { useState, useCallback } from "react";

const PRIZES = [
  { label: "50 coins", emoji: "🪙", weight: 30, reward: { coins: 50 } },
  { label: "100 coins", emoji: "💰", weight: 15, reward: { coins: 100 } },
  { label: "200 coins", emoji: "🤑", weight: 5, reward: { coins: 200 } },
  { label: "1 gem", emoji: "💎", weight: 20, reward: { coins: 0, gems: 1 } },
  { label: "3 gems", emoji: "💎💎", weight: 8, reward: { coins: 0, gems: 3 } },
  { label: "Nothing", emoji: "💨", weight: 22, reward: { coins: 0 } },
];

function pickPrize() {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const prize of PRIZES) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }
  return PRIZES[0];
}

export default function LuckySpin({ level, gems, onComplete, onSkip }) {
  const cost = Math.min(3, Math.max(1, Math.floor(level / 10) + 1));
  const [phase, setPhase] = useState("ready"); // ready | spinning | done
  const [prize, setPrize] = useState(null);
  const [spinAngle, setSpinAngle] = useState(0);
  const canAfford = gems >= cost;

  const spin = useCallback(() => {
    if (!canAfford) return;
    const won = pickPrize();
    setPrize(won);
    setSpinAngle(720 + Math.random() * 360);
    setPhase("spinning");
    setTimeout(() => setPhase("done"), 2000);
  }, [canAfford]);

  const reward = prize?.reward?.coins || 0;

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ color: "#ffdd88", fontSize: "1.2rem", letterSpacing: "0.15em", margin: "0 0 0.5rem", textTransform: "uppercase" }}>
        🎰 Lucky Spin!
      </h3>

      {phase === "ready" && (
        <>
          <p style={{ color: "rgba(255,180,60,0.7)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            Spend {cost} gems for a chance at prizes!
          </p>
          <div style={{ fontSize: "4rem", margin: "1rem 0", animation: "eggBob 2s ease-in-out infinite" }}>🎰</div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button onClick={spin} disabled={!canAfford} style={{
              background: canAfford ? "linear-gradient(135deg, #aa44ff, #6600cc)" : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: 999, padding: "0.7rem 1.5rem",
              color: canAfford ? "#fff" : "rgba(255,255,255,0.3)",
              fontSize: "0.9rem", fontFamily: "inherit", cursor: canAfford ? "pointer" : "not-allowed", fontWeight: 700,
            }}>💎{cost} Spin!</button>
            <button onClick={onSkip} style={{
              background: "transparent", border: "1px solid rgba(255,180,60,0.3)",
              borderRadius: 999, padding: "0.7rem 1.5rem",
              color: "rgba(255,180,60,0.6)", fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer",
            }}>Skip</button>
          </div>
          {!canAfford && <p style={{ color: "#ff6644", fontSize: "0.7rem", marginTop: "0.5rem" }}>Not enough gems</p>}
        </>
      )}

      {phase === "spinning" && (
        <div style={{
          fontSize: "5rem", margin: "2rem 0",
          transform: `rotate(${spinAngle}deg)`,
          transition: "transform 2s cubic-bezier(0.2, 0.8, 0.3, 1)",
        }}>🎰</div>
      )}

      {phase === "done" && prize && (
        <>
          <div style={{ fontSize: "3rem", margin: "0.5rem 0" }}>{prize.emoji}</div>
          <p style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "0.3rem", fontWeight: 700 }}>
            {prize.label}!
          </p>
          {reward > 0 && <p style={{ color: "#ffdd44", fontSize: "0.9rem" }}>+{reward} coins</p>}
          {prize.reward?.gems > 0 && <p style={{ color: "#aa88ff", fontSize: "0.9rem" }}>+{prize.reward.gems} gems</p>}
          <button onClick={() => onComplete(reward, false, prize.reward?.gems || 0, cost)} style={{
            background: "linear-gradient(135deg, #ff6600, #ff3300)",
            border: "none", borderRadius: 999, padding: "0.7rem 1.5rem",
            color: "#fff", fontSize: "0.9rem", fontFamily: "inherit", cursor: "pointer", fontWeight: 700,
            marginTop: "1rem",
          }}>Collect</button>
        </>
      )}
    </div>
  );
}
