import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";

const PROPOSAL_PREVIEW_STORAGE_KEY = "dynecho:proposal-preview:v1";

export type SimpleWorkbenchProposalPreviewProjectContext = {
  serverProjectAssemblyId?: string;
  serverProjectId?: string;
  serverProjectReportId?: string;
  serverProjectReportUpdatedAtIso?: string;
  sourceAssemblySnapshot?: unknown;
  sourceCalculationOutput?: unknown;
  sourceMaterialSnapshot?: {
    customMaterials: readonly unknown[];
    materialVisualOverrides: readonly unknown[];
  };
};

type StoredProposalPreview = {
  baseDocument: SimpleWorkbenchProposalDocument;
  customDocument?: SimpleWorkbenchProposalDocument | null;
  customizedAtIso?: string | null;
  projectContext?: SimpleWorkbenchProposalPreviewProjectContext;
  savedAtIso: string;
};

export type LoadedSimpleWorkbenchProposalPreview = {
  baseDocument: SimpleWorkbenchProposalDocument;
  customizedAtIso?: string;
  document: SimpleWorkbenchProposalDocument;
  hasCustomizations: boolean;
  projectContext?: SimpleWorkbenchProposalPreviewProjectContext;
  savedAtIso: string;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function trimString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseProjectContext(value: unknown): SimpleWorkbenchProposalPreviewProjectContext | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  const sourceMaterialSnapshot = isObjectRecord(value.sourceMaterialSnapshot) &&
    Array.isArray(value.sourceMaterialSnapshot.customMaterials) &&
    Array.isArray(value.sourceMaterialSnapshot.materialVisualOverrides)
    ? {
        customMaterials: [...value.sourceMaterialSnapshot.customMaterials],
        materialVisualOverrides: [...value.sourceMaterialSnapshot.materialVisualOverrides]
      }
    : undefined;
  const projectContext: SimpleWorkbenchProposalPreviewProjectContext = {
    serverProjectAssemblyId: trimString(value.serverProjectAssemblyId),
    serverProjectId: trimString(value.serverProjectId),
    serverProjectReportId: trimString(value.serverProjectReportId),
    serverProjectReportUpdatedAtIso: trimString(value.serverProjectReportUpdatedAtIso),
    sourceAssemblySnapshot: Object.hasOwn(value, "sourceAssemblySnapshot") ? value.sourceAssemblySnapshot : undefined,
    sourceCalculationOutput: Object.hasOwn(value, "sourceCalculationOutput") ? value.sourceCalculationOutput : undefined,
    sourceMaterialSnapshot
  };

  return Object.values(projectContext).some((entry) => entry !== undefined) ? projectContext : undefined;
}

function parseStoredProposalPreview(value: unknown): StoredProposalPreview | null {
  if (!isObjectRecord(value) || typeof value.savedAtIso !== "string") {
    return null;
  }

  const legacyDocument = parseSimpleWorkbenchProposalDocument(value.document);
  if (legacyDocument) {
    return {
      baseDocument: legacyDocument,
      projectContext: parseProjectContext(value.projectContext),
      savedAtIso: value.savedAtIso
    };
  }

  const baseDocument = parseSimpleWorkbenchProposalDocument(value.baseDocument);
  if (!baseDocument) {
    return null;
  }

  const customDocument = value.customDocument == null ? null : parseSimpleWorkbenchProposalDocument(value.customDocument);
  if (value.customDocument != null && !customDocument) {
    return null;
  }

  return {
    baseDocument,
    customDocument,
    customizedAtIso: typeof value.customizedAtIso === "string" ? value.customizedAtIso : undefined,
    projectContext: parseProjectContext(value.projectContext),
    savedAtIso: value.savedAtIso
  };
}

function readStoredProposalPreview(): StoredProposalPreview | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(PROPOSAL_PREVIEW_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return parseStoredProposalPreview(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function storeSimpleWorkbenchProposalPreview(
  document: SimpleWorkbenchProposalDocument,
  options?: {
    projectContext?: SimpleWorkbenchProposalPreviewProjectContext;
  }
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredProposalPreview = {
    baseDocument: document,
    projectContext: options?.projectContext,
    savedAtIso: new Date().toISOString()
  };

  window.localStorage.setItem(PROPOSAL_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
}

export function storeSimpleWorkbenchProposalPreviewCustomizations(
  document: SimpleWorkbenchProposalDocument,
  options?: {
    projectContext?: SimpleWorkbenchProposalPreviewProjectContext;
  }
): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = readStoredProposalPreview();
  const customizedAtIso = new Date().toISOString();
  const payload: StoredProposalPreview = {
    baseDocument: existing?.baseDocument ?? document,
    customDocument: document,
    customizedAtIso,
    projectContext: options?.projectContext ?? existing?.projectContext,
    savedAtIso: existing?.savedAtIso ?? customizedAtIso
  };

  window.localStorage.setItem(PROPOSAL_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
  return customizedAtIso;
}

export function updateSimpleWorkbenchProposalPreviewProjectContext(
  projectContext: SimpleWorkbenchProposalPreviewProjectContext
): void {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readStoredProposalPreview();
  if (!existing) {
    return;
  }

  const payload: StoredProposalPreview = {
    ...existing,
    projectContext: {
      ...existing.projectContext,
      ...projectContext
    }
  };

  window.localStorage.setItem(PROPOSAL_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
}

export function resetSimpleWorkbenchProposalPreviewCustomizations(): void {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readStoredProposalPreview();
  if (!existing) {
    return;
  }

  const payload: StoredProposalPreview = {
    baseDocument: existing.baseDocument,
    projectContext: existing.projectContext,
    savedAtIso: existing.savedAtIso
  };

  window.localStorage.setItem(PROPOSAL_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
}

export function readSimpleWorkbenchProposalPreview(): LoadedSimpleWorkbenchProposalPreview | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = readStoredProposalPreview();
  if (!stored) {
    return null;
  }

  return {
    baseDocument: stored.baseDocument,
    customizedAtIso: stored.customizedAtIso ?? undefined,
    document: stored.customDocument ?? stored.baseDocument,
    hasCustomizations: stored.customDocument != null,
    projectContext: stored.projectContext,
    savedAtIso: stored.savedAtIso
  };
}

export function clearSimpleWorkbenchProposalPreview(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PROPOSAL_PREVIEW_STORAGE_KEY);
}
