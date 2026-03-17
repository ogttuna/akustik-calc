"use client";

import { ArrowUpRight, MoveRight } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

type WorkbenchFlowMapItem = {
  href: string;
  label: string;
  stage: string;
  statusLabel: string;
  summary: string;
  tone: "accent" | "neutral" | "success" | "warning";
};

type WorkbenchFlowMapProps = {
  items: readonly WorkbenchFlowMapItem[];
};

export function WorkbenchFlowMap({ items }: WorkbenchFlowMapProps) {
  return (
    <SurfacePanel className="workbench-flow-map stage-enter-2 overflow-hidden px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Operator map</Pill>
        <Pill tone="neutral">{items.length} active chapters</Pill>
      </div>

      <div className="mt-5">
        <div className="eyebrow">Quick navigation</div>
        <h2 className="mt-2 text-[clamp(1.4rem,2.1vw,1.95rem)] font-display leading-[0.95] tracking-[-0.04em] text-[color:var(--ink)]">
          Move through the solver in a fixed order.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Each chapter below is a live anchor. Use it to jump between output review, evidence import, field carry-over,
          and delivery checks without scanning the full rail.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <a className="workbench-flow-link" href={item.href} key={item.href}>
            <div className="flex min-w-0 items-start gap-4">
              <div className="workbench-flow-stage">{item.stage}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                      <MoveRight className="h-4 w-4 text-[color:var(--accent-ink)]" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{item.summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone={item.tone}>{item.statusLabel}</Pill>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--ink-faint)]" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </SurfacePanel>
  );
}
