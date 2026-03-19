import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type TopologyProfile = {
  id: string;
  layers: readonly LayerInput[];
};

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const BASES: readonly TopologyProfile[] = [
  {
    id: "concrete_150",
    layers: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }]
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
    id: "open_box_370",
    layers: [{ floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }]
  }
];

const UPPER_ASSEMBLIES: readonly TopologyProfile[] = [
  {
    id: "tile_wet",
    layers: [
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 }
    ]
  },
  {
    id: "vinyl_wet",
    layers: [
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 4 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
    ]
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
    id: "timber_acoustic",
    layers: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 }
    ]
  }
];

const CEILINGS: readonly TopologyProfile[] = [
  {
    id: "none",
    layers: []
  },
  {
    id: "resilient_channel",
    layers: [
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 65 },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 }
    ]
  },
  {
    id: "stud_ceiling",
    layers: [
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
    ]
  }
];

const CASES = BASES.flatMap((base) =>
  UPPER_ASSEMBLIES.flatMap((upper) =>
    CEILINGS.map((ceiling) => ({
      id: `${base.id}__${upper.id}__${ceiling.id}`,
      layers: [...upper.layers, ...base.layers, ...ceiling.layers]
    }))
  )
);

function getOutputValue(result: ReturnType<typeof calculateAssembly>, output: RequestedOutputId): number | null | undefined {
  switch (output) {
    case "Rw":
      return result.metrics.estimatedRwDb;
    case "Ln,w":
      return result.impact?.LnW;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound;
    default:
      return undefined;
  }
}

function isInsideCorridor(output: RequestedOutputId, value: number): boolean {
  switch (output) {
    case "Rw":
      return value >= 25 && value <= 90;
    case "DeltaLw":
      return value >= 0 && value <= 50;
    case "Ln,w":
    case "Ln,w+CI":
    case "L'n,w":
    case "L'nT,w":
    case "L'nT,50":
      return value >= 20 && value <= 95;
    default:
      return false;
  }
}

function assertPartition(
  result: ReturnType<typeof calculateAssembly>,
  requestedOutputs: readonly RequestedOutputId[],
  label: string,
  failures: string[]
) {
  const supported = new Set(result.supportedTargetOutputs);
  const unsupported = new Set(result.unsupportedTargetOutputs);

  for (const output of requestedOutputs) {
    if (supported.has(output) === unsupported.has(output)) {
      failures.push(
        `${label}: output ${output} should belong to exactly one support bucket, supported=${JSON.stringify(result.supportedTargetOutputs)} unsupported=${JSON.stringify(result.unsupportedTargetOutputs)}`
      );
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

    if (!(typeof value === "number" && Number.isFinite(value) && isInsideCorridor(output, value))) {
      failures.push(`${label}: supported output ${output} should stay finite and inside a broad corridor, got ${String(value)}`);
    }
  }
}

describe("floor topology sanity sweep", () => {
  it("keeps representative lab-side floor combinations sane across base, finish, and ceiling packages", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        targetOutputs: LAB_OUTPUTS
      });

      if (!result.ok) {
        failures.push(`${testCase.id}: lab run should stay ok`);
        continue;
      }

      if (!result.supportedTargetOutputs.length) {
        failures.push(`${testCase.id}: expected at least one supported lab output`);
      }

      assertPartition(result, LAB_OUTPUTS, `${testCase.id} lab`, failures);
      assertFiniteSupportedOutputs(result, LAB_OUTPUTS, `${testCase.id} lab`, failures);
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative field-side floor continuations sane across the same topology sweep", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (!result.ok) {
        failures.push(`${testCase.id}: field run should stay ok`);
        continue;
      }

      if (!result.supportedTargetOutputs.length) {
        failures.push(`${testCase.id}: expected at least one supported field output`);
      }

      assertPartition(result, FIELD_OUTPUTS, `${testCase.id} field`, failures);
      assertFiniteSupportedOutputs(result, FIELD_OUTPUTS, `${testCase.id} field`, failures);

      const lnw = result.impact?.LnW;
      const lPrimeNW = result.impact?.LPrimeNW;
      const lPrimeNTw = result.impact?.LPrimeNTw;

      if (
        result.supportedTargetOutputs.includes("Ln,w") &&
        result.supportedTargetOutputs.includes("L'n,w") &&
        typeof lnw === "number" &&
        typeof lPrimeNW === "number" &&
        Math.abs(lPrimeNW - (lnw + IMPACT_FIELD_CONTEXT.fieldKDb)) > 0.2
      ) {
        failures.push(`${testCase.id}: expected L'n,w to continue from Ln,w + K, got Ln,w=${lnw}, L'n,w=${lPrimeNW}`);
      }

      if (
        result.supportedTargetOutputs.includes("L'n,w") &&
        result.supportedTargetOutputs.includes("L'nT,w") &&
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
