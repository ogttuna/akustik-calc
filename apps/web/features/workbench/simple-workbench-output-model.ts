import {
  getFloorSystemC,
  getFloorSystemCtr,
  type AssemblyCalculation,
  type RequestedOutputId
} from "@dynecho/shared";

import { formatDecimal } from "@/lib/format";

import { FIELD_AIRBORNE_OUTPUTS, getFieldAirborneBlockingRequirement, getFieldAirborneLiveDetail, getFieldAirbornePendingDetail } from "./field-airborne-output";
import { FIELD_OUTPUT_OWNER_POLICY_GUARD } from "./field-output-owner-policy-copy";
import { IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL, IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL, IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL, IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL, isImpactOnlyLowConfidenceFloorLane, isImpactOnlyLowConfidenceUnavailableOutput } from "./impact-only-low-confidence-floor-lane";
import type { StudyMode } from "./preset-definitions";
import {
  REINFORCED_CONCRETE_LOW_CONFIDENCE_CTR_DETAIL,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_LNW_DETAIL,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_RW_DETAIL,
  isReinforcedConcreteLowConfidenceFloorLane
} from "./reinforced-concrete-low-confidence-floor-lane";
import { FIELD_IMPACT_OUTPUTS } from "./simple-workbench-constants";
import { buildSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";
import { formatSignedDb } from "./simple-workbench-utils";
import { getGateARAirborneBuildingPredictionOutputDetail } from "./airborne-building-prediction-surface";
import {
  WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD,
  getGateAYAdvancedWallOutputDetail
} from "./advanced-wall-source-absent-surface";
import {
  getHeavyConcreteCombinedFormulaCorridorOutputDetail,
  isHeavyConcreteCombinedFormulaCorridorImpact
} from "./heavy-concrete-combined-impact-corridor-view";
import {
  getSteelFloorFormulaCorridorOutputDetail,
  isSteelFloorFormulaCorridorImpact
} from "./steel-floor-formula-corridor-view";
import {
  getTimberCltDeltaLwFormulaCorridorOutputDetail,
  isTimberCltDeltaLwFormulaCorridorImpact
} from "./timber-clt-delta-lw-corridor-view";
import { getDoubleLeafFramedBridgeAirbornePromptDetail } from "./airborne-physical-input-prompt";
import {
  WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
  getGateSOpeningLeakCompositeOutputDetail
} from "./opening-leak-composite-surface";
import { getWallTripleLeafCalibratedSolverOutputDetail } from "./wall-triple-leaf-calibrated-solver-surface";
import { getWallTripleLeafLocalSubstitutionOutputDetail } from "./wall-triple-leaf-local-substitution-surface";
import {
  getOpenWebSupportedBandSimilarityOutputDetail,
  isOpenWebSupportedBandSimilarityResult
} from "./open-web-supported-band-similarity-surface";
import {
  getOpenWebDirectFixedLiningOutputDetail,
  isOpenWebDirectFixedLiningResult
} from "./open-web-direct-fixed-lining-surface";
import { getCompanyInternalOpeningLeakFieldBuildingOutputDetail } from "./opening-leak-field-building-surface";
import {
  getRockwoolSplitTripleLeafWithheldOutputDetail,
  getRockwoolTripleLeafScreeningPolicyCopy
} from "./rockwool-triple-leaf-screening-policy-copy";
import { REQUESTED_OUTPUT_LABELS, REQUESTED_OUTPUT_SUPPORT_NOTES } from "./workbench-data";

export type BaseOutputCardModel = {
  detail: string;
  label: string;
  output: RequestedOutputId;
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

export type OutputCardModel = BaseOutputCardModel & {
  postureDetail: string;
  postureLabel: string;
  postureTone: "accent" | "neutral" | "success" | "warning";
};

const FLOOR_ROLE_PROMPT_OUTPUTS = new Set<RequestedOutputId>(["Ln,w", "Ln,w+CI", "CI", "CI,50-2500", "DeltaLw"]);
const AIRBORNE_PHYSICAL_PROMPT_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC", "C", "Ctr"]);

function hasFloorRolePromptGuard(result: AssemblyCalculation | null | undefined): boolean {
  return Boolean(
    result?.warnings?.some((warning: string) =>
      /Floor roles needed before (?:impact output|exact floor-family) promotion/i.test(warning)
    )
  );
}

function hasSteelFormulaPhysicalInputPrompt(result: AssemblyCalculation | null | undefined): boolean {
  return Boolean(
    result?.warnings?.some((warning: string) =>
      /Steel-floor formula lane needs these physical inputs before calculating (?:Ln,w|Ln,w \/ DeltaLw)/i.test(warning)
    )
  );
}

function hasHeavyConcreteCombinedPhysicalInputPrompt(result: AssemblyCalculation | null | undefined): boolean {
  return Boolean(
    result?.warnings?.some((warning: string) =>
      /reinforced-concrete combined upper\/lower impact runtime is waiting/i.test(warning)
    )
  );
}

function isExplicitlyUnsupportedOutput(
  result: AssemblyCalculation | null | undefined,
  output: RequestedOutputId
): boolean {
  return Boolean(result?.unsupportedTargetOutputs?.includes(output));
}

function isExplicitUnsupportedMissingInput(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): boolean {
  const { output, result, studyMode } = input;

  if (
    studyMode === "wall" &&
    (
      result?.airborneBasis?.method === WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD ||
      result?.airborneBasis?.method === WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD
    )
  ) {
    return result.airborneBasis.origin === "needs_input" && AIRBORNE_PHYSICAL_PROMPT_OUTPUTS.has(output);
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    return getFieldAirborneBlockingRequirement(output, result) !== null;
  }

  if (!FIELD_IMPACT_OUTPUTS.has(output) || studyMode !== "floor") {
    if (output === "Ln,w" && studyMode === "floor" && hasSteelFormulaPhysicalInputPrompt(result)) {
      return true;
    }

    if (
      studyMode === "floor" &&
      (output === "Ln,w" || output === "DeltaLw") &&
      hasHeavyConcreteCombinedPhysicalInputPrompt(result)
    ) {
      return true;
    }

    return false;
  }

  const trace = result?.dynamicImpactTrace;

  if (!trace?.hasFieldContext || trace.fieldContinuation === "none") {
    return true;
  }

  if (output === "L'n,w") {
    return !trace.fieldOutputsActive;
  }

  if (output === "L'nT,w" || output === "L'nT,50") {
    return !trace.standardizedFieldActive;
  }

  return false;
}

function buildExplicitUnsupportedOutputDetail(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): string {
  const { output, result, studyMode } = input;
  const rockwoolSplitWithheldDetail = getRockwoolSplitTripleLeafWithheldOutputDetail(result, output);

  if (rockwoolSplitWithheldDetail && studyMode === "wall") {
    return rockwoolSplitWithheldDetail;
  }

  if (FIELD_IMPACT_OUTPUTS.has(output) && studyMode === "floor") {
    if (output === "LnT,A") {
      return "Needs an exact Dutch field-band source. The simple panel does not fabricate it.";
    }

    return `${REQUESTED_OUTPUT_SUPPORT_NOTES[output]} DAC is keeping this requested field-impact output explicit on the current path instead of inventing a number from nearby live values.`;
  }

  const gateSOpeningLeakDetail = getGateSOpeningLeakCompositeOutputDetail(output, result ?? null);
  if (gateSOpeningLeakDetail && studyMode === "wall") {
    return gateSOpeningLeakDetail;
  }

  const wallTripleLeafCalibratedDetail = getWallTripleLeafCalibratedSolverOutputDetail(output, result ?? null);
  if (wallTripleLeafCalibratedDetail && studyMode === "wall") {
    return wallTripleLeafCalibratedDetail;
  }

  const wallTripleLeafLocalSubstitutionDetail =
    getWallTripleLeafLocalSubstitutionOutputDetail(output, result ?? null);
  if (wallTripleLeafLocalSubstitutionDetail && studyMode === "wall") {
    return wallTripleLeafLocalSubstitutionDetail;
  }

  const companyInternalOpeningLeakFieldBuildingDetail =
    getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result ?? null);
  if (companyInternalOpeningLeakFieldBuildingDetail && studyMode === "wall") {
    return companyInternalOpeningLeakFieldBuildingDetail;
  }

  const gateAYAdvancedWallDetail = getGateAYAdvancedWallOutputDetail(output, result ?? null);
  if (gateAYAdvancedWallDetail && studyMode === "wall") {
    return gateAYAdvancedWallDetail;
  }

  const gateARBuildingDetail = getGateARAirborneBuildingPredictionOutputDetail(output, result ?? null);
  if (gateARBuildingDetail && studyMode === "wall") {
    return gateARBuildingDetail;
  }

  return buildUnavailableOutputDetail({ output, result, studyMode });
}

export function buildUnavailableOutputDetail(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): string {
  const { output, result, studyMode } = input;
  const isImpactOnlyLowConfidenceLane = isImpactOnlyLowConfidenceFloorLane(result);

  if (!result) {
    return "Add a valid layer stack first.";
  }

  if (studyMode === "floor" && FLOOR_ROLE_PROMPT_OUTPUTS.has(output) && hasFloorRolePromptGuard(result)) {
    return "Assign floor roles before treating this impact output as supported.";
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    const pendingDetail = getFieldAirbornePendingDetail(output, result);

    if (pendingDetail) {
      return pendingDetail;
    }
  }

  if (FIELD_IMPACT_OUTPUTS.has(output) && studyMode === "floor") {
    if (output === "L'n,w") {
      return "Need field K or a direct field supplement for L'n,w.";
    }

    if (output === "L'nT,w" || output === "L'nT,50") {
      return "Need field K together with receiving-room volume for standardized field impact outputs.";
    }

    if (output === "LnT,A") {
      return "Needs an exact Dutch field-band source. The simple panel does not fabricate it.";
    }
  }

  const gateSOpeningLeakDetail = getGateSOpeningLeakCompositeOutputDetail(output, result);
  if (gateSOpeningLeakDetail && studyMode === "wall") {
    return gateSOpeningLeakDetail;
  }

  const wallTripleLeafCalibratedDetail = getWallTripleLeafCalibratedSolverOutputDetail(output, result);
  if (wallTripleLeafCalibratedDetail && studyMode === "wall") {
    return wallTripleLeafCalibratedDetail;
  }

  const wallTripleLeafLocalSubstitutionDetail =
    getWallTripleLeafLocalSubstitutionOutputDetail(output, result);
  if (wallTripleLeafLocalSubstitutionDetail && studyMode === "wall") {
    return wallTripleLeafLocalSubstitutionDetail;
  }

  const companyInternalOpeningLeakFieldBuildingDetail =
    getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result);
  if (companyInternalOpeningLeakFieldBuildingDetail && studyMode === "wall") {
    return companyInternalOpeningLeakFieldBuildingDetail;
  }

  const gateAYAdvancedWallDetail = getGateAYAdvancedWallOutputDetail(output, result);
  if (gateAYAdvancedWallDetail && studyMode === "wall") {
    return gateAYAdvancedWallDetail;
  }

  const gateARBuildingDetail = getGateARAirborneBuildingPredictionOutputDetail(output, result);
  if (gateARBuildingDetail && studyMode === "wall") {
    return gateARBuildingDetail;
  }

  if (isImpactOnlyLowConfidenceLane && isImpactOnlyLowConfidenceUnavailableOutput(output)) {
    return IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL;
  }

  if (output === "Ln,w" && studyMode === "floor" && hasSteelFormulaPhysicalInputPrompt(result)) {
    return "Enter the missing steel-floor physical inputs before treating the suspended-ceiling Ln,w lane as calculated.";
  }

  if (
    studyMode === "floor" &&
    (output === "Ln,w" || output === "DeltaLw") &&
    hasHeavyConcreteCombinedPhysicalInputPrompt(result)
  ) {
    return "Enter resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, and ceilingOrLowerAssembly before treating the reinforced-concrete combined upper/lower impact lane as calculated.";
  }

  if (output === "Ln,w+CI" || output === "CI" || output === "CI,50-2500") {
    return "This appears only when the active impact lane carries low-frequency companion terms.";
  }

  return REQUESTED_OUTPUT_SUPPORT_NOTES[output];
}

export function isRouteBlockedOutput(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): boolean {
  const { output, result, studyMode } = input;

  if (!result) {
    return true;
  }

  if (
    studyMode === "wall" &&
    (
      result.airborneBasis?.method === WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD ||
      result.airborneBasis?.method === WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD
    ) &&
    result.airborneBasis.origin === "needs_input" &&
    AIRBORNE_PHYSICAL_PROMPT_OUTPUTS.has(output)
  ) {
    return true;
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    return getFieldAirborneBlockingRequirement(output, result) !== null;
  }

  if (FIELD_IMPACT_OUTPUTS.has(output) && studyMode === "floor") {
    return true;
  }

  return false;
}

function getFloorSystemCtrTerm(result: AssemblyCalculation | null | undefined): number | null {
  const ratings = result?.floorSystemRatings;

  if (!ratings) {
    return null;
  }

  return getFloorSystemCtr(ratings) ?? null;
}

function getFloorSystemCAdaptationTerm(result: AssemblyCalculation | null | undefined): number | null {
  const ratings = result?.floorSystemRatings;

  if (!ratings) {
    return null;
  }

  return getFloorSystemC(ratings) ?? null;
}

export function buildOutputCard(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): BaseOutputCardModel {
  const { output, result, studyMode } = input;
  const fieldRatings = result?.ratings.field;
  const isImpactOnlyLowConfidenceLane = isImpactOnlyLowConfidenceFloorLane(result);
  const isReinforcedConcreteLowConfidenceLane =
    isReinforcedConcreteLowConfidenceFloorLane(result);
  const isHeavyConcreteCombinedFormulaCorridor = isHeavyConcreteCombinedFormulaCorridorImpact(result);
  const isSteelFloorFormulaCorridor = isSteelFloorFormulaCorridorImpact(result);
  const isTimberCltDeltaLwFormulaCorridor = isTimberCltDeltaLwFormulaCorridorImpact(result);
  const isOpenWebSupportedBandSimilarity = isOpenWebSupportedBandSimilarityResult(result);
  const isOpenWebDirectFixedLining = isOpenWebDirectFixedLiningResult(result);
  const rockwoolTripleLeafScreeningPolicy = getRockwoolTripleLeafScreeningPolicyCopy(result);

  if (isExplicitlyUnsupportedOutput(result, output)) {
    const missingInput = isExplicitUnsupportedMissingInput({
      output,
      result: result ?? null,
      studyMode
    });

    return {
      detail: missingInput
        ? buildUnavailableOutputDetail({ output, result: result ?? null, studyMode })
        : buildExplicitUnsupportedOutputDetail({ output, result: result ?? null, studyMode }),
      label: REQUESTED_OUTPUT_LABELS[output],
      output,
      status: missingInput ? "needs_input" : "unsupported",
      value: "Not ready"
    };
  }

  const airbornePhysicalPromptDetail =
    AIRBORNE_PHYSICAL_PROMPT_OUTPUTS.has(output)
      ? getDoubleLeafFramedBridgeAirbornePromptDetail(result)
      : null;

  if (airbornePhysicalPromptDetail) {
    return {
      detail: airbornePhysicalPromptDetail,
      label: REQUESTED_OUTPUT_LABELS[output],
      output,
      status: "needs_input",
      value: "Not ready"
    };
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output) && getFieldAirborneBlockingRequirement(output, result ?? null) !== null) {
    return {
      detail: buildUnavailableOutputDetail({ output, result: result ?? null, studyMode }),
      label: REQUESTED_OUTPUT_LABELS[output],
      output,
      status: "needs_input",
      value: "Not ready"
    };
  }

  switch (output) {
    case "Rw":
      if (studyMode === "floor" && typeof result?.floorSystemRatings?.Rw === "number") {
        return {
          detail: isOpenWebDirectFixedLining
            ? getOpenWebDirectFixedLiningOutputDetail("Rw", result) ??
              "Open-web steel direct-fixed lining companion Rw from the active floor lane."
            : isOpenWebSupportedBandSimilarity
            ? getOpenWebSupportedBandSimilarityOutputDetail("Rw", result) ??
              "Open-web steel supported-band similarity companion Rw from the active floor lane."
            : isReinforcedConcreteLowConfidenceLane
            ? REINFORCED_CONCRETE_LOW_CONFIDENCE_RW_DETAIL
            : "Companion airborne rating carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
          label: "Rw",
          output,
          status: "live",
          value: `${formatDecimal(result.floorSystemRatings.Rw)} dB`
        };
      }

      if (typeof result?.metrics.estimatedRwDb === "number") {
        const wallTripleLeafCalibratedDetail = getWallTripleLeafCalibratedSolverOutputDetail(output, result);
        const wallTripleLeafLocalSubstitutionDetail =
          getWallTripleLeafLocalSubstitutionOutputDetail(output, result);
        const gateSOpeningLeakDetail = getGateSOpeningLeakCompositeOutputDetail(output, result);
        const gateAYAdvancedWallDetail = getGateAYAdvancedWallOutputDetail(output, result);

        return {
          detail:
            wallTripleLeafCalibratedDetail ??
            wallTripleLeafLocalSubstitutionDetail ??
            gateAYAdvancedWallDetail ??
            gateSOpeningLeakDetail ??
            (isImpactOnlyLowConfidenceLane
              ? IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL
              : rockwoolTripleLeafScreeningPolicy?.outputDetail ??
                "Weighted airborne element rating from the active airborne calculator."),
          label: "Rw",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedRwDb)} dB`
        };
      }
      break;
    case "R'w":
      if (typeof result?.metrics.estimatedRwPrimeDb === "number") {
        const gateARBuildingDetail = getGateARAirborneBuildingPredictionOutputDetail(output, result);
        const companyInternalOpeningLeakFieldBuildingDetail =
          getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result);

        return {
          detail:
            companyInternalOpeningLeakFieldBuildingDetail ??
            gateARBuildingDetail ??
            getFieldAirborneLiveDetail("R'w", result),
          label: "R'w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedRwPrimeDb)} dB`
        };
      }
      break;
    case "STC":
      if (typeof result?.metrics.estimatedStc === "number") {
        const wallTripleLeafCalibratedDetail = getWallTripleLeafCalibratedSolverOutputDetail(output, result);
        const wallTripleLeafLocalSubstitutionDetail =
          getWallTripleLeafLocalSubstitutionOutputDetail(output, result);
        const gateSOpeningLeakDetail = getGateSOpeningLeakCompositeOutputDetail(output, result);
        const gateAYAdvancedWallDetail = getGateAYAdvancedWallOutputDetail(output, result);

        return {
          detail:
            wallTripleLeafCalibratedDetail ??
            wallTripleLeafLocalSubstitutionDetail ??
            gateAYAdvancedWallDetail ??
            gateSOpeningLeakDetail ??
            "ASTM single-number companion from the same airborne curve.",
          label: "STC",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedStc)} dB`
        };
      }
      break;
    case "C":
      if (studyMode === "floor") {
        const floorC = getFloorSystemCAdaptationTerm(result);

        if (typeof floorC === "number") {
          return {
            detail:
              "Companion mid-frequency adaptation carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
            label: "C",
            output,
            status: "live",
            value: formatSignedDb(floorC)
          };
        }
      }

      if (typeof result?.metrics.estimatedCDb === "number") {
        const wallTripleLeafCalibratedDetail = getWallTripleLeafCalibratedSolverOutputDetail(output, result);
        const wallTripleLeafLocalSubstitutionDetail =
          getWallTripleLeafLocalSubstitutionOutputDetail(output, result);
        const gateAYAdvancedWallDetail = getGateAYAdvancedWallOutputDetail(output, result);

        return {
          detail:
            wallTripleLeafCalibratedDetail ??
            wallTripleLeafLocalSubstitutionDetail ??
            gateAYAdvancedWallDetail ??
            "Mid-frequency adaptation term on the airborne lane.",
          label: "C",
          output,
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCDb)
        };
      }
      break;
    case "Ctr":
      if (studyMode === "floor") {
        const floorCtr = getFloorSystemCtrTerm(result);

        if (typeof floorCtr === "number") {
          return {
            detail: isReinforcedConcreteLowConfidenceLane
              ? REINFORCED_CONCRETE_LOW_CONFIDENCE_CTR_DETAIL
              : "Companion traffic-noise adaptation carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
            label: "Ctr",
            output,
            status: "live",
            value: formatSignedDb(floorCtr)
          };
        }
      }

      if (typeof result?.metrics.estimatedCtrDb === "number") {
        const wallTripleLeafCalibratedDetail = getWallTripleLeafCalibratedSolverOutputDetail(output, result);
        const wallTripleLeafLocalSubstitutionDetail =
          getWallTripleLeafLocalSubstitutionOutputDetail(output, result);
        const gateAYAdvancedWallDetail = getGateAYAdvancedWallOutputDetail(output, result);

        return {
          detail:
            wallTripleLeafCalibratedDetail ??
            wallTripleLeafLocalSubstitutionDetail ??
            gateAYAdvancedWallDetail ??
            (isImpactOnlyLowConfidenceLane
              ? IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL
              : "Traffic-noise adaptation term on the airborne lane."),
          label: "Ctr",
          output,
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCtrDb)
        };
      }
      break;
    case "DnT,w":
      if (typeof result?.metrics.estimatedDnTwDb === "number") {
        const gateARBuildingDetail = getGateARAirborneBuildingPredictionOutputDetail(output, result);
        const companyInternalOpeningLeakFieldBuildingDetail =
          getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result);

        return {
          detail:
            companyInternalOpeningLeakFieldBuildingDetail ??
            gateARBuildingDetail ??
            getFieldAirborneLiveDetail("DnT,w", result),
          label: "DnT,w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTwDb)} dB`
        };
      }
      break;
    case "DnT,A":
      if (typeof result?.metrics.estimatedDnTADb === "number") {
        const companyInternalOpeningLeakFieldBuildingDetail =
          getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result);

        return {
          detail:
            companyInternalOpeningLeakFieldBuildingDetail ??
            getFieldAirborneLiveDetail("DnT,A", result),
          label: "DnT,A",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTADb)} dB`
        };
      }
      break;
    case "DnT,A,k":
      if (typeof fieldRatings?.DnTAk === "number" || typeof result?.metrics.estimatedDnTAkDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("DnT,A,k", result),
          label: "DnT,A,k",
          output,
          status: "live",
          value: `${formatDecimal(fieldRatings?.DnTAk ?? result?.metrics.estimatedDnTAkDb ?? 0)} dB`
        };
      }
      break;
    case "Dn,w":
      if (typeof result?.metrics.estimatedDnWDb === "number") {
        const companyInternalOpeningLeakFieldBuildingDetail =
          getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result);

        return {
          detail:
            companyInternalOpeningLeakFieldBuildingDetail ??
            getFieldAirborneLiveDetail("Dn,w", result),
          label: "Dn,w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnWDb)} dB`
        };
      }
      break;
    case "Dn,A":
      if (typeof result?.metrics.estimatedDnADb === "number") {
        const companyInternalOpeningLeakFieldBuildingDetail =
          getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result);

        return {
          detail:
            companyInternalOpeningLeakFieldBuildingDetail ??
            getFieldAirborneLiveDetail("Dn,A", result),
          label: "Dn,A",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnADb)} dB`
        };
      }
      break;
    case "Ln,w":
      if (typeof result?.impact?.LnW === "number") {
        return {
          detail: isReinforcedConcreteLowConfidenceLane
            ? REINFORCED_CONCRETE_LOW_CONFIDENCE_LNW_DETAIL
            : isImpactOnlyLowConfidenceLane
              ? IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL
              : isHeavyConcreteCombinedFormulaCorridor
                ? getHeavyConcreteCombinedFormulaCorridorOutputDetail("Ln,w", result.impact) ??
                  "Lab-side Ln,w from the active heavy-concrete combined formula corridor."
              : isSteelFloorFormulaCorridor
                ? getSteelFloorFormulaCorridorOutputDetail("Ln,w", result.impact) ??
                  "Lab-side Ln,w from the active steel formula corridor."
              : isOpenWebSupportedBandSimilarity
                ? getOpenWebSupportedBandSimilarityOutputDetail("Ln,w", result) ??
                  "Lab-side Ln,w from the open-web supported-band similarity lane."
              : isOpenWebDirectFixedLining
                ? getOpenWebDirectFixedLiningOutputDetail("Ln,w", result) ??
                  "Lab-side Ln,w from the open-web direct-fixed lining interpolation lane."
              : "Lab-side weighted normalized impact sound level.",
          label: "Ln,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LnWUpperBound === "number") {
        return {
          detail:
            "Conservative upper bound from a bound-only floor family lane. DAC keeps this separate from any live airborne companion still shown on the same route.",
          label: "Ln,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LnWUpperBound)} dB`
        };
      }
      break;
    case "L'n,w":
      if (typeof result?.impact?.LPrimeNW === "number") {
        return {
          detail: isSteelFloorFormulaCorridor
            ? getSteelFloorFormulaCorridorOutputDetail("L'n,w", result.impact) ??
              `Field-side impact value after K or direct-path carry-over; this is a field-impact continuation, not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`
            : `Field-side impact value after K or direct-path carry-over; this is a field-impact continuation, not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`,
          label: "L'n,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNWUpperBound === "number") {
        return {
          detail:
            `Conservative field-side impact upper bound carried from the same bound-only lane; this is not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`,
          label: "L'n,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNWUpperBound)} dB`
        };
      }
      break;
    case "CI":
      if (typeof result?.impact?.CI === "number") {
        return {
          detail:
            getOpenWebDirectFixedLiningOutputDetail("CI", result) ??
            getOpenWebSupportedBandSimilarityOutputDetail("CI", result) ??
            "Low-frequency impact companion term.",
          label: "CI",
          output,
          status: "live",
          value: formatSignedDb(result.impact.CI)
        };
      }
      break;
    case "CI,50-2500":
      if (typeof result?.impact?.CI50_2500 === "number") {
        return {
          detail: "Extended low-frequency impact companion term.",
          label: "CI,50-2500",
          output,
          status: "live",
          value: formatSignedDb(result.impact.CI50_2500)
        };
      }
      break;
    case "Ln,w+CI":
      if (typeof result?.impact?.LnWPlusCI === "number") {
        return {
          detail:
            getOpenWebDirectFixedLiningOutputDetail("Ln,w+CI", result) ??
            getOpenWebSupportedBandSimilarityOutputDetail("Ln,w+CI", result) ??
            "Combined weighted impact result with CI carry-over.",
          label: "Ln,w+CI",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnWPlusCI)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LnWPlusCIUpperBound === "number") {
        return {
          detail:
            "Conservative upper bound from a source row that publishes combined Ln,w+CI without enough data to split exact Ln,w and CI.",
          label: "Ln,w+CI",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LnWPlusCIUpperBound)} dB`
        };
      }
      break;
    case "DeltaLw":
      if (typeof result?.impact?.DeltaLw === "number") {
        return {
          detail: isSteelFloorFormulaCorridor
            ? getSteelFloorFormulaCorridorOutputDetail("DeltaLw", result.impact) ?? "DeltaLw from the active steel formula corridor."
            : isHeavyConcreteCombinedFormulaCorridor
              ? getHeavyConcreteCombinedFormulaCorridorOutputDetail("DeltaLw", result.impact) ??
                "DeltaLw from the active heavy-concrete combined formula corridor."
            : isTimberCltDeltaLwFormulaCorridor
              ? getTimberCltDeltaLwFormulaCorridorOutputDetail("DeltaLw", result.impact) ??
                "DeltaLw from the active timber/CLT formula corridor."
            : "Heavy-reference improvement term from the active impact lane.",
          label: "DeltaLw",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.DeltaLw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.DeltaLwLowerBound === "number") {
        return {
          detail: "Conservative lower bound from a bound-only support lane.",
          label: "DeltaLw",
          output,
          status: "bound",
          value: `>= ${formatDecimal(result.lowerBoundImpact.DeltaLwLowerBound)} dB`
        };
      }
      break;
    case "L'nT,w":
      if (typeof result?.impact?.LPrimeNTw === "number") {
        return {
          detail: isSteelFloorFormulaCorridor
            ? getSteelFloorFormulaCorridorOutputDetail("L'nT,w", result.impact) ??
              `Standardized field impact result with receiving-room normalization; this is a field-impact continuation, not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`
            : `Standardized field impact result with receiving-room normalization; this is a field-impact continuation, not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`,
          label: "L'nT,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNTw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNTwUpperBound === "number") {
        return {
          detail:
            `Conservative standardized field impact upper bound carried from the same bound-only lane; this is not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`,
          label: "L'nT,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNTwUpperBound)} dB`
        };
      }
      break;
    case "L'nT,50":
      if (typeof result?.impact?.LPrimeNT50 === "number") {
        return {
          detail: isSteelFloorFormulaCorridor
            ? getSteelFloorFormulaCorridorOutputDetail("L'nT,50", result.impact) ??
              `Standardized field impact value with the extended low-frequency companion; this is a field-impact continuation, not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`
            : `Standardized field impact value with the extended low-frequency companion; this is a field-impact continuation, not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`,
          label: "L'nT,50",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNT50)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNT50UpperBound === "number") {
        return {
          detail:
            `Conservative L'nT,50 upper bound; this is not an independent exact field measurement. ${FIELD_OUTPUT_OWNER_POLICY_GUARD}`,
          label: "L'nT,50",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNT50UpperBound)} dB`
        };
      }
      break;
    case "LnT,A":
      if (typeof result?.impact?.LnTA === "number") {
        return {
          detail: "Exact Dutch NEN 5077 A-weighted impact companion.",
          label: "LnT,A",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnTA)} dB`
        };
      }
      break;
    default:
      break;
  }

  return {
    detail: buildUnavailableOutputDetail({ output, result, studyMode }),
    label: REQUESTED_OUTPUT_LABELS[output],
    output,
    status: isRouteBlockedOutput({ output, result, studyMode }) ? "needs_input" : "unsupported",
    value: "Not ready"
  };
}

export function addOutputCardPosture(
  card: BaseOutputCardModel,
  input: { result: AssemblyCalculation | null; studyMode: StudyMode }
): OutputCardModel {
  const posture = buildSimpleWorkbenchOutputPosture({
    output: card.output,
    result: input.result,
    status: card.status,
    studyMode: input.studyMode
  });

  return {
    ...card,
    postureDetail: posture.detail,
    postureLabel: posture.label,
    postureTone: posture.tone
  };
}

export function statusLabel(status: OutputCardModel["status"] | "ignored" | "used"): string {
  switch (status) {
    case "live":
      return "Live";
    case "bound":
      return "Bound";
    case "used":
      return "Used now";
    case "ignored":
      return "Ignored now";
    case "needs_input":
      return "Needs input";
    case "unsupported":
    default:
      return "Unsupported";
  }
}

export function outputStatusClass(status: OutputCardModel["status"]): string {
  switch (status) {
    case "live":
      return "border-[color:color-mix(in_oklch,var(--success)_42%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))]";
    case "bound":
      return "border-[color:color-mix(in_oklch,var(--ink)_16%,var(--line))] bg-[color:var(--paper)]/88";
    case "needs_input":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:var(--warning-soft)]";
    case "unsupported":
    default:
      return "border-[color:color-mix(in_oklch,var(--warning)_24%,var(--line))] bg-[color:var(--paper)]/80";
  }
}

export function outputStatusTextClass(status: OutputCardModel["status"]): string {
  switch (status) {
    case "live":
      return "text-[color:var(--success-ink)]";
    case "bound":
      return "text-[color:var(--ink-soft)]";
    case "needs_input":
    case "unsupported":
    default:
      return "text-[color:var(--warning-ink)]";
  }
}

export function outputPostureTextClass(tone: OutputCardModel["postureTone"]): string {
  switch (tone) {
    case "success":
      return "text-[color:var(--success-ink)]";
    case "warning":
      return "text-[color:var(--warning-ink)]";
    case "accent":
      return "text-[color:var(--accent-ink)]";
    case "neutral":
    default:
      return "text-[color:var(--ink)]";
  }
}

export function outputPosturePanelClass(tone: OutputCardModel["postureTone"]): string {
  switch (tone) {
    case "success":
      return "border-[color:color-mix(in_oklch,var(--success)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_8%,var(--paper))]";
    case "warning":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_10%,var(--paper))]";
    case "accent":
      return "border-[color:color-mix(in_oklch,var(--accent)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))]";
    case "neutral":
    default:
      return "border-[color:var(--line)] bg-[color:var(--paper)]/72";
  }
}
