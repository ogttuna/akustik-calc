import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh-contract.test.ts",
  "apps/web/features/workbench/wall-triple-leaf-local-substitution-surface.ts",
  "apps/web/features/workbench/wall-triple-leaf-local-substitution-surface-parity.test.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

const GENERIC_GYPSUM_GLASSWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool_board", thicknessMm: 92.1 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool_board", thicknessMm: 92.1 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const LOCAL_ROCKWOOL_MLV_PLASTER_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const GENERIC_CONTEXT: AirborneContext = buildContext({
  cavity1: [1],
  cavity1DepthMm: 92.1,
  cavity2: [3],
  cavity2DepthMm: 92.1,
  internal: [2],
  sideA: [0],
  sideB: [4]
});

const LOCAL_CONTEXT: AirborneContext = buildContext({
  cavity1: [3],
  cavity1DepthMm: 50,
  cavity2: [5],
  cavity2DepthMm: 50,
  internal: [4],
  sideA: [0, 1, 2],
  sideB: [6, 7, 8]
});

const LOCAL_FIELD_CONTEXT: AirborneContext = {
  ...LOCAL_CONTEXT,
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildContext(input: {
  cavity1: readonly number[];
  cavity1DepthMm: number;
  cavity2: readonly number[];
  cavity2DepthMm: number;
  internal: readonly number[];
  sideA: readonly number[];
  sideB: readonly number[];
}): AirborneContext {
  return {
    contextMode: "element_lab",
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: input.cavity1DepthMm,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [...input.cavity1],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: input.cavity2DepthMm,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [...input.cavity2],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [...input.internal],
      sideALeafLayerIndices: [...input.sideA],
      sideBLeafLayerIndices: [...input.sideB],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };
}

function buildNrcAssemblyB(): { context: AirborneContext; layers: readonly LayerInput[] } {
  return {
    context: buildContext({
      cavity1: [1],
      cavity1DepthMm: 92.1,
      cavity2: [3],
      cavity2DepthMm: 92.1,
      internal: [2],
      sideA: [0],
      sideB: [4]
    }),
    layers: [
      { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
      { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
      { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
      { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
      { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 }
    ]
  };
}

describe("broad accuracy wall triple-leaf local substitution lab spectrum adapter coverage refresh", () => {
  it("lands the coverage refresh without runtime movement and selects field-context harmonization next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "wall_local_substitution_field_context_harmonization",
        reason:
          "selected now because lab Rw/STC/C/Ctr is live and the next same-family accuracy gap is field R'w/DnT,w harmonization against that lab anchor",
        selectedNow: true
      },
      {
        id: "floor_open_web_direct_fixed_lining_similarity",
        reason: "still needs a direct-fixed lower-support transfer owner before runtime promotion",
        selectedNow: false
      },
      {
        id: "floor_open_box_timber_similarity",
        reason: "still needs an open-box timber wet/dry support-family owner and negative boundary",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes supported lab adapter rows, protected boundaries, and ranked follow-ups", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterCoverageRefreshContract();

    expect(contract.summary).toEqual({
      basisBoundaryRowIds: [
        "wall.local_substitution_lab_plus_field_request.needs_input",
        "wall.local_substitution_building_prediction.boundary"
      ],
      correctlyBlockedRowIds: [
        "wall.local_substitution_flat_or_partial_topology.needs_input",
        "wall.local_substitution_duplicate_grouping.needs_input_boundary"
      ],
      exactPrecedenceBoundaryRowIds: ["wall.local_substitution_exact_same_stack_source.precedence_boundary"],
      failureClassCounts: {
        basis_boundary: 2,
        correct_block: 2,
        coverage_followup: 3,
        exact_precedence_boundary: 1,
        none: 5
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: [
        "wall.local_substitution_field_context_harmonization.followup_selected",
        "floor.open_web_direct_fixed_lining.followup",
        "floor.open_box_timber_similarity.followup"
      ],
      rowCount: 13,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      supportedRuntimeRowIds: [
        "wall.generic_gypsum_glasswool_local_substitution.lab_spectrum_adapter",
        "wall.local_rockwool_mlv_plaster_local_substitution.lab_spectrum_adapter",
        "wall.local_rockwool_mlv_plaster_local_substitution.stc_only_adapter",
        "wall.nrc_2024_calibrated_control.precedence_boundary",
        "wall.local_substitution_complete_field_context.separate_field_route"
      ]
    });
    expect(
      contract.matrixRows.find(
        (row) => row.id === "wall.local_substitution_field_context_harmonization.followup_selected"
      )
    ).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: [
        "localSubstitutionFieldContextHarmonizationOwner",
        "localSubstitutionRwAnchorOwner",
        "fieldBudgetReconciliationOwner"
      ],
      nextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      requestedMetrics: ["R'w", "DnT,w"],
      route: "wall"
    });
  });

  it("keeps generic, local, and STC-only lab adapter values pinned", () => {
    const generic = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: GENERIC_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const local = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const stcOnly = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });

    expect(generic.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 50,
      estimatedStc: 61
    });
    expect(generic.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(generic.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    });

    expect(local.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(local.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(local.unsupportedTargetOutputs).toEqual([]);
    expect(local.warnings).toContain(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING);

    expect(stcOnly.metrics).toMatchObject({
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(stcOnly.supportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnly.unsupportedTargetOutputs).toEqual([]);
    expect(stcOnly.ratingAdapterBasisSet?.map((basis: { metricId: string; ratingStandard: string }) => basis.metricId)).toEqual(["STC"]);
  });

  it("keeps calibrated controls, field requests, building requests, and hostile topology in their own lanes", () => {
    const nrc = buildNrcAssemblyB();
    const calibrated = calculateAssembly(nrc.layers, {
      airborneContext: nrc.context,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const mixedFieldRequest = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_OUTPUTS
    });
    const completeField = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const buildingRequest = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: {
        ...LOCAL_CONTEXT,
        contextMode: "building_prediction"
      },
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const duplicate = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: {
        ...LOCAL_CONTEXT,
        wallTopology: {
          ...LOCAL_CONTEXT.wallTopology,
          sideALeafLayerIndices: [0, 1, 2, 3]
        }
      },
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(calibrated.metrics).toMatchObject({
      estimatedCDb: 1.4,
      estimatedCtrDb: -7.4,
      estimatedRwDb: 49,
      estimatedStc: 60
    });
    expect(calibrated.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      origin: "calibrated_family_physics"
    });
    expect(calibrated.airborneCandidateResolution?.selectedCandidateId).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
    );

    expect(mixedFieldRequest.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(mixedFieldRequest.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(mixedFieldRequest.airborneBasis?.origin).toBe("needs_input");
    expect(mixedFieldRequest.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);

    expect(completeField.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedRwPrimeDb: 51
    });
    expect(completeField.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(completeField.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);

    expect(buildingRequest.supportedTargetOutputs).toEqual([]);
    expect(buildingRequest.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(buildingRequest.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD
    );

    expect(duplicate.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(duplicate.airborneBasis?.missingPhysicalInputs).toEqual(["leafGrouping"]);
    expect(duplicate.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs, exports, and current-gate runners aligned with the coverage refresh", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("stc 64");
      expect(normalizedContent, path).toContain("field context");
      expect(normalizedContent, path).toContain("r'w");
      expect(normalizedContent, path).toContain("dnt,w");
      expect(normalizedContent, path).toContain("direct-fixed");
      expect(normalizedContent, path).toContain("open-box");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh"
    );
    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh-contract.test.ts"
    );
  });
});
