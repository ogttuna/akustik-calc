"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Pill, SurfacePanel } from "@dynecho/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { AirborneTracePanel } from "./airborne-trace-panel";
import { ImpactResultPanel } from "./impact-result-panel";
import { ImpactTracePanel } from "./impact-trace-panel";
import { ResultSummary } from "./result-summary";
import { buildSimpleWorkbenchDiagnosticsDossier } from "./simple-workbench-diagnostics-dossier";
import type {
  SimpleWorkbenchProposalCitation,
  SimpleWorkbenchProposalDecisionItem
} from "./simple-workbench-evidence";
import type { SimpleWorkbenchMethodTraceGroup } from "./simple-workbench-method-dossier";
import type { StudyMode } from "./preset-definitions";
import type { SimpleWorkbenchProposalLayer } from "./simple-workbench-proposal";
import { ValidationRegimePanel } from "./validation-regime-panel";

type SimpleWorkbenchDiagnosticsPanelProps = {
  branchLabel: string;
  citations: readonly SimpleWorkbenchProposalCitation[];
  decisionTrailHeadline: string;
  decisionTrailItems: readonly SimpleWorkbenchProposalDecisionItem[];
  layers: readonly SimpleWorkbenchProposalLayer[];
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
  studyModeLabel: string;
  traceGroups: readonly SimpleWorkbenchMethodTraceGroup[];
  validationDetail: string;
  validationLabel: string;
  warnings: readonly string[];
};

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

export function SimpleWorkbenchDiagnosticsPanel(props: SimpleWorkbenchDiagnosticsPanelProps) {
  const dossier = buildSimpleWorkbenchDiagnosticsDossier({
    branchLabel: props.branchLabel,
    citations: props.citations,
    decisionTrailHeadline: props.decisionTrailHeadline,
    decisionTrailItems: props.decisionTrailItems,
    result: props.result,
    validationDetail: props.validationDetail,
    validationLabel: props.validationLabel,
    warnings: props.warnings
  });

  return (
    <div className="grid gap-6">
      <SurfacePanel className="px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="eyebrow">Diagnostics</div>
          <Link
            className="focus-ring inline-flex items-center gap-1.5 rounded border border-[color:var(--line)] px-2.5 py-1.5 text-[0.72rem] font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            href="/workbench?view=advanced"
          >
            Operator desk
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">{dossier.headline}</p>

        {/* Status cards */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {dossier.cards.map((card) => (
            <article className="rounded-md border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3" key={`${card.label}-${card.value}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{card.label}</div>
                <Pill tone={card.tone}>{card.value}</Pill>
              </div>
              <p className="mt-1.5 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{card.detail}</p>
            </article>
          ))}
        </div>

        {/* Decision trail + Sources */}
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {props.decisionTrailItems.length > 0 ? (
            <section>
              <SectionHeader count={props.decisionTrailItems.length}>Decision trail</SectionHeader>
              <div className="mt-3 grid gap-2">
                {props.decisionTrailItems.slice(0, 4).map((item) => (
                  <div className="rounded-md border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3" key={`${item.label}-${item.detail}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[0.72rem] font-semibold text-[color:var(--ink)]">{item.label}</div>
                      <Pill tone={item.tone}>{item.tone.replaceAll("_", " ")}</Pill>
                    </div>
                    <p className="mt-1 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {props.citations.length > 0 ? (
            <section>
              <SectionHeader count={props.citations.length}>Sources</SectionHeader>
              <div className="mt-3 grid gap-2">
                {props.citations.slice(0, 4).map((citation) => (
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
        </div>

        {/* Warnings */}
        {props.warnings.length > 0 ? (
          <section className="mt-5">
            <SectionHeader count={props.warnings.length}>Warnings</SectionHeader>
            <div className="mt-3 grid gap-2">
              {props.warnings.map((warning) => (
                <div className="rounded-md border border-[color:var(--warning)] bg-[color:var(--warning-soft)] px-3 py-3 text-[0.78rem] leading-5 text-[color:var(--warning-ink)]" key={warning}>
                  {warning}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </SurfacePanel>

      <ResultSummary result={props.result} warnings={props.warnings} />
      {props.studyMode === "floor" ? <ImpactResultPanel result={props.result} /> : null}
      <ValidationRegimePanel result={props.result} />
      <AirborneTracePanel result={props.result} />
      <ImpactTracePanel result={props.result} />
    </div>
  );
}
