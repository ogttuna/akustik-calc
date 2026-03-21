import type { AirborneContextMode, RequestedOutputId } from "@dynecho/shared";

import type { StudyMode } from "./preset-definitions";
import { REQUESTED_OUTPUT_LABELS } from "./workbench-data";

const FIELD_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A", "DnT,A,k"]);
const STANDARDIZED_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A", "DnT,A,k"]);
const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);
const STANDARDIZED_FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'nT,w", "L'nT,50"]);
const LOW_FREQUENCY_COMPANION_OUTPUTS = new Set<RequestedOutputId>(["Ln,w+CI", "CI", "CI,50-2500"]);

export type GuidedOutputUnlock = {
  detail: string;
  outputs: readonly RequestedOutputId[];
  title: string;
};

function parsePositiveNumber(value: string): number | undefined {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function uniqueOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return Array.from(new Set(outputs));
}

function selectOutputs(outputs: readonly RequestedOutputId[], filter: (output: RequestedOutputId) => boolean): RequestedOutputId[] {
  return outputs.filter(filter);
}

export function formatUnlockOutputs(outputs: readonly RequestedOutputId[]): string {
  return outputs.map((output) => REQUESTED_OUTPUT_LABELS[output]).join(" · ");
}

export function getGuidedOutputUnlocks(input: {
  airborneContextMode: AirborneContextMode;
  airbornePanelHeightMm: string;
  airbornePanelWidthMm: string;
  airborneReceivingRoomRt60S: string;
  airborneReceivingRoomVolumeM3: string;
  impactGuideKDb: string;
  impactGuideReceivingRoomVolumeM3: string;
  parkedOutputs: readonly RequestedOutputId[];
  studyMode: StudyMode;
}): GuidedOutputUnlock[] {
  const parkedOutputs = uniqueOutputs(input.parkedOutputs);

  if (!parkedOutputs.length) {
    return [];
  }

  const groups: GuidedOutputUnlock[] = [];
  const parkedFieldAirborneOutputs = selectOutputs(parkedOutputs, (output) => FIELD_AIRBORNE_OUTPUTS.has(output));

  if (parkedFieldAirborneOutputs.length) {
    if (input.airborneContextMode === "element_lab") {
      groups.push({
        detail: "These reads are field-side only. Move the project context out of lab mode before expecting room-to-room or building-side airborne outputs.",
        outputs: parkedFieldAirborneOutputs,
        title: "Switch project context"
      });
    } else {
      const missingGeometry = !parsePositiveNumber(input.airbornePanelWidthMm) || !parsePositiveNumber(input.airbornePanelHeightMm);

      if (missingGeometry) {
        groups.push({
          detail: "Field airborne reads need the separating element width and height before this route can defend them.",
          outputs: parkedFieldAirborneOutputs,
          title: "Enter partition width and height"
        });
      } else {
        const parkedStandardizedAirborneOutputs = selectOutputs(parkedFieldAirborneOutputs, (output) => STANDARDIZED_AIRBORNE_OUTPUTS.has(output));
        const needsAirborneVolume = parkedStandardizedAirborneOutputs.length > 0 && !parsePositiveNumber(input.airborneReceivingRoomVolumeM3);

        if (needsAirborneVolume) {
          groups.push({
            detail: "Standardized airborne outputs still need the receiving-room volume once partition geometry is already in place.",
            outputs: parkedStandardizedAirborneOutputs,
            title: "Enter airborne room volume"
          });
        }
      }
    }
  }

  if (input.studyMode === "floor") {
    const parkedFieldImpactOutputs = selectOutputs(parkedOutputs, (output) => FIELD_IMPACT_OUTPUTS.has(output));
    const parkedStandardizedFieldImpactOutputs = selectOutputs(parkedFieldImpactOutputs, (output) =>
      STANDARDIZED_FIELD_IMPACT_OUTPUTS.has(output)
    );
    const hasImpactK = Boolean(parsePositiveNumber(input.impactGuideKDb));

    if (parkedFieldImpactOutputs.length && !hasImpactK) {
      groups.push({
        detail: "Field impact outputs need the direct K correction before the route can carry L'n,w-style reads.",
        outputs: selectOutputs(parkedFieldImpactOutputs, (output) => output !== "LnT,A"),
        title: "Enter impact K correction"
      });
    } else if (parkedStandardizedFieldImpactOutputs.length && !parsePositiveNumber(input.impactGuideReceivingRoomVolumeM3)) {
      groups.push({
        detail: "Standardized field impact outputs still need the receiving-room volume after K is already present.",
        outputs: parkedStandardizedFieldImpactOutputs,
        title: "Enter impact room volume"
      });
    }

    if (parkedOutputs.includes("LnT,A")) {
      groups.push({
        detail: "LnT,A is not fabricated from the simple route. Use an exact Dutch field-band source when this companion is required.",
        outputs: ["LnT,A"],
        title: "Use exact Dutch field bands"
      });
    }
  }

  const parkedLowFrequencyOutputs = selectOutputs(parkedOutputs, (output) => LOW_FREQUENCY_COMPANION_OUTPUTS.has(output));

  if (parkedLowFrequencyOutputs.length) {
    groups.push({
      detail: "Low-frequency companion terms appear only on impact lanes that actually carry CI data.",
      outputs: parkedLowFrequencyOutputs,
      title: "Choose a CI-capable impact lane"
    });
  }

  return groups.filter((group) => group.outputs.length > 0);
}
