import type { ImpactConfidence } from "@dynecho/shared";

import { deriveImpactGuideConfidence, type ImpactGuideConfidence } from "./impact-confidence";
import { ksRound1 } from "./math";

export type ImpactGuideSource = "heavy_reference" | "live_stack";
export type ImpactGuideBaseKind = "exact" | "upper_bound";
export type ImpactGuideCorrectionSource = "explicit_input" | "lookup_from_mass_ratio" | "lookup_from_receiving_room_volume";

export type TurkishGuideKCorrectionLookup = {
  bracketLabel: string;
  massRatio: number;
  value: number;
};

export type TurkishGuideHdCorrectionLookup = {
  bracketLabel: string;
  receivingRoomVolumeM3: number;
  value: number;
};

export type ImpactGuideDerivation = {
  baseKind: ImpactGuideBaseKind;
  baseLnW?: number;
  baseLnWUpperBound?: number;
  CI?: number;
  CI50_2500?: number;
  confidence: ImpactGuideConfidence;
  Hd?: number;
  HdSource?: Extract<ImpactGuideCorrectionSource, "explicit_input" | "lookup_from_receiving_room_volume">;
  K?: number;
  KSource?: Extract<ImpactGuideCorrectionSource, "explicit_input" | "lookup_from_mass_ratio">;
  LPrimeNW?: number;
  LPrimeNWUpperBound?: number;
  LPrimeNTw?: number;
  LPrimeNTwUpperBound?: number;
  LPrimeNT50?: number;
  LnWPlusCI?: number;
  guideProfile?: "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd";
  massRatio?: number;
  massRatioBracket?: string;
  notes: string[];
  receivingRoomVolumeBracket?: string;
  receivingRoomVolumeM3?: number;
  smallRoomEstimateActive: boolean;
  source: ImpactGuideSource;
  standardizedFieldEstimateActive: boolean;
};

export function lookupTurkishGuideImpactKCorrection(
  rawMassRatio?: number | null
): TurkishGuideKCorrectionLookup {
  const massRatio = Number(rawMassRatio);

  if (!Number.isFinite(massRatio) || massRatio <= 0) {
    return { value: Number.NaN, bracketLabel: "", massRatio: Number.NaN };
  }

  if (massRatio <= 1) {
    return { value: 0, bracketLabel: "r <= 1", massRatio: ksRound1(massRatio) };
  }

  if (massRatio <= 2) {
    return { value: 2, bracketLabel: "1 < r <= 2", massRatio: ksRound1(massRatio) };
  }

  if (massRatio <= 3) {
    return { value: 3, bracketLabel: "2 < r <= 3", massRatio: ksRound1(massRatio) };
  }

  if (massRatio <= 5) {
    return { value: 4, bracketLabel: "3 < r <= 5", massRatio: ksRound1(massRatio) };
  }

  if (massRatio <= 7) {
    return { value: 5, bracketLabel: "5 < r <= 7", massRatio: ksRound1(massRatio) };
  }

  return { value: 6, bracketLabel: "r > 7", massRatio: ksRound1(massRatio) };
}

export function lookupTurkishGuideImpactHdCorrection(
  rawReceivingRoomVolumeM3?: number | null
): TurkishGuideHdCorrectionLookup {
  const receivingRoomVolumeM3 = Number(rawReceivingRoomVolumeM3);

  if (!Number.isFinite(receivingRoomVolumeM3) || receivingRoomVolumeM3 <= 0) {
    return { value: Number.NaN, bracketLabel: "", receivingRoomVolumeM3: Number.NaN };
  }

  if (receivingRoomVolumeM3 < 10) {
    return { value: 7, bracketLabel: "V < 10", receivingRoomVolumeM3: ksRound1(receivingRoomVolumeM3) };
  }

  if (receivingRoomVolumeM3 < 15) {
    return { value: 5, bracketLabel: "10 <= V < 15", receivingRoomVolumeM3: ksRound1(receivingRoomVolumeM3) };
  }

  if (receivingRoomVolumeM3 < 30) {
    return { value: 3, bracketLabel: "15 <= V < 30", receivingRoomVolumeM3: ksRound1(receivingRoomVolumeM3) };
  }

  if (receivingRoomVolumeM3 < 50) {
    return { value: 0, bracketLabel: "30 <= V < 50", receivingRoomVolumeM3: ksRound1(receivingRoomVolumeM3) };
  }

  if (receivingRoomVolumeM3 < 100) {
    return { value: -2, bracketLabel: "50 <= V < 100", receivingRoomVolumeM3: ksRound1(receivingRoomVolumeM3) };
  }

  if (receivingRoomVolumeM3 < 200) {
    return { value: -5, bracketLabel: "100 <= V < 200", receivingRoomVolumeM3: ksRound1(receivingRoomVolumeM3) };
  }

  return { value: -8, bracketLabel: "V >= 200", receivingRoomVolumeM3: ksRound1(receivingRoomVolumeM3) };
}

export function deriveImpactGuideMetrics(input: {
  baseLnW?: number | null;
  baseLnWUpperBound?: number | null;
  baseConfidence?: ImpactConfidence | null;
  ciDb?: number | null;
  ci50_2500Db?: number | null;
  enableSmallRoomEstimate?: boolean;
  hdDb?: number | null;
  kDb?: number | null;
  massRatio?: number | null;
  receivingRoomVolumeM3?: number | null;
  source: ImpactGuideSource;
}): ImpactGuideDerivation | null {
  const hasExactBase = Number.isFinite(input.baseLnW);
  const hasBoundBase = Number.isFinite(input.baseLnWUpperBound);

  if (!hasExactBase && !hasBoundBase) {
    return null;
  }

  const baseKind: ImpactGuideBaseKind = hasExactBase ? "exact" : "upper_bound";
  const baseLnW = hasExactBase ? ksRound1(input.baseLnW as number) : undefined;
  const baseLnWUpperBound = !hasExactBase && hasBoundBase ? ksRound1(input.baseLnWUpperBound as number) : undefined;
  const hasCi = Number.isFinite(input.ciDb);
  const ci = hasCi ? ksRound1(input.ciDb as number) : undefined;
  const hasCi50_2500 = Number.isFinite(input.ci50_2500Db);
  const ci50_2500 = hasCi50_2500 ? ksRound1(input.ci50_2500Db as number) : undefined;
  const lnWPlusCI = baseKind === "exact" && hasCi ? ksRound1((baseLnW as number) + (ci as number)) : undefined;
  const smallRoomEstimateActive = Boolean(input.enableSmallRoomEstimate);
  const explicitK = Number.isFinite(input.kDb) ? ksRound1(input.kDb as number) : undefined;
  const explicitHd = Number.isFinite(input.hdDb) ? ksRound1(input.hdDb as number) : undefined;
  const kLookup = lookupTurkishGuideImpactKCorrection(input.massRatio);
  const hdLookup = lookupTurkishGuideImpactHdCorrection(input.receivingRoomVolumeM3);
  const k = explicitK ?? (Number.isFinite(kLookup.value) ? kLookup.value : undefined);
  const hd = explicitHd ?? (Number.isFinite(hdLookup.value) ? hdLookup.value : undefined);
  const hasFieldKCorrection = typeof k === "number";
  const kSource =
    typeof explicitK === "number"
      ? "explicit_input"
      : Number.isFinite(kLookup.value)
        ? "lookup_from_mass_ratio"
        : undefined;
  const hdSource =
    typeof explicitHd === "number"
      ? "explicit_input"
      : Number.isFinite(hdLookup.value)
        ? "lookup_from_receiving_room_volume"
        : undefined;
  const hasGuideCorrections = typeof k === "number" && typeof hd === "number";
  const massRatio = Number.isFinite(kLookup.massRatio) ? kLookup.massRatio : undefined;
  const massRatioBracket = kSource === "lookup_from_mass_ratio" ? kLookup.bracketLabel || undefined : undefined;
  const hasReceivingRoomVolume =
    Number.isFinite(input.receivingRoomVolumeM3) && (input.receivingRoomVolumeM3 as number) > 0;
  const receivingRoomVolumeM3 = hasReceivingRoomVolume
    ? ksRound1(input.receivingRoomVolumeM3 as number)
    : undefined;
  const receivingRoomVolumeBracket =
    hdSource === "lookup_from_receiving_room_volume" ? hdLookup.bracketLabel || undefined : undefined;
  const lPrimeNW = baseKind === "exact" && hasFieldKCorrection ? ksRound1((baseLnW as number) + (k as number)) : undefined;
  const lPrimeNWUpperBound =
    baseKind === "upper_bound" && hasFieldKCorrection
      ? ksRound1((baseLnWUpperBound as number) + (k as number))
      : undefined;
  const standardizedFieldEstimateActive =
    (typeof lPrimeNW === "number" || typeof lPrimeNWUpperBound === "number") &&
    typeof receivingRoomVolumeM3 === "number";
  const standardizedLPrimeNTw =
    standardizedFieldEstimateActive && typeof lPrimeNW === "number"
      ? ksRound1(lPrimeNW + 10 * Math.log10(31.3 / (receivingRoomVolumeM3 as number)))
      : undefined;
  const standardizedLPrimeNTwUpperBound =
    standardizedFieldEstimateActive && typeof lPrimeNWUpperBound === "number"
      ? ksRound1(lPrimeNWUpperBound + 10 * Math.log10(31.3 / (receivingRoomVolumeM3 as number)))
      : undefined;
  const smallRoomLPrimeNTw = baseKind === "exact" && smallRoomEstimateActive ? ksRound1((baseLnW as number) + 3) : undefined;
  const smallRoomLPrimeNTwUpperBound =
    baseKind === "upper_bound" && smallRoomEstimateActive
      ? ksRound1((baseLnWUpperBound as number) + 3)
      : undefined;
  const lPrimeNTw = standardizedLPrimeNTw ?? smallRoomLPrimeNTw;
  const lPrimeNTwUpperBound = standardizedLPrimeNTwUpperBound ?? smallRoomLPrimeNTwUpperBound;
  const lPrimeNT50 =
    typeof standardizedLPrimeNTw === "number" && typeof ci50_2500 === "number"
      ? ksRound1(standardizedLPrimeNTw + ci50_2500)
      : hasGuideCorrections && typeof lnWPlusCI === "number"
        ? ksRound1(lnWPlusCI + (k as number) + (hd as number))
        : undefined;
  const guideProfile =
    typeof lPrimeNT50 === "number" &&
    typeof lnWPlusCI === "number" &&
    hasGuideCorrections &&
    !(typeof standardizedLPrimeNTw === "number" && typeof ci50_2500 === "number")
      ? "tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd"
      : undefined;

  return {
    baseKind,
    baseLnW,
    baseLnWUpperBound,
    CI: ci,
    CI50_2500: ci50_2500,
    confidence: deriveImpactGuideConfidence({
      baseConfidence: input.baseConfidence,
      source: input.source
    }),
    Hd: hd,
    HdSource: hdSource,
    K: k,
    KSource: kSource,
    LPrimeNW: lPrimeNW,
    LPrimeNWUpperBound: lPrimeNWUpperBound,
    LPrimeNTw: lPrimeNTw,
    LPrimeNTwUpperBound: lPrimeNTwUpperBound,
    LPrimeNT50: lPrimeNT50,
    LnWPlusCI: lnWPlusCI,
    guideProfile,
    massRatio,
    massRatioBracket,
    notes: [
      ...(typeof lnWPlusCI === "number"
        ? ["Ln,w+CI was derived as Ln,w + CI from the selected lab-side source."]
        : baseKind === "upper_bound"
          ? ["Ln,w+CI stays unavailable on the bound-only lane unless an exact Ln,w source is selected."]
          : ["Ln,w+CI stays unavailable until an explicit CI value is provided."]),
      ...(typeof lPrimeNW === "number"
        ? [`L'n,w was derived as Ln,w + K using K = ${k} dB.`]
        : typeof lPrimeNWUpperBound === "number"
          ? [`L'n,w upper bound was derived as Ln,w upper bound + K using K = ${k} dB.`]
          : ["L'n,w stays unavailable until K is provided explicitly or looked up from the verified Turkish guide mass-ratio table."]),
      ...(typeof standardizedLPrimeNTw === "number"
        ? [`L'nT,w was derived as L'n,w + 10 log10(31.3 / V) using V = ${receivingRoomVolumeM3} m³.`]
        : typeof standardizedLPrimeNTwUpperBound === "number"
          ? [`L'nT,w upper bound was derived as L'n,w upper bound + 10 log10(31.3 / V) using V = ${receivingRoomVolumeM3} m³.`]
          : smallRoomEstimateActive
            ? baseKind === "upper_bound"
              ? ["L'nT,w upper bound was derived as Ln,w upper bound + 3 using the explicit TR small-room guide assumption."]
              : ["L'nT,w was derived as Ln,w + 3 using the explicit TR small-room guide assumption."]
            : ["L'nT,w stays unavailable until either the TR small-room guide toggle is enabled or a receiving-room volume is provided with K."]),
      ...(typeof lPrimeNT50 === "number" && typeof standardizedLPrimeNTw === "number" && typeof ci50_2500 === "number"
        ? [`L'nT,50 was derived as L'nT,w + CI,50-2500 using CI,50-2500 = ${ci50_2500} dB.`]
        : hasGuideCorrections && typeof lnWPlusCI === "number"
          ? [`L'nT,50 was derived as Ln,w+CI + K + Hd using K = ${k} dB and Hd = ${hd} dB.`]
          : ["L'nT,50 stays unavailable until either Ln,w+CI has K and Hd (explicitly or via the verified Turkish guide tables) or the field-volume path has both V and CI,50-2500."]),
      ...(typeof ci50_2500 === "number"
        ? [`CI,50-2500 was carried as an explicit published or measured supplement: ${ci50_2500} dB.`]
        : ["CI,50-2500 stays unavailable until an explicit field-side companion value is provided."]),
      ...(kSource === "lookup_from_mass_ratio" && typeof massRatio === "number"
        ? [`K was looked up from Turkish guide Table 2.7 using a/(b+c+d+e) = ${massRatio}.`]
        : []),
      ...(hdSource === "lookup_from_receiving_room_volume" && typeof receivingRoomVolumeM3 === "number"
        ? [`Hd was looked up from Turkish guide Table 2.8 using receiving-room volume V = ${receivingRoomVolumeM3} m³.`]
        : []),
      input.source === "live_stack"
        ? baseKind === "upper_bound"
          ? "Guide derivation is anchored to the live stack's current conservative Ln,w upper bound."
          : "Guide derivation is anchored to the live stack's current Ln,w result."
        : "Guide derivation is anchored to the heavy-reference quick-derive Ln,w result."
    ],
    receivingRoomVolumeBracket,
    receivingRoomVolumeM3,
    smallRoomEstimateActive,
    source: input.source,
    standardizedFieldEstimateActive
  };
}
