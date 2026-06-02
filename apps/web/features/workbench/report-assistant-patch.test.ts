import { describe, expect, it } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import {
  applyValidatedReportAssistantPatch,
  findReportValueMentions,
  validateReportAssistantPatch
} from "./report-assistant-patch";
import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";

const RW_METRIC_ID = getReportAssistantMetricId("Rw");
const LNW_METRIC_ID = getReportAssistantMetricId("Ln,w");
const LNW_PLUS_CI_METRIC_ID = getReportAssistantMetricId("Ln,w+CI");
const CI_METRIC_ID = getReportAssistantMetricId("CI");
const IIC_METRIC_ID = getReportAssistantMetricId("IIC");

function metricMetadata(outputId: "CI" | "IIC" | "Ln,w" | "Ln,w+CI" | "Rw") {
  return {
    engineDisplayValue:
      outputId === "Rw"
        ? "61 dB"
        : outputId === "Ln,w"
          ? "49 dB"
          : outputId === "Ln,w+CI"
            ? "<= 50 dB"
            : outputId === "CI"
              ? "+1 dB"
              : "Not ready",
    metricBasis: getReportAssistantMetricBasis(outputId),
    metricDirection: getReportAssistantMetricDirection(outputId),
    outputId,
    reportMetricId: getReportAssistantMetricId(outputId)
  };
}

const BASE_DOCUMENT: SimpleWorkbenchProposalDocument = {
  assemblyHeadline: "Rw 61 dB and Ln,w 49 dB are packaged for issue.",
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
      ...metricMetadata("Rw")
    },
    {
      detail: "Weighted normalized impact sound pressure level.",
      label: "Ln,w",
      postureDetail: "Exact impact lane.",
      postureLabel: "Exact impact lane",
      postureTone: "success",
      status: "live",
      value: "49 dB",
      ...metricMetadata("Ln,w")
    },
    {
      detail: "Combined bound-only impact value.",
      label: "Ln,w+CI",
      postureDetail: "Bound-only lane.",
      postureLabel: "Bound-only lane",
      postureTone: "warning",
      status: "bound",
      value: "<= 50 dB",
      ...metricMetadata("Ln,w+CI")
    },
    {
      detail: "Low-frequency impact companion.",
      label: "CI",
      postureDetail: "Exact impact lane.",
      postureLabel: "Exact impact lane",
      postureTone: "success",
      status: "live",
      value: "+1 dB",
      ...metricMetadata("CI")
    },
    {
      detail: "ASTM impact alias remains unsupported.",
      label: "IIC",
      postureDetail: "Unsupported metric.",
      postureLabel: "Unsupported metric",
      postureTone: "neutral",
      status: "unsupported",
      value: "Not ready",
      ...metricMetadata("IIC")
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
      value: "61 dB",
      ...metricMetadata("Rw")
    },
    {
      detail: "Weighted normalized impact sound pressure level.",
      label: "Ln,w",
      value: "49 dB",
      ...metricMetadata("Ln,w")
    },
    {
      detail: "Combined bound-only impact value.",
      label: "Ln,w+CI",
      value: "<= 50 dB",
      ...metricMetadata("Ln,w+CI")
    },
    {
      detail: "Low-frequency impact companion.",
      label: "CI",
      value: "+1 dB",
      ...metricMetadata("CI")
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

function buildContext(document: SimpleWorkbenchProposalDocument = BASE_DOCUMENT) {
  return buildReportAssistantContext({
    baseDocument: BASE_DOCUMENT,
    createdAtIso: "2026-06-02T09:00:00.000Z",
    document,
    reportId: "report-assistant-test"
  });
}

describe("report assistant Phase A patch core", () => {
  it("extracts stable metric ids, locations, direction, basis, and engine values", () => {
    const context = buildContext();
    const rw = context.metrics.find((metric) => metric.id === RW_METRIC_ID);
    const lnw = context.metrics.find((metric) => metric.id === LNW_METRIC_ID);
    const bound = context.metrics.find((metric) => metric.id === LNW_PLUS_CI_METRIC_ID);

    expect(rw).toMatchObject({
      basis: "lab",
      direction: "higher_is_better",
      engineDisplayValue: "61 dB",
      label: "Rw",
      reportDisplayValue: "61 dB",
      status: "live"
    });
    expect(rw?.locations).toEqual([
      { index: 0, kind: "coverageRow" },
      { index: 0, kind: "metricRow" },
      { kind: "primaryMetric" }
    ]);
    expect(lnw).toMatchObject({
      direction: "lower_is_better",
      reportDisplayValue: "49 dB"
    });
    expect(bound).toMatchObject({
      reportDisplayValue: "<= 50 dB",
      status: "bound"
    });
    expect(context.layersSummary[0]).toContain("Concrete slab");
  });

  it("preserves assistant metadata and report adjustment audit records while parsing proposals", () => {
    const parsed = parseSimpleWorkbenchProposalDocument({
      ...BASE_DOCUMENT,
      reportAdjustments: [
        {
          afterValue: "58 dB",
          appliedAtIso: "2026-06-02T09:05:00.000Z",
          beforeValue: "61 dB",
          engineValuePreserved: true,
          id: "report-adjustment-test",
          label: "Rw",
          metricId: RW_METRIC_ID,
          outputId: "Rw",
          reason: "Test adjustment",
          scope: "export_only",
          source: "assistant"
        }
      ]
    });

    expect(parsed?.metrics[0]).toMatchObject({
      engineDisplayValue: "61 dB",
      metricBasis: "lab",
      metricDirection: "higher_is_better",
      outputId: "Rw",
      reportMetricId: RW_METRIC_ID
    });
    expect(parsed?.coverageItems[0]?.outputId).toBe("Rw");
    expect(parsed?.reportAdjustments?.[0]).toMatchObject({
      engineValuePreserved: true,
      metricId: RW_METRIC_ID,
      scope: "export_only"
    });
  });

  it("applies a validated Rw adjustment to primary, metric, and coverage report locations with audit", () => {
    const context = buildContext();
    const validation = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            deltaDb: -3,
            metricId: RW_METRIC_ID,
            reason: "User requested Rw to be 3 dB lower for the issued report.",
            type: "adjust_metric_db"
          }
        ],
        summary: "Lower Rw by 3 dB for this report."
      }
    });

    expect(validation.status).toBe("valid");
    expect(validation.operations[0]).toMatchObject({
      afterValue: "58 dB",
      beforeValue: "61 dB",
      metricId: RW_METRIC_ID
    });

    const applied = applyValidatedReportAssistantPatch(BASE_DOCUMENT, validation, {
      appliedAtIso: "2026-06-02T09:05:00.000Z"
    });

    expect(applied.primaryMetricValue).toBe("58 dB");
    expect(applied.metrics.find((metric) => metric.reportMetricId === RW_METRIC_ID)?.value).toBe("58 dB");
    expect(applied.coverageItems.find((item) => item.reportMetricId === RW_METRIC_ID)?.value).toBe("58 dB");
    expect(applied.reportAdjustments?.[0]).toMatchObject({
      afterValue: "58 dB",
      beforeValue: "61 dB",
      engineValuePreserved: true,
      metricId: RW_METRIC_ID,
      scope: "export_only",
      source: "assistant"
    });
  });

  it("requires confirmation above 5 dB and rejects assistant movement above 10 dB", () => {
    const context = buildContext();
    const requiresConfirmation = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            deltaDb: -6,
            metricId: LNW_METRIC_ID,
            reason: "User requested a lower Ln,w report value.",
            type: "adjust_metric_db"
          }
        ],
        summary: "Lower Ln,w by 6 dB."
      }
    });

    expect(requiresConfirmation.status).toBe("requires_confirmation");
    expect(() => applyValidatedReportAssistantPatch(BASE_DOCUMENT, requiresConfirmation)).toThrow(/requires user confirmation/u);
    expect(
      applyValidatedReportAssistantPatch(BASE_DOCUMENT, requiresConfirmation, {
        appliedAtIso: "2026-06-02T09:06:00.000Z",
        confirmed: true
      }).metrics.find((metric) => metric.reportMetricId === LNW_METRIC_ID)?.value
    ).toBe("43 dB");

    const rejected = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            deltaDb: -11,
            metricId: LNW_METRIC_ID,
            reason: "User requested a very large Ln,w movement.",
            type: "adjust_metric_db"
          }
        ],
        summary: "Lower Ln,w by 11 dB."
      }
    });

    expect(rejected.status).toBe("rejected");
    expect(rejected.errors.join(" ")).toContain("above the assistant limit");
  });

  it("rejects numeric patches for unsupported or stale report context", () => {
    const context = buildContext();
    const unsupported = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            displayValue: "52 dB",
            metricId: IIC_METRIC_ID,
            reason: "User tried to publish an unsupported ASTM value.",
            type: "set_metric_display_value"
          }
        ],
        summary: "Set IIC."
      }
    });

    expect(unsupported.status).toBe("rejected");
    expect(unsupported.errors.join(" ")).toContain("unsupported");

    const staleDocument = {
      ...BASE_DOCUMENT,
      primaryMetricValue: "60 dB"
    };
    const stale = validateReportAssistantPatch({
      context,
      document: staleDocument,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            deltaDb: -1,
            metricId: RW_METRIC_ID,
            reason: "Stale edit.",
            type: "adjust_metric_db"
          }
        ],
        summary: "Stale patch."
      }
    });

    expect(stale.status).toBe("rejected");
    expect(stale.errors.join(" ")).toContain("no longer matches");
  });

  it("preserves bound prefixes and signed companion formatting", () => {
    const context = buildContext();
    const bound = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            displayValue: "47 dB",
            metricId: LNW_PLUS_CI_METRIC_ID,
            reason: "User requested a lower bound value.",
            type: "set_metric_display_value"
          }
        ],
        summary: "Set bound value."
      }
    });

    expect(bound.status).toBe("valid");
    expect(bound.operations[0]).toMatchObject({
      afterValue: "<= 47 dB",
      beforeValue: "<= 50 dB"
    });

    const signed = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            displayValue: "4 dB",
            metricId: CI_METRIC_ID,
            reason: "User requested a positive CI value.",
            type: "set_metric_display_value"
          }
        ],
        summary: "Set CI."
      }
    });

    expect(signed.status).toBe("valid");
    expect(signed.operations[0]).toMatchObject({
      afterValue: "+4 dB",
      beforeValue: "+1 dB"
    });
  });

  it("finds stale literal value mentions for preview warnings", () => {
    expect(findReportValueMentions(BASE_DOCUMENT, "61 dB")).toEqual([
      {
        path: "executiveSummary",
        value: "Riverside Residences currently reads Rw 61 dB."
      }
    ]);
  });
});
