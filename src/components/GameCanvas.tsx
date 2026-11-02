import React, { useEffect, useRef } from 'react';
import { BirdState, DifficultyConfig, FloatingText, GameScreen, Particle, PipePair } from '../types/game';
import { audioSystem } from '../utils/audio';

interface GameCanvasProps {
  screen: GameScreen;
  difficultyConfig: DifficultyConfig;
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onMilestone: (title: string) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  screen,
  difficultyConfig,
  onScoreUpdate,
  onGameOver,
  onMilestone,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep live references to state
  const screenRef = useRef<GameScreen>(screen);
  screenRef.current = screen;

  const configRef = useRef<DifficultyConfig>(difficultyConfig);
  configRef.current = difficultyConfig;

  const onScoreUpdateRef = useRef(onScoreUpdate);
  onScoreUpdateRef.current = onScoreUpdate;

  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const onMilestoneRef = useRef(onMilestone);
  onMilestoneRef.current = onMilestone;

  const jumpTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Load assets
    const birdImg = new Image();
    birdImg.src = '/static/images/bird.png';

    const pipeImg = new Image();
    pipeImg.src = '/static/images/rahul.webp';

    const bgImg = new Image();
    bgImg.src = '/static/images/background.webp';

    // Viewport tracking with DPR scaling
    let viewW = window.innerWidth;
    let viewH = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(viewW * dpr);
      canvas.height = Math.floor(viewH * dpr);
      canvas.style.width = `${viewW}px`;
      canvas.style.height = `${viewH}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic bird starting placement
    const getBirdStartX = () => Math.min(180, Math.max(90, viewW * 0.18));
    const getBirdStartY = () => viewH * 0.38;

    let bird: BirdState = {
      x: getBirdStartX(),
      y: getBirdStartY(),
      width: 44,
      height: 44,
      velocity: 0,
      gravity: configRef.current.gravity,
      lift: configRef.current.lift,
      rotation: 0,
      targetRotation: 0,
      scaleX: 1,
      scaleY: 1,
    };

    let pipes: PipePair[] = [];
    let pipeIdCounter = 0;
    let particles: Particle[] = [];
    let floatingTexts: FloatingText[] = [];
    let score = 0;
    let frame = 0;
    let cameraShake = 0;
    let hitFlashAlpha = 0;
    let hitstopRemainingMs = 0;
    let lastTime = performance.now();
    let bgScrollX = 0;
    let isGameOverTriggered = false;

    const resetGame = () => {
      bird = {
        x: getBirdStartX(),
        y: getBirdStartY(),
        width: 44,
        height: 44,
        velocity: 0,
        gravity: configRef.current.gravity,
        lift: configRef.current.lift,
        rotation: 0,
        targetRotation: 0,
        scaleX: 1,
        scaleY: 1,
      };
      pipes = [];
      particles = [];
      floatingTexts = [];
      score = 0;
      frame = 0;
      cameraShake = 0;
      hitFlashAlpha = 0;
      hitstopRemainingMs = 0;
      isGameOverTriggered = false;
      onScoreUpdateRef.current(0);
    };

    const addParticles = (x: number, y: number, count: number, colors: string[]) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.2;
        particles.push({
          id: Math.random(),
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.018,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          shape: Math.random() > 0.5 ? 'sparkle' : 'circle',
        });
      }
    };

    const addFloatingText = (x: number, y: number, text: string, color: string = '#f59e0b') => {
      floatingTexts.push({
        id: Math.random(),
        x,
        y,
        text,
        color,
        alpha: 1,
        scale: 1,
      });
    };

    const performJump = () => {
      if (screenRef.current !== 'playing') return;
      if (isGameOverTriggered) return;

      bird.velocity = configRef.current.lift;
      bird.scaleX = 0.85;
      bird.scaleY = 1.2;
      audioSystem.playJump();

      // Formal aerodynamic propulsion trail
      addParticles(bird.x + 8, bird.y + bird.height - 4, 6, [
        '#f59e0b',
        '#ffffff',
        '#10b981',
        '#d97706',
      ]);
    };

    const roundRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      radius: number
    ) => {
      if (h <= 0 || w <= 0) return;
      const r = Math.min(radius, w / 2, h / 2);
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    };

    const handleGameOver = () => {
      if (isGameOverTriggered) return;
      isGameOverTriggered = true;
      cameraShake = 16;
      hitFlashAlpha = 0.65;
      hitstopRemainingMs = 70;

      addParticles(bird.x + bird.width / 2, bird.y + bird.height / 2, 32, [
        '#ef4444',
        '#f59e0b',
        '#ffffff',
        '#fbbf24',
      ]);

      audioSystem.playGameOver();
      audioSystem.pauseMusic();

      setTimeout(() => {
        onGameOverRef.current(score);
      }, 350);
    };

    let animationFrameId: number;

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastTime = currentTime;

      const currentScreen = screenRef.current;
      const groundH = 22;
      const groundY = viewH - groundH;

      // Handle queued flap
      if (jumpTriggeredRef.current) {
        jumpTriggeredRef.current = false;
        performJump();
      }

      if (hitstopRemainingMs > 0) {
        hitstopRemainingMs -= dt * 1000;
      } else if (currentScreen === 'playing' && !isGameOverTriggered) {
        const currentCfg = configRef.current;
        bird.velocity += currentCfg.gravity;
        bird.y += bird.velocity;

        // Smooth restitution of scale
        bird.scaleX += (1 - bird.scaleX) * 0.16;
        bird.scaleY += (1 - bird.scaleY) * 0.16;

        // Controlled rotation tilt
        bird.targetRotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity / 7.5) * 0.5));
        bird.rotation += (bird.targetRotation - bird.rotation) * 0.22;

        // Lower boundary collision
        if (bird.y + bird.height >= groundY) {
          bird.y = groundY - bird.height;
          handleGameOver();
        }

        // Upper boundary collision
        if (bird.y < 0) {
          bird.y = 0;
          bird.velocity = 0;
        }

        // Keep bird x aligned to responsive layout
        const targetBirdX = getBirdStartX();
        bird.x += (targetBirdX - bird.x) * 0.05;

        // Dynamic pipe spawning based on full screen dimensions
        const spawnInterval = currentCfg.pipeSpawnInterval;
        if (frame % spawnInterval === 0) {
          const gap = Math.min(220, Math.max(currentCfg.gap, viewH * 0.26));
          const minPipeH = Math.max(70, viewH * 0.12);
          const maxPipeH = Math.max(minPipeH + 50, viewH - gap - minPipeH - groundH - 40);
          const topH = Math.floor(Math.random() * (maxPipeH - minPipeH)) + minPipeH;
          const bottomY = topH + gap;
          const bottomH = groundY - bottomY;

          const pipeWidth = Math.min(95, Math.max(72, viewW * 0.075));

          pipes.push({
            id: pipeIdCounter++,
            x: viewW + 10,
            topHeight: topH,
            bottomY,
            bottomHeight: bottomH,
            width: pipeWidth,
            passed: false,
          });
        }

        // Obstacle progression
        for (let i = pipes.length - 1; i >= 0; i--) {
          const pipe = pipes[i];
          pipe.x -= currentCfg.speed * (viewW > 1200 ? 1.35 : 1.15);

          // Scoring logic
          if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score += currentCfg.scoreMultiplier;
            onScoreUpdateRef.current(score);
            audioSystem.playScore();

            addFloatingText(
              pipe.x + pipe.width / 2,
              pipe.topHeight + currentCfg.gap / 2,
              `+${currentCfg.scoreMultiplier}`,
              '#fbbf24'
            );
            addParticles(pipe.x + pipe.width / 2, pipe.topHeight + currentCfg.gap / 2, 10, [
              '#fbbf24',
              '#ffffff',
              '#f59e0b',
            ]);

            if (score === 10 || score === 25 || score === 50 || score === 100) {
              audioSystem.playMilestone();
              onMilestoneRef.current(
                score === 100
                  ? 'Centennial Record Cleared · 100'
                  : score === 50
                  ? 'Command Milestone Reached · 50'
                  : score === 25
                  ? 'Executive Corridor Cleared · 25'
                  : 'Waypoint 10 Confirmed'
              );
            }
          }

          // Offscreen removal
          if (pipe.x + pipe.width < -40) {
            pipes.splice(i, 1);
            continue;
          }

          // Precision collision checks
          const birdInset = 5;
          const birdLeft = bird.x + birdInset;
          const birdRight = bird.x + bird.width - birdInset;
          const birdTop = bird.y + birdInset;
          const birdBottom = bird.y + bird.height - birdInset;

          const pipeLeft = pipe.x + 3;
          const pipeRight = pipe.x + pipe.width - 3;

          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
              handleGameOver();
            }
          }
        }

        bgScrollX = (bgScrollX + currentCfg.speed * 0.45) % viewW;
        frame++;
      } else if (currentScreen === 'title') {
        frame++;
        bird.x = getBirdStartX();
        bird.y = getBirdStartY() + Math.sin(frame * 0.045) * 16;
        bird.rotation = Math.sin(frame * 0.045) * 0.06;
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Update floating texts
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 1.3;
        ft.alpha -= 0.022;
        ft.scale += 0.008;
        if (ft.alpha <= 0) {
          floatingTexts.splice(i, 1);
        }
      }

      // Camera shake decay
      if (cameraShake > 0) {
        cameraShake *= 0.86;
        if (cameraShake < 0.2) cameraShake = 0;
      }

      // Hit flash decay
      if (hitFlashAlpha > 0) {
        hitFlashAlpha -= 0.045;
        if (hitFlashAlpha < 0) hitFlashAlpha = 0;
      }

      // ----------------------------------------------------
      // HIGH-DPI FULLSCREEN RENDERING PASS
      // ----------------------------------------------------
      ctx.save();
      ctx.scale(dpr, dpr);

      // Camera shake application
      if (cameraShake > 0) {
        const shakeX = (Math.random() - 0.5) * cameraShake;
        const shakeY = (Math.random() - 0.5) * cameraShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Full-bleed Background
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        // Compute aspect fill
        const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        const targetH = viewH;
        const targetW = targetH * imgRatio;

        const offsetX1 = -bgScrollX % targetW;
        const offsetX2 = offsetX1 + targetW;

        ctx.drawImage(bgImg, offsetX1, 0, targetW, targetH);
        ctx.drawImage(bgImg, offsetX2, 0, targetW, targetH);
        if (offsetX2 + targetW < viewW) {
          ctx.drawImage(bgImg, offsetX2 + targetW, 0, targetW, targetH);
        }

        // Formal executive gradient tint
        const darkWash = ctx.createLinearGradient(0, 0, 0, viewH);
        darkWash.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
        darkWash.addColorStop(0.5, 'rgba(2, 6, 23, 0.25)');
        darkWash.addColorStop(1, 'rgba(15, 23, 42, 0.65)');
        ctx.fillStyle = darkWash;
        ctx.fillRect(0, 0, viewW, viewH);
      } else {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.5, '#1e293b');
        skyGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, viewW, viewH);
      }

      // 2. High-Altitude Atmospheric Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      const cloud1 = (frame * 0.35) % (viewW + 200);
      const cloud2 = (frame * 0.2 + viewW * 0.5) % (viewW + 200);

      ctx.beginPath();
      ctx.arc(viewW + 100 - cloud1, viewH * 0.18, 38, 0, Math.PI * 2);
      ctx.arc(viewW + 135 - cloud1, viewH * 0.16, 50, 0, Math.PI * 2);
      ctx.arc(viewW + 175 - cloud1, viewH * 0.18, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(viewW + 100 - cloud2, viewH * 0.28, 28, 0, Math.PI * 2);
      ctx.arc(viewW + 128 - cloud2, viewH * 0.26, 38, 0, Math.PI * 2);
      ctx.arc(viewW + 160 - cloud2, viewH * 0.28, 30, 0, Math.PI * 2);
      ctx.fill();

      // 3. Obstacle Columns
      pipes.forEach((pipe) => {
        const renderColumn = (x: number, y: number, w: number, h: number, isTop: boolean) => {
          if (h <= 0) return;

          ctx.save();
          roundRect(ctx, x, y, w, h, 14);
          ctx.clip();

          if (pipeImg.complete && pipeImg.naturalWidth > 0) {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x, y, w, h);

            const imgAspect = pipeImg.naturalWidth / pipeImg.naturalHeight;
            const pipeAspect = w / h;

            let drawW: number;
            let drawH: number;
            let drawX: number;
            let drawY: number;

            if (imgAspect > pipeAspect) {
              drawH = h;
              drawW = drawH * imgAspect;
              drawX = x - (drawW - w) / 2;
              drawY = y;
            } else {
              drawW = w;
              drawH = drawW / imgAspect;
              drawX = x;
              drawY = isTop ? y : y + (h - drawH);
            }

            ctx.drawImage(pipeImg, drawX, drawY, drawW, drawH);
          } else {
            const grad = ctx.createLinearGradient(x, y, x + w, y);
            grad.addColorStop(0, '#1e293b');
            grad.addColorStop(0.5, '#334155');
            grad.addColorStop(1, '#0f172a');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
          }

          ctx.restore();

          // Formal gold & obsidian outline border
          ctx.save();
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
          ctx.lineWidth = 2.5;
          roundRect(ctx, x, y, w, h, 14);
          ctx.stroke();

          // Refined rim light accent
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          if (isTop) {
            ctx.fillRect(x + 3, y + h - 6, w - 6, 3);
          } else {
            ctx.fillRect(x + 3, y + 3, w - 6, 3);
          }
          ctx.restore();
        };

        renderColumn(pipe.x, 0, pipe.width, pipe.topHeight, true);
        renderColumn(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight, false);
      });

      // 4. Ground Runway / Formal Horizon Base
      const runwayGrad = ctx.createLinearGradient(0, groundY, 0, viewH);
      runwayGrad.addColorStop(0, '#d97706'); // Refined Gold
      runwayGrad.addColorStop(0.3, '#f59e0b');
      runwayGrad.addColorStop(0.6, '#ffffff'); // Pure White
      runwayGrad.addColorStop(1, '#059669'); // Emerald
      ctx.fillStyle = runwayGrad;
      ctx.fillRect(0, groundY, viewW, groundH);

      // Runway guideline
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, groundY - 2, viewW, 2);

      // 5. Particles
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'sparkle') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.35, 0);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(p.size * 0.35, p.size * 0.35);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.35, p.size * 0.35);
          ctx.lineTo(-p.size, 0);
          ctx.lineTo(-p.size * 0.35, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 6. Flying Leader Bird
      ctx.save();
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      ctx.rotate(bird.rotation);
      ctx.scale(bird.scaleX, bird.scaleY);

      if (birdImg.complete && birdImg.naturalWidth > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 6;

        ctx.drawImage(
          birdImg,
          -bird.width / 2,
          -bird.height / 2,
          bird.width,
          bird.height
        );
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, bird.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 7. Floating Point Clear Indicators
      floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = '800 16px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // 8. Hit Flash Overlay
      if (hitFlashAlpha > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${hitFlashAlpha})`;
        ctx.fillRect(0, 0, viewW, viewH);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Responsive user input
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        jumpTriggeredRef.current = true;
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      // Don't trigger if clicked on an interactive UI element
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, input, select, a')) {
        return;
      }
      jumpTriggeredRef.current = true;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('touchstart', onPointerDown, { passive: false });

    const handleRestartEvent = () => resetGame();
    window.addEventListener('game:restart', handleRestartEvent);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('game:restart', handleRestartEvent);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block select-none bg-slate-950 cursor-pointer"
    />
  );
};
