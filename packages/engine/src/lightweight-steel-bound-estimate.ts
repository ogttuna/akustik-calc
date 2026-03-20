import { BOUND_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  BoundFloorSystem,
  FloorSystemBoundEstimateResult,
  ImpactBoundCalculation,
  ResolvedLayer
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { fitPercentFromEvaluation } from "./floor-system-evaluation";
import { clamp, round1 } from "./math";

type LightweightSteelBoundFamily = "open_web_or_rolled" | "steel_joist_or_purlin";
type InterpolatedBoundSupport = {
  lnWUpperBound: number;
  rw: number;
  rwCtr: number;
};

const UNSPECIFIED_LIGHTWEIGHT_STEEL_ID = "lightweight_steel_floor";
const SUPPORT_EQUIVALENCE_TOLERANCE_DB = 0.05;

function rowsForFamily(family: LightweightSteelBoundFamily): BoundFloorSystem[] {
  return BOUND_FLOOR_SYSTEMS.filter((system) =>
    family === "open_web_or_rolled"
      ? system.id.startsWith("ubiq_fl33_open_web_steel_")
      : system.id.startsWith("ubiq_fl32_steel_")
  );
}

function detectExplicitBoundFamily(layers: readonly ResolvedLayer[]): LightweightSteelBoundFamily | null {
  const baseMaterialIds = layers
    .filter((layer) => layer.floorRole === "base_structure")
    .map((layer) => layer.material.id);

  if (baseMaterialIds.includes("open_web_steel_floor")) {
    return "open_web_or_rolled";
  }

  if (baseMaterialIds.includes("steel_joist_floor")) {
    return "steel_joist_or_purlin";
  }

  return null;
}

function hasUnspecifiedLightweightSteelCarrier(layers: readonly ResolvedLayer[]): boolean {
  return layers.some(
    (layer) => layer.floorRole === "base_structure" && layer.material.id === UNSPECIFIED_LIGHTWEIGHT_STEEL_ID
  );
}

function getBaseThicknessMm(layers: readonly ResolvedLayer[]): number | null {
  const base = layers.find((layer) => layer.floorRole === "base_structure");
  return base ? base.thicknessMm : null;
}

function hasSteelBoundTopology(layers: readonly ResolvedLayer[]): boolean {
  const floorDeck = layers.find((layer) => layer.floorRole === "floating_screed");
  const floorCovering = layers.find((layer) => layer.floorRole === "floor_covering");
  const ceilingCavity = layers.find((layer) => layer.floorRole === "ceiling_cavity");
  const ceilingBoards = layers.filter((layer) => layer.floorRole === "ceiling_board");

  return Boolean(
    floorDeck?.material.id === "inex_floor_panel" &&
      Math.abs(floorDeck.thicknessMm - 19) <= 3 &&
      floorCovering?.material.id === "engineered_timber_with_acoustic_underlay" &&
      ceilingCavity?.material.id === "ubiq_resilient_ceiling" &&
      ceilingBoards.length === 2 &&
      ceilingBoards.every((layer) => layer.material.id === "firestop_board" && Math.abs(layer.thicknessMm - 16) <= 1.5)
  );
}

function interpolate(value200: number, value300: number, blend: number): number {
  return value200 + ((value300 - value200) * blend);
}

function interpolateRowPair(
  row200: BoundFloorSystem,
  row300: BoundFloorSystem,
  blend: number
): InterpolatedBoundSupport | null {
  const row200Upper = row200.impactBounds.LnWUpperBound;
  const row300Upper = row300.impactBounds.LnWUpperBound;
  const row200Rw = row200.airborneRatings.Rw;
  const row300Rw = row300.airborneRatings.Rw;
  const row200RwCtr = row200.airborneRatings.RwCtr;
  const row300RwCtr = row300.airborneRatings.RwCtr;

  if (
    !Number.isFinite(row200Upper) ||
    !Number.isFinite(row300Upper) ||
    !Number.isFinite(row200Rw) ||
    !Number.isFinite(row300Rw) ||
    !Number.isFinite(row200RwCtr) ||
    !Number.isFinite(row300RwCtr)
  ) {
    return null;
  }

  return {
    lnWUpperBound: interpolate(row200Upper as number, row300Upper as number, blend),
    rw: interpolate(row200Rw, row300Rw, blend),
    rwCtr: interpolate(row200RwCtr as number, row300RwCtr as number, blend)
  };
}

function supportEnvelopesEquivalent(
  left: InterpolatedBoundSupport,
  right: InterpolatedBoundSupport
): boolean {
  return (
    Math.abs(left.lnWUpperBound - right.lnWUpperBound) <= SUPPORT_EQUIVALENCE_TOLERANCE_DB &&
    Math.abs(left.rw - right.rw) <= SUPPORT_EQUIVALENCE_TOLERANCE_DB &&
    Math.abs(left.rwCtr - right.rwCtr) <= SUPPORT_EQUIVALENCE_TOLERANCE_DB
  );
}

function dedupeSystems(systems: readonly BoundFloorSystem[]): BoundFloorSystem[] {
  const seen = new Set<string>();
  const unique: BoundFloorSystem[] = [];

  for (const system of systems) {
    if (seen.has(system.id)) {
      continue;
    }

    seen.add(system.id);
    unique.push(system);
  }

  return unique;
}

function getRowPair(family: LightweightSteelBoundFamily): {
  row200: BoundFloorSystem;
  row300: BoundFloorSystem;
} | null {
  const familyRows = rowsForFamily(family);
  const row200 = familyRows.find((system) => system.match.baseStructure?.thicknessMm === 200);
  const row300 = familyRows.find((system) => system.match.baseStructure?.thicknessMm === 300);

  if (!row200 || !row300) {
    return null;
  }

  return { row200, row300 };
}

function buildLowerBoundImpact(
  basis: ImpactBoundCalculation["basis"],
  lnWUpperBound: number,
  notes: string
): ImpactBoundCalculation {
  return {
    LnWUpperBound: round1(lnWUpperBound),
    basis,
    confidence: getImpactConfidenceForBasis(basis),
    notes: [notes],
    scope: "family_bound_estimate"
  };
}

export function deriveSpecificLightweightSteelBoundEstimate(
  layers: readonly ResolvedLayer[]
): FloorSystemBoundEstimateResult | null {
  if (!hasSteelBoundTopology(layers)) {
    return null;
  }

  const family = detectExplicitBoundFamily(layers);
  const baseThicknessMm = getBaseThicknessMm(layers);
  if (!family || !Number.isFinite(baseThicknessMm)) {
    return null;
  }

  if ((baseThicknessMm as number) < 180 || (baseThicknessMm as number) > 320) {
    return null;
  }

  const rowPair = getRowPair(family);
  if (!rowPair) {
    return null;
  }

  const blend = clamp((((baseThicknessMm as number) - 200) / 100), 0, 1);
  const interpolated = interpolateRowPair(rowPair.row200, rowPair.row300, blend);
  if (!interpolated) {
    return null;
  }

  const basis = "predictor_lightweight_steel_bound_interpolation_estimate" as const;

  return {
    airborneRatings: {
      Rw: round1(interpolated.rw),
      RwCtr: round1(interpolated.rwCtr)
    },
    fitPercent: fitPercentFromEvaluation({
      score: 6,
      totalSignalCount: 7
    }),
    kind: "bound_interpolation",
    lowerBoundImpact: buildLowerBoundImpact(
      basis,
      interpolated.lnWUpperBound,
      `Interpolated the official ${family === "open_web_or_rolled" ? "UBIQ FL-33 open-web / rolled-steel" : "UBIQ FL-32 steel-joist / purlin"} 2 x 16 mm ceiling family. Ln,w remains an upper bound only and stays at or below ${round1(interpolated.lnWUpperBound)} dB. Interpolation used 200 mm and 300 mm published rows with blend ${(blend * 100).toFixed(0)}%.`
    ),
    notes: [
      "Official lightweight-steel family interpolation stayed on the bound-only lane.",
      "DynEcho kept the published airborne companion values while refusing to fabricate an exact Ln,w number.",
      `Source rows: ${rowPair.row200.id} and ${rowPair.row300.id}.`
    ],
    sourceSystems: [rowPair.row200, rowPair.row300],
    structuralFamily: "lightweight steel"
  };
}

export function deriveMissingSupportFormLightweightSteelBoundEstimate(
  layers: readonly ResolvedLayer[]
): FloorSystemBoundEstimateResult | null {
  if (!hasSteelBoundTopology(layers) || !hasUnspecifiedLightweightSteelCarrier(layers)) {
    return null;
  }

  const baseThicknessMm = getBaseThicknessMm(layers);
  if (!Number.isFinite(baseThicknessMm) || (baseThicknessMm as number) < 180 || (baseThicknessMm as number) > 320) {
    return null;
  }

  const fl32RowPair = getRowPair("steel_joist_or_purlin");
  const fl33RowPair = getRowPair("open_web_or_rolled");
  if (!fl32RowPair || !fl33RowPair) {
    return null;
  }

  const blend = clamp((((baseThicknessMm as number) - 200) / 100), 0, 1);
  const fl32 = interpolateRowPair(fl32RowPair.row200, fl32RowPair.row300, blend);
  const fl33 = interpolateRowPair(fl33RowPair.row200, fl33RowPair.row300, blend);
  if (!fl32 || !fl33) {
    return null;
  }

  if (supportEnvelopesEquivalent(fl32, fl33)) {
    const exactEndpointSourceSystems =
      blend <= SUPPORT_EQUIVALENCE_TOLERANCE_DB
        ? [fl32RowPair.row200, fl33RowPair.row200]
        : Math.abs(blend - 1) <= SUPPORT_EQUIVALENCE_TOLERANCE_DB
          ? [fl32RowPair.row300, fl33RowPair.row300]
          : [fl32RowPair.row200, fl32RowPair.row300, fl33RowPair.row200, fl33RowPair.row300];
    const sourceSystems = dedupeSystems(exactEndpointSourceSystems);
    const basis = "predictor_lightweight_steel_bound_interpolation_estimate" as const;

    return {
      airborneRatings: {
        Rw: round1(fl32.rw),
        RwCtr: round1(fl32.rwCtr)
      },
      fitPercent: fitPercentFromEvaluation({
        score: 6,
        totalSignalCount: 7
      }),
      kind: "bound_interpolation",
      lowerBoundImpact: buildLowerBoundImpact(
        basis,
        fl32.lnWUpperBound,
        `Official UBIQ FL-32 and FL-33 rows converge at the current ${round1(baseThicknessMm as number)} mm carrier depth, so DynEcho kept the same family-bound support without the conservative crossover lane. Ln,w remains an upper bound only and stays at or below ${round1(fl32.lnWUpperBound)} dB.`
      ),
      notes: [
        "Official lightweight-steel bound support converged across both candidate support forms at the current thickness.",
        "UBIQ FL-32 and FL-33 publish the same airborne companions and Ln,w upper bound here, so DynEcho did not need the conservative crossover lane.",
        `Source rows: ${sourceSystems.map((system) => system.id).join(", ")}.`
      ],
      sourceSystems,
      structuralFamily: "lightweight steel"
    };
  }

  const basis = "predictor_lightweight_steel_missing_support_form_bound_estimate" as const;
  const lnWUpperBound = Math.max(fl32.lnWUpperBound, fl33.lnWUpperBound);
  const rw = Math.min(fl32.rw, fl33.rw);
  const rwCtr = Math.min(fl32.rwCtr, fl33.rwCtr);

  return {
    airborneRatings: {
      Rw: round1(rw),
      RwCtr: round1(rwCtr)
    },
    fitPercent: fitPercentFromEvaluation({
      score: 5,
      totalSignalCount: 7
    }),
    kind: "missing_support_form_bound",
    lowerBoundImpact: buildLowerBoundImpact(
      basis,
      lnWUpperBound,
      `Support form stayed unspecified, so DynEcho carried the conservative crossover of the official UBIQ FL-32 and FL-33 2 x 16 mm ceiling families. Ln,w remains an upper bound only and stays at or below ${round1(lnWUpperBound)} dB.`
    ),
    notes: [
      "Lightweight-steel support form was left unspecified, so DynEcho stayed on the conservative bound-only crossover lane.",
      "Airborne ratings come from the lower published family value, while Ln,w keeps the higher published upper bound.",
      `Source rows: ${fl32RowPair.row200.id}, ${fl32RowPair.row300.id}, ${fl33RowPair.row200.id}, ${fl33RowPair.row300.id}.`
    ],
    sourceSystems: [fl32RowPair.row200, fl32RowPair.row300, fl33RowPair.row200, fl33RowPair.row300],
    structuralFamily: "lightweight steel"
  };
}
