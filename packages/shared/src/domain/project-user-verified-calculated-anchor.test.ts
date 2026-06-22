import { describe, expect, it } from "vitest";

import {
  ActiveProjectUserVerifiedCalculatedAnchorSchema,
  PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
  ProjectUserVerifiedCalculatedAnchorSchema,
  buildProjectUserVerifiedCalculatedAnchorFingerprint,
  type ProjectUserVerifiedCalculatedAnchor,
  type ProjectUserVerifiedCalculatedAnchorRequestContext
} from "./project-user-verified-calculated-anchor";

const CREATED_AT = "2026-06-22T08:30:00.000Z";

const BASE_REQUEST_CONTEXT = {
  airborneContext: {
    contextMode: "element_lab",
    wallTopology: {
      supportTopology: "single_shared_stud",
      topologyMode: "double_leaf_framed"
    }
  },
  calculator: "dynamic",
  layers: [
    { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
    { materialId: "steel_stud_70", thicknessMm: 70 },
    { materialId: "custom_glasswool_48", thicknessMm: 50 },
    { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
  ],
  materialCatalog: [
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
    },
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
      tags: ["project"]
    }
  ],
  mode: "wall",
  targetOutputs: ["Rw", "STC", "DnT,w"]
} as const satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

function buildAnchor(
  input: {
    readonly requestContext?: ProjectUserVerifiedCalculatedAnchorRequestContext;
  } = {},
  overrides: Partial<ProjectUserVerifiedCalculatedAnchor> = {}
): ProjectUserVerifiedCalculatedAnchor {
  const requestContext = input.requestContext ?? BASE_REQUEST_CONTEXT;
  const fingerprint = buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext });

  return {
    anchorKind: "user_verified_calculated_result",
    canonicalizationVersion: PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: CREATED_AT,
    createdBy: "agent-test",
    createdFromPresetId: "preset-verified-calculated-001",
    createdFromProjectId: "project-42",
    description: "User confirmed the current calculated package for this project stack.",
    fingerprint,
    id: "project-user-verified-calculated-001",
    name: "Verified calculated wall package",
    requestContext,
    resultBasisTrace: {
      airborneBasis: {
        assumptions: ["test route basis"],
        curveBasis: "calculated_frequency_curve",
        errorBudgetDb: 2,
        kind: "airborne_physics_prediction",
        method: "test_user_verified_calculated_route",
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
      supportedTargetOutputs: ["Rw", "STC", "DnT,w"],
      targetOutputs: ["Rw", "STC", "DnT,w"],
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: [],
      warnings: []
    },
    revision: 1,
    scope: "project_evidence",
    status: "active",
    updatedAtIso: CREATED_AT,
    values: [
      {
        metric: "Rw",
        metricBasis: "airborne_lab",
        provenance: {
          outputStatus: "supported",
          routeId: "test_user_verified_calculated_route",
          source: "calculated_live_result"
        },
        valueDb: 52
      },
      {
        metric: "STC",
        metricBasis: "airborne_lab",
        provenance: {
          outputStatus: "supported",
          routeId: "test_user_verified_calculated_route",
          source: "calculated_live_result"
        },
        valueDb: 52
      },
      {
        metric: "DnT,w",
        metricBasis: "airborne_building_prediction",
        provenance: {
          outputStatus: "supported",
          routeId: "test_user_verified_calculated_route",
          source: "calculated_live_result"
        },
        valueDb: 49
      }
    ],
    valuesChecksum: "sha256:test",
    workbenchSnapshot: {
      selectedOutputs: ["Rw", "STC", "DnT,w"]
    },
    ...overrides
  };
}

describe("ProjectUserVerifiedCalculatedAnchorSchema", () => {
  it("accepts an active exact-only user-verified calculated package without measured/source fields", () => {
    const anchor = buildAnchor();
    const parsed = ActiveProjectUserVerifiedCalculatedAnchorSchema.safeParse(anchor);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.anchorKind).toBe("user_verified_calculated_result");
      expect(parsed.data.status).toBe("active");
      expect(parsed.data.scope).toBe("project_evidence");
      expect(parsed.data.fingerprint).toMatch(/^dynecho:user-verified-calculated-anchor:v1:[a-f0-9]{16}$/u);
    }
  });

  it("rejects measured/source lane fields so calculated packages cannot masquerade as lab evidence", () => {
    const anchor = {
      ...buildAnchor(),
      sourceMode: "lab",
      sourceStatus: "active"
    };

    const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse(anchor);

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.code === "unrecognized_keys")).toBe(true);
    }
  });

  it("rejects fingerprints when calculation-relevant context changes", () => {
    const anchor = buildAnchor();
    const changedContext = {
      ...BASE_REQUEST_CONTEXT,
      layers: [
        { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
        ...BASE_REQUEST_CONTEXT.layers.slice(1)
      ]
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

    const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse({
      ...anchor,
      requestContext: changedContext
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path.join("."))).toContain("fingerprint");
    }
  });

  it("keeps selected output list out of the construction fingerprint while still validating saved values", () => {
    const rwOnlyContext = {
      ...BASE_REQUEST_CONTEXT,
      targetOutputs: ["Rw"]
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

    expect(buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext: BASE_REQUEST_CONTEXT })).toBe(
      buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext: rwOnlyContext })
    );

    const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse(
      buildAnchor(
        { requestContext: rwOnlyContext },
        {
          resultBasisTrace: {
            ...buildAnchor().resultBasisTrace,
            supportedTargetOutputs: ["Rw"],
            targetOutputs: ["Rw"]
          },
          values: [buildAnchor().values[0]!]
        }
      )
    );

    expect(parsed.success).toBe(true);
  });

  // Agent coordination, 2026-06-22:
  // Keep these request-shape fields in the fingerprint. They are the guard that
  // prevents a verified calculated wall/lab package from leaking into adjacent
  // modes or field/building contexts.
  it("keeps mode and airborne context in the calculation fingerprint", () => {
    const wallLabFingerprint = buildProjectUserVerifiedCalculatedAnchorFingerprint({
      requestContext: BASE_REQUEST_CONTEXT
    });
    const floorContext = {
      ...BASE_REQUEST_CONTEXT,
      mode: "floor"
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const fieldContext = {
      ...BASE_REQUEST_CONTEXT,
      airborneContext: {
        ...BASE_REQUEST_CONTEXT.airborneContext,
        contextMode: "field_between_rooms"
      }
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

    expect(buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext: floorContext })).not.toBe(
      wallLabFingerprint
    );
    expect(buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext: fieldContext })).not.toBe(
      wallLabFingerprint
    );
  });

  it("keeps UI snapshot and value edits out of the fingerprint but keeps physical material data inside", () => {
    const baseAnchor = buildAnchor();
    const reversedCatalogContext = {
      ...BASE_REQUEST_CONTEXT,
      materialCatalog: [...BASE_REQUEST_CONTEXT.materialCatalog].reverse()
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const densityDriftContext = {
      ...BASE_REQUEST_CONTEXT,
      materialCatalog: BASE_REQUEST_CONTEXT.materialCatalog.map((material) =>
        material.id === "custom_glasswool_48"
          ? {
              ...material,
              densityKgM3: material.densityKgM3 + 12
            }
          : material
      )
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const flowDriftContext = {
      ...BASE_REQUEST_CONTEXT,
      materialCatalog: BASE_REQUEST_CONTEXT.materialCatalog.map((material) =>
        material.id === "custom_glasswool_48"
          ? {
              ...material,
              acoustic: {
                ...material.acoustic!,
                flowResistivityPaSM2: 18000
              }
            }
          : material
      )
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const baseFingerprint = buildProjectUserVerifiedCalculatedAnchorFingerprint({
      requestContext: BASE_REQUEST_CONTEXT
    });

    expect(buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext: reversedCatalogContext })).toBe(
      baseFingerprint
    );
    expect(buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext: densityDriftContext })).not.toBe(
      baseFingerprint
    );
    expect(buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext: flowDriftContext })).not.toBe(
      baseFingerprint
    );

    expect(
      ProjectUserVerifiedCalculatedAnchorSchema.safeParse({
        ...baseAnchor,
        values: [
          {
            ...baseAnchor.values[0]!,
            valueDb: baseAnchor.values[0]!.valueDb + 3
          },
          baseAnchor.values[1]!,
          baseAnchor.values[2]!
        ],
        workbenchSnapshot: {
          selectedOutputs: ["Rw"],
          uiOnlyNote: "changed"
        }
      }).success
    ).toBe(true);
  });

  it("rejects duplicate metric+basis values", () => {
    const anchor = buildAnchor();
    const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse({
      ...anchor,
      values: [...anchor.values, { ...anchor.values[0]! }]
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path.join("."))).toContain("values.3.metric");
    }
  });

  it("rejects values that are not supported live outputs in the saved trace", () => {
    const anchor = buildAnchor();
    const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse({
      ...anchor,
      resultBasisTrace: {
        ...anchor.resultBasisTrace,
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: ["STC"]
      }
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining(["values.1.metric"])
      );
    }
  });

  it("rejects airborne/impact metric-basis aliasing", () => {
    const anchor = buildAnchor();
    const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse({
      ...anchor,
      values: [
        {
          ...anchor.values[0]!,
          metricBasis: "impact_lab"
        }
      ]
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path.join("."))).toContain("values.0.metricBasis");
    }
  });

  it("does not allow verified_global scope for user-verified calculated anchors", () => {
    const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse({
      ...buildAnchor(),
      scope: "verified_global"
    });

    expect(parsed.success).toBe(false);
  });
});
