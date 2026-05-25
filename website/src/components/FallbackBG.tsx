import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export function FallbackBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = 45;
    const connectionDist = 120;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.15,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Black background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle dynamic glowing orbs in 2D
      const time = Date.now() * 0.0004;
      
      const orb1X = canvas.width * 0.25 + Math.sin(time) * 80;
      const orb1Y = canvas.height * 0.35 + Math.cos(time) * 80;
      const orb1Grad = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 250);
      orb1Grad.addColorStop(0, 'rgba(0, 212, 255, 0.06)');
      orb1Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orb1Grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const orb2X = canvas.width * 0.75 + Math.cos(time * 0.8) * 80;
      const orb2Y = canvas.height * 0.65 + Math.sin(time * 0.8) * 80;
      const orb2Grad = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 250);
      orb2Grad.addColorStop(0, 'rgba(124, 58, 237, 0.05)');
      orb2Grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orb2Grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles & connect lines
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap or bounce around edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Push away from mouse
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();

        // Connect lines between nearby nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < connectionDist) {
            const alpha = (1 - cdist / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 block pointer-events-none" />;
}
