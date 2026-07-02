const STEPS = [
  {
    n: "01",
    title: "Encrypt client-side",
    body: "Your collateral and debt are encrypted in the browser into euint64 ciphertext. The plaintext never touches the network.",
  },
  {
    n: "02",
    title: "Submit ciphertext",
    body: "Only the ciphertext and its zero-knowledge input proof are sent to the Sepolia contract. No decryption happens on-chain.",
  },
  {
    n: "03",
    title: "Compute the verdict",
    body: "The contract runs collateral × 100 ≥ debt × ratio homomorphically — a comparison over encrypted values, with no division and no leakage.",
  },
  {
    n: "04",
    title: "Reveal only the answer",
    body: "Just the safe / unsafe boolean is made publicly decryptable. A lending protocol trusts the verdict without ever seeing your numbers.",
  },
];

const CODE = `function computeVerdict() external {
 require(hasPosition[msg.sender], "no position");

 euint64 scaledColl = FHE.mul(_collateral[msg.sender], 100);
 euint64 scaledDebt = FHE.mul(_debt[msg.sender], requiredRatioPercent);

 ebool isSafe = FHE.ge(scaledColl, scaledDebt);
 FHE.makePubliclyDecryptable(isSafe); // verdict only
}`;

export function ProcessSection() {
  return (
    <section id="architecture" className="scroll-mt-20 bg-ink py-20 text-ink-content sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 flex items-center gap-3 text-sm font-mono text-ink-muted">
          <span className="h-px w-8 bg-ink-content/30" />
          How it works
        </div>

        <h2 className="max-w-2xl font-display text-4xl font-normal leading-[0.95] tracking-[-0.02em] sm:text-5xl">
          Four steps. The numbers never leave your browser.
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-5">
                <span className="font-mono text-sm text-brand">{step.n}</span>
                <div>
                  <div className="font-medium text-ink-content">{step.title}</div>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-ink-hairline bg-ink-raised">
            <div className="flex items-center justify-between border-b border-ink-hairline px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-ink-content/20" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-content/20" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-content/20" />
              </div>
              <span className="font-mono text-xs text-ink-muted">contracts/Zentinel.sol</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed text-ink-content">
              <code>{CODE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
