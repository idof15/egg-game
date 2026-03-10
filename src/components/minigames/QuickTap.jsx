import { useState, useEffect, useRef, useCallback } from "react";

export default function QuickTap({ level, onComplete, onSkip }) {
  const [phase, setPhase] = useState("ready");
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5000);
  const target = 20 + Math.floor(level / 5) * 2; // scales with level
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = useCallback(() => {
    setPhase("playing");
    setTaps(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 5000 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setPhase("done");
      }
    }, 50);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleTap = useCallback(() => {
    if (phase !== "playing") return;
    setTaps(t => {
      const next = t + 1;
      if (next >= target) {
        clearInterval(timerRef.current);
        setPhase("done");
      }
      return next;
    });
  }, [phase, target]);

  const reward = taps >= target ? 50 : Math.floor((taps / target) * 30);
  const perfect = taps >= target;

  return (
    <div onClick={phase === "playing" ? handleTap : undefined} style={{ textAlign: "center" }}>
      <h3 style={{ color: "#ffdd88", fontSize: "1.2rem", letterSpacing: "0.15em", margin: "0 0 0.5rem", textTransform: "uppercase" }}>
        ⚡ Quick Tap!
      </h3>

      {phase === "ready" && (
        <>
          <p style={{ color: "rgba(255,180,60,0.7)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Tap {target} times in 5 seconds for bonus coins!
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
          <div style={{ color: "#fff", fontSize: "3rem", fontWeight: 700, margin: "0.5rem 0" }}>
            {taps}/{target}
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 8, overflow: "hidden", marginBottom: "0.5rem" }}>
            <div style={{
              height: "100%", width: `${(timeLeft / 5000) * 100}%`,
              background: timeLeft < 1500 ? "#ff3300" : "#ffaa00",
              borderRadius: 999, transition: "width 0.05s linear",
            }} />
          </div>
          <p style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.75rem" }}>
            TAP ANYWHERE! {(timeLeft / 1000).toFixed(1)}s
          </p>
        </>
      )}

      {phase === "done" && (
        <>
          <div style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>{perfect ? "🎉" : "⏰"}</div>
          <p style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.3rem" }}>
            {perfect ? "Amazing!" : `${taps}/${target} taps`}
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
