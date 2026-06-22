import {
  PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserVerifiedCalculatedAnchorFingerprint,
  type ProjectUserVerifiedCalculatedAnchor,
  type ProjectUserVerifiedCalculatedAnchorRequestContext,
  type ProjectUserVerifiedCalculatedAnchorValue
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD,
  maybeBuildProjectUserVerifiedCalculatedExactBridge
} from "./project-user-verified-calculated-exact-bridge";

const REQUEST_CONTEXT = {
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
  targetOutputs: ["Rw", "STC", "C", "Ctr"]
} as const satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

function buildValues(
  outputs: Partial<Record<"C" | "Ctr" | "Rw" | "STC", number>> = {
    C: -1,
    Ctr: -5,
    Rw: 52,
    STC: 51
  }
): ProjectUserVerifiedCalculatedAnchorValue[] {
  return Object.entries(outputs).map(([metric, valueDb]) => ({
    metric: metric as "C" | "Ctr" | "Rw" | "STC",
    metricBasis: "airborne_lab",
    provenance: {
      outputStatus: "supported",
      routeId: "test_user_verified_calculated_exact_bridge",
      source: "calculated_live_result"
    },
    valueDb
  }));
}

function buildAnchor(input: {
  id?: string;
  requestContext?: ProjectUserVerifiedCalculatedAnchorRequestContext;
  status?: ProjectUserVerifiedCalculatedAnchor["status"];
  values?: ProjectUserVerifiedCalculatedAnchorValue[];
} = {}): ProjectUserVerifiedCalculatedAnchor {
  const requestContext = input.requestContext ?? REQUEST_CONTEXT;
  const values = input.values ?? buildValues();
  const supportedTargetOutputs = values.map((value) => value.metric);

  return {
    anchorKind: "user_verified_calculated_result",
    canonicalizationVersion: PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-22T10:00:00.000Z",
    createdBy: "project-user-verified-calculated-exact-bridge-owner-contract",
    createdFromProjectId: "project-user-verified-calculated-exact-bridge-owner",
    description: "User confirmed the calculated element-lab wall package.",
    fingerprint: buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext }),
    id: input.id ?? "project-user-verified-calculated-exact-bridge-base",
    name: input.id ?? "Project verified calculated wall package",
    requestContext,
    resultBasisTrace: {
      airborneBasis: {
        assumptions: ["test calculated package"],
        curveBasis: "calculated_frequency_curve",
        errorBudgetDb: 2,
        kind: "airborne_physics_prediction",
        method: "test_user_verified_calculated_exact_bridge_source_route",
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
      supportedTargetOutputs,
      targetOutputs: requestContext.targetOutputs,
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: [],
      warnings: []
    },
    revision: 1,
    scope: "project_evidence",
    status: input.status ?? "active",
    updatedAtIso: "2026-06-22T10:00:00.000Z",
    values,
    valuesChecksum: "sha256:project-user-verified-calculated-exact-bridge-owner",
    workbenchSnapshot: {
      selectedOutputs: requestContext.targetOutputs
    }
  };
}

describe("post-V1 project/user verified calculated exact bridge owner", () => {
  it("publishes only stored airborne_lab values with neutral non-measured provenance on exact match", () => {
    const result = maybeBuildProjectUserVerifiedCalculatedExactBridge({
      anchors: [buildAnchor()],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      requestContext: REQUEST_CONTEXT,
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });

    expect(result).toMatchObject({
      applied: true,
      basis: {
        kind: "airborne_user_verified_calculated_exact",
        method: POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD,
        origin: "user_verified_calculated_exact",
        toleranceClass: "user_verified_calculated_exact"
      },
      unsupportedOutputs: [],
      values: {
        C: -1,
        Ctr: -5,
        Rw: 52,
        STC: 51
      }
    });
    expect(result.basis?.kind).not.toBe("airborne_measured_exact");
    expect(result.basis?.origin).not.toBe("measured_exact_full_stack");
    expect(result.basis?.requiredInputs).toEqual(expect.arrayContaining([
      "airborneUserVerifiedCalculatedAnchors",
      "canonicalUserVerifiedCalculatedFingerprint",
      "targetOutput:Rw",
      "targetOutput:STC"
    ]));
  });

  it("continues normal calculation when the fingerprint does not match", () => {
    const changedContext = {
      ...REQUEST_CONTEXT,
      layers: [
        { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
        ...REQUEST_CONTEXT.layers.slice(1)
      ]
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const result = maybeBuildProjectUserVerifiedCalculatedExactBridge({
      anchors: [buildAnchor()],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      requestContext: changedContext,
      targetOutputs: ["Rw"]
    });

    expect(result).toEqual({
      applied: false,
      unsupportedOutputs: [],
      values: {},
      warnings: []
    });
  });

  it("blocks conflicts instead of silently picking one active matching anchor", () => {
    const result = maybeBuildProjectUserVerifiedCalculatedExactBridge({
      anchors: [
        buildAnchor({ id: "verified-calculated-a" }),
        buildAnchor({ id: "verified-calculated-b" })
      ],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      requestContext: REQUEST_CONTEXT,
      targetOutputs: ["Rw", "STC"]
    });

    expect(result.applied).toBe(false);
    expect(result.unsupportedOutputs).toEqual(["Rw", "STC"]);
    expect(result.warnings.join(" ")).toMatch(/multiple active anchors/i);
  });

  it("does not apply retired anchors or when stronger measured or compatible anchors already applied", () => {
    expect(
      maybeBuildProjectUserVerifiedCalculatedExactBridge({
        anchors: [buildAnchor({ status: "retired" })],
        compatibleAnchorDeltaAlreadyApplied: false,
        exactFullStackAlreadyApplied: false,
        requestContext: REQUEST_CONTEXT,
        targetOutputs: ["Rw"]
      }).applied
    ).toBe(false);

    expect(
      maybeBuildProjectUserVerifiedCalculatedExactBridge({
        anchors: [buildAnchor()],
        compatibleAnchorDeltaAlreadyApplied: false,
        exactFullStackAlreadyApplied: true,
        requestContext: REQUEST_CONTEXT,
        targetOutputs: ["Rw"]
      }).applied
    ).toBe(false);

    expect(
      maybeBuildProjectUserVerifiedCalculatedExactBridge({
        anchors: [buildAnchor()],
        compatibleAnchorDeltaAlreadyApplied: true,
        exactFullStackAlreadyApplied: false,
        requestContext: REQUEST_CONTEXT,
        targetOutputs: ["Rw"]
      }).applied
    ).toBe(false);
  });

  // Agent coordination, 2026-06-22:
  // These guards protect the pure bridge even if a caller accidentally passes
  // malformed or non-lab stored values. Do not loosen them without a new owned
  // field/building adapter or schema migration.
  it("ignores schema-invalid matching anchors instead of publishing stale fingerprints", () => {
    const staleFingerprintAnchor = {
      ...buildAnchor(),
      fingerprint: "dynecho:user-verified-calculated-anchor:v1:0000000000000000"
    };
    const result = maybeBuildProjectUserVerifiedCalculatedExactBridge({
      anchors: [staleFingerprintAnchor],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      requestContext: REQUEST_CONTEXT,
      targetOutputs: ["Rw"]
    });

    expect(result).toEqual({
      applied: false,
      unsupportedOutputs: [],
      values: {},
      warnings: []
    });
  });

  it("does not publish matching values stored on non-lab metric bases", () => {
    const result = maybeBuildProjectUserVerifiedCalculatedExactBridge({
      anchors: [
        buildAnchor({
          values: [
            {
              ...buildValues({ Rw: 58 })[0]!,
              metricBasis: "airborne_field"
            }
          ]
        })
      ],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      requestContext: {
        ...REQUEST_CONTEXT,
        targetOutputs: ["Rw"]
      },
      targetOutputs: ["Rw"]
    });

    expect(result.applied).toBe(false);
    expect(result.unsupportedOutputs).toEqual(["Rw"]);
    expect(result.values).toEqual({});
    expect(result.warnings.join(" ")).toMatch(/none of the requested lab outputs were stored/i);
  });

  it("keeps unstored outputs unsupported without aliasing from Rw", () => {
    const result = maybeBuildProjectUserVerifiedCalculatedExactBridge({
      anchors: [
        buildAnchor({
          values: buildValues({ Rw: 52 })
        })
      ],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      requestContext: {
        ...REQUEST_CONTEXT,
        targetOutputs: ["Rw", "STC"]
      },
      targetOutputs: ["Rw", "STC"]
    });

    expect(result.applied).toBe(true);
    expect(result.values).toEqual({ Rw: 52 });
    expect(result.unsupportedOutputs).toEqual(["STC"]);
    expect(result.warnings.join(" ")).toMatch(/STC stayed outside/i);
  });

  it("keeps field and building requests outside the first exact owner", () => {
    const fieldContext = {
      ...REQUEST_CONTEXT,
      airborneContext: {
        ...REQUEST_CONTEXT.airborneContext,
        contextMode: "field_between_rooms" as const
      },
      targetOutputs: ["DnT,w"]
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const result = maybeBuildProjectUserVerifiedCalculatedExactBridge({
      anchors: [buildAnchor({ requestContext: fieldContext })],
      compatibleAnchorDeltaAlreadyApplied: false,
      exactFullStackAlreadyApplied: false,
      requestContext: fieldContext,
      targetOutputs: ["DnT,w"]
    });

    expect(result).toEqual({
      applied: false,
      unsupportedOutputs: [],
      values: {},
      warnings: []
    });
  });
});
