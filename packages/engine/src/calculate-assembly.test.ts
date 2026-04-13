import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

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

describe("calculateAssembly", () => {
  it("builds a screening result from seed materials", () => {
    const result = calculateAssembly([
      { materialId: "concrete", thicknessMm: 100 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);

    expect(result.ok).toBe(true);
    expect(result.metrics.totalThicknessMm).toBe(112.5);
    expect(result.metrics.surfaceMassKgM2).toBeGreaterThan(200);
    expect(result.metrics.estimatedRwDb).toBe(53.6);
    expect(result.metrics.method).toBe("screening_mass_law_curve_seed_v3");
    expect(result.metrics.estimatedStc).toBeGreaterThan(0);
    expect(result.metrics.estimatedCDb).toBeTypeOf("number");
    expect(result.metrics.estimatedCtrDb).toBeTypeOf("number");
    expect(result.ratings.iso717.composite).toContain(String(result.ratings.iso717.Rw));
    expect(result.curve.frequenciesHz).toHaveLength(result.curve.transmissionLossDb.length);
  });

  it("keeps lightweight cavity systems conservative", () => {
    const singleLeaf = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: 25 }]);

    const splitLeaf = calculateAssembly([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);

    expect(singleLeaf.metrics.estimatedRwDb).toBe(29.2);
    expect(splitLeaf.metrics.estimatedRwDb).toBe(26.3);
    expect(splitLeaf.warnings).toContain(
      "Cavity assemblies are currently screened with a conservative local heuristic."
    );
    expect(splitLeaf.ratings.astmE413.STC).toBeGreaterThan(0);
  });

  it("keeps symmetric lightweight cavity board systems close to the upstream screening corridor", () => {
    const singleBoardEmpty = calculateAssembly([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);
    const doubleBoardEmpty = calculateAssembly([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 100 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);
    const doubleBoardFilled = calculateAssembly([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 60 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);
    const tripleBoardEmpty = calculateAssembly([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 92 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);
    const acousticSingleBoardEmpty = calculateAssembly([
      { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 15 }
    ]);
    const acousticTripleBoardFilled = calculateAssembly([
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 85 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
    ]);
    const diamondTripleBoardFilled = calculateAssembly([
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 85 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "diamond_board", thicknessMm: 12.5 }
    ]);

    expect(singleBoardEmpty.metrics.estimatedRwDb).toBe(25.6);
    expect(doubleBoardEmpty.metrics.estimatedRwDb).toBe(30.7);
    expect(doubleBoardFilled.metrics.estimatedRwDb).toBe(31);
    expect(tripleBoardEmpty.metrics.estimatedRwDb).toBe(33.5);
    expect(acousticSingleBoardEmpty.metrics.estimatedRwDb).toBe(27.8);
    expect(acousticTripleBoardFilled.metrics.estimatedRwDb).toBe(36.4);
    expect(diamondTripleBoardFilled.metrics.estimatedRwDb).toBe(36.4);
  });

  it("keeps nominal firestop board mass aligned with the upstream screening lane", () => {
    const firestopSingleBoardEmpty = calculateAssembly([
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "firestop_board", thicknessMm: 15 }
    ]);
    const firestopThinSingleBoardEmpty = calculateAssembly([
      { materialId: "firestop_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "firestop_board", thicknessMm: 12.5 }
    ]);

    expect(firestopSingleBoardEmpty.metrics.totalThicknessMm).toBe(80);
    expect(firestopSingleBoardEmpty.metrics.surfaceMassKgM2).toBe(26.2);
    expect(firestopSingleBoardEmpty.metrics.estimatedRwDb).toBe(26.7);
    expect(firestopThinSingleBoardEmpty.metrics.totalThicknessMm).toBe(75);
    expect(firestopThinSingleBoardEmpty.metrics.surfaceMassKgM2).toBe(26.2);
    expect(firestopThinSingleBoardEmpty.metrics.estimatedRwDb).toBe(26.7);
  });

  it("supports upstream enhanced board profiles without collapsing them onto firestop", () => {
    const diamondBoard = calculateAssembly([
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 }
    ]);
    const securityBoard = calculateAssembly([
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 }
    ]);
    const silentBoard = calculateAssembly([
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "silentboard", thicknessMm: 12.5 }
    ]);

    expect(diamondBoard.metrics.surfaceMassKgM2).toBe(25.6);
    expect(securityBoard.metrics.surfaceMassKgM2).toBe(18.4);
    expect(silentBoard.metrics.surfaceMassKgM2).toBe(36.8);
  });

  it("keeps security board and silentboard cavity systems close to the upstream board-profile corridor", () => {
    const securitySingleBoardEmpty = calculateAssembly([
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 }
    ]);
    const securityDoubleBoardFilled = calculateAssembly([
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 14 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "security_board", thicknessMm: 12.5 }
    ]);
    const silentSingleBoardEmpty = calculateAssembly([
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "silentboard", thicknessMm: 12.5 }
    ]);
    const silentDoubleBoardFilled = calculateAssembly([
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 14 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "silentboard", thicknessMm: 12.5 }
    ]);

    expect(securitySingleBoardEmpty.metrics.estimatedRwDb).toBe(24.5);
    expect(securityDoubleBoardFilled.metrics.estimatedRwDb).toBe(30.1);
    expect(silentSingleBoardEmpty.metrics.estimatedRwDb).toBe(29.6);
    expect(silentDoubleBoardFilled.metrics.estimatedRwDb).toBe(35.9);
  });

  it("keeps mixed silentboard split-cavity screening close to the upstream corridor", () => {
    const silentboardGypsumMixed = calculateAssembly([
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 73 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 73 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ]);
    const silentboardHeavyMixed = calculateAssembly([
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 73 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 73 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ]);

    expect(silentboardGypsumMixed.metrics.surfaceMassKgM2).toBe(51.2);
    expect(silentboardGypsumMixed.metrics.estimatedRwDb).toBe(31.9);
    expect(silentboardHeavyMixed.metrics.surfaceMassKgM2).toBe(59);
    expect(silentboardHeavyMixed.metrics.estimatedRwDb).toBe(33.1);
  });

  it("keeps deeper lightly filled double-board framed holdouts inside the published W112 corridor", () => {
    const airborneContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;

    const w112_50_100_40 = calculateAssembly(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 60 },
        { materialId: "glasswool", thicknessMm: 40 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      { airborneContext, calculator: "dynamic", targetOutputs: ["Rw"] }
    );
    const w112_75_125_60 = calculateAssembly(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 65 },
        { materialId: "glasswool", thicknessMm: 60 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      { airborneContext, calculator: "dynamic", targetOutputs: ["Rw"] }
    );
    const w112_100_150_80 = calculateAssembly(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 70 },
        { materialId: "glasswool", thicknessMm: 80 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      { airborneContext, calculator: "dynamic", targetOutputs: ["Rw"] }
    );

    expect(w112_50_100_40.ratings.iso717.Rw).toBe(50);
    expect(w112_75_125_60.ratings.iso717.Rw).toBe(51);
    expect(w112_100_150_80.ratings.iso717.Rw).toBe(52);
    expect(w112_100_150_80.dynamicAirborneTrace?.notes.some((note: string) => /deep lightly filled single-cavity double-board trim/i.test(note))).toBe(true);
  });

  it("keeps compact W111 fills and high-spec W113 acoustic fills on their published lab corridor", () => {
    const airborneContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;

    const w111_50_75_40 = calculateAssembly(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 35 },
        { materialId: "glasswool", thicknessMm: 40 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      { airborneContext, calculator: "dynamic", targetOutputs: ["Rw"] }
    );
    const w113_75_150_60 = calculateAssembly(
      [
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "glasswool", thicknessMm: 60 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
      ],
      { airborneContext, calculator: "dynamic", targetOutputs: ["Rw"] }
    );

    expect(w111_50_75_40.ratings.iso717.Rw).toBe(42);
    expect(w113_75_150_60.ratings.iso717.Rw).toBe(66);
    expect(w111_50_75_40.dynamicAirborneTrace?.notes.some((note: string) => /compact filled single-board lift/i.test(note))).toBe(true);
    expect(w113_75_150_60.dynamicAirborneTrace?.notes.some((note: string) => /high-spec acoustic triple-board lift/i.test(note))).toBe(true);
  });

  it("keeps deeper high-fill single-board framed field holdouts inside the local field corridor", () => {
    const airborneContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;

    const w111_100_125_80 = calculateAssembly(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 45 },
        { materialId: "glasswool", thicknessMm: 80 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      { airborneContext, calculator: "dynamic", targetOutputs: ["R'w", "DnT,w", "DnT,A"] }
    );

    expect(w111_100_125_80.ratings.field?.DnTA).toBe(38);
    expect(
      w111_100_125_80.warnings.some((warning: string) => /high-fill single-board stud field lift/i.test(warning))
    ).toBe(true);
  });

  it("keeps explicit framed micro-gap high-fill cavities close to their fill-only equivalents", () => {
    const cases = [
      { board: "diamond_board", fill: "rockwool", gap: 10, thicknessMm: 12.5, totalFillMm: 100 },
      { board: "fire_board", fill: "rockwool", gap: 12, thicknessMm: 12.5, totalFillMm: 100 },
      { board: "gypsum", fill: "glasswool", gap: 12, thicknessMm: 12.5, totalFillMm: 125 }
    ] as const;
    const contexts = [
      {
        contextMode: "element_lab",
        connectionType: "line_connection",
        studType: "light_steel_stud",
        studSpacingMm: 600,
        airtightness: "good"
      },
      {
        contextMode: "field_between_rooms",
        connectionType: "line_connection",
        studType: "light_steel_stud",
        studSpacingMm: 600,
        airtightness: "good",
        perimeterSeal: "good",
        penetrationState: "none",
        junctionQuality: "good",
        panelWidthMm: 2800,
        panelHeightMm: 2600,
        receivingRoomVolumeM3: 34,
        receivingRoomRt60S: 0.5
      }
    ] as const;
    let appliedGuardCount = 0;

    for (const airborneContext of contexts) {
      for (const entry of cases) {
        const microGap = calculateAssembly(
          [
            { materialId: entry.board, thicknessMm: entry.thicknessMm },
            { materialId: "air_gap", thicknessMm: entry.gap },
            { materialId: entry.fill, thicknessMm: entry.totalFillMm - entry.gap },
            { materialId: entry.board, thicknessMm: entry.thicknessMm }
          ],
          {
            airborneContext,
            calculator: "dynamic",
            targetOutputs:
              airborneContext.contextMode === "field_between_rooms"
                ? ["R'w", "DnT,w", "DnT,A"]
                : ["Rw"]
          }
        );
        const fillOnly = calculateAssembly(
          [
            { materialId: entry.board, thicknessMm: entry.thicknessMm },
            { materialId: entry.fill, thicknessMm: entry.totalFillMm },
            { materialId: entry.board, thicknessMm: entry.thicknessMm }
          ],
          {
            airborneContext,
            calculator: "dynamic",
            targetOutputs:
              airborneContext.contextMode === "field_between_rooms"
                ? ["R'w", "DnT,w", "DnT,A"]
                : ["Rw"]
          }
        );

        const microMetric =
          airborneContext.contextMode === "field_between_rooms"
            ? microGap.ratings.iso717.RwPrime
            : microGap.ratings.iso717.Rw;
        const fillMetric =
          airborneContext.contextMode === "field_between_rooms"
            ? fillOnly.ratings.iso717.RwPrime
            : fillOnly.ratings.iso717.Rw;
        const toleranceDb = airborneContext.contextMode === "field_between_rooms" ? 3 : 2;

        expect(Math.abs(microMetric - fillMetric)).toBeLessThanOrEqual(toleranceDb);

        if (airborneContext.contextMode === "field_between_rooms") {
          expect(
            Math.abs((microGap.ratings.field?.DnTw ?? 0) - (fillOnly.ratings.field?.DnTw ?? 0))
          ).toBeLessThanOrEqual(3);
        }

        if (microGap.warnings.some((warning: string) => /fill-only equivalent field corridor/i.test(warning))) {
          appliedGuardCount += 1;
        }
      }
    }

    expect(appliedGuardCount).toBeGreaterThan(0);
  });

  it("keeps premium board face reinforcement monotonic in framed lab and field lanes", () => {
    const labContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const fieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const baseLayers = [
      { materialId: "diamond_board", thicknessMm: 15 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
      { materialId: "firestop_board", thicknessMm: 15 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum", thicknessMm: 18 }
    ] as const;
    const reinforcedLayers = [
      { materialId: "silentboard", thicknessMm: 18 },
      ...baseLayers
    ] as const;

    const baseLab = calculateAssembly(baseLayers, { airborneContext: labContext, calculator: "dynamic", targetOutputs: ["Rw"] });
    const reinforcedLab = calculateAssembly(reinforcedLayers, {
      airborneContext: labContext,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const baseField = calculateAssembly(baseLayers, {
      airborneContext: fieldContext,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w", "DnT,A"]
    });
    const reinforcedField = calculateAssembly(reinforcedLayers, {
      airborneContext: fieldContext,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w", "DnT,A"]
    });

    expect(baseLab.ratings.iso717.Rw).toBe(44);
    expect(reinforcedLab.ratings.iso717.Rw).toBe(44);
    expect(reinforcedLab.ratings.iso717.Rw).toBeGreaterThanOrEqual(baseLab.ratings.iso717.Rw);
    expect(baseField.ratings.iso717.RwPrime).toBe(35);
    expect(reinforcedField.ratings.iso717.RwPrime).toBe(35);
    expect(baseField.ratings.field?.DnTA).toBe(37.7);
    expect(reinforcedField.ratings.field?.DnTA).toBe(38.2);
    expect(reinforcedField.ratings.field?.DnTA).toBeGreaterThanOrEqual(baseField.ratings.field?.DnTA ?? -Infinity);
    expect(
      reinforcedLab.dynamicAirborneTrace?.notes.some((note: string) => /target Rw 44\.0 dB/i.test(note))
    ).toBe(true);
  });

  it("keeps shallow single-board framed reinforcement monotonic under one-face board additions", () => {
    const labContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const fieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const baseLayers = [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ] as const;
    const gypsumReinforcedLayers = [
      { materialId: "gypsum", thicknessMm: 12.5 },
      ...baseLayers
    ] as const;
    const diamondReinforcedLayers = [
      { materialId: "diamond_board", thicknessMm: 15 },
      ...baseLayers
    ] as const;

    const baseLab = calculateAssembly(baseLayers, { airborneContext: labContext, calculator: "dynamic", targetOutputs: ["Rw"] });
    const gypsumReinforcedLab = calculateAssembly(gypsumReinforcedLayers, {
      airborneContext: labContext,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const diamondReinforcedLab = calculateAssembly(diamondReinforcedLayers, {
      airborneContext: labContext,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const baseField = calculateAssembly(baseLayers, { airborneContext: fieldContext, calculator: "dynamic" });
    const gypsumReinforcedField = calculateAssembly(gypsumReinforcedLayers, { airborneContext: fieldContext, calculator: "dynamic" });
    const diamondReinforcedField = calculateAssembly(diamondReinforcedLayers, { airborneContext: fieldContext, calculator: "dynamic" });

    expect(baseLab.ratings.iso717.Rw).toBe(35);
    expect(gypsumReinforcedLab.ratings.iso717.Rw).toBe(35);
    expect(diamondReinforcedLab.ratings.iso717.Rw).toBe(35);
    expect(gypsumReinforcedLab.ratings.iso717.Rw).toBeGreaterThanOrEqual(baseLab.ratings.iso717.Rw);
    expect(diamondReinforcedLab.ratings.iso717.Rw).toBeGreaterThanOrEqual(baseLab.ratings.iso717.Rw);
    expect(baseField.ratings.field?.DnTA).toBe(27.2);
    expect(gypsumReinforcedField.ratings.field?.DnTA).toBe(27.5);
    expect(diamondReinforcedField.ratings.field?.DnTA).toBe(27.6);
    expect(gypsumReinforcedField.ratings.field?.DnTA).toBeGreaterThanOrEqual(baseField.ratings.field?.DnTA ?? -Infinity);
    expect(diamondReinforcedField.ratings.field?.DnTA).toBeGreaterThanOrEqual(baseField.ratings.field?.DnTA ?? -Infinity);
    expect(
      gypsumReinforcedLab.dynamicAirborneTrace?.notes.some((note: string) => /framed reinforcement monotonic floor/i.test(note))
    ).toBe(true);
    expect(
      diamondReinforcedLab.dynamicAirborneTrace?.notes.some((note: string) => /framed reinforcement monotonic floor/i.test(note))
    ).toBe(true);
  });

  it("keeps split-cavity premium framed reinforcement monotonic on the lab side", () => {
    const labContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const baseLayers = [
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 45 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 45 },
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "silentboard", thicknessMm: 15 },
      { materialId: "gypsum", thicknessMm: 18 }
    ] as const;
    const reinforcedLayers = [
      { materialId: "diamond_board", thicknessMm: 12.5 },
      ...baseLayers
    ] as const;

    const base = calculateAssembly(baseLayers, {
      airborneContext: labContext,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const reinforced = calculateAssembly(reinforcedLayers, {
      airborneContext: labContext,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(base.ratings.iso717.Rw).toBe(68);
    expect(reinforced.ratings.iso717.Rw).toBe(68);
    expect(reinforced.ratings.iso717.Rw).toBeGreaterThanOrEqual(base.ratings.iso717.Rw);
    expect(
      reinforced.dynamicAirborneTrace?.notes.some((note: string) => /split-cavity framing/i.test(note))
    ).toBe(true);
    expect(
      reinforced.dynamicAirborneTrace?.notes.some((note: string) => /framed reinforcement monotonic floor/i.test(note))
    ).toBe(true);
  });

  it("keeps mixed premium split-cavity framed walls close to the seeded upstream corridor", () => {
    const labContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const fieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const underReadBeforeFixLayers = [
      { materialId: "diamond_board", thicknessMm: 15 },
      { materialId: "air_gap", thicknessMm: 25 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "air_gap", thicknessMm: 25 },
      { materialId: "silentboard", thicknessMm: 12.5 },
      { materialId: "silentboard", thicknessMm: 12.5 }
    ] as const;
    const overReadBeforeFixLayers = [
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "fire_board", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "diamond_board", thicknessMm: 15 }
    ] as const;

    const underReadLab = calculateAssembly(underReadBeforeFixLayers, {
      calculator: "dynamic",
      airborneContext: labContext,
      targetOutputs: ["Rw"]
    });
    const underReadField = calculateAssembly(underReadBeforeFixLayers, {
      calculator: "dynamic",
      airborneContext: fieldContext
    });
    const overReadLab = calculateAssembly(overReadBeforeFixLayers, {
      calculator: "dynamic",
      airborneContext: labContext,
      targetOutputs: ["Rw"]
    });
    const overReadField = calculateAssembly(overReadBeforeFixLayers, {
      calculator: "dynamic",
      airborneContext: fieldContext
    });

    expect(underReadLab.ratings.iso717.Rw).toBe(51);
    expect(underReadField.ratings.iso717.RwPrime).toBe(48);
    expect(underReadField.ratings.field?.DnTw).toBe(49);
    expect(overReadLab.ratings.iso717.Rw).toBe(49);
    expect(overReadField.ratings.iso717.RwPrime).toBe(47);
    expect(overReadField.ratings.field?.DnTw).toBe(48);
    expect(
      underReadField.dynamicAirborneTrace?.notes.some((note: string) => /premium mixed-board split-cavity lift/i.test(note))
    ).toBe(true);
    expect(
      overReadField.dynamicAirborneTrace?.notes.some((note: string) => /asymmetrical premium split-cavity trim/i.test(note))
    ).toBe(true);
    expect(
      underReadField.warnings.some((warning: string) => /mixed premium split-cavity field lift/i.test(warning))
    ).toBe(true);
    expect(
      overReadField.warnings.some((warning: string) => /mixed premium split-cavity field lift/i.test(warning))
    ).toBe(true);
  });

  it("keeps premium single-board framed walls close to the upstream empty and filled corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const emptyPremiumLayers = [
      { materialId: "silentboard", thicknessMm: 18 },
      { materialId: "air_gap", thicknessMm: 42 },
      { materialId: "gypsum", thicknessMm: 15 }
    ] as const;
    const filledPremiumLayers = [
      { materialId: "silentboard", thicknessMm: 18 },
      { materialId: "rockwool", thicknessMm: 60 },
      { materialId: "diamond_board", thicknessMm: 18 }
    ] as const;

    const emptySteelLab = calculateAssembly(emptyPremiumLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const emptyResilientLab = calculateAssembly(emptyPremiumLayers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const emptySteelField = calculateAssembly(emptyPremiumLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const emptyResilientField = calculateAssembly(emptyPremiumLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });
    const filledSteelLab = calculateAssembly(filledPremiumLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const filledSteelField = calculateAssembly(filledPremiumLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const filledResilientField = calculateAssembly(filledPremiumLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });

    expect(emptySteelLab.ratings.iso717.Rw).toBe(44);
    expect(emptyResilientLab.ratings.iso717.Rw).toBe(45);
    expect(emptySteelField.ratings.iso717.RwPrime).toBe(35);
    expect(emptyResilientField.ratings.iso717.RwPrime).toBe(43);
    expect(filledSteelLab.ratings.iso717.Rw).toBe(50);
    expect(filledSteelField.ratings.iso717.RwPrime).toBe(39);
    expect(filledResilientField.ratings.iso717.RwPrime).toBe(52);
    expect(
      emptySteelField.dynamicAirborneTrace?.notes.some((note: string) => /premium single-board framed lift/i.test(note))
    ).toBe(true);
    expect(
      filledResilientField.dynamicAirborneTrace?.notes.some((note: string) => /resilient premium single-board field lift/i.test(note))
    ).toBe(true);
    expect(
      emptySteelField.warnings.some((warning: string) => /premium single-board field trim/i.test(warning))
    ).toBe(true);
    expect(
      filledResilientField.warnings.some((warning: string) => /resilient premium single-board field lift/i.test(warning))
    ).toBe(true);
  });

  it("keeps low-mass empty enhanced single-board framed walls close to the upstream fire and diamond corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const diamondFireEmptyLayers = [
      { materialId: "diamond_board", thicknessMm: 18 },
      { materialId: "air_gap", thicknessMm: 42 },
      { materialId: "fire_board", thicknessMm: 15 }
    ] as const;
    const fireGypsumEmptyLayers = [
      { materialId: "fire_board", thicknessMm: 15 },
      { materialId: "air_gap", thicknessMm: 42 },
      { materialId: "gypsum", thicknessMm: 15 }
    ] as const;

    const diamondFireSteelLab = calculateAssembly(diamondFireEmptyLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const diamondFireResilientLab = calculateAssembly(diamondFireEmptyLayers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const diamondFireSteelField = calculateAssembly(diamondFireEmptyLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const diamondFireResilientField = calculateAssembly(diamondFireEmptyLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });
    const fireGypsumSteelLab = calculateAssembly(fireGypsumEmptyLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const fireGypsumResilientLab = calculateAssembly(fireGypsumEmptyLayers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const fireGypsumSteelField = calculateAssembly(fireGypsumEmptyLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const fireGypsumResilientField = calculateAssembly(fireGypsumEmptyLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });

    expect(diamondFireSteelLab.ratings.iso717.Rw).toBe(43);
    expect(diamondFireResilientLab.ratings.iso717.Rw).toBe(44);
    expect(diamondFireSteelField.ratings.field?.DnTA).toBe(33.3);
    expect(diamondFireResilientField.ratings.field?.DnTA).toBe(42.5);
    expect(fireGypsumSteelLab.ratings.iso717.Rw).toBe(41);
    expect(fireGypsumResilientLab.ratings.iso717.Rw).toBe(42);
    expect(fireGypsumSteelField.ratings.field?.DnTA).toBe(31.1);
    expect(fireGypsumResilientField.ratings.field?.DnTA).toBe(40.3);
    expect(
      diamondFireSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /low-mass empty premium single-board lift/i.test(note))
    ).toBe(true);
    expect(
      diamondFireSteelField.warnings.some((warning: string) => /low-mass premium single-board field trim/i.test(warning))
    ).toBe(true);
    expect(
      fireGypsumResilientField.warnings.some((warning: string) => /resilient low-mass premium single-board field lift/i.test(warning))
    ).toBe(true);
  });

  it("keeps low-mass filled enhanced single-board framed walls close to the upstream fire, diamond and silentboard corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const diamondFireFilledLayers = [
      { materialId: "diamond_board", thicknessMm: 18 },
      { materialId: "rockwool", thicknessMm: 42 },
      { materialId: "fire_board", thicknessMm: 15 }
    ] as const;
    const acousticDiamondFilledLayers = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 60 },
      { materialId: "diamond_board", thicknessMm: 18 }
    ] as const;
    const acousticSilentFilledLayers = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 60 },
      { materialId: "silentboard", thicknessMm: 12.5 }
    ] as const;

    const diamondFireSteelLab = calculateAssembly(diamondFireFilledLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const diamondFireResilientLab = calculateAssembly(diamondFireFilledLayers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const diamondFireSteelField = calculateAssembly(diamondFireFilledLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const diamondFireResilientField = calculateAssembly(diamondFireFilledLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });
    const acousticDiamondSteelLab = calculateAssembly(acousticDiamondFilledLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const acousticDiamondResilientLab = calculateAssembly(acousticDiamondFilledLayers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const acousticDiamondSteelField = calculateAssembly(acousticDiamondFilledLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const acousticDiamondResilientField = calculateAssembly(acousticDiamondFilledLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });
    const acousticSilentSteelLab = calculateAssembly(acousticSilentFilledLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const acousticSilentResilientLab = calculateAssembly(acousticSilentFilledLayers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const acousticSilentSteelField = calculateAssembly(acousticSilentFilledLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const acousticSilentResilientField = calculateAssembly(acousticSilentFilledLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });

    expect(diamondFireSteelLab.ratings.iso717.Rw).toBe(46);
    expect(diamondFireResilientLab.ratings.iso717.Rw).toBe(51);
    expect(diamondFireSteelField.ratings.field?.DnTA).toBe(34.9);
    expect(diamondFireResilientField.ratings.field?.DnTA).toBe(49.2);
    expect(acousticDiamondSteelLab.ratings.iso717.Rw).toBe(48);
    expect(acousticDiamondResilientLab.ratings.iso717.Rw).toBe(52);
    expect(acousticDiamondSteelField.ratings.field?.DnTA).toBe(37.3);
    expect(acousticDiamondResilientField.ratings.field?.DnTA).toBe(50.8);
    expect(acousticSilentSteelLab.ratings.iso717.Rw).toBe(49);
    expect(acousticSilentResilientLab.ratings.iso717.Rw).toBe(52);
    expect(acousticSilentSteelField.ratings.field?.DnTA).toBe(37.3);
    expect(acousticSilentResilientField.ratings.field?.DnTA).toBe(50.3);
    expect(
      diamondFireSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      diamondFireResilientLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      diamondFireSteelField.warnings.some((warning: string) => /mixed enhanced filled single-board field corridor/i.test(warning))
    ).toBe(true);
    expect(
      diamondFireResilientField.warnings.some((warning: string) => /mixed enhanced filled single-board field corridor/i.test(warning))
    ).toBe(true);
    expect(
      acousticDiamondSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      acousticDiamondSteelField.warnings.some((warning: string) => /low-mass filled premium single-board field trim/i.test(warning))
    ).toBe(true);
    expect(
      acousticDiamondResilientLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      acousticSilentSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      acousticSilentSteelField.warnings.some((warning: string) => /low-mass filled premium single-board/i.test(warning))
    ).toBe(true);
    expect(
      acousticSilentResilientLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
  });

  it("keeps silentboard-heavy filled single-board framed walls close to the upstream mixed enhanced corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: { resilientFieldDnTA: 50.1, resilientLabRw: 51, steelFieldDnTA: 34.6, steelLabRw: 46 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 35 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientFieldDnTA: 49.6, resilientLabRw: 50, steelFieldDnTA: 36.6, steelLabRw: 47 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientFieldDnTA: 51.3, resilientLabRw: 51, steelFieldDnTA: 37, steelLabRw: 47 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientFieldDnTA: 51.8, resilientLabRw: 53, steelFieldDnTA: 38.2, steelLabRw: 49 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientFieldDnTA: 50.1, resilientLabRw: 51, steelFieldDnTA: 34.6, steelLabRw: 46 },
        layers: [
          { materialId: "silentboard", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 35 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: { resilientFieldDnTA: 49.6, resilientLabRw: 50, steelFieldDnTA: 36.6, steelLabRw: 47 },
        layers: [
          { materialId: "silentboard", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: { resilientFieldDnTA: 51.3, resilientLabRw: 51, steelFieldDnTA: 37, steelLabRw: 47 },
        layers: [
          { materialId: "silentboard", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: { resilientFieldDnTA: 51.8, resilientLabRw: 53, steelFieldDnTA: 38.2, steelLabRw: 49 },
        layers: [
          { materialId: "silentboard", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
    ] as const;

    for (const testCase of cases) {
      const steelLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelLab.ratings.iso717.Rw).toBe(testCase.expected.steelLabRw);
      expect(resilientLab.ratings.iso717.Rw).toBe(testCase.expected.resilientLabRw);
      expect(steelField.ratings.field?.DnTA).toBe(testCase.expected.steelFieldDnTA);
      expect(resilientField.ratings.field?.DnTA).toBe(testCase.expected.resilientFieldDnTA);
    }

    const representativeSteelLab = calculateAssembly(cases[1].layers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const representativeResilientField = calculateAssembly(cases[1].layers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });

    expect(
      representativeSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      representativeResilientField.warnings.some((warning: string) => /silentboard-heavy filled premium/i.test(warning))
    ).toBe(true);
  });

  it("keeps symmetric enhanced filled single-board framed walls on the upstream lab and field corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: { resilientLabRw: 51, resilientRwPrime: 48, steelLabRw: 47, steelRwPrime: 34 },
        layers: [
          { materialId: "silentboard", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 51, resilientRwPrime: 49, steelLabRw: 49, steelRwPrime: 37 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: { resilientLabRw: 49, resilientRwPrime: 46, steelLabRw: 46, steelRwPrime: 33 },
        layers: [
          { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "acoustic_gypsum_board", thicknessMm: 15 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const steelLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelLab.ratings.iso717.Rw).toBe(testCase.expected.steelLabRw);
      expect(resilientLab.ratings.iso717.Rw).toBe(testCase.expected.resilientLabRw);
      expect(steelField.ratings.field?.RwPrime).toBe(testCase.expected.steelRwPrime);
      expect(resilientField.ratings.field?.RwPrime).toBe(testCase.expected.resilientRwPrime);
    }

    const representativeLab = calculateAssembly(cases[0].layers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const representativeField = calculateAssembly(cases[0].layers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });

    expect(
      representativeLab.dynamicAirborneTrace?.notes.some((note: string) => /symmetric enhanced filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      representativeField.warnings.some((warning: string) => /symmetric enhanced filled single-board field corridor/i.test(warning))
    ).toBe(true);
  });

  it("keeps mixed plain gypsum plus premium filled single-board framed walls on the upstream field template corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: {
          resilientFieldBaseRw: 45,
          labToleranceDb: 0,
          resilientFieldDnTA: 47.8,
          resilientFieldDnTw: 46,
          resilientFieldRwPrime: 45,
          resilientLabRw: 49,
          steelFieldBaseRw: 30,
          steelFieldDnTA: 33.8,
          steelFieldDnTw: 32,
          steelFieldRwPrime: 30,
          steelLabRw: 44
        },
        label: "gypsum + diamond 35",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 35 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: {
          resilientFieldBaseRw: 45,
          labToleranceDb: 0,
          resilientFieldDnTA: 47.5,
          resilientFieldDnTw: 46,
          resilientFieldRwPrime: 45,
          resilientLabRw: 47,
          steelFieldBaseRw: 32,
          steelFieldDnTA: 34.9,
          steelFieldDnTw: 34,
          steelFieldRwPrime: 33,
          steelLabRw: 44
        },
        label: "gypsum + silentboard 35",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 35 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: {
          resilientFieldBaseRw: 46,
          labToleranceDb: 0,
          resilientFieldDnTA: 48.2,
          resilientFieldDnTw: 47,
          resilientFieldRwPrime: 46,
          resilientLabRw: 49,
          steelFieldBaseRw: 32,
          steelFieldDnTA: 34.8,
          steelFieldDnTw: 34,
          steelFieldRwPrime: 32,
          steelLabRw: 46
        },
        label: "gypsum + diamond 42",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: {
          resilientFieldBaseRw: 45,
          labToleranceDb: 0,
          resilientFieldDnTA: 48.1,
          resilientFieldDnTw: 46,
          resilientFieldRwPrime: 45,
          resilientLabRw: 48,
          steelFieldBaseRw: 31,
          steelFieldDnTA: 34.4,
          steelFieldDnTw: 33,
          steelFieldRwPrime: 31,
          steelLabRw: 44
        },
        label: "gypsum + silentboard 42",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: {
          resilientFieldBaseRw: 47,
          labToleranceDb: 0,
          resilientFieldDnTA: 48.8,
          resilientFieldDnTw: 48,
          resilientFieldRwPrime: 47,
          resilientLabRw: 49,
          steelFieldBaseRw: 33,
          steelFieldDnTA: 35.7,
          steelFieldDnTw: 34,
          steelFieldRwPrime: 33,
          steelLabRw: 45
        },
        label: "gypsum + diamond 50",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: {
          resilientFieldBaseRw: 47,
          labToleranceDb: 0,
          resilientFieldDnTA: 48.5,
          resilientFieldDnTw: 48,
          resilientFieldRwPrime: 47,
          resilientLabRw: 50,
          steelFieldBaseRw: 32,
          steelFieldDnTA: 35.3,
          steelFieldDnTw: 33,
          steelFieldRwPrime: 32,
          steelLabRw: 45
        },
        label: "gypsum + silentboard 50",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: {
          resilientFieldBaseRw: 48,
          labToleranceDb: 0,
          resilientFieldDnTA: 49.4,
          resilientFieldDnTw: 49,
          resilientFieldRwPrime: 48,
          resilientLabRw: 51,
          steelFieldBaseRw: 34,
          steelFieldDnTA: 37.1,
          steelFieldDnTw: 35,
          steelFieldRwPrime: 34,
          steelLabRw: 47
        },
        label: "gypsum + diamond 60",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: {
          resilientFieldBaseRw: 47,
          labToleranceDb: 0,
          resilientFieldDnTA: 49.2,
          resilientFieldDnTw: 49,
          resilientFieldRwPrime: 47,
          resilientLabRw: 50,
          steelFieldBaseRw: 35,
          steelFieldDnTA: 36.8,
          steelFieldDnTw: 36,
          steelFieldRwPrime: 35,
          steelLabRw: 47
        },
        label: "gypsum + silentboard 60",
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const steelLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(Math.abs(steelLab.ratings.iso717.Rw - testCase.expected.steelLabRw)).toBeLessThanOrEqual(testCase.expected.labToleranceDb);
      expect(Math.abs(resilientLab.ratings.iso717.Rw - testCase.expected.resilientLabRw)).toBeLessThanOrEqual(testCase.expected.labToleranceDb);
      expect(steelField.airborneOverlay?.baseRwDb).toBe(testCase.expected.steelFieldBaseRw);
      expect(steelField.ratings.iso717.RwPrime).toBe(testCase.expected.steelFieldRwPrime);
      expect(steelField.ratings.field?.DnTw).toBe(testCase.expected.steelFieldDnTw);
      expect(steelField.ratings.field?.DnTA).toBe(testCase.expected.steelFieldDnTA);
      expect(resilientField.airborneOverlay?.baseRwDb).toBe(testCase.expected.resilientFieldBaseRw);
      expect(resilientField.ratings.iso717.RwPrime).toBe(testCase.expected.resilientFieldRwPrime);
      expect(resilientField.ratings.field?.DnTw).toBe(testCase.expected.resilientFieldDnTw);
      expect(resilientField.ratings.field?.DnTA).toBe(testCase.expected.resilientFieldDnTA);
    }

    const representativeSteelLab = calculateAssembly(cases[0].layers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const representativeSilentField = calculateAssembly(cases[1].layers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });

    expect(
      representativeSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed plain-gypsum \+ diamond filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      representativeSilentField.warnings.some((warning: string) => /mixed plain-gypsum \+ silentboard filled single-board field template/i.test(warning))
    ).toBe(true);
  });

  it("keeps mixed plain gypsum plus acoustic and fire filled single-board framed walls on the upstream lab and field corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: {
          resilientFieldBaseRw: 45,
          resilientFieldDnTA: 46.7,
          resilientFieldDnTw: 46,
          resilientFieldRwPrime: 45,
          resilientLabRw: 47,
          steelFieldBaseRw: 30,
          steelFieldDnTA: 33.2,
          steelFieldDnTw: 31,
          steelFieldRwPrime: 30,
          steelLabRw: 42
        },
        fill: 35,
        materialId: "acoustic_gypsum_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 45,
          resilientFieldDnTA: 47.3,
          resilientFieldDnTw: 46,
          resilientFieldRwPrime: 45,
          resilientLabRw: 47,
          steelFieldBaseRw: 32,
          steelFieldDnTA: 34.1,
          steelFieldDnTw: 34,
          steelFieldRwPrime: 32,
          steelLabRw: 45
        },
        fill: 42,
        materialId: "acoustic_gypsum_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 46,
          resilientFieldDnTA: 47.8,
          resilientFieldDnTw: 47,
          resilientFieldRwPrime: 46,
          resilientLabRw: 48,
          steelFieldBaseRw: 32,
          steelFieldDnTA: 34.9,
          steelFieldDnTw: 33,
          steelFieldRwPrime: 32,
          steelLabRw: 44
        },
        fill: 50,
        materialId: "acoustic_gypsum_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 47,
          resilientFieldDnTA: 47.4,
          resilientFieldDnTw: 48,
          resilientFieldRwPrime: 47,
          resilientLabRw: 50,
          steelFieldBaseRw: 34,
          steelFieldDnTA: 36.4,
          steelFieldDnTw: 35,
          steelFieldRwPrime: 34,
          steelLabRw: 45
        },
        fill: 60,
        materialId: "acoustic_gypsum_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 44,
          resilientFieldDnTA: 45,
          resilientFieldDnTw: 44,
          resilientFieldRwPrime: 43,
          resilientLabRw: 46,
          steelFieldBaseRw: 28,
          steelFieldDnTA: 30.4,
          steelFieldDnTw: 28,
          steelFieldRwPrime: 27,
          steelLabRw: 41
        },
        fill: 35,
        materialId: "fire_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 44,
          resilientFieldDnTA: 45.5,
          resilientFieldDnTw: 44,
          resilientFieldRwPrime: 43,
          resilientLabRw: 46,
          steelFieldBaseRw: 30,
          steelFieldDnTA: 32.3,
          steelFieldDnTw: 32,
          steelFieldRwPrime: 30,
          steelLabRw: 43
        },
        fill: 42,
        materialId: "fire_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 45,
          resilientFieldDnTA: 46.1,
          resilientFieldDnTw: 45,
          resilientFieldRwPrime: 44,
          resilientLabRw: 47,
          steelFieldBaseRw: 30,
          steelFieldDnTA: 32.2,
          steelFieldDnTw: 30,
          steelFieldRwPrime: 29,
          steelLabRw: 43
        },
        fill: 50,
        materialId: "fire_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 47,
          resilientFieldDnTA: 46.7,
          resilientFieldDnTw: 47,
          resilientFieldRwPrime: 46,
          resilientLabRw: 49,
          steelFieldBaseRw: 32,
          steelFieldDnTA: 33.7,
          steelFieldDnTw: 32,
          steelFieldRwPrime: 31,
          steelLabRw: 44
        },
        fill: 60,
        materialId: "fire_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 44,
          resilientFieldDnTA: 46,
          resilientFieldDnTw: 45,
          resilientFieldRwPrime: 44,
          resilientLabRw: 46,
          steelFieldBaseRw: 28,
          steelFieldDnTA: 32.4,
          steelFieldDnTw: 30,
          steelFieldRwPrime: 29,
          steelLabRw: 41
        },
        fill: 35,
        materialId: "firestop_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 44,
          resilientFieldDnTA: 46.5,
          resilientFieldDnTw: 45,
          resilientFieldRwPrime: 44,
          resilientLabRw: 46,
          steelFieldBaseRw: 30,
          steelFieldDnTA: 31.3,
          steelFieldDnTw: 31,
          steelFieldRwPrime: 29,
          steelLabRw: 43
        },
        fill: 42,
        materialId: "firestop_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 45,
          resilientFieldDnTA: 47.1,
          resilientFieldDnTw: 46,
          resilientFieldRwPrime: 45,
          resilientLabRw: 47,
          steelFieldBaseRw: 30,
          steelFieldDnTA: 33.2,
          steelFieldDnTw: 31,
          steelFieldRwPrime: 30,
          steelLabRw: 43
        },
        fill: 50,
        materialId: "firestop_board",
        thicknessMm: 15
      },
      {
        expected: {
          resilientFieldBaseRw: 47,
          resilientFieldDnTA: 46.7,
          resilientFieldDnTw: 47,
          resilientFieldRwPrime: 46,
          resilientLabRw: 49,
          steelFieldBaseRw: 32,
          steelFieldDnTA: 34.7,
          steelFieldDnTw: 33,
          steelFieldRwPrime: 32,
          steelLabRw: 44
        },
        fill: 60,
        materialId: "firestop_board",
        thicknessMm: 15
      }
    ] as const;

    for (const testCase of cases) {
      const layers = [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: testCase.fill },
        { materialId: testCase.materialId, thicknessMm: testCase.thicknessMm }
      ] as const;
      const steelLab = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelLab.ratings.iso717.Rw).toBe(testCase.expected.steelLabRw);
      expect(resilientLab.ratings.iso717.Rw).toBe(testCase.expected.resilientLabRw);
      expect(steelField.airborneOverlay?.baseRwDb).toBe(testCase.expected.steelFieldBaseRw);
      expect(steelField.ratings.iso717.RwPrime).toBe(testCase.expected.steelFieldRwPrime);
      expect(steelField.ratings.field?.DnTw).toBe(testCase.expected.steelFieldDnTw);
      expect(steelField.ratings.field?.DnTA).toBe(testCase.expected.steelFieldDnTA);
      expect(resilientField.airborneOverlay?.baseRwDb).toBe(testCase.expected.resilientFieldBaseRw);
      expect(resilientField.ratings.iso717.RwPrime).toBe(testCase.expected.resilientFieldRwPrime);
      expect(resilientField.ratings.field?.DnTw).toBe(testCase.expected.resilientFieldDnTw);
      expect(resilientField.ratings.field?.DnTA).toBe(testCase.expected.resilientFieldDnTA);
    }

    const acousticRepresentativeSteelField = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: 42 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 15 }
      ],
      { calculator: "dynamic", airborneContext: steelFieldContext }
    );
    const acousticRepresentativeLab = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: 42 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 15 }
      ],
      { calculator: "dynamic", airborneContext: steelLabContext, targetOutputs: ["Rw"] }
    );

    expect(
      acousticRepresentativeLab.dynamicAirborneTrace?.notes.some((note: string) => /mixed plain-gypsum \+ acoustic-gypsum filled single-board lab target/i.test(note))
    ).toBe(true);
    expect(
      acousticRepresentativeSteelField.warnings.some((warning: string) => /mixed plain-gypsum \+ acoustic-gypsum filled single-board field template/i.test(warning))
    ).toBe(true);
  });

  it("keeps diamond and silentboard security hybrids on the source-backed security corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: { resilientLabRw: 49, resilientRwPrime: 47, steelLabRw: 44, steelRwPrime: 32 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 49, resilientRwPrime: 46, steelLabRw: 46, steelRwPrime: 34 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 50, resilientRwPrime: 47, steelLabRw: 46, steelRwPrime: 34 },
        layers: [
          { materialId: "diamond_board", thicknessMm: 18 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 47, resilientRwPrime: 45, steelLabRw: 45, steelRwPrime: 33 },
        layers: [
          { materialId: "silentboard", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 50, resilientRwPrime: 48, steelLabRw: 47, steelRwPrime: 35 },
        layers: [
          { materialId: "silentboard", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const steelLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelLab.ratings.iso717.Rw).toBe(testCase.expected.steelLabRw);
      expect(resilientLab.ratings.iso717.Rw).toBe(testCase.expected.resilientLabRw);
      expect(steelField.ratings.field?.RwPrime).toBe(testCase.expected.steelRwPrime);
      expect(resilientField.ratings.field?.RwPrime).toBe(testCase.expected.resilientRwPrime);
    }

    const representativeSteelLab = calculateAssembly(cases[0].layers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    expect(
      representativeSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /security-board filled single-board corridor/i.test(note))
    ).toBe(true);

    const representativeField = calculateAssembly(cases[0].layers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });
    expect(
      representativeField.warnings.some((warning: string) => /security-board filled single-board field corridor/i.test(warning))
    ).toBe(true);
  });

  it("keeps source-backed security-board filled single-board framed walls on the upstream lab and field corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: { resilientLabRw: 44, resilientRwPrime: 42, steelLabRw: 40, steelRwPrime: 27 },
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 35 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 49, resilientRwPrime: 46, steelLabRw: 46, steelRwPrime: 34 },
        layers: [
          { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 47, resilientRwPrime: 45, steelLabRw: 43, steelRwPrime: 30 },
        layers: [
          { materialId: "firestop_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 46, resilientRwPrime: 43, steelLabRw: 43, steelRwPrime: 30 },
        layers: [
          { materialId: "security_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "security_board", thicknessMm: 12.5 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const steelLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelLab.ratings.iso717.Rw).toBe(testCase.expected.steelLabRw);
      expect(resilientLab.ratings.iso717.Rw).toBe(testCase.expected.resilientLabRw);
      expect(steelField.ratings.field?.RwPrime).toBe(testCase.expected.steelRwPrime);
      expect(resilientField.ratings.field?.RwPrime).toBe(testCase.expected.resilientRwPrime);
    }

    const representativeField = calculateAssembly(cases[2].layers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });
    expect(
      representativeField.warnings.some((warning: string) => /security-board filled single-board field corridor/i.test(warning))
    ).toBe(true);
  });

  it("applies the steel-field security high-band lift only on supported 60 mm security hybrids", () => {
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;

    const diamondSecurity = calculateAssembly(
      [
        { materialId: "diamond_board", thicknessMm: 18 },
        { materialId: "rockwool", thicknessMm: 60 },
        { materialId: "security_board", thicknessMm: 12.5 }
      ],
      {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      }
    );
    const fireSecurity = calculateAssembly(
      [
        { materialId: "firestop_board", thicknessMm: 15 },
        { materialId: "rockwool", thicknessMm: 60 },
        { materialId: "security_board", thicknessMm: 12.5 }
      ],
      {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      }
    );
    const acousticSecurity = calculateAssembly(
      [
        { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
        { materialId: "rockwool", thicknessMm: 60 },
        { materialId: "security_board", thicknessMm: 12.5 }
      ],
      {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      }
    );

    expect(diamondSecurity.ratings.field?.RwPrime).toBe(34);
    expect(diamondSecurity.ratings.field?.DnTA).toBe(35.6);
    expect(
      diamondSecurity.warnings.some((warning: string) => /steel-field security-hybrid high-band lift/i.test(warning))
    ).toBe(true);
    expect(
      fireSecurity.warnings.some((warning: string) => /steel-field security-hybrid high-band lift/i.test(warning))
    ).toBe(true);
    expect(
      acousticSecurity.warnings.some((warning: string) => /steel-field security-hybrid high-band lift/i.test(warning))
    ).toBe(false);
  });

  it("keeps fire-rated filled single-board framed walls on the upstream lab and field corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: { resilientLabRw: 46, resilientRwPrime: 44, steelLabRw: 42, steelRwPrime: 30 },
        layers: [
          { materialId: "fire_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 35 },
          { materialId: "fire_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 48, resilientRwPrime: 46, steelLabRw: 44, steelRwPrime: 31 },
        layers: [
          { materialId: "fire_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "firestop_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 48, resilientRwPrime: 45, steelLabRw: 45, steelRwPrime: 33 },
        layers: [
          { materialId: "firestop_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "fire_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientLabRw: 50, resilientRwPrime: 47, steelLabRw: 45, steelRwPrime: 33 },
        layers: [
          { materialId: "firestop_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 60 },
          { materialId: "firestop_board", thicknessMm: 12.5 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const steelLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelLab.ratings.iso717.Rw).toBe(testCase.expected.steelLabRw);
      expect(resilientLab.ratings.iso717.Rw).toBe(testCase.expected.resilientLabRw);
      expect(steelField.ratings.field?.RwPrime).toBe(testCase.expected.steelRwPrime);
      expect(resilientField.ratings.field?.RwPrime).toBe(testCase.expected.resilientRwPrime);
    }

    const representativeLab = calculateAssembly(cases[1].layers, {
      calculator: "dynamic",
      airborneContext: resilientLabContext,
      targetOutputs: ["Rw"]
    });
    const representativeField = calculateAssembly(cases[1].layers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });
    expect(
      representativeLab.dynamicAirborneTrace?.notes.some((note: string) => /fire-rated filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      representativeField.warnings.some((warning: string) => /fire-rated filled single-board field corridor/i.test(warning))
    ).toBe(true);
  });

  it("keeps mixed plain gypsum plus premium and moderate filled single-board framed walls on the upstream field corridor", () => {
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        expected: { resilientDnTA: 48.1, resilientRwPrime: 45, steelDnTA: 34.4, steelRwPrime: 31 },
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "silentboard", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientDnTA: 48.8, resilientRwPrime: 47, steelDnTA: 35.7, steelRwPrime: 33 },
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 18 }
        ]
      },
      {
        expected: { resilientDnTA: 47.3, resilientRwPrime: 45, steelDnTA: 34.1, steelRwPrime: 32 },
        layers: [
          { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientDnTA: 45.5, resilientRwPrime: 43, steelDnTA: 32.3, steelRwPrime: 30 },
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 42 },
          { materialId: "fire_board", thicknessMm: 12.5 }
        ]
      },
      {
        expected: { resilientDnTA: 47.1, resilientRwPrime: 45, steelDnTA: 33.2, steelRwPrime: 30 },
        layers: [
          { materialId: "firestop_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const steelField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(testCase.layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelField.ratings.field?.RwPrime).toBe(testCase.expected.steelRwPrime);
      expect(steelField.ratings.field?.DnTA).toBe(testCase.expected.steelDnTA);
      expect(resilientField.ratings.field?.RwPrime).toBe(testCase.expected.resilientRwPrime);
      expect(resilientField.ratings.field?.DnTA).toBe(testCase.expected.resilientDnTA);
    }

    const representativeField = calculateAssembly(cases[0].layers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    expect(
      representativeField.warnings.some((warning: string) => /mixed plain-filled single-board field corridor/i.test(warning))
    ).toBe(true);
  });

  it("keeps plain gypsum filled single-board framed walls close to the upstream field and lab corridor", () => {
    const steelLabContext = {
      contextMode: "element_lab",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good"
    } as const;
    const resilientLabContext = {
      contextMode: "element_lab",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good"
    } as const;
    const steelFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const resilientFieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "resilient_channel",
      studType: "resilient_stud",
      studSpacingMm: 625,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 32,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      { fillMm: 35, steelRw: 43, resilientRw: 48, steelDnTA: 32.7, resilientDnTA: 46.9 },
      { fillMm: 42, steelRw: 43, resilientRw: 48, steelDnTA: 33.8, resilientDnTA: 47.5 },
      { fillMm: 50, steelRw: 44, resilientRw: 49, steelDnTA: 33.9, resilientDnTA: 46.9 },
      { fillMm: 60, steelRw: 45, resilientRw: 50, steelDnTA: 35.5, resilientDnTA: 47.7 }
    ] as const;

    for (const testCase of cases) {
      const layers = [
        { materialId: "gypsum_board", thicknessMm: 15 },
        { materialId: "rockwool", thicknessMm: testCase.fillMm },
        { materialId: "gypsum_board", thicknessMm: 15 }
      ] as const;

      const steelLab = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: steelLabContext,
        targetOutputs: ["Rw"]
      });
      const resilientLab = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: resilientLabContext,
        targetOutputs: ["Rw"]
      });
      const steelField = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: steelFieldContext
      });
      const resilientField = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: resilientFieldContext
      });

      expect(steelLab.ratings.iso717.Rw).toBe(testCase.steelRw);
      expect(resilientLab.ratings.iso717.Rw).toBe(testCase.resilientRw);
      expect(steelField.ratings.field?.DnTA).toBe(testCase.steelDnTA);
      expect(resilientField.ratings.field?.DnTA).toBe(testCase.resilientDnTA);
    }

    const deepLayers = [
      { materialId: "gypsum_board", thicknessMm: 15 },
      { materialId: "rockwool", thicknessMm: 60 },
      { materialId: "gypsum_board", thicknessMm: 15 }
    ] as const;
    const deepSteelLab = calculateAssembly(deepLayers, {
      calculator: "dynamic",
      airborneContext: steelLabContext,
      targetOutputs: ["Rw"]
    });
    const deepSteelField = calculateAssembly(deepLayers, {
      calculator: "dynamic",
      airborneContext: steelFieldContext
    });
    const deepResilientField = calculateAssembly(deepLayers, {
      calculator: "dynamic",
      airborneContext: resilientFieldContext
    });

    expect(
      deepSteelLab.dynamicAirborneTrace?.notes.some((note: string) => /plain gypsum filled single-board corridor/i.test(note))
    ).toBe(true);
    expect(
      deepSteelField.warnings.some((warning: string) => /plain gypsum filled single-board field trim/i.test(warning))
    ).toBe(true);
    expect(
      deepResilientField.warnings.some((warning: string) => /resilient plain gypsum filled single-board field lift/i.test(warning))
    ).toBe(true);
  });

  it("keeps the empty-cavity framed field board-count matrix monotonic on R'w and DnT,w", () => {
    const metas = [
      {
        name: "steel_field",
        value: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          studType: "light_steel_stud",
          connectionType: "line_connection",
          studSpacingMm: 600,
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          sharedTrack: "independent",
          electricalBoxes: "none",
          panelWidthMm: 3000,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 30,
          receivingRoomRt60S: 0.5
        }
      },
      {
        name: "resilient_field",
        value: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          studType: "resilient_stud",
          connectionType: "resilient_channel",
          studSpacingMm: 600,
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          sharedTrack: "independent",
          electricalBoxes: "none",
          panelWidthMm: 3000,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 30,
          receivingRoomRt60S: 0.5
        }
      }
    ] as const;

    const evaluate = (leftBoards: number, rightBoards: number, meta: (typeof metas)[number]["value"]) => {
      const layers: Array<{ materialId: string; thicknessMm: number }> = [];
      for (let index = 0; index < leftBoards; index += 1) {
        layers.push({ materialId: "gypsum", thicknessMm: 12.5 });
      }
      layers.push({ materialId: "air_gap", thicknessMm: 50 });
      for (let index = 0; index < rightBoards; index += 1) {
        layers.push({ materialId: "gypsum", thicknessMm: 12.5 });
      }
      return calculateAssembly(layers, { calculator: "dynamic", airborneContext: meta });
    };

    for (const meta of metas) {
      const grid = new Map<string, ReturnType<typeof evaluate>>();

      for (let left = 1; left <= 4; left += 1) {
        for (let right = 1; right <= 4; right += 1) {
          grid.set(`${left}-${right}`, evaluate(left, right, meta.value));
        }
      }

      for (let left = 1; left <= 4; left += 1) {
        for (let right = 1; right <= 4; right += 1) {
          const base = grid.get(`${left}-${right}`);
          expect(base, `${meta.name} base ${left}-${right}`).toBeDefined();

          if (left < 4) {
            const next = grid.get(`${left + 1}-${right}`);
            expect(next, `${meta.name} left ${left + 1}-${right}`).toBeDefined();
            expect(next?.ratings.iso717.RwPrime, `${meta.name} left ${left}-${right} -> ${left + 1}-${right} lowered R'w`).toBeGreaterThanOrEqual(base?.ratings.iso717.RwPrime ?? -Infinity);
            expect(next?.ratings.field?.DnTw, `${meta.name} left ${left}-${right} -> ${left + 1}-${right} lowered DnT,w`).toBeGreaterThanOrEqual(base?.ratings.field?.DnTw ?? -Infinity);
          }

          if (right < 4) {
            const next = grid.get(`${left}-${right + 1}`);
            expect(next, `${meta.name} right ${left}-${right + 1}`).toBeDefined();
            expect(next?.ratings.iso717.RwPrime, `${meta.name} right ${left}-${right} -> ${left}-${right + 1} lowered R'w`).toBeGreaterThanOrEqual(base?.ratings.iso717.RwPrime ?? -Infinity);
            expect(next?.ratings.field?.DnTw, `${meta.name} right ${left}-${right} -> ${left}-${right + 1} lowered DnT,w`).toBeGreaterThanOrEqual(base?.ratings.field?.DnTw ?? -Infinity);
          }
        }
      }

      const representative = grid.get("2-3");
      expect(
        representative?.dynamicAirborneTrace?.notes.some((note: string) => /mixed-board empty-cavity field midband lift/i.test(note)),
        `${meta.name} representative mixed-board empty-cavity field lift note`
      ).toBe(true);
    }
  }, 15000);

  it("keeps split-cavity left-right gap swaps invariant in field mode", () => {
    const fieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const failures: Array<Record<string, number | string | undefined>> = [];

    for (const board of ["gypsum_board", "firestop_board", "diamond_board", "acoustic_gypsum_board"] as const) {
      for (const thicknessMm of [12.5, 15] as const) {
        for (const fillMm of [40, 50, 75] as const) {
          for (const leftGap of [10, 20, 30, 40] as const) {
            for (const rightGap of [10, 20, 30, 40] as const) {
              const forward = calculateAssembly(
                [
                  { materialId: board, thicknessMm },
                  { materialId: "air_gap", thicknessMm: leftGap },
                  { materialId: "rockwool", thicknessMm: fillMm },
                  { materialId: "air_gap", thicknessMm: rightGap },
                  { materialId: board, thicknessMm }
                ],
                { calculator: "dynamic", airborneContext: fieldContext }
              );
              const reverse = calculateAssembly(
                [
                  { materialId: board, thicknessMm },
                  { materialId: "air_gap", thicknessMm: rightGap },
                  { materialId: "rockwool", thicknessMm: fillMm },
                  { materialId: "air_gap", thicknessMm: leftGap },
                  { materialId: board, thicknessMm }
                ],
                { calculator: "dynamic", airborneContext: fieldContext }
              );

              if (
                Math.abs((forward.ratings.iso717.RwPrime ?? 0) - (reverse.ratings.iso717.RwPrime ?? 0)) > 0.1 ||
                forward.dynamicAirborneTrace?.detectedFamily !== reverse.dynamicAirborneTrace?.detectedFamily
              ) {
                failures.push({
                  board,
                  thicknessMm,
                  fillMm,
                  leftGap,
                  rightGap,
                  forwardRwPrime: forward.ratings.iso717.RwPrime,
                  reverseRwPrime: reverse.ratings.iso717.RwPrime,
                  forwardFamily: forward.dynamicAirborneTrace?.detectedFamily,
                  reverseFamily: reverse.dynamicAirborneTrace?.detectedFamily
                });
              }
            }
          }
        }
      }
    }

    expect(failures.slice(0, 10)).toEqual([]);
    expect(failures).toHaveLength(0);
  }, 15000);

  it("keeps micro-gap fill ordering inside the field boundary corridor", () => {
    const fieldContext = {
      contextMode: "field_between_rooms",
      connectionType: "line_connection",
      studType: "light_steel_stud",
      studSpacingMm: 600,
      airtightness: "good",
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const failures: Array<Record<string, number | string | undefined>> = [];

    for (const board of ["gypsum_board", "firestop_board", "diamond_board", "acoustic_gypsum_board"] as const) {
      for (const thicknessMm of [12.5, 15] as const) {
        for (const totalFillMm of [75, 100, 125] as const) {
          for (const gapMm of [5, 10, 15, 20, 25] as const) {
            if (gapMm >= totalFillMm) {
              continue;
            }

            const gapFirst = calculateAssembly(
              [
                { materialId: board, thicknessMm },
                { materialId: "air_gap", thicknessMm: gapMm },
                { materialId: "rockwool", thicknessMm: totalFillMm - gapMm },
                { materialId: board, thicknessMm }
              ],
              { calculator: "dynamic", airborneContext: fieldContext }
            );
            const fillFirst = calculateAssembly(
              [
                { materialId: board, thicknessMm },
                { materialId: "rockwool", thicknessMm: totalFillMm - gapMm },
                { materialId: "air_gap", thicknessMm: gapMm },
                { materialId: board, thicknessMm }
              ],
              { calculator: "dynamic", airborneContext: fieldContext }
            );
            const hasBoundarySignal =
              gapFirst.dynamicAirborneTrace?.detectedFamily !== fillFirst.dynamicAirborneTrace?.detectedFamily ||
              gapFirst.warnings.length > 0 ||
              fillFirst.warnings.length > 0;

            if (
              Math.abs((gapFirst.ratings.iso717.RwPrime ?? 0) - (fillFirst.ratings.iso717.RwPrime ?? 0)) > 3 &&
              !hasBoundarySignal
            ) {
              failures.push({
                board,
                thicknessMm,
                totalFillMm,
                gapMm,
                gapFirstRwPrime: gapFirst.ratings.iso717.RwPrime,
                fillFirstRwPrime: fillFirst.ratings.iso717.RwPrime,
                gapFirstFamily: gapFirst.dynamicAirborneTrace?.detectedFamily,
                fillFirstFamily: fillFirst.dynamicAirborneTrace?.detectedFamily
              });
            }
          }
        }
      }
    }

    expect(failures.slice(0, 10)).toEqual([]);
    expect(failures).toHaveLength(0);
  }, 15000);

  it("keeps face reinforcement broadly symmetric between front and back faces in field mode", () => {
    const metas = [
      {
        name: "steel_field",
        value: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          studType: "light_steel_stud",
          connectionType: "line_connection",
          studSpacingMm: 600,
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          sharedTrack: "independent",
          electricalBoxes: "none",
          panelWidthMm: 3000,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 30,
          receivingRoomRt60S: 0.5
        }
      },
      {
        name: "resilient_field",
        value: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          studType: "resilient_stud",
          connectionType: "resilient_channel",
          studSpacingMm: 600,
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          sharedTrack: "independent",
          electricalBoxes: "none",
          panelWidthMm: 3000,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 30,
          receivingRoomRt60S: 0.5
        }
      }
    ] as const;
    const failures: Array<Record<string, number | string | undefined>> = [];

    for (const meta of metas) {
      for (const board of [
        "gypsum_board",
        "firestop_board",
        "diamond_board",
        "silentboard",
        "acoustic_gypsum_board",
        "security_board"
      ] as const) {
        for (const thicknessMm of [12.5, 15] as const) {
          for (const fillMm of [50, 75, 100] as const) {
            const baseLayers = [
              { materialId: board, thicknessMm },
              { materialId: "rockwool", thicknessMm: fillMm },
              { materialId: board, thicknessMm }
            ] as const;
            const front = calculateAssembly([{ materialId: board, thicknessMm }, ...baseLayers], {
              calculator: "dynamic",
              airborneContext: meta.value
            });
            const back = calculateAssembly([...baseLayers, { materialId: board, thicknessMm }], {
              calculator: "dynamic",
              airborneContext: meta.value
            });

            if (
              Math.abs((front.ratings.iso717.RwPrime ?? 0) - (back.ratings.iso717.RwPrime ?? 0)) > 3 ||
              front.dynamicAirborneTrace?.detectedFamily !== back.dynamicAirborneTrace?.detectedFamily
            ) {
              failures.push({
                meta: meta.name,
                board,
                thicknessMm,
                fillMm,
                frontRwPrime: front.ratings.iso717.RwPrime,
                backRwPrime: back.ratings.iso717.RwPrime,
                frontFamily: front.dynamicAirborneTrace?.detectedFamily,
                backFamily: back.dynamicAirborneTrace?.detectedFamily
              });
            }
          }
        }
      }
    }

    expect(failures.slice(0, 10)).toEqual([]);
    expect(failures).toHaveLength(0);
  }, 15000);

  it("keeps outer compliant head-tail layers neutral on the field double-leaf matrix", () => {
    const fieldContext = {
      contextMode: "field_between_rooms",
      airtightness: "good",
      studType: "light_steel_stud",
      connectionType: "line_connection",
      studSpacingMm: 600,
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const failures: Array<Record<string, number | string | undefined>> = [];

    for (const board of ["gypsum_board", "firestop_board", "diamond_board", "acoustic_gypsum_board"] as const) {
      for (const thicknessMm of [12.5, 15] as const) {
        for (const fillMm of [50, 75, 100] as const) {
          const baseLayers = [
            { materialId: board, thicknessMm },
            { materialId: "air_gap", thicknessMm: 50 },
            { materialId: "rockwool", thicknessMm: fillMm },
            { materialId: board, thicknessMm }
          ] as const;
          const base = calculateAssembly(baseLayers, { calculator: "dynamic", airborneContext: fieldContext });
          const variants = [
            [{ materialId: "rockwool", thicknessMm: 25 }, ...baseLayers],
            [...baseLayers, { materialId: "rockwool", thicknessMm: 25 }],
            [{ materialId: "rockwool", thicknessMm: 25 }, ...baseLayers, { materialId: "rockwool", thicknessMm: 25 }]
          ] as const;

          for (const layers of variants) {
            const result = calculateAssembly(layers, { calculator: "dynamic", airborneContext: fieldContext });

            if (
              result.ratings.iso717.RwPrime !== base.ratings.iso717.RwPrime ||
              result.dynamicAirborneTrace?.detectedFamily !== base.dynamicAirborneTrace?.detectedFamily
            ) {
              failures.push({
                board,
                thicknessMm,
                fillMm,
                baseRwPrime: base.ratings.iso717.RwPrime,
                rwPrime: result.ratings.iso717.RwPrime,
                baseFamily: base.dynamicAirborneTrace?.detectedFamily,
                family: result.dynamicAirborneTrace?.detectedFamily
              });
            }
          }
        }
      }
    }

    expect(failures.slice(0, 10)).toEqual([]);
    expect(failures).toHaveLength(0);
  });

  it("keeps merged thick boards close to split same-material reinforcement in field mode", () => {
    const fieldContext = {
      contextMode: "field_between_rooms",
      airtightness: "good",
      studType: "light_steel_stud",
      connectionType: "line_connection",
      studSpacingMm: 600,
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const failures: Array<Record<string, number | string | undefined>> = [];

    for (const board of [
      "gypsum_board",
      "firestop_board",
      "diamond_board",
      "silentboard",
      "acoustic_gypsum_board"
    ] as const) {
      for (const thicknessMm of [12.5, 15] as const) {
        for (const fillMm of [50, 75, 100, 125] as const) {
          const split = calculateAssembly(
            [
              { materialId: board, thicknessMm },
              { materialId: "rockwool", thicknessMm: fillMm },
              { materialId: board, thicknessMm },
              { materialId: board, thicknessMm }
            ],
            { calculator: "dynamic", airborneContext: fieldContext }
          );
          const merged = calculateAssembly(
            [
              { materialId: board, thicknessMm },
              { materialId: "rockwool", thicknessMm: fillMm },
              { materialId: board, thicknessMm: thicknessMm * 2 }
            ],
            { calculator: "dynamic", airborneContext: fieldContext }
          );

          if (
            Math.abs((split.ratings.iso717.RwPrime ?? 0) - (merged.ratings.iso717.RwPrime ?? 0)) > 3 ||
            split.dynamicAirborneTrace?.detectedFamily !== merged.dynamicAirborneTrace?.detectedFamily
          ) {
            failures.push({
              board,
              thicknessMm,
              fillMm,
              splitRwPrime: split.ratings.iso717.RwPrime,
              mergedRwPrime: merged.ratings.iso717.RwPrime,
              splitFamily: split.dynamicAirborneTrace?.detectedFamily,
              mergedFamily: merged.dynamicAirborneTrace?.detectedFamily
            });
          }
        }
      }
    }

    expect(failures.slice(0, 10)).toEqual([]);
    expect(failures).toHaveLength(0);
  });

  it("keeps same-face board reorder neutral on framed reinforcement sibling comparisons", () => {
    const fieldContext = {
      contextMode: "field_between_rooms",
      airtightness: "good",
      studType: "light_steel_stud",
      connectionType: "line_connection",
      studSpacingMm: 600,
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const baseLayers = [
      { materialId: "firestop_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "air_gap", thicknessMm: 40 },
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "firestop_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ] as const;
    const reorderedSameFaceLayers = [
      ...baseLayers.slice(0, 7),
      baseLayers[8]!,
      baseLayers[7]!,
      baseLayers[9]!
    ] as const;

    const base = calculateAssembly(baseLayers, {
      airborneContext: fieldContext,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const reordered = calculateAssembly(reorderedSameFaceLayers, {
      airborneContext: fieldContext,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(reordered.ratings.iso717.RwPrime).toBe(base.ratings.iso717.RwPrime);
    expect(reordered.ratings.field?.DnTw).toBe(base.ratings.field?.DnTw);
    expect(reordered.dynamicAirborneTrace?.detectedFamily).toBe(base.dynamicAirborneTrace?.detectedFamily);
    expect(reordered.dynamicAirborneTrace?.strategy).toBe(base.dynamicAirborneTrace?.strategy);
    expect(
      reordered.dynamicAirborneTrace?.notes.find((note: string) => /framed reinforcement monotonic floor/i.test(note))
    ).toContain("target 59.0 dB");
    expect(
      base.dynamicAirborneTrace?.notes.find((note: string) => /framed reinforcement monotonic floor/i.test(note))
    ).toContain("target 59.0 dB");
  });

  it("keeps same-face board reorder neutral across representative framed field walls", () => {
    const fieldContext = {
      contextMode: "field_between_rooms",
      airtightness: "good",
      studType: "light_steel_stud",
      connectionType: "line_connection",
      studSpacingMm: 600,
      perimeterSeal: "good",
      penetrationState: "none",
      junctionQuality: "good",
      sharedTrack: "independent",
      electricalBoxes: "none",
      panelWidthMm: 3000,
      panelHeightMm: 2600,
      receivingRoomVolumeM3: 30,
      receivingRoomRt60S: 0.5
    } as const;
    const cases = [
      {
        name: "single-cavity-double-board",
        layers: [
          { materialId: "firestop_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "air_gap", thicknessMm: 75 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ] as const,
        swaps: [[0, 1], [4, 5]] as const
      },
      {
        name: "mixed-premium-split",
        layers: [
          { materialId: "diamond_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "air_gap", thicknessMm: 70 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "air_gap", thicknessMm: 70 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "firestop_board", thicknessMm: 12.5 }
        ] as const,
        swaps: [[0, 1], [5, 6]] as const
      },
      {
        name: "shallow-one-face-reinforcement",
        layers: [
          { materialId: "diamond_board", thicknessMm: 15 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "air_gap", thicknessMm: 50 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ] as const,
        swaps: [[0, 1]] as const
      },
      {
        name: "ten-layer-reinforced",
        layers: [
          { materialId: "firestop_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "air_gap", thicknessMm: 40 },
          { materialId: "diamond_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "firestop_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ] as const,
        swaps: [[0, 1], [7, 8]] as const
      }
    ] as const;
    const failures: Array<Record<string, number | string | null | undefined>> = [];

    for (const testCase of cases) {
      const base = calculateAssembly(testCase.layers, {
        airborneContext: fieldContext,
        calculator: "dynamic",
        targetOutputs: ["R'w", "DnT,w"]
      });

      for (const [leftIndex, rightIndex] of testCase.swaps) {
        const reordered = [...testCase.layers];
        [reordered[leftIndex], reordered[rightIndex]] = [reordered[rightIndex]!, reordered[leftIndex]!];

        const result = calculateAssembly(reordered, {
          airborneContext: fieldContext,
          calculator: "dynamic",
          targetOutputs: ["R'w", "DnT,w"]
        });

        if (
          result.ratings.iso717.RwPrime !== base.ratings.iso717.RwPrime ||
          result.ratings.field?.DnTw !== base.ratings.field?.DnTw ||
          result.dynamicAirborneTrace?.detectedFamily !== base.dynamicAirborneTrace?.detectedFamily ||
          result.dynamicAirborneTrace?.strategy !== base.dynamicAirborneTrace?.strategy
        ) {
          failures.push({
            case: testCase.name,
            swap: `${leftIndex + 1}<->${rightIndex + 1}`,
            baseRwPrime: base.ratings.iso717.RwPrime,
            rwPrime: result.ratings.iso717.RwPrime,
            baseDnTw: base.ratings.field?.DnTw,
            dnTw: result.ratings.field?.DnTw,
            baseFamily: base.dynamicAirborneTrace?.detectedFamily,
            family: result.dynamicAirborneTrace?.detectedFamily,
            baseStrategy: base.dynamicAirborneTrace?.strategy,
            strategy: result.dynamicAirborneTrace?.strategy
          });
        }
      }
    }

    expect(failures.slice(0, 10)).toEqual([]);
    expect(failures).toHaveLength(0);
  });

  it("stays close to heavy and mixed smoke cases", () => {
    const concreteSlab = calculateAssembly([{ materialId: "concrete", thicknessMm: 150 }]);
    const cltFloor = calculateAssembly([
      { materialId: "vinyl_flooring", thicknessMm: 4 },
      { materialId: "screed", thicknessMm: 50 },
      { materialId: "air_gap", thicknessMm: 45 },
      { materialId: "clt_panel", thicknessMm: 120 }
    ]);
    const compositeMineral = calculateAssembly([
      { materialId: "screed", thicknessMm: 50 },
      { materialId: "concrete", thicknessMm: 150 }
    ]);

    expect(concreteSlab.metrics.estimatedRwDb).toBe(56.6);
    expect(cltFloor.metrics.estimatedRwDb).toBe(47);
    expect(compositeMineral.metrics.estimatedRwDb).toBe(60.1);
    expect(concreteSlab.ratings.iso717.Rw).toBeGreaterThan(0);
    expect(cltFloor.ratings.iso717.Ctr).toBeLessThanOrEqual(0);
    expect(compositeMineral.ratings.astmE413.STC).toBeGreaterThanOrEqual(50);
    expect(concreteSlab.impact?.LnW).toBe(74.5);
    expect(concreteSlab.impact?.confidence.level).toBe("medium");
    expect(cltFloor.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(cltFloor.impact?.LnW).toBe(59.9);
    expect(cltFloor.impact?.CI).toBe(1.3);
    expect(cltFloor.impact?.confidence.provenance).toBe("published_family_estimate");
    expect(cltFloor.impact?.estimateCandidateIds).toEqual([
      "tuas_x2_clt140_measured_2026",
      "tuas_c2_clt260_measured_2026",
      "dataholz_gdmnxn02_wet_clt_lab_2026"
    ]);
  });

  it("derives narrow heavy-floor impact metrics when a resilient layer and heavy base are present", () => {
    const result = calculateAssembly([
      { materialId: "ceramic_tile", thicknessMm: 8 },
      { materialId: "screed", thicknessMm: 50 },
      { materialId: "generic_resilient_underlay", thicknessMm: 8 },
      { materialId: "concrete", thicknessMm: 150 }
    ]);

    expect(result.impact).not.toBeNull();
    expect(result.impact?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result.impact?.confidence.provenance).toBe("published_family_estimate");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBe(33.4);
    expect(result.impact?.predictorResonanceHz).toBe(47);
    expect(result.impact?.resilientDynamicStiffnessMNm3).toBe(10);
    expect(result.impact?.availableOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.dynamicImpactTrace?.selectionKind).toBe("family_estimate");
    expect(result.dynamicImpactTrace?.evidenceTier).toBe("estimate");
    expect(result.dynamicImpactTrace?.detectedSupportFamily).toBe("reinforced_concrete");
    expect(result.dynamicImpactTrace?.systemType).toBe("heavy_floating_floor");
    expect(result.impactSupport?.notes.some((note: string) => /same-stack Annex C style DeltaLw companion/i.test(note))).toBe(true);
  });

  it("keeps impact parsing stable when floor roles isolate the base from a ceiling package", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 80 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 25 }
    ]);

    expect(result.impact).not.toBeNull();
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(41.1);
    expect(result.impact?.DeltaLw).toBe(33.4);
  });

  it("prioritizes an exact lab-side impact source over the scoped predictor", () => {
    const result = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19
      }
    );

    expect(result.impact).not.toBeNull();
    expect(result.impact?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.LnW).toBe(53);
    expect(result.impact?.CI).toBe(-3);
    expect(result.impact?.LnWPlusCI).toBe(50);
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.impactSupport?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impactSupport?.primaryCurveType).toBe("airborne_tl");
    expect(result.impactSupport?.primaryCurveUnaffected).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /ISO 717-2 impact contour/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Ln,w\+CI was computed as Ln,w \+ CI/i.test(note))).toBe(true);
    expect(result.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(result.warnings.some((warning: string) => /exact lab impact-band source/i.test(warning))).toBe(true);
  });

  it("surfaces the exact impact band trace on the full assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19
      }
    );

    expect(result.impact?.trace?.activeSeriesId).toBe("source");
    expect(result.impact?.trace?.series[0]?.curve.frequenciesHz).toEqual(EXACT_IMPACT_SOURCE_19.frequenciesHz);
    expect(result.impact?.trace?.series[0]?.curve.levelsDb).toEqual(EXACT_IMPACT_SOURCE_19.levelsDb);
  });

  it("surfaces supported and unsupported target outputs without fabricating missing impact ratings", () => {
    const result = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "IIC"]
      }
    );

    expect(result.targetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "IIC"]);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC"]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw", "IIC"]);
    expect(result.warnings.some((warning: string) => /Some requested impact sound outputs are still unavailable/i.test(warning))).toBe(true);
  });

  it("can carry an exact field-side impact source without fabricating Ln,w", () => {
    const result = calculateAssembly(
      [
        { materialId: "concrete", thicknessMm: 150 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        exactImpactSource: {
          ...EXACT_IMPACT_SOURCE_19,
          labOrField: "field",
          levelsDb: [63, 62, 61, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46]
        }
      }
    );

    expect(result.impact).not.toBeNull();
    expect(result.impact?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.LnW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBe(56);
    expect(result.impact?.LPrimeNT50).toBe(55);
  });

  it("surfaces Dutch LnT,A from an exact five-octave field source on the full assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "concrete", thicknessMm: 150 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        exactImpactSource: EXACT_FIELD_OCTAVE_SOURCE_5,
        targetOutputs: ["LnT,A", "L'nT,w", "CI"]
      }
    );

    expect(result.impact?.LnTA).toBe(53.8);
    expect(result.impact?.metricBasis?.LnTA).toBe("exact_source_dutch_lnta_from_octave_bands");
    expect(result.supportedTargetOutputs).toEqual(["LnT,A", "L'nT,w", "CI"]);
    expect(result.supportedImpactOutputs).toEqual(["LnT,A", "L'nT,w", "CI"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("can re-rate an exact impact source through the direct+flanking field path branch", () => {
    const result = calculateAssembly(
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

    expect(result.impact?.fieldEstimateProfile).toBe("direct_flanking_energy_sum");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum");
    expect(result.impact?.LnW).toBe(53);
    expect(result.impact?.LPrimeNW).toBe(55);
    expect(result.impact?.LPrimeNTw).toBe(53);
    expect(result.impact?.LPrimeNT50).toBe(52);
    expect(result.impact?.fieldEstimateDirectOffsetDb).toBe(1);
    expect(result.impact?.fieldEstimateFlankingPathCount).toBe(2);
    expect(result.impact?.fieldEstimateExpertPathModifierCount).toBe(2);
    expect(result.impact?.fieldEstimateFlankingFamilyModels).toEqual(["reinforced_concrete"]);
    expect(result.impact?.fieldEstimateFlankingPathModifiersDb).toEqual([0.9, 3.9]);
    expect(result.impact?.fieldEstimateLowerTreatmentReductionDb).toBe(2);
    expect(result.impact?.fieldEstimateMaxPathModifierDb).toBe(3.9);
    expect(result.impact?.standardizedFieldEstimateProfile).toBe(
      "standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
    );
    expect(result.impact?.standardizedFieldOffsetDb).toBe(-2);
    expect(result.impact?.standardizedFieldVolumeM3).toBe(50);
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_direct_flanking_energy_sum");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe(
      "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
    );
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe(
      "estimated_standardized_field_lpriment50_from_direct_flanking_energy_sum_plus_ci50_2500"
    );
    expect(result.impactSupport?.primaryCurveType).toBe("impact_curve");
    expect(result.impactSupport?.primaryCurveUnaffected).toBe(false);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /direct\+flanking path energy sum/i.test(note))).toBe(
      true
    );
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Current direct-path offset is 1 dB/i.test(note))).toBe(
      true
    );
    expect(result.impactSupport?.formulaNotes.some((note: string) => /2 active flanking path/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Family-aware flanking path models were applied for: reinforced concrete/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /ΔLd = 2 dB was applied to the direct path before energy summation/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /L'nT,50 was computed as L'nT,w \+ CI,50-2500/i.test(note))).toBe(true);
    expect(result.warnings.some((warning: string) => /Live direct\+flanking field path is active/i.test(warning))).toBe(
      true
    );
  });

  it("keeps real field and standardized traces when exact bands continue through a direct path only", () => {
    const result = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        impactFieldContext: {
          directPathOffsetDb: 1,
          flankingPaths: [],
          lowerTreatmentReductionDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["L'n,w", "L'nT,w"]
      }
    );

    expect(result.impact?.fieldEstimateProfile).toBe("direct_flanking_energy_sum");
    expect(result.impact?.fieldEstimateDirectOffsetDb).toBe(1);
    expect(result.impact?.trace?.activeSeriesId).toBe("standardized");
    expect(result.impact?.trace?.series.map((series: { id: string }) => series.id)).toEqual(["source", "field", "standardized"]);
    expect(result.impact?.trace?.series[1]?.curve.levelsDb).not.toEqual(EXACT_IMPACT_SOURCE_19.levelsDb);
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_direct_flanking_energy_sum");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe(
      "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
    );
  });

  it("keeps K-only exact impact sources on the guide and standardized field-volume lane on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
      }
    );

    expect(result.impact?.fieldEstimateProfile).toBe("explicit_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.fieldEstimateDirectOffsetDb).toBeUndefined();
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LPrimeNW).toBe(55);
    expect(result.impact?.LPrimeNTw).toBe(53);
    expect(result.impact?.LPrimeNT50).toBe(52);
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500");
  });

  it("lets explicit flanking paths promote a K-corrected exact impact source onto the direct+flanking lane on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8 },
        { materialId: "screed", thicknessMm: 50 },
        { materialId: "generic_resilient_underlay", thicknessMm: 8 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        impactFieldContext: {
          fieldKDb: 2,
          flankingPaths: [
            {
              id: "f1",
              levelOffsetDb: -6,
              pathCount: 1
            }
          ],
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["L'n,w", "L'nT,w"]
      }
    );

    expect(result.impact?.fieldEstimateProfile).toBe("direct_flanking_energy_sum");
    expect(result.impact?.fieldEstimateDirectOffsetDb).toBe(2);
    expect(result.impact?.fieldEstimateFlankingPathCount).toBe(1);
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_direct_flanking_energy_sum");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe(
      "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume"
    );
  });

  it("keeps K-only exact floor rows on the guide and standardized field-volume lane on the assembly route", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: 140 }],
      {
        impactPredictorInput: {
          officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
          structuralSupportType: "open_box_timber"
        },
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
      }
    );

    expect(result.impact?.fieldEstimateProfile).toBe("explicit_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.fieldEstimateDirectOffsetDb).toBeUndefined();
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LPrimeNW).toBe(46);
    expect(result.impact?.LPrimeNTw).toBe(44);
    expect(result.impact?.LPrimeNT50).toBe(47);
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500");
  });

  it("can infer the default supporting family from an exact floor row during direct+flanking field estimation", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: 140 }],
      {
        impactFieldContext: {
          directPathOffsetDb: 1,
          flankingPaths: [
            {
              id: "edge_path",
              pathType: "edge",
              levelOffsetDb: -6,
              pathCount: 1,
              junctionLengthM: 4,
              edgeIsolationClass: "rigid",
              shortCircuitRisk: "high",
              kijDb: 2
            }
          ]
        },
        impactPredictorInput: {
          officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
          structuralSupportType: "open_box_timber"
        },
        targetOutputs: ["L'n,w"]
      }
    );

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_direct_flanking_energy_sum");
    expect(result.impact?.LPrimeNW).toBe(42);
    expect(result.impact?.fieldEstimateFlankingFamilyModels).toEqual(["open_box_timber"]);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Family-aware flanking path models were applied for: open box timber/i.test(note))).toBe(true);
  });

  it("applies explicit ΔLd before field-side K correction and standardization", () => {
    const result = calculateAssembly(
      [{ materialId: "concrete", thicknessMm: 140 }],
      {
        impactFieldContext: {
          fieldKDb: 2,
          lowerTreatmentReductionDb: 6,
          receivingRoomVolumeM3: 50
        },
        impactPredictorInput: {
          officialFloorSystemId: "tuas_r5b_open_box_timber_measured_2026",
          structuralSupportType: "open_box_timber"
        },
        targetOutputs: ["L'n,w", "L'nT,w"]
      }
    );

    expect(result.impact?.fieldEstimateProfile).not.toBe("direct_flanking_energy_sum");
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.impact?.fieldEstimateLowerTreatmentReductionDb).toBe(6);
    expect(result.impact?.LPrimeNW).toBe(40);
    expect(result.impact?.LPrimeNTw).toBe(38);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /L'n,w = Ln,w \+ K/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /ΔLd = 6 dB was applied before the field-side K correction/i.test(note))).toBe(true);
    expect(result.impactSupport?.formulaNotes.some((note: string) => /applied before field standardization/i.test(note))).toBe(true);
  });

  it("matches a curated Dataholz floor family from explicit floor roles", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 120 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdrnxa07a_timber_frame_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(41);
    expect(result.floorSystemMatch?.impact.CI).toBe(1);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(42);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(70);
    expect(result.warnings.some((warning: string) => /curated exact floor-system match active/i.test(warning))).toBe(true);
  });

  it("carries the exact Dataholz bonded-fill timber frame row into standardized field-side outputs", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
        { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
        { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 60 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
        { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
        { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 }
      ],
      {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
      }
    );

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdrnxa11a_timber_frame_lab_2026");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.CI50_2500).toBe(14);
    expect(result.impact?.LPrimeNW).toBe(44);
    expect(result.impact?.LPrimeNTw).toBe(42);
    expect(result.impact?.LPrimeNT50).toBe(56);
    expect(result.impact?.metricBasis?.CI50_2500).toBe("official_floor_system_exact_match");
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500");
  });

  it("matches the measured TUAS CLT family and carries CI,50-2500", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_x2_clt140_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(61);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(37.242344245020725);
    expect(result.floorSystemMatch?.impact.confidence.provenance).toBe("exact_floor_system_family");
  });

  it("matches the measured TUAS X3 staged-upper CLT row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_x3_clt140_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(52);
    expect(result.floorSystemMatch?.impact.CI).toBe(0);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(8);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(52);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(47.10786221887914, 5);
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x3/i.test(warning))
    ).toBe(false);
  });

  it("matches the measured TUAS X4 heavy dry-top CLT row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_x4_clt140_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(50);
    expect(result.floorSystemMatch?.impact.CI).toBe(1);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(8);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(51);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(55);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(53.20807486278851, 5);
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x2/i.test(warning))
    ).toBe(false);
  });

  it("keeps the measured TUAS X4 heavy dry-top row exact when the two gypsum boards are merged into one packed row", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_x4_clt140_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(50);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(55);
  });

  it("keeps the over-abstracted TUAS X4 heavy dry-top shorthand off the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.fitPercent).toBe(94);
    expect(result.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(result.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(result.impact?.LnW).toBe(65);
    expect(result.impact?.LnWPlusCI).toBe(65);
    expect(result.floorSystemRatings?.Rw).toBe(55);
  });

  it("matches the curated Knauf direct-fixed timber family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "impactstop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("knauf_ct2g_timber_r25_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(69);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(54);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(47);
  });

  it("matches the curated Knauf mounted timber family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("knauf_ct120_1c_timber_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(61);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(60);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(53);
  });

  it("matches the curated Knauf lighter mounted timber family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("knauf_ct30_1c_timber_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(67);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(60);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(53);
  });

  it("matches the curated Dataholz dry-floor family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdrtxn02b_timber_frame_dry_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(62);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(60);
  });

  it("keeps the curated Dataholz dry-floor family exact match when two 12.5 mm gypsum boards are entered as one 25 mm layer", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 25 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdrtxn02b_timber_frame_dry_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(62);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(60);
  });

  it("matches the curated Dataholz dry suspended family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdrtxa03b_timber_frame_dry_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(51);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(53);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(65);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(-9);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtrSemantic).toBe("ctr_term");
  });

  it("matches the curated Knauf concrete family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(51);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(63);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(57);
  });

  it("matches the curated Pliteq hollow-core vinyl family and carries it into the main impact lane", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 16 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 5 },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("pliteq_hcp200_vinyl_lab_2026");
    expect(result.impact?.basis).toBe("official_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(48);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(62);
  });

  it("matches the composite bare peer-reviewed floor family and keeps a non-empty impact result", () => {
    const result = calculateAssembly([{ floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }]);

    expect(result.floorSystemMatch?.system.id).toBe("pmc_m1_bare_composite_lab_2026");
    expect(result.impact?.basis).toBe("peer_reviewed_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(84);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(27);
  });

  it("matches the composite dry floating peer-reviewed floor family", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 60 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("pmc_m1_dry_floating_floor_lab_2026");
    expect(result.impact?.basis).toBe("peer_reviewed_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(68);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(47);
  });

  it("auto-derives predictor topology from visible layers for alias-rich UBIQ steel stacks", () => {
    const result = calculateAssembly([
      { materialId: "open_web_steel_joist", thicknessMm: 300, floorRole: "base_structure" },
      { materialId: "rubber_sheet", thicknessMm: 5, floorRole: "resilient_layer" },
      { materialId: "particleboard_flooring", thicknessMm: 19, floorRole: "floating_screed" },
      { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: 65, floorRole: "ceiling_cavity" },
      { materialId: "glasswool", thicknessMm: 145, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: 16, floorRole: "ceiling_board" }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(result.impact?.basis).toBe("official_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(51);
    expect(result.impact?.CI).toBe(-2);
    expect(result.impact?.LnWPlusCI).toBe(49);
    expect(result.floorSystemRatings?.Rw).toBe(64);
    expect(result.floorSystemRatings?.RwCtr).toBe(59);
    expect(result.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
    expect(result.impactPredictorStatus?.notes.some((note: string) => /derived from visible floor-role layers/i.test(note))).toBe(
      true
    );
  });

  it("auto-derives predictor topology from visible layers for alias-rich Knauf timber stacks", () => {
    const result = calculateAssembly([
      { materialId: "engineered_timber_structural", thicknessMm: 240, floorRole: "base_structure" },
      { materialId: "engineered_timber_flooring", thicknessMm: 15, floorRole: "floor_covering" },
      { materialId: "glasswool", thicknessMm: 90, floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: 13, floorRole: "ceiling_board" }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("knauf_ct30_1a_timber_lab_2026");
    expect(result.impact?.basis).toBe("official_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(73);
    expect(result.floorSystemRatings?.Rw).toBe(48);
    expect(result.floorSystemRatings?.RwCtr).toBe(42);
    expect(result.impactPredictorStatus?.inputMode).toBe("derived_from_visible_layers");
    expect(
      result.warnings.some((warning: string) => /derived from visible floor-role layers/i.test(warning))
    ).toBe(true);
  });

  it("matches the curated Dataholz dry CLT family", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(50);
    expect(result.floorSystemMatch?.impact.CI).toBe(-1);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(62);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeUndefined();
  });

  it("matches the curated Dataholz wet CLT fill family", () => {
    const result = calculateAssembly([
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 120 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s6", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn06_fill_clt_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(39);
    expect(result.floorSystemMatch?.impact.CI).toBe(-1);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(7);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(78);
  });

  it("carries the curated Dataholz wet CLT fill row into standardized L'nT,50 once the official CI50 companion is present", () => {
    const result = calculateAssembly([
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 120 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s6", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
    ], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn06_fill_clt_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(39);
    expect(result.floorSystemMatch?.impact.CI).toBe(-1);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(7);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(38);
    expect(result.impact?.LPrimeNW).toBe(41);
    expect(result.impact?.LPrimeNTw).toBe(39);
    expect(result.impact?.LPrimeNT50).toBe(46);
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500");
  });

  it("matches the curated Dataholz wet CLT no-lining family", () => {
    const result = calculateAssembly([
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 70 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 100 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 150 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn05_wet_clt_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(45);
    expect(result.floorSystemMatch?.impact.CI).toBe(-1);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(74);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeUndefined();
  });

  it("matches the curated Dataholz wet CLT 05 family with CI50 on the exact lane", () => {
    const result = calculateAssembly([
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
    ], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdmnxn02_05_wet_clt_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(47);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(4);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(74);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(-7);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtrSemantic).toBe("ctr_term");
    expect(result.impact?.LPrimeNW).toBe(49);
    expect(result.impact?.LPrimeNTw).toBe(47);
    expect(result.impact?.LPrimeNT50).toBe(51);
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500");
  });

  it("matches the curated Dataholz GDRNXA03B timber-frame row on the exact lane with local-guide L'nT,50 carry-over", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 25 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 }
    ], {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(result.floorSystemMatch?.system.id).toBe("dataholz_gdrnxa03b_timber_frame_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(47);
    expect(result.floorSystemMatch?.impact.CI).toBe(0);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBeUndefined();
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(47);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(74);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(-12);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtrSemantic).toBe("ctr_term");
    expect(result.impact?.LPrimeNW).toBe(49);
    expect(result.impact?.LPrimeNTw).toBe(47);
    expect(result.impact?.LPrimeNT50).toBe(47);
    expect(result.impact?.guideEstimateProfile).toBe("tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd");
  });

  it("matches the measured TUAS CLT 260 family", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c2_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(55);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(4);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(42);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(41.478540491108376, 5);
  });

  it("matches the measured TUAS C3 staged-upper CLT row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c3_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(47);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(6);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(54);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(51.413639069637696, 5);
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x3/i.test(warning))
    ).toBe(false);
  });

  it("matches the measured TUAS C4 heavy dry-top CLT row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(45);
    expect(result.floorSystemMatch?.impact.CI).toBe(1);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(6);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(46);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(61);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(58.831296422168144, 5);
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x2/i.test(warning))
    ).toBe(false);
  });

  it("keeps the measured TUAS C4 heavy dry-top row exact when the two gypsum boards are merged into one packed row", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c4_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(45);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(61);
  });

  it("keeps the over-abstracted TUAS C4 heavy dry-top shorthand off the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.fitPercent).toBe(94);
    expect(result.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(result.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(result.impact?.LnW).toBe(65);
    expect(result.impact?.LnWPlusCI).toBe(65);
    expect(result.floorSystemRatings?.Rw).toBe(55);
  });

  it("matches the measured TUAS C5 heavy dry-top CLT row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(60);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(62);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(61);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(59.492301808652826, 5);
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x4/i.test(warning))
    ).toBe(false);
  });

  it("keeps the measured TUAS C5 heavy dry-top row exact when the four gypsum boards are merged into one packed row", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c5_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(60);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(61);
  });

  it("keeps the over-abstracted TUAS C5 heavy dry-top shorthand off the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.fitPercent).toBe(94);
    expect(result.impact?.basis).toBe("predictor_mass_timber_clt_dry_interaction_estimate");
    expect(result.impact?.estimateCandidateIds).toEqual(["tuas_x5_clt140_measured_2026"]);
    expect(result.impact?.LnW).toBe(65);
    expect(result.impact?.LnWPlusCI).toBe(65);
    expect(result.floorSystemRatings?.Rw).toBe(55);
  });

  it("matches the measured TUAS C7 wet geotextile CLT row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c7_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(39);
    expect(result.floorSystemMatch?.impact.CI).toBe(1);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(40);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(57);
    expect(
      result.warnings.some((warning: string) =>
        /single-entry floor roles are duplicated: floating screed x2 \(Geotextile, Mineral Screed\)/i.test(warning)
      )
    ).toBe(false);
  });

  it("matches the measured TUAS C7c combined wet CLT row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c7c_clt260_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(30);
    expect(result.floorSystemMatch?.impact.CI).toBe(5);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(14);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(35);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(75);
    expect(
      result.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floating screed x2/i.test(warning)
      )
    ).toBe(false);
  });

  it("matches the measured TUAS concrete 160 family", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 160 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_h2_concrete160_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(47);
    expect(result.floorSystemMatch?.impact.CI).toBe(2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(49);
  });

  it("matches the measured TUAS open-box family-b basic row", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r2b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(46);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(62);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(59.973347663855776, 5);
  });

  it("matches the measured TUAS open-box family-a basic row", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r2a_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(61);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(4);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(44.52764215440286, 5);
  });

  it("matches the measured TUAS open-box staged dry-floor family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r3b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(39);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(5);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(70);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(67.58499572159022, 5);
  });

  it("matches the measured TUAS open-box family-a staged dry-floor family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r3a_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(56);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(56);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(51.30566236283586, 5);
  });

  it("keeps the measured TUAS open-box family-b basic row exact when two 13 mm gypsum boards are entered as one 26 mm layer", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 26 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r2b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(46);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(62);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(59.973347663855776, 5);
  });

  it("matches the measured TUAS open-box dry-floor family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(44);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(75);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(71.87531170772152, 5);
  });

  it("matches the measured TUAS open-box family-a dry-floor family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5a_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(64);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(2);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(63);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(57.78202920484737, 5);
  });

  it("matches the measured TUAS open-box wet screed family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 40 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r11b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(60);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(0);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(74);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(71.15477026441121, 5);
  });

  it("matches the measured TUAS open-box reinforced resilient-stud ceiling family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r6b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(47);
    expect(result.floorSystemMatch?.impact.CI).toBe(0);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(1);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(71);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(69.5361374042257, 5);
  });

  it("matches the measured TUAS open-box family-a EPS board plus screed branch", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r7a_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(63);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(60);
  });

  it("matches the measured TUAS mixed-board family-a row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r6a_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(60);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(56);
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: ceiling board x6/i.test(warning))
    ).toBe(false);
  });

  it("keeps the TUAS hybrid lower-treatment wet outlier off the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
  });

  it("keeps the measured TUAS open-box reinforced resilient-stud ceiling row exact when four 15 mm gypsum boards are entered as one 60 mm layer", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 60 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r6b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(47);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(1);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(71);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(69.5361374042257, 5);
  });

  it("keeps the measured TUAS mixed-board family-a row exact when the ceiling schedule is entered as 26 mm plus 60 mm gypsum packages", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 26 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 60 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r6a_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(60);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(56);
  });

  it("matches the measured TUAS staged upper-package family-a row on the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r10a_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(55);
    expect(result.floorSystemMatch?.impact.CI).toBe(0);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(1);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(55);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(56);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(50.89680103538985, 5);
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x3/i.test(warning))
    ).toBe(false);
  });

  it("matches the measured TUAS hybrid lower-treatment row on the exact route once the geotextile schedule lands", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r7b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(47);
    expect(result.floorSystemMatch?.impact.CI).toBe(0);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(1);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(47);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(72);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(70.726430817278, 5);
    expect(result.warnings.some((warning: string) => /single-entry floor roles are duplicated: ceiling cavity x2/i.test(warning))).toBe(
      false
    );
    expect(result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x2/i.test(warning))).toBe(
      false
    );
  });

  it("matches the measured TUAS finishless hybrid lower-treatment sibling on the exact route once the no-finish surface lands", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r8b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(50);
    expect(result.floorSystemMatch?.impact.CI).toBe(-1);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(0);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(72);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(70.60101885694094, 5);
    expect(result.warnings.some((warning: string) => /single-entry floor roles are duplicated: ceiling cavity x2/i.test(warning))).toBe(
      false
    );
    expect(result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floating screed x2/i.test(warning))).toBe(
      false
    );
  });

  it("matches the measured TUAS wet-top hybrid lower-treatment sibling on the exact route once the source stack is frozen correctly", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r9b_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(45);
    expect(result.floorSystemMatch?.impact.CI).toBe(1);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(3);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(46);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(68);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(67.01756572323127, 5);
    expect(result.warnings.some((warning: string) => /single-entry floor roles are duplicated: ceiling cavity x2/i.test(warning))).toBe(
      false
    );
  });

  it("matches the measured TUAS no-fill hybrid lower-treatment sibling on the exact route once the source stack is frozen correctly", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r2c_open_box_timber_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(70);
    expect(result.floorSystemMatch?.impact.CI).toBe(0);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(0);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(70);
    expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(54);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(53.34048310542768, 5);
    expect(result.warnings.some((warning: string) => /single-entry floor roles are duplicated: ceiling cavity x2/i.test(warning))).toBe(
      false
    );
  });

  it("keeps the over-abstracted TUAS staged upper-package shorthand off the exact route", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 33 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.floorSystemEstimate?.fitPercent).toBe(90);
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
  });

  it("matches the measured TUAS concrete dry-floor family", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 160 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_h5_concrete160_measured_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(46);
    expect(result.floorSystemMatch?.impact.CI50_2500).toBe(9);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(47);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBeCloseTo(64.50483471830356, 5);
  });

  it("matches the curated UBIQ open-web steel 200 family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_200_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(52);
    expect(result.floorSystemMatch?.impact.CI).toBe(-1);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(51);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(57);
  });

  it("matches the curated UBIQ open-web steel 300 family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(51);
    expect(result.floorSystemMatch?.impact.CI).toBe(-2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(59);
  });

  it("matches the curated UBIQ FL-24 open-web steel 300 family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl24_open_web_steel_300_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(54);
    expect(result.floorSystemMatch?.impact.CI).toBe(-2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(52);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(55);
  });

  it("matches the curated UBIQ FL-24 open-web steel 300 16 mm deck family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 16 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(54);
    expect(result.floorSystemMatch?.impact.CI).toBe(-2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(52);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(54);
  });

  it("matches the curated UBIQ FL-26 open-web steel 300 family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(53);
    expect(result.floorSystemMatch?.impact.CI).toBe(-2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(51);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(57);
  });

  it("matches the curated UBIQ FL-26 open-web steel 300 16 mm deck family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 16 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(53);
    expect(result.floorSystemMatch?.impact.CI).toBe(-2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(51);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(55);
  });

  it("matches the curated UBIQ open-web steel 300 16 mm deck family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 16 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_16mm_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(51);
    expect(result.floorSystemMatch?.impact.CI).toBe(-2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(57);
  });

  it("matches the curated UBIQ open-web steel 400 family", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_400_exact_lab_2026");
    expect(result.floorSystemMatch?.impact.LnW).toBe(50);
    expect(result.floorSystemMatch?.impact.CI).toBe(-2);
    expect(result.floorSystemMatch?.impact.LnWPlusCI).toBe(48);
    expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(59);
  });

  it("matches the curated UBIQ bound-only open-web steel family without fabricating an exact Ln,w metric", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.impact).toBeNull();
    expect(result.floorSystemMatch).toBeNull();
    expect(result.boundFloorSystemMatch?.system.id).toBe("ubiq_fl33_open_web_steel_300_lab_2026");
    expect(result.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(result.boundFloorSystemMatch?.system.airborneRatings.Rw).toBe(63);
    expect(result.boundFloorSystemMatch?.system.airborneRatings.RwCtr).toBe(58);
  });

  it("matches the curated UBIQ bound-only open-web steel 400 sibling on the conservative support lane", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
    ]);

    expect(result.impact).toBeNull();
    expect(result.floorSystemMatch).toBeNull();
    expect(result.boundFloorSystemMatch?.system.id).toBe("ubiq_fl33_open_web_steel_400_lab_2026");
    expect(result.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(result.boundFloorSystemMatch?.system.airborneRatings.Rw).toBe(63);
    expect(result.boundFloorSystemMatch?.system.airborneRatings.RwCtr).toBe(58);
  });

  it("interpolates the bound-only steel-joist family instead of fabricating an exact lightweight-steel Ln,w", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
    ]);

    expect(result.impact).toBeNull();
    expect(result.boundFloorSystemMatch).toBeNull();
    expect(result.boundFloorSystemEstimate?.kind).toBe("bound_interpolation");
    expect(result.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(52);
    expect(result.boundFloorSystemEstimate?.airborneRatings.Rw).toBe(62);
    expect(result.boundFloorSystemEstimate?.airborneRatings.RwCtr).toBe(57);
  });

  it("withholds lightweight-steel bound interpolation when single-entry roles are duplicated in the visible stack", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 }
    ]);

    expect(result.boundFloorSystemMatch).toBeNull();
    expect(result.boundFloorSystemEstimate).toBeNull();
    expect(result.lowerBoundImpact).toBeNull();
    expect(
      result.warnings.some((warning: string) => /single-entry floor roles are duplicated: floor covering x2/i.test(warning))
    ).toBe(true);
  });

  it("keeps lightweight-steel support-form ambiguity on a conservative crossover bound lane", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 300 }
    ]);

    expect(result.impact).toBeNull();
    expect(result.boundFloorSystemMatch).toBeNull();
    expect(result.boundFloorSystemEstimate?.kind).toBe("missing_support_form_bound");
    expect(result.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_missing_support_form_bound_estimate");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(result.boundFloorSystemEstimate?.airborneRatings.Rw).toBe(62);
    expect(result.boundFloorSystemEstimate?.airborneRatings.RwCtr).toBe(58);
    expect(
      result.warnings.some((warning: string) => /published bound-only family estimate active/i.test(warning))
    ).toBe(true);
  });

  it("collapses lightweight-steel support-form ambiguity when both official bound families converge", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 }
    ]);

    expect(result.impact).toBeNull();
    expect(result.boundFloorSystemMatch).toBeNull();
    expect(result.boundFloorSystemEstimate?.kind).toBe("bound_interpolation");
    expect(result.lowerBoundImpact?.basis).toBe("predictor_lightweight_steel_bound_interpolation_estimate");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(53);
    expect(result.boundFloorSystemEstimate?.airborneRatings.Rw).toBe(62);
    expect(result.boundFloorSystemEstimate?.airborneRatings.RwCtr).toBe(56);
    expect(result.boundFloorSystemEstimate?.sourceSystems.map((system: { id: string }) => system.id)).toEqual([
      "ubiq_fl32_steel_200_lab_2026",
      "ubiq_fl33_open_web_steel_200_lab_2026"
    ]);
    expect(result.warnings.some((warning: string) => /support form was left unspecified/i.test(warning))).toBe(false);
  });

  it("interpolates the lightweight-steel FL-28 family before falling back to a broad steel blend", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 75 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
    expect(result.impact?.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(51.4);
    expect(result.floorSystemEstimate?.impact.CI).toBe(-1.6);
    expect(result.floorSystemEstimate?.impact.LnWPlusCI).toBe(49.8);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(63.6);
    expect(result.floorSystemEstimate?.airborneRatings.RwCtr).toBe(58.1);
    expect(result.floorSystemEstimate?.airborneRatings.RwCtrSemantic).toBe("rw_plus_ctr");
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ]);
    expect(
      result.warnings.some((warning: string) => /lightweight steel FL-28 interpolation/i.test(warning))
    ).toBe(true);
  });

  it("matches an official REGUPOL product-system row before the narrow heavy-floor formula", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
      { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);

    expect(result.impactCatalogMatch?.catalog.id).toBe("regupol_sonus_curve_8_tile_match_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.confidence.provenance).toBe("official_product_catalog");
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
  });

  it("keeps official lower-bound wet-screed support visible while the narrow heavy-floor metric stays live", () => {
    const result = calculateAssembly([
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 70 },
      { floorRole: "resilient_layer", materialId: "regupol_sonus_curve_8", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
    ]);

    expect(result.impactCatalogMatch?.catalog.id).toBe("regupol_sonus_curve_8_wet_screed_lower_bound_2026");
    expect(result.impactCatalogMatch?.impact).toBeNull();
    expect(result.impactCatalogMatch?.lowerBoundImpact?.basis).toBe("predictor_catalog_lower_bound_official");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(47.9);
    expect(result.impact?.DeltaLw).toBe(27.7);
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(56);
    expect(result.lowerBoundImpact?.DeltaLwLowerBound).toBe(22);
    expect(
      result.warnings.some((warning: string) => /official lower-bound catalog support active/i.test(warning))
    ).toBe(true);
  });

  it("matches an official Getzner DeltaLw row as a heavy-reference product lane", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "getzner_afm_33", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);

    expect(result.impactCatalogMatch?.catalog.id).toBe("getzner_afm33_catalog_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_product_delta_official");
    expect(result.impact?.LnW).toBe(45);
    expect(result.impact?.DeltaLw).toBe(33);
    expect(result.impact?.confidence.provenance).toBe("official_product_catalog");
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_product_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_product_delta_official");
    expect(result.impactSupport?.formulaNotes.some((note: string) => /Ln,w = 78 - DeltaLw/i.test(note))).toBe(true);
  });

  it("rejects product-delta catalog support on the assembly route when explicit dynamic stiffness conflicts with the matched product", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
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
          dynamicStiffnessMNm3: 35,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(Number.isFinite(Number(result.impact?.DeltaLw))).toBe(false);
    expect(result.supportedImpactOutputs).toEqual([]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw"]);
  });

  it("keeps product-delta catalog support fail-closed on the assembly route outside explicit delta catalog mode", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
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
          productId: "getzner_afm_29",
          dynamicStiffnessMNm3: 10,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "material_layer",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(Number.isFinite(Number(result.impact?.DeltaLw))).toBe(false);
    expect(result.supportedImpactOutputs).toEqual([]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw"]);
  });

  it("matches official product-delta support on the assembly route with product identity alone when dynamic stiffness is omitted", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
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

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("getzner_afm26_catalog_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_product_delta_official");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_product_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_product_delta_official");
  });

  it("keeps exact lab Ln,w primary while filling missing DeltaLw from compatible product-delta support on the assembly route", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
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
          productId: "getzner_afm_29",
          dynamicStiffnessMNm3: 10,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("getzner_afm29_catalog_2026");
    expect(result.impact?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.LnW).toBe(53);
    expect(result.impact?.DeltaLw).toBe(29);
    expect(result.impact?.metricBasis?.LnW).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_product_delta_official");
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("keeps exact source DeltaLw primary over product-property catalog support on the assembly route", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      exactImpactSource: {
        ...EXACT_IMPACT_SOURCE_19,
        companionRatings: {
          DeltaLw: 18
        }
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
          productId: "getzner_afm_29",
          dynamicStiffnessMNm3: 10,
          thicknessMm: 10
        },
        floorCovering: {
          mode: "delta_lw_catalog"
        }
      },
      targetOutputs: ["DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("getzner_afm29_catalog_2026");
    expect(result.impact?.basis).toBe("exact_source_band_curve_iso7172");
    expect(result.impact?.DeltaLw).toBe(18);
    expect(result.impact?.metricBasis?.DeltaLw).toBe("exact_source_rating_override");
    expect(result.supportedImpactOutputs).toEqual(["DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("matches an exact official product-system row from predictor input even when heavy concrete support is only implied by the base slab", () => {
    const result = calculateAssembly([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 90 },
      { materialId: "glasswool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ], {
      calculator: "dynamic",
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
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
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_curve_8_tile_match_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("falls back to the narrow heavy-floor estimate on the assembly route when the covering class is missing", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floorCovering: {
          mode: "material_layer",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(59.1);
    expect(result.impact?.DeltaLw).toBe(15.5);
    expect(result.impactPredictorStatus?.notes.some((note: string) => /annex c style relation/i.test(note))).toBe(true);
  });

  it("falls back to the narrow heavy-floor estimate on the assembly route when the covering class conflicts with the official match", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "vinyl_flooring",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(61.1);
    expect(result.impact?.DeltaLw).toBe(13.5);
  });

  it("matches the porcelain planned-scope row on the assembly route only with the verified porcelain covering class", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_multi_4_5",
          thicknessMm: 4.5
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "porcelain_tile",
          thicknessMm: 10,
          densityKgM3: 2200
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_multi_45_porcelain_match_2026");
    expect(result.impact?.basis).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.LnW).toBe(61);
    expect(result.impact?.DeltaLw).toBe(17);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
  });

  it("keeps near-miss predictor input on the assembly route on the narrow heavy-floor estimate instead of fabricating catalog-backed outputs", () => {
    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
          thicknessMm: 8
        },
        floatingScreed: {
          materialClass: "generic_screed",
          thicknessMm: 35,
          densityKgM3: 2000
        },
        floorCovering: {
          mode: "material_layer",
          materialClass: "ceramic_tile",
          thicknessMm: 8,
          densityKgM3: 2000
        }
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(49.6);
    expect(result.impact?.DeltaLw).toBe(25);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps an exact predictor product-system row lab-side first while carrying field-side derivatives on the assembly route", () => {
    const result = calculateAssembly([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 90 },
      { materialId: "glasswool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ], {
      calculator: "dynamic",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 32
      },
      impactPredictorInput: {
        impactSystemType: "heavy_floating_floor",
        referenceFloorType: "heavy_standard",
        baseSlab: {
          materialClass: "heavy_concrete",
          thicknessMm: 150,
          densityKgM3: 2400
        },
        resilientLayer: {
          productId: "regupol_sonus_curve_8",
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
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(result.impactPredictorStatus?.matchedCatalogCaseId).toBe("regupol_sonus_curve_8_tile_match_2026");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LnW).toBe(50);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.LPrimeNW).toBe(52);
    expect(result.impact?.LPrimeNTw).toBe(51.9);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_catalog_exact_match_official");
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
    expect(result.impactPredictorStatus?.notes.some((note: string) => /lab-side first/i.test(note))).toBe(true);
  });

  it("keeps closest family recommendations visible when an exact match is not yet landed", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.floorSystemRecommendations[0]?.system.id).toBe("dataholz_gdrtxn01a_timber_frame_dry_lab_2026");
    expect(result.floorSystemRecommendations[0]?.missingSignals[0]).toMatch(/upper fill/i);
  });

  it("activates a published family estimate when a near-miss stack stays in the same dry timber branch", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.floorSystemEstimate?.structuralFamily).toBe("timber frame / joist");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(57.9);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(62.5);
    expect(result.floorSystemEstimate?.airborneRatings.RwCtr).toBe(-11.4);
    expect(result.floorSystemEstimate?.airborneRatings.RwCtrSemantic).toBe("ctr_term");
    expect(result.floorSystemRatings?.Rw).toBe(62.5);
    expect(result.floorSystemRatings?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
    expect(
      result.warnings.some((warning: string) => /published family estimate active: timber frame \/ joist family archetype/i.test(warning))
    ).toBe(true);
  });

  it("labels heavy concrete upper-treatment fallback with the published concrete predictor basis and candidate lineage", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
      { floorRole: "resilient_layer", materialId: "rockwool", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(50);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(58);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual(["regupol_curve8_concrete_tile_lab_2026"]);
    expect(result.impactPredictorStatus?.implementedFormulaEstimate).toBe(true);
    expect(result.impactSupport?.notes.some((note: string) => /published floor-system family estimate/i.test(note))).toBe(true);
    expect(result.impactPredictorStatus?.notes.some((note: string) => /annex c style relation/i.test(note))).toBe(true);
  });

  it("labels Dataholz CLT dry fallback with the dry-family predictor basis", () => {
    const result = calculateAssembly([
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 145 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(50);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(62);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual(["dataholz_gdmtxn01_dry_clt_lab_2026"]);
  });

  it("keeps the preset-only Dataholz integrated dry CLT row on the dry-family estimate lane instead of reopening the manual exact route", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(47);
    expect(result.floorSystemEstimate?.impact.CI).toBe(2);
    expect(result.floorSystemEstimate?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(65);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual(["dataholz_gdmtxa01a_clt_lab_2026"]);
  });

  it("keeps under-described dry CLT gypsum-fiberboard stacks on the same-family published blend", () => {
    const result = calculateAssembly(
      [
        { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 },
        { materialId: "generic_fill", thicknessMm: 70 },
        { materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
        { materialId: "clt_panel", thicknessMm: 145 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "mass_timber_clt",
          impactSystemType: "dry_floating_floor",
          baseSlab: {
            thicknessMm: 145
          },
          resilientLayer: {
            thicknessMm: 20
          },
          upperFill: {
            materialClass: "generic_fill",
            thicknessMm: 70
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "dry_floating_gypsum_fiberboard",
            thicknessMm: 22
          }
        }
      }
    );

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(50);
    expect(result.floorSystemEstimate?.impact.CI).toBe(-1);
    expect(result.floorSystemEstimate?.impact.LnWPlusCI).toBe(49);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(62);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual(["dataholz_gdmtxn01_dry_clt_lab_2026"]);
  });

  it("labels CLT upper-only fallback with the measured bare interpolation basis", () => {
    const result = calculateAssembly([
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 4 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 10 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 180 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(57.7);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(40.6);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "tuas_x2_clt140_measured_2026",
      "tuas_c2_clt260_measured_2026",
      "tuas_x4_clt140_measured_2026"
    ]);
  });

  it("keeps under-described CLT upper-plus-lower direct-fixed stacks on the fail-closed screening lane", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 4 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 220 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.impact).toBeNull();
    expect(result.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(result.floorSystemRatings?.Rw).toBe(49);
    expect(result.floorSystemRecommendations).toHaveLength(8);
    expect(
      result.warnings.some((warning: string) =>
        /No curated exact floor-system landed\. Closest family candidate is TUAS C2c \| CLT 260 mm \| EPS underlay \+ laminate \+ suspended ceiling\./i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("keeps thin-underlay wet CLT suspended stacks on the Dataholz suspended-family lane on the assembly route", () => {
    const result = calculateAssembly([
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 4 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 65 },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(49.5);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(61.5);
    expect(result.floorSystemEstimate?.airborneRatings.RwCtr).toBe(-7);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "dataholz_gdmnxa02a_00_clt_lab_2026",
      "dataholz_gdmnxa02a_02_clt_lab_2026"
    ]);
    expect(result.warnings.some((warning: string) => /derived from visible floor-role layers/i.test(warning))).toBe(true);
  });

  it("keeps open-box dry-floor stacks on the stronger TUAS archetype lane on the assembly route", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 57 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 53 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.floorSystemEstimate?.impact.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.floorSystemEstimate?.impact.LnW).toBe(44);
    expect(result.floorSystemEstimate?.impact.CI).toBe(0);
    expect(result.floorSystemEstimate?.impact.LnWPlusCI).toBe(44);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(75);
    expect(result.floorSystemEstimate?.airborneRatings.RwCtr).toBe(71.87531170772152);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual(["tuas_r5b_open_box_timber_measured_2026"]);
  });

  it("caps displayed family fit when mixed single-entry roles keep the open-box dry-floor topology ambiguous", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "bonded_chippings", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.fitPercent).toBe(54);
    expect(result.floorSystemEstimate?.notes.some((note: string) => /Archetype-level family matching was withheld/i.test(note))).toBe(
      true
    );
    expect(
      result.floorSystemEstimate?.notes.some((note: string) =>
        /Displayed fit was capped from .* to 54%/i.test(note)
      )
    ).toBe(true);
    expect(
      result.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: upper fill x2/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("withholds the open-box archetype lane when upper fill is split into multiple same-material schedules", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 30 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.fitPercent).toBe(54);
    expect(
      result.floorSystemEstimate?.notes.some((note: string) =>
        /single-entry roles are duplicated or split in the visible stack: upper fill x2 \(Generic Fill\)/i.test(note)
      )
    ).toBe(true);
    expect(
      result.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: upper fill x2 \(Generic Fill\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("refuses curated exact matching when resilient layer is split across disjoint same-material schedules", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.fitPercent).toBe(54);
    expect(
      result.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: resilient layer x2 \(EPS Underlay\)/i.test(
          warning
        )
      )
    ).toBe(true);
  });

  it("still allows exact matching when a single-entry role is only split contiguously into the same material package", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1.5 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(
      result.warnings.some((warning: string) => /Visible-layer predictor matching is parked because single-entry floor roles are duplicated/i.test(warning))
    ).toBe(false);
  });

  it("keeps a generic-fill plus screed lookalike off the new TUAS R7a exact corridor", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds ?? []).not.toContain("tuas_r2b_open_box_timber_measured_2026");
  });

  it("keeps generic steel-joist ceiling-only stacks on a non-empty lightweight-steel family path", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(53.3);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
      "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
      "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
    ]);
    expect(result.floorSystemEstimate?.structuralFamily).toBe("lightweight steel");
  });

  it("matches upstream Knauf timber archetype numbers on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "timber_joists",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: {
            thicknessMm: 240
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "engineered_timber"
          },
          lowerTreatment: {
            type: "direct_fixed_ceiling",
            cavityFillThicknessMm: 45,
            boardLayerCount: 1,
            boardThicknessMm: 12,
            boardMaterialClass: "impactstop_board",
            supportClass: "furred_channels"
          }
        },
        targetOutputs: ["Ln,w"]
      }
    );

    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(69.6);
    expect(result.floorSystemRatings?.Rw).toBe(51.2);
    expect(result.floorSystemRatings?.RwCtr).toBe(44.9);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_ct2g_timber_nil_lab_2026",
      "knauf_ct2g_timber_r25_lab_2026",
      "knauf_ct2h_timber_nil_lab_2026"
    ]);
  });

  it("matches the Dataholz dry timber integrated-row estimate on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 15 },
        { materialId: "air_gap", thicknessMm: 60 },
        { materialId: "rockwool", thicknessMm: 200 },
        { materialId: "gypsum_board", thicknessMm: 15 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "timber_joists",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: {
            thicknessMm: 200
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "dry_floating_gypsum_fiberboard",
            thicknessMm: 65
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 60,
            cavityFillThicknessMm: 200,
            boardLayerCount: 1,
            boardThicknessMm: 15
          }
        },
        targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
      }
    );

    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.CI).toBe(1);
    expect(result.impact?.LnWPlusCI).toBe(53);
    expect(result.floorSystemRatings?.Rw).toBe(66);
    expect(result.floorSystemRatings?.RwCtr).toBe(-15);
    expect(result.impact?.estimateCandidateIds).toEqual(["dataholz_gdrtxa06a_timber_frame_dry_lab_2026"]);
  });

  it("matches upstream steel broader family numbers on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "steel_joists",
          supportForm: "open_web_or_rolled",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: {
            thicknessMm: 300
          },
          floatingScreed: {
            thicknessMm: 19
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "carpet_with_foam_underlay",
            thicknessMm: 8
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 65,
            cavityFillThicknessMm: 145,
            boardLayerCount: 3,
            boardThicknessMm: 16
          }
        },
        targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
      }
    );

    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(51);
    expect(result.impact?.CI).toBe(-1.7);
    expect(result.impact?.LnWPlusCI).toBe(49.3);
    expect(result.floorSystemRatings?.Rw).toBe(63.7);
    expect(result.floorSystemRatings?.RwCtr).toBe(58.4);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ]);
  });

  it("keeps near-match concrete timber-underlay visible-layer stacks on the Knauf concrete archetype lane", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 60 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 110 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 18 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 165 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(51);
    expect(result.floorSystemRatings?.Rw).toBe(63);
    expect(result.floorSystemRatings?.RwCtr).toBe(57);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("keeps near-match concrete tile-ceiling visible-layer stacks on the Knauf tile archetype lane", () => {
    const result = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 310 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 205 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(45);
    expect(result.floorSystemRatings?.Rw).toBe(69);
    expect(result.floorSystemRatings?.RwCtr).toBe(64);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("keeps near-match concrete tile-underlay ceiling visible-layer stacks on the combined Knauf tile archetype lane", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
        { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 310 },
        { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 5 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 205 }
      ],
      {
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.LnW).toBe(45);
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.floorSystemRatings?.Rw).toBe(69);
    expect(result.floorSystemRatings?.RwCtr).toBe(64);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
    ]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedImpactOutputs).toEqual(["DeltaLw"]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });

  it("carries exact family rows into direct standardized field outputs on the main impact lane", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
        { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 100 },
        { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
      ],
      {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        }
      }
    );

    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LnW).toBe(51);
    expect(result.impact?.LPrimeNW).toBe(53);
    expect(result.impact?.LPrimeNTw).toBe(51);
    expect(result.impact?.metricBasis?.LnW).toBe("official_floor_system_exact_match");
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.impactSupport?.formulaNotes.some((note: string) => /L'nT,w = L'n,w \+ 10 log10\(31\.3 \/ V\)/i.test(note))).toBe(true);
  });

  it("carries predictor-backed heavy floors into direct standardized field outputs on the main impact lane", () => {
    const result = calculateAssembly(
      [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }],
      {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        }
      }
    );

    expect(result.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LnW).toBe(74.5);
    expect(result.impact?.LPrimeNW).toBe(76.5);
    expect(result.impact?.LPrimeNTw).toBe(74.5);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_bare_massive_floor_iso12354_annexc_estimate");
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
  });

  it("carries predictor-backed timber dry-family estimates into live field continuation on the main impact lane", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
        { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
        { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
        { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
      ],
      {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
      }
    );

    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("mixed_predicted_plus_estimated_local_guide");
    expect(result.impact?.LnW).toBe(57.9);
    expect(result.impact?.CI).toBe(2);
    expect(result.impact?.LnWPlusCI).toBe(59.9);
    expect(result.impact?.LPrimeNW).toBe(59.9);
    expect(result.impact?.LPrimeNTw).toBe(57.9);
    expect(result.impact?.LPrimeNT50).toBe(59.9);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "dataholz_gdrtxn01a_timber_frame_dry_lab_2026",
      "dataholz_gdrtxn02b_timber_frame_dry_lab_2026",
      "dataholz_gdrtxa03b_timber_frame_dry_lab_2026"
    ]);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd");
    expect(result.supportedImpactOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("carries predictor-backed composite ceiling-only low-confidence estimates into live standardized field continuation", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
        { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
        { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
      ],
      {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["L'n,w", "L'nT,w"]
      }
    );

    expect(result.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(result.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LnW).toBe(63.3);
    expect(result.impact?.LPrimeNW).toBe(65.3);
    expect(result.impact?.LPrimeNTw).toBe(63.3);
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.impact?.estimateCandidateIds).toEqual([
      "pmc_m1_bare_composite_lab_2026",
      "pmc_m1_dry_floating_plus_c2x_lab_2026",
      "pmc_m1_dry_floating_plus_c1x_lab_2026",
      "pmc_m1_dry_floating_floor_lab_2026"
    ]);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result.impact?.metricBasis?.LPrimeNW).toBe("estimated_field_lprimenw_from_lnw_plus_k");
    expect(result.impact?.metricBasis?.LPrimeNTw).toBe("estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume");
    expect(result.supportedImpactOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("carries exact family CI,50-2500 into direct L'nT,50 on the main impact lane", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
        { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
        { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
      ],
      {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        }
      }
    );

    expect(result.floorSystemMatch?.system.id).toBe("tuas_c2_clt260_measured_2026");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.LPrimeNW).toBe(57);
    expect(result.impact?.LPrimeNTw).toBe(55);
    expect(result.impact?.LPrimeNT50).toBe(59);
    expect(result.impact?.metricBasis?.CI50_2500).toBe("open_measured_floor_system_exact_match");
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500");
    expect(result.impactSupport?.formulaNotes.some((note: string) => /L'nT,50 was computed as L'nT,w \+ CI,50-2500/i.test(note))).toBe(true);
  });

  it("carries exact family Ln,w+CI into direct Turkish simple-guide L'nT,50 on the main impact lane", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
        { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
        { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
        { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
        { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
      ],
      {
        impactFieldContext: {
          guideMassRatio: 3.4,
          receivingRoomVolumeM3: 32
        }
      }
    );

    expect(result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_300_exact_lab_2026");
    expect(result.impact?.basis).toBe("mixed_exact_plus_estimated_local_guide");
    expect(result.impact?.LnW).toBe(51);
    expect(result.impact?.LnWPlusCI).toBe(49);
    expect(result.impact?.LPrimeNW).toBe(55);
    expect(result.impact?.LPrimeNT50).toBe(53);
    expect(result.impact?.guideEstimateProfile).toBe("tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd");
    expect(result.impact?.guideEstimateKCorrectionDb).toBe(4);
    expect(result.impact?.guideEstimateKSource).toBe("lookup_from_mass_ratio");
    expect(result.impact?.guideEstimateHdCorrectionDb).toBe(0);
    expect(result.impact?.guideEstimateHdSource).toBe("lookup_from_receiving_room_volume");
    expect(result.impact?.guideEstimateMassRatioBracket).toBe("3 < r <= 5");
    expect(result.impact?.guideEstimateReceivingRoomVolumeBracket).toBe("30 <= V < 50");
    expect(result.impact?.metricBasis?.LnW).toBe("official_floor_system_exact_match");
    expect(result.impact?.metricBasis?.LnWPlusCI).toBe("official_floor_system_exact_match");
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd");
    expect(result.impactSupport?.formulaNotes.some((note: string) => /L'nT,50 was computed as Ln,w\+CI \+ K \+ Hd/i.test(note))).toBe(true);
  });

  it("carries predictor-backed Ln,w+CI into direct Turkish simple-guide L'nT,50 on the main impact lane", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
        { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
        { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
        { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
      ],
      {
        impactFieldContext: {
          guideHdDb: 0,
          guideMassRatio: 3.4
        }
      }
    );

    expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(result.impact?.basis).toBe("mixed_predicted_plus_estimated_local_guide");
    expect(result.impact?.LnW).toBe(57.9);
    expect(result.impact?.CI).toBe(2);
    expect(result.impact?.LnWPlusCI).toBe(59.9);
    expect(result.impact?.LPrimeNW).toBe(61.9);
    expect(result.impact?.LPrimeNT50).toBe(63.9);
    expect(result.impact?.guideEstimateProfile).toBe("tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd");
    expect(result.impact?.guideEstimateKSource).toBe("lookup_from_mass_ratio");
    expect(result.impact?.guideEstimateHdSource).toBe("explicit_input");
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.metricBasis?.LnWPlusCI).toBe("predictor_floor_system_family_archetype_estimate");
    expect(result.impact?.metricBasis?.LPrimeNT50).toBe("estimated_local_guide_tr_simple_method_lnwci_plus_k_plus_hd");
  });

  it("carries bound-only floor families into direct conservative field-side upper bounds", () => {
    const result = calculateAssembly(
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
        }
      }
    );

    expect(result.impact).toBeNull();
    expect(result.lowerBoundImpact?.basis).toBe("mixed_bound_plus_estimated_standardized_field_volume_normalization");
    expect(result.lowerBoundImpact?.LnWUpperBound).toBe(51);
    expect(result.lowerBoundImpact?.LPrimeNWUpperBound).toBe(53);
    expect(result.lowerBoundImpact?.LPrimeNTwUpperBound).toBe(51);
  });

  it("treats bound-only impact support as requested-output coverage when upper-bound metrics are available", () => {
    const result = calculateAssembly(
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
    );

    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(result.unsupportedImpactOutputs).toEqual(["IIC"]);
  });

  it("can resolve heavy floating-floor impact from predictor input while keeping airborne screening on the visible stack", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
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
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.metrics.estimatedRwDb).toBe(26.9);
    expect(result.impact?.basis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.LnW).toBe(50.3);
    expect(result.impact?.DeltaLw).toBe(24.3);
    expect(result.warnings.some((warning: string) => /predictor input is active/i.test(warning))).toBe(true);
  });

  it("resolves explicit DeltaLw predictor input before drifting into family fallback on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
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
            deltaLwDb: 26
          }
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.metrics.estimatedRwDb).toBe(26.9);
    expect(result.impact?.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.bareReferenceLnW).toBe(78);
    expect(result.impact?.treatedReferenceLnW).toBe(52);
    expect(result.impact?.referenceFloorType).toBe("heavy_standard");
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_explicit_delta_user_input");
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.boundFloorSystemEstimate).toBeNull();
    expect(result.floorSystemRatings?.basis).toBe("predictor_heavy_concrete_floor_airborne_companion_estimate");
    expect(result.floorSystemRatings?.Rw).toBe(58);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual([]);
  });

  it("keeps explicit DeltaLw predictor input primary when a product id would otherwise trigger product-delta catalog support on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
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
            productId: "getzner_afm_29",
            dynamicStiffnessMNm3: 10,
            thicknessMm: 10
          },
          floorCovering: {
            mode: "delta_lw_catalog",
            deltaLwDb: 24
          }
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.impactPredictorStatus?.matchedCatalogCaseId ?? "").toBe("");
    expect(result.impact?.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.LnW).toBe(54);
    expect(result.impact?.DeltaLw).toBe(24);
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_explicit_delta_user_input");
  });

  it("keeps explicit DeltaLw predictor input lab-side when field context is present on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
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
            deltaLwDb: 26
          }
        },
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        },
        targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
      }
    );

    expect(result.impact?.basis).toBe("predictor_explicit_delta_heavy_reference_derived");
    expect(result.impact?.LnW).toBe(52);
    expect(result.impact?.DeltaLw).toBe(26);
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedImpactOutputs).toEqual(["L'n,w", "L'nT,w"]);
  });

  it("can resolve the published composite-panel dry-floor interaction estimate on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "composite_panel",
          impactSystemType: "dry_floating_floor",
          baseSlab: {
            thicknessMm: 65
          },
          resilientLayer: {
            thicknessMm: 12
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "dry_floating_gypsum_fiberboard",
            thicknessMm: 20,
            densityKgM3: 900
          }
        },
        targetOutputs: ["Ln,w"]
      }
    );

    expect(result.metrics.estimatedRwDb).toBe(26.9);
    expect(result.impact?.basis).toBe("predictor_composite_panel_published_interaction_estimate");
    expect(result.impact?.LnW).toBe(69.4);
    expect(result.floorSystemRatings?.Rw).toBe(45.1);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "pmc_m1_dry_floating_floor_lab_2026",
      "pmc_m1_bare_composite_lab_2026"
    ]);
  });

  it("can resolve the published heavy-concrete upper-treatment estimate on the assembly route when dynamic stiffness is omitted", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "heavy_floating_floor",
          baseSlab: {
            materialClass: "heavy_concrete",
            thicknessMm: 150,
            densityKgM3: 2400
          },
          resilientLayer: {
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
        targetOutputs: ["Ln,w"]
      }
    );

    expect(result.metrics.estimatedRwDb).toBe(26.9);
    expect(result.impact?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(result.impact?.LnW).toBe(50);
    expect(result.floorSystemRatings?.Rw).toBe(58);
    expect(result.floorSystemRatings?.RwCtr).toBe(-6.7);
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual(["regupol_curve8_concrete_tile_lab_2026"]);
  });

  it("keeps lightweight-concrete floating floors off the heavy-concrete-specific impact lanes", () => {
    const result = calculateAssembly(
      [
        { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
        { materialId: "screed", thicknessMm: 50, floorRole: "floating_screed" },
        { materialId: "generic_resilient_underlay", thicknessMm: 8, floorRole: "resilient_layer" },
        { materialId: "lightweight_concrete", thicknessMm: 150, floorRole: "base_structure" }
      ],
      {
        targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
      }
    );

    expect(result.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(result.impact?.LnW).toBe(64.3);
    expect(result.floorSystemRatings?.Rw).toBe(53);
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "tuas_h2_concrete160_measured_2026",
      "euracoustics_f0_bare_concrete_lab_2026"
    ]);
  });

  it("fails closed on the assembly route when base_structure is assigned to a non-structural floor helper", () => {
    const gypsumBaseResult = calculateAssembly(
      [{ materialId: "gypsum_board", thicknessMm: 100, floorRole: "base_structure" }],
      { targetOutputs: ["Rw", "Ln,w"] }
    );

    expect(gypsumBaseResult.impact).toBeNull();
    expect(gypsumBaseResult.floorSystemEstimate).toBeNull();
    expect(gypsumBaseResult.supportedImpactOutputs).toEqual([]);
    expect(gypsumBaseResult.unsupportedImpactOutputs).toEqual(["Ln,w"]);

    const airGapBaseResult = calculateAssembly(
      [{ materialId: "air_gap", thicknessMm: 100, floorRole: "base_structure" }],
      { targetOutputs: ["Rw", "Ln,w"] }
    );

    expect(airGapBaseResult.impact).toBeNull();
    expect(airGapBaseResult.floorSystemEstimate).toBeNull();
    expect(airGapBaseResult.supportedImpactOutputs).toEqual([]);
    expect(airGapBaseResult.unsupportedImpactOutputs).toEqual(["Ln,w"]);
  });

  it("can resolve curated floor-system ids from predictor input on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "timber_joists",
          officialFloorSystemId: "knauf_ct30_1c_timber_lab_2026"
        },
        targetOutputs: ["Rw", "Ln,w"]
      }
    );

    expect(result.floorSystemMatch?.system.id).toBe("knauf_ct30_1c_timber_lab_2026");
    expect(result.impact?.LnW).toBe(67);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w"]);
  });

  it("can drive lightweight-steel interpolation from predictor input on the assembly route", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "steel_joists",
          supportForm: "open_web_or_rolled",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: {
            thicknessMm: 250
          },
          floatingScreed: {
            thicknessMm: 19
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "engineered_timber_with_acoustic_underlay",
            thicknessMm: 20
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 75,
            cavityFillThicknessMm: 145,
            boardLayerCount: 3,
            boardThicknessMm: 16,
            boardMaterialClass: "fire_board"
          }
        },
        targetOutputs: ["Ln,w", "CI", "Ln,w+CI"]
      }
    );

    expect(result.impact?.basis).toBe("predictor_lightweight_steel_fl28_interpolation_estimate");
    expect(result.impact?.LnW).toBe(51.4);
    expect(result.impact?.CI).toBe(-1.6);
    expect(result.floorSystemEstimate?.airborneRatings.Rw).toBe(63.6);
  });

  it("keeps layer-driven steel joist vinyl stacks on the upstream low-confidence Pliteq lane", () => {
    const result = calculateAssembly(
      [
        { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 },
        { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
        { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
        { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
        { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "steel_joists",
          supportForm: "joist_or_purlin",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: { thicknessMm: 250, densityKgM3: 7850 },
          floorCovering: {
            mode: "material_layer",
            materialClass: "vinyl_flooring",
            thicknessMm: 3,
            densityKgM3: 1400
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 120,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16,
            boardMaterialClass: "firestop_board"
          }
        },
        targetOutputs: ["Ln,w", "Rw", "Ctr"]
      }
    );

    expect(result.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(result.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result.impact?.LnW).toBe(58.3);
    expect(result.floorSystemRatings?.Rw).toBe(61);
    expect(result.floorSystemRatings?.RwCtr).toBe(57);
    expect(result.impact?.estimateCandidateIds).toEqual([
      "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      "ubiq_fl32_steel_200_lab_2026",
      "ubiq_fl32_steel_300_lab_2026",
      "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
      "pliteq_steel_joist_250_rst02_wood_lab_2026"
    ]);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(true);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps timber bare-floor laminate layer stacks on the upstream low-confidence lane with ambiguous airborne companions withheld", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 9 },
        { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
      ],
      {
        targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]
      }
    );

    expect(result.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(result.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result.impact?.LnW).toBe(61.3);
    expect(result.impact?.CI).toBe(2);
    expect(result.impact?.LnWPlusCI).toBe(63.3);
    expect(result.floorSystemRatings?.Rw).toBe(51.6);
    expect(result.floorSystemRatings?.RwCtr).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ctr"]);
  });

  it("keeps combined reinforced-concrete predictor input on the upstream low-confidence lane", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 120,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        },
        targetOutputs: ["Ln,w"]
      }
    );

    expect(result.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result.impact?.LnW).toBe(50);
    expect(result.floorSystemRatings?.Rw).toBe(65.9);
    expect(result.floorSystemRatings?.RwCtr).toBe(57);
    expect(result.impactPredictorStatus?.implementedFamilyEstimate).toBe(true);
    expect(result.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(true);
  });

  it("applies structured airborne leakage and field-flanking overlays without altering the impact lane", () => {
    const layers = [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "rockwool", thicknessMm: 75 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ] as const;

    const lab = calculateAssembly(layers, {
      targetOutputs: ["Rw"]
    });
    const field = calculateAssembly(layers, {
      airborneContext: {
        airtightness: "poor",
        contextMode: "field_between_rooms",
        electricalBoxes: "back_to_back",
        junctionQuality: "poor",
        penetrationState: "major",
        perimeterSeal: "poor",
        sharedTrack: "shared"
      },
      targetOutputs: ["Rw"]
    });

    expect(field.metrics.estimatedRwDb).toBeLessThan(lab.metrics.estimatedRwDb);
    expect(field.metrics.estimatedRwDb).toBeGreaterThanOrEqual(0);
    expect(field.airborneOverlay?.leakagePenaltyApplied).toBe(true);
    expect(field.airborneOverlay?.fieldFlankingPenaltyApplied).toBe(true);
    expect(field.airborneOverlay?.detectedFamily).toBe("cavity_wall_surrogate");
    expect(field.airborneOverlay?.junctionFlankingGraph?.totalPenaltyDb).toBeGreaterThan(0);
    expect(field.airborneOverlay?.junctionFlankingGraph?.paths.some((path: { active: boolean }) => path.active)).toBe(true);
    expect(field.impact).toBeNull();
    expect(field.warnings.some((warning: string) => /Airborne leakage overlay active/i.test(warning))).toBe(true);
    expect(field.warnings.some((warning: string) => /Airborne field-side overlay active/i.test(warning))).toBe(true);
  });

  it("derives apparent airborne and field level-difference outputs when field geometry is defined", () => {
    const layers = [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "rockwool", thicknessMm: 75 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ] as const;

    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms",
        panelWidthMm: 3000,
        panelHeightMm: 2800,
        receivingRoomVolumeM3: 42,
        receivingRoomRt60S: 0.6
      },
      targetOutputs: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
    });

    expect(result.ratings.iso717.descriptor).toBe("R'w");
    expect(result.metrics.estimatedRwPrimeDb).toBe(result.ratings.iso717.Rw);
    expect(result.ratings.field?.RwPrime).toBe(result.metrics.estimatedRwPrimeDb);
    expect(result.ratings.field?.DnTw).toBe(result.metrics.estimatedDnTwDb);
    expect(result.ratings.field?.DnTA).toBe(result.metrics.estimatedDnTADb);
    expect(result.ratings.field?.DnW).toBe(result.metrics.estimatedDnWDb);
    expect(result.ratings.field?.DnA).toBe(result.metrics.estimatedDnADb);
    expect(result.metrics.estimatedDnTwDb).toBeGreaterThan(result.metrics.estimatedRwPrimeDb ?? 0);
    expect(result.metrics.estimatedDnWDb).toBeGreaterThan(0);
    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("trims mixed security-board double-stud field surrogates without disturbing symmetric siblings", () => {
    const securityMixedDoubleStud = calculateAssembly([
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 73 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 73 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ], {
      airborneContext: {
        contextMode: "field_between_rooms",
        connectionType: "line_connection",
        studType: "light_steel_stud",
        studSpacingMm: 600,
        airtightness: "good",
        perimeterSeal: "good",
        penetrationState: "none",
        junctionQuality: "good",
        sharedTrack: "independent",
        electricalBoxes: "none",
        panelWidthMm: 3000,
        panelHeightMm: 2600,
        receivingRoomVolumeM3: 30,
        receivingRoomRt60S: 0.5
      },
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w", "DnT,A"]
    });
    const symmetricDoubleStud = calculateAssembly([
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 70 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ], {
      airborneContext: {
        contextMode: "field_between_rooms",
        connectionType: "line_connection",
        studType: "light_steel_stud",
        studSpacingMm: 600,
        airtightness: "good",
        perimeterSeal: "good",
        penetrationState: "none",
        junctionQuality: "good",
        sharedTrack: "independent",
        electricalBoxes: "none",
        panelWidthMm: 3000,
        panelHeightMm: 2600,
        receivingRoomVolumeM3: 30,
        receivingRoomRt60S: 0.5
      },
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w", "DnT,A"]
    });

    expect(securityMixedDoubleStud.metrics.estimatedDnTADb).toBe(52);
    expect(securityMixedDoubleStud.dynamicAirborneTrace?.strategy).toContain(
      "mixed_security_board_double_stud_field_trim"
    );
    expect(
      securityMixedDoubleStud.warnings.some((warning: string) =>
        /mixed security-board double-stud field trim/i.test(warning)
      )
    ).toBe(true);
    expect(symmetricDoubleStud.metrics.estimatedDnTADb).toBe(52);
    expect(symmetricDoubleStud.dynamicAirborneTrace?.strategy).not.toContain(
      "mixed_security_board_double_stud_field_trim"
    );
  });

  it("treats Rw as unavailable once the airborne lane is explicitly apparent", () => {
    const layers = [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "rockwool", thicknessMm: 75 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ] as const;

    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms"
      },
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(result.ratings.iso717.descriptor).toBe("R'w");
    expect(result.supportedTargetOutputs).toEqual(["R'w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "DnT,w"]);
    expect(result.warnings.some((warning: string) => /field conversion is incomplete/i.test(warning))).toBe(true);
  });

  it("keeps Dn,w available from partition geometry even when DnT,w still lacks room volume", () => {
    const layers = [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "rockwool", thicknessMm: 75 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ] as const;

    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms",
        panelWidthMm: 3000,
        panelHeightMm: 2800
      },
      targetOutputs: ["Dn,w", "Dn,A", "DnT,w"]
    });

    expect(result.metrics.estimatedDnWDb).toBeGreaterThan(0);
    expect(result.metrics.estimatedDnADb).toBeGreaterThan(0);
    expect(result.metrics.estimatedDnTwDb).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Dn,w", "Dn,A"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DnT,w"]);
    expect(result.warnings.some((warning: string) => /field conversion is incomplete/i.test(warning))).toBe(true);
  });

  it("keeps floor-carrier Rw exposed on the assembly route even when the airborne descriptor is apparent", () => {
    const result = calculateAssembly(
      [
        { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 },
        { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
        { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
        { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      {
        airborneContext: {
          contextMode: "field_between_rooms"
        },
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 55
        },
        targetOutputs: ["Rw", "R'w", "Ln,w", "L'n,w", "L'nT,w"]
      }
    );

    expect(result.ratings.iso717.descriptor).toBe("R'w");
    expect(result.floorSystemRatings?.Rw).toBe(65);
    expect(result.metrics.estimatedRwPrimeDb).toBeGreaterThan(0);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "R'w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("restores screening-backed concrete floor Rw on room-to-room routes without reopening fail-closed lightweight carriers", () => {
    const roomToRoomOptions = {
      airborneContext: {
        contextMode: "field_between_rooms" as const,
        panelHeightMm: 2800,
        panelWidthMm: 3200,
        receivingRoomRt60S: 0.6,
        receivingRoomVolumeM3: 55
      },
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      targetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const
    };
    const concreteBare = calculateAssembly(
      [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }],
      roomToRoomOptions
    );
    const concreteCeilingOnly = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
        { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 90 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
      ],
      roomToRoomOptions
    );
    const rawConcreteCeilingHelper = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 16 },
        { materialId: "genieclip_rst", thicknessMm: 90 },
        { materialId: "rockwool", thicknessMm: 90 },
        { materialId: "concrete", thicknessMm: 150 }
      ],
      roomToRoomOptions
    );
    const openBoxBare = calculateAssembly(
      [{ floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }],
      roomToRoomOptions
    );
    const wallLikeConcreteHybrid = calculateAssembly(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "concrete", thicknessMm: 120 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      roomToRoomOptions
    );

    expect(concreteBare.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(concreteBare.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(concreteBare.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(concreteBare.unsupportedTargetOutputs).toEqual([]);

    expect(concreteCeilingOnly.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(concreteCeilingOnly.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(concreteCeilingOnly.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(concreteCeilingOnly.unsupportedTargetOutputs).toEqual([]);

    expect(rawConcreteCeilingHelper.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(rawConcreteCeilingHelper.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(rawConcreteCeilingHelper.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(rawConcreteCeilingHelper.unsupportedTargetOutputs).toEqual([]);

    expect(openBoxBare.impact).toBeNull();
    expect(openBoxBare.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(openBoxBare.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(openBoxBare.unsupportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w"]);

    expect(wallLikeConcreteHybrid.impact).not.toBeNull();
    expect(wallLikeConcreteHybrid.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(wallLikeConcreteHybrid.supportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(wallLikeConcreteHybrid.unsupportedTargetOutputs).toEqual(["Rw"]);
  });

  it("can expose an official approximate DnT,A,k companion even when live DnT,A geometry is still incomplete", () => {
    const layers = [
      { materialId: "skim_plaster", thicknessMm: 3 },
      { materialId: "ytong_separatiepaneel_aac_5_750", thicknessMm: 100 },
      { materialId: "skim_plaster", thicknessMm: 3 }
    ] as const;

    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good"
      },
      targetOutputs: ["DnT,A,k", "DnT,A"]
    });

    expect(result.metrics.estimatedDnTAkDb).toBe(33);
    expect(result.ratings.field?.DnTAk).toBe(33);
    expect(result.metrics.estimatedDnTADb).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DnT,A"]);
    expect(result.warnings.some((warning: string) => /official approximate airborne field companion available/i.test(warning))).toBe(true);
    expect(result.warnings.some((warning: string) => /field conversion is incomplete/i.test(warning))).toBe(true);
  });

  it("keeps raw AAC base structures off the narrow heavy-concrete impact lane", () => {
    const result = calculateAssembly(
      [{ floorRole: "base_structure", materialId: "ytong_aac_d700", thicknessMm: 150 }],
      { targetOutputs: ["Ln,w", "Rw"] }
    );

    expect(result.impact).toBeNull();
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w"]);
  });

  it("withholds closest-family warning labels when only cross-family floor recommendations exist", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
        { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
        { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
      ],
      {
        airborneContext: {
          contextMode: "field_between_rooms",
          panelHeightMm: 2800,
          panelWidthMm: 3200,
          receivingRoomRt60S: 0.6,
          receivingRoomVolumeM3: 55
        },
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 55
        },
        targetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
      }
    );

    expect(
      result.warnings.some((warning: string) =>
        /withheld the closest candidate label because it drifted outside the defended same-family route/i.test(warning)
      )
    ).toBe(true);
    expect(result.warnings.some((warning: string) => /Closest family candidate is TUAS X2/i.test(warning))).toBe(false);
  });
});
