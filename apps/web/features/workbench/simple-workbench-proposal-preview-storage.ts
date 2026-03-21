import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";

const PROPOSAL_PREVIEW_STORAGE_KEY = "dynecho:proposal-preview:v1";

type StoredProposalPreview = {
  document: SimpleWorkbenchProposalDocument;
  savedAtIso: string;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function storeSimpleWorkbenchProposalPreview(document: SimpleWorkbenchProposalDocument): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredProposalPreview = {
    document,
    savedAtIso: new Date().toISOString()
  };

  window.localStorage.setItem(PROPOSAL_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
}

export function readSimpleWorkbenchProposalPreview(): StoredProposalPreview | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(PROPOSAL_PREVIEW_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObjectRecord(parsed) || typeof parsed.savedAtIso !== "string") {
      return null;
    }

    const document = parseSimpleWorkbenchProposalDocument(parsed.document);
    if (!document) {
      return null;
    }

    return {
      document,
      savedAtIso: parsed.savedAtIso
    };
  } catch {
    return null;
  }
}

export function clearSimpleWorkbenchProposalPreview(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PROPOSAL_PREVIEW_STORAGE_KEY);
}
