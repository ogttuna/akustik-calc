import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ProjectUserVerifiedCalculatedAnchorRequestContext,
  ProjectUserVerifiedCalculatedAnchorResultBasisTrace,
  ProjectUserVerifiedCalculatedAnchorValue
} from "@dynecho/shared";

const mockAuthState = vi.hoisted(() => ({
  value: {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  } as
    | {
        configured: false;
        missingKeys: string[];
        session: {
          expiresAt: number;
          username: string;
        };
      }
    | {
        configured: true;
        session: {
          expiresAt: number;
          username: string;
        } | null;
      }
}));

vi.mock("@/lib/auth", () => ({
  PUBLIC_PREVIEW_USERNAME: "Preview mode",
  getAuthState: vi.fn(async () => mockAuthState.value)
}));

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;

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
    assumptions: ["route test calculated package"],
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 2,
    kind: "airborne_physics_prediction",
    method: "test_verified_calculated_route",
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
      routeId: "test_verified_calculated_route",
      source: "calculated_live_result"
    },
    valueDb: 52
  },
  {
    metric: "STC",
    metricBasis: "airborne_lab",
    provenance: {
      outputStatus: "supported",
      routeId: "test_verified_calculated_route",
      source: "calculated_live_result"
    },
    valueDb: 52
  }
] as const satisfies readonly ProjectUserVerifiedCalculatedAnchorValue[];

let originalEnv: Record<string, string | undefined>;
let tempDirs: string[] = [];

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-verified-calculated-anchor-routes-"));
  tempDirs.push(tempDir);
  return tempDir;
}

function resetMockAuthState() {
  mockAuthState.value = {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  };
}

function clearAuthConfiguration() {
  resetMockAuthState();
  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }
}

function jsonRequest(url: string, payload: unknown, method = "POST") {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method
  });
}

function makeCreatePayload(input: { name?: string; values?: readonly ProjectUserVerifiedCalculatedAnchorValue[] } = {}) {
  return {
    createdFromProjectId: "project-42",
    description: "Confirmed by the project acoustic lead.",
    name: input.name ?? "Verified route package",
    requestContext: REQUEST_CONTEXT,
    resultBasisTrace: RESULT_TRACE,
    values: input.values ?? VALUES,
    workbenchSnapshot: {
      selectedOutputs: ["Rw", "STC"]
    }
  };
}

beforeEach(async () => {
  originalEnv = Object.fromEntries([
    ...AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const),
    ["DYNECHO_PROJECT_STORE_DIR", process.env.DYNECHO_PROJECT_STORE_DIR] as const
  ]);
  clearAuthConfiguration();
  process.env.DYNECHO_PROJECT_STORE_DIR = await makeTempStoreDir();
});

afterEach(async () => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  resetMockAuthState();
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("workbench v2 verified calculated anchor API routes", () => {
  // Agent coordination, 2026-06-22:
  // These tests lock the storage API contract only. They must not import
  // /api/estimate or engine runtime matching until a separate exact owner lands.
  it("stores, lists, and retires explicit verified calculated references", async () => {
    const { GET: listAnchors, POST: createAnchor } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { DELETE: retireAnchor } = await import("../app/api/workbench-v2/verified-calculated-anchors/[anchorId]/route");

    const createResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/verified-calculated-anchors", makeCreatePayload())
    );
    const createBody = (await createResponse.json()) as {
      anchor?: {
        id?: string;
        requestContext?: unknown;
        status?: string;
        values?: unknown[];
      };
    };
    const anchorId = createBody.anchor!.id!;

    expect(createResponse.status).toBe(201);
    expect(createBody.anchor).toMatchObject({
      requestContext: {
        mode: "wall"
      },
      status: "active",
      values: [
        expect.objectContaining({
          metric: "Rw",
          valueDb: 52
        }),
        expect.objectContaining({
          metric: "STC",
          valueDb: 52
        })
      ]
    });

    const listResponse = await listAnchors();
    const listBody = (await listResponse.json()) as {
      anchors?: Array<Record<string, unknown>>;
    };

    expect(listResponse.status).toBe(200);
    expect(listBody.anchors).toEqual([
      expect.objectContaining({
        id: anchorId,
        mode: "wall",
        status: "active",
        valueMetrics: ["Rw", "STC"],
        valueSummaries: [
          {
            metric: "Rw",
            metricBasis: "airborne_lab",
            valueDb: 52
          },
          {
            metric: "STC",
            metricBasis: "airborne_lab",
            valueDb: 52
          }
        ]
      })
    ]);
    expect(listBody.anchors?.[0]).not.toHaveProperty("requestContext");
    expect(listBody.anchors?.[0]).not.toHaveProperty("values");

    const retireResponse = await retireAnchor(
      new Request(`http://localhost/api/workbench-v2/verified-calculated-anchors/${anchorId}`, {
        method: "DELETE"
      }),
      {
        params: Promise.resolve({
          anchorId
        })
      }
    );
    const retireBody = (await retireResponse.json()) as {
      anchor?: {
        revision?: number;
        status?: string;
      };
    };

    expect(retireResponse.status).toBe(200);
    expect(retireBody.anchor).toMatchObject({
      revision: 2,
      status: "retired"
    });

    const retiredListResponse = await listAnchors();
    await expect(retiredListResponse.json()).resolves.toMatchObject({
      anchors: [
        expect.objectContaining({
          id: anchorId,
          status: "retired"
        })
      ],
      ok: true
    });
  });

  it("rejects invalid payloads and duplicate active fingerprints", async () => {
    const { POST: createAnchor } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");

    const invalidResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/verified-calculated-anchors", {
        ...makeCreatePayload(),
        values: [
          {
            ...VALUES[0],
            provenance: {
              ...VALUES[0].provenance,
              outputStatus: "unsupported"
            }
          }
        ]
      })
    );

    expect(invalidResponse.status).toBe(400);
    await expect(invalidResponse.json()).resolves.toMatchObject({
      ok: false
    });

    const firstResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/verified-calculated-anchors", makeCreatePayload())
    );
    expect(firstResponse.status).toBe(201);

    const duplicateResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/verified-calculated-anchors", makeCreatePayload({ name: "Duplicate route package" }))
    );

    expect(duplicateResponse.status).toBe(409);
    await expect(duplicateResponse.json()).resolves.toMatchObject({
      code: "workbench_verified_calculated_anchor_conflict",
      ok: false
    });
  });
});
