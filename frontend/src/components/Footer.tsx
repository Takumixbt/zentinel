import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { ETHERSCAN_ADDRESS_URL, GITHUB_URL } from "@/lib/contract";
import { FooterField } from "@/components/FooterField";

interface Col {
  title: string;
  links: { label: string; href: string; mono?: boolean }[];
}

const COLS: Col[] = [
  {
    title: "Protocol",
    links: [
      { label: "View on Etherscan", href: ETHERSCAN_ADDRESS_URL },
      { label: "Sepolia testnet", href: "https://sepolia.etherscan.io" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Source on GitHub", href: GITHUB_URL },
      { label: "README", href: `${GITHUB_URL}#readme` },
      { label: "Report an issue", href: `${GITHUB_URL}/issues` },
    ],
  },
  {
    title: "Built with",
    links: [
      { label: "Zama FHEVM", href: "https://docs.zama.org/protocol" },
      { label: "Zama relayer SDK", href: "https://docs.zama.org/protocol" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-hairline">
      <div className="pointer-events-none absolute inset-0 h-64 overflow-hidden opacity-30">
        <FooterField className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <div className="grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#" className="inline-flex items-center gap-2">
              <span className="font-display text-xl text-content">Zentinel</span>
              <span className="font-mono text-xs text-content-dim">CONFIDENTIAL</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-content-muted">
              Prove you&rsquo;re safely collateralized without revealing your position — encrypted end-to-end on
              Zama&rsquo;s FHEVM.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-content-dim">{col.title}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group inline-flex items-center gap-1 text-sm text-content-muted transition-colors hover:text-content ${l.mono ? "font-mono text-[0.8rem]" : ""}`}
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

        <div className="flex flex-col gap-3 border-t border-hairline py-6 text-xs text-content-dim sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Zentinel · confidential collateralization on Zama&rsquo;s FHEVM</span>
          <span className="inline-flex items-center gap-1.5 text-content-dim">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Built for Zama
          </span>
        </div>
      </div>
    </footer>
  );
}
