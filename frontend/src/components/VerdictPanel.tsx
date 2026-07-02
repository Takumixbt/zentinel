import { ShieldCheck, ShieldAlert, Lock, ScanEye } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface Props {
  computedDone: boolean;
  verdict: boolean | null;
  canReveal: boolean;
  revealing: boolean;
  requiredRatio?: number;
  onReveal: () => void;
}

export function VerdictPanel({
  computedDone,
  verdict,
  canReveal,
  revealing,
  requiredRatio,
  onReveal,
}: Props) {
  const revealed = verdict !== null;
  const safe = verdict === true;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 transition-all duration-500',
        !revealed && 'border-hairline bg-surface-inset/50',
        revealed && safe && 'border-safe/40 bg-safe/[0.07] shadow-glow-safe',
        revealed && !safe && 'border-danger/40 bg-danger/[0.07] shadow-glow-danger',
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-content-muted">
          Public verdict
        </div>
        <div className="text-[0.68rem] text-content-dim">
          collateral × 100 ≥ debt × {requiredRatio ?? '—'}
        </div>
      </div>

      {!revealed ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-surface text-content-dim">
            <Lock className="h-6 w-6" />
          </div>
          <div className="cipher-shimmer font-mono text-xl font-semibold blur-[5px]">
            ██████
          </div>
          <p className="mt-3 max-w-xs text-sm text-content-muted">
            {computedDone
              ? 'Verdict computed on-chain and marked publicly decryptable. Reveal the yes/no answer below.'
              : 'The verdict is sealed until it has been computed on the encrypted position.'}
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={onReveal}
            loading={revealing}
            disabled={!canReveal}
          >
            <ScanEye className="h-4 w-4" />
            {revealing ? 'Decrypting…' : 'Reveal verdict'}
          </Button>
        </div>
      ) : (
        <div className="animate-pop-in flex flex-col items-center py-3 text-center">
          <div
            className={cn(
              'mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border',
              safe
                ? 'border-safe/40 bg-safe/15 text-safe'
                : 'border-danger/40 bg-danger/15 text-danger',
            )}
          >
            {safe ? (
              <ShieldCheck className="h-8 w-8" />
            ) : (
              <ShieldAlert className="h-8 w-8" />
            )}
          </div>
          <div
            className={cn(
              'font-display text-3xl font-bold tracking-tight',
              safe ? 'text-safe' : 'text-danger',
            )}
          >
            {safe ? 'SAFE' : 'UNSAFE'}
          </div>
          <p className="mt-2 max-w-xs text-sm text-content-muted">
            {safe
              ? 'This position meets the required collateralization ratio — provably, without exposing the underlying figures.'
              : 'This position is below the required collateralization ratio. Only this verdict is public; the amounts stay sealed.'}
          </p>
        </div>
      )}
    </div>
  );
}
