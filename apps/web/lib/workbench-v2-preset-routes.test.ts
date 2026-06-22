import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type {
  ProjectUserVerifiedCalculatedAnchorRequestContext,
  ProjectUserVerifiedCalculatedAnchorValue
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot,
  parseWorkbenchV2ProjectSnapshot
} from "../features/workbench-rebuild/workbench-v2-project-snapshot";

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

let originalEnv: Record<string, string | undefined>;
let tempDirs: string[] = [];

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-workbench-preset-routes-"));
  tempDirs.push(tempDir);
  return tempDir;
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

function configureAuth() {
  mockAuthState.value = {
    configured: true,
    session: null
  };
}

function signInConfiguredUser(username = "alice@example.com") {
  mockAuthState.value = {
    configured: true,
    session: {
      expiresAt: Date.now() + 60 * 60 * 1000,
      username
    }
  };
}

function makePresetSnapshot(input?: { mode?: "floor" | "wall"; name?: string }) {
  const mode = input?.mode ?? "wall";

  return buildWorkbenchV2ProjectSnapshot({
    context: {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      wallTopologyMode: mode === "wall" ? "double_leaf_framed" : "auto"
    },
    customMaterials: [
      {
        acoustic: {
          behavior: "panel_leaf",
          notes: [],
          propertySourceStatus: "user_supplied"
        },
        category: "finish",
        densityKgM3: 780,
        id: "custom_preset_panel",
        name: "Preset custom panel",
        tags: ["custom-workbench-material", "panel_leaf"]
      }
    ],
    id: "workbench-v2-preset-snapshot",
    layers: [
      {
        id: "layer-1",
        materialId: "custom_preset_panel",
        role: mode === "wall" ? "side_a" : "finish",
        thicknessMm: "12.5"
      }
    ],
    materialVisualOverrides: [
      {
        fillColor: "#123456",
        materialId: "custom_preset_panel",
        updatedAtIso: "2026-06-15T10:00:00.000Z"
      }
    ],
    mode,
    name: input?.name ?? "Preset snapshot",
    savedAtIso: "2026-06-15T10:00:00.000Z",
    selectedLayerId: "layer-1",
    selectedOutputs: mode === "wall" ? ["Rw"] : ["Ln,w"]
  });
}

function makeVerifiedCalculatedRequestContext(
  customMaterials: ProjectUserVerifiedCalculatedAnchorRequestContext["materialCatalog"],
  targetOutputs: ProjectUserVerifiedCalculatedAnchorRequestContext["targetOutputs"] = ["Rw", "STC", "C", "Ctr"]
): ProjectUserVerifiedCalculatedAnchorRequestContext {
  return {
    airborneContext: {
      wallTopology: {
        topologyMode: "double_leaf_framed"
      }
    },
    calculator: "dynamic",
    layers: [
      {
        materialId: "custom_preset_panel",
        thicknessMm: 12.5
      }
    ],
    materialCatalog: customMaterials,
    mode: "wall",
    targetOutputs
  };
}

function makeVerifiedCalculatedValues(
  values: Partial<Record<"C" | "Ctr" | "Rw" | "STC", number>> = {
    C: -3,
    Ctr: -7,
    Rw: 73,
    STC: 72
  }
): ProjectUserVerifiedCalculatedAnchorValue[] {
  return Object.entries(values).map(([metric, valueDb]) => ({
    metric: metric as "C" | "Ctr" | "Rw" | "STC",
    metricBasis: "airborne_lab",
    provenance: {
      outputStatus: "supported",
      routeId: "workbench_v2_verified_calculated_estimate_route_test",
      source: "calculated_live_result"
    },
    valueDb
  }));
}

function makeVerifiedCalculatedCreatePayload(input: {
  createdFromPresetId?: string;
  requestContext: ProjectUserVerifiedCalculatedAnchorRequestContext;
  values?: ProjectUserVerifiedCalculatedAnchorValue[];
}) {
  const values = input.values ?? makeVerifiedCalculatedValues();

  return {
    createdFromPresetId: input.createdFromPresetId,
    description: "Route test verified calculated reference.",
    name: "Verified calculated route reference",
    requestContext: input.requestContext,
    resultBasisTrace: {
      assumptions: ["route test user confirmed calculated package"],
      calculator: "dynamic",
      ratingAdapterBasisSet: [],
      supportedImpactOutputs: [],
      supportedTargetOutputs: values.map((value) => value.metric),
      targetOutputs: input.requestContext.targetOutputs,
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: [],
      warnings: []
    },
    scope: "user_evidence",
    values,
    workbenchSnapshot: {}
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

describe("workbench v2 preset API routes", () => {
  it("stores reusable workbench presets without requiring a project", async () => {
    const { GET: listPresets, POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { GET: readPreset, PATCH: updatePreset, DELETE: deletePreset } = await import("../app/api/workbench-v2/presets/[presetId]/route");
    const { POST: duplicatePreset } = await import("../app/api/workbench-v2/presets/[presetId]/duplicate/route");

    const createResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        description: "Starter wall note",
        name: "Starter wall",
        snapshot: makePresetSnapshot({
          name: "Starter wall"
        })
      })
    );
    const createBody = (await createResponse.json()) as {
      preset?: {
        id?: string;
        snapshot?: unknown;
      };
    };
    const presetId = createBody.preset!.id!;

    expect(createResponse.status).toBe(201);
    expect(createBody.preset).toMatchObject({
      description: "Starter wall note",
      hasCustomMaterials: true,
      hasVisualOverrides: true,
      kind: "wall",
      layerCount: 1,
      name: "Starter wall",
      selectedOutputCount: 1
    });
    expect(parseWorkbenchV2ProjectSnapshot(createBody.preset?.snapshot)).toMatchObject({
      snapshot: {
        customMaterials: [
          expect.objectContaining({
            id: "custom_preset_panel"
          })
        ],
        materialVisualOverrides: [
          expect.objectContaining({
            fillColor: "#123456"
          })
        ]
      }
    });

    const listResponse = await listPresets();
    const listBody = (await listResponse.json()) as {
      presets?: Array<{
        id: string;
        snapshot?: unknown;
      }>;
    };

    expect(listResponse.status).toBe(200);
    expect(listBody.presets).toEqual([
      expect.objectContaining({
        id: presetId,
        hasCustomMaterials: true,
        hasVisualOverrides: true,
        name: "Starter wall"
      })
    ]);
    expect(listBody.presets?.[0]).not.toHaveProperty("snapshot");

    const readResponse = await readPreset(new Request(`http://localhost/api/workbench-v2/presets/${presetId}`), {
      params: Promise.resolve({
        presetId
      })
    });

    expect(readResponse.status).toBe(200);

    const updateResponse = await updatePreset(
      jsonRequest(
        `http://localhost/api/workbench-v2/presets/${presetId}`,
        {
          description: "Updated starter note",
          name: "Updated starter wall"
        },
        "PATCH"
      ),
      {
        params: Promise.resolve({
          presetId
        })
      }
    );

    await expect(updateResponse.json()).resolves.toMatchObject({
      ok: true,
      preset: {
        description: "Updated starter note",
        id: presetId,
        name: "Updated starter wall"
      }
    });

    const duplicateResponse = await duplicatePreset(
      jsonRequest(`http://localhost/api/workbench-v2/presets/${presetId}/duplicate`, {}),
      {
        params: Promise.resolve({
          presetId
        })
      }
    );
    const duplicateBody = (await duplicateResponse.json()) as {
      preset?: {
        id?: string;
        name?: string;
      };
    };

    expect(duplicateResponse.status).toBe(201);
    expect(duplicateBody.preset).toMatchObject({
      name: "Copy of Updated starter wall"
    });
    expect(duplicateBody.preset?.id).not.toBe(presetId);

    const deleteResponse = await deletePreset(
      new Request(`http://localhost/api/workbench-v2/presets/${presetId}`, {
        method: "DELETE"
      }),
      {
        params: Promise.resolve({
          presetId
        })
      }
    );

    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toMatchObject({
      ok: true
    });
  });

  it("rejects invalid preset snapshots before storage", async () => {
    const { POST: createPreset } = await import("../app/api/workbench-v2/presets/route");

    const response = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Broken preset",
        snapshot: {
          id: "not-a-workbench-v2-snapshot"
        }
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false
    });
  });

  // Agent coordination, 2026-06-22:
  // This integration test cold-loads estimate routing plus the engine exact
  // anchor bridge. Keep the higher timeout unless the test is split by route.
  it("keeps presets template-only until an explicit measured Rw anchor is saved", async () => {
    const { POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { GET: listAnchors, POST: createAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Measured wall"
    });

    const createResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Measured wall",
        snapshot
      })
    );
    const createBody = (await createResponse.json()) as {
      preset?: {
        id?: string;
      };
    };
    const presetId = createBody.preset!.id!;

    const emptyAnchorResponse = await listAnchors();
    await expect(emptyAnchorResponse.json()).resolves.toMatchObject({
      anchors: [],
      ok: true
    });

    const anchorResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        measurementMethodStandard: "ISO 10140-2",
        presetId,
        ratingStandard: "ISO 717-1",
        toleranceDb: 1,
        valueDb: 52
      })
    );
    const anchorBody = (await anchorResponse.json()) as {
      anchor?: {
        createdFromPresetId?: string;
        sourceStatus?: string;
        valueDb?: number;
      };
    };

    expect(anchorResponse.status).toBe(201);
    expect(anchorBody.anchor).toMatchObject({
      createdFromPresetId: presetId,
      sourceStatus: "active",
      valueDb: 52
    });

    const duplicateAnchorResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        measurementMethodStandard: "ISO 10140-2",
        presetId,
        ratingStandard: "ISO 717-1",
        toleranceDb: 1,
        valueDb: 52
      })
    );

    expect(duplicateAnchorResponse.status).toBe(409);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: {
          wallTopology: {
            topologyMode: "double_leaf_framed"
          }
        },
        calculator: "dynamic",
        layers: [
          {
            materialId: "custom_preset_panel",
            thicknessMm: 12.5
          }
        ],
        materialCatalog: snapshot.customMaterials,
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result).toMatchObject({
      airborneBasis: {
        origin: "measured_exact_full_stack"
      },
      metrics: {
        estimatedRwDb: 52
      }
    });
  }, 10_000);

  it("retires measured wall Rw anchors before loading active references into estimates", async () => {
    const { POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { GET: listAnchors, POST: createAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/route");
    const { DELETE: retireAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/[anchorId]/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Measured wall retire"
    });

    const createResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Measured wall retire",
        snapshot
      })
    );
    const createBody = (await createResponse.json()) as {
      preset?: {
        id?: string;
      };
    };
    const presetId = createBody.preset!.id!;

    const anchorResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        measurementMethodStandard: "ISO 10140-2",
        presetId,
        ratingStandard: "ISO 717-1",
        valueDb: 52
      })
    );
    const anchorBody = (await anchorResponse.json()) as {
      anchor?: {
        id?: string;
      };
    };
    const anchorId = anchorBody.anchor!.id!;

    const activeEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: {
          wallTopology: {
            topologyMode: "double_leaf_framed"
          }
        },
        calculator: "dynamic",
        layers: [
          {
            materialId: "custom_preset_panel",
            thicknessMm: 12.5
          }
        ],
        materialCatalog: snapshot.customMaterials,
        targetOutputs: ["Rw"]
      })
    );
    const activeEstimateBody = (await activeEstimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
      };
    };

    expect(activeEstimateBody.result).toMatchObject({
      airborneBasis: {
        origin: "measured_exact_full_stack"
      },
      metrics: {
        estimatedRwDb: 52
      }
    });

    const retireResponse = await retireAnchor(new Request(`http://localhost/api/workbench-v2/measured-wall-rw-anchors/${anchorId}`, {
      method: "DELETE"
    }), {
      params: Promise.resolve({
        anchorId
      })
    });
    const retireBody = (await retireResponse.json()) as {
      anchor?: {
        revision?: number;
        sourceStatus?: string;
      };
    };

    expect(retireResponse.status).toBe(200);
    expect(retireBody.anchor).toMatchObject({
      revision: 2,
      sourceStatus: "retired"
    });

    const inactiveEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: {
          wallTopology: {
            topologyMode: "double_leaf_framed"
          }
        },
        calculator: "dynamic",
        layers: [
          {
            materialId: "custom_preset_panel",
            thicknessMm: 12.5
          }
        ],
        materialCatalog: snapshot.customMaterials,
        targetOutputs: ["Rw"]
      })
    );
    const inactiveEstimateBody = (await inactiveEstimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(inactiveEstimateResponse.status).toBe(200);
    expect(inactiveEstimateBody.result?.airborneBasis?.origin).not.toBe("measured_exact_full_stack");
    expect(inactiveEstimateBody.result?.metrics?.estimatedRwDb).not.toBe(52);
    expect(inactiveEstimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("Project/user measured wall Rw exact anchor active")])
    );

    const replacementAnchorResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        measurementMethodStandard: "ISO 10140-2",
        presetId,
        ratingStandard: "ISO 717-1",
        valueDb: 53
      })
    );
    expect(replacementAnchorResponse.status).toBe(201);

    const listResponse = await listAnchors();
    await expect(listResponse.json()).resolves.toMatchObject({
      anchors: expect.arrayContaining([
        expect.objectContaining({
          sourceStatus: "active",
          valueDb: 53
        }),
        expect.objectContaining({
          sourceStatus: "retired",
          valueDb: 52
        })
      ]),
      ok: true
    });
  });

  it("does not alias scalar measured Rw anchors into lab companion outputs", async () => {
    const { POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { POST: createAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Measured companion boundary wall"
    });

    const createResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Measured companion boundary wall",
        snapshot
      })
    );
    const createBody = (await createResponse.json()) as {
      preset?: {
        id?: string;
      };
    };

    const anchorResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        measurementMethodStandard: "ISO 10140-2",
        presetId: createBody.preset!.id!,
        ratingStandard: "ISO 717-1",
        valueDb: 52
      })
    );

    expect(anchorResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: {
          wallTopology: {
            topologyMode: "double_leaf_framed"
          }
        },
        calculator: "dynamic",
        layers: [
          {
            materialId: "custom_preset_panel",
            thicknessMm: 12.5
          }
        ],
        materialCatalog: snapshot.customMaterials,
        targetOutputs: ["Rw", "STC"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("measured_exact_full_stack");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(52);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("Project/user measured wall Rw exact anchor active")])
    );
  });

  it("loads active verified calculated references into exact wall lab estimates", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext
        })
      )
    );

    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw", "STC", "C", "Ctr"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedCDb?: number;
          estimatedCtrDb?: number;
          estimatedRwDb?: number;
          estimatedStc?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result).toMatchObject({
      airborneBasis: {
        origin: "user_verified_calculated_exact"
      },
      metrics: {
        estimatedCDb: -3,
        estimatedCtrDb: -7,
        estimatedRwDb: 73,
        estimatedStc: 72
      }
    });
    expect(estimateBody.result?.warnings ?? []).toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("Project/user measured wall Rw exact anchor active")])
    );
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("Answer Engine V1 selected needs_input")])
    );
  });

  // Agent coordination, 2026-06-22:
  // These route-level guards lock the Playwright-found bug class. Stored
  // verified-calculated references may load only from explicit wall/lab estimate
  // requests; omitting mode or switching mode must keep the engine on the
  // normal calculation route.
  it("does not load verified calculated references when estimate mode is omitted", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated missing mode wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("does not load verified calculated references for non-wall estimate modes", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated floor blocked wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "floor",
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("does not load verified calculated references for non-dynamic estimate calculators", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated non-dynamic blocked wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "mass_law",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("does not load verified calculated references when exact lab requests are mixed with field outputs", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated mixed output blocked wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw", "R'w"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("refuses verified calculated references when the estimate layer fingerprint drifts", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated drift wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: [
          {
            materialId: "custom_preset_panel",
            thicknessMm: 15
          }
        ],
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("refuses verified calculated references when the estimate material fingerprint drifts", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated material drift wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);
    const driftedCatalog = requestContext.materialCatalog.map((material) =>
      material.id === "custom_preset_panel"
        ? {
            ...material,
            densityKgM3: material.densityKgM3 + 120
          }
        : material
    );

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: driftedCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("keeps measured wall Rw anchors ahead of verified calculated references in estimates", async () => {
    const { POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { POST: createMeasuredAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/route");
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Measured precedence wall"
    });

    const createPresetResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Measured precedence wall",
        snapshot
      })
    );
    const createPresetBody = (await createPresetResponse.json()) as {
      preset?: {
        id?: string;
      };
    };
    const presetId = createPresetBody.preset!.id!;
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createVerifiedReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createVerifiedReferenceResponse.status).toBe(201);

    const createMeasuredAnchorResponse = await createMeasuredAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        measurementMethodStandard: "ISO 10140-2",
        presetId,
        ratingStandard: "ISO 717-1",
        valueDb: 52
      })
    );
    expect(createMeasuredAnchorResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result).toMatchObject({
      airborneBasis: {
        origin: "measured_exact_full_stack"
      },
      metrics: {
        estimatedRwDb: 52
      }
    });
    expect(estimateBody.result?.warnings ?? []).toEqual(
      expect.arrayContaining([expect.stringContaining("Project/user measured wall Rw exact anchor active")])
    );
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("does not load verified calculated references for field or building contexts", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated field blocked wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: {
          ...requestContext.airborneContext,
          contextMode: "field_between_rooms"
        },
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("does not synthesize unstored verified calculated lab companions through estimate loading", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated partial wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw", "STC"]
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
          estimatedStc?: number;
        };
        warnings?: string[];
      };
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.result?.airborneBasis?.origin).toBe("user_verified_calculated_exact");
    expect(estimateBody.result?.metrics?.estimatedRwDb).toBe(73);
    expect(estimateBody.result?.metrics?.estimatedStc).not.toBe(73);
    expect(estimateBody.result?.warnings ?? []).toEqual(
      expect.arrayContaining([expect.stringMatching(/STC stayed outside/i)])
    );
  });

  it("retires verified calculated references before loading active references into estimates", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { DELETE: retireVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/[anchorId]/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Verified calculated retired wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials);

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext
        })
      )
    );
    const createReferenceBody = (await createReferenceResponse.json()) as {
      anchor?: {
        id?: string;
      };
    };
    const anchorId = createReferenceBody.anchor!.id!;

    const activeEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const activeEstimateBody = (await activeEstimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
      };
    };

    expect(activeEstimateResponse.status).toBe(200);
    expect(activeEstimateBody.result).toMatchObject({
      airborneBasis: {
        origin: "user_verified_calculated_exact"
      },
      metrics: {
        estimatedRwDb: 73
      }
    });

    const retireResponse = await retireVerifiedReference(new Request(
      `http://localhost/api/workbench-v2/verified-calculated-anchors/${anchorId}`,
      {
        method: "DELETE"
      }
    ), {
      params: Promise.resolve({
        anchorId
      })
    });

    expect(retireResponse.status).toBe(200);

    const inactiveEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const inactiveEstimateBody = (await inactiveEstimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(inactiveEstimateResponse.status).toBe(200);
    expect(inactiveEstimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(inactiveEstimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(inactiveEstimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("keeps verified calculated reference libraries isolated by configured owner", async () => {
    const { POST: createVerifiedReference } = await import("../app/api/workbench-v2/verified-calculated-anchors/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Alice verified calculated wall"
    });
    const requestContext = makeVerifiedCalculatedRequestContext(snapshot.customMaterials, ["Rw"]);

    configureAuth();
    signInConfiguredUser("alice@example.com");

    const createReferenceResponse = await createVerifiedReference(
      jsonRequest(
        "http://localhost/api/workbench-v2/verified-calculated-anchors",
        makeVerifiedCalculatedCreatePayload({
          requestContext,
          values: makeVerifiedCalculatedValues({ Rw: 73 })
        })
      )
    );
    expect(createReferenceResponse.status).toBe(201);

    const aliceEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const aliceEstimateBody = (await aliceEstimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
      };
    };

    expect(aliceEstimateResponse.status).toBe(200);
    expect(aliceEstimateBody.result).toMatchObject({
      airborneBasis: {
        origin: "user_verified_calculated_exact"
      },
      metrics: {
        estimatedRwDb: 73
      }
    });

    signInConfiguredUser("bob@example.com");

    const bobEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: requestContext.airborneContext,
        calculator: "dynamic",
        layers: requestContext.layers,
        materialCatalog: requestContext.materialCatalog,
        mode: "wall",
        targetOutputs: ["Rw"]
      })
    );
    const bobEstimateBody = (await bobEstimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(bobEstimateResponse.status).toBe(200);
    expect(bobEstimateBody.result?.airborneBasis?.origin).not.toBe("user_verified_calculated_exact");
    expect(bobEstimateBody.result?.metrics?.estimatedRwDb).not.toBe(73);
    expect(bobEstimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("verified calculated exact anchor active")])
    );
  });

  it("rejects measured wall Rw anchors from floor presets", async () => {
    const { POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { POST: createAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/route");

    const createResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Floor template",
        snapshot: makePresetSnapshot({
          mode: "floor",
          name: "Floor template"
        })
      })
    );
    const createBody = (await createResponse.json()) as {
      preset?: {
        id?: string;
      };
    };

    const anchorResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        presetId: createBody.preset!.id!,
        valueDb: 52
      })
    );

    expect(anchorResponse.status).toBe(400);
    await expect(anchorResponse.json()).resolves.toMatchObject({
      ok: false
    });
  });

  it("keeps measured wall Rw anchor libraries isolated by configured owner", async () => {
    const { POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { GET: listAnchors, POST: createAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/route");
    const { DELETE: retireAnchor } = await import("../app/api/workbench-v2/measured-wall-rw-anchors/[anchorId]/route");
    const { POST: estimate } = await import("../app/api/estimate/route");
    const snapshot = makePresetSnapshot({
      name: "Alice measured wall"
    });

    configureAuth();
    const unauthorizedListResponse = await listAnchors();
    expect(unauthorizedListResponse.status).toBe(401);

    signInConfiguredUser("alice@example.com");
    const createResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Alice measured wall",
        snapshot
      })
    );
    const createBody = (await createResponse.json()) as {
      preset?: {
        id?: string;
      };
    };

    const anchorResponse = await createAnchor(
      jsonRequest("http://localhost/api/workbench-v2/measured-wall-rw-anchors", {
        measurementMethodStandard: "ISO 10140-2",
        presetId: createBody.preset!.id!,
        ratingStandard: "ISO 717-1",
        valueDb: 52
      })
    );
    const anchorBody = (await anchorResponse.json()) as {
      anchor?: {
        id?: string;
      };
    };
    const anchorId = anchorBody.anchor!.id!;
    expect(anchorResponse.status).toBe(201);

    const aliceListResponse = await listAnchors();
    await expect(aliceListResponse.json()).resolves.toMatchObject({
      anchors: [
        expect.objectContaining({
          valueDb: 52
        })
      ],
      ok: true
    });

    signInConfiguredUser("bob@example.com");
    const bobListResponse = await listAnchors();
    await expect(bobListResponse.json()).resolves.toMatchObject({
      anchors: [],
      ok: true
    });

    const bobRetireResponse = await retireAnchor(new Request(`http://localhost/api/workbench-v2/measured-wall-rw-anchors/${anchorId}`, {
      method: "DELETE"
    }), {
      params: Promise.resolve({
        anchorId
      })
    });
    expect(bobRetireResponse.status).toBe(404);

    const bobEstimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: {
          wallTopology: {
            topologyMode: "double_leaf_framed"
          }
        },
        calculator: "dynamic",
        layers: [
          {
            materialId: "custom_preset_panel",
            thicknessMm: 12.5
          }
        ],
        materialCatalog: snapshot.customMaterials,
        targetOutputs: ["Rw"]
      })
    );
    const bobEstimateBody = (await bobEstimateResponse.json()) as {
      result?: {
        airborneBasis?: {
          origin?: string;
        };
        metrics?: {
          estimatedRwDb?: number;
        };
        warnings?: string[];
      };
    };

    expect(bobEstimateResponse.status).toBe(200);
    expect(bobEstimateBody.result?.airborneBasis?.origin).not.toBe("measured_exact_full_stack");
    expect(bobEstimateBody.result?.metrics?.estimatedRwDb).not.toBe(52);
    expect(bobEstimateBody.result?.warnings ?? []).not.toEqual(
      expect.arrayContaining([expect.stringContaining("Project/user measured wall Rw exact anchor active")])
    );
  });

  it("keeps configured-owner preset libraries isolated and requires auth when configured", async () => {
    const { GET: listPresets, POST: createPreset } = await import("../app/api/workbench-v2/presets/route");
    const { GET: readPreset } = await import("../app/api/workbench-v2/presets/[presetId]/route");

    configureAuth();
    const unauthorizedListResponse = await listPresets();
    expect(unauthorizedListResponse.status).toBe(401);

    signInConfiguredUser("alice@example.com");
    const createResponse = await createPreset(
      jsonRequest("http://localhost/api/workbench-v2/presets", {
        name: "Alice preset",
        snapshot: makePresetSnapshot({
          mode: "floor",
          name: "Alice preset"
        })
      })
    );
    const createBody = (await createResponse.json()) as {
      preset?: {
        id?: string;
      };
    };
    const presetId = createBody.preset!.id!;

    signInConfiguredUser("bob@example.com");
    const bobReadResponse = await readPreset(new Request(`http://localhost/api/workbench-v2/presets/${presetId}`), {
      params: Promise.resolve({
        presetId
      })
    });

    expect(bobReadResponse.status).toBe(404);

    signInConfiguredUser("alice@example.com");
    const aliceReadResponse = await readPreset(new Request(`http://localhost/api/workbench-v2/presets/${presetId}`), {
      params: Promise.resolve({
        presetId
      })
    });

    expect(aliceReadResponse.status).toBe(200);
  });
});
