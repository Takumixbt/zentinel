interface Stat {
  value: string;
  label: string;
  sub?: string;
}

/**
 * Honest trust bar under the hero. Every figure here is a verifiable fact about
 * the deployed contract — no fabricated TVL / user counts.
 */
export function StatsBar({ requiredRatio }: { requiredRatio?: number }) {
  const stats: Stat[] = [
    {
      value: `${requiredRatio ?? 150}%`,
      label: 'Required ratio',
      sub: 'enforced on ciphertext',
    },
    {
      value: '6 / 6',
      label: 'Contract tests',
      sub: 'passing on Sepolia + local',
    },
    {
      value: '~15–20s',
      label: 'Verdict decryption',
      sub: 'via Zama KMS',
    },
    {
      value: '0',
      label: 'Plaintext on-chain',
      sub: 'raw figures never leave you',
    },
  ];

  return (
    <section className="border-y border-hairline/60 bg-surface/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-hairline/50 px-5 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-7 sm:px-6 ${i >= 2 ? 'border-t border-hairline/50 md:border-t-0' : ''}`}
          >
            <div className="font-display text-3xl font-semibold tracking-tight text-white tabular sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1.5 text-sm font-medium text-content-muted">
              {s.label}
            </div>
            {s.sub && (
              <div className="text-[0.72rem] text-content-dim">{s.sub}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
