export const MASTERY_TIERS = [
  { tier: 1, hatches: 3, label: "Lore Unlocked", icon: "📜", desc: "Unlock lore text" },
  { tier: 2, hatches: 10, label: "XP Adept", icon: "📗", desc: "+1% XP bonus" },
  { tier: 3, hatches: 25, label: "Synergy Master", icon: "🔗", desc: "Element synergy counts double" },
  { tier: 4, hatches: 50, label: "Golden Master", icon: "🥇", desc: "+2% coin bonus, golden border" },
];

export function getMasteryTier(hatches) {
  let tier = 0;
  for (const t of MASTERY_TIERS) {
    if (hatches >= t.hatches) tier = t.tier;
  }
  return tier;
}

export function getMasteryProgress(hatches) {
  const tier = getMasteryTier(hatches);
  const nextTier = MASTERY_TIERS.find(t => t.tier === tier + 1);
  if (!nextTier) return { tier, progress: 1, nextHatches: null };
  return {
    tier,
    progress: hatches / nextTier.hatches,
    nextHatches: nextTier.hatches,
  };
}

// Compute global bonuses from all mastered animals
export function getMasteryBonuses(masteryData) {
  let xpBonus = 0;
  let coinBonus = 0;
  let doubleElementIds = [];

  Object.entries(masteryData).forEach(([animalId, hatches]) => {
    const tier = getMasteryTier(hatches);
    if (tier >= 2) xpBonus += 0.01; // +1% per tier-2 animal
    if (tier >= 3) doubleElementIds.push(animalId);
    if (tier >= 4) coinBonus += 0.02; // +2% per tier-4 animal
  });

  return { xpBonus, coinBonus, doubleElementIds };
}
