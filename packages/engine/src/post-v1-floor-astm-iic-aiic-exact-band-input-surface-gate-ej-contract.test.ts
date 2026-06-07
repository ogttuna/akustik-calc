import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { EstimateRequestSchema, ImpactOnlyRequestSchema } from "@dynecho/shared";
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
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
} from "./impact-astm-e989";
import { EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS } from "./impact-exact";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import {
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS,
  POST_V1_GATE_EJ_COUNTERS,
  POST_V1_GATE_EJ_INPUT_SURFACES,
  POST_V1_GATE_EJ_REJECTED_BOUNDARIES,
  POST_V1_GATE_EJ_SURFACE_ID,
  POST_V1_GATE_EJ_SURFACE_POLICY,
  summarizePostV1FloorAstmIicAiicExactBandInputSurfaceGateEJ
} from "./post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej";
import {
  POST_V1_GATE_EI_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ei";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const MIXED_ISO_AND_ASTM_OUTPUTS = ["Ln,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  "docs/calculator/POST_V1_GATE_EI_EJ_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_PLAN_2026-06-07.md"
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
  label: "Gate EJ ASTM E492 lab source with complete one-third-octave bands",
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  labOrField: "field",
  label: "Gate EJ ASTM E1007 field source with complete one-third-octave bands",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

const ISO_LAB_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  label: "Gate EJ ISO lab source on the same one-third-octave grid",
  standardMethod: "ISO 10140-3"
} as const satisfies ExactImpactSource;

const MISSING_METHOD_LAB_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  label: "Gate EJ lab source with missing standard method"
} as const satisfies ExactImpactSource;

const AMBIGUOUS_METHOD_LAB_SOURCE = {
  ...BASE_ONE_THIRD_SOURCE,
  label: "Gate EJ lab source with ambiguous standard method",
  standardMethod: "one-third octave impact band report"
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor ASTM IIC/AIIC exact-band input surface Gate EJ", () => {
  it("lands after Gate EI and returns to numeric coverage rerank", () => {
    const summary = summarizePostV1FloorAstmIicAiicExactBandInputSurfaceGateEJ();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ei_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_surface_gate_ej"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_EJ_COUNTERS,
      landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE,
      previousGateEI: {
        counters: POST_V1_GATE_EI_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_EJ_REJECTED_BOUNDARIES,
      selectedNextAction: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS,
      surfaceId: POST_V1_GATE_EJ_SURFACE_ID,
      surfacePolicy: POST_V1_GATE_EJ_SURFACE_POLICY
    });
  });

  it("pins Gate EJ as an input-surface scope move, not a formula retune or source catalog", () => {
    expect(POST_V1_GATE_EJ_INPUT_SURFACES).toEqual([
      "impact_only_request_exactImpactSource_standardMethod",
      "estimate_request_exactImpactSource_standardMethod",
      "workbench_impact_band_import_explicit_standardMethod"
    ]);
    expect(POST_V1_GATE_EJ_SURFACE_POLICY).toMatchObject({
      acceptedStandardMethods: [
        "ASTM E492 / ASTM E989",
        "ASTM E1007 / ASTM E989"
      ],
      defaultImportStandardMethods: [
        "ISO 10140-3",
        "ISO 16283-2"
      ],
      noFormulaCoefficientChanges: true,
      noSourceRowCatalogImport: true
    });
    expect(POST_V1_GATE_EJ_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 1,
      frontendUiPanelsTouched: 0,
      inputSurfaceLedgers: 1,
      newCalculableLayerTemplates: 0,
      newCalculableMetricBasisRequestShapes: 2,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("routes explicitly ASTM-labelled impact-only and estimate request surfaces to Gate EH owner", () => {
    expect(
      ImpactOnlyRequestSchema.safeParse({
        exactImpactSource: ASTM_LAB_IIC_SOURCE,
        targetOutputs: IIC_OUTPUTS
      }).success
    ).toBe(true);
    expect(
      EstimateRequestSchema.safeParse({
        exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
        layers: FLOOR_STACK,
        targetOutputs: AIIC_OUTPUTS
      }).success
    ).toBe(true);

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
    expect(field.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"]
    });
  });

  it("keeps ISO defaults, missing method, and ambiguous method from publishing ASTM ratings", () => {
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

    expect(mixedIso.impact).toMatchObject({
      basis: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      labOrField: "lab"
    });
    expect(mixedIso.impact?.IIC).toBeUndefined();
    expect(mixedIso.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(mixedIso.unsupportedTargetOutputs).toEqual(["IIC"]);
  });

  it("keeps lab and field ASTM metric ownership separate on the selected surfaces", () => {
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

  it("keeps web import defaults ISO but carries explicit ASTM method evidence", () => {
    const workbenchBandImport = readRepoFile("apps/web/features/workbench/impact-band-import.ts");
    const workbenchBandImportTest = readRepoFile("apps/web/features/workbench/impact-band-import.test.ts");

    expect(workbenchBandImport).toContain("standardMethod?: string | null");
    expect(workbenchBandImport).toContain("detectImpactBandStandardMethod");
    expect(workbenchBandImport).toContain('"ASTM E492 / ASTM E989"');
    expect(workbenchBandImport).toContain('"ASTM E1007 / ASTM E989"');
    expect(workbenchBandImport).toContain('"ISO 10140-3"');
    expect(workbenchBandImport).toContain('"ISO 16283-2"');
    expect(workbenchBandImport).toContain(
      "input.standardMethod?.trim() || detectedStandardMethod || defaultImpactBandStandardMethod(input.labOrField)"
    );
    expect(workbenchBandImportTest).toContain("carries an explicit ASTM E492/E989 lab method");
    expect(workbenchBandImportTest).toContain("detects an ASTM E1007/E989 method header");
    expect(workbenchBandImportTest).toContain("result.impact?.IIC");
    expect(workbenchBandImportTest).toContain("result.impact?.AIIC");
  });

  it("keeps API route forwarding and docs/current-gate runner aligned with Gate EJ", () => {
    const estimateRoute = readRepoFile("apps/web/app/api/estimate/route.ts");
    const impactOnlyRoute = readRepoFile("apps/web/app/api/impact-only/route.ts");

    expect(estimateRoute).toContain("exactImpactSource: payload.exactImpactSource ?? null");
    expect(impactOnlyRoute).toContain("exactImpactSource: payload.exactImpactSource ?? null");

    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_EJ_SURFACE_ID);
      expect(contents, path).toContain("newCalculableMetricBasisRequestShapes: 2");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 1");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
    );
    expect(currentGateRunner).toContain("features/workbench/impact-band-import.test.ts");
  });
});
