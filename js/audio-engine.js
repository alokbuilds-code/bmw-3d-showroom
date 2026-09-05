/**
 * BMW TwinPower Turbo Web Audio Engine Synthesizer 2.0
 * Features V8 ignition, multi-harmonic idle rumble, dynamic turbocharger spooling,
 * exhaust backfires & overrun pops ("burbles"), wastegate flutter ("stututu"),
 * hard-cut rev limiter, launch control antilag, and real-time FFT spectrum analysis.
 */

class BMWAudioEngine {
  constructor() {
    this.ctx = null;
    this.isRunning = false;
    this.isStarting = false;
    this.currentRPM = 850;
    this.targetRPM = 850;
    
    // Audio Nodes
    this.masterGain = null;
    this.engineGain = null;
    this.turboGain = null;
    this.turboOsc = null;
    this.oscillators = [];
    this.exhaustFilter = null;
    this.analyser = null;
    this.frequencyData = null;
    this.animFrameId = null;

    // Advanced V2 State
    this.isLaunchControl = false;
    this.lastRPM = 850;
    this.crackleTimeout = null;
    
    // Callbacks
    this.onStateChange = null;
    this.onRPMUpdate = null;
    this.onBoostUpdate = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      // FFT Spectrum Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getFrequencyData() {
    if (!this.analyser || !this.frequencyData) return null;
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  toggleEngine() {
    this.initContext();
    if (this.isRunning || this.isStarting) {
      this.stopEngine();
      return false;
    } else {
      this.startEngine();
      return true;
    }
  }

  startEngine() {
    if (this.isRunning || this.isStarting) return;
    this.isStarting = true;
    if (this.onStateChange) this.onStateChange('starting');

    const now = this.ctx.currentTime;

    // --- 1. Starter Motor High-Compression Crank ---
    const starterOsc = this.ctx.createOscillator();
    const starterGain = this.ctx.createGain();
    starterOsc.type = 'sawtooth';
    starterOsc.frequency.setValueAtTime(14, now);
    starterOsc.frequency.exponentialRampToValueAtTime(38, now + 0.9);

    starterGain.gain.setValueAtTime(0.01, now);
    starterGain.gain.linearRampToValueAtTime(0.28, now + 0.2);
    starterGain.gain.linearRampToValueAtTime(0.28, now + 0.8);
    starterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    starterOsc.connect(starterGain);
    starterGain.connect(this.masterGain);
    starterOsc.start(now);
    starterOsc.stop(now + 1.15);

    // --- 2. Ignition Catch & Cold Start Roar ---
    setTimeout(() => {
      if (!this.isStarting) return;
      this.triggerIgnitionRoar();
      this.createEngineSustainedLoop();
      this.isRunning = true;
      this.isStarting = false;
      if (this.onStateChange) this.onStateChange('running');
      this.startTelemetryLoop();
    }, 950);
  }

  triggerIgnitionRoar() {
    const now = this.ctx.currentTime;
    
    // Low-end combustion punch (40-160Hz)
    const burstOsc = this.ctx.createOscillator();
    const burstGain = this.ctx.createGain();
    burstOsc.type = 'triangle';
    burstOsc.frequency.setValueAtTime(160, now);
    burstOsc.frequency.exponentialRampToValueAtTime(42, now + 0.65);

    burstGain.gain.setValueAtTime(0.85, now);
    burstGain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

    burstOsc.connect(burstGain);
    burstGain.connect(this.masterGain);
    burstOsc.start(now);
    burstOsc.stop(now + 0.8);

    // Immediate ignition pop
    this.playExhaustPop(0.8, 120);

    // Cold start rev flare to 2,600 RPM
    this.targetRPM = 2600;
    setTimeout(() => {
      if (!this.isLaunchControl) this.targetRPM = 850;
    }, 650);
  }

  createEngineSustainedLoop() {
    const now = this.ctx.currentTime;
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.38, now);

    // Distortion shaper for mechanical grit
    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(22);
    distortion.oversample = '4x';

    // Exhaust Lowpass Filter with resonance
    this.exhaustFilter = this.ctx.createBiquadFilter();
    this.exhaustFilter.type = 'lowpass';
    this.exhaustFilter.frequency.setValueAtTime(320, now);
    this.exhaustFilter.Q.setValueAtTime(2.8, now);

    // 8-Cylinder V8 Multi-Harmonic Tone Oscillators
    const baseFreq = (this.currentRPM / 60) * 4;
    this.oscillators = [];
    const harmonicMultipliers = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0];
    const harmonicGains = [0.42, 0.55, 0.28, 0.18, 0.09, 0.04];

    harmonicMultipliers.forEach((mult, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * mult, now);
      gain.gain.setValueAtTime(harmonicGains[idx], now);

      osc.connect(gain);
      gain.connect(this.exhaustFilter);
      osc.start(now);
      this.oscillators.push({ osc, gain, multiplier: mult });
    });

    // Twin-Scroll Turbo Spool Whistle
    this.turboOsc = this.ctx.createOscillator();
    this.turboGain = this.ctx.createGain();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1400, now);
    this.turboGain.gain.setValueAtTime(0.001, now);

    this.turboOsc.connect(this.turboGain);
    this.turboGain.connect(this.masterGain);
    this.turboOsc.start(now);

    this.exhaustFilter.connect(distortion);
    distortion.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
  }

  makeDistortionCurve(amount) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      let x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  revThrottle(target = 6800) {
    if (!this.isRunning) {
      this.startEngine();
      setTimeout(() => {
        this.targetRPM = target;
      }, 1000);
      return;
    }
    this.targetRPM = target;
  }

  releaseThrottle() {
    if (!this.isRunning) return;
    const prevRPM = this.currentRPM;
    this.targetRPM = 850;

    // Trigger aggressive overrun exhaust crackles and pops if lifting off high RPM
    if (prevRPM > 3800) {
      this.triggerExhaustCrackles(Math.min(6, Math.floor((prevRPM - 3000) / 700)));
      this.triggerWastegateFlutter();
    }
  }

  /**
   * BMW M Performance Exhaust Crackles & Burbles (Bangs & Pops on deceleration)
   */
  triggerExhaustCrackles(popCount = 4) {
    if (!this.ctx || !this.isRunning) return;

    for (let i = 0; i < popCount; i++) {
      const delayMs = 120 + i * (90 + Math.random() * 80);
      setTimeout(() => {
        if (!this.isRunning) return;
        const vol = 0.4 + Math.random() * 0.45;
        const pitch = 85 + Math.random() * 95;
        this.playExhaustPop(vol, pitch);
      }, delayMs);
    }
  }

  playExhaustPop(volume = 0.5, pitch = 100) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Noise transient (snap)
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(pitch * 8, now);
    filter.Q.setValueAtTime(3.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);

    // 2. Sub punch
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(pitch, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

    subGain.gain.setValueAtTime(volume * 0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.085);
  }

  /**
   * Turbo Wastegate Flutter ("Stututu" compressor surge)
   */
  triggerWastegateFlutter() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.Q.setValueAtTime(8.0, now);

    // Flutter LFO (Modulates amplitude at 22 Hz)
    const flutterLFO = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    flutterLFO.frequency.setValueAtTime(22, now);
    lfoGain.gain.setValueAtTime(0.18, now);

    const flutterGain = this.ctx.createGain();
    flutterGain.gain.setValueAtTime(0.24, now);
    flutterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    noise.connect(filter);
    filter.connect(flutterGain);
    flutterGain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.45);
  }

  /**
   * Launch Control Mode - Antilag Boost Lock at 4,200 RPM
   */
  engageLaunchControl() {
    this.initContext();
    if (!this.isRunning) {
      this.startEngine();
    }
    this.isLaunchControl = true;
    this.targetRPM = 4200;

    // Repeat antilag chatter while held
    const antilagInterval = setInterval(() => {
      if (!this.isLaunchControl || !this.isRunning) {
        clearInterval(antilagInterval);
        return;
      }
      this.playExhaustPop(0.35, 110);
      // Small RPM twitch
      this.currentRPM = 4150 + Math.random() * 120;
    }, 120);
  }

  releaseLaunchControl() {
    this.isLaunchControl = false;
    this.targetRPM = 7200; // Launch sprint to redline!
    setTimeout(() => {
      if (this.isRunning) {
        this.targetRPM = 6200;
      }
    }, 2800);
  }

  stopEngine() {
    this.isStarting = false;
    this.isRunning = false;
    this.isLaunchControl = false;
    if (this.onStateChange) this.onStateChange('off');

    if (this.engineGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.engineGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      setTimeout(() => {
        this.oscillators.forEach(o => {
          try { o.osc.stop(); } catch(e){}
        });
        if (this.turboOsc) {
          try { this.turboOsc.stop(); } catch(e){}
        }
        this.oscillators = [];
      }, 450);
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.currentRPM = 0;
    if (this.onRPMUpdate) this.onRPMUpdate(0);
    if (this.onBoostUpdate) this.onBoostUpdate(0);
  }

  startTelemetryLoop() {
    const update = () => {
      if (!this.isRunning) return;

      // Smooth RPM interpolation
      const lerpSpeed = this.isLaunchControl ? 0.15 : (this.targetRPM > this.currentRPM ? 0.08 : 0.045);
      this.currentRPM += (this.targetRPM - this.currentRPM) * lerpSpeed;

      // Hard-cut Rev Limiter Bounce at 7,100+ RPM
      if (this.currentRPM > 7050) {
        if (Math.random() > 0.4) {
          this.currentRPM = 6920;
          this.playExhaustPop(0.45, 140);
        }
      }

      // Boost pressure calculation (0.0 to 1.8 BAR)
      const boost = Math.max(0, ((this.currentRPM - 1800) / 5400) * 1.85);
      if (this.onBoostUpdate) {
        this.onBoostUpdate(parseFloat(boost.toFixed(2)));
      }

      if (this.ctx && this.oscillators.length > 0) {
        const baseFreq = (this.currentRPM / 60) * 4;
        const now = this.ctx.currentTime;

        this.oscillators.forEach(item => {
          item.osc.frequency.setValueAtTime(baseFreq * item.multiplier, now);
        });

        // Filter sweeps with RPM
        if (this.exhaustFilter) {
          this.exhaustFilter.frequency.setValueAtTime(220 + (this.currentRPM * 0.52), now);
        }

        // Turbo pitch & volume scales with higher RPM
        if (this.turboOsc && this.turboGain) {
          this.turboOsc.frequency.setValueAtTime(950 + (this.currentRPM * 0.65), now);
          const turboVol = Math.max(0.001, (this.currentRPM - 2200) / 10000 * 0.16);
          this.turboGain.gain.setValueAtTime(turboVol, now);
        }
      }

      if (this.onRPMUpdate) {
        this.onRPMUpdate(Math.round(this.currentRPM));
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    update();
  }
}

window.BMWAudioEngine = BMWAudioEngine;
