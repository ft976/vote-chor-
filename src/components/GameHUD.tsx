import React, { useState } from 'react';
import { Pause, Volume2, VolumeX, Music, Award, Maximize, Minimize, ArrowUp, Camera, Check } from 'lucide-react';
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
  const [captured, setCaptured] = useState(false);

  const handleCaptureScreenshot = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `flying_leader_screenshot_${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      setCaptured(true);
      setTimeout(() => setCaptured(false), 2000);
    } catch (e) {
      console.warn('Screenshot capture notice:', e);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] px-[max(0.75rem,env(safe-area-inset-left))] select-none">
      {/* Top Status & Controls Cluster */}
      <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Flight Profile & Record */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-300 text-[11px] sm:text-sm font-semibold shadow-xl backdrop-blur-md">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-slate-400 font-normal hidden xs:inline">Best:</span>
            <span className="tabular-nums font-bold text-white tracking-wide">{highScore}</span>
          </div>

          <span className="hidden md:inline-block px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-[11px] font-semibold text-slate-300 uppercase tracking-wider backdrop-blur-md">
            {difficulty}
          </span>
        </div>

        {/* Center: Live Formal Score Display */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] sm:text-[11px] uppercase font-bold tracking-[2px] sm:tracking-[3px] text-amber-400/90 drop-shadow">
            Points
          </span>
          <div className="text-4xl sm:text-6xl font-black text-white tabular-nums drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] tracking-tight">
            {score}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            onClick={handleCaptureScreenshot}
            aria-label="Capture In-Game Screenshot"
            title="Save Screenshot"
            className="p-2 sm:p-2.5 min-w-[36px] min-h-[36px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            {captured ? <Check className="w-4 h-4 text-emerald-400" /> : <Camera className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={onToggleFullscreen}
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen (F)"
            className="p-2 sm:p-2.5 min-w-[36px] min-h-[36px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleSound}
            aria-label="Toggle Audio Effects"
            className="p-2 sm:p-2.5 min-w-[36px] min-h-[36px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onToggleMusic}
            aria-label="Toggle Background Music"
            className="hidden sm:flex p-2 sm:p-2.5 min-w-[36px] min-h-[36px] sm:min-w-[42px] sm:min-h-[42px] items-center justify-center rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            <Music className={`w-4 h-4 ${musicEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
          </button>

          <button
            onClick={onPause}
            aria-label="Pause Flight"
            className="p-2 sm:p-2.5 min-w-[36px] min-h-[36px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Milestone Toast banner */}
      {milestoneToast && (
        <div className="self-center pointer-events-none animate-bounce px-2">
          <div className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 border border-amber-300/60 text-white font-extrabold text-xs sm:text-base tracking-wide shadow-[0_8px_30px_rgba(245,158,11,0.6)] backdrop-blur-md text-center">
            ✦ {milestoneToast}
          </div>
        </div>
      )}

      {/* Bottom Minimalist Status Line / Mobile Elevation Trigger Guide */}
      <div className="w-full flex flex-col items-center gap-1.5 pb-1 pointer-events-none">
        <div className="sm:hidden pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-2xl backdrop-blur-md active:scale-95 active:bg-amber-500/30 transition">
          <ArrowUp className="w-4 h-4 animate-bounce" />
          <span>TAP ANYWHERE TO ELEVATE</span>
        </div>

        <div className="hidden sm:block px-4 py-1 rounded-full bg-slate-950/60 text-[11px] text-slate-400 font-medium tracking-wider border border-slate-800/60 backdrop-blur-md">
          Space or Tap to Elevate &bull; Esc to Pause &bull; F for Fullscreen
        </div>
      </div>
    </div>
  );
};
