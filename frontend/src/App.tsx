import { Radio } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { StatsBar } from '@/components/StatsBar';
import { ProcessSection } from '@/components/ProcessSection';
import { TechStack } from '@/components/TechStack';
import { Stepper } from '@/components/Stepper';
import { ConfidentialVault } from '@/components/ConfidentialVault';
import { ControlConsole } from '@/components/ControlConsole';
import { Footer } from '@/components/Footer';
import { shortAddr } from '@/lib/utils';
import { ZENTINEL_ADDRESS } from '@/lib/contract';
import { useZentinel } from '@/hooks/useZentinel';

export default function App() {
  const z = useZentinel();

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        <StatsBar requiredRatio={z.requiredRatio} />

        <ProcessSection />

        {/* The live app — the payoff of the narrative. */}
        <section id="app" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-content-dim">
                  <span className="h-px w-6 bg-brand/50" />
                  The live app
                </div>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-[2.5rem]">
                  Run an encrypted risk check yourself.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-content-muted">
                  Connect a wallet on Sepolia and drive the real contract, one
                  encrypted step at a time — submit, compute, reveal.
                </p>
              </div>
              <a
                href={`https://sepolia.etherscan.io/address/${ZENTINEL_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-safe/30 bg-safe/[0.06] px-3.5 py-2 text-xs text-content-muted transition-colors hover:border-safe/60 hover:text-white sm:self-auto"
              >
                <Radio className="h-3.5 w-3.5 text-safe" />
                Live on Sepolia
                <span className="font-mono text-content">
                  {shortAddr(ZENTINEL_ADDRESS, 5)}
                </span>
              </a>
            </div>

            <div className="mt-8">
              <Stepper states={z.steps} />

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                {/* Controls first on mobile so the user can act; vault (payoff) second. */}
                <div className="order-2 lg:order-1">
                  <ConfidentialVault z={z} />
                </div>
                <div className="order-1 lg:order-2">
                  <ControlConsole z={z} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <TechStack />
      </main>
      <Footer />
    </div>
  );
}
