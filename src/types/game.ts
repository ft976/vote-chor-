export type GameScreen = 'title' | 'playing' | 'paused' | 'gameover';

export type DifficultyMode = 'casual' | 'classic' | 'extreme';

export interface BirdState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  gravity: number;
  lift: number;
  rotation: number;
  targetRotation: number;
  scaleX: number;
  scaleY: number;
}

export interface PipePair {
  id: number;
  x: number;
  topHeight: number;
  bottomY: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
  type?: 'normal' | 'moving';
  offsetY?: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  shape: 'circle' | 'lotus' | 'star' | 'sparkle';
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  difficulty: DifficultyMode;
}

export interface DifficultyConfig {
  name: string;
  description: string;
  speed: number;
  gap: number;
  gravity: number;
  lift: number;
  pipeSpawnInterval: number; // in frames or seconds
  scoreMultiplier: number;
}
