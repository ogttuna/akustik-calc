"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { ChevronRight } from "lucide-react";
import { cloneElement, isValidElement, type ReactElement, type ReactNode, useId } from "react";

import { formatDecimal } from "@/lib/format";

import type { StudyMode } from "./preset-definitions";
import type { FieldRelevanceTone, ReviewTabId, WorkbenchSectionTone } from "./simple-workbench-constants";

export function SectionLead(props: { description?: string; step?: string; title: string; tone?: WorkbenchSectionTone }) {
  const { description, step, title } = props;

  return (
    <div className="min-w-0">
      {step ? (
        <div className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">{step}</div>
      ) : null}
      <h2 className="text-sm font-semibold text-[color:var(--ink)]">{title}</h2>
      {description ? <p className="mt-0.5 max-w-2xl text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{description}</p> : null}
    </div>
  );
}

export function WorkspacePanelButton(props: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const { active, label, onClick } = props;

  return (
    <button
      aria-pressed={active}
      className={`focus-ring inline-flex items-center justify-center border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-[color:var(--accent)] text-[color:var(--ink)]"
          : "border-transparent text-[color:var(--ink-faint)] hover:text-[color:var(--ink-soft)]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function GuidedRouteRow(props: { detail: string; label: string; value: string; tone?: WorkbenchSectionTone }) {
  const { detail, label, value } = props;

  return (
    <div className="flex min-w-0 items-baseline justify-between gap-3 px-1 py-1.5">
      <div className="min-w-0">
        <div className="text-[0.64rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">{label}</div>
        <p className="mt-0.5 line-clamp-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
      </div>
      <div className="shrink-0 text-right text-[0.84rem] font-semibold tabular-nums leading-5 text-[color:var(--ink)]">{value}</div>
    </div>
  );
}

export function GuidedFactChip(props: { children: ReactNode; tone?: "neutral" | "warning" }) {
  const { children, tone = "neutral" } = props;
  const toneClass =
    tone === "warning"
      ? "border-[color:var(--warning)] bg-[color:var(--warning-soft)] text-[color:var(--warning-ink)]"
      : "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]";

  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[0.7rem] font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

export function DetailTag(props: { children: ReactNode; tone?: "neutral" | FieldRelevanceTone }) {
  const { children, tone = "neutral" } = props;
  const toneClass =
    tone === "required"
      ? "border border-[color:var(--warning)] bg-[color:var(--warning-soft)] text-[color:var(--warning-ink)]"
      : tone === "optional"
        ? "border border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
        : "border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]";

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] ${toneClass}`}>
      {children}
    </span>
  );
}

export function InlinePair(props: { label: string; value: string }) {
  const { label, value } = props;

  return (
    <div className="grid min-w-0 gap-1 overflow-hidden rounded-md border hairline bg-[color:var(--paper)]/72 px-3 py-2.5">
      <div className="break-words text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.16em] text-[color:var(--ink-faint)]">
        {label}
      </div>
      <div className="min-w-0 break-words text-[0.98rem] font-semibold leading-6 text-[color:var(--ink)]">{value}</div>
    </div>
  );
}

export function FieldShell(props: {
  advisory?: string | null;
  children: ReactNode;
  label: string;
  note: string;
  relevance?: FieldRelevanceTone;
  usage: string;
  warning?: string | null;
}) {
  const { children, label, warning } = props;
  const fallbackControlId = useId();
  const warningId = warning ? `${fallbackControlId}-warning` : undefined;
  const existingControlId =
    isValidElement(children) && typeof children.props.id === "string" && children.props.id.trim().length > 0
      ? children.props.id
      : null;
  const controlId = existingControlId ?? fallbackControlId;
  const describedBy =
    isValidElement(children) && typeof children.props["aria-describedby"] === "string"
      ? [children.props["aria-describedby"], warningId].filter(Boolean).join(" ")
      : warningId;
  const control =
    isValidElement(children)
      ? cloneElement(
          children as ReactElement<{
            "aria-describedby"?: string;
            id?: string;
          }>,
          {
            "aria-describedby": describedBy || undefined,
            id: controlId
          }
        )
      : children;

  return (
    <div className="grid min-w-0 gap-1">
      <label className="text-[0.78rem] font-medium text-[color:var(--ink)]" htmlFor={controlId}>
        {label}
      </label>
      {warning ? <p className="text-[0.68rem] leading-4 text-[color:var(--warning-ink)]" id={warningId}>{warning}</p> : null}
      {control}
    </div>
  );
}

export function ContextBucket(props: {
  children?: ReactNode;
  description: string;
  hasContent: boolean;
  title: string;
  tone: FieldRelevanceTone;
}) {
  const { children, hasContent, title, tone } = props;

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{title}</div>
        <div className="h-px flex-1 bg-[color:var(--line)]" />
        <DetailTag tone={tone}>{tone === "required" ? "Required" : "Optional"}</DetailTag>
      </div>

      {hasContent ? (
        <div className="mt-3 grid gap-3">{children}</div>
      ) : null}
    </div>
  );
}

export function ContextSubsection(props: {
  children: ReactNode;
  note: string;
  title: string;
}) {
  const { children, title } = props;

  return (
    <div className="grid gap-3">
      <div className="text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">{title}</div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

export function ReviewTabButton(props: {
  active: boolean;
  controlsId: string;
  id: ReviewTabId;
  label: string;
  onSelect: (id: ReviewTabId) => void;
}) {
  const { active, controlsId, id, label, onSelect } = props;

  return (
    <button
      aria-controls={controlsId}
      aria-selected={active}
      className={`focus-ring inline-flex items-center rounded border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--ink)]"
          : "hairline bg-[color:var(--paper)]/74 text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
      }`}
      id={`guided-review-tab-${id}`}
      onClick={() => onSelect(id)}
      role="tab"
      type="button"
    >
      {label}
    </button>
  );
}

export function GuidedSelectField(props: {
  children: ReactNode;
  label: string;
  note: string;
}) {
  const { children, label, note } = props;

  return (
    <label className="grid min-w-0 gap-2">
      <div className="min-w-0">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">{label}</span>
        <p className="mt-1 text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{note}</p>
      </div>
      {children}
    </label>
  );
}

export function CalculationTraceDropdown(props: { result: AssemblyCalculation | null; studyMode: StudyMode }) {
  const { result, studyMode } = props;

  if (!result) {
    return null;
  }

  const dynamicTrace = result.dynamicAirborneTrace ?? null;
  const dynamicImpactTrace = result.dynamicImpactTrace ?? null;
  const overlay = result.airborneOverlay ?? null;
  const impactSupport = result.impactSupport ?? null;
  const lowerBound = result.lowerBoundImpact ?? null;

  const traceRows: { label: string; value: string }[] = [];

  // Airborne method
  if (dynamicTrace) {
    traceRows.push(
      { label: "Airborne method", value: `${dynamicTrace.selectedLabel} · ${dynamicTrace.strategy.replaceAll("_", " ")}` },
      { label: "Detected family", value: dynamicTrace.detectedFamilyLabel },
      { label: "Confidence", value: `${Math.round(dynamicTrace.confidenceScore * 100)}% (${dynamicTrace.confidenceClass})` },
      { label: "Solver spread", value: `${dynamicTrace.solverSpreadRwDb} dB across ${dynamicTrace.candidateMethods.length} candidates` }
    );
  } else {
    traceRows.push({ label: "Method", value: result.metrics.method });
  }

  // Airborne result
  traceRows.push(
    { label: "Rw (base)", value: overlay ? `${formatDecimal(overlay.baseRwDb)} dB` : `${formatDecimal(result.metrics.estimatedRwDb)} dB` }
  );

  if (overlay && overlay.baseRwDb !== overlay.finalRwDb) {
    traceRows.push({ label: "Rw (final)", value: `${formatDecimal(overlay.finalRwDb)} dB` });
  }

  // Penalties
  if (overlay?.leakagePenaltyApplied) {
    traceRows.push({ label: "Leakage penalty", value: `−${formatDecimal(overlay.leakagePenaltyDb)} dB` });
  }
  if (overlay?.fieldFlankingPenaltyApplied) {
    traceRows.push({ label: "Field flanking penalty", value: `−${formatDecimal(overlay.fieldFlankingPenaltyDb)} dB` });
  }

  // Assembly
  traceRows.push(
    { label: "Surface mass", value: `${formatDecimal(result.metrics.surfaceMassKgM2)} kg/m²` },
    { label: "Total thickness", value: `${formatDecimal(result.metrics.totalThicknessMm)} mm` },
    { label: "Gaps / insulation", value: `${result.metrics.airGapCount} / ${result.metrics.insulationCount}` }
  );

  // Impact (floor mode)
  if (studyMode === "floor" && dynamicImpactTrace) {
    traceRows.push(
      { label: "Impact lane", value: `${dynamicImpactTrace.selectedLabel} · ${dynamicImpactTrace.evidenceTierLabel}` },
      { label: "Impact basis", value: dynamicImpactTrace.impactBasisLabel }
    );
    if (dynamicImpactTrace.detectedSupportFamily) {
      traceRows.push({ label: "Support family", value: dynamicImpactTrace.detectedSupportFamilyLabel ?? dynamicImpactTrace.detectedSupportFamily });
    }
    if (dynamicImpactTrace.fieldContinuation !== "none") {
      traceRows.push({ label: "Field continuation", value: dynamicImpactTrace.fieldContinuationLabel });
    }
  }
  if (studyMode === "floor" && impactSupport) {
    traceRows.push({ label: "Support basis", value: impactSupport.basis });
  }
  if (studyMode === "floor" && lowerBound && typeof lowerBound.LnWUpperBound === "number") {
    traceRows.push({ label: "Ln,w upper bound", value: `≤ ${formatDecimal(lowerBound.LnWUpperBound)} dB` });
  }

  // Formula notes (first few from dynamic trace)
  const formulaNotes: string[] = [
    ...(dynamicTrace?.notes ?? []).slice(0, 3),
    ...(overlay?.notes ?? []).slice(0, 2),
    ...(impactSupport?.formulaNotes ?? []).slice(0, 2)
  ];

  return (
    <details className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="text-sm font-semibold text-[color:var(--ink)]">Calculation trace</div>
        <ChevronRight className="h-3.5 w-3.5 text-[color:var(--ink-faint)] transition-transform [[open]>&]:rotate-90" />
      </summary>
      <div className="mt-3 grid gap-px overflow-hidden rounded border border-[color:var(--line)]">
        {traceRows.map((row) => (
          <div className="flex items-baseline justify-between gap-3 bg-[color:var(--panel)] px-3 py-1.5" key={row.label}>
            <span className="text-[0.72rem] text-[color:var(--ink-faint)]">{row.label}</span>
            <span className="text-right text-[0.72rem] font-medium tabular-nums text-[color:var(--ink)]">{row.value}</span>
          </div>
        ))}
      </div>
      {formulaNotes.length > 0 ? (
        <details className="mt-3">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-[0.72rem] font-medium text-[color:var(--ink-soft)] [&::-webkit-details-marker]:hidden">
            <ChevronRight className="h-3 w-3 text-[color:var(--ink-faint)] transition-transform [[open]>&]:rotate-90" />
            {formulaNotes.length} formula note{formulaNotes.length === 1 ? "" : "s"}
          </summary>
          <div className="mt-2 grid gap-1.5">
            {formulaNotes.map((note) => (
              <div className="rounded bg-[color:var(--panel)] px-3 py-2 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]" key={note}>
                {note}
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </details>
  );
}
