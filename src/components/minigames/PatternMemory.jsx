import { useState, useEffect, useCallback } from "react";

const EMOJIS = ["🔥", "💧", "🌍", "💨", "⭐", "🌙", "🍀", "💎", "🦋"];

function generatePattern(length) {
  return Array.from({ length }, () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
}

export default function PatternMemory({ level, onComplete, onSkip }) {
  const patternLength = Math.min(4 + Math.floor(level / 8), 7);
  const [phase, setPhase] = useState("ready"); // ready | showing | input | done
  const [pattern, setPattern] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [showIdx, setShowIdx] = useState(-1);
  const [correct, setCorrect] = useState(false);

  const start = useCallback(() => {
    const p = generatePattern(patternLength);
    setPattern(p);
    setPlayerInput([]);
    setPhase("showing");
    setShowIdx(0);
  }, [patternLength]);

  // Show pattern one by one
  useEffect(() => {
    if (phase !== "showing" || showIdx < 0) return;
    if (showIdx >= pattern.length) {
      const timer = setTimeout(() => setPhase("input"), 500);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setShowIdx(i => i + 1), 800);
    return () => clearTimeout(timer);
  }, [phase, showIdx, pattern.length]);

  const handlePick = (emoji) => {
    if (phase !== "input") return;
    const newInput = [...playerInput, emoji];
    setPlayerInput(newInput);

    if (newInput.length === pattern.length) {
      const isCorrect = newInput.every((e, i) => e === pattern[i]);
      setCorrect(isCorrect);
      setPhase("done");
    }
  };

  const reward = correct ? 40 + patternLength * 5 : Math.floor(playerInput.filter((e, i) => e === pattern[i]).length * 8);
  const perfect = correct;

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ color: "#ffdd88", fontSize: "1.2rem", letterSpacing: "0.15em", margin: "0 0 0.5rem", textTransform: "uppercase" }}>
        🧠 Pattern Memory
      </h3>

      {phase === "ready" && (
        <>
          <p style={{ color: "rgba(255,180,60,0.7)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Memorize the {patternLength}-emoji sequence and replay it!
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button onClick={start} style={{
              background: "linear-gradient(135deg, #ff6600, #ff3300)",
              border: "none", borderRadius: 999, padding: "0.7rem 1.5rem",
              color: "#fff", fontSize: "0.9rem", fontFamily: "inherit", cursor: "pointer", fontWeight: 700,
            }}>GO!</button>
            <button onClick={onSkip} style={{
              background: "transparent", border: "1px solid rgba(255,180,60,0.3)",
              borderRadius: 999, padding: "0.7rem 1.5rem",
              color: "rgba(255,180,60,0.6)", fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer",
            }}>Skip</button>
          </div>
        </>
      )}

      {phase === "showing" && (
        <>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", margin: "1rem 0" }}>
            {pattern.map((emoji, i) => (
              <div key={i} style={{
                fontSize: "2rem", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                background: i < showIdx ? "rgba(255,180,60,0.15)" : "rgba(255,255,255,0.05)",
                borderRadius: 8, border: i === showIdx - 1 ? "2px solid #ffaa44" : "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease",
              }}>
                {i < showIdx ? emoji : ""}
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.75rem" }}>Memorize!</p>
        </>
      )}

      {phase === "input" && (
        <>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
            {pattern.map((_, i) => (
              <div key={i} style={{
                fontSize: "1.8rem", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                background: playerInput[i] ? "rgba(255,180,60,0.15)" : "rgba(255,255,255,0.05)",
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
              }}>
                {playerInput[i] || "?"}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4rem", margin: "0.8rem 0" }}>
            {EMOJIS.map(emoji => (
              <button key={emoji} onClick={() => handlePick(emoji)} style={{
                fontSize: "1.5rem", width: 44, height: 44,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,180,60,0.2)",
                borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{emoji}</button>
            ))}
          </div>
          <p style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.75rem" }}>
            {playerInput.length}/{pattern.length} picked
          </p>
        </>
      )}

      {phase === "done" && (
        <>
          <div style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>{correct ? "🎉" : "😅"}</div>
          <p style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.3rem" }}>
            {correct ? "Perfect memory!" : "Not quite..."}
          </p>
          <p style={{ color: "#ffdd44", fontSize: "0.9rem", marginBottom: "1rem" }}>+{reward} coins</p>
          <button onClick={() => onComplete(reward, perfect)} style={{
            background: "linear-gradient(135deg, #ff6600, #ff3300)",
            border: "none", borderRadius: 999, padding: "0.7rem 1.5rem",
            color: "#fff", fontSize: "0.9rem", fontFamily: "inherit", cursor: "pointer", fontWeight: 700,
          }}>Collect</button>
        </>
      )}
    </div>
  );
}
