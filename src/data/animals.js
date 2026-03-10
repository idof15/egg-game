// ── ANIMALS DATA ──────────────────────────────────────────────────────────────
export const RARITY_COLORS = {
  MYTHIC:    { from: "#ff00ff", to: "#8800aa", text: "#ff88ff" },
  LEGENDARY: { from: "#ff8800", to: "#ff4400", text: "#ffaa44" },
  EPIC:      { from: "#aa44ff", to: "#6600ff", text: "#cc88ff" },
  RARE:      { from: "#4488ff", to: "#0044cc", text: "#88bbff" },
  COMMON:    { from: "#44bb44", to: "#226622", text: "#88dd88" },
};

export const RARITY_WEIGHTS = {
  MYTHIC: 0.5,
  LEGENDARY: 1,
  EPIC: 4,
  RARE: 10,
  COMMON: 25,
};

export const ANIMALS = [
  // MYTHIC
  { id: "kraken",     emoji: "🦑", name: "Kraken",     rarity: "MYTHIC",    color: "#cc00ff", glow: "#ee44ff", bg: ["#1a001a","#0a000a"], clicks: 30, xp: 1000, desc: "Terror of the deep abyss",     element: "water",  unlockLevel: 1 },
  { id: "celestial",  emoji: "🌟", name: "Celestial",  rarity: "MYTHIC",    color: "#ffddff", glow: "#ffffff", bg: ["#1a0d1a","#0a050a"], clicks: 35, xp: 1200, desc: "Born from starlight itself",   element: "cosmic", unlockLevel: 1 },

  // LEGENDARY
  { id: "dragon",     emoji: "🐉", name: "Dragon",     rarity: "LEGENDARY", color: "#ff4400", glow: "#ff6600", bg: ["#1a0400","#0a0200"], clicks: 20, xp: 500,  desc: "Ancient fire-breather",       element: "fire",   unlockLevel: 1, evolves: "elder_dragon" },
  { id: "griffin",    emoji: "🦁", name: "Griffin",     rarity: "LEGENDARY", color: "#ddaa00", glow: "#ffcc33", bg: ["#1a1200","#0a0800"], clicks: 22, xp: 550,  desc: "King of beasts and birds",    element: "air",    unlockLevel: 5 },
  { id: "hydra",      emoji: "🐲", name: "Hydra",      rarity: "LEGENDARY", color: "#00cc66", glow: "#33ff99", bg: ["#001a0d","#000a06"], clicks: 24, xp: 600,  desc: "Cut one head, two more grow", element: "water",  unlockLevel: 8 },

  // EPIC
  { id: "phoenix",    emoji: "🦅", name: "Phoenix",    rarity: "EPIC",      color: "#ff8800", glow: "#ffaa00", bg: ["#1a0c00","#0a0600"], clicks: 15, xp: 300,  desc: "Born from the flames",        element: "fire",   unlockLevel: 1, evolves: "elder_phoenix" },
  { id: "alien",      emoji: "👾", name: "Alien",      rarity: "EPIC",      color: "#00ffaa", glow: "#44ffcc", bg: ["#001a10","#000a08"], clicks: 18, xp: 350,  desc: "Not from this world",         element: "cosmic", unlockLevel: 1 },
  { id: "yeti",       emoji: "🦍", name: "Yeti",       rarity: "EPIC",      color: "#aaddff", glow: "#cceeFF", bg: ["#0a0d1a","#050610"], clicks: 16, xp: 320,  desc: "Guardian of frozen peaks",    element: "water",  unlockLevel: 3 },
  { id: "kitsune",    emoji: "🦊", name: "Kitsune",    rarity: "EPIC",      color: "#ff6644", glow: "#ff8866", bg: ["#1a0800","#0a0400"], clicks: 17, xp: 340,  desc: "Nine-tailed trickster",       element: "fire",   unlockLevel: 4 },
  { id: "cerberus",   emoji: "🐕", name: "Cerberus",   rarity: "EPIC",      color: "#880000", glow: "#cc2222", bg: ["#1a0000","#0a0000"], clicks: 18, xp: 360,  desc: "Three-headed gate keeper",    element: "shadow", unlockLevel: 6 },

  // RARE
  { id: "unicorn",    emoji: "🦄", name: "Unicorn",    rarity: "RARE",      color: "#cc44ff", glow: "#dd88ff", bg: ["#0d0018","#060010"], clicks: 12, xp: 200,  desc: "Pure magical energy",         element: "cosmic", unlockLevel: 1 },
  { id: "snake",      emoji: "🐍", name: "Snake",      rarity: "RARE",      color: "#aadd00", glow: "#ccff00", bg: ["#0d1400","#060a00"], clicks: 10, xp: 150,  desc: "Ancient and cunning",         element: "earth",  unlockLevel: 1 },
  { id: "dino",       emoji: "🦕", name: "Dino",       rarity: "RARE",      color: "#44ddaa", glow: "#66ffcc", bg: ["#001a12","#000a08"], clicks: 12, xp: 180,  desc: "Prehistoric giant",           element: "earth",  unlockLevel: 1 },
  { id: "pegasus",    emoji: "🐴", name: "Pegasus",    rarity: "RARE",      color: "#88bbff", glow: "#aaddff", bg: ["#080d1a","#040610"], clicks: 11, xp: 170,  desc: "Winged horse of the sky",     element: "air",    unlockLevel: 2 },
  { id: "manticore",  emoji: "🦂", name: "Manticore",  rarity: "RARE",      color: "#dd4444", glow: "#ff6666", bg: ["#1a0404","#0a0202"], clicks: 13, xp: 190,  desc: "Venomous tail, lion's heart", element: "fire",   unlockLevel: 3 },
  { id: "sphinx",     emoji: "🗿", name: "Sphinx",     rarity: "RARE",      color: "#ccaa44", glow: "#eedd66", bg: ["#1a1400","#0a0a00"], clicks: 12, xp: 185,  desc: "Riddles older than time",     element: "earth",  unlockLevel: 4 },

  // COMMON
  { id: "turtle",     emoji: "🐢", name: "Turtle",     rarity: "COMMON",    color: "#44bb44", glow: "#66dd66", bg: ["#001a00","#000a00"], clicks: 8,  xp: 80,   desc: "Slow but wise",               element: "earth",  unlockLevel: 1 },
  { id: "chick",      emoji: "🐣", name: "Chick",      rarity: "COMMON",    color: "#ffdd00", glow: "#ffee44", bg: ["#1a1600","#0a0c00"], clicks: 5,  xp: 30,   desc: "Fluffy and adorable",         element: "air",    unlockLevel: 1 },
  { id: "frog",       emoji: "🐸", name: "Frog",       rarity: "COMMON",    color: "#22cc44", glow: "#44ee66", bg: ["#001a04","#000a02"], clicks: 6,  xp: 40,   desc: "Ribbit! Ribbit!",             element: "water",  unlockLevel: 1 },
  { id: "bunny",      emoji: "🐰", name: "Bunny",      rarity: "COMMON",    color: "#ffaacc", glow: "#ffccdd", bg: ["#1a0810","#0a0408"], clicks: 5,  xp: 35,   desc: "Hops with endless joy",       element: "earth",  unlockLevel: 1 },
  { id: "puppy",      emoji: "🐶", name: "Puppy",      rarity: "COMMON",    color: "#cc8844", glow: "#ddaa66", bg: ["#1a0c04","#0a0602"], clicks: 6,  xp: 45,   desc: "Loyal from the very start",   element: "earth",  unlockLevel: 1 },
  { id: "kitten",     emoji: "🐱", name: "Kitten",     rarity: "COMMON",    color: "#ffbb88", glow: "#ffdd99", bg: ["#1a0e04","#0a0802"], clicks: 5,  xp: 35,   desc: "Purrs like a tiny engine",    element: "shadow", unlockLevel: 1 },
  { id: "hamster",    emoji: "🐹", name: "Hamster",    rarity: "COMMON",    color: "#ffcc88", glow: "#ffddaa", bg: ["#1a1004","#0a0802"], clicks: 4,  xp: 25,   desc: "Tiny paws, big heart",        element: "earth",  unlockLevel: 1 },
  { id: "owl",        emoji: "🦉", name: "Owl",        rarity: "COMMON",    color: "#8877aa", glow: "#aa99cc", bg: ["#0d0a14","#060510"], clicks: 7,  xp: 55,   desc: "Wise beyond its years",       element: "air",    unlockLevel: 1 },

  // SEASONAL
  { id: "penguin",      emoji: "🐧", name: "Penguin",      rarity: "RARE",   color: "#44aadd", glow: "#66ccff", bg: ["#041420","#020a10"], clicks: 10, xp: 160, desc: "Waddles through the snow",     element: "water",  unlockLevel: 1, season: "winter" },
  { id: "polar_bear",   emoji: "🐻‍❄️", name: "Polar Bear",   rarity: "EPIC",   color: "#ddeeff", glow: "#ffffff", bg: ["#101418","#080a0d"], clicks: 15, xp: 310, desc: "Lord of the frozen north",    element: "water",  unlockLevel: 1, season: "winter" },
  { id: "butterfly",    emoji: "🦋", name: "Butterfly",    rarity: "RARE",   color: "#ff88dd", glow: "#ffaaee", bg: ["#1a0814","#0a040a"], clicks: 9,  xp: 155, desc: "Delicate wings of wonder",     element: "air",    unlockLevel: 1, season: "spring" },
  { id: "fairy",        emoji: "🧚", name: "Fairy",        rarity: "EPIC",   color: "#88ffbb", glow: "#aaffdd", bg: ["#041a0d","#020a06"], clicks: 14, xp: 330, desc: "Sprinkles magic everywhere",   element: "cosmic", unlockLevel: 1, season: "spring" },
  { id: "salamander",   emoji: "🦎", name: "Salamander",   rarity: "RARE",   color: "#ff6622", glow: "#ff8844", bg: ["#1a0800","#0a0400"], clicks: 10, xp: 165, desc: "Basks in the summer heat",     element: "fire",   unlockLevel: 1, season: "summer" },
  { id: "bat",          emoji: "🦇", name: "Bat",          rarity: "RARE",   color: "#6644aa", glow: "#8866cc", bg: ["#0a041a","#05020a"], clicks: 10, xp: 160, desc: "Silent hunter of the night",   element: "shadow", unlockLevel: 1, season: "autumn" },
  { id: "shadow_cat",   emoji: "🐈‍⬛", name: "Shadow Cat",   rarity: "EPIC",   color: "#442266", glow: "#664488", bg: ["#0a0014","#05000a"], clicks: 16, xp: 340, desc: "Walks between two worlds",    element: "shadow", unlockLevel: 1, season: "autumn" },
];

export function getAnimalById(id) {
  return ANIMALS.find(a => a.id === id);
}

export function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function getAvailableAnimals(level) {
  const season = getCurrentSeason();
  return ANIMALS.filter(a => {
    if (a.unlockLevel > level) return false;
    if (a.season && a.season !== season) return false;
    return true;
  });
}
