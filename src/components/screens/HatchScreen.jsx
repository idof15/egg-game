import { useState, useEffect, useRef, useCallback } from "react";
import EggSVG from "../EggSVG";
import Particles from "../Particles";
import { RARITY_COLORS } from "../../data/animals";
import { useParticles } from "../../hooks/useParticles";
import { shouldSpawnHazard, pickHazard } from "../../data/hazards";
import { playTapSound, playComboSound, playHatchSound, playAutoTapSound, playHazardSound, playHazardSuccessSound } from "../../utils/sound";

export default function HatchScreen({ state, dispatch, level, levelXP, xpForNext, shopEffects, synergyEffects, buffEffects }) {
  const animal = state.currentAnimal;
  const eggType = state.selectedEggType;

  // Apply time warp buff and earth synergy click reduction
  const baseMaxClicks = animal?.clicks || 20;
  const levelScaling = 1 + 0.02 * Math.max(0, level - 1);
  const scaledClicks = Math.ceil(baseMaxClicks * levelScaling);
  const earthReduction = (animal?.element === "earth" && synergyEffects?.earthClickReduction) ? synergyEffects.earthClickReduction : 0;
  const buffClickReduction = buffEffects?.clickReduction || 0;
  const maxClicks = Math.max(3, Math.floor((scaledClicks - earthReduction) * (1 - buffClickReduction)));

  const [clicks, setClicks] = useState(0);
  const [wobble, setWobble] = useState(0);
  const [combo, setCombo] = useState(0);
  const [eggShake, setEggShake] = useState(false);
  const [bgPulse, setBgPulse] = useState(false);
  const [hatching, setHatching] = useState(false);
  const containerRef = useRef(null);
  const wobbleRef = useRef(null);
  const comboTimerRef = useRef(null);

  // Fragile egg state (Phase 4A)
  const isFragile = eggType && (eggType.id === "mystic" || eggType.id === "cosmic");
  const fragilityThreshold = eggType?.id === "cosmic" ? 15 : 20;
  const [fragility, setFragility] = useState(0);
  const [imperfect, setImperfect] = useState(false);

  // Hazard state (Phase 2B)
  const [activeHazard, setActiveHazard] = useState(null);
  const [hazardTaps, setHazardTaps] = useState(0);
  const [hazardTimer, setHazardTimer] = useState(null);
  const [hazardResult, setHazardResult] = useState(null); // "success" | "fail" | null
  const lastHazardCrack = useRef(-1);

  // Tremor state: track alternating L/R taps
  const [tremorLastSide, setTremorLastSide] = useState(null);

  // Auto-clicker energy system
  const [autoEnergy, setAutoEnergy] = useState(100);
  const [autoEnergyPaused, setAutoEnergyPaused] = useState(false);
  const autoEnergyRef = useRef(autoEnergy);
  const autoEnergyPausedRef = useRef(autoEnergyPaused);
  autoEnergyRef.current = autoEnergy;
  autoEnergyPausedRef.current = autoEnergyPaused;

  // Refs for values needed in auto-clicker
  const clicksRef = useRef(clicks);
  const comboRef = useRef(combo);
  const hatchingRef = useRef(hatching);
  clicksRef.current = clicks;
  comboRef.current = combo;
  hatchingRef.current = hatching;

  const { particles, ripples, floatingTexts, spawnParticles, spawnRipple, spawnFloatingText } = useParticles();

  const progress = Math.min(clicks / maxClicks, 1);
  const crackLevel = Math.floor(progress * 5);
  const animalColor = animal?.color || "#ffaa44";
  const animalGlow = animal?.glow || "#ffcc44";

  // Combo timer extension from air synergy
  const comboTimeout = 2000 + (synergyEffects?.comboTimerBonus || 0);

  // Auto-clicker energy recharge
  const autoRate = shopEffects.autoClickRate + (synergyEffects?.autoClickBonus || 0);
  useEffect(() => {
    if (autoRate <= 0) return;
    const interval = setInterval(() => {
      setAutoEnergy(prev => {
        const isIdle = hatchingRef.current || autoEnergyPausedRef.current;
        const rechargeRate = isIdle ? 2 : 0.5;
        const next = Math.min(100, prev + rechargeRate);
        if (autoEnergyPausedRef.current && next >= 20) {
          setAutoEnergyPaused(false);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRate]);

  // Check for hazard spawn at crack levels 1-4
  useEffect(() => {
    if (activeHazard || hatching) return;
    if (crackLevel >= 1 && crackLevel <= 4 && lastHazardCrack.current !== crackLevel) {
      lastHazardCrack.current = crackLevel;
      if (shouldSpawnHazard(crackLevel)) {
        const hazard = pickHazard(animal?.element);
        setActiveHazard(hazard);
        setHazardTaps(0);
        setHazardResult(null);
        setTremorLastSide(null);
        if (state.settings.soundEnabled) playHazardSound();

        if (hazard.id === "freeze") {
          const timer = setTimeout(() => {
            setHazardResult("fail");
            setClicks(c => Math.max(0, c - hazard.penalty));
            setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 1000);
          }, hazard.timeLimit);
          setHazardTimer(timer);
        } else if (hazard.id === "overheat" || hazard.id === "void_pull") {
          const timer = setTimeout(() => {
            setHazardResult("success");
            if (state.settings.soundEnabled) playHazardSuccessSound();
            setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 800);
          }, hazard.cooldownTime);
          setHazardTimer(timer);
        } else if (hazard.id === "wobble") {
          const timer = setTimeout(() => {
            setHazardResult("fail");
            setClicks(c => Math.max(0, c - hazard.penalty));
            setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 1000);
          }, hazard.timeLimit);
          setHazardTimer(timer);
        } else if (hazard.id === "tremor") {
          const timer = setTimeout(() => {
            setHazardResult("fail");
            setClicks(c => Math.max(0, c - hazard.penalty));
            setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 1000);
          }, hazard.timeLimit);
          setHazardTimer(timer);
        }
      }
    }
  }, [crackLevel, activeHazard, hatching, animal?.element, state.settings.soundEnabled]);

  // Cleanup hazard timer
  useEffect(() => () => { if (hazardTimer) clearTimeout(hazardTimer); }, [hazardTimer]);

  const handleHazardTap = useCallback((side) => {
    if (!activeHazard) return false;

    if (activeHazard.id === "freeze") {
      const newTaps = hazardTaps + 1;
      setHazardTaps(newTaps);
      if (newTaps >= activeHazard.targetTaps) {
        clearTimeout(hazardTimer);
        setHazardResult("success");
        if (state.settings.soundEnabled) playHazardSuccessSound();
        setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 800);
      }
      return true; // consumed the tap
    }

    if (activeHazard.id === "wobble") {
      // Timing window: success if tapped in the middle third of the time
      const elapsed = Date.now() - (activeHazard._startTime || Date.now());
      const ratio = elapsed / activeHazard.timeLimit;
      if (ratio > 0.3 && ratio < 0.7) {
        clearTimeout(hazardTimer);
        setHazardResult("success");
        if (state.settings.soundEnabled) playHazardSuccessSound();
        setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 800);
      } else {
        clearTimeout(hazardTimer);
        setHazardResult("fail");
        setClicks(c => Math.max(0, c - activeHazard.penalty));
        setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 1000);
      }
      return true;
    }

    if (activeHazard.id === "overheat" || activeHazard.id === "void_pull") {
      // Clicking during overheat/void_pull = fail
      clearTimeout(hazardTimer);
      setHazardResult("fail");
      setClicks(c => Math.max(0, c - activeHazard.penalty));
      setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 1000);
      return true;
    }

    if (activeHazard.id === "tremor") {
      // Must alternate L/R taps
      if (side && side !== tremorLastSide) {
        setTremorLastSide(side);
        const newTaps = hazardTaps + 1;
        setHazardTaps(newTaps);
        if (newTaps >= activeHazard.targetTaps) {
          clearTimeout(hazardTimer);
          setHazardResult("success");
          if (state.settings.soundEnabled) playHazardSuccessSound();
          setTimeout(() => { setActiveHazard(null); setHazardResult(null); }, 800);
        }
      }
      // If same side tapped, don't count but don't fail either
      return true;
    }

    return false;
  }, [activeHazard, hazardTaps, hazardTimer, state.settings.soundEnabled, tremorLastSide]);

  // Store hazard start time
  useEffect(() => {
    if (activeHazard && !activeHazard._startTime) {
      setActiveHazard(h => h ? { ...h, _startTime: Date.now() } : h);
    }
  }, [activeHazard]);

  const doClick = useCallback((x, y, isAuto = false) => {
    if (hatchingRef.current) return;

    // Handle active hazard first
    if (activeHazard && !isAuto) {
      handleHazardTap();
      return;
    }
    if (activeHazard) return; // Auto-clicker doesn't work during hazards

    // Auto-clicker energy check
    if (isAuto) {
      if (autoEnergyPausedRef.current || autoEnergyRef.current < 1) {
        setAutoEnergyPaused(true);
        return;
      }
      setAutoEnergy(prev => {
        const next = prev - 1;
        if (next <= 0) setAutoEnergyPaused(true);
        return Math.max(0, next);
      });
    }

    const clickValue = 1 + shopEffects.clickBonus + (synergyEffects?.clickDmgBoost ? Math.floor(shopEffects.clickBonus * synergyEffects.clickDmgBoost) : 0);
    const curClicks = clicksRef.current;
    const newClicks = Math.min(curClicks + clickValue, maxClicks);
    setClicks(newClicks);
    dispatch({ type: "CLICK_EGG" });

    if (state.settings.soundEnabled) {
      if (isAuto) playAutoTapSound();
      else playTapSound(clickValue);
    }

    if (!isAuto && state.settings.hapticEnabled && navigator.vibrate) {
      navigator.vibrate(15);
    }

    if (!isAuto) {
      const curCombo = comboRef.current;
      const newCombo = curCombo + 1;
      setCombo(newCombo);

      // Fragile egg: track combo speed
      if (isFragile && newCombo > fragilityThreshold) {
        setFragility(f => Math.min(f + 1, 10));
        if (fragility >= 8) setImperfect(true);
      }

      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => { setCombo(0); setFragility(0); }, comboTimeout);

      if (state.settings.soundEnabled && newCombo >= 3) {
        playComboSound(newCombo);
      }

      clearTimeout(wobbleRef.current);
      setWobble(newCombo >= 5 ? 14 : 8);
      wobbleRef.current = setTimeout(() => setWobble(0), 140);

      if (newCombo >= 3) {
        const text = newCombo >= 10 ? "🔥ULTRA!" : newCombo >= 7 ? "⚡SUPER!" : `x${newCombo}`;
        spawnFloatingText(x, y - 20, text);
      }

      // Combo milestone bonus text
      if (newCombo > 0 && newCombo % 5 === 0) {
        spawnFloatingText(x + 30, y - 40, "+5🪙");
      }
    }

    spawnRipple(x, y, comboRef.current >= 5);

    const milestone = newClicks > 0 && newClicks % Math.ceil(maxClicks / 5) === 0;
    if (milestone) {
      setEggShake(true);
      setTimeout(() => setEggShake(false), 350);
      setBgPulse(true);
      setTimeout(() => setBgPulse(false), 400);
      const cols = animal ? [animal.color, animal.glow, "#fff", "#ffdd00"] : ["#ff8800", "#fff"];
      spawnParticles(x, y, newClicks >= maxClicks - 2 ? 22 : 10, cols);
    }

    if (newClicks >= maxClicks) {
      setHatching(true);
      if (state.settings.soundEnabled) playHatchSound();
      if (state.settings.hapticEnabled && navigator.vibrate) {
        navigator.vibrate([30, 50, 30, 50, 60]);
      }
      const bigCols = animal ? [animal.color, animal.glow, "#fff", "#ffee44", "#ffaa00"] : ["#ff8800", "#fff"];
      spawnParticles(x, y, 40, bigCols, 180);
      setTimeout(() => {
        dispatch({ type: "FINISH_HATCH", imperfect });
      }, 700);
    }
  }, [animal, maxClicks, dispatch, shopEffects, synergyEffects, state.settings, spawnParticles, spawnRipple, spawnFloatingText, activeHazard, handleHazardTap, isFragile, fragilityThreshold, fragility, imperfect, comboTimeout]);

  // Auto-clicker (with synergy bonus and energy system)
  useEffect(() => {
    if (autoRate > 0 && !hatching) {
      const rate = 1000 / autoRate;
      const interval = setInterval(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          doClick(rect.width / 2, rect.height / 2, true);
        }
      }, rate);
      return () => clearInterval(interval);
    }
  }, [autoRate, hatching, doClick]);

  const handleClick = useCallback((e) => {
    if (hatching) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;
    doClick(x, y, false);
  }, [doClick, hatching]);

  // Active buffs display
  const activeBuffIcons = (state.activeBuffs || []).filter(b => b.charges > 0).map(b => {
    const icons = { goldenTouch: "👑", rarityAura: "🔮", elementCompass: "🧭", timeWarp: "⏳" };
    return { icon: icons[b.buffType] || "✨", charges: b.charges };
  });

  const xpBarPercent = xpForNext > 0 ? (levelXP / xpForNext) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      role="button"
      aria-label={`Tap egg to hatch. ${clicks} of ${maxClicks} clicks.`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          const rect = containerRef.current?.getBoundingClientRect();
          doClick(rect ? rect.width / 2 : 100, rect ? rect.height / 2 : 100, false);
        }
        // Tremor hazard: use A/D or ArrowLeft/ArrowRight
        if (activeHazard?.id === "tremor" && !hazardResult) {
          if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            e.preventDefault();
            e.stopPropagation();
            handleHazardTap("left");
          } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            e.preventDefault();
            e.stopPropagation();
            handleHazardTap("right");
          }
        }
      }}
      style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        background: bgPulse
          ? `radial-gradient(ellipse at center, ${animalColor}22 0%, #060400 100%)`
          : "radial-gradient(ellipse at center, #1c1400 0%, #060400 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Palatino Linotype', Palatino, serif",
        cursor: "pointer", userSelect: "none",
        transition: "background 0.3s ease",
        touchAction: "manipulation",
        animation: "screenFadeIn 0.3s ease",
        outline: "none",
      }}
    >
      {/* Stars */}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{
          position: "fixed", borderRadius: "50%", background: i % 4 === 0 ? animalColor : "#fff",
          width: 2, height: 2, pointerEvents: "none",
          left: `${(i * 43 + 9) % 100}%`, top: `${(i * 59 + 13) % 100}%`,
          animation: `starTwinkle ${2 + (i % 4) * 0.8}s ease-in-out infinite`,
          animationDelay: `${(i * 0.28) % 4}s`, opacity: 0.3,
        }} />
      ))}

      <Particles particles={particles} />

      {/* Ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y,
          width: r.big ? 60 : 40, height: r.big ? 60 : 40,
          borderRadius: "50%",
          border: `2px solid ${crackLevel >= 3 ? animalColor : "#ffcc44"}`,
          pointerEvents: "none",
          animation: "rippleExpand 0.65s ease-out forwards",
          zIndex: 40,
        }} />
      ))}

      {/* Auto-clicker indicator with energy bar */}
      {autoRate > 0 && (
        <div style={{
          position: "absolute", top: "5%", right: "4%",
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem",
        }}>
          <div style={{
            color: autoEnergyPaused ? "rgba(255,100,100,0.6)" : "rgba(100,200,100,0.6)",
            fontSize: "0.65rem", letterSpacing: "0.1em",
          }}>
            🤖 {autoEnergyPaused ? "RECHARGING" : "AUTO"}
          </div>
          <div style={{ width: 50, background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${autoEnergy}%`,
              background: autoEnergyPaused ? "#ff6644" : autoEnergy < 30 ? "#ffaa00" : "#66cc66",
              borderRadius: 999, transition: "width 0.3s ease",
            }} />
          </div>
        </div>
      )}

      {/* Active buff icons */}
      {activeBuffIcons.length > 0 && (
        <div style={{
          position: "absolute", top: autoRate > 0 ? "11%" : "8%", right: "4%",
          display: "flex", gap: "0.3rem",
        }}>
          {activeBuffIcons.map((b, i) => (
            <div key={i} style={{
              background: "rgba(255,180,60,0.15)", borderRadius: 8,
              padding: "2px 6px", fontSize: "0.7rem",
              border: "1px solid rgba(255,180,60,0.3)",
            }}>
              {b.icon}<span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.55rem", marginLeft: 2 }}>{b.charges}</span>
            </div>
          ))}
        </div>
      )}

      {/* Floating combo texts */}
      {floatingTexts.map(ft => (
        <div key={ft.id} style={{
          position: "absolute", left: ft.x, top: ft.y,
          color: combo >= 10 ? "#ff4400" : combo >= 7 ? "#ffaa00" : animalColor,
          fontSize: combo >= 10 ? "1.4rem" : "1rem",
          fontWeight: 700, letterSpacing: "0.1em",
          pointerEvents: "none",
          animation: "floatUp 0.9s ease-out forwards",
          zIndex: 70, textShadow: `0 0 12px ${animalGlow}`,
        }}>{ft.text}</div>
      ))}

      {/* Rarity hint */}
      {animal && (
        <div style={{
          position: "absolute", top: "5%",
          background: `${RARITY_COLORS[animal.rarity].from}22`,
          border: `1px solid ${RARITY_COLORS[animal.rarity].from}44`,
          borderRadius: 999, padding: "0.3rem 1rem",
          color: RARITY_COLORS[animal.rarity].text,
          fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
          animation: "fadeIn 0.5s ease",
        }}>
          {animal.rarity} EGG {eggType && eggType.id !== "basic" && `· ${eggType.emoji}`}
        </div>
      )}

      {/* Hazard overlay */}
      {activeHazard && (
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          background: hazardResult === "success" ? "rgba(50,200,50,0.2)" : hazardResult === "fail" ? "rgba(255,50,50,0.2)" : "rgba(255,100,0,0.15)",
          border: `2px solid ${hazardResult === "success" ? "#44dd44" : hazardResult === "fail" ? "#ff4444" : "#ff8800"}`,
          borderRadius: 16, padding: "0.6rem 1.2rem",
          textAlign: "center", zIndex: 80,
          animation: "fadeIn 0.3s ease",
          pointerEvents: activeHazard.id === "tremor" && !hazardResult ? "auto" : "none",
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>
            {hazardResult === "success" ? "✅" : hazardResult === "fail" ? "❌" : activeHazard.emoji}
          </div>
          <div style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700 }}>
            {hazardResult === "success" ? "Cleared!" : hazardResult === "fail" ? `Lost ${activeHazard.penalty} clicks!` : activeHazard.name}
          </div>
          {!hazardResult && (
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", marginTop: "0.2rem" }}>
              {activeHazard.desc}
              {activeHazard.id === "freeze" && ` (${hazardTaps}/${activeHazard.targetTaps})`}
              {activeHazard.id === "tremor" && ` (${hazardTaps}/${activeHazard.targetTaps})`}
            </div>
          )}
          {/* Tremor L/R buttons for touch */}
          {activeHazard.id === "tremor" && !hazardResult && (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "0.4rem" }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleHazardTap("left"); }}
                style={{
                  background: tremorLastSide === "left" ? "rgba(255,180,60,0.3)" : "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,180,60,0.4)", borderRadius: 8,
                  color: "#fff", fontSize: "0.9rem", padding: "0.3rem 0.8rem",
                  cursor: "pointer", fontFamily: "inherit", minHeight: 36, minWidth: 50,
                  touchAction: "manipulation",
                }}>◀ L</button>
              <button
                onClick={(e) => { e.stopPropagation(); handleHazardTap("right"); }}
                style={{
                  background: tremorLastSide === "right" ? "rgba(255,180,60,0.3)" : "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,180,60,0.4)", borderRadius: 8,
                  color: "#fff", fontSize: "0.9rem", padding: "0.3rem 0.8rem",
                  cursor: "pointer", fontFamily: "inherit", minHeight: 36, minWidth: 50,
                  touchAction: "manipulation",
                }}>R ▶</button>
            </div>
          )}
        </div>
      )}

      {/* Fragility meter */}
      {isFragile && fragility > 0 && (
        <div style={{
          position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: "0.3rem",
        }}>
          <span style={{ color: fragility >= 6 ? "#ff4444" : "#ffaa44", fontSize: "0.6rem" }}>🌡️</span>
          <div style={{ width: 60, background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${(fragility / 10) * 100}%`,
              background: fragility >= 8 ? "#ff3300" : fragility >= 5 ? "#ffaa00" : "#88dd88",
              borderRadius: 999, transition: "width 0.2s ease",
            }} />
          </div>
          {imperfect && <span style={{ color: "#ff4444", fontSize: "0.55rem" }}>FRAGILE!</span>}
        </div>
      )}

      {/* Egg */}
      <div style={{ animation: eggShake ? "eggShakeAnim 0.35s ease" : "none" }}>
        <EggSVG
          crackLevel={crackLevel}
          wobble={wobble}
          color={animalColor}
          glowColor={animalGlow}
          peekEyes={true}
          eggType={eggType?.id}
        />
      </div>

      {/* Stage label */}
      <p aria-live="polite" style={{
        color: crackLevel >= 3 ? animalColor : "rgba(220,180,80,0.75)",
        fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
        fontStyle: "italic", letterSpacing: "0.06em",
        margin: "0.8rem 0 0.4rem", minHeight: "1.6em",
        textShadow: "0 1px 8px rgba(0,0,0,0.8)",
        transition: "color 0.4s ease",
      }}>
        {crackLevel === 0 && "Tap to crack the egg..."}
        {crackLevel === 1 && "Something stirs inside... 🔥"}
        {crackLevel === 2 && "You hear something scratching..."}
        {crackLevel === 3 && "It's breaking open! 💥"}
        {crackLevel === 4 && "Almost! Keep going!!!"}
        {crackLevel >= 5 && hatching && "HATCHING..."}
      </p>

      {/* Progress bar */}
      <div style={{ width: "min(280px, 80vw)", marginBottom: "0.4rem" }}>
        <div style={{
          background: "rgba(255,255,255,0.07)", borderRadius: 999,
          height: 10, overflow: "hidden",
          border: "1px solid rgba(255,180,60,0.15)",
        }}>
          <div style={{
            height: "100%", borderRadius: 999,
            width: `${progress * 100}%`,
            background: progress > 0.8
              ? `linear-gradient(90deg, #ff3300, ${animalColor})`
              : `linear-gradient(90deg, #aa6600, ${animalColor})`,
            transition: "width 0.2s ease",
            boxShadow: progress > 0.6 ? `0 0 12px ${animalGlow}88` : "none",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
          <span style={{ color: "rgba(200,150,50,0.6)", fontSize: "0.68rem", letterSpacing: "0.1em" }}>
            {clicks}/{maxClicks} CLICKS
          </span>
          {combo >= 3 && (
            <span aria-live="polite" style={{ color: combo >= 7 ? "#ff8800" : animalColor, fontSize: "0.68rem", letterSpacing: "0.1em" }}>
              🔥 {combo} COMBO
            </span>
          )}
        </div>
      </div>

      {/* Level + currency */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.4rem" }}>
        <span style={{ color: "rgba(200,150,50,0.6)", fontSize: "0.68rem", letterSpacing: "0.12em" }}>
          LVL {level}
        </span>
        <div style={{ width: 60, background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${xpBarPercent}%`, background: "#ffaa44", borderRadius: 999 }} />
        </div>
        <span style={{ color: "#ffdd44", fontSize: "0.68rem" }}>🪙{state.coins}</span>
      </div>

      {/* Home button */}
      <button onClick={(e) => { e.stopPropagation(); dispatch({ type: "SET_SCREEN", screen: "home" }); }} style={{
        position: "absolute", top: "4%", left: "4%",
        background: "none", border: "none",
        color: "rgba(200,150,50,0.6)", fontSize: "0.7rem",
        letterSpacing: "0.15em", cursor: "pointer",
        fontFamily: "inherit", textTransform: "uppercase",
        padding: "0.4rem 0.8rem",
        borderRadius: 999, transition: "color 0.2s",
        minHeight: 44, touchAction: "manipulation",
      }}>← Home</button>
    </div>
  );
}
