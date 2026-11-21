/**
 * ALPINESCAPE - Enhanced Procedural Audio Engine
 * 100% Synthetic Web Audio API Soundscapes:
 * Nature (birds, waves, wind, crickets), Fire (fireplace, campfire),
 * Weather (mountain rain, gentle breeze), Activities (cup clink, water splash, chimes).
 * Zero external audio files required!
 */

class ProceduralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentChapter = 1;
    this.currentWeather = 'sunny'; // sunny, mist, rain, snow

    // Channels
    this.masterGain = null;
    this.ambienceGain = null;
    this.weatherGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    // Active Nodes & Loops
    this.loopInterval = null;
    this.weatherNodes = [];
    this.activeNodes = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    this.ambienceGain.connect(this.masterGain);

    this.weatherGain = this.ctx.createGain();
    this.weatherGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.weatherGain.connect(this.masterGain);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  toggle() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.startChapterSound(this.currentChapter);
      this.updateWeatherSound(this.currentWeather);
    } else {
      this.stop();
    }
    return this.isPlaying;
  }

  stop() {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    this.stopWeatherSound();
    if (this.ambienceGain && this.ctx) {
      this.ambienceGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.4);
    }
    this.activeNodes.forEach(node => {
      try { node.stop(); } catch(e){}
    });
    this.activeNodes = [];
  }

  setChapter(chapterIndex) {
    this.currentChapter = chapterIndex;
    if (!this.isPlaying || !this.ctx) return;
    this.stop();
    this.startChapterSound(chapterIndex);
    this.updateWeatherSound(this.currentWeather);
  }

  setWeather(weatherType) {
    this.currentWeather = weatherType;
    if (!this.isPlaying || !this.ctx) return;
    this.updateWeatherSound(weatherType);
  }

  startChapterSound(chapter) {
    if (!this.ctx) return;
    this.ambienceGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.ambienceGain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 1.2);

    switch(chapter) {
      case 1:
        this.playMorningSoundscape();
        break;
      case 2:
        this.playMountainSummitSoundscape();
        break;
      case 3:
        this.playStarryNightSoundscape();
        break;
      case 4:
        this.playCozyBedroomSoundscape();
        break;
      default:
        this.playMorningSoundscape();
    }
  }

  // =========================================================================
  // CHAPTER SOUNDSCAPES
  // =========================================================================
  playMorningSoundscape() {
    this.startWaterLapping();
    this.playAmbientChord([261.63, 329.63, 392.00, 493.88], 8.0); // Cmaj7

    this.loopInterval = setInterval(() => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.3) this.triggerBirdChirp();
      if (Math.random() > 0.65) this.playAmbientChord([220.0, 261.63, 329.63, 440.0], 7.0); // Am7
    }, 3600);
  }

  playMountainSummitSoundscape() {
    this.startAlpineWind();
    this.playAmbientChord([196.0, 246.94, 293.66, 392.0], 9.0); // Gmaj

    this.loopInterval = setInterval(() => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.4) this.triggerWindChime();
    }, 4200);
  }

  playStarryNightSoundscape() {
    this.startCrickets();
    this.startWaterLapping(0.6);
    this.playAmbientChord([174.61, 220.0, 261.63, 349.23], 10.0); // Fmaj7

    this.loopInterval = setInterval(() => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.35) this.triggerCelestialTwinkle();
    }, 3200);
  }

  playCozyBedroomSoundscape() {
    this.startFireplaceCrackle();
    this.playAmbientChord([130.81, 164.81, 196.0, 246.94], 12.0); // Cmaj9 low

    this.loopInterval = setInterval(() => {
      if (!this.isPlaying) return;
      if (Math.random() > 0.4) this.triggerSleepTone();
    }, 5500);
  }

  // =========================================================================
  // WEATHER SOUND GENERATORS
  // =========================================================================
  updateWeatherSound(type) {
    this.stopWeatherSound();
    if (!this.isPlaying || !this.ctx) return;

    if (type === 'rain') {
      this.startRainSound();
    } else if (type === 'snow') {
      this.startWinterBreezeSound();
    }
  }

  stopWeatherSound() {
    this.weatherNodes.forEach(node => {
      try { node.stop(); } catch(e){}
    });
    this.weatherNodes = [];
  }

  startRainSound() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops on lake and roof
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.weatherGain);

    whiteNoise.start();
    this.weatherNodes.push(whiteNoise);
  }

  startWinterBreezeSound() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(550, this.ctx.currentTime);
    filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.weatherGain);

    noise.start();
    this.weatherNodes.push(noise);
  }

  // =========================================================================
  // ROMANTIC INTERACTIVE SFX
  // =========================================================================

  // Cup Clink (Cheers / Toast)
  playCupClink() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2637, now); // High E
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3136, now); // High G

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
  }

  // Water Splash (Pool dip)
  playWaterSplash() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const splash = this.ctx.createBufferSource();
    splash.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    splash.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    splash.start(now);
  }

  // Telescope Click
  playTelescopeClick() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // =========================================================================
  // PROCEDURAL CORE SYNTHESIZERS
  // =========================================================================
  playAmbientChord(frequencies, duration = 8.0) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06 / frequencies.length, now + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  triggerBirdChirp() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 2200 + Math.random() * 800;

    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq + 600, now + 0.08);
    osc.frequency.linearRampToValueAtTime(baseFreq + 200, now + 0.16);
    osc.frequency.linearRampToValueAtTime(baseFreq + 900, now + 0.24);
    osc.frequency.linearRampToValueAtTime(baseFreq + 400, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ambienceGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  startWaterLapping(volumeMult = 1.0) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12 * volumeMult, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambienceGain);

    whiteNoise.start();
    lfo.start();
    this.activeNodes.push(whiteNoise, lfo);
  }

  startAlpineWind() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
    lfo.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambienceGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, lfo);
  }

  startCrickets() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(4600, this.ctx.currentTime);

    lfo.type = 'square';
    lfo.frequency.setValueAtTime(14, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    lfo.connect(gain.gain);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.ambienceGain);

    osc.start();
    lfo.start();
    this.activeNodes.push(osc, lfo);
  }

  startFireplaceCrackle() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const rumbleGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    rumbleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    osc.connect(rumbleGain);
    rumbleGain.connect(this.ambienceGain);
    osc.start();
    this.activeNodes.push(osc);

    const popInterval = setInterval(() => {
      if (!this.isPlaying || this.currentChapter !== 4) {
        clearInterval(popInterval);
        return;
      }
      if (Math.random() > 0.4) {
        this.triggerFireCracklePop();
      }
    }, 400);
  }

  triggerFireCracklePop() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const pop = this.ctx.createBufferSource();
    pop.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200 + Math.random() * 1800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05 + Math.random() * 0.08, now);

    pop.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambienceGain);

    pop.start(now);
  }

  triggerWindChime() {
    if (!this.ctx || !this.isPlaying) return;
    const notes = [880, 987.77, 1174.66, 1318.51, 1567.98];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 3.3);
  }

  triggerCelestialTwinkle() {
    if (!this.ctx || !this.isPlaying) return;
    const notes = [1046.50, 1318.51, 1567.98, 1975.53, 2093.0];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  triggerSleepTone() {
    if (!this.ctx || !this.isPlaying) return;
    const notes = [261.63, 329.63, 392.0, 523.25];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 5.1);
  }

  playCameraShutter() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }
}

window.ProceduralAudio = new ProceduralAudioEngine();
