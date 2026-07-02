import { ArrowUpRight, Github } from 'lucide-react';
import {
  ETHERSCAN_ADDRESS_URL,
  GITHUB_URL,
  ZENTINEL_ADDRESS,
} from '@/lib/contract';

export function Footer() {
  return (
    <footer className="mt-8 border-t border-hairline/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-content-dim">
          <span className="font-display font-semibold text-content-muted">Zentinel</span> ·
          confidential collateralization on{' '}
          <a
            href="https://docs.zama.org/protocol"
            target="_blank"
            rel="noreferrer"
            className="text-content-muted underline-offset-4 hover:text-brand hover:underline"
          >
            Zama&rsquo;s FHEVM
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href={ETHERSCAN_ADDRESS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface/60 px-3 py-1.5 text-content-muted transition-colors hover:border-brand/50 hover:text-white"
          >
            <span className="font-mono">{ZENTINEL_ADDRESS.slice(0, 10)}…</span>
            Etherscan
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface/60 px-3 py-1.5 text-content-muted transition-colors hover:border-brand/50 hover:text-white"
          >
            <Github className="h-3.5 w-3.5" />
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
