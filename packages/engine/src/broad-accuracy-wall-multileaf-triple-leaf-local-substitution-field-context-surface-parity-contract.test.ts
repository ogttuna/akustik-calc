import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-building-adapter";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextSurfaceParityContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity-contract.test.ts",
  "apps/web/features/workbench/airborne-field-context-surface.ts",
  "apps/web/features/workbench/airborne-field-context-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
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

const LOCAL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const CONTRACT_FIELD_CONTEXT: AirborneContext = {
  ...LOCAL_LAB_CONTEXT,
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

const WORKBENCH_FIELD_CONTEXT: AirborneContext = {
  ...LOCAL_LAB_CONTEXT,
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  ...CONTRACT_FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  sourceRoomVolumeM3: 50
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy wall triple-leaf local substitution field-context surface parity", () => {
  it("lands the no-runtime surface parity gate and selects direct-fixed open-web owner work next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextSurfaceParityContract();

    expect(contract).toMatchObject({
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE,
      runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      runtimeMovedAtSurfaceParity: false,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS,
      surfaceTargets: [
        "output_cards",
        "route_posture",
        "dynamic_trace",
        "method_dossier",
        "local_saved_replay",
        "server_snapshot_replay",
        "calculator_api_payload",
        "markdown_report",
        "field_warning_surface",
        "missing_context_boundary",
        "lab_field_basis_boundary",
        "building_prediction_boundary",
        "exact_precedence_boundary"
      ]
    });
    expect(contract.previousHarmonization).toEqual({
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS
    });
    expect(contract.valuePins.map((pin) => pin.expected)).toEqual([
      { dntwDb: 53, errorBudgetDb: 10, rwPrimeDb: 51 },
      { dntwDb: 53, errorBudgetDb: 10, rwPrimeDb: 52 }
    ]);
    expect(contract.rankedFollowups).toEqual([
      {
        id: "floor_open_web_direct_fixed_lining_similarity",
        reason:
          "selected next because the wall local-substitution field surface is visible and direct-fixed open-web still lacks a lower-support transfer owner",
        selectedNow: true
      },
      {
        id: "floor_open_box_timber_similarity",
        reason:
          "ranked after direct-fixed open-web because open-box timber needs a separate wet/dry support-family owner and negative boundary",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps local field values, candidate, warning, trace, and budget stable across public field contexts", () => {
    const contexts = [
      {
        expected: { dntwDb: 53, rwPrimeDb: 51 },
        id: "contract_context",
        value: CONTRACT_FIELD_CONTEXT
      },
      {
        expected: { dntwDb: 53, rwPrimeDb: 52 },
        id: "workbench_context",
        value: WORKBENCH_FIELD_CONTEXT
      }
    ] as const;

    for (const context of contexts) {
      const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
        airborneContext: context.value,
        calculator: "dynamic",
        targetOutputs: FIELD_OUTPUTS
      });

      expect(result.metrics, context.id).toMatchObject({
        estimatedDnTwDb: context.expected.dntwDb,
        estimatedRwDb: context.expected.rwPrimeDb,
        estimatedRwPrimeDb: context.expected.rwPrimeDb
      });
      expect(result.supportedTargetOutputs, context.id).toEqual(["R'w", "DnT,w"]);
      expect(result.unsupportedTargetOutputs, context.id).toEqual([]);
      expect(result.airborneBasis, context.id).toMatchObject({
        calculationStandard: "ISO 12354-1",
        errorBudgetDb: 10,
        family: "multileaf_multicavity",
        method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
        origin: "family_physics_prediction",
        ratingStandard: "ISO 717-1"
      });
      expect(result.airborneCandidateResolution, context.id).toMatchObject({
        runtimeValueMovement: true,
        selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        selectedOrigin: "family_physics_prediction"
      });
      expect(result.airborneBasis?.assumptions, context.id).toEqual(
        expect.arrayContaining([
          "local-substitution field context uses the local-substitution lab transmission-loss curve as the direct separating-element anchor",
          "R'w and DnT,w are calculated from explicit field_between_rooms geometry and reverberation context, not copied from lab Rw or STC"
        ])
      );
      expect(result.warnings, context.id).toEqual(
        expect.arrayContaining([
          BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING,
          "Local substitution field context carries a +/-10 dB source-absent error budget for R'w and DnT,w."
        ])
      );
      expect(result.dynamicAirborneTrace?.notes, context.id).toContain(
        "Field R'w and DnT,w are harmonized from the local-substitution lab curve plus explicit receiving-room context; building prediction remains blocked."
      );
    }
  });

  it("keeps lab, missing-context, building, and exact-source boundaries outside the surface claim", () => {
    const lab = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const missingContext = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: {
        ...CONTRACT_FIELD_CONTEXT,
        receivingRoomVolumeM3: undefined
      },
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const building = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const runtime = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: CONTRACT_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const exactFieldOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: CONTRACT_FIELD_CONTEXT,
      layers: LOCAL_ROCKWOOL_MLV_PLASTER_STACK,
      route: "wall",
      runtimeSignal: {
        airborneBasis: runtime.airborneBasis,
        detectedFamily: runtime.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: runtime.airborneCandidateResolution?.runtimeValueMovement,
        selectedMethod: runtime.dynamicAirborneTrace?.selectedMethod,
        strategy: runtime.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "broad_accuracy_local_substitution_exact_field_row",
          label: "Broad accuracy local substitution exact field row",
          metricLabel: "R'w",
          metricValue: 52,
          sourceMode: "field"
        }
      },
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(lab.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(lab.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    });

    expect(missingContext.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingContext.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["receivingRoomVolumeM3"],
      origin: "needs_input"
    });
    expect(missingContext.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    );

    expect(building.supportedTargetOutputs).toEqual(FIELD_OUTPUTS);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(building.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(building.airborneBasis?.method).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD
    );
    expect(building.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    );

    expect(exactFieldOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactFieldOverride.resolution.rejectedCandidateIds).toContain(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs, web surfaces, exports, and current-gate runners aligned with surface parity", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const text = readRepoFile(path);
      const normalizedText = text.toLowerCase();

      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE
      );
      expect(normalizedText, path).toContain("r'w 52");
      expect(text, path).toContain("DnT,w 53");
      expect(text, path).toContain("+/-10 dB");
      expect(normalizedText, path).toContain("cards");
      expect(normalizedText, path).toContain("api");
      expect(normalizedText, path).toContain("report");
      expect(normalizedText, path).toContain("direct-fixed");
      expect(normalizedText, path).toContain("open-box");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const webSurface = readRepoFile("apps/web/features/workbench/airborne-field-context-surface.ts");
    const webSurfaceTest = readRepoFile("apps/web/features/workbench/airborne-field-context-surface-parity.test.ts");

    expect(index).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity"
    );
    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("airborne-field-context-surface-parity.test.ts");
    expect(webSurface).toContain("Local-substitution field-context harmonization");
    expect(webSurface).toContain("not a lab Rw/STC relabel");
    expect(webSurface).toContain(
      "WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD"
    );
    expect(webSurfaceTest).toContain("Gate J grouped triple-leaf field surface");
    expect(webSurfaceTest).toContain('rwPrime: "52 dB"');
    expect(webSurfaceTest).toContain("local_substitution_field_saved");
    expect(webSurfaceTest).toContain("local_substitution_field_api");
  });
});
