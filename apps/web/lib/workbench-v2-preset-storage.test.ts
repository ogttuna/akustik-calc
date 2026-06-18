import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import type { JsonValue } from "@dynecho/shared";

import { type ProjectOwnerScope, ServerProjectStorageError } from "./server-project-storage";
import {
  FileWorkbenchV2PresetRepository,
  MAX_WORKBENCH_V2_PRESET_BYTES,
  MAX_WORKBENCH_V2_PRESET_NAME_LENGTH
} from "./workbench-v2-preset-storage";

const OWNER_A: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "configured_owner_a",
  ownerLabel: "Consultant A"
};

const OWNER_B: ProjectOwnerScope = {
  authMode: "configured",
  ownerId: "configured_owner_b",
  ownerLabel: "Consultant B"
};

const FIXED_NOW = new Date("2026-06-15T10:00:00.000Z");

let tempDirs: string[] = [];

async function makeTempStoreDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "dynecho-workbench-preset-store-"));
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

function makeSnapshot(name = "Preset snapshot"): Record<string, JsonValue> {
  return {
    context: {},
    customMaterials: [],
    id: "snapshot-1",
    layers: [
      {
        id: "layer-1",
        materialId: "gypsum_board",
        role: "finish",
        thicknessMm: "12.5"
      }
    ],
    materialVisualOverrides: [],
    mode: "wall",
    name,
    savedAtIso: FIXED_NOW.toISOString(),
    schemaId: "dynecho.workbench-v2.snapshot.v1",
    selectedLayerId: "layer-1",
    selectedOutputs: ["Rw"]
  };
}

afterEach(async () => {
  await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("workbench v2 preset storage", () => {
  it("creates, lists, reads, updates, duplicates, and deletes owner-scoped presets", async () => {
    const repository = new FileWorkbenchV2PresetRepository({
      baseDir: await makeTempStoreDir(),
      idFactory: makeIdFactory(),
      now: () => FIXED_NOW
    });
    const preset = await repository.createPreset(OWNER_A, {
      description: "  Guest wall starter  ",
      kind: "wall",
      layerCount: 1,
      name: "  Guest wall preset  ",
      snapshot: makeSnapshot()
    });

    expect(preset).toMatchObject({
      createdAtIso: FIXED_NOW.toISOString(),
      description: "Guest wall starter",
      hasCustomMaterials: false,
      hasVisualOverrides: false,
      id: "00000000-0000-4000-8000-000000000001",
      kind: "wall",
      layerCount: 1,
      name: "Guest wall preset",
      ownerId: OWNER_A.ownerId,
      selectedOutputCount: 1,
      source: "workbench_v2",
      updatedAtIso: FIXED_NOW.toISOString()
    });
    expect(await repository.listPresets(OWNER_B)).toEqual([]);
    expect(await repository.readPreset(OWNER_A, preset.id)).toMatchObject({
      id: preset.id,
      snapshot: makeSnapshot()
    });

    const updated = await repository.updatePreset(OWNER_A, preset.id, {
      description: "Updated starter",
      name: "Updated wall preset"
    });

    expect(updated).toMatchObject({
      description: "Updated starter",
      id: preset.id,
      name: "Updated wall preset"
    });

    const duplicated = await repository.duplicatePreset(OWNER_A, preset.id, {});

    expect(duplicated).toMatchObject({
      description: "Updated starter",
      name: "Copy of Updated wall preset",
      snapshot: makeSnapshot()
    });
    expect(duplicated.id).not.toBe(preset.id);

    await repository.deletePreset(OWNER_A, preset.id);

    expect(await repository.readPreset(OWNER_A, preset.id)).toBeNull();
    expect(await repository.listPresets(OWNER_A)).toEqual([
      expect.objectContaining({
        id: duplicated.id,
        name: "Copy of Updated wall preset"
      })
    ]);
  });

  it("rejects invalid ids, empty names, overlong descriptions, and oversized snapshots", async () => {
    const repository = new FileWorkbenchV2PresetRepository({
      baseDir: await makeTempStoreDir(),
      idFactory: makeIdFactory(),
      now: () => FIXED_NOW
    });

    await expect(repository.readPreset(OWNER_A, "../not-a-preset")).rejects.toBeInstanceOf(ServerProjectStorageError);
    await expect(
      repository.createPreset(OWNER_A, {
        kind: "wall",
        layerCount: 1,
        name: " ",
        snapshot: makeSnapshot()
      })
    ).rejects.toMatchObject({
      code: "invalid_workbench_preset_name",
      statusCode: 400
    });
    await expect(
      repository.createPreset(OWNER_A, {
        description: "x".repeat(501),
        kind: "wall",
        layerCount: 1,
        name: "Description too long",
        snapshot: makeSnapshot()
      })
    ).rejects.toMatchObject({
      code: "workbench_preset_description_too_long",
      statusCode: 400
    });
    await expect(
      repository.createPreset(OWNER_A, {
        kind: "wall",
        layerCount: 1,
        name: "Oversized",
        snapshot: {
          note: "x".repeat(MAX_WORKBENCH_V2_PRESET_BYTES + 1)
        }
      })
    ).rejects.toMatchObject({
      code: "workbench_preset_too_large",
      statusCode: 413
    });
  });

  it("keeps generated duplicate names inside the preset name limit", async () => {
    const repository = new FileWorkbenchV2PresetRepository({
      baseDir: await makeTempStoreDir(),
      idFactory: makeIdFactory(),
      now: () => FIXED_NOW
    });
    const preset = await repository.createPreset(OWNER_A, {
      kind: "floor",
      layerCount: 1,
      name: "A".repeat(MAX_WORKBENCH_V2_PRESET_NAME_LENGTH),
      snapshot: {
        ...makeSnapshot("Floor preset"),
        mode: "floor",
        selectedOutputs: ["Ln,w"]
      }
    });
    const duplicated = await repository.duplicatePreset(OWNER_A, preset.id, {});

    expect(duplicated.name).toHaveLength(MAX_WORKBENCH_V2_PRESET_NAME_LENGTH);
    expect(duplicated.name).toBe(`Copy of ${"A".repeat(152)}`);
  });
});
