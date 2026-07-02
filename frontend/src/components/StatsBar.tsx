import { useEffect, useRef, useState } from "react";

type Stat = { value: number; prefix?: string; suffix?: string; label: string; decimals?: number };

const STATS: Stat[] = [
  { value: 150, suffix: "%", label: "Required ratio, enforced on ciphertext" },
  { value: 6, suffix: " / 6", label: "Contract tests passing, Sepolia + local" },
  { value: 15, prefix: "~", suffix: "–20s", label: "Verdict decryption via Zama KMS" },
  { value: 0, label: "Plaintext figures that ever leave your browser" },
];

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return value;
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
  const value = useCountUp(stat.value, active);

  return (
    <div ref={ref} className="bg-canvas p-8 lg:p-12">
      <div className="font-display text-5xl tracking-tight text-content lg:text-6xl">
        {stat.prefix}
        {value.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-content-muted">{stat.label}</div>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="relative border-y border-hairline py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 flex items-center gap-3 text-sm font-mono text-content-muted">
          <span className="h-px w-8 bg-content/30" />
          Built on a real, verified stack
        </div>
        <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCell key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
