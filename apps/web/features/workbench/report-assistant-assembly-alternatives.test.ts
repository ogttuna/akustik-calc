import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import type { ReportAssistantContext } from "./report-assistant-context";
import {
  buildSystemLlmGeminiGroundedAssemblyAlternativeResearchRequest,
  createReportAssistantAssemblyAlternativeReview,
  extractReportAssistantAssemblyAlternativeReviewFromResearchResponse,
  parseReportAssistantAssemblyAlternativeRequest
} from "./report-assistant-assembly-alternatives";
import { assemblyAlternativeReviewToAssistantResult } from "./report-assistant-assembly-alternatives-result";
import type { ReportAssistantResultEnvelope } from "./report-assistant-result-contract";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

const mockAuthState = vi.hoisted(() => ({
  value: {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  }
}));

vi.mock("@/lib/auth", () => ({
  getAuthState: vi.fn(async () => mockAuthState.value)
}));

const RW_METRIC_ID = getReportAssistantMetricId("Rw");
const RESEARCH_ENV_KEYS = [
  "DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT",
  "DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER",
  "DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY",
  "DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS",
  "DYNECHO_REPORT_ASSISTANT_RESEARCH_API_KEY",
  "DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT",
  "DYNECHO_REPORT_ASSISTANT_RESEARCH_MODEL",
  "DYNECHO_REPORT_ASSISTANT_RESEARCH_TIMEOUT_MS"
] as const;

function metadata() {
  return {
    engineDisplayValue: "61 dB",
    metricBasis: getReportAssistantMetricBasis("Rw"),
    metricDirection: getReportAssistantMetricDirection("Rw"),
    outputId: "Rw" as const,
    reportMetricId: RW_METRIC_ID
  };
}

const DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "Rw 54 dB is packaged after manual report manipulation.",
  assumptionItems: [],
  approverTitle: "Lead Acoustic Consultant",
  briefNote: "Manual issue snapshot.",
  citations: [],
  clientName: "Machinity Acoustics",
  consultantAddress: "Maslak District, Istanbul, Turkiye",
  consultantCompany: "Machinity Acoustic Consultants",
  consultantEmail: "offers@machinity-acoustics.com",
  consultantLogoDataUrl: "",
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "Building Acoustics and Vibration Control",
  contextLabel: "Building prediction",
  corridorDossierCards: [],
  corridorDossierHeadline: "Validation corridor packaged.",
  coverageItems: [
    {
      detail: "Weighted airborne element rating.",
      label: "Rw",
      postureDetail: "Benchmark-backed estimate.",
      postureLabel: "Benchmark-backed estimate",
      postureTone: "accent",
      status: "live",
      value: "54 dB",
      ...metadata()
    }
  ],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary: "Riverside Residences currently reads Rw 54 dB.",
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  issuedOnLabel: "21 March 2026",
  issueBaseReference: "MAC-RR-20260321",
  issueCodePrefix: "MAC",
  issueNextReference: "MAC-RR-20260321-03",
  issueRegisterItems: [],
  layers: [
    {
      categoryLabel: "Structure",
      densityLabel: "2400 kg/m3",
      index: 1,
      label: "Concrete slab",
      roleLabel: "Base structure",
      surfaceMassLabel: "480 kg/m2",
      thicknessLabel: "200 mm"
    },
    {
      categoryLabel: "Cavity",
      densityLabel: "45 kg/m3",
      index: 2,
      label: "Mineral wool",
      roleLabel: "Absorber",
      surfaceMassLabel: "2 kg/m2",
      thicknessLabel: "50 mm"
    }
  ],
  methodDossierCards: [],
  methodDossierHeadline: "Solver rationale packaged.",
  methodTraceGroups: [],
  metrics: [
    {
      detail: "Weighted airborne element rating.",
      label: "Rw",
      value: "54 dB",
      ...metadata()
    }
  ],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "54 dB",
  projectName: "Riverside Residences",
  proposalAttention: "Design Coordination Team",
  proposalIssuePurpose: "Client review and acoustic coordination",
  proposalRecipient: "Riverside Development Team",
  proposalReference: "MAC-2026-014",
  proposalRevision: "Rev 01",
  proposalSubject: "Riverside Residences floor acoustic proposal",
  proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
  recommendationItems: [],
  reportProfile: "consultant",
  reportProfileLabel: "Consultant issue",
  studyContextLabel: "Pre-tender",
  studyModeLabel: "Floor",
  validationDetail: "Read this as a supported floor estimate.",
  validationLabel: "Scoped estimate",
  warnings: []
};

function context() {
  return {
    ...buildReportAssistantContext({
      baseDocument: {
        ...DOCUMENT,
        coverageItems: DOCUMENT.coverageItems.map((item) => ({ ...item, value: "61 dB" })),
        metrics: DOCUMENT.metrics.map((metric) => ({ ...metric, value: "61 dB" })),
        primaryMetricValue: "61 dB"
      },
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document: DOCUMENT,
      reportId: "assembly-alternatives-test"
    }),
    traceSummary: {
      basis: "predictor_gate",
      dynamicAirborneFamily: "heavy floor",
      dynamicImpactFamily: "reinforced concrete",
      missingPhysicalInputs: [],
      route: "floor" as const,
      selectedCandidateId: "candidate.rw.test",
      selectedOrigin: "source_absent_predictor",
      unsupportedOutputs: [],
      warnings: []
    }
  };
}

function jsonRequest(payload: unknown) {
  return new Request("http://localhost/api/report-assistant/assembly-alternatives", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

async function withoutResearchProviderEnv<T>(callback: () => Promise<T>): Promise<T> {
  const previousValues = new Map<string, string | undefined>();
  for (const key of RESEARCH_ENV_KEYS) {
    previousValues.set(key, process.env[key]);
    delete process.env[key];
  }

  try {
    return await callback();
  } finally {
    for (const key of RESEARCH_ENV_KEYS) {
      const previousValue = previousValues.get(key);
      if (typeof previousValue === "string") {
        process.env[key] = previousValue;
      } else {
        delete process.env[key];
      }
    }
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("report assistant assembly alternative research", () => {
  it("falls back to context-only review without inventing alternatives when no provider is configured", async () => {
    const result = await createReportAssistantAssemblyAlternativeReview({
      context: context(),
      request: {
        research: true,
        userInstruction: "Mineral wool yerine alternatif ne olabilir?"
      },
      settings: null
    });

    expect(result).toMatchObject({
      ok: true,
      review: {
        comparability: "insufficient",
        sourceQuality: "none",
        suggestedAlternatives: []
      },
      source: "context"
    });
    expect(result.warnings.join(" ")).toContain("DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT");
    if (result.ok) {
      expect(result.review.answerText).toContain("No report value was changed");
      expect(result.review.missingEvidence.join(" ")).toContain("Exact comparable assembly evidence");
    }
  });

  it("formats missing physical inputs in context-only rationale without leaking route ids", async () => {
    const baseContext = context();
    const reviewContext: ReportAssistantContext = {
      ...baseContext,
      traceSummary: {
        ...baseContext.traceSummary,
        missingPhysicalInputs: ["loadBasisKgM2", "impactFieldContext.ci50_2500Db", "sideALeafGroup"]
      }
    };

    const result = await createReportAssistantAssemblyAlternativeReview({
      context: reviewContext,
      request: {
        research: true,
        userInstruction: "Eksik inputları da anlaşılır yaz."
      },
      settings: null
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      const rationale = result.review.rationale.join(" ");
      expect(rationale).toContain("Missing physical inputs remain: Load basis, CI,50-2500, Side A leaf group.");
      expect(rationale).not.toContain("loadBasisKgM2");
      expect(rationale).not.toContain("impactFieldContext");
      expect(rationale).not.toContain("sideALeafGroup");
    }
  });

  it("parses source-backed provider alternatives without exposing report patches", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        context: {
          layersSummary: readonly string[];
        };
        task: string;
      };

      expect(body.task).toBe("dynecho.report_assistant.assembly_alternative_research");
      expect(body.context.layersSummary.join(" ")).toContain("Mineral wool");

      return new Response(
        JSON.stringify({
          review: {
            affectedLayers: ["2. Mineral wool - 50 mm"],
            answerText: "For this build-up, a denser mineral wool or resilient acoustic batten package is the closest non-mutating alternative to research further.",
            comparableAssemblies: [
              {
                comparisonNote: "Comparable only as a lined/cavity absorber reference.",
                description: "Double-leaf lined assembly with mineral wool cavity absorber.",
                metrics: ["Rw improvement depends on leaf mass and decoupling."],
                sourceTitle: "Cavity absorber reference",
                sourceUrl: "https://example.com/cavity-absorber"
              }
            ],
            comparability: "partial",
            expectedMetricDirection: "higher_rw",
            expectedTradeoffs: ["May increase package depth.", "May change fire or moisture requirements."],
            missingEvidence: ["Exact lab test for the same slab, cavity depth, and lining."],
            recommendedActionText: "Keep the report value unchanged until a comparable tested build-up is found.",
            sourceQuality: "mixed",
            sources: [
              {
                note: "Used only as comparison evidence.",
                title: "Cavity absorber reference",
                url: "https://example.com/cavity-absorber"
              },
              {
                title: "Unsafe file source",
                url: "file:///tmp/unsafe"
              }
            ],
            suggestedAlternatives: [
              {
                affectedLayers: ["2. Mineral wool - 50 mm"],
                candidateLayers: [
                  { materialName: "Gypsum Board", role: "side_a", thicknessMm: "12.5" },
                  { materialName: "Rock Wool", role: "cavity", thicknessMm: "75" },
                  { materialName: "Gypsum Board", role: "side_b", thicknessMm: "12.5" }
                ],
                expectedMetricDirection: "higher_airborne_insulation",
                expectedTradeoffs: ["More depth or mass may be needed."],
                label: "Higher-density mineral wool cavity absorber",
                rationale: ["Source-backed only as a partial comparison."]
              }
            ],
            suggestedReportPatch: {
              operations: [],
              summary: "Provider must not preload this."
            }
          }
        }),
        {
          status: 200
        }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantAssemblyAlternativeReview({
      context: context(),
      request: {
        research: true,
        userInstruction: "Mineral wool yerine alternatif ara."
      },
      settings: {
        endpoint: "https://research.example.test/assembly",
        timeoutMs: 1000
      }
    });

    expect(result).toMatchObject({
      ok: true,
      review: {
        affectedLayers: ["2. Mineral wool - 50 mm"],
        comparability: "partial",
        expectedMetricDirection: "higher_airborne_insulation",
        sourceQuality: "mixed",
        sources: [
          {
            title: "Cavity absorber reference",
            url: "https://example.com/cavity-absorber"
          }
        ],
        suggestedAlternatives: [
          {
            candidateLayers: [
              { materialName: "Gypsum Board", role: "side_a", thicknessMm: "12.5" },
              { materialName: "Rock Wool", role: "cavity", thicknessMm: "75" },
              { materialName: "Gypsum Board", role: "side_b", thicknessMm: "12.5" }
            ],
            label: "Higher-density mineral wool cavity absorber"
          }
        ]
      },
      source: "research_provider"
    });
    expect(JSON.stringify(result)).not.toContain("suggestedReportPatch");
    if (result.ok) {
      const envelope = assemblyAlternativeReviewToAssistantResult({
        review: result.review,
        source: result.source,
        warnings: result.warnings
      });

      expect(envelope).toMatchObject({
        authority: "provider_review",
        basis: [],
        capabilityName: "report_assistant_assembly_alternatives_route",
        mutates: false,
        previewOnly: true,
        rendererKind: "research_review_card",
        requiresConfirmation: false,
        resultKind: "assembly_alternatives_review",
        routeStatus: "ready",
        sourceTrace: [
          {
            kind: "provider_review",
            label: "report_assistant_assembly_alternatives_route"
          }
        ],
        stalePolicy: "assistant_context_and_document_signature"
      });
      expect(envelope.evidence).toEqual(expect.arrayContaining([
        {
          detail: "research_provider",
          label: "Review source"
        },
        {
          detail: "1",
          label: "Suggested alternative count"
        },
        {
          detail: "1",
          label: "Citation count"
        }
      ]));
      expect(JSON.stringify(envelope)).not.toContain("For this build-up");
      expect(JSON.stringify(envelope)).not.toContain("Source-backed only");
    }
  });

  it("retries provider responses once with a stricter JSON contract", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        contract: {
          rules: readonly string[];
        };
      };

      if (fetchMock.mock.calls.length === 1) {
        expect(body.contract.rules.join(" ")).not.toContain("Retry contract");
        return new Response(JSON.stringify({ answer: { text: "No schema fields." } }), { status: 200 });
      }

      expect(body.contract.rules.join(" ")).toContain("Retry contract");
      return new Response(
        JSON.stringify({
          review: {
            affectedLayers: ["2. Mineral wool - 50 mm"],
            answerText: "Strict retry returned a valid non-mutating alternative review.",
            comparableAssemblies: [],
            comparability: "weak",
            expectedMetricDirection: "neutral_or_unknown",
            expectedTradeoffs: [],
            missingEvidence: ["No exact comparable source."],
            sourceQuality: "weak",
            sources: [],
            suggestedAlternatives: []
          }
        }),
        { status: 200 }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantAssemblyAlternativeReview({
      context: context(),
      request: {
        research: true,
        userInstruction: "Bir daha layer alternatifi ara."
      },
      settings: {
        endpoint: "https://research.example.test/assembly",
        timeoutMs: 1000
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      ok: true,
      review: {
        answerText: "Strict retry returned a valid non-mutating alternative review.",
        comparability: "weak"
      },
      source: "research_provider"
    });
  });

  it("builds system_llm Gemini grounded assembly research requests", () => {
    const request = buildSystemLlmGeminiGroundedAssemblyAlternativeResearchRequest({
      context: context(),
      request: {
        research: true,
        userInstruction: "Mineral wool yerine alternatif ara."
      },
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy?token=do-not-forward",
        model: "gemini-3-flash-preview",
        provider: "system_llm_gemini_grounded_research",
        proxyKey: "proxy-secret",
        timeoutMs: 12000
      }
    });

    expect(request.url).toBe("http://system_llm:4000/gemini-proxy/v1beta/models/gemini-3-flash-preview:generateContent");
    expect(request.headers).toMatchObject({
      Authorization: "Bearer proxy-secret",
      "content-type": "application/json",
      "x-goog-api-key": "proxy-secret"
    });
    expect(request.body.tools).toEqual([{ googleSearch: {} }]);
    expect(JSON.stringify(request.body)).not.toContain("do-not-forward");

    const userText = request.body.contents[0]?.parts[0]?.text ?? "";
    const payload = JSON.parse(userText) as {
      contract: {
        rules: readonly string[];
      };
      task: string;
    };

    expect(payload.task).toBe("dynecho.report_assistant.assembly_alternative_research");
    expect(payload.contract.rules.join(" ")).toContain("Do not return report patches");
    expect(payload.contract.rules.join(" ")).toContain("suggestedAlternatives");
    expect(payload.contract.rules.join(" ")).toContain("candidateLayers");
  });

  it("returns route reviews without mutating report or requiring a metric", async () => {
    const { POST } = await import("../../app/api/report-assistant/assembly-alternatives/route");
    const response = await withoutResearchProviderEnv(() =>
      POST(
        jsonRequest({
          context: context(),
          document: DOCUMENT,
          request: {
            research: true,
            userInstruction: "Mineral wool yerine alternatif ne olabilir?"
          }
        })
      )
    );
    const payload = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
      review: {
        answerText: string;
        sourceQuality: string;
        suggestedAlternatives: readonly unknown[];
      };
      source: string;
    };

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      review: {
        sourceQuality: "none",
        suggestedAlternatives: []
      },
      source: "context"
    });
    expect(payload.review.answerText).toContain("No report value was changed");
    expect(payload.assistantResults).toHaveLength(1);
    expect(payload.assistantResults?.[0]).toMatchObject({
      authority: "deterministic_read",
      basis: [],
      capabilityName: "report_assistant_assembly_alternatives_route",
      mutates: false,
      previewOnly: true,
      rendererKind: "research_review_card",
      requiresConfirmation: false,
      resultKind: "assembly_alternatives_review",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "deterministic",
          label: "report_assistant_assembly_alternatives_route"
        }
      ],
      stalePolicy: "assistant_context_and_document_signature"
    });
    expect(payload.assistantResults?.[0]?.evidence).toEqual(expect.arrayContaining([
      {
        detail: "context",
        label: "Review source"
      },
      {
        detail: "0",
        label: "Suggested alternative count"
      },
      {
        detail: "0",
        label: "Citation count"
      }
    ]));
    expect(DOCUMENT.primaryMetricValue).toBe("54 dB");
  });

  it("returns typed failure envelopes for invalid route payloads", async () => {
    const { POST } = await import("../../app/api/report-assistant/assembly-alternatives/route");
    const response = await POST(jsonRequest(null));
    const payload = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
    };

    expect(response.status).toBe(400);
    expect(payload.assistantResults?.[0]).toMatchObject({
      authority: "needs_input",
      capabilityName: "report_assistant_assembly_alternatives_route",
      routeStatus: "needs_input",
      tasks: [
        {
          code: "invalid_assembly_alternatives_payload",
          severity: "warning"
        }
      ]
    });
  });

  it("parses request and Gemini wrapped review shapes", () => {
    expect(parseReportAssistantAssemblyAlternativeRequest({ userInstruction: "Alternatif ara", research: true })).toEqual({
      research: true,
      userInstruction: "Alternatif ara"
    });
    expect(parseReportAssistantAssemblyAlternativeRequest({ research: true })).toBeNull();

    const review = extractReportAssistantAssemblyAlternativeReviewFromResearchResponse({
      context: context(),
      request: {
        research: true,
        userInstruction: "Layer alternatifi ara."
      },
      response: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    assemblyAlternatives: {
                      affectedLayers: ["2. Mineral wool - 50 mm"],
                      answerText: "Gemini wrapped answer.",
                      comparableAssemblies: [],
                      comparability: "limited",
                      expectedMetricDirection: "lower_lnw",
                      expectedTradeoffs: ["Potential added cost."],
                      missingEvidence: ["No exact tested assembly."],
                      sourceQuality: "low",
                      sources: [
                        {
                          comparisonNote: "Uses link instead of url.",
                          link: "https://example.com/wrapped-source",
                          title: "Wrapped source"
                        }
                      ],
                      suggestedAlternatives: []
                    }
                  })
                }
              ]
            },
            groundingMetadata: {
              groundingChunks: [
                {
                  web: {
                    title: "Grounded source",
                    uri: "https://example.com/grounded-source"
                  }
                }
              ]
            }
          }
        ]
      }
    });

    expect(review).toMatchObject({
      comparability: "weak",
      expectedMetricDirection: "lower_impact_noise",
      sourceQuality: "weak",
      sources: [
        {
          note: "Uses link instead of url.",
          title: "Wrapped source",
          url: "https://example.com/wrapped-source"
        },
        {
          note: "Grounded source returned by Gemini Google Search.",
          title: "Grounded source",
          url: "https://example.com/grounded-source"
        }
      ]
    });
  });
});
