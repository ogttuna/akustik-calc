import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "@dynecho/engine/runtime";
import {
  ActiveProjectUserMeasuredWallRwAnchorSchema,
  PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
  ProjectUserMeasuredWallRwAnchorSchema,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type AirborneContext,
  type MaterialDefinition,
  type ProjectUserMeasuredWallRwAnchor,
  type ResolvedLayer
} from "@dynecho/shared";

import {
  parseWorkbenchV2ProjectSnapshot,
  type WorkbenchV2ContextDraft,
  type WorkbenchV2ProjectSnapshot
} from "@/features/workbench-rebuild/workbench-v2-project-snapshot";

import { getServerProjectStoreDir, ServerProjectStorageError, type ProjectOwnerScope } from "./server-project-storage";
import type { WorkbenchV2UserPresetRecord } from "./workbench-v2-preset-storage";

export const WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_SCHEMA_VERSION = 1;
export const MAX_WORKBENCH_V2_MEASURED_WALL_RW_ANCHORS = 120;
export const MAX_WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_BYTES = 500_000;

export type WorkbenchV2MeasuredWallRwAnchorSummary = Pick<
  ProjectUserMeasuredWallRwAnchor,
  | "createdAtIso"
  | "createdFromPresetId"
  | "fingerprint"
  | "id"
  | "measurementMethodStandard"
  | "ratingStandard"
  | "sourceLabel"
  | "sourceStatus"
  | "toleranceDb"
  | "updatedAtIso"
  | "valueDb"
>;

export type WorkbenchV2MeasuredWallRwAnchorCreateInput = {
  measurementMethodStandard?: ProjectUserMeasuredWallRwAnchor["measurementMethodStandard"];
  preset: WorkbenchV2UserPresetRecord;
  ratingStandard?: ProjectUserMeasuredWallRwAnchor["ratingStandard"];
  sourceDescription?: string;
  sourceLabel?: string;
  toleranceDb?: number;
  valueDb: number;
};

type WorkbenchV2MeasuredWallRwAnchorLibraryRecord = {
  ownerId: string;
  schemaVersion: typeof WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_SCHEMA_VERSION;
  wallRwAnchors: ProjectUserMeasuredWallRwAnchor[];
};

type FileWorkbenchV2MeasuredWallRwAnchorRepositoryOptions = {
  baseDir?: string;
  idFactory?: () => string;
  now?: () => Date;
};

const SEED_MATERIAL_IDS = new Set(MATERIAL_CATALOG_SEED.map((material) => material.id));
const SEED_MATERIAL_BY_ID = new Map(MATERIAL_CATALOG_SEED.map((material) => [material.id, material]));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapNodeReadError(error: unknown): null {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
    return null;
  }

  throw error;
}

function encodeJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function jsonSizeBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}

function parsePositiveNumber(value: string): number | null {
  const numeric = Number(value.trim());
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function parseLayerIndexList(value: string, rowCount: number): number[] | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const indices: number[] = [];
  for (const token of trimmed.split(/[,\s]+/u).filter(Boolean)) {
    if (!/^\d+$/u.test(token)) {
      return undefined;
    }

    const oneBasedIndex = Number(token);
    if (!Number.isSafeInteger(oneBasedIndex) || oneBasedIndex < 1 || oneBasedIndex > rowCount) {
      return undefined;
    }

    const zeroBasedIndex = oneBasedIndex - 1;
    if (!indices.includes(zeroBasedIndex)) {
      indices.push(zeroBasedIndex);
    }
  }

  return indices.length ? indices : undefined;
}

function buildWallTopologyFromContext(
  context: WorkbenchV2ContextDraft,
  rowCount: number
): NonNullable<AirborneContext["wallTopology"]> | undefined {
  if (context.wallTopologyMode === "auto") {
    return undefined;
  }

  const topology: NonNullable<AirborneContext["wallTopology"]> = {
    topologyMode: context.wallTopologyMode
  };
  const sideA = parseLayerIndexList(context.wallSideALeafLayerIndices, rowCount);
  const cavity1 = parseLayerIndexList(context.wallCavity1LayerIndices, rowCount);
  const sideB = parseLayerIndexList(context.wallSideBLeafLayerIndices, rowCount);
  const cavity1DepthMm = parsePositiveNumber(context.wallCavity1DepthMm);

  if (sideA) topology.sideALeafLayerIndices = sideA;
  if (cavity1) topology.cavity1LayerIndices = cavity1;
  if (sideB) topology.sideBLeafLayerIndices = sideB;
  if (cavity1DepthMm) topology.cavity1DepthMm = cavity1DepthMm;
  if (context.wallCavity1FillCoverage !== "unknown") topology.cavity1FillCoverage = context.wallCavity1FillCoverage;
  if (context.wallCavity1AbsorptionClass !== "unknown") topology.cavity1AbsorptionClass = context.wallCavity1AbsorptionClass;
  if (context.wallSupportTopology !== "unknown") topology.supportTopology = context.wallSupportTopology;

  return topology;
}

function buildAirborneContextFromSnapshot(snapshot: WorkbenchV2ProjectSnapshot): AirborneContext | null {
  const airborneContext: AirborneContext = {};
  const supportSpacingMm = parsePositiveNumber(snapshot.context.supportSpacingMm);
  const wallTopology = buildWallTopologyFromContext(snapshot.context, snapshot.layers.length);

  if (supportSpacingMm) airborneContext.studSpacingMm = supportSpacingMm;
  if (wallTopology) airborneContext.wallTopology = wallTopology;

  return Object.keys(airborneContext).length ? airborneContext : null;
}

function computeLayerSurfaceMassKgM2(input: {
  material: Pick<MaterialDefinition, "densityKgM3" | "id">;
  thicknessMm: number;
}): number {
  if (input.material.id === "firestop_board" && input.thicknessMm >= 11.5 && input.thicknessMm <= 16.5) {
    return 13.1;
  }

  return (input.material.densityKgM3 * input.thicknessMm) / 1000;
}

function buildSnapshotMaterialCatalog(snapshot: WorkbenchV2ProjectSnapshot): Map<string, MaterialDefinition> {
  const catalog = new Map<string, MaterialDefinition>(SEED_MATERIAL_BY_ID);

  for (const material of snapshot.customMaterials) {
    if (SEED_MATERIAL_IDS.has(material.id)) {
      throw new ServerProjectStorageError(
        `Preset material catalog cannot override built-in material id "${material.id}". Create a project copy with a custom id instead.`,
        "workbench_measured_anchor_seed_material_collision",
        400
      );
    }

    if (!catalog.has(material.id)) {
      catalog.set(material.id, material);
    }
  }

  return catalog;
}

function resolveSnapshotLayers(snapshot: WorkbenchV2ProjectSnapshot): ResolvedLayer[] {
  const materialById = buildSnapshotMaterialCatalog(snapshot);

  return snapshot.layers.map((layer, index) => {
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);
    if (!thicknessMm) {
      throw new ServerProjectStorageError(
        `Preset layer ${index + 1} needs a positive thickness before it can become a measured anchor.`,
        "workbench_measured_anchor_missing_layer_thickness",
        400
      );
    }

    const material = materialById.get(layer.materialId);
    if (!material) {
      throw new ServerProjectStorageError(
        `Preset layer ${index + 1} references unknown material "${layer.materialId}".`,
        "workbench_measured_anchor_unknown_material",
        400
      );
    }

    return {
      material,
      materialId: material.id,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2({
        material,
        thicknessMm
      }),
      thicknessMm
    };
  });
}

// Agent coordination, 2026-06-22:
// This is the only Workbench preset -> measured Rw anchor snapshot bridge.
// If another agent changes preset snapshot canonicalization, keep using the
// engine fingerprint helper and update the measured-source anchor plan/tests.
function buildWallRwAnchorSnapshotFromPreset(preset: WorkbenchV2UserPresetRecord) {
  const parsedSnapshot = parseWorkbenchV2ProjectSnapshot(preset.snapshot).snapshot;
  if (!parsedSnapshot) {
    throw new ServerProjectStorageError(
      "Preset snapshot cannot be parsed as a workbench v2 calculator snapshot.",
      "workbench_measured_anchor_invalid_preset_snapshot",
      400
    );
  }

  if (parsedSnapshot.mode !== "wall") {
    throw new ServerProjectStorageError(
      "Measured Rw anchors can only be created from wall presets.",
      "workbench_measured_anchor_wall_preset_required",
      400
    );
  }

  return buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: buildAirborneContextFromSnapshot(parsedSnapshot),
    resolvedLayers: resolveSnapshotLayers(parsedSnapshot)
  });
}

function normalizeMeasuredDb(value: number, fieldLabel: string): number {
  if (!Number.isFinite(value) || value < 0 || value > 120) {
    throw new ServerProjectStorageError(`${fieldLabel} must be between 0 and 120 dB.`, "invalid_workbench_measured_anchor_value", 400);
  }

  return Math.round(value * 10) / 10;
}

function normalizeToleranceDb(value: number | undefined): number {
  if (value === undefined) {
    return 0;
  }
  if (!Number.isFinite(value) || value < 0 || value > 20) {
    throw new ServerProjectStorageError(
      "Measured Rw tolerance must be between 0 and 20 dB.",
      "invalid_workbench_measured_anchor_tolerance",
      400
    );
  }

  return Math.round(value * 10) / 10;
}

function normalizeOptionalText(value: string | undefined, maxLength: number, fieldLabel: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length > maxLength) {
    throw new ServerProjectStorageError(
      `${fieldLabel} can be at most ${maxLength} characters.`,
      "invalid_workbench_measured_anchor_text",
      400
    );
  }

  return trimmed;
}

function summarizeAnchor(anchor: ProjectUserMeasuredWallRwAnchor): WorkbenchV2MeasuredWallRwAnchorSummary {
  return {
    createdAtIso: anchor.createdAtIso,
    createdFromPresetId: anchor.createdFromPresetId,
    fingerprint: anchor.fingerprint,
    id: anchor.id,
    measurementMethodStandard: anchor.measurementMethodStandard,
    ratingStandard: anchor.ratingStandard,
    sourceLabel: anchor.sourceLabel,
    sourceStatus: anchor.sourceStatus,
    toleranceDb: anchor.toleranceDb,
    updatedAtIso: anchor.updatedAtIso,
    valueDb: anchor.valueDb
  };
}

function parseStoredAnchor(value: unknown): ProjectUserMeasuredWallRwAnchor | null {
  const parsed = ProjectUserMeasuredWallRwAnchorSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function assertSafeAnchorId(anchorId: string): string {
  const normalized = anchorId.trim();
  if (!normalized || normalized.length > 128 || /[\u0000-\u001f\u007f]/u.test(normalized)) {
    throw new ServerProjectStorageError("Invalid measured wall Rw anchor id.", "invalid_workbench_measured_wall_rw_anchor_id", 400);
  }

  return normalized;
}

function parseStoredLibrary(value: unknown, ownerId: string): WorkbenchV2MeasuredWallRwAnchorLibraryRecord {
  if (
    !isRecord(value) ||
    value.schemaVersion !== WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_SCHEMA_VERSION ||
    value.ownerId !== ownerId ||
    !Array.isArray(value.wallRwAnchors)
  ) {
    throw new ServerProjectStorageError(
      "Stored measured wall Rw anchor library failed schema validation.",
      "invalid_stored_workbench_measured_wall_rw_anchor_library",
      500
    );
  }

  const anchors = value.wallRwAnchors.map(parseStoredAnchor);
  if (anchors.some((anchor) => anchor === null)) {
    throw new ServerProjectStorageError(
      "Stored measured wall Rw anchor failed schema validation.",
      "invalid_stored_workbench_measured_wall_rw_anchor",
      500
    );
  }

  return {
    ownerId,
    schemaVersion: WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_SCHEMA_VERSION,
    wallRwAnchors: anchors as ProjectUserMeasuredWallRwAnchor[]
  };
}

export class FileWorkbenchV2MeasuredWallRwAnchorRepository {
  private readonly baseDir: string;
  private readonly idFactory: () => string;
  private readonly now: () => Date;

  constructor(options: FileWorkbenchV2MeasuredWallRwAnchorRepositoryOptions = {}) {
    this.baseDir = options.baseDir ?? getServerProjectStoreDir();
    this.idFactory = options.idFactory ?? randomUUID;
    this.now = options.now ?? (() => new Date());
  }

  async listWallRwAnchorSummaries(owner: ProjectOwnerScope): Promise<WorkbenchV2MeasuredWallRwAnchorSummary[]> {
    const library = await this.readLibrary(owner);

    return library.wallRwAnchors
      .map(summarizeAnchor)
      .sort((left, right) => right.updatedAtIso.localeCompare(left.updatedAtIso));
  }

  async listActiveWallRwAnchors(owner: ProjectOwnerScope): Promise<ProjectUserMeasuredWallRwAnchor[]> {
    const library = await this.readLibrary(owner);

    // Agent coordination, 2026-06-22:
    // Estimate loading must see only active anchors; retired anchors are audit
    // history and must not become runtime exact-source candidates.
    return library.wallRwAnchors
      .filter((anchor) => anchor.sourceStatus === "active")
      .map((anchor) => ActiveProjectUserMeasuredWallRwAnchorSchema.parse(anchor));
  }

  async createWallRwAnchorFromPreset(
    owner: ProjectOwnerScope,
    input: WorkbenchV2MeasuredWallRwAnchorCreateInput
  ): Promise<ProjectUserMeasuredWallRwAnchor> {
    const library = await this.readLibrary(owner);
    if (library.wallRwAnchors.length >= MAX_WORKBENCH_V2_MEASURED_WALL_RW_ANCHORS) {
      throw new ServerProjectStorageError(
        `Measured wall Rw anchor library can store at most ${MAX_WORKBENCH_V2_MEASURED_WALL_RW_ANCHORS} anchors.`,
        "too_many_workbench_measured_wall_rw_anchors",
        400
      );
    }

    const measurementMethodStandard = input.measurementMethodStandard ?? "source_report_unknown";
    const ratingStandard = input.ratingStandard ?? "ISO 717-1";
    const snapshot = buildWallRwAnchorSnapshotFromPreset(input.preset);
    const fingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
      measurementMethodStandard,
      ratingStandard,
      snapshot
    });

    if (library.wallRwAnchors.some((anchor) => anchor.sourceStatus === "active" && anchor.fingerprint === fingerprint)) {
      throw new ServerProjectStorageError(
        "An active measured Rw anchor already exists for this preset construction and standard.",
        "workbench_measured_wall_rw_anchor_conflict",
        409
      );
    }

    const nowIso = this.now().toISOString();
    const sourceLabel =
      normalizeOptionalText(input.sourceLabel, 240, "Measured Rw source label") ??
      `${input.preset.name} measured lab Rw`;
    const anchor = ActiveProjectUserMeasuredWallRwAnchorSchema.parse({
      canonicalizationVersion: PROJECT_USER_MEASURED_WALL_RW_ANCHOR_CANONICALIZATION_VERSION,
      confidencePolicy: "exact_only",
      createdAtIso: nowIso,
      createdBy: normalizeOptionalText(owner.ownerLabel, 128, "Created by"),
      createdFromPresetId: input.preset.id,
      fingerprint,
      id: this.idFactory(),
      measurementMethodStandard,
      metric: "Rw",
      metricBasis: "lab_rw",
      ratingStandard,
      revision: 1,
      scope: "user_measured",
      snapshot,
      sourceDescription: normalizeOptionalText(input.sourceDescription ?? input.preset.description, 1000, "Measured Rw source description"),
      sourceLabel,
      sourceMode: "lab",
      sourceStatus: "active",
      toleranceDb: normalizeToleranceDb(input.toleranceDb),
      updatedAtIso: nowIso,
      valueDb: normalizeMeasuredDb(input.valueDb, "Measured Rw")
    });

    await this.writeLibrary({
      ...library,
      wallRwAnchors: [...library.wallRwAnchors, anchor]
    });

    return anchor;
  }

  async retireWallRwAnchor(owner: ProjectOwnerScope, anchorId: string): Promise<ProjectUserMeasuredWallRwAnchor> {
    const safeAnchorId = assertSafeAnchorId(anchorId);
    const library = await this.readLibrary(owner);
    const anchorIndex = library.wallRwAnchors.findIndex((anchor) => anchor.id === safeAnchorId);

    if (anchorIndex < 0) {
      throw new ServerProjectStorageError("Measured wall Rw anchor not found.", "workbench_measured_wall_rw_anchor_not_found", 404);
    }

    const existingAnchor = library.wallRwAnchors[anchorIndex]!;
    if (existingAnchor.sourceStatus === "retired") {
      return existingAnchor;
    }

    const retiredAnchor = ProjectUserMeasuredWallRwAnchorSchema.parse({
      ...existingAnchor,
      revision: existingAnchor.revision + 1,
      sourceStatus: "retired",
      updatedAtIso: this.now().toISOString()
    });

    const wallRwAnchors = [...library.wallRwAnchors];
    wallRwAnchors[anchorIndex] = retiredAnchor;

    await this.writeLibrary({
      ...library,
      wallRwAnchors
    });

    return retiredAnchor;
  }

  private emptyLibrary(owner: ProjectOwnerScope): WorkbenchV2MeasuredWallRwAnchorLibraryRecord {
    return {
      ownerId: owner.ownerId,
      schemaVersion: WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_SCHEMA_VERSION,
      wallRwAnchors: []
    };
  }

  private ownerAnchorPath(ownerId: string): string {
    return path.join(this.baseDir, "owners", ownerId, "workbench-v2-measured-wall-rw-anchors.json");
  }

  private async readLibrary(owner: ProjectOwnerScope): Promise<WorkbenchV2MeasuredWallRwAnchorLibraryRecord> {
    let raw: string;

    try {
      raw = await readFile(this.ownerAnchorPath(owner.ownerId), "utf8");
    } catch (error) {
      mapNodeReadError(error);
      return this.emptyLibrary(owner);
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw) as unknown;
    } catch {
      throw new ServerProjectStorageError(
        "Stored measured wall Rw anchor library is not valid JSON.",
        "invalid_stored_workbench_measured_wall_rw_anchor_library",
        500
      );
    }

    return parseStoredLibrary(parsedJson, owner.ownerId);
  }

  private async writeLibrary(library: WorkbenchV2MeasuredWallRwAnchorLibraryRecord): Promise<void> {
    const parsedLibrary = parseStoredLibrary(library, library.ownerId);
    if (jsonSizeBytes(parsedLibrary) > MAX_WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_BYTES) {
      throw new ServerProjectStorageError(
        `Measured wall Rw anchor library exceeds ${MAX_WORKBENCH_V2_MEASURED_WALL_RW_ANCHOR_LIBRARY_BYTES} bytes.`,
        "workbench_measured_wall_rw_anchor_library_too_large",
        413
      );
    }

    const anchorPath = this.ownerAnchorPath(library.ownerId);
    const ownerDir = path.dirname(anchorPath);

    await mkdir(ownerDir, {
      recursive: true
    });

    const tempPath = `${anchorPath}.${process.pid}.${this.idFactory()}.tmp`;
    await writeFile(tempPath, `${encodeJson(parsedLibrary)}\n`, "utf8");
    await rename(tempPath, anchorPath);
  }
}

export function createDefaultWorkbenchV2MeasuredWallRwAnchorRepository(): FileWorkbenchV2MeasuredWallRwAnchorRepository {
  return new FileWorkbenchV2MeasuredWallRwAnchorRepository();
}
