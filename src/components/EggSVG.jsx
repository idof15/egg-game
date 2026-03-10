const EGG_CRACK_PATHS = [
  [],
  ["M100 62 L113 82 L97 96"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120","M120 90 L108 110 L124 120"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120","M120 90 L108 110 L124 120","M87 56 L82 76 L100 62","M72 104 L89 115 L76 133"],
  ["M100 62 L113 82 L97 96","M79 94 L95 106 L83 120","M120 90 L108 110 L124 120","M87 56 L82 76 L100 62","M72 104 L89 115 L76 133","M108 50 L120 72 L135 60"],
];

export default function EggSVG({ crackLevel, wobble, color = "#e8c870", glowColor = "#ffaa44", peekEyes, eggType }) {
  const maxCrack = EGG_CRACK_PATHS.length - 1;
  const crack = Math.min(crackLevel, maxCrack);
  const glowIntensity = crack / maxCrack;

  // Egg color based on type
  const baseColor = eggType === "golden" ? "#ffd700"
    : eggType === "mystic" ? "#aa44ff"
    : eggType === "cosmic" ? "#ff44ff"
    : color;

  return (
    <svg width="180" height="210" viewBox="0 0 200 230" role="img" aria-label="Egg" style={{
      transform: `rotate(${wobble}deg)`,
      filter: `drop-shadow(0 0 ${8 + glowIntensity * 28}px ${glowColor})`,
      transition: "filter 0.3s ease",
    }}>
      <defs>
        <radialGradient id={`eg-${crack}-${eggType || 'b'}`} cx="36%" cy="28%" r="68%">
          <stop offset="0%" stopColor={crack >= 3 ? "#f0d060" : "#f8f0d8"} />
          <stop offset="55%" stopColor={crack >= 3 ? baseColor : "#e0c060"} />
          <stop offset="100%" stopColor={crack >= 2 ? "#a06010" : "#b08030"} />
        </radialGradient>
        <radialGradient id={`glow-${crack}-${eggType || 'b'}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`${glowColor}55`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="224" rx="50" ry="6" fill="rgba(0,0,0,0.3)" />
      {crack >= 3 && <ellipse cx="100" cy="115" rx="75" ry="90" fill={`url(#glow-${crack}-${eggType || 'b'})`} />}
      <path d="M100 20 C148 20 168 72 168 118 C168 164 141 214 100 218 C59 214 32 164 32 118 C32 72 52 20 100 20Z" fill={`url(#eg-${crack}-${eggType || 'b'})`} />
      <ellipse cx="74" cy="70" rx="16" ry="22" fill="rgba(255,255,255,0.4)" transform="rotate(-14,74,70)" />
      <ellipse cx="68" cy="62" rx="6" ry="9" fill="rgba(255,255,255,0.55)" transform="rotate(-14,68,62)" />
      {/* Mystic/Cosmic decorative marks */}
      {eggType === "mystic" && (
        <>
          <circle cx="100" cy="90" r="4" fill="rgba(170,68,255,0.4)" />
          <circle cx="85" cy="130" r="3" fill="rgba(170,68,255,0.3)" />
          <circle cx="115" cy="125" r="3" fill="rgba(170,68,255,0.3)" />
        </>
      )}
      {eggType === "cosmic" && (
        <>
          <circle cx="90" cy="85" r="2" fill="rgba(255,255,255,0.6)" />
          <circle cx="110" cy="100" r="2" fill="rgba(255,255,255,0.6)" />
          <circle cx="95" cy="135" r="2" fill="rgba(255,255,255,0.6)" />
          <circle cx="105" cy="70" r="1.5" fill="rgba(255,200,255,0.7)" />
        </>
      )}
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
