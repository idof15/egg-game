import { ANIMALS } from "./animals";

export const ACHIEVEMENTS = [
  {
    id: "first_hatch",
    name: "First Crack",
    desc: "Hatch your first egg",
    icon: "🥚",
    reward: { coins: 50 },
    check: (stats) => stats.totalHatches >= 1,
  },
  {
    id: "hatch_10",
    name: "Egg Enthusiast",
    desc: "Hatch 10 eggs",
    icon: "🐣",
    reward: { coins: 100 },
    check: (stats) => stats.totalHatches >= 10,
  },
  {
    id: "hatch_100",
    name: "Egg Master",
    desc: "Hatch 100 eggs",
    icon: "🏆",
    reward: { coins: 500, gems: 5 },
    check: (stats) => stats.totalHatches >= 100,
  },
  {
    id: "combo_10",
    name: "Combo Starter",
    desc: "Reach a 10x combo",
    icon: "🔥",
    reward: { coins: 75 },
    check: (stats) => stats.maxCombo >= 10,
  },
  {
    id: "combo_25",
    name: "Combo King",
    desc: "Reach a 25x combo",
    icon: "⚡",
    reward: { coins: 200, gems: 3 },
    check: (stats) => stats.maxCombo >= 25,
  },
  {
    id: "collect_all_common",
    name: "Common Collector",
    desc: "Collect all Common creatures",
    icon: "📗",
    reward: { coins: 150 },
    check: (stats, state) => {
      const commons = ANIMALS.filter(a => a.rarity === "COMMON" && !a.season);
      return commons.every(a => state.collection.some(c => c.id === a.id));
    },
  },
  {
    id: "find_legendary",
    name: "Legend Finder",
    desc: "Hatch a Legendary creature",
    icon: "⭐",
    reward: { coins: 200, gems: 2 },
    check: (stats) => stats.legendaryFound >= 1,
  },
  {
    id: "find_mythic",
    name: "Mythic Discovery",
    desc: "Hatch a Mythic creature",
    icon: "💫",
    reward: { coins: 500, gems: 10 },
    check: (stats) => stats.mythicFound >= 1,
  },
  {
    id: "streak_7",
    name: "Dedicated Hatcher",
    desc: "Play 7 days in a row",
    icon: "📅",
    reward: { gems: 7 },
    check: (stats) => stats.dailyStreak >= 7,
  },
  {
    id: "clicks_5000",
    name: "Tap Master",
    desc: "Click 5,000 times total",
    icon: "👆",
    reward: { coins: 300 },
    check: (stats) => stats.totalClicks >= 5000,
  },
  // ── Hatching milestones ──
  {
    id: "hatch_25",
    name: "Egg Addict",
    desc: "Hatch 25 eggs",
    icon: "🥚",
    reward: { coins: 150 },
    check: (stats) => stats.totalHatches >= 25,
  },
  {
    id: "hatch_50",
    name: "Egg Fanatic",
    desc: "Hatch 50 eggs",
    icon: "🐥",
    reward: { coins: 250, gems: 3 },
    check: (stats) => stats.totalHatches >= 50,
  },
  {
    id: "hatch_250",
    name: "Egg Legend",
    desc: "Hatch 250 eggs",
    icon: "👑",
    reward: { coins: 1000, gems: 10 },
    check: (stats) => stats.totalHatches >= 250,
  },
  {
    id: "hatch_500",
    name: "Egg Immortal",
    desc: "Hatch 500 eggs",
    icon: "🌟",
    reward: { coins: 2000, gems: 20 },
    check: (stats) => stats.totalHatches >= 500,
  },
  // ── Collection goals ──
  {
    id: "collect_all_rare",
    name: "Rare Collector",
    desc: "Collect all Rare creatures",
    icon: "📘",
    reward: { coins: 300, gems: 3 },
    check: (stats, state) => {
      const rares = ANIMALS.filter(a => a.rarity === "RARE" && !a.season);
      return rares.every(a => state.collection.some(c => c.id === a.id));
    },
  },
  {
    id: "collect_all_epic",
    name: "Epic Collector",
    desc: "Collect all Epic creatures",
    icon: "📙",
    reward: { coins: 500, gems: 5 },
    check: (stats, state) => {
      const epics = ANIMALS.filter(a => a.rarity === "EPIC" && !a.season);
      return epics.every(a => state.collection.some(c => c.id === a.id));
    },
  },
  {
    id: "collect_all_legendary",
    name: "Legend Collector",
    desc: "Collect all Legendary creatures",
    icon: "📕",
    reward: { coins: 1000, gems: 15 },
    check: (stats, state) => {
      const legendaries = ANIMALS.filter(a => a.rarity === "LEGENDARY" && !a.season);
      return legendaries.every(a => state.collection.some(c => c.id === a.id));
    },
  },
  {
    id: "one_of_each_rarity",
    name: "Rainbow Collector",
    desc: "Collect one of each rarity",
    icon: "🌈",
    reward: { coins: 400, gems: 5 },
    check: (stats, state) => {
      const rarities = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
      return rarities.every(r => {
        const animals = ANIMALS.filter(a => a.rarity === r);
        return animals.some(a => state.collection.some(c => c.id === a.id));
      });
    },
  },
  {
    id: "all_elements",
    name: "Elemental Master",
    desc: "Collect a creature of every element",
    icon: "🔮",
    reward: { coins: 300, gems: 4 },
    check: (stats, state) => {
      const elements = ["fire", "water", "earth", "air", "cosmic", "shadow"];
      return elements.every(el => {
        const animals = ANIMALS.filter(a => a.element === el);
        return animals.some(a => state.collection.some(c => c.id === a.id));
      });
    },
  },
  // ── Economy ──
  {
    id: "earn_1k_coins",
    name: "Coin Hoarder",
    desc: "Earn 1,000 coins total",
    icon: "🪙",
    reward: { coins: 200 },
    check: (stats) => (stats.totalCoinsEarned || 0) >= 1000,
  },
  {
    id: "spend_500_shop",
    name: "Big Spender",
    desc: "Spend 500 coins in the shop",
    icon: "🛍️",
    reward: { gems: 3 },
    check: (stats) => (stats.totalCoinsSpent || 0) >= 500,
  },
  {
    id: "save_500",
    name: "Piggy Bank",
    desc: "Have 500 coins at once",
    icon: "🐷",
    reward: { gems: 2 },
    check: (stats, state) => state.coins >= 500,
  },
  // ── Skill ──
  {
    id: "combo_50",
    name: "Combo Demon",
    desc: "Reach a 50x combo",
    icon: "💥",
    reward: { coins: 400, gems: 5 },
    check: (stats) => stats.maxCombo >= 50,
  },
  {
    id: "perfect_mini_5",
    name: "Mini-Game Pro",
    desc: "Complete 5 perfect mini-games",
    icon: "🎯",
    reward: { coins: 300, gems: 5 },
    check: (stats) => (stats.perfectMiniGames || 0) >= 5,
  },
  {
    id: "clicks_25000",
    name: "Tap Warrior",
    desc: "Click 25,000 times total",
    icon: "✊",
    reward: { coins: 500, gems: 3 },
    check: (stats) => stats.totalClicks >= 25000,
  },
  {
    id: "clicks_100000",
    name: "Tap God",
    desc: "Click 100,000 times total",
    icon: "🦾",
    reward: { coins: 1000, gems: 10 },
    check: (stats) => stats.totalClicks >= 100000,
  },
  // ── Progression ──
  {
    id: "first_prestige",
    name: "Reborn",
    desc: "Prestige for the first time",
    icon: "⭐",
    reward: { gems: 10 },
    check: (stats, state) => state.prestigeCount >= 1,
  },
  {
    id: "prestige_3",
    name: "Eternal",
    desc: "Prestige 3 times",
    icon: "🌟",
    reward: { gems: 25 },
    check: (stats, state) => state.prestigeCount >= 3,
  },
  {
    id: "first_evolve",
    name: "Evolved!",
    desc: "Evolve your first creature",
    icon: "🧬",
    reward: { coins: 200, gems: 3 },
    check: (stats) => (stats.totalEvolutions || 0) >= 1,
  },
  {
    id: "streak_30",
    name: "Monthly Devotion",
    desc: "Play 30 days in a row",
    icon: "🗓️",
    reward: { gems: 30 },
    check: (stats) => stats.dailyStreak >= 30,
  },
];
