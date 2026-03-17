import type {
  AssemblyRatings,
  DynamicAirborneConfidenceClass,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  DynamicAirborneTrace,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import {
  buildRatingsFromCurve,
  buildCalibratedMassLawCurve
} from "./curve-rating";
import {
  calculateAirborneCalculatorResult,
  getAirborneCalculatorLabel,
  type ComparableAirborneCalculatorId
} from "./airborne-calculator";
import { detectLeafCoreLayout, materialText, summarizeAirborneTopology } from "./airborne-topology";
import { clamp, ksRound1 } from "./math";

type DynamicAirborneResult = {
  curve: TransmissionLossCurve;
  id: "dynamic";
  label: string;
  ratings: AssemblyRatings;
  rw: number;
  trace: DynamicAirborneTrace;
  warnings: string[];
};

type DelegateCurve = {
  curve: TransmissionLossCurve;
  label: string;
  method: DynamicAirborneDelegateMethod;
  rw: number;
};

type DelegateBlend = {
  adjustmentsDb: number;
  delegates: Array<{ method: DynamicAirborneDelegateMethod; weight: number }>;
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
};

const FAMILY_LABELS: Record<DynamicAirborneFamily, string> = {
  double_leaf: "Double Leaf",
  laminated_single_leaf: "Laminated Single Leaf",
  lined_massive_wall: "Lined Massive Wall",
  multileaf_multicavity: "Multi-Leaf / Multi-Cavity",
  rigid_massive_wall: "Rigid Massive Wall",
  single_leaf_panel: "Single Leaf Panel",
  stud_wall_system: "Stud Wall Surrogate"
};

function getDelegateLabel(method: DynamicAirborneDelegateMethod): string {
  if (method === "screening_mass_law_curve_seed_v3") {
    return "Screening Seed";
  }

  return getAirborneCalculatorLabel(method as ComparableAirborneCalculatorId);
}

function buildScreeningDelegate(
  surfaceMassKgM2: number,
  screeningEstimatedRwDb: number,
  frequenciesHz: readonly number[]
): DelegateCurve {
  const curve = buildCalibratedMassLawCurve(surfaceMassKgM2, screeningEstimatedRwDb, frequenciesHz);

  return {
    curve: {
      frequenciesHz: [...curve.frequenciesHz],
      transmissionLossDb: [...curve.transmissionLossDb]
    },
    label: getDelegateLabel("screening_mass_law_curve_seed_v3"),
    method: "screening_mass_law_curve_seed_v3",
    rw: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb).iso717.Rw
  };
}

function blendDelegateCurves(
  delegates: readonly DelegateCurve[],
  blend: DelegateBlend
): TransmissionLossCurve {
  const weights = new Map(blend.delegates.map((entry) => [entry.method, entry.weight]));
  const reference = delegates[0];
  const totalWeight = Math.max(
    blend.delegates.reduce((sum, entry) => sum + entry.weight, 0),
    1e-9
  );
  const transmissionLossDb = reference.curve.frequenciesHz.map((_, index) => {
    let blendedValue = 0;

    for (const delegate of delegates) {
      const weight = weights.get(delegate.method) ?? 0;
      blendedValue += delegate.curve.transmissionLossDb[index] * weight;
    }

    return clamp((blendedValue / totalWeight) + blend.adjustmentsDb, 0, 95);
  });

  return {
    frequenciesHz: [...reference.curve.frequenciesHz],
    transmissionLossDb
  };
}

function describePrimaryCavity(layers: readonly ResolvedLayer[]): {
  coreThicknessMm: number;
  gapThicknessMm: number;
  porousThicknessMm: number;
} {
  const layout = detectLeafCoreLayout(layers);

  if (layout.solidLeafIndexes.length !== 2) {
    return {
      coreThicknessMm: 0,
      gapThicknessMm: 0,
      porousThicknessMm: 0
    };
  }

  const start = layout.solidLeafIndexes[0];
  const end = layout.solidLeafIndexes[1];
  let gapThicknessMm = 0;
  let porousThicknessMm = 0;

  for (let index = start + 1; index < end; index += 1) {
    const layer = layout.collapsedLayers[index];
    const text = materialText(layer);
    if (layer.material.category === "gap") {
      gapThicknessMm += layer.thicknessMm;
      continue;
    }

    if (layer.material.category === "insulation" || /rockwool|glasswool|wool|porous|fill/.test(text)) {
      porousThicknessMm += layer.thicknessMm;
    }
  }

  return {
    coreThicknessMm: ksRound1(gapThicknessMm + porousThicknessMm),
    gapThicknessMm: ksRound1(gapThicknessMm),
    porousThicknessMm: ksRound1(porousThicknessMm)
  };
}

function detectDynamicFamily(layers: readonly ResolvedLayer[]): {
  family: DynamicAirborneFamily;
  notes: string[];
} {
  const topology = summarizeAirborneTopology(layers);
  const text = layers.map(materialText).join(" ");
  const dominantLeafMassKgM2 = Math.max(...topology.visibleLeafMassesKgM2, 0);
  const lightestLeafMassKgM2 = Math.min(...topology.visibleLeafMassesKgM2.filter((value) => value > 0));
  const asymmetry = topology.visibleLeafMassRatio ?? 1;
  const notes: string[] = [];

  if (topology.visibleLeafCount <= 1) {
    if (topology.originalSolidLayerCount >= 2) {
      notes.push("Contiguous solid layers were collapsed into one visible leaf, so the topology is treated as a laminated single-leaf panel.");
      return { family: "laminated_single_leaf", notes };
    }

    if (
      /concrete|brick|block|masonry|stone|heavy-base/.test(text) ||
      (topology.surfaceMassKgM2 >= 140 && topology.weightedSolidDensityKgM3 >= 1200)
    ) {
      notes.push("Single heavy mineral leaf detected, so the rigid massive-wall family is preferred over lightweight panel surrogates.");
      return { family: "rigid_massive_wall", notes };
    }

    notes.push("Single lightweight or timber leaf detected; the selector will stay on a panel-family surrogate.");
    return { family: "single_leaf_panel", notes };
  }

  if (topology.visibleLeafCount >= 3 || topology.cavityCount >= 2) {
    notes.push("More than two visible leaves or more than one cavity was detected, so the selector falls back to a multi-leaf blend.");
    return { family: "multileaf_multicavity", notes };
  }

  if (topology.hasStudLikeSupport) {
    notes.push("Support or channel-like layers exist inside the separator, so the selector treats the wall as a stud-wall surrogate.");
    return { family: "stud_wall_system", notes };
  }

  if (
    dominantLeafMassKgM2 >= 110 &&
    Number.isFinite(lightestLeafMassKgM2) &&
    lightestLeafMassKgM2 <= 20 &&
    asymmetry >= 4
  ) {
    notes.push("A dominant heavy leaf plus a very light lining leaf indicates a lined massive-wall topology.");
    return { family: "lined_massive_wall", notes };
  }

  notes.push("Two visible leaves around one compliant core were detected, so the selector uses the double-leaf family.");
  return { family: "double_leaf", notes };
}

function chooseBlend(
  family: DynamicAirborneFamily,
  layers: readonly ResolvedLayer[]
): { blend: DelegateBlend; notes: string[] } {
  const topology = summarizeAirborneTopology(layers);
  const text = layers.map(materialText).join(" ");
  const cavity = describePrimaryCavity(layers);
  const notes: string[] = [];

  if (family === "rigid_massive_wall") {
    notes.push("The rigid-wall path averages KS mass calibration with the Sharp coincidence-aware panel curve to avoid pure mass-law overstatement.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [
          { method: "ks_rw_calibrated", weight: 0.5 },
          { method: "sharp", weight: 0.5 }
        ],
        selectedMethod: "ks_rw_calibrated",
        strategy: "rigid_massive_blend"
      },
      notes
    };
  }

  if (family === "single_leaf_panel") {
    if (/clt|timber|wood|mass-timber/.test(text)) {
      notes.push("Timber-like single leaves are blended between mass-law and Sharp so the selector keeps coincidence losses without collapsing to a brittle lightweight-panel curve.");
      return {
        blend: {
          adjustmentsDb: 0,
          delegates: [
            { method: "mass_law", weight: 0.5 },
            { method: "sharp", weight: 0.5 }
          ],
          selectedMethod: "sharp",
          strategy: "timber_panel_blend"
        },
        notes
      };
    }

    notes.push("Light single-leaf boards stay on the Sharp path because it best tracks coincidence-controlled behavior in the current local solver set.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [{ method: "sharp", weight: 1 }],
        selectedMethod: "sharp",
        strategy: "single_leaf_sharp_delegate"
      },
      notes
    };
  }

  if (family === "laminated_single_leaf") {
    notes.push("Bonded or contiguous layers stay on the Sharp panel curve until an explicit laminated-leaf solver lands.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [{ method: "sharp", weight: 1 }],
        selectedMethod: "sharp",
        strategy: "laminated_leaf_sharp_delegate"
      },
      notes
    };
  }

  if (family === "lined_massive_wall") {
    notes.push("Lined massive walls lean on the cavity-aware mass-law lane, but the screening seed trims it back to avoid over-crediting thin linings.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [
          { method: "mass_law", weight: 0.75 },
          { method: "screening_mass_law_curve_seed_v3", weight: 0.25 }
        ],
        selectedMethod: "mass_law",
        strategy: "lined_massive_blend"
      },
      notes
    };
  }

  if (family === "multileaf_multicavity") {
    notes.push("Multi-cavity walls are currently blended between the screening seed and Sharp to stay conservative while preserving some panel-frequency structure.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [
          { method: "screening_mass_law_curve_seed_v3", weight: 0.6 },
          { method: "sharp", weight: 0.4 }
        ],
        selectedMethod: "screening_mass_law_curve_seed_v3",
        strategy: "multileaf_screening_blend"
      },
      notes
    };
  }

  if (family === "stud_wall_system") {
    notes.push("Stud-like support layers are still handled through a surrogate blend because an explicit stud-compliance model has not landed locally yet.");
    return {
      blend: {
        adjustmentsDb: 1,
        delegates: [
          { method: "mass_law", weight: 0.6 },
          { method: "sharp", weight: 0.4 }
        ],
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend"
      },
      notes
    };
  }

  let adjustmentsDb = 0;
  if (!topology.hasPorousFill) {
    notes.push("Empty or mostly empty cavities stay on the cavity-aware mass-law delegate with a small lift; blending against Sharp was over-crediting the local empty-cavity cases.");
    return {
      blend: {
        adjustmentsDb: 1,
        delegates: [{ method: "mass_law", weight: 1 }],
        selectedMethod: "mass_law",
        strategy: "double_leaf_empty_cavity_delegate"
      },
      notes
    };
  }

  const fillFraction = cavity.coreThicknessMm > 0 ? cavity.porousThicknessMm / cavity.coreThicknessMm : 0;
  const residualGapMm = cavity.gapThicknessMm;

  adjustmentsDb = 1;
  if (
    fillFraction >= 0.65 &&
    fillFraction <= 0.85 &&
    residualGapMm >= 15 &&
    residualGapMm <= 40 &&
    (topology.visibleLeafMassRatio ?? 99) <= 1.6 &&
    Math.max(...topology.visibleLeafMassesKgM2, 0) <= 18
  ) {
    adjustmentsDb = 4;
    notes.push("Partly filled symmetric lightweight cavity triggered an extra resonance-region lift because the current local delegates under-read this topology.");
  } else {
    notes.push("Porous cavity fill stays on the mass-law delegate with a modest lift until a dedicated double-leaf cavity solver is added.");
  }

  return {
    blend: {
      adjustmentsDb,
      delegates: [{ method: "mass_law", weight: 1 }],
      selectedMethod: "mass_law",
      strategy: adjustmentsDb > 1 ? "double_leaf_porous_fill_corrected" : "double_leaf_porous_fill_delegate"
    },
    notes
  };
}

function classifyConfidence(score: number): DynamicAirborneConfidenceClass {
  if (score >= 0.78) {
    return "high";
  }

  if (score >= 0.58) {
    return "medium";
  }

  return "low";
}

function buildConfidenceScore(
  family: DynamicAirborneFamily,
  topology: ReturnType<typeof summarizeAirborneTopology>,
  solverSpreadRwDb: number,
  adjustmentDb: number
): number {
  let score =
    family === "rigid_massive_wall"
      ? 0.84
      : family === "single_leaf_panel"
        ? 0.72
        : family === "laminated_single_leaf"
          ? 0.68
          : family === "double_leaf"
            ? 0.69
            : family === "lined_massive_wall"
              ? 0.78
              : family === "stud_wall_system"
                ? 0.52
                : 0.56;

  if (topology.surfaceMassKgM2 >= 120 && family !== "multileaf_multicavity") {
    score += 0.03;
  }

  if (topology.hasPorousFill && family === "double_leaf") {
    score += 0.02;
  }

  if (topology.hasStudLikeSupport) {
    score -= 0.08;
  }

  if (topology.visibleLeafMassRatio && topology.visibleLeafMassRatio > 8 && family !== "lined_massive_wall") {
    score -= 0.05;
  }

  if (solverSpreadRwDb >= 12) {
    score -= 0.12;
  } else if (solverSpreadRwDb >= 8) {
    score -= 0.07;
  } else if (solverSpreadRwDb <= 4) {
    score += 0.03;
  }

  if (adjustmentDb >= 3) {
    score -= 0.08;
  }

  return ksRound1(clamp(score, 0.35, 0.92));
}

export function calculateDynamicAirborneResult(
  layers: readonly ResolvedLayer[],
  options: {
    frequenciesHz?: readonly number[];
    screeningEstimatedRwDb: number;
  }
): DynamicAirborneResult {
  const topology = summarizeAirborneTopology(layers);
  const family = detectDynamicFamily(layers);
  const blendSelection = chooseBlend(family.family, layers);
  const calculatorDelegates = [
    calculateAirborneCalculatorResult("ks_rw_calibrated", layers, options.frequenciesHz),
    calculateAirborneCalculatorResult("mass_law", layers, options.frequenciesHz),
    calculateAirborneCalculatorResult("sharp", layers, options.frequenciesHz),
    calculateAirborneCalculatorResult("kurtovic", layers, options.frequenciesHz)
  ];
  const resolvedFrequenciesHz = calculatorDelegates[0]?.curve.frequenciesHz ?? options.frequenciesHz ?? [];

  const delegates: DelegateCurve[] = [
    buildScreeningDelegate(topology.surfaceMassKgM2, options.screeningEstimatedRwDb, resolvedFrequenciesHz),
    ...calculatorDelegates
  ].map((delegate) => ({
    curve: delegate.curve,
    label: getDelegateLabel(
      "method" in delegate ? delegate.method : (delegate.id as DynamicAirborneDelegateMethod)
    ),
    method: "method" in delegate ? delegate.method : (delegate.id as DynamicAirborneDelegateMethod),
    rw: delegate.rw
  }));

  const dynamicCurve = blendDelegateCurves(delegates, blendSelection.blend);
  const ratings = buildRatingsFromCurve(dynamicCurve.frequenciesHz, dynamicCurve.transmissionLossDb);
  const rwValues = delegates
    .map((delegate) => delegate.rw)
    .filter((value) => Number.isFinite(value) && value > 0);
  const solverSpreadRwDb =
    rwValues.length > 1 ? ksRound1(Math.max(...rwValues) - Math.min(...rwValues)) : 0;
  const confidenceScore = buildConfidenceScore(
    family.family,
    topology,
    solverSpreadRwDb,
    blendSelection.blend.adjustmentsDb
  );
  const confidenceClass = classifyConfidence(confidenceScore);
  const warnings: string[] = [];
  const selectedCandidate = delegates.find((delegate) => delegate.method === blendSelection.blend.selectedMethod);

  if (family.family === "stud_wall_system") {
    warnings.push(
      "Stud-like support layers are being evaluated through a surrogate dynamic branch until explicit stud-compliance inputs and models are added locally."
    );
  }

  if (family.family === "multileaf_multicavity") {
    warnings.push(
      "Multi-leaf airborne selection is currently a conservative family blend, not a premium multi-cavity solver."
    );
  }

  if (blendSelection.blend.adjustmentsDb >= 3) {
    warnings.push(
      "A cavity-correction lift was applied because the current local delegate set underestimates this partially filled lightweight double-leaf topology."
    );
  }

  if (confidenceClass === "low") {
    warnings.push(
      "Dynamic airborne confidence is low on this topology; small layer or support changes may move the best-fit family and result."
    );
  }

  if (selectedCandidate && Math.abs(ratings.iso717.Rw - selectedCandidate.rw) >= 3) {
    warnings.push(
      "The dynamic family blend moved materially away from its anchor delegate, so treat the result as a family-level estimate rather than a single-formula output."
    );
  }

  const trace: DynamicAirborneTrace = {
    adjustmentDb: blendSelection.blend.adjustmentsDb,
    candidateMethods: delegates.map((delegate) => ({
      label: delegate.label,
      method: delegate.method,
      rwDb: delegate.rw,
      selected: delegate.method === blendSelection.blend.selectedMethod
    })),
    cavityCount: topology.cavityCount,
    confidenceClass,
    confidenceScore,
    detectedFamily: family.family,
    detectedFamilyLabel: FAMILY_LABELS[family.family],
    hasPorousFill: topology.hasPorousFill,
    hasStudLikeSupport: topology.hasStudLikeSupport,
    notes: [...family.notes, ...blendSelection.notes],
    originalSolidLayerCount: topology.originalSolidLayerCount,
    porousLayerCount: topology.porousLayerCount,
    selectedLabel: getDelegateLabel(blendSelection.blend.selectedMethod),
    selectedMethod: blendSelection.blend.selectedMethod,
    solverSpreadRwDb,
    strategy: blendSelection.blend.strategy,
    supportLayerCount: topology.supportLayerCount,
    surfaceMassKgM2: topology.surfaceMassKgM2,
    totalGapThicknessMm: topology.totalGapThicknessMm,
    visibleLeafCount: topology.visibleLeafCount,
    visibleLeafMassRatio: topology.visibleLeafMassRatio
  };

  return {
    curve: dynamicCurve,
    id: "dynamic",
    label: "Dynamic Topology",
    ratings,
    rw: ratings.iso717.Rw,
    trace,
    warnings
  };
}
