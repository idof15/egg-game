import { useReducer, useEffect, useMemo } from "react";
import { loadGame, saveGame } from "../utils/storage";
import { ACHIEVEMENTS } from "../data/achievements";
import { ANIMALS, getAnimalById } from "../data/animals";
import { SHOP_ITEMS, GEM_CONSUMABLES, getItemCost, getItemEffect } from "../data/shopItems";
import { EVOLUTIONS, canEvolve, getEvolutionFor } from "../data/evolutions";
import { getElementCounts, getSynergyEffects } from "../data/elements";
import { generateQuests, getWeekKey } from "../data/quests";
import { MASTERY_TIERS, getMasteryTier, getMasteryBonuses } from "../data/mastery";

// Scaling XP: level n requires 200 + (n-1)*50 XP
function getLevelFromXP(totalXP) {
  let level = 1, xpNeeded = 200, remaining = totalXP;
  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level++;
    xpNeeded = 200 + (level - 1) * 50;
  }
  return { level, currentLevelXP: remaining, xpForNext: xpNeeded };
}

function checkDailyStreak(state) {
  const today = new Date().toDateString();
  if (state.lastPlayDate === today) return state;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isConsecutive = state.lastPlayDate === yesterday.toDateString();

  const newStreak = isConsecutive ? state.stats.dailyStreak + 1 : 1;
  const streakBonus = Math.min(newStreak, 7) * 20;
  const gemBonus = newStreak % 7 === 0 ? 7 : 0;

  return {
    ...state,
    lastPlayDate: today,
    coins: state.coins + streakBonus,
    gems: state.gems + gemBonus,
    stats: { ...state.stats, dailyStreak: newStreak },
    _dailyReward: { coins: streakBonus, gems: gemBonus, streak: newStreak },
  };
}

function checkAchievements(state) {
  const newAchievements = [];
  ACHIEVEMENTS.forEach(ach => {
    if (state.achievements.includes(ach.id)) return;
    let passed = false;
    try {
      passed = ach.check(state.stats, state);
    } catch {
      passed = false;
    }
    if (passed) newAchievements.push(ach);
  });

  if (newAchievements.length === 0) return state;

  let coins = state.coins;
  let gems = state.gems;
  newAchievements.forEach(a => {
    if (a.reward.coins) coins += a.reward.coins;
    if (a.reward.gems) gems += a.reward.gems;
  });

  return {
    ...state,
    achievements: [...state.achievements, ...newAchievements.map(a => a.id)],
    coins,
    gems,
    _newAchievements: newAchievements,
  };
}

function getPrestigeMultiplier(count) {
  const cappedCount = Math.min(count, 5);
  return 1 + cappedCount * 0.25;
}

function getShopEffects(shopPurchases) {
  const effects = { clickBonus: 0, xpMultiplier: 1, rarityBoost: 0, autoClickRate: 0, coinMultiplier: 1 };
  SHOP_ITEMS.forEach(item => {
    const level = shopPurchases[item.id] || 0;
    if (level > 0) {
      const e = getItemEffect(item, level);
      Object.keys(e).forEach(k => {
        if (k.includes("Multiplier") || k.includes("multiplier")) {
          effects[k] = (effects[k] || 1) * e[k];
        } else {
          effects[k] = (effects[k] || 0) + e[k];
        }
      });
    }
  });
  return effects;
}

// Get active buff effects from gem consumables
function getBuffEffects(activeBuffs) {
  const effects = { coinMult: 1, rarityBoost: 0, clickReduction: 0, chooseElement: null };
  (activeBuffs || []).forEach(buff => {
    if (buff.charges <= 0) return;
    if (buff.effect.coinMult) effects.coinMult *= buff.effect.coinMult;
    if (buff.effect.rarityBoost) effects.rarityBoost += buff.effect.rarityBoost;
    if (buff.effect.clickReduction) effects.clickReduction = Math.max(effects.clickReduction, buff.effect.clickReduction);
    if (buff.effect.chooseElement) effects.chooseElement = buff.selectedElement || null;
  });
  return effects;
}

// Decrement buff charges after a hatch
function decrementBuffs(activeBuffs) {
  if (!activeBuffs) return [];
  return activeBuffs
    .map(b => ({ ...b, charges: b.charges - 1 }))
    .filter(b => b.charges > 0);
}

// Update quest progress based on a hatch event
function updateQuestProgress(quests, event) {
  if (!quests) return quests;
  const updated = { ...quests };

  ["daily", "weekly", "challenge"].forEach(slot => {
    const q = updated[slot];
    if (!q || q.completed) return;

    let increment = 0;
    const track = q.track;

    if (track === "dailyHatches" || track === "weeklyHatches") increment = event.hatched ? 1 : 0;
    else if (track === "fireHatches") increment = event.element === "fire" ? 1 : 0;
    else if (track === "waterHatches") increment = event.element === "water" ? 1 : 0;
    else if (track === "earthHatches") increment = event.element === "earth" ? 1 : 0;
    else if (track === "goldenHatches") increment = event.eggType === "golden" ? 1 : 0;
    else if (track === "maxCombo") increment = event.maxCombo ? Math.max(0, event.maxCombo - q.progress) : 0;
    else if (track === "miniGames") increment = event.miniGame ? 1 : 0;
    else if (track === "miniGameCoins") increment = event.miniGameCoins || 0;
    else if (track === "evolutions") increment = event.evolved ? 1 : 0;
    else if (track === "uniqueRarities") {
      if (event.rarity && !q._seen?.includes(event.rarity)) {
        increment = 1;
        q._seen = [...(q._seen || []), event.rarity];
      }
    }
    else if (track === "uniqueElements") {
      if (event.element && !q._seen?.includes(event.element)) {
        increment = 1;
        q._seen = [...(q._seen || []), event.element];
      }
    }
    else if (track === "mythicFromBasic") increment = (event.rarity === "MYTHIC" && event.eggType === "basic") ? 1 : 0;
    else if (track === "noUpgradeHatches") increment = event.noUpgrades ? 1 : 0;

    if (increment > 0) {
      const newProgress = Math.min(q.progress + increment, q.target);
      updated[slot] = { ...q, progress: newProgress, completed: newProgress >= q.target };
    }
  });

  return updated;
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen };

    case "START_HATCH": {
      const { animal, eggType } = action;
      let newState = {
        ...state,
        screen: "hatch",
        currentAnimal: animal,
        selectedEggType: eggType,
        _hatchStartTime: Date.now(),
      };
      // Deduct egg cost
      if (eggType && eggType.cost > 0) {
        newState.coins = state.coins - eggType.cost;
        newState.stats = {
          ...state.stats,
          totalCoinsSpent: (state.stats.totalCoinsSpent || 0) + eggType.cost,
        };
      }
      return newState;
    }

    case "CLICK_EGG": {
      const effects = getShopEffects(state.shopPurchases);
      const clickValue = 1 + effects.clickBonus;
      const newClicks = state.stats.totalClicks + clickValue;
      const newCombo = (state._combo || 0) + 1;
      const maxCombo = Math.max(state.stats.maxCombo, newCombo);
      return {
        ...state,
        _combo: newCombo,
        _clickValue: clickValue,
        stats: { ...state.stats, totalClicks: newClicks, maxCombo },
      };
    }

    case "RESET_COMBO":
      return { ...state, _combo: 0 };

    case "FINISH_HATCH": {
      const animal = state.currentAnimal;
      if (!animal) return state;
      const effects = getShopEffects(state.shopPurchases);
      const prestige = getPrestigeMultiplier(state.prestigeCount);
      const eggTierMult = state.selectedEggType?.coinMultiplier || 1;
      const buffEffects = getBuffEffects(state.activeBuffs);
      const elementCounts = getElementCounts(state.collection, ANIMALS);
      const synergy = getSynergyEffects(elementCounts);

      // Apply imperfect hatch penalty (fragile eggs)
      const imperfectMult = action.imperfect ? 0.5 : 1;

      // XP with synergy
      let xpMult = effects.xpMultiplier * prestige * (1 + synergy.xpBoost);
      if (synergy.globalBoost > 0) xpMult *= (1 + synergy.globalBoost);
      if (animal.element === "shadow" && synergy.shadowXpMult > 1) xpMult *= synergy.shadowXpMult;
      const xpGain = Math.floor(animal.xp * xpMult * imperfectMult);

      // Coins with synergy + buffs
      const comboCount = state._combo || 0;
      const comboBonus = Math.floor(comboCount * 2);
      const comboMilestoneBonus = Math.floor(comboCount / 5) * 5;
      const baseCoins = 10 + Math.floor(animal.xp / 10) + synergy.flatCoinBonus;
      let coinMult = effects.coinMultiplier * eggTierMult * prestige * buffEffects.coinMult * (1 + synergy.coinBoost);
      if (synergy.globalBoost > 0) coinMult *= (1 + synergy.globalBoost);
      if (animal.element === "water" && synergy.waterCoinMult > 1) coinMult *= synergy.waterCoinMult;
      const coinGain = Math.floor((baseCoins + comboBonus + comboMilestoneBonus) * coinMult * imperfectMult);
      const isNew = !state.collection.find(c => c.id === animal.id);
      const discoveryBonus = isNew ? 25 : 0;

      const newCollection = state.collection.find(c => c.id === animal.id)
        ? state.collection.map(c => c.id === animal.id ? { ...c, count: c.count + 1 } : c)
        : [...state.collection, { id: animal.id, count: 1 }];

      const legendaryFound = state.stats.legendaryFound + (animal.rarity === "LEGENDARY" ? 1 : 0);
      const mythicFound = state.stats.mythicFound + (animal.rarity === "MYTHIC" ? 1 : 0);

      // Gems with synergy
      let gemGain = animal.rarity === "MYTHIC" ? 5 : animal.rarity === "LEGENDARY" ? 1 : 0;
      if (synergy.flatGemBonus > 0) gemGain += synergy.flatGemBonus;
      if (synergy.airGemsAlways && animal.element === "air" && gemGain === 0) gemGain = 1;

      const totalEarned = coinGain + discoveryBonus;

      // Fastest hatch tracking
      const hatchDuration = state._hatchStartTime ? Date.now() - state._hatchStartTime : null;
      const prevFastest = state.stats.fastestHatch;
      const fastestHatch = hatchDuration && (!prevFastest || hatchDuration < prevFastest) ? hatchDuration : prevFastest;

      // Mastery tracking
      const masteryData = { ...(state.masteryData || {}) };
      masteryData[animal.id] = (masteryData[animal.id] || 0) + 1;

      // Recent hatches (last 10)
      const recentHatches = [...(state.recentHatches || []), animal.emoji].slice(-10);

      // Decrement active buffs
      const newBuffs = decrementBuffs(state.activeBuffs);

      // Quest progress
      const hasUpgrades = Object.values(state.shopPurchases).some(v => v > 0);
      const questEvent = {
        hatched: true,
        element: animal.element,
        rarity: animal.rarity,
        eggType: state.selectedEggType?.id,
        maxCombo: state.stats.maxCombo,
        noUpgrades: !hasUpgrades,
      };
      const newQuests = updateQuestProgress(state.questProgress, questEvent);

      // Check for quest completion rewards
      let questCoins = 0;
      let questGems = 0;
      if (newQuests) {
        ["daily", "weekly", "challenge"].forEach(slot => {
          const q = newQuests[slot];
          const prev = state.questProgress?.[slot];
          if (q?.completed && !prev?.completed) {
            questCoins += q.reward?.coins || 0;
            questGems += q.reward?.gems || 0;
          }
        });
      }

      let newState = {
        ...state,
        screen: "reveal",
        collection: newCollection,
        totalXP: state.totalXP + xpGain,
        coins: state.coins + totalEarned + questCoins,
        gems: state.gems + gemGain + questGems,
        stats: {
          ...state.stats,
          totalHatches: state.stats.totalHatches + 1,
          legendaryFound,
          mythicFound,
          totalCoinsEarned: (state.stats.totalCoinsEarned || 0) + totalEarned,
          fastestHatch,
        },
        masteryData,
        recentHatches,
        activeBuffs: newBuffs,
        questProgress: newQuests,
        _lastRewards: { xp: xpGain, coins: totalEarned, gems: gemGain, isNew, imperfect: action.imperfect },
        _questRewards: (questCoins > 0 || questGems > 0) ? { coins: questCoins, gems: questGems } : null,
      };

      newState = checkAchievements(newState);
      return newState;
    }

    case "BUY_ITEM": {
      const item = SHOP_ITEMS.find(i => i.id === action.itemId);
      if (!item) return state;
      const currentLevel = state.shopPurchases[item.id] || 0;
      if (currentLevel >= item.maxLevel) return state;
      const cost = getItemCost(item, currentLevel);
      if (item.currency === "coins" && state.coins < cost) return state;
      if (item.currency === "gems" && state.gems < cost) return state;

      if (item.prerequisite) {
        const preLevel = state.shopPurchases[item.prerequisite.id] || 0;
        if (preLevel < item.prerequisite.level) return state;
      }

      const coinSpent = item.currency === "coins" ? cost : 0;
      let buyState = {
        ...state,
        coins: item.currency === "coins" ? state.coins - cost : state.coins,
        gems: item.currency === "gems" ? state.gems - cost : state.gems,
        shopPurchases: { ...state.shopPurchases, [item.id]: currentLevel + 1 },
        stats: { ...state.stats, totalCoinsSpent: (state.stats.totalCoinsSpent || 0) + coinSpent },
      };
      buyState = checkAchievements(buyState);
      return buyState;
    }

    case "BUY_CONSUMABLE": {
      const consumable = GEM_CONSUMABLES.find(c => c.id === action.itemId);
      if (!consumable) return state;
      if (state.gems < consumable.cost) return state;

      // For element compass, require a selected element
      const buff = {
        id: consumable.id,
        buffType: consumable.buffType,
        charges: consumable.charges,
        effect: consumable.effect,
        selectedElement: action.selectedElement || null,
      };

      return {
        ...state,
        gems: state.gems - consumable.cost,
        activeBuffs: [...(state.activeBuffs || []), buff],
      };
    }

    case "EVOLVE": {
      const { animalId } = action;
      const evo = getEvolutionFor(animalId);
      if (!evo) return state;
      const entry = state.collection.find(c => c.id === animalId);
      if (!entry || entry.count < evo.requiredCount) return state;
      if (state.collection.find(c => c.id === evo.to)) return state;

      const newCollection = state.collection
        .map(c => c.id === animalId ? { ...c, count: c.count - evo.requiredCount } : c)
        .filter(c => c.count > 0);
      newCollection.push({ id: evo.to, count: 1 });

      // Quest progress for evolution
      const newQuests = updateQuestProgress(state.questProgress, { evolved: true });

      let evoState = {
        ...state,
        collection: newCollection,
        _evolvedAnimal: evo.result,
        stats: { ...state.stats, totalEvolutions: (state.stats.totalEvolutions || 0) + 1 },
        questProgress: newQuests,
      };
      evoState = checkAchievements(evoState);
      return evoState;
    }

    case "PRESTIGE": {
      const { level } = getLevelFromXP(state.totalXP);
      if (level < 30) return state;

      // Require all COMMON + RARE + EPIC collected
      const required = ANIMALS.filter(a => !a.season && (a.rarity === "COMMON" || a.rarity === "RARE" || a.rarity === "EPIC"));
      const allCollected = required.every(a => state.collection.some(c => c.id === a.id));
      if (!allCollected) return state;

      // Require at least 1 LEGENDARY found
      if (state.stats.legendaryFound < 1) return state;

      // Require at least 100 total hatches
      if (state.stats.totalHatches < 100) return state;

      let prestigeState = {
        ...state,
        collection: [],
        totalXP: 0,
        coins: 0,
        shopPurchases: {},
        prestigeCount: state.prestigeCount + 1,
        activeBuffs: [],
        recentHatches: [],
        _combo: 0,
        // masteryData survives prestige!
      };
      prestigeState = checkAchievements(prestigeState);
      return prestigeState;
    }

    case "MINI_GAME_REWARD": {
      const mgCoins = action.coins || 0;
      // Apply synergy mini-game multiplier
      const elementCounts = getElementCounts(state.collection, ANIMALS);
      const synergy = getSynergyEffects(elementCounts);
      const finalCoins = Math.floor(mgCoins * synergy.miniGameMult);

      const questEvent = { miniGame: true, miniGameCoins: finalCoins };
      const newQuests = updateQuestProgress(state.questProgress, questEvent);

      let mgState = {
        ...state,
        coins: state.coins + finalCoins,
        stats: {
          ...state.stats,
          miniGamesPlayed: state.stats.miniGamesPlayed + 1,
          perfectMiniGames: (state.stats.perfectMiniGames || 0) + (action.perfect ? 1 : 0),
          totalCoinsEarned: (state.stats.totalCoinsEarned || 0) + finalCoins,
        },
        questProgress: newQuests,
      };
      mgState = checkAchievements(mgState);
      return mgState;
    }

    case "INIT_QUESTS": {
      const today = new Date().toDateString();
      const weekKey = getWeekKey(today);
      const existingDate = state.questDate;
      const existingWeek = existingDate ? getWeekKey(existingDate) : null;

      // Generate fresh quests if none exist or date changed
      if (!state.questProgress || existingDate !== today) {
        const quests = generateQuests(today);
        // Preserve weekly quest if same week
        if (state.questProgress?.weekly && existingWeek === weekKey && !state.questProgress.weekly.completed) {
          quests.weekly = state.questProgress.weekly;
        }
        // Preserve challenge quest if not completed
        if (state.questProgress?.challenge && !state.questProgress.challenge.completed) {
          quests.challenge = state.questProgress.challenge;
        }
        return { ...state, questProgress: quests, questDate: today };
      }
      return state;
    }

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.settings } };

    case "CLEAR_NOTIFICATIONS":
      return { ...state, _newAchievements: null, _dailyReward: null, _evolvedAnimal: null, _questRewards: null };

    default:
      return state;
  }
}

function createInitialState() {
  const saved = loadGame();
  const initialState = {
    ...saved,
    screen: "home",
    currentAnimal: null,
    selectedEggType: null,
    _combo: 0,
    _clickValue: 1,
    _lastRewards: null,
    _newAchievements: null,
    _dailyReward: null,
    _evolvedAnimal: null,
    _questRewards: null,
    _hatchStartTime: null,
  };
  return checkDailyStreak(initialState);
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  // Auto-save
  useEffect(() => {
    saveGame(state);
  }, [state.collection, state.totalXP, state.coins, state.gems, state.stats, state.achievements, state.shopPurchases, state.prestigeCount, state.settings, state.lastPlayDate, state.questProgress, state.questDate, state.masteryData, state.recentHatches, state.activeBuffs]);

  // Init quests on load
  useEffect(() => {
    dispatch({ type: "INIT_QUESTS" });
  }, []);

  const { level, currentLevelXP: levelXP, xpForNext } = getLevelFromXP(state.totalXP);
  const shopEffects = getShopEffects(state.shopPurchases);
  const prestigeMultiplier = getPrestigeMultiplier(state.prestigeCount);

  const elementCounts = useMemo(() => getElementCounts(state.collection, ANIMALS), [state.collection]);
  const synergyEffects = useMemo(() => getSynergyEffects(elementCounts), [elementCounts]);
  const buffEffects = useMemo(() => getBuffEffects(state.activeBuffs), [state.activeBuffs]);
  const masteryBonuses = useMemo(() => getMasteryBonuses(state.masteryData || {}), [state.masteryData]);

  return {
    state,
    dispatch,
    level,
    levelXP,
    xpForNext,
    shopEffects,
    prestigeMultiplier,
    elementCounts,
    synergyEffects,
    buffEffects,
    masteryBonuses,
  };
}
