import type {
  AirborneCalculator,
  AirborneCalculatorId,
  AssemblyRatings,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import {
  buildCalibratedMassLawCurve,
  buildRatingsFromCurve,
  computeRwFromCurve,
  massLawTransmissionLoss,
  sortUniqueFrequencies
} from "./curve-rating";
import {
  calculateLayerTotals,
  classifyLayerRole,
  detectLeafCoreLayout,
  materialText,
  type LayerTotals
} from "./airborne-topology";
import { clamp, ksRound1, log10, log10Safe } from "./math";

const SOUND_SPEED = 343;
const AIR_DENSITY = 1.21;
const TL_PLOT_FREQS = [63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000];

type KsType = 0 | 3 | 4 | 5 | 6 | 15;

export type PanelProperties = {
  damping: number;
  mass: number;
  nu: number;
  totalThicknessMm: number;
  valid: boolean;
  youngModulusPa: number;
};

export type AirborneCalculatorCurveResult = {
  baseRw: number;
  curve: TransmissionLossCurve;
  extrapolated: boolean;
  id: AirborneCalculatorId;
  label: string;
  ratings: AssemblyRatings;
  rw: number;
  shift: number;
};

type MechanicalProps = {
  damping: number;
  youngModulusPa: number;
  nu: number;
};

const MATERIAL_MECHANICAL_OVERRIDES: Record<string, MechanicalProps> = {
  cement_plaster: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  dense_plaster: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  celcon_high_strength: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.5e9
  },
  celcon_dense_plaster: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  celcon_lwt_plaster: {
    damping: 0.03,
    nu: 0.22,
    youngModulusPa: 3e9
  },
  celcon_solar_grade: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.5e9
  },
  celcon_standard_grade: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.5e9
  },
  concrete: {
    damping: 0.01,
    nu: 0.2,
    youngModulusPa: 25e9
  },
  gypsum_board: {
    damping: 0.02,
    nu: 0.25,
    youngModulusPa: 2.5e9
  },
  heluz_14_brushed: {
    damping: 0.025,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  heluz_aku_115: {
    damping: 0.025,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  heluz_aku_200_p15: {
    damping: 0.025,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  heluz_aku_300_333_p20: {
    damping: 0.025,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  heavy_concrete: {
    damping: 0.01,
    nu: 0.2,
    youngModulusPa: 35e9
  },
  lightweight_concrete: {
    damping: 0.015,
    nu: 0.2,
    youngModulusPa: 12e9
  },
  lime_cement_plaster_1300: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 7e9
  },
  lime_cement_plaster_1700: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  lime_cement_plaster_1780: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  pumice_block: {
    damping: 0.025,
    nu: 0.2,
    youngModulusPa: 5e9
  },
  porotherm_pls_100: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  porotherm_pls_140: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  porotherm_pls_190: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  silka_cs_block: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 12e9
  },
  skim_plaster: {
    damping: 0.02,
    nu: 0.2,
    youngModulusPa: 8e9
  },
  lightweight_plaster: {
    damping: 0.03,
    nu: 0.22,
    youngModulusPa: 3e9
  },
  ytong_aac_d700: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.5e9
  },
  ytong_separatiepaneel_aac_4_600: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.1e9
  },
  ytong_separatiepaneel_aac_5_750: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.5e9
  },
  ytong_cellenbetonblok_g4_600: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.1e9
  },
  ytong_cellenbetonblok_g5_800: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.5e9
  },
  ytong_massief_g2_300: {
    damping: 0.035,
    nu: 0.2,
    youngModulusPa: 2.2e9
  },
  ytong_g5_800: {
    damping: 0.03,
    nu: 0.2,
    youngModulusPa: 3.5e9
  }
};

export type ComparableAirborneCalculatorId = Exclude<AirborneCalculatorId, "dynamic">;

export const AIRBORNE_CALCULATORS: readonly AirborneCalculator[] = [
  { id: "dynamic", label: "Dynamic Topology" },
  { id: "ks_rw_calibrated", label: "KS Rw Calibrated" },
  { id: "mass_law", label: "Mass Law" },
  { id: "sharp", label: "Sharp (Simple)" },
  { id: "kurtovic", label: "Kurtovic (Simple)" }
] as const;

export function getAirborneCalculatorLabel(calculatorId: AirborneCalculatorId): string {
  return AIRBORNE_CALCULATORS.find((entry) => entry.id === calculatorId)?.label ?? calculatorId;
}

function buildCalculatorCurveResult(
  calculatorId: ComparableAirborneCalculatorId,
  rw: number,
  baseRw: number,
  shift: number,
  extrapolated: boolean,
  frequenciesHz: readonly number[],
  transmissionLossDb: readonly number[]
): AirborneCalculatorCurveResult {
  const curve: TransmissionLossCurve = {
    frequenciesHz: [...frequenciesHz],
    transmissionLossDb: [...transmissionLossDb]
  };

  return {
    baseRw,
    curve,
    extrapolated,
    id: calculatorId,
    label: getAirborneCalculatorLabel(calculatorId),
    ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb),
    rw,
    shift
  };
}

function inferLayerMechanicalProps(layer: ResolvedLayer): MechanicalProps {
  const override = MATERIAL_MECHANICAL_OVERRIDES[layer.material.id];
  if (override) {
    return override;
  }

  const text = materialText(layer);
  let youngModulusPa = 10e9;
  let damping = 0.02;
  let nu = 0.22;

  if (/steel|metal/.test(text)) {
    youngModulusPa = 200e9;
    damping = 0.008;
    nu = 0.3;
  } else if (/aluminum/.test(text)) {
    youngModulusPa = 70e9;
    damping = 0.006;
    nu = 0.33;
  } else if (/copper/.test(text)) {
    youngModulusPa = 110e9;
    damping = 0.002;
    nu = 0.34;
  } else if (/lead/.test(text)) {
    youngModulusPa = 16e9;
    damping = 0.01;
    nu = 0.44;
  } else if (/glass/.test(text)) {
    youngModulusPa = 70e9;
    damping = 0.004;
    nu = 0.23;
  } else if (/gypsum|plasterboard|board|lining/.test(text)) {
    youngModulusPa = 2.5e9;
    damping = 0.03;
    nu = 0.25;
  } else if (/osb/.test(text)) {
    youngModulusPa = 4e9;
    damping = 0.025;
    nu = 0.3;
  } else if (/mdf/.test(text)) {
    youngModulusPa = 4e9;
    damping = 0.03;
    nu = 0.3;
  } else if (/wood|timber|clt/.test(text)) {
    youngModulusPa = 9e9;
    damping = 0.02;
    nu = 0.3;
  } else if (/aac|gazbeton|autoclaved aerated/.test(text)) {
    youngModulusPa = 3e9;
    damping = 0.03;
    nu = 0.2;
  } else if (/pumice|bims/.test(text)) {
    youngModulusPa = 5e9;
    damping = 0.025;
    nu = 0.2;
  } else if (/brick/.test(text)) {
    youngModulusPa = 15e9;
    damping = 0.02;
    nu = 0.2;
  } else if (/lightweight concrete|hafif beton/.test(text)) {
    youngModulusPa = 12e9;
    damping = 0.02;
    nu = 0.2;
  } else if (/concrete/.test(text)) {
    youngModulusPa = 30e9;
    damping = 0.02;
    nu = 0.2;
  } else if (/rockwool|glasswool|wool|cavity-fill|fill/.test(text)) {
    youngModulusPa = 0.2e9;
    damping = 0.08;
    nu = 0.25;
  } else if (/rubber/.test(text)) {
    youngModulusPa = 0.1e9;
    damping = 0.15;
    nu = 0.49;
  } else if (/bitumen|membrane/.test(text)) {
    youngModulusPa = 0.3e9;
    damping = 0.1;
    nu = 0.45;
  }

  return {
    damping,
    nu,
    youngModulusPa
  };
}

export function buildPanelProperties(layers: readonly ResolvedLayer[], totals: LayerTotals): PanelProperties {
  let weightedYoungModulusPa = 0;
  let weightedDamping = 0;
  let weightedNu = 0;
  let massAccumulator = 0;

  for (const layer of layers) {
    if (!(layer.thicknessMm > 0) || !(layer.surfaceMassKgM2 > 0)) {
      continue;
    }

    const mechanicalProps = inferLayerMechanicalProps(layer);
    weightedYoungModulusPa += layer.surfaceMassKgM2 * mechanicalProps.youngModulusPa;
    weightedDamping += layer.surfaceMassKgM2 * mechanicalProps.damping;
    weightedNu += layer.surfaceMassKgM2 * mechanicalProps.nu;
    massAccumulator += layer.surfaceMassKgM2;
  }

  const mass = totals.surfaceMassKgM2;

  return {
    damping: massAccumulator > 0 ? weightedDamping / massAccumulator : 0.02,
    mass,
    nu: massAccumulator > 0 ? clamp(weightedNu / massAccumulator, 0.05, 0.45) : 0.22,
    totalThicknessMm: totals.totalSolidThicknessMm,
    valid: mass > 0 && totals.totalSolidThicknessMm > 0,
    youngModulusPa: massAccumulator > 0 ? weightedYoungModulusPa / massAccumulator : 10e9
  };
}

function inferKsType(layers: readonly ResolvedLayer[], totals: LayerTotals): KsType {
  const solids = layers.filter((layer) => !classifyLayerRole(layer).isGap);
  const text = solids.map(materialText).join(" ");
  const meanDensityKgM3 =
    totals.totalSolidThicknessMm > 0 ? totals.surfaceMassKgM2 / (totals.totalSolidThicknessMm / 1000) : 0;

  if (/aac|gazbeton|poren/.test(text)) {
    return 3;
  }

  if (/lightweight concrete|hafif beton|leichtbeton/.test(text)) {
    return 4;
  }

  if (meanDensityKgM3 > 2600) {
    return 6;
  }

  return 0;
}

function ksRwFromMass(type: KsType, surfaceMassKgM2: number): { extrapolated: boolean; rw: number } {
  let calculatorType: KsType = type;
  const mass = surfaceMassKgM2;
  let rw = 0;
  let extrapolated = false;

  if (!(mass > 0)) {
    return { extrapolated: false, rw: 0 };
  }

  if (calculatorType < 3) {
    if (mass > 65 && mass < 720) {
      rw = (30.9 * log10(mass)) - 22.2;
    } else {
      calculatorType = 15;
    }
  }

  if (calculatorType === 3) {
    if (mass > 140 && mass < 480) {
      rw = (30.9 * log10(mass)) - 20.2;
    } else {
      calculatorType = 15;
    }
  }

  if (calculatorType === 4) {
    if (mass >= 50 && mass < 150) {
      rw = (32.6 * log10(mass)) - 22.5;
    } else if (mass >= 150 && mass <= 300) {
      rw = (26.1 * log10(mass)) - 8.4;
    } else {
      calculatorType = 15;
    }
  }

  if (calculatorType === 5) {
    if (mass > 65 && mass < 720) {
      rw = (30.9 * log10(mass)) - 22.2;
    } else {
      calculatorType = 15;
    }
  }

  if (calculatorType === 6) {
    rw = mass >= 150 ? (37.5 * log10(mass)) - 42 : (17 * log10(mass)) + 3;
  }

  if (calculatorType === 15) {
    rw = mass >= 150 ? (37.5 * log10(mass)) - 42 : (17 * log10(mass)) + 3;
    extrapolated = true;
  }

  return {
    extrapolated,
    rw: ksRound1(rw)
  };
}

function bendingStiffness(panel: PanelProperties): number {
  const thicknessM = Math.max(panel.totalThicknessMm / 1000, 1e-4);
  const nu = clamp(panel.nu, 0.05, 0.45);
  const youngModulusPa = clamp(panel.youngModulusPa, 1e7, 250e9);
  return Math.max((youngModulusPa * Math.pow(thicknessM, 3)) / (12 * (1 - (nu * nu))), 1e-12);
}

export function estimateCriticalFrequency(panel: PanelProperties): number {
  const mass = Math.max(panel.mass, 1e-9);
  const bending = Math.max(bendingStiffness(panel), 1e-12);
  const criticalFrequencyHz = (SOUND_SPEED * SOUND_SPEED / (2 * Math.PI)) * Math.sqrt(mass / bending);
  return Number.isFinite(criticalFrequencyHz) && criticalFrequencyHz > 0 ? Math.max(criticalFrequencyHz, 40) : 40;
}

export function finitePanelRadiationEfficiency(frequencyHz: number, panelWidthM = 2.7, panelHeightM = 4): number {
  const frequency = Math.max(frequencyHz, 1e-9);
  const widthM = Math.max(panelWidthM, 0.2);
  const heightM = Math.max(panelHeightM, 0.2);
  const firstModeFrequencyHz = 0.5 * SOUND_SPEED * Math.sqrt((1 / (widthM * widthM)) + (1 / (heightM * heightM)));

  if (!(firstModeFrequencyHz > 0)) {
    return 1;
  }

  if (frequency <= firstModeFrequencyHz) {
    return clamp(0.08 + (0.92 * Math.pow(frequency / firstModeFrequencyHz, 2)), 0.05, 1);
  }

  return clamp(Math.sqrt(frequency / firstModeFrequencyHz), 0.2, 1);
}

function stiffnessControlledTransmissionLoss(frequencyHz: number, panel: PanelProperties): number {
  const frequency = Math.max(frequencyHz, 1e-9);
  return (20 * log10Safe(frequency)) + (10 * log10Safe(bendingStiffness(panel) * Math.max(panel.mass, 1e-9))) - 47;
}

function linearInterpolate(x: number, x1: number, y1: number, x2: number, y2: number): number {
  if (!Number.isFinite(x1) || !Number.isFinite(x2) || Math.abs(x2 - x1) < 1e-9) {
    return y1;
  }

  const t = clamp((x - x1) / (x2 - x1), 0, 1);
  return y1 + (t * (y2 - y1));
}

function singlePanelTransmissionLossSharp(
  frequenciesHz: readonly number[],
  panel: PanelProperties
): number[] {
  if (!panel.valid) {
    return frequenciesHz.map(() => 0);
  }

  const characteristicImpedance = AIR_DENSITY * SOUND_SPEED;
  const mass = Math.max(panel.mass, 1e-9);
  const criticalFrequencyHz = Math.max(estimateCriticalFrequency(panel), 40);
  const eta = clamp(panel.damping + (0.04 * 0.35), 0.002, 0.35);
  const transitionFrequencyHz = criticalFrequencyHz / 2;
  const transitionLossDb = stiffnessControlledTransmissionLoss(transitionFrequencyHz, panel);
  const coincidenceLossDb =
    (20 * log10Safe((Math.PI * criticalFrequencyHz * mass) / characteristicImpedance)) +
    (10 * log10Safe((2 * eta * criticalFrequencyHz) / (Math.PI * criticalFrequencyHz)));

  return frequenciesHz.map((frequencyHz) => {
    let transmissionLossDb = 0;

    if (frequencyHz <= transitionFrequencyHz) {
      transmissionLossDb = stiffnessControlledTransmissionLoss(frequencyHz, panel);
    } else if (frequencyHz < criticalFrequencyHz) {
      transmissionLossDb = linearInterpolate(
        frequencyHz,
        transitionFrequencyHz,
        transitionLossDb,
        criticalFrequencyHz,
        coincidenceLossDb
      );
    } else {
      transmissionLossDb =
        (20 * log10Safe((Math.PI * frequencyHz * mass) / characteristicImpedance)) +
        (10 * log10Safe((2 * eta * frequencyHz) / (Math.PI * criticalFrequencyHz)));
    }

    const radiationEfficiency = finitePanelRadiationEfficiency(frequencyHz);
    return clamp(transmissionLossDb - (10 * log10Safe(Math.max(radiationEfficiency, 1e-3))), 0, 95);
  });
}

function singlePanelTransmissionLossKurtovic(
  frequenciesHz: readonly number[],
  panel: PanelProperties
): number[] {
  if (!panel.valid) {
    return frequenciesHz.map(() => 0);
  }

  const characteristicImpedance = AIR_DENSITY * SOUND_SPEED;
  const mass = Math.max(panel.mass, 1e-9);
  const criticalFrequencyHz = Math.max(estimateCriticalFrequency(panel), 40);
  const eta = clamp(panel.damping + (0.04 * 0.35), 0.002, 0.35);
  const transitionLossDb = (15 * log10Safe(mass * criticalFrequencyHz)) + (10 * log10Safe(eta)) - 42.5;
  const lowTransitionLossDb = transitionLossDb - (3 * log10Safe(eta));

  return frequenciesHz.map((frequencyHz) => {
    let transmissionLossDb = 0;

    if (frequencyHz <= criticalFrequencyHz / 2) {
      transmissionLossDb = (15 * log10Safe((Math.PI * frequencyHz * mass) / characteristicImpedance)) - 5.5;
    } else if (frequencyHz < criticalFrequencyHz) {
      transmissionLossDb = linearInterpolate(
        frequencyHz,
        criticalFrequencyHz / 2,
        lowTransitionLossDb,
        criticalFrequencyHz,
        transitionLossDb
      );
    } else {
      transmissionLossDb =
        (15 * log10Safe((Math.PI * frequencyHz * mass) / characteristicImpedance)) +
        (10 * log10Safe((eta * frequencyHz * frequencyHz) / (Math.PI * criticalFrequencyHz)));
    }

    const radiationEfficiency = finitePanelRadiationEfficiency(frequencyHz);
    return clamp(transmissionLossDb - (10 * log10Safe(Math.max(radiationEfficiency, 1e-3))), 0, 95);
  });
}

function estimateDoubleWallResonanceFrequency(layers: readonly ResolvedLayer[]): number | null {
  const layout = detectLeafCoreLayout(layers);

  if (layout.solidLeafCount !== 2 || !layout.hasCompliantCore || !(layout.compliantCoreThicknessMm > 0)) {
    return null;
  }

  const firstLeaf = layout.collapsedLayers[layout.solidLeafIndexes[0]];
  const secondLeaf = layout.collapsedLayers[layout.solidLeafIndexes[1]];
  const m1 = Math.max(firstLeaf?.surfaceMassKgM2 ?? 0, 1e-9);
  const m2 = Math.max(secondLeaf?.surfaceMassKgM2 ?? 0, 1e-9);
  const gapThicknessM = layout.compliantCoreThicknessMm / 1000;
  const resonanceFrequencyHz =
    (1 / (2 * Math.PI)) *
    Math.sqrt(((AIR_DENSITY * SOUND_SPEED * SOUND_SPEED) / gapThicknessM) * ((1 / m1) + (1 / m2)));

  return Number.isFinite(resonanceFrequencyHz) && resonanceFrequencyHz > 0 ? resonanceFrequencyHz : null;
}

function applyDoubleLeafGapBonus(
  frequenciesHz: readonly number[],
  transmissionLossDb: readonly number[],
  layers: readonly ResolvedLayer[]
): number[] {
  if (frequenciesHz.length !== transmissionLossDb.length || frequenciesHz.length === 0) {
    return [...transmissionLossDb];
  }

  const layout = detectLeafCoreLayout(layers);
  if (layout.solidLeafCount !== 2 || !layout.hasCompliantCore || !(layout.compliantCoreThicknessMm > 0)) {
    return [...transmissionLossDb];
  }

  const totals = calculateLayerTotals(layers);
  if (!(totals.surfaceMassKgM2 >= 8 && totals.surfaceMassKgM2 <= 120)) {
    return [...transmissionLossDb];
  }

  const resonanceFrequencyHz = estimateDoubleWallResonanceFrequency(layers);
  const gapThicknessM = layout.compliantCoreThicknessMm / 1000;
  if (!(resonanceFrequencyHz && gapThicknessM > 0)) {
    return [...transmissionLossDb];
  }

  const upperTransitionFrequencyHz = Math.max(55 / gapThicknessM, resonanceFrequencyHz + 1);

  return frequenciesHz.map((frequencyHz, index) => {
    let bonusDb = 0;

    if (frequencyHz > resonanceFrequencyHz) {
      if (frequencyHz >= upperTransitionFrequencyHz) {
        bonusDb = 6;
      } else {
        bonusDb = clamp((20 * log10Safe(frequencyHz * gapThicknessM)) - 29, 0, 6);
      }
    }

    return clamp(transmissionLossDb[index] + bonusDb, 0, 95);
  });
}

export function calculateAirborneCalculatorResult(
  calculatorId: ComparableAirborneCalculatorId,
  layers: readonly ResolvedLayer[],
  frequenciesHz: readonly number[] = TL_PLOT_FREQS
): AirborneCalculatorCurveResult {
  const sortedFrequenciesHz = sortUniqueFrequencies(frequenciesHz);
  const totals = calculateLayerTotals(layers);
  const panel = buildPanelProperties(layers, totals);

  if (calculatorId === "ks_rw_calibrated") {
    const ks = ksRwFromMass(inferKsType(layers, totals), totals.surfaceMassKgM2);
    const curve = buildCalibratedMassLawCurve(totals.surfaceMassKgM2, ks.rw, sortedFrequenciesHz);

    return buildCalculatorCurveResult(
      calculatorId,
      ks.rw,
      curve.baseRw,
      curve.shift,
      ks.extrapolated,
      curve.frequenciesHz,
      curve.transmissionLossDb
    );
  }

  if (calculatorId === "mass_law") {
    const rawTransmissionLossDb = sortedFrequenciesHz.map((frequencyHz) =>
      clamp(massLawTransmissionLoss(frequencyHz, totals.surfaceMassKgM2), 0, 95)
    );
    const adjustedTransmissionLossDb = applyDoubleLeafGapBonus(sortedFrequenciesHz, rawTransmissionLossDb, layers);
    const rw = computeRwFromCurve(sortedFrequenciesHz, adjustedTransmissionLossDb);

    return buildCalculatorCurveResult(
      calculatorId,
      rw,
      rw,
      0,
      false,
      sortedFrequenciesHz,
      adjustedTransmissionLossDb
    );
  }

  if (calculatorId === "sharp") {
    const rawTransmissionLossDb = singlePanelTransmissionLossSharp(sortedFrequenciesHz, panel);
    const adjustedTransmissionLossDb = applyDoubleLeafGapBonus(sortedFrequenciesHz, rawTransmissionLossDb, layers);
    const rw = computeRwFromCurve(sortedFrequenciesHz, adjustedTransmissionLossDb);

    return buildCalculatorCurveResult(
      calculatorId,
      rw,
      rw,
      0,
      false,
      sortedFrequenciesHz,
      adjustedTransmissionLossDb
    );
  }

  const rawTransmissionLossDb = singlePanelTransmissionLossKurtovic(sortedFrequenciesHz, panel);
  const adjustedTransmissionLossDb = applyDoubleLeafGapBonus(sortedFrequenciesHz, rawTransmissionLossDb, layers);
  const rw = computeRwFromCurve(sortedFrequenciesHz, adjustedTransmissionLossDb);

  return buildCalculatorCurveResult(
    calculatorId,
    rw,
    rw,
    0,
    false,
    sortedFrequenciesHz,
    adjustedTransmissionLossDb
  );
}
