import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD
} from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
  computeAstmE989ImpactRating
} from "./impact-astm-e989";
import { EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS } from "./impact-exact";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import {
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS,
  POST_V1_GATE_EH_COUNTERS,
  POST_V1_GATE_EH_OWNER_ID,
  POST_V1_GATE_EH_OWNER_POLICY,
  POST_V1_GATE_EH_REJECTED_BOUNDARIES,
  POST_V1_GATE_EH_REQUIRED_OWNER_FIELDS,
  POST_V1_GATE_EH_TARGET_OUTPUTS,
  summarizePostV1FloorAstmIicAiicExactBandInputOwnerGateEH
} from "./post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh";
import {
  POST_V1_GATE_EG_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-eg";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const MIXED_ISO_AND_ASTM_OUTPUTS = ["Ln,w", "IIC"] as const satisfies readonly RequestedOutputId[];
const MIXED_ASTM_AND_ISO_OUTPUTS = ["IIC", "Ln,w"] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  "docs/calculator/POST_V1_GATE_EG_EH_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_PLAN_2026-06-07.md"
] as const;

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const BASE_ONE_THIRD_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  levelsDb: astmContourLevels(62)
} as const satisfies Omit<ExactImpactSource, "standardMethod">;

const ASTM_LAB_IIC_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  label: "Gate EH ASTM E492 lab source with complete one-third-octave bands",
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  labOrField: "field",
  label: "Gate EH ASTM E1007 field source with complete one-third-octave bands",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

const ISO_LAB_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  label: "Gate EH ISO lab source on the same one-third-octave grid",
  standardMethod: "ISO 10140-3"
} as const satisfies ExactImpactSource;

const MISSING_METHOD_LAB_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  label: "Gate EH lab source with missing standard method"
} as const satisfies ExactImpactSource;

const AMBIGUOUS_METHOD_LAB_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  label: "Gate EH lab source with ambiguous standard method",
  standardMethod: "one-third octave impact band report"
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor ASTM IIC/AIIC exact-band input owner Gate EH", () => {
  it("lands after Gate EG without moving runtime values and returns to numeric coverage rerank", () => {
    const summary = summarizePostV1FloorAstmIicAiicExactBandInputOwnerGateEH();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_eg_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_owner_gate_eh"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_EH_COUNTERS,
      landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE,
      noRuntimeValueMovement: true,
      ownerId: POST_V1_GATE_EH_OWNER_ID,
      ownerPolicy: POST_V1_GATE_EH_OWNER_POLICY,
      previousGateEG: {
        counters: POST_V1_GATE_EG_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_EH_REJECTED_BOUNDARIES,
      selectedNextAction: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EH_TARGET_OUTPUTS
    });
  });

  it("pins the ASTM E492/E1007 exact-band owner fields and no-runtime counters", () => {
    expect(POST_V1_GATE_EH_REQUIRED_OWNER_FIELDS).toEqual([
      "exactImpactSource.frequenciesHz",
      "exactImpactSource.levelsDb",
      "bandSet=one_third_octave_100_3150",
      "ASTM_E989_contour_rating_owner",
      "standardMethod=ASTM_E492_E989",
      "exactImpactSource.labOrField=lab",
      "metricBasis=astm_e989_iic_metric_schema_adapter_bridge",
      "standardMethod=ASTM_E1007_E989",
      "exactImpactSource.labOrField=field",
      "metricBasis=astm_e989_aiic_metric_schema_adapter_bridge"
    ]);
    expect(POST_V1_GATE_EH_OWNER_POLICY).toMatchObject({
      acceptedAiicMetricBasis: ASTM_E989_AIIC_METRIC_BASIS,
      acceptedIicMetricBasis: ASTM_E989_IIC_METRIC_BASIS,
      acceptedRuntimeBasis: ASTM_E989_IMPACT_RATING_BASIS,
      acceptedRuntimeCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      noRuntimeValueMovement: true,
      sourceRowsAreNotRequiredForOwner: true
    });
    expect(POST_V1_GATE_EH_COUNTERS).toMatchObject({
      acceptedOwnerLedgers: 1,
      astmExactBandRequestShapesPinned: 2,
      frontendImplementationFilesTouched: 0,
      isoToAstmAliasesPromoted: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("calculates IIC and AIIC only through ASTM-labelled exact one-third-octave sources", () => {
    expect(computeAstmE989ImpactRating(ASTM_LAB_IIC_SOURCE.frequenciesHz, ASTM_LAB_IIC_SOURCE.levelsDb)).toMatchObject({
      contourLevelAt500HzDb: 60,
      rating: 50
    });

    const lab = calculateImpactOnly([], {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: IIC_OUTPUTS
    });
    const field = calculateAssembly(FLOOR_STACK, {
      calculator: "dynamic",
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: AIIC_OUTPUTS
    });

    expect(lab.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab",
      metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS }
    });
    expect(lab.supportedTargetOutputs).toEqual(["IIC"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.acousticAnswerBoundary).toBeUndefined();
    expect(lab.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["IIC"]
    });

    expect(field.impact).toMatchObject({
      AIIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(field.supportedTargetOutputs).toEqual(["AIIC"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.acousticAnswerBoundary).toBeUndefined();
    expect(field.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"]
    });
  });

  it("keeps ISO, missing, and ambiguous standard methods from publishing ASTM ratings", () => {
    const pureUnsupportedCases = [
      { id: "iso_method", source: ISO_LAB_SOURCE },
      { id: "missing_method", source: MISSING_METHOD_LAB_SOURCE },
      { id: "ambiguous_method", source: AMBIGUOUS_METHOD_LAB_SOURCE }
    ] as const;

    for (const testCase of pureUnsupportedCases) {
      const result = calculateImpactOnly([], {
        exactImpactSource: testCase.source,
        targetOutputs: IIC_OUTPUTS
      });

      expect(result.impact?.basis, testCase.id).toBe(EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS);
      expect(result.impact?.IIC, testCase.id).toBeUndefined();
      expect(result.supportedTargetOutputs, testCase.id).toEqual([]);
      expect(result.unsupportedTargetOutputs, testCase.id).toEqual(["IIC"]);
      expect(result.acousticAnswerBoundary, testCase.id).toMatchObject({
        method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD,
        origin: "unsupported",
        requiredInputs: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS,
        unsupportedOutputs: ["IIC"]
      });
    }

    const mixedIso = calculateImpactOnly([], {
      exactImpactSource: ISO_LAB_SOURCE,
      targetOutputs: MIXED_ISO_AND_ASTM_OUTPUTS
    });
    const mixedAstm = calculateImpactOnly([], {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: MIXED_ASTM_AND_ISO_OUTPUTS
    });

    expect(mixedIso.impact).toMatchObject({
      basis: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      labOrField: "lab"
    });
    expect(mixedIso.impact?.IIC).toBeUndefined();
    expect(mixedIso.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(mixedIso.unsupportedTargetOutputs).toEqual(["IIC"]);

    expect(mixedAstm.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab"
    });
    expect(mixedAstm.supportedTargetOutputs).toEqual(["IIC"]);
    expect(mixedAstm.unsupportedTargetOutputs).toEqual(["Ln,w"]);
  });

  it("keeps lab and field ASTM metric ownership separate", () => {
    const labAskedForAiic = calculateImpactOnly([], {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: AIIC_OUTPUTS
    });
    const fieldAskedForIic = calculateAssembly(FLOOR_STACK, {
      calculator: "dynamic",
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: IIC_OUTPUTS
    });

    expect(labAskedForAiic.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab"
    });
    expect(labAskedForAiic.impact?.AIIC).toBeUndefined();
    expect(labAskedForAiic.supportedTargetOutputs).toEqual([]);
    expect(labAskedForAiic.unsupportedTargetOutputs).toEqual(["AIIC"]);

    expect(fieldAskedForIic.impact).toMatchObject({
      AIIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field"
    });
    expect(fieldAskedForIic.impact?.IIC).toBeUndefined();
    expect(fieldAskedForIic.supportedTargetOutputs).toEqual([]);
    expect(fieldAskedForIic.unsupportedTargetOutputs).toEqual(["IIC"]);
  });

  it("keeps Gate EH docs and current-gate runner aligned without source rows or frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_EH_OWNER_ID);
      expect(contents, path).toContain("acceptedOwnerLedgers: 1");
      expect(contents, path).toContain("astmExactBandRequestShapesPinned: 2");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts"
    );
  });
});
