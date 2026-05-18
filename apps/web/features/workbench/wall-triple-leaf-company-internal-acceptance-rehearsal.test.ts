import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchDiagnosticsDossier } from "./simple-workbench-diagnostics-dossier";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import { buildOutputCard, type BaseOutputCardModel } from "./simple-workbench-output-model";
import { buildSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";
import {
  buildSimpleWorkbenchProposalHtml,
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalCoverageItem,
  type SimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalLayer,
  type SimpleWorkbenchProposalMetric
} from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalBrief } from "./simple-workbench-proposal-brief";
import { ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD } from "./rockwool-triple-leaf-screening-policy-copy";
import {
  buildWorkbenchWallTopology,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import type { LayerDraft } from "./workbench-store";

const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const WALL_TRIPLE_LEAF_COMPANY_INTERNAL_ACCEPTANCE_REHEARSAL_GATE_J = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_j_company_internal_acceptance_rehearsal_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_k_runtime_promotion_readiness_and_source_gap_closure",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts",
  selectionStatus:
    "gate_j_landed_company_internal_acceptance_rehearsal_no_runtime_selected_runtime_promotion_readiness_gate_k",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_J_HANDOFF.md"
] as const;

const WALL_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

type WallOutputId = (typeof WALL_OUTPUTS)[number];

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

const ADJACENT_ROCKWOOL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const ORDINARY_DOUBLE_LEAF_NEGATIVE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const LSF_EXACT_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { materialId: "air_gap", thicknessMm: "5" },
  { materialId: "glasswool", thicknessMm: "70" },
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const LSF_NEAR_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "air_gap", thicknessMm: "5" },
  { materialId: "rockwool", thicknessMm: "70" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const LINED_MASONRY_NEGATIVE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "concrete", thicknessMm: "150" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const ONE_SIDE_LINING_NEGATIVE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "concrete", thicknessMm: "180" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const TRIPLE_LEAF_FIELD_CONTEXT: AirborneContext = {
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

const STUD_EXACT_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const ACCEPTANCE_SCENARIOS = [
  {
    bucket: "user_pdf_repro",
    id: "user_adjacent_rockwool_pdf_stack"
  },
  {
    bucket: "user_pdf_repro",
    id: "user_split_rockwool_pdf_stack_missing_topology"
  },
  {
    bucket: "user_pdf_repro",
    id: "user_split_rockwool_pdf_stack_complete_grouped_topology"
  },
  {
    bucket: "source_controls",
    id: "exact_source_lsf_control"
  },
  {
    bucket: "source_controls",
    id: "near_source_lsf_control_without_exact_promotion"
  },
  {
    bucket: "negative_boundaries",
    id: "ordinary_double_leaf_negative"
  },
  {
    bucket: "negative_boundaries",
    id: "lined_masonry_negative"
  },
  {
    bucket: "negative_boundaries",
    id: "one_side_lining_negative"
  },
  {
    bucket: "hostile_inputs",
    id: "many_layer_reorder_hostile"
  }
] as const;

function withIds(rows: readonly Omit<LayerDraft, "id">[], scenarioId: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${scenarioId}-${index + 1}`
  }));
}

function completeTripleLeafWallContext(base: AirborneContext = { contextMode: "element_lab" }): AirborneContext {
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

function evaluateWallScenario(input: {
  airborneContext?: AirborneContext;
  id: string;
  outputs?: readonly RequestedOutputId[];
  rows: readonly Omit<LayerDraft, "id">[];
}) {
  const rows = withIds(input.rows, input.id);
  const outputs = input.outputs ?? WALL_OUTPUTS;
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? { contextMode: "element_lab" },
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: outputs
  });

  expect(scenario.result, `${input.id} should evaluate`).not.toBeNull();

  if (!scenario.result) {
    throw new Error(`${input.id} did not evaluate.`);
  }

  const cards = new Map(
    outputs.map((output) => [
      output,
      buildOutputCard({
        output,
        result: scenario.result,
        studyMode: "wall"
      })
    ])
  );

  return {
    branch: getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "wall"
    }),
    cards,
    result: scenario.result,
    rows,
    topologyGap: getGuidedTopologyGap({
      result: scenario.result,
      rows,
      studyMode: "wall"
    }),
    warnings: scenario.warnings
  };
}

function getCard(
  cards: ReadonlyMap<RequestedOutputId, BaseOutputCardModel>,
  output: RequestedOutputId
): BaseOutputCardModel {
  const card = cards.get(output);

  if (!card) {
    throw new Error(`Missing ${output} card`);
  }

  return card;
}

function expectWarning(warnings: readonly string[], pattern: RegExp, label: string): void {
  expect(
    warnings.some((warning) => pattern.test(warning)),
    `${label} warning should be visible`
  ).toBe(true);
}

function buildCoverageItems(input: {
  outputs: readonly RequestedOutputId[];
  result: NonNullable<ReturnType<typeof evaluateWallScenario>["result"]>;
}): readonly SimpleWorkbenchProposalCoverageItem[] {
  return input.outputs.map((output) => {
    const card = buildOutputCard({
      output,
      result: input.result,
      studyMode: "wall"
    });
    const posture = buildSimpleWorkbenchOutputPosture({
      output,
      result: input.result,
      status: card.status,
      studyMode: "wall"
    });

    return {
      detail: card.detail,
      label: card.label,
      nextStep:
        card.status === "needs_input"
          ? "Complete the missing field or topology input before issuing this metric."
          : undefined,
      postureDetail: posture.detail,
      postureLabel: posture.label,
      postureTone: posture.tone,
      status: card.status,
      value: card.value
    };
  });
}

function buildLayers(rows: readonly LayerDraft[]): readonly SimpleWorkbenchProposalLayer[] {
  return rows.map((row, index) => ({
    categoryLabel: "Wall layer",
    index: index + 1,
    label: row.materialId,
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

function buildReportVisibilitySnapshot(input: {
  outputs: readonly RequestedOutputId[];
  primaryOutput: WallOutputId;
  snapshot: ReturnType<typeof evaluateWallScenario>;
}) {
  const validation = getGuidedValidationSummary({
    result: input.snapshot.result,
    studyMode: "wall"
  });
  const evidence = buildSimpleWorkbenchEvidencePacket({
    outputs: input.outputs,
    result: input.snapshot.result,
    warnings: input.snapshot.warnings
  });
  const diagnostics = buildSimpleWorkbenchDiagnosticsDossier({
    branchLabel: input.snapshot.branch.value,
    citations: evidence.citations,
    decisionTrailHeadline: evidence.decisionTrailHeadline,
    decisionTrailItems: evidence.decisionTrailItems,
    result: input.snapshot.result,
    validationDetail: validation.detail,
    validationLabel: validation.value,
    warnings: input.snapshot.warnings
  });
  const primaryCard = getCard(input.snapshot.cards, input.primaryOutput);
  const brief = buildSimpleWorkbenchProposalBrief({
    briefNote: "Gate J internal rehearsal: keep triple-leaf caveats visible on generated reports.",
    citations: evidence.citations,
    consultantCompany: "Machinity Acoustic Consultants",
    contextLabel: "Building prediction",
    dynamicBranchDetail: input.snapshot.branch.detail,
    dynamicBranchLabel: input.snapshot.branch.value,
    issuedOnIso: "2026-05-01T10:00:00.000Z",
    primaryMetricLabel: primaryCard.label,
    primaryMetricValue: primaryCard.value,
    projectName: input.snapshot.result.id ?? "Triple-leaf acceptance rehearsal",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Option screening",
    studyModeLabel: "Wall",
    validationDetail: validation.detail,
    validationLabel: validation.value,
    validationTone: validation.tone,
    warnings: input.snapshot.warnings
  });
  const coverageItems = buildCoverageItems({
    outputs: input.outputs,
    result: input.snapshot.result
  });
  const layers = buildLayers(input.snapshot.rows);
  const method = buildSimpleWorkbenchMethodDossier({
    branchDetail: input.snapshot.branch.detail,
    branchLabel: input.snapshot.branch.value,
    contextLabel: "Building prediction",
    coverageItems,
    layers,
    result: input.snapshot.result,
    stackDetail: "User split-rockwool triple-leaf wall stack with complete grouped topology.",
    studyModeLabel: "Wall",
    validationDetail: validation.detail,
    validationLabel: validation.value,
    warnings: input.snapshot.warnings
  });
  const document = {
    assemblyHeadline: "Grouped triple-leaf split-rockwool wall rehearsal.",
    assumptionItems: brief.assumptionItems,
    approverTitle: "Lead Acoustic Consultant",
    briefNote: "Gate J internal rehearsal: keep triple-leaf caveats visible on generated reports.",
    citations: evidence.citations,
    clientName: "Internal DAC QA",
    consultantAddress: "Istanbul",
    consultantCompany: "Machinity Acoustic Consultants",
    consultantEmail: "qa@machinity.local",
    consultantLogoDataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
    consultantPhone: "+90 000 000 00 00",
    consultantWordmarkLine: "Building Acoustics",
    contextLabel: "Building prediction",
    corridorDossierCards: diagnostics.cards,
    corridorDossierHeadline: diagnostics.headline,
    coverageItems,
    decisionTrailHeadline: evidence.decisionTrailHeadline,
    decisionTrailItems: evidence.decisionTrailItems,
    dynamicBranchDetail: input.snapshot.branch.detail,
    dynamicBranchLabel: input.snapshot.branch.value,
    executiveSummary: brief.executiveSummary,
    issueBaseReference: "MAC-TL-20260501",
    issueCodePrefix: "MAC",
    issueNextReference: "MAC-TL-20260501-01",
    issueRegisterItems: [
      {
        detail: "Gate J acceptance rehearsal report issue.",
        issuedOnLabel: "01 May 2026",
        label: "Current issue",
        reference: "MAC-TL-20260501",
        statusLabel: "Rev 00"
      }
    ],
    issuedOnIso: "2026-05-01T10:00:00.000Z",
    issuedOnLabel: "01 May 2026",
    layers,
    methodDossierCards: method.cards,
    methodDossierHeadline: method.headline,
    methodTraceGroups: method.traceGroups,
    metrics: buildMetrics({
      cards: input.snapshot.cards,
      outputs: input.outputs
    }),
    preparedBy: "DAC QA",
    primaryMetricLabel: primaryCard.label,
    primaryMetricValue: primaryCard.value,
    projectName: "Triple-leaf acceptance rehearsal",
    proposalAttention: "Internal QA",
    proposalIssuePurpose: "Internal acceptance rehearsal only",
    proposalRecipient: "Machinity",
    proposalReference: "MAC-TL-20260501",
    proposalRevision: "Rev 00",
    proposalSubject: "Triple-leaf rockwool reorder acceptance rehearsal",
    proposalValidityNote: "Internal validation snapshot only; not for external issue.",
    recommendationItems: brief.recommendationItems,
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    studyContextLabel: "Option screening",
    studyModeLabel: "Wall",
    validationDetail: validation.detail,
    validationLabel: validation.value,
    warnings: input.snapshot.warnings
  } satisfies SimpleWorkbenchProposalDocument;

  return {
    brief,
    diagnostics,
    evidence,
    html: buildSimpleWorkbenchProposalHtml(document),
    text: buildSimpleWorkbenchProposalText(document),
    validation
  };
}

function buildManyLayerRows(): readonly Omit<LayerDraft, "id">[] {
  return Array.from({ length: 50 }, (_, index) => {
    const rotation = index % 3;
    if (rotation === 0) return { materialId: "gypsum_board", thicknessMm: "12.5" };
    if (rotation === 1) return { materialId: "rockwool", thicknessMm: "45" };
    return { materialId: "air_gap", thicknessMm: "20" };
  });
}

describe("wall triple-leaf company-internal acceptance rehearsal Gate J", () => {
  it("lands Gate J as a no-runtime acceptance rehearsal and selects runtime readiness/source-gap Gate K", () => {
    expect(WALL_TRIPLE_LEAF_COMPANY_INTERNAL_ACCEPTANCE_REHEARSAL_GATE_J).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextFile: "packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts",
      workbenchInputBehaviorChange: false
    });
    expect(ACCEPTANCE_SCENARIOS).toHaveLength(9);
    expect(new Set(ACCEPTANCE_SCENARIOS.map((scenario) => scenario.id)).size).toBe(9);
    expect(new Set(ACCEPTANCE_SCENARIOS.map((scenario) => scenario.bucket))).toEqual(
      new Set(["user_pdf_repro", "source_controls", "negative_boundaries", "hostile_inputs"])
    );
  });

  it("rehearses both user PDF stacks and keeps adjacent rockwool on the double-leaf numeric lane", () => {
    const adjacent = evaluateWallScenario({
      id: "user-adjacent-rockwool",
      outputs: WALL_LAB_OUTPUTS,
      rows: ADJACENT_ROCKWOOL_ROWS
    });
    const splitFlat = evaluateWallScenario({
      id: "user-split-rockwool-flat",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });
    const splitGrouped = evaluateWallScenario({
      airborneContext: completeTripleLeafWallContext(),
      id: "user-split-rockwool-grouped",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });

    expect(adjacent.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(getCard(adjacent.cards, "Rw")).toMatchObject({ status: "live", value: "50 dB" });
    expect(adjacent.topologyGap).toBeNull();
    expectWarning(adjacent.warnings, /Flat-list adjacent-swap sensitivity guard/i, "flat-list guard");
    expectWarning(adjacent.warnings, /kept the current double-leaf numeric lane/i, "numeric hold");

    expect(splitFlat.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend"
    });
    expect(splitFlat.result.supportedTargetOutputs).toEqual([]);
    expect(splitFlat.result.unsupportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(getCard(splitFlat.cards, "Rw")).toMatchObject({
      detail: ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD,
      status: "unsupported",
      value: "Not ready"
    });
    expect(splitFlat.topologyGap).toMatchObject({ value: "Grouped topology missing" });
    expect(splitFlat.topologyGap?.detail).toContain("Missing: side A leaf layer group");

    expect(splitGrouped.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(getCard(splitGrouped.cards, "Rw")).toMatchObject({ status: "live", value: "53 dB" });
    expect(splitGrouped.topologyGap).toMatchObject({ value: "Triple-leaf prediction" });
    expect(splitGrouped.topologyGap?.detail).toContain("triple-leaf prediction route");

    expect(Math.abs((adjacent.result.metrics.estimatedRwDb ?? 0) - (splitGrouped.result.metrics.estimatedRwDb ?? 0))).toBeLessThanOrEqual(3);
    expectWarning(splitGrouped.warnings, /lab spectrum adapter is active/i, "grouped lab spectrum adapter is active");
  });

  it("keeps field R'w and DnT,w live but visibly caveated on report/PDF surfaces", () => {
    const field = evaluateWallScenario({
      airborneContext: completeTripleLeafWallContext(TRIPLE_LEAF_FIELD_CONTEXT),
      id: "user-split-rockwool-field-grouped",
      outputs: WALL_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });

    expect(getCard(field.cards, "R'w")).toMatchObject({ status: "live", value: "51 dB" });
    expect(getCard(field.cards, "DnT,w")).toMatchObject({ status: "live", value: "53 dB" });
    expect(getCard(field.cards, "Rw")).toMatchObject({ status: "unsupported", value: "Not ready" });
    expect(field.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(field.topologyGap).toMatchObject({ value: "Triple-leaf prediction" });

    const report = buildReportVisibilitySnapshot({
      outputs: WALL_OUTPUTS,
      primaryOutput: "DnT,w",
      snapshot: field
    });

    expect(report.validation.value).toBe("Scoped estimate");
    expect(report.evidence.citations).toContainEqual(
      expect.objectContaining({
        detail: expect.stringContaining("No exact wall source row is active"),
        label: "Dynamic airborne anchor",
        tone: "accent"
      })
    );
    expect(report.diagnostics.warningCount).toBeGreaterThanOrEqual(1);
    expect(report.brief.executiveSummary).toContain("scoped estimate posture");
    expect(report.text).toContain("DnT,w: Live now");
    expect(report.text).toContain("Rw: Unsupported on lane");
    expect(report.text).toContain("Local-substitution field-context harmonization is active");
    expect(report.text).toContain("does not replace accredited laboratory or site measurements");
    expect(report.html).toContain("Local-substitution field-context harmonization is active");
  });

  it("separates exact source controls from near-source rows without promoting nearby local substitutions", () => {
    const exact = evaluateWallScenario({
      airborneContext: STUD_EXACT_CONTEXT,
      id: "exact-source-lsf-control",
      outputs: WALL_LAB_OUTPUTS,
      rows: LSF_EXACT_SOURCE_ROWS
    });
    const near = evaluateWallScenario({
      airborneContext: STUD_EXACT_CONTEXT,
      id: "near-source-lsf-control",
      outputs: WALL_LAB_OUTPUTS,
      rows: LSF_NEAR_SOURCE_ROWS
    });

    expect(getCard(exact.cards, "Rw")).toMatchObject({ status: "live", value: "55 dB" });
    expectWarning(exact.warnings, /Curated exact airborne lab match active: Knauf accredited lab report 416889/i, "exact LSF source");
    expect(exact.result.dynamicAirborneTrace?.detectedFamily).toBe("stud_wall_system");

    expect(getCard(near.cards, "Rw")).toMatchObject({ status: "live", value: "53 dB" });
    expect(near.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "stud_wall_system"
    });
    expect(
      near.warnings.some((warning) => /Curated exact airborne lab match active/i.test(warning)),
      "near-source local substitutions must not inherit the exact source row"
    ).toBe(false);
  });

  it("protects double-leaf, lined-masonry, and one-side-lining negatives from the triple-leaf blocker", () => {
    const doubleLeaf = evaluateWallScenario({
      id: "ordinary-double-leaf-negative",
      outputs: WALL_LAB_OUTPUTS,
      rows: ORDINARY_DOUBLE_LEAF_NEGATIVE_ROWS
    });
    const linedMasonry = evaluateWallScenario({
      id: "lined-masonry-negative",
      outputs: WALL_LAB_OUTPUTS,
      rows: LINED_MASONRY_NEGATIVE_ROWS
    });
    const oneSideLining = evaluateWallScenario({
      id: "one-side-lining-negative",
      outputs: WALL_LAB_OUTPUTS,
      rows: ONE_SIDE_LINING_NEGATIVE_ROWS
    });

    expect(doubleLeaf.result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(linedMasonry.result.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(oneSideLining.result.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");

    for (const snapshot of [doubleLeaf, linedMasonry, oneSideLining]) {
      expect(snapshot.topologyGap).toBeNull();
      expect(
        snapshot.warnings.some((warning) => /Triple-leaf exact calculation needs grouped wall topology/i.test(warning)),
        `${snapshot.result.id ?? "negative"} should not ask for triple-leaf topology`
      ).toBe(false);
    }
  });

  it("keeps many-layer and reorder hostile wall inputs finite and card-renderable", () => {
    const forwardRows = buildManyLayerRows();
    const reversedRows = [...forwardRows].reverse();
    const forward = evaluateWallScenario({
      id: "many-layer-forward",
      outputs: WALL_OUTPUTS,
      rows: forwardRows
    });
    const reversed = evaluateWallScenario({
      id: "many-layer-reversed",
      outputs: WALL_OUTPUTS,
      rows: reversedRows
    });

    expect(Number.isFinite(forward.result.metrics.estimatedRwDb ?? Number.NaN)).toBe(true);
    expect(Number.isFinite(reversed.result.metrics.estimatedRwDb ?? Number.NaN)).toBe(true);
    expect(reversed.result.supportedTargetOutputs).toEqual(forward.result.supportedTargetOutputs);
    expect(reversed.result.unsupportedTargetOutputs).toEqual(forward.result.unsupportedTargetOutputs);

    for (const output of WALL_OUTPUTS) {
      expect(["bound", "live", "needs_input", "unsupported"]).toContain(getCard(forward.cards, output).status);
      expect(["bound", "live", "needs_input", "unsupported"]).toContain(getCard(reversed.cards, output).status);
    }
  });

  it("keeps active docs aligned with Gate J and the selected Gate K follow-up", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_COMPANY_INTERNAL_ACCEPTANCE_REHEARSAL_GATE_J.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_COMPANY_INTERNAL_ACCEPTANCE_REHEARSAL_GATE_J.selectedNextFile);
    }
  });
});
