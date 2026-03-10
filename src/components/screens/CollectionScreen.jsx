import { useMemo } from "react";
import CollectionCard from "../CollectionCard";
import QuestPanel from "../QuestPanel";
import { ANIMALS, RARITY_COLORS, getAvailableAnimals, getAnimalById } from "../../data/animals";
import { EVOLUTIONS } from "../../data/evolutions";
import { ACHIEVEMENTS } from "../../data/achievements";
import { ELEMENT_SYNERGIES, ELEMENT_ICONS, getActiveSynergies } from "../../data/elements";
import { playEvolveSound } from "../../utils/sound";

export default function CollectionScreen({ state, dispatch, level, levelXP, elementCounts, synergyEffects, masteryBonuses }) {
  const available = getAvailableAnimals(level);

  const collectionDisplay = useMemo(() => {
    return state.collection.map(c => {
      const evo = EVOLUTIONS.find(e => e.to === c.id);
      if (evo) return { ...evo.result, count: c.count };
      const animal = getAnimalById(c.id);
      if (!animal) return null;
      return { ...animal, count: c.count };
    }).filter(Boolean);
  }, [state.collection]);

  const handleEvolve = (animalId) => {
    if (state.settings.soundEnabled) playEvolveSound();
    if (state.settings.hapticEnabled && navigator.vibrate) {
      navigator.vibrate([30, 50, 30, 50, 60, 100, 80]);
    }
    dispatch({ type: "EVOLVE", animalId });
  };

  const canPrestige = level >= 20 && (() => {
    const nonSeasonal = ANIMALS.filter(a => !a.season && (a.rarity === "COMMON" || a.rarity === "RARE"));
    return nonSeasonal.every(a => state.collection.some(c => c.id === a.id));
  })();

  const unlockedAchs = ACHIEVEMENTS.filter(a => state.achievements.includes(a.id));
  const activeSynergies = useMemo(() => getActiveSynergies(elementCounts), [elementCounts]);

  return (
    <div style={{
      minHeight: "100vh", background: "#050300",
      fontFamily: "'Palatino Linotype', Palatino, serif",
      padding: "1.5rem", boxSizing: "border-box",
      animation: "screenFadeIn 0.3s ease",
    }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <button className="back-btn" onClick={() => dispatch({ type: "SET_SCREEN", screen: "home" })} style={{
          background: "none", border: "none", color: "rgba(255,180,60,0.6)",
          fontSize: "0.85rem", letterSpacing: "0.15em", cursor: "pointer",
          fontFamily: "inherit", textTransform: "uppercase", padding: 0, marginBottom: "1.5rem",
          opacity: 0.7, transition: "opacity 0.2s", minHeight: 44,
        }}>← Back</button>

        <h2 style={{
          color: "#ffdd88", fontSize: "1.6rem", letterSpacing: "0.2em",
          textTransform: "uppercase", marginBottom: "0.3rem",
        }}>Collection</h2>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
          <span style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
            {state.collection.length}/{available.length} discovered
          </span>
          <span style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.72rem" }}>·</span>
          <span style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.72rem" }}>Level {level}</span>
          <span style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.72rem" }}>·</span>
          <span style={{ color: "rgba(255,180,60,0.6)", fontSize: "0.72rem" }}>{state.totalXP} XP</span>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "0.5rem" }}>
          <span style={{ color: "#ffdd44", fontSize: "0.75rem" }}>🪙 {state.coins}</span>
          <span style={{ color: "#aa88ff", fontSize: "0.75rem" }}>💎 {state.gems}</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 6, marginBottom: "1.5rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(levelXP / 200) * 100}%`, background: "linear-gradient(90deg, #ffaa00, #ffdd44)", borderRadius: 999, transition: "width 0.5s ease" }} />
        </div>

        {/* Element Synergy Section */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          Element Synergies
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "1.5rem" }}>
          {Object.entries(ELEMENT_SYNERGIES).map(([element, tiers]) => {
            const count = elementCounts[element] || 0;
            const icon = ELEMENT_ICONS[element];
            return (
              <div key={element} style={{
                background: "rgba(255,255,255,0.03)", borderRadius: 10,
                padding: "0.5rem 0.6rem", border: `1px solid rgba(255,255,255,0.06)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                  <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize" }}>{element}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", marginLeft: "auto" }}>{count}</span>
                </div>
                {tiers.map((tier, i) => {
                  const active = count >= tier.threshold;
                  return (
                    <div key={i} style={{
                      fontSize: "0.55rem",
                      color: active ? "#88dd88" : "rgba(255,255,255,0.25)",
                      marginBottom: 1,
                    }}>
                      {active ? "✓" : `${tier.threshold}:`} {tier.desc}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Mastery bonuses summary */}
        {(masteryBonuses.xpBonus > 0 || masteryBonuses.coinBonus > 0) && (
          <div style={{
            background: "rgba(255,180,60,0.05)", border: "1px solid rgba(255,180,60,0.15)",
            borderRadius: 10, padding: "0.5rem 0.7rem", marginBottom: "1.5rem",
          }}>
            <p style={{ color: "rgba(255,180,60,0.5)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
              Mastery Bonuses
            </p>
            {masteryBonuses.xpBonus > 0 && (
              <span style={{ color: "#88dd88", fontSize: "0.7rem", marginRight: "0.8rem" }}>
                +{(masteryBonuses.xpBonus * 100).toFixed(0)}% XP
              </span>
            )}
            {masteryBonuses.coinBonus > 0 && (
              <span style={{ color: "#ffdd44", fontSize: "0.7rem" }}>
                +{(masteryBonuses.coinBonus * 100).toFixed(0)}% Coins
              </span>
            )}
          </div>
        )}

        {/* Collection grid */}
        <div className="collection-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.5rem" }}>
          {collectionDisplay.map((a, i) => (
            <div key={a.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
              <CollectionCard
                animal={a}
                count={a.count}
                onEvolve={handleEvolve}
                masteryHatches={(state.masteryData || {})[a.id] || 0}
              />
            </div>
          ))}
        </div>

        {/* Undiscovered */}
        {state.collection.length < available.length && (
          <>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              Still Hiding...
            </p>
            <div className="collection-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.5rem" }}>
              {available.filter(a => !state.collection.find(c => c.id === a.id)).map(a => (
                <div key={a.id} style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{ fontSize: 28, filter: "grayscale(1) brightness(0.3)" }}>🥚</div>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>???</div>
                    <div style={{ color: RARITY_COLORS[a.rarity]?.text || "#888", fontSize: "0.62rem", opacity: 0.5, letterSpacing: "0.1em" }}>{a.rarity}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quests */}
        {state.questProgress && <QuestPanel quests={state.questProgress} />}

        {/* Achievements */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          Achievements ({unlockedAchs.length}/{ACHIEVEMENTS.length})
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
          {ACHIEVEMENTS.map(ach => {
            const unlocked = state.achievements.includes(ach.id);
            return (
              <div key={ach.id} title={unlocked ? `${ach.name}: ${ach.desc}` : "???"} style={{
                background: unlocked ? "rgba(255,180,60,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${unlocked ? "rgba(255,180,60,0.3)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 8, padding: "0.4rem",
                fontSize: "1.2rem", opacity: unlocked ? 1 : 0.3,
                cursor: "default",
              }}>{unlocked ? ach.icon : "❓"}</div>
            );
          })}
        </div>

        {/* Stats */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          Statistics
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "1.5rem" }}>
          {[
            ["Total Hatches", state.stats.totalHatches],
            ["Total Clicks", state.stats.totalClicks],
            ["Max Combo", state.stats.maxCombo],
            ["Daily Streak", state.stats.dailyStreak],
            ["Coins Earned", state.stats.totalCoinsEarned || 0],
            ["Coins Spent", state.stats.totalCoinsSpent || 0],
            ["Evolutions", state.stats.totalEvolutions || 0],
            ["Mini-Games", state.stats.miniGamesPlayed],
            ["Perfect Games", state.stats.perfectMiniGames || 0],
            ["Fastest Hatch", state.stats.fastestHatch ? `${(state.stats.fastestHatch / 1000).toFixed(1)}s` : "—"],
          ].map(([label, val]) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "0.5rem 0.7rem",
            }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
              <div style={{ color: "#ffdd88", fontSize: "1rem", fontWeight: 700 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Prestige */}
        {canPrestige && (
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p style={{ color: "rgba(255,100,255,0.6)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
              ⭐ You've proven your worth. Prestige to gain a permanent 25% bonus!
            </p>
            <button className="home-btn" onClick={() => {
              if (window.confirm("Prestige will reset your collection, XP, coins, and shop upgrades. You'll gain a permanent 25% multiplier. Mastery data is preserved. Continue?")) {
                dispatch({ type: "PRESTIGE" });
              }
            }} style={{
              background: "linear-gradient(135deg, #ff44ff, #aa00ff)",
              border: "none", borderRadius: 999, padding: "0.7rem 2rem",
              color: "#fff", fontSize: "0.85rem", letterSpacing: "0.12em",
              fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
              fontWeight: 700, minHeight: 44,
            }}>⭐ Prestige ({state.prestigeCount + 1})</button>
          </div>
        )}

        {/* Settings */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          Settings
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={state.settings.soundEnabled}
              onChange={() => dispatch({ type: "UPDATE_SETTINGS", settings: { soundEnabled: !state.settings.soundEnabled } })}
            />
            🔊 Sound
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={state.settings.hapticEnabled}
              onChange={() => dispatch({ type: "UPDATE_SETTINGS", settings: { hapticEnabled: !state.settings.hapticEnabled } })}
            />
            📳 Haptic Feedback
          </label>
        </div>
      </div>
    </div>
  );
}
