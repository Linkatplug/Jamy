/**
 * AudioSystem - Manages game audio with procedural sound generation (IMPROVED)
 */
export default class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.enabled = true;
    this.sounds = {};
    this.audioContext = null;
    this.masterVolume = 0.3; // Reduced from 0.5
    this.musicVolume = 0.15; // Reduced from 0.3
    this.sfxVolume = 0.4; // Reduced from 0.7
    
    // Initialize Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      this.audioContext = new (AudioContext || webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;
    }
    
    this.engineSound = null;
    this.engineGain = null;
    this.isDestroyed = false;
  }

  /**
   * Create procedural engine sound using Web Audio API (IMPROVED)
   */
  createEngineSound() {
    if (!this.audioContext || this.isDestroyed) return;
    
    // Clean up existing engine sound first
    if (this.engineSound) {
      this.stopEngineSound();
    }
    
    try {
      // Resume audio context if suspended (required by browser autoplay policies)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Create oscillators for engine rumble (IMPROVED frequencies)
      this.engineOsc1 = this.audioContext.createOscillator();
      this.engineOsc2 = this.audioContext.createOscillator();
      
      // Set up engine sound characteristics with better waveforms
      this.engineOsc1.type = 'sine'; // Changed from sawtooth for smoother sound
      this.engineOsc2.type = 'sine'; // Changed from triangle
      this.engineOsc1.frequency.value = 60; // Lower base frequency
      this.engineOsc2.frequency.value = 90; // Harmonically related
      
      // Create gain node for volume control
      this.engineGain = this.audioContext.createGain();
      this.engineGain.gain.value = 0; // Start silent
      
      // Create filter for more realistic sound
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300; // Lower cutoff for smoother sound
      filter.Q.value = 0.5; // Gentle filter
      
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
   * Stop and cleanup engine sound
   */
  stopEngineSound() {
    if (this.engineSound && !this.isDestroyed) {
      try {
        // Fade out quickly
        const now = this.audioContext.currentTime;
        this.engineSound.gain.gain.setTargetAtTime(0, now, 0.05);
        
        // Stop oscillators after fade
        setTimeout(() => {
          try {
            if (this.engineSound) {
              this.engineSound.osc1.stop();
              this.engineSound.osc2.stop();
              this.engineSound = null;
            }
          } catch (e) {
            // Already stopped
          }
        }, 100);
      } catch (error) {
        console.warn('Failed to stop engine sound:', error);
      }
    }
  }

  /**
   * Update engine sound based on speed (IMPROVED)
   */
  playEngine(speed = 0, maxSpeed = 300) {
    if (!this.enabled || !this.audioContext || !this.engineSound || this.isDestroyed) return;
    
    const normalizedSpeed = Math.abs(speed) / maxSpeed;
    const baseFreq = 60; // Lower base frequency
    const maxFreq = 180; // Lower max frequency for less harsh sound
    const targetFreq = baseFreq + (normalizedSpeed * (maxFreq - baseFreq));
    
    // Smoothly change frequency
    const now = this.audioContext.currentTime;
    this.engineSound.osc1.frequency.setTargetAtTime(targetFreq, now, 0.15); // Slower transition
    this.engineSound.osc2.frequency.setTargetAtTime(targetFreq * 1.5, now, 0.15);
    
    // Adjust volume based on speed (much lower volumes)
    const targetVolume = 0.05 + (normalizedSpeed * 0.15 * this.sfxVolume);
    this.engineSound.gain.gain.setTargetAtTime(targetVolume, now, 0.1);
    
    // Adjust filter frequency for more realistic sound (gentler range)
    const filterFreq = 250 + (normalizedSpeed * 300);
    this.engineSound.filter.frequency.setTargetAtTime(filterFreq, now, 0.15);
  }

  /**
   * Play collision sound (IMPROVED)
   */
  playCollision() {
    if (!this.enabled || !this.audioContext || this.isDestroyed) return;
    
    try {
      const now = this.audioContext.currentTime;
      
      // Create noise for crash sound (shorter, less harsh)
      const noise = this.audioContext.createBufferSource();
      const bufferSize = this.audioContext.sampleRate * 0.15; // Shorter: 0.15 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Softer noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      
      noise.buffer = buffer;
      
      // Create filter and envelope
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600; // Lower frequency
      filter.Q.value = 0.5;
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now); // Much lower volume
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      noise.start(now);
      noise.stop(now + 0.15);
    } catch (error) {
      console.warn('Failed to play collision sound:', error);
    }
  }

  /**
   * Play pickup success sound (IMPROVED)
   */
  playPickup() {
    if (!this.enabled || !this.audioContext || this.isDestroyed) return;
    
    try {
      const now = this.audioContext.currentTime;
      
      // Create ascending tone for pickup (softer)
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now); // Lower volume
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // Shorter
      
      // Ascending frequency sweep (lower frequencies)
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.2);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + 0.3);
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
   * Start ambient background music (IMPROVED - Much softer)
   */
  startAmbientMusic() {
    if (!this.enabled || !this.audioContext || this.ambientMusic || this.isDestroyed) return;
    
    try {
      // Create simple ambient drone (much softer)
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 130.81; // C3
      osc2.frequency.value = 196; // G3
      
      const gain = this.audioContext.createGain();
      gain.gain.value = 0.02 * this.musicVolume; // Much lower volume
      
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
   * Stop ambient music (IMPROVED)
   */
  stopAmbientMusic() {
    if (this.ambientMusic && !this.isDestroyed) {
      try {
        const now = this.audioContext.currentTime;
        this.ambientMusic.gain.gain.setTargetAtTime(0, now, 0.1);
        
        setTimeout(() => {
          try {
            if (this.ambientMusic) {
              this.ambientMusic.osc1.stop();
              this.ambientMusic.osc2.stop();
              this.ambientMusic = null;
            }
          } catch (e) {
            // Already stopped
          }
        }, 150);
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
   * Stop all sounds (IMPROVED)
   */
  stopAll() {
    if (this.isDestroyed) return;
    
    this.stopEngineSound();
    this.stopAmbientMusic();
  }

  /**
   * Clean up audio resources (IMPROVED)
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    
    this.stopAll();
    
    // Give a moment for sounds to fade out
    setTimeout(() => {
      if (this.audioContext && this.audioContext.state !== 'closed') {
        try {
          this.audioContext.close();
        } catch (error) {
          console.warn('Failed to close audio context:', error);
        }
      }
      this.audioContext = null;
      this.masterGain = null;
      this.engineSound = null;
      this.ambientMusic = null;
    }, 150);
  }
}
