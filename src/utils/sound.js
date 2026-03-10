let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration, type = "sine", volume = 0.15, detune = 0) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function playTapSound(intensity = 1) {
  const freq = 400 + intensity * 100 + Math.random() * 80;
  playTone(freq, 0.08, "triangle", 0.1 * Math.min(intensity, 3));
}

export function playComboSound(combo) {
  const baseFreq = 500 + combo * 30;
  playTone(baseFreq, 0.12, "sine", 0.12);
  if (combo >= 5) {
    setTimeout(() => playTone(baseFreq * 1.25, 0.1, "sine", 0.08), 50);
  }
  if (combo >= 10) {
    setTimeout(() => playTone(baseFreq * 1.5, 0.1, "triangle", 0.08), 100);
  }
}

export function playHatchSound() {
  playTone(300, 0.15, "square", 0.08);
  setTimeout(() => playTone(400, 0.12, "square", 0.07), 80);
  setTimeout(() => playTone(600, 0.2, "square", 0.06), 160);
}

export function playRevealSound(rarity) {
  const base = rarity === "MYTHIC" ? 600 : rarity === "LEGENDARY" ? 500 : rarity === "EPIC" ? 440 : rarity === "RARE" ? 400 : 350;
  playTone(base, 0.2, "sine", 0.12);
  setTimeout(() => playTone(base * 1.25, 0.2, "sine", 0.1), 120);
  setTimeout(() => playTone(base * 1.5, 0.3, "sine", 0.1), 240);
  if (rarity === "MYTHIC" || rarity === "LEGENDARY") {
    setTimeout(() => playTone(base * 2, 0.5, "sine", 0.08), 380);
  }
}

export function playPurchaseSound() {
  playTone(600, 0.1, "sine", 0.1);
  setTimeout(() => playTone(800, 0.15, "sine", 0.08), 80);
}

export function playAchievementSound() {
  playTone(523, 0.15, "sine", 0.12);
  setTimeout(() => playTone(659, 0.15, "sine", 0.1), 120);
  setTimeout(() => playTone(784, 0.25, "sine", 0.1), 240);
  setTimeout(() => playTone(1047, 0.35, "sine", 0.08), 380);
}

export function playEvolveSound() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => playTone(400 + i * 150, 0.2, "sine", 0.1 - i * 0.01), i * 100);
  }
}

export function playAutoTapSound() {
  playTone(500, 0.04, "triangle", 0.04);
}

export function playHazardSound() {
  playTone(200, 0.2, "sawtooth", 0.1);
  setTimeout(() => playTone(180, 0.15, "sawtooth", 0.08), 100);
}

export function playHazardSuccessSound() {
  playTone(600, 0.12, "sine", 0.1);
  setTimeout(() => playTone(800, 0.15, "sine", 0.08), 80);
  setTimeout(() => playTone(1000, 0.2, "sine", 0.06), 160);
}
