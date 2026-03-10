// Element synergy bonuses unlocked at 3/5/8 collected animals of that element
export const ELEMENT_SYNERGIES = {
  fire: [
    { threshold: 3, desc: "+10% click damage", effect: { clickDmgBoost: 0.10 } },
    { threshold: 5, desc: "+15% coins", effect: { coinBoost: 0.15 } },
    { threshold: 8, desc: "Hatch 20% faster", effect: { clickReduction: 0.20 } },
  ],
  water: [
    { threshold: 3, desc: "+5% XP", effect: { xpBoost: 0.05 } },
    { threshold: 5, desc: "+10% rare chance", effect: { rarityBoost: 0.10 } },
    { threshold: 8, desc: "2x coins on water animals", effect: { waterCoinMult: 2 } },
  ],
  earth: [
    { threshold: 3, desc: "+20 coins/hatch", effect: { flatCoinBonus: 20 } },
    { threshold: 5, desc: "+0.5 auto-click/s", effect: { autoClickBonus: 0.5 } },
    { threshold: 8, desc: "-3 clicks on earth eggs", effect: { earthClickReduction: 3 } },
  ],
  air: [
    { threshold: 3, desc: "+0.5s combo timer", effect: { comboTimerBonus: 500 } },
    { threshold: 5, desc: "+15% XP", effect: { xpBoost: 0.15 } },
    { threshold: 8, desc: "Air animals always give gems", effect: { airGemsAlways: true } },
  ],
  cosmic: [
    { threshold: 3, desc: "+5% all bonuses", effect: { globalBoost: 0.05 } },
    { threshold: 5, desc: "+1 gem/hatch", effect: { flatGemBonus: 1 } },
    { threshold: 8, desc: "2x mythic chance on cosmic eggs", effect: { cosmicMythicMult: 2 } },
  ],
  shadow: [
    { threshold: 3, desc: "2x mini-game rewards", effect: { miniGameMult: 2 } },
    { threshold: 5, desc: "+10% prestige bonus", effect: { prestigeBoost: 0.10 } },
    { threshold: 8, desc: "3x XP on shadow animals", effect: { shadowXpMult: 3 } },
  ],
};

export const ELEMENT_ICONS = {
  fire: "🔥",
  water: "💧",
  earth: "🌍",
  air: "💨",
  cosmic: "✨",
  shadow: "🌑",
};

// Compute active synergy effects based on collection
export function getElementCounts(collection, animals) {
  const counts = {};
  collection.forEach(c => {
    const animal = animals.find(a => a.id === c.id);
    if (animal && animal.element) {
      counts[animal.element] = (counts[animal.element] || 0) + 1;
    }
  });
  return counts;
}

export function getActiveSynergies(elementCounts) {
  const active = {};
  Object.entries(ELEMENT_SYNERGIES).forEach(([element, tiers]) => {
    const count = elementCounts[element] || 0;
    active[element] = tiers.filter(t => count >= t.threshold);
  });
  return active;
}

export function getSynergyEffects(elementCounts) {
  const effects = {
    clickDmgBoost: 0,
    coinBoost: 0,
    clickReduction: 0,
    xpBoost: 0,
    rarityBoost: 0,
    waterCoinMult: 1,
    flatCoinBonus: 0,
    autoClickBonus: 0,
    earthClickReduction: 0,
    comboTimerBonus: 0,
    airGemsAlways: false,
    globalBoost: 0,
    flatGemBonus: 0,
    cosmicMythicMult: 1,
    miniGameMult: 1,
    prestigeBoost: 0,
    shadowXpMult: 1,
  };

  Object.entries(ELEMENT_SYNERGIES).forEach(([element, tiers]) => {
    const count = elementCounts[element] || 0;
    tiers.forEach(tier => {
      if (count >= tier.threshold) {
        Object.entries(tier.effect).forEach(([key, val]) => {
          if (typeof val === "boolean") {
            effects[key] = val;
          } else if (key.includes("Mult")) {
            effects[key] = Math.max(effects[key], val);
          } else {
            effects[key] += val;
          }
        });
      }
    });
  });

  return effects;
}
