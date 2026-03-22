"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Pill, SurfacePanel } from "@dynecho/ui";
import { Layers3, ListChecks, Radar, ScrollText, ShieldCheck, Wrench } from "lucide-react";

import {
  buildSimpleWorkbenchMethodDossier,
  type SimpleWorkbenchMethodTraceGroup
} from "./simple-workbench-method-dossier";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { SimpleWorkbenchProposalConstructionFigure } from "./simple-workbench-proposal-construction-figure";
import type { StudyMode } from "./preset-definitions";
import type {
  SimpleWorkbenchProposalCoverageItem,
  SimpleWorkbenchProposalLayer
} from "./simple-workbench-proposal";

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
  coverageItems: readonly SimpleWorkbenchProposalCoverageItem[];
  contextLabel: string;
  layers: readonly SimpleWorkbenchProposalLayer[];
  readyMetrics: readonly SimpleWorkbenchMethodMetric[];
  result: AssemblyCalculation | null;
  stackDetail: string;
  studyMode: StudyMode;
  studyModeLabel: string;
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

function TraceGroupCard(props: SimpleWorkbenchMethodTraceGroup) {
  const { detail, label, notes, tone, value } = props;

  return (
    <article className="rounded-[1rem] border hairline bg-[color:var(--paper)] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{label}</div>
        <Pill tone={tone}>{value}</Pill>
      </div>
      <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      <div className="mt-4 grid gap-2">
        {notes.map((note) => (
          <div className="rounded-[0.95rem] border hairline bg-black/[0.025] px-3 py-3 text-sm leading-6 text-[color:var(--ink-soft)]" key={`${label}-${note}`}>
            {note}
          </div>
        ))}
      </div>
    </article>
  );
}

export function SimpleWorkbenchMethodPanel({
  branchDetail,
  branchLabel,
  coverageItems,
  contextLabel,
  layers,
  readyMetrics,
  result,
  stackDetail,
  studyMode,
  studyModeLabel,
  unlocks,
  validationDetail,
  validationLabel,
  warnings
}: SimpleWorkbenchMethodPanelProps) {
  const methodDossier = buildSimpleWorkbenchMethodDossier({
    branchDetail,
    branchLabel,
    contextLabel,
    coverageItems,
    layers,
    result,
    stackDetail,
    studyModeLabel,
    validationDetail,
    validationLabel,
    warnings
  });
  const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, studyMode);

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Method Detail</div>
          <h2 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
            Why this route is active
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
            {methodDossier.headline}
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
        <div className="grid gap-3 xl:grid-cols-4">
          {methodDossier.cards.map((card) => (
            <MethodCard detail={card.detail} key={`${card.label}-${card.value}`} label={card.label} value={card.value} />
          ))}
        </div>

        <section className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Validation corridor
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {corridorDossier.cards.length} card{corridorDossier.cards.length === 1 ? "" : "s"}
            </div>
          </div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">{corridorDossier.headline}</p>
          <div className="mt-4 grid gap-3 xl:grid-cols-4">
            {corridorDossier.cards.map((card) => (
              <MethodCard detail={card.detail} key={`${card.label}-${card.value}`} label={card.label} value={card.value} />
            ))}
          </div>
        </section>

        <section className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <div className="inline-flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              Active lane notes
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {methodDossier.traceGroups.length} trace group{methodDossier.traceGroups.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {methodDossier.traceGroups.length > 0 ? (
              methodDossier.traceGroups.map((group) => <TraceGroupCard {...group} key={`${group.label}-${group.value}`} />)
            ) : (
              <div className="rounded-[1rem] border border-dashed hairline px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                No explicit dynamic trace notes are available yet. Build a supported route first so DynEcho can expose the lane rationale.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[1.25rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <div className="inline-flex items-center gap-2">
              <Layers3 className="h-4 w-4" />
              Technical section on this route
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {layers.length} row{layers.length === 1 ? "" : "s"}
            </div>
          </div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[color:var(--ink-soft)]">
            {stackDetail} The same solver-order section travels into the client-facing proposal so the lane narrative and issue package stay on the same stack reading.
          </p>
          <div className="mt-4">
            <SimpleWorkbenchProposalConstructionFigure layers={layers} studyModeLabel={studyModeLabel} />
          </div>
        </section>

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
