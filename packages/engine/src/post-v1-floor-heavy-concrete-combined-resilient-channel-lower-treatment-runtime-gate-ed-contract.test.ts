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
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS,
  POST_V1_GATE_EC_COUNTERS,
  POST_V1_GATE_EC_OWNER_ID,
  POST_V1_GATE_EC_OWNER_POLICY,
  POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS
} from "./post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-owner-gate-ec";
import {
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS,
  POST_V1_GATE_ED_COUNTERS,
  POST_V1_GATE_ED_RUNTIME_PROBE_EXPECTATIONS,
  POST_V1_GATE_ED_TARGET_OUTPUTS,
  summarizePostV1FloorHeavyConcreteCombinedResilientChannelLowerTreatmentRuntimeGateED
} from "./post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const HEAVY_CONCRETE_COMBINED_TARGET_OUTPUTS = [
  "Rw",
  "Ctr",
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 floor heavy-concrete combined resilient-channel lower-treatment runtime Gate ED", () => {
  it("lands after Gate EC and selects the next numeric coverage gap rerank", () => {
    const summary = summarizePostV1FloorHeavyConcreteCombinedResilientChannelLowerTreatmentRuntimeGateED();

    expect(POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS).toBe(
      "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_landed_no_runtime_selected_resilient_channel_lower_treatment_runtime_gate_ed"
    );
    expect(POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE
    );
    expect(POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_ED_COUNTERS,
      landedGate: POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_LANDED_GATE,
      previousGateEC: {
        counters: POST_V1_GATE_EC_COUNTERS,
        landedGate: POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_LANDED_GATE,
        ownerId: POST_V1_GATE_EC_OWNER_ID,
        ownerPolicy: POST_V1_GATE_EC_OWNER_POLICY,
        requiredOwnerFields: POST_V1_GATE_EC_REQUIRED_OWNER_FIELDS,
        selectedNextAction:
          POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTED_NEXT_FILE,
        selectionStatus:
          POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_OWNER_GATE_EC_SELECTION_STATUS
      },
      runtimeProbeExpectations: POST_V1_GATE_ED_RUNTIME_PROBE_EXPECTATIONS,
      selectedNextAction:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      targetOutputs: POST_V1_GATE_ED_TARGET_OUTPUTS,
      valueMovement: "visible_resilient_channel_lower_treatment_formula_promotion"
    });
  });

  it("calculates visible resilient-channel heavy-concrete combined lower-treatment through the owned formula corridor", () => {
    const result = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("resilient_channel"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: HEAVY_CONCRETE_COMBINED_TARGET_OUTPUTS
      }
    );

    expect(result.floorSystemRatings).toMatchObject({
      Rw: 58,
      RwCtr: 51.1,
      basis: "screening_mass_law_curve_seed_v3"
    });
    expect(result.impact).toMatchObject({
      DeltaLw: 29.9,
      LnW: 44.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      scope: "heavy_concrete_combined_upper_lower_formula_corridor"
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ctr", "Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      supportedMetrics: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
    });
    expect(POST_V1_GATE_ED_RUNTIME_PROBE_EXPECTATIONS[0]).toMatchObject({
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      deltaLwDb: 29.9,
      lnWDb: 44.6,
      ownerId: POST_V1_GATE_EC_OWNER_ID,
      sourceRowsRequiredForCalculation: false,
      supportedOutputs: POST_V1_GATE_ED_TARGET_OUTPUTS
    });
  });

  it("keeps route-required physical inputs as needs-input instead of guessing", () => {
    const result = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("resilient_channel"),
      {
        calculator: "dynamic",
        floorImpactContext: {
          resilientLayerDynamicStiffnessMNm3: 30
        },
        targetOutputs: POST_V1_GATE_ED_TARGET_OUTPUTS
      }
    );

    expect(result.impact).toBeNull();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.impactPredictorStatus).toMatchObject({
      active: false,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false
    });
  });

  it("protects adjacent lower-treatment corridors and keeps ASTM aliases unsupported", () => {
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
        targetOutputs: POST_V1_GATE_ED_TARGET_OUTPUTS
      }
    );
    const resilientStud = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("resilient_stud_ceiling"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: POST_V1_GATE_ED_TARGET_OUTPUTS
      }
    );

    expect(furring.impact).toMatchObject({
      DeltaLw: 28.9,
      LnW: 45.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    });
    expect(furring.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(furring.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
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

  it("keeps ED/EE current-selection docs and current-gate runner aligned without frontend work", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_HEAVY_CONCRETE_COMBINED_RESILIENT_CHANNEL_LOWER_TREATMENT_RUNTIME_GATE_ED_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain("newCalculableLayerTemplates 1");
      expect(contents, path).toContain("newCalculableRequestShapes 4");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts"
    );
  });
});
