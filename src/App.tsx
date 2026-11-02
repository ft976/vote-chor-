import React, { useState, useEffect, useCallback } from 'react';
import { GameScreen, DifficultyMode } from './types/game';
import { DIFFICULTIES } from './utils/constants';
import { audioSystem } from './utils/audio';
import { GameCanvas } from './components/GameCanvas';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';

const HIGH_SCORE_KEY = 'flying_leader_high_score_';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('title');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('classic');
  const [score, setScore] = useState<number>(0);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);

  // Audio toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Load high score for the selected difficulty
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${HIGH_SCORE_KEY}${difficulty}`);
      setHighScore(saved ? parseInt(saved, 10) || 0 : 0);
    } catch {
      setHighScore(0);
    }
  }, [difficulty]);

  // Audio sync
  useEffect(() => {
    audioSystem.setSoundMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    audioSystem.setMusicMuted(!musicEnabled);
  }, [musicEnabled]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const handleToggleMusic = useCallback(() => {
    setMusicEnabled(prev => !prev);
  }, []);

  const handleStartGame = useCallback(() => {
    setScore(0);
    setFinalScore(0);
    setIsNewHigh(false);
    setMilestoneToast(null);
    setScreen('playing');
    window.dispatchEvent(new CustomEvent('game:restart'));
    audioSystem.playMusic();
  }, []);

  const handleRestartGame = useCallback(() => {
    setScore(0);
    setFinalScore(0);
    setIsNewHigh(false);
    setMilestoneToast(null);
    setScreen('playing');
    window.dispatchEvent(new CustomEvent('game:restart'));
    audioSystem.playMusic();
  }, []);

  const handlePause = useCallback(() => {
    if (screen === 'playing') {
      setScreen('paused');
      audioSystem.pauseMusic();
    }
  }, [screen]);

  const handleResume = useCallback(() => {
    if (screen === 'paused') {
      setScreen('playing');
      audioSystem.resumeMusic();
    }
  }, [screen]);

  const handleQuitToTitle = useCallback(() => {
    setScreen('title');
    audioSystem.stopMusic();
    window.dispatchEvent(new CustomEvent('game:restart'));
  }, []);

  const handleGameOver = useCallback((scoreVal: number) => {
    setFinalScore(scoreVal);
    let newRecord = false;
    try {
      const currentHigh = parseInt(localStorage.getItem(`${HIGH_SCORE_KEY}${difficulty}`) || '0', 10);
      if (scoreVal > currentHigh) {
        localStorage.setItem(`${HIGH_SCORE_KEY}${difficulty}`, scoreVal.toString());
        setHighScore(scoreVal);
        newRecord = true;
      }
    } catch {
      // ignore storage errors
    }
    setIsNewHigh(newRecord);
    setScreen('gameover');
  }, [difficulty]);

  const handleMilestone = useCallback((title: string) => {
    setMilestoneToast(title);
    setTimeout(() => {
      setMilestoneToast(null);
    }, 2400);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      // Toggle fullscreen with 'F'
      if (e.code === 'KeyF') {
        handleToggleFullscreen();
        return;
      }

      // Toggle mute with 'M'
      if (e.code === 'KeyM') {
        handleToggleSound();
        handleToggleMusic();
        return;
      }

      // Esc or P to pause/resume
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (screen === 'playing') {
          handlePause();
        } else if (screen === 'paused') {
          handleResume();
        }
        return;
      }

      // Space or Enter on Title/GameOver screen to start/restart
      if (e.code === 'Space' || e.code === 'Enter') {
        if (screen === 'title') {
          e.preventDefault();
          handleStartGame();
        } else if (screen === 'gameover') {
          e.preventDefault();
          handleRestartGame();
        }
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [
    screen,
    handleStartGame,
    handleRestartGame,
    handlePause,
    handleResume,
    handleToggleSound,
    handleToggleMusic,
    handleToggleFullscreen,
  ]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-['Poppins',sans-serif] select-none">
      {/* 100% Full-Viewport Game Canvas */}
      <GameCanvas
        screen={screen}
        difficultyConfig={DIFFICULTIES[difficulty]}
        onScoreUpdate={setScore}
        onGameOver={handleGameOver}
        onMilestone={handleMilestone}
      />

      {/* Screen Layer: Title Screen */}
      {screen === 'title' && (
        <TitleScreen
          onStart={handleStartGame}
          highScore={highScore}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      )}

      {/* Screen Layer: Active Flight HUD */}
      {screen === 'playing' && (
        <GameHUD
          score={score}
          highScore={highScore}
          difficulty={difficulty}
          milestoneToast={milestoneToast}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          onPause={handlePause}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      )}

      {/* Screen Layer: Pause Hold Modal */}
      {screen === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestartGame}
          onQuitToTitle={handleQuitToTitle}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      )}

      {/* Screen Layer: Mission Concluded / Game Over Modal */}
      {screen === 'gameover' && (
        <GameOverModal
          score={finalScore}
          highScore={highScore}
          isNewHigh={isNewHigh}
          onRestart={handleRestartGame}
          onHome={handleQuitToTitle}
        />
      )}
    </main>
  );
}
