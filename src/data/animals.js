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
  { id: "kraken",     emoji: "🦑", name: "Kraken",     rarity: "MYTHIC",    color: "#cc00ff", glow: "#ee44ff", bg: ["#1a001a","#0a000a"], clicks: 120, xp: 2000, desc: "Terror of the deep abyss",     element: "water",  unlockLevel: 1 },
  { id: "celestial",  emoji: "🌟", name: "Celestial",  rarity: "MYTHIC",    color: "#ffddff", glow: "#ffffff", bg: ["#1a0d1a","#0a050a"], clicks: 150, xp: 2400, desc: "Born from starlight itself",   element: "cosmic", unlockLevel: 1 },
  { id: "world_tree", emoji: "🌳", name: "World Tree", rarity: "MYTHIC",    color: "#44ff88", glow: "#88ffbb", bg: ["#001a08","#000a04"], clicks: 140, xp: 2200, desc: "Root of all creation",         element: "earth",  unlockLevel: 20 },

  // LEGENDARY
  { id: "dragon",     emoji: "🐉", name: "Dragon",     rarity: "LEGENDARY", color: "#ff4400", glow: "#ff6600", bg: ["#1a0400","#0a0200"], clicks: 80,  xp: 1000, desc: "Ancient fire-breather",       element: "fire",   unlockLevel: 1, evolves: "elder_dragon" },
  { id: "griffin",    emoji: "🦁", name: "Griffin",     rarity: "LEGENDARY", color: "#ddaa00", glow: "#ffcc33", bg: ["#1a1200","#0a0800"], clicks: 90,  xp: 1100, desc: "King of beasts and birds",    element: "air",    unlockLevel: 5 },
  { id: "hydra",      emoji: "🐲", name: "Hydra",      rarity: "LEGENDARY", color: "#00cc66", glow: "#33ff99", bg: ["#001a0d","#000a06"], clicks: 100, xp: 1200, desc: "Cut one head, two more grow", element: "water",  unlockLevel: 8 },
  { id: "behemoth",   emoji: "🦣", name: "Behemoth",   rarity: "LEGENDARY", color: "#aa8844", glow: "#ccaa66", bg: ["#1a1008","#0a0804"], clicks: 95,  xp: 1150, desc: "Shakes the earth with each step", element: "earth", unlockLevel: 10 },
  { id: "wyvern",     emoji: "🐊", name: "Wyvern",     rarity: "LEGENDARY", color: "#44ccaa", glow: "#66eedd", bg: ["#041a14","#020a08"], clicks: 90,  xp: 1100, desc: "Venomous wings darken the sky",   element: "air",   unlockLevel: 14 },
  { id: "lich_king",  emoji: "💀", name: "Lich King",  rarity: "LEGENDARY", color: "#8844cc", glow: "#aa66ee", bg: ["#0a041a","#05020a"], clicks: 100, xp: 1200, desc: "Commands the undead legions",    element: "shadow", unlockLevel: 18 },

  // EPIC
  { id: "phoenix",    emoji: "🦅", name: "Phoenix",    rarity: "EPIC",      color: "#ff8800", glow: "#ffaa00", bg: ["#1a0c00","#0a0600"], clicks: 55,  xp: 600,  desc: "Born from the flames",        element: "fire",   unlockLevel: 1, evolves: "elder_phoenix" },
  { id: "alien",      emoji: "👾", name: "Alien",      rarity: "EPIC",      color: "#00ffaa", glow: "#44ffcc", bg: ["#001a10","#000a08"], clicks: 70,  xp: 700,  desc: "Not from this world",         element: "cosmic", unlockLevel: 1 },
  { id: "yeti",       emoji: "🦍", name: "Yeti",       rarity: "EPIC",      color: "#aaddff", glow: "#cceeFF", bg: ["#0a0d1a","#050610"], clicks: 60,  xp: 640,  desc: "Guardian of frozen peaks",    element: "water",  unlockLevel: 3 },
  { id: "kitsune",    emoji: "🦊", name: "Kitsune",    rarity: "EPIC",      color: "#ff6644", glow: "#ff8866", bg: ["#1a0800","#0a0400"], clicks: 65,  xp: 680,  desc: "Nine-tailed trickster",       element: "fire",   unlockLevel: 4 },
  { id: "cerberus",   emoji: "🐕", name: "Cerberus",   rarity: "EPIC",      color: "#880000", glow: "#cc2222", bg: ["#1a0000","#0a0000"], clicks: 70,  xp: 720,  desc: "Three-headed gate keeper",    element: "shadow", unlockLevel: 6 },
  { id: "basilisk",   emoji: "🐍", name: "Basilisk",   rarity: "EPIC",      color: "#66dd22", glow: "#88ff44", bg: ["#0a1a00","#050a00"], clicks: 60,  xp: 650,  desc: "Its gaze turns stone to dust",element: "earth",  unlockLevel: 5 },
  { id: "leviathan",  emoji: "🐋", name: "Leviathan",  rarity: "EPIC",      color: "#2288cc", glow: "#44aaee", bg: ["#041420","#020a10"], clicks: 65,  xp: 680,  desc: "The ocean bows to its will",  element: "water",  unlockLevel: 7 },
  { id: "golem",      emoji: "🗿", name: "Golem",      rarity: "EPIC",      color: "#aa8855", glow: "#ccaa77", bg: ["#1a1008","#0a0804"], clicks: 70,  xp: 700,  desc: "Forged from living stone",    element: "earth",  unlockLevel: 9 },
  { id: "djinn",      emoji: "🧞", name: "Djinn",      rarity: "EPIC",      color: "#4488ff", glow: "#66aaff", bg: ["#040820","#020410"], clicks: 60,  xp: 660,  desc: "Grants wishes at a price",    element: "air",    unlockLevel: 10 },
  { id: "chimera",    emoji: "🦁", name: "Chimera",    rarity: "EPIC",      color: "#ff4466", glow: "#ff6688", bg: ["#1a0408","#0a0204"], clicks: 65,  xp: 700,  desc: "Three beasts in one body",    element: "fire",   unlockLevel: 12 },

  // RARE
  { id: "unicorn",    emoji: "🦄", name: "Unicorn",    rarity: "RARE",      color: "#cc44ff", glow: "#dd88ff", bg: ["#0d0018","#060010"], clicks: 40,  xp: 400,  desc: "Pure magical energy",         element: "cosmic", unlockLevel: 1 },
  { id: "snake",      emoji: "🐍", name: "Snake",      rarity: "RARE",      color: "#aadd00", glow: "#ccff00", bg: ["#0d1400","#060a00"], clicks: 30,  xp: 300,  desc: "Ancient and cunning",         element: "earth",  unlockLevel: 1 },
  { id: "dino",       emoji: "🦕", name: "Dino",       rarity: "RARE",      color: "#44ddaa", glow: "#66ffcc", bg: ["#001a12","#000a08"], clicks: 40,  xp: 360,  desc: "Prehistoric giant",           element: "earth",  unlockLevel: 1 },
  { id: "pegasus",    emoji: "🐴", name: "Pegasus",    rarity: "RARE",      color: "#88bbff", glow: "#aaddff", bg: ["#080d1a","#040610"], clicks: 35,  xp: 340,  desc: "Winged horse of the sky",     element: "air",    unlockLevel: 2 },
  { id: "manticore",  emoji: "🦂", name: "Manticore",  rarity: "RARE",      color: "#dd4444", glow: "#ff6666", bg: ["#1a0404","#0a0202"], clicks: 45,  xp: 380,  desc: "Venomous tail, lion's heart", element: "fire",   unlockLevel: 3 },
  { id: "sphinx",     emoji: "🗿", name: "Sphinx",     rarity: "RARE",      color: "#ccaa44", glow: "#eedd66", bg: ["#1a1400","#0a0a00"], clicks: 40,  xp: 370,  desc: "Riddles older than time",     element: "earth",  unlockLevel: 4 },
  { id: "wolf",       emoji: "🐺", name: "Wolf",       rarity: "RARE",      color: "#8899aa", glow: "#aabbcc", bg: ["#0a0d14","#05060a"], clicks: 35,  xp: 320,  desc: "Howls at the blood moon",     element: "shadow", unlockLevel: 3 },
  { id: "stag",       emoji: "🦌", name: "Stag",       rarity: "RARE",      color: "#88aa44", glow: "#aacc66", bg: ["#0a1408","#050a04"], clicks: 35,  xp: 330,  desc: "Spirit of the ancient forest",element: "earth",  unlockLevel: 5 },
  { id: "jellyfish",  emoji: "🪼", name: "Jellyfish",  rarity: "RARE",      color: "#cc88ff", glow: "#ddaaff", bg: ["#0d0418","#06020a"], clicks: 30,  xp: 310,  desc: "Drifts through luminous tides",element: "water", unlockLevel: 6 },
  { id: "chameleon",  emoji: "🦎", name: "Chameleon",  rarity: "RARE",      color: "#44dd88", glow: "#66ffaa", bg: ["#041a0c","#020a06"], clicks: 40,  xp: 350,  desc: "Master of invisible arts",    element: "shadow", unlockLevel: 7 },
  { id: "thunderbird",emoji: "🦃", name: "Thunderbird",rarity: "RARE",      color: "#ffcc22", glow: "#ffee44", bg: ["#1a1400","#0a0a00"], clicks: 45,  xp: 390,  desc: "Lightning follows in its wake",element: "air",   unlockLevel: 9 },

  // COMMON
  { id: "turtle",     emoji: "🐢", name: "Turtle",     rarity: "COMMON",    color: "#44bb44", glow: "#66dd66", bg: ["#001a00","#000a00"], clicks: 25,  xp: 160,  desc: "Slow but wise",               element: "earth",  unlockLevel: 1 },
  { id: "chick",      emoji: "🐣", name: "Chick",      rarity: "COMMON",    color: "#ffdd00", glow: "#ffee44", bg: ["#1a1600","#0a0c00"], clicks: 12,  xp: 60,   desc: "Fluffy and adorable",         element: "air",    unlockLevel: 1 },
  { id: "frog",       emoji: "🐸", name: "Frog",       rarity: "COMMON",    color: "#22cc44", glow: "#44ee66", bg: ["#001a04","#000a02"], clicks: 15,  xp: 80,   desc: "Ribbit! Ribbit!",             element: "water",  unlockLevel: 1 },
  { id: "bunny",      emoji: "🐰", name: "Bunny",      rarity: "COMMON",    color: "#ffaacc", glow: "#ffccdd", bg: ["#1a0810","#0a0408"], clicks: 12,  xp: 70,   desc: "Hops with endless joy",       element: "earth",  unlockLevel: 1 },
  { id: "puppy",      emoji: "🐶", name: "Puppy",      rarity: "COMMON",    color: "#cc8844", glow: "#ddaa66", bg: ["#1a0c04","#0a0602"], clicks: 15,  xp: 90,   desc: "Loyal from the very start",   element: "earth",  unlockLevel: 1 },
  { id: "kitten",     emoji: "🐱", name: "Kitten",     rarity: "COMMON",    color: "#ffbb88", glow: "#ffdd99", bg: ["#1a0e04","#0a0802"], clicks: 12,  xp: 70,   desc: "Purrs like a tiny engine",    element: "shadow", unlockLevel: 1 },
  { id: "hamster",    emoji: "🐹", name: "Hamster",    rarity: "COMMON",    color: "#ffcc88", glow: "#ffddaa", bg: ["#1a1004","#0a0802"], clicks: 12,  xp: 50,   desc: "Tiny paws, big heart",        element: "earth",  unlockLevel: 1 },
  { id: "owl",        emoji: "🦉", name: "Owl",        rarity: "COMMON",    color: "#8877aa", glow: "#aa99cc", bg: ["#0d0a14","#060510"], clicks: 20,  xp: 110,  desc: "Wise beyond its years",       element: "air",    unlockLevel: 1 },
  { id: "hedgehog",   emoji: "🦔", name: "Hedgehog",   rarity: "COMMON",    color: "#aa8866", glow: "#ccaa88", bg: ["#1a0e04","#0a0602"], clicks: 18,  xp: 100,  desc: "Prickly but lovable",         element: "earth",  unlockLevel: 1 },
  { id: "duckling",   emoji: "🐥", name: "Duckling",   rarity: "COMMON",    color: "#ffee44", glow: "#ffff88", bg: ["#1a1800","#0a0c00"], clicks: 14,  xp: 75,   desc: "Always following in a line",  element: "water",  unlockLevel: 2 },
  { id: "squirrel",   emoji: "🐿️", name: "Squirrel",   rarity: "COMMON",    color: "#cc6633", glow: "#ee8855", bg: ["#1a0804","#0a0402"], clicks: 16,  xp: 85,   desc: "Hoards acorns for winter",    element: "earth",  unlockLevel: 2 },
  { id: "firefly",    emoji: "✨", name: "Firefly",    rarity: "COMMON",    color: "#ccff44", glow: "#eeff88", bg: ["#0a1a04","#050a02"], clicks: 14,  xp: 70,   desc: "Dances in the twilight",      element: "fire",   unlockLevel: 3 },

  // SEASONAL
  { id: "penguin",      emoji: "🐧", name: "Penguin",      rarity: "RARE",   color: "#44aadd", glow: "#66ccff", bg: ["#041420","#020a10"], clicks: 30, xp: 320, desc: "Waddles through the snow",     element: "water",  unlockLevel: 1, season: "winter" },
  { id: "polar_bear",   emoji: "🐻‍❄️", name: "Polar Bear",   rarity: "EPIC",   color: "#ddeeff", glow: "#ffffff", bg: ["#101418","#080a0d"], clicks: 55, xp: 620, desc: "Lord of the frozen north",    element: "water",  unlockLevel: 1, season: "winter" },
  { id: "butterfly",    emoji: "🦋", name: "Butterfly",    rarity: "RARE",   color: "#ff88dd", glow: "#ffaaee", bg: ["#1a0814","#0a040a"], clicks: 30, xp: 310, desc: "Delicate wings of wonder",     element: "air",    unlockLevel: 1, season: "spring" },
  { id: "fairy",        emoji: "🧚", name: "Fairy",        rarity: "EPIC",   color: "#88ffbb", glow: "#aaffdd", bg: ["#041a0d","#020a06"], clicks: 50, xp: 660, desc: "Sprinkles magic everywhere",   element: "cosmic", unlockLevel: 1, season: "spring" },
  { id: "salamander",   emoji: "🦎", name: "Salamander",   rarity: "RARE",   color: "#ff6622", glow: "#ff8844", bg: ["#1a0800","#0a0400"], clicks: 30, xp: 330, desc: "Basks in the summer heat",     element: "fire",   unlockLevel: 1, season: "summer" },
  { id: "bat",          emoji: "🦇", name: "Bat",          rarity: "RARE",   color: "#6644aa", glow: "#8866cc", bg: ["#0a041a","#05020a"], clicks: 30, xp: 320, desc: "Silent hunter of the night",   element: "shadow", unlockLevel: 1, season: "autumn" },
  { id: "shadow_cat",   emoji: "🐈‍⬛", name: "Shadow Cat",   rarity: "EPIC",   color: "#442266", glow: "#664488", bg: ["#0a0014","#05000a"], clicks: 60, xp: 680, desc: "Walks between two worlds",    element: "shadow", unlockLevel: 1, season: "autumn" },
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
