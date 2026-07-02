import { ETHERSCAN_ADDRESS_URL } from '@/lib/contract';
import { ArrowUpRight } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Encrypt client-side',
    body: 'Your collateral and debt are encrypted in the browser into euint64 ciphertext. The plaintext never touches the network.',
  },
  {
    n: '02',
    title: 'Submit ciphertext',
    body: 'Only the ciphertext and its zero-knowledge input proof are sent to the Sepolia contract. No decryption happens on-chain.',
  },
  {
    n: '03',
    title: 'Compute the verdict',
    body: 'The contract runs collateral × 100 ≥ debt × ratio homomorphically — a comparison over encrypted values, with no division and no leakage.',
  },
  {
    n: '04',
    title: 'Reveal only the answer',
    body: 'Just the safe / unsafe boolean is made publicly decryptable. A lending protocol trusts the verdict without ever seeing your numbers.',
  },
];

// Lightweight, hand-tokenized excerpt of the real contract. Verbatim from
// contracts/Zentinel.sol::computeVerdict — kept in sync manually.
function CodePanel() {
  const kw = 'text-[#7dd3fc]';
  const fn = 'text-[#c4b5fd]';
  const ty = 'text-[#5eead4]';
  const cm = 'text-content-dim';
  const st = 'text-[#fca5a5]';
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-[#080b11] shadow-panel">
      <div className="flex items-center justify-between border-b border-hairline/70 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2a3342]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2a3342]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2a3342]" />
        </div>
        <span className="font-mono text-[0.7rem] text-content-dim">
          contracts/Zentinel.sol
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.78rem] leading-relaxed text-content-muted">
        <code>
          <span className={cm}>{'// Safe iff collateral / debt >= ratio / 100,'}</span>{'\n'}
          <span className={cm}>{'// checked without division, on the ciphertext.'}</span>{'\n'}
          <span className={kw}>function</span> <span className={fn}>computeVerdict</span>() <span className={kw}>external</span> {'{\n'}
          {'  '}<span className={kw}>require</span>(hasPosition[msg.sender], <span className={st}>"no position"</span>);{'\n\n'}
          {'  '}<span className={ty}>euint64</span> scaledColl = <span className={fn}>FHE.mul</span>(_collateral[msg.sender], <span className="text-[#fbbf24]">100</span>);{'\n'}
          {'  '}<span className={ty}>euint64</span> scaledDebt = <span className={fn}>FHE.mul</span>(_debt[msg.sender], requiredRatioPercent);{'\n\n'}
          {'  '}<span className={ty}>ebool</span> isSafe = <span className={fn}>FHE.ge</span>(scaledColl, scaledDebt);{'\n'}
          {'  '}<span className={fn}>FHE.makePubliclyDecryptable</span>(isSafe); <span className={cm}>{'// verdict only'}</span>{'\n'}
          {'}'}
        </code>
      </pre>
    </div>
  );
}

export function ProcessSection() {
  return (
    <section className="relative border-y border-hairline/60 bg-[#05070b] py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(40rem 30rem at 85% 0%, rgba(34,211,238,0.06), transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-content-dim">
          <span className="h-px w-6 bg-brand/50" />
          How it works
        </div>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-[2.5rem]">
          Four steps. The numbers never leave your browser.
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <ol className="flex flex-col gap-6">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 font-mono text-sm font-semibold text-brand">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-content-muted">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="lg:pt-1">
            <CodePanel />
            <a
              href={ETHERSCAN_ADDRESS_URL}
              target="_blank"
              rel="noreferrer"
              className="group mt-3 inline-flex items-center gap-1.5 text-xs text-content-dim transition-colors hover:text-brand"
            >
              Read the verified source on Etherscan
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
