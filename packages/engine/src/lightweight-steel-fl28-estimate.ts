import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorSystemEstimateResult,
  FloorSystemRecommendation,
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

const FL28_SOURCE_IDS = [
  "ubiq_fl28_open_web_steel_200_exact_lab_2026",
  "ubiq_fl28_open_web_steel_300_exact_lab_2026",
  "ubiq_fl28_open_web_steel_400_exact_lab_2026"
] as const;

const REFERENCE_BASE_THICKNESS_MM = 300;
const REFERENCE_DECK_THICKNESS_MM = 19;
const REFERENCE_BOARD_THICKNESS_MM = 16;
const REFERENCE_CAVITY_DEPTH_MM = 65;
const REFERENCE_FILL_THICKNESS_MM = 145;

type Fl28Rows = {
  row200: ExactFloorSystem;
  row300: ExactFloorSystem;
  row400: ExactFloorSystem;
};

type Fl28Topology = {
  baseThicknessMm: number;
  cavityDepthMm: number;
  ceilingBoardThicknessMm: number;
  floatingDeckThicknessMm: number;
  cavityFillThicknessMm: number;
};

function getFl28Rows(): Fl28Rows | null {
  const rows = FL28_SOURCE_IDS.map((id) => EXACT_FLOOR_SYSTEMS.find((system) => system.id === id));

  if (rows.some((row) => !row)) {
    return null;
  }

  const [row200, row300, row400] = rows as ExactFloorSystem[];
  return { row200, row300, row400 };
}

function getSingleLayer(layers: readonly ResolvedLayer[], floorRole: ResolvedLayer["floorRole"]) {
  return layers.find((layer) => layer.floorRole === floorRole);
}

function detectFl28Topology(layers: readonly ResolvedLayer[]): Fl28Topology | null {
  const base = getSingleLayer(layers, "base_structure");
  const floorCovering = getSingleLayer(layers, "floor_covering");
  const floatingDeck = getSingleLayer(layers, "floating_screed");
  const ceilingCavity = getSingleLayer(layers, "ceiling_cavity");
  const ceilingBoards = layers.filter((layer) => layer.floorRole === "ceiling_board");
  const ceilingFill = getSingleLayer(layers, "ceiling_fill");

  if (
    !base ||
    base.material.id !== "open_web_steel_floor" ||
    !floorCovering ||
    floorCovering.material.id !== "engineered_timber_with_acoustic_underlay" ||
    !floatingDeck ||
    floatingDeck.material.id !== "inex_floor_panel" ||
    !ceilingCavity ||
    ceilingCavity.material.id !== "ubiq_resilient_ceiling"
  ) {
    return null;
  }

  if (
    ceilingBoards.length !== 3 ||
    ceilingBoards.some((layer) => layer.material.id !== "firestop_board")
  ) {
    return null;
  }

  const baseThicknessMm = base.thicknessMm;
  const floatingDeckThicknessMm = floatingDeck.thicknessMm;
  const cavityDepthMm = ceilingCavity.thicknessMm;
  const ceilingBoardThicknessMm =
    ceilingBoards.reduce((sum, layer) => sum + layer.thicknessMm, 0) / ceilingBoards.length;
  const cavityFillThicknessMm = ceilingFill?.thicknessMm ?? REFERENCE_FILL_THICKNESS_MM;

  if (
    !Number.isFinite(baseThicknessMm) ||
    !Number.isFinite(floatingDeckThicknessMm) ||
    !Number.isFinite(cavityDepthMm) ||
    !Number.isFinite(ceilingBoardThicknessMm) ||
    !(baseThicknessMm >= 180 && baseThicknessMm <= 420) ||
    floatingDeckThicknessMm <= 0 ||
    cavityDepthMm <= 0 ||
    ceilingBoardThicknessMm <= 0
  ) {
    return null;
  }

  return {
    baseThicknessMm,
    cavityDepthMm,
    ceilingBoardThicknessMm,
    floatingDeckThicknessMm,
    cavityFillThicknessMm
  };
}

function interpolateByThickness(
  baseThicknessMm: number,
  rows: Fl28Rows,
  pick: (row: ExactFloorSystem) => number | undefined
): number | null {
  const value200 = pick(rows.row200);
  const value300 = pick(rows.row300);
  const value400 = pick(rows.row400);

  if (
    !Number.isFinite(value200) ||
    !Number.isFinite(value300) ||
    !Number.isFinite(value400)
  ) {
    return null;
  }

  if (baseThicknessMm <= REFERENCE_BASE_THICKNESS_MM) {
    const blend = clamp((baseThicknessMm - 200) / 100, 0, 1);
    return (value200 as number) + (((value300 as number) - (value200 as number)) * blend);
  }

  const blend = clamp((baseThicknessMm - 300) / 100, 0, 1);
  return (value300 as number) + (((value400 as number) - (value300 as number)) * blend);
}

function buildSourceNotes(
  rows: Fl28Rows,
  recommendations: readonly FloorSystemRecommendation[]
): string {
  const fitById = new Map(recommendations.map((entry) => [entry.system.id, entry.fitPercent]));

  return [rows.row200, rows.row300, rows.row400]
    .map((row) => `${row.label} (${fitById.get(row.id) ?? 0}% fit)`)
    .join("; ");
}

export function deriveLightweightSteelFl28Estimate(
  layers: readonly ResolvedLayer[],
  recommendations: readonly FloorSystemRecommendation[]
): FloorSystemEstimateResult | null {
  const topology = detectFl28Topology(layers);
  if (!topology) {
    return null;
  }

  const rows = getFl28Rows();
  if (!rows) {
    return null;
  }

  const lnW = interpolateByThickness(topology.baseThicknessMm, rows, (row) => row.impactRatings.LnW);
  const ci = interpolateByThickness(topology.baseThicknessMm, rows, (row) => row.impactRatings.CI);
  const rw = interpolateByThickness(topology.baseThicknessMm, rows, (row) => row.airborneRatings.Rw);
  const rwCtr = interpolateByThickness(topology.baseThicknessMm, rows, (row) => row.airborneRatings.RwCtr);

  if (
    !Number.isFinite(lnW) ||
    !Number.isFinite(ci) ||
    !Number.isFinite(rw) ||
    !Number.isFinite(rwCtr)
  ) {
    return null;
  }

  const deckFactor = clamp(topology.floatingDeckThicknessMm / REFERENCE_DECK_THICKNESS_MM, 0.8, 1.2);
  const boardFactor = clamp(topology.ceilingBoardThicknessMm / REFERENCE_BOARD_THICKNESS_MM, 0.8, 1.2);
  const cavityFactor = clamp(topology.cavityDepthMm / REFERENCE_CAVITY_DEPTH_MM, 0.75, 1.25);
  const fillFactor = clamp(topology.cavityFillThicknessMm / REFERENCE_FILL_THICKNESS_MM, 0.75, 1.2);
  const ceilingFactor = clamp((0.45 * boardFactor) + (0.35 * cavityFactor) + (0.2 * fillFactor), 0.8, 1.2);

  const adjustedLnWRaw = (lnW as number) - ((deckFactor - 1) * 1.5) - ((ceilingFactor - 1) * 2);
  const adjustedCiRaw = (ci as number) - ((ceilingFactor - 1) * 1);
  const adjustedLnW = ksRound1(adjustedLnWRaw);
  const adjustedCi = ksRound1(adjustedCiRaw);
  const adjustedRw = ksRound1((rw as number) + ((deckFactor - 1) * 0.8) + ((ceilingFactor - 1) * 1.5));
  const adjustedRwCtr = ksRound1((rwCtr as number) + ((ceilingFactor - 1) * 1));
  const adjustedLnWPlusCi = ksRound1(adjustedLnWRaw + adjustedCiRaw);
  const evaluations = [rows.row200, rows.row300, rows.row400].map((row) =>
    evaluateMatchedFloorSystem(layers, row)
  );
  const fitPercent = round1(
    evaluations.reduce((sum, evaluation) => sum + fitPercentFromEvaluation(evaluation), 0) / evaluations.length
  );

  const impact: ImpactCalculation = {
    CI: adjustedCi,
    LnW: adjustedLnW,
    LnWPlusCI: adjustedLnWPlusCi,
    availableOutputs: ["Ln,w", "CI", "Ln,w+CI"],
    basis: "predictor_lightweight_steel_fl28_interpolation_estimate",
    confidence: getImpactConfidenceForBasis("predictor_lightweight_steel_fl28_interpolation_estimate"),
    estimateCandidateIds: FL28_SOURCE_IDS.slice(),
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        CI: adjustedCi,
        LnW: adjustedLnW,
        LnWPlusCI: adjustedLnWPlusCi
      },
      "predictor_lightweight_steel_fl28_interpolation_estimate"
    ),
    notes: [
      "Published lightweight-steel FL-28 interpolation stayed inside the exact UBIQ open-web steel branch.",
      `Current carrier depth ${ksRound1(topology.baseThicknessMm)} mm interpolated between the published 200 / 300 / 400 mm FL-28 rows.`,
      `Deck factor ${ksRound1(deckFactor)}, ceiling factor ${ksRound1(ceilingFactor)}; DynEcho scaled the 19 mm INEX deck and the 3 x 16 mm resilient ceiling family without fabricating a generic steel blend.`,
      `Source rows: ${buildSourceNotes(rows, recommendations)}.`,
      "This remains a labeled published-family estimate, not an exact lab record."
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
      "Lightweight-steel FL-28 interpolation stayed on the published exact open-web family before any broader steel-family blend.",
      `Carrier depth ${ksRound1(topology.baseThicknessMm)} mm, cavity ${ksRound1(topology.cavityDepthMm)} mm, board stack ${ksRound1(topology.ceilingBoardThicknessMm)} mm x 3.`,
      `Source rows: ${rows.row200.id}, ${rows.row300.id}, ${rows.row400.id}.`
    ],
    sourceSystems: [rows.row200, rows.row300, rows.row400],
    structuralFamily: "lightweight steel"
  };
}
