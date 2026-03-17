"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Download, FileText, Files, Radar, ScrollText, ShieldCheck } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  formatImpactValidationTolerance,
  getActiveValidationFamily,
  getActiveValidationMode,
  IMPACT_VALIDATION_CORPUS_SUMMARY
} from "./validation-regime";
import type { ValidationPosture } from "./validation-regime";
import type { ExportStatus } from "./use-report-export-actions";

type ReportExportPanelProps = {
  exportStatus: ExportStatus;
  fileName: string;
  result: AssemblyCalculation | null;
  requestedOutputCount: number;
  savedScenarioCount: number;
  onCopyReport: () => void | Promise<void>;
  onDownloadReport: () => void;
};

const STATUS_COPY: Record<ExportStatus, { detail: string; tone: "neutral" | "success" | "warning" }> = {
  copied: {
    detail: "Markdown copied",
    tone: "success"
  },
  downloaded: {
    detail: "Markdown downloaded",
    tone: "success"
  },
  error: {
    detail: "Export needs browser permission",
    tone: "warning"
  },
  idle: {
    detail: "Markdown issue-ready",
    tone: "neutral"
  }
};

function getPostureTone(posture: ValidationPosture["posture"]): "accent" | "neutral" | "success" | "warning" {
  switch (posture) {
    case "exact":
      return "success";
    case "estimate":
      return "accent";
    case "low_confidence":
      return "warning";
    case "bound":
      return "warning";
    case "inactive":
      return "neutral";
  }
}

export function ReportExportPanel({
  exportStatus,
  fileName,
  onCopyReport,
  onDownloadReport,
  result,
  requestedOutputCount,
  savedScenarioCount
}: ReportExportPanelProps) {
  const status = STATUS_COPY[exportStatus];
  const impactPosture = describeImpactValidationPosture(result);
  const airbornePosture = describeAirborneValidationPosture(result);
  const activeFamily = getActiveValidationFamily(result);
  const activeMode = getActiveValidationMode(result);

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Reporting lane</Pill>
        <Pill tone={status.tone}>{status.detail}</Pill>
        <Pill tone={getPostureTone(impactPosture.posture)}>{impactPosture.label}</Pill>
        {activeFamily ? <Pill tone="neutral">{activeFamily.label}</Pill> : null}
        {activeMode ? <Pill tone="neutral">{activeMode.label}</Pill> : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Deliverables</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Issue-ready report surface</h2>
        <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
          Acoustic work usually leaves the calculator and enters email, specifications, and consultant notes. This
          panel turns the live stack into a portable markdown brief without touching upstream research code.
        </p>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[1.3rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <FileText className="h-4 w-4" />
            Included now
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            Project brief, targets, live Rw/C/Ctr/STC ratings, impact confidence and provenance notes, guide/manual
            supplement metrics when configured, saved scenario summaries, warnings, assumption log, validation
            posture, active family corridor, and benchmark mode ladder snapshot.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill tone={getPostureTone(impactPosture.posture)}>Impact: {impactPosture.label}</Pill>
            <Pill tone={getPostureTone(airbornePosture.posture)}>Airborne: {airbornePosture.label}</Pill>
            {activeFamily ? <Pill tone="accent">Family: {activeFamily.label}</Pill> : null}
            {activeMode ? <Pill tone="accent">Mode: {activeMode.label}</Pill> : null}
          </div>
        </article>
        <div className="grid gap-3">
          <article className="rounded-[1.3rem] border hairline bg-black/[0.03] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ShieldCheck className="h-4 w-4" />
              Validation carried into file
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              {activeMode
                ? `${activeMode.label} is the active benchmark ladder. ${
                    activeFamily ? `${activeFamily.label} is the active tolerance corridor.` : "No family corridor is locked yet."
                  }`
                : "The report will still include the validation posture block, but no benchmark mode is locked yet."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="neutral">
                {IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkCases} cases / {IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkModesTracked} modes
              </Pill>
              <Pill tone="neutral">
                {IMPACT_VALIDATION_CORPUS_SUMMARY.familiesTracked} families / {formatImpactValidationTolerance(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb)}
              </Pill>
            </div>
          </article>

          <article className="rounded-[1.3rem] border hairline bg-black/[0.025] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
              <ScrollText className="h-4 w-4" />
              Still staged
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              Any output outside the active family corridor, benchmark mode ladder, or requested-output support map
              stays explicit. Broader ASTM parity adapters, automatic CI families, and unsupported field chains are not
              collapsed into fake certainty.
            </p>
          </article>
        </div>
      </div>

      <div className="mt-5 rounded-[1.3rem] border hairline bg-black/[0.025] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[color:var(--ink)]">{fileName}</div>
            <p className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
              {requestedOutputCount} requested output{requestedOutputCount === 1 ? "" : "s"} and {savedScenarioCount} saved scenario
              {savedScenarioCount === 1 ? "" : "s"} summarized.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            <Radar className="h-4 w-4" />
            Markdown carries corridor status and benchmark scope
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="focus-ring touch-target inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
              onClick={() => void onCopyReport()}
              type="button"
            >
              <Files className="h-4 w-4" />
              Copy markdown
            </button>
            <button
              className="focus-ring touch-target inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
              onClick={onDownloadReport}
              type="button"
            >
              <Download className="h-4 w-4" />
              Download file
            </button>
          </div>
        </div>
      </div>
    </SurfacePanel>
  );
}
