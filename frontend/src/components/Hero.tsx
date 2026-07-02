import { ArrowUpRight, Lock, Radio } from 'lucide-react';
import { ETHERSCAN_ADDRESS_URL, ZENTINEL_ADDRESS } from '@/lib/contract';
import { shortAddr } from '@/lib/utils';

export function Hero({ requiredRatio }: { requiredRatio?: number }) {
  return (
    <section className="relative pt-14 pb-10 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/60 px-3 py-1.5 text-xs text-content-muted">
          <Lock className="h-3.5 w-3.5 text-brand" />
          Encrypted end-to-end with Zama&rsquo;s FHEVM
        </div>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-[3.4rem]">
          Prove you&rsquo;re safely collateralized{' '}
          <span className="bg-gradient-to-r from-brand-soft via-brand to-safe bg-clip-text text-transparent">
            without revealing your position.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-content-muted">
          Zentinel is the private equivalent of a DeFi health-factor check. Your
          collateral and debt are encrypted in your browser, checked on-chain{' '}
          <span className="text-content">directly on the ciphertext</span>, and only the
          safe / unsafe verdict is ever made public. The raw numbers stay yours.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={ETHERSCAN_ADDRESS_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 px-3.5 py-2 text-xs text-content-muted transition-colors hover:border-brand/50 hover:text-white"
          >
            <Radio className="h-3.5 w-3.5 text-safe" />
            Live on Sepolia
            <span className="font-mono text-content">{shortAddr(ZENTINEL_ADDRESS, 5)}</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {requiredRatio !== undefined && (
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 px-3.5 py-2 text-xs text-content-muted">
              Required ratio
              <span className="font-mono font-semibold text-brand">{requiredRatio}%</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
