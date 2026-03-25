"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Pill, SurfacePanel } from "@dynecho/ui";
import { Activity, ChevronRight, ClipboardList, Library, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AirborneTracePanel } from "./airborne-trace-panel";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { ImpactResultPanel } from "./impact-result-panel";
import { ImpactTracePanel } from "./impact-trace-panel";
import { ResultSummary } from "./result-summary";
import { buildSimpleWorkbenchDiagnosticsDossier } from "./simple-workbench-diagnostics-dossier";
import { SimpleWorkbenchProposalConstructionFigure } from "./simple-workbench-proposal-construction-figure";
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

function DiagnosticCard(props: { detail: string; label: string; tone: "accent" | "neutral" | "success" | "warning"; value: string }) {
  const { detail, label, tone, value } = props;

  return (
    <article className="rounded-md border hairline bg-[color:var(--paper)]/78 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
        <Pill tone={tone}>{value}</Pill>
      </div>
      <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

function DiagnosticTraceGroupCard(props: SimpleWorkbenchMethodTraceGroup) {
  const { detail, label, notes, tone, value } = props;

  return (
    <article className="rounded-md border hairline bg-[color:var(--paper)] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{label}</div>
        <Pill tone={tone}>{value}</Pill>
      </div>
      <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">{detail}</p>
      <div className="mt-4 grid gap-2">
        {notes.map((note) => (
          <div className="rounded border hairline bg-black/[0.025] px-3 py-3 text-sm leading-6 text-[color:var(--ink-soft)]" key={`${label}-${note}`}>
            {note}
          </div>
        ))}
      </div>
    </article>
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
  const corridorDossier = buildSimpleWorkbenchCorridorDossier(props.result, props.studyMode);
  const selectedTraceNoteCount = props.traceGroups.reduce((count, group) => count + group.notes.length, 0);

  return (
    <div className="grid gap-6">
      <SurfacePanel className="px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="eyebrow">Diagnostics</div>
            <h2 className="mt-1 font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
              Provenance, confidence, and advanced traces
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">{dossier.headline}</p>
          </div>
          <Link
            className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
            href="/workbench?view=advanced"
          >
            Open operator desk
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {dossier.cards.map((card) => (
            <DiagnosticCard detail={card.detail} key={`${card.label}-${card.value}`} label={card.label} tone={card.tone} value={card.value} />
          ))}
        </div>

        <section className="mt-5 rounded-md border hairline bg-[color:var(--paper)]/76 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[color:var(--ink)]">Validation corridor package</div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">{corridorDossier.headline}</p>
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {corridorDossier.cards.length} card{corridorDossier.cards.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="mt-4 grid gap-3 xl:grid-cols-4">
            {corridorDossier.cards.map((card) => (
              <DiagnosticCard detail={card.detail} key={`${card.label}-${card.value}`} label={card.label} tone={card.tone} value={card.value} />
            ))}
          </div>
        </section>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <section className="rounded-md border hairline bg-[color:var(--paper)]/76 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ClipboardList className="h-4 w-4" />
              Decision trail signal
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{props.decisionTrailHeadline}</p>
            <div className="mt-4 grid gap-3">
              {props.decisionTrailItems.slice(0, 4).map((item) => (
                <div className="rounded border hairline bg-[color:var(--paper)] px-4 py-4" key={`${item.label}-${item.detail}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{item.label}</div>
                    <Pill tone={item.tone}>{item.tone.replaceAll("_", " ")}</Pill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border hairline bg-[color:var(--paper)]/76 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Library className="h-4 w-4" />
              Source posture board
            </div>
            <div className="mt-4 grid gap-3">
              {props.citations.slice(0, 4).map((citation) => (
                <article className="rounded border hairline bg-[color:var(--paper)] px-4 py-4" key={`${citation.label}-${citation.href ?? citation.detail}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{citation.label}</div>
                    <Pill tone={citation.tone}>{citation.tone}</Pill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{citation.detail}</p>
                  {citation.href ? (
                    <a
                      className="mt-3 inline-flex text-sm font-semibold text-[color:var(--accent)] underline decoration-[color:color-mix(in_oklch,var(--accent)_60%,transparent)] underline-offset-4"
                      href={citation.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open source
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>

        {props.traceGroups.length > 0 ? (
          <section className="mt-5 rounded-md border hairline bg-[color:var(--paper)]/76 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">Selected route notes</div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">
                  The guided diagnostics rail now reuses the same selected solver-note set that travels into method detail and the
                  PDF appendix.
                </p>
              </div>
              <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {props.traceGroups.length} trace group{props.traceGroups.length === 1 ? "" : "s"} · {selectedTraceNoteCount} selected note
                {selectedTraceNoteCount === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {props.traceGroups.map((group) => (
                <DiagnosticTraceGroupCard {...group} key={`${group.label}-${group.value}`} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-5 rounded-md border hairline bg-[color:var(--paper)]/76 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[color:var(--ink)]">Visible stack section</div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">
                Keep the trace and provenance boards anchored to the same solver-order section that now ships in the proposal and branded PDF.
              </p>
            </div>
            <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {props.layers.length} row{props.layers.length === 1 ? "" : "s"}
            </div>
          </div>
          <div className="mt-4">
            <SimpleWorkbenchProposalConstructionFigure layers={props.layers} studyModeLabel={props.studyModeLabel} />
          </div>
        </section>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <Activity className="h-4 w-4" />
              Trace availability
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              Use this board when a consultant needs to confirm whether the guided result is backed by dynamic airborne trace, impact trace, airborne overlay, or only the visible screening curve.
            </p>
          </div>
          <div
            className={`rounded-md border px-4 py-4 ${
              props.warnings.length > 0
                ? "border-[color:color-mix(in_oklch,var(--warning)_28%,var(--line))] bg-[color:var(--warning-soft)]/70"
                : "hairline bg-[color:var(--paper)]/72"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              {props.warnings.length > 0 ? (
                <ShieldAlert className="h-4 w-4 text-[color:var(--warning-ink)]" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-[color:var(--success-ink)]" />
              )}
              Warning discipline
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              {props.warnings.length > 0
                ? `${props.warnings.length} live warning${props.warnings.length === 1 ? "" : "s"} stay explicit here and in the proposal package.`
                : "No live warning is currently active on the guided route."}
            </p>
          </div>
        </div>
      </SurfacePanel>

      <ResultSummary result={props.result} warnings={props.warnings} />
      {props.studyMode === "floor" ? <ImpactResultPanel result={props.result} /> : null}
      <ValidationRegimePanel result={props.result} />
      <AirborneTracePanel result={props.result} />
      <ImpactTracePanel result={props.result} />
    </div>
  );
}
