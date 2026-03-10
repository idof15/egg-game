export const HAZARD_TYPES = [
  {
    id: "freeze",
    name: "Freeze Zone",
    emoji: "❄️",
    desc: "Tap 8 times in 2s or lose 3 clicks!",
    targetTaps: 8,
    timeLimit: 2000,
    penalty: 3,
    reward: 15,
    affinityElement: "water",
  },
  {
    id: "wobble",
    name: "Wobble Catch",
    emoji: "🎯",
    desc: "Tap when the egg is centered!",
    timeLimit: 3000,
    penalty: 3,
    reward: 20,
    affinityElement: "air",
  },
  {
    id: "overheat",
    name: "Overheat",
    emoji: "🌡️",
    desc: "Stop clicking for 1.5s to cool down!",
    cooldownTime: 1500,
    penalty: 5,
    reward: 25,
    affinityElement: "fire",
  },
];

// ~40% chance at crack levels 2 and 4
export function shouldSpawnHazard(crackLevel) {
  if (crackLevel !== 2 && crackLevel !== 4) return false;
  return Math.random() < 0.4;
}

export function pickHazard(animalElement) {
  // Element affinity: matching elements have higher chance
  const weights = HAZARD_TYPES.map(h => ({
    hazard: h,
    weight: h.affinityElement === animalElement ? 3 : 1,
  }));
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const w of weights) {
    roll -= w.weight;
    if (roll <= 0) return w.hazard;
  }
  return HAZARD_TYPES[0];
}
