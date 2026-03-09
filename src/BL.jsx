import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const ANIMALS = [
  { id: "dragon",    emoji: "🐉", name: "Dragon",    rarity: "LEGENDARY", color: "#ff4400", glow: "#ff6600", bg: ["#1a0400","#0a0200"], clicks: 20, xp: 500,  desc: "Ancient fire-breather" },
  { id: "phoenix",   emoji: "🦅", name: "Phoenix",   rarity: "EPIC",      color: "#ff8800", glow: "#ffaa00", bg: ["#1a0c00","#0a0600"], clicks: 15, xp: 300,  desc: "Born from the flames" },
  { id: "unicorn",   emoji: "🦄", name: "Unicorn",   rarity: "RARE",      color: "#cc44ff", glow: "#dd88ff", bg: ["#0d0018","#060010"], clicks: 12, xp: 200,  desc: "Pure magical energy" },
  { id: "turtle",    emoji: "🐢", name: "Turtle",    rarity: "COMMON",    color: "#44bb44", glow: "#66dd66", bg: ["#001a00","#000a00"], clicks: 8,  xp: 80,   desc: "Slow but wise" },
  { id: "chick",     emoji: "🐣", name: "Chick",     rarity: "COMMON",    color: "#ffdd00", glow: "#ffee44", bg: ["#1a1600","#0a0c00"], clicks: 5,  xp: 30,   desc: "Fluffy and adorable" },
  { id: "alien",     emoji: "👾", name: "Alien",     rarity: "EPIC",      color: "#00ffaa", glow: "#44ffcc", bg: ["#001a10","#000a08"], clicks: 18, xp: 350,  desc: "Not from this world" },
  { id: "snake",     emoji: "🐍", name: "Snake",     rarity: "RARE",      color: "#aadd00", glow: "#ccff00", bg: ["#0d1400","#060a00"], clicks: 10, xp: 150,  desc: "Ancient and cunning" },
  { id: "dino",      emoji: "🦕", name: "Dino",      rarity: "RARE",      color: "#44ddaa", glow: "#66ffcc", bg: ["#001a12","#000a08"], clicks: 12, xp: 180,  desc: "Prehistoric giant" },
];

const RARITY_COLORS = {
  LEGENDARY: { from: "#ff8800", to: "#ff4400", text: "#ffaa44" },
  EPIC:      { from: "#aa44ff", to: "#6600ff", text: "#cc88ff" },
  RARE:      { from: "#4488ff", to: "#0044cc", text: "#88bbff" },
  COMMON:    { from: "#44bb44", to: "#226622", text: "#88dd88" },
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function pickEgg(collection) {
  const pool = [];
  ANIMALS.forEach(a => {
    const weight = a.rarity === "LEGENDARY" ? 1 : a.rarity === "EPIC" ? 4 : a.rarity === "RARE" ? 10 : 25;
    for (let i = 0; i < weight; i++) pool.push(a);
  });
  let pick;
  do { pick = pool[Math.floor(Math.random() * pool.length)]; }
  while (collection.length > 0 && collection.length < ANIMALS.length && collection.find(c => c.id === pick.id) && Math.random() < 0.7);
  return pick;
}

// ── EGG SVG ───────────────────────────────────────────────────────────────────
const EGG_CRACK_PATHS = [
  [],
  ["M100 62 L113 82 L97 96"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120","M120 90 L108 110 L124 120"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120","M120 90 L108 110 L124 120","M87 56 L82 76 L100 62","M72 104 L89 115 L76 133"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120","M120 90 L108 110 L124 120","M87 56 L82 76 L100 62","M72 104 L89 115 L76 133","M108 50 L120 72 L135 60"],
];

function EggSVG({ crackLevel, wobble, color = "#e8c870", glowColor = "#ffaa44", peekEyes }) {
  const maxCrack = EGG_CRACK_PATHS.length - 1;
  const crack = Math.min(crackLevel, maxCrack);
  const glowIntensity = crack / maxCrack;
  return (
    <svg width="180" height="210" viewBox="0 0 200 230" style={{
      transform: `rotate(${wobble}deg)`,
      filter: `drop-shadow(0 0 ${8 + glowIntensity * 28}px ${glowColor})`,
      transition: "filter 0.3s ease",
    }}>
      <defs>
        <radialGradient id={`eg-${crack}`} cx="36%" cy="28%" r="68%">
          <stop offset="0%" stopColor={crack >= 3 ? "#f0d060" : "#f8f0d8"} />
          <stop offset="55%" stopColor={crack >= 3 ? color : "#e0c060"} />
          <stop offset="100%" stopColor={crack >= 2 ? "#a06010" : "#b08030"} />
        </radialGradient>
        <radialGradient id={`glow-${crack}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`${glowColor}55`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="224" rx="50" ry="6" fill="rgba(0,0,0,0.3)" />
      {crack >= 3 && <ellipse cx="100" cy="115" rx="75" ry="90" fill={`url(#glow-${crack})`} />}
      <path d="M100 20 C148 20 168 72 168 118 C168 164 141 214 100 218 C59 214 32 164 32 118 C32 72 52 20 100 20Z" fill={`url(#eg-${crack})`} />
      <ellipse cx="74" cy="70" rx="16" ry="22" fill="rgba(255,255,255,0.4)" transform="rotate(-14,74,70)" />
      <ellipse cx="68" cy="62" rx="6" ry="9" fill="rgba(255,255,255,0.55)" transform="rotate(-14,68,62)" />
      {EGG_CRACK_PATHS[crack].map((d, i) => (
        <path key={i} d={d} stroke="#8a5818" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      ))}
      {peekEyes && crack >= 4 && (
        <>
          <circle cx="85" cy="105" r="7" fill="#cc0000" />
          <circle cx="115" cy="105" r="7" fill="#cc0000" />
          <circle cx="87" cy="103" r="3" fill="white" />
          <circle cx="117" cy="103" r="3" fill="white" />
        </>
      )}
    </svg>
  );
}

// ── PARTICLE SYSTEM ────────────────────────────────────────────────────────────
function Particles({ particles }) {
  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: p.x, top: p.y,
          width: p.size, height: p.size,
          borderRadius: p.square ? "2px" : "50%",
          background: p.color,
          pointerEvents: "none",
          transform: "translate(-50%,-50%)",
          animation: `pflyAnim${p.dir} ${p.dur}ms ease-out forwards`,
          zIndex: 60,
        }} />
      ))}
    </>
  );
}

let pid = 0;
function makeParticles(x, y, count, colors, spread = 100) {
  return Array.from({ length: count }, (_, i) => ({
    id: ++pid,
    x, y,
    size: 5 + Math.random() * 7,
    color: colors[i % colors.length],
    square: Math.random() > 0.6,
    dir: Math.random() > 0.5 ? "L" : "R",
    dur: 600 + Math.random() * 500,
    dx: (Math.random() - 0.5) * spread,
    dy: -(Math.random() * spread * 0.8 + spread * 0.2),
  }));
}

// ── COLLECTION CARD ───────────────────────────────────────────────────────────
function CollectionCard({ animal, count }) {
  const r = RARITY_COLORS[animal.rarity];
  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
      border: `1px solid ${animal.color}44`,
      borderRadius: 12,
      padding: "10px 12px",
      display: "flex", alignItems: "center", gap: 10,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ fontSize: 28 }}>{animal.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>{animal.name}</div>
        <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: r.text }}>{animal.rarity}</div>
      </div>
      <div style={{
        background: `${animal.color}33`, border: `1px solid ${animal.color}66`,
        borderRadius: 999, padding: "2px 8px",
        color: animal.color, fontSize: "0.72rem", fontWeight: 700
      }}>×{count}</div>
    </div>
  );
}

// ── MAIN GAME ─────────────────────────────────────────────────────────────────
export default function EggGame() {
  const [screen, setScreen] = useState("home"); // home | hatch | reveal | collection
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [wobble, setWobble] = useState(0);
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [collection, setCollection] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [hatching, setHatching] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [eggShake, setEggShake] = useState(false);
  const [bgPulse, setBgPulse] = useState(false);
  const containerRef = useRef(null);
  const wobbleRef = useRef(null);

  const animal = currentAnimal;
  const maxClicks = animal?.clicks || 20;
  const progress = Math.min(clicks / maxClicks, 1);
  const crackLevel = Math.floor(progress * 5);

  // Start a new egg
  const startHatching = useCallback(() => {
    const picked = pickEgg(collection);
    setCurrentAnimal(picked);
    setClicks(0);
    setCombo(0);
    setScreen("hatch");
    setHatching(false);
    setShowReveal(false);
  }, [collection]);

  // Combo reset timer
  const resetCombo = useCallback(() => {
    if (comboTimer) clearTimeout(comboTimer);
    const t = setTimeout(() => setCombo(0), 2000);
    setComboTimer(t);
  }, [comboTimer]);

  // Click handler
  const handleEggClick = useCallback((e) => {
    if (hatching || screen !== "hatch") return;
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;

    const newClicks = clicks + 1;
    const newCombo = combo + 1;
    setClicks(newClicks);
    setCombo(newCombo);
    resetCombo();

    // Wobble
    clearTimeout(wobbleRef.current);
    setWobble(newCombo >= 5 ? 14 : 8);
    wobbleRef.current = setTimeout(() => setWobble(0), 140);

    // Egg shake on milestones
    const milestone = newClicks % Math.ceil(maxClicks / 5) === 0;
    if (milestone) {
      setEggShake(true);
      setTimeout(() => setEggShake(false), 350);
      setBgPulse(true);
      setTimeout(() => setBgPulse(false), 400);
    }

    // Ripple
    const rid = ++pid;
    setRipples(r => [...r, { x, y, id: rid, big: newCombo >= 5 }]);
    setTimeout(() => setRipples(r => r.filter(p => p.id !== rid)), 700);

    // Particles on milestones
    if (milestone) {
      const cols = animal ? [animal.color, animal.glow, "#fff", "#ffdd00"] : ["#ff8800","#fff"];
      const newP = makeParticles(x, y, newClicks >= maxClicks - 2 ? 22 : 10, cols);
      setParticles(p => [...p, ...newP]);
      setTimeout(() => setParticles(p => p.filter(q => !newP.find(n => n.id === q.id))), 1200);
    }

    // Combo floating text
    if (newCombo >= 3) {
      const ftid = ++pid;
      setFloatingTexts(f => [...f, { id: ftid, x, y: y - 20, text: newCombo >= 10 ? "🔥ULTRA!" : newCombo >= 7 ? "⚡SUPER!" : `x${newCombo}` }]);
      setTimeout(() => setFloatingTexts(f => f.filter(t => t.id !== ftid)), 900);
    }

    // Hatch!
    if (newClicks >= maxClicks) {
      setHatching(true);
      const bigCols = animal ? [animal.color, animal.glow, "#fff", "#ffee44", "#ffaa00"] : ["#ff8800","#fff"];
      const bigP = makeParticles(x, y, 40, bigCols, 180);
      setParticles(p => [...p, ...bigP]);
      setTimeout(() => setParticles(p => p.filter(q => !bigP.find(n => n.id === q.id))), 1500);
      setTimeout(() => {
        setShowReveal(true);
        setScreen("reveal");
        setCollection(prev => {
          const existing = prev.find(c => c.id === animal.id);
          if (existing) return prev.map(c => c.id === animal.id ? { ...c, count: c.count + 1 } : c);
          return [...prev, { ...animal, count: 1 }];
        });
        setTotalXP(x => x + animal.xp);
      }, 700);
    }
  }, [clicks, combo, hatching, screen, animal, maxClicks, resetCombo]);

  const level = Math.floor(totalXP / 200) + 1;
  const levelXP = totalXP % 200;

  // ── HOME SCREEN ──
  if (screen === "home") {
    return (
      <div style={{
        minHeight: "100vh", background: "radial-gradient(ellipse at 50% 30%, #180d02 0%, #050300 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Palatino Linotype', Palatino, serif",
        padding: "2rem", boxSizing: "border-box", position: "relative", overflow: "hidden",
      }}>
        <style>{`
          @keyframes pflyAnimL { to { transform: translate(calc(-50% + var(--dx, -60px)), calc(-50% + var(--dy, -80px))); opacity: 0; } }
          @keyframes pflyAnimR { to { transform: translate(calc(-50% + var(--dy, 60px)), calc(-50% + var(--dy, -80px))); opacity: 0; } }
          @keyframes eggBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes shimmer { 0%,100%{opacity:0.7} 50%{opacity:1} }
          @keyframes floatUp { 0%{opacity:1;transform:translate(-50%,-50%)} 100%{opacity:0;transform:translate(-50%,-120%)} }
          @keyframes hatchPop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.3) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
          @keyframes animalFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.04)} }
          @keyframes revealGlow { 0%,100%{filter:drop-shadow(0 0 20px var(--gc))} 50%{filter:drop-shadow(0 0 50px var(--gc)) drop-shadow(0 0 80px var(--gc))} }
          @keyframes bgPulseAnim { 0%{opacity:0} 50%{opacity:0.5} 100%{opacity:0} }
          @keyframes rippleExpand { 0%{transform:translate(-50%,-50%) scale(0);opacity:0.8} 100%{transform:translate(-50%,-50%) scale(6);opacity:0} }
          @keyframes eggShakeAnim { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
          @keyframes starTwinkle { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.3)} }
          @keyframes legendaryShine { 0%{background-position:200% center} 100%{background-position:-200% center} }
          .home-btn { transition: transform 0.15s ease, box-shadow 0.15s ease !important; }
          .home-btn:hover { transform: scale(1.04) !important; }
          .home-btn:active { transform: scale(0.97) !important; }
        `}</style>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: "fixed", borderRadius: "50%", background: "#fff",
            width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2,
            left: `${(i * 41 + 7) % 100}%`, top: `${(i * 57 + 11) % 100}%`,
            animation: `starTwinkle ${2 + (i % 5) * 0.7}s ease-in-out infinite`,
            animationDelay: `${(i * 0.23) % 4}s`,
          }} />
        ))}

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
        <p style={{ color: "rgba(220,180,80,0.6)", letterSpacing: "0.25em", fontSize: "0.78rem", marginBottom: "2.5rem", textTransform: "uppercase" }}>
          Crack · Collect · Complete
        </p>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
          {ANIMALS.slice(0, 5).map((a, i) => (
            <div key={a.id} style={{
              fontSize: "2rem", animation: `eggBob ${2.2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`, filter: `drop-shadow(0 0 8px ${a.glow})`,
              opacity: 0.85,
            }}>{a.emoji}</div>
          ))}
          <div style={{ fontSize: "2rem", opacity: 0.5 }}>❓</div>
        </div>
        <button className="home-btn" onClick={startHatching} style={{
          background: "linear-gradient(135deg, #ff6600, #ff3300)",
          border: "none", borderRadius: 999, padding: "1rem 3rem",
          color: "#fff", fontSize: "1.1rem", letterSpacing: "0.18em",
          fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
          boxShadow: "0 0 30px #ff440066, 0 4px 20px rgba(0,0,0,0.5)",
          fontWeight: 700,
        }}>🥚 Hatch Egg</button>
        {collection.length > 0 && (
          <button className="home-btn" onClick={() => setScreen("collection")} style={{
            marginTop: "0.8rem", background: "transparent",
            border: "1px solid rgba(255,180,60,0.3)", borderRadius: 999,
            padding: "0.7rem 2rem", color: "rgba(255,180,60,0.8)",
            fontSize: "0.85rem", letterSpacing: "0.15em",
            fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
          }}>📖 Collection ({collection.length}/{ANIMALS.length})</button>
        )}
        <p style={{ color: "rgba(255,180,60,0.35)", fontSize: "0.68rem", marginTop: "1.5rem", letterSpacing: "0.1em" }}>
          {ANIMALS.length} creatures to discover · {ANIMALS.filter(a => a.rarity === "LEGENDARY").length} legendary
        </p>
      </div>
    );
  }

  // ── COLLECTION SCREEN ──
  if (screen === "collection") {
    return (
      <div style={{
        minHeight: "100vh", background: "#050300",
        fontFamily: "'Palatino Linotype', Palatino, serif",
        padding: "1.5rem", boxSizing: "border-box",
      }}>
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes shimmer { 0%,100%{opacity:0.7} 50%{opacity:1} }
          .back-btn:hover { opacity: 1 !important; }
        `}</style>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <button className="back-btn" onClick={() => setScreen("home")} style={{
            background: "none", border: "none", color: "rgba(255,180,60,0.6)",
            fontSize: "0.85rem", letterSpacing: "0.15em", cursor: "pointer",
            fontFamily: "inherit", textTransform: "uppercase", padding: 0, marginBottom: "1.5rem",
            opacity: 0.7, transition: "opacity 0.2s",
          }}>← Back</button>
          <h2 style={{
            color: "#ffdd88", fontSize: "1.6rem", letterSpacing: "0.2em",
            textTransform: "uppercase", marginBottom: "0.3rem",
          }}>Collection</h2>
          <p style={{ color: "rgba(255,180,60,0.4)", fontSize: "0.72rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
            {collection.length}/{ANIMALS.length} discovered · Level {level} · {totalXP} XP
          </p>
          {/* XP bar */}
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 6, marginBottom: "1.5rem", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(levelXP / 200) * 100}%`, background: "linear-gradient(90deg, #ffaa00, #ffdd44)", borderRadius: 999, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.5rem" }}>
            {collection.map((a, i) => (
              <div key={a.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                <CollectionCard animal={a} count={a.count} />
              </div>
            ))}
          </div>
          {/* Undiscovered */}
          {collection.length < ANIMALS.length && (
            <>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Still Hiding...
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {ANIMALS.filter(a => !collection.find(c => c.id === a.id)).map(a => (
                  <div key={a.id} style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{ fontSize: 28, filter: "grayscale(1) brightness(0.3)" }}>🥚</div>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>???</div>
                      <div style={{ color: RARITY_COLORS[a.rarity].text, fontSize: "0.62rem", opacity: 0.4, letterSpacing: "0.1em" }}>{a.rarity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── REVEAL SCREEN ──
  if (screen === "reveal" && animal) {
    const r = RARITY_COLORS[animal.rarity];
    const isNew = collection.find(c => c.id === animal.id)?.count === 1;
    return (
      <div style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at center, ${animal.bg[0]} 0%, ${animal.bg[1]} 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Palatino Linotype', Palatino, serif",
      }}>
        <style>{`
          @keyframes hatchPop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.35) rotate(6deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
          @keyframes animalFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes shimmer { 0%,100%{opacity:0.8} 50%{opacity:1} }
          @keyframes legendaryRays { 0%{transform:rotate(0deg);opacity:0.15} 100%{transform:rotate(360deg);opacity:0.15} }
          .rev-btn:hover { transform: scale(1.04) !important; }
          .rev-btn:active { transform: scale(0.97) !important; }
        `}</style>
        {animal.rarity === "LEGENDARY" && (
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            width: "600px", height: "600px",
            background: `conic-gradient(from 0deg, transparent 0%, ${animal.glow}22 10%, transparent 20%)`,
            animation: "legendaryRays 8s linear infinite",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }} />
        )}
        {Array.from({ length: 25 }, (_, i) => (
          <div key={i} style={{
            position: "fixed", borderRadius: "50%", background: i % 3 === 0 ? animal.color : "#fff",
            width: 2, height: 2,
            left: `${(i * 41 + 7) % 100}%`, top: `${(i * 57 + 11) % 100}%`,
            opacity: 0.3 + Math.random() * 0.5,
          }} />
        ))}
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
        <div style={{
          fontSize: "clamp(7rem, 20vw, 11rem)", lineHeight: 1,
          animation: "hatchPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, animalFloat 3s ease-in-out 0.8s infinite",
          filter: `drop-shadow(0 0 30px ${animal.glow}) drop-shadow(0 0 60px ${animal.color}88)`,
          "--gc": animal.glow,
        }}>
          {animal.emoji}
        </div>
        <div style={{ textAlign: "center", padding: "0 1.5rem", animation: "fadeUp 0.5s ease 0.4s both", opacity: 0 }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)", letterSpacing: "0.15em",
            margin: "1rem 0 0.2rem", textTransform: "uppercase",
            color: animal.rarity === "LEGENDARY"
              ? "transparent"
              : animal.color,
            background: animal.rarity === "LEGENDARY"
              ? `linear-gradient(90deg, ${animal.color}, #fff, ${animal.color})`
              : "none",
            WebkitBackgroundClip: animal.rarity === "LEGENDARY" ? "text" : "none",
            WebkitTextFillColor: animal.rarity === "LEGENDARY" ? "transparent" : animal.color,
            backgroundSize: "200%",
            animation: animal.rarity === "LEGENDARY" ? "shimmer 1.5s ease-in-out infinite" : "none",
          }}>{animal.name}</h2>
          <div style={{
            display: "inline-block",
            background: `linear-gradient(135deg, ${r.from}44, ${r.to}44)`,
            border: `1px solid ${r.from}88`,
            borderRadius: 999, padding: "0.25rem 1rem",
            color: r.text, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}>{animal.rarity}</div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontStyle: "italic", marginBottom: "0.4rem" }}>{animal.desc}</p>
          <p style={{ color: animal.color, fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "2rem" }}>+{animal.xp} XP</p>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.5s ease 0.6s both", opacity: 0 }}>
          <button className="rev-btn" onClick={startHatching} style={{
            background: `linear-gradient(135deg, ${animal.color}, ${animal.glow})`,
            border: "none", borderRadius: 999, padding: "0.85rem 2rem",
            color: "#fff", fontSize: "0.9rem", letterSpacing: "0.15em",
            fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
            fontWeight: 700, transition: "transform 0.15s ease",
            boxShadow: `0 0 25px ${animal.glow}66`,
          }}>🥚 Hatch Again</button>
          <button className="rev-btn" onClick={() => setScreen("collection")} style={{
            background: "transparent", border: `1px solid ${animal.color}66`,
            borderRadius: 999, padding: "0.85rem 2rem",
            color: animal.color, fontSize: "0.9rem", letterSpacing: "0.15em",
            fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
            transition: "transform 0.15s ease",
          }}>📖 Collection</button>
        </div>
      </div>
    );
  }

  // ── HATCH SCREEN ──
  const animalColor = animal?.color || "#ffaa44";
  const animalGlow = animal?.glow || "#ffcc44";
  return (
    <div ref={containerRef} onClick={handleEggClick} style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: bgPulse
        ? `radial-gradient(ellipse at center, ${animalColor}22 0%, #060400 100%)`
        : "radial-gradient(ellipse at center, #1c1400 0%, #060400 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Palatino Linotype', Palatino, serif",
      cursor: "pointer", userSelect: "none",
      transition: "background 0.3s ease",
    }}>
      <style>{`
        @keyframes pflyAnimL { 0%{transform:translate(-50%,-50%) scale(1);opacity:1} 100%{transform:translate(calc(-50% - 80px),calc(-50% - 100px)) scale(0);opacity:0} }
        @keyframes pflyAnimR { 0%{transform:translate(-50%,-50%) scale(1);opacity:1} 100%{transform:translate(calc(-50% + 80px),calc(-50% - 100px)) scale(0);opacity:0} }
        @keyframes rippleExpand { 0%{transform:translate(-50%,-50%) scale(0);opacity:0.7} 100%{transform:translate(-50%,-50%) scale(6);opacity:0} }
        @keyframes eggShakeAnim { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
        @keyframes floatUp { 0%{opacity:1;transform:translate(-50%,-100%)} 100%{opacity:0;transform:translate(-50%,-220%)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes starTwinkle { 0%,100%{opacity:0.15} 50%{opacity:0.7} }
      `}</style>

      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{
          position: "fixed", borderRadius: "50%", background: i % 4 === 0 ? animalColor : "#fff",
          width: 2, height: 2, pointerEvents: "none",
          left: `${(i * 43 + 9) % 100}%`, top: `${(i * 59 + 13) % 100}%`,
          animation: `starTwinkle ${2 + (i % 4) * 0.8}s ease-in-out infinite`,
          animationDelay: `${(i * 0.28) % 4}s`, opacity: 0.3,
        }} />
      ))}

      <Particles particles={particles} />

      {/* Ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y,
          width: r.big ? 60 : 40, height: r.big ? 60 : 40,
          borderRadius: "50%",
          border: `2px solid ${crackLevel >= 3 ? animalColor : "#ffcc44"}`,
          pointerEvents: "none",
          animation: "rippleExpand 0.65s ease-out forwards",
          zIndex: 40,
        }} />
      ))}

      {/* Floating combo texts */}
      {floatingTexts.map(ft => (
        <div key={ft.id} style={{
          position: "absolute", left: ft.x, top: ft.y,
          color: combo >= 10 ? "#ff4400" : combo >= 7 ? "#ffaa00" : animalColor,
          fontSize: combo >= 10 ? "1.4rem" : "1rem",
          fontWeight: 700, letterSpacing: "0.1em",
          pointerEvents: "none",
          animation: "floatUp 0.9s ease-out forwards",
          zIndex: 70, textShadow: `0 0 12px ${animalGlow}`,
        }}>{ft.text}</div>
      ))}

      {/* Rarity hint */}
      {animal && (
        <div style={{
          position: "absolute", top: "5%",
          background: `${RARITY_COLORS[animal.rarity].from}22`,
          border: `1px solid ${RARITY_COLORS[animal.rarity].from}44`,
          borderRadius: 999, padding: "0.3rem 1rem",
          color: RARITY_COLORS[animal.rarity].text,
          fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
          animation: "fadeIn 0.5s ease",
        }}>{animal.rarity} EGG</div>
      )}

      {/* Egg */}
      <div style={{ animation: eggShake ? "eggShakeAnim 0.35s ease" : "none" }}>
        <EggSVG
          crackLevel={crackLevel}
          wobble={wobble}
          color={animalColor}
          glowColor={animalGlow}
          peekEyes={true}
        />
      </div>

      {/* Stage label */}
      <p style={{
        color: crackLevel >= 3 ? animalColor : "rgba(220,180,80,0.75)",
        fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
        fontStyle: "italic", letterSpacing: "0.06em",
        margin: "0.8rem 0 0.4rem", minHeight: "1.6em",
        textShadow: "0 1px 8px rgba(0,0,0,0.8)",
        transition: "color 0.4s ease",
      }}>
        {crackLevel === 0 && "Tap to crack the egg..."}
        {crackLevel === 1 && "Something stirs inside... 🔥"}
        {crackLevel === 2 && "You hear something scratching..."}
        {crackLevel === 3 && "It's breaking open! 💥"}
        {crackLevel === 4 && "Almost! Keep going!!!"}
        {crackLevel >= 5 && hatching && "HATCHING..."}
      </p>

      {/* Progress bar */}
      <div style={{ width: "min(280px, 80vw)", marginBottom: "0.4rem" }}>
        <div style={{
          background: "rgba(255,255,255,0.07)", borderRadius: 999,
          height: 10, overflow: "hidden",
          border: "1px solid rgba(255,180,60,0.15)",
        }}>
          <div style={{
            height: "100%", borderRadius: 999,
            width: `${progress * 100}%`,
            background: progress > 0.8
              ? `linear-gradient(90deg, #ff3300, ${animalColor})`
              : `linear-gradient(90deg, #aa6600, ${animalColor})`,
            transition: "width 0.2s ease",
            boxShadow: progress > 0.6 ? `0 0 12px ${animalGlow}88` : "none",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
          <span style={{ color: "rgba(200,150,50,0.5)", fontSize: "0.68rem", letterSpacing: "0.1em" }}>
            {clicks}/{maxClicks} CLICKS
          </span>
          {combo >= 3 && (
            <span style={{ color: combo >= 7 ? "#ff8800" : animalColor, fontSize: "0.68rem", letterSpacing: "0.1em" }}>
              🔥 {combo} COMBO
            </span>
          )}
        </div>
      </div>

      {/* Level indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.4rem" }}>
        <span style={{ color: "rgba(200,150,50,0.4)", fontSize: "0.68rem", letterSpacing: "0.12em" }}>
          LVL {level}
        </span>
        <div style={{ width: 60, background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(levelXP / 200) * 100}%`, background: "#ffaa44", borderRadius: 999 }} />
        </div>
        <span style={{ color: "rgba(200,150,50,0.4)", fontSize: "0.68rem", letterSpacing: "0.12em" }}>
          {totalXP} XP
        </span>
      </div>

      {/* Home button */}
      <button onClick={(e) => { e.stopPropagation(); setScreen("home"); }} style={{
        position: "absolute", top: "4%", left: "4%",
        background: "none", border: "none",
        color: "rgba(200,150,50,0.4)", fontSize: "0.7rem",
        letterSpacing: "0.15em", cursor: "pointer",
        fontFamily: "inherit", textTransform: "uppercase",
        padding: "0.4rem 0.8rem",
        borderRadius: 999, transition: "color 0.2s",
      }}>← Home</button>
    </div>
  );
}