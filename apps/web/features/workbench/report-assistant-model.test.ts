import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import {
  buildSystemLlmGeminiProxyRequest,
  createReportAssistantPatchProposal,
  extractReportAssistantPatchFromModelResponse,
  getReportAssistantModelSettings
} from "./report-assistant-model";
import { validateReportAssistantPatch } from "./report-assistant-patch";
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
  assemblyHeadline: "Rw 61 dB is packaged.",
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
      value: "61 dB",
      ...metadata()
    }
  ],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
  issuedOnIso: "2026-03-21T09:30:00.000Z",
  issuedOnLabel: "21 March 2026",
  issueBaseReference: "MAC-RR-20260321",
  issueCodePrefix: "MAC",
  issueNextReference: "MAC-RR-20260321-03",
  issueRegisterItems: [],
  layers: [],
  methodDossierCards: [],
  methodDossierHeadline: "Solver rationale packaged.",
  methodTraceGroups: [],
  metrics: [
    {
      detail: "Weighted airborne element rating.",
      label: "Rw",
      value: "61 dB",
      ...metadata()
    }
  ],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "61 dB",
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
  return buildReportAssistantContext({
    createdAtIso: "2026-06-02T09:00:00.000Z",
    document: DOCUMENT,
    reportId: "model-test"
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("report assistant model patch provider", () => {
  it("keeps the deterministic parser as the default when no endpoint is configured", async () => {
    const result = await createReportAssistantPatchProposal({
      context: context(),
      instruction: "make Rw 2 dB lower",
      settings: null
    });

    expect(result).toMatchObject({
      ok: true,
      patch: {
        operations: [
          {
            deltaDb: -2,
            metricId: RW_METRIC_ID,
            type: "adjust_metric_db"
          }
        ]
      },
      source: "deterministic"
    });
  });

  it("parses model/proxy patch responses and still relies on the shared validator", async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as {
        context: {
          metrics: readonly { id: string }[];
        };
        task: string;
      };

      expect(body.task).toBe("dynecho.report_assistant.patch_proposal");
      expect(body.context.metrics).toEqual([
        expect.objectContaining({
          id: RW_METRIC_ID
        })
      ]);

      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      documentSignature: context().documentSignature,
                      operations: [
                        {
                          deltaDb: -4,
                          metricId: RW_METRIC_ID,
                          reason: "Model proposed a conservative issued-report value.",
                          type: "adjust_metric_db"
                        }
                      ],
                      summary: "Lower Rw by 4 dB."
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

    const currentContext = context();
    const result = await createReportAssistantPatchProposal({
      context: currentContext,
      instruction: "make Rw a bit more conservative",
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        provider: "custom_patch_provider",
        timeoutMs: 1000
      }
    });

    expect(result).toMatchObject({
      ok: true,
      source: "model"
    });
    if (result.ok) {
      expect(
        validateReportAssistantPatch({
          context: currentContext,
          document: DOCUMENT,
          patch: result.patch
        })
      ).toMatchObject({
        status: "valid"
      });
    }
  });

  it("falls back to deterministic parsing when the configured provider is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("service unavailable", { status: 503 })));

    const result = await createReportAssistantPatchProposal({
      context: context(),
      instruction: "make Rw 3 dB lower",
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        provider: "custom_patch_provider",
        timeoutMs: 1000
      }
    });

    expect(result).toMatchObject({
      ok: true,
      patch: {
        operations: [
          {
            deltaDb: -3,
            metricId: RW_METRIC_ID
          }
        ]
      },
      source: "deterministic"
    });
    expect(result.warnings.join(" ")).toContain("Model patch provider unavailable");
  });

  it("normalizes endpoint settings and extracts patch JSON from text wrappers", () => {
    expect(getReportAssistantModelSettings({})).toBeNull();
    expect(
      getReportAssistantModelSettings({
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "file:///unsafe"
      })
    ).toBeNull();
    expect(
      getReportAssistantModelSettings({
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "http://system_llm:4000/gemini-proxy",
        DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS: "900000"
      })
    ).toMatchObject({
      endpoint: "http://system_llm:4000/gemini-proxy",
      provider: "custom_patch_provider",
      timeoutMs: 30000
    });
    expect(
      getReportAssistantModelSettings({
        DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT: "http://system_llm:4000/gemini-proxy",
        DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER: "unknown_provider"
      })
    ).toBeNull();

    expect(
      extractReportAssistantPatchFromModelResponse({
        choices: [
          {
            message: {
              content: "```json\n{\"summary\":\"ok\",\"operations\":[]}\n```"
            }
          }
        ]
      })
    ).toEqual({
      operations: [],
      summary: "ok"
    });
  });

  it("builds system_llm Gemini proxy generateContent requests without document rewrites", () => {
    const currentContext = context();
    const request = buildSystemLlmGeminiProxyRequest({
      context: currentContext,
      instruction: "make Rw 2 dB lower",
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy?token=do-not-forward",
        model: "gemini-3-flash-preview",
        provider: "system_llm_gemini_proxy",
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
    expect(JSON.stringify(request.body)).not.toContain("do-not-forward");
    expect(request.body).toMatchObject({
      generationConfig: {
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        temperature: 0
      },
      systemInstruction: {
        parts: [
          {
            text: expect.stringContaining("Return only one ReportAssistantPatch JSON object.")
          }
        ]
      }
    });

    const userText = request.body.contents[0]?.parts[0]?.text ?? "";
    const payload = JSON.parse(userText) as {
      context: {
        documentSignature: string;
        metrics: readonly {
          id: string;
          reportDisplayValue: string;
        }[];
      };
      contract: {
        output: string;
        schema: {
          operations: readonly unknown[];
        };
      };
      instruction: string;
      task: string;
    };

    expect(payload).toMatchObject({
      contract: {
        output: "ReportAssistantPatch JSON only"
      },
      context: {
        documentSignature: currentContext.documentSignature,
        metrics: [
          expect.objectContaining({
            id: RW_METRIC_ID,
            reportDisplayValue: "61 dB"
          })
        ]
      },
      instruction: "make Rw 2 dB lower",
      task: "dynecho.report_assistant.patch_proposal"
    });
    expect(payload.contract.schema.operations).toEqual([
      expect.objectContaining({
        deltaDb: -2,
        metricId: "output:Rw",
        type: "adjust_metric_db"
      }),
      expect.objectContaining({
        displayValue: "55 dB",
        type: "set_metric_display_value"
      }),
      expect.objectContaining({
        section: "assumptions",
        type: "append_report_note"
      })
    ]);
    expect(JSON.stringify(payload)).not.toContain("executiveSummary");
  });

  it("includes read-only project workspace and report adjustment summaries in model context", () => {
    const longAssistantDraftSummary = `Client-facing summary ${"must stay summarized ".repeat(180)}`;
    const currentContext = buildReportAssistantContext({
      activeDraftState: {
        assemblyId: "assembly-1",
        assemblyName: "Lobby slab",
        assemblyVersion: 3,
        dirty: true,
        kind: "project_report_draft",
        projectId: "project-1",
        projectName: "Hotel acoustic package",
        reportId: "report-1",
        reportUpdatedAtIso: "2026-06-15T10:00:00.000Z"
      },
      baseDocument: DOCUMENT,
      createdAtIso: "2026-06-15T10:00:00.000Z",
      document: {
        ...DOCUMENT,
        coverageItems: DOCUMENT.coverageItems.map((item) => ({ ...item, value: "59 dB" })),
        executiveSummary: longAssistantDraftSummary,
        metrics: DOCUMENT.metrics.map((metric) => ({ ...metric, value: "59 dB" })),
        primaryMetricValue: "59 dB",
        reportAdjustments: [
          {
            afterValue: "59 dB",
            appliedAtIso: "2026-06-15T09:59:00.000Z",
            beforeValue: "61 dB",
            engineValuePreserved: true,
            id: "adjustment-1",
            label: "Rw",
            metricId: RW_METRIC_ID,
            reason: "Assistant-adjusted project report revision.",
            scope: "saved_snapshot",
            source: "assistant"
          }
        ]
      },
      projectWorkspace: {
        availableReadTools: [],
        currentRevision: {
          assistantPatchSummary: {
            operationCount: 1,
            validationStatus: "valid"
          },
          changeSummary: "Assistant-adjusted report editor draft.",
          createdAtIso: "2026-06-15T09:59:00.000Z",
          displayCode: "REV-0002",
          id: "revision-2",
          source: "assistant"
        },
        project: {
          id: "project-1",
          name: "Hotel acoustic package"
        },
        linkedAssembly: {
          calculationPrimaryOutput: "Rw",
          calculationPrimaryValueLabel: "58 dB",
          calculationStatus: "ready",
          displayCode: "ASM-0001",
          id: "assembly-1",
          kind: "floor",
          name: "Lobby slab",
          updatedAtIso: "2026-06-15T09:45:00.000Z",
          version: 3
        },
        report: {
          currentRevisionId: "revision-2",
          displayCode: "RPT-0001",
          id: "report-1",
          name: "Lobby slab report",
          revisionCount: 2,
          status: "draft"
        },
        revisionSummaries: [],
        scope: "project_report"
      },
      reportId: "model-test"
    });
    const request = buildSystemLlmGeminiProxyRequest({
      context: currentContext,
      instruction: "Rw değerini kontrol et",
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        model: "gemini-3-flash-preview",
        provider: "system_llm_gemini_proxy",
        timeoutMs: 12000
      }
    });
    const userText = request.body.contents[0]?.parts[0]?.text ?? "";
    const payload = JSON.parse(userText) as {
      context: {
        projectWorkspace?: {
          availableReadTools: readonly { mutates: boolean; name: string }[];
          activeDraftState?: { dirty: boolean; kind: string; reportId?: string };
          currentRevision?: { displayCode?: string; source?: string };
          linkedAssembly?: { displayCode?: string; name: string; version: number };
          project?: { name: string };
          report?: { displayCode?: string; revisionCount?: number };
          scope: string;
        };
        documentComparisonSummaries: readonly {
          kind: string;
          metricDisplayValueChanges: readonly { afterValue?: string; beforeValue?: string; metricId: string }[];
          textFieldSummaries: readonly { afterLength: number; beforeLength: number; field: string }[];
        }[];
        presetLibrarySummary?: {
          commonPresetCount: number;
          commonPresets: readonly {
            kind: string;
            name: string;
            presetRoute: string;
          }[];
        };
        reportAdjustments: readonly { afterValue: string; beforeValue: string; metricId: string; source: string }[];
      };
    };

    expect(payload.context.projectWorkspace).toMatchObject({
      activeDraftState: {
        dirty: true,
        kind: "project_report_draft",
        reportId: "report-1"
      },
      currentRevision: {
        displayCode: "REV-0002",
        source: "assistant"
      },
      linkedAssembly: {
        displayCode: "ASM-0001",
        name: "Lobby slab",
        version: 3
      },
      project: {
        name: "Hotel acoustic package"
      },
      report: {
        displayCode: "RPT-0001",
        revisionCount: 2
      },
      scope: "project_report"
    });
    expect(payload.context.projectWorkspace?.availableReadTools.every((tool) => tool.mutates === false)).toBe(true);
    expect(payload.context.projectWorkspace?.availableReadTools.map((tool) => tool.name)).toContain("read_project_report_revision");
    expect(payload.context.documentComparisonSummaries).toEqual([
      expect.objectContaining({
        kind: "current_draft_vs_generated_baseline",
        metricDisplayValueChanges: expect.arrayContaining([
          expect.objectContaining({
            afterValue: "59 dB",
            beforeValue: "61 dB",
            metricId: RW_METRIC_ID
          })
        ]),
        textFieldSummaries: expect.arrayContaining([
          expect.objectContaining({
            afterLength: longAssistantDraftSummary.length,
            field: "executiveSummary"
          })
        ])
      })
    ]);
    expect(payload.context.presetLibrarySummary).toMatchObject({
      commonPresetCount: expect.any(Number),
      commonPresets: expect.arrayContaining([
        expect.objectContaining({
          kind: "common",
          presetRoute: "wall"
        })
      ])
    });
    expect(payload.context.reportAdjustments).toEqual([
      expect.objectContaining({
        afterValue: "59 dB",
        beforeValue: "61 dB",
        metricId: RW_METRIC_ID,
        source: "assistant"
      })
    ]);
    expect(userText).not.toContain("Manual issue snapshot.");
    expect(userText).not.toContain(DOCUMENT.executiveSummary);
    expect(userText).not.toContain(longAssistantDraftSummary);
    expect(userText).not.toContain("sourceUrl");
  });

  it("calls system_llm Gemini proxy and parses candidate patch text", async () => {
    const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      expect(String(url)).toBe("http://system_llm:4000/gemini-proxy/v1beta/models/gemini-3-flash-preview:generateContent");
      expect(init?.headers).toMatchObject({
        Authorization: "Bearer proxy-secret",
        "x-goog-api-key": "proxy-secret"
      });

      const body = JSON.parse(String(init?.body)) as {
        contents: readonly {
          parts: readonly { text: string }[];
        }[];
        generationConfig: {
          responseMimeType: string;
        };
        systemInstruction: {
          parts: readonly { text: string }[];
        };
      };
      expect(body.generationConfig.responseMimeType).toBe("application/json");
      expect(body.systemInstruction.parts[0]?.text).toContain("Do not apply");
      expect(JSON.parse(body.contents[0]?.parts[0]?.text ?? "{}")).toMatchObject({
        task: "dynecho.report_assistant.patch_proposal"
      });

      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      documentSignature: context().documentSignature,
                      operations: [
                        {
                          deltaDb: -2,
                          metricId: RW_METRIC_ID,
                          reason: "Model proposed a conservative issued-report value.",
                          type: "adjust_metric_db"
                        }
                      ],
                      summary: "Lower Rw by 2 dB."
                    })
                  }
                ]
              }
            }
          ]
        })
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createReportAssistantPatchProposal({
      context: context(),
      instruction: "make Rw 2 dB lower",
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        model: "gemini-3-flash-preview",
        provider: "system_llm_gemini_proxy",
        proxyKey: "proxy-secret",
        timeoutMs: 1000
      }
    });

    expect(result).toMatchObject({
      ok: true,
      patch: {
        operations: [
          {
            deltaDb: -2,
            metricId: RW_METRIC_ID
          }
        ]
      },
      source: "model"
    });
  });
});
