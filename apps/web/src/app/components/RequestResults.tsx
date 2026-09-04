import { CONCURRENCY } from '@banking-ledger/terms';

import type { RunEntry } from '@/app/types';

type RequestResultsProps = {
  entries: RunEntry[];
};

export function RequestResults({ entries }: RequestResultsProps) {
  if (!entries.length) {
    return (
      <div className="min-h-32 rounded-xl border border-dashed border-border/80 bg-background/40 p-4 font-mono text-xs text-muted-foreground">
        <p className="text-center text-sm">{CONCURRENCY.RUN_SCENARIO_HINT}</p>
      </div>
    );
  }

  return (
    <div className="min-h-32 rounded-xl border border-dashed border-border/80 bg-background/40 p-4 font-mono text-xs text-muted-foreground">
      <ul className="space-y-1.5">
        {entries.map((entry) => (
          <li key={entry.label}>
            {entry.label} · {entry.outcome} · {entry.ms}ms
          </li>
        ))}
      </ul>
    </div>
  );
}
