import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
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
  } as
    | {
        configured: false;
        missingKeys: string[];
        session: {
          expiresAt: number;
          username: string;
        };
      }
    | {
        configured: true;
        session: {
          expiresAt: number;
          username: string;
        } | null;
      }
}));

vi.mock("@/lib/auth", () => ({
  getAuthState: vi.fn(async () => mockAuthState.value)
}));

const RW_METRIC_ID = getReportAssistantMetricId("Rw");
let originalModelEndpoint: string | undefined;

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
    reportId: "patch-route-test"
  });
}

function jsonRequest(payload: unknown) {
  return new Request("http://localhost/api/report-assistant/patch", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

beforeEach(() => {
  originalModelEndpoint = process.env.DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT;
  delete process.env.DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT;
  mockAuthState.value = {
    configured: false,
    missingKeys: [],
    session: {
      expiresAt: Number.MAX_SAFE_INTEGER,
      username: "Preview mode"
    }
  };
});

afterEach(() => {
  if (originalModelEndpoint === undefined) {
    delete process.env.DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT;
  } else {
    process.env.DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT = originalModelEndpoint;
  }
});

describe("report assistant patch route result envelopes", () => {
  it("returns typed failure envelopes for auth and invalid-payload boundaries", async () => {
    const { POST } = await import("../../app/api/report-assistant/patch/route");
    mockAuthState.value = {
      configured: true,
      session: null
    };

    const authResponse = await POST(
      jsonRequest({
        context: context(),
        document: DOCUMENT,
        instruction: "make Rw 2 dB lower"
      })
    );
    const authPayload = (await authResponse.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
    };

    expect(authResponse.status).toBe(401);
    expect(authPayload.assistantResults?.[0]).toMatchObject({
      authority: "error",
      capabilityName: "report_assistant_patch_route",
      routeStatus: "auth_failed",
      tasks: [
        {
          code: "assistant_auth_required",
          severity: "error"
        }
      ]
    });

    mockAuthState.value = {
      configured: false,
      missingKeys: [],
      session: {
        expiresAt: Number.MAX_SAFE_INTEGER,
        username: "Preview mode"
      }
    };

    const invalidResponse = await POST(jsonRequest(null));
    const invalidPayload = (await invalidResponse.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
    };

    expect(invalidResponse.status).toBe(400);
    expect(invalidPayload.assistantResults?.[0]).toMatchObject({
      authority: "needs_input",
      capabilityName: "report_assistant_patch_route",
      routeStatus: "needs_input",
      tasks: [
        {
          code: "invalid_patch_payload",
          severity: "warning"
        }
      ]
    });
  }, 15000);

  it("returns a preview-only patch proposal envelope without applying the report edit", async () => {
    const { POST } = await import("../../app/api/report-assistant/patch/route");
    const response = await POST(
      jsonRequest({
        context: context(),
        document: DOCUMENT,
        instruction: "make Rw 2 dB lower"
      })
    );
    const payload = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
      validation: {
        status: string;
      };
    };

    expect(response.status).toBe(200);
    expect(payload.validation.status).toBe("valid");
    expect(payload.assistantResults).toHaveLength(1);
    expect(payload.assistantResults?.[0]).toMatchObject({
      authority: "draft_only",
      capabilityName: "report_assistant_patch_route",
      mutates: false,
      previewOnly: true,
      rendererKind: "patch_proposal_card",
      requiresConfirmation: true,
      resultKind: "patch_proposal",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "deterministic",
          label: "report_assistant_patch_route"
        }
      ],
      stalePolicy: "assistant_context_and_document_signature"
    });
    expect(payload.assistantResults?.[0]?.evidence).toEqual(expect.arrayContaining([
      {
        detail: "deterministic",
        label: "Patch source"
      },
      {
        detail: "valid",
        label: "Patch validation status"
      },
      {
        detail: RW_METRIC_ID,
        label: "Metric ids"
      }
    ]));
    expect(DOCUMENT.primaryMetricValue).toBe("61 dB");
  }, 15000);

  it("returns a validation-failed envelope for rejected patch proposals", async () => {
    const { POST } = await import("../../app/api/report-assistant/patch/route");
    const response = await POST(
      jsonRequest({
        context: context(),
        document: DOCUMENT,
        instruction: "make Rw 20 dB lower"
      })
    );
    const payload = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
      validation: {
        status: string;
      };
    };

    expect(response.status).toBe(400);
    expect(payload.validation.status).toBe("rejected");
    expect(payload.assistantResults?.[0]).toMatchObject({
      authority: "draft_only",
      capabilityName: "report_assistant_patch_route",
      routeStatus: "validation_failed",
      tasks: [
        {
          code: "patch_validation_failed",
          severity: "error"
        }
      ]
    });
    expect(payload.assistantResults?.[0]?.evidence).toEqual(expect.arrayContaining([
      {
        detail: "rejected",
        label: "Patch validation status"
      }
    ]));
  }, 15000);

  it("returns an error envelope when no patch proposal can be generated", async () => {
    const { POST } = await import("../../app/api/report-assistant/patch/route");
    const response = await POST(
      jsonRequest({
        context: context(),
        document: DOCUMENT,
        instruction: "save the file"
      })
    );
    const payload = (await response.json()) as {
      assistantResults?: ReportAssistantResultEnvelope[];
      ok: boolean;
    };

    expect(response.status).toBe(400);
    expect(payload.assistantResults?.[0]).toMatchObject({
      authority: "error",
      capabilityName: "report_assistant_patch_route",
      routeStatus: "error",
      tasks: [
        {
          code: "patch_generation_failed",
          severity: "error"
        }
      ]
    });
  }, 15000);
});
