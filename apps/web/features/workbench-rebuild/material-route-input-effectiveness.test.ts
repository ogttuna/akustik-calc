import type { AssemblyCalculation, MaterialDefinition } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildMaterialRouteInputEffectiveness } from "./material-route-input-effectiveness";

const porousMaterialWithoutFlow: MaterialDefinition = {
  acoustic: {
    absorberClass: "porous_absorptive",
    behavior: "porous_absorber",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "insulation",
  densityKgM3: 45,
  id: "porous_absorber",
  name: "Porous absorber",
  tags: []
};

const porousMaterialWithFlow: MaterialDefinition = {
  ...porousMaterialWithoutFlow,
  acoustic: {
    ...porousMaterialWithoutFlow.acoustic!,
    flowResistivityPaSM2: 15000
  }
};

const porousMaterialUnknownAbsorberClass: MaterialDefinition = {
  ...porousMaterialWithoutFlow,
  acoustic: {
    ...porousMaterialWithoutFlow.acoustic!,
    absorberClass: "unknown"
  },
  id: "porous_absorber_unknown_class",
  name: "Porous absorber with unknown class"
};

const resilientMaterial: MaterialDefinition = {
  acoustic: {
    behavior: "resilient_layer",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "support",
  densityKgM3: 80,
  id: "resilient_layer",
  impact: {
    dynamicStiffnessMNm3: 35
  },
  name: "Resilient layer",
  tags: []
};

const resilientMaterialWithoutDynamicStiffness: MaterialDefinition = {
  acoustic: {
    behavior: "resilient_layer",
    notes: [],
    propertySourceStatus: "user_supplied"
  },
  category: "support",
  densityKgM3: 80,
  id: "resilient_layer_without_dynamic_stiffness",
  name: "Resilient layer without dynamic stiffness",
  tags: []
};

const panelMaterial: MaterialDefinition = {
  acoustic: {
    behavior: "panel_leaf",
    lossFactor: 0.03,
    notes: [],
    poissonRatio: 0.25,
    propertySourceStatus: "user_supplied",
    youngModulusPa: 2_500_000_000
  },
  category: "finish",
  densityKgM3: 850,
  id: "panel_leaf",
  name: "Panel leaf",
  notes: "Project note",
  tags: ["board"]
};

function makeAirborneResult(input?: {
  exact?: boolean;
  missingAbsorberClass?: boolean;
  missingFlow?: boolean;
  missingMechanical?: boolean;
  missingPorosity?: boolean;
  referencesFlow?: boolean;
  referencesMechanical?: boolean;
  referencesPorosity?: boolean;
}): AssemblyCalculation {
  const missingPhysicalInputs = [
    ...(input?.missingAbsorberClass ? ["absorberClass"] : []),
    ...(input?.missingFlow ? ["flowResistivityPaSM2"] : []),
    ...(input?.missingMechanical ? ["youngModulusPa", "poissonRatio", "lossFactor"] : []),
    ...(input?.missingPorosity ? ["porosity"] : [])
  ];
  const needsInput = missingPhysicalInputs.length > 0;
  const assumptions = [
    ...(input?.referencesFlow ? ["Porous cavity damping is an explicit physical input."] : []),
    ...(input?.referencesMechanical ? ["Panel bending stiffness and panel loss factor are explicit material inputs."] : []),
    ...(input?.referencesPorosity ? ["Porosity is an explicit porous absorber input."] : [])
  ];
  const requiredInputs = [
    ...(input?.referencesFlow ? ["flowResistivityPaSM2", "porousCavityDampingCreditDb"] : []),
    ...(input?.referencesMechanical ? ["youngModulusPa", "poissonRatio", "lossFactor"] : []),
    ...(input?.referencesPorosity ? ["porosity"] : [])
  ];

  return {
    acousticAnswerBoundary: needsInput
      ? {
          basis: "route_input_test",
          missingPhysicalInputs,
          origin: "needs_input",
          status: "needs_input",
          unsupportedOutputs: ["Rw"]
        }
      : undefined,
    airborneBasis: {
      assumptions,
      curveBasis: input?.exact ? "measured_frequency_curve" : "calculated_frequency_curve",
      kind: input?.exact ? "airborne_measured_exact" : "airborne_physics_prediction",
      method: input?.referencesFlow ? "double_leaf_flow_resistivity_route" : "test_airborne_route",
      missingPhysicalInputs,
      origin: needsInput ? "needs_input" : input?.exact ? "measured_exact_full_stack" : "family_physics_prediction",
      propertyDefaults: [],
      requiredInputs
    },
    impact: null,
    metrics: {
      airGapCount: 0,
      estimatedCDb: -1,
      estimatedCtrDb: -6,
      estimatedRwDb: 46,
      estimatedStc: 46,
      insulationCount: 1,
      method: "dynamic",
      surfaceMassKgM2: 25,
      totalThicknessMm: 115
    },
    ratings: {
      astmE413: { STC: 46 },
      iso717: { C: -1, Ctr: -6, Rw: 46 }
    },
    supportedTargetOutputs: needsInput ? [] : ["Rw"],
    unsupportedTargetOutputs: needsInput ? ["Rw"] : []
  } as unknown as AssemblyCalculation;
}

function makeImpactResult(input?: {
  exact?: boolean;
  dynamicStiffnessMNm3?: number;
  missingDynamicStiffness?: boolean;
}): AssemblyCalculation {
  const dynamicStiffnessMNm3 = input?.dynamicStiffnessMNm3 ?? 35;

  return {
    acousticAnswerBoundary: input?.missingDynamicStiffness
      ? {
          basis: "route_input_test",
          missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
          origin: "needs_input",
          status: "needs_input",
          unsupportedOutputs: ["DeltaLw"]
        }
      : undefined,
    impact: {
      availableOutputs: ["DeltaLw"],
      basis: input?.exact ? "exact_source_impact_route" : "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      DeltaLw: 24.9,
      notes: [],
      resilientDynamicStiffnessMNm3: dynamicStiffnessMNm3,
      scope: "narrow_heavy_concrete_only"
    },
    metrics: {
      airGapCount: 0,
      estimatedCDb: 0,
      estimatedCtrDb: 0,
      estimatedRwDb: 50,
      estimatedStc: 50,
      insulationCount: 0,
      method: "dynamic",
      surfaceMassKgM2: 300,
      totalThicknessMm: 160
    },
    ratings: {
      astmE413: { STC: 50 },
      iso717: { C: 0, Ctr: 0, Rw: 50 }
    },
    supportedTargetOutputs: input?.missingDynamicStiffness ? [] : ["DeltaLw"],
    unsupportedTargetOutputs: input?.missingDynamicStiffness ? ["DeltaLw"] : []
  } as unknown as AssemblyCalculation;
}

function expectMaterialEffectiveness(
  effectiveness: { status: string; title: string } | undefined,
  status: string,
  titleParts: readonly string[]
): void {
  expect(effectiveness).toMatchObject({ status });
  for (const titlePart of titleParts) {
    expect(effectiveness?.title).toContain(titlePart);
  }
}

describe("material route input effectiveness", () => {
  it("marks missing porous absorber flow resistivity as needed for the active material", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithoutFlow.id }],
      material: porousMaterialWithoutFlow,
      mode: "wall",
      result: makeAirborneResult({ missingFlow: true }),
      selectedOutputs: ["Rw"]
    });

    expect(effectiveness.flowResistivityPaSM2).toMatchObject({ status: "needed" });
  });

  it("explains missing material inputs in needed tooltip titles", () => {
    const missingFlowEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithoutFlow.id }],
      material: porousMaterialWithoutFlow,
      mode: "wall",
      result: makeAirborneResult({ missingFlow: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(missingFlowEffectiveness.flowResistivityPaSM2, "needed", [
      "flow resistivity",
      "porous absorber",
      "porous cavity damping",
      "missing",
      "current output"
    ]);

    const missingDynamicStiffnessEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: resilientMaterialWithoutDynamicStiffness.id }],
      material: resilientMaterialWithoutDynamicStiffness,
      mode: "floor",
      result: makeImpactResult({ missingDynamicStiffness: true }),
      selectedOutputs: ["DeltaLw"]
    });

    expectMaterialEffectiveness(missingDynamicStiffnessEffectiveness.dynamicStiffnessMNm3, "needed", [
      "dynamic stiffness",
      "floor impact",
      "missing",
      "current output"
    ]);

    const missingMechanicalEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult({ missingMechanical: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(missingMechanicalEffectiveness.youngModulusPa, "needed", [
      "Young modulus",
      "panel",
      "current output"
    ]);
    expectMaterialEffectiveness(missingMechanicalEffectiveness.poissonRatio, "needed", [
      "Poisson ratio",
      "formula route",
      "current output"
    ]);
    expectMaterialEffectiveness(missingMechanicalEffectiveness.lossFactor, "needed", [
      "loss factor",
      "panel",
      "current output"
    ]);

    const missingAbsorberClassEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialUnknownAbsorberClass.id }],
      material: porousMaterialUnknownAbsorberClass,
      mode: "wall",
      result: makeAirborneResult({ missingAbsorberClass: true, missingFlow: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(missingAbsorberClassEffectiveness.absorberClass, "needed", [
      "absorber class",
      "porous absorber",
      "current output"
    ]);

    const missingPorosityEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithFlow.id }],
      material: porousMaterialWithFlow,
      mode: "wall",
      result: makeAirborneResult({ missingPorosity: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(missingPorosityEffectiveness.porosity, "needed", [
      "porosity",
      "porous absorber",
      "current output"
    ]);
  });

  it("marks flow resistivity used when a live airborne formula basis requires it", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithFlow.id }],
      material: porousMaterialWithFlow,
      mode: "wall",
      result: makeAirborneResult({ referencesFlow: true }),
      selectedOutputs: ["Rw"]
    });

    expect(effectiveness.flowResistivityPaSM2).toMatchObject({ status: "used" });
  });

  it("explains material route dependency reasons in tooltip titles", () => {
    const flowEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithFlow.id }],
      material: porousMaterialWithFlow,
      mode: "wall",
      result: makeAirborneResult({ referencesFlow: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(flowEffectiveness.flowResistivityPaSM2, "used", [
      "flow resistivity",
      "porous absorber",
      "feeds",
      "formula route"
    ]);
    expectMaterialEffectiveness(flowEffectiveness.absorberClass, "used", [
      "absorber class",
      "porous absorber",
      "formula route"
    ]);

    const dynamicStiffnessEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: resilientMaterial.id }],
      material: resilientMaterial,
      mode: "floor",
      result: makeImpactResult({ dynamicStiffnessMNm3: 35 }),
      selectedOutputs: ["DeltaLw"]
    });

    expectMaterialEffectiveness(dynamicStiffnessEffectiveness.dynamicStiffnessMNm3, "used", [
      "dynamic stiffness",
      "floor impact",
      "feeds",
      "formula route"
    ]);

    const exactSourceEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult({ exact: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(exactSourceEffectiveness.densityKgM3, "inactive", [
      "Exact source",
      "current output",
      "formula route"
    ]);

    const outOfStackEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: "other_material" }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(outOfStackEffectiveness.densityKgM3, "inactive", [
      "active layer stack",
      "current result"
    ]);

    const mechanicalEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult({ referencesMechanical: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(mechanicalEffectiveness.youngModulusPa, "used", [
      "Young modulus",
      "panel bending stiffness",
      "formula route"
    ]);
    expectMaterialEffectiveness(mechanicalEffectiveness.poissonRatio, "used", [
      "Poisson ratio",
      "formula route"
    ]);
    expectMaterialEffectiveness(mechanicalEffectiveness.lossFactor, "used", [
      "loss factor",
      "formula route"
    ]);

    const porosityEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithFlow.id }],
      material: porousMaterialWithFlow,
      mode: "wall",
      result: makeAirborneResult({ referencesPorosity: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(porosityEffectiveness.porosity, "used", [
      "porosity",
      "formula route"
    ]);
  });

  it("marks flow resistivity inactive when an exact airborne source owns the output", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithFlow.id }],
      material: porousMaterialWithFlow,
      mode: "wall",
      result: makeAirborneResult({ exact: true }),
      selectedOutputs: ["Rw"]
    });

    expect(effectiveness.flowResistivityPaSM2).toMatchObject({ status: "inactive" });
  });

  it("explains exact-source material inactivity in tooltip titles", () => {
    const exactAirborneEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: porousMaterialWithFlow.id }],
      material: porousMaterialWithFlow,
      mode: "wall",
      result: makeAirborneResult({ exact: true }),
      selectedOutputs: ["Rw"]
    });

    expectMaterialEffectiveness(exactAirborneEffectiveness.flowResistivityPaSM2, "inactive", [
      "Exact airborne source",
      "current output",
      "formula route"
    ]);

    const exactImpactEffectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: resilientMaterial.id }],
      material: resilientMaterial,
      mode: "floor",
      result: makeImpactResult({ exact: true }),
      selectedOutputs: ["DeltaLw"]
    });

    expectMaterialEffectiveness(exactImpactEffectiveness.dynamicStiffnessMNm3, "inactive", [
      "Exact impact source",
      "current output",
      "formula route"
    ]);
  });

  it("marks material dynamic stiffness used when the live floor impact result echoes that value", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: resilientMaterial.id }],
      material: resilientMaterial,
      mode: "floor",
      result: makeImpactResult({ dynamicStiffnessMNm3: 35 }),
      selectedOutputs: ["DeltaLw"]
    });

    expect(effectiveness.dynamicStiffnessMNm3).toMatchObject({ status: "used" });
  });

  it("marks material dynamic stiffness inactive for airborne-only output sets", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: resilientMaterial.id }],
      material: resilientMaterial,
      mode: "floor",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expect(effectiveness.dynamicStiffnessMNm3).toMatchObject({ status: "inactive" });
  });

  it("marks metadata fields inactive because they do not feed the solver", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expect(effectiveness.propertySourceStatus).toMatchObject({ status: "inactive" });
    expect(effectiveness.tags).toMatchObject({ status: "inactive" });
    expect(effectiveness.notes).toMatchObject({ status: "inactive" });
  });

  it("marks category behavior and density used by live formula routes", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expect(effectiveness.category).toMatchObject({ status: "used" });
    expect(effectiveness.behavior).toMatchObject({ status: "used" });
    expect(effectiveness.densityKgM3).toMatchObject({ status: "used" });
  });

  it("marks material identity fields inactive when an exact source row owns the output", () => {
    const effectiveness = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult({ exact: true }),
      selectedOutputs: ["Rw"]
    });

    expect(effectiveness.category).toMatchObject({ status: "inactive" });
    expect(effectiveness.behavior).toMatchObject({ status: "inactive" });
    expect(effectiveness.densityKgM3).toMatchObject({ status: "inactive" });
  });

  it("marks mechanical fields inactive unless the current basis reports using them", () => {
    const inactive = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });
    const used = buildMaterialRouteInputEffectiveness({
      layers: [{ materialId: panelMaterial.id }],
      material: panelMaterial,
      mode: "wall",
      result: makeAirborneResult({ referencesMechanical: true }),
      selectedOutputs: ["Rw"]
    });

    expect(inactive.youngModulusPa).toMatchObject({ status: "inactive" });
    expect(inactive.poissonRatio).toMatchObject({ status: "inactive" });
    expect(inactive.lossFactor).toMatchObject({ status: "inactive" });
    expect(used.youngModulusPa).toMatchObject({ status: "used" });
    expect(used.poissonRatio).toMatchObject({ status: "used" });
    expect(used.lossFactor).toMatchObject({ status: "used" });
  });
});
