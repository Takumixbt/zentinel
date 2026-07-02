import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline/70 bg-canvas/90 backdrop-blur-xl">
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
        <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
      </div>
    </header>
  );
}
