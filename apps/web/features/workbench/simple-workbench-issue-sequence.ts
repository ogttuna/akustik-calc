const ISSUE_SEQUENCE_STORAGE_KEY = "dynecho:proposal-issue-sequence:v1";

type IssueSequenceRegisterEntry = {
  history: SimpleWorkbenchIssueSequenceHistoryItem[];
  lastIssuedNumber: number;
  lastIssuedReference: string;
  updatedAtIso: string;
};

type IssueSequenceRegister = Record<string, IssueSequenceRegisterEntry>;

export type SimpleWorkbenchIssueSequenceHistoryItem = {
  issueNumber: number;
  reference: string;
  reservedAtIso: string;
};

export type SimpleWorkbenchIssueSequenceSnapshot = {
  baseReference: string;
  history: readonly SimpleWorkbenchIssueSequenceHistoryItem[];
  lastIssuedNumber: number;
  lastIssuedReference: string | null;
  nextNumber: number;
  nextReference: string;
  updatedAtIso: string | null;
};

export type ReservedSimpleWorkbenchIssueSequence = SimpleWorkbenchIssueSequenceSnapshot & {
  reservedNumber: number;
  reservedReference: string;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeIssueNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

export function buildSimpleWorkbenchSequencedReference(baseReference: string, issueNumber: number): string {
  return `${baseReference}-${String(sanitizeIssueNumber(issueNumber)).padStart(2, "0")}`;
}

function sanitizeIssueHistoryItem(value: unknown): SimpleWorkbenchIssueSequenceHistoryItem | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (
    typeof value.issueNumber !== "number" ||
    typeof value.reference !== "string" ||
    value.reference.trim().length === 0 ||
    typeof value.reservedAtIso !== "string"
  ) {
    return null;
  }

  return {
    issueNumber: Math.max(1, Math.floor(value.issueNumber)),
    reference: value.reference,
    reservedAtIso: value.reservedAtIso
  };
}

function readIssueSequenceRegister(): IssueSequenceRegister {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(ISSUE_SEQUENCE_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObjectRecord(parsed)) {
      return {};
    }

    const register: IssueSequenceRegister = {};

    for (const [baseReference, entry] of Object.entries(parsed)) {
      if (!isObjectRecord(entry)) {
        continue;
      }

      const lastIssuedNumber = typeof entry.lastIssuedNumber === "number" ? Math.max(0, Math.floor(entry.lastIssuedNumber)) : 0;
      const lastIssuedReference =
        typeof entry.lastIssuedReference === "string" && entry.lastIssuedReference.trim().length > 0
          ? entry.lastIssuedReference
          : buildSimpleWorkbenchSequencedReference(baseReference, Math.max(1, lastIssuedNumber));
      const history = Array.isArray(entry.history)
        ? entry.history
            .map((historyItem) => sanitizeIssueHistoryItem(historyItem))
            .filter((historyItem): historyItem is SimpleWorkbenchIssueSequenceHistoryItem => historyItem !== null)
        : [];
      const updatedAtIso = typeof entry.updatedAtIso === "string" ? entry.updatedAtIso : new Date(0).toISOString();

      register[baseReference] = {
        history,
        lastIssuedNumber,
        lastIssuedReference,
        updatedAtIso
      };
    }

    return register;
  } catch {
    return {};
  }
}

function writeIssueSequenceRegister(register: IssueSequenceRegister): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ISSUE_SEQUENCE_STORAGE_KEY, JSON.stringify(register));
}

export function readSimpleWorkbenchIssueSequence(baseReference: string): SimpleWorkbenchIssueSequenceSnapshot {
  const register = readIssueSequenceRegister();
  const entry = register[baseReference];
  const lastIssuedNumber = entry?.lastIssuedNumber ?? 0;
  const nextNumber = lastIssuedNumber + 1;

  return {
    baseReference,
    history: entry?.history ?? [],
    lastIssuedNumber,
    lastIssuedReference: entry?.lastIssuedReference ?? null,
    nextNumber,
    nextReference: buildSimpleWorkbenchSequencedReference(baseReference, nextNumber),
    updatedAtIso: entry?.updatedAtIso ?? null
  };
}

export function reserveSimpleWorkbenchIssueSequence(baseReference: string): ReservedSimpleWorkbenchIssueSequence {
  const current = readSimpleWorkbenchIssueSequence(baseReference);
  const reservedNumber = current.nextNumber;
  const reservedReference = current.nextReference;
  const updatedAtIso = new Date().toISOString();
  const register = readIssueSequenceRegister();
  const historyEntry: SimpleWorkbenchIssueSequenceHistoryItem = {
    issueNumber: reservedNumber,
    reference: reservedReference,
    reservedAtIso: updatedAtIso
  };
  const history = [historyEntry, ...current.history.filter((entry) => entry.reference !== reservedReference)].slice(0, 6);

  register[baseReference] = {
    history,
    lastIssuedNumber: reservedNumber,
    lastIssuedReference: reservedReference,
    updatedAtIso
  };
  writeIssueSequenceRegister(register);

  return {
    baseReference,
    history,
    lastIssuedNumber: reservedNumber,
    lastIssuedReference: reservedReference,
    nextNumber: reservedNumber + 1,
    nextReference: buildSimpleWorkbenchSequencedReference(baseReference, reservedNumber + 1),
    reservedNumber,
    reservedReference,
    updatedAtIso
  };
}
