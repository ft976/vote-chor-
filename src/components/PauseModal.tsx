import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Music, Shield, Compass, Zap, Home, Maximize, Minimize } from 'lucide-react';
import { DifficultyMode } from '../types/game';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToTitle: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  difficulty: DifficultyMode;
  onDifficultyChange: (mode: DifficultyMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuitToTitle,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  difficulty,
  onDifficultyChange,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-amber-500/30 p-7 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center">
        {/* Status Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-2">
          Airspace Hold
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase mb-1">
          Flight Paused
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Trajectory held in steady suspension. Prepare for corridor re-entry.
        </p>

        {/* Primary Flight Control Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 active:scale-98 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume Flight</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/90 active:scale-98 transition border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Flight</span>
          </button>
        </div>

        {/* Airspace Profile Configuration */}
        <div className="pt-4 border-t border-slate-800 text-left mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Airspace Difficulty
            </span>
            <span className="text-[11px] text-amber-400 font-medium capitalize">
              {difficulty}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => onDifficultyChange('casual')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                difficulty === 'casual'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Standard
            </button>
            <button
              onClick={() => onDifficultyChange('classic')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                difficulty === 'classic'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Classic
            </button>
            <button
              onClick={() => onDifficultyChange('extreme')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                difficulty === 'extreme'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Precision
            </button>
          </div>
        </div>

        {/* Secondary Toggles */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span>Fullscreen</span>
          </button>

          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>SFX</span>
          </button>

          <button
            onClick={onToggleMusic}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Music</span>
          </button>

          <button
            onClick={onQuitToTitle}
            className="flex items-center gap-1.5 hover:text-amber-400 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Title</span>
          </button>
        </div>
      </div>
    </div>
  );
};
