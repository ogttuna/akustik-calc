import { Buffer } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  ActiveProjectUserVerifiedCalculatedAnchorSchema,
  PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
  ProjectUserVerifiedCalculatedAnchorSchema,
  buildProjectUserVerifiedCalculatedAnchorFingerprint,
  type JsonValue,
  type ProjectUserVerifiedCalculatedAnchor,
  type ProjectUserVerifiedCalculatedAnchorRequestContext,
  type ProjectUserVerifiedCalculatedAnchorResultBasisTrace,
  type ProjectUserVerifiedCalculatedAnchorValue
} from "@dynecho/shared";

import { getServerProjectStoreDir, ServerProjectStorageError, type ProjectOwnerScope } from "./server-project-storage";

export const WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_SCHEMA_VERSION = 1;
export const MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHORS = 120;
export const MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_BYTES = 1_500_000;
export const MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_NAME_LENGTH = 160;
export const MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_DESCRIPTION_LENGTH = 1000;

export type WorkbenchV2VerifiedCalculatedAnchorSummary = Pick<
  ProjectUserVerifiedCalculatedAnchor,
  | "createdAtIso"
  | "createdFromPresetId"
  | "createdFromProjectId"
  | "description"
  | "fingerprint"
  | "id"
  | "name"
  | "revision"
  | "scope"
  | "status"
  | "updatedAtIso"
> & {
  mode: ProjectUserVerifiedCalculatedAnchor["requestContext"]["mode"];
  valueMetrics: ProjectUserVerifiedCalculatedAnchor["values"][number]["metric"][];
  valueSummaries: Array<Pick<ProjectUserVerifiedCalculatedAnchor["values"][number], "metric" | "metricBasis" | "valueDb">>;
};

export type WorkbenchV2VerifiedCalculatedAnchorCreateInput = {
  createdFromPresetId?: string;
  createdFromProjectId?: string;
  description?: string;
  name: string;
  requestContext: ProjectUserVerifiedCalculatedAnchorRequestContext;
  resultBasisTrace: ProjectUserVerifiedCalculatedAnchorResultBasisTrace;
  scope?: ProjectUserVerifiedCalculatedAnchor["scope"];
  values: ProjectUserVerifiedCalculatedAnchorValue[];
  workbenchSnapshot?: Record<string, JsonValue>;
};

type WorkbenchV2VerifiedCalculatedAnchorLibraryRecord = {
  ownerId: string;
  schemaVersion: typeof WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_SCHEMA_VERSION;
  verifiedCalculatedAnchors: ProjectUserVerifiedCalculatedAnchor[];
};

type FileWorkbenchV2VerifiedCalculatedAnchorRepositoryOptions = {
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

function encodeJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function jsonSizeBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}

function checksumJson(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalizeText(value: string, maxLength: number, fieldLabel: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ServerProjectStorageError(`${fieldLabel} is required.`, "invalid_workbench_verified_calculated_anchor_text", 400);
  }
  if (trimmed.length > maxLength) {
    throw new ServerProjectStorageError(
      `${fieldLabel} can be at most ${maxLength} characters.`,
      "invalid_workbench_verified_calculated_anchor_text",
      400
    );
  }

  return trimmed;
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
      "invalid_workbench_verified_calculated_anchor_text",
      400
    );
  }

  return trimmed;
}

function summarizeAnchor(anchor: ProjectUserVerifiedCalculatedAnchor): WorkbenchV2VerifiedCalculatedAnchorSummary {
  return {
    createdAtIso: anchor.createdAtIso,
    createdFromPresetId: anchor.createdFromPresetId,
    createdFromProjectId: anchor.createdFromProjectId,
    description: anchor.description,
    fingerprint: anchor.fingerprint,
    id: anchor.id,
    mode: anchor.requestContext.mode,
    name: anchor.name,
    revision: anchor.revision,
    scope: anchor.scope,
    status: anchor.status,
    updatedAtIso: anchor.updatedAtIso,
    valueMetrics: anchor.values.map((value) => value.metric),
    valueSummaries: anchor.values.map((value) => ({
      metric: value.metric,
      metricBasis: value.metricBasis,
      valueDb: value.valueDb
    }))
  };
}

function parseStoredAnchor(value: unknown): ProjectUserVerifiedCalculatedAnchor | null {
  const parsed = ProjectUserVerifiedCalculatedAnchorSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function parseNewActiveAnchor(value: unknown): ProjectUserVerifiedCalculatedAnchor {
  const parsed = ActiveProjectUserVerifiedCalculatedAnchorSchema.safeParse(value);
  if (!parsed.success) {
    throw new ServerProjectStorageError(
      "Verified calculated anchor payload failed schema validation.",
      "invalid_workbench_verified_calculated_anchor_payload",
      400
    );
  }

  return parsed.data;
}

function assertSafeAnchorId(anchorId: string): string {
  const normalized = anchorId.trim();
  if (!normalized || normalized.length > 160 || /[\u0000-\u001f\u007f]/u.test(normalized)) {
    throw new ServerProjectStorageError(
      "Invalid verified calculated anchor id.",
      "invalid_workbench_verified_calculated_anchor_id",
      400
    );
  }

  return normalized;
}

function parseStoredLibrary(value: unknown, ownerId: string): WorkbenchV2VerifiedCalculatedAnchorLibraryRecord {
  if (
    !isRecord(value) ||
    value.schemaVersion !== WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_SCHEMA_VERSION ||
    value.ownerId !== ownerId ||
    !Array.isArray(value.verifiedCalculatedAnchors)
  ) {
    throw new ServerProjectStorageError(
      "Stored verified calculated anchor library failed schema validation.",
      "invalid_stored_workbench_verified_calculated_anchor_library",
      500
    );
  }

  const anchors = value.verifiedCalculatedAnchors.map(parseStoredAnchor);
  if (anchors.some((anchor) => anchor === null)) {
    throw new ServerProjectStorageError(
      "Stored verified calculated anchor failed schema validation.",
      "invalid_stored_workbench_verified_calculated_anchor",
      500
    );
  }

  return {
    ownerId,
    schemaVersion: WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_SCHEMA_VERSION,
    verifiedCalculatedAnchors: anchors as ProjectUserVerifiedCalculatedAnchor[]
  };
}

// Agent coordination, 2026-06-22:
// This repository is storage-only for explicit user-verified calculated
// references. /api/estimate may read active references only through the D1
// wall/lab exact loader; do not route these records through measured/source
// anchor lanes or compatible-delta matching.
export class FileWorkbenchV2VerifiedCalculatedAnchorRepository {
  private readonly baseDir: string;
  private readonly idFactory: () => string;
  private readonly now: () => Date;

  constructor(options: FileWorkbenchV2VerifiedCalculatedAnchorRepositoryOptions = {}) {
    this.baseDir = options.baseDir ?? getServerProjectStoreDir();
    this.idFactory = options.idFactory ?? randomUUID;
    this.now = options.now ?? (() => new Date());
  }

  async listVerifiedCalculatedAnchorSummaries(
    owner: ProjectOwnerScope
  ): Promise<WorkbenchV2VerifiedCalculatedAnchorSummary[]> {
    const library = await this.readLibrary(owner);

    return library.verifiedCalculatedAnchors
      .map(summarizeAnchor)
      .sort((left, right) => right.updatedAtIso.localeCompare(left.updatedAtIso));
  }

  async listVerifiedCalculatedAnchors(owner: ProjectOwnerScope): Promise<ProjectUserVerifiedCalculatedAnchor[]> {
    const library = await this.readLibrary(owner);

    return [...library.verifiedCalculatedAnchors].sort((left, right) => right.updatedAtIso.localeCompare(left.updatedAtIso));
  }

  async readVerifiedCalculatedAnchor(
    owner: ProjectOwnerScope,
    anchorId: string
  ): Promise<ProjectUserVerifiedCalculatedAnchor | null> {
    const safeAnchorId = assertSafeAnchorId(anchorId);
    const library = await this.readLibrary(owner);

    return library.verifiedCalculatedAnchors.find((anchor) => anchor.id === safeAnchorId) ?? null;
  }

  async listActiveVerifiedCalculatedAnchors(owner: ProjectOwnerScope): Promise<ProjectUserVerifiedCalculatedAnchor[]> {
    const library = await this.readLibrary(owner);

    return library.verifiedCalculatedAnchors
      .filter((anchor) => anchor.status === "active")
      .map((anchor) => ActiveProjectUserVerifiedCalculatedAnchorSchema.parse(anchor));
  }

  async createVerifiedCalculatedAnchor(
    owner: ProjectOwnerScope,
    input: WorkbenchV2VerifiedCalculatedAnchorCreateInput
  ): Promise<ProjectUserVerifiedCalculatedAnchor> {
    const library = await this.readLibrary(owner);
    if (library.verifiedCalculatedAnchors.length >= MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHORS) {
      throw new ServerProjectStorageError(
        `Verified calculated anchor library can store at most ${MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHORS} anchors.`,
        "too_many_workbench_verified_calculated_anchors",
        400
      );
    }

    const requestContext = input.requestContext;
    const fingerprint = buildProjectUserVerifiedCalculatedAnchorFingerprint({
      requestContext
    });

    if (library.verifiedCalculatedAnchors.some((anchor) => anchor.status === "active" && anchor.fingerprint === fingerprint)) {
      throw new ServerProjectStorageError(
        "This calculation already has an active verified reference. Retire the existing reference before saving a replacement.",
        "workbench_verified_calculated_anchor_conflict",
        409
      );
    }

    const nowIso = this.now().toISOString();
    const anchor = parseNewActiveAnchor({
      anchorKind: "user_verified_calculated_result",
      canonicalizationVersion: PROJECT_USER_VERIFIED_CALCULATED_ANCHOR_CANONICALIZATION_VERSION,
      confidencePolicy: "exact_only",
      createdAtIso: nowIso,
      createdBy: normalizeOptionalText(owner.ownerLabel, 128, "Created by"),
      createdFromPresetId: normalizeOptionalText(input.createdFromPresetId, 160, "Created-from preset id"),
      createdFromProjectId: normalizeOptionalText(input.createdFromProjectId, 160, "Created-from project id"),
      description: normalizeOptionalText(
        input.description,
        MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_DESCRIPTION_LENGTH,
        "Verified calculated anchor description"
      ),
      fingerprint,
      id: this.idFactory(),
      name: normalizeText(input.name, MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_NAME_LENGTH, "Verified calculated anchor name"),
      requestContext,
      resultBasisTrace: input.resultBasisTrace,
      revision: 1,
      scope: input.scope ?? "user_evidence",
      status: "active",
      updatedAtIso: nowIso,
      values: input.values,
      valuesChecksum: checksumJson({
        resultBasisTrace: input.resultBasisTrace,
        values: input.values
      }),
      workbenchSnapshot: input.workbenchSnapshot ?? {}
    });

    await this.writeLibrary({
      ...library,
      verifiedCalculatedAnchors: [...library.verifiedCalculatedAnchors, anchor]
    });

    return anchor;
  }

  async retireVerifiedCalculatedAnchor(
    owner: ProjectOwnerScope,
    anchorId: string
  ): Promise<ProjectUserVerifiedCalculatedAnchor> {
    const safeAnchorId = assertSafeAnchorId(anchorId);
    const library = await this.readLibrary(owner);
    const anchorIndex = library.verifiedCalculatedAnchors.findIndex((anchor) => anchor.id === safeAnchorId);

    if (anchorIndex < 0) {
      throw new ServerProjectStorageError(
        "Verified calculated anchor not found.",
        "workbench_verified_calculated_anchor_not_found",
        404
      );
    }

    const existingAnchor = library.verifiedCalculatedAnchors[anchorIndex]!;
    if (existingAnchor.status === "retired") {
      return existingAnchor;
    }

    const retiredAnchor = ProjectUserVerifiedCalculatedAnchorSchema.parse({
      ...existingAnchor,
      revision: existingAnchor.revision + 1,
      status: "retired",
      updatedAtIso: this.now().toISOString()
    });

    const verifiedCalculatedAnchors = [...library.verifiedCalculatedAnchors];
    verifiedCalculatedAnchors[anchorIndex] = retiredAnchor;

    await this.writeLibrary({
      ...library,
      verifiedCalculatedAnchors
    });

    return retiredAnchor;
  }

  private emptyLibrary(owner: ProjectOwnerScope): WorkbenchV2VerifiedCalculatedAnchorLibraryRecord {
    return {
      ownerId: owner.ownerId,
      schemaVersion: WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_SCHEMA_VERSION,
      verifiedCalculatedAnchors: []
    };
  }

  private ownerAnchorPath(ownerId: string): string {
    return path.join(this.baseDir, "owners", ownerId, "workbench-v2-verified-calculated-anchors.json");
  }

  private async readLibrary(owner: ProjectOwnerScope): Promise<WorkbenchV2VerifiedCalculatedAnchorLibraryRecord> {
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
        "Stored verified calculated anchor library is not valid JSON.",
        "invalid_stored_workbench_verified_calculated_anchor_library",
        500
      );
    }

    return parseStoredLibrary(parsedJson, owner.ownerId);
  }

  private async writeLibrary(library: WorkbenchV2VerifiedCalculatedAnchorLibraryRecord): Promise<void> {
    const parsedLibrary = parseStoredLibrary(library, library.ownerId);
    if (jsonSizeBytes(parsedLibrary) > MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_BYTES) {
      throw new ServerProjectStorageError(
        `Verified calculated anchor library exceeds ${MAX_WORKBENCH_V2_VERIFIED_CALCULATED_ANCHOR_LIBRARY_BYTES} bytes.`,
        "workbench_verified_calculated_anchor_library_too_large",
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

export function createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository(): FileWorkbenchV2VerifiedCalculatedAnchorRepository {
  return new FileWorkbenchV2VerifiedCalculatedAnchorRepository();
}
