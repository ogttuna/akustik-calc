import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

type RouteSnapshot = {
  boundFloorSystemMatchId: string | null;
  cards: Record<TargetOutput, CardSnapshot>;
  floorSystemEstimateKind: string | null;
  impactBasis: string | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lnWPlusCIUpperBound: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const UBIQ_CARPET_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "12" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const UBIQ_CARPET_NEAR_MISSES: Record<string, readonly Omit<LayerDraft, "id">[]> = {
  disjointCarpetSplit: [
    ...UBIQ_CARPET_ROWS.slice(0, 5),
    { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "4" },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "1" },
    { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "8" },
    ...UBIQ_CARPET_ROWS.slice(6)
  ],
  extraCeilingBoard: [
    ...UBIQ_CARPET_ROWS.slice(0, 3),
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
    ...UBIQ_CARPET_ROWS.slice(3)
  ],
  missingCeilingFill: [...UBIQ_CARPET_ROWS.slice(0, 3), ...UBIQ_CARPET_ROWS.slice(4)],
  missingInexFloorPanel: [...UBIQ_CARPET_ROWS.slice(0, 6), UBIQ_CARPET_ROWS[7]!],
  wrongJoistDepth: [
    ...UBIQ_CARPET_ROWS.slice(0, 7),
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "305" }
  ]
};

function buildRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` }));
}

function snapshot(id: string, rows: readonly Omit<LayerDraft, "id">[]): {
  route: RouteSnapshot;
  warnings: readonly string[];
} {
  const evaluated = evaluateScenario({
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows: buildRows(rows, id),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(evaluated.result, `${id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    route: {
      boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
      cards: Object.fromEntries(
        TARGET_OUTPUTS.map((output) => {
          const card = buildOutputCard({
            output,
            result,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ) as RouteSnapshot["cards"],
      floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
      impactBasis: result.impact?.basis ?? null,
      lnW: result.impact?.LnW ?? null,
      lnWPlusCI: result.impact?.LnWPlusCI ?? null,
      lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

describe("UBIQ Ln,w+CI near-miss workbench posture", () => {
  it("keeps malformed carpet bound near-misses off live impact cards", () => {
    for (const [id, rows] of Object.entries(UBIQ_CARPET_NEAR_MISSES)) {
      const actual = snapshot(id, rows);

      expect(actual.route.boundFloorSystemMatchId, id).toBeNull();
      expect(actual.route.floorSystemEstimateKind, id).toBeNull();
      expect(actual.route.impactBasis, id).toBeNull();
      expect(actual.route.lnW, id).toBeNull();
      expect(actual.route.lnWPlusCI, id).toBeNull();
      expect(actual.route.lnWPlusCIUpperBound, id).toBeNull();
      expect(actual.route.supported, id).toEqual(["Rw"]);
      expect(actual.route.unsupported, id).toEqual(["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
      expect(actual.route.cards.Rw.status, id).toBe("live");
      expect(actual.route.cards["Ln,w"].status, id).toBe("unsupported");
      expect(actual.route.cards.CI.status, id).toBe("unsupported");
      expect(actual.route.cards["Ln,w+CI"].status, id).toBe("unsupported");
      expect(actual.route.cards["L'n,w"].status, id).toBe("needs_input");
      expect(actual.route.cards["L'nT,w"].status, id).toBe("needs_input");
      expect(actual.route.cards["L'nT,50"].status, id).toBe("needs_input");
      expect(
        actual.warnings.some((warning) => /impact sound outputs are still unavailable|impact sound outputs are not available/i.test(warning)),
        id
      ).toBe(true);
    }
  });
});
