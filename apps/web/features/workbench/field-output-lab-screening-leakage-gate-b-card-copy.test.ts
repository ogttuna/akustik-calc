import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
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

const FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_visible_field_output_basis_copy_guard",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: true,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "source_gap_revalidation_with_rockwool_and_company_internal_blockers",
  selectionStatus:
    "gate_b_strengthened_visible_field_output_basis_copy_no_runtime_selected_source_gap_revalidation_with_rockwool_and_misclassification_blockers",
  sliceId: "field_output_lab_screening_leakage_guard_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const FIELD_COPY_GUARD = "not an independent exact field measurement";
const FIELD_POSTURE_GUARD = "not being framed as an independent exact source row";

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
  contextMode: "building_prediction",
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
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const FLOOR_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

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
    assemblyHeadline: `${input.snapshot.studyMode} field-output leakage guard snapshot.`,
    assumptionItems: [
      {
        detail: "Field-style values stay scoped to the active lab, screening, apparent, or bound basis.",
        label: "Field-output basis",
        tone: "warning"
      }
    ],
    approverTitle: "Lead Acoustic Consultant",
    briefNote: "Gate B copy snapshot: do not issue field continuation as an independent exact measurement.",
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
    corridorDossierHeadline: "Field output basis guard active.",
    coverageItems,
    decisionTrailHeadline: "Field-style outputs are shown only with their continuation basis.",
    decisionTrailItems: evidence.decisionTrailItems,
    dynamicBranchDetail: "Gate B visible copy contract only; no runtime value movement.",
    dynamicBranchLabel: "Field-output copy guard",
    executiveSummary: "Finite field-style values remain scoped outputs and do not replace accredited laboratory or site measurements.",
    issueBaseReference: "MAC-FIELD-GATE-B",
    issueCodePrefix: "MAC",
    issueNextReference: "MAC-FIELD-GATE-B-01",
    issueRegisterItems: [
      {
        detail: "Gate B visible copy guard issue.",
        issuedOnLabel: "04 May 2026",
        label: "Current issue",
        reference: "MAC-FIELD-GATE-B",
        statusLabel: "Rev 00"
      }
    ],
    issuedOnIso: "2026-05-04T10:00:00.000Z",
    issuedOnLabel: "04 May 2026",
    layers: buildLayers(input.snapshot.rows, input.snapshot.studyMode),
    methodDossierCards: [
      {
        detail: "No source, confidence, support, or numeric promotion is selected by this visible copy gate.",
        label: "Gate scope",
        tone: "warning",
        value: "Copy guard"
      }
    ],
    methodDossierHeadline: "Gate B strengthens report wording without changing the calculator lane.",
    methodTraceGroups: [],
    metrics: buildMetrics({
      cards: input.snapshot.cards,
      outputs: input.outputs
    }),
    preparedBy: "DAC QA",
    primaryMetricLabel: primaryCard.label,
    primaryMetricValue: primaryCard.value,
    projectName: `${input.snapshot.studyMode} field-output copy guard`,
    proposalAttention: "Internal QA",
    proposalIssuePurpose: "Internal validation snapshot only",
    proposalRecipient: "Machinity",
    proposalReference: "MAC-FIELD-GATE-B",
    proposalRevision: "Rev 00",
    proposalSubject: "Field-output basis copy guard",
    proposalValidityNote: "Not for external issue.",
    recommendationItems: [
      {
        detail: "Keep field continuation wording visible until an owned field source or exact solver path is present.",
        label: "Do not promote field continuation",
        tone: "warning"
      }
    ],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Option screening",
    studyModeLabel: input.snapshot.studyMode === "wall" ? "Wall" : "Floor",
    validationDetail: "Visible copy guard; calculation basis unchanged.",
    validationLabel: "Scoped estimate",
    warnings: input.snapshot.warnings
  } satisfies SimpleWorkbenchProposalDocument;

  return buildSimpleWorkbenchProposalText(document);
}

describe("field-output lab/screening leakage Gate B visible copy guard", () => {
  it("lands Gate B as visible copy only and selects source-gap reopening with rockwool blockers still active", () => {
    expect(FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_B).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: true,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
    expect(FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_B.selectedNextAction).toContain("rockwool");
    expect(FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_B.selectionStatus).toContain("no_runtime");
  });

  it("keeps source-gated rockwool triple-leaf R'w and DnT,w visibly tied to apparent field continuation", () => {
    const snapshot = evaluate({
      airborneContext: completeTripleLeafContext(TRIPLE_LEAF_BUILDING_CONTEXT),
      id: "gate-b-wall-split-rockwool-field-copy",
      outputs: WALL_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS,
      studyMode: "wall"
    });
    const rwPrime = getCard(snapshot.cards, "R'w");
    const dnTw = getCard(snapshot.cards, "DnT,w");

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(rwPrime).toMatchObject({ status: "live", value: "49 dB" });
    expect(dnTw).toMatchObject({ status: "live", value: "50 dB" });
    expect(rwPrime.detail).toContain("apparent on-site airborne single number");
    expect(rwPrime.detail).toContain(FIELD_COPY_GUARD);
    expect(dnTw.detail).toContain("same apparent field curve");
    expect(dnTw.detail).toContain("receiving-room volume");
    expect(dnTw.detail).toContain(FIELD_COPY_GUARD);

    const coverageItems = buildCoverageItems({
      cards: snapshot.cards,
      outputs: WALL_OUTPUTS,
      result: snapshot.result,
      studyMode: "wall"
    });
    const fieldCoverage = coverageItems.filter((item) => item.label === "R'w" || item.label === "DnT,w");

    expect(fieldCoverage).toHaveLength(2);
    for (const item of fieldCoverage) {
      expect(item.postureLabel).toBe("Field continuation");
      expect(item.postureDetail).toContain(FIELD_POSTURE_GUARD);
      expect(item.postureDetail).toContain("measured field result");
    }

    const evidence = buildSimpleWorkbenchEvidencePacket({
      outputs: WALL_OUTPUTS,
      result: snapshot.result,
      warnings: snapshot.warnings
    });

    expect(evidence.citations).toContainEqual(
      expect.objectContaining({
        detail: expect.stringContaining("No exact wall source row is active"),
        label: "Dynamic airborne anchor",
        tone: "accent"
      })
    );
    expect(evidence.citations).toContainEqual(
      expect.objectContaining({
        label: expect.stringContaining("Field airborne provenance")
      })
    );

    const proposalText = buildProposalText({
      outputs: WALL_OUTPUTS,
      primaryOutput: "DnT,w",
      snapshot
    });

    expect(proposalText).toContain(`R'w: Live now | Field continuation | 49 dB`);
    expect(proposalText).toContain("DnT,w: Live now | Field continuation | 50 dB");
    expect(proposalText).toContain(FIELD_COPY_GUARD);
    expect(proposalText).toContain(FIELD_POSTURE_GUARD);
    expect(proposalText).toContain("does not replace accredited laboratory or site measurements");
  });

  it("keeps exact floor field-impact companions as continuations instead of independent exact field measurements", () => {
    const snapshot = evaluate({
      airborneContext: FLOOR_BUILDING_CONTEXT,
      id: "gate-b-floor-exact-field-impact-copy",
      impactFieldContext: FLOOR_IMPACT_CONTEXT,
      outputs: FLOOR_OUTPUTS,
      rows: UBIQ_EXACT_OPEN_WEB_200_ROWS,
      studyMode: "floor"
    });

    expect(snapshot.result.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_200_exact_lab_2026");

    for (const output of ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[]) {
      const card = getCard(snapshot.cards, output);
      const posture = buildSimpleWorkbenchOutputPosture({
        output,
        result: snapshot.result,
        status: card.status,
        studyMode: "floor"
      });

      expect(card.status, output).toBe("live");
      expect(card.detail, output).toContain("field-impact continuation");
      expect(card.detail, output).toContain(FIELD_COPY_GUARD);
      expect(posture.label, output).toBe("Field continuation");
      expect(posture.detail, output).toContain(FIELD_POSTURE_GUARD);
    }

    const evidence = buildSimpleWorkbenchEvidencePacket({
      outputs: FLOOR_OUTPUTS,
      result: snapshot.result,
      warnings: snapshot.warnings
    });

    expect(evidence.citations).toContainEqual(
      expect.objectContaining({
        label: expect.stringContaining("Exact floor family"),
        tone: "success"
      })
    );

    const proposalText = buildProposalText({
      outputs: FLOOR_OUTPUTS,
      primaryOutput: "L'nT,w",
      snapshot
    });

    expect(proposalText).toContain("L'n,w: Live now | Field continuation");
    expect(proposalText).toContain("L'nT,w: Live now | Field continuation");
    expect(proposalText).toContain("L'nT,50: Live now | Field continuation");
    expect(proposalText).toContain(FIELD_COPY_GUARD);
    expect(proposalText).toContain("Do not promote field continuation");
  });

  it("keeps missing field inputs parked instead of using finite adjacent values as field outputs", () => {
    const wallMissingRoom = evaluate({
      airborneContext: completeTripleLeafContext(TRIPLE_LEAF_FIELD_CONTEXT_WITHOUT_ROOM),
      id: "gate-b-wall-missing-room-volume",
      outputs: WALL_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS,
      studyMode: "wall"
    });
    const floorMissingImpactField = evaluate({
      airborneContext: FLOOR_BUILDING_CONTEXT,
      id: "gate-b-floor-missing-impact-field",
      impactFieldContext: null,
      outputs: FLOOR_OUTPUTS,
      rows: UBIQ_EXACT_OPEN_WEB_200_ROWS,
      studyMode: "floor"
    });

    expect(getCard(wallMissingRoom.cards, "R'w")).toMatchObject({ status: "live" });
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
      label: "Awaiting field input",
      tone: "warning"
    });

    expect(getCard(floorMissingImpactField.cards, "Ln,w")).toMatchObject({ status: "live" });
    expect(getCard(floorMissingImpactField.cards, "L'n,w")).toMatchObject({ status: "needs_input", value: "Not ready" });
    expect(getCard(floorMissingImpactField.cards, "L'nT,w")).toMatchObject({ status: "needs_input", value: "Not ready" });
    expect(getCard(floorMissingImpactField.cards, "L'n,w").detail).toContain("Need field K");
    expect(
      buildSimpleWorkbenchOutputPosture({
        output: "L'n,w",
        result: floorMissingImpactField.result,
        status: getCard(floorMissingImpactField.cards, "L'n,w").status,
        studyMode: "floor"
      })
    ).toMatchObject({
      label: "Awaiting field input",
      tone: "warning"
    });
  });
});
