import { describe, expect, it } from "vitest";

import {
  buildReportAssistantContext,
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId
} from "./report-assistant-context";
import { parseReportAssistantContextPayload } from "./report-assistant-instruction";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

function metricMetadata(outputId: "DeltaLw" | "Ln,w" | "Ln,w+CI" | "Rw") {
  return {
    engineDisplayValue:
      outputId === "Rw"
        ? "61 dB"
        : outputId === "DeltaLw"
          ? "18 dB"
          : outputId === "Ln,w+CI"
            ? "Not ready"
            : "50 dB",
    metricBasis: getReportAssistantMetricBasis(outputId),
    metricDirection: getReportAssistantMetricDirection(outputId),
    outputId,
    reportMetricId: getReportAssistantMetricId(outputId)
  };
}

function documentWithLayer(layer: {
  categoryLabel?: string;
  label: string;
  surfaceMassLabel?: string;
  thicknessLabel: string;
}): SimpleWorkbenchProposalDocument {
  return {
    assistantTraceSnapshot: {
      layerCombinationResolver: {
        basis: "building_prediction",
        candidateKind: "calibrated_family_solver",
        route: "floor",
        selectedCandidateId: "candidate.floor.same-values",
        supportBucket: "calibrated_estimate",
        supportedMetrics: ["Rw", "Ln,w"],
        surfaceDetail: "Same output values but assembly identity must stay distinct.",
        surfaceLabel: "Assistant context signature fixture",
        valuePins: [
          { metric: "Rw", value: 61 },
          { metric: "Ln,w", value: 50 }
        ]
      }
    },
    assemblyHeadline: "Rw 61 dB and Ln,w 50 dB packaged for issue.",
    assumptionItems: [],
    approverTitle: "Lead Acoustic Consultant",
    briefNote: "Report assistant signature fixture.",
    citations: [],
    clientName: "Machinity Acoustics",
    consultantAddress: "Maslak District, Istanbul",
    consultantCompany: "Machinity Acoustic Consultants",
    consultantEmail: "offers@machinity.ai",
    consultantLogoDataUrl: "",
    consultantPhone: "+90 212 000 00 00",
    consultantWordmarkLine: "Building Acoustics",
    contextLabel: "Building prediction",
    corridorDossierCards: [],
    corridorDossierHeadline: "Validation corridor packaged.",
    coverageItems: [
      {
        detail: "Weighted airborne element rating.",
        label: "Rw",
        postureDetail: "Live value.",
        postureLabel: "Live",
        postureTone: "success",
        status: "live",
        value: "61 dB",
        ...metricMetadata("Rw")
      },
      {
        detail: "Normalized impact level.",
        label: "Ln,w",
        postureDetail: "Live value.",
        postureLabel: "Live",
        postureTone: "success",
        status: "live",
        value: "50 dB",
        ...metricMetadata("Ln,w")
      }
    ],
    decisionTrailHeadline: "Scoped estimate is active.",
    decisionTrailItems: [],
    dynamicBranchDetail: "Dynamic floor branch.",
    dynamicBranchLabel: "Floor",
    executiveSummary: "Rw 61 dB and Ln,w 50 dB are unchanged.",
    issuedOnIso: "2026-06-04T09:00:00.000Z",
    issuedOnLabel: "04 June 2026",
    issueBaseReference: "MAC-CTX-001",
    issueCodePrefix: "MAC",
    issueNextReference: "MAC-CTX-002",
    issueRegisterItems: [],
    layers: [
      {
        categoryLabel: layer.categoryLabel ?? "Structure",
        index: 1,
        label: layer.label,
        roleLabel: "Base structure",
        surfaceMassLabel: layer.surfaceMassLabel,
        thicknessLabel: layer.thicknessLabel
      }
    ],
    methodDossierCards: [],
    methodDossierHeadline: "Method trace packaged.",
    methodTraceGroups: [
      {
        detail: "Resolver selected the same metric values.",
        label: "Layer resolver",
        notes: ["Context identity must include the layer row."],
        tone: "success",
        value: "calibrated"
      }
    ],
    metrics: [
      {
        detail: "Weighted airborne element rating.",
        label: "Rw",
        value: "61 dB",
        ...metricMetadata("Rw")
      },
      {
        detail: "Normalized impact level.",
        label: "Ln,w",
        value: "50 dB",
        ...metricMetadata("Ln,w")
      }
    ],
    preparedBy: "O. Tuna",
    primaryMetricLabel: "Rw",
    primaryMetricValue: "61 dB",
    projectName: "Assistant Signature Fixture",
    proposalAttention: "Design Team",
    proposalIssuePurpose: "Assistant context testing",
    proposalRecipient: "Machinity",
    proposalReference: "MAC-CTX",
    proposalRevision: "Rev 01",
    proposalSubject: "Assistant context signature fixture",
    proposalValidityNote: "Valid for test only.",
    recommendationItems: [],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Pre-tender",
    studyModeLabel: "Floor",
    validationDetail: "Values are unchanged; layer identity differs.",
    validationLabel: "Scoped estimate",
    warnings: []
  };
}

describe("report assistant context identity", () => {
  it("keeps metric patch signature stable but changes assistant context signature for different layer rows", () => {
    const concrete = buildReportAssistantContext({
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document: documentWithLayer({
        label: "Concrete slab",
        surfaceMassLabel: "480 kg/m2",
        thicknessLabel: "200 mm"
      })
    });
    const clt = buildReportAssistantContext({
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document: documentWithLayer({
        categoryLabel: "Mass timber",
        label: "CLT panel",
        surfaceMassLabel: "95 kg/m2",
        thicknessLabel: "120 mm"
      })
    });

    expect(concrete.documentSignature).toBe(clt.documentSignature);
    expect(concrete.assistantContextSignature).not.toBe(clt.assistantContextSignature);
    expect(concrete.assistantContextSignature).toMatch(/^report-context:/u);
  });

  it("changes assistant context signature for profile and trace changes that leave patch signature stable", () => {
    const baseDocument = documentWithLayer({
      label: "Concrete slab",
      surfaceMassLabel: "480 kg/m2",
      thicknessLabel: "200 mm"
    });
    const profileDocument: SimpleWorkbenchProposalDocument = {
      ...baseDocument,
      reportProfile: "developer",
      reportProfileLabel: "Developer review",
      studyContextLabel: "Detailed design"
    };
    const traceDocument = {
      ...baseDocument,
      assistantTraceSnapshot: {
        ...baseDocument.assistantTraceSnapshot,
        layerCombinationResolver: {
          ...baseDocument.assistantTraceSnapshot?.layerCombinationResolver,
          selectedCandidateId: "candidate.floor.trace-change",
          supportBucket: "formula_corridor"
        }
      }
    };
    const base = buildReportAssistantContext({
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document: baseDocument
    });
    const profile = buildReportAssistantContext({
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document: profileDocument
    });
    const trace = buildReportAssistantContext({
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document: traceDocument
    });

    expect(profile.documentSignature).toBe(base.documentSignature);
    expect(trace.documentSignature).toBe(base.documentSignature);
    expect(profile.assistantContextSignature).not.toBe(base.assistantContextSignature);
    expect(trace.assistantContextSignature).not.toBe(base.assistantContextSignature);
  });

  it("round-trips the assistant context signature and falls back for legacy payloads", () => {
    const context = buildReportAssistantContext({
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document: documentWithLayer({
        label: "Concrete slab",
        surfaceMassLabel: "480 kg/m2",
        thicknessLabel: "200 mm"
      })
    });
    const payload = JSON.parse(JSON.stringify(context)) as Record<string, unknown>;
    const parsed = parseReportAssistantContextPayload(payload);
    const legacyPayload = {
      ...payload
    };
    delete legacyPayload.assistantContextSignature;
    const legacyParsed = parseReportAssistantContextPayload(legacyPayload);

    expect(parsed?.assistantContextSignature).toBe(context.assistantContextSignature);
    expect(legacyParsed?.assistantContextSignature).toBe(context.documentSignature);
  });

  it("builds output facts for live impact values and parked unsupported outputs", () => {
    const baseDocument = documentWithLayer({
      label: "Concrete slab with resilient finish",
      surfaceMassLabel: "480 kg/m2",
      thicknessLabel: "200 mm"
    });
    const document: SimpleWorkbenchProposalDocument = {
      ...baseDocument,
      assistantTraceSnapshot: {
        ...baseDocument.assistantTraceSnapshot,
        impact: {
          evidenceTierLabel: "Formula corridor",
          impactBasisLabel: "Family estimate",
          notes: ["DeltaLw is calculated from the selected impact support corridor."],
          selectedLabel: "Impact Floor resilient finish corridor",
          selectedSourceLabels: ["Heavy concrete impact source"]
        },
        impactSupport: {
          basis: "formula_corridor",
          formulaNotes: ["DeltaLw corridor uses resilient finish support."],
          referenceFloorType: "reinforced concrete"
        },
        layerCombinationResolver: {
          ...baseDocument.assistantTraceSnapshot?.layerCombinationResolver,
          requiredInputs: ["base slab Ln,w", "finish dynamic stiffness"],
          supportedMetrics: ["Rw", "Ln,w", "DeltaLw"],
          valuePins: [
            { metric: "Rw", value: 61 },
            { metric: "Ln,w", value: 50 },
            { metric: "DeltaLw", value: 18 }
          ]
        }
      },
      coverageItems: [
        ...baseDocument.coverageItems,
        {
          detail: "Impact improvement from resilient finish.",
          label: "DeltaLw",
          postureDetail: "Live value.",
          postureLabel: "Live",
          postureTone: "success",
          status: "live",
          value: "18 dB",
          ...metricMetadata("DeltaLw")
        },
        {
          detail: "Combined normalized impact value with spectrum adaptation is not available for this branch.",
          label: "Ln,w+CI",
          nextStep: "Add CI support evidence before publishing Ln,w+CI.",
          postureDetail: "Parked until CI support evidence exists.",
          postureLabel: "Not ready",
          postureTone: "warning",
          status: "unsupported",
          value: "Not ready",
          ...metricMetadata("Ln,w+CI")
        }
      ],
      metrics: [
        ...baseDocument.metrics,
        {
          detail: "Impact improvement from resilient finish.",
          label: "DeltaLw",
          value: "18 dB",
          ...metricMetadata("DeltaLw")
        }
      ]
    };
    const context = buildReportAssistantContext({
      createdAtIso: "2026-06-04T09:00:00.000Z",
      document
    });
    const deltaLw = context.assistantOutputFacts.find((fact) => fact.outputId === "DeltaLw");
    const lnwCi = context.assistantOutputFacts.find((fact) => fact.outputId === "Ln,w+CI");
    const parsed = parseReportAssistantContextPayload(JSON.parse(JSON.stringify(context)));

    expect(deltaLw).toMatchObject({
      basisCategory: "formula_corridor",
      label: "DeltaLw",
      status: "live",
      supportBucket: "calibrated_estimate",
      valuePinDb: 18
    });
    expect(deltaLw?.usedInputs.join(" ")).toContain("Impact Floor resilient finish corridor");
    expect(deltaLw?.formulaOrSupportNote).toBe("DeltaLw corridor uses resilient finish support.");
    expect(lnwCi).toMatchObject({
      basisCategory: "unsupported",
      parkedReason: "Add CI support evidence before publishing Ln,w+CI.",
      status: "unsupported"
    });
    expect(parsed?.assistantOutputFacts).toEqual(context.assistantOutputFacts);
  });

  it("carries saved project report revision context and report adjustment summaries", () => {
    const document: SimpleWorkbenchProposalDocument = {
      ...documentWithLayer({
        label: "Concrete slab",
        surfaceMassLabel: "480 kg/m2",
        thicknessLabel: "200 mm"
      }),
      reportAdjustments: [
        {
          afterValue: "59 dB",
          appliedAtIso: "2026-06-15T09:30:00.000Z",
          beforeValue: "61 dB",
          engineValuePreserved: true,
          id: "adjustment-1",
          label: "Rw",
          metricId: "output:Rw",
          reason: "Client-facing issue value reduced by assistant review.",
          scope: "saved_snapshot",
          source: "assistant"
        }
      ],
      serverProjectId: "11111111-1111-4111-8111-111111111111",
      serverProjectScenarioId: "22222222-2222-4222-8222-222222222222"
    };
    const local = buildReportAssistantContext({
      createdAtIso: "2026-06-15T09:30:00.000Z",
      document
    });
    const project = buildReportAssistantContext({
      activeDraftState: {
        assemblyId: "assembly-1",
        assemblyName: "Lobby slab",
        assemblyVersion: 3,
        dirty: true,
        kind: "project_report_draft",
        projectId: "11111111-1111-4111-8111-111111111111",
        projectName: "Hotel acoustic package",
        reportId: "report-1",
        reportUpdatedAtIso: "2026-06-15T09:31:00.000Z"
      },
      createdAtIso: "2026-06-15T09:30:00.000Z",
      document,
      projectWorkspace: {
        availableReadTools: [],
        currentRevision: {
          assistantPatchSummary: {
            operationCount: 1,
            validationStatus: "valid"
          },
          changeSummary: "Assistant-adjusted report editor draft.",
          createdAtIso: "2026-06-15T09:31:00.000Z",
          displayCode: "REV-0002",
          id: "revision-2",
          source: "assistant"
        },
        project: {
          assemblyCount: 1,
          id: "11111111-1111-4111-8111-111111111111",
          name: "Hotel acoustic package",
          reportCount: 1,
          updatedAtIso: "2026-06-15T09:31:00.000Z"
        },
        linkedAssembly: {
          calculationPrimaryOutput: "Rw",
          calculationPrimaryValueLabel: "58 dB",
          calculationStatus: "ready",
          displayCode: "ASM-0001",
          id: "assembly-1",
          kind: "floor",
          name: "Lobby slab",
          updatedAtIso: "2026-06-15T09:20:00.000Z",
          version: 3
        },
        report: {
          currentRevisionId: "revision-2",
          displayCode: "RPT-0001",
          id: "report-1",
          name: "Lobby slab report",
          revisionCount: 2,
          status: "draft",
          updatedAtIso: "2026-06-15T09:31:00.000Z"
        },
        revisionSummaries: [
          {
            changeSummary: "Generated issue.",
            createdAtIso: "2026-06-15T09:00:00.000Z",
            displayCode: "REV-0001",
            id: "revision-1",
            source: "generated"
          }
        ],
        scope: "project_report"
      }
    });
    const parsed = parseReportAssistantContextPayload(JSON.parse(JSON.stringify(project)));

    expect(project.assistantContextSignature).not.toBe(local.assistantContextSignature);
    expect(project.reportAdjustments).toEqual([
      expect.objectContaining({
        afterValue: "59 dB",
        beforeValue: "61 dB",
        metricId: "output:Rw",
        source: "assistant"
      })
    ]);
    expect(project.projectWorkspace).toMatchObject({
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
        calculationPrimaryOutput: "Rw",
        calculationPrimaryValueLabel: "58 dB",
        id: "assembly-1",
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
    expect(project.projectWorkspace?.availableReadTools.every((tool) => tool.mutates === false)).toBe(true);
    expect(project.projectWorkspace?.availableReadTools.map((tool) => tool.name)).toContain("list_project_report_revisions");
    expect(parsed?.projectWorkspace).toEqual(project.projectWorkspace);
    expect(parsed?.reportAdjustments).toEqual(project.reportAdjustments);
  });

  it("summarizes draft versus baseline document differences without copying long text bodies", () => {
    const baseDocument = documentWithLayer({
      label: "Concrete slab",
      surfaceMassLabel: "480 kg/m2",
      thicknessLabel: "200 mm"
    });
    const longExecutiveSummary = `Executive ${"summary ".repeat(300)}`;
    const longBriefNote = `Brief ${"note ".repeat(300)}`;
    const document: SimpleWorkbenchProposalDocument = {
      ...baseDocument,
      assumptionItems: [
        {
          detail: "Report-only assumption added after client review.",
          label: "Client review assumption",
          tone: "neutral"
        }
      ],
      briefNote: longBriefNote,
      coverageItems: baseDocument.coverageItems.map((item) =>
        item.label === "Rw" ? { ...item, value: "59 dB" } : item
      ),
      executiveSummary: longExecutiveSummary,
      metrics: baseDocument.metrics.map((metric) =>
        metric.label === "Rw" ? { ...metric, value: "59 dB" } : metric
      ),
      primaryMetricValue: "59 dB",
      proposalRevision: "Rev 02",
      reportAdjustments: [
        {
          afterValue: "59 dB",
          appliedAtIso: "2026-06-16T08:30:00.000Z",
          beforeValue: "61 dB",
          engineValuePreserved: true,
          id: "adjustment-1",
          label: "Rw",
          metricId: "output:Rw",
          reason: "Report-only client adjustment.",
          scope: "saved_snapshot",
          source: "assistant"
        }
      ],
      warnings: ["Manual report override is active."]
    };
    const context = buildReportAssistantContext({
      baseDocument,
      createdAtIso: "2026-06-16T08:30:00.000Z",
      document
    });
    const comparison = context.documentComparisonSummaries[0];
    const serializedComparison = JSON.stringify(comparison);
    const parsed = parseReportAssistantContextPayload(JSON.parse(JSON.stringify(context)));

    expect(comparison).toMatchObject({
      adjustmentSummary: {
        assistantAdjustmentCount: 1,
        latestAppliedAtIso: "2026-06-16T08:30:00.000Z",
        totalAdjustmentCount: 1
      },
      from: {
        kind: "generated_baseline",
        proposalRevision: "Rev 01"
      },
      kind: "current_draft_vs_generated_baseline",
      status: "available",
      to: {
        kind: "current_browser_draft",
        proposalRevision: "Rev 02"
      }
    });
    expect(comparison?.metricDisplayValueChanges).toContainEqual(expect.objectContaining({
      afterValue: "59 dB",
      beforeValue: "61 dB",
      metricId: "output:Rw"
    }));
    expect(comparison?.countChanges).toEqual(expect.arrayContaining([
      {
        afterCount: 1,
        beforeCount: 0,
        field: "assumptions"
      },
      {
        afterCount: 1,
        beforeCount: 0,
        field: "warnings"
      }
    ]));
    expect(comparison?.textFieldSummaries).toEqual(expect.arrayContaining([
      expect.objectContaining({
        afterLength: longExecutiveSummary.length,
        beforeLength: baseDocument.executiveSummary.length,
        field: "executiveSummary"
      }),
      expect.objectContaining({
        afterLength: longBriefNote.length,
        beforeLength: baseDocument.briefNote.length,
        field: "briefNote"
      })
    ]));
    expect(comparison?.topLevelFieldChanges).toContain("proposalRevision");
    expect(serializedComparison).not.toContain(longExecutiveSummary);
    expect(serializedComparison).not.toContain(longBriefNote);
    expect(parsed?.documentComparisonSummaries).toEqual(context.documentComparisonSummaries);
  });

  it("carries read-only preset library summaries without preset snapshots", () => {
    const context = buildReportAssistantContext({
      createdAtIso: "2026-06-16T09:45:00.000Z",
      document: documentWithLayer({
        label: "Concrete slab",
        surfaceMassLabel: "480 kg/m2",
        thicknessLabel: "200 mm"
      })
    });
    const serialized = JSON.stringify(context.presetLibrarySummary);
    const parsed = parseReportAssistantContextPayload(JSON.parse(JSON.stringify(context)));

    expect(context.presetLibrarySummary).toMatchObject({
      commonPresetCount: expect.any(Number),
      recentUserPresets: []
    });
    expect(context.presetLibrarySummary?.commonPresets[0]).toMatchObject({
      hasCustomMaterials: false,
      hasVisualOverrides: false,
      kind: "common",
      layerCount: expect.any(Number),
      presetRoute: "wall",
      selectedOutputCount: expect.any(Number)
    });
    expect(serialized).not.toContain("snapshot");
    expect(serialized).not.toContain("sourceUrl");
    expect(parsed?.presetLibrarySummary).toEqual(context.presetLibrarySummary);
  });

  it("does not turn blocked coverage display values into calculator-backed numeric evidence", () => {
    const baseDocument = documentWithLayer({
      label: "Concrete slab",
      surfaceMassLabel: "480 kg/m2",
      thicknessLabel: "200 mm"
    });
    const document: SimpleWorkbenchProposalDocument = {
      ...baseDocument,
      coverageItems: baseDocument.coverageItems.map((item) =>
        item.label === "Rw"
          ? {
              ...item,
              detail: "Cavity depth is missing.",
              engineDisplayValue: "99 dB",
              postureDetail: "Needs input before calculation.",
              postureLabel: "Needs input",
              postureTone: "warning",
              status: "needs_input",
              value: "99 dB"
            }
          : item
      ),
      metrics: baseDocument.metrics.filter((metric) => metric.label !== "Rw"),
      primaryMetricLabel: "Rw",
      primaryMetricValue: "Needs input"
    };

    const context = buildReportAssistantContext({
      baseDocument,
      createdAtIso: "2026-06-22T09:00:00.000Z",
      document
    });
    const rwMetric = context.metrics.find((metric) => metric.id === getReportAssistantMetricId("Rw"));
    const rwFact = context.assistantOutputFacts.find((fact) => fact.metricId === getReportAssistantMetricId("Rw"));

    expect(rwMetric).toMatchObject({
      reportDisplayValue: "99 dB",
      status: "needs_input"
    });
    expect(rwMetric?.engineDisplayValue).toBeUndefined();
    expect(rwMetric?.numericDb).toBeUndefined();
    expect(rwFact).toMatchObject({
      basisCategory: "needs_input",
      reportDisplayValue: "99 dB",
      status: "needs_input"
    });
    expect(rwFact?.engineDisplayValue).toBeUndefined();
    expect(rwFact?.valuePinDb).toBeUndefined();
    expect(rwFact?.usedInputs.join(" ")).not.toContain("value pin");
  });
});
