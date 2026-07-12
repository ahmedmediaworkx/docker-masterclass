import React, { useEffect, useRef } from 'react';

export const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    // Define glowing bio-luminescent sea organisms & bubbles
    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      wobbleSpeed: number;
      wobbleRange: number;
      opacity: number;
      color: string;
      isPlankton: boolean;
      life: number;
      maxLife: number;
      pulseRate: number;
    }[] = [];

    // Interactive underwater currents / ripples
    const ripples: {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      force: number;
    }[] = [];

    const maxParticles = 65;
    const mouse = { x: -1000, y: -1000, active: false };

    // Resize handler for fixed full screen canvas
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse interactive currents
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Create micro liquid vortexes occasionally
      if (Math.random() < 0.22 && ripples.length < 25) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 4,
          maxRadius: Math.random() * 50 + 25,
          opacity: 0.5,
          force: 1.2
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Pressure wave on click
    const handleCanvasClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.random() * 150 + 100,
        opacity: 0.85,
        force: 4.5
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleCanvasClick);

    // Generate a beautiful marine bubble or a glowing plankton particle
    const createMarineParticle = (isInitial = false) => {
      const isPlankton = Math.random() < 0.45; // 45% bio-luminescent plankton
      const size = isPlankton ? Math.random() * 2.5 + 1 : Math.random() * 4.5 + 1.5;
      
      const colors = isPlankton 
        ? [
            'rgba(0, 240, 255, 0.75)', // Bio electric cyan
            'rgba(56, 189, 248, 0.75)', // Light sky sea blue
            'rgba(16, 185, 129, 0.65)', // Bio-luminescent green-teal
            'rgba(255, 255, 255, 0.8)' // Pure radiant white
          ]
        : [
            'rgba(0, 210, 255, 0.45)', // Aqua blue
            'rgba(36, 150, 237, 0.4)', // Docker marine
            'rgba(255, 255, 255, 0.35)' // Translucent sea foam
          ];

      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + Math.random() * 50 + 10,
        size,
        speedY: isPlankton ? -(Math.random() * 0.4 + 0.15) : -(Math.random() * 0.8 + 0.35),
        speedX: (Math.random() * 0.4 - 0.2),
        wobbleSpeed: Math.random() * 0.03 + 0.008,
        wobbleRange: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.55 + 0.15,
        color,
        isPlankton,
        life: 0,
        maxLife: Math.random() * 500 + 350,
        pulseRate: Math.random() * 0.04 + 0.01
      };
    };

    // Initialize bio particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createMarineParticle(true));
    }

    // Main 60-FPS loop
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // --- 1. Draw Deep-Sea Ambient Caustics (Underwater Sunbeams) ---
      const shaftsCount = 6;
      for (let i = 0; i < shaftsCount; i++) {
        // Slow oscillation of angles for underwater breathing effect
        const baseAngle = (i * Math.PI) / 6 + Math.PI / 8;
        const angle = baseAngle + Math.sin(time * 0.003 + i * 2) * 0.05;
        const startX = (i * width) / (shaftsCount - 1);
        const length = height * 1.6;
        const endX = startX + Math.sin(angle) * length;
        const endY = Math.cos(angle) * length;

        // Create volumetric water gradient
        const grad = ctx.createLinearGradient(startX, 0, endX, endY);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.065)');
        grad.addColorStop(0.4, 'rgba(36, 150, 237, 0.025)');
        grad.addColorStop(0.8, 'rgba(1, 9, 21, 0)');

        ctx.beginPath();
        // Make caustics beam sway organically
        const beamWidth = 60 + Math.sin(time * 0.008 + i) * 20;
        ctx.moveTo(startX - beamWidth, 0);
        ctx.lineTo(startX + beamWidth, 0);
        ctx.lineTo(endX + beamWidth * 2.2, endY);
        ctx.lineTo(endX - beamWidth * 2.2, endY);
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();
      }

      // --- 2. Draw Multi-Layered Liquid Waves (Parallax Currents) ---
      // Wave layer 1: Deep Oceanic Trench Current (Deepest navy)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 30) {
        const y = height - 120 + Math.sin(x * 0.002 + time * 0.006) * 45 + Math.cos(x * 0.004 + time * 0.004) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(1, 15, 30, 0.15)';
      ctx.fill();

      // Wave layer 2: Mid-depth Abyssal flow (Marine Teal)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 40) {
        const y = height - 80 + Math.sin(x * 0.003 - time * 0.009) * 30 + Math.sin(x * 0.006 + time * 0.005) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 210, 255, 0.055)';
      ctx.fill();

      // Wave layer 3: Faint bioluminescent surface current (Electric turquoise)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 25) {
        const y = height - 40 + Math.sin(x * 0.004 + time * 0.015) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(36, 150, 237, 0.03)';
      ctx.fill();

      // --- 3. Draw Pressure Waves & Disturbance Currents ---
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.045;
        r.opacity -= 0.009;

        if (r.opacity <= 0 || r.radius >= r.maxRadius - 1) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${r.opacity * 0.28})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Echo ripples for dynamic water impact
        if (r.radius > 25) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius - 20, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(36, 150, 237, ${r.opacity * 0.14})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // --- 4. Draw Floating Plankton & Marine Bubbles ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // Upward drift + horizontal sine sway + dynamic mouse flow
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.life * p.wobbleSpeed) * p.wobbleRange * 0.2;

        // Parallax depth: smaller elements drift slower
        const depthFactor = p.size / 4.5;
        p.y += p.speedY * (depthFactor * 0.4);

        // Repulsive physical currents from mouse cursor
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            // Float organisms away gently
            p.x -= (dx / dist) * force * 2.4;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        // Repulsive currents from active pressure ripples
        for (const rip of ripples) {
          const rdx = rip.x - p.x;
          const rdy = rip.y - p.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          // If particle inside expanding ripple wave
          if (rdist > rip.radius - 25 && rdist < rip.radius + 25) {
            const pushForce = (1 - rdist / rip.maxRadius) * rip.force;
            p.x -= (rdx / rdist) * pushForce * 3.2;
            p.y -= (rdy / rdist) * pushForce * 2.2;
          }
        }

        // Calculate opacity with lifecycle fades & top-surface dissolve
        const ageFade = 1 - p.life / p.maxLife;
        const topFade = p.y < 150 ? p.y / 150 : 1;
        const currentOpacity = Math.max(0, p.opacity * ageFade * topFade);

        if (p.isPlankton) {
          // --- Bio-luminescent Plankton Renderer ---
          // Glowing pulsing aura
          const pulse = 0.85 + Math.sin(time * p.pulseRate) * 0.15;
          const glowRadius = p.size * 3.5 * pulse;
          
          const radGrad = ctx.createRadialGradient(p.x, p.y, p.size * 0.3, p.x, p.y, glowRadius);
          radGrad.addColorStop(0, p.color);
          radGrad.addColorStop(0.3, p.color.replace('0.75', '0.25').replace('0.8', '0.3').replace('0.65', '0.2'));
          radGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = radGrad;
          ctx.globalAlpha = currentOpacity * 0.95;
          ctx.fill();

          // Bright bioluminescent core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = currentOpacity * 1.0;
          ctx.fill();
        } else {
          // --- Real-3D Water Bubble Renderer ---
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.85;
          ctx.globalAlpha = currentOpacity * 0.72;
          ctx.stroke();

          // High-sheen glossy bubble reflection highlight dot
          if (p.size > 2.8) {
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.35, p.y - p.size * 0.35, p.size * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = currentOpacity * 0.92;
            ctx.fill();
          }
        }

        // Recycle bubble / plankton when it dies or floats away
        if (p.life >= p.maxLife || p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[i] = createMarineParticle(false);
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="marine-liquid-particle-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-70"
    />
  );
};
