import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ShieldCheck } from 'lucide-react';
import { useFhevm } from '@/providers/FhevmProvider';
import { cn } from '@/lib/utils';

function FhevmBadge() {
  const { status } = useFhevm();
  const map = {
    idle: { label: 'FHE runtime', dot: 'bg-content-dim', pulse: false },
    loading: { label: 'Loading FHE runtime', dot: 'bg-brand', pulse: true },
    ready: { label: 'FHE runtime ready', dot: 'bg-safe', pulse: false },
    error: { label: 'FHE runtime error', dot: 'bg-danger', pulse: false },
  }[status];
  return (
    <div className="hidden items-center gap-2 rounded-full border border-hairline bg-surface/70 px-3 py-1.5 text-xs text-content-muted sm:flex">
      <span className="relative flex h-2 w-2">
        {map.pulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', map.dot)} />
      </span>
      {map.label}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline/70 bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-brand/40 bg-brand/10">
            <ShieldCheck className="h-5 w-5 text-brand" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[1.05rem] font-semibold tracking-tight text-white">
              Zentinel
            </div>
            <div className="text-[0.68rem] uppercase tracking-[0.22em] text-content-dim">
              Confidential risk gate
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FhevmBadge />
          <ConnectButton
            showBalance={false}
            accountStatus="address"
            chainStatus="icon"
          />
        </div>
      </div>
    </header>
  );
}
