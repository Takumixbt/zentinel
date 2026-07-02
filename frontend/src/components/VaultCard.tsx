import { Lock, LockOpen } from "lucide-react";
import { VaultValue } from "./VaultValue";
import { cn } from "@/lib/utils";

export function VaultCard({
  label,
  hint,
  value,
  revealed,
  seed,
  unit,
}: {
  label: string;
  hint: string;
  value: bigint | null;
  revealed: boolean;
  seed: string;
  unit?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden border p-4 transition-all duration-500",
        revealed ? "border-brand/30 bg-brand/[0.05]" : "border-hairline bg-surface-inset/60",
      )}
    >
      {/* sheen sweep on reveal */}
      {revealed && (
        <span className="pointer-events-none absolute inset-0 -skew-x-12 overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </span>
      )}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-content-muted">{label}</div>
          <div className="text-[0.68rem] text-content-dim">{hint}</div>
        </div>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center border transition-all duration-500",
            revealed ? "border-brand/40 bg-brand/15 text-brand" : "border-hairline bg-surface text-content-dim",
          )}
        >
          {revealed ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </div>
      </div>
      <VaultValue revealed={revealed} value={value} seed={seed} unit={unit} />
      <div className="mt-2.5 flex items-center gap-1.5 text-[0.68rem]">
        <span className={cn("inline-block h-1.5 w-1.5 rounded-full", revealed ? "bg-brand" : "bg-content-dim")} />
        <span className={revealed ? "text-brand" : "text-content-dim"}>
          {revealed ? "Decrypted locally" : "Encrypted · ciphertext on-chain"}
        </span>
      </div>
    </div>
  );
}
