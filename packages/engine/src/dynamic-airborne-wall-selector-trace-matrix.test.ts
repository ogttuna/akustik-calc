import { describe, expect, it } from "vitest";

import type {
  AirborneContext,
  DynamicAirborneConfidenceClass,
  DynamicAirborneFamily,
  DynamicAirborneFamilyDecisionClass,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const LAB_DOUBLE_STUD_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  connectionType: "line_connection",
  studType: "light_steel_stud",
  studSpacingMm: 600,
  airtightness: "good",
  sharedTrack: "independent"
};

const WALL_SELECTOR_OUTPUTS = ["Rw", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

type HoldExpectation = {
  allowedLeadDb: number;
  boundaryCeilingDb: number;
  currentMetricDb: number;
  runnerUpMetricDb: number;
  targetMetricDb: number;
};

type TrimExpectation = {
  leading: number;
  trailing: number;
};

type WallSelectorTraceCase = {
  airborneContext: AirborneContext;
  expected: {
    confidenceClass: DynamicAirborneConfidenceClass;
    decisionClass?: DynamicAirborneFamilyDecisionClass;
    detectedFamily: DynamicAirborneFamily;
    dnTwDb?: number;
    hold?: HoldExpectation;
    notes?: readonly RegExp[];
    runnerUpFamily?: DynamicAirborneFamily;
    rwDb?: number;
    rwPrimeDb?: number;
    selectedBelowRunnerUp?: boolean;
    strategy: string;
    supported: readonly RequestedOutputId[];
    trim?: TrimExpectation;
    unsupported: readonly RequestedOutputId[];
    warnings?: readonly RegExp[];
    withoutWarnings?: readonly RegExp[];
  };
  id: string;
  layers: readonly LayerInput[];
};

const CASES: readonly WallSelectorTraceCase[] = [
  {
    id: "clear-double-leaf-field",
    airborneContext: FIELD_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 80 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      dnTwDb: 47,
      rwDb: 46,
      rwPrimeDb: 46,
      strategy: "double_leaf_empty_cavity_delegate",
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"],
      withoutWarnings: [/boundary between|family-boundary hold|still somewhat close/i]
    }
  },
  {
    id: "held-aac-boundary-field",
    airborneContext: FIELD_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      confidenceClass: "low",
      decisionClass: "ambiguous",
      detectedFamily: "lined_massive_wall",
      dnTwDb: 45,
      hold: {
        allowedLeadDb: 4,
        boundaryCeilingDb: 43,
        currentMetricDb: 50,
        runnerUpMetricDb: 39,
        targetMetricDb: 47
      },
      notes: [/family boundary is ambiguous/i, /ambiguity hold trimmed/i, /currently scoring slightly above/i],
      runnerUpFamily: "double_leaf",
      rwDb: 44,
      rwPrimeDb: 44,
      selectedBelowRunnerUp: true,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold",
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"],
      warnings: [/boundary between Lined Massive Wall and Double Leaf/i, /family-boundary hold was applied/i]
    }
  },
  {
    id: "clear-lined-massive-field",
    airborneContext: FIELD_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 160 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      confidenceClass: "medium",
      detectedFamily: "lined_massive_wall",
      dnTwDb: 47,
      rwDb: 47,
      rwPrimeDb: 47,
      strategy: "lined_massive_blend",
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"],
      withoutWarnings: [/boundary between|family-boundary hold|still somewhat close/i]
    }
  },
  {
    id: "held-g5-sibling-building",
    airborneContext: BUILDING_CONTEXT,
    layers: [
      { materialId: "ytong_g5_800", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 }
    ],
    expected: {
      confidenceClass: "low",
      decisionClass: "ambiguous",
      detectedFamily: "lined_massive_wall",
      dnTwDb: 47,
      hold: {
        allowedLeadDb: 4,
        boundaryCeilingDb: 46,
        currentMetricDb: 51,
        runnerUpMetricDb: 42,
        targetMetricDb: 49
      },
      notes: [/family boundary is ambiguous/i, /ambiguity hold trimmed/i],
      runnerUpFamily: "double_leaf",
      rwDb: 45,
      rwPrimeDb: 45,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold",
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"],
      warnings: [/boundary between Lined Massive Wall and Double Leaf/i, /family-boundary hold was applied/i]
    }
  },
  {
    id: "non-aac-heavy-core-trim-control",
    airborneContext: BUILDING_CONTEXT,
    layers: [
      { materialId: "rockwool", thicknessMm: 25 },
      { materialId: "porotherm_pls_140", thicknessMm: 140 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "glasswool", thicknessMm: 25 }
    ],
    expected: {
      confidenceClass: "medium",
      detectedFamily: "lined_massive_wall",
      dnTwDb: 49,
      notes: [/dynamic span \(1 leading, 1 trailing\)/i],
      rwDb: 47,
      rwPrimeDb: 47,
      strategy: "lined_massive_blend",
      supported: ["R'w", "DnT,w"],
      trim: {
        leading: 1,
        trailing: 1
      },
      unsupported: ["Rw"],
      warnings: [/excluded from the dynamic airborne span/i],
      withoutWarnings: [/boundary between|family-boundary hold|still somewhat close/i]
    }
  },
  {
    id: "strong-double-stud-lab-control",
    airborneContext: LAB_DOUBLE_STUD_CONTEXT,
    layers: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 70 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    expected: {
      confidenceClass: "medium",
      detectedFamily: "double_stud_system",
      rwDb: 61,
      strategy: "double_stud_surrogate_blend+double_stud_calibration",
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w"],
      warnings: [/double-stud corridor/i],
      withoutWarnings: [/boundary between|family-boundary hold|still somewhat close/i]
    }
  }
];

describe("dynamic airborne wall selector trace matrix", () => {
  it("pins value, support, family, runner-up, hold, and trim origin fields for representative wall selector routes", () => {
    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.airborneContext,
        calculator: "dynamic",
        targetOutputs: WALL_SELECTOR_OUTPUTS
      });
      const trace = result.dynamicAirborneTrace;

      expect(trace, `${testCase.id} trace`).toBeTruthy();
      if (!trace) {
        continue;
      }

      expect(result.supportedTargetOutputs, `${testCase.id} supported outputs`).toEqual(testCase.expected.supported);
      expect(result.unsupportedTargetOutputs, `${testCase.id} unsupported outputs`).toEqual(testCase.expected.unsupported);
      expect(result.metrics.estimatedRwDb, `${testCase.id} Rw`).toBe(testCase.expected.rwDb);
      expect(result.metrics.estimatedRwPrimeDb, `${testCase.id} R'w`).toBe(testCase.expected.rwPrimeDb);
      expect(result.metrics.estimatedDnTwDb, `${testCase.id} DnT,w`).toBe(testCase.expected.dnTwDb);

      expect(trace.detectedFamily, `${testCase.id} detected family`).toBe(testCase.expected.detectedFamily);
      expect(trace.confidenceClass, `${testCase.id} confidence`).toBe(testCase.expected.confidenceClass);
      expect(trace.strategy, `${testCase.id} strategy`).toBe(testCase.expected.strategy);
      expect(trace.familyDecisionClass, `${testCase.id} decision`).toBe(testCase.expected.decisionClass);
      expect(trace.runnerUpFamily, `${testCase.id} runner-up`).toBe(testCase.expected.runnerUpFamily);
      expect(trace.familyDecisionSelectedBelowRunnerUp, `${testCase.id} selected below runner-up`).toBe(
        testCase.expected.selectedBelowRunnerUp
      );
      expect(trace.familyDecisionMultiplePlausibleFamilies, `${testCase.id} multiple plausible families`).toBeUndefined();
      expect(trace.secondaryRunnerUpFamily, `${testCase.id} secondary runner-up`).toBeUndefined();

      if (testCase.expected.runnerUpFamily) {
        expect(trace.runnerUpFamilyScore, `${testCase.id} runner-up score`).toBeTypeOf("number");
        expect(trace.selectedFamilyScore, `${testCase.id} selected score`).toBeTypeOf("number");
      } else {
        expect(trace.runnerUpFamilyScore, `${testCase.id} runner-up score`).toBeUndefined();
      }

      if (testCase.expected.hold) {
        expect(trace.familyBoundaryHoldApplied, `${testCase.id} hold applied`).toBe(true);
        expect(trace.familyBoundaryHoldAllowedLeadDb, `${testCase.id} hold allowed lead`).toBe(
          testCase.expected.hold.allowedLeadDb
        );
        expect(trace.familyBoundaryHoldRunnerUpMetricDb, `${testCase.id} hold runner metric`).toBe(
          testCase.expected.hold.runnerUpMetricDb
        );
        expect(trace.familyBoundaryHoldBoundaryCeilingDb, `${testCase.id} hold ceiling`).toBe(
          testCase.expected.hold.boundaryCeilingDb
        );
        expect(trace.familyBoundaryHoldCurrentMetricDb, `${testCase.id} hold current metric`).toBe(
          testCase.expected.hold.currentMetricDb
        );
        expect(trace.familyBoundaryHoldTargetMetricDb, `${testCase.id} hold target metric`).toBe(
          testCase.expected.hold.targetMetricDb
        );
      } else {
        expect(trace.familyBoundaryHoldApplied, `${testCase.id} hold applied`).toBeUndefined();
      }

      if (testCase.expected.trim) {
        expect(trace.trimmedOuterLayersApplied, `${testCase.id} trim applied`).toBe(true);
        expect(trace.trimmedOuterLeadingCount, `${testCase.id} leading trim`).toBe(testCase.expected.trim.leading);
        expect(trace.trimmedOuterTrailingCount, `${testCase.id} trailing trim`).toBe(testCase.expected.trim.trailing);
      } else {
        expect(trace.trimmedOuterLayersApplied, `${testCase.id} trim applied`).toBeUndefined();
      }

      for (const pattern of testCase.expected.notes ?? []) {
        expect(trace.notes.some((note: string) => pattern.test(note)), `${testCase.id} note ${pattern}`).toBe(true);
      }

      for (const pattern of testCase.expected.warnings ?? []) {
        expect(result.warnings.some((warning: string) => pattern.test(warning)), `${testCase.id} warning ${pattern}`).toBe(
          true
        );
      }

      for (const pattern of testCase.expected.withoutWarnings ?? []) {
        expect(result.warnings.some((warning: string) => pattern.test(warning)), `${testCase.id} absent warning ${pattern}`).toBe(
          false
        );
      }
    }
  });
});
