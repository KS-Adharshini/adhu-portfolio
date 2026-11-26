import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = [];
    const maxParticles = 90;

    const mouse = {
      x: -1000,
      y: -1000,
      lastX: -1000,
      lastY: -1000,
      active: false
    };

    const createParticle = (x, y, speedMult = 1, isBurst = false) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst
        ? Math.random() * 2.5 + 1.2
        : (Math.random() * 1.2 + 0.3) * speedMult;

      const pSize = isBurst
        ? Math.random() * 3.2 + 1.2
        : Math.random() * 2.5 + 0.8;

      // Fiery magma & ember palette
      const rand = Math.random();
      let hue = 26; // Amber flame
      let lightness = 60;
      if (rand < 0.22) {
        hue = 14; // Deep magma crimson
        lightness = 55;
      } else if (rand < 0.6) {
        hue = 28; // Golden ember
        lightness = 62;
      } else if (rand < 0.85) {
        hue = 38; // Electric incandescent gold
        lightness = 68;
      } else {
        hue = 45; // White-hot spark
        lightness = 85;
      }

      return {
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.4,
        vy: Math.sin(angle) * speed - (Math.random() * 0.7 + 0.3), // Upward ember drift
        size: pSize,
        opacity: Math.random() * 0.35 + 0.65,
        decay: Math.random() * 0.02 + 0.015,
        hue,
        lightness
      };
    };

    const addParticlesAt = (x, y, count = 2, speedMult = 1, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        if (particles.length < maxParticles) {
          particles.push(createParticle(x, y, speedMult, isBurst));
        }
      }
    };

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!mouse.active) {
        mouse.x = x;
        mouse.y = y;
        mouse.lastX = x;
        mouse.lastY = y;
        mouse.active = true;
        addParticlesAt(x, y, 3);
        return;
      }

      const dx = x - mouse.lastX;
      const dy = y - mouse.lastY;
      const dist = Math.hypot(dx, dy);

      // Interpolate particles along cursor path to prevent gaps during fast movement
      const steps = Math.min(Math.max(Math.floor(dist / 8), 1), 6);
      for (let s = 1; s <= steps; s++) {
        const interpX = mouse.lastX + (dx * s) / steps;
        const interpY = mouse.lastY + (dy * s) / steps;
        addParticlesAt(interpX, interpY, 1, Math.min(dist * 0.04, 1.8));
      }

      mouse.lastX = x;
      mouse.lastY = y;
      mouse.x = x;
      mouse.y = y;
      mouse.active = true;
    };

    const handleMouseDown = (e) => {
      addParticlesAt(e.clientX, e.clientY, 8, 1.5, true);
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMouseMove(e.touches[0]);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.active = true;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
        addParticlesAt(mouse.x, mouse.y, 6, 1.2, true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient spark emission when cursor is stationary and active
      frameCount++;
      if (mouse.active && frameCount % 6 === 0 && particles.length < maxParticles) {
        addParticlesAt(mouse.x, mouse.y, 1, 0.4);
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.015; // Upward convection
        p.vx *= 0.98; // Friction
        p.size *= 0.985; // Gradual shrinking
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.size, 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, ${p.lightness}%, ${p.opacity})`;
        ctx.shadowBlur = p.size * 3.5;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, ${Math.min(p.opacity * 1.2, 1)})`;
        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9998
      }}
    />
  );
}
