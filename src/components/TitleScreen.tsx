import React from 'react';
import { Volume2, VolumeX, Music, Award, Play, Shield, Compass, Zap, Maximize, Minimize } from 'lucide-react';
import { DifficultyMode } from '../types/game';
import { DIFFICULTIES } from '../utils/constants';

interface TitleScreenProps {
  onStart: () => void;
  highScore: number;
  difficulty: DifficultyMode;
  onDifficultyChange: (mode: DifficultyMode) => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  highScore,
  difficulty,
  onDifficultyChange,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-slate-950/70 backdrop-blur-md text-white select-none animate-fadeIn">
      {/* Top Formal Status Cluster */}
      <div className="w-full flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-normal">Flight Record:</span>
            <span className="tabular-nums font-bold text-white tracking-wide">{highScore}</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Airspace Active
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFullscreen}
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen (F)"
            className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleSound}
            aria-label="Toggle Audio Effects"
            className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer shadow-md ${
              soundEnabled
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleMusic}
            aria-label="Toggle Background Score"
            className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer shadow-md ${
              musicEnabled
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Centerpiece */}
      <div className="flex flex-col items-center text-center my-auto max-w-xl mx-auto w-full">
        {/* Formal Insignia Emblem */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-5 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-emerald-500/30 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition duration-700" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-2.5 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            <img
              src="/static/images/bird.png"
              alt="Flying Leader"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>

        {/* Refined Executive Title Lockup */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">
            Official Simulation
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 tracking-wider uppercase drop-shadow-md">
            Flying Leader
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-[3px] text-slate-300 uppercase">
            Aerial Campaign Odyssey
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto pt-2 font-normal leading-relaxed">
            Navigate with precision through complex airspace corridors, clear high-altitude waypoints, and achieve the ultimate campaign record.
          </p>
        </div>

        {/* Flight Parameter Profile Selector */}
        <div className="w-full max-w-md mb-6">
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <button
              onClick={() => onDifficultyChange('casual')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                difficulty === 'casual'
                  ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white shadow-lg border border-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4 mb-1" />
              <span>Standard</span>
            </button>

            <button
              onClick={() => onDifficultyChange('classic')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                difficulty === 'classic'
                  ? 'bg-gradient-to-b from-amber-600 to-orange-700 text-white shadow-lg border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4 mb-1" />
              <span>Classic</span>
            </button>

            <button
              onClick={() => onDifficultyChange('extreme')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                difficulty === 'extreme'
                  ? 'bg-gradient-to-b from-rose-600 to-red-800 text-white shadow-lg border border-rose-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-4 h-4 mb-1 text-yellow-300" />
              <span>Precision</span>
            </button>
          </div>
          <p className="text-[11px] text-amber-300/80 text-center mt-2 font-medium">
            {DIFFICULTIES[difficulty].description}
          </p>
        </div>

        {/* Start Flight Action */}
        <button
          onClick={onStart}
          className="group relative flex items-center justify-center gap-3 w-64 sm:w-72 py-4 px-8 rounded-full font-bold text-base tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_8px_30px_rgba(245,158,11,0.45)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.6)] active:scale-95 transition-all duration-200 border border-white/40 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
          <span>Initiate Flight</span>
          <span className="absolute -top-2.5 -right-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-400/50 text-amber-300 font-bold text-[10px] tracking-normal uppercase shadow">
            Space
          </span>
        </button>
      </div>

      {/* Formal Footer / Control Line */}
      <div className="w-full max-w-6xl mx-auto pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">Tap</kbd> Flap</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">Esc</kbd> Pause</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">F</kbd> Fullscreen</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">M</kbd> Audio</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Flying Leader &bull; Aerial Campaign Simulator
        </div>
      </div>
    </div>
  );
};
