import { describe, expect, it } from "vitest";

import type { ReportAssistantRequestKind, ReportAssistantRequestResult } from "./report-assistant-request-client";
import {
  createReportAssistantActiveRequestRegistry,
  finishReportAssistantRequest,
  isReportAssistantRequestRecordActive,
  isReportAssistantRequestResultActive,
  startReportAssistantRequest
} from "./report-assistant-request-lifecycle";

describe("report assistant request lifecycle", () => {
  it("accepts only the active request result for the current document", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const activeRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "plausibility_research",
      registry
    });

    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("plausibility_research", activeRequest.requestId, "doc-a")
      })
    ).toBe(true);
  });

  it("rejects delayed results from older request ids", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const oldRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "patch_proposal",
      registry
    });
    const latestRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "patch_proposal",
      registry
    });

    expect(oldRequest.requestId).not.toBe(latestRequest.requestId);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("patch_proposal", oldRequest.requestId, "doc-a")
      })
    ).toBe(false);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("patch_proposal", latestRequest.requestId, "doc-a")
      })
    ).toBe(true);
  });

  it("rejects delayed assembly research results from older request ids", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const oldRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "assembly_alternatives_research",
      registry
    });
    const latestRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "assembly_alternatives_research",
      registry
    });

    expect(oldRequest.requestId).not.toBe(latestRequest.requestId);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("assembly_alternatives_research", oldRequest.requestId, "doc-a")
      })
    ).toBe(false);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("assembly_alternatives_research", latestRequest.requestId, "doc-a")
      })
    ).toBe(true);
  });

  it("rejects results created for a previous document signature", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const activeRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "plausibility_research",
      registry
    });

    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-b",
        registry,
        result: buildResult("plausibility_research", activeRequest.requestId, "doc-a")
      })
    ).toBe(false);
  });

  it("rejects results when the assistant context changes but the patch document can still be the same", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const activeRequest = startReportAssistantRequest({
      documentSignature: "report-context:impact-floor-concrete",
      kind: "plausibility_research",
      registry
    });

    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "report-context:impact-floor-clt",
        registry,
        result: buildResult("plausibility_research", activeRequest.requestId, "report-context:impact-floor-concrete")
      })
    ).toBe(false);
    expect(
      isReportAssistantRequestRecordActive({
        currentDocumentSignature: "report-context:impact-floor-clt",
        kind: "plausibility_research",
        registry,
        request: activeRequest
      })
    ).toBe(false);
  });

  it("rejects assembly research results created for a previous document signature", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const activeRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "assembly_alternatives_research",
      registry
    });

    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-b",
        registry,
        result: buildResult("assembly_alternatives_research", activeRequest.requestId, "doc-a")
      })
    ).toBe(false);
    expect(
      isReportAssistantRequestRecordActive({
        currentDocumentSignature: "doc-b",
        kind: "assembly_alternatives_research",
        registry,
        request: activeRequest
      })
    ).toBe(false);
  });

  it("keeps request kinds isolated from each other", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const researchRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "plausibility_research",
      registry
    });
    const assemblyResearchRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "assembly_alternatives_research",
      registry
    });
    const patchRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "patch_proposal",
      registry
    });
    const queryRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "read_only_query",
      registry
    });
    const actionRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "action_proposal",
      registry
    });

    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("plausibility_research", researchRequest.requestId, "doc-a")
      })
    ).toBe(true);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("assembly_alternatives_research", assemblyResearchRequest.requestId, "doc-a")
      })
    ).toBe(true);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("patch_proposal", patchRequest.requestId, "doc-a")
      })
    ).toBe(true);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("read_only_query", queryRequest.requestId, "doc-a")
      })
    ).toBe(true);
    expect(
      isReportAssistantRequestResultActive({
        currentDocumentSignature: "doc-a",
        registry,
        result: buildResult("action_proposal", actionRequest.requestId, "doc-a")
      })
    ).toBe(true);
  });

  it("finishes only the matching active request", () => {
    const registry = createReportAssistantActiveRequestRegistry();
    const oldRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "patch_proposal",
      registry
    });
    const latestRequest = startReportAssistantRequest({
      documentSignature: "doc-a",
      kind: "patch_proposal",
      registry
    });

    finishReportAssistantRequest({
      kind: "patch_proposal",
      registry,
      requestId: oldRequest.requestId
    });
    expect(
      isReportAssistantRequestRecordActive({
        currentDocumentSignature: "doc-a",
        kind: "patch_proposal",
        registry,
        request: latestRequest
      })
    ).toBe(true);

    finishReportAssistantRequest({
      kind: "patch_proposal",
      registry,
      requestId: latestRequest.requestId
    });
    expect(
      isReportAssistantRequestRecordActive({
        currentDocumentSignature: "doc-a",
        kind: "patch_proposal",
        registry,
        request: latestRequest
      })
    ).toBe(false);
  });
});

function buildResult(
  kind: ReportAssistantRequestKind,
  requestId: string,
  documentSignature: string
): ReportAssistantRequestResult {
  return {
    aborted: false,
    errors: [],
    meta: {
      attempt: 1,
      documentSignature,
      durationMs: 10,
      kind,
      maxAttempts: 1,
      requestId,
      startedAtIso: "2026-06-03T00:00:00.000Z",
      timeoutMs: 1000
    },
    ok: true,
    payload: {},
    source: "network",
    timedOut: false,
    warnings: []
  };
}
