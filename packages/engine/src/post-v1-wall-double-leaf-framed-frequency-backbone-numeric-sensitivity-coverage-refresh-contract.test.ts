import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId, TransmissionLossCurve } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildRatingsFromCurve } from "./curve-rating";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.frequency_backbone_numeric_sensitivity_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_explicit_surface_mass_leaf_scope_opener";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_SCOPE_OPENER_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed explicit surface-mass leaf scope opener";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const LIGHT_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 9.5 },
  { materialId: "gypsum_board", thicknessMm: 9.5 }
] as const satisfies readonly LayerInput[];
const BASELINE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];
const HEAVY_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 18 },
  { materialId: "gypsum_board", thicknessMm: 18 }
] as const satisfies readonly LayerInput[];
const ASYMMETRIC_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 25 }
] as const satisfies readonly LayerInput[];

const OWNER_FREQUENCIES_HZ = [
  63,
  80,
  100,
  125,
  160,
  200,
  250,
  315,
  400,
  500,
  630,
  800,
  1000,
  1250,
  1600,
  2000,
  2500,
  3150,
  4000
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  PREVIOUS_OWNER_PLAN_DOC,
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function contextOwnedPorousCavity(input: {
  missingFlowResistivity?: boolean;
  missingSupportSpacing?: boolean;
} = {}): AirborneContext {
  return {
    advancedWall: {
      cavities: [
        {
          absorberCoverageRatio: 1,
          ...(input.missingFlowResistivity ? {} : { absorberFlowResistivityPaSM2: 15000 }),
          absorberThicknessMm: 90,
          depthMm: 90,
          id: "cavity-1",
          sealState: "sealed"
        }
      ]
    },
    sharedTrack: "independent",
    ...(input.missingSupportSpacing ? {} : { studSpacingMm: 600 }),
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 90,
      cavity1FillCoverage: "full",
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [1],
      supportTopology: "independent_frames",
      topologyMode: "double_leaf_framed"
    }
  };
}

function calculateContextOwnedWall(
  layers: readonly LayerInput[],
  context: AirborneContext = contextOwnedPorousCavity(),
  targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS
) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

type CoverageResult = ReturnType<typeof calculateContextOwnedWall>;

function requireCurve(result: CoverageResult): TransmissionLossCurve {
  expect(result.curve).toBeDefined();

  if (!result.curve) {
    throw new Error("expected calculated transmission-loss curve");
  }

  return result.curve;
}

function curveValueAt(curve: TransmissionLossCurve, frequencyHz: number): number {
  const index = curve.frequenciesHz.indexOf(frequencyHz);
  expect(index, `${frequencyHz} Hz must be present in the owner curve`).toBeGreaterThanOrEqual(0);

  return curve.transmissionLossDb[index] ?? Number.NaN;
}

function expectMetricsFromCurve(result: CoverageResult) {
  const curve = requireCurve(result);
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);

  expect(result.metrics.estimatedRwDb).toBe(ratings.iso717.Rw);
  expect(result.metrics.estimatedStc).toBe(ratings.astmE413.STC);
  expect(result.metrics.estimatedCDb).toBe(ratings.iso717.C);
  expect(result.metrics.estimatedCtrDb).toBe(ratings.iso717.Ctr);
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    previousOwnerAction: PREVIOUS_OWNER_ACTION,
    previousOwnerFile: PREVIOUS_OWNER_FILE,
    previousOwnerStatus: PREVIOUS_OWNER_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall double-leaf/framed frequency-backbone numeric sensitivity coverage refresh", () => {
  it("lands the coverage refresh and selects a runtime scope opener next", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      previousOwnerAction: PREVIOUS_OWNER_ACTION,
      previousOwnerFile: PREVIOUS_OWNER_FILE,
      previousOwnerStatus: PREVIOUS_OWNER_STATUS,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes the calculated frequency backbone for the four owner leaf cases", () => {
    const ownerCases = [
      {
        expectedCurveDb: {
          100: 22.8,
          500: 39.2,
          1000: 45.2,
          3150: 55.2
        },
        expectedMetrics: {
          estimatedCDb: -1.5,
          estimatedCtrDb: -6.7,
          estimatedRwDb: 43,
          estimatedStc: 43
        },
        label: "light",
        layers: LIGHT_LEAF_STACK
      },
      {
        expectedCurveDb: {
          100: 26.5,
          500: 42.5,
          1000: 48.5,
          3150: 58.5
        },
        expectedMetrics: {
          estimatedCDb: -1,
          estimatedCtrDb: -6.1,
          estimatedRwDb: 46,
          estimatedStc: 46
        },
        label: "baseline",
        layers: BASELINE_LEAF_STACK
      },
      {
        expectedCurveDb: {
          100: 29.2,
          500: 44.7,
          1000: 50.7,
          3150: 60.7
        },
        expectedMetrics: {
          estimatedCDb: -1.6,
          estimatedCtrDb: -6.7,
          estimatedRwDb: 49,
          estimatedStc: 49
        },
        label: "heavy",
        layers: HEAVY_LEAF_STACK
      },
      {
        expectedCurveDb: {
          100: 29.4,
          500: 45.1,
          1000: 51.1,
          3150: 61
        },
        expectedMetrics: {
          estimatedCDb: -1.3,
          estimatedCtrDb: -6.4,
          estimatedRwDb: 49,
          estimatedStc: 49
        },
        label: "asymmetric",
        layers: ASYMMETRIC_LEAF_STACK
      }
    ] as const;

    const curves = new Map<string, TransmissionLossCurve>();

    for (const ownerCase of ownerCases) {
      const result = calculateContextOwnedWall(ownerCase.layers);
      const curve = requireCurve(result);

      curves.set(ownerCase.label, curve);
      expect(result.airborneBasis?.method).toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);
      expect(result.airborneBasis?.frequencyBands).toEqual({
        bandSet: "layer_combination_resolver_double_leaf_framed_wall_banded_runtime_curve",
        frequenciesHz: [...OWNER_FREQUENCIES_HZ]
      });
      expect(curve.frequenciesHz).toEqual([...OWNER_FREQUENCIES_HZ]);
      expect(result.metrics).toMatchObject(ownerCase.expectedMetrics);
      expectMetricsFromCurve(result);

      for (const [frequencyHz, expectedDb] of Object.entries(ownerCase.expectedCurveDb)) {
        expect(curveValueAt(curve, Number(frequencyHz)), `${ownerCase.label} ${frequencyHz} Hz`).toBeCloseTo(
          expectedDb,
          1
        );
      }
    }

    const light = curves.get("light");
    const baseline = curves.get("baseline");
    const heavy = curves.get("heavy");
    const asymmetric = curves.get("asymmetric");

    if (!light || !baseline || !heavy || !asymmetric) {
      throw new Error("expected all owner case curves");
    }

    for (const frequencyHz of [100, 500, 1000, 3150]) {
      expect(curveValueAt(baseline, frequencyHz)).toBeGreaterThan(curveValueAt(light, frequencyHz));
      expect(curveValueAt(heavy, frequencyHz)).toBeGreaterThan(curveValueAt(baseline, frequencyHz));
      expect(curveValueAt(asymmetric, frequencyHz)).toBeGreaterThan(curveValueAt(baseline, frequencyHz));
    }
  });

  it("re-probes adapter required inputs and keeps STC independent from Rw aliasing", () => {
    const result = calculateContextOwnedWall(BASELINE_LEAF_STACK);
    const stcOnly = calculateContextOwnedWall(BASELINE_LEAF_STACK, contextOwnedPorousCavity(), STC_ONLY_OUTPUT);
    const solverContract = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity(),
      layers: BASELINE_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const resultRatings = buildRatingsFromCurve(
      requireCurve(result).frequenciesHz,
      requireCurve(result).transmissionLossDb
    );
    const stcRatings = buildRatingsFromCurve(
      requireCurve(stcOnly).frequenciesHz,
      requireCurve(stcOnly).transmissionLossDb
    );

    expect(result.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        "The Gate S frequency backbone is the owned calculated transmission-loss curve for this complete double-leaf/framed route.",
        "Rw, STC, C, and Ctr are re-rated from the same calculated frequency curve; STC is an ASTM E413 adapter output, not an alias of Rw."
      ])
    );
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "calculatedFrequencyCurveShape",
        "ISO717-1 Rw adapter",
        "ISO717-1 C/Ctr spectrum adaptation adapter",
        "ASTM E413 STC adapter boundary"
      ])
    );
    expect(solverContract.candidateBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "calculatedFrequencyCurveShape",
        "ISO717-1 Rw adapter",
        "ISO717-1 C/Ctr spectrum adaptation adapter",
        "ASTM E413 STC adapter boundary"
      ])
    );
    expect(result.metrics.estimatedRwDb).toBe(resultRatings.iso717.Rw);
    expect(result.metrics.estimatedStc).toBe(resultRatings.astmE413.STC);
    expect(stcOnly.supportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnly.metrics.estimatedStc).toBe(stcRatings.astmE413.STC);
  });

  it("keeps missing route inputs and impact aliases outside the refresh", () => {
    const missingFlow = calculateContextOwnedWall(
      BASELINE_LEAF_STACK,
      contextOwnedPorousCavity({ missingFlowResistivity: true })
    );
    const missingSupportSpacing = calculateContextOwnedWall(
      BASELINE_LEAF_STACK,
      contextOwnedPorousCavity({ missingSupportSpacing: true })
    );
    const impact = calculateContextOwnedWall(BASELINE_LEAF_STACK, contextOwnedPorousCavity(), IMPACT_OUTPUTS);

    for (const result of [missingFlow, missingSupportSpacing]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.airborneBasis).toMatchObject({
        origin: "needs_input"
      });
    }

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate aligned with the coverage refresh closeout", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts"
    );
  });
});
