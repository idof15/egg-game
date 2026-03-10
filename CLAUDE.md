# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite on port 3000, auto-opens browser)
- **Build:** `npm run build`
- **Preview prod build:** `npm run preview`
- No test framework is configured.

## Architecture

Single-page React 19 app built with Vite. No router, CSS framework, or external state library. Uses `useReducer` for game state with localStorage persistence (v3). Styling is mostly inline with shared keyframes in `src/styles/animations.css`.

### Key files

- `src/EggGame.jsx` — Orchestrator: renders screens, toasts, mini-game overlay, keyboard shortcuts (H/C/S).
- `src/App.jsx` — Thin wrapper that renders `<EggGame />` and Vercel SpeedInsights.
- `src/main.jsx` — React entry point.
- `src/BL.jsx` — Legacy single-file version (kept for reference, no longer imported).
- `vite.config.js` — Vite config with React plugin, dev server on port 3000.

### Data files (`src/data/`)

- `animals.js` — ~30 animals (COMMON → MYTHIC), seasonal creatures, element types, rarity weights.
- `eggTypes.js` — 4 egg tiers (Basic free, Golden, Mystic, Cosmic) with rarity filters and `coinMultiplier`.
- `achievements.js` — 28 achievements with condition functions and coin/gem rewards.
- `shopItems.js` — 5 permanent upgrades + 4 gem consumables (`GEM_CONSUMABLES`).
- `evolutions.js` — 13 evolution chains.
- `elements.js` — Element synergy system: bonuses at 3/5/8 collected per element (fire, water, earth, air, cosmic, shadow).
- `hazards.js` — Egg hazards (Freeze, Wobble, Overheat) that spawn at crack levels 2/4.
- `quests.js` — Deterministic daily/weekly/challenge quest generation from date seed.
- `mastery.js` — Per-animal mastery tiers (3/10/25/50 hatches) with stacking bonuses.

### Hooks (`src/hooks/`)

- `useGameState.js` — `useReducer` + auto-save. Actions: `START_HATCH`, `CLICK_EGG`, `FINISH_HATCH`, `SET_SCREEN`, `BUY_ITEM`, `BUY_CONSUMABLE`, `EVOLVE`, `PRESTIGE`, `MINI_GAME_REWARD`, `INIT_QUESTS`, `UPDATE_SETTINGS`, `CLEAR_NOTIFICATIONS`. Exposes `elementCounts`, `synergyEffects`, `buffEffects`, `masteryBonuses`.
- `useParticles.js` — Manages particles, ripples, floating text state with spawn helpers.

### Utils (`src/utils/`)

- `storage.js` — `saveGame()`/`loadGame()` with debounced writes and version migration (v2→v3).
- `sound.js` — Web Audio API procedural sounds (tap, combo, hatch, reveal, purchase, achievement, evolve, hazard, hazardSuccess).
- `pickEgg.js` — Weighted random selection filtered by egg type, level, rarity boost.
- `uid.js` — Simple incrementing ID generator.

### Components (`src/components/`)

- `EggSVG.jsx` — SVG egg with crack levels, egg-type visual variants.
- `Particles.jsx` — Renders particle divs with CSS animations.
- `CollectionCard.jsx` — Card for collected animals, shows evolve button and mastery progress.
- `MiniGame.jsx` — Mini-game router that randomly picks from 5 game types.
- `QuestPanel.jsx` — Displays daily/weekly/challenge quest progress.
- `minigames/QuickTap.jsx` — Tap 20+ times in 5 seconds.
- `minigames/PatternMemory.jsx` — Memorize and replay emoji sequence.
- `minigames/ElementMatch.jsx` — Find pairs in 3x3 grid.
- `minigames/EggCatch.jsx` — Tap falling eggs before they hit the ground.
- `minigames/LuckySpin.jsx` — Spend gems for weighted prizes (gem sink).

### Screens (`src/components/screens/`)

- `HomeScreen.jsx` — Egg selection, currency, daily streak, quest panel, hatch history strip, keyboard shortcuts [1-4] for egg select.
- `HatchScreen.jsx` — Click-to-hatch with hazards, fragile egg system, synergy effects, active buff icons.
- `RevealScreen.jsx` — Animal reveal with rewards breakdown, imperfect hatch indicator.
- `CollectionScreen.jsx` — Collection grid, element synergy progress, mastery bonuses, expanded stats, quests, achievements, prestige, settings.
- `ShopScreen.jsx` — Permanent upgrades + gem consumable shop with element picker.

### Game structure

5 screens: `"home"`, `"hatch"`, `"reveal"`, `"collection"`, `"shop"`. State persists to localStorage v3 (collection, XP, coins, gems, stats, achievements, shop, prestige, settings, quests, mastery, recentHatches, activeBuffs).

Key systems:
- **Economy**: Coins (scaled by egg tier `coinMultiplier` + combo milestones), Gems (achievements + mythic/legendary finds + streak + synergy).
- **Egg types**: 4 tiers filtering rarities, costing coins. Mystic/Cosmic have fragility mechanic.
- **Shop upgrades**: 5 permanent tiered upgrades + 4 gem consumables (Golden Touch, Rarity Aura, Element Compass, Time Warp).
- **Element synergies**: Collecting 3/5/8 of an element grants passive bonuses (click dmg, coins, XP, rarity, auto-click, etc.).
- **Achievements**: 28 milestones with toast notifications and rewards.
- **Quests**: Daily/weekly/challenge quests generated from date seed, with coin/gem rewards.
- **Daily streak**: Consecutive-day tracking with scaling coin/gem rewards.
- **Evolution**: 13 evolution chains. Collect N duplicates → evolve to stronger form.
- **Mastery**: Per-animal hatching track (3/10/25/50) granting XP bonus, synergy doubling, coin bonus. Survives prestige.
- **Hazards**: At crack levels 2/4, ~40% chance of Freeze/Wobble/Overheat challenges.
- **Fragile eggs**: Mystic/Cosmic eggs penalize speed-clicking (imperfect hatch = reduced rewards).
- **Prestige**: At level 20+ with all common/rare collected, reset for permanent 25% multiplier. Mastery preserved.
- **Mini-games**: 5 types (Quick Tap, Pattern Memory, Element Match, Egg Catch, Lucky Spin) every 5th hatch + 10% random.
- **Sound**: Web Audio API procedural sounds with mute toggle.
- **Keyboard shortcuts**: H=home, C=collection, S=shop, 1-4=egg quick-select.
- **Accessibility**: ARIA labels, keyboard support, reduced-motion, haptic feedback toggle.
