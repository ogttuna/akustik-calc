import type {
  AirborneCalculatorId,
  AirborneContext,
  ImpactFieldContext,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import type { StudyMode } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalCoverageItem,
  type SimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalLayer,
  type SimpleWorkbenchProposalMetric
} from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalBrief } from "./simple-workbench-proposal-brief";
import { buildSimpleWorkbenchProposalPreviewHtml } from "./simple-workbench-proposal-preview-html";
import { buildSimpleWorkbenchProposalConstructionRender } from "./simple-workbench-proposal-reporting";
import { buildSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";
import { buildOutputCard } from "./simple-workbench-output-model";
import { formatDensityLabel, getStudyModeLabel } from "./simple-workbench-utils";
import { buildWorkbenchMaterialCatalog } from "./workbench-materials";
import { FLOOR_ROLE_LABELS, REPORT_PROFILE_LABELS } from "./workbench-data";
import type { LayerDraft } from "./workbench-store";

const REINFORCED_CONCRETE_LOW_CONFIDENCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "120" },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: "100" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" }
] as const;

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const WALL_FIELD_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "concrete", thicknessMm: "160" },
  { materialId: "rockwool", thicknessMm: "45" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
] as const;

const BUILDING_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

type GeneratedProposalCase = {
  airborneContext?: AirborneContext | null;
  calculator?: AirborneCalculatorId | null;
  contextLabel: string;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  projectName: string;
  rows: readonly Omit<LayerDraft, "id">[];
  studyContextLabel: string;
  studyMode: StudyMode;
  targetOutputs: readonly RequestedOutputId[];
};

function repeatRows(count: number, row: Omit<LayerDraft, "id">): Array<Omit<LayerDraft, "id">> {
  return Array.from({ length: count }, () => ({ ...row }));
}

function makeUbiqExactSplitRows(): Array<Omit<LayerDraft, "id">> {
  return [
    ...repeatRows(12, { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "4" }),
    ...repeatRows(10, { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "14.5" }),
    ...repeatRows(10, {
      floorRole: "ceiling_cavity",
      materialId: "ubiq_resilient_ceiling",
      thicknessMm: "6.5"
    }),
    ...repeatRows(8, {
      floorRole: "floor_covering",
      materialId: "engineered_timber_with_acoustic_underlay",
      thicknessMm: "2.5"
    }),
    ...repeatRows(8, { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "2.375" }),
    ...repeatRows(5, { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "40" })
  ];
}

function buildRows(id: string, rows: readonly Omit<LayerDraft, "id">[]): readonly LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` }));
}

function buildProposalLayers(input: {
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
}): readonly SimpleWorkbenchProposalLayer[] {
  const catalog = buildWorkbenchMaterialCatalog([]);
  const materialById = new Map(catalog.map((material) => [material.id, material]));

  return input.rows.map((row, index) => {
    const material = materialById.get(row.materialId);

    return {
      categoryLabel: material ? getMaterialCategoryLabel(material) : "Uncatalogued layer",
      densityLabel: material ? formatDensityLabel(material, row.densityKgM3) : "Not listed",
      index: index + 1,
      label: material?.name ?? row.materialId,
      roleLabel: input.studyMode === "floor" && row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : undefined,
      thicknessLabel: `${row.thicknessMm.trim().length > 0 ? row.thicknessMm : "?"} mm`
    };
  });
}

function buildCoverageItems(input: {
  result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>;
  studyMode: StudyMode;
  targetOutputs: readonly RequestedOutputId[];
}): readonly SimpleWorkbenchProposalCoverageItem[] {
  return input.targetOutputs.map((output) => {
    const card = buildOutputCard({
      output,
      result: input.result,
      studyMode: input.studyMode
    });
    const posture = buildSimpleWorkbenchOutputPosture({
      output,
      result: input.result,
      status: card.status,
      studyMode: input.studyMode
    });

    return {
      detail: card.detail,
      label: card.label,
      postureDetail: posture.detail,
      postureLabel: posture.label,
      postureTone: posture.tone,
      status: card.status,
      value: card.value
    };
  });
}

function buildGeneratedProposalDocument(testCase: GeneratedProposalCase): {
  coverageItems: readonly SimpleWorkbenchProposalCoverageItem[];
  document: SimpleWorkbenchProposalDocument;
  scenario: ReturnType<typeof evaluateScenario>;
} {
  const rows = buildRows(testCase.id, testCase.rows);
  const scenario = evaluateScenario({
    airborneContext: testCase.airborneContext ?? null,
    calculator: testCase.calculator ?? null,
    id: testCase.id,
    impactFieldContext: testCase.impactFieldContext ?? null,
    name: testCase.projectName,
    rows,
    source: "current",
    studyMode: testCase.studyMode,
    targetOutputs: testCase.targetOutputs
  });

  expect(scenario.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  const studyModeLabel = getStudyModeLabel(testCase.studyMode);
  const coverageItems = buildCoverageItems({
    result: scenario.result,
    studyMode: testCase.studyMode,
    targetOutputs: testCase.targetOutputs
  });
  const metrics: readonly SimpleWorkbenchProposalMetric[] = coverageItems
    .filter((item) => item.status === "live" || item.status === "bound")
    .map((item) => ({
      detail: item.detail,
      label: item.label,
      value: item.value
    }));
  const layers = buildProposalLayers({ rows, studyMode: testCase.studyMode });
  const branchSummary = getDynamicCalcBranchSummary({
    result: scenario.result,
    studyMode: testCase.studyMode
  });
  const validationSummary = getGuidedValidationSummary({
    result: scenario.result,
    studyMode: testCase.studyMode
  });
  const evidence = buildSimpleWorkbenchEvidencePacket({
    outputs: testCase.targetOutputs,
    result: scenario.result,
    warnings: scenario.warnings
  });
  const methodDossier = buildSimpleWorkbenchMethodDossier({
    branchDetail: branchSummary.detail,
    branchLabel: branchSummary.value,
    contextLabel: testCase.contextLabel,
    coverageItems,
    layers,
    result: scenario.result,
    stackDetail: `${rows.length} live rows feed ${rows.length} visible proposal layer rows.`,
    studyModeLabel,
    validationDetail: validationSummary.detail,
    validationLabel: validationSummary.value,
    warnings: scenario.warnings
  });
  const proposalBrief = buildSimpleWorkbenchProposalBrief({
    briefNote: "Generated report-honesty regression fixture from the live workbench output model.",
    citations: evidence.citations,
    consultantCompany: "Machinity Acoustic Consultants",
    contextLabel: testCase.contextLabel,
    dynamicBranchDetail: branchSummary.detail,
    dynamicBranchLabel: branchSummary.value,
    issueCodePrefix: "MAC",
    issuedOnIso: "2026-04-27T12:00:00.000Z",
    primaryMetricLabel: metrics[0]?.label ?? "Primary read",
    primaryMetricValue: metrics[0]?.value ?? "Waiting",
    projectName: testCase.projectName,
    reportProfileLabel: REPORT_PROFILE_LABELS.consultant,
    studyContextLabel: testCase.studyContextLabel,
    studyModeLabel,
    validationDetail: validationSummary.detail,
    validationLabel: validationSummary.value,
    validationTone: validationSummary.tone,
    warnings: scenario.warnings
  });

  return {
    coverageItems,
    document: {
      approverTitle: "Lead Acoustic Consultant",
      assemblyHeadline: `${testCase.projectName} generated ${studyModeLabel.toLowerCase()} scenario`,
      assumptionItems: proposalBrief.assumptionItems,
      briefNote: "Generated report-honesty regression fixture from the live workbench output model.",
      clientName: "Machinity Internal QA",
      consultantAddress: "Internal QA Desk",
      consultantCompany: "Machinity Acoustic Consultants",
      consultantEmail: "qa@example.test",
      consultantLogoDataUrl: "",
      consultantPhone: "+90 000 000 00 00",
      consultantWordmarkLine: "Acoustic report honesty",
      citations: evidence.citations,
      contextLabel: testCase.contextLabel,
      corridorDossierCards: [],
      corridorDossierHeadline: "Generated scenario corridor snapshot is covered by method and output registers.",
      coverageItems,
      decisionTrailHeadline: evidence.decisionTrailHeadline,
      decisionTrailItems: evidence.decisionTrailItems,
      dynamicBranchDetail: branchSummary.detail,
      dynamicBranchLabel: branchSummary.value,
      executiveSummary: proposalBrief.executiveSummary,
      issueBaseReference: "MAC-GEN-20260427",
      issueCodePrefix: "MAC",
      issueNextReference: "MAC-GEN-20260427-02",
      issueRegisterItems: [
        {
          detail: "Generated report-honesty regression issue.",
          issuedOnLabel: "27 April 2026",
          label: "Current issue",
          reference: "MAC-GEN-20260427-01",
          statusLabel: "Rev 00"
        }
      ],
      issuedOnIso: "2026-04-27T12:00:00.000Z",
      issuedOnLabel: "27 April 2026",
      layers,
      methodDossierCards: methodDossier.cards,
      methodDossierHeadline: methodDossier.headline,
      methodTraceGroups: methodDossier.traceGroups,
      metrics,
      preparedBy: "DynEcho QA",
      primaryMetricLabel: metrics[0]?.label ?? "Primary read",
      primaryMetricValue: metrics[0]?.value ?? "Waiting",
      projectName: testCase.projectName,
      proposalAttention: "Calculator QA",
      proposalIssuePurpose: "Internal report honesty regression",
      proposalRecipient: "Machinity Internal QA",
      proposalReference: "MAC-GEN-20260427-01",
      proposalRevision: "Rev 00",
      proposalSubject: `${testCase.projectName} generated proposal`,
      proposalValidityNote: "Internal regression fixture only.",
      recommendationItems: proposalBrief.recommendationItems,
      reportProfile: "consultant",
      reportProfileLabel: REPORT_PROFILE_LABELS.consultant,
      studyContextLabel: testCase.studyContextLabel,
      studyModeLabel,
      validationDetail: validationSummary.detail,
      validationLabel: validationSummary.value,
      warnings: scenario.warnings
    },
    scenario
  };
}

function expectEveryReportSurfaceToContain(
  document: SimpleWorkbenchProposalDocument,
  expectedTexts: readonly string[]
): void {
  const surfaces = [
    buildSimpleWorkbenchProposalText(document),
    buildSimpleWorkbenchProposalPreviewHtml(document, "branded"),
    buildSimpleWorkbenchProposalPreviewHtml(document, "simple")
  ].map((surface) =>
    surface
      .replaceAll("&#39;", "'")
      .replaceAll("&amp;", "&")
      .toLowerCase()
  );

  for (const expectedText of expectedTexts) {
    const normalizedExpectedText = expectedText.toLowerCase();
    for (const surface of surfaces) {
      expect(surface).toContain(normalizedExpectedText);
    }
  }
}

function withLongProposalLayerLabels(document: SimpleWorkbenchProposalDocument): SimpleWorkbenchProposalDocument {
  return {
    ...document,
    assemblyHeadline: `${document.layers.length} visible solver rows with long material labels stress report wrapping.`,
    layers: document.layers.map((layer) => {
      const indexLabel = String(layer.index).padStart(2, "0");

      return {
        ...layer,
        label: `Very Long Acoustic Layer ${indexLabel} ${layer.label} Continuous Resilient Transfer Path Control UnbrokenTokenABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789${indexLabel}`
      };
    })
  };
}

function expectHtmlToUseLongTextWrapGuards(html: string): void {
  expect(html).toContain("table-layout: fixed");
  expect(html).toContain("overflow-wrap: anywhere");
  expect(html).toContain("word-break: break-word");
}

describe("simple workbench generated proposal document honesty", () => {
  it("keeps low-confidence floor live, missing-input, and unsupported posture visible across report surfaces", () => {
    const { coverageItems, document, scenario } = buildGeneratedProposalDocument({
      contextLabel: "Building prediction",
      id: "generated-rc-low-confidence-report",
      projectName: "Generated RC Low-Confidence Report",
      rows: REINFORCED_CONCRETE_LOW_CONFIDENCE_ROWS,
      studyContextLabel: "Option screening",
      studyMode: "floor",
      targetOutputs: ["Ln,w", "Rw", "Ctr", "L'n,w", "L'nT,w", "DeltaLw"]
    });

    expect(scenario.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(scenario.result?.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(coverageItems.find((item) => item.label === "Ln,w")).toEqual(
      expect.objectContaining({ postureLabel: "Low-confidence fallback", status: "live", value: "50 dB" })
    );
    expect(coverageItems.find((item) => item.label === "L'n,w")).toEqual(
      expect.objectContaining({ postureLabel: "Awaiting field input", status: "needs_input", value: "Not ready" })
    );
    expect(coverageItems.find((item) => item.label === "DeltaLw")).toEqual(
      expect.objectContaining({ postureLabel: "Unsupported on route", status: "unsupported", value: "Not ready" })
    );

    expectEveryReportSurfaceToContain(document, [
      "Low-confidence fallback",
      "mixed nearby-row concrete lane",
      "Output coverage register",
      "L'n,w",
      "Awaiting field input",
      "DeltaLw",
      "Unsupported on route"
    ]);
  });

  it("keeps wall field-airborne support posture and blocked Rw visible across report surfaces", () => {
    const { coverageItems, document, scenario } = buildGeneratedProposalDocument({
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      contextLabel: "Field between rooms",
      id: "generated-wall-field-report",
      projectName: "Generated Wall Field Report",
      rows: WALL_FIELD_ROWS,
      studyContextLabel: "Field review",
      studyMode: "wall",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "Rw", "STC", "C", "Ctr"]
    });

    expect(scenario.result?.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w", "STC", "C", "Ctr"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(coverageItems.find((item) => item.label === "R'w")).toEqual(
      expect.objectContaining({ postureLabel: "Field continuation", status: "live", value: "59 dB" })
    );
    expect(coverageItems.find((item) => item.label === "Dn,w")).toEqual(
      expect.objectContaining({ postureLabel: "Field continuation", status: "live", value: "58 dB" })
    );
    expect(coverageItems.find((item) => item.label === "DnT,w")).toEqual(
      expect.objectContaining({ postureLabel: "Field continuation", status: "live", value: "61 dB" })
    );
    expect(coverageItems.find((item) => item.label === "Rw")).toEqual(
      expect.objectContaining({ postureLabel: "Unsupported on route", status: "unsupported", value: "Not ready" })
    );

    expectEveryReportSurfaceToContain(document, [
      "Field continuation",
      "R'w",
      "Dn,w",
      "DnT,w",
      "Unsupported on route",
      "Rw",
      "Output coverage register"
    ]);
  });

  it("keeps many-layer long labels contained while preserving full table labels across report surfaces", () => {
    const { coverageItems, document: generatedDocument, scenario } = buildGeneratedProposalDocument({
      airborneContext: BUILDING_AIRBORNE_CONTEXT,
      contextLabel: "Building prediction",
      id: "generated-many-layer-long-label-report",
      impactFieldContext: BUILDING_IMPACT_CONTEXT,
      projectName: "Generated Many-Layer Long-Label Report",
      rows: makeUbiqExactSplitRows(),
      studyContextLabel: "Many-layer stress review",
      studyMode: "floor",
      targetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "DeltaLw", "Ctr"]
    });
    const document = withLongProposalLayerLabels(generatedDocument);
    const firstLongLabel = document.layers[0]?.label ?? "";
    const eighthLongLabel = document.layers[7]?.label ?? "";
    const lastLongLabel = document.layers[document.layers.length - 1]?.label ?? "";
    const proposalText = buildSimpleWorkbenchProposalText(document);
    const brandedHtml = buildSimpleWorkbenchProposalPreviewHtml(document, "branded");
    const simpleHtml = buildSimpleWorkbenchProposalPreviewHtml(document, "simple");
    const construction = buildSimpleWorkbenchProposalConstructionRender(document.layers, document.studyModeLabel);

    expect(document.layers).toHaveLength(53);
    expect(scenario.result?.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_200_exact_lab_2026");
    expect(coverageItems.find((item) => item.label === "Rw")).toEqual(
      expect.objectContaining({ postureLabel: "Companion airborne", status: "live", value: "63 dB" })
    );
    expect(coverageItems.find((item) => item.label === "DeltaLw")).toEqual(
      expect.objectContaining({ postureLabel: "Unsupported on route", status: "unsupported", value: "Not ready" })
    );

    expectHtmlToUseLongTextWrapGuards(brandedHtml);
    expectHtmlToUseLongTextWrapGuards(simpleHtml);
    expect(proposalText).toContain(lastLongLabel);
    expect(brandedHtml).toContain("53 visible rows");
    expect(brandedHtml).toContain(lastLongLabel);
    expect(simpleHtml).toContain(firstLongLabel);
    expect(simpleHtml).toContain(eighthLongLabel);
    expect(simpleHtml).toContain("45 additional layers omitted from this short-form layer table");
    expect(simpleHtml).toContain("the construction section still uses all 53 solver rows");
    expect(construction.svgMarkup).not.toContain(firstLongLabel);
    expect(construction.legendRowsHtml).toContain(firstLongLabel);
  });
});
