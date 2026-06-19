import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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
