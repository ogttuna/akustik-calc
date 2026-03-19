import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { ksRound1 } from "./math";

const EXACT_IMPACT_SOURCE_19 = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab" as const,
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
};

function layer(materialId: string, thicknessMm: number) {
  return { materialId, thicknessMm };
}

function expectFinite(value: number | null | undefined, label: string, failures: string[]): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    failures.push(`${label}: expected a finite number, got ${value === undefined ? "undefined" : String(value)}`);
  }
}

function expectTargetPartition(
  actualSupported: readonly RequestedOutputId[],
  requested: readonly RequestedOutputId[],
  expectedSupported: readonly RequestedOutputId[],
  label: string,
  failures: string[]
): void {
  const expectedUnsupported = requested.filter((output) => !expectedSupported.includes(output));

  if (JSON.stringify(actualSupported) !== JSON.stringify(expectedSupported)) {
    failures.push(`${label}: supported outputs ${JSON.stringify(actualSupported)} did not match ${JSON.stringify(expectedSupported)}`);
  }

  const actualUnsupported = requested.filter((output) => !actualSupported.includes(output));
  if (JSON.stringify(actualUnsupported) !== JSON.stringify(expectedUnsupported)) {
    failures.push(
      `${label}: unsupported outputs ${JSON.stringify(actualUnsupported)} did not match ${JSON.stringify(expectedUnsupported)}`
    );
  }
}

describe("output perturbation sweep", () => {
  it("keeps representative framed-wall thickness perturbations locally smooth in lab and field", () => {
    const boardThicknesses = [12.5, 15] as const;
    const gapThicknesses = [50, 75] as const;
    const fillThicknesses = [50, 75] as const;
    const requested: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"];
    const failures: string[] = [];
    const grid = new Map<string, { dnA: number; dnTw: number; dnW: number; rw: number; rwPrime: number }>();

    for (const boardThicknessMm of boardThicknesses) {
      for (const gapThicknessMm of gapThicknesses) {
        for (const fillThicknessMm of fillThicknesses) {
          const layers = [
            layer("gypsum_board", boardThicknessMm),
            layer("air_gap", gapThicknessMm),
            layer("rockwool", fillThicknessMm),
            layer("gypsum_board", boardThicknessMm)
          ];
          const key = `${boardThicknessMm}-${gapThicknessMm}-${fillThicknessMm}`;
          const lab = calculateAssembly(layers, {
            calculator: "dynamic",
            airborneContext: {
              contextMode: "element_lab",
              airtightness: "good",
              connectionType: "line_connection",
              studSpacingMm: 600,
              studType: "light_steel_stud"
            },
            targetOutputs: requested
          });
          const field = calculateAssembly(layers, {
            calculator: "dynamic",
            airborneContext: {
              contextMode: "field_between_rooms",
              airtightness: "good",
              connectionType: "line_connection",
              electricalBoxes: "none",
              junctionQuality: "good",
              panelHeightMm: 2600,
              panelWidthMm: 3000,
              penetrationState: "none",
              perimeterSeal: "good",
              receivingRoomRt60S: 0.5,
              receivingRoomVolumeM3: 32,
              sharedTrack: "independent",
              studSpacingMm: 600,
              studType: "light_steel_stud"
            },
            targetOutputs: requested
          });

          expectTargetPartition(lab.supportedTargetOutputs, requested, ["Rw"], `${key} lab`, failures);
          expectTargetPartition(field.supportedTargetOutputs, requested, ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"], `${key} field`, failures);

          expectFinite(lab.metrics.estimatedRwDb, `${key} lab Rw`, failures);
          expectFinite(field.metrics.estimatedRwPrimeDb, `${key} field R'w`, failures);
          expectFinite(field.metrics.estimatedDnTwDb, `${key} field DnT,w`, failures);
          expectFinite(field.metrics.estimatedDnTADb, `${key} field DnT,A`, failures);
          expectFinite(field.metrics.estimatedDnWDb, `${key} field Dn,w`, failures);
          expectFinite(field.metrics.estimatedDnADb, `${key} field Dn,A`, failures);

          if (
            typeof field.metrics.estimatedDnTwDb === "number" &&
            typeof field.metrics.estimatedDnTADb === "number" &&
            Math.abs(field.metrics.estimatedDnTwDb - field.metrics.estimatedDnTADb) > 1.5
          ) {
            failures.push(`${key}: expected DnT,w and DnT,A to stay within a 1.5 dB local corridor`);
          }

          if (
            typeof field.metrics.estimatedDnWDb === "number" &&
            typeof field.metrics.estimatedDnADb === "number" &&
            Math.abs(field.metrics.estimatedDnWDb - field.metrics.estimatedDnADb) > 2.1
          ) {
            failures.push(`${key}: expected Dn,w and Dn,A to stay within a 2.1 dB local corridor`);
          }

          grid.set(key, {
            dnA: field.metrics.estimatedDnADb ?? Number.NaN,
            dnTw: field.metrics.estimatedDnTwDb ?? Number.NaN,
            dnW: field.metrics.estimatedDnWDb ?? Number.NaN,
            rw: lab.metrics.estimatedRwDb,
            rwPrime: field.metrics.estimatedRwPrimeDb ?? Number.NaN
          });
        }
      }
    }

    for (const gapThicknessMm of gapThicknesses) {
      for (const fillThicknessMm of fillThicknesses) {
        const thinner = grid.get(`12.5-${gapThicknessMm}-${fillThicknessMm}`)!;
        const thicker = grid.get(`15-${gapThicknessMm}-${fillThicknessMm}`)!;

        if (thicker.rw < thinner.rw - 1.1) {
          failures.push(
            `board ${gapThicknessMm}/${fillThicknessMm}: thicker boards should not reduce lab Rw by more than 1.1 dB (${thinner.rw} -> ${thicker.rw})`
          );
        }
        if (thicker.rwPrime < thinner.rwPrime - 1.1) {
          failures.push(
            `board ${gapThicknessMm}/${fillThicknessMm}: thicker boards should not reduce field R'w by more than 1.1 dB (${thinner.rwPrime} -> ${thicker.rwPrime})`
          );
        }
        if (thicker.dnTw < thinner.dnTw - 1.1) {
          failures.push(
            `board ${gapThicknessMm}/${fillThicknessMm}: thicker boards should not reduce DnT,w by more than 1.1 dB (${thinner.dnTw} -> ${thicker.dnTw})`
          );
        }
      }
    }

    for (const boardThicknessMm of boardThicknesses) {
      for (const fillThicknessMm of fillThicknesses) {
        const shallower = grid.get(`${boardThicknessMm}-50-${fillThicknessMm}`)!;
        const deeper = grid.get(`${boardThicknessMm}-75-${fillThicknessMm}`)!;

        if (Math.abs(deeper.rw - shallower.rw) > 6.1) {
          failures.push(
            `gap ${boardThicknessMm}/${fillThicknessMm}: cavity perturbation caused a lab Rw jump larger than 6.1 dB (${shallower.rw} -> ${deeper.rw})`
          );
        }
        if (Math.abs(deeper.rwPrime - shallower.rwPrime) > 6.1) {
          failures.push(
            `gap ${boardThicknessMm}/${fillThicknessMm}: cavity perturbation caused a field R'w jump larger than 6.1 dB (${shallower.rwPrime} -> ${deeper.rwPrime})`
          );
        }
      }
    }

    for (const boardThicknessMm of boardThicknesses) {
      for (const gapThicknessMm of gapThicknesses) {
        const lighterFill = grid.get(`${boardThicknessMm}-${gapThicknessMm}-50`)!;
        const heavierFill = grid.get(`${boardThicknessMm}-${gapThicknessMm}-75`)!;

        if (heavierFill.rw < lighterFill.rw - 1.1) {
          failures.push(
            `fill ${boardThicknessMm}/${gapThicknessMm}: thicker fill should not reduce lab Rw by more than 1.1 dB (${lighterFill.rw} -> ${heavierFill.rw})`
          );
        }
        if (heavierFill.dnTw < lighterFill.dnTw - 1.1) {
          failures.push(
            `fill ${boardThicknessMm}/${gapThicknessMm}: thicker fill should not reduce DnT,w by more than 1.1 dB (${lighterFill.dnTw} -> ${heavierFill.dnTw})`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps exact impact-source K/V continuation formulas coherent across a property sweep", () => {
    const kValues = [0, 2, 4] as const;
    const volumeValues = [20, 50, 100] as const;
    const requested: readonly RequestedOutputId[] = ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"];
    const failures: string[] = [];
    const grid = new Map<string, { lPrimeNTw: number; lPrimeNW: number }>();

    for (const kDb of kValues) {
      for (const receivingRoomVolumeM3 of volumeValues) {
        const key = `${kDb}-${receivingRoomVolumeM3}`;
        const result = calculateImpactOnly([layer("air_gap", 90)], {
          exactImpactSource: EXACT_IMPACT_SOURCE_19,
          impactFieldContext: {
            fieldKDb: kDb,
            receivingRoomVolumeM3
          },
          targetOutputs: requested
        });

        expectTargetPartition(result.supportedTargetOutputs, requested, requested, `${key} impact`, failures);
        requested.forEach((output) => {
          const value =
            output === "Ln,w"
              ? result.impact?.LnW
              : output === "CI"
                ? result.impact?.CI
                : output === "CI,50-2500"
                  ? result.impact?.CI50_2500
                  : output === "Ln,w+CI"
                    ? result.impact?.LnWPlusCI
                    : output === "L'n,w"
                      ? result.impact?.LPrimeNW
                      : output === "L'nT,w"
                        ? result.impact?.LPrimeNTw
                        : result.impact?.LPrimeNT50;
          expectFinite(value, `${key} ${output}`, failures);
        });

        const expectedLnWPlusCI = ksRound1((result.impact?.LnW ?? 0) + (result.impact?.CI ?? 0));
        const expectedLPrimeNW = ksRound1((result.impact?.LnW ?? 0) + kDb);
        const expectedLPrimeNTw = ksRound1(expectedLPrimeNW + 10 * Math.log10(31.3 / receivingRoomVolumeM3));
        const expectedLPrimeNT50 = ksRound1(expectedLPrimeNTw + (result.impact?.CI50_2500 ?? 0));

        if (result.impact?.LnWPlusCI !== expectedLnWPlusCI) {
          failures.push(`${key}: expected Ln,w+CI ${expectedLnWPlusCI}, got ${result.impact?.LnWPlusCI ?? "none"}`);
        }
        if (result.impact?.LPrimeNW !== expectedLPrimeNW) {
          failures.push(`${key}: expected L'n,w ${expectedLPrimeNW}, got ${result.impact?.LPrimeNW ?? "none"}`);
        }
        if (result.impact?.LPrimeNTw !== expectedLPrimeNTw) {
          failures.push(`${key}: expected L'nT,w ${expectedLPrimeNTw}, got ${result.impact?.LPrimeNTw ?? "none"}`);
        }
        if (result.impact?.LPrimeNT50 !== expectedLPrimeNT50) {
          failures.push(`${key}: expected L'nT,50 ${expectedLPrimeNT50}, got ${result.impact?.LPrimeNT50 ?? "none"}`);
        }

        grid.set(key, {
          lPrimeNTw: result.impact?.LPrimeNTw ?? Number.NaN,
          lPrimeNW: result.impact?.LPrimeNW ?? Number.NaN
        });
      }
    }

    for (const receivingRoomVolumeM3 of volumeValues) {
      for (let index = 1; index < kValues.length; index += 1) {
        const previous = grid.get(`${kValues[index - 1]}-${receivingRoomVolumeM3}`)!;
        const current = grid.get(`${kValues[index]}-${receivingRoomVolumeM3}`)!;
        const deltaK = kValues[index] - kValues[index - 1];

        if (current.lPrimeNW !== ksRound1(previous.lPrimeNW + deltaK)) {
          failures.push(
            `K sweep ${receivingRoomVolumeM3}: expected L'n,w step ${ksRound1(previous.lPrimeNW + deltaK)}, got ${current.lPrimeNW}`
          );
        }
        if (current.lPrimeNTw !== ksRound1(previous.lPrimeNTw + deltaK)) {
          failures.push(
            `K sweep ${receivingRoomVolumeM3}: expected L'nT,w step ${ksRound1(previous.lPrimeNTw + deltaK)}, got ${current.lPrimeNTw}`
          );
        }
      }
    }

    for (const kDb of kValues) {
      for (let index = 1; index < volumeValues.length; index += 1) {
        const smallerRoom = grid.get(`${kDb}-${volumeValues[index - 1]}`)!;
        const largerRoom = grid.get(`${kDb}-${volumeValues[index]}`)!;

        if (largerRoom.lPrimeNTw > smallerRoom.lPrimeNTw) {
          failures.push(
            `V sweep ${kDb}: expected larger rooms to not increase L'nT,w (${smallerRoom.lPrimeNTw} -> ${largerRoom.lPrimeNTw})`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps explicit heavy-reference DeltaLw sweeps exact and fail-closed on field-only requests", () => {
    const deltaValues = [10, 15, 20, 25, 30, 35] as const;
    const requested: readonly RequestedOutputId[] = ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"];
    const failures: string[] = [];
    let previousLnW = Number.POSITIVE_INFINITY;

    for (const deltaLwDb of deltaValues) {
      const result = calculateImpactOnly([], {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
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
            dynamicStiffnessMNm3: 20,
            thicknessMm: 10
          },
          floatingScreed: {
            materialClass: "generic_screed",
            thicknessMm: 50,
            densityKgM3: 2000
          },
          floorCovering: {
            mode: "delta_lw_catalog",
            deltaLwDb
          }
        },
        targetOutputs: requested
      });

      expectTargetPartition(result.supportedTargetOutputs, requested, ["Ln,w", "DeltaLw"], `delta ${deltaLwDb}`, failures);
      expectFinite(result.impact?.LnW, `delta ${deltaLwDb} Ln,w`, failures);
      expectFinite(result.impact?.DeltaLw, `delta ${deltaLwDb} DeltaLw`, failures);

      const expectedLnW = ksRound1(78 - deltaLwDb);
      if (result.impact?.LnW !== expectedLnW) {
        failures.push(`delta ${deltaLwDb}: expected Ln,w ${expectedLnW}, got ${result.impact?.LnW ?? "none"}`);
      }
      if (result.impact?.DeltaLw !== deltaLwDb) {
        failures.push(`delta ${deltaLwDb}: expected DeltaLw ${deltaLwDb}, got ${result.impact?.DeltaLw ?? "none"}`);
      }
      if (result.impact?.bareReferenceLnW !== 78) {
        failures.push(`delta ${deltaLwDb}: expected heavy reference Ln,w 78, got ${result.impact?.bareReferenceLnW ?? "none"}`);
      }
      if (result.impact?.metricBasis?.LnW !== "predictor_explicit_delta_heavy_reference_derived") {
        failures.push(`delta ${deltaLwDb}: unexpected Ln,w basis ${result.impact?.metricBasis?.LnW ?? "none"}`);
      }
      if (result.impact?.metricBasis?.DeltaLw !== "predictor_explicit_delta_user_input") {
        failures.push(`delta ${deltaLwDb}: unexpected DeltaLw basis ${result.impact?.metricBasis?.DeltaLw ?? "none"}`);
      }
      if (typeof result.impact?.LPrimeNW === "number" || typeof result.impact?.LPrimeNTw === "number") {
        failures.push(`delta ${deltaLwDb}: explicit heavy-reference lane should not fabricate field impact outputs`);
      }
      if (result.impact?.LnW !== undefined && result.impact.LnW >= previousLnW) {
        failures.push(`delta ${deltaLwDb}: higher DeltaLw should reduce derived Ln,w (${previousLnW} -> ${result.impact.LnW})`);
      }

      previousLnW = result.impact?.LnW ?? previousLnW;
    }

    expect(failures).toEqual([]);
  });
});
