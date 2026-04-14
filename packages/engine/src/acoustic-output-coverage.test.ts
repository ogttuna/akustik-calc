import { describe, expect, it } from "vitest";

import type { AssemblyCalculation, ImpactOnlyCalculation, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

const EXACT_IMPACT_SOURCE_19 = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab" as const,
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
};

const EXACT_FIELD_OCTAVE_SOURCE_5 = {
  frequenciesHz: [125, 250, 500, 1000, 2000],
  labOrField: "field" as const,
  levelsDb: [60.3, 61.7, 63.1, 63.5, 59.2],
  standardMethod: "NEN 5077 / ISO 16283-2"
};

const DIRECT_FLANKING_FIELD_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      id: "f1",
      levelOffsetDb: -6,
      pathCount: 1,
      pathType: "wall" as const,
      supportingElementFamily: "reinforced_concrete" as const
    },
    {
      id: "f2",
      kijDb: 1.5,
      levelOffsetDb: -10,
      pathCount: 2,
      pathType: "ceiling" as const,
      shortCircuitRisk: "medium" as const
    }
  ],
  lowerTreatmentReductionDb: 2,
  receivingRoomVolumeM3: 50
};

const KEY_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
];

const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "Ln,w",
  "L'n,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
  "IIC",
  "AIIC",
  "NISR",
  "ISR",
  "LIIC",
  "LIR",
  "HIIC"
]);

type AnyAcousticResult = AssemblyCalculation | ImpactOnlyCalculation;

function hasAssemblyMetrics(result: AnyAcousticResult): result is AssemblyCalculation {
  return "metrics" in result;
}

function expectFiniteNumber(value: number | null | undefined, label: string): void {
  expect(typeof value, label).toBe("number");
  expect(Number.isFinite(value), label).toBe(true);
}

function addCoveredOutputs(
  coveredOutputs: Set<RequestedOutputId>,
  outputs: readonly RequestedOutputId[]
): void {
  outputs.forEach((output: RequestedOutputId) => coveredOutputs.add(output));
}

function getRequestedOutputValue(
  result: AnyAcousticResult,
  output: RequestedOutputId
): number | null | undefined {
  switch (output) {
    case "Rw":
      if (hasAssemblyMetrics(result) && result.metrics.airborneIsoDescriptor !== "R'w") {
        return result.metrics.estimatedRwDb;
      }
      return result.floorSystemRatings?.Rw;
    case "R'w":
      return hasAssemblyMetrics(result)
        ? result.metrics.estimatedRwPrimeDb ??
            result.ratings.field?.RwPrime ??
            (result.metrics.airborneIsoDescriptor === "R'w" ? result.metrics.estimatedRwDb : undefined)
        : undefined;
    case "DnT,w":
      return hasAssemblyMetrics(result) ? result.metrics.estimatedDnTwDb : undefined;
    case "DnT,A":
      return hasAssemblyMetrics(result) ? result.metrics.estimatedDnTADb : undefined;
    case "DnT,A,k":
      return hasAssemblyMetrics(result) ? result.metrics.estimatedDnTAkDb : undefined;
    case "Dn,w":
      return hasAssemblyMetrics(result) ? result.metrics.estimatedDnWDb : undefined;
    case "Dn,A":
      return hasAssemblyMetrics(result) ? result.metrics.estimatedDnADb : undefined;
    case "Ln,w":
      return result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound;
    case "CI":
      return result.impact?.CI;
    case "CI,50-2500":
      return result.impact?.CI50_2500;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound;
    case "LnT,A":
      return result.impact?.LnTA;
    default:
      return undefined;
  }
}

function expectCleanTargetPartition(result: AnyAcousticResult, label: string): void {
  expect(
    result.targetOutputs,
    `${label} should keep requested outputs deduplicated while preserving request order`
  ).toEqual(Array.from(new Set(result.targetOutputs)));
  expect(
    result.unsupportedTargetOutputs,
    `${label} should partition supported and unsupported target outputs cleanly`
  ).toEqual(result.targetOutputs.filter((output: RequestedOutputId) => !result.supportedTargetOutputs.includes(output)));
  expect(
    result.supportedTargetOutputs.every((output: RequestedOutputId) => result.targetOutputs.includes(output)),
    `${label} should only support requested outputs`
  ).toBe(true);
  expect(
    result.supportedTargetOutputs.every((output: RequestedOutputId) => !result.unsupportedTargetOutputs.includes(output)),
    `${label} should not overlap supported and unsupported outputs`
  ).toBe(true);
  expect(
    result.supportedImpactOutputs.every(
      (output: RequestedOutputId) => IMPACT_OUTPUTS.has(output) && result.supportedTargetOutputs.includes(output)
    ),
    `${label} should keep supported impact outputs aligned with supported target outputs`
  ).toBe(true);
  expect(
    result.unsupportedImpactOutputs.every(
      (output: RequestedOutputId) => IMPACT_OUTPUTS.has(output) && result.unsupportedTargetOutputs.includes(output)
    ),
    `${label} should keep unsupported impact outputs aligned with unsupported target outputs`
  ).toBe(true);
}

function expectFiniteSupportedOutputs(result: AnyAcousticResult, label: string): void {
  result.supportedTargetOutputs.forEach((output: RequestedOutputId) => {
    expectFiniteNumber(getRequestedOutputValue(result, output), `${label} ${output}`);
  });
}

describe("acoustic output coverage", () => {
  it("keeps every key airborne and impact output reachable on at least one representative route", () => {
    const coveredOutputs = new Set<RequestedOutputId>();

    const airborneLab = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 75 },
        { materialId: "rockwool", thicknessMm: 75 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        airborneContext: {
          contextMode: "element_lab",
          airtightness: "good"
        },
        targetOutputs: ["Rw"]
      }
    );
    addCoveredOutputs(coveredOutputs, airborneLab.supportedTargetOutputs as readonly RequestedOutputId[]);
    expect(airborneLab.supportedTargetOutputs).toEqual(["Rw"]);
    expectFiniteNumber(airborneLab.ratings.iso717.Rw, "airborne lab Rw");

    const airborneField = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 75 },
        { materialId: "rockwool", thicknessMm: 75 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        airborneContext: {
          contextMode: "field_between_rooms",
          panelWidthMm: 3000,
          panelHeightMm: 2800,
          receivingRoomVolumeM3: 42,
          receivingRoomRt60S: 0.6
        },
        targetOutputs: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
      }
    );
    addCoveredOutputs(coveredOutputs, airborneField.supportedTargetOutputs as readonly RequestedOutputId[]);
    expect(airborneField.supportedTargetOutputs).toEqual(["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]);
    expectFiniteNumber(airborneField.ratings.field?.RwPrime, "airborne field R'w");
    expectFiniteNumber(airborneField.ratings.field?.DnTw, "airborne field DnT,w");
    expectFiniteNumber(airborneField.ratings.field?.DnTA, "airborne field DnT,A");
    expectFiniteNumber(airborneField.ratings.field?.DnW, "airborne field Dn,w");
    expectFiniteNumber(airborneField.ratings.field?.DnA, "airborne field Dn,A");

    const airborneCompanion = calculateAssembly(
      [
        { materialId: "skim_plaster", thicknessMm: 3 },
        { materialId: "ytong_separatiepaneel_aac_5_750", thicknessMm: 100 },
        { materialId: "skim_plaster", thicknessMm: 3 }
      ],
      {
        airborneContext: {
          contextMode: "field_between_rooms",
          airtightness: "good"
        },
        targetOutputs: ["DnT,A,k", "DnT,A"]
      }
    );
    addCoveredOutputs(coveredOutputs, airborneCompanion.supportedTargetOutputs as readonly RequestedOutputId[]);
    expect(airborneCompanion.supportedTargetOutputs).toEqual(["DnT,A,k"]);
    expectFiniteNumber(airborneCompanion.ratings.field?.DnTAk, "airborne field DnT,A,k");

    const impactExactLab = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
    });
    addCoveredOutputs(coveredOutputs, impactExactLab.supportedTargetOutputs as readonly RequestedOutputId[]);
    expect(impactExactLab.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expectFiniteNumber(impactExactLab.impact?.LnW, "impact exact lab Ln,w");
    expectFiniteNumber(impactExactLab.impact?.CI, "impact exact lab CI");
    expectFiniteNumber(impactExactLab.impact?.CI50_2500, "impact exact lab CI,50-2500");
    expectFiniteNumber(impactExactLab.impact?.LnWPlusCI, "impact exact lab Ln,w+CI");

    const impactProductDelta = calculateImpactOnly([], {
      impactPredictorInput: {
        structuralSupportType: "reinforced_concrete",
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 140,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "getzner_afm_26",
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    addCoveredOutputs(coveredOutputs, impactProductDelta.supportedTargetOutputs as readonly RequestedOutputId[]);
    expect(impactProductDelta.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expectFiniteNumber(impactProductDelta.impact?.LnW, "impact product-delta Ln,w");
    expectFiniteNumber(impactProductDelta.impact?.DeltaLw, "impact product-delta DeltaLw");

    const impactDirectField = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
        targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
      }
    );
    addCoveredOutputs(coveredOutputs, impactDirectField.supportedTargetOutputs as readonly RequestedOutputId[]);
    expect(impactDirectField.supportedTargetOutputs).toEqual([
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expectFiniteNumber(impactDirectField.impact?.LnW, "impact direct-field Ln,w");
    expectFiniteNumber(impactDirectField.impact?.LPrimeNW, "impact direct-field L'n,w");
    expectFiniteNumber(impactDirectField.impact?.LPrimeNTw, "impact direct-field L'nT,w");
    expectFiniteNumber(impactDirectField.impact?.LPrimeNT50, "impact direct-field L'nT,50");

    const impactDutchField = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_FIELD_OCTAVE_SOURCE_5,
      targetOutputs: ["LnT,A", "L'nT,w", "CI"]
    });
    addCoveredOutputs(coveredOutputs, impactDutchField.supportedTargetOutputs as readonly RequestedOutputId[]);
    expect(impactDutchField.supportedTargetOutputs).toEqual(["LnT,A", "L'nT,w", "CI"]);
    expectFiniteNumber(impactDutchField.impact?.LnTA, "impact Dutch LnT,A");
    expectFiniteNumber(impactDutchField.impact?.LPrimeNTw, "impact Dutch L'nT,w");

    expect(coveredOutputs).toEqual(new Set(KEY_OUTPUTS));
  });

  it("keeps representative airborne and impact routes partitioned, finite, and internally coherent", () => {
    const scenarios: Array<{
      extraChecks?: (result: AnyAcousticResult) => void;
      label: string;
      requested: readonly RequestedOutputId[];
      result: AnyAcousticResult;
      supported: readonly RequestedOutputId[];
      unsupported: readonly RequestedOutputId[];
    }> = [
      {
        label: "assembly airborne lab route",
        requested: ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "Ln,w"],
        result: calculateAssembly(
          [
            { materialId: "gypsum_board", thicknessMm: 12.5 },
            { materialId: "air_gap", thicknessMm: 75 },
            { materialId: "rockwool", thicknessMm: 75 },
            { materialId: "gypsum_board", thicknessMm: 12.5 }
          ],
          {
            airborneContext: {
              contextMode: "element_lab",
              airtightness: "good"
            },
            targetOutputs: ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "Ln,w"]
          }
        ),
        supported: ["Rw"],
        unsupported: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "Ln,w"]
      },
      {
        extraChecks: (result) => {
          if (!hasAssemblyMetrics(result)) {
            return;
          }
          expect(result.metrics.estimatedDnTwDb).toBeGreaterThanOrEqual(result.metrics.estimatedDnTADb ?? -Infinity);
          expect(result.metrics.estimatedDnWDb).toBeGreaterThanOrEqual(result.metrics.estimatedDnADb ?? -Infinity);
        },
        label: "assembly airborne full field route",
        requested: ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"],
        result: calculateAssembly(
          [
            { materialId: "gypsum_board", thicknessMm: 12.5 },
            { materialId: "air_gap", thicknessMm: 75 },
            { materialId: "rockwool", thicknessMm: 75 },
            { materialId: "gypsum_board", thicknessMm: 12.5 }
          ],
          {
            airborneContext: {
              contextMode: "field_between_rooms",
              panelWidthMm: 3000,
              panelHeightMm: 2800,
              receivingRoomVolumeM3: 42,
              receivingRoomRt60S: 0.6
            },
            targetOutputs: ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
          }
        ),
        supported: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"],
        unsupported: ["Rw"]
      },
      {
        label: "assembly airborne partial geometry field route",
        requested: ["Dn,w", "Dn,A", "DnT,w", "DnT,A"],
        result: calculateAssembly(
          [
            { materialId: "gypsum_board", thicknessMm: 12.5 },
            { materialId: "air_gap", thicknessMm: 75 },
            { materialId: "rockwool", thicknessMm: 75 },
            { materialId: "gypsum_board", thicknessMm: 12.5 }
          ],
          {
            airborneContext: {
              contextMode: "field_between_rooms",
              panelWidthMm: 3000,
              panelHeightMm: 2800
            },
            targetOutputs: ["Dn,w", "Dn,A", "DnT,w", "DnT,A"]
          }
        ),
        supported: ["Dn,w", "Dn,A"],
        unsupported: ["DnT,w", "DnT,A"]
      },
      {
        label: "assembly airborne official companion route",
        requested: ["DnT,A,k", "DnT,A", "DnT,w"],
        result: calculateAssembly(
          [
            { materialId: "skim_plaster", thicknessMm: 3 },
            { materialId: "ytong_separatiepaneel_aac_5_750", thicknessMm: 100 },
            { materialId: "skim_plaster", thicknessMm: 3 }
          ],
          {
            airborneContext: {
              contextMode: "field_between_rooms",
              airtightness: "good"
            },
            targetOutputs: ["DnT,A,k", "DnT,A", "DnT,w"]
          }
        ),
        supported: ["DnT,A,k"],
        unsupported: ["DnT,A", "DnT,w"]
      },
      {
        extraChecks: (result) => {
          expect(result.impactSupport?.formulaNotes.some((note: string) => /Ln,w\+CI was computed as Ln,w \+ CI/i.test(note))).toBe(true);
          expect(result.impact?.LnWPlusCI).toBeCloseTo((result.impact?.LnW ?? 0) + (result.impact?.CI ?? 0), 6);
        },
        label: "assembly mixed exact-lab impact route",
        requested: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w"],
        result: calculateAssembly(
          [
            { materialId: "ceramic_tile", thicknessMm: 8 },
            { materialId: "screed", thicknessMm: 50 },
            { materialId: "generic_resilient_underlay", thicknessMm: 8 },
            { materialId: "concrete", thicknessMm: 150 }
          ],
          {
            exactImpactSource: EXACT_IMPACT_SOURCE_19,
            targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w"]
          }
        ),
        supported: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        unsupported: ["L'n,w"]
      },
      {
        extraChecks: (result) => {
          expect(result.impactSupport?.formulaNotes.some((note: string) => /Ln,w\+CI was computed as Ln,w \+ CI/i.test(note))).toBe(true);
          expect(result.impactSupport?.formulaNotes.some((note: string) => /L'nT,50 was computed as L'nT,w \+ CI,50-2500/i.test(note))).toBe(true);
          expect(result.impact?.LnWPlusCI).toBeCloseTo((result.impact?.LnW ?? 0) + (result.impact?.CI ?? 0), 6);
          expect(result.impact?.LPrimeNT50).toBeCloseTo((result.impact?.LPrimeNTw ?? 0) + (result.impact?.CI50_2500 ?? 0), 6);
        },
        label: "assembly direct-flanking impact field route",
        requested: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A", "DeltaLw"],
        result: calculateAssembly(
          [
            { materialId: "ceramic_tile", thicknessMm: 8 },
            { materialId: "screed", thicknessMm: 50 },
            { materialId: "generic_resilient_underlay", thicknessMm: 8 },
            { materialId: "concrete", thicknessMm: 150 }
          ],
          {
            exactImpactSource: EXACT_IMPACT_SOURCE_19,
            impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
            targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A", "DeltaLw"]
          }
        ),
        supported: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
        unsupported: ["LnT,A", "DeltaLw"]
      },
      {
        label: "assembly bound-only impact carry-over route",
        requested: ["Ln,w", "L'n,w", "L'nT,w", "IIC"],
        result: calculateAssembly(
          [
            { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
            { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
            { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
            { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
            { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
            { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
          ],
          {
            impactFieldContext: {
              fieldKDb: 2,
              receivingRoomVolumeM3: 50
            },
            targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "IIC"]
          }
        ),
        supported: ["Ln,w", "L'n,w", "L'nT,w"],
        unsupported: ["IIC"]
      },
      {
        extraChecks: (result) => {
          expect(result.impactSupport?.formulaNotes.some((note: string) => /Ln,w\+CI was computed as Ln,w \+ CI/i.test(note))).toBe(true);
          expect(result.impact?.LnWPlusCI).toBeCloseTo((result.impact?.LnW ?? 0) + (result.impact?.CI ?? 0), 6);
        },
        label: "impact-only exact lab source route",
        requested: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A"],
        result: calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
          exactImpactSource: EXACT_IMPACT_SOURCE_19,
          targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]
        }),
        supported: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        unsupported: ["DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]
      },
      {
        extraChecks: (result) => {
          expect(result.impactSupport?.formulaNotes.some((note: string) => /Ln,w\+CI was computed as Ln,w \+ CI/i.test(note))).toBe(true);
          expect(result.impactSupport?.formulaNotes.some((note: string) => /L'nT,50 was computed as L'nT,w \+ CI,50-2500/i.test(note))).toBe(true);
          expect(result.impact?.LnWPlusCI).toBeCloseTo((result.impact?.LnW ?? 0) + (result.impact?.CI ?? 0), 6);
          expect(result.impact?.LPrimeNT50).toBeCloseTo((result.impact?.LPrimeNTw ?? 0) + (result.impact?.CI50_2500 ?? 0), 6);
        },
        label: "impact-only direct-flanking field route",
        requested: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A", "DeltaLw"],
        result: calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
          exactImpactSource: EXACT_IMPACT_SOURCE_19,
          impactFieldContext: DIRECT_FLANKING_FIELD_CONTEXT,
          targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A", "DeltaLw"]
        }),
        supported: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
        unsupported: ["LnT,A", "DeltaLw"]
      },
      {
        label: "impact-only Dutch field route",
        requested: ["LnT,A", "L'nT,w", "CI", "Ln,w", "L'n,w"],
        result: calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
          exactImpactSource: EXACT_FIELD_OCTAVE_SOURCE_5,
          targetOutputs: ["LnT,A", "L'nT,w", "CI", "Ln,w", "L'n,w"]
        }),
        supported: ["LnT,A", "L'nT,w", "CI"],
        unsupported: ["Ln,w", "L'n,w"]
      },
      {
        label: "impact-only predictor heavy floating-floor route",
        requested: ["Ln,w", "DeltaLw", "L'n,w"],
        result: calculateImpactOnly([], {
          impactPredictorInput: {
            structuralSupportType: "reinforced_concrete",
            impactSystemType: "heavy_floating_floor",
            baseSlab: {
              materialClass: "heavy_concrete",
              thicknessMm: 150,
              densityKgM3: 2400
            },
            resilientLayer: {
              dynamicStiffnessMNm3: 30,
              thicknessMm: 8
            },
            floatingScreed: {
              materialClass: "generic_screed",
              thicknessMm: 30,
              densityKgM3: 2000
            },
            floorCovering: {
              mode: "material_layer",
              materialClass: "ceramic_tile",
              thicknessMm: 8,
              densityKgM3: 2000
            }
          },
          targetOutputs: ["Ln,w", "DeltaLw", "L'n,w"]
        }),
        supported: ["Ln,w", "DeltaLw"],
        unsupported: ["L'n,w"]
      },
      {
        extraChecks: (result) => {
          expect(result.impact).toBeNull();
          expectFiniteNumber(result.lowerBoundImpact?.LnWUpperBound, "impact-only bound Ln,w upper bound");
          expectFiniteNumber(result.lowerBoundImpact?.LPrimeNWUpperBound, "impact-only bound L'n,w upper bound");
          expectFiniteNumber(result.lowerBoundImpact?.LPrimeNTwUpperBound, "impact-only bound L'nT,w upper bound");
        },
        label: "impact-only bound floor-system route",
        requested: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "DeltaLw"],
        result: calculateImpactOnly([], {
          impactFieldContext: {
            fieldKDb: 2,
            receivingRoomVolumeM3: 50
          },
          officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026",
          targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "DeltaLw"]
        }),
        supported: ["Rw"],
        unsupported: ["Ln,w", "L'n,w", "L'nT,w", "DeltaLw"]
      }
    ];

    scenarios.forEach(({ extraChecks, label, requested, result, supported, unsupported }) => {
      expect(result.targetOutputs).toEqual(requested);
      expect(result.supportedTargetOutputs, `${label} supported outputs`).toEqual(supported);
      expect(result.unsupportedTargetOutputs, `${label} unsupported outputs`).toEqual(unsupported);
      expectCleanTargetPartition(result, label);
      expectFiniteSupportedOutputs(result, label);
      extraChecks?.(result);
    });
  });
});
