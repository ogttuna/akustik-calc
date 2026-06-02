import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import {
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
      timeoutMs: 30000
    });

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
});
