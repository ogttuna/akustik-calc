import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import type {
  ProjectUserVerifiedCalculatedAnchorRequestContext,
  ProjectUserVerifiedCalculatedAnchorResultBasisTrace,
  ProjectUserVerifiedCalculatedAnchorValue
} from "@dynecho/shared";

import { type ProjectOwnerScope, ServerProjectStorageError } from "./server-project-storage";
import { FileWorkbenchV2VerifiedCalculatedAnchorRepository } from "./workbench-v2-verified-calculated-anchor-storage";

const OWNER_A: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "verified_calculated_owner_a",
  ownerLabel: "Consultant A"
};

const OWNER_B: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "verified_calculated_owner_b",
  ownerLabel: "Consultant B"
};

const FIXED_NOW = new Date("2026-06-22T09:00:00.000Z");

let tempDirs: string[] = [];

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-verified-calculated-anchor-store-"));
  tempDirs.push(tempDir);
  return tempDir;
}

function makeIdFactory() {
  let nextId = 1;

  return () => {
    const id = `00000000-0000-4000-8000-${String(nextId).padStart(12, "0")}`;
    nextId += 1;
    return id;
  };
}

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
  targetOutputs: ["Rw", "STC"]
} as const satisfies ProjectUserVerifiedCalculatedAnchorRequestContext;

const RESULT_TRACE = {
  airborneBasis: {
    assumptions: ["test storage route"],
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 2,
    kind: "airborne_physics_prediction",
    method: "test_verified_calculated_storage_route",
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
  supportedTargetOutputs: ["Rw", "STC"],
  targetOutputs: ["Rw", "STC"],
  unsupportedImpactOutputs: [],
  unsupportedTargetOutputs: [],
  warnings: []
} as const satisfies ProjectUserVerifiedCalculatedAnchorResultBasisTrace;

const VALUES = [
  {
    metric: "Rw",
    metricBasis: "airborne_lab",
    provenance: {
      outputStatus: "supported",
      routeId: "test_verified_calculated_storage_route",
      source: "calculated_live_result"
    },
    valueDb: 52
  },
  {
    metric: "STC",
    metricBasis: "airborne_lab",
    provenance: {
      outputStatus: "supported",
      routeId: "test_verified_calculated_storage_route",
      source: "calculated_live_result"
    },
    valueDb: 52
  }
] as const satisfies readonly ProjectUserVerifiedCalculatedAnchorValue[];

afterEach(async () => {
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("workbench v2 verified calculated anchor storage", () => {
  it("creates, lists, reads, and retires owner-scoped verified calculated anchors", async () => {
    const repository = new FileWorkbenchV2VerifiedCalculatedAnchorRepository({
      baseDir: await makeTempStoreDir(),
      idFactory: makeIdFactory(),
      now: () => FIXED_NOW
    });

    const anchor = await repository.createVerifiedCalculatedAnchor(OWNER_A, {
      createdFromPresetId: "preset-1",
      description: "  Confirmed by project acoustic lead  ",
      name: "  Verified wall result  ",
      requestContext: REQUEST_CONTEXT,
      resultBasisTrace: RESULT_TRACE,
      values: [...VALUES],
      workbenchSnapshot: {
        selectedOutputs: ["Rw", "STC"]
      }
    });

    expect(anchor).toMatchObject({
      anchorKind: "user_verified_calculated_result",
      createdAtIso: FIXED_NOW.toISOString(),
      createdBy: OWNER_A.ownerLabel,
      createdFromPresetId: "preset-1",
      description: "Confirmed by project acoustic lead",
      id: "00000000-0000-4000-8000-000000000001",
      name: "Verified wall result",
      scope: "user_evidence",
      status: "active",
      updatedAtIso: FIXED_NOW.toISOString()
    });
    expect(anchor.valuesChecksum).toMatch(/^[a-f0-9]{64}$/u);
    expect(await repository.listVerifiedCalculatedAnchorSummaries(OWNER_B)).toEqual([]);
    await expect(repository.listVerifiedCalculatedAnchorSummaries(OWNER_A)).resolves.toEqual([
      expect.objectContaining({
        id: anchor.id,
        valueMetrics: ["Rw", "STC"],
        valueSummaries: [
          expect.objectContaining({
            metric: "Rw",
            metricBasis: "airborne_lab",
            valueDb: 52
          }),
          expect.objectContaining({
            metric: "STC",
            metricBasis: "airborne_lab",
            valueDb: 52
          })
        ]
      })
    ]);
    expect(await repository.readVerifiedCalculatedAnchor(OWNER_A, anchor.id)).toMatchObject({
      id: anchor.id,
      values: expect.arrayContaining([expect.objectContaining({ metric: "Rw", valueDb: 52 })])
    });
    expect(await repository.listActiveVerifiedCalculatedAnchors(OWNER_A)).toHaveLength(1);

    const retired = await repository.retireVerifiedCalculatedAnchor(OWNER_A, anchor.id);

    expect(retired).toMatchObject({
      id: anchor.id,
      revision: 2,
      status: "retired"
    });
    expect(await repository.listActiveVerifiedCalculatedAnchors(OWNER_A)).toEqual([]);
  });

  it("blocks duplicate active anchors for the same calculation-relevant fingerprint", async () => {
    const repository = new FileWorkbenchV2VerifiedCalculatedAnchorRepository({
      baseDir: await makeTempStoreDir(),
      idFactory: makeIdFactory(),
      now: () => FIXED_NOW
    });

    const first = await repository.createVerifiedCalculatedAnchor(OWNER_A, {
      name: "First verified package",
      requestContext: REQUEST_CONTEXT,
      resultBasisTrace: RESULT_TRACE,
      values: [...VALUES]
    });

    await expect(
      repository.createVerifiedCalculatedAnchor(OWNER_A, {
        name: "Duplicate verified package",
        requestContext: {
          ...REQUEST_CONTEXT,
          targetOutputs: ["Rw"]
        },
        resultBasisTrace: {
          ...RESULT_TRACE,
          supportedTargetOutputs: ["Rw"],
          targetOutputs: ["Rw"]
        },
        values: [VALUES[0]!]
      })
    ).rejects.toMatchObject({
      code: "workbench_verified_calculated_anchor_conflict",
      statusCode: 409
    });

    await repository.retireVerifiedCalculatedAnchor(OWNER_A, first.id);
    await expect(
      repository.createVerifiedCalculatedAnchor(OWNER_A, {
        name: "Replacement verified package",
        requestContext: REQUEST_CONTEXT,
        resultBasisTrace: RESULT_TRACE,
        values: [...VALUES]
      })
    ).resolves.toMatchObject({
      name: "Replacement verified package",
      status: "active"
    });
  });

  it("rejects invalid ids and schema-invalid saved values", async () => {
    const repository = new FileWorkbenchV2VerifiedCalculatedAnchorRepository({
      baseDir: await makeTempStoreDir(),
      idFactory: makeIdFactory(),
      now: () => FIXED_NOW
    });

    await expect(repository.readVerifiedCalculatedAnchor(OWNER_A, "")).rejects.toBeInstanceOf(ServerProjectStorageError);
    await expect(
      repository.createVerifiedCalculatedAnchor(OWNER_A, {
        name: "Invalid output package",
        requestContext: REQUEST_CONTEXT,
        resultBasisTrace: {
          ...RESULT_TRACE,
          supportedTargetOutputs: ["Rw"],
          unsupportedTargetOutputs: ["STC"]
        },
        values: [...VALUES]
      })
    ).rejects.toMatchObject({
      code: "invalid_workbench_verified_calculated_anchor_payload",
      statusCode: 400
    });
  });
});
