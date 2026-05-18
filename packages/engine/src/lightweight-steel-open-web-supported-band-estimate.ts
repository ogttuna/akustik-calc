import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorSystemEstimateResult,
  ImpactCalculation,
  ResolvedLayer
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import {
  evaluateMatchedFloorSystem,
  fitPercentFromEvaluation
} from "./floor-system-evaluation";
import { clamp, ksRound1, round1 } from "./math";

export const OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS =
  "predictor_lightweight_steel_open_web_supported_band_similarity_estimate";

type SupportedBandFamilyId = "fl24" | "fl26";
type SupportedBandFinish = "bare" | "timber_underlay";
type SupportedBandTopology = {
  baseThicknessMm: number;
  boardLayerCount: 2;
  boardThicknessMm: number;
  cavityDepthMm: number;
  cavityFillThicknessMm: number;
  familyId: SupportedBandFamilyId;
  finish: SupportedBandFinish;
  floatingDeckThicknessMm: number;
};
type AnchorGrid = {
  deck16: {
    row200: ExactFloorSystem;
    row300: ExactFloorSystem;
    row400: ExactFloorSystem;
  };
  deck19: {
    row200: ExactFloorSystem;
    row300: ExactFloorSystem;
    row400: ExactFloorSystem;
  };
};

const REFERENCE_CAVITY_DEPTH_MM = 65;
const REFERENCE_FILL_THICKNESS_MM = 145;

function getSingleLayer(layers: readonly ResolvedLayer[], floorRole: ResolvedLayer["floorRole"]) {
  return layers.find((layer) => layer.floorRole === floorRole);
}

function thicknessNear(value: number, target: number, tolerance = 1.5): boolean {
  return Math.abs(value - target) <= tolerance;
}

function detectFinish(layers: readonly ResolvedLayer[]): SupportedBandFinish | null {
  const floorCovering = getSingleLayer(layers, "floor_covering");

  if (!floorCovering) {
    return "bare";
  }

  return floorCovering.material.id === "engineered_timber_with_acoustic_underlay"
    ? "timber_underlay"
    : null;
}

function detectSupportedBandFamily(ceilingBoards: readonly ResolvedLayer[]): {
  boardThicknessMm: number;
  familyId: SupportedBandFamilyId;
} | null {
  if (
    ceilingBoards.length !== 2 ||
    ceilingBoards.some((layer) => layer.material.id !== "firestop_board")
  ) {
    return null;
  }

  const boardThicknessMm =
    ceilingBoards.reduce((sum, layer) => sum + layer.thicknessMm, 0) / ceilingBoards.length;

  if (thicknessNear(boardThicknessMm, 13)) {
    return { boardThicknessMm, familyId: "fl24" };
  }

  if (thicknessNear(boardThicknessMm, 16)) {
    return { boardThicknessMm, familyId: "fl26" };
  }

  return null;
}

function detectSupportedBandTopology(layers: readonly ResolvedLayer[]): SupportedBandTopology | null {
  const base = getSingleLayer(layers, "base_structure");
  const floatingDeck = getSingleLayer(layers, "floating_screed");
  const ceilingCavity = getSingleLayer(layers, "ceiling_cavity");
  const ceilingFill = getSingleLayer(layers, "ceiling_fill");
  const family = detectSupportedBandFamily(layers.filter((layer) => layer.floorRole === "ceiling_board"));
  const finish = detectFinish(layers);

  if (
    !base ||
    base.material.id !== "open_web_steel_floor" ||
    !floatingDeck ||
    floatingDeck.material.id !== "inex_floor_panel" ||
    !ceilingCavity ||
    ceilingCavity.material.id !== "ubiq_resilient_ceiling" ||
    !ceilingFill ||
    ceilingFill.material.id !== "rockwool" ||
    !family ||
    !finish
  ) {
    return null;
  }

  if (
    !Number.isFinite(base.thicknessMm) ||
    !Number.isFinite(floatingDeck.thicknessMm) ||
    !Number.isFinite(ceilingCavity.thicknessMm) ||
    !Number.isFinite(ceilingFill.thicknessMm) ||
    !(base.thicknessMm >= 180 && base.thicknessMm <= 420) ||
    floatingDeck.thicknessMm < 14 ||
    floatingDeck.thicknessMm > 22 ||
    ceilingCavity.thicknessMm <= 0 ||
    ceilingFill.thicknessMm <= 0
  ) {
    return null;
  }

  return {
    baseThicknessMm: base.thicknessMm,
    boardLayerCount: 2,
    boardThicknessMm: family.boardThicknessMm,
    cavityDepthMm: ceilingCavity.thicknessMm,
    cavityFillThicknessMm: ceilingFill.thicknessMm,
    familyId: family.familyId,
    finish,
    floatingDeckThicknessMm: floatingDeck.thicknessMm
  };
}

function supportedBandRowId(input: {
  deckThicknessMm: 16 | 19;
  familyId: SupportedBandFamilyId;
  finish: SupportedBandFinish;
  joistMm: 200 | 300 | 400;
}): string {
  if (input.finish === "bare") {
    return `ubiq_${input.familyId}_open_web_steel_${input.joistMm}_${input.deckThicknessMm}mm_bare_exact_lab_2026`;
  }

  const deckSuffix = input.deckThicknessMm === 16 ? "_16mm" : "";
  return `ubiq_${input.familyId}_open_web_steel_${input.joistMm}${deckSuffix}_exact_lab_2026`;
}

function exactFloorSystem(id: string): ExactFloorSystem | null {
  return EXACT_FLOOR_SYSTEMS.find((system) => system.id === id) ?? null;
}

function getAnchorGrid(topology: SupportedBandTopology): AnchorGrid | null {
  const buildDeck = (deckThicknessMm: 16 | 19) => {
    const row200 = exactFloorSystem(
      supportedBandRowId({ deckThicknessMm, familyId: topology.familyId, finish: topology.finish, joistMm: 200 })
    );
    const row300 = exactFloorSystem(
      supportedBandRowId({ deckThicknessMm, familyId: topology.familyId, finish: topology.finish, joistMm: 300 })
    );
    const row400 = exactFloorSystem(
      supportedBandRowId({ deckThicknessMm, familyId: topology.familyId, finish: topology.finish, joistMm: 400 })
    );

    return row200 && row300 && row400 ? { row200, row300, row400 } : null;
  };
  const deck16 = buildDeck(16);
  const deck19 = buildDeck(19);

  return deck16 && deck19 ? { deck16, deck19 } : null;
}

function interpolateByBaseThickness(
  baseThicknessMm: number,
  rows: AnchorGrid["deck16"],
  pick: (row: ExactFloorSystem) => number | undefined
): number | null {
  const value200 = pick(rows.row200);
  const value300 = pick(rows.row300);
  const value400 = pick(rows.row400);

  if (!Number.isFinite(value200) || !Number.isFinite(value300) || !Number.isFinite(value400)) {
    return null;
  }

  if (baseThicknessMm <= 300) {
    const blend = clamp((baseThicknessMm - 200) / 100, 0, 1);
    return (value200 as number) + (((value300 as number) - (value200 as number)) * blend);
  }

  const blend = clamp((baseThicknessMm - 300) / 100, 0, 1);
  return (value300 as number) + (((value400 as number) - (value300 as number)) * blend);
}

function interpolateMetric(
  topology: SupportedBandTopology,
  grid: AnchorGrid,
  pick: (row: ExactFloorSystem) => number | undefined
): number | null {
  const value16 = interpolateByBaseThickness(topology.baseThicknessMm, grid.deck16, pick);
  const value19 = interpolateByBaseThickness(topology.baseThicknessMm, grid.deck19, pick);

  if (!Number.isFinite(value16) || !Number.isFinite(value19)) {
    return null;
  }

  const deckBlend = clamp((topology.floatingDeckThicknessMm - 16) / 3, 0, 1);
  return (value16 as number) + (((value19 as number) - (value16 as number)) * deckBlend);
}

function allSourceRows(grid: AnchorGrid): ExactFloorSystem[] {
  return [
    grid.deck16.row200,
    grid.deck16.row300,
    grid.deck16.row400,
    grid.deck19.row200,
    grid.deck19.row300,
    grid.deck19.row400
  ];
}

function buildSourceNotes(rows: readonly ExactFloorSystem[], layers: readonly ResolvedLayer[]): string {
  return rows
    .map((row) => {
      const fitPercent = fitPercentFromEvaluation(evaluateMatchedFloorSystem(layers, row));
      return `${row.label} (${fitPercent}% fit)`;
    })
    .join("; ");
}

export function deriveLightweightSteelOpenWebSupportedBandSimilarityEstimate(
  layers: readonly ResolvedLayer[]
): FloorSystemEstimateResult | null {
  const topology = detectSupportedBandTopology(layers);
  if (!topology) {
    return null;
  }

  const grid = getAnchorGrid(topology);
  if (!grid) {
    return null;
  }

  const lnW = interpolateMetric(topology, grid, (row) => row.impactRatings.LnW);
  const ci = interpolateMetric(topology, grid, (row) => row.impactRatings.CI);
  const lnWPlusCI = interpolateMetric(topology, grid, (row) => row.impactRatings.LnWPlusCI);
  const rw = interpolateMetric(topology, grid, (row) => row.airborneRatings.Rw);
  const rwCtr = interpolateMetric(topology, grid, (row) => row.airborneRatings.RwCtr);

  if (
    !Number.isFinite(lnW) ||
    !Number.isFinite(ci) ||
    !Number.isFinite(lnWPlusCI) ||
    !Number.isFinite(rw) ||
    !Number.isFinite(rwCtr)
  ) {
    return null;
  }

  const familyReferenceBoardThicknessMm = topology.familyId === "fl24" ? 13 : 16;
  const boardFactor = clamp(topology.boardThicknessMm / familyReferenceBoardThicknessMm, 0.9, 1.1);
  const cavityFactor = clamp(topology.cavityDepthMm / REFERENCE_CAVITY_DEPTH_MM, 0.75, 1.25);
  const fillFactor = clamp(topology.cavityFillThicknessMm / REFERENCE_FILL_THICKNESS_MM, 0.75, 1.2);
  const ceilingFactor = clamp((0.45 * boardFactor) + (0.35 * cavityFactor) + (0.2 * fillFactor), 0.8, 1.2);
  const adjustedLnWRaw = (lnW as number) - ((ceilingFactor - 1) * 2);
  const adjustedCiRaw = (ci as number) - ((ceilingFactor - 1) * 1);
  const adjustedLnW = ksRound1(adjustedLnWRaw);
  const adjustedCi = ksRound1(adjustedCiRaw);
  const adjustedLnWPlusCI = ksRound1((lnWPlusCI as number) - ((ceilingFactor - 1) * 3));
  const adjustedRw = ksRound1((rw as number) + ((ceilingFactor - 1) * 1.5));
  const adjustedRwCtr = ksRound1((rwCtr as number) + ((ceilingFactor - 1) * 1));
  const rows = allSourceRows(grid);
  const fitPercent = round1(
    rows.reduce((sum, row) => sum + fitPercentFromEvaluation(evaluateMatchedFloorSystem(layers, row)), 0) /
      rows.length
  );
  const sourceIds = rows.map((row) => row.id);
  const finishLabel = topology.finish === "bare" ? "bare INEX" : "engineered timber + acoustic underlay";

  const impact: ImpactCalculation = {
    CI: adjustedCi,
    LnW: adjustedLnW,
    LnWPlusCI: adjustedLnWPlusCI,
    availableOutputs: ["Ln,w", "CI", "Ln,w+CI"],
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    confidence: getImpactConfidenceForBasis(OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS),
    estimateCandidateIds: sourceIds,
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        CI: adjustedCi,
        LnW: adjustedLnW,
        LnWPlusCI: adjustedLnWPlusCI
      },
      OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
    ),
    notes: [
      `Open-web steel ${topology.familyId.toUpperCase()} supported-band similarity estimate stayed inside the UBIQ elastic suspended-ceiling source grid.`,
      `Current carrier depth ${ksRound1(topology.baseThicknessMm)} mm and INEX deck ${ksRound1(topology.floatingDeckThicknessMm)} mm were interpolated across 200 / 300 / 400 mm and 16 / 19 mm published rows.`,
      `Finish package: ${finishLabel}; ceiling factor ${ksRound1(ceilingFactor)} from cavity ${ksRound1(topology.cavityDepthMm)} mm and fill ${ksRound1(topology.cavityFillThicknessMm)} mm.`,
      `Source rows: ${buildSourceNotes(rows, layers)}.`,
      "This is a narrow same-source-family similarity runtime, not a generic steel blend or a bound-only carpet conversion."
    ],
    scope: "family_estimate"
  };

  return {
    airborneRatings: {
      Rw: adjustedRw,
      RwCtr: adjustedRwCtr,
      RwCtrSemantic: "rw_plus_ctr"
    },
    fitPercent,
    impact,
    kind: "family_archetype",
    notes: [
      `Open-web steel ${topology.familyId.toUpperCase()} supported-band similarity runtime selected six same-family UBIQ source anchors.`,
      `Carrier depth ${ksRound1(topology.baseThicknessMm)} mm, deck ${ksRound1(topology.floatingDeckThicknessMm)} mm, board stack ${ksRound1(topology.boardThicknessMm)} mm x ${topology.boardLayerCount}.`,
      `Source rows: ${sourceIds.join(", ")}.`
    ],
    sourceSystems: rows,
    structuralFamily: "lightweight steel"
  };
}
