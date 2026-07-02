import { Eye, KeyRound } from 'lucide-react';
import { VaultCard } from './VaultCard';
import { VerdictPanel } from './VerdictPanel';
import { Button } from './ui/button';
import type { useZentinel } from '@/hooks/useZentinel';

type Z = ReturnType<typeof useZentinel>;

export function ConfidentialVault({ z }: { z: Z }) {
  const {
    address,
    submittedDone,
    computedDone,
    verdict,
    plain,
    phase,
    requiredRatio,
    revealVerdict,
    revealMyPosition,
  } = z;

  const posRevealed = plain.collateral !== undefined || plain.debt !== undefined;
  const seed = address ?? 'zentinel';

  return (
    <div className="panel p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">
            The confidential vault
          </h2>
          <p className="text-sm text-content-muted">
            Sealed by default. Only you can open the figures; anyone can read the verdict.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <VaultCard
          label="Collateral"
          hint="euint64 · private to you"
          value={plain.collateral ?? null}
          revealed={plain.collateral !== undefined}
          seed={seed + '-c'}
        />
        <VaultCard
          label="Debt"
          hint="euint64 · private to you"
          value={plain.debt ?? null}
          revealed={plain.debt !== undefined}
          seed={seed + '-d'}
        />
      </div>

      {submittedDone && !posRevealed && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-inset/50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-content-muted">
            <KeyRound className="h-4 w-4 text-brand" />
            These figures are encrypted on-chain. Decrypt them privately with your key.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={revealMyPosition}
            loading={phase === 'decrypting'}
          >
            <Eye className="h-4 w-4" />
            Decrypt (only you)
          </Button>
        </div>
      )}

      <div className="my-4 hairline-divider" />

      <VerdictPanel
        computedDone={computedDone}
        verdict={verdict}
        canReveal={computedDone && phase === 'idle'}
        revealing={phase === 'revealing'}
        requiredRatio={requiredRatio}
        onReveal={revealVerdict}
      />
    </div>
  );
}
