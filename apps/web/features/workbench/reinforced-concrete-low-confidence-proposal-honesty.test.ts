import { afterEach, describe, expect, it, vi } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { buildSimpleWorkbenchDiagnosticsDossier } from "./simple-workbench-diagnostics-dossier";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { buildSimpleWorkbenchProposalBrief } from "./simple-workbench-proposal-brief";
import { buildSimpleWorkbenchProposalDossier } from "./simple-workbench-proposal-dossier";
import { evaluateScenario } from "./scenario-analysis";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import { getPresetById } from "./preset-definitions";
import { ImpactTracePanel } from "./impact-trace-panel";
import { selectSimpleWorkbenchTraceNotes } from "./simple-workbench-trace-notes";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w"] as const;

const REINFORCED_CONCRETE_LOW_CONFIDENCE_ROWS = [
  { id: "rc-low-1", materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
  { id: "rc-low-2", materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
  { id: "rc-low-3", materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" },
  { id: "rc-low-4", materialId: "resilient_channel", thicknessMm: "120", floorRole: "ceiling_cavity" },
  { id: "rc-low-5", materialId: "glasswool", thicknessMm: "100", floorRole: "ceiling_fill" },
  { id: "rc-low-6", materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
  { id: "rc-low-7", materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" }
] as const;

function buildReinforcedConcreteLowConfidenceScenario() {
  const scenario = evaluateScenario({
    id: "reinforced-concrete-low-confidence-proposal",
    name: "Reinforced Concrete Low-Confidence Proposal Guard",
    rows: REINFORCED_CONCRETE_LOW_CONFIDENCE_ROWS,
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
  const branchSummary = getDynamicCalcBranchSummary({
    result: scenario.result,
    studyMode: "floor"
  });
  const validationSummary = getGuidedValidationSummary({
    result: scenario.result,
    studyMode: "floor"
  });
  const evidence = buildSimpleWorkbenchEvidencePacket({
    outputs: TARGET_OUTPUTS,
    result: scenario.result,
    warnings: scenario.warnings
  });

  return {
    branchSummary,
    evidence,
    scenario,
    validationSummary
  };
}

describe("reinforced concrete low-confidence proposal honesty", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps diagnostics evidence explicit on the low-confidence fallback branch", () => {
    const { branchSummary, evidence, scenario, validationSummary } = buildReinforcedConcreteLowConfidenceScenario();
    const dossier = buildSimpleWorkbenchDiagnosticsDossier({
      branchLabel: branchSummary.value,
      citations: evidence.citations,
      decisionTrailHeadline: evidence.decisionTrailHeadline,
      decisionTrailItems: evidence.decisionTrailItems,
      result: scenario.result,
      validationDetail: validationSummary.detail,
      validationLabel: validationSummary.value,
      warnings: scenario.warnings
    });

    expect(scenario.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(scenario.result?.dynamicImpactTrace?.selectionKindLabel).toBe("Low-confidence fallback");
    expect(selectSimpleWorkbenchTraceNotes(scenario.result?.dynamicImpactTrace?.notes ?? []).notes).toContain(
      "Low-confidence fallback is active on the current impact lane."
    );
    expect(branchSummary.detail).toContain("Low-confidence reinforced-concrete combined fallback is active.");
    expect(validationSummary.value).toBe("Low-confidence fallback");
    expect(validationSummary.detail).toContain("mixed nearby-row concrete lane");
    expect(evidence.decisionTrailHeadline).toContain("screening posture");
    expect(evidence.decisionTrailItems).toContainEqual(
      expect.objectContaining({
        label: "Delivery posture",
        tone: "warning"
      })
    );
    expect(evidence.decisionTrailItems).toContainEqual(
      expect.objectContaining({
        label: "Output coverage",
        tone: "warning"
      })
    );
    expect(evidence.citations.length).toBeGreaterThan(0);
    expect(evidence.citations[0]?.label).toBe("Dynamic impact anchor");
    expect(evidence.citations[1]?.label).toBe("Nearby-row fallback rationale");
    expect(
      evidence.citations.some((citation) =>
        citation.label.startsWith("Nearby row 1 · elastic-ceiling anchor:")
      )
    ).toBe(true);
    expect(
      evidence.citations.some((citation) =>
        citation.label.startsWith("Nearby row 2 · rigid-ceiling cross-check:")
      )
    ).toBe(true);
    expect(evidence.citations.some((citation) => citation.label === "Estimate anchor 1: Knauf CC60.1A | 150 mm concrete | timber + acoustic underlay")).toBe(
      false
    );
    expect(evidence.citations.some((citation) => citation.detail.includes("estimate anchor rows remain in the current family corridor"))).toBe(false);
    expect(evidence.citations.map((citation) => citation.detail).join(" ")).toContain("proxy airborne companions");
    expect(evidence.citations.map((citation) => citation.detail).join(" ")).toContain(
      "Nearby published rows ranked for the current mixed-row fallback"
    );
    expect(evidence.citations.map((citation) => citation.detail).join(" ")).not.toContain("Published family estimate is active.");
    expect(dossier.headline).toContain("screening-route low-confidence posture");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Validation posture",
          value: "Low-confidence fallback"
        }),
        expect.objectContaining({
          label: "Trace coverage",
          tone: "accent",
          value: "1 screening"
        })
      ])
    );
    expect(dossier.cards.find((card) => card.label === "Validation posture")?.detail).toContain(
      "proxy airborne companions"
    );
    expect(dossier.cards.find((card) => card.label === "Evidence courier")?.detail).toContain(
      "screening package"
    );
  });

  it("keeps proposal brief screening language explicit for the same runtime scenario", () => {
    const { branchSummary, evidence, scenario, validationSummary } = buildReinforcedConcreteLowConfidenceScenario();
    const brief = buildSimpleWorkbenchProposalBrief({
      briefNote: "Keep the current route as an option-screening readout until a narrower reinforced-concrete family lane is proven.",
      citations: evidence.citations,
      consultantCompany: "Machinity Acoustic Consultants",
      contextLabel: "Building prediction",
      dynamicBranchDetail: branchSummary.detail,
      dynamicBranchLabel: branchSummary.value,
      issueCodePrefix: "MAC",
      issuedOnIso: "2026-04-17T09:30:00.000Z",
      primaryMetricLabel: "Ln,w",
      primaryMetricValue: `${scenario.result?.impact?.LnW ?? "Not ready"} dB`,
      projectName: "Reinforced Concrete Accuracy Tightening",
      reportProfileLabel: "Consultant issue",
      studyContextLabel: "Option screening",
      studyModeLabel: "Floor",
      validationDetail: validationSummary.detail,
      validationLabel: validationSummary.value,
      validationTone: validationSummary.tone,
      warnings: scenario.warnings
    });

    expect(brief.executiveSummary).toContain("screening-only low-confidence fallback route");
    expect(brief.executiveSummary).toContain("nearby-row citations are attached");
    expect(brief.assumptionItems.find((item) => item.label === "Evidence posture")?.detail).toContain(
      "Low-confidence fallback."
    );
    expect(brief.assumptionItems.find((item) => item.label === "Active route")?.detail).toContain(
      "mixed nearby-row concrete lane"
    );
    expect(brief.assumptionItems.find((item) => item.label === "Live warning state")).toEqual(
      expect.objectContaining({
        tone: "warning"
      })
    );
    expect(brief.assumptionItems.find((item) => item.label === "Live warning state")?.detail).toContain(
      "screening-only fallback mode"
    );
    expect(brief.assumptionItems.find((item) => item.label === "Citation coverage")).toEqual(
      expect.objectContaining({
        tone: "accent"
      })
    );
    expect(brief.assumptionItems.find((item) => item.label === "Citation coverage")?.detail).toContain(
      "screening audit follow-up"
    );
    expect(brief.recommendationItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Keep screening language explicit",
          tone: "warning"
        }),
        expect.objectContaining({
          label: "Carry the nearby-row appendix",
          tone: "accent"
        })
      ])
    );
    expect(brief.recommendationItems.find((item) => item.label === "Keep screening language explicit")?.detail).toContain(
      "Use this only for option screening"
    );
    expect(brief.recommendationItems.find((item) => item.label === "Keep screening language explicit")?.detail).toContain(
      "do not present it as delivery-ready"
    );
    expect(brief.recommendationItems.find((item) => item.label === "Carry the nearby-row appendix")?.detail).toContain(
      "screening package"
    );
    expect(brief.recommendationItems.find((item) => item.label === "Resolve the first live blocker")?.detail).toContain(
      "Keep the package in screening mode"
    );
    expect(brief.recommendationItems.some((item) => item.label === "Keep the stack as a screening snapshot")).toBe(false);
    expect(brief.recommendationItems.some((item) => item.label === "Freeze the current stack")).toBe(false);
    expect(brief.recommendationItems.some((item) => item.label === "Attach the citation appendix")).toBe(false);

    const dossier = buildSimpleWorkbenchProposalDossier({
      approverTitle: "Lead Acoustic Consultant",
      assemblyHeadline: "Reinforced concrete low-confidence fallback is active.",
      assumptionItems: brief.assumptionItems,
      briefNote: "",
      citations: evidence.citations,
      clientName: "Test Client",
      consultantAddress: "Address",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "offers@example.com",
      consultantLogoDataUrl: "",
      consultantPhone: "+90",
      consultantWordmarkLine: "",
      contextLabel: "Building prediction",
      coverageItems: [
        {
          detail: "Weighted airborne element rating from the active airborne calculator.",
          label: "Rw",
          postureDetail: "Low-confidence fallback remains explicit.",
          postureLabel: "Low-confidence fallback",
          postureTone: "warning",
          status: "live",
          value: "65.9 dB"
        },
        {
          detail: "Weighted impact rating from the active impact calculator.",
          label: "Ln,w",
          postureDetail: "Low-confidence fallback remains explicit.",
          postureLabel: "Low-confidence fallback",
          postureTone: "warning",
          status: "bound",
          value: "50 dB"
        },
        {
          detail: "Need more project-specific evidence before a narrower lane can be claimed.",
          label: "DnT,w",
          nextStep: "Provide field input",
          postureDetail: "Parked until narrower evidence lands.",
          postureLabel: "Awaiting tighter evidence",
          postureTone: "warning",
          status: "needs_input",
          value: "Not ready"
        }
      ],
      corridorDossierCards: [],
      corridorDossierHeadline: "Low-confidence fallback corridor remains explicit.",
      decisionTrailHeadline: evidence.decisionTrailHeadline,
      decisionTrailItems: evidence.decisionTrailItems,
      dynamicBranchDetail: branchSummary.detail,
      dynamicBranchLabel: branchSummary.value,
      executiveSummary: brief.executiveSummary,
      issueBaseReference: "MAC-RCAT-20260417",
      issueNextReference: "MAC-RCAT-20260417-01",
      issueRegisterItems: [],
      issueCodePrefix: "MAC",
      issuedOnIso: "2026-04-17T09:30:00.000Z",
      issuedOnLabel: "17 April 2026",
      layers: [],
      methodDossierCards: [],
      methodDossierHeadline: "Low-confidence fallback method dossier.",
      methodTraceGroups: [],
      metrics: [],
      preparedBy: "O. Tuna",
      primaryMetricLabel: "Ln,w",
      primaryMetricValue: `${scenario.result?.impact?.LnW ?? "Not ready"} dB`,
      projectName: "Reinforced Concrete Accuracy Tightening",
      proposalAttention: "Design Coordination Team",
      proposalIssuePurpose: "Client review and acoustic coordination",
      proposalRecipient: "Riverside Development Team",
      proposalReference: "MAC-2026-014",
      proposalRevision: "Rev 01",
      proposalSubject: "Reinforced concrete low-confidence proposal",
      proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
      recommendationItems: brief.recommendationItems,
      reportProfile: "consultant",
      reportProfileLabel: "Consultant issue",
      studyContextLabel: "Option screening",
      studyModeLabel: "Floor",
      validationDetail: validationSummary.detail,
      validationLabel: validationSummary.value,
      warnings: scenario.warnings
    });

    expect(dossier.headline).toContain("screening route");
    expect(dossier.headline).toContain("2 screening outputs");
    expect(dossier.items.find((item) => item.label === "Coverage posture")?.value).toBe("2 screening / 1 parked");
    expect(dossier.items.find((item) => item.label === "Audit package")?.detail).toContain("screening package");
  });

  it("keeps trace lineage and report source-row wording on nearby published rows instead of a narrow family claim", () => {
    const { scenario } = buildReinforcedConcreteLowConfidenceScenario();
    vi.stubGlobal("React", React);
    const traceHtml = renderToStaticMarkup(React.createElement(ImpactTracePanel, { result: scenario.result }));

    expect(traceHtml).toContain("Nearby published rows");
    expect(traceHtml).toContain("Nearby row 1 · elastic-ceiling anchor");
    expect(traceHtml).toContain("Nearby row 2 · rigid-ceiling cross-check");
    expect(traceHtml).not.toContain("Candidate lineage");
    expect(traceHtml).toContain("Nearby published rows ranked for the current mixed-row fallback");
    expect(traceHtml).toContain("elastic-ceiling nearby row first");

    const report = composeWorkbenchReport({
      activeCriteriaPack: CRITERIA_PACKS[0],
      activePreset: getPresetById("heavy_concrete_impact_floor"),
      briefNote: "",
      clientName: "Test Client",
      currentScenario: scenario,
      fieldRiskIds: [],
      impactGuide: null,
      impactImprovementBandInput: "",
      impactReference: null,
      impactReferenceDeltaLwDb: "",
      improvementReferenceImpact: null,
      projectName: "Reinforced Concrete Low-Confidence Report",
      reportProfile: "consultant",
      requestedOutputs: TARGET_OUTPUTS,
      savedScenarios: [],
      studyContext: "coordination",
      studyMode: "floor",
      targetLnwDb: "50",
      targetRwDb: "60"
    });

    expect(report).toContain("- Low-confidence fallback family: reinforced concrete");
    expect(report).toContain("- Nearby published rows:");
    expect(report).toContain("Nearby row 1 · elastic-ceiling anchor: 140 mm concrete slab | elastic hanger ceiling | 2 x 13 mm boards");
    expect(report).toContain("Nearby row 3 · farther fallback: Knauf CC60.1A | 150 mm concrete | timber + acoustic underlay");
    expect(report).toContain("- Impact nearby published row ids:");
    expect(report).toContain("- Impact nearby-row ranking: elastic-ceiling row first, rigid-ceiling row second, timber-underlay row held as a farther fallback when cavity and board geometry drift.");
    expect(report).toContain("- Support note: Nearby-row ranking stays elastic-ceiling first, rigid-ceiling second, with timber-underlay held as a farther fallback when cavity and board geometry drift.");
    expect(report).not.toContain("- Source rows:");
    expect(report).not.toContain("- Impact estimate candidate ids:");
  });
});
