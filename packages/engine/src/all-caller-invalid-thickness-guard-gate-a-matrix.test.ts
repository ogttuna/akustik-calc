import type { AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly, type CalculateAssemblyOptions } from "./calculate-assembly";

type CallerSurface = {
  buildLayers: (thicknessMm: unknown) => readonly LayerInput[];
  id: string;
  options: CalculateAssemblyOptions;
  requestedOutputs: readonly RequestedOutputId[];
};

type InvalidThicknessVariant = {
  id: string;
  warningPattern: RegExp;
  value: unknown;
};

const WALL_OUTPUTS = ["Rw", "R'w", "DnT,w", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FLOOR_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT = {
  airtightness: "good" as const,
  contextMode: "element_lab" as const
};

const WALL_FIELD_CONTEXT = {
  airtightness: "good" as const,
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const FLOOR_AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const FLOOR_IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const INVALID_THICKNESS_VARIANTS: readonly InvalidThicknessVariant[] = [
  {
    id: "zero",
    value: 0,
    warningPattern: /invalid thickness: 0 \(must be > 0\)/i
  },
  {
    id: "negative",
    value: -5,
    warningPattern: /invalid thickness: -5 \(must be > 0\)/i
  },
  {
    id: "nan",
    value: Number.NaN,
    warningPattern: /invalid thickness: NaN/i
  },
  {
    id: "infinity",
    value: Number.POSITIVE_INFINITY,
    warningPattern: /invalid thickness: Infinity/i
  },
  {
    id: "non_numeric_runtime_value",
    value: "abc",
    warningPattern: /invalid thickness: non-numeric \(string\)/i
  }
];

const CALLER_SURFACES: readonly CallerSurface[] = [
  {
    id: "wall_lab_direct",
    requestedOutputs: WALL_OUTPUTS,
    options: {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    },
    buildLayers: (thicknessMm) => [
      {
        materialId: "concrete",
        thicknessMm: thicknessMm as number
      }
    ]
  },
  {
    id: "wall_field_direct",
    requestedOutputs: WALL_OUTPUTS,
    options: {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    },
    buildLayers: (thicknessMm) => [
      {
        materialId: "concrete",
        thicknessMm: thicknessMm as number
      }
    ]
  },
  {
    id: "floor_field_explicit_roles",
    requestedOutputs: FLOOR_OUTPUTS,
    options: {
      airborneContext: FLOOR_AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_OUTPUTS
    },
    buildLayers: (thicknessMm) => [
      {
        floorRole: "floor_covering",
        materialId: "ceramic_tile",
        thicknessMm: 8
      },
      {
        floorRole: "resilient_layer",
        materialId: "generic_resilient_underlay",
        thicknessMm: 8
      },
      {
        floorRole: "base_structure",
        materialId: "concrete",
        thicknessMm: thicknessMm as number
      }
    ]
  },
  {
    id: "floor_raw_pre_inference",
    requestedOutputs: FLOOR_OUTPUTS,
    options: {
      airborneContext: FLOOR_AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: FLOOR_OUTPUTS
    },
    buildLayers: (thicknessMm) => [
      {
        materialId: "gypsum_board",
        thicknessMm: 13
      },
      {
        materialId: "rockwool",
        thicknessMm: 90
      },
      {
        materialId: "concrete",
        thicknessMm: thicknessMm as number
      }
    ]
  }
];

function collectNonFiniteNumbers(value: unknown, path: string): string[] {
  if (typeof value === "number") {
    return Number.isFinite(value) ? [] : [`${path}: ${String(value)}`];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => collectNonFiniteNumbers(entry, `${path}[${index}]`));
  }

  return Object.entries(value).flatMap(([key, entry]) => collectNonFiniteNumbers(entry, `${path}.${key}`));
}

function assertFailClosedResult(input: {
  result: AssemblyCalculation;
  surface: CallerSurface;
  variant: InvalidThicknessVariant;
}): string[] {
  const { result, surface, variant } = input;
  const failures: string[] = [];
  const label = `${surface.id}/${variant.id}`;

  const nonFiniteNumbers = [
    ...collectNonFiniteNumbers(result.metrics, "metrics"),
    ...collectNonFiniteNumbers(result.curve.frequenciesHz, "curve.frequenciesHz"),
    ...collectNonFiniteNumbers(result.curve.transmissionLossDb, "curve.transmissionLossDb"),
    ...collectNonFiniteNumbers(result.ratings, "ratings")
  ];
  if (nonFiniteNumbers.length > 0) {
    failures.push(`${label}: non-finite numeric values ${nonFiniteNumbers.join(", ")}`);
  }

  if (result.supportedTargetOutputs.length !== 0) {
    failures.push(`${label}: expected no supported target outputs, got ${JSON.stringify(result.supportedTargetOutputs)}`);
  }

  if (JSON.stringify(result.unsupportedTargetOutputs) !== JSON.stringify(surface.requestedOutputs)) {
    failures.push(
      `${label}: expected requested outputs to be unsupported ${JSON.stringify(surface.requestedOutputs)}, got ${JSON.stringify(result.unsupportedTargetOutputs)}`
    );
  }

  if (result.supportedImpactOutputs.length !== 0) {
    failures.push(`${label}: expected no supported impact outputs, got ${JSON.stringify(result.supportedImpactOutputs)}`);
  }

  if (!result.warnings.some((warning: string) => variant.warningPattern.test(warning))) {
    failures.push(`${label}: missing thickness warning ${variant.warningPattern}; warnings ${JSON.stringify(result.warnings)}`);
  }

  if (result.impact !== null) {
    failures.push(`${label}: expected null impact lane, got ${JSON.stringify(result.impact)}`);
  }

  if (result.floorSystemMatch) {
    failures.push(`${label}: expected no exact floor-system match, got ${result.floorSystemMatch.system.id}`);
  }

  if (result.floorSystemEstimate) {
    failures.push(`${label}: expected no floor-system estimate, got ${result.floorSystemEstimate.kind}`);
  }

  if (result.boundFloorSystemMatch) {
    failures.push(`${label}: expected no bound floor-system match, got ${result.boundFloorSystemMatch.system.id}`);
  }

  if (result.boundFloorSystemEstimate) {
    failures.push(`${label}: expected no bound floor-system estimate, got ${result.boundFloorSystemEstimate.kind}`);
  }

  if (result.floorSystemRatings) {
    failures.push(`${label}: expected no floor-system ratings, got ${JSON.stringify(result.floorSystemRatings)}`);
  }

  if (result.floorSystemRecommendations.length !== 0) {
    failures.push(`${label}: expected no floor-system recommendations, got ${JSON.stringify(result.floorSystemRecommendations)}`);
  }

  if (result.impactCatalogMatch) {
    failures.push(`${label}: expected no impact catalog match, got ${JSON.stringify(result.impactCatalogMatch)}`);
  }

  if (result.lowerBoundImpact) {
    failures.push(`${label}: expected no lower-bound impact lane, got ${JSON.stringify(result.lowerBoundImpact)}`);
  }

  return failures;
}

describe("all-caller invalid-thickness guard Gate A matrix", () => {
  it("fail-closes direct floor and wall engine callers before workbench normalization or floor inference", () => {
    const failures: string[] = [];

    for (const surface of CALLER_SURFACES) {
      for (const variant of INVALID_THICKNESS_VARIANTS) {
        const label = `${surface.id}/${variant.id}`;
        const layers = surface.buildLayers(variant.value);
        let result: AssemblyCalculation | null = null;

        try {
          result = calculateAssembly(layers, surface.options);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`${label}: calculateAssembly threw ${message}`);
          continue;
        }

        failures.push(...assertFailClosedResult({ result, surface, variant }));
      }
    }

    expect(failures).toEqual([]);
  });
});
