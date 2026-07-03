import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    title: "Encrypt client-side",
    body: "Your collateral and debt are encrypted in the browser into euint64 ciphertext, using Zama's relayer SDK. The plaintext never touches the network.",
    file: "src/hooks/useZentinel.ts",
    code: `const input = instance.createEncryptedInput(
  ZENTINEL_ADDRESS,
  address,
);
input.add64(collateral);
input.add64(debt);

const { handles, inputProof } = await input.encrypt();
// plaintext never leaves this function`,
  },
  {
    n: "02",
    title: "Submit ciphertext",
    body: "Only the ciphertext and its zero-knowledge input proof are sent to the Sepolia contract. No decryption happens on-chain.",
    file: "contracts/Zentinel.sol",
    code: `function submitPosition(
  externalEuint64 collateralInput,
  externalEuint64 debtInput,
  bytes calldata inputProof
) external {
  euint64 collateral = FHE.fromExternal(collateralInput, inputProof);
  euint64 debt = FHE.fromExternal(debtInput, inputProof);

  _collateral[msg.sender] = collateral;
  _debt[msg.sender] = debt;
}`,
  },
  {
    n: "03",
    title: "Compute the verdict",
    body: "The contract runs collateral × 100 ≥ debt × ratio homomorphically — a comparison over encrypted values, with no division and no leakage.",
    file: "contracts/Zentinel.sol",
    code: `function computeVerdict() external {
  require(hasPosition[msg.sender], "no position");

  euint64 scaledColl = FHE.mul(_collateral[msg.sender], 100);
  euint64 scaledDebt = FHE.mul(_debt[msg.sender], requiredRatioPercent);

  ebool isSafe = FHE.ge(scaledColl, scaledDebt);
  FHE.makePubliclyDecryptable(isSafe); // verdict only
}`,
  },
  {
    n: "04",
    title: "Reveal only the answer",
    body: "Just the safe / unsafe boolean is made publicly decryptable. A lending protocol trusts the verdict without ever seeing your numbers.",
    file: "src/hooks/useZentinel.ts",
    code: `const handle = await publicClient.readContract({
  functionName: "getVerdict",
  args: [address],
});

const res = await instance.publicDecrypt([handle]);
const safe = res.clearValues[handle]; // just true / false
// collateral and debt are never part of this response`,
  },
];

export function ProcessSection() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = STEPS[active];

  return (
    <section id="architecture" className="scroll-mt-20 bg-ink py-20 text-ink-content sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-6 flex items-center gap-3 text-sm font-mono text-ink-muted">
          <span className="h-px w-8 bg-ink-content/30" />
          How it works
        </div>

        <h2 className="max-w-2xl font-display text-4xl font-normal leading-[0.95] tracking-[-0.02em] sm:text-5xl">
          Four steps. The numbers never leave your browser.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-muted">
          It&rsquo;s the private equivalent of a DeFi lending protocol&rsquo;s health-factor check — the kind that
          normally requires your whole position to be public. Here, only the yes/no answer ever is.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-index={i}
                className={cn(
                  "flex gap-5 border-l-2 pl-5 transition-colors duration-300",
                  i === active ? "border-brand" : "border-transparent",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm transition-colors duration-300",
                    i === active ? "text-brand" : "text-ink-muted/50",
                  )}
                >
                  {s.n}
                </span>
                <div>
                  <div
                    className={cn(
                      "font-medium transition-colors duration-300",
                      i === active ? "text-ink-content" : "text-ink-muted",
                    )}
                  >
                    {s.title}
                  </div>
                  <p
                    className={cn(
                      "mt-1.5 max-w-md text-sm leading-relaxed transition-colors duration-300",
                      i === active ? "text-ink-muted" : "text-ink-muted/40",
                    )}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="min-w-0 border border-ink-hairline bg-ink-raised lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between border-b border-ink-hairline px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-ink-content/20" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-content/20" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-content/20" />
              </div>
              <span key={step.file} className="animate-fade-up font-mono text-xs text-ink-muted">
                {step.file}
              </span>
            </div>
            <pre
              key={active}
              className="animate-fade-up overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed text-ink-content"
            >
              <code>{step.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
