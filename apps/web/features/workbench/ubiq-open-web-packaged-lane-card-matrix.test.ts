import type { FloorRole, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

type ScenarioRow = {
  floorRole?: FloorRole;
  id: string;
  materialId: string;
  thicknessMm: number | string;
};

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteSnapshot = {
  basis: string | null;
  cards: Record<FieldOutput, CardSnapshot>;
  candidateIds: readonly string[] | null;
  dnTwDb: number | null;
  fitPercent: number | null;
  floorRw: number | null;
  kind: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  rwDb: number | null;
  rwPrimeDb: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: RouteSnapshot;
  id: string;
  rows: readonly ScenarioRow[];
  warningIncludes?: readonly RegExp[];
};

const FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
type FieldOutput = (typeof FIELD_OUTPUTS)[number];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const UBIQ_FL26_CANDIDATE_IDS = [
  "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
  "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
  "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
] as const;

const LIVE_CARDS: Record<FieldOutput, CardSnapshot> = {
  Rw: { status: "live", value: "60.7 dB" },
  "R'w": { status: "live", value: "71 dB" },
  "DnT,w": { status: "live", value: "74 dB" },
  "Ln,w": { status: "live", value: "53.3 dB" },
  "L'n,w": { status: "live", value: "55.3 dB" },
  "L'nT,w": { status: "live", value: "52.9 dB" }
};

const FAMILY_GENERAL_ROUTE: RouteSnapshot = {
  basis: "mixed_predicted_plus_estimated_local_guide",
  cards: LIVE_CARDS,
  candidateIds: UBIQ_FL26_CANDIDATE_IDS,
  dnTwDb: 74,
  fitPercent: 56.7,
  floorRw: 60.7,
  kind: "family_general",
  lPrimeNTw: 52.9,
  lPrimeNW: 55.3,
  lnW: 53.3,
  rwDb: 71.7,
  rwPrimeDb: 71,
  supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
  unsupported: []
};

const LOW_CONFIDENCE_ROUTE: RouteSnapshot = {
  ...FAMILY_GENERAL_ROUTE,
  fitPercent: 29,
  kind: "low_confidence"
};

const FAMILY_GENERAL_WARNING = /published family estimate active: lightweight steel family general at 56\.7% fit/i;
const LOW_CONFIDENCE_WARNING = /low-confidence published-family fallback is active/i;
const DUPLICATE_ROLE_WARNING = /single-entry floor roles are duplicated: ceiling board x2/i;
const RAW_SPLIT_SANITY_WARNING = /layer 7 thickness 150 mm is outside the guided sanity band/i;
const TAGGED_SPLIT_SANITY_WARNING = /open-web steel floor in the base structure role/i;

const CASES: readonly RouteCase[] = [
  {
    id: "raw-exact-lower-package",
    rows: [
      { id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { id: "c", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { id: "d", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expected: FAMILY_GENERAL_ROUTE,
    warningIncludes: [FAMILY_GENERAL_WARNING]
  },
  {
    id: "raw-split-lower-package",
    rows: [
      { id: "a", materialId: "firestop_board", thicknessMm: 8 },
      { id: "b", materialId: "firestop_board", thicknessMm: 8 },
      { id: "c", materialId: "firestop_board", thicknessMm: 8 },
      { id: "d", materialId: "firestop_board", thicknessMm: 8 },
      { id: "e", materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { id: "f", materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { id: "g", materialId: "open_web_steel_floor", thicknessMm: 150 },
      { id: "h", materialId: "open_web_steel_floor", thicknessMm: 150 }
    ],
    expected: FAMILY_GENERAL_ROUTE,
    warningIncludes: [FAMILY_GENERAL_WARNING, RAW_SPLIT_SANITY_WARNING]
  },
  {
    id: "tagged-split-lower-package",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", id: "c", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", id: "d", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_cavity", id: "e", materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { floorRole: "ceiling_cavity", id: "f", materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { floorRole: "base_structure", id: "g", materialId: "open_web_steel_floor", thicknessMm: 150 },
      { floorRole: "base_structure", id: "h", materialId: "open_web_steel_floor", thicknessMm: 150 }
    ],
    expected: FAMILY_GENERAL_ROUTE,
    warningIncludes: [FAMILY_GENERAL_WARNING, TAGGED_SPLIT_SANITY_WARNING]
  },
  {
    id: "raw-reordered-lower-package",
    rows: [
      { id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { id: "b", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { id: "c", materialId: "firestop_board", thicknessMm: 16 },
      { id: "d", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expected: LOW_CONFIDENCE_ROUTE,
    warningIncludes: [LOW_CONFIDENCE_WARNING, DUPLICATE_ROLE_WARNING]
  }
];

function snapshot(testCase: RouteCase): {
  route: RouteSnapshot;
  warnings: readonly string[];
} {
  const evaluated = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id: testCase.id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: testCase.id,
    rows: testCase.rows.map((row) => ({
      ...row,
      thicknessMm: String(row.thicknessMm)
    })),
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  });

  expect(evaluated.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    route: {
      basis: result.impact?.basis ?? null,
      cards: Object.fromEntries(
        FIELD_OUTPUTS.map((output) => {
          const card = buildOutputCard({
            output,
            result,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ) as RouteSnapshot["cards"],
      candidateIds: result.impact?.estimateCandidateIds ?? null,
      dnTwDb: result.metrics.estimatedDnTwDb ?? null,
      fitPercent: result.floorSystemEstimate?.fitPercent ?? null,
      floorRw: result.floorSystemRatings?.Rw ?? null,
      kind: result.floorSystemEstimate?.kind ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? null,
      lnW: result.impact?.LnW ?? null,
      rwDb: result.metrics.estimatedRwDb ?? null,
      rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

describe("UBIQ open-web packaged-lane card matrix", () => {
  it("keeps workbench cards aligned with exact, split, tagged, and reordered open-web lower packages", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (JSON.stringify(actual.route) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual.route)}`);
      }

      for (const pattern of testCase.warningIncludes ?? []) {
        if (!actual.warnings.some((warning: string) => pattern.test(warning))) {
          failures.push(`${testCase.id}: missing warning ${pattern}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
