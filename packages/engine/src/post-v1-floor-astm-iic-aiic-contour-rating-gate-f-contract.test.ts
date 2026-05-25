import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, LayerInput, RequestedOutputId } from "@dynecho/shared";
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
  POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE,
  POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTION_STATUS
} from "./post-v1-floor-or-wall-next-formula-gap-gate-e";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_F_ACTION = "post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan";
const GATE_F_SELECTION_STATUS =
  "post_v1_floor_astm_iic_aiic_contour_rating_gate_f_landed_selected_surface_parity_or_next_floor_formula_gap";
const GATE_G_ACTION = "post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan";
const GATE_G_FILE =
  "packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md"
] as const;

const FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "post-v1 ASTM E492 lab source with complete one-third-octave bands",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "post-v1 ASTM E1007 field source with complete one-third-octave bands",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

const ISO_LAB_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  label: "ISO 717-2 source must not become IIC",
  standardMethod: "ISO 717-2"
} as const satisfies ExactImpactSource;

const INCOMPLETE_ASTM_LAB_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  frequenciesHz: IMPACT_RATING_FREQS_THIRD.slice(0, -1),
  label: "incomplete ASTM source must stay unsupported",
  levelsDb: astmContourLevels(62).slice(0, -1)
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor ASTM IIC/AIIC contour rating Gate F", () => {
  it("calculates lab IIC from an exact ASTM E492 one-third-octave source without ISO aliasing", () => {
    expect(computeAstmE989ImpactRating(ASTM_LAB_IIC_SOURCE.frequenciesHz, ASTM_LAB_IIC_SOURCE.levelsDb)).toMatchObject({
      contourLevelAt500HzDb: 60,
      maxDeficiencyDb: 2,
      rating: 50,
      sumDeficiencyDb: 32
    });

    const result = calculateImpactOnly([], {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: IIC_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      IIC: 50,
      availableOutputs: ["IIC"],
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab",
      metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS }
    });
    expect(result.impact?.LnW).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["IIC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "astm_rating_boundary",
      candidateKind: "exact_measured_override",
      route: "floor",
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportBucket: "exact",
      supportedMetrics: ["IIC"],
      valuePins: [{ metric: "IIC", value: 50 }]
    });
  });

  it("calculates field AIIC from an exact ASTM E1007 source and keeps lab IIC separate", () => {
    const result = calculateAssembly(FLOOR_STACK, {
      calculator: "dynamic",
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: AIIC_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      AIIC: 50,
      availableOutputs: ["AIIC"],
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["AIIC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "astm_rating_boundary",
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"],
      valuePins: [{ metric: "AIIC", value: 50 }]
    });
  });

  it("keeps ISO impact-band rows and incomplete ASTM curves from promoting IIC", () => {
    for (const exactImpactSource of [ISO_LAB_SOURCE, INCOMPLETE_ASTM_LAB_SOURCE]) {
      const result = calculateImpactOnly([], {
        exactImpactSource,
        targetOutputs: IIC_OUTPUTS
      });

      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual(["IIC"]);
      expect(result.acousticAnswerBoundary).toMatchObject({
        origin: "unsupported",
        route: "floor",
        unsupportedOutputs: ["IIC"]
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
        supportBucket: "unsupported",
        supportedMetrics: [],
        valuePins: []
      });
    }
  });

  it("keeps docs and the current gate runner aligned on Gate F closeout and the selected follow-up", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate E`).toContain(
        POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_LANDED_GATE
      );
      expect(contents, `${relativePath} records Gate E selected Gate F`).toContain(
        POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records Gate E status`).toContain(
        POST_V1_FLOOR_OR_WALL_NEXT_FORMULA_GAP_GATE_E_SELECTION_STATUS
      );
      expect(contents, `${relativePath} records landed Gate F`).toContain(GATE_F_ACTION);
      expect(contents, `${relativePath} records Gate F status`).toContain(GATE_F_SELECTION_STATUS);
      expect(contents, `${relativePath} records selected Gate G`).toContain(GATE_G_ACTION);
      expect(contents, `${relativePath} records selected Gate G file`).toContain(GATE_G_FILE);
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts");
  });
});
