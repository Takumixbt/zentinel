import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["position", "leverage", "debt"];
const GLYPHS = "01#$%&*+=~<>[]{}?!/\\";

const INITIAL_HOLD_MS = 1100;
const HOLD_MS = 2400;
const RAVEL_MS = 300;
const UNRAVEL_MS = 750;

type Phase = "idle" | "raveling" | "unraveling";

function randGlyph() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

function scramble(text: string) {
  return text
    .split("")
    .map((c) => (c === " " ? c : randGlyph()))
    .join("");
}

interface ChunkProps {
  text: string;
  phase: Phase;
  chunkDelay?: number;
  className?: string;
}

function RavelChunk({ text, phase, chunkDelay = 0, className }: ChunkProps) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number>();

  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);

    if (phase === "idle") {
      setDisplay(text);
      return;
    }

    const chars = text.split("");
    const duration = phase === "raveling" ? RAVEL_MS : UNRAVEL_MS;
    const start = performance.now() + chunkDelay;

    const step = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      const progress = Math.min(1, elapsed / duration);

      let next: string;
      if (phase === "raveling") {
        // real text tangles into noise as progress climbs
        next = chars.map((c) => (c === " " ? " " : Math.random() < progress ? randGlyph() : c)).join("");
      } else {
        // noise untangles back into real text, left to right
        const resolved = Math.floor(progress * chars.length);
        next = chars.map((c, i) => (c === " " ? " " : i < resolved ? c : randGlyph())).join("");
      }
      setDisplay(next);

      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setDisplay(phase === "raveling" ? scramble(text) : text);
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [phase, text, chunkDelay]);

  return <span className={className}>{display}</span>;
}

export function RavelHeadline({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setPhase("raveling");
      timers.push(
        setTimeout(() => {
          setIndex((i) => (i + 1) % WORDS.length);
          setPhase("unraveling");
          timers.push(setTimeout(() => setPhase("idle"), UNRAVEL_MS));
        }, RAVEL_MS),
      );
    };

    const first = setTimeout(run, INITIAL_HOLD_MS);
    const interval = setInterval(run, INITIAL_HOLD_MS + RAVEL_MS + UNRAVEL_MS + HOLD_MS);
    timers.push(first);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <h1 className={cn("font-display text-content", className)}>
      <span>Prove you&rsquo;re safe</span>
      <br />
      <span>without revealing your </span>
      <RavelChunk text={WORDS[index]} phase={phase} chunkDelay={0} />
      <span>.</span>
    </h1>
  );
}
