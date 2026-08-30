/**
 * AuraSync 🌟 - Real-Time Emotional Bio-Feedback & Adaptive Ambience Engine
 * Handles webcam stream, video frame luminance & motion analysis,
 * dynamic theme transitions, personalized AI advice, and Web Audio synthesizers.
 */

// ============================================================================
// 1. EMOTION DEFINITIONS & DATA MODEL
// ============================================================================
const EMOTION_STATES = {
  calm: {
    id: 'calm',
    name: 'Calm & Centered',
    emoji: '🧘',
    desc: 'Harmonious neural rhythm detected. Optimal baseline state.',
    bodyClass: 'mood-calm',
    confidence: '96%',
    coherence: '432 Hz',
    coherencePercent: 88,
    energyPercent: 45,
    quote: 'In the stillness of a calm mind, you discover clarity that moves mountains effortlessly.',
    tipTitle: 'Serenity Preservation',
    tipText: 'Maintain this serene momentum. Take deep belly breaths and sip cool water to sustain mental peace.',
    tipIcon: '🌿',
    breathingPattern: '4s Inhale • 4s Hold • 4s Exhale',
    audioName: '432Hz Zen Serenity Drone'
  },
  focused: {
    id: 'focused',
    name: 'Deep Focus & Flow',
    emoji: '✨',
    desc: 'High cognitive synchronization. Alpha-wave resonance detected.',
    bodyClass: 'mood-focused',
    confidence: '92%',
    coherence: '520 Hz',
    coherencePercent: 94,
    energyPercent: 75,
    quote: 'Concentration is the secret of strength in politics, in war, in trade, in short in all management of human affairs.',
    tipTitle: 'Flow State Optimization',
    tipText: 'You are in prime focus. Silence non-essential notifications and tackle your highest priority goal.',
    tipIcon: '🎯',
    breathingPattern: '4s Inhale • 2s Hold • 4s Exhale',
    audioName: '10Hz Binaural Alpha Flow'
  },
  happy: {
    id: 'happy',
    name: 'Joyful & Radiant',
    emoji: '🌈',
    desc: 'Elevated endorphin spectrum. Expansive positive aura detected.',
    bodyClass: 'mood-happy',
    confidence: '95%',
    coherence: '639 Hz',
    coherencePercent: 85,
    energyPercent: 88,
    quote: 'Joy is not in things; it is in us. Share your radiant light with someone today.',
    tipTitle: 'Gratitude Anchor',
    tipText: 'Harness this uplifting spark! Write down 3 wins or share a compliment with a teammate or loved one.',
    tipIcon: '☀️',
    breathingPattern: '3s Inhale • 3s Exhale (Energizing)',
    audioName: 'Lydian Harmonic Resonance'
  },
  energetic: {
    id: 'energetic',
    name: 'High Energy & Drive',
    emoji: '⚡',
    desc: 'Dynamic motor activity & peak vitality aura detected.',
    bodyClass: 'mood-energetic',
    confidence: '90%',
    coherence: '741 Hz',
    coherencePercent: 78,
    energyPercent: 96,
    quote: 'Energy and persistence conquer all things. Channel your drive into decisive action.',
    tipTitle: 'High-Impact Action',
    tipText: 'Channel this burst into your toughest creative task or take a 2-minute stretch break to avoid burnout.',
    tipIcon: '🚀',
    breathingPattern: 'Box Breathing: 4s In • 4s Hold • 4s Out',
    audioName: 'Dynamic Pulse Poly-Synth'
  },
  stressed: {
    id: 'stressed',
    name: 'Elevated Tension',
    emoji: '🔥',
    desc: 'Micro-tension & rapid optical variance detected. Rebalancing aura.',
    bodyClass: 'mood-stressed',
    confidence: '89%',
    coherence: '528 Hz',
    coherencePercent: 54,
    energyPercent: 82,
    quote: 'You don’t have to control your thoughts. You just have to stop letting them control you.',
    tipTitle: 'Somatic Decompression',
    tipText: 'Lower your shoulders, unclench your jaw, and let the 528Hz healing tones soothe your nervous system.',
    tipIcon: '🌊',
    breathingPattern: '4-7-8 Relaxing Breath (In 4s, Hold 7s, Out 8s)',
    audioName: '528Hz Restorative Rain Ambience'
  }
};

// ============================================================================
// 2. DOM ELEMENTS
// ============================================================================
const DOM = {
  body: document.body,
  video: document.getElementById('webcamVideo'),
  canvas: document.getElementById('analyzerCanvas'),
  cameraFallback: document.getElementById('cameraFallback'),
  requestCamBtn: document.getElementById('requestCamBtn'),
  audioToggleBtn: document.getElementById('audioToggleBtn'),
  audioIcon: document.getElementById('audioIcon'),
  audioLabel: document.getElementById('audioLabel'),
  systemStatusText: document.getElementById('systemStatusText'),
  fpsCounter: document.getElementById('fpsCounter'),
  targetLabel: document.getElementById('targetLabel'),
  
  // Biometric Bars
  coherenceValue: document.getElementById('coherenceValue'),
  coherenceBar: document.getElementById('coherenceBar'),
  energyValue: document.getElementById('energyValue'),
  energyBar: document.getElementById('energyBar'),
  confidenceScore: document.getElementById('confidenceScore'),
  
  // Emotion Details
  emotionEmoji: document.getElementById('emotionEmoji'),
  emotionTitle: document.getElementById('emotionTitle'),
  emotionDesc: document.getElementById('emotionDesc'),
  
  // AI Suggestions
  motivationalMessage: document.getElementById('motivationalMessage'),
  tipHeading: document.getElementById('tipHeading'),
  tipText: document.getElementById('tipText'),
  tipIcon: document.getElementById('tipIcon'),
  breathingText: document.getElementById('breathingText'),
  breathingPattern: document.getElementById('breathingPattern'),
  breathingCircle: document.getElementById('breathingCircle'),
  
  // Quick Chips
  chips: document.querySelectorAll('.chip')
};

// ============================================================================
// 3. APP STATE
// ============================================================================
const state = {
  currentEmotion: 'calm',
  isManualOverride: false,
  manualOverrideTimeout: null,
  isAudioEnabled: false,
  webcamStream: null,
  lastFrameData: null,
  frameCount: 0,
  lastFpsTime: performance.now(),
  motionHistory: [],
  lightnessHistory: [],
  autoCycleInterval: null
};

// ============================================================================
// 4. WEB AUDIO SYNTHESIZER (ZERO-DEPENDENCY AMBIENT SOUND GENERATOR)
// ============================================================================
class AmbientSoundscapeEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.currentNodes = [];
    this.noiseNode = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    
    this.isInitialized = true;
  }

  // Create gentle pink/brown noise for rain or wind breeze
  createNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise filter for warm gentle oceanic sound
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  playEmotionAmbience(emotionKey) {
    if (!state.isAudioEnabled || !this.isInitialized) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Fade out previous nodes smoothly
    const fadeDuration = 1.2;
    const now = this.ctx.currentTime;
    
    this.currentNodes.forEach(node => {
      if (node.gain) {
        node.gain.gain.setValueAtTime(node.gain.gain.value, now);
        node.gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);
        setTimeout(() => {
          try { node.osc.stop(); node.osc.disconnect(); } catch(e){}
        }, fadeDuration * 1000);
      }
    });
    this.currentNodes = [];

    // Synthesize mood-specific ambient frequencies
    switch (emotionKey) {
      case 'calm':
        // 432 Hz Zen drone with sub-harmonics & gentle filter
        this.addDroneChord([216, 432, 648], 'sine', 0.14);
        this.addFilteredNoise(350, 0.04);
        break;

      case 'focused':
        // 140 Hz & 150 Hz binaural alpha beat (10 Hz beat difference)
        this.addBinauralBeats(140, 150, 0.16);
        this.addDroneChord([280, 420], 'sine', 0.08);
        break;

      case 'happy':
        // Warm shimmering major chords (C-E-G-B)
        this.addDroneChord([261.63, 329.63, 392.00, 493.88], 'sine', 0.10);
        this.addFilteredNoise(600, 0.02);
        break;

      case 'energetic':
        // Bright resonant synth tones with pulse harmonic
        this.addDroneChord([196, 293.66, 440, 587.33], 'triangle', 0.09);
        break;

      case 'stressed':
        // 528 Hz Solfeggio restorative frequency + soft soothing rain
        this.addDroneChord([264, 528], 'sine', 0.18);
        this.addFilteredNoise(280, 0.08); // Warm rain lowpass noise
        break;
    }
  }

  addDroneChord(frequencies, type = 'sine', volume = 0.1) {
    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Gentle subtle vibrato LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume / frequencies.length, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.currentNodes.push({ osc, gain, lfo });
    });
  }

  addBinauralBeats(freqLeft, freqRight, volume = 0.1) {
    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();
    const gainL = this.ctx.createGain();
    const gainR = this.ctx.createGain();
    const merger = this.ctx.createChannelMerger(2);

    oscL.frequency.setValueAtTime(freqLeft, this.ctx.currentTime);
    oscR.frequency.setValueAtTime(freqRight, this.ctx.currentTime);

    gainL.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainR.gain.setValueAtTime(volume, this.ctx.currentTime);

    oscL.connect(gainL);
    oscR.connect(gainR);
    gainL.connect(merger, 0, 0);
    gainR.connect(merger, 0, 1);
    merger.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.currentNodes.push({ osc: oscL, gain: gainL }, { osc: oscR, gain: gainR });
  }

  addFilteredNoise(cutoffFreq = 400, volume = 0.05) {
    const buffer = this.createNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoffFreq, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 1.5);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noiseSource.start();

    this.currentNodes.push({ osc: noiseSource, gain });
  }

  stopAll() {
    if (!this.isInitialized) return;
    const now = this.ctx.currentTime;
    this.currentNodes.forEach(node => {
      if (node.gain) {
        node.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        setTimeout(() => {
          try { node.osc.stop(); } catch(e){}
        }, 500);
      }
    });
    this.currentNodes = [];
  }
}

const audioEngine = new AmbientSoundscapeEngine();

// ============================================================================
// 5. WEBCAM INITIALIZATION & FRAME PROCESSING
// ============================================================================
async function initWebcam() {
  try {
    DOM.targetLabel.textContent = "INITIALIZING OPTICAL SENSORS...";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });

    DOM.video.srcObject = stream;
    state.webcamStream = stream;
    DOM.cameraFallback.classList.add('hidden');
    DOM.systemStatusText.textContent = "BIO-SCAN ACTIVE";
    DOM.targetLabel.textContent = "TARGET LOCKED • BIO-FEEDBACK SYNCED";
    
    // Start continuous optical analysis loop
    requestAnimationFrame(analyzeVideoLoop);
  } catch (error) {
    console.warn("Webcam access declined or not found. Entering Simulation Mode.", error);
    DOM.cameraFallback.classList.remove('hidden');
    DOM.systemStatusText.textContent = "SIMULATION ACTIVE";
    DOM.targetLabel.textContent = "SIMULATING BIO-DATA STREAM";
    
    // Fallback: start ambient simulated emotion cycle
    startSimulationCycle();
  }
}

// Real-Time Optical Frame Diffing & Luminance Motion Analysis
function analyzeVideoLoop(now) {
  // Update FPS counter
  state.frameCount++;
  if (now - state.lastFpsTime >= 1000) {
    DOM.fpsCounter.textContent = `${state.frameCount} FPS`;
    state.frameCount = 0;
    state.lastFpsTime = now;
  }

  if (DOM.video.readyState === DOM.video.HAVE_ENOUGH_DATA) {
    const canvas = DOM.canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    canvas.width = 160; // Downscaled for ultra-fast processing
    canvas.height = 120;
    
    ctx.drawImage(DOM.video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;
    const length = data.length;

    let totalLuminance = 0;
    let motionDelta = 0;

    if (state.lastFrameData) {
      const prevData = state.lastFrameData;
      // Step by 4 (RGBA)
      for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b);
        totalLuminance += lum;

        const prevLum = (0.299 * prevData[i] + 0.587 * prevData[i + 1] + 0.114 * prevData[i + 2]);
        motionDelta += Math.abs(lum - prevLum);
      }
    }

    state.lastFrameData = data;
    const pixelCount = length / 4;
    const avgLuminance = totalLuminance / pixelCount;
    const avgMotion = motionDelta / pixelCount;

    // Track motion moving window
    state.motionHistory.push(avgMotion);
    if (state.motionHistory.length > 25) state.motionHistory.shift();

    // Map biometric energy level
    const smoothedMotion = state.motionHistory.reduce((a, b) => a + b, 0) / state.motionHistory.length;
    const dynamicEnergy = Math.min(100, Math.max(15, Math.round(smoothedMotion * 6.5 + 30)));
    
    if (!state.isManualOverride) {
      inferEmotionFromBiometrics(smoothedMotion, avgLuminance, dynamicEnergy);
    }
  }

  requestAnimationFrame(analyzeVideoLoop);
}

// Heuristic Emotion Inference engine based on live presence
let lastEmotionChange = Date.now();
function inferEmotionFromBiometrics(motion, luminance, energy) {
  const now = Date.now();
  // Don't switch emotions faster than once every 8 seconds to prevent jarring flashes
  if (now - lastEmotionChange < 8000) return;

  let candidate = 'calm';

  if (motion > 12.0) {
    candidate = 'energetic';
  } else if (motion > 6.5) {
    candidate = 'happy';
  } else if (motion < 2.0 && luminance < 60) {
    candidate = 'focused';
  } else if (motion > 4.5 && luminance > 140) {
    candidate = 'stressed';
  } else {
    candidate = 'calm';
  }

  if (candidate !== state.currentEmotion) {
    lastEmotionChange = now;
    applyEmotion(candidate);
  }
}

// Fallback intelligent simulation cycle if webcam is unavailable
function startSimulationCycle() {
  if (state.autoCycleInterval) clearInterval(state.autoCycleInterval);
  const cycle = ['calm', 'focused', 'happy', 'energetic', 'stressed'];
  let index = 0;

  state.autoCycleInterval = setInterval(() => {
    if (!state.isManualOverride) {
      index = (index + 1) % cycle.length;
      applyEmotion(cycle[index]);
    }
  }, 10000);
}

// ============================================================================
// 6. DYNAMIC UI & THEME TRANSITION CONTROLLER
// ============================================================================
function applyEmotion(emotionKey, isManual = false) {
  const data = EMOTION_STATES[emotionKey];
  if (!data) return;

  state.currentEmotion = emotionKey;

  // 1. Update Body Background Class for Smooth CSS Transition
  DOM.body.className = data.bodyClass;

  // 2. Update Emotion Header & Emoji with Elastic Bounce
  DOM.emotionEmoji.style.transform = 'scale(0.3)';
  setTimeout(() => {
    DOM.emotionEmoji.textContent = data.emoji;
    DOM.emotionEmoji.style.transform = 'scale(1)';
  }, 150);

  DOM.emotionTitle.textContent = data.name;
  DOM.emotionDesc.textContent = data.desc;
  DOM.confidenceScore.textContent = data.confidence;

  // 3. Update Biometric Telemetry Bars
  DOM.coherenceValue.textContent = data.coherence;
  DOM.coherenceBar.style.width = `${data.coherencePercent}%`;
  DOM.energyValue.textContent = `${data.energyPercent}%`;
  DOM.energyBar.style.width = `${data.energyPercent}%`;

  // 4. Update AI Motivational Quote & Tip with Soft Fade
  DOM.motivationalMessage.style.opacity = '0';
  DOM.tipText.style.opacity = '0';

  setTimeout(() => {
    DOM.motivationalMessage.textContent = data.quote;
    DOM.tipHeading.textContent = data.tipTitle;
    DOM.tipText.textContent = data.tipText;
    DOM.tipIcon.textContent = data.tipIcon;
    DOM.breathingPattern.textContent = data.breathingPattern;

    DOM.motivationalMessage.style.opacity = '1';
    DOM.tipText.style.opacity = '1';
  }, 250);

  // 5. Update Active Chip Highlight
  DOM.chips.forEach(chip => {
    if (chip.getAttribute('data-emotion') === emotionKey) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  // 6. Trigger Audio Synthesizer Transition
  if (state.isAudioEnabled) {
    audioEngine.playEmotionAmbience(emotionKey);
    DOM.audioLabel.textContent = `Soundscape: ${data.audioName.split(' ')[0]}`;
  }

  // Handle Manual Override Timeout
  if (isManual) {
    state.isManualOverride = true;
    if (state.manualOverrideTimeout) clearTimeout(state.manualOverrideTimeout);
    state.manualOverrideTimeout = setTimeout(() => {
      state.isManualOverride = false;
    }, 15000); // Resume auto-detection after 15s
  }
}

// ============================================================================
// 7. EVENT LISTENERS & INITIALIZATION
// ============================================================================
function setupEventListeners() {
  // Camera Permission Re-request Button
  DOM.requestCamBtn.addEventListener('click', () => {
    initWebcam();
  });

  // Ambient Audio Synthesizer Toggle
  DOM.audioToggleBtn.addEventListener('click', () => {
    audioEngine.init();
    state.isAudioEnabled = !state.isAudioEnabled;

    if (state.isAudioEnabled) {
      DOM.audioToggleBtn.classList.add('active');
      DOM.audioIcon.textContent = '🔊';
      const currentData = EMOTION_STATES[state.currentEmotion];
      DOM.audioLabel.textContent = `Soundscape: ${currentData.audioName.split(' ')[0]}`;
      audioEngine.playEmotionAmbience(state.currentEmotion);
    } else {
      DOM.audioToggleBtn.classList.remove('active');
      DOM.audioIcon.textContent = '🔇';
      DOM.audioLabel.textContent = 'Soundscape: Off';
      audioEngine.stopAll();
    }
  });

  // Emotion Simulation Chips (Manual Override)
  DOM.chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const selectedEmotion = chip.getAttribute('data-emotion');
      applyEmotion(selectedEmotion, true);
    });
  });

  // Dynamic Breathing Animation Pacer Guide
  let breathState = 0;
  const breathSteps = ['Inhale', 'Hold', 'Exhale', 'Rest'];
  setInterval(() => {
    breathState = (breathState + 1) % breathSteps.length;
    DOM.breathingText.textContent = breathSteps[breathState];
  }, 2500);
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  applyEmotion('calm');
  initWebcam();
});
