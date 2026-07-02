import { Check, Wallet, Lock, Cpu, ScanEye } from 'lucide-react';
import type { StepState } from '@/hooks/useZentinel';
import { cn } from '@/lib/utils';

interface StepDef {
  key: string;
  label: string;
  hint: string;
  icon: typeof Wallet;
}

const STEPS: StepDef[] = [
  { key: 'connect', label: 'Connect', hint: 'Wallet + FHE runtime', icon: Wallet },
  { key: 'submit', label: 'Encrypt & Submit', hint: 'Ciphertext on-chain', icon: Lock },
  { key: 'compute', label: 'Compute Verdict', hint: 'Homomorphic check', icon: Cpu },
  { key: 'reveal', label: 'Reveal Verdict', hint: 'Public decryption', icon: ScanEye },
];

export function Stepper({
  states,
}: {
  states: Record<string, StepState>;
}) {
  return (
    <div className="panel p-2 sm:p-3">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((step, i) => {
          const state = states[step.key] ?? 'idle';
          const Icon = step.icon;
          const done = state === 'done';
          const active = state === 'active';
          return (
            <li
              key={step.key}
              className={cn(
                'relative flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors duration-300',
                done && 'border-safe/30 bg-safe/[0.06]',
                active && 'border-brand/45 bg-brand/[0.07]',
                !done && !active && 'border-hairline bg-surface-inset/50',
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-all duration-300',
                  done && 'border-safe/40 bg-safe/15 text-safe',
                  active && 'border-brand/50 bg-brand/15 text-brand animate-pulse-ring',
                  !done && !active && 'border-hairline text-content-dim',
                )}
              >
                {done ? <Check className="h-[18px] w-[18px]" /> : <Icon className="h-[18px] w-[18px]" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[0.62rem] font-mono text-content-dim">
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      'truncate text-sm font-medium',
                      done ? 'text-safe' : active ? 'text-white' : 'text-content-muted',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                <div className="truncate text-[0.72rem] text-content-dim">{step.hint}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
