import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import {
  getFloorSystemDerivedRwPlusCtr,
  type FloorRole,
  type FloorSystemMatchCriteria,
  type FloorSystemRoleCriteria,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

const AIRBORNE_REQUEST: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"];
const IMPACT_BUNDLE_REQUEST: readonly RequestedOutputId[] = [
  "Rw",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "DeltaLw",
  "IIC"
];

const MATCH_ROLE_ENTRIES: Array<[FloorRole, keyof FloorSystemMatchCriteria]> = [
  ["ceiling_board", "ceilingBoard"],
  ["ceiling_fill", "ceilingFill"],
  ["ceiling_cavity", "ceilingCavity"],
  ["upper_fill", "upperFill"],
  ["floating_screed", "floatingScreed"],
  ["floor_covering", "floorCovering"],
  ["resilient_layer", "resilientLayer"],
  ["base_structure", "baseStructure"]
];

function layer(materialId: string, thicknessMm: number) {
  return { materialId, thicknessMm };
}

function expectFiniteNumber(value: number | null | undefined, label: string, failures: string[]): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    failures.push(`${label}: expected a finite number, got ${value === undefined ? "undefined" : String(value)}`);
  }
}

function getDefaultThicknessMm(role: FloorRole): number {
  switch (role) {
    case "base_structure":
      return 150;
    case "ceiling_board":
      return 12.5;
    case "ceiling_cavity":
      return 25;
    case "ceiling_fill":
      return 90;
    case "floating_screed":
      return 19;
    case "floor_covering":
      return 8;
    case "resilient_layer":
      return 5;
    case "upper_fill":
      return 50;
  }
}

function buildLayersFromCriteria(match: FloorSystemMatchCriteria) {
  const layers: Array<{ floorRole: FloorRole; materialId: string; thicknessMm: number }> = [];

  for (const [role, key] of MATCH_ROLE_ENTRIES) {
    const criteria = match[key] as FloorSystemRoleCriteria | undefined;

    if (!criteria) {
      continue;
    }

    const materialId = criteria.materialIds?.[0];
    if (!materialId) {
      throw new Error(`Cannot build ${role} layer without at least one material id.`);
    }

    const layerCount = criteria.layerCount ?? 1;
    const thicknessMm = criteria.thicknessMm ?? getDefaultThicknessMm(role);

    for (let index = 0; index < layerCount; index += 1) {
      layers.push({ floorRole: role, materialId, thicknessMm });
    }
  }

  return layers;
}

function getRequestedOutputValue(
  result: ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly>,
  output: RequestedOutputId
): number | null | undefined {
  switch (output) {
    case "Rw":
      return "metrics" in result ? result.metrics.estimatedRwDb : result.floorCarrier?.Rw;
    case "R'w":
      return "metrics" in result ? result.metrics.estimatedRwPrimeDb : undefined;
    case "Ctr": {
      if ("metrics" in result) {
        return result.metrics.estimatedCtrDb;
      }
      const derivedRwPlusCtr = result.floorCarrier ? getFloorSystemDerivedRwPlusCtr(result.floorCarrier) : undefined;
      return typeof derivedRwPlusCtr === "number" ? derivedRwPlusCtr - result.floorCarrier.Rw : undefined;
    }
    case "DnT,w":
      return "metrics" in result ? result.metrics.estimatedDnTwDb : undefined;
    case "DnT,A":
      return "metrics" in result ? result.metrics.estimatedDnTADb : undefined;
    case "Dn,w":
      return "metrics" in result ? result.metrics.estimatedDnWDb : undefined;
    case "Dn,A":
      return "metrics" in result ? result.metrics.estimatedDnADb : undefined;
    case "Ln,w":
      return result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound;
    case "CI":
      return result.impact?.CI;
    case "CI,50-2500":
      return result.impact?.CI50_2500;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound;
    default:
      return undefined;
  }
}

function expectCleanPartition(
  result: ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly>,
  expectedSupported: readonly RequestedOutputId[],
  label: string,
  failures: string[]
): void {
  const expectedUnsupported = result.targetOutputs.filter(
    (output: RequestedOutputId) => !expectedSupported.includes(output)
  );

  if (JSON.stringify(result.supportedTargetOutputs) !== JSON.stringify(expectedSupported)) {
    failures.push(
      `${label}: supported outputs ${JSON.stringify(result.supportedTargetOutputs)} did not match ${JSON.stringify(expectedSupported)}`
    );
  }

  if (JSON.stringify(result.unsupportedTargetOutputs) !== JSON.stringify(expectedUnsupported)) {
    failures.push(
      `${label}: unsupported outputs ${JSON.stringify(result.unsupportedTargetOutputs)} did not match ${JSON.stringify(expectedUnsupported)}`
    );
  }

  const overlapping = result.supportedTargetOutputs.filter(
    (output: RequestedOutputId) => result.unsupportedTargetOutputs.includes(output)
  );
  if (overlapping.length > 0) {
    failures.push(`${label}: supported/unsupported overlap ${overlapping.join(", ")}`);
  }
}

describe("output combination sweep", () => {
  it("keeps representative dynamic airborne wall combinations sane across lab and field bundles", () => {
    const leafProfiles = [
      { name: "gypsum_single", layers: [layer("gypsum_board", 12.5)] },
      { name: "fire_double", layers: [layer("firestop_board", 15), layer("firestop_board", 15)] },
      { name: "silent_mix", layers: [layer("silentboard", 12.5), layer("gypsum_board", 12.5)] }
    ] as const;
    const cavityProfiles = [
      { name: "gap_fill_75", layers: [layer("air_gap", 75), layer("rockwool", 75)] },
      { name: "split_120", layers: [layer("air_gap", 30), layer("rockwool", 60), layer("air_gap", 30)] },
      { name: "fill_90", layers: [layer("rockwool", 90)] }
    ] as const;

    const cases = [
      ...leafProfiles.flatMap((left) =>
        cavityProfiles.flatMap((cavity) =>
          leafProfiles.map((right) => ({
            family: "framed" as const,
            label: `${left.name}_${cavity.name}_${right.name}`,
            layers: [...left.layers, ...cavity.layers, ...right.layers]
          }))
        )
      ),
      {
        family: "massive" as const,
        label: "aac_separator_100",
        layers: [layer("skim_plaster", 3), layer("ytong_separatiepaneel_aac_5_750", 100), layer("skim_plaster", 3)]
      },
      {
        family: "massive" as const,
        label: "pumice_80_plastered",
        layers: [layer("cement_plaster", 15), layer("pumice_block", 80), layer("cement_plaster", 15)]
      },
      {
        family: "massive" as const,
        label: "concrete_150_rendered",
        layers: [layer("cement_plaster", 10), layer("concrete", 150), layer("skim_plaster", 5)]
      },
      {
        family: "lined_massive" as const,
        label: "lined_aac_single",
        layers: [
          layer("gypsum_board", 12.5),
          layer("air_gap", 50),
          layer("rockwool", 50),
          layer("ytong_aac_d700", 75),
          layer("skim_plaster", 5)
        ]
      },
      {
        family: "lined_massive" as const,
        label: "lined_pumice_double",
        layers: [
          layer("gypsum_board", 12.5),
          layer("air_gap", 25),
          layer("rockwool", 50),
          layer("pumice_block", 80),
          layer("air_gap", 25),
          layer("firestop_board", 15)
        ]
      },
      {
        family: "hybrid" as const,
        label: "hybrid_concrete_board",
        layers: [
          layer("security_board", 12.5),
          layer("air_gap", 25),
          layer("concrete", 80),
          layer("rockwool", 50),
          layer("diamond_board", 12.5)
        ]
      }
    ];

    const failures: string[] = [];

    for (const testCase of cases) {
      const framedContext =
        testCase.family === "framed"
          ? {
              connectionType: "line_connection" as const,
              studSpacingMm: 600,
              studType: "light_steel_stud" as const
            }
          : {};

      const lab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "element_lab",
          airtightness: "good",
          ...framedContext
        },
        targetOutputs: AIRBORNE_REQUEST
      });
      const field = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          electricalBoxes: "none",
          junctionQuality: "good",
          panelHeightMm: 2600,
          panelWidthMm: 3000,
          penetrationState: "none",
          perimeterSeal: "good",
          receivingRoomRt60S: 0.5,
          receivingRoomVolumeM3: 32,
          sharedTrack: "independent",
          ...framedContext
        },
        targetOutputs: AIRBORNE_REQUEST
      });
      const partialField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          panelHeightMm: 2600,
          panelWidthMm: 3000,
          ...framedContext
        },
        targetOutputs: AIRBORNE_REQUEST
      });

      expectCleanPartition(lab, ["Rw"], `${testCase.label} lab`, failures);
      expectCleanPartition(field, ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"], `${testCase.label} field`, failures);
      expectCleanPartition(partialField, ["R'w", "Dn,w", "Dn,A"], `${testCase.label} partial field`, failures);

      expectFiniteNumber(lab.metrics.estimatedRwDb, `${testCase.label} lab Rw`, failures);
      expectFiniteNumber(field.metrics.estimatedRwPrimeDb, `${testCase.label} field R'w`, failures);
      expectFiniteNumber(field.metrics.estimatedDnTwDb, `${testCase.label} field DnT,w`, failures);
      expectFiniteNumber(field.metrics.estimatedDnTADb, `${testCase.label} field DnT,A`, failures);
      expectFiniteNumber(field.metrics.estimatedDnWDb, `${testCase.label} field Dn,w`, failures);
      expectFiniteNumber(field.metrics.estimatedDnADb, `${testCase.label} field Dn,A`, failures);
      expectFiniteNumber(partialField.metrics.estimatedRwPrimeDb, `${testCase.label} partial field R'w`, failures);
      expectFiniteNumber(partialField.metrics.estimatedDnWDb, `${testCase.label} partial field Dn,w`, failures);
      expectFiniteNumber(partialField.metrics.estimatedDnADb, `${testCase.label} partial field Dn,A`, failures);

      if (lab.metrics.estimatedRwDb < 10 || lab.metrics.estimatedRwDb > 90) {
        failures.push(`${testCase.label}: lab Rw ${lab.metrics.estimatedRwDb} dB fell outside the broad sanity corridor`);
      }

      if (
        typeof field.metrics.estimatedRwPrimeDb === "number" &&
        (field.metrics.estimatedRwPrimeDb < lab.metrics.estimatedRwDb - 30 ||
          field.metrics.estimatedRwPrimeDb > lab.metrics.estimatedRwDb + 0.25)
      ) {
        failures.push(
          `${testCase.label}: field R'w ${field.metrics.estimatedRwPrimeDb} dB drifted too far from lab Rw ${lab.metrics.estimatedRwDb} dB`
        );
      }

      if (
        typeof field.metrics.estimatedDnTwDb === "number" &&
        typeof field.metrics.estimatedDnTADb === "number" &&
        field.metrics.estimatedDnTwDb < field.metrics.estimatedDnTADb - 0.5
      ) {
        failures.push(
          `${testCase.label}: expected DnT,w >= DnT,A, got ${field.metrics.estimatedDnTwDb} < ${field.metrics.estimatedDnTADb}`
        );
      }

      if (
        typeof field.metrics.estimatedDnWDb === "number" &&
        typeof field.metrics.estimatedDnADb === "number" &&
        field.metrics.estimatedDnWDb < field.metrics.estimatedDnADb - 0.5
      ) {
        failures.push(
          `${testCase.label}: expected Dn,w >= Dn,A, got ${field.metrics.estimatedDnWDb} < ${field.metrics.estimatedDnADb}`
        );
      }

      if (
        typeof partialField.metrics.estimatedRwPrimeDb === "number" &&
        typeof field.metrics.estimatedRwPrimeDb === "number" &&
        Math.abs(partialField.metrics.estimatedRwPrimeDb - field.metrics.estimatedRwPrimeDb) > 1.1
      ) {
        failures.push(
          `${testCase.label}: partial/full field R'w diverged ${partialField.metrics.estimatedRwPrimeDb} vs ${field.metrics.estimatedRwPrimeDb}`
        );
      }

      if (
        typeof partialField.metrics.estimatedDnWDb === "number" &&
        typeof field.metrics.estimatedDnWDb === "number" &&
        Math.abs(partialField.metrics.estimatedDnWDb - field.metrics.estimatedDnWDb) > 1.1
      ) {
        failures.push(
          `${testCase.label}: partial/full field Dn,w diverged ${partialField.metrics.estimatedDnWDb} vs ${field.metrics.estimatedDnWDb}`
        );
      }

      if (
        typeof partialField.metrics.estimatedDnADb === "number" &&
        typeof field.metrics.estimatedDnADb === "number" &&
        Math.abs(partialField.metrics.estimatedDnADb - field.metrics.estimatedDnADb) > 1.1
      ) {
        failures.push(
          `${testCase.label}: partial/full field Dn,A diverged ${partialField.metrics.estimatedDnADb} vs ${field.metrics.estimatedDnADb}`
        );
      }

      if (partialField.metrics.estimatedDnTwDb !== undefined || partialField.metrics.estimatedDnTADb !== undefined) {
        failures.push(`${testCase.label}: partial field route unexpectedly fabricated DnT outputs`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps exact curated floor-system output bundles coherent on the impact-only route", () => {
    const failures: string[] = [];

    for (const system of EXACT_FLOOR_SYSTEMS) {
      const result = calculateImpactOnly([], {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        officialFloorSystemId: system.id,
        targetOutputs: IMPACT_BUNDLE_REQUEST
      });
      const derivedRwPlusCtr = getFloorSystemDerivedRwPlusCtr(system.airborneRatings);
      const hasCI = typeof system.impactRatings.CI === "number";
      const hasCI50 = typeof system.impactRatings.CI50_2500 === "number";
      const expectedSupported = IMPACT_BUNDLE_REQUEST.filter((output) => {
        switch (output) {
          case "Rw":
            return true;
          case "Ctr":
            return typeof derivedRwPlusCtr === "number";
          case "Ln,w":
          case "L'n,w":
          case "L'nT,w":
            return true;
          case "CI":
          case "Ln,w+CI":
            return hasCI;
          case "CI,50-2500":
            return hasCI50;
          case "L'nT,50":
            return hasCI || hasCI50;
          default:
            return false;
        }
      });

      expectCleanPartition(result, expectedSupported, `${system.id} impact-only exact`, failures);

      const matchId = result.floorSystemMatch?.system.id;
      if (matchId !== system.id) {
        failures.push(`${system.id}: expected floor-system id ${system.id}, got ${matchId ?? "none"}`);
      }

      expectFiniteNumber(result.floorCarrier?.Rw, `${system.id} floor Rw`, failures);
      expectedSupported.forEach((output) => {
        expectFiniteNumber(getRequestedOutputValue(result, output), `${system.id} ${output}`, failures);
      });

      if (result.impact?.LnW !== system.impactRatings.LnW) {
        failures.push(`${system.id}: expected Ln,w ${system.impactRatings.LnW}, got ${result.impact?.LnW ?? "none"}`);
      }

      if (
        typeof result.impact?.LnW === "number" &&
        typeof result.impact.CI === "number" &&
        typeof result.impact.LnWPlusCI === "number" &&
        Math.abs(result.impact.LnWPlusCI - (result.impact.LnW + result.impact.CI)) > 1e-6
      ) {
        failures.push(
          `${system.id}: expected Ln,w+CI = Ln,w + CI, got ${result.impact.LnWPlusCI} vs ${result.impact.LnW + result.impact.CI}`
        );
      }

      if (
        typeof result.impact?.LPrimeNTw === "number" &&
        typeof result.impact.CI50_2500 === "number" &&
        typeof result.impact.LPrimeNT50 === "number" &&
        Math.abs(result.impact.LPrimeNT50 - (result.impact.LPrimeNTw + result.impact.CI50_2500)) > 1e-6
      ) {
        failures.push(
          `${system.id}: expected L'nT,50 = L'nT,w + CI,50-2500, got ${result.impact.LPrimeNT50} vs ${result.impact.LPrimeNTw + result.impact.CI50_2500}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps bound curated floor-system output bundles fail-closed on impact-only and bound-carry on assembly", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      const impactOnly = calculateImpactOnly([], {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        officialFloorSystemId: system.id,
        targetOutputs: IMPACT_BUNDLE_REQUEST
      });
      const impactOnlySupported: RequestedOutputId[] = ["Rw"];
      const derivedRwPlusCtr = getFloorSystemDerivedRwPlusCtr(system.airborneRatings);

      if (typeof derivedRwPlusCtr === "number") {
        impactOnlySupported.push("Ctr");
      }

      expectCleanPartition(impactOnly, impactOnlySupported, `${system.id} impact-only bound`, failures);

      if (impactOnly.impact !== null) {
        failures.push(`${system.id}: impact-only route should stay bound-only`);
      }

      impactOnlySupported.forEach((output) => {
        expectFiniteNumber(getRequestedOutputValue(impactOnly, output), `${system.id} impact-only ${output}`, failures);
      });

      expectFiniteNumber(impactOnly.lowerBoundImpact?.LnWUpperBound, `${system.id} impact-only Ln,w upper bound`, failures);
      expectFiniteNumber(impactOnly.lowerBoundImpact?.LPrimeNWUpperBound, `${system.id} impact-only L'n,w upper bound`, failures);
      expectFiniteNumber(impactOnly.lowerBoundImpact?.LPrimeNTwUpperBound, `${system.id} impact-only L'nT,w upper bound`, failures);

      const assembly = calculateAssembly(buildLayersFromCriteria(system.match), {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: IMPACT_BUNDLE_REQUEST
      });
      const assemblySupported: RequestedOutputId[] = ["Rw", "Ctr", "Ln,w", "L'n,w", "L'nT,w"];

      expectCleanPartition(assembly, assemblySupported, `${system.id} assembly bound`, failures);

      if (assembly.impact !== null) {
        failures.push(`${system.id}: assembly route should keep bound rows off the live impact lane`);
      }

      assemblySupported.forEach((output) => {
        expectFiniteNumber(getRequestedOutputValue(assembly, output), `${system.id} assembly ${output}`, failures);
      });

      if (
        typeof assembly.lowerBoundImpact?.LPrimeNWUpperBound === "number" &&
        typeof assembly.lowerBoundImpact?.LnWUpperBound === "number" &&
        assembly.lowerBoundImpact.LPrimeNWUpperBound < assembly.lowerBoundImpact.LnWUpperBound
      ) {
        failures.push(
          `${system.id}: expected L'n,w upper bound >= Ln,w upper bound, got ${assembly.lowerBoundImpact.LPrimeNWUpperBound} < ${assembly.lowerBoundImpact.LnWUpperBound}`
        );
      }

      if (
        typeof assembly.lowerBoundImpact?.LPrimeNTwUpperBound === "number" &&
        typeof assembly.lowerBoundImpact?.LPrimeNWUpperBound === "number" &&
        assembly.lowerBoundImpact.LPrimeNTwUpperBound > assembly.lowerBoundImpact.LPrimeNWUpperBound + 0.25
      ) {
        failures.push(
          `${system.id}: expected L'nT,w upper bound to stay close to or below L'n,w upper bound, got ${assembly.lowerBoundImpact.LPrimeNTwUpperBound} vs ${assembly.lowerBoundImpact.LPrimeNWUpperBound}`
        );
      }
    }

    expect(failures).toEqual([]);
  });
});
