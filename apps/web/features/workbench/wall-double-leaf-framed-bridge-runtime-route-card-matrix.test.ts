import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING
} from "@dynecho/engine";
import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { evaluateScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import {
  buildSimpleWorkbenchProposalHtml,
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalCoverageItem,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";
import type { LayerDraft } from "./workbench-store";

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ROWS: readonly LayerDraft[] = [
  { id: "gate-s-side-a-board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "gate-s-cavity-fill", materialId: "rockwool", thicknessMm: "90" },
  { id: "gate-s-side-b-board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const COMPLETE_DOUBLE_LEAF_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

function evaluateDoubleLeafRoute(airborneContext: AirborneContext) {
  const scenario = evaluateScenario({
    airborneContext,
    calculator: "dynamic",
    id: "gate-s-double-leaf-framed",
    name: "Gate S double-leaf framed bridge runtime",
    rows: DOUBLE_LEAF_ROWS,
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  expect(scenario.result).not.toBeNull();

  if (!scenario.result) {
    throw new Error("Gate S double-leaf/framed route did not evaluate.");
  }

  const cards = new Map(
    WALL_OUTPUTS.map((output) => [
      output,
      addOutputCardPosture(buildOutputCard({ output, result: scenario.result, studyMode: "wall" }), {
        result: scenario.result,
        studyMode: "wall"
      })
    ])
  );

  return {
    branch: getDynamicCalcBranchSummary({ result: scenario.result, studyMode: "wall" }),
    cards,
    result: scenario.result,
    warnings: scenario.warnings
  };
}

function coverageItemsFrom(cards: readonly OutputCardModel[]): SimpleWorkbenchProposalCoverageItem[] {
  return cards.map((card) => ({
    detail: card.detail,
    label: card.label,
    nextStep: card.status === "needs_input" ? "Complete the missing physical input before issuing this metric." : undefined,
    postureDetail: card.postureDetail,
    postureLabel: card.postureLabel,
    postureTone: card.postureTone,
    status: card.status,
    value: card.value
  }));
}

function buildProposalDocument(input: {
  branch: ReturnType<typeof getDynamicCalcBranchSummary>;
  cards: readonly OutputCardModel[];
  validationDetail: string;
}): SimpleWorkbenchProposalDocument {
  const coverageItems = coverageItemsFrom(input.cards);
  const hasLiveRw = coverageItems.some((item) => item.label === "Rw" && item.status === "live");
  const routeParked = !coverageItems.some((item) => item.status === "live");

  return {
    assemblyHeadline: "Explicit double-leaf/framed wall runtime snapshot.",
    assumptionItems: [
      {
        detail: "Exact source rows can override this lane only when topology, material, metric, and tolerance owners match.",
        label: "Source precedence",
        tone: "accent"
      }
    ],
    approverTitle: "Lead Acoustic Consultant",
    briefNote: "Gate S runtime parity package.",
    citations: [],
    clientName: "Machinity Acoustics",
    consultantAddress: "Istanbul",
    consultantCompany: "Machinity Acoustic Consultants",
    consultantEmail: "offers@example.test",
    consultantLogoDataUrl: "",
    consultantPhone: "+90 000 000 00 00",
    consultantWordmarkLine: "Building Acoustics",
    corridorDossierCards: [],
    corridorDossierHeadline: "Double-leaf/framed family physics prediction is active without exact source promotion.",
    contextLabel: "Element lab",
    coverageItems,
    decisionTrailHeadline: routeParked
      ? "Gate S runtime is parked until required physical inputs are complete."
      : "Gate S selected the bridge solver runtime candidate.",
    decisionTrailItems: [
      {
        detail: routeParked
          ? "Needs-input wins before any numeric candidate can be issued."
          : "Source absence blocks exact/calibrated promotion, not the formula-backed prediction.",
        label: "Candidate resolver",
        tone: "accent"
      }
    ],
    dynamicBranchDetail: input.branch.detail,
    dynamicBranchLabel: input.branch.value,
    executiveSummary: hasLiveRw
      ? "The explicit double-leaf/framed stack currently reads Rw 45 dB from the Gate S family solver."
      : "The explicit double-leaf/framed stack is waiting for required physical input before a Gate S family solver value is issued.",
    issueBaseReference: "MAC-GATE-S-20260506",
    issueNextReference: "MAC-GATE-S-20260506-01",
    issueRegisterItems: [],
    issuedOnIso: "2026-05-06T12:00:00.000Z",
    issuedOnLabel: "06 May 2026",
    layers: [
      {
        categoryLabel: "lining",
        densityLabel: "850 kg/m2 basis",
        index: 1,
        label: "Gypsum board",
        roleLabel: "Side A leaf",
        surfaceMassLabel: "10.6 kg/m2",
        thicknessLabel: "12.5 mm"
      },
      {
        categoryLabel: "porous fill",
        densityLabel: "nominal",
        index: 2,
        label: "Rockwool",
        roleLabel: "Cavity damping",
        surfaceMassLabel: "not primary",
        thicknessLabel: "90 mm"
      },
      {
        categoryLabel: "lining",
        densityLabel: "850 kg/m2 basis",
        index: 3,
        label: "Gypsum board",
        roleLabel: "Side B leaf",
        surfaceMassLabel: "10.6 kg/m2",
        thicknessLabel: "12.5 mm"
      }
    ],
    methodDossierCards: [
      {
        detail: input.branch.detail,
        label: "Dynamic route",
        tone: "accent",
        value: input.branch.value
      }
    ],
    methodDossierHeadline: routeParked
      ? "Double-leaf/framed airborne runtime is waiting for required physical input."
      : "Double-Leaf Bridge Solver is active on the explicit double-leaf/framed wall route.",
    methodTraceGroups: [],
    metrics: input.cards
      .filter((card) => card.status === "live")
      .map((card) => ({
        detail: card.detail,
        label: card.label,
        value: card.value
      })),
    preparedBy: "O. Tuna",
    primaryMetricLabel: "Rw",
    primaryMetricValue: coverageItems[0]?.value ?? "Not ready",
    projectName: "Gate S Dynamic Calculator",
    issueCodePrefix: "MAC",
    proposalAttention: "Internal validation",
    proposalIssuePurpose: "Dynamic calculator Gate S parity validation",
    proposalRecipient: "Machinity",
    proposalReference: "MAC-GATE-S",
    proposalRevision: "Rev 00",
    proposalSubject: "Double-leaf framed bridge runtime",
    proposalValidityNote: "Internal validation snapshot.",
    recommendationItems: [
      {
        detail: "Keep the error budget visible until exact source override or calibrated family rows land.",
        label: "Use with error budget",
        tone: "warning"
      }
    ],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Internal validation",
    studyModeLabel: "Wall",
    validationDetail: input.validationDetail,
    validationLabel: "Family physics prediction",
    warnings: []
  };
}

describe("wall double-leaf/framed bridge runtime route-card Gate S", () => {
  it("shows Gate S runtime values consistently on route card, output cards, and proposal snapshot", () => {
    const snapshot = evaluateDoubleLeafRoute(COMPLETE_DOUBLE_LEAF_CONTEXT);
    const rwCard = snapshot.cards.get("Rw");
    const stcCard = snapshot.cards.get("STC");
    const cCard = snapshot.cards.get("C");
    const ctrCard = snapshot.cards.get("Ctr");

    expect(snapshot.result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(snapshot.result.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(snapshot.result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(snapshot.branch).toMatchObject({
      tone: "neutral",
      value: "Double Frame / Double Stud"
    });
    expect(snapshot.branch.detail).toContain("Double-Leaf Bridge Solver anchor");
    expect(snapshot.branch.detail).toContain("double leaf framed bridge mass air mass runtime");

    expect(rwCard).toMatchObject({ status: "live", value: "45 dB" });
    expect(stcCard).toMatchObject({ status: "live", value: "45 dB" });
    expect(cCard).toMatchObject({ status: "live", value: "-1 dB" });
    expect(ctrCard).toMatchObject({ status: "live", value: "-6.1 dB" });
    expect(rwCard?.postureDetail).toContain("Double Frame / Double Stud");
    expect(rwCard?.postureDetail).toContain("source");
    expect(snapshot.warnings).toContain(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING);

    const cards = [...snapshot.cards.values()];
    const proposal = buildProposalDocument({
      branch: snapshot.branch,
      cards,
      validationDetail:
        "Family physics prediction with a 7 dB uncalibrated error budget. Exact source rows remain higher precedence."
    });
    const text = buildSimpleWorkbenchProposalText(proposal);
    const html = buildSimpleWorkbenchProposalHtml(proposal);

    expect(text).toContain("- Rw: Live now | Airborne screening lane | 45 dB");
    expect(text).toContain("Double-Leaf Bridge Solver anchor");
    expect(text).toContain("Double Frame / Double Stud");
    expect(html).toContain("45 dB");
    expect(html).toContain("Gate S Dynamic Calculator");
  });

  it("parks visible cards and route summary when the resilient bridge side count is missing", () => {
    const snapshot = evaluateDoubleLeafRoute(RESILIENT_MISSING_SIDE_COUNT_CONTEXT);

    expect(snapshot.result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(snapshot.result.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input"
    });
    expect(snapshot.branch).toMatchObject({
      tone: "warning",
      value: "Awaiting physical input"
    });
    expect(snapshot.branch.detail).toContain("resilientBarSideCount");

    for (const output of WALL_OUTPUTS) {
      expect(snapshot.cards.get(output), output).toMatchObject({
        detail: expect.stringContaining("resilientBarSideCount"),
        status: "needs_input",
        value: "Not ready"
      });
    }
    expect(snapshot.warnings).not.toContain(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING);

    const proposal = buildProposalDocument({
      branch: snapshot.branch,
      cards: [...snapshot.cards.values()],
      validationDetail: "Needs resilientBarSideCount before the airborne runtime can defend the route."
    });
    const text = buildSimpleWorkbenchProposalText(proposal);

    expect(text).toContain("- Rw: Needs input | Awaiting route input | Not ready");
    expect(text).toContain("resilientBarSideCount");
    expect(text).not.toContain("currently reads Rw 45 dB");
  });
});
