import { AssemblyRatingsSchema, FieldAirborneRatingSchema, type AirborneContext, type LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { maybeBuildCompanyInternalOpeningLeakFieldBuildingRuntimeCorridor } from "./company-internal-opening-leak-building-runtime-corridor";
import { buildRatingsFromCurve } from "./curve-rating";

const FREQUENCIES_HZ = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150] as const;
const TRANSMISSION_LOSS_DB = FREQUENCIES_HZ.map(() => 50);
const PUBLIC_FIELD_LAYERS: readonly LayerInput[] = [{ materialId: "concrete", thicknessMm: 150 }];

const OPENING = {
  areaM2: 1.8,
  count: 1,
  elementRwDb: 32,
  id: "door-01",
  origin: "catalogued",
  ratingBasis: "rw_single_number",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

describe("field-rating positive metadata boundary", () => {
  it("parks Dn and DnT curve outputs when positive panel area would serialize as zero", () => {
    const ratings = buildRatingsFromCurve(FREQUENCIES_HZ, TRANSMISSION_LOSS_DB, {
      contextMode: "field_between_rooms",
      panelHeightMm: 30,
      panelWidthMm: 30,
      receivingRoomRt60S: 0.5,
      receivingRoomVolumeM3: 2
    });

    expect(ratings.field?.RwPrime).toEqual(expect.any(Number));
    expect(ratings.field?.DnW).toBeUndefined();
    expect(ratings.field?.DnTw).toBeUndefined();
    expect(ratings.field?.DnA).toBeUndefined();
    expect(ratings.field?.DnTA).toBeUndefined();
    expect(ratings.field?.partitionAreaM2).toBeUndefined();
    expect(ratings.field?.geometryMissing).toBe(true);
    expect(ratings.field?.geometryNeeded).toEqual(["panelWidthMm", "panelHeightMm"]);
    expect(() => AssemblyRatingsSchema.parse(ratings)).not.toThrow();
  });

  it("keeps standard field geometry numeric outputs and positive metadata unchanged", () => {
    const ratings = buildRatingsFromCurve(FREQUENCIES_HZ, TRANSMISSION_LOSS_DB, {
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 3000,
      receivingRoomRt60S: 0.5,
      receivingRoomVolumeM3: 30
    });

    expect(ratings.field?.DnW).toEqual(expect.any(Number));
    expect(ratings.field?.DnTw).toEqual(expect.any(Number));
    expect(ratings.field?.partitionAreaM2).toBe(9);
    expect(ratings.field?.receivingRoomVolumeM3).toBe(30);
    expect(() => AssemblyRatingsSchema.parse(ratings)).not.toThrow();
  });

  // AGENT COORDINATION 2026-06-24 (Codex): these edge cases cover adjacent
  // positive-metadata fields affected by the same zero-after-rounding failure
  // mode as the reported partitionAreaM2 issue.
  it("parks DnT curve outputs when positive receiving-room volume would serialize as zero", () => {
    const ratings = buildRatingsFromCurve(FREQUENCIES_HZ, TRANSMISSION_LOSS_DB, {
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 3000,
      receivingRoomRt60S: 0.5,
      receivingRoomVolumeM3: 0.01
    });

    expect(ratings.field?.RwPrime).toEqual(expect.any(Number));
    expect(ratings.field?.DnW).toEqual(expect.any(Number));
    expect(ratings.field?.DnA).toEqual(expect.any(Number));
    expect(ratings.field?.DnTw).toBeUndefined();
    expect(ratings.field?.DnTA).toBeUndefined();
    expect(ratings.field?.partitionAreaM2).toBe(9);
    expect(ratings.field?.receivingRoomVolumeM3).toBeUndefined();
    expect(ratings.field?.geometryMissing).toBe(true);
    expect(ratings.field?.geometryNeeded).toEqual(["receivingRoomVolumeM3"]);
    expect(() => AssemblyRatingsSchema.parse(ratings)).not.toThrow();
  });

  it("keeps valid Dn and DnT outputs while omitting sub-precision positive RT60 metadata", () => {
    const ratings = buildRatingsFromCurve(FREQUENCIES_HZ, TRANSMISSION_LOSS_DB, {
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 3000,
      receivingRoomRt60S: 0.01,
      receivingRoomVolumeM3: 30
    });

    expect(ratings.field?.DnW).toEqual(expect.any(Number));
    expect(ratings.field?.DnTw).toEqual(expect.any(Number));
    expect(ratings.field?.DnA).toEqual(expect.any(Number));
    expect(ratings.field?.DnTA).toEqual(expect.any(Number));
    expect(ratings.field?.partitionAreaM2).toBe(9);
    expect(ratings.field?.receivingRoomVolumeM3).toBe(30);
    expect(ratings.field?.receivingRoomRt60S).toBeUndefined();
    expect(ratings.field?.absorptionAreaM2Sabine).toBe(480);
    expect(ratings.field?.geometryMissing).toBeUndefined();
    expect(() => AssemblyRatingsSchema.parse(ratings)).not.toThrow();
  });

  it("omits sub-precision positive absorption metadata without parking valid geometry outputs", () => {
    const ratings = buildRatingsFromCurve(FREQUENCIES_HZ, TRANSMISSION_LOSS_DB, {
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 3000,
      receivingRoomRt60S: 1000,
      receivingRoomVolumeM3: 0.1
    });

    expect(ratings.field?.DnW).toEqual(expect.any(Number));
    expect(ratings.field?.DnTw).toEqual(expect.any(Number));
    expect(ratings.field?.partitionAreaM2).toBe(9);
    expect(ratings.field?.receivingRoomVolumeM3).toBe(0.1);
    expect(ratings.field?.receivingRoomRt60S).toBeUndefined();
    expect(ratings.field?.absorptionAreaM2Sabine).toBeUndefined();
    expect(ratings.field?.levelDifferenceOffsetDb).toBeUndefined();
    expect(ratings.field?.geometryMissing).toBeUndefined();
    expect(() => AssemblyRatingsSchema.parse(ratings)).not.toThrow();
  });

  it("keeps element-lab ratings schema-valid without field metadata", () => {
    const ratings = buildRatingsFromCurve(FREQUENCIES_HZ, TRANSMISSION_LOSS_DB, {
      contextMode: "element_lab"
    });

    expect(ratings.field).toBeUndefined();
    expect(ratings.iso717.descriptor).toBe("Rw");
    expect(() => AssemblyRatingsSchema.parse(ratings)).not.toThrow();
  });

  it("keeps schema rejection for manually constructed zero positive metadata fields", () => {
    for (const field of [
      "absorptionAreaM2Sabine",
      "partitionAreaM2",
      "receivingRoomRt60S",
      "receivingRoomVolumeM3"
    ] as const) {
      expect(() =>
        FieldAirborneRatingSchema.parse({
          basis: "manual_test",
          estimated: true,
          [field]: 0,
          RwPrime: 45
        })
      ).toThrow();
    }
  });

  // AGENT COORDINATION 2026-06-24 (Codex): these public-entrypoint tests
  // prove the metadata hardening survives the full calculateAssembly result
  // assembly/schema parse path, not only the lower-level curve-rating helper.
  it("keeps public calculateAssembly schema-valid and parks Dn outputs for tiny serialized panel area", () => {
    const result = calculateAssembly(PUBLIC_FIELD_LAYERS, {
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 30,
        panelWidthMm: 30,
        receivingRoomRt60S: 0.5,
        receivingRoomVolumeM3: 30
      },
      calculator: "dynamic",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"]
    });

    expect(result.ratings.field?.RwPrime).toEqual(expect.any(Number));
    expect(result.ratings.field?.DnW).toBeUndefined();
    expect(result.ratings.field?.DnTw).toBeUndefined();
    expect(result.ratings.field?.partitionAreaM2).toBeUndefined();
    expect(result.ratings.field?.geometryMissing).toBe(true);
    expect(result.ratings.field?.geometryNeeded).toEqual(["panelWidthMm", "panelHeightMm"]);
    expect(result.supportedTargetOutputs).toEqual(["R'w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Dn,w", "DnT,w", "Dn,A", "DnT,A"]);
    expect(() => AssemblyRatingsSchema.parse(result.ratings)).not.toThrow();
  });

  it("keeps public calculateAssembly schema-valid and parks only DnT outputs for tiny serialized room volume", () => {
    const result = calculateAssembly(PUBLIC_FIELD_LAYERS, {
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 3000,
        panelWidthMm: 3000,
        receivingRoomRt60S: 0.5,
        receivingRoomVolumeM3: 0.01
      },
      calculator: "dynamic",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"]
    });

    expect(result.ratings.field?.DnW).toEqual(expect.any(Number));
    expect(result.ratings.field?.DnA).toEqual(expect.any(Number));
    expect(result.ratings.field?.DnTw).toBeUndefined();
    expect(result.ratings.field?.DnTA).toBeUndefined();
    expect(result.ratings.field?.partitionAreaM2).toBe(9);
    expect(result.ratings.field?.receivingRoomVolumeM3).toBeUndefined();
    expect(result.ratings.field?.geometryMissing).toBe(true);
    expect(result.ratings.field?.geometryNeeded).toEqual(["receivingRoomVolumeM3"]);
    expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "Dn,A"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DnT,w", "DnT,A"]);
    expect(() => AssemblyRatingsSchema.parse(result.ratings)).not.toThrow();
  });

  it("blocks opening-leak field runtime when critical area metadata would serialize as zero", () => {
    const result = maybeBuildCompanyInternalOpeningLeakFieldBuildingRuntimeCorridor({
      airborneContext: {
        airtightness: "good",
        contextMode: "field_between_rooms",
        hostWallAreaM2: 12,
        openingLeakElements: [OPENING],
        panelHeightMm: 30,
        panelWidthMm: 30,
        receivingRoomRt60S: 0.55,
        receivingRoomVolumeM3: 42
      },
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      targetOutputs: ["R'w", "Dn,w", "DnT,w"]
    });

    expect(result).toMatchObject({
      blockedOutputs: ["R'w", "Dn,w", "DnT,w"],
      fieldRating: null,
      missingPhysicalInputs: ["partitionAreaM2"],
      partitionAreaM2: null,
      status: "blocked_missing_input",
      supportedOutputs: []
    });
    expect(result?.warning).toContain("partition area below serialized positive metadata precision");
  });

  it("blocks opening-leak building runtime when critical area metadata would serialize as zero", () => {
    const result = maybeBuildCompanyInternalOpeningLeakFieldBuildingRuntimeCorridor({
      airborneContext: {
        airtightness: "good",
        buildingPredictionOutputBasis: "apparent_and_standardized",
        conservativeFlankingAssumption: "single_conservative_path",
        contextMode: "building_prediction",
        flankingJunctionClass: "rigid_t_junction",
        hostWallAreaM2: 12,
        junctionCouplingLengthM: 3,
        openingLeakElements: [OPENING],
        panelHeightMm: 30,
        panelWidthMm: 30,
        receivingRoomRt60S: 0.55,
        receivingRoomVolumeM3: 42,
        sourceRoomVolumeM3: 55
      },
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"]
    });

    expect(result).toMatchObject({
      blockedOutputs: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"],
      fieldRating: null,
      missingPhysicalInputs: ["partitionAreaM2"],
      partitionAreaM2: null,
      status: "blocked_missing_input",
      supportedOutputs: []
    });
    expect(result?.warning).toContain("partition area below serialized positive metadata precision");
  });
});
