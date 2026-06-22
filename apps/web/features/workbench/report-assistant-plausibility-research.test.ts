import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import type { ReportAssistantCurrentCalculatorReviewPacket } from "./report-assistant-current-calculator-review-packet";
import { buildReportAssistantContextFromCurrentCalculatorReviewPacket } from "./report-assistant-plausibility";
import {
  buildSystemLlmGeminiGroundedResearchRequest,
  createReportAssistantPlausibilityReview,
  extractReportAssistantPlausibilityReviewFromResearchResponse,
  getReportAssistantPlausibilityResearchSettings
} from "./report-assistant-plausibility-research";
import { plausibilityReviewToAssistantResult } from "./report-assistant-plausibility-result";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

const RW_METRIC_ID = getReportAssistantMetricId("Rw");
const DELTALW_METRIC_ID = getReportAssistantMetricId("DeltaLw");
const IIC_METRIC_ID = getReportAssistantMetricId("IIC");
const CALCULATOR_RW_METRIC_ID = "output:Rw";

function metadata(outputId: "DeltaLw" | "IIC" | "Rw" = "Rw") {
  return {
    engineDisplayValue: outputId === "Rw" ? "61 dB" : "Not ready",
    metricBasis: getReportAssistantMetricBasis(outputId),
    metricDirection: getReportAssistantMetricDirection(outputId),
    outputId,
    reportMetricId: getReportAssistantMetricId(outputId)
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
      ...metadata("Rw")
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
      ...metadata("Rw")
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

function parkedMetricContext(status: "needs_input" | "unsupported") {
  const outputId = status === "needs_input" ? "DeltaLw" : "IIC";
  const metricId = getReportAssistantMetricId(outputId);
  const parkedDocument: SimpleWorkbenchProposalDocument = {
    ...DOCUMENT,
    coverageItems: [
      ...DOCUMENT.coverageItems,
      {
        detail: status === "needs_input" ? "Impact improvement needs finish support inputs." : "ASTM impact alias is unsupported for this context.",
        label: outputId,
        nextStep: status === "needs_input" ? "Enter finish dynamic stiffness before publishing DeltaLw." : "Use supported impact outputs for this assembly.",
        postureDetail: status === "needs_input" ? "Missing finish input." : "Unsupported output.",
        postureLabel: status === "needs_input" ? "Needs input" : "Unsupported",
        postureTone: "warning",
        status,
        value: "Not ready",
        ...metadata(outputId)
      }
    ]
  };

  return {
    metricId,
    reviewContext: buildReportAssistantContext({
      baseDocument: DOCUMENT,
      createdAtIso: "2026-06-02T09:00:00.000Z",
      document: parkedDocument,
      reportId: `research-${status}-test`
    })
  };
}

function calculatorReviewPacket(): ReportAssistantCurrentCalculatorReviewPacket {
  return {
    contextSignature: "calculator-context:research-test",
    layers: [
      {
        index: 1,
        label: "Gypsum Board 12.5 mm",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        role: "side_a",
        sourceText: "side_a: Gypsum Board 12.5 mm",
        thicknessMm: 12.5
      },
      {
        index: 2,
        label: "Rock Wool 50 mm",
        materialId: "rockwool",
        materialName: "Rock Wool",
        role: "cavity",
        sourceText: "cavity: Rock Wool 50 mm",
        thicknessMm: 50
      },
      {
        index: 3,
        label: "Gypsum Board 12.5 mm",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        role: "side_b",
        sourceText: "side_b: Gypsum Board 12.5 mm",
        thicknessMm: 12.5
      }
    ],
    metric: {
      basis: "lab",
      calculatorDisplayValue: "41 dB",
      direction: "higher_is_better",
      label: "Rw",
      metricId: CALCULATOR_RW_METRIC_ID,
      outputId: "Rw",
      status: "live",
      valueAuthority: "calculator_preview"
    },
    missingInputs: [],
    numericReviewAllowed: true,
    requestedOutputs: ["Rw"],
    reviewStatus: "ready",
    route: "wall",
    routeBasis: "formula",
    snapshotSignature: "workbench-snapshot:research-test",
    source: "calculator_preview",
    sourceName: "Described wall layer configuration",
    tasks: [],
    unsupportedOutputs: [],
    warnings: []
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
      review: {
        comparability: "not_comparable",
        confidence: "low",
        sourceQuality: "none"
      },
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
                        answerText: "I found comparable acoustic references, but the report value should stay cautious without exact assembly evidence.",
                        comparability: "partial",
                        comparableAssemblies: [
                          {
                            comparisonNote: "Same heavy concrete family, but not the exact finish stack.",
                            label: "Heavy concrete floating floor reference",
                            matchingLayers: ["200 mm concrete slab"],
                            metricValues: ["Rw 52-58 dB"],
                            sourceTitle: "Example acoustic reference",
                            sourceUrl: "https://example.com/acoustic-reference",
                            weakeningDifferences: ["unknown ceiling and flanking treatment"]
                          }
                        ],
                        confidence: "medium",
                        insufficientSourcesReason: "No source matched the exact layer stack.",
                        metricId: RW_METRIC_ID,
                        missingEvidence: ["Exact tested assembly for this layer order."],
                        rationale: [
                          "Comparable heavyweight concrete floors usually need exact construction context before a high airborne claim is trusted."
                        ],
                        severity: "medium",
                        sourceQuality: "mixed",
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
                        valueRange: {
                          maxDb: 58,
                          minDb: 52,
                          note: "Broad source-backed comparison range."
                        },
                        valueRecommendation: {
                          maxDb: 56,
                          minDb: 52,
                          note: "Keep the issued value inside the conservative source-backed range."
                        },
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
        answerText: "I found comparable acoustic references, but the report value should stay cautious without exact assembly evidence.",
        comparability: "partial",
        comparableAssemblies: [
          {
            label: "Heavy concrete floating floor reference",
            matchingLayers: ["200 mm concrete slab"],
            metricValues: ["Rw 52-58 dB"],
            sourceUrl: "https://example.com/acoustic-reference",
            weakeningDifferences: ["unknown ceiling and flanking treatment"]
          }
        ],
        confidence: "medium",
        insufficientSourcesReason: "No source matched the exact layer stack.",
        metricId: RW_METRIC_ID,
        missingEvidence: ["Exact tested assembly for this layer order."],
        sourceQuality: "mixed",
        sources: [
          {
            title: "Example acoustic reference",
            url: "https://example.com/acoustic-reference"
          }
        ],
        valueRange: {
          maxDb: 58,
          minDb: 52,
          note: "Broad source-backed comparison range."
        },
        valueRecommendation: {
          maxDb: 56,
          minDb: 52,
          note: "Keep the issued value inside the conservative source-backed range."
        },
        valueReviewed: "54 dB",
        verdict: "suspicious"
      },
      source: "research_provider"
    });
    if (result.ok) {
      const envelope = plausibilityReviewToAssistantResult({
        review: result.review,
        source: result.source,
        warnings: result.warnings
      });

      expect(envelope).toMatchObject({
        authority: "provider_review",
        basis: [],
        capabilityName: "report_assistant_plausibility_route",
        mutates: false,
        previewOnly: true,
        rendererKind: "research_review_card",
        requiresConfirmation: false,
        resultKind: "plausibility_review",
        routeStatus: "ready",
        sourceTrace: [
          {
            detail: "Research provider output was normalized into the plausibility review contract.",
            kind: "provider_review",
            label: "report_assistant_plausibility_route"
          }
        ],
        stalePolicy: "assistant_context_and_document_signature"
      });
      expect(envelope.evidence).toEqual(expect.arrayContaining([
        {
          detail: RW_METRIC_ID,
          label: "Metric reviewed"
        },
        {
          detail: "suspicious",
          label: "Review verdict"
        },
        {
          detail: "1",
          label: "Citation count"
        },
        {
          detail: "research_provider",
          label: "Review source"
        }
      ]));
      expect(JSON.stringify(envelope)).not.toContain("I found comparable acoustic references");
      expect(JSON.stringify(envelope)).not.toContain("Comparable heavyweight concrete floors");
    }
  });

  it("sends current calculator review packets to source research without accepting provider patches", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        context: {
          layersSummary: readonly string[];
          metric: {
            engineDisplayValue?: string;
            id: string;
            reportDisplayValue: string;
          };
        };
        review: {
          suggestPatch?: boolean;
        };
      };

      expect(body.context.metric).toMatchObject({
        engineDisplayValue: "41 dB",
        id: CALCULATOR_RW_METRIC_ID,
        reportDisplayValue: "41 dB"
      });
      expect(body.context.layersSummary.join(" ")).toContain("Rock Wool 50 mm");
      expect(body.review.suggestPatch).toBe(false);

      return new Response(
        JSON.stringify({
          review: {
            answerText: "Comparable gypsum and mineral wool wall references sit above the current value, but exact comparability is partial.",
            comparability: "partial",
            comparableAssemblies: [
              {
                comparisonNote: "Similar gypsum + mineral wool wall, not the exact calculator stack.",
                label: "Gypsum mineral wool wall reference",
                matchingLayers: ["Gypsum Board", "Rock Wool"],
                metricValues: ["Rw 45-50 dB"],
                sourceTitle: "Wall acoustic reference",
                sourceUrl: "https://example.com/wall-acoustic-reference",
                weakeningDifferences: ["unknown stud/cavity details"]
              }
            ],
            confidence: "medium",
            metricId: CALCULATOR_RW_METRIC_ID,
            rationale: ["Source evidence is advisory only."],
            recommendedActionText: "Ask the user before applying any report-only recommendation.",
            severity: "medium",
            sourceQuality: "mixed",
            suggestedReportPatch: {
              operations: [],
              summary: "Provider patch must be ignored"
            },
            valueRecommendation: {
              displayValue: "47 dB",
              note: "Advisory source-backed report value only."
            },
            verdict: "suspicious"
          }
        }),
        {
          status: 200
        }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantPlausibilityReview({
      context: buildReportAssistantContextFromCurrentCalculatorReviewPacket(calculatorReviewPacket()),
      request: {
        metricId: CALCULATOR_RW_METRIC_ID,
        research: true,
        suggestPatch: true,
        userInstruction: "Ekrandaki stacke bak, Rw fazla mi az mi internetten arastir."
      },
      settings: {
        endpoint: "https://research.example.test/review",
        timeoutMs: 1000
      }
    });

    expect(result).toMatchObject({
      ok: true,
      review: {
        engineDisplayValue: "41 dB",
        metricId: CALCULATOR_RW_METRIC_ID,
        sourceQuality: "mixed",
        valueRecommendation: {
          displayValue: "47 dB"
        },
        valueReviewed: "41 dB",
        verdict: "suspicious"
      },
      source: "research_provider"
    });
    if (result.ok) {
      expect(result.review.suggestedReportPatch).toBeUndefined();
    }
  });

  it("retries source research once with a strict JSON contract when the provider shape is invalid", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        contract: {
          rules: readonly string[];
        };
      };

      if (fetchMock.mock.calls.length === 1) {
        expect(body.contract.rules.join(" ")).not.toContain("Retry contract");

        return new Response(
          JSON.stringify({
            answer: {
              summary: "The value may be reasonable, but no contract fields were returned."
            }
          }),
          {
            status: 200
          }
        );
      }

      expect(body.contract.rules.join(" ")).toContain("Retry contract");

      return new Response(
        JSON.stringify({
          review: {
            metricId: RW_METRIC_ID,
            rationale: ["Strict retry returned the required review object."],
            recommendedActionText: "Keep the report value unless project-specific test evidence says otherwise.",
            severity: "low",
            valueReviewed: "999 dB",
            verdict: "plausible"
          }
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
        endpoint: "https://research.example.test/review",
        timeoutMs: 1000
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      ok: true,
      review: {
        metricId: RW_METRIC_ID,
        recommendedActionText: "Keep the report value unless project-specific test evidence says otherwise.",
        valueReviewed: "54 dB",
        verdict: "plausible"
      },
      source: "research_provider"
    });
  });

  it("keeps sourced research as a low-confidence fallback when strict provider shapes remain incomplete", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      answerText: "I found a related floating screed source, but the response missed verdict fields.",
                      comparableAssemblies: [
                        {
                          comparisonNote: "Same heavy floor family only.",
                          label: "Floating screed reference",
                          sourceTitle: "Floating screed acoustic source",
                          sourceUrl: "https://example.com/floating-screed-source"
                        }
                      ]
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
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantPlausibilityReview({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true,
        userInstruction: "Research this value."
      },
      settings: {
        endpoint: "https://research.example.test/review",
        timeoutMs: 1000
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      ok: true,
      review: {
        answerText: "I found a related floating screed source, but the response missed verdict fields.",
        confidence: "low",
        metricId: RW_METRIC_ID,
        recommendedActionText: expect.stringContaining("source-gathering only"),
        sources: [
          {
            note: "Same heavy floor family only.",
            title: "Floating screed acoustic source",
            url: "https://example.com/floating-screed-source"
          }
        ],
        sourceQuality: "weak",
        valueRecommendation: {
          note: "No numeric recommendation is published from a malformed provider response."
        },
        verdict: "insufficient_context"
      },
      source: "research_provider"
    });
    expect(result.warnings.join(" ")).toContain("low-confidence source fallback");
  });

  it("includes same-context previous structured research evidence for challenge requests", async () => {
    const reviewContext = context();
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        contract: {
          rules: readonly string[];
        };
        review: {
          previousReview?: {
            comparableAssemblies: readonly unknown[];
            comparability?: string;
            metricId?: string;
            sourceQuality?: string;
            sources: readonly { title: string; url: string }[];
            valueRecommendation?: {
              maxDb?: number;
              minDb?: number;
            };
            verdict?: string;
          };
          suggestPatch?: boolean;
          userChallengeText?: string;
        };
      };

      expect(body.review.suggestPatch).toBe(false);
      expect(body.review.userChallengeText).toBe("bence yanılıyorsun, şu kaynağı dikkate al");
      expect(body.review.previousReview).toMatchObject({
        comparableAssemblies: [
          {
            label: "Heavy concrete floating floor reference"
          }
        ],
        comparability: "partial",
        metricId: RW_METRIC_ID,
        sourceQuality: "mixed",
        sources: [
          {
            title: "Previous source",
            url: "https://example.com/previous-source"
          }
        ],
        valueRecommendation: {
          maxDb: 56,
          minDb: 52
        },
        verdict: "suspicious"
      });
      expect(body.contract.rules.join(" ")).toContain("review.previousReview is the previous structured assistant research answer");
      expect(body.contract.rules.join(" ")).toContain("Address review.userChallengeText directly");

      return new Response(
        JSON.stringify({
          review: {
            answerText: "I rechecked the previous evidence and the value remains suspicious without a direct assembly source.",
            metricId: RW_METRIC_ID,
            rationale: ["The prior comparable assembly remains partial, not direct."],
            recommendedActionText: "Keep the issue open unless a direct tested stack is found.",
            severity: "medium",
            sources: [
              {
                title: "Previous source",
                url: "https://example.com/previous-source"
              }
            ],
            verdict: "suspicious"
          }
        }),
        {
          status: 200
        }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantPlausibilityReview({
      context: reviewContext,
      request: {
        metricId: RW_METRIC_ID,
        previousReview: {
          assistantContextSignature: reviewContext.assistantContextSignature,
          comparableAssemblies: [
            {
              comparisonNote: "Same heavy floor family only.",
              label: "Heavy concrete floating floor reference",
              matchingLayers: ["200 mm concrete slab"],
              metricValues: ["Rw 52-58 dB"],
              sourceTitle: "Previous source",
              sourceUrl: "https://example.com/previous-source",
              weakeningDifferences: ["different floating finish"]
            }
          ],
          comparability: "partial",
          confidence: "medium",
          createdAtIso: "2026-06-04T10:00:00.000Z",
          insufficientSourcesReason: "No exact assembly source.",
          metric: "Rw",
          metricId: RW_METRIC_ID,
          missingEvidence: ["Direct tested layer combination."],
          recommendedActionText: "Consider lowering Rw by 1-2 dB.",
          source: "research_provider",
          sourceQuality: "mixed",
          sources: [
            {
              note: "Prior comparable only.",
              title: "Previous source",
              url: "https://example.com/previous-source"
            }
          ],
          userInstruction: "Rw fazla mı araştır.",
          valueRecommendation: {
            maxDb: 56,
            minDb: 52,
            note: "Conservative prior recommendation."
          },
          valueRange: {
            maxDb: 58,
            minDb: 52
          },
          valueReviewed: "54 dB",
          verdict: "suspicious"
        },
        research: true,
        suggestPatch: true,
        userChallengeText: "bence yanılıyorsun, şu kaynağı dikkate al",
        userInstruction: "Current user message: bence yanılıyorsun, şu kaynağı dikkate al"
      },
      settings: {
        endpoint: "https://research.example.test/review",
        timeoutMs: 1000
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      ok: true,
      review: {
        answerText: "I rechecked the previous evidence and the value remains suspicious without a direct assembly source.",
        metricId: RW_METRIC_ID,
        recommendedActionText: "Keep the issue open unless a direct tested stack is found.",
        verdict: "suspicious"
      },
      source: "research_provider"
    });
  });

  it("retains previous same-context sources when a challenge retry returns invalid provider shapes", async () => {
    const reviewContext = context();
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          answer: {
            summary: "The retry returned prose without verdict, severity, or metricId."
          }
        }),
        {
          status: 200
        }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantPlausibilityReview({
      context: reviewContext,
      request: {
        metricId: RW_METRIC_ID,
        previousReview: {
          assistantContextSignature: reviewContext.assistantContextSignature,
          comparableAssemblies: [
            {
              comparisonNote: "Same heavy floor family only.",
              label: "Previous floating floor source",
              matchingLayers: ["200 mm concrete slab"],
              metricValues: ["Rw 52-58 dB"],
              sourceTitle: "Previous source",
              sourceUrl: "https://example.com/previous-source",
              weakeningDifferences: ["different floating finish"]
            }
          ],
          comparability: "partial",
          confidence: "medium",
          createdAtIso: "2026-06-04T10:00:00.000Z",
          insufficientSourcesReason: "No exact assembly source.",
          metric: "Rw",
          metricId: RW_METRIC_ID,
          missingEvidence: ["Direct tested layer combination."],
          recommendedActionText: "Consider lowering Rw by 1-2 dB.",
          source: "research_provider",
          sourceQuality: "mixed",
          sources: [
            {
              note: "Prior comparable only.",
              title: "Previous source",
              url: "https://example.com/previous-source"
            }
          ],
          userInstruction: "Rw fazla mı araştır.",
          valueRecommendation: {
            maxDb: 56,
            minDb: 52,
            note: "Conservative prior recommendation."
          },
          valueReviewed: "54 dB",
          verdict: "suspicious"
        },
        research: true,
        suggestPatch: true,
        userChallengeText: "bence yanılıyorsun, bir daha araştır",
        userInstruction: "Current user message: bence yanılıyorsun, bir daha araştır"
      },
      settings: {
        endpoint: "https://research.example.test/review",
        timeoutMs: 1000
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      ok: true,
      review: {
        answerText: expect.stringContaining("previous source-backed evidence"),
        confidence: "low",
        metricId: RW_METRIC_ID,
        recommendedActionText: expect.stringContaining("No report patch is recommended"),
        sources: [
          {
            note: "Prior comparable only.",
            title: "Previous source",
            url: "https://example.com/previous-source"
          }
        ],
        verdict: "insufficient_context"
      },
      source: "research_provider"
    });
    if (result.ok) {
      expect(result.review.suggestedReportPatch).toBeUndefined();
      expect(result.warnings.join(" ")).toContain("previous same-context source-backed evidence");
    }
  });

  it("omits previous structured research evidence when the metric or context no longer matches", async () => {
    const reviewContext = context();
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        contract: {
          rules: readonly string[];
        };
        review: {
          previousReview?: unknown;
          userChallengeText?: string;
        };
      };

      expect(body.review.previousReview).toBeUndefined();
      expect(body.review.userChallengeText).toBeUndefined();
      expect(body.contract.rules.join(" ")).not.toContain("review.previousReview is the previous structured assistant research answer");

      return new Response(
        JSON.stringify({
          review: {
            metricId: RW_METRIC_ID,
            rationale: ["Fresh research without stale previous evidence."],
            severity: "low",
            verdict: "plausible"
          }
        }),
        {
          status: 200
        }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    await createReportAssistantPlausibilityReview({
      context: reviewContext,
      request: {
        metricId: RW_METRIC_ID,
        previousReview: {
          assistantContextSignature: "stale-context",
          comparableAssemblies: [],
          createdAtIso: "2026-06-04T10:00:00.000Z",
          metric: "Ln,w",
          metricId: getReportAssistantMetricId("Ln,w"),
          missingEvidence: [],
          sources: [],
          valueReviewed: "62 dB",
          verdict: "suspicious"
        },
        research: true,
        userChallengeText: "bir daha araştır",
        userInstruction: "Current user message: bir daha araştır"
      },
      settings: {
        endpoint: "https://research.example.test/review",
        timeoutMs: 1000
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("accepts Gemini responses wrapped in a plausibility object", () => {
    const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true
      },
      response: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify([
                    {
                      plausibility: {
                        comparisonNotes: "Comparable lined massive walls commonly sit in this range.",
                        metricId: RW_METRIC_ID,
                        recommendedActionText: "Keep the value unless project-specific test evidence says otherwise.",
                        research: {
                          sources: [
                            {
                              comparisonNotes: "Used as a plausibility comparison only.",
                              title: "Lined wall acoustic reference",
                              url: "https://example.com/lined-wall-reference"
                            }
                          ]
                        },
                        severity: "low",
                        valueReviewed: "57 dB",
                        verdict: "plausible"
                      }
                    }
                  ])
                }
              ]
            }
          }
        ]
      }
    });

    expect(review).toMatchObject({
      metricId: RW_METRIC_ID,
      rationale: expect.arrayContaining(["Comparable lined massive walls commonly sit in this range."]),
      recommendedActionText: "Keep the value unless project-specific test evidence says otherwise.",
      sources: [
        {
          note: "Used as a plausibility comparison only.",
          title: "Lined wall acoustic reference",
          url: "https://example.com/lined-wall-reference"
        }
      ],
      verdict: "plausible"
    });
  });

  it("suppresses provider patches for source research responses", () => {
    const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true,
        suggestPatch: true
      },
      response: {
        review: {
          metricId: RW_METRIC_ID,
          rationale: ["Sources suggest this issued value is slightly optimistic."],
          recommendedActionText: "Rw looks slightly high; consider lowering it by about 1-2 dB.",
          severity: "medium",
          sources: [
            {
              title: "Reference",
              url: "https://example.com/reference"
            }
          ],
          suggestedReportPatch: {
            documentSignature: context().documentSignature,
            operations: [
              {
                deltaDb: -2,
                metricId: RW_METRIC_ID,
                reason: "Provider tried to preload a research patch.",
                type: "adjust_metric_db"
              }
            ],
            summary: "Do not expose this from research."
          },
          verdict: "suspicious"
        }
      }
    });

    expect(review).toMatchObject({
      metricId: RW_METRIC_ID,
      recommendedActionText: "Rw looks slightly high; consider lowering it by about 1-2 dB.",
      sources: [
        {
          title: "Reference",
          url: "https://example.com/reference"
        }
      ],
      valueReviewed: "54 dB",
      verdict: "suspicious"
    });
    expect(review?.suggestedReportPatch).toBeUndefined();
  });

  it("downgrades direct/high claims when sources do not include comparable assemblies", () => {
    const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true
      },
      response: {
        review: {
          comparability: "direct",
          confidence: "high",
          metricId: RW_METRIC_ID,
          rationale: ["Provider claimed direct comparability but did not identify a comparable assembly."],
          severity: "low",
          sources: [
            {
              title: "Generic acoustic source",
              url: "https://example.com/generic-acoustic-source"
            }
          ],
          verdict: "plausible"
        }
      }
    });

    expect(review).toMatchObject({
      comparableAssemblies: [],
      comparability: "partial",
      confidence: "medium",
      metricId: RW_METRIC_ID,
      sourceQuality: "mixed"
    });
  });

  it("promotes comparable assembly source URLs into the structured source list", () => {
    const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true
      },
      response: {
        review: {
          comparableAssemblies: [
            {
              comparisonNote: "Same heavy concrete floating floor family.",
              label: "150 mm concrete with floating screed",
              metricValues: ["Rw 58 dB"],
              sourceTitle: "Floating screed acoustic reference",
              sourceUrl: "https://example.com/floating-screed-reference"
            }
          ],
          metricId: RW_METRIC_ID,
          rationale: ["The provider attached evidence only through comparableAssemblies."],
          severity: "low",
          sourceQuality: "strong",
          verdict: "plausible"
        }
      }
    });

    expect(review).toMatchObject({
      sources: [
        {
          note: "Same heavy concrete floating floor family.",
          title: "Floating screed acoustic reference",
          url: "https://example.com/floating-screed-reference"
        }
      ],
      sourceQuality: "strong"
    });
    expect(review?.rationale).toEqual(expect.arrayContaining([
      "Attached sources are retained as plausibility evidence only and are not calculator calibration."
    ]));
  });

  it("normalizes legacy comparability aliases to product-facing buckets", () => {
    expect(
      extractReportAssistantPlausibilityReviewFromResearchResponse({
        context: context(),
        request: {
          metricId: RW_METRIC_ID,
          research: true
        },
        response: {
          review: {
            comparability: "same family",
            comparableAssemblies: [
              {
                label: "Same-family slab",
                metricValues: ["Rw 55 dB"],
                matchingLayers: ["concrete slab"],
                weakeningDifferences: ["different lining"]
              }
            ],
            metricId: RW_METRIC_ID,
            rationale: ["Same-family source comparison."],
            severity: "low",
            sources: [
              {
                title: "Same family source",
                url: "https://example.com/same-family"
              }
            ],
            verdict: "plausible"
          }
        }
      })
    ).toMatchObject({
      comparability: "same_family"
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
            comparability: "insufficient",
            metricId: RW_METRIC_ID,
            rationale: ["No comparable assembly source."],
            severity: "medium",
            sources: [],
            verdict: "insufficient_context"
          }
        }
      })
    ).toMatchObject({
      comparability: "not_comparable",
      sourceQuality: "none"
    });
  });

  it("forces parked metrics to insufficient context and removes provider numeric advice", () => {
    for (const parked of [
      {
        expectedReason: "Use supported impact outputs for this assembly.",
        metricId: IIC_METRIC_ID,
        status: "unsupported" as const
      },
      {
        expectedReason: "Enter finish dynamic stiffness before publishing DeltaLw.",
        metricId: DELTALW_METRIC_ID,
        status: "needs_input" as const
      }
    ]) {
      const { reviewContext } = parkedMetricContext(parked.status);
      const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
        context: reviewContext,
        request: {
          metricId: parked.metricId,
          research: true,
          suggestPatch: true
        },
        response: {
          review: {
            comparability: "direct",
            comparableAssemblies: [
              {
                label: "Provider numeric claim",
                matchingLayers: ["claimed match"],
                metricValues: [`${parked.metricId} 55 dB`],
                weakeningDifferences: []
              }
            ],
            confidence: "high",
            metricId: parked.metricId,
            rationale: ["Provider incorrectly returned a numeric claim for a parked metric."],
            recommendedActionText: "Set this output to 55 dB.",
            severity: "low",
            sources: [
              {
                title: "Provider source",
                url: "https://example.com/provider-source"
              }
            ],
            suggestedReportPatch: {
              documentSignature: reviewContext.documentSignature,
              operations: [
                {
                  displayValue: "55 dB",
                  metricId: parked.metricId,
                  reason: "Provider tried to publish a parked metric.",
                  type: "set_metric_display_value"
                }
              ],
              summary: "Do not expose parked metric patch."
            },
            valueRange: {
              maxDb: 56,
              minDb: 52
            },
            valueRecommendation: {
              targetDb: 55
            },
            verdict: "plausible"
          }
        }
      });

      expect(review).toMatchObject({
        comparableAssemblies: [],
        comparability: "not_comparable",
        confidence: "low",
        insufficientSourcesReason: parked.expectedReason,
        metricId: parked.metricId,
        recommendedActionText: expect.stringContaining("Resolve"),
        severity: "medium",
        sourceQuality: "weak",
        valueRecommendation: {
          note: expect.stringContaining("No numeric recommendation is allowed")
        },
        verdict: "insufficient_context"
      });
      expect(review?.answerText).toContain(parked.status);
      expect(review?.missingEvidence.join(" ")).toContain(parked.expectedReason);
      expect(review?.suggestedReportPatch).toBeUndefined();
      expect(review?.valueRange).toBeUndefined();
      expect(review?.valueRecommendation?.targetDb).toBeUndefined();
    }
  });

  it("formats parked metric missing inputs without leaking route ids", () => {
    const { metricId, reviewContext } = parkedMetricContext("needs_input");
    const contextWithRawMissingInputs = {
      ...reviewContext,
      assistantOutputFacts: reviewContext.assistantOutputFacts.map((fact) =>
        fact.metricId === metricId
          ? (({ parkedReason: _parkedReason, ...factWithoutParkedReason }) => ({
              ...factWithoutParkedReason,
              missingInputs: ["loadBasisKgM2", "impactFieldContext.ci50_2500Db"]
            }))(fact)
          : fact
      )
    };

    const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: contextWithRawMissingInputs,
      request: {
        metricId,
        research: true,
        suggestPatch: true
      },
      response: {
        review: {
          comparability: "direct",
          metricId,
          rationale: ["Provider incorrectly returned a numeric claim for a parked metric."],
          severity: "low",
          sources: [],
          valueRecommendation: {
            targetDb: 55
          },
          verdict: "plausible"
        }
      }
    });

    expect(review?.answerText).toContain("Missing inputs: load basis, CI,50-2500.");
    expect(review?.answerText).not.toContain("loadBasisKgM2");
    expect(review?.answerText).not.toContain("impactFieldContext");
    expect(review?.insufficientSourcesReason).toBe("Missing inputs: load basis, CI,50-2500.");
    expect(review?.valueRecommendation?.targetDb).toBeUndefined();
  });

  it("accepts selected metric aliases from providers but rejects another metric", () => {
    const aliasReview = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true
      },
      response: {
        review: {
          metricId: "Rw",
          rationale: ["The provider used the visible metric label instead of the internal id."],
          severity: "low",
          sources: [],
          verdict: "plausible"
        }
      }
    });

    expect(aliasReview).toMatchObject({
      metricId: RW_METRIC_ID,
      valueReviewed: "54 dB",
      verdict: "plausible"
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
            metricId: "DnT,w",
            rationale: ["This is not the selected metric."],
            severity: "low",
            sources: [],
            verdict: "plausible"
          }
        }
      })
    ).toBeNull();
  });

  it("parses Gemini array-wrapped reviews with explanation and nested research sources", () => {
    const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true,
        suggestPatch: false
      },
      response: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify([
                    {
                      review: {
                        explanation: "The provider returned explanation instead of rationale.",
                        metricId: "Rw",
                        recommendedActionText: "Rw looks conservative; consider checking whether this is Rw+Ctr.",
                        research: {
                          sources: [
                            {
                              comparisonNote: "Comparable heavyweight slab reference.",
                              title: "Concrete slab acoustic reference",
                              url: "https://example.com/concrete-slab-reference"
                            }
                          ]
                        },
                        severity: "low",
                        verdict: "suspicious"
                      }
                    }
                  ])
                }
              ]
            }
          }
        ]
      }
    });

    expect(review).toMatchObject({
      metricId: RW_METRIC_ID,
      recommendedActionText: "Rw looks conservative; consider checking whether this is Rw+Ctr.",
      sources: [
        {
          note: "Comparable heavyweight slab reference.",
          title: "Concrete slab acoustic reference",
          url: "https://example.com/concrete-slab-reference"
        }
      ],
      verdict: "suspicious"
    });
    expect(review?.rationale).toEqual(expect.arrayContaining([
      "Review mode: source-bounded provider response.",
      "The provider returned explanation instead of rationale.",
      "Attached sources are retained as plausibility evidence only and are not calculator calibration."
    ]));
    expect(review?.rationale.join(" ")).toContain("Engine route:");
    expect(review?.suggestedReportPatch).toBeUndefined();
  });

  it("parses natural-language research responses with reasoning and enum aliases", () => {
    const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true,
        suggestPatch: false
      },
      response: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    assessment: "needs_review",
                    metricId: RW_METRIC_ID,
                    reasoning: "A 200 mm concrete slab usually benchmarks higher than the current report value.",
                    recommendedActionText: "Check whether this is Rw, R'w, or Rw+Ctr before changing the report.",
                    sources: [
                      {
                        comparisonNote: "Uses a link field instead of url.",
                        link: "https://example.com/slab-rw-reference",
                        title: "Slab Rw reference"
                      }
                    ]
                  })
                }
              ]
            },
            groundingMetadata: {
              groundingChunks: [
                {
                  web: {
                    title: "Grounded chunk",
                    uri: "https://example.com/grounded-chunk"
                  }
                }
              ]
            }
          }
        ]
      }
    });

    expect(review).toMatchObject({
      metricId: RW_METRIC_ID,
      severity: "medium",
      sources: [
        {
          note: "Uses a link field instead of url.",
          title: "Slab Rw reference",
          url: "https://example.com/slab-rw-reference"
        },
        {
          note: "Grounded source returned by Gemini Google Search.",
          title: "Grounded chunk",
          url: "https://example.com/grounded-chunk"
        }
      ],
      verdict: "suspicious"
    });
    expect(review?.rationale).toEqual(expect.arrayContaining([
      "Review mode: source-bounded provider response.",
      "A 200 mm concrete slab usually benchmarks higher than the current report value.",
      "Attached sources are retained as plausibility evidence only and are not calculator calibration."
    ]));
    expect(review?.rationale.join(" ")).toContain("Engine route:");
  });

  it("retries transient source research provider failures before using the recovered response", async () => {
    const fetchMock = vi.fn(async () => {
      if (fetchMock.mock.calls.length === 1) {
        return new Response("temporary service unavailable", { status: 503 });
      }

      return new Response(
        JSON.stringify({
          review: {
            answerText: "Recovered source research after a transient provider failure.",
            metricId: RW_METRIC_ID,
            rationale: ["The second provider attempt returned a valid source-bounded review."],
            severity: "low",
            sources: [
              {
                title: "Recovered acoustic source",
                url: "https://example.com/recovered-acoustic-source"
              }
            ],
            verdict: "plausible"
          }
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
        research: true
      },
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        timeoutMs: 1000
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      ok: true,
      review: {
        answerText: "Recovered source research after a transient provider failure.",
        metricId: RW_METRIC_ID,
        sources: [
          {
            title: "Recovered acoustic source",
            url: "https://example.com/recovered-acoustic-source"
          }
        ],
        verdict: "plausible"
      },
      source: "research_provider"
    });
  });

  it("falls back to context-only review when the configured provider keeps failing", async () => {
    const fetchMock = vi.fn(async () => new Response("service unavailable", { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);

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

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      ok: true,
      source: "context"
    });
    expect(result.warnings.join(" ")).toContain("Source research provider unavailable");
  });

  it("does not retry non-transient source research provider failures", async () => {
    const fetchMock = vi.fn(async () => new Response("bad request", { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);

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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      ok: true,
      source: "context"
    });
    expect(result.warnings.join(" ")).toContain("HTTP 400");
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
      provider: "custom_research_provider",
      timeoutMs: 45000
    });
    expect(
      getReportAssistantPlausibilityResearchSettings({
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "http://system_llm:4000/gemini-proxy",
        DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER: "system_llm_gemini_proxy",
        DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY: "proxy-secret",
        DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS: "12000"
      })
    ).toMatchObject({
      endpoint: "http://system_llm:4000/gemini-proxy",
      model: "gemini-3-flash-preview",
      provider: "system_llm_gemini_grounded_research",
      proxyKey: "proxy-secret",
      timeoutMs: 12000
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

  it("builds system_llm Gemini grounded research requests", () => {
    const request = buildSystemLlmGeminiGroundedResearchRequest({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true,
        suggestPatch: false,
        userInstruction: "Research whether Rw is plausible."
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
      review: {
        suggestPatch?: boolean;
      };
      task: string;
    };

    expect(payload).toMatchObject({
      review: {
        suggestPatch: false
      },
      task: "dynecho.report_assistant.plausibility_research"
    });
    expect(payload.contract.rules.join(" ")).toContain("Do not return suggestedReportPatch");
    expect(payload.contract.rules.join(" ")).toContain(`Set metricId exactly to "${RW_METRIC_ID}"`);
    expect(payload.contract.rules.join(" ")).toContain("Use only these verdict values");

    const retryRequest = buildSystemLlmGeminiGroundedResearchRequest({
      context: context(),
      request: {
        metricId: RW_METRIC_ID,
        research: true,
        suggestPatch: false,
        userInstruction: "Research whether Rw is plausible."
      },
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        model: "gemini-3-flash-preview",
        provider: "system_llm_gemini_grounded_research",
        timeoutMs: 12000
      },
      strictJsonRetry: true
    });

    expect(retryRequest.body.generationConfig.temperature).toBe(0);
    expect(JSON.stringify(retryRequest.body)).toContain("Retry contract");
  });
});
