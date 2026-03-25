"use client";

import type { AirborneFlankingPath, AssemblyCalculation, DynamicAirborneCandidate } from "@dynecho/shared";
import { AudioWaveform, Network, ShieldAlert, ShieldCheck } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { selectSimpleWorkbenchTraceNotes } from "./simple-workbench-trace-notes";

type AirborneTracePanelProps = {
  result: AssemblyCalculation | null;
};

function formatDetectedFamily(value: string): string {
  return value.replaceAll("_", " ");
}

export function AirborneTracePanel({ result }: AirborneTracePanelProps) {
  const overlay = result?.airborneOverlay ?? null;
  const dynamicTrace = result?.dynamicAirborneTrace ?? null;
  const dynamicNoteSelection = selectSimpleWorkbenchTraceNotes(dynamicTrace?.notes ?? []);
  const overlayNoteSelection = selectSimpleWorkbenchTraceNotes(overlay?.notes ?? []);
  const hiddenNoteCount = dynamicNoteSelection.hiddenCount + overlayNoteSelection.hiddenCount;

  if (!overlay && !dynamicTrace) {
    return null;
  }

  const activePaths = overlay?.junctionFlankingGraph?.paths.filter((path: AirborneFlankingPath) => path.active) ?? [];

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Airborne trace</Pill>
        {result?.calculatorLabel ? <Pill tone={result.calculatorId === "dynamic" ? "accent" : "neutral"}>{result.calculatorLabel}</Pill> : null}
        {dynamicTrace ? (
          <Pill tone={dynamicTrace.confidenceClass === "high" ? "success" : dynamicTrace.confidenceClass === "medium" ? "accent" : "warning"}>
            {dynamicTrace.detectedFamilyLabel}
          </Pill>
        ) : null}
        {overlay ? (
          <Pill tone={overlay.fieldFlankingPenaltyApplied || overlay.leakagePenaltyApplied ? "warning" : "success"}>
            {overlay.fieldFlankingPenaltyApplied || overlay.leakagePenaltyApplied ? "Overlay applied" : "Lab-clean"}
          </Pill>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Wall-side explanatory trace</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">
          {dynamicTrace ? "Dynamic selector and airborne overlay lineage" : "Leakage and flanking overlay lineage"}
        </h2>
      </div>

      {dynamicTrace ? (
        <div className="mt-5 rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="accent">Dynamic selector</Pill>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
              {Math.round(dynamicTrace.confidenceScore * 100)}% {dynamicTrace.confidenceClass} confidence
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Detected family" value={dynamicTrace.detectedFamilyLabel} detail={`${dynamicTrace.visibleLeafCount} visible leaves · ${dynamicTrace.cavityCount} cavity zones`} />
            <MetricCard label="Anchor method" value={dynamicTrace.selectedLabel} detail={dynamicTrace.strategy.replaceAll("_", " ")} />
            <MetricCard label="Solver spread" value={`${formatDecimal(dynamicTrace.solverSpreadRwDb)} dB`} detail="Rw spread across local delegate candidates" />
            <MetricCard label="Cavity + fill" value={`${dynamicTrace.totalGapThicknessMm} / ${dynamicTrace.porousLayerCount}`} detail="Explicit gap thickness mm / porous layer count" />
            <MetricCard label="Support cues" value={String(dynamicTrace.supportLayerCount)} detail={dynamicTrace.hasStudLikeSupport ? "Stud-like or support layers detected" : "No stud-like support layers detected"} />
          </div>

          <ul className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {dynamicTrace.candidateMethods.map((candidate: DynamicAirborneCandidate) => (
              <li key={candidate.method}>
                - <span className="font-semibold text-[color:var(--ink)]">{candidate.label}</span>: {formatDecimal(candidate.rwDb)} dB{candidate.selected ? " (anchor)" : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {overlay ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Base Rw" value={`${formatDecimal(overlay.baseRwDb)} dB`} detail="Lab-clean airborne curve before overlays" />
          <MetricCard label="Final Rw" value={`${formatDecimal(overlay.finalRwDb)} dB`} detail="Visible wall result after active airborne overlays" />
          <MetricCard label="Leakage penalty" value={overlay.leakagePenaltyApplied ? `${formatDecimal(overlay.leakagePenaltyDb)} dB` : "N/A"} detail="Airtightness / perimeter / penetration lane" />
          <MetricCard label="Field penalty" value={overlay.fieldFlankingPenaltyApplied ? `${formatDecimal(overlay.fieldFlankingPenaltyDb)} dB` : "N/A"} detail="Conservative junction/flanking path graph" />
          <MetricCard label="Detected family" value={formatDetectedFamily(overlay.detectedFamily)} detail={`Context mode: ${overlay.contextMode.replaceAll("_", " ")}`} />
        </div>
      ) : null}

      {overlay?.junctionFlankingGraph ? (
        <div className="mt-5 rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="neutral">Junction graph</Pill>
            <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)]">
              {overlay.junctionFlankingGraph.totalPenaltyDb} dB total conservative field penalty
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active paths" value={String(activePaths.length)} detail="Only active paths contribute to the conservative total" />
            <MetricCard label="Graph model" value="heuristic additive" detail="Upstream-aligned structured trace, not a hidden magic penalty" />
            <MetricCard label="Base STC" value={`${formatDecimal(overlay.baseStc)} dB`} detail="Before airborne overlays" />
            <MetricCard label="Final STC" value={`${formatDecimal(overlay.finalStc)} dB`} detail="After airborne overlays" />
          </div>

          <ul className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {activePaths.length > 0 ? activePaths.map((path: AirborneFlankingPath) => (
              <li key={path.id}>
                - <span className="font-semibold text-[color:var(--ink)]">{path.label}</span>: {formatDecimal(path.severityDb)} dB. {path.note}
              </li>
            )) : (
              <li>- No explicit flanking-path penalties are active on the current airborne lane.</li>
            )}
          </ul>
        </div>
      ) : null}

      {dynamicNoteSelection.totalCount > 0 || overlayNoteSelection.totalCount > 0 ? (
        <div className="mt-5 rounded-md border hairline bg-[color:var(--paper)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone="accent">Formula notes</Pill>
            {overlay && (overlay.fieldFlankingPenaltyApplied || overlay.leakagePenaltyApplied) ? (
              <ShieldAlert className="h-4 w-4 text-[color:var(--warning-ink)]" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-[color:var(--success-ink)]" />
            )}
            <AudioWaveform className="h-4 w-4 text-[color:var(--ink-soft)]" />
            <Network className="h-4 w-4 text-[color:var(--ink-soft)]" />
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            {dynamicNoteSelection.notes.map((note: string) => (
              <li key={note}>- {note}</li>
            ))}
            {overlayNoteSelection.notes.map((note: string) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
          {hiddenNoteCount > 0 ? (
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {hiddenNoteCount} additional raw note{hiddenNoteCount === 1 ? "" : "s"} remain available on the advanced desk.
            </p>
          ) : null}
        </div>
      ) : null}
    </SurfacePanel>
  );
}
