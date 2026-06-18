import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { JsonValueSchema, type JsonValue } from "@dynecho/shared";

import { getServerProjectStoreDir, ServerProjectStorageError, type ProjectOwnerScope } from "./server-project-storage";

export const WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION = 1;
export const MAX_WORKBENCH_V2_PRESETS = 120;
export const MAX_WORKBENCH_V2_PRESET_BYTES = 500_000;
export const MAX_WORKBENCH_V2_PRESET_NAME_LENGTH = 160;
export const MAX_WORKBENCH_V2_PRESET_DESCRIPTION_LENGTH = 500;
const COPY_NAME_PREFIX = "Copy of ";

export type WorkbenchV2PresetKind = "floor" | "wall";

export type WorkbenchV2UserPresetRecord = {
  createdAtIso: string;
  description?: string;
  hasCustomMaterials: boolean;
  hasVisualOverrides: boolean;
  id: string;
  kind: WorkbenchV2PresetKind;
  layerCount: number;
  name: string;
  ownerId: string;
  schemaVersion: typeof WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION;
  selectedOutputCount: number;
  snapshot: JsonValue;
  source: "workbench_v2";
  updatedAtIso: string;
};

export type WorkbenchV2UserPresetSummary = Omit<WorkbenchV2UserPresetRecord, "ownerId" | "schemaVersion" | "snapshot" | "source">;

export type WorkbenchV2PresetCreateInput = {
  description?: string;
  kind: WorkbenchV2PresetKind;
  layerCount: number;
  name: string;
  snapshot: JsonValue;
};

export type WorkbenchV2PresetUpdateInput = {
  description?: string;
  name?: string;
};

export type WorkbenchV2PresetDuplicateInput = {
  name?: string;
};

type WorkbenchV2PresetLibraryRecord = {
  ownerId: string;
  presets: WorkbenchV2UserPresetRecord[];
  schemaVersion: typeof WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION;
};

type FileWorkbenchV2PresetRepositoryOptions = {
  baseDir?: string;
  idFactory?: () => string;
  now?: () => Date;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapNodeReadError(error: unknown): null {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
    return null;
  }

  throw error;
}

function jsonSizeBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}

function encodeJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function assertSafePresetId(presetId: string): void {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(presetId)) {
    throw new ServerProjectStorageError("Invalid preset id.", "invalid_workbench_preset_id", 400);
  }
}

function normalizePresetName(name: string): string {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new ServerProjectStorageError("Preset name is required.", "invalid_workbench_preset_name", 400);
  }
  if (trimmedName.length > MAX_WORKBENCH_V2_PRESET_NAME_LENGTH) {
    throw new ServerProjectStorageError(
      `Preset name can be at most ${MAX_WORKBENCH_V2_PRESET_NAME_LENGTH} characters.`,
      "workbench_preset_name_too_long",
      400
    );
  }

  return trimmedName;
}

function normalizeOptionalDescription(description: string | undefined): string | undefined {
  if (description === undefined) {
    return undefined;
  }

  const trimmedDescription = description.trim();
  if (!trimmedDescription) {
    return undefined;
  }
  if (trimmedDescription.length > MAX_WORKBENCH_V2_PRESET_DESCRIPTION_LENGTH) {
    throw new ServerProjectStorageError(
      `Preset description can be at most ${MAX_WORKBENCH_V2_PRESET_DESCRIPTION_LENGTH} characters.`,
      "workbench_preset_description_too_long",
      400
    );
  }

  return trimmedDescription;
}

function truncatePresetName(name: string): string {
  const trimmedName = name.trim();
  if (trimmedName.length <= MAX_WORKBENCH_V2_PRESET_NAME_LENGTH) {
    return trimmedName;
  }

  const truncatedName = trimmedName.slice(0, MAX_WORKBENCH_V2_PRESET_NAME_LENGTH);
  const lastCharCode = truncatedName.charCodeAt(truncatedName.length - 1);

  return lastCharCode >= 0xd800 && lastCharCode <= 0xdbff ? truncatedName.slice(0, -1) : truncatedName;
}

function formatDuplicatePresetName(name: string): string {
  return truncatePresetName(`${COPY_NAME_PREFIX}${name}`);
}

function assertPresetSnapshotSize(snapshot: JsonValue): void {
  if (jsonSizeBytes(snapshot) > MAX_WORKBENCH_V2_PRESET_BYTES) {
    throw new ServerProjectStorageError(
      `Workbench preset snapshot exceeds ${MAX_WORKBENCH_V2_PRESET_BYTES} bytes.`,
      "workbench_preset_too_large",
      413
    );
  }
}

function jsonArrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function getPresetSnapshotMetadata(snapshot: JsonValue): Pick<WorkbenchV2UserPresetRecord, "hasCustomMaterials" | "hasVisualOverrides" | "selectedOutputCount"> {
  const source = isRecord(snapshot) ? snapshot : {};

  return {
    hasCustomMaterials: jsonArrayLength(source.customMaterials) > 0,
    hasVisualOverrides: jsonArrayLength(source.materialVisualOverrides) > 0,
    selectedOutputCount: jsonArrayLength(source.selectedOutputs)
  };
}

function parseStoredPreset(value: unknown): WorkbenchV2UserPresetRecord | null {
  if (
    !isRecord(value) ||
    value.schemaVersion !== WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION ||
    value.source !== "workbench_v2" ||
    typeof value.id !== "string" ||
    typeof value.ownerId !== "string" ||
    typeof value.name !== "string" ||
    (value.description !== undefined && typeof value.description !== "string") ||
    (value.kind !== "floor" && value.kind !== "wall") ||
    typeof value.layerCount !== "number" ||
    !Number.isInteger(value.layerCount) ||
    value.layerCount < 0 ||
    typeof value.createdAtIso !== "string" ||
    typeof value.updatedAtIso !== "string"
  ) {
    return null;
  }

  const snapshot = JsonValueSchema.safeParse(value.snapshot);
  if (!snapshot.success) {
    return null;
  }
  const snapshotMetadata = getPresetSnapshotMetadata(snapshot.data);

  return {
    createdAtIso: value.createdAtIso,
    description: value.description,
    hasCustomMaterials: typeof value.hasCustomMaterials === "boolean" ? value.hasCustomMaterials : snapshotMetadata.hasCustomMaterials,
    hasVisualOverrides: typeof value.hasVisualOverrides === "boolean" ? value.hasVisualOverrides : snapshotMetadata.hasVisualOverrides,
    id: value.id,
    kind: value.kind,
    layerCount: value.layerCount,
    name: value.name,
    ownerId: value.ownerId,
    schemaVersion: WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION,
    selectedOutputCount:
      typeof value.selectedOutputCount === "number" &&
      Number.isInteger(value.selectedOutputCount) &&
      value.selectedOutputCount >= 0
        ? value.selectedOutputCount
        : snapshotMetadata.selectedOutputCount,
    snapshot: snapshot.data,
    source: "workbench_v2",
    updatedAtIso: value.updatedAtIso
  };
}

function parseStoredLibrary(value: unknown, ownerId: string): WorkbenchV2PresetLibraryRecord {
  if (
    !isRecord(value) ||
    value.schemaVersion !== WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION ||
    value.ownerId !== ownerId ||
    !Array.isArray(value.presets)
  ) {
    throw new ServerProjectStorageError("Stored preset library failed schema validation.", "invalid_stored_workbench_preset_library", 500);
  }

  const presets = value.presets.map(parseStoredPreset);
  if (presets.some((preset) => preset === null)) {
    throw new ServerProjectStorageError("Stored preset record failed schema validation.", "invalid_stored_workbench_preset", 500);
  }

  return {
    ownerId,
    presets: presets as WorkbenchV2UserPresetRecord[],
    schemaVersion: WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION
  };
}

function summarizePreset(preset: WorkbenchV2UserPresetRecord): WorkbenchV2UserPresetSummary {
  return {
    createdAtIso: preset.createdAtIso,
    description: preset.description,
    hasCustomMaterials: preset.hasCustomMaterials,
    hasVisualOverrides: preset.hasVisualOverrides,
    id: preset.id,
    kind: preset.kind,
    layerCount: preset.layerCount,
    name: preset.name,
    selectedOutputCount: preset.selectedOutputCount,
    updatedAtIso: preset.updatedAtIso
  };
}

export class FileWorkbenchV2PresetRepository {
  private readonly baseDir: string;
  private readonly idFactory: () => string;
  private readonly now: () => Date;

  constructor(options: FileWorkbenchV2PresetRepositoryOptions = {}) {
    this.baseDir = options.baseDir ?? getServerProjectStoreDir();
    this.idFactory = options.idFactory ?? randomUUID;
    this.now = options.now ?? (() => new Date());
  }

  async listPresets(owner: ProjectOwnerScope): Promise<WorkbenchV2UserPresetSummary[]> {
    const library = await this.readLibrary(owner);

    return library.presets.map(summarizePreset).sort((left, right) => right.updatedAtIso.localeCompare(left.updatedAtIso));
  }

  async readPreset(owner: ProjectOwnerScope, presetId: string): Promise<WorkbenchV2UserPresetRecord | null> {
    assertSafePresetId(presetId);

    const library = await this.readLibrary(owner);
    return library.presets.find((preset) => preset.id === presetId) ?? null;
  }

  async createPreset(owner: ProjectOwnerScope, input: WorkbenchV2PresetCreateInput): Promise<WorkbenchV2UserPresetRecord> {
    const library = await this.readLibrary(owner);
    if (library.presets.length >= MAX_WORKBENCH_V2_PRESETS) {
      throw new ServerProjectStorageError(
        `Preset library can store at most ${MAX_WORKBENCH_V2_PRESETS} presets.`,
        "too_many_workbench_presets",
        400
      );
    }

    assertPresetSnapshotSize(input.snapshot);

    const nowIso = this.now().toISOString();
    const snapshotMetadata = getPresetSnapshotMetadata(input.snapshot);
    const preset: WorkbenchV2UserPresetRecord = {
      createdAtIso: nowIso,
      description: normalizeOptionalDescription(input.description),
      hasCustomMaterials: snapshotMetadata.hasCustomMaterials,
      hasVisualOverrides: snapshotMetadata.hasVisualOverrides,
      id: this.idFactory(),
      kind: input.kind,
      layerCount: Math.max(0, Math.trunc(input.layerCount)),
      name: normalizePresetName(input.name),
      ownerId: owner.ownerId,
      schemaVersion: WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION,
      selectedOutputCount: snapshotMetadata.selectedOutputCount,
      snapshot: input.snapshot,
      source: "workbench_v2",
      updatedAtIso: nowIso
    };

    await this.writeLibrary({
      ...library,
      presets: [...library.presets, preset]
    });

    return preset;
  }

  async updatePreset(owner: ProjectOwnerScope, presetId: string, input: WorkbenchV2PresetUpdateInput): Promise<WorkbenchV2UserPresetRecord> {
    assertSafePresetId(presetId);

    if (input.name === undefined && input.description === undefined) {
      throw new ServerProjectStorageError("At least one preset field must be provided.", "invalid_workbench_preset_update", 400);
    }

    const library = await this.readLibrary(owner);
    const preset = library.presets.find((entry) => entry.id === presetId);
    if (!preset) {
      throw new ServerProjectStorageError("Preset not found.", "workbench_preset_not_found", 404);
    }

    const updatedPreset: WorkbenchV2UserPresetRecord = {
      ...preset,
      description: input.description === undefined ? preset.description : normalizeOptionalDescription(input.description),
      name: input.name === undefined ? preset.name : normalizePresetName(input.name),
      updatedAtIso: this.now().toISOString()
    };

    await this.writeLibrary({
      ...library,
      presets: library.presets.map((entry) => (entry.id === presetId ? updatedPreset : entry))
    });

    return updatedPreset;
  }

  async duplicatePreset(owner: ProjectOwnerScope, presetId: string, input: WorkbenchV2PresetDuplicateInput): Promise<WorkbenchV2UserPresetRecord> {
    assertSafePresetId(presetId);

    const library = await this.readLibrary(owner);
    if (library.presets.length >= MAX_WORKBENCH_V2_PRESETS) {
      throw new ServerProjectStorageError(
        `Preset library can store at most ${MAX_WORKBENCH_V2_PRESETS} presets.`,
        "too_many_workbench_presets",
        400
      );
    }

    const preset = library.presets.find((entry) => entry.id === presetId);
    if (!preset) {
      throw new ServerProjectStorageError("Preset not found.", "workbench_preset_not_found", 404);
    }

    const nowIso = this.now().toISOString();
    const duplicatedPreset: WorkbenchV2UserPresetRecord = {
      ...preset,
      createdAtIso: nowIso,
      id: this.idFactory(),
      name: input.name === undefined ? formatDuplicatePresetName(preset.name) : normalizePresetName(input.name),
      updatedAtIso: nowIso
    };

    await this.writeLibrary({
      ...library,
      presets: [...library.presets, duplicatedPreset]
    });

    return duplicatedPreset;
  }

  async deletePreset(owner: ProjectOwnerScope, presetId: string): Promise<void> {
    assertSafePresetId(presetId);

    const library = await this.readLibrary(owner);
    if (!library.presets.some((preset) => preset.id === presetId)) {
      throw new ServerProjectStorageError("Preset not found.", "workbench_preset_not_found", 404);
    }

    await this.writeLibrary({
      ...library,
      presets: library.presets.filter((preset) => preset.id !== presetId)
    });
  }

  private emptyLibrary(owner: ProjectOwnerScope): WorkbenchV2PresetLibraryRecord {
    return {
      ownerId: owner.ownerId,
      presets: [],
      schemaVersion: WORKBENCH_V2_PRESET_LIBRARY_SCHEMA_VERSION
    };
  }

  private ownerPresetPath(ownerId: string): string {
    return path.join(this.baseDir, "owners", ownerId, "workbench-v2-presets.json");
  }

  private async readLibrary(owner: ProjectOwnerScope): Promise<WorkbenchV2PresetLibraryRecord> {
    let raw: string;

    try {
      raw = await readFile(this.ownerPresetPath(owner.ownerId), "utf8");
    } catch (error) {
      mapNodeReadError(error);
      return this.emptyLibrary(owner);
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw) as unknown;
    } catch {
      throw new ServerProjectStorageError("Stored preset library is not valid JSON.", "invalid_stored_workbench_preset_library", 500);
    }

    return parseStoredLibrary(parsedJson, owner.ownerId);
  }

  private async writeLibrary(library: WorkbenchV2PresetLibraryRecord): Promise<void> {
    const parsedLibrary = parseStoredLibrary(library, library.ownerId);
    const presetPath = this.ownerPresetPath(library.ownerId);
    const ownerDir = path.dirname(presetPath);

    await mkdir(ownerDir, {
      recursive: true
    });

    const tempPath = `${presetPath}.${process.pid}.${this.idFactory()}.tmp`;
    await writeFile(tempPath, `${encodeJson(parsedLibrary)}\n`, "utf8");
    await rename(tempPath, presetPath);
  }
}

export function createDefaultWorkbenchV2PresetRepository(): FileWorkbenchV2PresetRepository {
  return new FileWorkbenchV2PresetRepository();
}
