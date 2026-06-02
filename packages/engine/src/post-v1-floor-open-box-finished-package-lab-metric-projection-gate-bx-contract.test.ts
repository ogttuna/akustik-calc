import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-bw";

const LANDED_GATE = "post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan";
const SELECTION_STATUS =
  "post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by";
const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_gate_by_plan";
const SELECTED_NEXT_FILE = "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-by-contract.test.ts";
const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const LAB_IMPACT_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const LAB_FIELD_IMPACT_OUTPUTS = ["Rw", "C", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const CTR_BOUNDARY_OUTPUTS = ["Ctr", "Ln,w"] as const satisfies readonly RequestedOutputId[];

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const EPS_SCREED_HYBRID_VARIANT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 43 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BW_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BX_OPEN_BOX_FINISHED_PACKAGE_LAB_METRIC_PROJECTION_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-box finished-package lab metric projection Gate BX", () => {
  it("lands a value-moving runtime gate selected by Gate BW", () => {
    expect({
      landedGate: LANDED_GATE,
      previousGateBWSelectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION,
      previousGateBWSelectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE,
      previousGateBWSelectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS,
      runtimeMovementThisGate: true,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectionStatus: SELECTION_STATUS
    }).toEqual({
      landedGate: "post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan",
      previousGateBWSelectedNextAction: "post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan",
      previousGateBWSelectedNextFile:
        "packages/engine/src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts",
      previousGateBWSelectionStatus:
        "post_v1_next_numeric_coverage_gap_gate_bw_landed_no_runtime_selected_floor_open_box_finished_package_lab_metric_projection_gate_bx",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_by_plan",
      selectedNextFile: "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-by-contract.test.ts",
      selectionStatus:
        "post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_landed_selected_next_numeric_coverage_gap_gate_by"
    });
  });

  it("projects dry package-transfer lab Rw/C into visible metrics on mixed lab-impact requests", () => {
    const result = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: LAB_IMPACT_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...LAB_IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 66,
      RwCtr: 62.1,
      RwCtrSemantic: "rw_plus_c",
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -3.9,
      estimatedRwDb: 66
    });
    expect(result.impact).toMatchObject({
      CI: 1.3,
      CI50_2500: 3.3,
      LnW: 50.8,
      LnWPlusCI: 52,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
  });

  it("projects EPS/screed hybrid lab Rw/C into visible metrics on mixed lab-field-impact requests", () => {
    const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: LAB_FIELD_IMPACT_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...LAB_FIELD_IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      C: -1.3,
      Rw: 72,
      RwCtrSemantic: "rw_plus_c",
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedRwDb: 72
    });
    expect(result.impact).toMatchObject({
      CI50_2500: 1,
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("keeps Ctr unsupported because Rw+C is not true Ctr", () => {
    const result = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: CTR_BOUNDARY_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr"]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 66,
      RwCtr: 62.1,
      RwCtrSemantic: "rw_plus_c"
    });
    expect(result.impact).toMatchObject({
      LnW: 50.8,
      basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BX runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(LANDED_GATE);
      expect(contents, path).toContain(SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("Rw 66 / C -3.9");
      expect(contents, path).toContain("Rw 72 / C -1.3");
      expect(contents, path).toContain("Ctr");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts"
    );
  });
});
