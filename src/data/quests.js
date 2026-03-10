// Deterministic quest generation from date seed
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function dateSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const DAILY_TEMPLATES = [
  { id: "hatch_fire_3", desc: "Hatch 3 fire creatures", target: 3, track: "fireHatches", reward: { coins: 80 } },
  { id: "combo_15", desc: "Reach a 15x combo", target: 15, track: "maxCombo", reward: { coins: 60 } },
  { id: "golden_only_3", desc: "Hatch 3 eggs using Golden Eggs", target: 3, track: "goldenHatches", reward: { coins: 100 } },
  { id: "hatch_water_3", desc: "Hatch 3 water creatures", target: 3, track: "waterHatches", reward: { coins: 80 } },
  { id: "hatch_5", desc: "Hatch 5 eggs today", target: 5, track: "dailyHatches", reward: { coins: 70, gems: 1 } },
  { id: "combo_20", desc: "Reach a 20x combo", target: 20, track: "maxCombo", reward: { coins: 100, gems: 1 } },
  { id: "earth_2", desc: "Hatch 2 earth creatures", target: 2, track: "earthHatches", reward: { coins: 60 } },
  { id: "mini_game_1", desc: "Complete a mini-game", target: 1, track: "miniGames", reward: { gems: 2 } },
];

const WEEKLY_TEMPLATES = [
  { id: "all_rarities", desc: "Hatch one of each rarity", target: 5, track: "uniqueRarities", reward: { coins: 300, gems: 5 } },
  { id: "mini_coins_500", desc: "Earn 500 coins from mini-games", target: 500, track: "miniGameCoins", reward: { gems: 8 } },
  { id: "evolve_1", desc: "Evolve an animal", target: 1, track: "evolutions", reward: { coins: 200, gems: 3 } },
  { id: "hatch_20", desc: "Hatch 20 eggs this week", target: 20, track: "weeklyHatches", reward: { coins: 250, gems: 3 } },
  { id: "elements_3", desc: "Hatch 3 different elements", target: 3, track: "uniqueElements", reward: { coins: 200, gems: 2 } },
];

const CHALLENGE_TEMPLATES = [
  { id: "mythic_basic", desc: "Hatch a Mythic from a Basic Egg", target: 1, track: "mythicFromBasic", reward: { coins: 500, gems: 15 } },
  { id: "hatch_50_no_upgrade", desc: "Hatch 50 eggs without upgrades", target: 50, track: "noUpgradeHatches", reward: { coins: 400, gems: 10 } },
  { id: "combo_40", desc: "Reach a 40x combo", target: 40, track: "maxCombo", reward: { coins: 300, gems: 8 } },
  { id: "all_elements_week", desc: "Hatch all 6 elements", target: 6, track: "uniqueElements", reward: { coins: 500, gems: 10 } },
];

export function generateQuests(dateStr) {
  const seed = dateSeed(dateStr);
  const rng = seededRandom(seed);

  // Week number for weekly quest stability
  const date = new Date(dateStr);
  const weekSeed = dateSeed(`week-${date.getFullYear()}-${Math.floor(getDayOfYear(date) / 7)}`);
  const weekRng = seededRandom(weekSeed);

  const dailyIdx = Math.floor(rng() * DAILY_TEMPLATES.length);
  const weeklyIdx = Math.floor(weekRng() * WEEKLY_TEMPLATES.length);
  const challengeIdx = Math.floor(rng() * CHALLENGE_TEMPLATES.length);

  return {
    daily: { ...DAILY_TEMPLATES[dailyIdx], type: "daily", progress: 0, completed: false },
    weekly: { ...WEEKLY_TEMPLATES[weeklyIdx], type: "weekly", progress: 0, completed: false },
    challenge: { ...CHALLENGE_TEMPLATES[challengeIdx], type: "challenge", progress: 0, completed: false },
  };
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getWeekKey(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-W${Math.floor(getDayOfYear(date) / 7)}`;
}
