// Mixed-plain premium/moderate template resolvers carved out of
// `dynamic-airborne.ts` during `dynamic_airborne_split_refactor_v1`
// commit 5. This module owns the lab-target Rw tables for
// mixed-plain framed walls, the template-id → family resolvers,
// the fill-interpolation helper, and the curve builder that drapes
// a field template over the engine's broadband frequency grid.
//
// Split rationale:
// - Self-contained calibration data plus pure resolver functions —
//   no curve math of its own (it delegates to `interpolateTemplateDbByFill`
//   and `buildInterpolatedTemplateCurve` below) and no coupling to
//   predictor scoring or family detection.
// - Lets the next carves lift the larger framed-wall calibration
//   stack without stumbling over unrelated template definitions.

import type { AirborneContext, TransmissionLossCurve } from "@dynecho/shared";

import type { MixedPlainModerateFieldTemplateFamily } from "./mixed-plain-moderate-field-templates";
import type { MixedPlainPremiumFieldTemplateFamily } from "./mixed-plain-premium-field-templates";
import { clamp } from "./math";

export const MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ = [
  63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000
] as const;

export const MIXED_PLAIN_MODERATE_LAB_TARGET_RW = {
  acoustic: {
    resilient: {
      35: 47,
      42: 47,
      50: 48,
      60: 50
    },
    steel: {
      35: 42,
      42: 45,
      50: 44,
      60: 45
    }
  },
  fire: {
    resilient: {
      35: 46,
      42: 46,
      50: 47,
      60: 49
    },
    steel: {
      35: 41,
      42: 43,
      50: 43,
      60: 44
    }
  },
  firestop: {
    resilient: {
      35: 46,
      42: 46,
      50: 47,
      60: 49
    },
    steel: {
      35: 41,
      42: 43,
      50: 43,
      60: 44
    }
  }
} as const satisfies Record<
  MixedPlainModerateFieldTemplateFamily,
  Record<"resilient" | "steel", Record<35 | 42 | 50 | 60, number>>
>;

export const MIXED_PLAIN_PREMIUM_LAB_TARGET_RW = {
  diamond: {
    resilient: {
      35: 48,
      42: 48,
      50: 49,
      60: 50
    },
    steel: {
      35: 43,
      42: 45,
      50: 45,
      60: 46
    }
  },
  silent: {
    resilient: {
      35: 47,
      42: 48,
      50: 50,
      60: 50
    },
    steel: {
      35: 44,
      42: 44,
      50: 45,
      60: 47
    }
  }
} as const satisfies Record<
  MixedPlainPremiumFieldTemplateFamily,
  Record<"resilient" | "steel", Record<35 | 42 | 50 | 60, number>>
>;

export type MixedPlainModerateTemplateProfile = "resilient" | "steel";
export type MixedPlainModerateTemplateFill = 35 | 42 | 50 | 60;
export type MixedPlainModerateTemplateId =
  | "mixed_plain_acoustic_filled"
  | "mixed_plain_fire_filled"
  | "mixed_plain_firestop_filled";
export type MixedPlainPremiumTemplateId =
  | "mixed_plain_diamond_filled"
  | "mixed_plain_silent_filled";

export function getMixedPlainModerateFamilyAndTemplateId(candidate: {
  mixedPlainAcousticFilled: boolean;
  mixedPlainFireFilled: boolean;
  mixedPlainFirestopFilled: boolean;
}): { family: MixedPlainModerateFieldTemplateFamily; templateId: MixedPlainModerateTemplateId } | null {
  if (candidate.mixedPlainAcousticFilled) {
    return {
      family: "acoustic",
      templateId: "mixed_plain_acoustic_filled"
    };
  }

  if (candidate.mixedPlainFirestopFilled) {
    return {
      family: "firestop",
      templateId: "mixed_plain_firestop_filled"
    };
  }

  if (candidate.mixedPlainFireFilled) {
    return {
      family: "fire",
      templateId: "mixed_plain_fire_filled"
    };
  }

  return null;
}

export function getMixedPlainPremiumFamilyAndTemplateId(candidate: {
  mixedPlainDiamondFilled: boolean;
  mixedPlainSilentFilled: boolean;
}): { family: MixedPlainPremiumFieldTemplateFamily; templateId: MixedPlainPremiumTemplateId } | null {
  if (candidate.mixedPlainDiamondFilled) {
    return {
      family: "diamond",
      templateId: "mixed_plain_diamond_filled"
    };
  }

  if (candidate.mixedPlainSilentFilled) {
    return {
      family: "silent",
      templateId: "mixed_plain_silent_filled"
    };
  }

  return null;
}

export function getMixedPlainModerateTemplateProfile(
  context?: AirborneContext | null
): MixedPlainModerateTemplateProfile {
  if (context?.connectionType === "resilient_channel" || context?.studType === "resilient_stud") {
    return "resilient";
  }

  return "steel";
}

export function interpolateTemplateDbByFill(
  templatesByFill: Record<MixedPlainModerateTemplateFill, readonly number[]>,
  fillThicknessMm: number
): number[] {
  const anchors = [35, 42, 50, 60] as const;
  const clampedFill = clamp(fillThicknessMm, anchors[0], anchors[anchors.length - 1]);

  if (clampedFill <= anchors[0]) {
    return [...templatesByFill[anchors[0]]];
  }

  if (clampedFill >= anchors[anchors.length - 1]) {
    return [...templatesByFill[anchors[anchors.length - 1]]];
  }

  for (let index = 0; index < anchors.length - 1; index += 1) {
    const leftFill = anchors[index];
    const rightFill = anchors[index + 1];

    if (clampedFill < leftFill || clampedFill > rightFill) {
      continue;
    }

    if (clampedFill === leftFill) {
      return [...templatesByFill[leftFill]];
    }

    if (clampedFill === rightFill) {
      return [...templatesByFill[rightFill]];
    }

    const position = (clampedFill - leftFill) / (rightFill - leftFill);
    return templatesByFill[leftFill].map((leftValue, valueIndex) =>
      clamp(leftValue + ((templatesByFill[rightFill][valueIndex] - leftValue) * position), 0, 95)
    );
  }

  return [...templatesByFill[anchors[anchors.length - 1]]];
}

export function buildInterpolatedTemplateCurve(
  curve: TransmissionLossCurve,
  fillThicknessMm: number,
  templatesByFill: Record<MixedPlainModerateTemplateFill, readonly number[]>
): TransmissionLossCurve | null {
  if (curve.frequenciesHz.length !== MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ.length) {
    return null;
  }

  for (let index = 0; index < MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ.length; index += 1) {
    if (curve.frequenciesHz[index] !== MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ[index]) {
      return null;
    }
  }

  return {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: interpolateTemplateDbByFill(templatesByFill, fillThicknessMm)
  };
}
