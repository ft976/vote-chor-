/**
 * Audio manager for Flying Modi game.
 * Uses the original sound assets from the repository:
 * - /static/audio/maka.mp3 (Jump SFX)
 * - /static/audio/gameover.mp3 (Game Over SFX)
 * - /static/audio/music.mp3 (Background Theme Loop)
 * Includes Web Audio API fallback synthesized tones for instant responsiveness.
 */

class SoundSystem {
  private bgMusic: HTMLAudioElement | null = null;
  private jumpAudioPool: HTMLAudioElement[] = [];
  private gameOverAudio: HTMLAudioElement | null = null;
  private poolIndex = 0;
  private audioCtx: AudioContext | null = null;

  private soundMuted = false;
  private musicMuted = false;
  private volume = 0.8;
  private isMusicPlaying = false;

  constructor() {
    // Only init DOM audio in browser
    if (typeof window !== 'undefined') {
      try {
        this.bgMusic = new Audio('/static/audio/music.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.45;

        this.gameOverAudio = new Audio('/static/audio/gameover.mp3');
        this.gameOverAudio.volume = 0.7;

        // Audio pool for fast consecutive jumps without cutting off
        for (let i = 0; i < 4; i++) {
          const a = new Audio('/static/audio/maka.mp3');
          a.volume = 0.65;
          this.jumpAudioPool.push(a);
        }
      } catch (err) {
        console.warn('Audio element initialization error:', err);
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public setSoundMuted(muted: boolean) {
    this.soundMuted = muted;
  }

  public setMusicMuted(muted: boolean) {
    this.musicMuted = muted;
    if (muted) {
      this.pauseMusic();
    } else if (this.isMusicPlaying && this.bgMusic) {
      this.bgMusic.play().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgMusic) {
      this.bgMusic.volume = this.volume * 0.45;
    }
    if (this.gameOverAudio) {
      this.gameOverAudio.volume = this.volume * 0.7;
    }
    this.jumpAudioPool.forEach(a => {
      a.volume = this.volume * 0.65;
    });
  }

  public playMusic() {
    this.isMusicPlaying = true;
    if (this.musicMuted || !this.bgMusic) return;
    this.bgMusic.currentTime = 0;
    this.bgMusic.play().catch(() => {
      // Browser autoplay might require user gesture
    });
  }

  public resumeMusic() {
    this.isMusicPlaying = true;
    if (this.musicMuted || !this.bgMusic) return;
    this.bgMusic.play().catch(() => {});
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

  public playJump() {
    if (this.soundMuted) return;

    if (this.jumpAudioPool.length > 0) {
      const audio = this.jumpAudioPool[this.poolIndex];
      this.poolIndex = (this.poolIndex + 1) % this.jumpAudioPool.length;
      audio.currentTime = 0;
      audio.play().catch(() => {
        this.playSynthJump();
      });
    } else {
      this.playSynthJump();
    }
  }

  public playScore() {
    if (this.soundMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  public playGameOver() {
    if (this.soundMuted) return;
    if (this.gameOverAudio) {
      this.gameOverAudio.currentTime = 0;
      this.gameOverAudio.play().catch(() => {
        this.playSynthGameOver();
      });
    } else {
      this.playSynthGameOver();
    }
  }

  public playMilestone() {
    if (this.soundMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 fanfare
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  private playSynthJump() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore
    }
  }

  private playSynthGameOver() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(this.volume * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // ignore
    }
  }
}

export const audioSystem = new SoundSystem();
