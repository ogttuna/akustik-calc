import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import type { StudyMode } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";

type GuidedProfile = {
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const WALL_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const WALL_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "Dn,w", "DnT,w", "DnT,A"];
const FLOOR_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "DeltaLw", "Ln,w+CI"];
const FLOOR_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"];

const WALL_FIELD_CONTEXT = {
  contextMode: "building_prediction" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const FLOOR_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const WALL_LEFT_PROFILES: readonly GuidedProfile[] = [
  {
    id: "gypsum_plain",
    rows: [{ materialId: "gypsum_board", thicknessMm: "12.5" }]
  },
  {
    id: "acoustic_twin",
    rows: [
      { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ]
  },
  {
    id: "security_single",
    rows: [{ materialId: "security_board", thicknessMm: "12.5" }]
  }
];

const WALL_MIDDLE_PROFILES: readonly GuidedProfile[] = [
  {
    id: "cavity_fill",
    rows: [
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "rockwool", thicknessMm: "50" }
    ]
  },
  {
    id: "filled_only",
    rows: [{ materialId: "rockwool", thicknessMm: "75" }]
  },
  {
    id: "massive_core",
    rows: [{ materialId: "concrete", thicknessMm: "100" }]
  }
];

const WALL_RIGHT_PROFILES: readonly GuidedProfile[] = [
  {
    id: "gypsum_plain",
    rows: [{ materialId: "gypsum_board", thicknessMm: "12.5" }]
  },
  {
    id: "diamond_single",
    rows: [{ materialId: "diamond_board", thicknessMm: "12.5" }]
  },
  {
    id: "fire_double",
    rows: [
      { materialId: "firestop_board", thicknessMm: "15" },
      { materialId: "firestop_board", thicknessMm: "15" }
    ]
  }
];

const FLOOR_TOP_PROFILES: readonly GuidedProfile[] = [
  {
    id: "vinyl_bare",
    rows: [{ floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "4" }]
  },
  {
    id: "laminate_dry",
    rows: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "30" },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" }
    ]
  },
  {
    id: "tile_screed",
    rows: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: "8" },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: "50" }
    ]
  },
  {
    id: "timber_acoustic",
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: "30" },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" }
    ]
  }
];

const FLOOR_BASE_PROFILES: readonly GuidedProfile[] = [
  {
    id: "concrete_180",
    rows: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }]
  },
  {
    id: "clt_140",
    rows: [{ floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }]
  },
  {
    id: "hollow_core_200",
    rows: [{ floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: "200" }]
  },
  {
    id: "open_web_250",
    rows: [{ floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "250" }]
  }
];

const FLOOR_CEILING_PROFILES: readonly GuidedProfile[] = [
  {
    id: "none",
    rows: []
  },
  {
    id: "resilient_ceiling",
    rows: [
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "60" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "90" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" }
    ]
  }
];

const WALL_CASES = WALL_LEFT_PROFILES.flatMap((left) =>
  WALL_MIDDLE_PROFILES.flatMap((middle) =>
    WALL_RIGHT_PROFILES.map((right) => ({
      id: `${left.id}__${middle.id}__${right.id}`,
      rows: [...left.rows, ...middle.rows, ...right.rows]
    }))
  )
);

const FLOOR_CASES = FLOOR_TOP_PROFILES.flatMap((top) =>
  FLOOR_BASE_PROFILES.flatMap((base) =>
    FLOOR_CEILING_PROFILES.map((ceiling) => ({
      id: `${top.id}__${base.id}__${ceiling.id}`,
      rows: [...top.rows, ...base.rows, ...ceiling.rows]
    }))
  )
);

function buildRows(id: string, rows: readonly Omit<LayerDraft, "id">[]): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${id}-${index + 1}`
  }));
}

function getOutputValue(result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>, output: RequestedOutputId) {
  switch (output) {
    case "Rw":
      return result.metrics.estimatedRwDb;
    case "R'w":
      return result.metrics.estimatedRwPrimeDb;
    case "STC":
      return result.metrics.estimatedStc;
    case "C":
      return result.metrics.estimatedCDb;
    case "Ctr":
      return result.metrics.estimatedCtrDb;
    case "Dn,w":
      return result.metrics.estimatedDnWDb;
    case "DnT,w":
      return result.metrics.estimatedDnTwDb;
    case "DnT,A":
      return result.metrics.estimatedDnTADb;
    case "Ln,w":
      return result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound;
    default:
      return undefined;
  }
}

function isInsideBroadCorridor(output: RequestedOutputId, value: number): boolean {
  switch (output) {
    case "Rw":
    case "R'w":
    case "STC":
    case "Dn,w":
    case "DnT,w":
    case "DnT,A":
      return value >= 15 && value <= 95;
    case "C":
    case "Ctr":
      return value >= -25 && value <= 10;
    case "Ln,w":
    case "Ln,w+CI":
    case "L'n,w":
    case "L'nT,w":
      return value >= 20 && value <= 100;
    case "DeltaLw":
      return value >= 0 && value <= 50;
    default:
      return false;
  }
}

function assertRequestedPartition(
  supportedTargetOutputs: readonly RequestedOutputId[],
  unsupportedTargetOutputs: readonly RequestedOutputId[],
  requestedOutputs: readonly RequestedOutputId[],
  label: string,
  failures: string[]
) {
  const supported = new Set(supportedTargetOutputs);
  const unsupported = new Set(unsupportedTargetOutputs);

  for (const output of requestedOutputs) {
    if (supported.has(output) === unsupported.has(output)) {
      failures.push(
        `${label}: output ${output} should belong to exactly one support bucket, supported=${JSON.stringify(supportedTargetOutputs)} unsupported=${JSON.stringify(unsupportedTargetOutputs)}`
      );
    }
  }
}

function assertFiniteSupportedOutputs(
  result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>,
  requestedOutputs: readonly RequestedOutputId[],
  label: string,
  failures: string[]
) {
  for (const output of requestedOutputs) {
    if (!result.supportedTargetOutputs.includes(output)) {
      continue;
    }

    const value = getOutputValue(result, output);

    if (!(typeof value === "number" && Number.isFinite(value) && isInsideBroadCorridor(output, value))) {
      failures.push(`${label}: supported output ${output} should stay finite and inside a broad guided corridor, got ${String(value)}`);
    }
  }
}

function assertNoGuidedInputSanityDrift(warnings: readonly string[], label: string, failures: string[]) {
  const sanityWarnings = warnings.filter((warning) => /outside the guided sanity band|missing a valid thickness/i.test(warning));

  if (sanityWarnings.length > 0) {
    failures.push(`${label}: representative guided case should not trip input sanity warnings: ${sanityWarnings.join(" | ")}`);
  }
}

function evaluateGuidedCase(input: {
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
  studyMode: StudyMode;
  targetOutputs: readonly RequestedOutputId[];
  airborneContext?: Parameters<typeof evaluateScenario>[0]["airborneContext"];
  impactFieldContext?: Parameters<typeof evaluateScenario>[0]["impactFieldContext"];
}) {
  return evaluateScenario({
    airborneContext: input.airborneContext,
    id: input.id,
    impactFieldContext: input.impactFieldContext,
    name: input.id,
    rows: buildRows(input.id, input.rows),
    source: "current",
    studyMode: input.studyMode,
    targetOutputs: input.targetOutputs
  });
}

describe("guided combination sweep", () => {
  it("keeps representative guided wall combinations numerically sane on the live lab route", () => {
    const failures: string[] = [];

    for (const testCase of WALL_CASES) {
      const scenario = evaluateGuidedCase({
        id: `wall-lab-${testCase.id}`,
        rows: testCase.rows,
        studyMode: "wall",
        targetOutputs: WALL_LAB_OUTPUTS
      });

      if (!scenario.result) {
        failures.push(`${testCase.id}: wall lab run should produce a live result`);
        continue;
      }

      assertNoGuidedInputSanityDrift(scenario.warnings, `${testCase.id} wall lab`, failures);

      if (!scenario.result.supportedTargetOutputs.length) {
        failures.push(`${testCase.id}: wall lab run should expose at least one supported output`);
      }

      assertRequestedPartition(
        scenario.result.supportedTargetOutputs,
        scenario.result.unsupportedTargetOutputs,
        WALL_LAB_OUTPUTS,
        `${testCase.id} wall lab`,
        failures
      );
      assertFiniteSupportedOutputs(scenario.result, WALL_LAB_OUTPUTS, `${testCase.id} wall lab`, failures);
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative guided wall continuations numerically sane once field context is present", () => {
    const failures: string[] = [];

    for (const testCase of WALL_CASES) {
      const scenario = evaluateGuidedCase({
        airborneContext: WALL_FIELD_CONTEXT,
        id: `wall-field-${testCase.id}`,
        rows: testCase.rows,
        studyMode: "wall",
        targetOutputs: WALL_FIELD_OUTPUTS
      });

      if (!scenario.result) {
        failures.push(`${testCase.id}: wall field run should produce a live result`);
        continue;
      }

      assertNoGuidedInputSanityDrift(scenario.warnings, `${testCase.id} wall field`, failures);

      if (!scenario.result.supportedTargetOutputs.length) {
        failures.push(`${testCase.id}: wall field run should expose at least one supported output`);
      }

      assertRequestedPartition(
        scenario.result.supportedTargetOutputs,
        scenario.result.unsupportedTargetOutputs,
        WALL_FIELD_OUTPUTS,
        `${testCase.id} wall field`,
        failures
      );
      assertFiniteSupportedOutputs(scenario.result, WALL_FIELD_OUTPUTS, `${testCase.id} wall field`, failures);
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative guided floor combinations numerically sane on the live lab route", () => {
    const failures: string[] = [];

    for (const testCase of FLOOR_CASES) {
      const scenario = evaluateGuidedCase({
        id: `floor-lab-${testCase.id}`,
        rows: testCase.rows,
        studyMode: "floor",
        targetOutputs: FLOOR_LAB_OUTPUTS
      });

      if (!scenario.result) {
        failures.push(`${testCase.id}: floor lab run should produce a live result`);
        continue;
      }

      assertNoGuidedInputSanityDrift(scenario.warnings, `${testCase.id} floor lab`, failures);

      if (!scenario.result.supportedTargetOutputs.length) {
        failures.push(`${testCase.id}: floor lab run should expose at least one supported output`);
      }

      assertRequestedPartition(
        scenario.result.supportedTargetOutputs,
        scenario.result.unsupportedTargetOutputs,
        FLOOR_LAB_OUTPUTS,
        `${testCase.id} floor lab`,
        failures
      );
      assertFiniteSupportedOutputs(scenario.result, FLOOR_LAB_OUTPUTS, `${testCase.id} floor lab`, failures);
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative guided floor continuations numerically sane once K and volume are present", () => {
    const failures: string[] = [];

    for (const testCase of FLOOR_CASES) {
      const scenario = evaluateGuidedCase({
        id: `floor-field-${testCase.id}`,
        impactFieldContext: FLOOR_FIELD_CONTEXT,
        rows: testCase.rows,
        studyMode: "floor",
        targetOutputs: FLOOR_FIELD_OUTPUTS
      });

      if (!scenario.result) {
        failures.push(`${testCase.id}: floor field run should produce a live result`);
        continue;
      }

      assertNoGuidedInputSanityDrift(scenario.warnings, `${testCase.id} floor field`, failures);

      if (!scenario.result.supportedTargetOutputs.length) {
        failures.push(`${testCase.id}: floor field run should expose at least one supported output`);
      }

      assertRequestedPartition(
        scenario.result.supportedTargetOutputs,
        scenario.result.unsupportedTargetOutputs,
        FLOOR_FIELD_OUTPUTS,
        `${testCase.id} floor field`,
        failures
      );
      assertFiniteSupportedOutputs(scenario.result, FLOOR_FIELD_OUTPUTS, `${testCase.id} floor field`, failures);

      const lnw = scenario.result.impact?.LnW;
      const lPrimeNW = scenario.result.impact?.LPrimeNW;
      const lPrimeNTw = scenario.result.impact?.LPrimeNTw;

      if (
        scenario.result.supportedTargetOutputs.includes("Ln,w") &&
        scenario.result.supportedTargetOutputs.includes("L'n,w") &&
        typeof lnw === "number" &&
        typeof lPrimeNW === "number" &&
        Math.abs(lPrimeNW - (lnw + FLOOR_FIELD_CONTEXT.fieldKDb)) > 0.2
      ) {
        failures.push(`${testCase.id}: expected L'n,w to continue from Ln,w + K, got Ln,w=${lnw}, L'n,w=${lPrimeNW}`);
      }

      if (
        scenario.result.supportedTargetOutputs.includes("L'n,w") &&
        scenario.result.supportedTargetOutputs.includes("L'nT,w") &&
        typeof lPrimeNW === "number" &&
        typeof lPrimeNTw === "number" &&
        lPrimeNTw > lPrimeNW + 0.2
      ) {
        failures.push(`${testCase.id}: expected L'nT,w to stay at or below L'n,w, got L'n,w=${lPrimeNW}, L'nT,w=${lPrimeNTw}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
