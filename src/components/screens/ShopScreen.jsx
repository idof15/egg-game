import { useState } from "react";
import { SHOP_ITEMS, GEM_CONSUMABLES, getItemCost } from "../../data/shopItems";
import { playPurchaseSound } from "../../utils/sound";

const ELEMENTS = ["fire", "water", "earth", "air", "cosmic", "shadow"];
const ELEMENT_ICONS = { fire: "🔥", water: "💧", earth: "🌍", air: "💨", cosmic: "✨", shadow: "🌑" };

export default function ShopScreen({ state, dispatch }) {
  const [showElementPicker, setShowElementPicker] = useState(false);

  const handleBuy = (itemId) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    const currentLevel = state.shopPurchases[item.id] || 0;
    const cost = getItemCost(item, currentLevel);
    // Confirm if over 300 coins
    if (item.currency === "coins" && cost > 300) {
      if (!window.confirm(`Buy ${item.name} Lv.${currentLevel + 1} for ${cost} coins?`)) return;
    }
    if (state.settings.soundEnabled) playPurchaseSound();
    dispatch({ type: "BUY_ITEM", itemId });
  };

  const handleBuyConsumable = (consumableId, selectedElement) => {
    if (state.settings.soundEnabled) playPurchaseSound();
    dispatch({ type: "BUY_CONSUMABLE", itemId: consumableId, selectedElement });
    setShowElementPicker(false);
  };

  // Active buffs display
  const activeBuffs = (state.activeBuffs || []).filter(b => b.charges > 0);

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
          color: "#88dd88", fontSize: "1.6rem", letterSpacing: "0.2em",
          textTransform: "uppercase", marginBottom: "0.3rem",
        }}>🛒 Shop</h2>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <span style={{ color: "#ffdd44", fontSize: "0.9rem", fontWeight: 700 }}>🪙 {state.coins}</span>
          <span style={{ color: "#aa88ff", fontSize: "0.9rem", fontWeight: 700 }}>💎 {state.gems}</span>
        </div>

        {/* Active buffs */}
        {activeBuffs.length > 0 && (
          <>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Active Buffs
            </p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {activeBuffs.map((buff, i) => {
                const consumable = GEM_CONSUMABLES.find(c => c.id === buff.id);
                return (
                  <div key={i} style={{
                    background: "rgba(170,100,255,0.1)", border: "1px solid rgba(170,100,255,0.3)",
                    borderRadius: 8, padding: "0.3rem 0.6rem",
                    display: "flex", alignItems: "center", gap: "0.3rem",
                  }}>
                    <span style={{ fontSize: "0.9rem" }}>{consumable?.icon || "✨"}</span>
                    <span style={{ color: "#aa88ff", fontSize: "0.65rem" }}>{buff.charges} left</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Permanent Upgrades */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Upgrades
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "1.5rem" }}>
          {SHOP_ITEMS.map(item => {
            const currentLevel = state.shopPurchases[item.id] || 0;
            const maxed = currentLevel >= item.maxLevel;
            const cost = maxed ? 0 : getItemCost(item, currentLevel);
            const canAfford = maxed || (item.currency === "coins" ? state.coins >= cost : state.gems >= cost);

            let prereqMet = true;
            let prereqText = null;
            if (item.prerequisite) {
              const preLevel = state.shopPurchases[item.prerequisite.id] || 0;
              if (preLevel < item.prerequisite.level) {
                prereqMet = false;
                const preItem = SHOP_ITEMS.find(i => i.id === item.prerequisite.id);
                prereqText = `Requires ${preItem?.name || item.prerequisite.id} Lv.${item.prerequisite.level}`;
              }
            }

            return (
              <div key={item.id} style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${maxed ? "rgba(100,200,100,0.3)" : canAfford && prereqMet ? "rgba(255,180,60,0.2)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 12, padding: "0.8rem 1rem",
                opacity: prereqMet ? 1 : 0.5,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>
                      {item.name}
                      <span style={{ color: "rgba(255,180,60,0.5)", fontSize: "0.7rem", marginLeft: 6 }}>
                        Lv.{currentLevel}/{item.maxLevel}
                      </span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>{item.desc}</div>
                    {prereqText && (
                      <div style={{ color: "#ff6644", fontSize: "0.65rem", marginTop: 2 }}>{prereqText}</div>
                    )}
                  </div>
                  {maxed ? (
                    <span style={{ color: "#88dd88", fontSize: "0.75rem", fontWeight: 700 }}>MAX</span>
                  ) : (
                    <button
                      className="shop-btn"
                      onClick={() => canAfford && prereqMet && handleBuy(item.id)}
                      disabled={!canAfford || !prereqMet}
                      style={{
                        background: canAfford && prereqMet
                          ? "linear-gradient(135deg, #44aa44, #228822)"
                          : "rgba(255,255,255,0.05)",
                        border: "none", borderRadius: 999,
                        padding: "0.4rem 1rem",
                        color: canAfford && prereqMet ? "#fff" : "rgba(255,255,255,0.3)",
                        fontSize: "0.75rem", fontWeight: 700,
                        fontFamily: "inherit", cursor: canAfford && prereqMet ? "pointer" : "not-allowed",
                        minHeight: 36, touchAction: "manipulation",
                      }}
                    >
                      {item.currency === "coins" ? "🪙" : "💎"}{cost}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gem Consumables */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          💎 Gem Consumables
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {GEM_CONSUMABLES.map(item => {
            const canAfford = state.gems >= item.cost;
            const isCompass = item.id === "element_compass";

            return (
              <div key={item.id} style={{
                background: "rgba(170,100,255,0.03)",
                border: `1px solid ${canAfford ? "rgba(170,100,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 12, padding: "0.8rem 1rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>
                      {item.name}
                      <span style={{ color: "rgba(170,100,255,0.5)", fontSize: "0.65rem", marginLeft: 6 }}>
                        {item.charges} use{item.charges > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>{item.desc}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (!canAfford) return;
                      if (isCompass) {
                        setShowElementPicker(true);
                      } else {
                        handleBuyConsumable(item.id);
                      }
                    }}
                    disabled={!canAfford}
                    style={{
                      background: canAfford
                        ? "linear-gradient(135deg, #8844cc, #6622aa)"
                        : "rgba(255,255,255,0.05)",
                      border: "none", borderRadius: 999,
                      padding: "0.4rem 1rem",
                      color: canAfford ? "#fff" : "rgba(255,255,255,0.3)",
                      fontSize: "0.75rem", fontWeight: 700,
                      fontFamily: "inherit", cursor: canAfford ? "pointer" : "not-allowed",
                      minHeight: 36, touchAction: "manipulation",
                    }}
                  >
                    💎{item.cost}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Element picker modal for Element Compass */}
        {showElementPicker && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }} onClick={() => setShowElementPicker(false)}>
            <div style={{
              background: "linear-gradient(135deg, #1a1200, #0a0800)",
              border: "1px solid rgba(170,100,255,0.3)",
              borderRadius: 16, padding: "1.5rem", maxWidth: 300, width: "85%",
            }} onClick={e => e.stopPropagation()}>
              <h3 style={{ color: "#aa88ff", fontSize: "1rem", letterSpacing: "0.15em", margin: "0 0 1rem", textTransform: "uppercase", textAlign: "center" }}>
                Choose Element
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {ELEMENTS.map(el => (
                  <button key={el} onClick={() => handleBuyConsumable("element_compass", el)} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(170,100,255,0.2)",
                    borderRadius: 10, padding: "0.6rem",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    <span style={{ fontSize: "1.3rem" }}>{ELEMENT_ICONS[el]}</span>
                    <span style={{ color: "#fff", fontSize: "0.6rem", textTransform: "capitalize" }}>{el}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
