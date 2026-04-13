import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getConsultantDecisionTrail } from "./consultant-decision-trail";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import { describeAirborneValidationPosture, getAirborneBoundaryPosture } from "./validation-regime";

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

type WallSelectorRow = {
  materialId: string;
  thicknessMm: string;
};

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type WallSelectorCardCase = {
  airborneContext: AirborneContext;
  branch: {
    detailIncludes?: readonly RegExp[];
    detailWithout?: readonly RegExp[];
    tone: "neutral" | "ready" | "warning";
    value: string;
  };
  cards: Record<(typeof WALL_SELECTOR_OUTPUTS)[number], CardSnapshot>;
  expected: {
    boundaryDetailIncludes?: readonly RegExp[];
    detectedFamily: string;
    dnTwDb?: number;
    postureIncludes?: readonly RegExp[];
    rwDb?: number;
    rwPrimeDb?: number;
    supported: readonly RequestedOutputId[];
    unsupported: readonly RequestedOutputId[];
    withoutBoundaryPosture?: boolean;
  };
  id: string;
  rows: readonly WallSelectorRow[];
};

const CASES: readonly WallSelectorCardCase[] = [
  {
    id: "clear-double-leaf-field",
    airborneContext: FIELD_CONTEXT,
    rows: [
      { materialId: "ytong_aac_d700", thicknessMm: "80" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expected: {
      detectedFamily: "double_leaf",
      dnTwDb: 47,
      rwDb: 46,
      rwPrimeDb: 46,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"],
      withoutBoundaryPosture: true
    },
    branch: {
      detailWithout: [/boundary|hold/i],
      tone: "neutral",
      value: "Double Leaf"
    },
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "46 dB" },
      "DnT,w": { status: "live", value: "47 dB" }
    }
  },
  {
    id: "held-aac-boundary-field",
    airborneContext: FIELD_CONTEXT,
    rows: [
      { materialId: "ytong_aac_d700", thicknessMm: "100" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expected: {
      boundaryDetailIncludes: [/ambiguous boundary with Double Leaf/i, /protected corridor hold/i],
      detectedFamily: "lined_massive_wall",
      dnTwDb: 45,
      postureIncludes: [/ambiguous boundary with Double Leaf/i, /protected corridor hold/i],
      rwDb: 44,
      rwPrimeDb: 44,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"]
    },
    branch: {
      detailIncludes: [/ambiguous boundary with Double Leaf/i, /protected corridor hold/i],
      tone: "warning",
      value: "Lined Massive Wall"
    },
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "44 dB" },
      "DnT,w": { status: "live", value: "45 dB" }
    }
  },
  {
    id: "clear-lined-massive-field",
    airborneContext: FIELD_CONTEXT,
    rows: [
      { materialId: "ytong_aac_d700", thicknessMm: "160" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expected: {
      detectedFamily: "lined_massive_wall",
      dnTwDb: 47,
      rwDb: 47,
      rwPrimeDb: 47,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"],
      withoutBoundaryPosture: true
    },
    branch: {
      detailWithout: [/boundary|hold/i],
      tone: "neutral",
      value: "Lined Massive Wall"
    },
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "47 dB" },
      "DnT,w": { status: "live", value: "47 dB" }
    }
  },
  {
    id: "held-g5-sibling-building",
    airborneContext: BUILDING_CONTEXT,
    rows: [
      { materialId: "ytong_g5_800", thicknessMm: "100" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "diamond_board", thicknessMm: "12.5" }
    ],
    expected: {
      boundaryDetailIncludes: [/ambiguous boundary with Double Leaf/i, /family-boundary hold/i],
      detectedFamily: "lined_massive_wall",
      dnTwDb: 47,
      postureIncludes: [/ambiguous boundary with Double Leaf/i, /family-boundary hold/i],
      rwDb: 45,
      rwPrimeDb: 45,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"]
    },
    branch: {
      detailIncludes: [/ambiguous boundary with Double Leaf/i, /conservative family-boundary hold/i],
      tone: "warning",
      value: "Lined Massive Wall"
    },
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "45 dB" },
      "DnT,w": { status: "live", value: "47 dB" }
    }
  },
  {
    id: "non-aac-heavy-core-trim-control",
    airborneContext: BUILDING_CONTEXT,
    rows: [
      { materialId: "rockwool", thicknessMm: "25" },
      { materialId: "porotherm_pls_140", thicknessMm: "140" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "diamond_board", thicknessMm: "12.5" },
      { materialId: "glasswool", thicknessMm: "25" }
    ],
    expected: {
      detectedFamily: "lined_massive_wall",
      dnTwDb: 49,
      rwDb: 47,
      rwPrimeDb: 47,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw"],
      withoutBoundaryPosture: true
    },
    branch: {
      detailWithout: [/boundary|hold/i],
      tone: "neutral",
      value: "Lined Massive Wall"
    },
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "47 dB" },
      "DnT,w": { status: "live", value: "49 dB" }
    }
  },
  {
    id: "strong-double-stud-lab-control",
    airborneContext: LAB_DOUBLE_STUD_CONTEXT,
    rows: [
      { materialId: "gypsum", thicknessMm: "12.5" },
      { materialId: "gypsum", thicknessMm: "12.5" },
      { materialId: "air_gap", thicknessMm: "75" },
      { materialId: "glasswool", thicknessMm: "60" },
      { materialId: "air_gap", thicknessMm: "70" },
      { materialId: "gypsum", thicknessMm: "12.5" },
      { materialId: "gypsum", thicknessMm: "12.5" }
    ],
    expected: {
      detectedFamily: "double_stud_system",
      rwDb: 61,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w"],
      withoutBoundaryPosture: true
    },
    branch: {
      detailWithout: [/boundary|hold/i],
      tone: "neutral",
      value: "Double Frame / Double Stud"
    },
    cards: {
      Rw: { status: "live", value: "61 dB" },
      "R'w": { status: "needs_input", value: "Not ready" },
      "DnT,w": { status: "needs_input", value: "Not ready" }
    }
  }
];

function buildRows(stack: readonly WallSelectorRow[], prefix: string) {
  return stack.map((layer, index) => ({
    ...layer,
    id: `${prefix}-${index + 1}`
  }));
}

describe("wall selector output-origin card matrix", () => {
  it("keeps route trace, support buckets, cards, and user-facing boundary wording aligned", () => {
    for (const testCase of CASES) {
      const scenario = evaluateScenario({
        airborneContext: testCase.airborneContext,
        calculator: "dynamic",
        id: testCase.id,
        name: testCase.id,
        rows: buildRows(testCase.rows, testCase.id),
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_SELECTOR_OUTPUTS
      });
      const result = scenario.result;

      expect(result?.ok, `${testCase.id} should evaluate`).toBe(true);
      if (!result) {
        continue;
      }

      expect(result.supportedTargetOutputs, `${testCase.id} supported outputs`).toEqual(testCase.expected.supported);
      expect(result.unsupportedTargetOutputs, `${testCase.id} unsupported outputs`).toEqual(testCase.expected.unsupported);
      expect(result.metrics.estimatedRwDb, `${testCase.id} Rw`).toBe(testCase.expected.rwDb);
      expect(result.metrics.estimatedRwPrimeDb, `${testCase.id} R'w`).toBe(testCase.expected.rwPrimeDb);
      expect(result.metrics.estimatedDnTwDb, `${testCase.id} DnT,w`).toBe(testCase.expected.dnTwDb);
      expect(result.dynamicAirborneTrace?.detectedFamily, `${testCase.id} family`).toBe(testCase.expected.detectedFamily);

      for (const output of WALL_SELECTOR_OUTPUTS) {
        const card = buildOutputCard({
          output,
          result,
          studyMode: "wall"
        });

        expect(
          {
            status: card.status,
            value: card.value
          },
          `${testCase.id} ${output} card`
        ).toEqual(testCase.cards[output]);
      }

      const branch = getDynamicCalcBranchSummary({
        result,
        studyMode: "wall"
      });

      expect(branch.value, `${testCase.id} branch value`).toBe(testCase.branch.value);
      expect(branch.tone, `${testCase.id} branch tone`).toBe(testCase.branch.tone);

      for (const pattern of testCase.branch.detailIncludes ?? []) {
        expect(pattern.test(branch.detail), `${testCase.id} branch detail ${pattern}`).toBe(true);
      }

      for (const pattern of testCase.branch.detailWithout ?? []) {
        expect(pattern.test(branch.detail), `${testCase.id} absent branch detail ${pattern}`).toBe(false);
      }

      const boundaryPosture = getAirborneBoundaryPosture(result.dynamicAirborneTrace);
      const validationPosture = describeAirborneValidationPosture(result);
      const airborneTrail = getConsultantDecisionTrail({
        guideResult: null,
        outputs: WALL_SELECTOR_OUTPUTS,
        result,
        warnings: scenario.warnings
      }).items.find((item) => item.label === "Airborne corridor");

      if (testCase.expected.withoutBoundaryPosture) {
        expect(boundaryPosture, `${testCase.id} boundary posture`).toBeNull();
        expect(/boundary|hold/i.test(validationPosture.detail), `${testCase.id} validation detail`).toBe(false);
        expect(/boundary|hold/i.test(airborneTrail?.detail ?? ""), `${testCase.id} consultant detail`).toBe(false);
      }

      for (const pattern of testCase.expected.boundaryDetailIncludes ?? []) {
        expect(pattern.test(boundaryPosture?.detail ?? ""), `${testCase.id} boundary posture ${pattern}`).toBe(true);
      }

      for (const pattern of testCase.expected.postureIncludes ?? []) {
        expect(pattern.test(validationPosture.detail), `${testCase.id} validation posture ${pattern}`).toBe(true);
        expect(pattern.test(airborneTrail?.detail ?? ""), `${testCase.id} consultant posture ${pattern}`).toBe(true);
      }
    }
  });
});
