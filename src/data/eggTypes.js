export const EGG_TYPES = [
  {
    id: "basic",
    name: "Basic Egg",
    emoji: "🥚",
    cost: 0,
    currency: "coins",
    rarities: ["COMMON", "RARE"],
    color: "#e8c870",
    glow: "#ffaa44",
    coinMultiplier: 1,
    desc: "A humble egg. Common and Rare creatures.",
  },
  {
    id: "golden",
    name: "Golden Egg",
    emoji: "✨",
    cost: 100,
    currency: "coins",
    rarities: ["RARE", "EPIC"],
    color: "#ffdd00",
    glow: "#ffee44",
    coinMultiplier: 1.5,
    desc: "Shimmering gold. Rare and Epic creatures.",
  },
  {
    id: "mystic",
    name: "Mystic Egg",
    emoji: "🔮",
    cost: 500,
    currency: "coins",
    rarities: ["EPIC", "LEGENDARY"],
    color: "#aa44ff",
    glow: "#cc66ff",
    coinMultiplier: 2,
    desc: "Pulsing with power. Epic and Legendary creatures.",
  },
  {
    id: "cosmic",
    name: "Cosmic Egg",
    emoji: "🌌",
    cost: 1200,
    currency: "coins",
    rarities: ["LEGENDARY", "MYTHIC"],
    color: "#ff00ff",
    glow: "#ff88ff",
    coinMultiplier: 3,
    desc: "Forged in stars. Legendary and Mythic creatures.",
  },
];

export function getEggTypeById(id) {
  return EGG_TYPES.find(e => e.id === id);
}
