const QUEST_ICONS = { daily: "📋", weekly: "📅", challenge: "🏆" };
const QUEST_LABELS = { daily: "Daily", weekly: "Weekly", challenge: "Challenge" };

export default function QuestPanel({ quests }) {
  if (!quests) return null;

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
        Quests
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {["daily", "weekly", "challenge"].map(slot => {
          const q = quests[slot];
          if (!q) return null;
          const progress = Math.min(q.progress / q.target, 1);
          return (
            <div key={slot} style={{
              background: q.completed ? "rgba(100,200,100,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${q.completed ? "rgba(100,200,100,0.3)" : "rgba(255,180,60,0.15)"}`,
              borderRadius: 10, padding: "0.5rem 0.7rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.9rem" }}>{QUEST_ICONS[slot]}</span>
                <span style={{ color: "rgba(255,180,60,0.5)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {QUEST_LABELS[slot]}
                </span>
                {q.completed && <span style={{ color: "#88dd88", fontSize: "0.6rem", fontWeight: 700 }}>DONE</span>}
              </div>
              <div style={{ color: "#fff", fontSize: "0.75rem", marginBottom: "0.3rem" }}>{q.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 5, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${progress * 100}%`,
                    background: q.completed ? "#88dd88" : "#ffaa44",
                    borderRadius: 999, transition: "width 0.3s ease",
                  }} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", minWidth: 40, textAlign: "right" }}>
                  {q.progress}/{q.target}
                </span>
              </div>
              {!q.completed && q.reward && (
                <div style={{ color: "rgba(255,180,60,0.4)", fontSize: "0.58rem", marginTop: "0.2rem" }}>
                  Reward: {q.reward.coins ? `${q.reward.coins} coins` : ""}{q.reward.coins && q.reward.gems ? " + " : ""}{q.reward.gems ? `${q.reward.gems} gems` : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
