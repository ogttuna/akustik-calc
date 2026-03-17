type ResultMeterProps = {
  value: number;
};

export function ResultMeter({ value }: ResultMeterProps) {
  const left = `${Math.max(0, Math.min(100, ((value - 20) / 60) * 100))}%`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
        <span>Screening band</span>
        <span className="metric-number">{value.toFixed(1)} dB</span>
      </div>
      <div className="relative h-3 rounded-full bg-black/[0.06]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--warning),var(--accent),var(--success))]"
          style={{ width: "100%" }}
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[color:var(--paper)] bg-[color:var(--ink)] shadow-[0_4px_18px_rgba(15,34,32,0.22)]"
          style={{ left: `calc(${left} - 0.625rem)` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[color:var(--ink-faint)]">
        <span>20</span>
        <span>50</span>
        <span>80</span>
      </div>
    </div>
  );
}

