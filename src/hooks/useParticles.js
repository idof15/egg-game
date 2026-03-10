import { useState, useCallback, useRef } from "react";
import { uid } from "../utils/uid";

export function makeParticles(x, y, count, colors, spread = 100) {
  return Array.from({ length: count }, (_, i) => ({
    id: uid(),
    x, y,
    size: 5 + Math.random() * 7,
    color: colors[i % colors.length],
    square: Math.random() > 0.6,
    dir: Math.random() > 0.5 ? "L" : "R",
    dur: 600 + Math.random() * 500,
  }));
}

export function useParticles() {
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);

  const spawnParticles = useCallback((x, y, count, colors, spread = 100) => {
    const newP = makeParticles(x, y, count, colors, spread);
    setParticles(p => [...p, ...newP]);
    setTimeout(() => setParticles(p => p.filter(q => !newP.find(n => n.id === q.id))), 1200);
  }, []);

  const spawnRipple = useCallback((x, y, big = false) => {
    const id = uid();
    setRipples(r => [...r, { x, y, id, big }]);
    setTimeout(() => setRipples(r => r.filter(p => p.id !== id)), 700);
  }, []);

  const spawnFloatingText = useCallback((x, y, text) => {
    const id = uid();
    setFloatingTexts(f => [...f, { id, x, y, text }]);
    setTimeout(() => setFloatingTexts(f => f.filter(t => t.id !== id)), 900);
  }, []);

  return {
    particles, ripples, floatingTexts,
    spawnParticles, spawnRipple, spawnFloatingText,
  };
}
