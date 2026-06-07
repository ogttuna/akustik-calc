import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";
import {
  POST_V1_GATE_EB_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-eb";
import {
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS,
  POST_V1_GATE_EC_COUNTERS,
  POST_V1_GATE_EC_OWNER_ID,
  POST_V1_GATE_EC_OWNER_POLICY,
  POST_V1_GATE_EC_REJECTED_BOUNDARIES,
  POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS,
  POST_V1_GATE_EC_RUNTIME_PROBE_EXPECTATIONS,
  POST_V1_GATE_EC_TARGET_OUTPUTS,
  summarizePostV1FloorHeavyConcreteCombinedResilientChannelLowerTreatmentOwnerGateEC
} from "./post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const HEAVY_CONCRETE_COMBINED_ASTM_ALIAS_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function visibleHeavyConcreteCombinedLowerTreatmentStack(
  materialId: "acoustic_hanger_ceiling" | "furring_channel" | "resilient_channel" | "resilient_stud_ceiling"
): readonly LayerInput[] {
  return [
    { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
    { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
    { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
    { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 80 },
    { floorRole: "ceiling_cavity", materialId, thicknessMm: 120 }
  ] as const satisfies readonly LayerInput[];
}

describe("post-V1 floor heavy-concrete combined resilient-channel lower-treatment owner Gate EC", () => {
  it("lands after Gate EB without moving runtime values and selects the Gate ED runtime slice", () => {
    const summary = summarizePostV1FloorHeavyConcreteCombinedResilientChannelLowerTreatmentOwnerGateEC();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_eb_landed_no_runtime_selected_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_EC_COUNTERS,
      landedGate: POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE,
      noRuntimeValueMovement: true,
      ownerId: POST_V1_GATE_EC_OWNER_ID,
      ownerPolicy: POST_V1_GATE_EC_OWNER_POLICY,
      previousGateEB: {
        counters: POST_V1_GATE_EB_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_EC_REJECTED_BOUNDARIES,
      runtimeProbeExpectations: POST_V1_GATE_EC_RUNTIME_PROBE_EXPECTATIONS,
      selectedNextAction:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EC_TARGET_OUTPUTS
    });
  });

  it("keeps the resilient-channel owner narrow and rejects unsafe boundary crossings", () => {
    expect(POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS).toEqual([
      "structuralSupportType=reinforced_concrete",
      "impactSystemType=combined_upper_lower_system",
      "visibleCeilingCavityMaterialId=resilient_channel",
      "supportProductId=resilient_channel",
      "lowerTreatment.type=suspended_ceiling_elastic_hanger",
      "baseSlabOrFloor",
      "floatingOrToppingLayer",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "ceilingBoardSchedule",
      "ceilingCavityDepthMm",
      "ceilingFillThicknessMm",
      "ISO_12354_2_Annex_C_lab_impact_adapter"
    ]);
    expect(POST_V1_GATE_EC_OWNER_POLICY).toMatchObject({
      acceptedLowerTreatmentProductId: "resilient_channel",
      acceptedLowerTreatmentType: "suspended_ceiling_elastic_hanger",
      acceptedRuntimeBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      noRuntimeValueMovement: true,
      sourceRowsAreAnchorsNotProductCatalog: true
    });
    expect(POST_V1_GATE_EC_REJECTED_BOUNDARIES.map((boundary) => boundary.boundary)).toEqual([
      "already_live_adjacent_lower_treatment",
      "missing_route_required_physical_input",
      "old_low_confidence_reinforced_concrete_fallback",
      "wrong_metric_lower_treatment_delta_lw_subtraction",
      "astm_alias_not_owned"
    ]);
    expect(POST_V1_GATE_EC_COUNTERS).toMatchObject({
      acceptedOwnerLedgers: 1,
      estimatedNextNewCalculableLayerTemplates: 1,
      estimatedNextNewCalculableRequestShapes: 4,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps EC as a no-runtime owner proof delegated to Gate ED", () => {
    expect(POST_V1_GATE_EC_COUNTERS).toMatchObject({
      acceptedOwnerLedgers: 1,
      estimatedNextNewCalculableLayerTemplates: 1,
      estimatedNextNewCalculableRequestShapes: 4,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeValuesMoved: 0
    });
    expect(
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION
    ).toBe("post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_runtime_gate_ed_plan");
  });

  it("protects already-live adjacent lower-treatment corridors and ASTM alias boundaries", () => {
    const furring = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("furring_channel"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: HEAVY_CONCRETE_COMBINED_ASTM_ALIAS_OUTPUTS
      }
    );
    const acousticHanger = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("acoustic_hanger_ceiling"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: POST_V1_GATE_EC_TARGET_OUTPUTS
      }
    );
    const resilientStud = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("resilient_stud_ceiling"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: POST_V1_GATE_EC_TARGET_OUTPUTS
      }
    );

    expect(furring.impact).toMatchObject({
      DeltaLw: 28.9,
      LnW: 45.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      scope: "heavy_concrete_combined_upper_lower_formula_corridor"
    });
    expect(furring.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(furring.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(furring.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });

    expect(acousticHanger.impact).toMatchObject({
      DeltaLw: 28.9,
      LnW: 45.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    });
    expect(resilientStud.impact).toMatchObject({
      DeltaLw: 29.9,
      LnW: 44.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    });
  });

  it("records the Gate ED expected runtime movement without promoting values in EC", () => {
    expect(POST_V1_GATE_EC_RUNTIME_PROBE_EXPECTATIONS[0]).toMatchObject({
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      deltaLwDb: 29.9,
      id: "visible_resilient_channel_combined_upper_lower_formula_after_gate_ed",
      lnWDb: 44.6,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      sourceRowsRequiredForCalculation: false,
      supportedOutputs: POST_V1_GATE_EC_TARGET_OUTPUTS
    });
  });

  it("keeps EC/ED current-selection docs and the current-gate runner aligned without frontend implementation work", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_EC_OWNER_ID);
      expect(contents, path).toContain("acceptedOwnerLedgers: 1");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec-contract.test.ts"
    );
  });
});
