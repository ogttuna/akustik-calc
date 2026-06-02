import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS } from "./heavy-concrete-published-upper-treatment-estimate";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_GATE_CG2_COVERAGE_COUNTERS,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_LANDED_GATE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTION_STATUS
} from "./post-v1-floor-common-floating-covering-expansion-gate-cg2";
import {
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_LANDED_GATE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTION_STATUS
} from "./post-v1-floor-common-floating-covering-expansion-gate-cg";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PUBLISHED_UPPER_TREATMENT_BASIS = HEAVY_CONCRETE_PUBLISHED_UPPER_TREATMENT_ESTIMATE_BASIS;
const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

const HEAVY_FLOATING_UPPER_TREATMENT_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID = "gate_cg2_resilient_underlay_missing_dynamic";
const HEAVY_FLOATING_MISSING_DYNAMIC_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function catalogWithMissingDynamicStiffness(): readonly MaterialDefinition[] {
  const catalog = getDefaultMaterialCatalog();
  const base = catalog.find((material) => material.id === "generic_resilient_underlay_s30");

  if (!base) {
    throw new Error("Gate CG2 requires generic_resilient_underlay_s30 in the default catalog.");
  }

  return [
    ...catalog,
    {
      ...base,
      id: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID,
      impact: {},
      name: "Gate CG2 resilient underlay without dynamic stiffness"
    }
  ];
}

describe("post-V1 floor common floating/covering expansion Gate CG2", () => {
  it("lands visible heavy-floating published-anchor dynamic parity and selects Gate CH rerank", () => {
    expect({
      coverageCounters: POST_V1_GATE_CG2_COVERAGE_COUNTERS,
      landedGate: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_LANDED_GATE,
      previousGateCgLandedGate: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_LANDED_GATE,
      previousGateCgSelectedNextAction: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_ACTION,
      previousGateCgSelectedNextFile: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTED_NEXT_FILE,
      previousGateCgSelectionStatus: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG_SELECTION_STATUS,
      runtimeMovementThisGate: true,
      selectedNextAction: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTION_STATUS
    }).toMatchObject({
      coverageCounters: {
        auditedRuntimeFamilies: 1,
        newCalculableLayerTemplates: 2,
        newCalculableRequestShapes: 10,
        runtimeCorrectedRequestShapes: 8,
        surfaceParityRequired: false
      },
      landedGate: "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan",
      previousGateCgLandedGate: "post_v1_floor_common_floating_covering_expansion_gate_cg_plan",
      previousGateCgSelectedNextAction: "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan",
      previousGateCgSelectedNextFile:
        "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts",
      previousGateCgSelectionStatus:
        "post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_ch_plan",
      selectedNextFile: "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
      selectedNextLabel: "post-V1 next numeric coverage gap Gate CH",
      selectionStatus:
        "post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch"
    });
  });

  it("keeps visible heavy-floating published-family Ln,w live on dynamic missing-load requests while DeltaLw stops", () => {
    const result = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      LnW: 50,
      availableOutputs: ["Ln,w"],
      basis: PUBLISHED_UPPER_TREATMENT_BASIS,
      estimateCandidateIds: ["regupol_curve8_concrete_tile_lab_2026"]
    });
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });
  });

  it("publishes field companions from the same visible published-family Ln,w anchor with complete field context", () => {
    const result = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      LPrimeNT50: 53.6,
      LPrimeNTw: 49.6,
      LPrimeNW: 52,
      LnW: 50,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.impact?.metricBasis).toMatchObject({
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LnW: PUBLISHED_UPPER_TREATMENT_BASIS
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Ln,w",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });
  });

  it("separates missing load basis, missing dynamic stiffness, complete floating formula, and ASTM boundaries", () => {
    const missingDynamic = calculateAssembly(HEAVY_FLOATING_MISSING_DYNAMIC_STACK, {
      calculator: "dynamic",
      catalog: catalogWithMissingDynamicStiffness(),
      floorImpactContext: {
        loadBasisKgM2: 76
      },
      targetOutputs: LAB_OUTPUTS
    });
    const completeFloating = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: LAB_OUTPUTS
    });
    const astmAliases = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });

    expect(missingDynamic.impact).toMatchObject({
      LnW: 50,
      basis: PUBLISHED_UPPER_TREATMENT_BASIS
    });
    expect(missingDynamic.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(missingDynamic.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(missingDynamic.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });

    expect(completeFloating.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(completeFloating.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(completeFloating.unsupportedTargetOutputs).toEqual([]);
    expect(completeFloating.acousticAnswerBoundary).toBeUndefined();

    expect(astmAliases.supportedTargetOutputs).toEqual([]);
    expect(astmAliases.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astmAliases.impact?.IIC).toBeUndefined();
    expect(astmAliases.impact?.AIIC).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate CG2 closeout and Gate CH selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_COMMON_FLOATING_COVERING_EXPANSION_GATE_CG2_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("newCalculableLayerTemplates 2");
      expect(contents, path).toContain("newCalculableRequestShapes 10");
      expect(contents, path).toContain("runtimeCorrectedRequestShapes 8");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts");
  });
});
