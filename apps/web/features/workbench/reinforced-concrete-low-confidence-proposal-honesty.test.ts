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

  it("keeps diagnostics evidence explicit on the reinforced-concrete missing-owner branch", () => {
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

    expect(scenario.result?.floorSystemEstimate?.kind).toBeUndefined();
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.dynamicImpactTrace).toBeUndefined();
    expect(selectSimpleWorkbenchTraceNotes(scenario.result?.dynamicImpactTrace?.notes ?? []).notes).toEqual([]);
    expect(branchSummary.value).toBe("Awaiting supported topology");
    expect(branchSummary.detail).toContain("No supported floor impact branch is live yet");
    expect(validationSummary.value).toBe("Waiting for supported lane");
    expect(validationSummary.detail).toContain("Build a supported floor topology");
    expect(evidence.decisionTrailHeadline).toContain("No live lane");
    expect(evidence.decisionTrailItems).toContainEqual(
      expect.objectContaining({
        label: "Output coverage",
        tone: "warning"
      })
    );
    expect(evidence.citations).toHaveLength(1);
    expect(evidence.citations[0]?.label).toBe("Source posture");
    expect(evidence.citations.some((citation) => citation.label === "Estimate anchor 1: Knauf CC60.1A | 150 mm concrete | timber + acoustic underlay")).toBe(
      false
    );
    expect(evidence.citations.some((citation) => citation.detail.includes("estimate anchor rows remain in the current family corridor"))).toBe(false);
    expect(evidence.citations.map((citation) => citation.detail).join(" ")).toContain("No exact family row");
    expect(evidence.citations.map((citation) => citation.detail).join(" ")).not.toContain("Published family estimate is active.");
    expect(dossier.headline).toContain("waiting for supported lane posture");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Validation posture",
          value: "Waiting for supported lane"
        }),
        expect.objectContaining({
          label: "Trace coverage",
          tone: "warning",
          value: "0 live"
        })
      ])
    );
    expect(dossier.cards.find((card) => card.label === "Validation posture")?.detail).toContain(
      "Build a supported floor topology"
    );
    expect(dossier.cards.find((card) => card.label === "Evidence courier")?.detail).toContain(
      "guided package"
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

    expect(brief.executiveSummary).toContain("awaiting supported topology route");
    expect(brief.executiveSummary).toContain("waiting for supported lane posture");
    expect(brief.assumptionItems.find((item) => item.label === "Evidence posture")?.detail).toContain(
      "Waiting for supported lane."
    );
    expect(brief.assumptionItems.find((item) => item.label === "Active route")?.detail).toContain(
      "No supported floor impact branch is live yet"
    );
    expect(brief.assumptionItems.find((item) => item.label === "Live warning state")).toEqual(
      expect.objectContaining({
        tone: "warning"
      })
    );
    expect(brief.assumptionItems.find((item) => item.label === "Live warning state")?.detail).toContain(
      "Screening estimate only"
    );
    expect(brief.assumptionItems.find((item) => item.label === "Citation coverage")).toEqual(
      expect.objectContaining({
        tone: "accent"
      })
    );
    expect(brief.assumptionItems.find((item) => item.label === "Citation coverage")?.detail).toContain(
      "source line"
    );
    expect(brief.recommendationItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Resolve the first live blocker",
          tone: "warning"
        }),
        expect.objectContaining({
          label: "Do not flatten provenance",
          tone: "warning"
        })
      ])
    );
    expect(brief.recommendationItems.find((item) => item.label === "Resolve the first live blocker")?.detail).toContain(
      "Screening estimate only"
    );
    expect(brief.recommendationItems.find((item) => item.label === "Do not flatten provenance")?.detail).toContain(
      "source posture visible"
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
          postureDetail: "Airborne screening remains visible while impact owners are incomplete.",
          postureLabel: "Airborne screening",
          postureTone: "accent",
          status: "live",
          value: "60 dB"
        },
        {
          detail: "Impact rating is parked until the reinforced-concrete owner fields are complete.",
          label: "Ln,w",
          postureDetail: "Missing physical owners are blocking the impact corridor.",
          postureLabel: "Waiting for supported lane",
          postureTone: "warning",
          status: "needs_input",
          value: "Not ready"
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

    expect(dossier.headline).toContain("awaiting supported topology");
    expect(dossier.items.find((item) => item.label === "Coverage posture")?.value).toBe("1 ready / 2 parked");
    expect(dossier.items.find((item) => item.label === "Audit package")?.detail).toContain("1 citation");
  });

  it("keeps trace lineage and report wording on missing physical owners instead of nearby published rows", () => {
    const { scenario } = buildReinforcedConcreteLowConfidenceScenario();
    vi.stubGlobal("React", React);
    const traceHtml = renderToStaticMarkup(React.createElement(ImpactTracePanel, { result: scenario.result }));

    expect(traceHtml).toContain("Future supported outputs");
    expect(traceHtml).toContain("Ln,w");
    expect(traceHtml).toContain("reinforced-concrete combined upper/lower impact runtime is waiting");
    expect(traceHtml).not.toContain("Nearby published rows");
    expect(traceHtml).not.toContain("Nearby row 1 · elastic-ceiling anchor");

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

    expect(report).toContain("- Predictor active: yes");
    expect(report).toContain("- Predictor input mode: derived_from_visible_layers");
    expect(report).toContain(
      "- Predictor warning: Dynamic Calculator reinforced-concrete combined upper/lower impact runtime is waiting for dynamic stiffness, load basis before promoting Ln,w / DeltaLw from the heavy-concrete combined formula corridor."
    );
    expect(report).not.toContain("- Low-confidence fallback family: reinforced concrete");
    expect(report).not.toContain("- Nearby published rows:");
    expect(report).not.toContain("- Impact nearby published row ids:");
    expect(report).not.toContain("- Source rows:");
    expect(report).not.toContain("- Impact estimate candidate ids:");
  });
});
