import { Lock, Cpu, Globe } from 'lucide-react';

const ITEMS = [
  {
    icon: Lock,
    title: 'Encrypt in your browser',
    body: 'Collateral and debt are encrypted client-side into euint64 ciphertext before they ever touch the chain. The plaintext never leaves your machine.',
  },
  {
    icon: Cpu,
    title: 'Compute on ciphertext',
    body: 'The contract evaluates collateral × 100 ≥ debt × ratio directly on the encrypted values — no decryption, no division, no leakage.',
  },
  {
    icon: Globe,
    title: 'Reveal only the verdict',
    body: 'Just the safe / unsafe boolean is made publicly decryptable. A lending protocol can trust the answer without ever seeing your position.',
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-3 md:grid-cols-3">
        {ITEMS.map((it) => (
          <div key={it.title} className="panel p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-white">{it.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
