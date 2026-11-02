/**
 * Robust cross-device Audio System for Flying Leader / Flying Modi.
 * Supports:
 * - Pre-decoded Web Audio buffers (zero latency on mobile iOS Safari & Android)
 * - HTML5 Audio streaming for long background music loop
 * - Automatic user-gesture audio unlocking (touch, pointer, click, keydown)
 * - Procedural synthesizer fallback if files are blocked or network fails
 * - Volume control and independent SFX / Music muting
 */

class SoundSystem {
  private audioCtx: AudioContext | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private jumpBuffer: AudioBuffer | null = null;
  private gameOverBuffer: AudioBuffer | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private musicSourceNode: AudioBufferSourceNode | null = null;

  // HTML5 audio fallbacks
  private jumpAudioFallback: HTMLAudioElement | null = null;
  private gameOverAudioFallback: HTMLAudioElement | null = null;

  private soundMuted = false;
  private musicMuted = false;
  private volume = 0.8;
  private isMusicPlaying = false;
  private isUnlocked = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // 1. Setup HTML5 Audio elements
    try {
      this.bgMusic = new Audio('/static/audio/music.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.volume * 0.45;
      this.bgMusic.preload = 'auto';

      this.jumpAudioFallback = new Audio('/static/audio/maka.mp3');
      this.jumpAudioFallback.volume = this.volume * 0.65;
      this.jumpAudioFallback.preload = 'auto';

      this.gameOverAudioFallback = new Audio('/static/audio/gameover.mp3');
      this.gameOverAudioFallback.volume = this.volume * 0.7;
      this.gameOverAudioFallback.preload = 'auto';
    } catch (e) {
      console.warn('HTML5 Audio init notice:', e);
    }

    // 2. Pre-fetch and decode into Web Audio for instant mobile playback
    this.preloadWebAudio();

    // 3. Attach global unlocking listeners to catch the first user touch or click
    const unlockHandler = () => {
      this.unlockAudio();
    };

    window.addEventListener('pointerdown', unlockHandler, { once: true, passive: true });
    window.addEventListener('touchstart', unlockHandler, { once: true, passive: true });
    window.addEventListener('click', unlockHandler, { once: true, passive: true });
    window.addEventListener('keydown', unlockHandler, { once: true, passive: true });
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    return this.audioCtx;
  }

  /**
   * Preload audio assets into AudioBuffers
   */
  private async preloadWebAudio() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const loadBuffer = async (url: string): Promise<AudioBuffer | null> => {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        return await ctx.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.warn('Web Audio decode fallback to HTML5 for:', url, err);
        return null;
      }
    };

    // Load jump and gameover buffers asynchronously
    loadBuffer('/static/audio/maka.mp3').then((buf) => {
      if (buf) this.jumpBuffer = buf;
    });

    loadBuffer('/static/audio/gameover.mp3').then((buf) => {
      if (buf) this.gameOverBuffer = buf;
    });
  }

  /**
   * Unlocks AudioContext and HTML5 Audio on mobile user gesture
   */
  public unlockAudio() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Play a silent buffer in Web Audio to unlock iOS audio pipeline
    if (ctx) {
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch {
        // ignore
      }
    }

    // Unlock HTML5 Audio by calling load()
    try {
      if (this.bgMusic) {
        this.bgMusic.load();
      }
      if (this.jumpAudioFallback) {
        this.jumpAudioFallback.load();
      }
      if (this.gameOverAudioFallback) {
        this.gameOverAudioFallback.load();
      }
    } catch {
      // ignore
    }

    // If music should be playing, start it now
    if (this.isMusicPlaying && !this.musicMuted && this.bgMusic) {
      this.bgMusic.play().catch(() => {});
    }
  }

  public setSoundMuted(muted: boolean) {
    this.soundMuted = muted;
  }

  public setMusicMuted(muted: boolean) {
    this.musicMuted = muted;
    if (muted) {
      this.pauseMusic();
    } else if (this.isMusicPlaying) {
      this.playMusic();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgMusic) {
      this.bgMusic.volume = this.volume * 0.45;
    }
    if (this.jumpAudioFallback) {
      this.jumpAudioFallback.volume = this.volume * 0.65;
    }
    if (this.gameOverAudioFallback) {
      this.gameOverAudioFallback.volume = this.volume * 0.7;
    }
  }

  public playMusic() {
    this.isMusicPlaying = true;
    if (this.musicMuted) return;

    this.unlockAudio();

    if (this.bgMusic) {
      this.bgMusic.currentTime = 0;
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // If browser blocked it, it will auto-play on next touch via unlockAudio
          console.warn('Background music queued for user interaction:', err);
        });
      }
    }
  }

  public resumeMusic() {
    this.isMusicPlaying = true;
    if (this.musicMuted) return;

    if (this.bgMusic) {
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }

  public pauseMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  /**
   * Plays the flap / jump sound effect with zero latency
   */
  public playJump() {
    if (this.soundMuted) return;

    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Path 1: High-fidelity Web Audio buffer (instant on iOS & Android)
    if (ctx && this.jumpBuffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.jumpBuffer;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.7, ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } catch (e) {
        console.warn('WebAudio jump play error:', e);
      }
    }

    // Path 2: HTML5 Audio clone
    if (this.jumpAudioFallback) {
      try {
        const clone = this.jumpAudioFallback.cloneNode() as HTMLAudioElement;
        clone.volume = this.volume * 0.65;
        const p = clone.play();
        if (p !== undefined) {
          p.catch(() => this.playSynthJump());
        }
        return;
      } catch {
        this.playSynthJump();
        return;
      }
    }

    // Path 3: Synthesizer fallback
    this.playSynthJump();
  }

  public playScore() {
    if (this.soundMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(this.volume * 0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // ignore
    }
  }

  public playGameOver() {
    if (this.soundMuted) return;

    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Path 1: Web Audio Buffer
    if (ctx && this.gameOverBuffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.gameOverBuffer;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.8, ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } catch {
        // fallback
      }
    }

    // Path 2: HTML5 Audio
    if (this.gameOverAudioFallback) {
      this.gameOverAudioFallback.currentTime = 0;
      this.gameOverAudioFallback.play().catch(() => {
        this.playSynthGameOver();
      });
      return;
    }

    this.playSynthGameOver();
  }

  public playMilestone() {
    if (this.soundMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 fanfare
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(this.volume * 0.22, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.22);
      });
    } catch {
      // ignore
    }
  }

  private playSynthJump() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(this.volume * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      // ignore
    }
  }

  private playSynthGameOver() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(340, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.38);
      gain.gain.setValueAtTime(this.volume * 0.38, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch {
      // ignore
    }
  }
}

export const audioSystem = new SoundSystem();
