import { describe, expect, it } from "vitest";

import type {
  AirborneCalculatorId,
  AirborneContext,
  DynamicAirborneFamily,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const WALL_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
];

const TIMBER_STUD_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const LSF_EXACT_STACK: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
];

const EMPTY_DOUBLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const FILLED_DOUBLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const DIRECT_COUPLED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const POROTHERM_EXACT_STACK: readonly LayerInput[] = [
  { materialId: "dense_plaster", thicknessMm: 13 },
  { materialId: "porotherm_pls_100", thicknessMm: 100 },
  { materialId: "dense_plaster", thicknessMm: 13 }
];

const BASE_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const TIMBER_STUD_LAB_CONTEXT: AirborneContext = {
  ...BASE_LAB_CONTEXT,
  connectionType: "line_connection",
  studSpacingMm: 600,
  studType: "wood_stud"
};

const TIMBER_STUD_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  studSpacingMm: 600,
  studType: "wood_stud"
};

const TIMBER_STUD_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600,
  studType: "wood_stud"
};

const LSF_LAB_CONTEXT: AirborneContext = {
  ...BASE_LAB_CONTEXT,
  connectionType: "line_connection",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const LSF_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const LSF_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55,
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

type Snapshot = {
  calculatorId: AirborneCalculatorId | null;
  c: number | null;
  ctr: number | null;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  method: string;
  rw: number | null;
  rwPrime: number | null;
  stc: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  warnings: readonly string[];
};

type SnapshotWithTrace = Snapshot & {
  trace: ReturnType<typeof calculateAssembly>["dynamicAirborneTrace"];
};

function snapshot(input: {
  calculator?: AirborneCalculatorId | null;
  context: AirborneContext;
  layers: readonly LayerInput[];
}): SnapshotWithTrace {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.context,
    calculator: input.calculator,
    targetOutputs: WALL_OUTPUTS
  });

  return {
    calculatorId: result.calculatorId ?? null,
    c: result.metrics.estimatedCDb ?? null,
    ctr: result.metrics.estimatedCtrDb ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    method: result.metrics.method,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    supported: result.supportedTargetOutputs,
    trace: result.dynamicAirborneTrace,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

function expectWarning(warnings: readonly string[], pattern: RegExp, label: string): void {
  expect(warnings.some((warning) => pattern.test(warning)), `${label} warning`).toBe(true);
}

function expectNoDynamicTrace(result: Pick<SnapshotWithTrace, "trace">, label: string): void {
  expect(result.trace, `${label} trace`).toBeUndefined();
}

function expectTrace(
  result: Pick<SnapshotWithTrace, "trace">,
  expected: {
    confidence: "high" | "medium" | "low";
    decision?: "clear" | "narrow" | "ambiguous";
    family: DynamicAirborneFamily;
    runner?: string;
    selectedMethod?: string;
    strategy: string;
  },
  label: string
): NonNullable<ReturnType<typeof calculateAssembly>["dynamicAirborneTrace"]> {
  const trace = result.trace;

  expect(trace, `${label} trace`).toBeTruthy();
  if (!trace) {
    throw new Error(`${label} trace missing`);
  }

  expect(trace.detectedFamily, `${label} family`).toBe(expected.family);
  expect(trace.strategy, `${label} strategy`).toBe(expected.strategy);
  expect(trace.confidenceClass, `${label} confidence`).toBe(expected.confidence);
  expect(trace.familyDecisionClass, `${label} decision`).toBe(expected.decision);
  expect(trace.runnerUpFamily, `${label} runner`).toBe(expected.runner);
  expect(trace.selectedMethod, `${label} selected method`).toBe(expected.selectedMethod);

  return trace;
}

describe("wall formula family widening audit", () => {
  it("pins timber-stud screening and dynamic surfaces separately before correction", () => {
    const screeningLab = snapshot({
      calculator: null,
      context: TIMBER_STUD_LAB_CONTEXT,
      layers: TIMBER_STUD_STACK
    });

    expect(screeningLab).toMatchObject({
      calculatorId: null,
      c: -1,
      ctr: -5.8,
      dnA: null,
      dnTA: null,
      dnTw: null,
      dnW: null,
      method: "screening_mass_law_curve_seed_v3",
      rw: 31.1,
      rwPrime: null,
      stc: 31,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });
    expectNoDynamicTrace(screeningLab, "timber screening lab");
    expectWarning(screeningLab.warnings, /Screening estimate only/i, "timber screening lab");

    const screeningField = snapshot({
      calculator: null,
      context: TIMBER_STUD_FIELD_CONTEXT,
      layers: TIMBER_STUD_STACK
    });

    expect(screeningField).toMatchObject({
      c: -1.3,
      ctr: -5.9,
      dnA: 21.7,
      dnTA: null,
      dnTw: null,
      dnW: 23,
      method: "screening_mass_law_curve_seed_v3",
      rw: 24.1,
      rwPrime: 24,
      stc: 24,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    });
    expectNoDynamicTrace(screeningField, "timber screening field");
    expectWarning(screeningField.warnings, /field-side overlay active/i, "timber screening field");

    const screeningBuilding = snapshot({
      calculator: null,
      context: TIMBER_STUD_BUILDING_CONTEXT,
      layers: TIMBER_STUD_STACK
    });

    expect(screeningBuilding).toMatchObject({
      c: -1.3,
      ctr: -5.9,
      dnA: 21.7,
      dnTA: 24.2,
      dnTw: 25,
      dnW: 23,
      method: "screening_mass_law_curve_seed_v3",
      rw: 24.1,
      rwPrime: 24,
      stc: 24,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"]
    });
    expectNoDynamicTrace(screeningBuilding, "timber screening building");

    const dynamicLab = snapshot({
      calculator: "dynamic",
      context: TIMBER_STUD_LAB_CONTEXT,
      layers: TIMBER_STUD_STACK
    });

    expect(dynamicLab).toMatchObject({
      calculatorId: "dynamic",
      c: 0.5,
      ctr: -4.2,
      dnA: null,
      dnTA: null,
      dnTw: null,
      dnW: null,
      method: "dynamic",
      rw: 50,
      rwPrime: null,
      stc: 50,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });
    const labTrace = expectTrace(
      dynamicLab,
      {
        confidence: "low",
        decision: "ambiguous",
        family: "stud_wall_system",
        runner: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      "timber dynamic lab"
    );
    expect(labTrace.hasStudLikeSupport, "timber dynamic lab stud support flag").toBe(false);
    expect(labTrace.visibleLeafCount, "timber dynamic lab visible leaves").toBe(2);
    expect(labTrace.cavityCount, "timber dynamic lab cavities").toBe(1);
    expect(labTrace.hasPorousFill, "timber dynamic lab porous fill").toBe(true);
    expect(labTrace.notes.join("\n"), "timber dynamic lab notes").toMatch(/target Rw 49\.7 dB/i);
    expect(labTrace.notes.join("\n"), "timber dynamic lab notes").toMatch(/board-dominant/i);
    expectWarning(dynamicLab.warnings, /confidence is low/i, "timber dynamic lab");
    expectWarning(dynamicLab.warnings, /boundary between Stud Wall Surrogate and Double Leaf/i, "timber dynamic lab");

    const dynamicField = snapshot({
      calculator: "dynamic",
      context: TIMBER_STUD_FIELD_CONTEXT,
      layers: TIMBER_STUD_STACK
    });

    expect(dynamicField).toMatchObject({
      c: 0.4,
      ctr: -4.3,
      dnA: 41.4,
      dnTA: null,
      dnTw: null,
      dnW: 41,
      rw: 42,
      rwPrime: 42,
      stc: 42,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    });
    expectTrace(
      dynamicField,
      {
        confidence: "low",
        decision: "ambiguous",
        family: "stud_wall_system",
        runner: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      "timber dynamic field"
    );

    const dynamicBuilding = snapshot({
      calculator: "dynamic",
      context: TIMBER_STUD_BUILDING_CONTEXT,
      layers: TIMBER_STUD_STACK
    });

    expect(dynamicBuilding).toMatchObject({
      c: 0.4,
      ctr: -4.3,
      dnA: 41.4,
      dnTA: 43.9,
      dnTw: 43,
      dnW: 41,
      rw: 42,
      rwPrime: 42,
      stc: 42,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"]
    });
    expectTrace(
      dynamicBuilding,
      {
        confidence: "low",
        decision: "ambiguous",
        family: "stud_wall_system",
        runner: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      "timber dynamic building"
    );
  });

  it("keeps LSF exact catalog precedence on screening and dynamic surfaces", () => {
    const screeningLab = snapshot({
      calculator: null,
      context: LSF_LAB_CONTEXT,
      layers: LSF_EXACT_STACK
    });

    expect(screeningLab).toMatchObject({
      calculatorId: null,
      c: -1.4,
      ctr: -6.2,
      method: "screening_mass_law_curve_seed_v3",
      rw: 55,
      stc: 55,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });
    expectNoDynamicTrace(screeningLab, "LSF screening lab");
    expectWarning(screeningLab.warnings, /Curated exact airborne lab match active: Knauf/i, "LSF screening lab");

    const screeningField = snapshot({
      calculator: null,
      context: LSF_FIELD_CONTEXT,
      layers: LSF_EXACT_STACK
    });

    expect(screeningField).toMatchObject({
      c: -1.2,
      ctr: -5.7,
      dnA: 45.8,
      dnTA: null,
      dnTw: null,
      dnW: 47,
      method: "screening_mass_law_curve_seed_v3",
      rw: 48,
      rwPrime: 48,
      stc: 48,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    });
    expectNoDynamicTrace(screeningField, "LSF screening field");
    expectWarning(screeningField.warnings, /Curated airborne lab fallback active/i, "LSF screening field");

    const screeningBuilding = snapshot({
      calculator: null,
      context: LSF_BUILDING_CONTEXT,
      layers: LSF_EXACT_STACK
    });

    expect(screeningBuilding).toMatchObject({
      c: -1.2,
      ctr: -5.7,
      dnA: 45.8,
      dnTA: 48.3,
      dnTw: 49,
      dnW: 47,
      method: "screening_mass_law_curve_seed_v3",
      rw: 48,
      rwPrime: 48,
      stc: 48,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"]
    });
    expectNoDynamicTrace(screeningBuilding, "LSF screening building");

    const dynamicLab = snapshot({
      calculator: "dynamic",
      context: LSF_LAB_CONTEXT,
      layers: LSF_EXACT_STACK
    });

    expect(dynamicLab).toMatchObject({
      calculatorId: "dynamic",
      c: -1.5,
      ctr: -6.4,
      method: "dynamic",
      rw: 55,
      stc: 55,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });
    const dynamicLabTrace = expectTrace(
      dynamicLab,
      {
        confidence: "low",
        decision: "ambiguous",
        family: "stud_wall_system",
        runner: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      "LSF dynamic lab"
    );
    expect(dynamicLabTrace.notes.join("\n"), "LSF dynamic lab notes").toMatch(/target Rw 59\.7 dB/i);
    expectWarning(dynamicLab.warnings, /Curated exact airborne lab match active: Knauf/i, "LSF dynamic lab");

    const dynamicField = snapshot({
      calculator: "dynamic",
      context: LSF_FIELD_CONTEXT,
      layers: LSF_EXACT_STACK
    });

    expect(dynamicField).toMatchObject({
      c: -1,
      ctr: -6,
      dnA: 46,
      dnTA: null,
      dnTw: null,
      dnW: 47,
      rw: 48,
      rwPrime: 48,
      stc: 48,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    });
    expectTrace(
      dynamicField,
      {
        confidence: "low",
        decision: "ambiguous",
        family: "stud_wall_system",
        runner: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      "LSF dynamic field"
    );
  });

  it("pins empty and filled double-leaf topology selection with and without explicit stud metadata", () => {
    const emptyNoHint = snapshot({
      calculator: "dynamic",
      context: BASE_LAB_CONTEXT,
      layers: EMPTY_DOUBLE_LEAF_STACK
    });

    expect(emptyNoHint).toMatchObject({
      c: -1.4,
      ctr: -6.9,
      rw: 39,
      stc: 39
    });
    expectTrace(
      emptyNoHint,
      {
        confidence: "medium",
        family: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "double_leaf_empty_cavity_delegate"
      },
      "empty double leaf without stud metadata"
    );

    const emptyWithHint = snapshot({
      calculator: "dynamic",
      context: LSF_LAB_CONTEXT,
      layers: EMPTY_DOUBLE_LEAF_STACK
    });

    expect(emptyWithHint).toMatchObject({
      c: -0.7,
      ctr: -4.7,
      rw: 34,
      stc: 34
    });
    expectTrace(
      emptyWithHint,
      {
        confidence: "low",
        decision: "narrow",
        family: "stud_wall_system",
        runner: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      "empty double leaf with stud metadata"
    );

    const filledNoHint = snapshot({
      calculator: "dynamic",
      context: BASE_LAB_CONTEXT,
      layers: FILLED_DOUBLE_LEAF_STACK
    });

    expect(filledNoHint).toMatchObject({
      c: -1.6,
      ctr: -7,
      rw: 43,
      stc: 43
    });
    expectTrace(
      filledNoHint,
      {
        confidence: "low",
        family: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "double_leaf_porous_fill_corrected"
      },
      "filled double leaf without stud metadata"
    );

    const filledWithHint = snapshot({
      calculator: "dynamic",
      context: LSF_LAB_CONTEXT,
      layers: FILLED_DOUBLE_LEAF_STACK
    });

    expect(filledWithHint).toMatchObject({
      c: 0.9,
      ctr: -3.7,
      rw: 43,
      stc: 43
    });
    expectTrace(
      filledWithHint,
      {
        confidence: "low",
        decision: "narrow",
        family: "stud_wall_system",
        runner: "double_leaf",
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      "filled double leaf with stud metadata"
    );
  });

  it("keeps negative cases out of the stud or double-leaf widening lane", () => {
    const directCoupled = snapshot({
      calculator: "dynamic",
      context: LSF_LAB_CONTEXT,
      layers: DIRECT_COUPLED_STACK
    });

    expect(directCoupled).toMatchObject({
      c: 3.7,
      ctr: 8,
      rw: 34,
      stc: 34
    });
    expectTrace(
      directCoupled,
      {
        confidence: "medium",
        family: "laminated_single_leaf",
        selectedMethod: "sharp",
        strategy: "laminated_leaf_sharp_delegate"
      },
      "direct-coupled with stud metadata"
    );
    expectWarning(directCoupled.warnings, /not allowed to force the stud-wall lane/i, "direct-coupled");

    const tripleLeaf = snapshot({
      calculator: "dynamic",
      context: LSF_LAB_CONTEXT,
      layers: TRIPLE_LEAF_STACK
    });

    expect(tripleLeaf).toMatchObject({
      c: 0.4,
      ctr: -0.6,
      rw: 34,
      stc: 34
    });
    expectTrace(
      tripleLeaf,
      {
        confidence: "low",
        family: "multileaf_multicavity",
        selectedMethod: "screening_mass_law_curve_seed_v3",
        strategy: "multileaf_screening_blend"
      },
      "triple leaf with stud metadata"
    );

    const missingThickness = snapshot({
      calculator: "dynamic",
      context: BASE_LAB_CONTEXT,
      layers: [{ materialId: "gypsum_board" } as unknown as LayerInput]
    });
    expect(missingThickness).toMatchObject({
      rw: 0,
      stc: 0,
      supported: [],
      unsupported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"]
    });
    expectNoDynamicTrace(missingThickness, "missing thickness");
    expectWarning(missingThickness.warnings, /invalid thickness/i, "missing thickness");

    const unknownMaterial = snapshot({
      calculator: "dynamic",
      context: BASE_LAB_CONTEXT,
      layers: [{ materialId: "unobtainium", thicknessMm: 12.5 } as unknown as LayerInput]
    });
    expect(unknownMaterial).toMatchObject({
      rw: 0,
      stc: 0,
      supported: [],
      unsupported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"]
    });
    expectNoDynamicTrace(unknownMaterial, "unknown material");
    expectWarning(unknownMaterial.warnings, /unknown material/i, "unknown material");
  });

  it("keeps exact single-leaf masonry anchor ahead of formula widening work", () => {
    const screeningLab = snapshot({
      calculator: null,
      context: BASE_LAB_CONTEXT,
      layers: POROTHERM_EXACT_STACK
    });

    expect(screeningLab).toMatchObject({
      calculatorId: null,
      c: -0.9,
      ctr: -5.7,
      method: "screening_mass_law_curve_seed_v3",
      rw: 43,
      stc: 43,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });
    expectNoDynamicTrace(screeningLab, "Porotherm screening lab");
    expectWarning(screeningLab.warnings, /Curated exact airborne lab match active: Wienerberger/i, "Porotherm");

    const dynamicLab = snapshot({
      calculator: "dynamic",
      context: BASE_LAB_CONTEXT,
      layers: POROTHERM_EXACT_STACK
    });

    expect(dynamicLab).toMatchObject({
      calculatorId: "dynamic",
      c: -1,
      ctr: -5.5,
      method: "dynamic",
      rw: 43,
      stc: 43,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    });
    expectTrace(
      dynamicLab,
      {
        confidence: "medium",
        family: "masonry_nonhomogeneous",
        selectedMethod: "sharp",
        strategy: "masonry_nonhomogeneous_blend+porotherm_plastered_calibration"
      },
      "Porotherm dynamic lab"
    );
  });
});
