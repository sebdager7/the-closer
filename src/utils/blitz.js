export function vibrateBlitz(pattern) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

export function zapSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // Master compressor + gain
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -12
    compressor.ratio.value = 6
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.4
    compressor.connect(masterGain)
    masterGain.connect(ctx.destination)

    // ── Layer 1: BLASTER BODY ─────────────────────────────────────
    const blasterOsc = ctx.createOscillator()
    const blasterGain = ctx.createGain()
    blasterOsc.type = 'sawtooth'
    blasterOsc.frequency.setValueAtTime(1200, now)
    blasterOsc.frequency.exponentialRampToValueAtTime(180, now + 0.25)

    // LFO pitch wobble (+/-40hz at 18hz)
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 18
    lfoGain.gain.value = 40
    lfo.connect(lfoGain)
    lfoGain.connect(blasterOsc.frequency)

    blasterGain.gain.setValueAtTime(0.7, now)
    blasterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
    blasterOsc.connect(blasterGain)
    blasterGain.connect(compressor)
    lfo.start(now); lfo.stop(now + 0.25)
    blasterOsc.start(now); blasterOsc.stop(now + 0.25)

    // ── Layer 2: ENERGY CRACKLE (filtered white noise) ────────────
    const crackleBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.1), ctx.sampleRate)
    const crackleData = crackleBuf.getChannelData(0)
    for (let i = 0; i < crackleData.length; i++) crackleData[i] = Math.random() * 2 - 1

    const crackleSource = ctx.createBufferSource()
    crackleSource.buffer = crackleBuf

    const bp1 = ctx.createBiquadFilter()
    bp1.type = 'bandpass'; bp1.frequency.value = 800; bp1.Q.value = 1.2

    const bp2 = ctx.createBiquadFilter()
    bp2.type = 'bandpass'; bp2.frequency.value = 3000; bp2.Q.value = 2.5

    const crackleGain = ctx.createGain()
    crackleGain.gain.setValueAtTime(1.0, now)
    crackleGain.gain.setTargetAtTime(0.001, now + 0.001, 0.022)

    crackleSource.connect(bp1); crackleSource.connect(bp2)
    bp1.connect(crackleGain); bp2.connect(crackleGain)
    crackleGain.connect(compressor)
    crackleSource.start(now); crackleSource.stop(now + 0.1)

    // ── Layer 3: TAIL HUM ─────────────────────────────────────────
    const tailOsc = ctx.createOscillator()
    const tailGain = ctx.createGain()
    tailOsc.type = 'sine'
    tailOsc.frequency.value = 220
    tailGain.gain.setValueAtTime(0.35, now)
    tailGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    tailOsc.connect(tailGain)
    tailGain.connect(compressor)
    tailOsc.start(now); tailOsc.stop(now + 0.3)

    setTimeout(() => { try { ctx.close() } catch (e) {} }, 600)
  } catch (e) {}
}
