import type { FloorRole, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

type ScenarioRow = {
  floorRole?: FloorRole;
  id: string;
  materialId: string;
  thicknessMm: string;
};

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RuntimeCardSnapshot = {
  boundFloorSystemEstimateKind: string | null;
  boundFloorSystemMatchId: string | null;
  cards: Partial<Record<RequestedOutputId, CardSnapshot>>;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type UbiqWeakBandCardCase = {
  expectedField: RuntimeCardSnapshot;
  expectedLab: RuntimeCardSnapshot;
  family: "FL-23" | "FL-25" | "FL-27";
  rows: readonly ScenarioRow[];
};

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const FIELD_AIRBORNE_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const FIELD_IMPACT_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const UBIQ_WEAK_BAND_CARD_CASES: readonly UbiqWeakBandCardCase[] = [
  {
    family: "FL-23",
    rows: [
      { floorRole: "floor_covering", id: "fl23-a", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
      { floorRole: "floating_screed", id: "fl23-b", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "base_structure", id: "fl23-c", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    expectedLab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        Rw: { status: "live", value: "73 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "Ln,w+CI": { status: "unsupported", value: "Not ready" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
    },
    expectedField: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        "R'w": { status: "live", value: "71 dB" },
        "DnT,w": { status: "live", value: "74 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    family: "FL-25",
    rows: [
      { floorRole: "floor_covering", id: "fl25-a", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
      { floorRole: "floating_screed", id: "fl25-b", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "base_structure", id: "fl25-c", materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    expectedLab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        Rw: { status: "live", value: "73 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "Ln,w+CI": { status: "unsupported", value: "Not ready" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
    },
    expectedField: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        "R'w": { status: "live", value: "71 dB" },
        "DnT,w": { status: "live", value: "74 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    family: "FL-27",
    rows: [
      { floorRole: "floor_covering", id: "fl27-a", materialId: "carpet_with_foam_underlay", thicknessMm: "15" },
      { floorRole: "floating_screed", id: "fl27-b", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "base_structure", id: "fl27-c", materialId: "open_web_steel_floor", thicknessMm: "400" }
    ],
    expectedLab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        Rw: { status: "live", value: "76 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "Ln,w+CI": { status: "unsupported", value: "Not ready" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
    },
    expectedField: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        "R'w": { status: "live", value: "74 dB" },
        "DnT,w": { status: "live", value: "77 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
    }
  }
];

const UBIQ_WEAK_BAND_EXACT_CARD_CASES: readonly UbiqWeakBandCardCase[] = [
  {
    family: "FL-23",
    rows: [
      { floorRole: "floor_covering", id: "fl23-a", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
      { floorRole: "floating_screed", id: "fl23-b", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "base_structure", id: "fl23-c", materialId: "open_web_steel_floor", thicknessMm: "300" },
      { floorRole: "ceiling_board", id: "fl23-d", materialId: "firestop_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", id: "fl23-e", materialId: "firestop_board", thicknessMm: "13" }
    ],
    expectedLab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        Rw: { status: "live", value: "51 dB" },
        "Ln,w": { status: "live", value: "71 dB" },
        "Ln,w+CI": { status: "live", value: "70 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    },
    expectedField: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        "R'w": { status: "live", value: "72 dB" },
        "DnT,w": { status: "live", value: "74 dB" },
        "Ln,w": { status: "live", value: "71 dB" },
        "L'n,w": { status: "live", value: "73 dB" },
        "L'nT,w": { status: "live", value: "70.6 dB" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    family: "FL-25",
    rows: [
      { floorRole: "floor_covering", id: "fl25-a", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
      { floorRole: "floating_screed", id: "fl25-b", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "base_structure", id: "fl25-c", materialId: "open_web_steel_floor", thicknessMm: "300" },
      { floorRole: "ceiling_board", id: "fl25-d", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", id: "fl25-e", materialId: "firestop_board", thicknessMm: "16" }
    ],
    expectedLab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        Rw: { status: "live", value: "52 dB" },
        "Ln,w": { status: "live", value: "71 dB" },
        "Ln,w+CI": { status: "live", value: "70 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl25_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    },
    expectedField: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        "R'w": { status: "live", value: "72 dB" },
        "DnT,w": { status: "live", value: "74 dB" },
        "Ln,w": { status: "live", value: "71 dB" },
        "L'n,w": { status: "live", value: "73 dB" },
        "L'nT,w": { status: "live", value: "70.6 dB" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl25_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    family: "FL-27",
    rows: [
      { floorRole: "floor_covering", id: "fl27-a", materialId: "carpet_with_foam_underlay", thicknessMm: "15" },
      { floorRole: "floating_screed", id: "fl27-b", materialId: "inex_floor_panel", thicknessMm: "19" },
      { floorRole: "base_structure", id: "fl27-c", materialId: "open_web_steel_floor", thicknessMm: "400" },
      { floorRole: "ceiling_board", id: "fl27-d", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", id: "fl27-e", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", id: "fl27-f", materialId: "firestop_board", thicknessMm: "16" }
    ],
    expectedLab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "Ln,w": { status: "live", value: "63 dB" },
        "Ln,w+CI": { status: "live", value: "62 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    },
    expectedField: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      cards: {
        "R'w": { status: "live", value: "74 dB" },
        "DnT,w": { status: "live", value: "77 dB" },
        "Ln,w": { status: "live", value: "63 dB" },
        "L'n,w": { status: "live", value: "65 dB" },
        "L'nT,w": { status: "live", value: "62.6 dB" }
      },
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  }
];

function snapshot(
  testCase: UbiqWeakBandCardCase,
  mode: "field" | "lab"
): {
  route: RuntimeCardSnapshot;
  warnings: readonly string[];
} {
  const outputs = mode === "lab" ? LAB_OUTPUTS : FIELD_OUTPUTS;
  const evaluated = evaluateScenario({
    ...(mode === "field"
      ? {
          airborneContext: FIELD_AIRBORNE_CONTEXT,
          impactFieldContext: FIELD_IMPACT_CONTEXT
        }
      : {}),
    id: `ubiq-weak-band-${testCase.family}-${mode}`,
    name: `UBIQ ${testCase.family} weak-band ${mode}`,
    rows: testCase.rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: outputs
  });

  expect(evaluated.result, `${testCase.family} ${mode} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${testCase.family} ${mode} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    route: {
      boundFloorSystemEstimateKind: result.boundFloorSystemEstimate?.kind ?? null,
      boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
      cards: Object.fromEntries(
        outputs.map((output) => {
          const card = buildOutputCard({
            output,
            result,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ),
      floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
      floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

describe("UBIQ open-web weaker-band card posture", () => {
  it("keeps FL-23/25/27 weak-band impact cards fail-closed when lower direct ceiling boards are absent", () => {
    const failures: string[] = [];

    for (const testCase of UBIQ_WEAK_BAND_CARD_CASES) {
      const lab = snapshot(testCase, "lab");
      const field = snapshot(testCase, "field");

      if (JSON.stringify(lab.route) !== JSON.stringify(testCase.expectedLab)) {
        failures.push(`${testCase.family} lab: expected ${JSON.stringify(testCase.expectedLab)}, got ${JSON.stringify(lab.route)}`);
      }

      if (JSON.stringify(field.route) !== JSON.stringify(testCase.expectedField)) {
        failures.push(`${testCase.family} field: expected ${JSON.stringify(testCase.expectedField)}, got ${JSON.stringify(field.route)}`);
      }

      if (!lab.warnings.some((warning: string) => /impact sound outputs are not available/i.test(warning))) {
        failures.push(`${testCase.family} lab: missing unsupported impact warning`);
      }

      if (!field.warnings.some((warning: string) => /impact sound outputs are not available/i.test(warning))) {
        failures.push(`${testCase.family} field: missing unsupported impact warning`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("turns FL-23/25/27 weak-band cards live only when the exact lower-board source stack is present", () => {
    const failures: string[] = [];

    for (const testCase of UBIQ_WEAK_BAND_EXACT_CARD_CASES) {
      const lab = snapshot(testCase, "lab");
      const field = snapshot(testCase, "field");

      if (JSON.stringify(lab.route) !== JSON.stringify(testCase.expectedLab)) {
        failures.push(`${testCase.family} lab: expected ${JSON.stringify(testCase.expectedLab)}, got ${JSON.stringify(lab.route)}`);
      }

      if (JSON.stringify(field.route) !== JSON.stringify(testCase.expectedField)) {
        failures.push(`${testCase.family} field: expected ${JSON.stringify(testCase.expectedField)}, got ${JSON.stringify(field.route)}`);
      }

      if (!lab.warnings.some((warning: string) => /curated exact floor-system match active/i.test(warning))) {
        failures.push(`${testCase.family} lab: missing exact-match warning`);
      }

      if (!field.warnings.some((warning: string) => /curated exact floor-system match active/i.test(warning))) {
        failures.push(`${testCase.family} field: missing exact-match warning`);
      }
    }

    expect(failures).toEqual([]);
  });
});
