import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildOutputCard } from "./simple-workbench-output-model";
import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

const FIELD_OUTPUTS = ["Rw", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const;
const LAB_OUTPUTS = ["Rw", "Ctr", "Ln,w", "Ln,w+CI"] as const;

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
};

const DATAHOLZ_BONDED_FILL_TIMBER_FRAME_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: "27" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "60" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "60" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: "240" }
];

const DATAHOLZ_WET_NO_LINING_RAW_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "generic_fill", thicknessMm: "100" },
  { materialId: "screed", thicknessMm: "70" },
  { materialId: "mw_t_impact_layer", thicknessMm: "30" },
  { materialId: "timber_frame_floor", thicknessMm: "220" }
];

function evaluateFloorRows(input: {
  id: string;
  impactFieldContext?: Parameters<typeof evaluateScenario>[0]["impactFieldContext"];
  rows: readonly Omit<LayerDraft, "id">[];
  targetOutputs: readonly RequestedOutputId[];
}) {
  return evaluateScenario({
    id: input.id,
    impactFieldContext: input.impactFieldContext,
    name: input.id,
    rows: input.rows.map((row, index) => ({ ...row, id: `${input.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs
  });
}

function cardsByOutput(result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>, outputs: readonly RequestedOutputId[]) {
  return Object.fromEntries(
    outputs.map((output) => [
      output,
      buildOutputCard({
        output,
        result,
        studyMode: "floor"
      })
    ])
  );
}

describe("Dataholz timber-frame workbench source-truth route", () => {
  it("shows exact Dataholz timber-frame companion and impact answers on output cards", () => {
    const scenario = evaluateFloorRows({
      id: "dataholz-bonded-fill-timber-frame-field",
      impactFieldContext: FIELD_CONTEXT,
      rows: DATAHOLZ_BONDED_FILL_TIMBER_FRAME_ROWS,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdrnxa11a_timber_frame_lab_2026");
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(83);
    expect(scenario.result?.floorSystemRatings?.RwCtr).toBe(-17);
    expect(scenario.result?.impact?.basis).toBe("mixed_exact_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result?.impact?.LnW).toBe(42);
    expect(scenario.result?.impact?.CI).toBe(2);
    expect(scenario.result?.impact?.CI50_2500).toBe(14);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(44);
    expect(scenario.result?.impact?.LPrimeNW).toBe(44);
    expect(scenario.result?.impact?.LPrimeNTw).toBe(42);
    expect(scenario.result?.impact?.LPrimeNT50).toBe(56);

    const cards = cardsByOutput(scenario.result!, FIELD_OUTPUTS);

    expect(cards.Rw).toEqual(expect.objectContaining({ status: "live", value: "83 dB" }));
    expect(cards.Ctr).toEqual(expect.objectContaining({ status: "live", value: "-17 dB" }));
    expect(cards["Ln,w"]).toEqual(expect.objectContaining({ status: "live", value: "42 dB" }));
    expect(cards.CI).toEqual(expect.objectContaining({ status: "live", value: "+2 dB" }));
    expect(cards["CI,50-2500"]).toEqual(expect.objectContaining({ status: "live", value: "+14 dB" }));
    expect(cards["Ln,w+CI"]).toEqual(expect.objectContaining({ status: "live", value: "44 dB" }));
    expect(cards["L'n,w"]).toEqual(expect.objectContaining({ status: "live", value: "44 dB" }));
    expect(cards["L'nT,w"]).toEqual(expect.objectContaining({ status: "live", value: "42 dB" }));
    expect(cards["L'nT,50"]).toEqual(expect.objectContaining({ status: "live", value: "56 dB" }));
  });

  it("keeps the raw wet no-lining timber-frame stack off the exact impact route", () => {
    const scenario = evaluateFloorRows({
      id: "dataholz-wet-no-lining-raw",
      rows: DATAHOLZ_WET_NO_LINING_RAW_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemRatings?.basis).toBe("screening_mass_law_curve_seed_v3");
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(56);
    expect(scenario.result?.impact).toBeNull();
    expect(scenario.result?.floorSystemRatings?.RwCtr).toBe(50);
    expect(scenario.result?.floorSystemRatings?.RwCtrSemantic).toBe("rw_plus_ctr");
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ctr"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);

    const cards = cardsByOutput(scenario.result!, LAB_OUTPUTS);

    expect(cards.Rw).toEqual(expect.objectContaining({ status: "live", value: "56 dB" }));
    expect(cards.Ctr).toEqual(expect.objectContaining({ status: "live", value: "-6 dB" }));
    expect(cards["Ln,w"]).toEqual(expect.objectContaining({ status: "unsupported", value: "Not ready" }));
    expect(cards["Ln,w+CI"]).toEqual(expect.objectContaining({ status: "unsupported", value: "Not ready" }));
  });
});
