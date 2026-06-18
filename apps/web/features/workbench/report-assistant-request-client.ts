export type ReportAssistantRequestKind =
  | "action_proposal"
  | "assembly_alternatives_research"
  | "finding_log"
  | "patch_proposal"
  | "plausibility_research"
  | "read_only_query";

export type ReportAssistantRequestSource = "abort" | "http" | "network" | "parse" | "timeout";

export type ReportAssistantRequestMeta = {
  attempt: number;
  documentSignature: string;
  durationMs: number;
  kind: ReportAssistantRequestKind;
  maxAttempts: number;
  requestId: string;
  startedAtIso: string;
  timeoutMs: number;
};

export type ReportAssistantRequestResult<TPayload = unknown> = {
  aborted: boolean;
  errors: string[];
  httpStatus?: number;
  meta: ReportAssistantRequestMeta;
  ok: boolean;
  payload?: TPayload;
  source: ReportAssistantRequestSource;
  timedOut: boolean;
  warnings: string[];
};

export type SendReportAssistantRequestOptions = {
  body: unknown;
  documentSignature: string;
  fetchFn?: typeof fetch;
  kind: ReportAssistantRequestKind;
  maxAttempts?: number;
  requestId?: string;
  timeoutMs?: number;
  url: string;
};

const DEFAULT_ASSISTANT_REQUEST_TIMEOUT_MS = 18000;
const DEFAULT_RESEARCH_REQUEST_TIMEOUT_MS = 90000;
const MAX_ASSISTANT_REQUEST_TIMEOUT_MS = 45000;
const MAX_RESEARCH_REQUEST_TIMEOUT_MS = 120000;
const MIN_ASSISTANT_REQUEST_TIMEOUT_MS = 1000;

let reportAssistantRequestCounter = 0;

export function createReportAssistantRequestId(kind: ReportAssistantRequestKind): string {
  reportAssistantRequestCounter = (reportAssistantRequestCounter + 1) % 100000;
  return `ra-${kind}-${Date.now().toString(36)}-${reportAssistantRequestCounter.toString(36)}`;
}

export function getDefaultReportAssistantMaxAttempts(kind: ReportAssistantRequestKind): number {
  return kind === "finding_log" ? 1 : 2;
}

export async function sendReportAssistantRequest<TPayload = unknown>(
  options: SendReportAssistantRequestOptions
): Promise<ReportAssistantRequestResult<TPayload>> {
  const fetchImpl = resolveReportAssistantFetch(options.fetchFn);
  const requestId = options.requestId ?? createReportAssistantRequestId(options.kind);
  const startedAtMs = Date.now();
  const startedAtIso = new Date(startedAtMs).toISOString();
  const timeoutMs = clampRequestTimeout(options.kind, options.timeoutMs);
  const maxAttempts = normalizeMaxAttempts(options.kind, options.maxAttempts);
  let lastResult: ReportAssistantRequestResult<TPayload> | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await sendReportAssistantRequestAttempt<TPayload>({
      ...options,
      attempt,
      fetchFn: fetchImpl,
      maxAttempts,
      requestId,
      startedAtIso,
      startedAtMs,
      timeoutMs
    });
    lastResult = result;

    if (result.ok || !shouldRetryReportAssistantRequest(options.kind, result, attempt, maxAttempts)) {
      return result;
    }
  }

  return lastResult ?? {
    aborted: false,
    errors: ["Report assistant request did not run."],
    meta: {
      attempt: 0,
      documentSignature: options.documentSignature,
      durationMs: 0,
      kind: options.kind,
      maxAttempts,
      requestId,
      startedAtIso,
      timeoutMs
    },
    ok: false,
    source: "network",
    timedOut: false,
    warnings: []
  };
}

function resolveReportAssistantFetch(fetchFn: typeof fetch | undefined): typeof fetch {
  if (fetchFn) {
    return fetchFn;
  }

  return globalThis.fetch.bind(globalThis) as typeof fetch;
}

function isResearchRequestKind(kind: ReportAssistantRequestKind): boolean {
  return kind === "assembly_alternatives_research" || kind === "plausibility_research";
}

function clampRequestTimeout(kind: ReportAssistantRequestKind, timeoutMs: number | undefined): number {
  const defaultTimeoutMs = isResearchRequestKind(kind)
    ? DEFAULT_RESEARCH_REQUEST_TIMEOUT_MS
    : DEFAULT_ASSISTANT_REQUEST_TIMEOUT_MS;
  const maxTimeoutMs = isResearchRequestKind(kind)
    ? MAX_RESEARCH_REQUEST_TIMEOUT_MS
    : MAX_ASSISTANT_REQUEST_TIMEOUT_MS;

  if (!Number.isFinite(timeoutMs)) {
    return defaultTimeoutMs;
  }

  return Math.max(MIN_ASSISTANT_REQUEST_TIMEOUT_MS, Math.min(maxTimeoutMs, Math.trunc(timeoutMs as number)));
}

function normalizeMaxAttempts(kind: ReportAssistantRequestKind, maxAttempts: number | undefined): number {
  const defaultAttempts = getDefaultReportAssistantMaxAttempts(kind);
  if (!Number.isFinite(maxAttempts)) {
    return defaultAttempts;
  }

  const normalized = Math.max(1, Math.min(3, Math.trunc(maxAttempts as number)));
  return kind === "finding_log" ? 1 : normalized;
}

async function sendReportAssistantRequestAttempt<TPayload>(
  options: SendReportAssistantRequestOptions & {
    attempt: number;
    fetchFn: typeof fetch;
    maxAttempts: number;
    requestId: string;
    startedAtIso: string;
    startedAtMs: number;
    timeoutMs: number;
  }
): Promise<ReportAssistantRequestResult<TPayload>> {
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs);

  try {
    const response = await options.fetchFn(options.url, {
      body: JSON.stringify(options.body),
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      signal: controller.signal
    });
    const responseText = await response.text();
    const parseResult = parseReportAssistantResponseText(responseText);
    if (!parseResult.ok) {
      return buildReportAssistantRequestResult({
        attempt: options.attempt,
        documentSignature: options.documentSignature,
        errors: [parseResult.error],
        kind: options.kind,
        maxAttempts: options.maxAttempts,
        requestId: options.requestId,
        source: "parse",
        startedAtIso: options.startedAtIso,
        startedAtMs: options.startedAtMs,
        timedOut,
        timeoutMs: options.timeoutMs,
        warnings: []
      });
    }

    const payload = parseResult.payload as TPayload;
    const warnings = extractReportAssistantStringArray(parseResult.payload, "warnings");
    if (!response.ok) {
      return buildReportAssistantRequestResult({
        attempt: options.attempt,
        documentSignature: options.documentSignature,
        errors: extractReportAssistantErrors(parseResult.payload, response.status),
        httpStatus: response.status,
        kind: options.kind,
        maxAttempts: options.maxAttempts,
        payload,
        requestId: options.requestId,
        source: "http",
        startedAtIso: options.startedAtIso,
        startedAtMs: options.startedAtMs,
        timedOut,
        timeoutMs: options.timeoutMs,
        warnings
      });
    }

    return buildReportAssistantRequestResult({
      attempt: options.attempt,
      documentSignature: options.documentSignature,
      errors: [],
      kind: options.kind,
      maxAttempts: options.maxAttempts,
      ok: true,
      payload,
      requestId: options.requestId,
      source: "network",
      startedAtIso: options.startedAtIso,
      startedAtMs: options.startedAtMs,
      timedOut,
      timeoutMs: options.timeoutMs,
      warnings
    });
  } catch (error) {
    const aborted = isAbortLikeError(error);
    return buildReportAssistantRequestResult({
      aborted,
      attempt: options.attempt,
      documentSignature: options.documentSignature,
      errors: [getReportAssistantRequestErrorMessage(error, timedOut)],
      kind: options.kind,
      maxAttempts: options.maxAttempts,
      requestId: options.requestId,
      source: timedOut ? "timeout" : aborted ? "abort" : "network",
      startedAtIso: options.startedAtIso,
      startedAtMs: options.startedAtMs,
      timedOut,
      timeoutMs: options.timeoutMs,
      warnings: []
    });
  } finally {
    clearTimeout(timeout);
  }
}

function parseReportAssistantResponseText(text: string): { ok: true; payload: unknown } | { error: string; ok: false } {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return {
      error: "Report assistant endpoint returned an empty response.",
      ok: false
    };
  }

  try {
    return {
      ok: true,
      payload: JSON.parse(trimmed) as unknown
    };
  } catch (error) {
    return {
      error: error instanceof Error ? `Report assistant endpoint returned invalid JSON: ${error.message}` : "Report assistant endpoint returned invalid JSON.",
      ok: false
    };
  }
}

function buildReportAssistantRequestResult<TPayload>(input: {
  aborted?: boolean;
  attempt: number;
  documentSignature: string;
  errors: string[];
  httpStatus?: number;
  kind: ReportAssistantRequestKind;
  maxAttempts: number;
  ok?: boolean;
  payload?: TPayload;
  requestId: string;
  source: ReportAssistantRequestSource;
  startedAtIso: string;
  startedAtMs: number;
  timedOut: boolean;
  timeoutMs: number;
  warnings: string[];
}): ReportAssistantRequestResult<TPayload> {
  return {
    aborted: input.aborted ?? input.timedOut,
    errors: input.errors,
    httpStatus: input.httpStatus,
    meta: {
      attempt: input.attempt,
      documentSignature: input.documentSignature,
      durationMs: Math.max(0, Date.now() - input.startedAtMs),
      kind: input.kind,
      maxAttempts: input.maxAttempts,
      requestId: input.requestId,
      startedAtIso: input.startedAtIso,
      timeoutMs: input.timeoutMs
    },
    ok: input.ok ?? false,
    payload: input.payload,
    source: input.source,
    timedOut: input.timedOut,
    warnings: input.warnings
  };
}

function shouldRetryReportAssistantRequest(
  kind: ReportAssistantRequestKind,
  result: ReportAssistantRequestResult,
  attempt: number,
  maxAttempts: number
): boolean {
  if (kind === "finding_log" || attempt >= maxAttempts) {
    return false;
  }

  if (result.source === "http") {
    return result.httpStatus === 429 || Boolean(result.httpStatus && result.httpStatus >= 500 && result.httpStatus <= 599);
  }

  if (result.source === "timeout") {
    return !isResearchRequestKind(kind);
  }

  return result.source === "network" || result.source === "parse";
}

function extractReportAssistantErrors(payload: unknown, status: number): string[] {
  const errors = extractReportAssistantStringArray(payload, "errors");
  if (errors.length > 0) {
    return errors;
  }

  if (payload && typeof payload === "object") {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string" && error.trim().length > 0) {
      return [error.trim()];
    }
  }

  return [`Report assistant request failed with HTTP ${status}.`];
}

function extractReportAssistantStringArray(payload: unknown, key: "errors" | "warnings"): string[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const value = (payload as Record<typeof key, unknown>)[key];
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0) : [];
}

function getReportAssistantRequestErrorMessage(error: unknown, timedOut: boolean): string {
  if (timedOut) {
    return "Report assistant request timed out before the provider returned.";
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Report assistant request failed before a response was received.";
}

function isAbortLikeError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "name" in error && (error as { name?: unknown }).name === "AbortError");
}
