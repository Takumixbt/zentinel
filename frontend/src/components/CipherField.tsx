import { useEffect, useRef } from 'react';

const GLYPHS = ['0', '1', '{', '}', '<', '>', '/', '\\', '^', 'T', 'λ', 'Σ', 'β', '◇', '·', ':', '¬', '⊕'];

type Particle = {
  x: number;
  y: number;
  glyph: string;
  phase: number;
  speed: number;
  size: number;
};

export function CipherField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let t = 0;

    function seed() {
      const count = Math.min(220, Math.floor((width * height) / 3400));
      // Density is biased into a loose ring around a focal point, echoing an
      // ambient "encrypted field" rather than a uniform scatter.
      const focusX = width * 0.72;
      const focusY = height * 0.36;
      const maxR = Math.max(width, height) * 0.62;
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.55) * maxR;
        const x = focusX + Math.cos(angle) * r + (Math.random() - 0.5) * width * 0.35;
        const y = focusY + Math.sin(angle) * r * 0.72 + (Math.random() - 0.5) * height * 0.35;
        return {
          x: Math.max(0, Math.min(width, x)),
          y: Math.max(0, Math.min(height, y)),
          glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          phase: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.45,
          size: 9 + Math.random() * 9,
        };
      });
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      t += 0.008;
      for (const p of particles) {
        const opacity = 0.07 + 0.15 * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase));
        ctx!.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx!.fillStyle = `rgba(148, 197, 214, ${opacity})`;
        ctx!.fillText(p.glyph, p.x, p.y + Math.sin(t * 0.6 + p.phase) * 6);
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
