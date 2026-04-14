"use client";

import type { ImpactGuideDerivation, ImpactGuideSource } from "@dynecho/engine";
import type { ExactImpactSourceLabOrField, ImpactBoundCalculation, ImpactCalculation } from "@dynecho/shared";

import { formatDecimal } from "@/lib/format";

import type { ParsedImpactBandImport } from "./impact-band-import";
import type { ParsedImpactImprovementImport } from "./impact-improvement-import";
import type { WorkbenchFieldStatus } from "./workbench-field-status";

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function formatDb(value: number): string {
  return `${formatDecimal(value)} dB`;
}

function formatGuideSourceLabel(source: ImpactGuideSource): string {
  return source === "heavy_reference" ? "heavy-reference Ln,w lane" : "live stack / exact family Ln,w lane";
}

function formatFieldLaneLabel(source: ImpactGuideSource): string {
  return source === "live_stack" ? "the live impact lane and the guide lane" : "the guide lane";
}

export function buildImpactGuideFieldGuides(input: {
  baseImpact: ImpactCalculation | null;
  baseLowerBoundImpact: ImpactBoundCalculation | null;
  ci50_2500Input: string;
  ciInput: string;
  guideResult: ImpactGuideDerivation | null;
  hdInput: string;
  kInput: string;
  massRatioInput: string;
  receivingRoomVolumeM3: string;
  selectedSource: ImpactGuideSource;
  smallRoomEstimateEnabled: boolean;
}): Record<"ci" | "ci50_2500" | "guideBase" | "hd" | "k" | "massRatio" | "smallRoom" | "volume", WorkbenchFieldStatus> {
  const hasBaseLnW = typeof input.baseImpact?.LnW === "number";
  const hasBaseLnWUpperBound = typeof input.baseLowerBoundImpact?.LnWUpperBound === "number";
  const hasBaseLnWPlusCIUpperBound = typeof input.baseLowerBoundImpact?.LnWPlusCIUpperBound === "number";
  const carriedCi = typeof input.baseImpact?.CI === "number" ? input.baseImpact.CI : null;
  const carriedCi50_2500 = typeof input.baseImpact?.CI50_2500 === "number" ? input.baseImpact.CI50_2500 : null;
  const manualCi = hasValue(input.ciInput);
  const manualCi50_2500 = hasValue(input.ci50_2500Input);
  const manualK = hasValue(input.kInput);
  const manualHd = hasValue(input.hdInput);
  const manualMassRatio = hasValue(input.massRatioInput);
  const manualVolume = hasValue(input.receivingRoomVolumeM3);
  const standardizedFieldActive = Boolean(input.guideResult?.standardizedFieldEstimateActive);
  const guideHasLnWPlusCI = typeof input.guideResult?.LnWPlusCI === "number";
  const guideBaseKind = input.guideResult?.baseKind ?? (hasBaseLnWUpperBound ? "upper_bound" : hasBaseLnW ? "exact" : null);
  const lookupKActive = input.guideResult?.KSource === "lookup_from_mass_ratio";
  const lookupHdActive = input.guideResult?.HdSource === "lookup_from_receiving_room_volume";

  return {
    ci: manualCi && guideBaseKind === "upper_bound"
      ? {
          currentUse: "The explicit CI value is stored, but the active guide base is only a conservative Ln,w upper bound.",
          kind: "conditional",
          meaning: "CI can only produce Ln,w+CI after you switch to an exact Ln,w source."
        }
      : manualCi
      ? {
          currentUse: "The explicit CI override is currently driving Ln,w+CI and the K/Hd shortcut path for L'nT,50.",
          kind: "active",
          meaning: "CI is the low-frequency companion term published beside Ln,w for ISO 717-2 impact ratings."
        }
        : carriedCi != null
        ? {
            currentUse: `No override is entered, so CI is anchored to the selected base source at ${formatDb(carriedCi)}.`,
            kind: "anchored",
            meaning: "CI travels with exact families, exact curves, or curated live-stack evidence when that source publishes it."
          }
        : hasBaseLnWUpperBound
          ? {
              currentUse: "The selected base is only a conservative Ln,w upper bound, so CI does not auto-carry here.",
              kind: "conditional",
              meaning: "Switch to an exact Ln,w source if you need an automatic CI companion."
            }
        : hasBaseLnW
          ? {
              currentUse: "A base Ln,w exists, but Ln,w+CI stays unavailable until you enter CI or load a source that publishes it.",
              kind: "conditional",
              meaning: "CI only matters when you need combined Ln,w+CI or the guide K/Hd branch."
            }
          : {
              currentUse: "No guide base Ln,w is active yet, so CI is not consulted.",
              kind: "ignored",
              meaning: "CI is a companion term for an already-selected lab-side Ln,w source."
            },
    ci50_2500: manualCi50_2500 && guideBaseKind === "upper_bound"
      ? {
          currentUse: "The explicit CI,50-2500 value is stored, but the active guide base is only a conservative Ln,w upper bound.",
          kind: "conditional",
          meaning: "Switch to an exact Ln,w source if you want CI,50-2500 to flow into L'nT,50."
        }
      : manualCi50_2500
      ? {
          currentUse: "The explicit CI,50-2500 value is currently available for standardized field-side L'nT,50.",
          kind: "active",
          meaning: "CI,50-2500 is the extended low-frequency companion term used beside standardized field impact ratings."
        }
        : carriedCi50_2500 != null
        ? {
            currentUse: `No override is entered, so the field-side companion term is anchored to the selected source at ${formatDb(carriedCi50_2500)}.`,
            kind: "anchored",
            meaning: "When exact bands or curated families publish CI,50-2500, this lane carries it forward automatically."
          }
        : standardizedFieldActive || hasBaseLnW || hasBaseLnWUpperBound
          ? {
              currentUse: "The field-side path is available, but L'nT,50 still needs an explicit CI,50-2500 value.",
              kind: "conditional",
              meaning: "This field only affects the standardized field-volume branch of the guide lane."
            }
          : {
              currentUse: "The guide lane does not have a valid field-side base yet, so this term is idle.",
              kind: "ignored",
              meaning: "CI,50-2500 is not used by pure lab-side Ln,w reporting."
            },
    guideBase: hasBaseLnW
      ? {
          currentUse: `Guide derivation is currently anchored to the ${formatGuideSourceLabel(input.selectedSource)}.`,
          kind: "active",
          meaning: "Guide base chooses which existing Ln,w result feeds the carry-over and field-side supplement lane."
        }
      : hasBaseLnWUpperBound
        ? {
            currentUse: `Guide derivation is currently anchored to the ${formatGuideSourceLabel(input.selectedSource)} with a conservative Ln,w upper bound.`,
            kind: "active",
            meaning: "When only bound support exists, guide outputs also stay on an upper-bound lane instead of fabricating an exact field result."
          }
      : hasBaseLnWPlusCIUpperBound
        ? {
            currentUse: "The selected source only has a combined Ln,w+CI upper bound, so guide derivation is not active.",
            kind: "conditional",
            meaning: "Guide outputs need an exact Ln,w source or an explicit Ln,w upper-bound lane; a combined Ln,w+CI bound is reportable but not a field-guide base."
          }
      : {
          currentUse: "The selected guide base has not produced Ln,w yet. Activate a live impact result or the heavy-reference shortcut first.",
          kind: "conditional",
          meaning: "Guide outputs cannot derive until one upstream lane yields Ln,w."
        },
    hd: manualHd && manualK && guideHasLnWPlusCI
      ? {
          currentUse: "Hd is active in the Turkish K/Hd shortcut and is contributing to L'nT,50 right now.",
          kind: "active",
          meaning: "Hd is the receiving-room correction term from the Turkish simple-guide path."
        }
      : !manualHd && lookupHdActive
        ? {
            currentUse: "Hd is being looked up from the receiving-room volume bracket and is contributing to the Turkish L'nT,50 shortcut right now.",
            kind: "anchored",
            meaning: "Hd is the Turkish guide correction for room volume. When left blank, this workflow can read it from Table 2.8 if V is present."
          }
        : manualHd
        ? {
            currentUse: "Hd is stored but not used yet because the shortcut branch still needs K and Ln,w+CI.",
            kind: "conditional",
            meaning: "Hd only participates in the explicit guide shortcut for L'nT,50."
          }
        : manualK || guideHasLnWPlusCI
          ? {
              currentUse: "The guide shortcut is almost ready, but Hd is still missing.",
              kind: "conditional",
              meaning: "Add Hd only if you want the explicit Turkish guide L'nT,50 path."
            }
          : {
            currentUse: "No shortcut branch is active, so Hd is ignored.",
            kind: "ignored",
            meaning: "Hd has no effect on direct Ln,w, Ln,w+CI, or the standardized field-volume path."
            },
    k: manualK && hasBaseLnW
      ? {
          currentUse: standardizedFieldActive
            ? `K is currently active in L'n,w and the standardized field-volume L'nT,w path across ${formatFieldLaneLabel(input.selectedSource)}.`
            : `K is currently active in L'n,w and any available K/Hd shortcut outputs across ${formatFieldLaneLabel(input.selectedSource)}.`,
          kind: "active",
          meaning: "K is the field correction that converts lab-side Ln,w into field-side L'n,w."
        }
      : !manualK && lookupKActive
        ? {
            currentUse: `K is being looked up from the Turkish Table 2.7 mass-ratio bracket and is active across ${formatFieldLaneLabel(input.selectedSource)}.`,
            kind: "anchored",
            meaning: "When you do not enter K explicitly, the local-guide lane can derive it from the verified a/(b+c+d+e) mass-ratio brackets."
          }
        : manualVolume || manualHd || input.smallRoomEstimateEnabled || hasBaseLnW || hasBaseLnWUpperBound
        ? {
            currentUse: "Downstream field outputs are waiting for K. Without it, the guide lane cannot derive L'n,w or the standardized volume path.",
            kind: "conditional",
            meaning: "K becomes relevant whenever you move from lab-side Ln,w toward field-side estimates."
          }
        : {
            currentUse: "No field-side branch is active yet, so K is not used.",
            kind: "ignored",
            meaning: "K is optional until you request field-side guide outputs."
          },
    massRatio: manualK
      ? {
          currentUse: "An explicit K value is present, so the mass-ratio lookup lane is bypassed.",
          kind: "ignored",
          meaning: "a/(b+c+d+e) is only consulted when K is left blank and you intentionally want the Turkish Table 2.7 lookup."
        }
      : lookupKActive
        ? {
            currentUse: `The local-guide lane is currently using a/(b+c+d+e) = ${input.massRatioInput.trim()} to look up K from Table 2.7.`,
            kind: "active",
            meaning: "This ratio compares the separating floor mass against adjacent flanking masses for the Turkish simple-guide correction."
          }
        : manualMassRatio
          ? {
              currentUse: "The ratio is stored, but it will only activate when the guide lane needs K and no explicit K override is present.",
              kind: "conditional",
              meaning: "Use this when you want Table 2.7 to supply K instead of entering K manually."
            }
          : {
              currentUse: "No mass-ratio lookup is active.",
              kind: "conditional",
              meaning: "a/(b+c+d+e) becomes relevant only for the Turkish K lookup branch."
            },
    smallRoom: input.smallRoomEstimateEnabled && !standardizedFieldActive
      ? {
          currentUse: "The explicit TR small-room assumption is currently active and is deriving L'nT,w as Ln,w + 3.",
          kind: "active",
          meaning: "This toggle enables the simplified Turkish small-room guide path when no standardized volume path is present."
        }
      : input.smallRoomEstimateEnabled && standardizedFieldActive
        ? {
            currentUse: "The toggle is on, but the standardized field-volume branch has priority, so the shortcut assumption is parked.",
            kind: "conditional",
            meaning: "Small-room mode is a fallback only. A valid K + V path overrides it."
          }
        : hasBaseLnW || hasBaseLnWUpperBound
          ? {
              currentUse: "Disabled. The guide lane will only produce L'nT,w if you enable this shortcut or enter K plus room volume.",
              kind: "conditional",
              meaning: "Turn this on only when you intentionally want the simplified TR assumption."
            }
          : {
              currentUse: "No base Ln,w is active, so the small-room shortcut is not relevant yet.",
              kind: "ignored",
              meaning: "Small-room mode depends on an existing guide base Ln,w."
            },
    volume: standardizedFieldActive
      ? {
          currentUse: `Receiving-room volume is currently active in the standardized field branch at ${input.receivingRoomVolumeM3.trim()} m3 across ${formatFieldLaneLabel(input.selectedSource)}.`,
          kind: "active",
          meaning: "Room volume standardizes L'nT,w from L'n,w through 10 log10(31.3 / V)."
        }
      : !manualHd && lookupHdActive
        ? {
            currentUse: `Receiving-room volume is currently feeding the Turkish Table 2.8 Hd lookup at ${input.receivingRoomVolumeM3.trim()} m3.`,
            kind: "anchored",
            meaning: "The same V input can either standardize L'nT,w or, when Hd is blank, supply the Turkish simple-guide room correction."
          }
      : manualVolume
        ? {
            currentUse: "Volume is stored, but it does not activate until the guide lane either forms L'n,w for standardized normalization or needs Hd lookup for the Turkish shortcut.",
            kind: "conditional",
            meaning: "Room volume standardizes L'nT,w from L'n,w through 10 log10(31.3 / V), and it can also supply Hd from the Turkish Table 2.8 lookup."
          }
        : hasBaseLnW || hasBaseLnWUpperBound
          ? {
              currentUse: "No receiving-room volume path is active. Enter V to unlock standardized normalization or the Turkish Hd lookup branch.",
              kind: "conditional",
              meaning: "Room volume standardizes L'nT,w from L'n,w through 10 log10(31.3 / V), and it can also supply Hd from the Turkish Table 2.8 lookup."
            }
          : {
              currentUse: "Without a guide base and K correction, receiving-room volume is ignored.",
              kind: "ignored",
              meaning: "Room volume supports both the standardized field branch and the Turkish Hd lookup once a guide base is active."
            }
  };
}

export function buildImpactReferenceFieldGuide(input: {
  deltaLwInput: string;
  referenceImpact: ImpactCalculation | null;
}): WorkbenchFieldStatus {
  const hasInput = hasValue(input.deltaLwInput);
  const activeManualLane = input.referenceImpact?.basis === "predictor_explicit_delta_heavy_reference_derived";
  const shadowedByExactCurve = input.referenceImpact?.basis === "exact_source_improvement_curve_iso7172";

  if (activeManualLane && hasInput) {
    return {
      currentUse: "The manual DeltaLw entry is currently deriving a heavy-reference Ln,w screening result.",
      kind: "active",
      meaning: "Use this when a datasheet gives only a single DeltaLw value and no exact improvement curve."
    };
  }

  if (shadowedByExactCurve && hasInput) {
    return {
      currentUse: "A full exact improvement curve is active, so this single-value shortcut is currently bypassed.",
      kind: "ignored",
      meaning: "Manual DeltaLw is a fallback lane only. Exact heavy-reference curves take precedence."
    };
  }

  if (hasInput) {
    return {
      currentUse: "The value is present, but it has not produced an active heavy-reference result yet.",
      kind: "conditional",
      meaning: "The shortcut only activates with a valid non-negative DeltaLw value."
    };
  }

  return {
    currentUse: "No single-value product shortcut is active.",
    kind: "conditional",
    meaning: "Enter a datasheet DeltaLw value if you only need a quick heavy-reference screening lane."
  };
}

export function buildImpactBandFieldGuides(input: {
  input: string;
  labOrField: ExactImpactSourceLabOrField;
  parseError: string | null;
  parsedImport: ParsedImpactBandImport | null;
}): Record<"bandPaste" | "sourcePosture", WorkbenchFieldStatus> {
  return {
    bandPaste: input.parsedImport
      ? {
          currentUse: `The imported ${input.parsedImport.detectedBandSetLabel.toLowerCase()} curve is currently overriding predictor-based impact outputs.`,
          kind: "active",
          meaning: "Paste measured or published impact bands here when you want ISO 717-2 impact ratings from exact data."
        }
      : hasValue(input.input) && input.parseError
        ? {
            currentUse: "The pasted curve is not on a supported nominal grid, so it is not used.",
            kind: "ignored",
            meaning: "Only supported octave or one-third-octave nominal sets can become an exact source."
          }
        : {
            currentUse: "No exact band curve is active. Predictor or curated family lanes stay in control.",
            kind: "conditional",
            meaning: "This field is optional and only needed when you already have measured or published bands."
          },
    sourcePosture: input.parsedImport
      ? {
          currentUse: input.labOrField === "field"
            ? "The imported curve is currently treated as field evidence, so it yields L'nT,w."
            : "The imported curve is currently treated as lab evidence, so it yields Ln,w.",
          kind: "active",
          meaning: "Source posture tells DynEcho whether the imported curve represents lab test data or field data."
        }
      : hasValue(input.input)
        ? {
            currentUse: "Source posture is selected, but it only becomes active after the band paste resolves on a supported grid.",
            kind: "conditional",
            meaning: "Choose field when the bands are already field-side. Choose lab for ISO 10140-style lab data."
          }
        : {
            currentUse: "No exact band import is present, so source posture is not used.",
            kind: "ignored",
            meaning: "This selector only matters when an exact impact curve is pasted."
          }
  };
}

export function buildImpactImprovementFieldGuide(input: {
  input: string;
  parseError: string | null;
  parsedImport: ParsedImpactImprovementImport | null;
  referenceImpact: ImpactCalculation | null;
}): WorkbenchFieldStatus {
  const exactImprovementActive = input.referenceImpact?.basis === "exact_source_improvement_curve_iso7172";

  if (exactImprovementActive && input.parsedImport) {
    return {
      currentUse: "The exact DeltaLw curve is currently rating the treated heavy-reference floor and deriving DeltaLw precisely.",
      kind: "active",
      meaning: "Paste a full 16-band heavy-reference improvement curve here when you have product test data beyond a single DeltaLw figure."
    };
  }

  if (hasValue(input.input) && input.parseError) {
    return {
      currentUse: "The pasted improvement curve is not on the supported 100..3150 Hz heavy-reference grid, so it is ignored.",
      kind: "ignored",
      meaning: "This lane only accepts exact heavy-reference DeltaLw curves on the nominal 16-band grid."
    };
  }

  if (hasValue(input.input)) {
    return {
      currentUse: "The curve is present but has not produced an active exact heavy-reference reference yet.",
      kind: "conditional",
      meaning: "A valid 16-band heavy-reference curve will override the single-value DeltaLw shortcut."
    };
  }

  return {
    currentUse: "No exact heavy-reference improvement curve is active.",
    kind: "conditional",
    meaning: "Use this only when you have a measured DeltaLw curve and want exact heavy-reference rating."
  };
}
