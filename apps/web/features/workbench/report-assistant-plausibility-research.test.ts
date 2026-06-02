import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import {
  createReportAssistantPlausibilityReview,
  extractReportAssistantPlausibilityReviewFromResearchResponse,
  getReportAssistantPlausibilityResearchSettings
} from "./report-assistant-plausibility-research";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

const RW_METRIC_ID = getReportAssistantMetricId("Rw");

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
      createdAtIso: "2026-06-02T09:00:00.000Z",
      document: DOCUMENT,
      reportId: "research-test"
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("report assistant source-bounded plausibility research", () => {
  it("falls back to context-only review when source research is requested without a configured endpoint", async () => {
    const result = await createReportAssistantPlausibilityReview({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true
      },
      settings: null
    });

    expect(result).toMatchObject({
      ok: true,
      source: "context"
    });
    expect(result.warnings.join(" ")).toContain("DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT");
    if (result.ok) {
      expect(result.review.rationale.join(" ")).toContain("context-only");
    }
  });

  it("parses provider review responses while keeping metric values owned by local context", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        context: {
          metric: {
            id: string;
          };
        };
        task: string;
      };

      expect(body.task).toBe("dynecho.report_assistant.plausibility_research");
      expect(body.context.metric.id).toBe(RW_METRIC_ID);

      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      review: {
                        metricId: RW_METRIC_ID,
                        rationale: [
                          "Comparable heavyweight concrete floors usually need exact construction context before a high airborne claim is trusted."
                        ],
                        severity: "medium",
                        sources: [
                          {
                            note: "Used only as a plausibility comparison.",
                            title: "Example acoustic reference",
                            url: "https://example.com/acoustic-reference"
                          },
                          {
                            title: "Unsafe local file",
                            url: "file:///tmp/unsafe"
                          }
                        ],
                        valueReviewed: "999 dB",
                        verdict: "suspicious"
                      }
                    })
                  }
                ]
              }
            }
          ]
        }),
        {
          status: 200
        }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantPlausibilityReview({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true,
        userInstruction: "Research this value."
      },
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        timeoutMs: 1000
      }
    });

    expect(result).toMatchObject({
      ok: true,
      review: {
        metricId: RW_METRIC_ID,
        sources: [
          {
            title: "Example acoustic reference",
            url: "https://example.com/acoustic-reference"
          }
        ],
        valueReviewed: "54 dB",
        verdict: "suspicious"
      },
      source: "research_provider"
    });
  });

  it("falls back to context-only review when the configured provider fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("service unavailable", { status: 503 })));

    const result = await createReportAssistantPlausibilityReview({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true
      },
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        timeoutMs: 1000
      }
    });

    expect(result).toMatchObject({
      ok: true,
      source: "context"
    });
    expect(result.warnings.join(" ")).toContain("Source research provider unavailable");
  });

  it("normalizes research settings and extracts direct review JSON", () => {
    expect(getReportAssistantPlausibilityResearchSettings({})).toBeNull();
    expect(
      getReportAssistantPlausibilityResearchSettings({
        DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT: "file:///unsafe"
      })
    ).toBeNull();
    expect(
      getReportAssistantPlausibilityResearchSettings({
        DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT: "http://system_llm:4000/gemini-proxy",
        DYNECHO_REPORT_ASSISTANT_RESEARCH_TIMEOUT_MS: "900000"
      })
    ).toMatchObject({
      endpoint: "http://system_llm:4000/gemini-proxy",
      timeoutMs: 45000
    });

    expect(
      extractReportAssistantPlausibilityReviewFromResearchResponse({
        context: context(),
        request: {
          metricId: RW_METRIC_ID,
          research: true
        },
        response: {
          review: {
            metricId: RW_METRIC_ID,
            rationale: ["Source-bounded comparison."],
            severity: "low",
            sources: [],
            valueReviewed: "999 dB",
            verdict: "plausible"
          }
        }
      })
    ).toMatchObject({
      metricId: RW_METRIC_ID,
      valueReviewed: "54 dB",
      verdict: "plausible"
    });
  });
});
