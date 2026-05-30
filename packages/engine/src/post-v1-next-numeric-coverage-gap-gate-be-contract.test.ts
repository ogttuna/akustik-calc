import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd";
import {
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS,
  rankPostV1GateBENumericCoverageCandidates,
  summarizePostV1GateBENumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-be";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BE_SURFACES = [
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be.ts",
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/impact-field-context.ts",
  "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
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
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BE", () => {
  it("lands Gate BE after Gate BD and selects lower-treatment field companion Gate BF", () => {
    const summary = summarizePostV1GateBENumericCoverageGap();

    expect(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS).toBe(
      "post_v1_floor_suspended_ceiling_lower_treatment_coverage_refresh_gate_bd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_be"
    );
    expect(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBD: {
        landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_COVERAGE_REFRESH_GATE_BD_SELECTION_STATUS
      },
      selectedCandidateId: "floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS,
      targetMetricsForSelectedSlice: ["L'n,w", "L'nT,w", "L'nT,50"]
    });

    for (const path of REQUIRED_GATE_BE_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ranks direct numeric coverage above catalog, wording, and finite scenario work", () => {
    const candidates = rankPostV1GateBENumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap",
      "floor.mixed_support_family.multi_family_solver_gap",
      "broad_source_row_crawl",
      "confidence_wording_or_low_confidence_surface",
      "finite_scenario_pack"
    ]);
    expect(selected).toMatchObject({
      coverageImpact: 0.94,
      id: "floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap",
      score: 1.86,
      selected: true,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
  });

  it("uses the existing mixed lab-plus-field runtime as evidence for the selected Gate BF slice", () => {
    const result = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: {
        ci50_2500Db: 4,
        fieldKDb: 2,
        receivingRoomVolumeM3: 60
      },
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 28.9,
      LPrimeNT50: 48.8,
      LPrimeNTw: 44.8,
      LPrimeNW: 47.6,
      LnW: 45.6
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BE selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BE_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.suspended_ceiling_lower_treatment.field_companion_assembly_runtime_gap");
      expect(contents, path).toContain("L'nT,50 48.8");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-be-contract.test.ts");
  });
});
