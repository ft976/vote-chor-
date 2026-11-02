import React, { useMemo, useState } from 'react';
import { RotateCcw, Award, Share2, Check, Home } from 'lucide-react';
import { FORMAL_REFLECTIONS } from '../utils/constants';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHigh,
  onRestart,
  onHome,
}) => {
  const [copied, setCopied] = useState(false);

  const reflection = useMemo(() => {
    return FORMAL_REFLECTIONS[Math.floor(Math.random() * FORMAL_REFLECTIONS.length)];
  }, []);

  const handleShare = () => {
    const text = `Flying Leader campaign record: ${score} points cleared. Test your precision flight navigation.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-amber-500/40 p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-center animate-scaleUp my-auto">
        {/* Subtle ambient light aura */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />

        {/* Insignia Icon */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto -mt-10 sm:-mt-12 mb-3 rounded-full bg-slate-950 border-2 border-amber-500/50 p-2 shadow-2xl flex items-center justify-center">
          <img
            src="/static/images/bird.png"
            alt="Flying Leader"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]"
          />
          {isNewHigh && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black shadow-md animate-bounce">
              ★
            </span>
          )}
        </div>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase mb-1">
          Debriefing Report
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 tracking-wide uppercase mb-1">
          Mission Concluded
        </h2>

        {/* Formal reflection */}
        <p className="text-[11px] sm:text-xs text-amber-200/80 italic font-medium px-2 sm:px-4 mb-4 leading-relaxed">
          {reflection}
        </p>

        {/* Score Card Container */}
        <div className="mb-4 sm:mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-amber-500/25 shadow-inner">
          <span className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-[2px] text-amber-400/90 mb-1">
            Campaign Points Cleared
          </span>
          <div className="text-4xl sm:text-6xl font-black text-white tabular-nums drop-shadow-[0_2px_14px_rgba(245,158,11,0.6)] tracking-tight">
            {score}
          </div>

          {/* Record Comparison */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" /> All-Time Record:
            </span>
            <span className="font-bold text-amber-300 tabular-nums text-sm">
              {highScore}
            </span>
          </div>

          {isNewHigh && (
            <div className="mt-2.5 py-1 px-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-[11px] font-bold text-amber-300 uppercase tracking-wider animate-pulse">
              ★ New All-Time Campaign Record Established ★
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <button
            onClick={onRestart}
            className="group relative flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 px-6 min-h-[46px] rounded-2xl font-bold text-sm sm:text-base tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 active:scale-98 transition shadow-[0_6px_25px_rgba(245,158,11,0.4)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-rotate-90 duration-300" />
            <span>Initiate New Flight</span>
            <span className="hidden sm:inline-block absolute right-4 text-[10px] bg-slate-900/80 border border-amber-400/40 px-2 py-0.5 rounded text-amber-300">
              Space
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share Report'}</span>
            </button>

            <button
              onClick={onHome}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
