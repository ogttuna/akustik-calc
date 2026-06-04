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
});
