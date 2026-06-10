import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dv-lsf-exact-source-mixed-companion";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_C_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan";
const GATE_C_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts";
const GATE_C_SELECTION_STATUS =
  "post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta";

const GATE_D_ACTION = "post_v1_wall_compatible_anchor_delta_gate_d_plan";
const GATE_D_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts";
const GATE_D_SELECTION_STATUS =
  "post_v1_wall_compatible_anchor_delta_gate_d_landed_selected_gate_e_floor_or_wall_next_formula_gap";

const GATE_E_ACTION = "post_v1_floor_or_wall_next_formula_gap_gate_e_plan";
const GATE_E_FILE =
  "packages/engine/src/post-v1-floor-or-wall-next-formula-gap-gate-e-contract.test.ts";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

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

const EXACT_LSF_PLUS_OUTER_BOARD_START = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK
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

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall compatible anchor-delta Gate D", () => {
  it("calculates a compatible added outer board from the exact measured LSF Rw anchor", () => {
    for (const layers of [EXACT_LSF_PLUS_OUTER_BOARD_END, EXACT_LSF_PLUS_OUTER_BOARD_START]) {
      const result = calculateAssembly(layers, {
        airborneContext: EXACT_LSF_LAB_CONTEXT,
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      });

      expect(result.metrics.estimatedRwDb).toBe(57);
      expect(result.supportedTargetOutputs).toEqual(["Rw"]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.airborneBasis).toMatchObject({
        anchorSourceId: "knauf_lab_416889_primary_2026",
        errorBudgetDb: 5,
        method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
        origin: "measured_exact_subassembly_plus_calculated_delta"
      });
      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: "candidate_dynamic_exact_subassembly_plus_calculated_delta",
        selectedOrigin: "measured_exact_subassembly_plus_calculated_delta"
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        candidateKind: "similarity_anchor",
        errorBudgetMetrics: ["Rw"],
        route: "wall",
        runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
        selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
        supportBucket: "anchored_estimate",
        supportedMetrics: ["Rw"],
        valuePins: [{ metric: "Rw", value: 57 }]
      });
      expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
    }
  });

  it("preserves exact precedence and blocks unsafe or unowned metric promotion", () => {
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
    const stcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });

    expect(exact.airborneBasis).toMatchObject({
      exactSourceId: "knauf_lab_416889_primary_2026",
      method: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 55 },
        { metric: "STC", value: 55 },
        { metric: "C", value: -1.5 },
        { metric: "Ctr", value: -6.4 }
      ]
    });
    expect(exact.unsupportedTargetOutputs).toEqual([]);

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
  });

  it("keeps docs and the current gate runner aligned on Gate D closeout and Gate E selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate C`).toContain(GATE_C_ACTION);
      expect(contents, `${relativePath} records landed Gate C file`).toContain(GATE_C_FILE);
      expect(contents, `${relativePath} records Gate C selection`).toContain(GATE_C_SELECTION_STATUS);
      expect(contents, `${relativePath} records landed Gate D`).toContain(GATE_D_ACTION);
      expect(contents, `${relativePath} records landed Gate D file`).toContain(GATE_D_FILE);
      expect(contents, `${relativePath} records Gate D selection`).toContain(GATE_D_SELECTION_STATUS);
      expect(contents, `${relativePath} records selected Gate E`).toContain(GATE_E_ACTION);
      expect(contents, `${relativePath} records selected Gate E file`).toContain(GATE_E_FILE);
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts");
  });
});
