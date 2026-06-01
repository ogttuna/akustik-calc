import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-br";

const LANDED_GATE = "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan";
const SELECTION_STATUS =
  "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt";
const SELECTED_NEXT_ACTION = "post_v1_next_numeric_coverage_gap_gate_bt_plan";
const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const FIELD_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const MIXED_FIELD_OUTPUTS = ["Ln,w", "CI,50-2500", ...FIELD_OUTPUTS] as const satisfies readonly RequestedOutputId[];
const FIELD_WITH_ASTM_ALIAS_OUTPUTS = [...FIELD_OUTPUTS, "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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
  "docs/calculator/POST_V1_GATE_BR_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/POST_V1_GATE_BS_OPEN_BOX_EPS_SCREED_FIELD_COMPANION_PLAN_2026-06-01.md"
] as const;

const GATE_BS_CONTRACT = {
  astmAliasesRemainUnsupported: true,
  beforeRuntimeGap:
    "dry package-transfer field-only used a mismatched generic anchor and EPS/screed hybrid field outputs stayed unsupported",
  landedGate: LANDED_GATE,
  previousGateBRSelectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION,
  previousGateBRSelectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE,
  previousGateBRSelectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS,
  runtimeMovementThisGate: true,
  selectedNextAction: SELECTED_NEXT_ACTION,
  selectionStatus: SELECTION_STATUS
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor open-box EPS/screed field companion Gate BS", () => {
  it("lands a value-moving runtime gate selected by Gate BR", () => {
    expect(GATE_BS_CONTRACT).toEqual({
      astmAliasesRemainUnsupported: true,
      beforeRuntimeGap:
        "dry package-transfer field-only used a mismatched generic anchor and EPS/screed hybrid field outputs stayed unsupported",
      landedGate: "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan",
      previousGateBRSelectedNextAction: "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan",
      previousGateBRSelectedNextFile:
        "packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts",
      previousGateBRSelectionStatus:
        "post_v1_next_numeric_coverage_gap_gate_br_landed_no_runtime_selected_floor_open_box_eps_screed_field_companion_gate_bs",
      runtimeMovementThisGate: true,
      selectedNextAction: "post_v1_next_numeric_coverage_gap_gate_bt_plan",
      selectionStatus:
        "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt"
    });
  });

  it("makes dry package-transfer field-only output use the same anchor as mixed lab-plus-field requests", () => {
    const mixed = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: MIXED_FIELD_OUTPUTS
    });
    const fieldOnly = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(mixed.supportedTargetOutputs).toEqual(["Ln,w", "CI,50-2500", ...FIELD_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(fieldOnly.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.impact).toMatchObject({
      CI50_2500: 3.3,
      LPrimeNT50: 53.7,
      LPrimeNTw: 50.4,
      LPrimeNW: 52.8,
      LnW: 50.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(fieldOnly.impact).toMatchObject({
      CI50_2500: 3.3,
      LPrimeNT50: 53.7,
      LPrimeNTw: 50.4,
      LPrimeNW: 52.8,
      LnW: 50.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(fieldOnly.impact?.metricBasis).toMatchObject({
      LnW: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
    });
    expect(fieldOnly.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...FIELD_OUTPUTS]
    });
  });

  it("opens EPS/screed hybrid field companions from the owned package lab anchor", () => {
    const mixed = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: MIXED_FIELD_OUTPUTS
    });
    const fieldOnly = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(mixed.supportedTargetOutputs).toEqual(["Ln,w", "CI,50-2500", ...FIELD_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(fieldOnly.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.impact).toMatchObject({
      CI50_2500: 1,
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(fieldOnly.impact).toMatchObject({
      CI50_2500: 1,
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      LnW: 47,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(fieldOnly.impact?.metricBasis).toMatchObject({
      LnW: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
    });
    expect(fieldOnly.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...FIELD_OUTPUTS]
    });
  });

  it("keeps missing field context and ASTM aliases outside the Gate BS runtime", () => {
    const missingContext = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const astmAliases = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
      calculator: "dynamic",
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_WITH_ASTM_ALIAS_OUTPUTS
    });

    expect(missingContext.supportedTargetOutputs).toEqual([]);
    expect(missingContext.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(missingContext.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor"
    });
    expect(missingContext.impact).toMatchObject({
      CI50_2500: 1,
      LnW: 47,
      basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    });
    expect(missingContext.impact?.LPrimeNW).toBeUndefined();

    expect(astmAliases.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(astmAliases.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astmAliases.impact).toMatchObject({
      LPrimeNT50: 47.6,
      LPrimeNTw: 46.6,
      LPrimeNW: 49,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(astmAliases.impact?.IIC).toBeUndefined();
    expect(astmAliases.impact?.AIIC).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate BS runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(LANDED_GATE);
      expect(contents, path).toContain(SELECTION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain("L'n,w 49");
      expect(contents, path).toContain("L'nT,w 46.6");
      expect(contents, path).toContain("ASTM `IIC` / `AIIC` remain");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts"
    );
  });
});
