import {
  PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
  buildProjectUserVerifiedCalculatedAnchorFingerprint,
  type ProjectUserVerifiedCalculatedAnchor,
  type ProjectUserVerifiedCalculatedAnchorRequestContext,
  type ProjectUserVerifiedCalculatedAnchorValue
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD } from "./project-user-verified-calculated-exact-bridge";

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
    { materialId: "runtime_verified_board", thicknessMm: 12.5 },
    { materialId: "runtime_verified_stud", thicknessMm: 70 },
    { materialId: "runtime_verified_absorber", thicknessMm: 50 },
    { materialId: "runtime_verified_board", thicknessMm: 12.5 }
  ],
  materialCatalog: [
    {
      acoustic: {
        behavior: "panel_leaf",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "finish",
      densityKgM3: 800,
      id: "runtime_verified_board",
      name: "Runtime verified board",
      tags: ["board"]
    },
    {
      acoustic: {
        behavior: "structural_bridge",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "support",
      densityKgM3: 7850,
      id: "runtime_verified_stud",
      name: "Runtime verified stud",
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
      id: "runtime_verified_absorber",
      name: "Runtime verified absorber",
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
      routeId: "test_user_verified_calculated_runtime_owner",
      source: "calculated_live_result"
    },
    valueDb
  }));
}

function buildAnchor(
  requestContext: ProjectUserVerifiedCalculatedAnchorRequestContext = REQUEST_CONTEXT,
  values: ProjectUserVerifiedCalculatedAnchorValue[] = buildValues()
): ProjectUserVerifiedCalculatedAnchor {
  return {
    anchorKind: "user_verified_calculated_result",
    canonicalizationVersion: PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
    confidencePolicy: "exact_only",
    createdAtIso: "2026-06-22T11:00:00.000Z",
    createdBy: "project-user-verified-calculated-exact-runtime-owner-contract",
    createdFromProjectId: "project-user-verified-calculated-exact-runtime-owner",
    description: "User confirmed calculated runtime package.",
    fingerprint: buildProjectUserVerifiedCalculatedAnchorFingerprint({ requestContext }),
    id: "project-user-verified-calculated-exact-runtime-owner",
    name: "Project verified calculated runtime package",
    requestContext,
    resultBasisTrace: {
      airborneBasis: {
        assumptions: ["runtime owner test calculated package"],
        curveBasis: "calculated_frequency_curve",
        errorBudgetDb: 2,
        kind: "airborne_physics_prediction",
        method: "test_user_verified_calculated_runtime_owner_source_route",
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
      supportedTargetOutputs: values.map((value) => value.metric),
      targetOutputs: requestContext.targetOutputs,
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: [],
      warnings: []
    },
    revision: 1,
    scope: "project_evidence",
    status: "active",
    updatedAtIso: "2026-06-22T11:00:00.000Z",
    values,
    valuesChecksum: "sha256:project-user-verified-calculated-exact-runtime-owner",
    workbenchSnapshot: {}
  };
}

function runWithAnchor(anchor = buildAnchor()) {
  return calculateAssembly(REQUEST_CONTEXT.layers, {
    airborneContext: REQUEST_CONTEXT.airborneContext,
    airborneUserVerifiedCalculatedAnchors: [anchor],
    airborneUserVerifiedCalculatedRequestContext: REQUEST_CONTEXT,
    calculator: "dynamic",
    catalog: REQUEST_CONTEXT.materialCatalog,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  });
}

describe("post-V1 project/user verified calculated exact runtime owner", () => {
  it("moves only stored element-lab values from a single exact user-verified calculated anchor", () => {
    const result = runWithAnchor();

    expect(result.airborneBasis).toMatchObject({
      kind: "airborne_user_verified_calculated_exact",
      method: POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD,
      origin: "user_verified_calculated_exact",
      toleranceClass: "user_verified_calculated_exact"
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -5,
      estimatedRwDb: 52,
      estimatedStc: 51
    });
    expect(result.supportedTargetOutputs).toEqual(expect.arrayContaining(["Rw", "STC", "C", "Ctr"]));
    expect(result.warnings.join(" ")).toMatch(/verified calculated exact anchor active/i);
    expect(result.warnings.join(" ")).not.toMatch(/Answer Engine V1 selected needs_input/i);
    expect(result.airborneBasis?.kind).not.toBe("airborne_measured_exact");
    expect(result.airborneBasis?.origin).not.toBe("measured_exact_full_stack");
  });

  it("keeps normal formula behavior when the trusted current request context is absent", () => {
    const result = calculateAssembly(REQUEST_CONTEXT.layers, {
      airborneContext: REQUEST_CONTEXT.airborneContext,
      airborneUserVerifiedCalculatedAnchors: [buildAnchor()],
      calculator: "dynamic",
      catalog: REQUEST_CONTEXT.materialCatalog,
      targetOutputs: ["Rw"]
    });

    expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD);
    expect(result.metrics.estimatedRwDb).not.toBe(52);
  });

  // Agent coordination, 2026-06-22:
  // These negative runtime cases keep the exact owner narrow. If another agent
  // widens the bridge, these tests should be updated with the new owned route
  // and its physical boundary instead of silently promoting nearby contexts.
  it("does not use verified calculated values for non-wall request modes", () => {
    const floorContext = {
      ...REQUEST_CONTEXT,
      mode: "floor"
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const result = calculateAssembly(REQUEST_CONTEXT.layers, {
      airborneContext: REQUEST_CONTEXT.airborneContext,
      airborneUserVerifiedCalculatedAnchors: [buildAnchor(floorContext, buildValues({ Rw: 63 }))],
      airborneUserVerifiedCalculatedRequestContext: floorContext,
      calculator: "dynamic",
      catalog: REQUEST_CONTEXT.materialCatalog,
      targetOutputs: ["Rw"]
    });

    expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD);
    expect(result.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(result.metrics.estimatedRwDb).not.toBe(63);
    expect(result.warnings.join(" ")).not.toMatch(/verified calculated exact anchor active/i);
  });

  it("does not use verified calculated values for field or building request contexts", () => {
    const fieldContext = {
      ...REQUEST_CONTEXT,
      airborneContext: {
        ...REQUEST_CONTEXT.airborneContext,
        contextMode: "field_between_rooms"
      }
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const result = calculateAssembly(REQUEST_CONTEXT.layers, {
      airborneContext: fieldContext.airborneContext,
      airborneUserVerifiedCalculatedAnchors: [buildAnchor(fieldContext, buildValues({ Rw: 64 }))],
      airborneUserVerifiedCalculatedRequestContext: fieldContext,
      calculator: "dynamic",
      catalog: REQUEST_CONTEXT.materialCatalog,
      targetOutputs: ["Rw"]
    });

    expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD);
    expect(result.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(result.metrics.estimatedRwDb).not.toBe(64);
    expect(result.warnings.join(" ")).not.toMatch(/verified calculated exact anchor active/i);
  });

  it("does not use verified calculated values outside the dynamic calculator lane", () => {
    const result = calculateAssembly(REQUEST_CONTEXT.layers, {
      airborneContext: REQUEST_CONTEXT.airborneContext,
      airborneUserVerifiedCalculatedAnchors: [buildAnchor(REQUEST_CONTEXT, buildValues({ Rw: 67 }))],
      airborneUserVerifiedCalculatedRequestContext: REQUEST_CONTEXT,
      calculator: "mass_law",
      catalog: REQUEST_CONTEXT.materialCatalog,
      targetOutputs: ["Rw"]
    });

    expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD);
    expect(result.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(result.metrics.estimatedRwDb).not.toBe(67);
    expect(result.warnings.join(" ")).not.toMatch(/verified calculated exact anchor active/i);
  });

  it("does not partially publish verified Rw when the same request also asks for field outputs", () => {
    const mixedContext = {
      ...REQUEST_CONTEXT,
      targetOutputs: ["Rw", "R'w"]
    } satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;
    const result = calculateAssembly(REQUEST_CONTEXT.layers, {
      airborneContext: REQUEST_CONTEXT.airborneContext,
      airborneUserVerifiedCalculatedAnchors: [buildAnchor(mixedContext, buildValues({ Rw: 68 }))],
      airborneUserVerifiedCalculatedRequestContext: mixedContext,
      calculator: "dynamic",
      catalog: REQUEST_CONTEXT.materialCatalog,
      targetOutputs: ["Rw", "R'w"]
    });

    expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD);
    expect(result.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(result.metrics.estimatedRwDb).not.toBe(68);
    expect(result.warnings.join(" ")).not.toMatch(/verified calculated exact anchor active/i);
  });

  it("does not synthesize unstored lab companions from stored Rw", () => {
    const result = runWithAnchor(buildAnchor(
      {
        ...REQUEST_CONTEXT,
        targetOutputs: ["Rw", "STC"]
      },
      buildValues({ Rw: 52 })
    ));

    expect(result.metrics.estimatedRwDb).toBe(52);
    expect(result.metrics.estimatedStc).not.toBe(52);
    expect(result.warnings.join(" ")).toMatch(/STC, C, Ctr stayed outside/i);
    expect(result.warnings.join(" ")).toMatch(/Answer Engine V1 selected needs_input for STC, C, Ctr/i);
  });

  it("does not publish any verified value when direct engine input has conflicting exact anchors", () => {
    const firstAnchor = buildAnchor(REQUEST_CONTEXT, buildValues({ Rw: 52 }));
    const secondAnchor = {
      ...buildAnchor(REQUEST_CONTEXT, buildValues({ Rw: 61 })),
      id: "project-user-verified-calculated-exact-runtime-owner-conflict",
      name: "Project verified calculated runtime package conflict",
      valuesChecksum: "sha256:project-user-verified-calculated-exact-runtime-owner-conflict"
    };
    const result = calculateAssembly(REQUEST_CONTEXT.layers, {
      airborneContext: REQUEST_CONTEXT.airborneContext,
      airborneUserVerifiedCalculatedAnchors: [firstAnchor, secondAnchor],
      airborneUserVerifiedCalculatedRequestContext: {
        ...REQUEST_CONTEXT,
        targetOutputs: ["Rw"]
      },
      calculator: "dynamic",
      catalog: REQUEST_CONTEXT.materialCatalog,
      targetOutputs: ["Rw"]
    });

    expect(result.airborneBasis?.method).not.toBe(POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD);
    expect(result.metrics.estimatedRwDb).not.toBe(52);
    expect(result.metrics.estimatedRwDb).not.toBe(61);
    expect(result.warnings.join(" ")).toMatch(/multiple active anchors/i);
    expect(result.warnings.join(" ")).not.toMatch(/verified calculated exact anchor active/i);
  });
});
