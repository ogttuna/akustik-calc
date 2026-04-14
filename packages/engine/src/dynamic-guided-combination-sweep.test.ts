import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type AssemblyProfile = {
  id: string;
  layers: readonly LayerInput[];
};

const WALL_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const WALL_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "Dn,w", "DnT,w", "DnT,A"];
const FLOOR_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "DeltaLw", "Ln,w+CI"];
const FLOOR_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "L'n,w", "L'nT,w"];

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

const WALL_LEFT_PROFILES: readonly AssemblyProfile[] = [
  {
    id: "gypsum_plain",
    layers: [{ materialId: "gypsum_board", thicknessMm: 12.5 }]
  },
  {
    id: "acoustic_twin",
    layers: [
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]
  },
  {
    id: "security_single",
    layers: [{ materialId: "security_board", thicknessMm: 12.5 }]
  }
] as const;

const WALL_MIDDLE_PROFILES: readonly AssemblyProfile[] = [
  {
    id: "cavity_fill",
    layers: [
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 }
    ]
  },
  {
    id: "filled_only",
    layers: [{ materialId: "rockwool", thicknessMm: 75 }]
  },
  {
    id: "massive_core",
    layers: [{ materialId: "concrete", thicknessMm: 100 }]
  }
] as const;

const WALL_RIGHT_PROFILES: readonly AssemblyProfile[] = [
  {
    id: "gypsum_plain",
    layers: [{ materialId: "gypsum_board", thicknessMm: 12.5 }]
  },
  {
    id: "diamond_single",
    layers: [{ materialId: "diamond_board", thicknessMm: 12.5 }]
  },
  {
    id: "fire_double",
    layers: [
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "firestop_board", thicknessMm: 15 }
    ]
  }
] as const;

const FLOOR_TOP_PROFILES: readonly AssemblyProfile[] = [
  {
    id: "vinyl_bare",
    layers: [{ floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 4 }]
  },
  {
    id: "laminate_dry",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 30 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
    ]
  },
  {
    id: "tile_screed",
    layers: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
    ]
  },
  {
    id: "timber_acoustic",
    layers: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 }
    ]
  }
] as const;

const FLOOR_BASE_PROFILES: readonly AssemblyProfile[] = [
  {
    id: "concrete_180",
    layers: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }]
  },
  {
    id: "clt_140",
    layers: [{ floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }]
  },
  {
    id: "hollow_core_200",
    layers: [{ floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 }]
  },
  {
    id: "open_web_250",
    layers: [{ floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }]
  }
] as const;

const FLOOR_CEILING_PROFILES: readonly AssemblyProfile[] = [
  {
    id: "none",
    layers: []
  },
  {
    id: "resilient_ceiling",
    layers: [
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 60 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 }
    ]
  }
] as const;

const WALL_CASES = WALL_LEFT_PROFILES.flatMap((left) =>
  WALL_MIDDLE_PROFILES.flatMap((middle) =>
    WALL_RIGHT_PROFILES.map((right) => ({
      id: `${left.id}__${middle.id}__${right.id}`,
      layers: [...left.layers, ...middle.layers, ...right.layers]
    }))
  )
);

const FLOOR_CASES = FLOOR_TOP_PROFILES.flatMap((top) =>
  FLOOR_BASE_PROFILES.flatMap((base) =>
    FLOOR_CEILING_PROFILES.map((ceiling) => ({
      id: `${top.id}__${base.id}__${ceiling.id}`,
      layers: [...top.layers, ...base.layers, ...ceiling.layers]
    }))
  )
);

function getOutputValue(result: ReturnType<typeof calculateAssembly>, output: RequestedOutputId): number | null | undefined {
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
  result: ReturnType<typeof calculateAssembly>,
  requestedOutputs: readonly RequestedOutputId[],
  label: string,
  failures: string[]
) {
  const supported = new Set(result.supportedTargetOutputs);
  const unsupported = new Set(result.unsupportedTargetOutputs);

  for (const output of requestedOutputs) {
    if (supported.has(output) === unsupported.has(output)) {
      failures.push(`${label}: ${output} should appear in exactly one support bucket`);
    }
  }
}

function assertFiniteSupportedOutputs(
  result: ReturnType<typeof calculateAssembly>,
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
      failures.push(`${label}: supported output ${output} left the broad corridor with value ${String(value)}`);
    }
  }
}

describe("dynamic guided combination sweep", () => {
  it("keeps representative guided wall combinations numerically sane on the dynamic route", () => {
    const failures: string[] = [];

    for (const testCase of WALL_CASES) {
      const lab = calculateAssembly(testCase.layers, {
        airborneContext: {
          contextMode: "element_lab"
        },
        calculator: "dynamic",
        targetOutputs: WALL_LAB_OUTPUTS
      });

      if (!lab.ok || lab.calculatorId !== "dynamic") {
        failures.push(`${testCase.id} lab: expected dynamic calculator to stay active`);
        continue;
      }

      if (!lab.supportedTargetOutputs.length) {
        failures.push(`${testCase.id} lab: expected at least one supported output`);
      }

      assertRequestedPartition(lab, WALL_LAB_OUTPUTS, `${testCase.id} lab`, failures);
      assertFiniteSupportedOutputs(lab, WALL_LAB_OUTPUTS, `${testCase.id} lab`, failures);

      const field = calculateAssembly(testCase.layers, {
        airborneContext: WALL_FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: WALL_FIELD_OUTPUTS
      });

      if (!field.ok || field.calculatorId !== "dynamic") {
        failures.push(`${testCase.id} field: expected dynamic calculator to stay active`);
        continue;
      }

      if (!field.supportedTargetOutputs.length) {
        failures.push(`${testCase.id} field: expected at least one supported field output`);
      }

      assertRequestedPartition(field, WALL_FIELD_OUTPUTS, `${testCase.id} field`, failures);
      assertFiniteSupportedOutputs(field, WALL_FIELD_OUTPUTS, `${testCase.id} field`, failures);
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative guided floor combinations numerically sane on the dynamic route", () => {
    const failures: string[] = [];

    for (const testCase of FLOOR_CASES) {
      const lab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        targetOutputs: FLOOR_LAB_OUTPUTS
      });

      if (!lab.ok || lab.calculatorId !== "dynamic") {
        failures.push(`${testCase.id} lab: expected dynamic calculator to stay active`);
        continue;
      }

      if (!lab.supportedTargetOutputs.length) {
        failures.push(`${testCase.id} lab: expected at least one supported output`);
      }

      assertRequestedPartition(lab, FLOOR_LAB_OUTPUTS, `${testCase.id} lab`, failures);
      assertFiniteSupportedOutputs(lab, FLOOR_LAB_OUTPUTS, `${testCase.id} lab`, failures);

      const field = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        impactFieldContext: FLOOR_FIELD_CONTEXT,
        targetOutputs: FLOOR_FIELD_OUTPUTS
      });

      if (!field.ok || field.calculatorId !== "dynamic") {
        failures.push(`${testCase.id} field: expected dynamic calculator to stay active`);
        continue;
      }

      if (!field.supportedTargetOutputs.length) {
        failures.push(`${testCase.id} field: expected at least one supported field-side output`);
      }

      assertRequestedPartition(field, FLOOR_FIELD_OUTPUTS, `${testCase.id} field`, failures);
      assertFiniteSupportedOutputs(field, FLOOR_FIELD_OUTPUTS, `${testCase.id} field`, failures);

      const lnw = field.impact?.LnW;
      const lPrimeNW = field.impact?.LPrimeNW;
      const lPrimeNTw = field.impact?.LPrimeNTw;

      if (
        field.supportedTargetOutputs.includes("Ln,w") &&
        field.supportedTargetOutputs.includes("L'n,w") &&
        typeof lnw === "number" &&
        typeof lPrimeNW === "number" &&
        Math.abs(lPrimeNW - (lnw + FLOOR_FIELD_CONTEXT.fieldKDb)) > 0.2
      ) {
        failures.push(`${testCase.id} field: expected L'n,w ~= Ln,w + K, got ${lnw} and ${lPrimeNW}`);
      }

      if (
        field.supportedTargetOutputs.includes("L'n,w") &&
        field.supportedTargetOutputs.includes("L'nT,w") &&
        typeof lPrimeNW === "number" &&
        typeof lPrimeNTw === "number" &&
        lPrimeNTw > lPrimeNW + 0.2
      ) {
        failures.push(`${testCase.id} field: expected L'nT,w to stay at or below L'n,w, got ${lPrimeNW} and ${lPrimeNTw}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
