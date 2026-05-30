import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS,
  buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDContract
} from "./post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc";
import {
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BD_SURFACES = [
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb.ts",
  "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "apps/web/features/workbench/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc.test.ts",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor suspended-ceiling lower-treatment coverage refresh Gate BD", () => {
  it("lands Gate BD after Gate BC and selects the next numeric coverage gap", () => {
    const contract = buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDContract();

    expect(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE
    );
    expect(contract).toMatchObject({
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousSurfaceParity: {
        landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE,
        selectedNextAction:
          POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS
      },
      selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "post_v1_next_numeric_coverage_gap_gate_be",
        reason: "selected now to rerank remaining numeric calculator gaps after lower-treatment formula coverage is locked",
        selectedNow: true
      },
      {
        id: "floor.mixed_support_family.multi_family_solver_gap",
        reason: "known remaining high-risk floor gap; Gate BE must compare it against other calculator-capacity candidates",
        selectedNow: false
      },
      {
        id: "broad_source_row_crawl",
        reason: "finite source collection still does not solve source-absent arbitrary layer combinations by itself",
        selectedNow: false
      },
      {
        id: "confidence_wording_or_low_confidence_surface",
        reason: "wording does not add a formula lane or supported metric",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_GATE_BD_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes supported, stopped, unsupported, and follow-up rows without readiness inflation", () => {
    const contract = buildPostV1FloorSuspendedCeilingLowerTreatmentCoverageRefreshGateBDContract();

    expect(contract.summary).toEqual({
      correctlyBlockedRowIds: [
        "floor.suspended_ceiling_lower_treatment.missing_load_basis.needs_input",
        "floor.suspended_ceiling_lower_treatment.missing_lower_assembly.needs_input"
      ],
      failureClassCounts: {
        correct_block: 2,
        coverage_followup: 2,
        none: 3,
        unsupported_metric: 1
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: [
        "floor.mixed_support_family.multi_family_solver_gap.followup",
        "post_v1.next_numeric_coverage_gap_gate_be.next"
      ],
      rowCount: 8,
      selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_LABEL,
      supportedRuntimeRowIds: [
        "floor.suspended_ceiling_lower_treatment.acoustic_hanger.lab_formula",
        "floor.suspended_ceiling_lower_treatment.resilient_stud.lab_formula",
        "floor.suspended_ceiling_lower_treatment.impact_only_api.lab_formula"
      ],
      unsupportedRowIds: ["floor.suspended_ceiling_lower_treatment.astm_iic_aiic.unsupported"]
    });
    expect(
      contract.matrixRows.find((row) => row.id === "floor.mixed_support_family.multi_family_solver_gap.followup")
    ).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: ["singleCarrierFamilyOwner", "duplicateOwnershipGuard"],
      nextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
      requestedMetrics: ["Ln,w", "DeltaLw"],
      route: "floor"
    });
  });

  it("keeps acoustic-hanger, resilient-stud, and impact-only runtime values pinned", () => {
    const acousticHanger = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const resilientStud = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const impactOnly = calculateImpactOnly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw"]
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
    expect(impactOnly.impact).toMatchObject({
      DeltaLw: 28.9,
      LnW: 45.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    });

    for (const result of [acousticHanger, resilientStud, impactOnly]) {
      expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
        selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
        supportedMetrics: ["Ln,w", "DeltaLw"]
      });
    }
  });

  it("keeps missing owner fields and ASTM requests as value-less boundaries", () => {
    const missingLoad = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: {
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.resilientLayerDynamicStiffnessMNm3
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const missingLower = calculateAssembly(
      POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS.filter(
        (layer) => layer.floorRole !== "ceiling_cavity"
      ),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );
    const astm = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["IIC", "AIIC"]
    });

    expect(missingLoad.impact).toBeNull();
    expect(missingLoad.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      unsupportedOutputs: ["Ln,w", "DeltaLw"]
    });
    expect(missingLower.impact).toBeNull();
    expect(missingLower.supportedTargetOutputs).toEqual([]);
    expect(missingLower.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(astm.impact).toBeNull();
    expect(astm.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BD closeout and Gate BE selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain("floor.mixed_support_family.multi_family_solver_gap");
      expect(contents, path).toContain("Ln,w 45.6");
      expect(contents, path).toContain("DeltaLw 29.9");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts"
    );
  });
});
