import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  AlertTriangle,
  Cpu,
  Lock,
  RotateCcw,
  Wallet,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';
import { ActivityLog } from './ActivityLog';
import { useFhevm } from '@/providers/FhevmProvider';
import type { useZentinel } from '@/hooks/useZentinel';
import { cn } from '@/lib/utils';

type Z = ReturnType<typeof useZentinel>;

function AmountField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-content-muted">
        {label}
      </span>
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-surface-inset/70 px-3.5 transition-colors',
          disabled ? 'border-hairline opacity-60' : 'border-hairline-strong focus-within:border-brand/60',
        )}
      >
        <input
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="0"
          className="h-12 w-full bg-transparent font-mono text-lg text-white outline-none placeholder:text-content-dim"
        />
        <span className="text-xs font-medium text-content-dim">units</span>
      </div>
    </label>
  );
}

export function ControlConsole({ z }: { z: Z }) {
  const { status: fhevmStatus, error: fhevmError, retry } = useFhevm();
  const {
    isConnected,
    correctChain,
    ready,
    submittedDone,
    computedDone,
    verdict,
    collateral,
    setCollateral,
    debt,
    setDebt,
    requiredRatio,
    phase,
    errorMsg,
    log,
    encryptAndSubmit,
    computeVerdict,
    startOver,
  } = z;

  // Local, never-transmitted preview of what the verdict will be.
  let preview: boolean | null = null;
  try {
    const c = BigInt(collateral || '0');
    const d = BigInt(debt || '0');
    if (requiredRatio !== undefined && c > 0n) {
      preview = c * 100n >= d * BigInt(requiredRatio);
    }
  } catch {
    preview = null;
  }

  const busy = phase !== 'idle';

  return (
    <div className="panel flex flex-col p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-white">Control console</h2>
        <p className="text-sm text-content-muted">
          Drive the real Sepolia contract, one encrypted step at a time.
        </p>
      </div>

      {/* --- gate: connect / chain / runtime -------------------------------- */}
      {!isConnected ? (
        <Gate
          icon={Wallet}
          title="Connect a wallet"
          body="Connect to Sepolia to submit an encrypted position."
        >
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button onClick={openConnectModal}>
                <Wallet className="h-4 w-4" />
                Connect wallet
              </Button>
            )}
          </ConnectButton.Custom>
        </Gate>
      ) : !correctChain ? (
        <Gate
          icon={AlertTriangle}
          tone="danger"
          title="Wrong network"
          body="Zentinel is deployed on Sepolia. Switch networks to continue."
        >
          <ConnectButton.Custom>
            {({ openChainModal }) => (
              <Button variant="outline" onClick={openChainModal}>
                Switch to Sepolia
              </Button>
            )}
          </ConnectButton.Custom>
        </Gate>
      ) : fhevmStatus === 'error' ? (
        <Gate
          icon={AlertTriangle}
          tone="danger"
          title="FHE runtime failed to load"
          body={fhevmError ?? 'The Zama relayer SDK could not initialize.'}
        >
          <Button variant="outline" onClick={retry}>
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </Gate>
      ) : !ready ? (
        <Gate icon={Loader2} spin title="Initializing FHE runtime" body="Loading TFHE + KMS WASM. This runs once.">
          <div />
        </Gate>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Stage 1: enter + submit */}
          {!submittedDone && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <AmountField label="Collateral" value={collateral} onChange={setCollateral} disabled={busy} />
                <AmountField label="Debt" value={debt} onChange={setDebt} disabled={busy} />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-hairline bg-surface-inset/50 px-3.5 py-2.5 text-xs">
                <span className="text-content-muted">
                  Required ratio <span className="font-mono text-brand">{requiredRatio ?? '—'}%</span>
                </span>
                {preview !== null && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 font-medium',
                      preview ? 'text-safe' : 'text-danger',
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        preview ? 'bg-safe' : 'bg-danger',
                      )}
                    />
                    local preview: {preview ? 'safe' : 'unsafe'}
                    <span className="text-content-dim">· never sent</span>
                  </span>
                )}
              </div>

              <Button
                size="lg"
                onClick={encryptAndSubmit}
                loading={phase === 'encrypting' || phase === 'submitting'}
              >
                <Lock className="h-4 w-4" />
                {phase === 'encrypting'
                  ? 'Encrypting client-side…'
                  : phase === 'submitting'
                    ? 'Waiting for confirmation…'
                    : 'Encrypt & submit position'}
              </Button>
            </>
          )}

          {/* Stage 2: compute */}
          {submittedDone && !computedDone && (
            <>
              <Recap label="Position submitted" body="Your encrypted collateral and debt are stored on-chain." />
              <Button size="lg" onClick={computeVerdict} loading={phase === 'computing'}>
                <Cpu className="h-4 w-4" />
                {phase === 'computing' ? 'Computing on ciphertext…' : 'Compute verdict'}
              </Button>
              <Button variant="ghost" size="sm" onClick={startOver} disabled={busy}>
                <RotateCcw className="h-3.5 w-3.5" />
                Start a new position
              </Button>
            </>
          )}

          {/* Stage 3/4: computed — reveal happens in the vault panel */}
          {computedDone && (
            <>
              <Recap
                label={verdict === null ? 'Verdict ready to reveal' : 'Flow complete'}
                body={
                  verdict === null
                    ? 'Reveal the public verdict in the vault on the left.'
                    : 'The verdict has been publicly decrypted. Your figures stayed private.'
                }
                done={verdict !== null}
              />
              <Button variant="ghost" size="sm" onClick={startOver} disabled={busy}>
                <RotateCcw className="h-3.5 w-3.5" />
                Start a new position
              </Button>
            </>
          )}

          {errorMsg && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/[0.07] px-3.5 py-2.5 text-sm text-danger">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <ActivityLog items={log} />
      </div>
    </div>
  );
}

function Gate({
  icon: Icon,
  title,
  body,
  children,
  tone = 'brand',
  spin,
}: {
  icon: typeof Wallet;
  title: string;
  body: string;
  children: React.ReactNode;
  tone?: 'brand' | 'danger';
  spin?: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-hairline bg-surface-inset/50 px-5 py-8 text-center">
      <div
        className={cn(
          'mb-3 flex h-12 w-12 items-center justify-center rounded-xl border',
          tone === 'danger'
            ? 'border-danger/40 bg-danger/10 text-danger'
            : 'border-brand/40 bg-brand/10 text-brand',
        )}
      >
        <Icon className={cn('h-6 w-6', spin && 'animate-spin')} />
      </div>
      <div className="font-display text-base font-semibold text-white">{title}</div>
      <p className="mb-4 mt-1 max-w-xs text-sm text-content-muted">{body}</p>
      {children}
    </div>
  );
}

function Recap({ label, body, done }: { label: string; body: string; done?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-inset/50 px-4 py-3">
      <CheckCircle2 className={cn('mt-0.5 h-4 w-4 shrink-0', done ? 'text-safe' : 'text-brand')} />
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-content-muted">{body}</div>
      </div>
    </div>
  );
}
