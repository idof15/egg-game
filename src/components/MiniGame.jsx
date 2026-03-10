import QuickTap from "./minigames/QuickTap";
import PatternMemory from "./minigames/PatternMemory";
import ElementMatch from "./minigames/ElementMatch";
import EggCatch from "./minigames/EggCatch";
import LuckySpin from "./minigames/LuckySpin";

export default function MiniGame({ gameType = "quickTap", level = 1, gems = 0, onComplete, onSkip }) {
  // Normalize onComplete to always pass (reward, perfect)
  const handleComplete = (reward, perfect = false, extraGems = 0, gemCost = 0) => {
    // LuckySpin may pass gem rewards/costs — flatten to just coins for the reducer
    // The gem cost is handled at the spin level
    onComplete(reward, perfect);
  };

  const gameProps = { level, onComplete: handleComplete, onSkip };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.85)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Palatino Linotype', Palatino, serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1a1200, #0a0800)",
        border: "1px solid rgba(255,180,60,0.3)",
        borderRadius: 16, padding: "2rem", maxWidth: 340, width: "90%",
      }}>
        {gameType === "quickTap" && <QuickTap {...gameProps} />}
        {gameType === "patternMemory" && <PatternMemory {...gameProps} />}
        {gameType === "elementMatch" && <ElementMatch {...gameProps} />}
        {gameType === "eggCatch" && <EggCatch {...gameProps} />}
        {gameType === "luckySpin" && <LuckySpin {...gameProps} gems={gems} />}
      </div>
    </div>
  );
}
