import { describe, expect, it } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import { parseReportAssistantContextPayload } from "./report-assistant-instruction";
import {
  applyValidatedReportAssistantPatch,
  collectReportConsistencyTextPaths,
  findReportAdjustmentConsistencyMentions,
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
    const assistantTraceSnapshot = {
      airborne: {
        candidateMethods: [
          {
            label: "Sharp",
            method: "sharp",
            rwDb: 59,
            selected: false
          },
          {
            label: "KS calibrated",
            method: "ks_rw_calibrated",
            rwDb: 61,
            selected: true
          }
        ],
        confidenceClass: "medium",
        detectedFamily: "double_leaf",
        selectedLabel: "KS calibrated double-leaf lane",
        selectedMethod: "ks_rw_calibrated",
        solverSpreadRwDb: 2
      },
      layerCombinationResolver: {
        basis: "element_lab",
        candidateKind: "calibrated_family_solver",
        route: "wall",
        selectedCandidateId: "candidate-ks",
        surfaceDetail: "Calibrated double-leaf resolver picked the KS lane.",
        supportedMetrics: ["Rw"],
        valuePins: [
          {
            metric: "Rw",
            value: 61
          }
        ]
      }
    };
    const parsed = parseSimpleWorkbenchProposalDocument({
      ...BASE_DOCUMENT,
      assistantTraceSnapshot,
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
    expect(parsed?.assistantTraceSnapshot?.airborne).toMatchObject({
      selectedLabel: "KS calibrated double-leaf lane",
      selectedMethod: "ks_rw_calibrated"
    });

    const context = buildReportAssistantContext({
      document: parsed!,
      reportId: "trace-round-trip"
    });
    const roundTrip = parseReportAssistantContextPayload(JSON.parse(JSON.stringify(context)) as unknown);

    expect(roundTrip?.assistantTraceSnapshot?.layerCombinationResolver).toMatchObject({
      selectedCandidateId: "candidate-ks",
      supportedMetrics: ["Rw"]
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
    expect(findReportValueMentions(BASE_DOCUMENT, "61 dB")).toEqual(expect.arrayContaining([
      expect.objectContaining({
        path: "assemblyHeadline",
        value: "Rw 61 dB and Ln,w 49 dB are packaged for issue."
      }),
      expect.objectContaining({
        path: "executiveSummary",
        value: "Riverside Residences currently reads Rw 61 dB."
      })
    ]));
  });

  it("collects replaceable report text paths without making source or audit values replaceable", () => {
    const document: SimpleWorkbenchProposalDocument = {
      ...BASE_DOCUMENT,
      citations: [
        {
          detail: "Comparable source reports Rw 61 dB for a related assembly.",
          href: "https://example.com/rw-61",
          label: "Source Rw 61 dB",
          tone: "neutral"
        }
      ],
      coverageItems: BASE_DOCUMENT.coverageItems.map((item) =>
        item.label === "Rw" ? { ...item, detail: "Coverage still says Rw 61 dB.", engineDisplayValue: "61 dB" } : item
      ),
      methodTraceGroups: [
        {
          detail: "Trace detail still says Rw 61 dB.",
          label: "Trace",
          notes: ["Trace note still says Rw 61 dB."],
          tone: "neutral",
          value: "Rw 61 dB trace"
        }
      ]
    };
    const records = collectReportConsistencyTextPaths(document);

    expect(records).toEqual(expect.arrayContaining([
      expect.objectContaining({
        path: "coverageItems.0.detail",
        replaceable: true,
        surfacePolicy: "client_narrative"
      }),
      expect.objectContaining({
        path: "methodTraceGroups.0.notes.0",
        replaceable: true,
        surfacePolicy: "technical_narrative"
      }),
      expect.objectContaining({
        path: "citations.0.detail",
        replaceable: false,
        surfacePolicy: "evidence_source"
      }),
      expect.objectContaining({
        auditExempt: true,
        path: "coverageItems.0.engineDisplayValue",
        replaceable: false,
        surfacePolicy: "audit_engine"
      })
    ]));
  });

  it("classifies report-adjustment stale value mentions by metric evidence", () => {
    const documentWithNarrativeValues: SimpleWorkbenchProposalDocument = {
      ...BASE_DOCUMENT,
      executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
      recommendationItems: [
        {
          detail: "Old benchmark values remain 61 dB and 49 dB until text is reconciled.",
          label: "Review note",
          tone: "warning"
        },
        {
          detail: "Ln,w 61 dB is a separate impact placeholder.",
          label: "Other metric note",
          tone: "neutral"
        }
      ],
      validationDetail: "Rw should be checked. Current narrative value still says 61 dB."
    };
    const context = buildContext(documentWithNarrativeValues);
    const validation = validateReportAssistantPatch({
      context,
      document: documentWithNarrativeValues,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            deltaDb: -3,
            metricId: RW_METRIC_ID,
            reason: "Lower Rw for issued report.",
            type: "adjust_metric_db"
          },
          {
            deltaDb: 2,
            metricId: LNW_METRIC_ID,
            reason: "Raise Ln,w for issued report.",
            type: "adjust_metric_db"
          }
        ],
        summary: "Adjust Rw and Ln,w."
      }
    });
    const applied = applyValidatedReportAssistantPatch(documentWithNarrativeValues, validation);
    const mentions = findReportAdjustmentConsistencyMentions(applied);

    expect(mentions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        beforeValue: "61 dB",
        blocking: true,
        classification: "exact_metric_label_value",
        label: "Rw",
        path: "executiveSummary"
      }),
      expect.objectContaining({
        beforeValue: "61 dB",
        blocking: true,
        classification: "ambiguous_numeric_only",
        label: "Rw",
        path: "recommendationItems.0.detail"
      }),
      expect.objectContaining({
        beforeValue: "61 dB",
        blocking: false,
        classification: "unrelated_numeric_mention",
        label: "Rw",
        path: "recommendationItems.1.detail"
      }),
      expect.objectContaining({
        beforeValue: "61 dB",
        blocking: true,
        classification: "unresolved",
        label: "Rw",
        path: "validationDetail"
      }),
      expect.objectContaining({
        beforeValue: "49 dB",
        blocking: true,
        classification: "ambiguous_numeric_only",
        label: "Ln,w",
        path: "recommendationItems.0.detail"
      })
    ]));
  });

  it("clears report-adjustment consistency mentions after approved text replacements", () => {
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
            reason: "Lower Rw for issued report.",
            type: "adjust_metric_db"
          },
          {
            afterValue: "58 dB",
            beforeText: "Riverside Residences currently reads Rw 61 dB.",
            beforeValue: "61 dB",
            path: "executiveSummary",
            reason: "Keep summary consistent with the approved Rw report value.",
            type: "replace_report_text_value"
          },
          {
            afterValue: "58 dB",
            beforeText: "Rw 61 dB and Ln,w 49 dB are packaged for issue.",
            beforeValue: "61 dB",
            path: "assemblyHeadline",
            reason: "Keep assembly headline consistent with the approved Rw report value.",
            type: "replace_report_text_value"
          }
        ],
        summary: "Lower Rw and update summary."
      }
    });
    const applied = applyValidatedReportAssistantPatch(BASE_DOCUMENT, validation);

    expect(findReportAdjustmentConsistencyMentions(applied)).toEqual([]);
  });

  it("applies guarded text-location replacements without touching engine values", () => {
    const context = buildContext();
    const validation = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            afterValue: "58 dB",
            beforeText: "Riverside Residences currently reads Rw 61 dB.",
            beforeValue: "61 dB",
            path: "executiveSummary",
            reason: "Keep the executive summary consistent with the approved Rw report value.",
            type: "replace_report_text_value"
          }
        ],
        summary: "Replace stale Rw text."
      }
    });

    expect(validation.status).toBe("valid");
    expect(validation.operations[0]).toMatchObject({
      afterText: "Riverside Residences currently reads Rw 58 dB.",
      afterValue: "58 dB",
      beforeValue: "61 dB",
      path: "executiveSummary",
      type: "text_value"
    });

    const applied = applyValidatedReportAssistantPatch(BASE_DOCUMENT, validation);

    expect(applied.executiveSummary).toBe("Riverside Residences currently reads Rw 58 dB.");
    expect(applied.primaryMetricValue).toBe("61 dB");
    expect(applied.reportAdjustments).toBeUndefined();
  });

  it("rejects text replacements for stale text or disallowed paths", () => {
    const context = buildContext();
    const staleText = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            afterValue: "58 dB",
            beforeText: "Riverside Residences currently reads Rw 60 dB.",
            beforeValue: "61 dB",
            path: "executiveSummary",
            reason: "Stale text replacement.",
            type: "replace_report_text_value"
          }
        ],
        summary: "Reject stale text."
      }
    });

    expect(staleText.status).toBe("rejected");
    expect(staleText.errors.join(" ")).toContain("no longer matches");

    const allowedHeadline = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            afterValue: "58 dB",
            beforeText: BASE_DOCUMENT.assemblyHeadline,
            beforeValue: "61 dB",
            path: "assemblyHeadline",
            reason: "Allowed exact headline value replacement.",
            type: "replace_report_text_value"
          }
        ],
        summary: "Allow headline path."
      }
    });

    expect(allowedHeadline.status).toBe("valid");

    const disallowedPath = validateReportAssistantPatch({
      context,
      document: BASE_DOCUMENT,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            afterValue: "58 dB",
            beforeText: "Riverside Residences",
            beforeValue: "61 dB",
            path: "projectName",
            reason: "Disallowed metadata rewrite.",
            type: "replace_report_text_value"
          }
        ],
        summary: "Reject disallowed path."
      }
    });

    expect(disallowedPath.status).toBe("rejected");
    expect(disallowedPath.errors.join(" ")).toContain("not an allowed report text location");
  });

  it("detects manual metric edits from the packaged base document", () => {
    const editedDocument: SimpleWorkbenchProposalDocument = {
      ...BASE_DOCUMENT,
      executiveSummary: "Riverside Residences currently reads Rw 61 dB.",
      metrics: BASE_DOCUMENT.metrics.map((metric) =>
        metric.label === "Rw" ? { ...metric, value: "58 dB" } : metric
      ),
      primaryMetricValue: "58 dB"
    };
    const mentions = findReportAdjustmentConsistencyMentions(editedDocument, {
      baseDocument: BASE_DOCUMENT
    });

    expect(mentions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        afterValue: "58 dB",
        beforeValue: "61 dB",
        blocking: true,
        label: "Rw",
        path: "executiveSummary"
      }),
      expect.objectContaining({
        afterValue: "58 dB",
        beforeValue: "61 dB",
        blocking: true,
        label: "Rw",
        path: "assemblyHeadline"
      })
    ]));
  });

  it("classifies source evidence old values without blocking export", () => {
    const documentWithSourceValue: SimpleWorkbenchProposalDocument = {
      ...BASE_DOCUMENT,
      citations: [
        {
          detail: "Published comparable source reports Rw 61 dB.",
          href: "https://example.com/source",
          label: "Comparable source",
          tone: "neutral"
        }
      ]
    };
    const context = buildContext(documentWithSourceValue);
    const validation = validateReportAssistantPatch({
      context,
      document: documentWithSourceValue,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            deltaDb: -3,
            metricId: RW_METRIC_ID,
            reason: "Lower Rw for issued report.",
            type: "adjust_metric_db"
          }
        ],
        summary: "Lower Rw."
      }
    });
    const applied = applyValidatedReportAssistantPatch(documentWithSourceValue, validation);
    const mentions = findReportAdjustmentConsistencyMentions(applied);

    expect(mentions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        blocking: false,
        classification: "evidence_source_value",
        path: "citations.0.detail"
      })
    ]));
  });

  it("flags semantic stale copy even when the old numeric value was removed", () => {
    const documentWithSemanticCopy: SimpleWorkbenchProposalDocument = {
      ...BASE_DOCUMENT,
      citations: [
        {
          detail: "Comparable source says this family can pass its target.",
          href: "https://example.com/source",
          label: "Comparable source",
          tone: "neutral"
        }
      ],
      executiveSummary: "Riverside Residences Rw comfortably exceeds the target and passes by 2 dB.",
      metrics: BASE_DOCUMENT.metrics.map((metric) =>
        metric.label === "Rw" ? { ...metric, detail: "Comfortably passes the target margin." } : metric
      ),
      recommendationItems: [
        {
          detail: "Comfortably exceeds the target after coordination.",
          label: "General recommendation",
          tone: "neutral"
        }
      ]
    };
    const context = buildContext(documentWithSemanticCopy);
    const validation = validateReportAssistantPatch({
      context,
      document: documentWithSemanticCopy,
      patch: {
        documentSignature: context.documentSignature,
        operations: [
          {
            deltaDb: -3,
            metricId: RW_METRIC_ID,
            reason: "Lower Rw for issued report.",
            type: "adjust_metric_db"
          }
        ],
        summary: "Lower Rw."
      }
    });
    const applied = applyValidatedReportAssistantPatch(documentWithSemanticCopy, validation);
    const mentions = findReportAdjustmentConsistencyMentions(applied);

    expect(mentions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        blocking: true,
        classification: "semantic_metric_claim",
        path: "executiveSummary"
      }),
      expect.objectContaining({
        blocking: true,
        classification: "semantic_metric_claim",
        path: "metrics.0.detail"
      })
    ]));
    expect(mentions).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        classification: "semantic_metric_claim",
        path: "citations.0.detail"
      }),
      expect.objectContaining({
        classification: "semantic_metric_claim",
        path: "recommendationItems.0.detail"
      })
    ]));
  });

  it("applies metric and approved stale-text replacements in one guarded patch", () => {
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
          },
          {
            afterValue: "58 dB",
            beforeText: "Riverside Residences currently reads Rw 61 dB.",
            beforeValue: "61 dB",
            path: "executiveSummary",
            reason: "Keep executive summary consistent with the approved Rw report value.",
            type: "replace_report_text_value"
          }
        ],
        summary: "Lower Rw and update stale report text."
      }
    });

    expect(validation.status).toBe("valid");

    const applied = applyValidatedReportAssistantPatch(BASE_DOCUMENT, validation, {
      appliedAtIso: "2026-06-02T09:07:00.000Z"
    });

    expect(applied.primaryMetricValue).toBe("58 dB");
    expect(applied.executiveSummary).toBe("Riverside Residences currently reads Rw 58 dB.");
    expect(applied.reportAdjustments).toHaveLength(1);
    expect(applied.reportAdjustments?.[0]).toMatchObject({
      afterValue: "58 dB",
      beforeValue: "61 dB",
      metricId: RW_METRIC_ID
    });
  });
});
