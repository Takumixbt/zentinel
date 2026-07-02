import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';
import type { Activity } from '@/hooks/useZentinel';
import { cn } from '@/lib/utils';

const ICON = {
  pending: Loader2,
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ActivityLog({ items }: { items: Activity[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll only this internal log container, never the page — and skip
    // the initial empty mount so there's nothing to jump to on page load.
    if (items.length === 0) return;
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items]);

  return (
    <div className="rounded-xl border border-hairline bg-surface-inset/50 p-3">
      <div className="mb-2 flex items-center gap-2 px-1 text-[0.68rem] font-medium uppercase tracking-wider text-content-dim">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
        Activity
      </div>
      <div ref={containerRef} className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-content-dim">
            Your on-chain and cryptographic steps will appear here.
          </p>
        ) : (
          items.map((a) => {
            const Icon = ICON[a.kind];
            const color =
              a.kind === 'success'
                ? 'text-safe'
                : a.kind === 'error'
                  ? 'text-danger'
                  : a.kind === 'pending'
                    ? 'text-brand'
                    : 'text-content-muted';
            return (
              <div
                key={a.id}
                className="animate-fade-up flex items-start gap-2.5 rounded-lg px-2 py-1.5"
              >
                <Icon
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    color,
                    a.kind === 'pending' && 'animate-spin',
                  )}
                />
                <div className="min-w-0">
                  <div className={cn('text-sm leading-tight', color)}>{a.text}</div>
                  {a.detail && (
                    <div className="truncate font-mono text-[0.68rem] text-content-dim">
                      {a.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
