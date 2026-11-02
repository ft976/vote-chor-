import React from 'react';
import { Pause, Volume2, VolumeX, Music, Award, Maximize, Minimize } from 'lucide-react';
import { DifficultyMode } from '../types/game';

interface GameHUDProps {
  score: number;
  highScore: number;
  difficulty: DifficultyMode;
  milestoneToast: string | null;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onPause: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  difficulty,
  milestoneToast,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onPause,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-5 sm:p-7 select-none">
      {/* Top Status & Controls Cluster */}
      <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Flight Profile & Record */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/75 border border-slate-800 text-amber-300 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-normal">Record:</span>
            <span className="tabular-nums font-bold text-white tracking-wide">{highScore}</span>
          </div>

          <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-[11px] font-semibold text-slate-300 uppercase tracking-wider backdrop-blur-md">
            {difficulty}
          </span>
        </div>

        {/* Center: Live Formal Score Display */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] uppercase font-bold tracking-[3px] text-amber-400/90 drop-shadow">
            Campaign Points
          </span>
          <div className="text-4xl sm:text-6xl font-black text-white tabular-nums drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] tracking-tight">
            {score}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleFullscreen}
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen (F)"
            className="p-2.5 rounded-xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleSound}
            aria-label="Toggle Audio Effects"
            className="p-2.5 rounded-xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onToggleMusic}
            aria-label="Toggle Background Music"
            className="hidden sm:flex p-2.5 rounded-xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            <Music className={`w-4 h-4 ${musicEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
          </button>

          <button
            onClick={onPause}
            aria-label="Pause Flight"
            className="p-2.5 rounded-xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Milestone Toast banner */}
      {milestoneToast && (
        <div className="self-center pointer-events-none animate-bounce">
          <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 border border-amber-300/60 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-[0_8px_30px_rgba(245,158,11,0.6)] backdrop-blur-md">
            ✦ {milestoneToast}
          </div>
        </div>
      )}

      {/* Bottom Minimalist Status Line */}
      <div className="w-full flex justify-center pb-2">
        <div className="px-5 py-1 rounded-full bg-slate-950/60 text-[11px] text-slate-400 font-medium tracking-wider border border-slate-800/60 backdrop-blur-md">
          Space or Tap to Elevate &bull; Esc to Pause &bull; F for Fullscreen
        </div>
      </div>
    </div>
  );
};
