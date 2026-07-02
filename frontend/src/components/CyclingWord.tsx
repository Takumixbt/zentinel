import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["position", "balance", "leverage", "debt"];

export function CyclingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const cycle = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 2500);

    return () => clearInterval(cycle);
  }, []);

  return (
    <span key={index} className={cn("inline-block animate-fade-up border-b-4 border-brand text-content")}>
      {WORDS[index]}
    </span>
  );
}
