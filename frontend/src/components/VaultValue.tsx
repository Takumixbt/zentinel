import { useEffect, useRef, useState } from "react";
import { fauxCipher, groupNumber } from "@/lib/utils";

/** Count-up for values inside the safe-integer range; instant otherwise. */
function useCountUp(target: bigint | null, active: boolean) {
  const [display, setDisplay] = useState<string>("");
  const raf = useRef<number>();

  useEffect(() => {
    if (target === null || !active) return;
    if (raf.current) cancelAnimationFrame(raf.current);

    if (target > BigInt(Number.MAX_SAFE_INTEGER)) {
      setDisplay(groupNumber(target));
      return;
    }
    const end = Number(target);
    const duration = 750;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(groupNumber(Math.round(end * eased)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, active]);

  return display;
}

export function VaultValue({
  revealed,
  value,
  seed,
  unit,
  tone = "brand",
}: {
  revealed: boolean;
  value: bigint | null;
  seed: string;
  unit?: string;
  tone?: "brand" | "safe";
}) {
  const counted = useCountUp(value, revealed);
  const toneText = tone === "safe" ? "text-safe" : "text-content";

  if (!revealed || value === null) {
    return (
      <div className="relative select-none" aria-hidden>
        <div className="cipher-shimmer break-all font-mono text-2xl font-medium leading-tight blur-[6px]">
          {fauxCipher(seed, 12)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-unlock-blur">
      <div className="flex items-baseline gap-1.5">
        <span className={`tabular font-mono text-3xl font-semibold leading-none ${toneText}`}>
          {counted || groupNumber(value)}
        </span>
        {unit && <span className="text-sm font-medium text-content-dim">{unit}</span>}
      </div>
    </div>
  );
}
