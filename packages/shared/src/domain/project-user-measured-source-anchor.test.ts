import { describe, expect, it } from "vitest";

import {
  ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema,
  ActiveProjectUserMeasuredWallRwAnchorSchema,
  PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
  PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
  ProjectUserMeasuredWallAirborneFrequencyAnchorSchema,
  ProjectUserMeasuredWallConstructionSnapshotSchema,
  ProjectUserMeasuredWallRwAnchorSchema,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type ProjectUserMeasuredWallAirborneFrequencyBands,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type ProjectUserMeasuredWallRwAnchor
} from "./project-user-measured-source-anchor";

const CREATED_AT = "2026-06-18T05:30:00.000Z";

const BASE_SNAPSHOT = {
  layers: [
    { materialId: "acoustic_gypsum_board", role: "board", side: "side_a", thicknessMm: 12.5 },
    { materialId: "steel_stud_70", role: "support", side: "cavity", thicknessMm: 70 },
    { materialId: "custom_glasswool_48", role: "absorber", side: "cavity", thicknessMm: 50 },
    { materialId: "acoustic_gypsum_board", role: "board", side: "side_b", thicknessMm: 12.5 }
  ],
  materialCatalog: [
    {
      acoustic: {
        absorberClass: "porous_absorptive",
        behavior: "porous_absorber",
        flowResistivityPaSM2: 12000,
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "insulation",
      densityKgM3: 48,
      id: "custom_glasswool_48",
      name: "Project glass wool 48 kg/m3",
      notes: "Measured project material note",
      tags: ["project", "user-note"]
    },
    {
      acoustic: {
        behavior: "panel_leaf",
        notes: [],
        propertySourceStatus: "catalog_nominal"
      },
      category: "finish",
      densityKgM3: 800,
      id: "acoustic_gypsum_board",
      name: "Acoustic gypsum board",
      tags: ["board"]
    },
    {
      acoustic: {
        behavior: "structural_bridge",
        notes: [],
        propertySourceStatus: "catalog_nominal"
      },
      category: "support",
      densityKgM3: 7850,
      id: "steel_stud_70",
      name: "Steel stud 70",
      tags: ["stud"]
    }
  ],
  materialVisualOverrides: [
    {
      color: "#89a",
      materialId: "custom_glasswool_48"
    }
  ],
  wallContext: {
    cavityDepthMm: 70,
    cavityFillMaterialId: "custom_glasswool_48",
    supportSpacingMm: 600,
    supportTopology: "steel_stud",
    wallTopology: "framed_double_leaf"
  }
} as const satisfies ProjectUserMeasuredWallConstructionSnapshot;

const BASE_FREQUENCY_BANDS = {
  bandSet: "third_octave_100_3150",
  values: [
    { frequencyHz: 100, transmissionLossDb: 28.4 },
    { frequencyHz: 125, transmissionLossDb: 31.2 },
    { frequencyHz: 160, transmissionLossDb: 34.1 },
    { frequencyHz: 200, transmissionLossDb: 37.8 },
    { frequencyHz: 250, transmissionLossDb: 40.6 },
    { frequencyHz: 315, transmissionLossDb: 43.3 },
    { frequencyHz: 400, transmissionLossDb: 46.1 },
    { frequencyHz: 500, transmissionLossDb: 49.2 },
    { frequencyHz: 630, transmissionLossDb: 52.5 },
    { frequencyHz: 800, transmissionLossDb: 55.1 },
    { frequencyHz: 1000, transmissionLossDb: 57.4 },
    { frequencyHz: 1250, transmissionLossDb: 59.2 },
    { frequencyHz: 1600, transmissionLossDb: 61.5 },
    { frequencyHz: 2000, transmissionLossDb: 63.1 },
    { frequencyHz: 2500, transmissionLossDb: 64.2 },
    { frequencyHz: 3150, transmissionLossDb: 65.4 }
  ]
} as const satisfies ProjectUserMeasuredWallAirborneFrequencyBands;

function buildAnchor(
  snapshot: ProjectUserMeasuredWallConstructionSnapshot = BASE_SNAPSHOT,
  overrides: Partial<ProjectUserMeasuredWallRwAnchor> = {}
): ProjectUserMeasuredWallRwAnchor {
  const fingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
    measurementMethodStandard: "ISO 10140-2",
    ratingStandard: "ISO 717-1",
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: CREATED_AT,
    createdBy: "agent-test",
    createdFromPresetId: "preset-not-in-fingerprint",
    createdFromProjectId: "project-42",
    fingerprint,
    id: "project-measured-wall-rw-001",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceDescription: "Project lab report",
    sourceLabel: "Measured project wall",
    sourceMode: "lab",
    sourceStatus: "active",
    sourceUrl: "https://example.test/report",
    toleranceDb: 1.5,
    updatedAtIso: CREATED_AT,
    valueDb: 50,
    ...overrides
  };
}

function buildFrequencyAnchor(
  input: {
    readonly frequencyBands?: ProjectUserMeasuredWallAirborneFrequencyBands;
    readonly ratingStandards?: readonly ("ASTM E413" | "ISO 717-1" | "source_report_unknown")[];
    readonly snapshot?: ProjectUserMeasuredWallConstructionSnapshot;
  } = {},
  overrides: Partial<ProjectUserMeasuredWallAirborneFrequencyAnchor> = {}
): ProjectUserMeasuredWallAirborneFrequencyAnchor {
  const snapshot = input.snapshot ?? BASE_SNAPSHOT;
  const frequencyBands = input.frequencyBands ?? BASE_FREQUENCY_BANDS;
  const ratingStandards = input.ratingStandards ?? ["ASTM E413", "ISO 717-1"];
  const fingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
    frequencyBands,
    measurementMethodStandard: "ISO 10140-2",
    ratingStandards,
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: CREATED_AT,
    createdBy: "agent-test",
    createdFromPresetId: "preset-not-in-frequency-fingerprint",
    createdFromProjectId: "project-42",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands,
    id: "project-measured-wall-airborne-frequency-001",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards: [...ratingStandards],
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceDescription: "Project lab transmission-loss curve report",
    sourceLabel: "Measured project wall airborne TL curve",
    sourceMode: "lab",
    sourceStatus: "active",
    sourceUrl: "https://example.test/frequency-report",
    toleranceDb: 1.5,
    updatedAtIso: CREATED_AT,
    ...overrides
  };
}

describe("ProjectUserMeasuredWallRwAnchorSchema", () => {
  it("accepts an active project measured lab Rw anchor with a matching canonical fingerprint", () => {
    const anchor = buildAnchor();
    const parsed = ActiveProjectUserMeasuredWallRwAnchorSchema.safeParse(anchor);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.metric).toBe("Rw");
      expect(parsed.data.metricBasis).toBe("lab_rw");
      expect(parsed.data.sourceStatus).toBe("active");
      expect(parsed.data.fingerprint).toMatch(/^dynecho:wall-rw-anchor:v1:[a-f0-9]{16}$/u);
    }
  });

  it("rejects inactive anchors as runtime candidates while keeping them representable as evidence records", () => {
    const draftAnchor = buildAnchor(BASE_SNAPSHOT, {
      sourceStatus: "draft"
    });

    expect(ProjectUserMeasuredWallRwAnchorSchema.safeParse(draftAnchor).success).toBe(true);

    const activeCandidate = ActiveProjectUserMeasuredWallRwAnchorSchema.safeParse(draftAnchor);
    expect(activeCandidate.success).toBe(false);
    if (!activeCandidate.success) {
      expect(activeCandidate.error.issues[0]?.path).toEqual(["sourceStatus"]);
    }
  });

  it("keeps wall Rw lab basis separate from field, building, STC, and impact aliases", () => {
    const fieldAnchor = buildAnchor(BASE_SNAPSHOT, {
      fingerprint: buildProjectUserMeasuredWallRwAnchorFingerprint({
        measurementMethodStandard: "ISO 10140-2",
        ratingStandard: "ISO 717-1",
        snapshot: BASE_SNAPSHOT
      }),
      metricBasis: "field_apparent",
      sourceMode: "field"
    });

    const fieldCandidate = ActiveProjectUserMeasuredWallRwAnchorSchema.safeParse(fieldAnchor);
    expect(fieldCandidate.success).toBe(false);
    if (!fieldCandidate.success) {
      expect(fieldCandidate.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining(["metricBasis", "sourceMode"])
      );
    }

    expect(
      ProjectUserMeasuredWallRwAnchorSchema.safeParse({
        ...buildAnchor(),
        metric: "STC"
      }).success
    ).toBe(false);
  });

  it("keeps fingerprints stable across display metadata, preset id, visual override, and material row-order changes", () => {
    const first = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard: "ISO 10140-2",
      ratingStandard: "ISO 717-1",
      snapshot: BASE_SNAPSHOT
    });
    const renamedSnapshot = {
      ...BASE_SNAPSHOT,
      materialCatalog: [...BASE_SNAPSHOT.materialCatalog]
        .reverse()
        .map((material) => ({
          ...material,
          name: `Renamed ${material.name}`,
          notes: "Changed non-calculation note",
          tags: ["changed-ui-tag"]
        })),
      materialVisualOverrides: [
        {
          color: "#fff",
          materialId: "custom_glasswool_48"
        }
      ]
    } satisfies ProjectUserMeasuredWallConstructionSnapshot;
    const second = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard: "ISO 10140-2",
      ratingStandard: "ISO 717-1",
      snapshot: renamedSnapshot
    });

    expect(second).toBe(first);
    expect(buildAnchor(BASE_SNAPSHOT).fingerprint).toBe(buildAnchor(BASE_SNAPSHOT, { createdFromPresetId: "other" }).fingerprint);
  });

  it("changes fingerprints when calculation-relevant physical inputs change", () => {
    const baseline = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard: "ISO 10140-2",
      ratingStandard: "ISO 717-1",
      snapshot: BASE_SNAPSHOT
    });
    const thickerBoard = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard: "ISO 10140-2",
      ratingStandard: "ISO 717-1",
      snapshot: {
        ...BASE_SNAPSHOT,
        layers: BASE_SNAPSHOT.layers.map((layer, index) =>
          index === 0 ? { ...layer, thicknessMm: 15 } : layer
        )
      }
    });
    const denserAbsorber = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard: "ISO 10140-2",
      ratingStandard: "ISO 717-1",
      snapshot: {
        ...BASE_SNAPSHOT,
        materialCatalog: BASE_SNAPSHOT.materialCatalog.map((material) =>
          material.id === "custom_glasswool_48" ? { ...material, densityKgM3: 60 } : material
        )
      }
    });
    const widerStudSpacing = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard: "ISO 10140-2",
      ratingStandard: "ISO 717-1",
      snapshot: {
        ...BASE_SNAPSHOT,
        wallContext: {
          ...BASE_SNAPSHOT.wallContext,
          supportSpacingMm: 400
        }
      }
    });

    expect(thickerBoard).not.toBe(baseline);
    expect(denserAbsorber).not.toBe(baseline);
    expect(widerStudSpacing).not.toBe(baseline);
  });

  it("rejects conflicting material ids and stale fingerprints", () => {
    const duplicateMaterialSnapshot = {
      ...BASE_SNAPSHOT,
      materialCatalog: [...BASE_SNAPSHOT.materialCatalog, BASE_SNAPSHOT.materialCatalog[0]]
    } satisfies ProjectUserMeasuredWallConstructionSnapshot;

    expect(ProjectUserMeasuredWallConstructionSnapshotSchema.safeParse(duplicateMaterialSnapshot).success).toBe(false);

    const staleFingerprint = ActiveProjectUserMeasuredWallRwAnchorSchema.safeParse(
      buildAnchor(BASE_SNAPSHOT, {
        fingerprint: "dynecho:wall-rw-anchor:v1:0000000000000000"
      })
    );
    expect(staleFingerprint.success).toBe(false);
    if (!staleFingerprint.success) {
      expect(staleFingerprint.error.issues[0]?.path).toEqual(["fingerprint"]);
    }
  });
});

describe("ProjectUserMeasuredWallAirborneFrequencyAnchorSchema", () => {
  it("accepts an active project measured wall lab airborne transmission-loss curve anchor with a matching fingerprint", () => {
    const anchor = buildFrequencyAnchor();
    const parsed = ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(anchor);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.metricFamily).toBe("airborne");
      expect(parsed.data.metricBasis).toBe("lab_airborne_transmission_loss_curve");
      expect(parsed.data.curveBasis).toBe("measured_frequency_curve");
      expect(parsed.data.inputBasis).toBe("airborne_transmission_loss_curve");
      expect(parsed.data.frequencyBands.bandSet).toBe("third_octave_100_3150");
      expect(parsed.data.frequencyBands.values).toHaveLength(16);
      expect(parsed.data.fingerprint).toMatch(/^dynecho:wall-airborne-frequency-anchor:v1:[a-f0-9]{16}$/u);
    }
  });

  it("rejects inactive frequency anchors as runtime candidates while keeping them representable as evidence records", () => {
    const draftAnchor = buildFrequencyAnchor({}, {
      sourceStatus: "draft"
    });

    expect(ProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(draftAnchor).success).toBe(true);

    const activeCandidate = ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(draftAnchor);
    expect(activeCandidate.success).toBe(false);
    if (!activeCandidate.success) {
      expect(activeCandidate.error.issues[0]?.path).toEqual(["sourceStatus"]);
    }
  });

  it("keeps measured airborne curve anchors separate from scalar Rw, field, building, and impact aliases", () => {
    const fieldAnchor = buildFrequencyAnchor({}, {
      sourceMode: "field"
    });
    const fieldCandidate = ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(fieldAnchor);

    expect(fieldCandidate.success).toBe(false);
    if (!fieldCandidate.success) {
      expect(fieldCandidate.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining(["sourceMode"])
      );
    }

    const frequencyAnchor = buildFrequencyAnchor();
    const rwAnchor = buildAnchor();

    expect(ProjectUserMeasuredWallRwAnchorSchema.safeParse(frequencyAnchor).success).toBe(false);
    expect(ProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(rwAnchor).success).toBe(false);
    expect(frequencyAnchor.fingerprint).not.toBe(rwAnchor.fingerprint);
  });

  it("keeps frequency fingerprints stable across display metadata, band row order, rating standard order, and material row-order changes", () => {
    const first = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
      frequencyBands: BASE_FREQUENCY_BANDS,
      measurementMethodStandard: "ISO 10140-2",
      ratingStandards: ["ISO 717-1", "ASTM E413"],
      snapshot: BASE_SNAPSHOT
    });
    const renamedSnapshot = {
      ...BASE_SNAPSHOT,
      materialCatalog: [...BASE_SNAPSHOT.materialCatalog]
        .reverse()
        .map((material) => ({
          ...material,
          name: `Renamed ${material.name}`,
          notes: "Changed non-calculation note",
          tags: ["changed-ui-tag"]
        })),
      materialVisualOverrides: [
        {
          color: "#111",
          materialId: "custom_glasswool_48"
        }
      ]
    } satisfies ProjectUserMeasuredWallConstructionSnapshot;
    const reversedBands = {
      ...BASE_FREQUENCY_BANDS,
      values: [...BASE_FREQUENCY_BANDS.values].reverse()
    } satisfies ProjectUserMeasuredWallAirborneFrequencyBands;
    const second = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
      frequencyBands: reversedBands,
      measurementMethodStandard: "ISO 10140-2",
      ratingStandards: ["ASTM E413", "ISO 717-1"],
      snapshot: renamedSnapshot
    });

    expect(second).toBe(first);
    expect(buildFrequencyAnchor().fingerprint).toBe(
      buildFrequencyAnchor({}, { createdFromPresetId: "other-frequency-preset" }).fingerprint
    );
  });

  it("changes frequency fingerprints when transmission-loss values, band metadata, or physical inputs change", () => {
    const baseline = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
      frequencyBands: BASE_FREQUENCY_BANDS,
      measurementMethodStandard: "ISO 10140-2",
      ratingStandards: ["ISO 717-1", "ASTM E413"],
      snapshot: BASE_SNAPSHOT
    });
    const changedTlValue = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
      frequencyBands: {
        ...BASE_FREQUENCY_BANDS,
        values: BASE_FREQUENCY_BANDS.values.map((band) =>
          band.frequencyHz === 1000 ? { ...band, transmissionLossDb: band.transmissionLossDb + 1 } : band
        )
      },
      measurementMethodStandard: "ISO 10140-2",
      ratingStandards: ["ISO 717-1", "ASTM E413"],
      snapshot: BASE_SNAPSHOT
    });
    const changedBandSet = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
      frequencyBands: {
        ...BASE_FREQUENCY_BANDS,
        bandSet: "third_octave_50_5000"
      },
      measurementMethodStandard: "ISO 10140-2",
      ratingStandards: ["ISO 717-1", "ASTM E413"],
      snapshot: BASE_SNAPSHOT
    });
    const widerStudSpacing = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
      frequencyBands: BASE_FREQUENCY_BANDS,
      measurementMethodStandard: "ISO 10140-2",
      ratingStandards: ["ISO 717-1", "ASTM E413"],
      snapshot: {
        ...BASE_SNAPSHOT,
        wallContext: {
          ...BASE_SNAPSHOT.wallContext,
          supportSpacingMm: 400
        }
      }
    });

    expect(changedTlValue).not.toBe(baseline);
    expect(changedBandSet).not.toBe(baseline);
    expect(widerStudSpacing).not.toBe(baseline);
  });

  it("rejects duplicate frequency bands, duplicate rating standards, and stale frequency fingerprints", () => {
    const duplicateFrequencyAnchor = buildFrequencyAnchor({}, {
      frequencyBands: {
        ...BASE_FREQUENCY_BANDS,
        values: [
          ...BASE_FREQUENCY_BANDS.values,
          { frequencyHz: 1000, transmissionLossDb: 58 }
        ]
      }
    });
    const duplicateRatingAnchor = buildFrequencyAnchor({}, {
      ratingStandards: ["ISO 717-1", "ISO 717-1"]
    });
    const staleFingerprint = ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(
      buildFrequencyAnchor({}, {
        fingerprint: "dynecho:wall-airborne-frequency-anchor:v1:0000000000000000"
      })
    );

    expect(ProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(duplicateFrequencyAnchor).success).toBe(false);
    expect(ProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(duplicateRatingAnchor).success).toBe(false);
    expect(staleFingerprint.success).toBe(false);
    if (!staleFingerprint.success) {
      expect(staleFingerprint.error.issues[0]?.path).toEqual(["fingerprint"]);
    }
  });
});
