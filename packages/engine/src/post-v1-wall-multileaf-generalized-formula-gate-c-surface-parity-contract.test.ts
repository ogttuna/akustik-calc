import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_B_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan";
const GATE_B_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts";
const GATE_B_SELECTION_STATUS =
  "post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs";

const GATE_C_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan";
const GATE_C_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts";
const GATE_C_SELECTION_STATUS =
  "post_v1_wall_multileaf_generalized_formula_gate_c_landed_selected_gate_d_compatible_anchor_delta";

const GATE_D_ACTION = "post_v1_wall_compatible_anchor_delta_gate_d_plan";
const GATE_D_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-gate-d-contract.test.ts";

const RUNTIME_BASIS = "triple_leaf_two_cavity_frequency_solver";
const SELECTED_RESOLVER_CANDIDATE_ID =
  "candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver";
const NEEDS_INPUT_CANDIDATE_ID = "generic.required_input_owner.needs_input_boundary";
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_AND_FIELD_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];
const FIELD_MISSING_INPUTS = [
  "contextMode",
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S"
] as const;

const GROUPED_ROCKWOOL_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const GROUPED_ROCKWOOL_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [3],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [2],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [4],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
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

const FLAT_MULTICAVITY_UNGROUPED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FLAT_MULTICAVITY_MISSING_INPUTS = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "sideBLeafGroup",
  "supportTopology"
] as const;

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

describe("post-V1 wall multileaf generalized formula Gate C surface parity and guided inputs", () => {
  it("keeps the generalized lab formula candidate visible while field outputs wait for physical inputs", () => {
    const result = calculateAssembly(GROUPED_ROCKWOOL_STACK, {
      airborneContext: GROUPED_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_AND_FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.7,
      estimatedCtrDb: -7.7,
      estimatedRwDb: 43,
      estimatedStc: 43
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [...FIELD_MISSING_INPUTS],
      origin: "needs_input",
      route: "wall",
      unsupportedOutputs: ["R'w", "DnT,w"]
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "element_lab",
      boundaryCandidateIds: [NEEDS_INPUT_CANDIDATE_ID],
      candidateKind: "source_absent_family_solver",
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: RUNTIME_BASIS,
      selectedCandidateId: SELECTED_RESOLVER_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 43 },
        { metric: "STC", value: 43 },
        { metric: "C", value: -0.7 },
        { metric: "Ctr", value: -7.7 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual(
      expect.arrayContaining([...FIELD_MISSING_INPUTS])
    );
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("Stopped outputs: R'w, DnT,w");
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain(
      "Missing physical inputs: contextMode, partitionAreaM2, receivingRoomVolumeM3, receivingRoomRt60S"
    );
  });

  it("does not turn exact rows or truly missing topology into the Gate C formula surface", () => {
    const exact = calculateAssembly(EXACT_LSF_LAB_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const ambiguous = calculateAssembly(FLAT_MULTICAVITY_UNGROUPED_STACK, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: "verified_airborne_exact_source",
      selectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
      supportBucket: "exact",
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 55 }]
    });
    expect(exact.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);

    expect(ambiguous.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      origin: "needs_input",
      unsupportedOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(ambiguous.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      runtimeBasisId: null,
      selectedCandidateId: NEEDS_INPUT_CANDIDATE_ID,
      supportBucket: "needs_input",
      valuePins: []
    });
  });

  it("keeps docs and the current gate runner aligned on Gate C closeout and Gate D selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate B`).toContain(GATE_B_ACTION);
      expect(contents, `${relativePath} records landed Gate B file`).toContain(GATE_B_FILE);
      expect(contents, `${relativePath} records Gate B selection`).toContain(GATE_B_SELECTION_STATUS);
      expect(contents, `${relativePath} records landed Gate C`).toContain(GATE_C_ACTION);
      expect(contents, `${relativePath} records landed Gate C file`).toContain(GATE_C_FILE);
      expect(contents, `${relativePath} records Gate C selection`).toContain(GATE_C_SELECTION_STATUS);
      expect(contents, `${relativePath} records selected Gate D`).toContain(GATE_D_ACTION);
      expect(contents, `${relativePath} records selected Gate D file`).toContain(GATE_D_FILE);
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts"
    );
  });
});
