import type { ImpactGuideDerivation } from "@dynecho/engine";
import type { AssemblyCalculation, ReportProfile, RequestedOutputId, StudyContext } from "@dynecho/shared";
import { ClipboardCheck, FileWarning, NotebookText, RadioTower, Route, ShieldCheck } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import type { CriteriaPack } from "./criteria-packs";
import type { FieldRiskSummary } from "./field-risk-model";
import {
  REPORT_PROFILE_LABELS,
  STUDY_CONTEXT_LABELS
} from "./workbench-data";
import { getFieldAirborneProvenanceSummary } from "./field-airborne-provenance";
import { describeConfidence, formatConfidenceLevel } from "./impact-confidence-view";
import { getImpactLaneKind } from "./impact-lane-view";
import { summarizeTargetOutputs } from "./target-output-status";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  getActiveValidationFamily,
  getActiveValidationMode
} from "./validation-regime";

type DeliveryAssistPanelProps = {
  activeCriteriaPack: CriteriaPack;
  briefNote: string;
  fieldRiskSummary: FieldRiskSummary;
  guideResult: ImpactGuideDerivation | null;
  reportProfile: ReportProfile;
  requestedOutputs: readonly RequestedOutputId[];
  result: AssemblyCalculation | null;
  savedScenarioCount: number;
  studyContext: StudyContext;
};

export function DeliveryAssistPanel({
  activeCriteriaPack,
  briefNote,
  fieldRiskSummary,
  guideResult,
  reportProfile,
  requestedOutputs,
  result,
  savedScenarioCount,
  studyContext
}: DeliveryAssistPanelProps) {
  const outputSummary = summarizeTargetOutputs({
    guideResult,
    outputs: requestedOutputs,
    result
  });
  const hasBriefNote = briefNote.trim().length > 0;
  const effectiveImpact = result?.impact ?? result?.floorSystemMatch?.impact ?? result?.floorSystemEstimate?.impact ?? null;
  const effectiveLaneKind = getImpactLaneKind({
    impact: effectiveImpact,
    lowerBoundImpact: result?.lowerBoundImpact
  });
  const impactValidationPosture = describeImpactValidationPosture(result);
  const airborneValidationPosture = describeAirborneValidationPosture(result);
  const activeValidationFamily = getActiveValidationFamily(result);
  const activeValidationMode = getActiveValidationMode(result);
  const fieldAirborneProvenance = getFieldAirborneProvenanceSummary(result);
  const impactHeadline =
    effectiveImpact
      ? typeof effectiveImpact.LnTA === "number"
          ? `LnT,A ${effectiveImpact.LnTA.toFixed(1)} dB`
          : typeof effectiveImpact.LPrimeNTw === "number"
          ? `L'nT,w ${effectiveImpact.LPrimeNTw.toFixed(1)} dB`
          : typeof effectiveImpact.LPrimeNW === "number"
            ? `L'n,w ${effectiveImpact.LPrimeNW.toFixed(1)} dB`
            : typeof effectiveImpact.LnW === "number"
              ? `Ln,w ${effectiveImpact.LnW.toFixed(1)} dB`
          : null
      : null;
  const validationHeadline = !result
    ? "No live validation corridor is active yet."
    : impactValidationPosture.posture === "exact"
      ? `${activeValidationMode?.label ?? impactValidationPosture.label} is active${
          activeValidationFamily ? ` on the ${activeValidationFamily.label} corridor` : ""
        }. You can cite it as an exact lane, but keep the source row or catalog lineage visible in the brief.`
      : impactValidationPosture.posture === "bound"
        ? `${activeValidationMode?.label ?? impactValidationPosture.label} is active${
            activeValidationFamily ? ` on the ${activeValidationFamily.label} corridor` : ""
          }. Keep the delivery language conservative and write the output as a bound-supported claim instead of a measured surrogate.`
        : impactValidationPosture.posture === "estimate"
          ? `${activeValidationMode?.label ?? impactValidationPosture.label} is active${
              activeValidationFamily ? ` on the ${activeValidationFamily.label} corridor` : ""
            }. Export it as a benchmark-guarded estimate with tolerance and provenance notes, not as a lab-equivalent result.`
          : "No supported impact lane is active yet. Do not issue a floor-side claim from this stack.";

  const nextMoves = [
    `Current brief template is ${activeCriteriaPack.label}. Keep the target posture unless the live brief explicitly relaxes it.`,
    validationHeadline,
    savedScenarioCount > 0
      ? "Option studies are recorded. Save one more if you want a clear recommendation pair."
      : "Save at least one fallback scenario before iterating further.",
    hasBriefNote
      ? "Assumptions are documented. Keep adding provenance and flanking notes there."
      : "Record scope assumptions, flanking risk, and caveats before issuing results.",
    fieldRiskSummary.level === "clear"
      ? "No explicit field-risk flags are active. Keep it that way by freezing junction and procurement assumptions."
      : `Field risk board is ${fieldRiskSummary.level}. ${fieldRiskSummary.actions[0]}`,
    outputSummary.parityImport.length > 0
      ? `Requested outputs still waiting for parity import: ${outputSummary.parityImport.map((status) => status.output).join(", ")}.`
      : "No requested output is blocked purely by parity-import scope.",
    outputSummary.research.length > 0
      ? `Research-tracked outputs stay explicit: ${outputSummary.research.map((status) => status.output).join(", ")}. DynEcho will not fabricate ASTM or low-frequency ratings before the adapter and validation suite exist.`
      : "No research-only output is currently being requested.",
    outputSummary.engineLive.length + outputSummary.engineBound.length > 0
      ? effectiveImpact
        ? `${result?.floorSystemMatch ? "Curated exact floor family is active" : result?.floorSystemEstimate ? "Published family estimate is active" : effectiveLaneKind === "exact_source" ? "Exact impact source is active" : effectiveLaneKind === "official_catalog" ? "Official product lane is active" : "Scoped impact path is active"}: ${impactHeadline ?? "headline unavailable"}${typeof effectiveImpact.DeltaLw === "number" ? `, DeltaLw ${effectiveImpact.DeltaLw.toFixed(1)} dB` : ""}. ${describeConfidence(effectiveImpact.confidence)}`
        : `Engine-supported outputs are active (${[...outputSummary.engineLive, ...outputSummary.engineBound].map((status) => status.output).join(", ")}), but the current stack still does not surface an impact headline.`
      : "No scoped impact output is currently being requested.",
    outputSummary.guideReady.length > 0
      ? guideResult
        ? `Guide supplement is active${typeof guideResult.CI === "number" ? `: CI ${guideResult.CI.toFixed(1)} dB` : ""}${typeof guideResult.CI50_2500 === "number" ? `, CI,50-2500 ${guideResult.CI50_2500.toFixed(1)} dB` : ""}${typeof guideResult.LnWPlusCI === "number" ? `, Ln,w+CI ${guideResult.LnWPlusCI.toFixed(1)} dB` : ""}${typeof guideResult.LPrimeNW === "number" ? `, L'n,w ${guideResult.LPrimeNW.toFixed(1)} dB` : typeof guideResult.LPrimeNWUpperBound === "number" ? `, L'n,w <= ${guideResult.LPrimeNWUpperBound.toFixed(1)} dB` : ""}${typeof guideResult.LPrimeNTw === "number" ? `, L'nT,w ${guideResult.LPrimeNTw.toFixed(1)} dB` : typeof guideResult.LPrimeNTwUpperBound === "number" ? `, L'nT,w <= ${guideResult.LPrimeNTwUpperBound.toFixed(1)} dB` : ""}${typeof guideResult.LPrimeNT50 === "number" ? `, L'nT,50 ${guideResult.LPrimeNT50.toFixed(1)} dB` : ""}. ${formatConfidenceLevel(guideResult.confidence.level)}.`
        : `Guide-supported outputs were requested (${outputSummary.guideReady.map((status) => status.output).join(", ")}), but CI and field corrections are still incomplete.`
      : "No guide/manual supplement output is currently being requested.",
    outputSummary.unavailable.length > 0
      ? `Requested outputs currently unresolved on this path: ${outputSummary.unavailable.map((status) => status.output).join(", ")}. Keep them explicit in the brief instead of guessing.`
      : "No requested output is currently unresolved on the active path.",
    result
      ? `Live airborne package is ${result.ratings.iso717.composite} with STC ${result.metrics.estimatedStc.toFixed(1)} dB from the current screening curve.`
      : "No live curve-backed package yet. Build a valid stack before issuing a recommendation.",
    reportProfile === "lab_ready"
      ? "Lab-ready briefs need benchmark lineage and source references, not just screening metrics."
      : "Consultant-facing work can ship with screening metrics if the boundary is stated clearly.",
    result
      ? `Airborne corridor is ${airborneValidationPosture.label}. ${airborneValidationPosture.detail}`
      : "Airborne corridor will stay provisional until the stack resolves into a valid curve-backed result.",
    fieldAirborneProvenance
      ? `Field-airborne lane is currently ${fieldAirborneProvenance.label.toLowerCase()}. ${fieldAirborneProvenance.detail}`
      : "No field-airborne provenance lane is active yet.",
    studyContext === "pre_tender"
      ? "Pre-tender mode should freeze candidate stacks and export a disciplined brief."
      : "Concept and coordination modes can stay comparative and exploratory."
  ];

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <ClipboardCheck className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Delivery assist</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">From result to spec-ready action</h2>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Pill tone="neutral">{activeCriteriaPack.label}</Pill>
        <Pill tone="accent">{REPORT_PROFILE_LABELS[reportProfile]}</Pill>
        <Pill tone="neutral">{STUDY_CONTEXT_LABELS[studyContext]}</Pill>
        <Pill tone={fieldRiskSummary.tone}>{fieldRiskSummary.level}</Pill>
        <Pill tone={hasBriefNote ? "success" : "warning"}>
          {hasBriefNote ? "Assumptions logged" : "Assumption log thin"}
        </Pill>
      </div>

      <div className="mt-5 grid gap-3">
        <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <RadioTower className="h-4 w-4" />
            Evidence ladder
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            Engine-live outputs: {outputSummary.engineLive.length > 0 ? outputSummary.engineLive.map((status) => status.output).join(", ") : "none"}. Bound-support outputs:{" "}
            {outputSummary.engineBound.length > 0 ? outputSummary.engineBound.map((status) => status.output).join(", ") : "none"}. Guide/manual outputs:{" "}
            {outputSummary.guideReady.length > 0 ? outputSummary.guideReady.map((status) => status.output).join(", ") : "none"}. Unavailable outputs:{" "}
            {outputSummary.unavailable.length > 0 ? outputSummary.unavailable.map((status) => status.output).join(", ") : "none"}. Research-only families:{" "}
            {outputSummary.research.length > 0 ? outputSummary.research.map((status) => status.output).join(", ") : "none"}.
            {result ? ` Current composite: ${result.ratings.iso717.composite}.` : ""}
          </p>
        </article>

        <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <NotebookText className="h-4 w-4" />
            Project memory
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {savedScenarioCount} saved scenario{savedScenarioCount === 1 ? "" : "s"} and {result ? "one live result" : "no live result yet"} are available for comparison and export.
          </p>
        </article>

        <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <ShieldCheck className="h-4 w-4" />
            Validation corridor
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{validationHeadline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill
              tone={
                impactValidationPosture.posture === "exact"
                  ? "success"
                  : impactValidationPosture.posture === "estimate"
                    ? "accent"
                    : impactValidationPosture.posture === "bound"
                      ? "warning"
                      : "neutral"
              }
            >
              {impactValidationPosture.label}
            </Pill>
            <Pill tone="neutral">{airborneValidationPosture.label}</Pill>
            {activeValidationFamily ? <Pill tone="accent">{activeValidationFamily.label}</Pill> : null}
            {activeValidationMode ? <Pill tone="accent">{activeValidationMode.label}</Pill> : null}
          </div>
        </article>

        <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Route className="h-4 w-4" />
            Recommended next moves
          </div>
          <ul className="mt-3 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {nextMoves.map((move) => (
              <li className="rounded-md border hairline bg-[color:var(--paper)] px-4 py-3" key={move}>
                {move}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-5 rounded-lg border hairline bg-[color:var(--warning-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--warning-ink)]">
        <div className="flex items-center gap-2 font-semibold">
          <FileWarning className="h-4 w-4" />
          Useful acoustic systems need more than a number
        </div>
        <p className="mt-2">
          Users typically need provenance, alternatives, assumptions, exportable notes, and visibility into which
          outputs are fully computed versus still staged.
        </p>
      </div>
    </SurfacePanel>
  );
}
