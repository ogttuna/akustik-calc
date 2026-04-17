import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type TraceSnapshot = {
  basis: string | null;
  candidateIds: readonly string[] | null;
  dnTwDb: number | null;
  fitPercent: number | null;
  floorRw: number | null;
  kind: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  matchId: string | null;
  rwDb: number | null;
  rwPrimeDb: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type TraceCase = {
  expectedField: TraceSnapshot;
  expectedLab: TraceSnapshot;
  fieldWarningIncludes?: readonly RegExp[];
  id: string;
  labWarningIncludes?: readonly RegExp[];
  layers: readonly LayerInput[];
};

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

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

const FAMILY_GENERAL_LAB: TraceSnapshot = {
  basis: "predictor_floor_system_family_general_estimate",
  candidateIds: UBIQ_FL26_CANDIDATE_IDS,
  dnTwDb: null,
  fitPercent: 59.3,
  floorRw: 60.7,
  kind: "family_general",
  lPrimeNTw: null,
  lPrimeNW: null,
  lnW: 53.3,
  lnWPlusCI: 51.6,
  matchId: null,
  rwDb: 73.7,
  rwPrimeDb: null,
  supported: ["Rw", "Ln,w", "Ln,w+CI"],
  unsupported: []
};

const FAMILY_GENERAL_FIELD: TraceSnapshot = {
  basis: "mixed_predicted_plus_estimated_local_guide",
  candidateIds: UBIQ_FL26_CANDIDATE_IDS,
  dnTwDb: 74,
  fitPercent: 59.3,
  floorRw: 60.7,
  kind: "family_general",
  lPrimeNTw: 52.9,
  lPrimeNW: 55.3,
  lnW: 53.3,
  lnWPlusCI: 51.6,
  matchId: null,
  rwDb: 71.7,
  rwPrimeDb: 71,
  supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
  unsupported: []
};

const LOW_CONFIDENCE_LAB: TraceSnapshot = {
  ...FAMILY_GENERAL_LAB,
  basis: "predictor_floor_system_low_confidence_estimate",
  fitPercent: 29,
  kind: "low_confidence"
};

const LOW_CONFIDENCE_FIELD: TraceSnapshot = {
  ...FAMILY_GENERAL_FIELD,
  fitPercent: 29,
  kind: "low_confidence"
};

const FAMILY_GENERAL_WARNING = /published family estimate active: lightweight steel family general at 59\.3% fit/i;
const LOW_CONFIDENCE_WARNING = /published low-confidence fallback active: lightweight steel at 29% fit/i;
const DUPLICATE_ROLE_WARNING = /single-entry floor roles are duplicated: ceiling board x2/i;

const CASES: readonly TraceCase[] = [
  {
    id: "raw-exact-lower-package",
    layers: [
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: FAMILY_GENERAL_LAB,
    expectedField: FAMILY_GENERAL_FIELD,
    labWarningIncludes: [FAMILY_GENERAL_WARNING],
    fieldWarningIncludes: [FAMILY_GENERAL_WARNING]
  },
  {
    id: "raw-split-lower-package",
    layers: [
      { materialId: "firestop_board", thicknessMm: 8 },
      { materialId: "firestop_board", thicknessMm: 8 },
      { materialId: "firestop_board", thicknessMm: 8 },
      { materialId: "firestop_board", thicknessMm: 8 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { materialId: "open_web_steel_floor", thicknessMm: 150 },
      { materialId: "open_web_steel_floor", thicknessMm: 150 }
    ],
    expectedLab: FAMILY_GENERAL_LAB,
    expectedField: FAMILY_GENERAL_FIELD,
    labWarningIncludes: [FAMILY_GENERAL_WARNING],
    fieldWarningIncludes: [FAMILY_GENERAL_WARNING]
  },
  {
    id: "tagged-split-lower-package",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 32.5 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 }
    ],
    expectedLab: FAMILY_GENERAL_LAB,
    expectedField: FAMILY_GENERAL_FIELD,
    labWarningIncludes: [FAMILY_GENERAL_WARNING],
    fieldWarningIncludes: [FAMILY_GENERAL_WARNING]
  },
  {
    id: "raw-reordered-lower-package",
    layers: [
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { materialId: "firestop_board", thicknessMm: 16 },
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: LOW_CONFIDENCE_LAB,
    expectedField: LOW_CONFIDENCE_FIELD,
    labWarningIncludes: [LOW_CONFIDENCE_WARNING, DUPLICATE_ROLE_WARNING],
    fieldWarningIncludes: [LOW_CONFIDENCE_WARNING, DUPLICATE_ROLE_WARNING]
  }
];

function calculate(
  layers: readonly LayerInput[],
  mode: "lab" | "field"
) {
  return calculateAssembly(
    layers,
    mode === "lab"
      ? { targetOutputs: LAB_OUTPUTS }
      : {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
  );
}

function snapshot(
  layers: readonly LayerInput[],
  mode: "lab" | "field"
): TraceSnapshot {
  const result = calculate(layers, mode);

  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    dnTwDb: result.metrics.estimatedDnTwDb ?? null,
    fitPercent: result.floorSystemEstimate?.fitPercent ?? null,
    floorRw: result.floorSystemRatings?.Rw ?? null,
    kind: result.floorSystemEstimate?.kind ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web packaged lane trace matrix", () => {
  it("pins numeric answers for exact, split, tagged, and reordered open-web lower packages", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const labResult = calculate(testCase.layers, "lab");
      const fieldResult = calculate(testCase.layers, "field");
      const labSnapshot = snapshot(testCase.layers, "lab");
      const fieldSnapshot = snapshot(testCase.layers, "field");

      if (JSON.stringify(labSnapshot) !== JSON.stringify(testCase.expectedLab)) {
        failures.push(`${testCase.id} lab: expected ${JSON.stringify(testCase.expectedLab)}, got ${JSON.stringify(labSnapshot)}`);
      }

      if (JSON.stringify(fieldSnapshot) !== JSON.stringify(testCase.expectedField)) {
        failures.push(`${testCase.id} field: expected ${JSON.stringify(testCase.expectedField)}, got ${JSON.stringify(fieldSnapshot)}`);
      }

      for (const pattern of testCase.labWarningIncludes ?? []) {
        if (!labResult.warnings.some((warning: string) => pattern.test(warning))) {
          failures.push(`${testCase.id} lab: missing warning ${pattern}`);
        }
      }

      for (const pattern of testCase.fieldWarningIncludes ?? []) {
        if (!fieldResult.warnings.some((warning: string) => pattern.test(warning))) {
          failures.push(`${testCase.id} field: missing warning ${pattern}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
