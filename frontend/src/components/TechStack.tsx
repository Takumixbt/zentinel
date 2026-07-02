import { Cpu, FileCode2, Hammer, Radio, Plug, Wallet2 } from 'lucide-react';

const STACK = [
  { icon: Cpu, label: 'Zama FHEVM' },
  { icon: FileCode2, label: 'Solidity' },
  { icon: Hammer, label: 'Hardhat' },
  { icon: Radio, label: 'Sepolia' },
  { icon: Plug, label: 'wagmi' },
  { icon: Wallet2, label: 'RainbowKit' },
];

export function TechStack() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-content-dim">
        Built on a real, verifiable stack
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {STACK.map((s) => (
          <div
            key={s.label}
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/60 px-4 py-2 text-sm text-content-muted transition-colors hover:border-brand/40 hover:text-white"
          >
            <s.icon className="h-4 w-4 text-brand/80" />
            {s.label}
          </div>
        ))}
      </div>
    </section>
  );
}
