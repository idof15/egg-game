import { useState, useEffect, useRef, useCallback } from "react";

const ELEMENT_EMOJIS = ["🔥", "💧", "🌍", "💨", "✨", "🌑"];

function generateGrid() {
  // 3x3 grid = 9 cells, 4 pairs + 1 dummy
  const selected = [];
  const shuffled = [...ELEMENT_EMOJIS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 4; i++) selected.push(shuffled[i], shuffled[i]);
  selected.push(shuffled[4]); // odd one out
  // Shuffle
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }
  return selected;
}

export default function ElementMatch({ level, onComplete, onSkip }) {
  const [phase, setPhase] = useState("ready");
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [matched, setMatched] = useState([]);
  const [selected, setSelected] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15000);
  const [pairs, setPairs] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = useCallback(() => {
    setGrid(generateGrid());
    setRevealed([]);
    setMatched([]);
    setSelected([]);
    setPairs(0);
    setPhase("playing");
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 15000 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setPhase("done");
      }
    }, 100);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleClick = (idx) => {
    if (phase !== "playing" || matched.includes(idx) || selected.includes(idx) || selected.length >= 2) return;

    const newSelected = [...selected, idx];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [a, b] = newSelected;
      if (grid[a] === grid[b]) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setPairs(p => p + 1);
        setSelected([]);
        if (newMatched.length >= 8) { // 4 pairs
          clearInterval(timerRef.current);
          setTimeout(() => setPhase("done"), 300);
        }
      } else {
        setTimeout(() => setSelected([]), 600);
      }
    }
  };

  const perfect = pairs >= 4;
  const reward = perfect ? 60 : pairs * 12;

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ color: "#ffdd88", fontSize: "1.2rem", letterSpacing: "0.15em", margin: "0 0 0.5rem", textTransform: "uppercase" }}>
        🔮 Element Match
      </h3>

      {phase === "ready" && (
        <>
          <p style={{ color: "rgba(255,180,60,0.7)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Find all 4 matching pairs in the grid!
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

      {phase === "playing" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, maxWidth: 180, margin: "0.8rem auto" }}>
            {grid.map((emoji, idx) => {
              const isMatched = matched.includes(idx);
              const isSelected = selected.includes(idx);
              const show = isMatched || isSelected;
              return (
                <button key={idx} onClick={() => handleClick(idx)} style={{
                  width: 52, height: 52, fontSize: "1.5rem",
                  background: isMatched ? "rgba(100,200,100,0.2)" : isSelected ? "rgba(255,180,60,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isMatched ? "rgba(100,200,100,0.4)" : isSelected ? "rgba(255,180,60,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8, cursor: isMatched ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}>{show ? emoji : "❓"}</button>
              );
            })}
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 6, overflow: "hidden", maxWidth: 180, margin: "0.5rem auto" }}>
            <div style={{
              height: "100%", width: `${(timeLeft / 15000) * 100}%`,
              background: timeLeft < 4000 ? "#ff3300" : "#ffaa00",
              borderRadius: 999,
            }} />
          </div>
          <p style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.7rem" }}>{pairs}/4 pairs · {(timeLeft / 1000).toFixed(1)}s</p>
        </>
      )}

      {phase === "done" && (
        <>
          <div style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>{perfect ? "🎉" : "⏰"}</div>
          <p style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.3rem" }}>
            {perfect ? "All pairs found!" : `${pairs}/4 pairs`}
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
