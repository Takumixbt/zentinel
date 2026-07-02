import { useEffect, useRef } from "react";

const GLYPHS = "·∘○◯◌●";

export function FooterField({ className }: { className?: string }) {
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

    function draw(now: number) {
      if (!visible || now - lastFrame < 50) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const { width, height } = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, width, height);
      ctx!.font = '14px "Geist Mono", monospace';
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      const cols = Math.floor(width / 20);
      const rows = Math.floor(height / 20);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col + 0.5) * (width / cols);
          const y = (row + 0.5) * (height / rows);
          const noise =
            (Math.sin(0.2 * col + 2 * l) * Math.cos(0.15 * row + l) +
              Math.sin((col + row) * 0.1 + 1.5 * l) +
              Math.cos(0.1 * col - 0.1 * row + 0.8 * l)) /
            3;
          const n = (noise + 1) / 2;
          const glyphIdx = Math.floor(n * (GLYPHS.length - 1));
          const opacity = 0.12 + 0.4 * n;
          ctx!.fillStyle = `rgba(234, 179, 8, ${opacity})`;
          ctx!.fillText(GLYPHS[glyphIdx], x, y);
        }
      }

      l += 0.03;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
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
