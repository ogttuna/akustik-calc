import { afterEach, describe, expect, it, vi } from "vitest";

import { sendReportAssistantRequest } from "./report-assistant-request-client";

describe("report assistant browser request client", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("posts JSON and returns parsed payload metadata", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ ok: true, warnings: ["context-only fallback"] }), { status: 200 }));

    const result = await sendReportAssistantRequest({
      body: { instruction: "Rw değerini kontrol et" },
      documentSignature: "doc-a",
      fetchFn,
      kind: "patch_proposal",
      requestId: "request-a",
      timeoutMs: 1200,
      url: "/api/report-assistant/patch"
    });

    expect(result.ok).toBe(true);
    expect(result.payload).toEqual({ ok: true, warnings: ["context-only fallback"] });
    expect(result.warnings).toEqual(["context-only fallback"]);
    expect(result.meta).toMatchObject({
      attempt: 1,
      documentSignature: "doc-a",
      kind: "patch_proposal",
      maxAttempts: 2,
      requestId: "request-a",
      timeoutMs: 1200
    });
    expect(fetchFn).toHaveBeenCalledWith(
      "/api/report-assistant/patch",
      expect.objectContaining({
        body: JSON.stringify({ instruction: "Rw değerini kontrol et" }),
        method: "POST"
      })
    );
  });

  it("binds the default global fetch so browser fetch keeps its invocation context", async () => {
    const fetchFn = vi.fn(function (this: typeof globalThis) {
      if (this !== globalThis) {
        throw new TypeError("Illegal invocation");
      }

      return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    }) as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetchFn);

    const result = await sendReportAssistantRequest({
      body: { instruction: "kaynakla kontrol et" },
      documentSignature: "doc-global-fetch",
      kind: "plausibility_research",
      maxAttempts: 1,
      requestId: "request-global-fetch",
      url: "/api/report-assistant/plausibility"
    });

    expect(result.ok).toBe(true);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("uses a longer default timeout budget for source research requests", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const researchResult = await sendReportAssistantRequest({
      body: { review: { metricId: "output:Rw", research: true } },
      documentSignature: "doc-research-timeout",
      fetchFn,
      kind: "plausibility_research",
      requestId: "request-research-timeout",
      url: "/api/report-assistant/plausibility"
    });
    const patchResult = await sendReportAssistantRequest({
      body: { instruction: "Rw değerini 2 dB düşür" },
      documentSignature: "doc-patch-timeout",
      fetchFn,
      kind: "patch_proposal",
      requestId: "request-patch-timeout",
      url: "/api/report-assistant/patch"
    });

    expect(researchResult.meta.timeoutMs).toBe(90000);
    expect(patchResult.meta.timeoutMs).toBe(18000);
  });

  it("clamps explicit source research timeouts to the research-specific maximum", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const result = await sendReportAssistantRequest({
      body: { review: { metricId: "output:Rw", research: true } },
      documentSignature: "doc-research-timeout-max",
      fetchFn,
      kind: "plausibility_research",
      requestId: "request-research-timeout-max",
      timeoutMs: 900000,
      url: "/api/report-assistant/plausibility"
    });

    expect(result.meta.timeoutMs).toBe(120000);
  });


  it("treats non-2xx responses as structured HTTP errors", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ errors: ["Metric is ambiguous."], warnings: ["No report value changed."] }), { status: 400 }));

    const result = await sendReportAssistantRequest({
      body: { review: { metricId: "output:Rw" } },
      documentSignature: "doc-a",
      fetchFn,
      kind: "plausibility_research",
      maxAttempts: 1,
      requestId: "request-b",
      url: "/api/report-assistant/plausibility"
    });

    expect(result.ok).toBe(false);
    expect(result.source).toBe("http");
    expect(result.errors).toEqual(["Metric is ambiguous."]);
    expect(result.warnings).toEqual(["No report value changed."]);
    expect(result.payload).toEqual({ errors: ["Metric is ambiguous."], warnings: ["No report value changed."] });
  });

  it("does not retry non-transient HTTP validation errors", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ errors: ["Metric is ambiguous."] }), { status: 400 }));

    const result = await sendReportAssistantRequest({
      body: { review: { metricId: "output:Rw" } },
      documentSignature: "doc-a",
      fetchFn,
      kind: "plausibility_research",
      requestId: "request-b2",
      url: "/api/report-assistant/plausibility"
    });

    expect(result.ok).toBe(false);
    expect(result.httpStatus).toBe(400);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("reports invalid JSON as a parse failure", async () => {
    const fetchFn = vi.fn(async () => new Response("not json", { status: 200 }));

    const result = await sendReportAssistantRequest({
      body: {},
      documentSignature: "doc-a",
      fetchFn,
      kind: "patch_proposal",
      maxAttempts: 1,
      requestId: "request-c",
      url: "/api/report-assistant/patch"
    });

    expect(result.ok).toBe(false);
    expect(result.source).toBe("parse");
    expect(result.errors[0]).toContain("invalid JSON");
  });

  it("aborts a request when the client timeout expires", async () => {
    vi.useFakeTimers();
    const fetchFn = vi.fn(
      async (_url: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(Object.assign(new Error("aborted"), { name: "AbortError" }));
          });
        })
    );

    const resultPromise = sendReportAssistantRequest({
      body: {},
      documentSignature: "doc-a",
      fetchFn,
      kind: "plausibility_research",
      maxAttempts: 1,
      requestId: "request-d",
      timeoutMs: 1000,
      url: "/api/report-assistant/plausibility"
    });
    await vi.advanceTimersByTimeAsync(1001);
    const result = await resultPromise;

    expect(result.ok).toBe(false);
    expect(result.source).toBe("timeout");
    expect(result.timedOut).toBe(true);
    expect(result.aborted).toBe(true);
    expect(result.errors).toEqual(["Report assistant request timed out before the provider returned."]);
  });

  it("does not start a second client attempt after a source research timeout", async () => {
    vi.useFakeTimers();
    const fetchFn = vi.fn(
      async (_url: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(Object.assign(new Error("aborted"), { name: "AbortError" }));
          });
        })
    );

    const resultPromise = sendReportAssistantRequest({
      body: { review: { metricId: "output:Rw", research: true } },
      documentSignature: "doc-source-timeout",
      fetchFn,
      kind: "plausibility_research",
      requestId: "request-source-timeout",
      timeoutMs: 1000,
      url: "/api/report-assistant/plausibility"
    });
    await vi.advanceTimersByTimeAsync(1001);
    const result = await resultPromise;

    expect(result.ok).toBe(false);
    expect(result.source).toBe("timeout");
    expect(result.meta.maxAttempts).toBe(2);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("retries safe assistant requests once after a transient failure", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "Temporary provider failure." }), { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ review: { metricId: "output:Rw" } }), { status: 200 }));

    const result = await sendReportAssistantRequest({
      body: { review: { metricId: "output:Rw" } },
      documentSignature: "doc-a",
      fetchFn,
      kind: "plausibility_research",
      requestId: "request-e",
      url: "/api/report-assistant/plausibility"
    });

    expect(result.ok).toBe(true);
    expect(result.meta.attempt).toBe(2);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("retries assembly alternative research after a transient failure", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "Temporary provider failure." }), { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        review: {
          affectedLayers: [],
          answerText: "Context-only alternative review.",
          comparableAssemblies: [],
          comparability: "insufficient",
          expectedMetricDirection: "neutral_or_unknown",
          expectedTradeoffs: [],
          missingEvidence: [],
          rationale: [],
          sourceQuality: "none",
          sources: [],
          suggestedAlternatives: []
        }
      }), { status: 200 }));

    const result = await sendReportAssistantRequest({
      body: {
        request: {
          research: true,
          userInstruction: "Layer alternatifi ara."
        }
      },
      documentSignature: "doc-assembly",
      fetchFn,
      kind: "assembly_alternatives_research",
      requestId: "request-assembly",
      url: "/api/report-assistant/assembly-alternatives"
    });

    expect(result.ok).toBe(true);
    expect(result.meta).toMatchObject({
      attempt: 2,
      kind: "assembly_alternatives_research",
      maxAttempts: 2
    });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("does not retry finding-log writes", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ error: "Queue unavailable." }), { status: 500 }));

    const result = await sendReportAssistantRequest({
      body: { confirmed: true },
      documentSignature: "doc-a",
      fetchFn,
      kind: "finding_log",
      maxAttempts: 3,
      requestId: "request-f",
      url: "/api/report-assistant/findings"
    });

    expect(result.ok).toBe(false);
    expect(result.meta.maxAttempts).toBe(1);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});
