const STORAGE_KEY = "egg_game_save";
const CURRENT_VERSION = 4;

const DEFAULT_STATE = {
  version: CURRENT_VERSION,
  collection: [],
  totalXP: 0,
  coins: 0,
  gems: 0,
  stats: {
    totalHatches: 0,
    totalClicks: 0,
    maxCombo: 0,
    legendaryFound: 0,
    mythicFound: 0,
    dailyStreak: 0,
    miniGamesPlayed: 0,
    totalCoinsEarned: 0,
    totalCoinsSpent: 0,
    perfectMiniGames: 0,
    totalEvolutions: 0,
    fastestHatch: null,
  },
  achievements: [],
  shopPurchases: {},
  prestigeCount: 0,
  lastPlayDate: null,
  settings: {
    soundEnabled: true,
    hapticEnabled: true,
  },
  // Phase 2+ fields
  questProgress: null,
  questDate: null,
  masteryData: {},
  recentHatches: [],
  activeBuffs: [],
};

function migrate(data) {
  if (!data.version || data.version < 2) {
    // v1 -> v2: add new fields
    data.coins = data.coins || 0;
    data.gems = data.gems || 0;
    data.stats = { ...DEFAULT_STATE.stats, ...data.stats };
    data.achievements = data.achievements || [];
    data.shopPurchases = data.shopPurchases || {};
    data.prestigeCount = data.prestigeCount || 0;
    data.lastPlayDate = data.lastPlayDate || null;
    data.settings = { ...DEFAULT_STATE.settings, ...data.settings };
    data.version = 2;
  }
  if (data.version < 3) {
    // v2 -> v3: new stat counters, quest/mastery/buffs
    data.stats = { ...DEFAULT_STATE.stats, ...data.stats };
    data.questProgress = data.questProgress || null;
    data.questDate = data.questDate || null;
    data.masteryData = data.masteryData || {};
    data.recentHatches = data.recentHatches || [];
    data.activeBuffs = data.activeBuffs || [];
    data.version = 3;
  }
  if (data.version < 4) {
    // v3 -> v4: rebalance update — animal data comes from files, no stored data changes needed
    data.stats = { ...DEFAULT_STATE.stats, ...data.stats };
    data.version = 4;
  }
  return data;
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const data = JSON.parse(raw);
    return migrate({ ...DEFAULT_STATE, ...data });
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let _saveTimer = null;
export function saveGame(state) {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try {
      const toSave = {
        version: CURRENT_VERSION,
        collection: state.collection,
        totalXP: state.totalXP,
        coins: state.coins,
        gems: state.gems,
        stats: state.stats,
        achievements: state.achievements,
        shopPurchases: state.shopPurchases,
        prestigeCount: state.prestigeCount,
        lastPlayDate: state.lastPlayDate,
        settings: state.settings,
        questProgress: state.questProgress,
        questDate: state.questDate,
        masteryData: state.masteryData,
        recentHatches: state.recentHatches,
        activeBuffs: state.activeBuffs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage full or unavailable
    }
  }, 500);
}

export function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}
