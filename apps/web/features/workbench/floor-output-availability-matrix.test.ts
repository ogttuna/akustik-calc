import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const FLOOR_MATRIX_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "DeltaLw",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const FIELD_BETWEEN_ROOMS_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const BUILDING_PREDICTION_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_PREDICTION_IMPACT_FIELD: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

function evaluateFloorPreset(input: {
  airborneContext?: AirborneContext | null;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  presetId: PresetId;
}) {
  const preset = getPresetById(input.presetId);
  const rows = preset.rows.map((row, index) => ({
    ...row,
    id: `${input.id}-${index + 1}`
  }));

  return evaluateScenario({
    airborneContext: input.airborneContext ?? null,
    id: input.id,
    impactFieldContext: input.impactFieldContext ?? null,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: FLOOR_MATRIX_OUTPUTS
  }).result;
}

function buildCardMap(input: {
  airborneContext?: AirborneContext | null;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  presetId: PresetId;
}) {
  const result = evaluateFloorPreset(input);

  return new Map(
    FLOOR_MATRIX_OUTPUTS.map((output) => [
      output,
      buildOutputCard({
        output,
        result,
        studyMode: "floor"
      })
    ])
  );
}

describe("floor output availability matrix", () => {
  it("keeps heavy concrete impact floor unlocks linear across lab, field, and full building routes", () => {
    const labCards = buildCardMap({
      id: "impact-floor-lab",
      presetId: "heavy_concrete_impact_floor"
    });
    const fieldCards = buildCardMap({
      airborneContext: FIELD_BETWEEN_ROOMS_CONTEXT,
      id: "impact-floor-field",
      presetId: "heavy_concrete_impact_floor"
    });
    const buildingCards = buildCardMap({
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      id: "impact-floor-building",
      impactFieldContext: BUILDING_PREDICTION_IMPACT_FIELD,
      presetId: "heavy_concrete_impact_floor"
    });

    expect(labCards.get("Rw")?.status).toBe("live");
    expect(labCards.get("Rw")?.value).toBe("58 dB");
    expect(labCards.get("Ln,w")?.status).toBe("live");
    expect(labCards.get("DeltaLw")?.value).toBe("33.4 dB");
    expect(labCards.get("Ln,w+CI")?.status).toBe("unsupported");
    expect(labCards.get("R'w")?.status).toBe("needs_input");
    expect(labCards.get("DnT,w")?.status).toBe("needs_input");
    expect(labCards.get("L'n,w")?.status).toBe("needs_input");
    expect(labCards.get("L'nT,w")?.status).toBe("needs_input");

    expect(fieldCards.get("R'w")?.status).toBe("live");
    expect(fieldCards.get("R'w")?.value).toBe("58 dB");
    expect(fieldCards.get("DnT,w")?.status).toBe("needs_input");
    expect(fieldCards.get("Ln,w+CI")?.status).toBe("unsupported");
    expect(fieldCards.get("L'n,w")?.status).toBe("needs_input");
    expect(fieldCards.get("L'nT,w")?.status).toBe("needs_input");

    expect(buildingCards.get("Rw")?.status).toBe("live");
    expect(buildingCards.get("R'w")?.status).toBe("live");
    expect(buildingCards.get("DnT,w")?.status).toBe("live");
    expect(buildingCards.get("DnT,w")?.value).toBe("60 dB");
    expect(buildingCards.get("Ln,w+CI")?.status).toBe("unsupported");
    expect(buildingCards.get("L'n,w")?.status).toBe("live");
    expect(buildingCards.get("L'n,w")?.value).toBe("53 dB");
    expect(buildingCards.get("L'nT,w")?.status).toBe("live");
    expect(buildingCards.get("L'nT,w")?.value).toBe("50.2 dB");
    expect(buildingCards.get("L'nT,50")?.status).toBe("needs_input");
  });

  it("keeps room-to-room field routes honest about low-frequency companions across exact, bound, and fallback floors", () => {
    const exactCards = buildCardMap({
      airborneContext: FIELD_BETWEEN_ROOMS_CONTEXT,
      id: "dataholz-clt-dry-field",
      presetId: "dataholz_clt_dry_exact"
    });
    const boundCards = buildCardMap({
      airborneContext: FIELD_BETWEEN_ROOMS_CONTEXT,
      id: "ubiq-bound-field",
      presetId: "ubiq_open_web_300_bound"
    });
    const lowConfidenceCards = buildCardMap({
      airborneContext: FIELD_BETWEEN_ROOMS_CONTEXT,
      id: "timber-bare-field",
      presetId: "timber_bare_impact_only_fallback"
    });

    expect(exactCards.get("Ln,w+CI")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "49 dB"
      })
    );
    expect(exactCards.get("L'n,w")).toEqual(
      expect.objectContaining({
        status: "needs_input",
        value: "Not ready"
      })
    );

    expect(boundCards.get("Ln,w")).toEqual(
      expect.objectContaining({
        status: "bound",
        value: "<= 51 dB"
      })
    );
    expect(boundCards.get("Ln,w+CI")).toEqual(
      expect.objectContaining({
        status: "unsupported",
        value: "Not ready"
      })
    );

    expect(lowConfidenceCards.get("Ln,w+CI")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "63.3 dB"
      })
    );
    expect(lowConfidenceCards.get("L'n,w")).toEqual(
      expect.objectContaining({
        status: "needs_input",
        value: "Not ready"
      })
    );
  });

  it("keeps bound-only UBIQ families explicit while airborne companions and field airborne reads stay live", () => {
    const cards = buildCardMap({
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      id: "ubiq-bound-building",
      impactFieldContext: BUILDING_PREDICTION_IMPACT_FIELD,
      presetId: "ubiq_open_web_300_bound"
    });

    expect(cards.get("Rw")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "63 dB"
      })
    );
    expect(cards.get("R'w")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "72 dB"
      })
    );
    expect(cards.get("DnT,w")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "73 dB"
      })
    );
    expect(cards.get("Ln,w")).toEqual(
      expect.objectContaining({
        status: "bound",
        value: "<= 51 dB"
      })
    );
    expect(cards.get("Ln,w+CI")).toEqual(
      expect.objectContaining({
        status: "unsupported",
        value: "Not ready"
      })
    );
    expect(cards.get("L'n,w")).toEqual(
      expect.objectContaining({
        status: "bound",
        value: "<= 54 dB"
      })
    );
    expect(cards.get("L'nT,w")).toEqual(
      expect.objectContaining({
        status: "bound",
        value: "<= 51.2 dB"
      })
    );
    expect(cards.get("L'nT,50")).toEqual(
      expect.objectContaining({
        status: "needs_input",
        value: "Not ready"
      })
    );
  });

  it("distinguishes exact, family-fallback, and low-confidence field continuations at the card layer", () => {
    const exactCards = buildCardMap({
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      id: "dataholz-clt-dry-building",
      impactFieldContext: BUILDING_PREDICTION_IMPACT_FIELD,
      presetId: "dataholz_clt_dry_exact"
    });
    const familyCards = buildCardMap({
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      id: "steel-suspended-building",
      impactFieldContext: BUILDING_PREDICTION_IMPACT_FIELD,
      presetId: "steel_suspended_fallback"
    });
    const lowConfidenceCards = buildCardMap({
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      id: "timber-bare-building",
      impactFieldContext: BUILDING_PREDICTION_IMPACT_FIELD,
      presetId: "timber_bare_impact_only_fallback"
    });

    expect(exactCards.get("Rw")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "62 dB"
      })
    );
    expect(exactCards.get("Ln,w")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "50 dB"
      })
    );
    expect(exactCards.get("Ln,w+CI")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "49 dB"
      })
    );
    expect(exactCards.get("L'nT,50")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "50 dB"
      })
    );

    expect(familyCards.get("Ln,w")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "58.3 dB"
      })
    );
    expect(familyCards.get("Ln,w+CI")).toEqual(
      expect.objectContaining({
        status: "unsupported",
        value: "Not ready"
      })
    );
    expect(familyCards.get("L'nT,w")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "58.5 dB"
      })
    );
    expect(familyCards.get("L'nT,50")).toEqual(
      expect.objectContaining({
        status: "needs_input",
        value: "Not ready"
      })
    );

    expect(lowConfidenceCards.get("Rw")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "51.6 dB"
      })
    );
    expect(lowConfidenceCards.get("Ln,w")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "61.3 dB"
      })
    );
    expect(lowConfidenceCards.get("Ln,w+CI")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "63.3 dB"
      })
    );
    expect(lowConfidenceCards.get("L'nT,50")).toEqual(
      expect.objectContaining({
        status: "live",
        value: "64.3 dB"
      })
    );
  });
});
