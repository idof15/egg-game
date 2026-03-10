export const SHOP_ITEMS = [
  // Upgrades (permanent, tiered)
  {
    id: "strong_tap",
    name: "Strong Tap",
    desc: "Each click counts as extra taps",
    icon: "💪",
    category: "upgrade",
    maxLevel: 8,
    baseCost: 150,
    costMultiplier: 3.0,
    currency: "coins",
    effect: (level) => ({ clickBonus: Math.ceil(level * 0.6) }),
  },
  {
    id: "xp_boost",
    name: "XP Boost",
    desc: "+25% XP per hatch per level",
    icon: "📈",
    category: "upgrade",
    maxLevel: 6,
    baseCost: 300,
    costMultiplier: 3.5,
    currency: "coins",
    effect: (level) => ({ xpMultiplier: 1 + level * 0.25 }),
  },
  {
    id: "lucky_charm",
    name: "Lucky Charm",
    desc: "Higher chance of rare creatures",
    icon: "🍀",
    category: "upgrade",
    maxLevel: 5,
    baseCost: 500,
    costMultiplier: 3.5,
    currency: "coins",
    effect: (level) => ({ rarityBoost: level * 0.15 }),
  },
  {
    id: "auto_tapper",
    name: "Auto Tapper",
    desc: "Automatically taps the egg",
    icon: "🤖",
    category: "upgrade",
    maxLevel: 5,
    baseCost: 1500,
    costMultiplier: 4.5,
    currency: "coins",
    effect: (level) => ({ autoClickRate: level * 0.5 }),
    prerequisite: { id: "strong_tap", level: 2 },
  },
  {
    id: "coin_magnet",
    name: "Coin Magnet",
    desc: "+20% coins per hatch per level",
    icon: "🧲",
    category: "upgrade",
    maxLevel: 5,
    baseCost: 400,
    costMultiplier: 3.0,
    currency: "coins",
    effect: (level) => ({ coinMultiplier: 1 + level * 0.2 }),
  },
];

export const GEM_CONSUMABLES = [
  {
    id: "golden_touch",
    name: "Golden Touch",
    desc: "Next 10 hatches give 2x coins",
    icon: "👑",
    cost: 10,
    currency: "gems",
    buffType: "goldenTouch",
    charges: 10,
    effect: { coinMult: 2 },
  },
  {
    id: "rarity_aura",
    name: "Rarity Aura",
    desc: "Next 5 hatches get +30% rarity boost",
    icon: "🔮",
    cost: 20,
    currency: "gems",
    buffType: "rarityAura",
    charges: 5,
    effect: { rarityBoost: 0.30 },
  },
  {
    id: "element_compass",
    name: "Element Compass",
    desc: "Choose which element your next egg hatches",
    icon: "🧭",
    cost: 5,
    currency: "gems",
    buffType: "elementCompass",
    charges: 1,
    effect: { chooseElement: true },
  },
  {
    id: "time_warp",
    name: "Time Warp",
    desc: "Halve click requirements for next 3 hatches",
    icon: "⏳",
    cost: 15,
    currency: "gems",
    buffType: "timeWarp",
    charges: 3,
    effect: { clickReduction: 0.5 },
  },
];

export function getItemCost(item, currentLevel) {
  return Math.floor(item.baseCost * Math.pow(item.costMultiplier, currentLevel));
}

export function getItemEffect(item, level) {
  if (level <= 0) return item.effect(0);
  return item.effect(level);
}
