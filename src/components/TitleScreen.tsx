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
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-8 md:p-12 bg-slate-950/75 backdrop-blur-md text-white select-none overflow-y-auto pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] px-[max(1rem,env(safe-area-inset-left))] animate-fadeIn">
      {/* Top Formal Status Cluster */}
      <div className="w-full flex items-center justify-between max-w-5xl mx-auto shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-slate-400 font-normal">Record:</span>
            <span className="tabular-nums font-bold text-white tracking-wide">{highScore}</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Airspace Active
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleFullscreen}
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen (F)"
            className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition shadow-md active:scale-95 cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleSound}
            aria-label="Toggle Audio Effects"
            className={`p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border transition active:scale-95 cursor-pointer shadow-md ${
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
            className={`p-2 sm:p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border transition active:scale-95 cursor-pointer shadow-md ${
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
      <div className="flex flex-col items-center text-center my-auto max-w-md sm:max-w-xl mx-auto w-full py-2">
        {/* Formal Insignia Emblem */}
        <div className="relative mb-3 sm:mb-4 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-emerald-500/30 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition duration-700" />
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-2 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/40 shadow-2xl flex items-center justify-center">
            <img
              src="/static/images/bird.png"
              alt="Flying Leader"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>

        {/* Title Lockup */}
        <div className="space-y-0.5 sm:space-y-1 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-1">
            Official Simulation
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 tracking-wider uppercase drop-shadow">
            Flying Leader
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold tracking-[2px] text-slate-300 uppercase">
            Aerial Campaign Odyssey
          </p>
        </div>

        {/* Flight Difficulty Profile Selector */}
        <div className="w-full max-w-sm sm:max-w-md mb-4 sm:mb-5">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <button
              onClick={() => onDifficultyChange('casual')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition active:scale-95 cursor-pointer ${
                difficulty === 'casual'
                  ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white shadow border border-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 mb-0.5" />
              <span>Standard</span>
            </button>

            <button
              onClick={() => onDifficultyChange('classic')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition active:scale-95 cursor-pointer ${
                difficulty === 'classic'
                  ? 'bg-gradient-to-b from-amber-600 to-orange-700 text-white shadow border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5 mb-0.5" />
              <span>Classic</span>
            </button>

            <button
              onClick={() => onDifficultyChange('extreme')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition active:scale-95 cursor-pointer ${
                difficulty === 'extreme'
                  ? 'bg-gradient-to-b from-rose-600 to-red-800 text-white shadow border border-rose-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5 mb-0.5 text-yellow-300" />
              <span>Precision</span>
            </button>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-300/80 text-center mt-1.5 font-medium px-2">
            {DIFFICULTIES[difficulty].description}
          </p>
        </div>

        {/* Start Flight Action CTA */}
        <button
          onClick={onStart}
          className="group relative flex items-center justify-center gap-2.5 w-60 sm:w-68 py-3.5 sm:py-4 px-6 rounded-full font-bold text-sm sm:text-base tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_8px_25px_rgba(245,158,11,0.45)] active:scale-95 transition-all duration-200 border border-white/40 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
          <span>Initiate Flight</span>
          <span className="hidden sm:inline-block absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400/50 text-amber-300 font-bold text-[9px] uppercase shadow">
            Space
          </span>
        </button>

        {/* Audio notice reassurance */}
        <p className="text-[10px] text-slate-400 mt-3">
          🔊 Audio will start immediately on launch
        </p>
      </div>

      {/* Footer / Control Line */}
      <div className="w-full max-w-5xl mx-auto pt-2 shrink-0 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-1.5">
        <div className="flex items-center gap-3">
          <span><strong className="text-amber-400">TAP SCREEN</strong> or <strong className="text-amber-400">SPACE</strong> to Flap</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline"><strong className="text-slate-300">ESC</strong> Pause</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline"><strong className="text-slate-300">F</strong> Fullscreen</span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium">
          Mobile &bull; Tablet &bull; Desktop Ready
        </div>
      </div>
    </div>
  );
};
