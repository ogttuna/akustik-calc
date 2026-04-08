import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";

const PROPOSAL_PREVIEW_STORAGE_KEY = "dynecho:proposal-preview:v1";

type StoredProposalPreview = {
  baseDocument: SimpleWorkbenchProposalDocument;
  customDocument?: SimpleWorkbenchProposalDocument | null;
  customizedAtIso?: string | null;
  savedAtIso: string;
};

export type LoadedSimpleWorkbenchProposalPreview = {
  baseDocument: SimpleWorkbenchProposalDocument;
  customizedAtIso?: string;
  document: SimpleWorkbenchProposalDocument;
  hasCustomizations: boolean;
  savedAtIso: string;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseStoredProposalPreview(value: unknown): StoredProposalPreview | null {
  if (!isObjectRecord(value) || typeof value.savedAtIso !== "string") {
    return null;
  }

  const legacyDocument = parseSimpleWorkbenchProposalDocument(value.document);
  if (legacyDocument) {
    return {
      baseDocument: legacyDocument,
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

export function storeSimpleWorkbenchProposalPreview(document: SimpleWorkbenchProposalDocument): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredProposalPreview = {
    baseDocument: document,
    savedAtIso: new Date().toISOString()
  };

  window.localStorage.setItem(PROPOSAL_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
}

export function storeSimpleWorkbenchProposalPreviewCustomizations(document: SimpleWorkbenchProposalDocument): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = readStoredProposalPreview();
  const customizedAtIso = new Date().toISOString();
  const payload: StoredProposalPreview = {
    baseDocument: existing?.baseDocument ?? document,
    customDocument: document,
    customizedAtIso,
    savedAtIso: existing?.savedAtIso ?? customizedAtIso
  };

  window.localStorage.setItem(PROPOSAL_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
  return customizedAtIso;
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
    savedAtIso: stored.savedAtIso
  };
}

export function clearSimpleWorkbenchProposalPreview(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PROPOSAL_PREVIEW_STORAGE_KEY);
}
