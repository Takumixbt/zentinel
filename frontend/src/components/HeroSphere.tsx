import { useEffect, useRef } from "react";

const GLYPHS = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";

export function HeroSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastFrame = 0;
    let l = 0;
    let visible = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    type Point = { x: number; y: number; z: number; char: string };

    function draw(now: number) {
      if (!visible || now - lastFrame < 33) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const { width, height } = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const radius = 0.525 * Math.min(width, height);
      ctx!.font = '12px "Geist Mono", monospace';
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      const points: Point[] = [];
      for (let theta = 0; theta < 2 * Math.PI; theta += 0.22) {
        for (let phi = 0; phi < Math.PI; phi += 0.22) {
          const x = Math.sin(phi) * Math.cos(theta + 0.5 * l);
          const y = Math.sin(phi) * Math.sin(theta + 0.5 * l);
          const z = Math.cos(phi);

          const rz1 = 0.3 * l;
          const x2 = x * Math.cos(rz1) - z * Math.sin(rz1);
          const z2 = x * Math.sin(rz1) + z * Math.cos(rz1);

          const rz2 = 0.2 * l;
          const y2 = y * Math.cos(rz2) - z2 * Math.sin(rz2);
          const z3 = y * Math.sin(rz2) + z2 * Math.cos(rz2);

          const glyphIdx = Math.floor(((z3 + 1) / 2) * (GLYPHS.length - 1));
          points.push({ x: cx + x2 * radius, y: cy + y2 * radius, z: z3, char: GLYPHS[glyphIdx] });
        }
      }
      points.sort((a, b) => a.z - b.z);
      for (const p of points) {
        const opacity = 0.15 + (p.z + 1) * 0.32;
        ctx!.fillStyle = `rgba(234, 179, 8, ${opacity})`;
        ctx!.fillText(p.char, p.x, p.y);
      }

      l += 0.02;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    io.observe(canvas);

    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", willChange: "transform" }}
    />
  );
}
