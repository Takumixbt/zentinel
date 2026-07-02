import { ConnectButton } from "@rainbow-me/rainbowkit";
import { GITHUB_URL } from "@/lib/contract";

const NAV_LINKS = [
  { label: "Protocol", href: "#protocol" },
  { label: "Architecture", href: "#architecture" },
  { label: "Launchpad", href: "#app" },
  { label: "Docs", href: `${GITHUB_URL}#readme`, external: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline/70 bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-baseline font-display text-[1.9rem] font-semibold tracking-tight text-content">
          <span className="text-4xl font-black leading-none text-content">Z</span>entinel
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="font-mono text-xs uppercase tracking-[0.16em] text-content-dim transition-colors hover:text-brand-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
      </div>
    </header>
  );
}
