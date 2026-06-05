import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
  computeAstmE989ImpactRating
} from "./impact-astm-e989";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import {
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";
import {
  POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
  POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ch";
import {
  POST_V1_GATE_CI_ASTM_TARGETS,
  POST_V1_GATE_CI_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_CI_PLAN_DOC_PATH,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS,
  rankPostV1GateCINumericCoverageCandidates,
  summarizePostV1GateCINumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ci";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HEAVY_FLOATING_UPPER_TREATMENT_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const HEAVY_FLOATING_COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

const DIRECT_FLANKING_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  directPathOffsetDb: 2,
  flankingPaths: [
    {
      id: "gate_ci_rigid_wall_path",
      junctionClass: "rigid",
      label: "Gate CI representative reinforced-concrete wall flanking path",
      levelOffsetDb: 4,
      pathCount: 1,
      pathType: "wall",
      supportingElementFamily: "reinforced_concrete"
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const OPEN_BOX_EPS_SCREED_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

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

const IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const LAB_WITH_ASTM_OUTPUTS = ["Ln,w", "DeltaLw", ...POST_V1_GATE_CI_ASTM_TARGETS] as const satisfies readonly RequestedOutputId[];
const FIELD_WITH_ASTM_OUTPUTS = [...FIELD_OUTPUTS, ...POST_V1_GATE_CI_ASTM_TARGETS] as const satisfies readonly RequestedOutputId[];
const DIRECT_FLANKING_WITH_ASTM_OUTPUTS = [
  "L'nT,50",
  ...POST_V1_GATE_CI_ASTM_TARGETS
] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_CI_PLAN_DOC_PATH
] as const;

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "Gate CI ASTM E492 lab source with complete one-third-octave bands",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "Gate CI ASTM E1007 field source with complete one-third-octave bands",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate CI", () => {
  it("lands a no-runtime Gate CI audit after Gate CH and selects wall common auto-topology Gate CJ", () => {
    const summary = summarizePostV1GateCINumericCoverageGap();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
    );
    expect(summary).toMatchObject({
      astmExactBandBaselineAlreadyOwned: true,
      astmFormulaRuntimeAdmitted: false,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_CI_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_CI_PLAN_DOC_PATH,
      previousGateCH: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS
      },
      selectedCandidateId: "wall.common_auto_topology_expansion",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS,
      userSuppliedAstmBandInputDeferred: true
    });
  });

  it("preserves the exact ASTM E492/E1007 baseline instead of re-landing it", () => {
    expect(computeAstmE989ImpactRating(ASTM_LAB_IIC_SOURCE.frequenciesHz, ASTM_LAB_IIC_SOURCE.levelsDb)).toMatchObject({
      contourLevelAt500HzDb: 60,
      rating: 50
    });

    const lab = calculateImpactOnly([], {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: IIC_OUTPUTS
    });
    const field = calculateAssembly(FLOOR_STACK, {
      calculator: "dynamic",
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: AIIC_OUTPUTS
    });

    expect(lab.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab",
      metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS }
    });
    expect(lab.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["IIC"]
    });
    expect(field.impact).toMatchObject({
      AIIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"]
    });
  });

  it("keeps four representative ISO impact routes from publishing ASTM IIC or AIIC aliases", () => {
    const cases = [
      {
        expectedSupportedOutputs: ["Ln,w", "DeltaLw"],
        id: "heavy_floating_lab_formula",
        result: calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
          calculator: "dynamic",
          floorImpactContext: HEAVY_FLOATING_COMPLETE_FLOOR_IMPACT_CONTEXT,
          targetOutputs: LAB_WITH_ASTM_OUTPUTS
        })
      },
      {
        expectedSupportedOutputs: ["L'nT,50"],
        id: "heavy_floating_direct_flanking_field_adapter",
        result: calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
          calculator: "dynamic",
          impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
          targetOutputs: DIRECT_FLANKING_WITH_ASTM_OUTPUTS
        })
      },
      {
        expectedSupportedOutputs: [...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS],
        id: "lower_treatment_field_adapter",
        result: calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
          calculator: "dynamic",
          floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
          impactFieldContext: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
          targetOutputs: [...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS, ...POST_V1_GATE_CI_ASTM_TARGETS]
        })
      },
      {
        expectedSupportedOutputs: [...FIELD_OUTPUTS],
        id: "open_box_eps_screed_field_adapter",
        result: calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
          calculator: "dynamic",
          impactFieldContext: OPEN_BOX_EPS_SCREED_FIELD_CONTEXT,
          targetOutputs: FIELD_WITH_ASTM_OUTPUTS
        })
      }
    ] as const;

    expect(cases).toHaveLength(POST_V1_GATE_CI_NO_RUNTIME_COUNTERS.evaluatedIsoImpactRoutes);

    for (const testCase of cases) {
      expect(testCase.result.supportedTargetOutputs, testCase.id).toEqual(testCase.expectedSupportedOutputs);
      expect(testCase.result.unsupportedTargetOutputs, testCase.id).toEqual(["IIC", "AIIC"]);
      expect(testCase.result.impact?.IIC, testCase.id).toBeUndefined();
      expect(testCase.result.impact?.AIIC, testCase.id).toBeUndefined();
      expect(testCase.result.layerCombinationResolverTrace?.boundaryCandidateIds, testCase.id).toEqual(
        expect.arrayContaining(["generic.astm_iic_aiic.unsupported_boundary"])
      );
    }
  });

  it("ranks Gate CJ above ASTM expansion because it moves calculator scope through existing formulas", () => {
    const candidates = rankPostV1GateCINumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates.map((candidate) => candidate.candidateOrder)).toEqual([1, 2, 3, 4]);
    expect(selected).toMatchObject({
      id: "wall.common_auto_topology_expansion",
      runtimeAdmissibleNow: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
      touchesFrontendOrSharedSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.astm_iic_aiic_owner_expansion_beyond_exact_bands")?.score ?? 0
    );
    expect(byId.get("floor.astm_iic_aiic_owner_expansion_beyond_exact_bands")).toMatchObject({
      runtimeAdmissibleNow: false,
      selected: false,
      targetMetrics: ["IIC", "AIIC"]
    });
    expect(byId.get("input_surface.user_supplied_astm_impact_bands")).toMatchObject({
      runtimeAdmissibleNow: false,
      selected: false,
      touchesFrontendOrSharedSurface: true
    });
  });

  it("keeps docs and current-gate runner aligned with the Gate CI/CJ plan", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("wall.common_auto_topology_expansion");
      expect(contents, path).toContain("ISO");
      expect(contents, path).toContain("IIC");
      expect(contents, path).toContain("AIIC");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts");
  });
});
