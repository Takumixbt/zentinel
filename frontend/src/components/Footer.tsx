import { ArrowUpRight, Github, ShieldCheck } from 'lucide-react';
import {
  ETHERSCAN_ADDRESS_URL,
  GITHUB_URL,
  ZENTINEL_ADDRESS,
} from '@/lib/contract';
import { shortAddr } from '@/lib/utils';

interface Col {
  title: string;
  links: { label: string; href: string; mono?: boolean }[];
}

const COLS: Col[] = [
  {
    title: 'Protocol',
    links: [
      { label: shortAddr(ZENTINEL_ADDRESS, 6), href: ETHERSCAN_ADDRESS_URL, mono: true },
      { label: 'View on Etherscan', href: ETHERSCAN_ADDRESS_URL },
      { label: 'Sepolia testnet', href: 'https://sepolia.etherscan.io' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Source on GitHub', href: GITHUB_URL },
      { label: 'README', href: `${GITHUB_URL}#readme` },
      { label: 'Report an issue', href: `${GITHUB_URL}/issues` },
    ],
  },
  {
    title: 'Built with',
    links: [
      { label: 'Zama FHEVM', href: 'https://docs.zama.org/protocol' },
      { label: 'Zama relayer SDK', href: 'https://docs.zama.org/protocol' },
      { label: 'wagmi + RainbowKit', href: 'https://wagmi.sh' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-4 border-t border-hairline/70 bg-surface/30">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand/40 bg-brand/10">
                <ShieldCheck className="h-4.5 w-4.5 text-brand" />
              </div>
              <span className="font-display text-lg font-semibold text-white">
                Zentinel
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-content-muted">
              A confidential collateralization risk gate. Prove you&rsquo;re safely
              collateralized without revealing your position — encrypted end-to-end
              on Zama&rsquo;s FHEVM.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-content-dim">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group inline-flex items-center gap-1 text-sm text-content-muted transition-colors hover:text-white ${l.mono ? 'font-mono text-[0.8rem]' : ''}`}
                    >
                      {l.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-hairline/60 pt-6 text-xs text-content-dim sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} Zentinel · confidential collateralization
            on Zama&rsquo;s FHEVM
          </span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-content-dim transition-colors hover:text-brand"
          >
            <Github className="h-3.5 w-3.5" />
            Takumixbt/zentinel
          </a>
        </div>
      </div>
    </footer>
  );
}
