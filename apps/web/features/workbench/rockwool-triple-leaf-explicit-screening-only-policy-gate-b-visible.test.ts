import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import {
  FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD,
  FIELD_OUTPUT_OWNER_POLICY_GUARD
} from "./field-output-owner-policy-copy";
import {
  ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD,
  ROCKWOOL_TRIPLE_LEAF_FIELD_CONTINUATION_GUARD,
  ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL
} from "./rockwool-triple-leaf-screening-policy-copy";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import {
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalCoverageItem,
  type SimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalLayer,
  type SimpleWorkbenchProposalMetric
} from "./simple-workbench-proposal";
import {
  buildWorkbenchWallTopology,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import type { LayerDraft } from "./workbench-store";

const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy",
  numericRuntimeBehaviorChange: false,
  outputCardCopyChange: true,
  outputCardStatusChange: false,
  proposalReportCopyChange: true,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  selectedNextFile:
    "packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts",
  selectionStatus:
    "gate_b_pinned_visible_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_gate_c_closeout",
  sliceId: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
  supportPromotion: false,
  visibleCopyChange: true,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-screening-policy-copy.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_B_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_B_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const VISIBLE_ROCKWOOL_SCREENING_POLICY_ARTIFACTS = [
  "visible_rockwool_screening_only_policy_guard",
  "rockwool_output_card_screening_only_copy",
  "rockwool_proposal_report_screening_only_copy",
  "rockwool_field_continuation_screening_bridge",
  "rockwool_non_target_boundary_copy_guard",
  "selected_gate_c_closeout_or_next_slice_with_target_file"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const SPLIT_ROCKWOOL_SWAPPED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const ORDINARY_DOUBLE_LEAF_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const COMPLETE_TRIPLE_LEAF_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "porous_absorptive",
  airborneWallCavity1DepthMm: "50",
  airborneWallCavity1FillCoverage: "full",
  airborneWallCavity1LayerIndices: "4",
  airborneWallCavity2AbsorptionClass: "porous_absorptive",
  airborneWallCavity2DepthMm: "50",
  airborneWallCavity2FillCoverage: "full",
  airborneWallCavity2LayerIndices: "6",
  airborneWallInternalLeafCoupling: "independent",
  airborneWallInternalLeafLayerIndices: "5",
  airborneWallSideALeafLayerIndices: "1, 2, 3",
  airborneWallSideBLeafLayerIndices: "7, 8, 9",
  airborneWallSupportTopology: "independent_frames",
  airborneWallTopologyMode: "grouped_triple_leaf"
};

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const TRIPLE_LEAF_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function withIds(rows: readonly Omit<LayerDraft, "id">[], scenarioId: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${scenarioId}-${index + 1}`
  }));
}

function completeTripleLeafContext(base: AirborneContext): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(
    COMPLETE_TRIPLE_LEAF_TOPOLOGY_DRAFT,
    SPLIT_ROCKWOOL_ROWS.length
  );

  if (!wallTopology) {
    throw new Error("Complete triple-leaf wall topology did not build.");
  }

  return {
    ...base,
    wallTopology
  };
}

function evaluate(input: {
  airborneContext: AirborneContext;
  id: string;
  outputs: readonly RequestedOutputId[];
  rows: readonly Omit<LayerDraft, "id">[];
}) {
  const rows = withIds(input.rows, input.id);
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: input.outputs
  });

  expect(scenario.result, `${input.id} should evaluate`).not.toBeNull();

  if (!scenario.result) {
    throw new Error(`${input.id} did not evaluate.`);
  }

  const cards = new Map(
    input.outputs.map((output) => [
      output,
      addOutputCardPosture(
        buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "wall"
        }),
        { result: scenario.result, studyMode: "wall" }
      )
    ])
  );

  return {
    cards,
    result: scenario.result,
    rows,
    warnings: scenario.warnings
  };
}

function getCard(cards: ReadonlyMap<RequestedOutputId, OutputCardModel>, output: RequestedOutputId): OutputCardModel {
  const card = cards.get(output);

  if (!card) {
    throw new Error(`Missing ${output} card`);
  }

  return card;
}

function buildCoverageItems(input: {
  cards: ReadonlyMap<RequestedOutputId, OutputCardModel>;
  outputs: readonly RequestedOutputId[];
}): readonly SimpleWorkbenchProposalCoverageItem[] {
  return input.outputs.map((output) => {
    const card = getCard(input.cards, output);

    return {
      detail: card.detail,
      label: card.label,
      postureDetail: card.postureDetail,
      postureLabel: card.postureLabel,
      postureTone: card.postureTone,
      status: card.status,
      value: card.value
    };
  });
}

function buildProposalLayers(rows: readonly LayerDraft[]): readonly SimpleWorkbenchProposalLayer[] {
  return rows.map((row, index) => ({
    categoryLabel: "Visible wall layer",
    index: index + 1,
    label: row.materialId,
    thicknessLabel: `${row.thicknessMm} mm`
  }));
}

function buildProposalText(input: {
  cards: ReadonlyMap<RequestedOutputId, OutputCardModel>;
  outputs: readonly RequestedOutputId[];
  primaryOutput: RequestedOutputId;
  rows: readonly LayerDraft[];
  warnings: readonly string[];
}): string {
  const coverageItems = buildCoverageItems({
    cards: input.cards,
    outputs: input.outputs
  });
  const primaryCard = getCard(input.cards, input.primaryOutput);
  const metrics = coverageItems
    .filter((item) => item.status === "live" || item.status === "bound")
    .map(
      (item): SimpleWorkbenchProposalMetric => ({
        detail: item.detail,
        label: item.label,
        value: item.value
      })
    );
  const document = {
    assemblyHeadline: "Rockwool grouped triple-leaf source-gated prediction policy rehearsal",
    assumptionItems: [
      {
        detail: ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD,
        label: "Rockwool policy",
        tone: "warning"
      }
    ],
    approverTitle: "Acoustic Consultant",
    briefNote: "Visible source-gated prediction copy rehearsal only.",
    clientName: "DynEcho internal",
    consultantAddress: "Office address not entered",
    consultantCompany: "DynEcho",
    consultantEmail: "acoustics@example.test",
    consultantLogoDataUrl: "",
    consultantPhone: "Contact phone not entered",
    consultantWordmarkLine: "",
    contextLabel: "Building prediction",
    coverageItems,
    corridorDossierCards: [],
    corridorDossierHeadline: "Corridor dossier",
    citations: [],
    decisionTrailHeadline: "Visible policy decision",
    decisionTrailItems: [
      {
        detail:
          "Gate G now reports Rockwool grouped triple-leaf through a labelled family physics prediction; measured-exact and source-validated promotion remain blocked.",
        label: "Gate G policy",
        tone: "warning"
      }
    ],
    dynamicBranchDetail: "Rockwool triple-leaf uses the source-gated two-cavity family physics prediction.",
    dynamicBranchLabel: "Multi-Leaf / Multi-Cavity",
    executiveSummary: "Rockwool triple-leaf values are source-gated family physics predictions and not design-grade.",
    issuedOnIso: "2026-05-05T00:00:00.000Z",
    issuedOnLabel: "5 May 2026",
    issueBaseReference: "RW-BASE-000",
    issueCodePrefix: "RW",
    issueNextReference: "RW-001",
    issueRegisterItems: [],
    layers: buildProposalLayers(input.rows),
    methodDossierCards: [],
    methodDossierHeadline: "Method dossier",
    methodTraceGroups: [],
    metrics,
    preparedBy: "DynEcho",
    primaryMetricLabel: primaryCard.label,
    primaryMetricValue: primaryCard.value,
    projectName: "Rockwool triple-leaf source-gated prediction policy",
    proposalAttention: "Internal reviewer",
    proposalIssuePurpose: "Visible source-gated prediction guard",
    proposalRecipient: "DynEcho internal",
    proposalReference: "RW-SCREENING-001",
    proposalRevision: "Rev 00",
    proposalSubject: "Rockwool triple-leaf visible source-gated prediction policy",
    proposalValidityNote:
      "This issue is for internal screening visibility and does not replace accredited laboratory, site, or design-grade field measurements.",
    recommendationItems: [
      {
        detail: "Keep Uris/source packet acquisition blocked until a rights-safe source-owned curve payload exists.",
        label: "Do not promote exact runtime",
        tone: "warning"
      }
    ],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Option screening",
    studyModeLabel: "Wall",
    validationDetail: "Visible Rockwool source-gated prediction guard with exact/source validation still blocked.",
    validationLabel: "Scoped estimate",
    warnings: input.warnings
  } satisfies SimpleWorkbenchProposalDocument;

  return buildSimpleWorkbenchProposalText(document);
}

describe("Rockwool triple-leaf explicit screening-only policy Gate B visible guard", () => {
  it("lands Gate B as visible copy only and selects Gate C closeout", () => {
    expect(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_B).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardCopyChange: true,
      outputCardStatusChange: false,
      proposalReportCopyChange: true,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      supportPromotion: false,
      visibleCopyChange: true,
      workbenchInputBehaviorChange: false
    });

    expect(VISIBLE_ROCKWOOL_SCREENING_POLICY_ARTIFACTS).toEqual([
      "visible_rockwool_screening_only_policy_guard",
      "rockwool_output_card_screening_only_copy",
      "rockwool_proposal_report_screening_only_copy",
      "rockwool_field_continuation_screening_bridge",
      "rockwool_non_target_boundary_copy_guard",
      "selected_gate_c_closeout_or_next_slice_with_target_file"
    ]);
    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    expect(existsSync(join(REPO_ROOT, ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_B.selectedNextFile))).toBe(true);
  });

  it("pins grouped Rockwool Rw 50 output card copy as source-gated prediction, not exact or design-grade", () => {
    const snapshot = evaluate({
      airborneContext: completeTripleLeafContext(WALL_LAB_CONTEXT),
      id: "gate-b-rockwool-grouped-lab",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });
    const rwCard = getCard(snapshot.cards, "Rw");

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(rwCard).toMatchObject({
      detail: ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD,
      postureLabel: ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL,
      status: "live",
      value: "50 dB"
    });
    expect(rwCard.postureDetail).toContain(ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD);
    expect(rwCard.postureDetail).toContain("No exact wall source row is active");
    expect(rwCard.detail).toContain("not measured exact");
    expect(rwCard.detail).toContain("not source-validated");
    expect(rwCard.detail).toContain("not design-grade");
    expect(snapshot.warnings.join("\n")).toContain("Grouped Rockwool triple-leaf family physics prediction");
    expect(snapshot.warnings.join("\n")).toContain("5 dB uncalibrated error budget");
  });

  it("keeps Rockwool flat-list adjacent swaps on the double-leaf numeric lane, not screening-only copy", () => {
    const snapshot = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "gate-b-rockwool-flat-list-fail-closed",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_SWAPPED_ROWS
    });
    const rwCard = getCard(snapshot.cards, "Rw");

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(rwCard).toMatchObject({
      postureLabel: "Airborne screening lane",
      status: "live",
      value: "51 dB"
    });
    expect(rwCard.detail).toContain("active airborne calculator");
    expect(rwCard.postureDetail).toContain("No exact wall source row is active");
    expect(snapshot.warnings.join("\n")).toContain("Flat-list adjacent-swap sensitivity guard");
    expect(snapshot.warnings.join("\n")).toContain("kept the current double-leaf numeric lane");
  });

  it("pins Rockwool field outputs as continuations from the source-gated prediction lane", () => {
    const snapshot = evaluate({
      airborneContext: completeTripleLeafContext(TRIPLE_LEAF_FIELD_CONTEXT),
      id: "gate-b-rockwool-grouped-field",
      outputs: WALL_FIELD_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });
    const rwPrime = getCard(snapshot.cards, "R'w");
    const dnTw = getCard(snapshot.cards, "DnT,w");

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(rwPrime).toMatchObject({
      postureLabel: "Field continuation",
      status: "live",
      value: "49 dB"
    });
    expect(dnTw).toMatchObject({
      postureLabel: "Field continuation",
      status: "live",
      value: "50 dB"
    });

    for (const card of [rwPrime, dnTw]) {
      expect(card.detail).toContain(ROCKWOOL_TRIPLE_LEAF_FIELD_CONTINUATION_GUARD);
      expect(card.detail).toContain(FIELD_OUTPUT_OWNER_POLICY_GUARD);
      expect(card.detail).toContain("not exact");
      expect(card.detail).toContain("not design-grade");
      expect(card.postureDetail).toContain(FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD);
    }
  });

  it("carries the Rockwool source-gated prediction policy into proposal/report text", () => {
    const lab = evaluate({
      airborneContext: completeTripleLeafContext(WALL_LAB_CONTEXT),
      id: "gate-b-rockwool-lab-report",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });
    const field = evaluate({
      airborneContext: completeTripleLeafContext(TRIPLE_LEAF_FIELD_CONTEXT),
      id: "gate-b-rockwool-field-report",
      outputs: WALL_FIELD_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });

    const labText = buildProposalText({
      cards: lab.cards,
      outputs: WALL_LAB_OUTPUTS,
      primaryOutput: "Rw",
      rows: lab.rows,
      warnings: lab.warnings
    });
    const fieldText = buildProposalText({
      cards: field.cards,
      outputs: WALL_FIELD_OUTPUTS,
      primaryOutput: "DnT,w",
      rows: field.rows,
      warnings: field.warnings
    });

    expect(labText).toContain(`Rw: Live now | ${ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL} | 50 dB`);
    expect(labText).toContain(ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD);
    expect(labText).toContain("not measured exact");
    expect(labText).toContain("not source-validated");
    expect(labText).toContain("not design-grade");
    expect(fieldText).toContain("R'w: Live now | Field continuation | 49 dB");
    expect(fieldText).toContain("DnT,w: Live now | Field continuation | 50 dB");
    expect(fieldText).toContain(ROCKWOOL_TRIPLE_LEAF_FIELD_CONTINUATION_GUARD);
    expect(fieldText).toContain(FIELD_OUTPUT_OWNER_POLICY_GUARD);
    expect(fieldText).toContain("does not replace accredited laboratory, site, or design-grade field measurements");
  });

  it("keeps non-target Rockwool double-leaf rows on existing generic copy", () => {
    const snapshot = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "gate-b-rockwool-double-leaf-boundary",
      outputs: WALL_LAB_OUTPUTS,
      rows: ORDINARY_DOUBLE_LEAF_ROWS
    });
    const rwCard = getCard(snapshot.cards, "Rw");

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "double_leaf"
    });
    expect(rwCard).toMatchObject({
      postureLabel: "Airborne screening lane",
      status: "live"
    });
    expect(rwCard.detail).not.toContain("Rockwool grouped triple-leaf");
    expect(rwCard.postureDetail).not.toContain(ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD);
  });

  it("keeps docs aligned with Gate B visible policy and selected Gate C closeout", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_B.selectionStatus);
      expect(contents).toContain(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_B.selectedNextFile);
      expect(contents).toContain(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_B.selectedNextAction);

      for (const token of VISIBLE_ROCKWOOL_SCREENING_POLICY_ARTIFACTS) {
        expect(contents, `${relativePath} missing ${token}`).toContain(token);
      }
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts"
    );
  });
});
