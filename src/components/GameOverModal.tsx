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
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-amber-500/40 p-7 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-center animate-scaleUp">
        {/* Subtle ambient light aura */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />

        {/* Insignia Icon */}
        <div className="relative w-20 h-20 mx-auto -mt-14 mb-4 rounded-full bg-slate-950 border-2 border-amber-500/50 p-2 shadow-2xl flex items-center justify-center">
          <img
            src="/static/images/bird.png"
            alt="Flying Leader"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]"
          />
          {isNewHigh && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md animate-bounce">
              ★
            </span>
          )}
        </div>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium tracking-wider uppercase mb-1">
          Debriefing Report
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 tracking-wide uppercase mb-1">
          Mission Concluded
        </h2>

        {/* Formal reflection */}
        <p className="text-xs text-amber-200/80 italic font-medium px-4 mb-5 leading-relaxed">
          {reflection}
        </p>

        {/* Score Card Container */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-amber-500/25 shadow-inner">
          <span className="block text-xs font-extrabold uppercase tracking-[2px] text-amber-400/90 mb-1">
            Campaign Points Cleared
          </span>
          <div className="text-5xl sm:text-6xl font-black text-white tabular-nums drop-shadow-[0_2px_14px_rgba(245,158,11,0.6)] tracking-tight">
            {score}
          </div>

          {/* Record Comparison */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-4 h-4 text-amber-400" /> All-Time Record:
            </span>
            <span className="font-bold text-amber-300 tabular-nums text-sm">
              {highScore}
            </span>
          </div>

          {isNewHigh && (
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300 uppercase tracking-wider animate-pulse">
              ★ New All-Time Campaign Record Established ★
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="group relative flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-2xl font-bold text-base tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 active:scale-98 transition shadow-[0_6px_25px_rgba(245,158,11,0.4)] cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 transition-transform group-hover:-rotate-90 duration-300" />
            <span>Initiate New Flight</span>
            <span className="absolute right-4 text-[10px] bg-slate-900/80 border border-amber-400/40 px-2 py-0.5 rounded text-amber-300">
              Space
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Summary Copied' : 'Share Report'}</span>
            </button>

            <button
              onClick={onHome}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
