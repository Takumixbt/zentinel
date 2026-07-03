import { useEffect, useRef, useState } from "react";
import { FooterField } from "@/components/FooterField";
import { cn } from "@/lib/utils";

type Stat = { value: number; prefix?: string; suffix?: string; label: string };

const STATS: Stat[] = [
  { value: 150, suffix: "%", label: "Required ratio, enforced on ciphertext" },
  { value: 6, suffix: " / 6", label: "Contract tests passing, Sepolia + local" },
  { value: 15, prefix: "~", suffix: "–20s", label: "Verdict decryption via Zama KMS" },
  { value: 0, label: "Plaintext figures that ever leave your browser" },
];

function randomDigit() {
  return String(Math.floor(Math.random() * 10));
}

function useScrambleReveal(target: string, active: boolean, duration = 900) {
  const [display, setDisplay] = useState(() => target.replace(/[0-9]/g, randomDigit));

  useEffect(() => {
    if (!active) {
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(target);
      return;
    }

    const chars = target.split("");
    const digitPositions = chars.reduce<number[]>((acc, c, i) => {
      if (/[0-9]/.test(c)) acc.push(i);
      return acc;
    }, []);

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(progress * digitPositions.length);
      const next = chars.map((c, i) => {
        if (!/[0-9]/.test(c)) return c;
        return digitPositions.indexOf(i) < resolved ? c : randomDigit();
      });
      setDisplay(next.join(""));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return display;
}

function StatCell({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setActive(true), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const target = `${stat.prefix ?? ""}${stat.value}${stat.suffix ?? ""}`;
  const display = useScrambleReveal(target, active);

  return (
    <div ref={ref} className="relative bg-canvas p-8 lg:p-12">
      <div className="tabular font-display text-5xl tracking-tight text-content lg:text-6xl">{display}</div>
      <div className="mt-3 text-sm leading-relaxed text-content-muted">{stat.label}</div>
    </div>
  );
}

export function StatsBar() {
  return (
    <section id="protocol" className="relative scroll-mt-20 overflow-hidden border-y border-hairline py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <FooterField className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <div className="mb-10 flex items-center gap-3 text-sm font-mono text-content-muted">
          <span className="h-px w-8 bg-content/30" />
          Built on a real, verified stack
        </div>
        <div className={cn("grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4")}>
          {STATS.map((stat) => (
            <StatCell key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
