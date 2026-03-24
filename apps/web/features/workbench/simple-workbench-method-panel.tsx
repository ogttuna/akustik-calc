"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Pill, SurfacePanel } from "@dynecho/ui";
import { ChevronRight, Layers3, ListChecks, Radar, ScrollText, ShieldCheck, Wrench } from "lucide-react";

import {
  buildSimpleWorkbenchMethodDossier,
  type SimpleWorkbenchMethodDossierCard,
  type SimpleWorkbenchMethodTraceGroup
} from "./simple-workbench-method-dossier";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { SimpleWorkbenchProposalConstructionFigure } from "./simple-workbench-proposal-construction-figure";
import type { SimpleWorkbenchProposalBriefItem } from "./simple-workbench-proposal-brief";
import type { SimpleWorkbenchProposalCitation } from "./simple-workbench-evidence";
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
  assumptionItems: readonly SimpleWorkbenchProposalBriefItem[];
  branchDetail: string;
  branchLabel: string;
  citations: readonly SimpleWorkbenchProposalCitation[];
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

function getToneShellClass(tone: "accent" | "neutral" | "success" | "warning"): string {
  switch (tone) {
    case "success":
      return "border-[color:color-mix(in_oklch,var(--success)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))]";
    case "warning":
      return "border-[color:color-mix(in_oklch,var(--warning)_30%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))]";
    case "accent":
      return "border-[color:color-mix(in_oklch,var(--accent)_26%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))]";
    case "neutral":
    default:
      return "hairline bg-[color:var(--paper)]/78";
  }
}

function MethodMetaChip(props: { children: string }) {
  const { children } = props;

  return (
    <span className="inline-flex items-center rounded-full border hairline bg-[color:var(--paper)]/78 px-3 py-1.5 text-[0.72rem] font-medium text-[color:var(--ink-soft)]">
      {children}
    </span>
  );
}

function AuditStepCard(props: SimpleWorkbenchMethodDossierCard & { index: number }) {
  const { detail, index, label, tone, value } = props;

  return (
    <article className={`grid gap-3 rounded-[1rem] border px-4 py-4 ${getToneShellClass(tone)}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border hairline bg-[color:var(--paper)]/82 text-[0.74rem] font-semibold text-[color:var(--ink)]">
          {String(index + 1).padStart(2, "0")}
        </div>
        <Pill tone={tone}>{value}</Pill>
      </div>
      <div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
        <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      </div>
    </article>
  );
}

function TraceGroupCard(props: SimpleWorkbenchMethodTraceGroup & { index: number }) {
  const { detail, index, label, notes, tone, value } = props;

  return (
    <details className={`group rounded-[1rem] border px-4 py-4 ${getToneShellClass(tone)}`} data-testid={`method-trace-group-${index + 1}`} open={index === 0}>
      <summary className="flex cursor-pointer list-none flex-wrap items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="grid min-w-0 flex-1 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border hairline bg-[color:var(--paper)]/84 px-2 text-[0.7rem] font-semibold text-[color:var(--ink)]">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={tone}>{value}</Pill>
            <MethodMetaChip>{`${notes.length} selected note${notes.length === 1 ? "" : "s"}`}</MethodMetaChip>
          </div>
          <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
        </div>
        <div className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
          Open notes
          <ChevronRight className="h-4 w-4" />
        </div>
      </summary>
      <div className="mt-4 grid gap-2 border-t border-[color:color-mix(in_oklch,var(--line)_88%,transparent)] pt-4">
        {notes.map((note, noteIndex) => (
          <div
            className="grid grid-cols-[2.2rem_minmax(0,1fr)] gap-3 rounded-[0.95rem] border hairline bg-[color:var(--paper)]/82 px-3 py-3"
            key={`${label}-${note}`}
          >
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {String(noteIndex + 1).padStart(2, "0")}
            </div>
            <div className="text-sm leading-6 text-[color:var(--ink-soft)]">{note}</div>
          </div>
        ))}
      </div>
    </details>
  );
}

function MethodCitationCard(props: SimpleWorkbenchProposalCitation) {
  const { detail, href, label, tone } = props;

  return (
    <article className={`rounded-[1rem] border px-4 py-4 ${getToneShellClass(tone)}`}>
      <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{label}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      {href ? (
        <a
          className="focus-ring mt-3 inline-flex items-center gap-2 rounded-full border hairline px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          Open source
        </a>
      ) : null}
    </article>
  );
}

function MethodAssumptionCard(props: SimpleWorkbenchProposalBriefItem) {
  const { detail, label, tone } = props;

  return (
    <article className={`rounded-[1rem] border px-4 py-4 ${getToneShellClass(tone)}`}>
      <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{label}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

export function SimpleWorkbenchMethodPanel({
  assumptionItems,
  branchDetail,
  branchLabel,
  citations,
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
  const selectedTraceNoteCount = methodDossier.traceGroups.reduce((count, group) => count + group.notes.length, 0);
  const visibleCitations = citations.slice(0, 4);

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
          <Pill tone="neutral">{contextLabel}</Pill>
          <Pill tone={warnings.length > 0 ? "warning" : "success"}>
            {warnings.length > 0 ? `${warnings.length} warning${warnings.length === 1 ? "" : "s"}` : "No live blockers"}
          </Pill>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <MethodMetaChip>{`${methodDossier.readyCoverageCount} ready`}</MethodMetaChip>
        <MethodMetaChip>{`${methodDossier.parkedCoverageCount} parked`}</MethodMetaChip>
        <MethodMetaChip>{`${methodDossier.unsupportedCoverageCount} unsupported`}</MethodMetaChip>
        <MethodMetaChip>{`${methodDossier.traceGroups.length} trace group${methodDossier.traceGroups.length === 1 ? "" : "s"}`}</MethodMetaChip>
        <MethodMetaChip>{`${selectedTraceNoteCount} selected note${selectedTraceNoteCount === 1 ? "" : "s"}`}</MethodMetaChip>
      </div>

      <div className="mt-5 grid gap-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <div className="grid gap-4">
            <div className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                  <ScrollText className="h-4 w-4" />
                  Route audit steps
                </div>
                <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {methodDossier.cards.length} step{methodDossier.cards.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {methodDossier.cards.map((card, index) => (
                  <AuditStepCard detail={card.detail} index={index} key={`${card.label}-${card.value}`} label={card.label} tone={card.tone} value={card.value} />
                ))}
              </div>
            </div>

            <div className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Validation corridor
                </div>
                <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {corridorDossier.cards.length} card{corridorDossier.cards.length === 1 ? "" : "s"}
                </div>
              </div>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">{corridorDossier.headline}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {corridorDossier.cards.map((card, index) => (
                  <AuditStepCard detail={card.detail} index={index} key={`${card.label}-${card.value}`} label={card.label} tone={card.tone} value={card.value} />
                ))}
              </div>
            </div>
          </div>

          <section className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <div className="inline-flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                Selected solver notes
              </div>
              <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {methodDossier.traceGroups.length} trace group{methodDossier.traceGroups.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
              The current lane rationale is kept as short selected notes instead of a long prose dump. Open any lane when you need the exact solver breadcrumbs.
            </p>
            <div className="mt-4 grid gap-3">
              {methodDossier.traceGroups.length > 0 ? (
                methodDossier.traceGroups.map((group, index) => <TraceGroupCard {...group} index={index} key={`${group.label}-${group.value}`} />)
              ) : (
                <div className="rounded-[1rem] border border-dashed hairline px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                  No explicit dynamic trace notes are available yet. Build a supported route first so DynEcho can expose the lane rationale.
                </div>
              )}
            </div>
          </section>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <section className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <div className="inline-flex items-center gap-2">
                <Layers3 className="h-4 w-4" />
                Technical section and schedule
              </div>
              <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {layers.length} row{layers.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">
              {stackDetail} The same section order stays aligned across live reading, method review, and proposal output.
            </p>
            <div className="mt-4">
              <SimpleWorkbenchProposalConstructionFigure layers={layers} studyModeLabel={studyModeLabel} />
            </div>
          </section>

          <section className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/76 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ShieldCheck className="h-4 w-4" />
              Already defensible on this route
            </div>
            <div className="mt-4 grid gap-3">
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
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <section className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Radar className="h-4 w-4" />
              Open blockers before parked outputs go live
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

          <div className="grid gap-4">
            <section className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <div className="inline-flex items-center gap-2">
                  <ScrollText className="h-4 w-4" />
                  Evidence sources in force
                </div>
                <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {citations.length} citation{citations.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {visibleCitations.length > 0 ? (
                  visibleCitations.map((citation) => (
                    <MethodCitationCard
                      detail={citation.detail}
                      href={citation.href}
                      key={`${citation.label}-${citation.href ?? citation.detail}`}
                      label={citation.label}
                      tone={citation.tone}
                    />
                  ))
                ) : (
                  <div className="rounded-[1rem] border border-dashed hairline px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
                    No linked source is active yet. Keep the current route framed as a scoped solver read until a cited family, catalog, or imported source is attached.
                  </div>
                )}
              </div>
              {citations.length > visibleCitations.length ? (
                <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
                  Diagnostics and proposal surfaces still carry all {citations.length} citation lines.
                </p>
              ) : null}
            </section>

            <section className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <div className="inline-flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Assumptions in force
                </div>
                <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {assumptionItems.length} line{assumptionItems.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {assumptionItems.map((item) => (
                  <MethodAssumptionCard detail={item.detail} key={`${item.label}-${item.detail}`} label={item.label} tone={item.tone} />
                ))}
              </div>
            </section>

            <section className="rounded-[1.2rem] border hairline bg-[color:var(--paper)]/74 px-4 py-4">
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

            <section className="rounded-[1.2rem] border hairline bg-black/[0.025] px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <Wrench className="h-4 w-4" />
                Reading rule
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                DynEcho keeps route choice, validation posture, parked outputs, and warnings separate. A polished UI must not collapse an estimate, a bound, and an exact source into the same claim.
              </p>
            </section>
          </div>
        </section>
      </div>
    </SurfacePanel>
  );
}
