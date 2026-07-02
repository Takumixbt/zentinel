import { ArrowUpRight, Github } from "lucide-react";
import { GITHUB_URL } from "@/lib/contract";
import { HeroSphere } from "@/components/HeroSphere";
import { GridOverlay } from "@/components/GridOverlay";
import { CyclingWord } from "@/components/CyclingWord";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col overflow-hidden pt-36 sm:min-h-[90vh] sm:pt-44">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[420px] w-[420px] -translate-y-1/2 opacity-60 sm:h-[600px] sm:w-[600px] lg:h-[800px] lg:w-[800px]">
        <HeroSphere className="h-full w-full" />
      </div>
      <GridOverlay />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
        <div className="mb-8 flex items-center gap-3 text-sm font-mono text-content-muted">
          <span className="h-px w-8 bg-content/30" />
          Confidential collateralization, encrypted end-to-end on Zama&rsquo;s FHEVM
        </div>

        <h1 className="max-w-3xl font-display text-[2.75rem] font-normal leading-[0.95] tracking-[-0.02em] text-content sm:text-[4.5rem] lg:text-[6.3rem] lg:leading-[0.9] lg:tracking-[-0.025em]">
          Prove you&rsquo;re safe
          <br />
          without revealing your <CyclingWord />.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-content-muted sm:text-xl">
          Your collateral and debt are encrypted in your browser, checked on-chain directly on the ciphertext, and only
          the safe / unsafe verdict is ever made public. Nobody sees your position.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#app"
            className="inline-flex h-12 items-center gap-2 bg-brand px-6 font-mono text-sm text-content transition-all hover:bg-brand-soft"
          >
            Launch the app
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 border border-content/15 px-6 font-mono text-sm text-content transition-colors hover:border-content/40"
          >
            <Github className="h-4 w-4" />
            View the source
          </a>
        </div>
      </div>
    </section>
  );
}
