export const HAZARD_TYPES = [
  {
    id: "freeze",
    name: "Freeze Zone",
    emoji: "❄️",
    desc: "Tap 12 times in 2s or lose 8 clicks!",
    targetTaps: 12,
    timeLimit: 2000,
    penalty: 8,
    reward: 15,
    affinityElement: "water",
  },
  {
    id: "wobble",
    name: "Wobble Catch",
    emoji: "🎯",
    desc: "Tap when the egg is centered!",
    timeLimit: 3000,
    penalty: 10,
    reward: 20,
    affinityElement: "air",
  },
  {
    id: "overheat",
    name: "Overheat",
    emoji: "🌡️",
    desc: "Stop clicking for 1.5s to cool down!",
    cooldownTime: 1500,
    penalty: 15,
    reward: 25,
    affinityElement: "fire",
  },
  {
    id: "tremor",
    name: "Tremor",
    emoji: "🌋",
    desc: "Alternate L/R taps 6 times in 2.5s!",
    targetTaps: 6,
    timeLimit: 2500,
    penalty: 10,
    reward: 20,
    affinityElement: "earth",
  },
  {
    id: "void_pull",
    name: "Void Pull",
    emoji: "🌀",
    desc: "Don't move! Hold still for 2s!",
    cooldownTime: 2000,
    penalty: 10,
    reward: 25,
    affinityElement: "cosmic",
  },
];

// ~50% chance at crack levels 1, 2, 3, and 4
export function shouldSpawnHazard(crackLevel) {
  if (crackLevel < 1 || crackLevel > 4) return false;
  return Math.random() < 0.5;
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
