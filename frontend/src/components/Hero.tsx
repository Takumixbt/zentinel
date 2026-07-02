import { ArrowUpRight, Github, Lock } from 'lucide-react';
import { GITHUB_URL } from '@/lib/contract';
import { CipherField } from '@/components/CipherField';
import { CyclingWord } from '@/components/CyclingWord';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20">
      <CipherField className="pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <div className="mx-auto max-w-6xl px-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/60 px-3 py-1.5 text-xs text-content-muted">
          <Lock className="h-3.5 w-3.5 text-brand" />
          Encrypted end-to-end with Zama&rsquo;s FHEVM
        </div>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-[3.4rem]">
          Prove you&rsquo;re safely collateralized{' '}
          <span className="bg-gradient-to-r from-brand-soft via-brand to-safe bg-clip-text text-transparent">
            without revealing your
          </span>{' '}
          <CyclingWord />
          .
        </h1>

        <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-content-muted">
          Zentinel is the private equivalent of a DeFi health-factor check. Your
          collateral and debt are encrypted in your browser, checked on-chain{' '}
          <span className="text-content">directly on the ciphertext</span>, and only the
          safe / unsafe verdict is ever made public. The raw numbers stay yours.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#app"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-[#04121a] shadow-[0_8px_30px_-10px_rgba(34,211,238,0.7)] transition-all hover:-translate-y-px hover:bg-brand-soft"
          >
            Launch the app
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline-strong bg-surface-raised/60 px-5 text-sm font-medium text-content transition-colors hover:border-brand/60 hover:text-white"
          >
            <Github className="h-4 w-4" />
            View the source
          </a>
        </div>
      </div>
    </section>
  );
}
