import { RARITY_WEIGHTS, getAvailableAnimals } from "../data/animals";

export function pickEgg(collection, level, eggType, rarityBoost = 0) {
  const available = getAvailableAnimals(level);

  // Filter by egg type rarities
  const allowedRarities = eggType ? eggType.rarities : null;
  const filtered = allowedRarities
    ? available.filter(a => allowedRarities.includes(a.rarity))
    : available;

  if (filtered.length === 0) return available[0]; // fallback

  // Build weighted pool
  const pool = [];
  filtered.forEach(a => {
    let weight = RARITY_WEIGHTS[a.rarity] || 10;
    // Rarity boost: reduce weight gap (boost higher rarities)
    if (rarityBoost > 0) {
      const maxWeight = RARITY_WEIGHTS.COMMON;
      const boost = (maxWeight - weight) * rarityBoost;
      weight = weight + boost;
    }
    const w = Math.max(1, Math.round(weight * 10));
    for (let i = 0; i < w; i++) pool.push(a);
  });

  // Pick with duplicate avoidance
  let pick;
  let attempts = 0;
  do {
    pick = pool[Math.floor(Math.random() * pool.length)];
    attempts++;
  } while (
    attempts < 20 &&
    collection.length > 0 &&
    collection.length < filtered.length &&
    collection.find(c => c.id === pick.id) &&
    Math.random() < 0.7
  );

  return pick;
}
