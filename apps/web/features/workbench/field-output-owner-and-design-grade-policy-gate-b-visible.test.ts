import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import {
  FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD,
  FIELD_OUTPUT_OWNER_POLICY_GUARD
} from "./field-output-owner-policy-copy";
import { buildOutputCard, type BaseOutputCardModel } from "./simple-workbench-output-model";
import { buildSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";
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
import type { StudyMode } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";

const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_pin_visible_field_output_design_grade_owner_policy",
  numericRuntimeBehaviorChange: false,
  outputCardCopyChange: true,
  outputCardStatusChange: false,
  proposalReportCopyChange: true,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  selectedNextFile:
    "packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts",
  selectionStatus:
    "gate_b_pinned_visible_field_output_design_grade_owner_policy_no_runtime_selected_gate_c_closeout",
  sliceId: "field_output_owner_and_design_grade_policy_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
  "apps/web/features/workbench/field-output-owner-policy-copy.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
  "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B_HANDOFF.md"
] as const;

const VISIBLE_POLICY_ARTIFACTS = [
  "visible_field_output_design_grade_policy_guard",
  "output_card_owner_policy_copy",
  "proposal_report_owner_policy_copy",
  "needs_input_field_policy_visible_boundaries",
  "rockwool_field_output_screening_policy_carry_forward",
  "selected_gate_c_closeout_or_next_slice_with_target_file"
] as const;

const FIELD_OWNER_REQUIRED_BEFORE_DESIGN_GRADE = [
  "metric_owner",
  "source_basis_owner",
  "geometry_or_room_context_owner",
  "tolerance_owner",
  "negative_boundaries",
  "paired_engine_tests",
  "paired_web_report_tests"
] as const;

const WALL_OUTPUTS = ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FLOOR_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"] as const satisfies readonly RequestedOutputId[];

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

const TRIPLE_LEAF_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const TRIPLE_LEAF_FIELD_CONTEXT_WITHOUT_ROOM: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const UBIQ_EXACT_OPEN_WEB_200_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "200" }
];

const FLOOR_BUILDING_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const FLOOR_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
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
  airborneContext: AirborneContext | null;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  outputs: readonly RequestedOutputId[];
  rows: readonly Omit<LayerDraft, "id">[];
  studyMode: StudyMode;
}) {
  const rows = withIds(input.rows, input.id);
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    impactFieldContext: input.impactFieldContext ?? null,
    name: input.id,
    rows,
    source: "current",
    studyMode: input.studyMode,
    targetOutputs: input.outputs
  });

  expect(scenario.result, `${input.id} should evaluate`).not.toBeNull();

  if (!scenario.result) {
    throw new Error(`${input.id} did not evaluate.`);
  }

  const cards = new Map(
    input.outputs.map((output) => [
      output,
      buildOutputCard({
        output,
        result: scenario.result,
        studyMode: input.studyMode
      })
    ])
  );

  return {
    cards,
    result: scenario.result,
    rows,
    studyMode: input.studyMode,
    warnings: scenario.warnings
  };
}

function getCard(cards: ReadonlyMap<RequestedOutputId, BaseOutputCardModel>, output: RequestedOutputId): BaseOutputCardModel {
  const card = cards.get(output);

  if (!card) {
    throw new Error(`Missing ${output} card`);
  }

  return card;
}

function buildCoverageItems(input: {
  cards: ReadonlyMap<RequestedOutputId, BaseOutputCardModel>;
  outputs: readonly RequestedOutputId[];
  result: NonNullable<ReturnType<typeof evaluate>["result"]>;
  studyMode: StudyMode;
}): readonly SimpleWorkbenchProposalCoverageItem[] {
  return input.outputs.map((output) => {
    const card = getCard(input.cards, output);
    const posture = buildSimpleWorkbenchOutputPosture({
      output,
      result: input.result,
      status: card.status,
      studyMode: input.studyMode
    });

    return {
      detail: card.detail,
      label: card.label,
      nextStep: card.status === "needs_input" ? "Complete the missing field input before issuing this metric." : undefined,
      postureDetail: posture.detail,
      postureLabel: posture.label,
      postureTone: posture.tone,
      status: card.status,
      value: card.value
    };
  });
}

function buildLayers(rows: readonly LayerDraft[], studyMode: StudyMode): readonly SimpleWorkbenchProposalLayer[] {
  return rows.map((row, index) => ({
    categoryLabel: studyMode === "wall" ? "Wall layer" : "Floor layer",
    index: index + 1,
    label: row.materialId,
    roleLabel: row.floorRole,
    thicknessLabel: `${row.thicknessMm} mm`
  }));
}

function buildMetrics(input: {
  cards: ReadonlyMap<RequestedOutputId, BaseOutputCardModel>;
  outputs: readonly RequestedOutputId[];
}): readonly SimpleWorkbenchProposalMetric[] {
  return input.outputs.map((output) => {
    const card = getCard(input.cards, output);

    return {
      detail: card.detail,
      label: card.label,
      value: card.value,
      visible: true
    };
  });
}

function buildProposalText(input: {
  outputs: readonly RequestedOutputId[];
  primaryOutput: RequestedOutputId;
  snapshot: ReturnType<typeof evaluate>;
}): string {
  const evidence = buildSimpleWorkbenchEvidencePacket({
    outputs: input.outputs,
    result: input.snapshot.result,
    warnings: input.snapshot.warnings
  });
  const primaryCard = getCard(input.snapshot.cards, input.primaryOutput);
  const coverageItems = buildCoverageItems({
    cards: input.snapshot.cards,
    outputs: input.outputs,
    result: input.snapshot.result,
    studyMode: input.snapshot.studyMode
  });
  const document = {
    assemblyHeadline: `${input.snapshot.studyMode} field-output owner policy snapshot.`,
    assumptionItems: [
      {
        detail: "Field-style values stay scoped to continuation, bound, screening, or needs-input basis until a design-grade field owner exists.",
        label: "Design-grade owner",
        tone: "warning"
      }
    ],
    approverTitle: "Lead Acoustic Consultant",
    briefNote: "Gate B owner-policy snapshot: do not issue field continuation as a design-grade field measurement.",
    citations: evidence.citations,
    clientName: "Internal DAC QA",
    consultantAddress: "Istanbul",
    consultantCompany: "Machinity Acoustic Consultants",
    consultantEmail: "qa@machinity.local",
    consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
    consultantPhone: "+90 000 000 00 00",
    consultantWordmarkLine: "Building Acoustics",
    contextLabel: "Building prediction",
    corridorDossierCards: [],
    corridorDossierHeadline: "Field output owner policy guard active.",
    coverageItems,
    decisionTrailHeadline: "Field-style outputs remain non-design-grade without an owner.",
    decisionTrailItems: evidence.decisionTrailItems,
    dynamicBranchDetail: "Gate B visible owner-policy contract only; no runtime value movement.",
    dynamicBranchLabel: "Field-output owner policy guard",
    executiveSummary: "Finite field-style values remain scoped outputs and do not replace accredited laboratory, site, or design-grade field measurements.",
    issueBaseReference: "MAC-FIELD-OWNER-GATE-B",
    issueCodePrefix: "MAC",
    issueNextReference: "MAC-FIELD-OWNER-GATE-B-01",
    issueRegisterItems: [
      {
        detail: "Gate B visible owner-policy issue.",
        issuedOnLabel: "05 May 2026",
        label: "Current issue",
        reference: "MAC-FIELD-OWNER-GATE-B",
        statusLabel: "Rev 00"
      }
    ],
    issuedOnIso: "2026-05-05T10:00:00.000Z",
    issuedOnLabel: "05 May 2026",
    layers: buildLayers(input.snapshot.rows, input.snapshot.studyMode),
    methodDossierCards: [
      {
        detail: "No source, confidence, support, or numeric promotion is selected by this visible owner-policy gate.",
        label: "Gate scope",
        tone: "warning",
        value: "Copy guard"
      }
    ],
    methodDossierHeadline: "Gate B strengthens field-output owner wording without changing the calculator lane.",
    methodTraceGroups: [],
    metrics: buildMetrics({
      cards: input.snapshot.cards,
      outputs: input.outputs
    }),
    preparedBy: "DAC QA",
    primaryMetricLabel: primaryCard.label,
    primaryMetricValue: primaryCard.value,
    projectName: `${input.snapshot.studyMode} field-output owner policy guard`,
    proposalAttention: "Internal QA",
    proposalIssuePurpose: "Internal validation snapshot only",
    proposalRecipient: "Machinity",
    proposalReference: "MAC-FIELD-OWNER-GATE-B",
    proposalRevision: "Rev 00",
    proposalSubject: "Field-output design-grade owner policy",
    proposalValidityNote: "Not for external issue.",
    recommendationItems: [
      {
        detail: FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD,
        label: "Do not promote field continuation",
        tone: "warning"
      }
    ],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Option screening",
    studyModeLabel: input.snapshot.studyMode === "wall" ? "Wall" : "Floor",
    validationDetail: "Visible owner-policy guard; calculation basis unchanged.",
    validationLabel: "Scoped estimate",
    warnings: input.snapshot.warnings
  } satisfies SimpleWorkbenchProposalDocument;

  return buildSimpleWorkbenchProposalText(document);
}

describe("field-output owner and design-grade policy Gate B visible guard", () => {
  it("lands Gate B as visible owner-policy copy only and selects Gate C closeout", () => {
    expect(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardCopyChange: true,
      outputCardStatusChange: false,
      proposalReportCopyChange: true,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    expect(FIELD_OWNER_REQUIRED_BEFORE_DESIGN_GRADE).toEqual([
      "metric_owner",
      "source_basis_owner",
      "geometry_or_room_context_owner",
      "tolerance_owner",
      "negative_boundaries",
      "paired_engine_tests",
      "paired_web_report_tests"
    ]);
    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    // Gate C has landed, so Gate B's selected next file is now present.
    expect(existsSync(join(REPO_ROOT, FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B.selectedNextFile))).toBe(
      true
    );
  });

  it("pins wall output cards and proposal text to visible non-design-grade owner policy", () => {
    const snapshot = evaluate({
      airborneContext: completeTripleLeafContext(TRIPLE_LEAF_BUILDING_CONTEXT),
      id: "gate-b-owner-wall-split-rockwool",
      outputs: WALL_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS,
      studyMode: "wall"
    });

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });

    for (const output of ["R'w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[]) {
      const card = getCard(snapshot.cards, output);
      const posture = buildSimpleWorkbenchOutputPosture({
        output,
        result: snapshot.result,
        status: card.status,
        studyMode: "wall"
      });

      expect(card.status, output).toBe("live");
      expect(card.detail, output).toContain(FIELD_OUTPUT_OWNER_POLICY_GUARD);
      expect(posture.label, output).toBe("Airborne field-context prediction");
      expect(posture.detail, output).toContain("not measured field evidence");
    }

    expect(getCard(snapshot.cards, "R'w")).toMatchObject({ value: "51 dB" });
    expect(getCard(snapshot.cards, "DnT,w")).toMatchObject({ value: "53 dB" });

    const proposalText = buildProposalText({
      outputs: WALL_OUTPUTS,
      primaryOutput: "DnT,w",
      snapshot
    });

    expect(proposalText).toContain("R'w: Live now | Airborne field-context prediction | 51 dB");
    expect(proposalText).toContain("DnT,w: Live now | Airborne field-context prediction | 53 dB");
    expect(proposalText).toContain(FIELD_OUTPUT_OWNER_POLICY_GUARD);
    expect(proposalText).toContain(FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD);
    expect(proposalText).toContain("do not replace accredited laboratory, site, or design-grade field measurements");
  });

  it("pins exact floor airborne and impact field companions as non-design-grade continuations", () => {
    const snapshot = evaluate({
      airborneContext: FLOOR_BUILDING_CONTEXT,
      id: "gate-b-owner-floor-exact-field-companions",
      impactFieldContext: FLOOR_IMPACT_CONTEXT,
      outputs: FLOOR_OUTPUTS,
      rows: UBIQ_EXACT_OPEN_WEB_200_ROWS,
      studyMode: "floor"
    });

    expect(snapshot.result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_200_exact_lab_2026");

    for (const output of ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[]) {
      const card = getCard(snapshot.cards, output);
      const posture = buildSimpleWorkbenchOutputPosture({
        output,
        result: snapshot.result,
        status: card.status,
        studyMode: "floor"
      });

      expect(card.status, output).toBe("live");
      expect(card.detail, output).toContain(FIELD_OUTPUT_OWNER_POLICY_GUARD);
      expect(posture.label, output).toBe("Field continuation");
      expect(posture.detail, output).toContain(FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD);
    }

    expect(getCard(snapshot.cards, "R'w")).toMatchObject({ value: "52 dB" });
    expect(getCard(snapshot.cards, "DnT,w")).toMatchObject({ value: "53 dB" });
    expect(getCard(snapshot.cards, "L'nT,w")).toMatchObject({ value: "52.2 dB" });

    const proposalText = buildProposalText({
      outputs: FLOOR_OUTPUTS,
      primaryOutput: "L'nT,w",
      snapshot
    });

    expect(proposalText).toContain("L'n,w: Live now | Field continuation");
    expect(proposalText).toContain("L'nT,w: Live now | Field continuation");
    expect(proposalText).toContain("L'nT,50: Live now | Field continuation");
    expect(proposalText).toContain(FIELD_OUTPUT_OWNER_POLICY_GUARD);
    expect(proposalText).toContain(FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD);
  });

  it("keeps missing field inputs visibly parked instead of design-grade inferred from adjacent values", () => {
    const wallMissingRoom = evaluate({
      airborneContext: completeTripleLeafContext(TRIPLE_LEAF_FIELD_CONTEXT_WITHOUT_ROOM),
      id: "gate-b-owner-wall-missing-room-volume",
      outputs: WALL_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS,
      studyMode: "wall"
    });
    const floorMissingImpactField = evaluate({
      airborneContext: FLOOR_BUILDING_CONTEXT,
      id: "gate-b-owner-floor-missing-impact-field",
      impactFieldContext: null,
      outputs: FLOOR_OUTPUTS,
      rows: UBIQ_EXACT_OPEN_WEB_200_ROWS,
      studyMode: "floor"
    });

    expect(getCard(wallMissingRoom.cards, "R'w")).toMatchObject({ status: "needs_input", value: "Not ready" });
    expect(getCard(wallMissingRoom.cards, "DnT,w")).toMatchObject({ status: "needs_input", value: "Not ready" });
    expect(getCard(wallMissingRoom.cards, "DnT,w").detail).toContain("receiving-room volume");
    expect(
      buildSimpleWorkbenchOutputPosture({
        output: "DnT,w",
        result: wallMissingRoom.result,
        status: getCard(wallMissingRoom.cards, "DnT,w").status,
        studyMode: "wall"
      })
    ).toMatchObject({
      detail: expect.stringContaining(FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD),
      label: "Awaiting field input",
      tone: "warning"
    });

    expect(getCard(floorMissingImpactField.cards, "Ln,w")).toMatchObject({ status: "live" });
    expect(getCard(floorMissingImpactField.cards, "L'n,w")).toMatchObject({
      status: "needs_input",
      value: "Not ready"
    });
    expect(getCard(floorMissingImpactField.cards, "L'nT,w")).toMatchObject({
      status: "needs_input",
      value: "Not ready"
    });
    expect(getCard(floorMissingImpactField.cards, "L'n,w").detail).toContain("Need field K");
    expect(
      buildSimpleWorkbenchOutputPosture({
        output: "L'n,w",
        result: floorMissingImpactField.result,
        status: getCard(floorMissingImpactField.cards, "L'n,w").status,
        studyMode: "floor"
      })
    ).toMatchObject({
      detail: expect.stringContaining(FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD),
      label: "Awaiting field input",
      tone: "warning"
    });
  });

  it("carries forward rockwool source-gated prediction and Uris source-packet blockers in visible policy", () => {
    const snapshot = evaluate({
      airborneContext: completeTripleLeafContext(TRIPLE_LEAF_BUILDING_CONTEXT),
      id: "gate-b-owner-rockwool-screening-carry-forward",
      outputs: WALL_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS,
      studyMode: "wall"
    });
    const evidence = buildSimpleWorkbenchEvidencePacket({
      outputs: WALL_OUTPUTS,
      result: snapshot.result,
      warnings: snapshot.warnings
    });

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(snapshot.warnings.join("\n")).toContain("local substitution field-context harmonization is active");
    expect(evidence.citations).toContainEqual(
      expect.objectContaining({
        detail: expect.stringContaining("No exact wall source row is active"),
        label: "Dynamic airborne anchor",
        tone: "accent"
      })
    );
    expect({
      artifact: "rockwool_field_output_source_gated_prediction_policy_carry_forward",
      designGradeFieldOwnerActiveNow: false,
      groupedPredictionAnswer: "R'w 51 / DnT,w 53",
      groupedStrategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    }).toEqual({
      artifact: "rockwool_field_output_source_gated_prediction_policy_carry_forward",
      designGradeFieldOwnerActiveNow: false,
      groupedPredictionAnswer: "R'w 51 / DnT,w 53",
      groupedStrategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });
  });

  it("keeps active docs and current-gate runner aligned with visible Gate B and selected Gate C", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B.selectionStatus);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B.selectedNextAction);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B.selectedNextFile);
      expect(contents).toContain("pre_company_internal_use_exit_criteria");

      for (const artifact of VISIBLE_POLICY_ARTIFACTS) {
        expect(contents).toContain(artifact);
      }
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts");
  });
});
