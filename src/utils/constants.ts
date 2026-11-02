import { DifficultyConfig, DifficultyMode } from '../types/game';

export const DIFFICULTIES: Record<DifficultyMode, DifficultyConfig> = {
  casual: {
    name: 'Standard Cadence',
    description: 'Generous flight clearance with smooth, stable aerodynamic response',
    speed: 1.0,
    gap: 165,
    gravity: 0.13,
    lift: -3.8,
    pipeSpawnInterval: 155,
    scoreMultiplier: 1,
  },
  classic: {
    name: 'Classic Flight',
    description: 'The balanced flight parameters and original obstacle clearance',
    speed: 1.25,
    gap: 145,
    gravity: 0.15,
    lift: -4.0,
    pipeSpawnInterval: 140,
    scoreMultiplier: 1,
  },
  extreme: {
    name: 'Precision Challenge',
    description: 'High velocity navigation through demanding, narrow corridors',
    speed: 1.65,
    gap: 130,
    gravity: 0.18,
    lift: -4.3,
    pipeSpawnInterval: 120,
    scoreMultiplier: 2,
  },
};

export const FORMAL_MILESTONES: Record<number, string> = {
  5: 'Waypoint Cleared · 5 Points',
  10: 'Tactical Trajectory · 10 Points',
  25: 'Executive Elevation · 25 Points',
  50: 'Distinguished Command · 50 Points',
  100: 'Centennial Flight Record · 100 Points',
};

export const FORMAL_REFLECTIONS = [
  '“Perseverance and disciplined navigation define distinguished flight.”',
  '“Complex corridors require measured timing and steady elevation.”',
  '“Every descent provides the experience required for higher altitude.”',
  '“Maintain focus, recalibrate trajectory, and resume the campaign.”',
  '“Precision across every waypoint establishes enduring records.”',
  '“Strategic foresight and prompt response conquer narrow passes.”',
];
