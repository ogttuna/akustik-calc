import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId, WORKBENCH_PRESETS } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const BUILDING_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "Dn,w",
  "DnT,w",
  "Ln,w",
  "DeltaLw",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_IMPACT_FIELD: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "Dn,w", "Ln,w", "DeltaLw", "Ln,w+CI", "L'n,w"];

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const LOW_FREQUENCY_CAPABLE_PRESET_IDS = new Set<PresetId>([
  "clt_floor",
  "dataholz_timber_frame_exact",
  "dataholz_dry_floor_exact",
  "dataholz_dry_rc_exact",
  "dataholz_clt_wet_fill_exact",
  "dataholz_clt_dry_exact",
  "dataholz_clt_fill_exact",
  "tuas_clt_260_exact",
  "tuas_open_box_exact",
  "tuas_open_box_dry_exact",
  "tuas_concrete_dry_exact",
  "ubiq_open_web_200_exact",
  "ubiq_open_web_400_exact",
  "timber_bare_impact_only_fallback",
  "tuas_clt_exact"
]);

const BOUND_ONLY_PRESET_IDS = new Set<PresetId>([
  "ubiq_open_web_300_bound",
  "ubiq_steel_250_bound",
  "ubiq_steel_200_unspecified_bound",
  "ubiq_steel_300_unspecified_bound"
]);

const DELTA_LIVE_PRESET_IDS = new Set<PresetId>([
  "heavy_concrete_impact_floor",
  "regupol_multi_45_tile_exact",
  "regupol_multi_45_porcelain_exact",
  "regupol_curve_8_exact",
  "regupol_curve_8_wet_bound",
  "getzner_afm_21_delta",
  "getzner_afm_33_delta",
  "getzner_afm_35_delta"
]);

function evaluateFloorPreset(presetId: PresetId) {
  const preset = getPresetById(presetId);
  const rows = preset.rows.map((row, index) => ({
    ...row,
    id: `${preset.id}-${index + 1}`
  }));

  return evaluateScenario({
    airborneContext: BUILDING_CONTEXT,
    id: preset.id,
    impactFieldContext: BUILDING_IMPACT_FIELD,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: BUILDING_OUTPUTS
  }).result;
}

function cardMapForPreset(presetId: PresetId) {
  const result = evaluateFloorPreset(presetId);

  return {
    cards: new Map(
      BUILDING_OUTPUTS.map((output) => [
        output,
        buildOutputCard({
          output,
          result,
          studyMode: "floor"
        })
      ])
    ),
    result
  };
}

function cardMapForFieldPreset(presetId: PresetId) {
  const preset = getPresetById(presetId);
  const rows = preset.rows.map((row, index) => ({
    ...row,
    id: `${preset.id}-${index + 1}`
  }));
  const result = evaluateScenario({
    airborneContext: FIELD_CONTEXT,
    id: `${preset.id}-field`,
    impactFieldContext: null,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  }).result;

  return {
    cards: new Map(
      FIELD_OUTPUTS.map((output) => [
        output,
        buildOutputCard({
          output,
          result,
          studyMode: "floor"
        })
      ])
    ),
    result
  };
}

describe("floor full preset contract matrix", () => {
  it("keeps every floor preset numerically sane on the full building route and exposes the correct low-frequency posture", () => {
    const failures: string[] = [];

    for (const preset of WORKBENCH_PRESETS.filter((preset) => preset.studyMode === "floor")) {
      const { cards, result } = cardMapForPreset(preset.id);

      if (!result) {
        failures.push(`${preset.id}: result should stay available on building route`);
        continue;
      }

      if (!result.supportedTargetOutputs.length) {
        failures.push(`${preset.id}: expected at least one supported output`);
      }

      const supported = new Set(result.supportedTargetOutputs);
      const unsupported = new Set(result.unsupportedTargetOutputs);

      for (const output of BUILDING_OUTPUTS) {
        if (supported.has(output) === unsupported.has(output)) {
          failures.push(`${preset.id}: output ${output} should belong to exactly one support bucket`);
        }

        const card = cards.get(output)!;

        if ((card.status === "live" || card.status === "bound") && /not ready/i.test(card.value)) {
          failures.push(`${preset.id}: ${output} should not show Not ready while ${card.status}`);
        }
      }

      const lnwPlusCiCard = cards.get("Ln,w+CI")!;
      const lPrimeNT50Card = cards.get("L'nT,50")!;
      const lnwCard = cards.get("Ln,w")!;
      const lPrimeNWCard = cards.get("L'n,w")!;
      const lPrimeNTwCard = cards.get("L'nT,w")!;
      const deltaCard = cards.get("DeltaLw")!;

      if (LOW_FREQUENCY_CAPABLE_PRESET_IDS.has(preset.id)) {
        if (lnwPlusCiCard.status !== "live") {
          failures.push(`${preset.id}: expected Ln,w+CI to stay live on this low-frequency-capable route`);
        }
        if (lPrimeNT50Card.status !== "live") {
          failures.push(`${preset.id}: expected L'nT,50 to stay live on this low-frequency-capable route`);
        }
      } else {
        if (lnwPlusCiCard.status === "live") {
          failures.push(`${preset.id}: Ln,w+CI should not be fabricated on this route`);
        }
        if (lPrimeNT50Card.status === "live") {
          failures.push(`${preset.id}: L'nT,50 should not be fabricated on this route`);
        }
      }

      if (BOUND_ONLY_PRESET_IDS.has(preset.id)) {
        if (lnwCard.status !== "bound" || lPrimeNWCard.status !== "bound" || lPrimeNTwCard.status !== "bound") {
          failures.push(`${preset.id}: bound-only families should keep impact outputs explicitly one-sided`);
        }
        if (lnwPlusCiCard.status === "live" || lPrimeNT50Card.status === "live") {
          failures.push(`${preset.id}: bound-only families should fail closed on Ln,w+CI and L'nT,50`);
        }
      }

      if (DELTA_LIVE_PRESET_IDS.has(preset.id)) {
        if (deltaCard.status !== "live") {
          failures.push(`${preset.id}: expected DeltaLw to stay live on this route`);
        }
      } else if (deltaCard.status === "live") {
        failures.push(`${preset.id}: unexpected live DeltaLw outside the curated heavy-floor/delta corridors`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps every floor preset numerically sane on the room-to-room field route and only surfaces Ln,w+CI on CI-capable lanes", () => {
    const failures: string[] = [];

    for (const preset of WORKBENCH_PRESETS.filter((preset) => preset.studyMode === "floor")) {
      const { cards, result } = cardMapForFieldPreset(preset.id);

      if (!result) {
        failures.push(`${preset.id}: result should stay available on field route`);
        continue;
      }

      const lnwCard = cards.get("Ln,w")!;
      const lnwPlusCiCard = cards.get("Ln,w+CI")!;
      const deltaCard = cards.get("DeltaLw")!;
      const lPrimeNwCard = cards.get("L'n,w")!;

      for (const output of FIELD_OUTPUTS) {
        const card = cards.get(output)!;

        if ((card.status === "live" || card.status === "bound") && /not ready/i.test(card.value)) {
          failures.push(`${preset.id}: ${output} should not show Not ready while ${card.status}`);
        }
      }

      if (LOW_FREQUENCY_CAPABLE_PRESET_IDS.has(preset.id)) {
        if (lnwPlusCiCard.status !== "live") {
          failures.push(`${preset.id}: expected Ln,w+CI to stay live on the field route`);
        }
      } else if (lnwPlusCiCard.status === "live") {
        failures.push(`${preset.id}: Ln,w+CI should not be fabricated on the field route`);
      }

      if (BOUND_ONLY_PRESET_IDS.has(preset.id)) {
        if (lnwCard.status !== "bound") {
          failures.push(`${preset.id}: bound-only families should keep Ln,w conservative on the field route`);
        }
        if (lnwPlusCiCard.status === "live") {
          failures.push(`${preset.id}: bound-only families should fail closed on Ln,w+CI`);
        }
      }

      if (DELTA_LIVE_PRESET_IDS.has(preset.id)) {
        if (deltaCard.status !== "live") {
          failures.push(`${preset.id}: expected DeltaLw to stay live on the field route`);
        }
      } else if (deltaCard.status === "live") {
        failures.push(`${preset.id}: unexpected live DeltaLw on the room-to-room field route`);
      }

      if (lPrimeNwCard.status === "live" || lPrimeNwCard.status === "bound") {
        failures.push(`${preset.id}: L'n,w should stay parked until explicit K is supplied`);
      }
    }

    expect(failures).toEqual([]);
  });
});
