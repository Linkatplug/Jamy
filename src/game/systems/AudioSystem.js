/**
 * AudioSystem - Manages game audio with procedural sound generation
 */
export default class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.enabled = true;
    this.sounds = {};
    this.audioContext = null;
    this.masterVolume = 0.5;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.7;
    
    // Initialize Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      this.audioContext = new (AudioContext || webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;
    }
    
    this.engineSound = null;
    this.engineGain = null;
  }

  /**
   * Create procedural engine sound using Web Audio API
   */
  createEngineSound() {
    if (!this.audioContext) return;
    
    try {
      // Resume audio context if suspended (required by browser autoplay policies)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Create oscillators for engine rumble
      this.engineOsc1 = this.audioContext.createOscillator();
      this.engineOsc2 = this.audioContext.createOscillator();
      
      // Set up engine sound characteristics
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'triangle';
      this.engineOsc1.frequency.value = 80;
      this.engineOsc2.frequency.value = 120;
      
      // Create gain node for volume control
      this.engineGain = this.audioContext.createGain();
      this.engineGain.gain.value = 0; // Start silent
      
      // Create filter for more realistic sound
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      
      // Connect the audio graph
      this.engineOsc1.connect(filter);
      this.engineOsc2.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);
      
      // Start oscillators
      this.engineOsc1.start();
      this.engineOsc2.start();
      
      this.engineSound = { osc1: this.engineOsc1, osc2: this.engineOsc2, gain: this.engineGain, filter };
    } catch (error) {
      console.warn('Failed to create engine sound:', error);
    }
  }

  /**
   * Update engine sound based on speed
   */
  playEngine(speed = 0, maxSpeed = 300) {
    if (!this.enabled || !this.audioContext || !this.engineSound) return;
    
    const normalizedSpeed = Math.abs(speed) / maxSpeed;
    const baseFreq = 80;
    const maxFreq = 250;
    const targetFreq = baseFreq + (normalizedSpeed * (maxFreq - baseFreq));
    
    // Smoothly change frequency
    const now = this.audioContext.currentTime;
    this.engineSound.osc1.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.engineSound.osc2.frequency.setTargetAtTime(targetFreq * 1.5, now, 0.1);
    
    // Adjust volume based on speed
    const targetVolume = 0.1 + (normalizedSpeed * 0.3 * this.sfxVolume);
    this.engineSound.gain.gain.setTargetAtTime(targetVolume, now, 0.05);
    
    // Adjust filter frequency for more realistic sound
    const filterFreq = 300 + (normalizedSpeed * 500);
    this.engineSound.filter.frequency.setTargetAtTime(filterFreq, now, 0.1);
  }

  /**
   * Play collision sound
   */
  playCollision() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      
      // Create noise for crash sound
      const noise = this.audioContext.createBufferSource();
      const bufferSize = this.audioContext.sampleRate * 0.3; // 0.3 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      noise.buffer = buffer;
      
      // Create filter and envelope
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      noise.start(now);
      noise.stop(now + 0.3);
    } catch (error) {
      console.warn('Failed to play collision sound:', error);
    }
  }

  /**
   * Play pickup success sound
   */
  playPickup() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      
      // Create ascending tone for pickup
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      // Ascending frequency sweep
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (error) {
      console.warn('Failed to play pickup sound:', error);
    }
  }

  /**
   * Play delivery success sound
   */
  playDeliver() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      
      // Create fanfare-like sound
      const playNote = (freq, startTime, duration) => {
        const osc = this.audioContext.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Play success melody
      playNote(523, now, 0.15);        // C
      playNote(659, now + 0.15, 0.15); // E
      playNote(784, now + 0.30, 0.3);  // G
    } catch (error) {
      console.warn('Failed to play delivery sound:', error);
    }
  }

  /**
   * Play UI click sound
   */
  playClick() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800;
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (error) {
      console.warn('Failed to play click sound:', error);
    }
  }

  /**
   * Start ambient background music
   */
  startAmbientMusic() {
    if (!this.enabled || !this.audioContext || this.ambientMusic) return;
    
    try {
      // Create simple ambient drone
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 130.81; // C3
      osc2.frequency.value = 196; // G3
      
      const gain = this.audioContext.createGain();
      gain.gain.value = 0.05 * this.musicVolume;
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);
      
      osc1.start();
      osc2.start();
      
      this.ambientMusic = { osc1, osc2, gain };
    } catch (error) {
      console.warn('Failed to start ambient music:', error);
    }
  }

  /**
   * Stop ambient music
   */
  stopAmbientMusic() {
    if (this.ambientMusic) {
      try {
        this.ambientMusic.osc1.stop();
        this.ambientMusic.osc2.stop();
        this.ambientMusic = null;
      } catch (error) {
        console.warn('Failed to stop ambient music:', error);
      }
    }
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  /**
   * Enable or disable all sounds
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    if (this.engineSound) {
      try {
        this.engineSound.gain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.05);
      } catch (error) {
        console.warn('Failed to stop engine:', error);
      }
    }
    this.stopAmbientMusic();
  }

  /**
   * Clean up audio resources
   */
  destroy() {
    this.stopAll();
    if (this.engineSound) {
      try {
        this.engineSound.osc1.stop();
        this.engineSound.osc2.stop();
      } catch (error) {
        // Already stopped
      }
      this.engineSound = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
