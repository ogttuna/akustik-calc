import { describe, expect, it, vi } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import {
  parseReportAssistantPlausibilityRequest,
  reviewReportAssistantMetricPlausibility
} from "./report-assistant-plausibility";
import { validateReportAssistantPatch } from "./report-assistant-patch";
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
const IIC_METRIC_ID = getReportAssistantMetricId("IIC");

function metadata(outputId: "IIC" | "Rw") {
  return {
    engineDisplayValue: outputId === "Rw" ? "61 dB" : "Not ready",
    metricBasis: getReportAssistantMetricBasis(outputId),
    metricDirection: getReportAssistantMetricDirection(outputId),
    outputId,
    reportMetricId: getReportAssistantMetricId(outputId)
  };
}

const DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "Rw 49 dB is packaged after manual report manipulation.",
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
      value: "49 dB",
      ...metadata("Rw")
    },
    {
      detail: "ASTM impact alias remains unsupported.",
      label: "IIC",
      postureDetail: "Unsupported metric.",
      postureLabel: "Unsupported metric",
      postureTone: "neutral",
      status: "unsupported",
      value: "Not ready",
      ...metadata("IIC")
    }
  ],
  decisionTrailHeadline: "Scoped estimate is active.",
  decisionTrailItems: [],
  dynamicBranchDetail: "Published family estimate is active.",
  dynamicBranchLabel: "Heavy floating floor",
  executiveSummary: "Riverside Residences currently reads Rw 49 dB.",
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
      value: "49 dB",
      ...metadata("Rw")
    }
  ],
  preparedBy: "O. Tuna",
  primaryMetricLabel: "Rw",
  primaryMetricValue: "49 dB",
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

function context(document: SimpleWorkbenchProposalDocument = DOCUMENT) {
  return {
    ...buildReportAssistantContext({
      baseDocument: {
        ...DOCUMENT,
        coverageItems: DOCUMENT.coverageItems.map((item) => item.label === "Rw" ? { ...item, value: "61 dB" } : item),
        metrics: DOCUMENT.metrics.map((metric) => ({ ...metric, value: "61 dB" })),
        primaryMetricValue: "61 dB"
      },
      createdAtIso: "2026-06-02T09:00:00.000Z",
      document,
      reportId: "plausibility-test"
    }),
    assistantTraceSnapshot: {
      airborne: {
        confidenceClass: "medium",
        detectedFamilyLabel: "Heavy floor",
        selectedLabel: "Scoped estimate Rw lane",
        selectedMethod: "source_absent_predictor",
        solverSpreadRwDb: 4
      },
      airborneCandidateResolution: {
        selectedCandidateId: "candidate.rw.test",
        selectedOrigin: "source_absent_predictor"
      },
      layerCombinationResolver: {
        basis: "predictor_gate",
        candidateKind: "source_absent_family_estimate",
        route: "floor",
        selectedCandidateId: "candidate.rw.test",
        supportedMetrics: ["Rw"],
        surfaceDetail: "Resolver selected the scoped source-absent floor estimate lane.",
        surfaceLabel: "Scoped Rw estimate",
        valuePins: [{ metric: "Rw", value: 61 }]
      }
    },
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

function documentWithRwReportValue(value: string): SimpleWorkbenchProposalDocument {
  return {
    ...DOCUMENT,
    assemblyHeadline: `Rw ${value} is packaged after manual report manipulation.`,
    coverageItems: DOCUMENT.coverageItems.map((item) => (item.label === "Rw" ? { ...item, value } : item)),
    executiveSummary: `Riverside Residences currently reads Rw ${value}.`,
    metrics: DOCUMENT.metrics.map((metric) => ({ ...metric, value })),
    primaryMetricValue: value
  };
}

function jsonRequest(payload: unknown) {
  return new Request("http://localhost/api/report-assistant/plausibility", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

describe("report assistant plausibility review", () => {
  it("flags severe report-engine drift without auto-loading an over-limit patch", () => {
    const currentContext = context();
    const result = reviewReportAssistantMetricPlausibility({
      context: currentContext,
      request: {
        metricId: RW_METRIC_ID,
        userInstruction: "Rw looks too low after report manipulation."
      }
    });

    expect(result).toMatchObject({
      ok: true,
      review: {
        engineDisplayValue: "61 dB",
        metricId: RW_METRIC_ID,
        severity: "high",
        valueReviewed: "49 dB",
        verdict: "likely_wrong"
      }
    });
    if (result.ok) {
      expect(result.review.answerText).toContain("report 49 dB against engine 61 dB");
      expect(result.review.answerText).toContain("Engine trace:");
      expect(result.review.answerText).toContain("Scoped estimate Rw lane");
      expect(result.review.rationale.join(" ")).toContain("differs from captured engine value");
      expect(result.review.rationale.join(" ")).toContain("Layer resolver:");
      expect(result.review.rationale.join(" ")).toContain("above the assistant patch limit");
      expect(result.review.suggestedReportPatch).toBeUndefined();
    }
  });

  it("returns a validator-compatible suggested patch for bounded drift", () => {
    const boundedDocument = documentWithRwReportValue("54 dB");
    const currentContext = context(boundedDocument);
    const result = reviewReportAssistantMetricPlausibility({
      context: currentContext,
      request: {
        metricId: RW_METRIC_ID,
        userInstruction: "Rw looks too low after report manipulation."
      }
    });

    expect(result).toMatchObject({
      ok: true,
      review: {
        engineDisplayValue: "61 dB",
        metricId: RW_METRIC_ID,
        severity: "medium",
        valueReviewed: "54 dB",
        verdict: "suspicious"
      }
    });
    if (result.ok) {
      expect(
        validateReportAssistantPatch({
          context: currentContext,
          document: boundedDocument,
          patch: result.review.suggestedReportPatch
        }).status
      ).toBe("requires_confirmation");
    }
  });

  it("does not create numeric claims for unsupported outputs", () => {
    const result = reviewReportAssistantMetricPlausibility({
      context: context(),
      request: {
        metricId: IIC_METRIC_ID
      }
    });

    expect(result).toMatchObject({
      ok: true,
      review: {
        metricId: IIC_METRIC_ID,
        severity: "medium",
        verdict: "insufficient_context"
      }
    });
    if (result.ok) {
      expect(result.review.suggestedReportPatch).toBeUndefined();
    }
  });

  it("preserves user-supplied source metadata as evidence only", () => {
    const parsed = parseReportAssistantPlausibilityRequest({
      metricId: RW_METRIC_ID,
      sources: [
        {
          accessedAtIso: "2026-06-02T09:20:00.000Z",
          title: "Example acoustic sheet",
          url: "https://example.com/acoustic-sheet"
        },
        {
          title: "",
          url: "file:///unsafe"
        }
      ]
    });

    expect(parsed?.sources).toEqual([
      {
        accessedAtIso: "2026-06-02T09:20:00.000Z",
        title: "Example acoustic sheet",
        url: "https://example.com/acoustic-sheet"
      }
    ]);
  });

  it("returns route reviews without mutating report or calculator state", async () => {
    const { POST } = await import("../../app/api/report-assistant/plausibility/route");
    const boundedDocument = documentWithRwReportValue("54 dB");
    const currentContext = context(boundedDocument);
    const response = await POST(
      jsonRequest({
        context: currentContext,
        document: boundedDocument,
        review: {
          metricId: RW_METRIC_ID,
          suggestPatch: true,
          userInstruction: "Check this report value."
        }
      })
    );
    const payload = (await response.json()) as {
      ok: boolean;
      patchValidation?: {
        status: string;
      };
      review: {
        metricId: string;
        suggestedReportPatch?: unknown;
        verdict: string;
      };
    };

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      patchValidation: {
        status: "requires_confirmation"
      },
      review: {
        metricId: RW_METRIC_ID,
        verdict: "suspicious"
      }
    });
    expect(boundedDocument.primaryMetricValue).toBe("54 dB");
  }, 15000);
});
