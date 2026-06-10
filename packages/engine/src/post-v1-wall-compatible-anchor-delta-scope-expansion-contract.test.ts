import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REVALIDATION_ACTION =
  "layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan";
const PREVIOUS_REVALIDATION_FILE =
  "packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts";
const PREVIOUS_REVALIDATION_SELECTION_STATUS =
  "layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_landed_no_runtime_selected_wall_compatible_anchor_delta_scope_expansion";

const SCOPE_EXPANSION_ACTION = "post_v1_wall_compatible_anchor_delta_scope_expansion_plan";
const SCOPE_EXPANSION_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts";
const SCOPE_EXPANSION_SELECTION_STATUS =
  "post_v1_wall_compatible_anchor_delta_scope_expansion_landed_runtime_selected_field_building_adapter_owner";

const SELECTED_NEXT_ACTION = "post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta field/building adapter owner";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_END = [
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_WITH_UNSAFE_CAVITY_BOARD = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const EXACT_LSF_FIELD_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const SCOPE_EXPANSION_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 1,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 1,
  sourceRowsImported: 0
} as const;

const REQUIRED_DOCS = [
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildScopeExpansionSummary() {
  return {
    counters: SCOPE_EXPANSION_COUNTERS,
    landedGate: SCOPE_EXPANSION_ACTION,
    previousRevalidation: {
      selectedNextAction: SCOPE_EXPANSION_ACTION,
      selectedNextFile: SCOPE_EXPANSION_FILE,
      selectionStatus: PREVIOUS_REVALIDATION_SELECTION_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: SCOPE_EXPANSION_SELECTION_STATUS
  };
}

describe("post-V1 wall compatible anchor-delta scope expansion", () => {
  it("lands after the post double-leaf revalidation and selects field/building adapter ownership next", () => {
    expect(buildScopeExpansionSummary()).toMatchObject({
      counters: SCOPE_EXPANSION_COUNTERS,
      landedGate: SCOPE_EXPANSION_ACTION,
      previousRevalidation: {
        selectedNextAction: SCOPE_EXPANSION_ACTION,
        selectedNextFile: SCOPE_EXPANSION_FILE,
        selectionStatus: PREVIOUS_REVALIDATION_SELECTION_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: SCOPE_EXPANSION_SELECTION_STATUS
    });
  });

  it("keeps the existing direct one-side exterior board delta and opens the paired exterior board delta", () => {
    const oneSide = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const bothSides = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(oneSide.metrics.estimatedRwDb).toBe(57);
    expect(oneSide.supportedTargetOutputs).toEqual(["Rw"]);
    expect(oneSide.unsupportedTargetOutputs).toEqual([]);
    expect(oneSide.airborneBasis).toMatchObject({
      anchorSourceId: "knauf_lab_416889_primary_2026",
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });
    expect(oneSide.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 57 }]
    });

    expect(bothSides.metrics.estimatedRwDb).toBe(59);
    expect(bothSides.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(bothSides.unsupportedTargetOutputs).toEqual([]);
    expect(bothSides.airborneBasis).toMatchObject({
      anchorSourceId: "knauf_lab_416889_primary_2026",
      errorBudgetDb: 6,
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(bothSides.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(bothSides.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      errorBudgetMetrics: ["STC", "C", "Ctr"],
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: [
        { metric: "Rw", value: 59 },
        { metric: "STC", value: 59 },
        { metric: "C", value: -1.1 },
        { metric: "Ctr", value: -6 }
      ]
    });
    expect(oneSide.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
  });

  it("keeps exact precedence, interior-board boundaries, unowned metrics, and field aliases closed", () => {
    const exact = calculateAssembly(EXACT_LSF_LAB_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const unsafeCavityBoard = calculateAssembly(EXACT_LSF_WITH_UNSAFE_CAVITY_BOARD, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const stcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });
    const field = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.airborneBasis?.exactSourceId).toBe("knauf_lab_416889_primary_2026");
    expect(exact.airborneBasis?.method).not.toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD);

    expect(unsafeCavityBoard.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "wall",
      unsupportedOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(unsafeCavityBoard.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      valuePins: []
    });

    expect(stcOnly.airborneCandidateResolution).toMatchObject({
      selectedOrigin: "measured_exact_subassembly_plus_calculated_delta"
    });
    expect(stcOnly.supportedTargetOutputs).toEqual([]);
    expect(stcOnly.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnly.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: [],
      valuePins: []
    });

    expect(field.airborneBasis?.method).not.toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD);
    expect(field.layerCombinationResolverTrace?.runtimeBasisId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD
    );
  });

  it("keeps docs and current-gate runner aligned with scope expansion closeout and next owner plan", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_REVALIDATION_ACTION);
      expect(contents, path).toContain(PREVIOUS_REVALIDATION_FILE);
      expect(contents, path).toContain(PREVIOUS_REVALIDATION_SELECTION_STATUS);
      expect(contents, path).toContain(SCOPE_EXPANSION_ACTION);
      expect(contents, path).toContain(SCOPE_EXPANSION_FILE);
      expect(contents, path).toContain(SCOPE_EXPANSION_SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("runtimeValuesMoved 1");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(SCOPE_EXPANSION_FILE.replace("packages/engine/", ""));
  });
});
