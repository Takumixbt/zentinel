import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const WORDS = ['position', 'balance', 'leverage', 'debt'];

export function CyclingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const cycle = setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 220);
    }, 2000);

    return () => clearInterval(cycle);
  }, []);

  return (
    <span
      key={index}
      className={cn(
        'inline-block border-b-2 border-brand/50 bg-gradient-to-r from-brand-soft via-brand to-safe bg-clip-text text-transparent',
        visible ? 'animate-fade-up' : 'opacity-0 transition-opacity duration-200',
      )}
    >
      {WORDS[index]}
    </span>
  );
}
