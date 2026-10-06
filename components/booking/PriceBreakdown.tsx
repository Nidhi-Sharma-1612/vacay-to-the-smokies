import { usd } from "@/lib/booking/dates";
import type { Quote } from "@/lib/booking/types";

export function PriceBreakdown({ quote, compact = false }: { quote: Quote; compact?: boolean }) {
  return (
    <div>
      <dl className={`space-y-2.5 ${compact ? "text-sm" : "text-[0.95rem]"}`}>
        {quote.lines.map((line, i) => (
          <div key={`${line.label}-${i}`} className="flex justify-between gap-4 text-ink-600">
            <dt>{line.label}</dt>
            <dd className={`tabular-nums ${line.kind === "discount" ? "text-pine-600" : ""}`}>{usd(line.amount, quote.currency)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-linen-200 pt-3 text-base font-bold text-forest-900">
          <dt>Total (USD)</dt>
          <dd className="tabular-nums">{usd(quote.total, quote.currency)}</dd>
        </div>
      </dl>
      {quote.source === "demo" && (
        <p className="mt-3 rounded-xl bg-linen-100 px-3 py-2 text-xs leading-relaxed text-ink-600">
          Demo pricing. Live rates, fees and taxes load from OwnerRez once the API is connected.
        </p>
      )}
    </div>
  );
}
