"use client";

import { Pill, SurfacePanel } from "@dynecho/ui";
import { ListChecks, Radar, ShieldCheck, Wrench } from "lucide-react";

type SimpleWorkbenchMethodMetric = {
  detail: string;
  label: string;
  value: string;
};

type SimpleWorkbenchMethodUnlock = {
  detail: string;
  outputsLabel: string;
  title: string;
};

type SimpleWorkbenchMethodPanelProps = {
  branchDetail: string;
  branchLabel: string;
  contextLabel: string;
  readyMetrics: readonly SimpleWorkbenchMethodMetric[];
  stackDetail: string;
  unlocks: readonly SimpleWorkbenchMethodUnlock[];
  validationDetail: string;
  validationLabel: string;
  warnings: readonly string[];
};

function MethodCard(props: { detail: string; label: string; value: string }) {
  const { detail, label, value } = props;

  return (
    <article className="rounded-[1.15rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
      <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

export function SimpleWorkbenchMethodPanel({
  branchDetail,
  branchLabel,
  contextLabel,
  readyMetrics,
  stackDetail,
  unlocks,
  validationDetail,
  validationLabel,
  warnings
}: SimpleWorkbenchMethodPanelProps) {
  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Method Detail</div>
          <h2 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
            Why this route is active
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
            Open this panel when the user wants to see how the dynamic calculator read the layer stack, why the current
            route was chosen, and what is still blocking any parked outputs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">{branchLabel}</Pill>
          <Pill tone={warnings.length > 0 ? "warning" : "success"}>
            {warnings.length > 0 ? `${warnings.length} warning${warnings.length === 1 ? "" : "s"}` : "No live blockers"}
          </Pill>
        </div>
      </div>

      <div className="mt-5 grid gap-6">
        <div className="grid gap-3 xl:grid-cols-3">
          <MethodCard detail={branchDetail} label="Dynamic branch" value={branchLabel} />
          <MethodCard detail={validationDetail} label="Validation posture" value={validationLabel} />
          <MethodCard
            detail={`${stackDetail} Context label: ${contextLabel}.`}
            label="Stack interpretation"
            value="Visible rows -> solver route"
          />
        </div>

        <section className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <ShieldCheck className="h-4 w-4" />
            Already defensible on this route
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {readyMetrics.length > 0 ? (
              readyMetrics.map((metric) => (
                <article className="rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4" key={`${metric.label}-${metric.value}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{metric.label}</div>
                    <Pill tone="success">{metric.value}</Pill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{metric.detail}</p>
                </article>
              ))
            ) : (
              <div className="rounded-[1rem] border border-dashed hairline px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                No live metric is defensible yet. Complete the stack and route inputs first.
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <section className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Radar className="h-4 w-4" />
              What still blocks parked outputs
            </div>
            <div className="mt-4 grid gap-3">
              {unlocks.length > 0 ? (
                unlocks.map((unlock) => (
                  <article className="rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4" key={`${unlock.title}-${unlock.outputsLabel}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-[color:var(--ink)]">{unlock.title}</div>
                      <Pill tone="warning">{unlock.outputsLabel}</Pill>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{unlock.detail}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                  No parked-output blockers are active right now.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ListChecks className="h-4 w-4" />
              Current caution log
            </div>
            <div className="mt-4 grid gap-3">
              {warnings.length > 0 ? (
                warnings.map((warning) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--warning-soft)]/62 px-4 py-4 text-sm leading-6 text-[color:var(--warning-ink)]" key={warning}>
                    {warning}
                  </div>
                ))
              ) : (
                <div className="rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                  No live warning notes are active on the current route.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="rounded-[1.25rem] border hairline bg-black/[0.025] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Wrench className="h-4 w-4" />
            Reading discipline
          </div>
          <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            DynEcho keeps the dynamic branch, validation posture, parked outputs, and warnings separate on purpose. The
            UI is allowed to look polished, but it is not allowed to collapse an estimate, a bound, and an exact source
            into the same confidence statement.
          </p>
        </div>
      </div>
    </SurfacePanel>
  );
}
