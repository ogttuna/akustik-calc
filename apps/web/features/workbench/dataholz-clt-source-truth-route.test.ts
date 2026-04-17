import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildOutputCard } from "./simple-workbench-output-model";
import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

const LAB_OUTPUTS = ["Rw", "Ctr", "Ln,w", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];

const DATAHOLZ_DRY_CLT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" },
  { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: "30" },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" }
];

const DATAHOLZ_GDMTXA04A_VISIBLE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "60" },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "65" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
];

function evaluateFloorRows(input: {
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
  targetOutputs: readonly RequestedOutputId[];
}) {
  return evaluateScenario({
    id: input.id,
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

describe("Dataholz CLT workbench source-truth route", () => {
  it("shows exact Dataholz dry CLT impact answers on output cards", () => {
    const scenario = evaluateFloorRows({
      id: "dataholz-dry-clt-lab",
      rows: DATAHOLZ_DRY_CLT_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(62);
    expect(scenario.result?.impact?.basis).toBe("official_floor_system_exact_match");
    expect(scenario.result?.impact?.LnW).toBe(50);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(49);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ctr"]);

    const cards = cardsByOutput(scenario.result!, LAB_OUTPUTS);

    expect(cards.Rw).toEqual(expect.objectContaining({ status: "live", value: "62 dB" }));
    expect(cards.Ctr).toEqual(expect.objectContaining({ status: "unsupported", value: "Not ready" }));
    expect(cards["Ln,w"]).toEqual(expect.objectContaining({ status: "live", value: "50 dB" }));
    expect(cards["Ln,w+CI"]).toEqual(expect.objectContaining({ status: "live", value: "49 dB" }));
  });

  it("keeps Dataholz GDMTXA04A visible rows on the defended estimate route instead of reopening exact matching", () => {
    const scenario = evaluateFloorRows({
      id: "dataholz-gdmtxa04a-visible-lab",
      rows: DATAHOLZ_GDMTXA04A_VISIBLE_ROWS,
      targetOutputs: LAB_OUTPUTS
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.impact.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.result?.impact?.estimateCandidateIds).toEqual(["dataholz_gdmtxa01a_clt_lab_2026"]);
    expect(scenario.result?.floorSystemRatings?.Rw).toBe(65);
    expect(scenario.result?.impact?.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(scenario.result?.impact?.LnW).toBe(49);
    expect(scenario.result?.impact?.LnWPlusCI).toBe(53);
    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ctr"]);

    const cards = cardsByOutput(scenario.result!, LAB_OUTPUTS);

    expect(cards.Rw).toEqual(expect.objectContaining({ status: "live", value: "65 dB" }));
    expect(cards.Ctr).toEqual(expect.objectContaining({ status: "unsupported", value: "Not ready" }));
    expect(cards["Ln,w"]).toEqual(expect.objectContaining({ status: "live", value: "49 dB" }));
    expect(cards["Ln,w+CI"]).toEqual(expect.objectContaining({ status: "live", value: "53 dB" }));
  });
});
