import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-basis-integrity-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_target_output_independence_owner";

const OWNER_ACTION =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-17.md";
const OWNER_STATUS =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.user_material_formula_field_lab_companion_target_output_independence_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall user-material formula field lab-companion target-output independence coverage refresh";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 2,
  accuracyPromotedTargetOutputs: 4,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 3,
  sourceRowsImported: 0
} as const;

const CUSTOM_PANEL_ID = "custom_wall_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_wall_porous_absorber";
const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const BUILT_IN_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CUSTOM_MATERIAL_CATALOG: readonly MaterialDefinition[] = [
  ...getDefaultMaterialCatalog(),
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 848,
    id: CUSTOM_PANEL_ID,
    name: "Custom Wall Panel Leaf",
    tags: ["custom", "gypsum", "board"]
  },
  {
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 15000,
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "insulation",
    densityKgM3: 45,
    id: CUSTOM_ABSORBER_ID,
    name: "Custom Wall Porous Absorber",
    tags: ["custom", "mineral_wool", "porous"]
  }
] as const;

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const FIELD_CONTEXT: AirborneContext = {
  ...LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const BUILT_IN_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
};

const BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [...LAB_OUTPUTS, ...BUILDING_OUTPUTS] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateCustomWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    catalog: CUSTOM_MATERIAL_CATALOG,
    targetOutputs
  });
}

function calculateBuiltInWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(BUILT_IN_DOUBLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousCoverageRefreshAction: PREVIOUS_COVERAGE_REFRESH_ACTION,
    previousCoverageRefreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
    previousCoverageRefreshStatus: PREVIOUS_COVERAGE_REFRESH_STATUS,
    previousRerankAction: PREVIOUS_RERANK_ACTION,
    previousRerankFile: PREVIOUS_RERANK_FILE,
    previousRerankStatus: PREVIOUS_RERANK_STATUS,
    runtimeValueMovement: true,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 wall user-material formula field lab-companion target-output independence owner", () => {
  it("lands the runtime accuracy owner without source import, formula retune, or frontend changes", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses direct lab formula values for lab-only field requests", () => {
    const result = calculateCustomWall(FIELD_CONTEXT, LAB_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS}`
      ])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportBucket: "field_adapter"
    });
    expect(result.layerCombinationResolverTrace?.supportedMetrics).toEqual(
      expect.arrayContaining([...BUILDING_OUTPUTS])
    );
    expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toEqual(
      expect.arrayContaining(["Rw", "STC", "C", "Ctr"])
    );
  });

  it("corrects single and partial lab-only field requests without target-output order dependence", () => {
    const rwOnly = calculateCustomWall(FIELD_CONTEXT, ["Rw"]);
    const ctrOnly = calculateCustomWall(FIELD_CONTEXT, ["Ctr"]);
    const partial = calculateCustomWall(FIELD_CONTEXT, ["STC", "C"]);

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.metrics).toMatchObject({
      estimatedRwDb: 46,
      estimatedStc: 40
    });
    expect(ctrOnly.supportedTargetOutputs).toEqual(["Ctr"]);
    expect(ctrOnly.metrics).toMatchObject({
      estimatedCtrDb: -6.1
    });
    expect(partial.supportedTargetOutputs).toEqual(["STC", "C"]);
    expect(partial.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedStc: 46
    });
  });

  it("keeps mixed field, field-only, lab-context-only, built-in, ASTM, and impact boundaries unchanged", () => {
    const mixed = calculateCustomWall(FIELD_CONTEXT, MIXED_OUTPUTS);
    const fieldOnly = calculateCustomWall(FIELD_CONTEXT, BUILDING_OUTPUTS);
    const labOnly = calculateCustomWall(LAB_CONTEXT, LAB_OUTPUTS);
    const builtIn = calculateBuiltInWall(BUILT_IN_FIELD_CONTEXT, MIXED_OUTPUTS);
    const astm = calculateCustomWall(FIELD_CONTEXT, ASTM_OUTPUTS);
    const impact = calculateCustomWall(FIELD_CONTEXT, IMPACT_OUTPUTS);

    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedDnADb: 39.5,
      estimatedDnTADb: 41.9,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 41,
      estimatedRwDb: 46,
      estimatedRwPrimeDb: 40,
      estimatedStc: 46
    });

    expect(fieldOnly.supportedTargetOutputs).toEqual([...BUILDING_OUTPUTS]);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(fieldOnly.metrics).toMatchObject({
      estimatedRwDb: 40,
      estimatedRwPrimeDb: 40,
      estimatedStc: 40
    });

    expect(labOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnly.unsupportedTargetOutputs).toEqual([]);
    expect(labOnly.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });

    expect(builtIn.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(builtIn.metrics).toMatchObject({
      estimatedCtrDb: -5.7,
      estimatedDnTADb: 40.9,
      estimatedDnTwDb: 42,
      estimatedRwDb: 39,
      estimatedRwPrimeDb: 39,
      estimatedStc: 39
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the owner and selected coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("STC 46");
      expect(content, path).toContain("Ctr -6.1");
      expect(content, path).toContain("R'w 40");
      expect(content, path).toContain("DnT,w 43");
      expect(content, path).toContain("accuracyPromotedTargetOutputs: 4");
      expect(content, path).toContain("runtimeBasisPromotions: 1");
      expect(content, path).toContain("runtimeValuesMoved 3");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(PREVIOUS_RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
