import { useState, useEffect, useRef, useCallback } from "react";

export default function EggCatch({ level, onComplete, onSkip }) {
  const [phase, setPhase] = useState("ready");
  const [eggs, setEggs] = useState([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5000);
  const nextIdRef = useRef(0);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = useCallback(() => {
    setPhase("playing");
    setCaught(0);
    setMissed(0);
    setEggs([]);
    nextIdRef.current = 0;
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 5000 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        clearInterval(spawnRef.current);
        setPhase("done");
      }
    }, 50);

    const spawnRate = Math.max(400, 800 - level * 20);
    spawnRef.current = setInterval(() => {
      const id = nextIdRef.current++;
      const x = 10 + Math.random() * 80; // % from left
      setEggs(prev => [...prev, { id, x, spawned: Date.now() }]);
    }, spawnRate);
  }, [level]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(spawnRef.current);
    };
  }, []);

  // Remove eggs that fall off (after 1.5s)
  useEffect(() => {
    if (phase !== "playing") return;
    const cleanup = setInterval(() => {
      const now = Date.now();
      setEggs(prev => {
        const remaining = [];
        let newMissed = 0;
        prev.forEach(egg => {
          if (now - egg.spawned > 1500) {
            newMissed++;
          } else {
            remaining.push(egg);
          }
        });
        if (newMissed > 0) {
          setMissed(m => {
            const total = m + newMissed;
            if (total >= 3) {
              clearInterval(timerRef.current);
              clearInterval(spawnRef.current);
              clearInterval(cleanup);
              setPhase("done");
            }
            return total;
          });
        }
        return remaining;
      });
    }, 100);
    return () => clearInterval(cleanup);
  }, [phase]);

  const catchEgg = (id) => {
    setEggs(prev => prev.filter(e => e.id !== id));
    setCaught(c => c + 1);
  };

  const perfect = missed < 3 && caught >= 8;
  const reward = Math.floor(caught * 7);

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ color: "#ffdd88", fontSize: "1.2rem", letterSpacing: "0.15em", margin: "0 0 0.5rem", textTransform: "uppercase" }}>
        🥚 Egg Catch!
      </h3>

      {phase === "ready" && (
        <>
          <p style={{ color: "rgba(255,180,60,0.7)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Tap falling eggs before they hit the ground! Miss 3 = game over.
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
          <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {eggs.map(egg => {
              const age = (Date.now() - egg.spawned) / 1500;
              return (
                <button key={egg.id} onClick={() => catchEgg(egg.id)} style={{
                  position: "absolute",
                  left: `${egg.x}%`,
                  top: `${age * 85}%`,
                  fontSize: "1.8rem",
                  background: "none", border: "none", cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  transition: "top 0.1s linear",
                  padding: 4,
                }}>🥚</button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", padding: "0 0.2rem" }}>
            <span style={{ color: "#88dd88", fontSize: "0.75rem" }}>Caught: {caught}</span>
            <span style={{ color: missed >= 2 ? "#ff4444" : "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
              Missed: {missed}/3
            </span>
            <span style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.75rem" }}>{(timeLeft / 1000).toFixed(1)}s</span>
          </div>
        </>
      )}

      {phase === "done" && (
        <>
          <div style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>{perfect ? "🎉" : missed >= 3 ? "💔" : "⏰"}</div>
          <p style={{ color: "#fff", fontSize: "1rem", marginBottom: "0.3rem" }}>
            {perfect ? "Amazing catch!" : `Caught ${caught} eggs`}
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
