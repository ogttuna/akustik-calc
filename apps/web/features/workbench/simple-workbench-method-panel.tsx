"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Pill, SurfacePanel } from "@dynecho/ui";
import { ChevronRight } from "lucide-react";

import {
  buildSimpleWorkbenchMethodDossier,
  type SimpleWorkbenchMethodDossierCard,
  type SimpleWorkbenchMethodTraceGroup
} from "./simple-workbench-method-dossier";
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
      return "hairline bg-[color:var(--paper)]";
  }
}

function AuditStepCard(props: SimpleWorkbenchMethodDossierCard) {
  const { detail, label, tone, value } = props;

  return (
    <article className={`rounded-md border px-3 py-3 ${getToneShellClass(tone)}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{label}</div>
        <Pill tone={tone}>{value}</Pill>
      </div>
      <p className="mt-1.5 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function TraceGroupCard(props: SimpleWorkbenchMethodTraceGroup) {
  const { detail, label, notes, tone, value } = props;

  return (
    <details className={`group rounded-md border px-3 py-3 ${getToneShellClass(tone)}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{label}</span>
          <Pill tone={tone}>{value}</Pill>
          <span className="text-[0.68rem] tabular-nums text-[color:var(--ink-faint)]">{notes.length} note{notes.length === 1 ? "" : "s"}</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[color:var(--ink-faint)] transition-transform group-open:rotate-90" />
      </summary>
      {detail ? <p className="mt-2 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p> : null}
      <div className="mt-3 grid gap-1.5 border-t border-[color:var(--line)] pt-3">
        {notes.map((note) => (
          <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-2 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]" key={`${label}-${note}`}>
            {note}
          </div>
        ))}
      </div>
    </details>
  );
}

function SectionHeader(props: { children: string; count?: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{props.children}</div>
      {typeof props.count === "number" ? (
        <div className="text-[0.66rem] tabular-nums text-[color:var(--ink-faint)]">{props.count}</div>
      ) : null}
    </div>
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

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="eyebrow">Method detail</div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">{branchLabel}</Pill>
          <Pill tone="neutral">{contextLabel}</Pill>
          {warnings.length > 0 ? (
            <Pill tone="warning">{warnings.length} warning{warnings.length === 1 ? "" : "s"}</Pill>
          ) : null}
        </div>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">{methodDossier.headline}</p>

      <div className="mt-5 grid gap-5">
        {/* Route audit */}
        <section>
          <SectionHeader count={methodDossier.cards.length}>Route audit</SectionHeader>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {methodDossier.cards.map((card) => (
              <AuditStepCard detail={card.detail} key={`${card.label}-${card.value}`} label={card.label} tone={card.tone} value={card.value} />
            ))}
          </div>
        </section>

        {/* Solver notes */}
        {methodDossier.traceGroups.length > 0 ? (
          <section>
            <SectionHeader count={methodDossier.traceGroups.length}>Solver notes</SectionHeader>
            <div className="mt-3 grid gap-2">
              {methodDossier.traceGroups.map((group) => <TraceGroupCard {...group} key={`${group.label}-${group.value}`} />)}
            </div>
          </section>
        ) : null}

        {/* Ready metrics + Blockers side by side */}
        <div className="grid gap-5 xl:grid-cols-2">
          <section>
            <SectionHeader count={readyMetrics.length}>Defensible outputs</SectionHeader>
            <div className="mt-3 grid gap-2">
              {readyMetrics.length > 0 ? (
                readyMetrics.map((metric) => (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3" key={`${metric.label}-${metric.value}`}>
                    <div>
                      <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{metric.label}</div>
                      <p className="mt-0.5 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{metric.detail}</p>
                    </div>
                    <Pill tone="success">{metric.value}</Pill>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-[color:var(--line)] px-3 py-3 text-[0.78rem] text-[color:var(--ink-soft)]">
                  No defensible outputs yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionHeader count={unlocks.length}>Blockers</SectionHeader>
            <div className="mt-3 grid gap-2">
              {unlocks.length > 0 ? (
                unlocks.map((unlock) => (
                  <div className="rounded-md border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3" key={`${unlock.title}-${unlock.outputsLabel}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{unlock.title}</div>
                      <Pill tone="warning">{unlock.outputsLabel}</Pill>
                    </div>
                    <p className="mt-1 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{unlock.detail}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3 text-[0.78rem] text-[color:var(--ink-soft)]">
                  No active blockers.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Construction section */}
        {layers.length > 0 ? (
          <section>
            <SectionHeader count={layers.length}>Assembly section</SectionHeader>
            <div className="mt-3">
              <SimpleWorkbenchProposalConstructionFigure layers={layers} studyModeLabel={studyModeLabel} />
            </div>
          </section>
        ) : null}

        {/* Evidence + Assumptions side by side */}
        <div className="grid gap-5 xl:grid-cols-2">
          {citations.length > 0 ? (
            <section>
              <SectionHeader count={citations.length}>Evidence sources</SectionHeader>
              <div className="mt-3 grid gap-2">
                {citations.map((citation) => (
                  <div className="rounded-md border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3" key={`${citation.label}-${citation.href ?? citation.detail}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{citation.label}</div>
                        <p className="mt-0.5 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{citation.detail}</p>
                      </div>
                      {citation.href ? (
                        <a
                          className="shrink-0 text-[0.68rem] font-semibold text-[color:var(--accent)] hover:underline"
                          href={citation.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {assumptionItems.length > 0 ? (
            <section>
              <SectionHeader count={assumptionItems.length}>Assumptions</SectionHeader>
              <div className="mt-3 grid gap-2">
                {assumptionItems.map((item) => (
                  <div className={`rounded-md border px-3 py-3 ${getToneShellClass(item.tone)}`} key={`${item.label}-${item.detail}`}>
                    <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{item.label}</div>
                    <p className="mt-0.5 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Warnings */}
        {warnings.length > 0 ? (
          <section>
            <SectionHeader count={warnings.length}>Warnings</SectionHeader>
            <div className="mt-3 grid gap-2">
              {warnings.map((warning) => (
                <div className="rounded-md border border-[color:var(--warning)] bg-[color:var(--warning-soft)] px-3 py-3 text-[0.78rem] leading-5 text-[color:var(--warning-ink)]" key={warning}>
                  {warning}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SurfacePanel>
  );
}
