import { describe, expect, it } from "vitest";

import { EstimateRequestSchema } from "./estimate";
import {
  PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
  PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type ProjectUserMeasuredWallAirborneFrequencyBands,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type ProjectUserMeasuredWallRwAnchor
} from "../domain/project-user-measured-source-anchor";
import {
  PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserVerifiedCalculatedAnchorFingerprint,
  type ProjectUserVerifiedCalculatedAnchor,
  type ProjectUserVerifiedCalculatedAnchorRequestContext
} from "../domain/project-user-verified-calculated-anchor";
import type { MaterialDefinition } from "../domain/material";

const customMaterial = {
  acoustic: {
    behavior: "rigid_mass",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "finish",
  densityKgM3: 720,
  id: "custom_cork_finish",
  name: "Custom cork finish",
  tags: ["custom-workbench-material", "finish"]
} satisfies MaterialDefinition;

const measuredWallSnapshot: ProjectUserMeasuredWallConstructionSnapshot = {
  layers: [
    { materialId: "custom_cork_finish", role: "board", side: "side_a", thicknessMm: 8 }
  ],
  materialCatalog: [customMaterial],
  materialVisualOverrides: [],
  wallContext: {
    supportTopology: "none",
    wallTopology: "single_leaf"
  }
};

const measuredWallFrequencyBands = {
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

function buildMeasuredWallRwAnchor(
  overrides: Partial<ProjectUserMeasuredWallRwAnchor> = {}
): ProjectUserMeasuredWallRwAnchor {
  const snapshot = overrides.snapshot ?? measuredWallSnapshot;
  const fingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
    measurementMethodStandard: "ISO 10140-2",
    ratingStandard: "ISO 717-1",
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T07:00:00.000Z",
    createdBy: "estimate-request-test",
    createdFromProjectId: "project-estimate-test",
    fingerprint,
    id: "project-measured-wall-rw-estimate-test",
    measurementMethodStandard: "ISO 10140-2",
    metric: "Rw",
    metricBasis: "lab_rw",
    ratingStandard: "ISO 717-1",
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall Rw estimate test",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T07:00:00.000Z",
    valueDb: 47,
    ...overrides
  };
}

function buildMeasuredWallFrequencyAnchor(
  overrides: Partial<ProjectUserMeasuredWallAirborneFrequencyAnchor> = {}
): ProjectUserMeasuredWallAirborneFrequencyAnchor {
  const snapshot = overrides.snapshot ?? measuredWallSnapshot;
  const frequencyBands = overrides.frequencyBands ?? measuredWallFrequencyBands;
  const ratingStandards = overrides.ratingStandards ?? ["ISO 717-1", "ASTM E413"];
  const fingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
    frequencyBands,
    measurementMethodStandard: "ISO 10140-2",
    ratingStandards,
    snapshot
  });

  return {
    canonicalizationVersion: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-18T07:00:00.000Z",
    createdBy: "estimate-request-test",
    createdFromProjectId: "project-estimate-test",
    curveBasis: "measured_frequency_curve",
    fingerprint,
    frequencyBands,
    id: "project-measured-wall-airborne-frequency-estimate-test",
    inputBasis: "airborne_transmission_loss_curve",
    measurementMethodStandard: "ISO 10140-2",
    metricBasis: "lab_airborne_transmission_loss_curve",
    metricFamily: "airborne",
    ratingStandards,
    revision: 1,
    scope: "project_measured",
    snapshot,
    sourceLabel: "Project measured wall airborne frequency estimate test",
    sourceMode: "lab",
    sourceStatus: "active",
    toleranceDb: 1,
    updatedAtIso: "2026-06-18T07:00:00.000Z",
    ...overrides
  };
}

const verifiedCalculatedRequestContext = {
  calculator: "dynamic",
  layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
  materialCatalog: [customMaterial],
  mode: "wall",
  targetOutputs: ["Rw"]
} as const satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

function buildVerifiedCalculatedAnchor(
  overrides: Partial<ProjectUserVerifiedCalculatedAnchor> = {}
): ProjectUserVerifiedCalculatedAnchor {
  const requestContext = overrides.requestContext ?? verifiedCalculatedRequestContext;
  const fingerprint = buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext });

  return {
    anchorKind: "user_verified_calculated_result",
    canonicalizationVersion: PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-22T09:00:00.000Z",
    createdBy: "estimate-request-test",
    createdFromProjectId: "project-estimate-test",
    description: "User confirmed a calculated result package.",
    fingerprint,
    id: "project-user-verified-calculated-estimate-test",
    name: "Verified calculated estimate request guard",
    requestContext,
    resultBasisTrace: {
      airborneBasis: {
        assumptions: ["estimate request guard"],
        curveBasis: "calculated_frequency_curve",
        errorBudgetDb: 2,
        kind: "airborne_physics_prediction",
        method: "test_verified_calculated_estimate_request_guard",
        missingPhysicalInputs: [],
        missingSourceEvidence: [],
        origin: "family_physics_prediction",
        propertyDefaults: [],
        requiredInputs: [],
        toleranceClass: "uncalibrated_prediction"
      },
      assumptions: ["user confirmed calculated package"],
      calculator: "dynamic",
      ratingAdapterBasisSet: [],
      supportedImpactOutputs: [],
      supportedTargetOutputs: ["Rw"],
      targetOutputs: ["Rw"],
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: [],
      warnings: []
    },
    revision: 1,
    scope: "project_evidence",
    status: "active",
    updatedAtIso: "2026-06-22T09:00:00.000Z",
    values: [
      {
        metric: "Rw",
        metricBasis: "airborne_lab",
        provenance: {
          outputStatus: "supported",
          routeId: "test_verified_calculated_estimate_request_guard",
          source: "calculated_live_result"
        },
        valueDb: 52
      }
    ],
    valuesChecksum: "sha256:estimate-request-guard",
    workbenchSnapshot: {},
    ...overrides
  };
}

describe("EstimateRequestSchema materialCatalog", () => {
  it("accepts project custom materials for estimate requests", () => {
    const parsed = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.materialCatalog?.[0]?.id).toBe("custom_cork_finish");
    }
  });

  it("preserves explicit workbench mode so exact stored references can match the runtime request", () => {
    const parsed = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      mode: "wall",
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.mode).toBe("wall");
    }
  });

  it("accepts explicit layer surface mass for physics routes that do not need catalog density", () => {
    const parsed = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "project_panel_leaf", surfaceMassKgM2: 10.6, thicknessMm: 12.5 }],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.layers[0]?.surfaceMassKgM2).toBe(10.6);
    }
  });

  it("accepts zero surface mass for massless helper layers while route owners require positive leaf mass", () => {
    const parsed = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "air_gap", surfaceMassKgM2: 0, thicknessMm: 90 }],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.layers[0]?.surfaceMassKgM2).toBe(0);
    }
  });

  it("rejects duplicate project material ids", () => {
    const parsed = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial, { ...customMaterial, name: "Duplicate cork" }],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["materialCatalog", 1, "id"]);
    }
  });

  it("accepts active project/user measured wall Rw anchors for exact runtime candidates", () => {
    const anchor = buildMeasuredWallRwAnchor();
    const parsed = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [anchor],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.airborneMeasuredSourceAnchors?.[0]?.id).toBe(anchor.id);
      expect(parsed.data.airborneMeasuredSourceAnchors?.[0]?.metricBasis).toBe("lab_rw");
    }
  });

  it("rejects inactive or stale measured wall Rw anchors at request intake", () => {
    const inactive = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [
        buildMeasuredWallRwAnchor({
          sourceStatus: "draft"
        })
      ],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });
    const stale = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [
        buildMeasuredWallRwAnchor({
          fingerprint: "dynecho:wall-rw-anchor:v1:0000000000000000"
        })
      ],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });

    expect(inactive.success).toBe(false);
    if (!inactive.success) {
      expect(inactive.error.issues[0]?.path).toEqual(["airborneMeasuredSourceAnchors", 0, "sourceStatus"]);
    }
    expect(stale.success).toBe(false);
    if (!stale.success) {
      expect(stale.error.issues[0]?.path).toEqual(["airborneMeasuredSourceAnchors", 0, "fingerprint"]);
    }
  });

  it("rejects duplicate measured wall Rw anchor ids and fingerprints", () => {
    const anchor = buildMeasuredWallRwAnchor();
    const duplicate = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [
        anchor,
        {
          ...anchor,
          sourceLabel: "Duplicate measured wall Rw",
          valueDb: 48
        }
      ],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });

    expect(duplicate.success).toBe(false);
    if (!duplicate.success) {
      expect(duplicate.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining([
          "airborneMeasuredSourceAnchors.1.id",
          "airborneMeasuredSourceAnchors.1.fingerprint"
        ])
      );
    }
  });

  it("accepts active measured wall airborne frequency anchors for exact curve runtime candidates", () => {
    const anchor = buildMeasuredWallFrequencyAnchor();
    const parsed = EstimateRequestSchema.safeParse({
      airborneMeasuredFrequencySourceAnchors: [anchor],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.airborneMeasuredFrequencySourceAnchors?.[0]?.id).toBe(anchor.id);
      expect(parsed.data.airborneMeasuredFrequencySourceAnchors?.[0]?.metricBasis).toBe(
        "lab_airborne_transmission_loss_curve"
      );
    }
  });

  it("rejects inactive, stale, and duplicate measured wall airborne frequency anchors at request intake", () => {
    const active = buildMeasuredWallFrequencyAnchor();
    const inactive = EstimateRequestSchema.safeParse({
      airborneMeasuredFrequencySourceAnchors: [
        buildMeasuredWallFrequencyAnchor({
          sourceStatus: "draft"
        })
      ],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });
    const stale = EstimateRequestSchema.safeParse({
      airborneMeasuredFrequencySourceAnchors: [
        buildMeasuredWallFrequencyAnchor({
          fingerprint: "dynecho:wall-airborne-frequency-anchor:v1:0000000000000000"
        })
      ],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });
    const duplicate = EstimateRequestSchema.safeParse({
      airborneMeasuredFrequencySourceAnchors: [
        active,
        {
          ...active,
          sourceLabel: "Duplicate measured wall airborne frequency"
        }
      ],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });

    expect(inactive.success).toBe(false);
    if (!inactive.success) {
      expect(inactive.error.issues[0]?.path).toEqual([
        "airborneMeasuredFrequencySourceAnchors",
        0,
        "sourceStatus"
      ]);
    }
    expect(stale.success).toBe(false);
    if (!stale.success) {
      expect(stale.error.issues[0]?.path).toEqual([
        "airborneMeasuredFrequencySourceAnchors",
        0,
        "fingerprint"
      ]);
    }
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) {
      expect(duplicate.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining([
          "airborneMeasuredFrequencySourceAnchors.1.id",
          "airborneMeasuredFrequencySourceAnchors.1.fingerprint"
        ])
      );
    }
  });

  // Agent coordination, 2026-06-22:
  // This guard belongs to the user-verified calculated anchor slice. Do not
  // satisfy it by routing calculated packages through measured/source fields.
  it("keeps user-verified calculated anchors out of estimate runtime inputs until a dedicated owner exists", () => {
    const verifiedCalculatedAnchor = buildVerifiedCalculatedAnchor();
    const measuredLane = EstimateRequestSchema.safeParse({
      airborneMeasuredSourceAnchors: [verifiedCalculatedAnchor],
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });
    const noRuntimeLane = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"],
      userVerifiedCalculatedAnchors: [verifiedCalculatedAnchor]
    });

    expect(measuredLane.success).toBe(false);
    if (!measuredLane.success) {
      expect(measuredLane.error.issues.some((issue) => issue.path[0] === "airborneMeasuredSourceAnchors")).toBe(true);
    }
    expect(noRuntimeLane.success).toBe(true);
    if (noRuntimeLane.success) {
      expect("userVerifiedCalculatedAnchors" in noRuntimeLane.data).toBe(false);
    }
  });
});
