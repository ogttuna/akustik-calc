import {
  AirborneResultBasisSchema,
  type AcousticInputFieldId,
  type AirbornePropertyDefault,
  type AirborneResultBasis,
  type AirborneContext,
  type DynamicAirborneFamily,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import {
  buildGateQDoubleLeafFramedBridgeInputContract,
  resolveGateQDoubleLeafFramedBridgeCavityDepthMm,
  type GateQDoubleLeafFrameBridgeClass,
  type GateQDoubleLeafFramedBridgeInputContract
} from "./dynamic-calculator-double-leaf-framed-bridge-input-contract";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

export type GateRDoubleLeafFramedBridgeScenarioId =
  | "gate_r_direct_fixed_bridge_negative_boundary"
  | "gate_r_independent_absorbed_cavity_solver_candidate_ready"
  | "gate_r_multicavity_flat_list_rejected_family_boundary"
  | "gate_r_resilient_bridge_both_sides_solver_candidate_ready"
  | "gate_r_resilient_bridge_missing_side_count_needs_input";

export type GateRDoubleLeafFramedBridgeReadinessStatus =
  | "family_boundary_rejected"
  | "needs_input"
  | "negative_boundary"
  | "solver_candidate_ready";

export type GateRDoubleLeafFramedBridgeEquationOwnerId =
  | "bridge_coupling_owner"
  | "iso_717_1_rw_rating_adapter_owner"
  | "mass_air_mass_resonance_owner"
  | "porous_cavity_damping_owner"
  | "stc_rating_adapter_boundary_owner"
  | "surface_mass_partition_owner";

export type GateRDoubleLeafFramedBridgeEquationOwner = {
  formula: string;
  id: GateRDoubleLeafFramedBridgeEquationOwnerId;
  ownerStatus: "contracted_no_runtime";
  requiredInputs: readonly string[];
  runtimePromotionRequired: boolean;
};

export type GateRDoubleLeafFramedBridgePhysicalInputs = {
  absorberCoverageRatio: number | null;
  absorberThicknessMm: number | null;
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  cavityDepthMm: number | null;
  flowResistivityPaSM2: number | null;
  flowResistivitySource: "engineering_default" | "none" | "source_owned" | "unknown" | "user_supplied";
  leafMassRatio: number | null;
  sideALeafMassKgM2: number | null;
  sideBLeafMassKgM2: number | null;
  supportSpacingMm: number | null;
};

export type GateRDoubleLeafFramedBridgeBenchmarkRange = {
  bridgeCouplingDeltaDb: number;
  dampingCreditDb: number;
  estimatedRwDb: {
    center: number;
    max: number;
    min: number;
  };
  estimatedStcDb: {
    adapterBoundary: "not_alias";
    max: number;
    min: number;
  };
  massAirMassResonanceHz: number;
  toleranceDb: number;
};

export type GateRDoubleLeafFramedBridgeSolverContract = {
  benchmarkRange: GateRDoubleLeafFramedBridgeBenchmarkRange | null;
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  candidateBasis: AirborneResultBasis | null;
  candidateFamily: DynamicAirborneFamily | null;
  equationOwners: readonly GateRDoubleLeafFramedBridgeEquationOwner[];
  inputContract: GateQDoubleLeafFramedBridgeInputContract;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  negativeBoundaryReasons: readonly string[];
  physicalInputs: GateRDoubleLeafFramedBridgePhysicalInputs;
  readinessStatus: GateRDoubleLeafFramedBridgeReadinessStatus;
  requiredRuntimeParityBeforePromotion: readonly string[];
  runtimePromotionAllowed: false;
  runtimeValueMovement: false;
  scenarioIds: readonly GateRDoubleLeafFramedBridgeScenarioId[];
  selectedNextAction: "gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts";
  sourceRowsRequiredForSolverCandidate: false;
  solverMethodId: "gate_r_double_leaf_framed_bridge_mass_air_mass_bridge_damping_candidate";
  tolerancePosture: "uncalibrated_prediction_error_budget";
};

export type GateRDoubleLeafFramedBridgeScenarioPackEntry = {
  contract: GateRDoubleLeafFramedBridgeSolverContract;
  description: string;
  expectedStatus: GateRDoubleLeafFramedBridgeReadinessStatus;
  id: GateRDoubleLeafFramedBridgeScenarioId;
  includedInRuntimePromotion: false;
};

const WALL_AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const AIR_DENSITY_KG_M3 = 1.2;
const SOUND_SPEED_M_S = 343;
const NOMINAL_POROUS_FLOW_RESISTIVITY_PA_SM2 = 15_000;
const DOUBLE_LEAF_BANDS_HZ = [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150] as const;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round0(value: number): number {
  return Math.round(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function materialFor(
  layer: LayerInput | ResolvedLayer,
  catalog: readonly MaterialDefinition[]
): MaterialDefinition | null {
  if ("material" in layer && layer.material.id === layer.materialId) {
    return layer.material;
  }

  try {
    return resolveMaterial(layer.materialId, catalog);
  } catch {
    return null;
  }
}

function surfaceMassForLayer(layer: LayerInput | ResolvedLayer, catalog: readonly MaterialDefinition[]): number {
  const material = materialFor(layer, catalog);
  if (!material || material.category === "gap" || material.category === "insulation") {
    return 0;
  }

  if ("surfaceMassKgM2" in layer && Number.isFinite(layer.surfaceMassKgM2)) {
    return layer.surfaceMassKgM2;
  }

  return (Math.max(material.densityKgM3, 0) * Math.max(layer.thicknessMm, 0)) / 1000;
}

function sumSurfaceMass(
  layers: readonly LayerInput[],
  indices: readonly number[] | undefined,
  catalog: readonly MaterialDefinition[]
): number | null {
  if (!indices?.length) {
    return null;
  }

  const total = indices.reduce((sum, index) => sum + surfaceMassForLayer(layers[index] ?? {
    materialId: "__missing__",
    thicknessMm: 0
  }, catalog), 0);

  return total > 0 ? round1(total) : null;
}

function flowResistivitySource(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[],
  airborneContext?: AirborneContext
): GateRDoubleLeafFramedBridgePhysicalInputs["flowResistivitySource"] {
  for (const layer of layers) {
    const material = materialFor(layer, catalog);
    if (material?.acoustic?.behavior !== "porous_absorber") {
      continue;
    }

    if (material.acoustic.propertySourceStatus === "source_owned") {
      return "source_owned";
    }

    if (material.acoustic.propertySourceStatus === "user_supplied") {
      return "user_supplied";
    }

    if (
      material.acoustic.propertySourceStatus === "engineering_default" &&
      typeof material.acoustic.flowResistivityPaSM2 === "number"
    ) {
      return "engineering_default";
    }

    return "unknown";
  }

  const topology = airborneContext?.wallTopology;
  const primaryCavity = airborneContext?.advancedWall?.cavities?.[0];
  if (
    topology?.cavity1AbsorptionClass === "porous_absorptive" &&
    (topology.cavity1FillCoverage === "full" || topology.cavity1FillCoverage === "partial") &&
    typeof primaryCavity?.absorberFlowResistivityPaSM2 === "number" &&
    Number.isFinite(primaryCavity.absorberFlowResistivityPaSM2) &&
    primaryCavity.absorberFlowResistivityPaSM2 > 0
  ) {
    return "user_supplied";
  }

  return "none";
}

function flowResistivityPaSM2(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[],
  airborneContext?: AirborneContext
): number | null {
  for (const layer of layers) {
    const material = materialFor(layer, catalog);
    if (material?.acoustic?.behavior !== "porous_absorber") {
      continue;
    }

    const value = material.acoustic.flowResistivityPaSM2;
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
  }

  const primaryCavity = airborneContext?.advancedWall?.cavities?.[0];
  const value = primaryCavity?.absorberFlowResistivityPaSM2;
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function absorberCoverageRatio(airborneContext?: AirborneContext): number | null {
  const value = airborneContext?.advancedWall?.cavities?.[0]?.absorberCoverageRatio;

  return typeof value === "number" && Number.isFinite(value) ? clamp(value, 0, 1) : null;
}

function absorberThicknessMm(airborneContext?: AirborneContext): number | null {
  const primaryCavity = airborneContext?.advancedWall?.cavities?.[0];
  const value = primaryCavity?.absorberThicknessMm;
  const advancedCavityDepth = primaryCavity?.depthMm;
  const topologyCavityDepth = airborneContext?.wallTopology?.cavity1DepthMm;

  if (
    typeof advancedCavityDepth === "number" &&
    Number.isFinite(advancedCavityDepth) &&
    typeof topologyCavityDepth === "number" &&
    Number.isFinite(topologyCavityDepth) &&
    Math.abs(advancedCavityDepth - topologyCavityDepth) > 0.1
  ) {
    return null;
  }

  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function buildPhysicalInputs(input: {
  airborneContext?: AirborneContext;
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  catalog: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
}): GateRDoubleLeafFramedBridgePhysicalInputs {
  const topology = input.airborneContext?.wallTopology;
  const cavityDepthMm = resolveGateQDoubleLeafFramedBridgeCavityDepthMm(input.airborneContext);
  const sideAMass = sumSurfaceMass(input.layers, topology?.sideALeafLayerIndices, input.catalog);
  const sideBMass = sumSurfaceMass(input.layers, topology?.sideBLeafLayerIndices, input.catalog);
  const leafMassRatio =
    sideAMass && sideBMass ? round1(Math.max(sideAMass, sideBMass) / Math.min(sideAMass, sideBMass)) : null;

  return {
    absorberCoverageRatio: absorberCoverageRatio(input.airborneContext),
    absorberThicknessMm: absorberThicknessMm(input.airborneContext),
    bridgeClass: input.bridgeClass,
    cavityDepthMm,
    flowResistivityPaSM2: flowResistivityPaSM2(input.layers, input.catalog, input.airborneContext),
    flowResistivitySource: flowResistivitySource(input.layers, input.catalog, input.airborneContext),
    leafMassRatio,
    sideALeafMassKgM2: sideAMass,
    sideBLeafMassKgM2: sideBMass,
    supportSpacingMm:
      typeof input.airborneContext?.studSpacingMm === "number" ? input.airborneContext.studSpacingMm : null
  };
}

export function calculateGateRMassAirMassResonanceHz(input: {
  cavityDepthMm: number;
  sideALeafMassKgM2: number;
  sideBLeafMassKgM2: number;
}): number {
  const cavityDepthM = input.cavityDepthMm / 1000;
  const stiffnessTerm =
    (AIR_DENSITY_KG_M3 * SOUND_SPEED_M_S * SOUND_SPEED_M_S / cavityDepthM) *
    (1 / input.sideALeafMassKgM2 + 1 / input.sideBLeafMassKgM2);

  return round1(Math.sqrt(stiffnessTerm) / (2 * Math.PI));
}

function supportSpacingBridgeCorrectionDb(input: {
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  resilientSideCount: AirborneContext["resilientBarSideCount"] | undefined;
  supportSpacingMm: number | null;
}): number {
  if (
    input.bridgeClass === "direct_fixed_bridge" ||
    input.bridgeClass === "unknown" ||
    !(typeof input.supportSpacingMm === "number" && Number.isFinite(input.supportSpacingMm) && input.supportSpacingMm > 0)
  ) {
    return 0;
  }

  const spacingOctaves = Math.log2(clamp(input.supportSpacingMm, 300, 1200) / 600);
  const sensitivity =
    input.bridgeClass === "resilient_bridge"
      ? input.resilientSideCount === "both_sides" ? 1.7 : 1.4
      : input.bridgeClass === "independent_frame"
        ? 1.7
        : input.bridgeClass === "twin_frame_bridge"
          ? 1.2
          : 0.9;

  return round1(clamp(spacingOctaves * sensitivity, -1.2, 1.5));
}

function bridgeCouplingDeltaDb(
  bridgeClass: GateQDoubleLeafFrameBridgeClass,
  resilientSideCount: AirborneContext["resilientBarSideCount"] | undefined,
  supportSpacingMm: number | null
): number {
  const supportSpacingCorrection = supportSpacingBridgeCorrectionDb({
    bridgeClass,
    resilientSideCount,
    supportSpacingMm
  });

  switch (bridgeClass) {
    case "independent_frame":
      return round1(4 + supportSpacingCorrection);
    case "twin_frame_bridge":
      return round1(3 + supportSpacingCorrection);
    case "resilient_bridge":
      return round1((resilientSideCount === "both_sides" ? 5.5 : 4.5) + supportSpacingCorrection);
    case "shared_stud_bridge":
      return round1(1 + supportSpacingCorrection);
    case "direct_fixed_bridge":
      return -5;
    case "unknown":
      return 0;
  }
}

function porousDampingCreditDb(input: {
  absorberCoverageRatio: number | null;
  absorberThicknessMm: number | null;
  airborneContext?: AirborneContext;
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  cavityDepthMm: number | null;
  flowResistivityPaSM2: number | null;
  flowResistivitySource: GateRDoubleLeafFramedBridgePhysicalInputs["flowResistivitySource"];
}): number {
  const coverage = input.airborneContext?.wallTopology?.cavity1FillCoverage;
  const absorption = input.airborneContext?.wallTopology?.cavity1AbsorptionClass;
  if (coverage === "empty" || absorption === "none" || input.flowResistivitySource === "none") {
    return 0;
  }

  const nominalSourceCredit = (baseCreditDb: number): number => {
    if (!(input.flowResistivityPaSM2 && Number.isFinite(input.flowResistivityPaSM2))) {
      return baseCreditDb;
    }

    const logDistanceFromNominal = Math.abs(
      Math.log10(input.flowResistivityPaSM2 / NOMINAL_POROUS_FLOW_RESISTIVITY_PA_SM2)
    );
    const multiplier = clamp(1 - (logDistanceFromNominal * 0.65), 0.45, 1);

    return round1(baseCreditDb * multiplier);
  };
  const fullBaseCredit = input.flowResistivitySource === "engineering_default" ? 3 : 3.5;
  const partialBaseCredit = input.flowResistivitySource === "engineering_default" ? 1.5 : 2;
  const thicknessMultiplier =
    input.bridgeClass !== "direct_fixed_bridge" &&
    (input.absorberCoverageRatio === null || input.absorberCoverageRatio >= 1) &&
    input.absorberThicknessMm !== null &&
    input.cavityDepthMm !== null &&
    Number.isFinite(input.cavityDepthMm) &&
    input.cavityDepthMm > 0
      ? clamp(input.absorberThicknessMm / input.cavityDepthMm, 0, 1)
      : 1;
  const numericCoverageBaseCredit = (): number | null => {
    if (input.bridgeClass === "direct_fixed_bridge" || input.absorberCoverageRatio === null) {
      return null;
    }

    return fullBaseCredit * input.absorberCoverageRatio;
  };
  const numericCoverageCredit = numericCoverageBaseCredit();

  if (coverage === "full") {
    return nominalSourceCredit((numericCoverageCredit ?? fullBaseCredit) * thicknessMultiplier);
  }

  if (coverage === "partial" || coverage === "unknown") {
    return nominalSourceCredit((numericCoverageCredit ?? partialBaseCredit) * thicknessMultiplier);
  }

  return 0;
}

function resonancePenaltyDb(resonanceHz: number): number {
  if (resonanceHz < 63) {
    return 0.7;
  }

  if (resonanceHz <= 200) {
    return clamp(2.6 - Math.abs(resonanceHz - 100) * 0.01, 0.9, 2.6);
  }

  return 2.8;
}

function errorBudgetDb(input: {
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  flowResistivitySource: GateRDoubleLeafFramedBridgePhysicalInputs["flowResistivitySource"];
  leafMassRatio: number | null;
}): number {
  let budget = 6;

  if (input.flowResistivitySource === "engineering_default" || input.flowResistivitySource === "unknown") {
    budget += 1;
  }

  if (input.bridgeClass === "shared_stud_bridge") {
    budget += 2;
  }

  if (input.bridgeClass === "resilient_bridge") {
    budget += 1;
  }

  if ((input.leafMassRatio ?? 1) > 2.5) {
    budget += 1;
  }

  return budget;
}

function candidateFamilyForBridge(
  bridgeClass: GateQDoubleLeafFrameBridgeClass
): DynamicAirborneFamily | null {
  switch (bridgeClass) {
    case "independent_frame":
    case "twin_frame_bridge":
      return "double_stud_system";
    case "resilient_bridge":
    case "shared_stud_bridge":
      return "stud_wall_system";
    case "direct_fixed_bridge":
    case "unknown":
      return null;
  }
}

function buildPropertyDefaults(
  physicalInputs: GateRDoubleLeafFramedBridgePhysicalInputs
): AirbornePropertyDefault[] {
  if (physicalInputs.flowResistivitySource !== "engineering_default") {
    return [];
  }

  return [
    {
      field: "porousFill.flowResistivityPaSM2",
      reason:
        "Porous cavity damping is computed with an engineering-default flow resistivity until a product-specific value is entered.",
      source: "engineering_default",
      unit: "Pa*s/m2",
      value: "nominal_flow_resistivity"
    }
  ];
}

function buildBenchmarkRange(input: {
  airborneContext?: AirborneContext;
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  physicalInputs: GateRDoubleLeafFramedBridgePhysicalInputs;
}): GateRDoubleLeafFramedBridgeBenchmarkRange | null {
  const sideAMass = input.physicalInputs.sideALeafMassKgM2;
  const sideBMass = input.physicalInputs.sideBLeafMassKgM2;
  const cavityDepthMm = input.physicalInputs.cavityDepthMm;

  if (!(sideAMass && sideBMass && cavityDepthMm)) {
    return null;
  }

  const massAirMassResonanceHz = calculateGateRMassAirMassResonanceHz({
    cavityDepthMm,
    sideALeafMassKgM2: sideAMass,
    sideBLeafMassKgM2: sideBMass
  });
  const totalLeafMass = sideAMass + sideBMass;
  const bridgeDelta = bridgeCouplingDeltaDb(
    input.bridgeClass,
    input.airborneContext?.resilientBarSideCount,
    input.physicalInputs.supportSpacingMm
  );
  const dampingCredit = porousDampingCreditDb({
    absorberCoverageRatio: input.physicalInputs.absorberCoverageRatio,
    absorberThicknessMm: input.physicalInputs.absorberThicknessMm,
    airborneContext: input.airborneContext,
    bridgeClass: input.bridgeClass,
    cavityDepthMm,
    flowResistivityPaSM2: input.physicalInputs.flowResistivityPaSM2,
    flowResistivitySource: input.physicalInputs.flowResistivitySource
  });
  const cavityDepthCredit = clamp((cavityDepthMm - 40) * 0.045, 0, 4.5);
  const center = round0(
    20 * Math.log10(totalLeafMass) +
      12 +
      bridgeDelta +
      cavityDepthCredit +
      dampingCredit -
      resonancePenaltyDb(massAirMassResonanceHz)
  );
  const tolerance = errorBudgetDb({
    bridgeClass: input.bridgeClass,
    flowResistivitySource: input.physicalInputs.flowResistivitySource,
    leafMassRatio: input.physicalInputs.leafMassRatio
  });

  return {
    bridgeCouplingDeltaDb: bridgeDelta,
    dampingCreditDb: dampingCredit,
    estimatedRwDb: {
      center,
      max: center + tolerance,
      min: center - tolerance
    },
    estimatedStcDb: {
      adapterBoundary: "not_alias",
      max: center + tolerance + 1,
      min: center - tolerance - 1
    },
    massAirMassResonanceHz,
    toleranceDb: tolerance
  };
}

function buildEquationOwners(): readonly GateRDoubleLeafFramedBridgeEquationOwner[] {
  return [
    {
      formula: "m_leaf = sum(density_kg_m3 * thickness_mm / 1000) over explicit side leaf group",
      id: "surface_mass_partition_owner",
      ownerStatus: "contracted_no_runtime",
      requiredInputs: ["sideALeafGroup", "sideBLeafGroup", "densityKgM3", "thicknessMm"],
      runtimePromotionRequired: true
    },
    {
      formula:
        "f0_hz = sqrt((rho0 * c^2 / cavity_depth_m) * (1 / m1 + 1 / m2)) / (2 * pi)",
      id: "mass_air_mass_resonance_owner",
      ownerStatus: "contracted_no_runtime",
      requiredInputs: ["sideALeafMassKgM2", "sideBLeafMassKgM2", "cavity1DepthMm"],
      runtimePromotionRequired: true
    },
    {
      formula: "bridge_delta_db = f(frameBridgeClass, supportTopology, supportSpacingMm, resilientBarSideCount)",
      id: "bridge_coupling_owner",
      ownerStatus: "contracted_no_runtime",
      requiredInputs: ["frameBridgeClass", "supportTopology", "supportSpacingMm"],
      runtimePromotionRequired: true
    },
    {
      formula:
        "damping_credit_db = f(cavityFillCoverage, absorptionClass, flowResistivityPaSM2, absorberCoverageRatio when supplied, absorberThicknessMm when supplied)",
      id: "porous_cavity_damping_owner",
      ownerStatus: "contracted_no_runtime",
      requiredInputs: [
        "cavity1FillCoverage",
        "cavity1AbsorptionClass",
        "flowResistivityPaSM2",
        "absorberCoverageRatio",
        "absorberThicknessMm"
      ],
      runtimePromotionRequired: true
    },
    {
      formula: "Rw = ISO 717-1 rating applied to the calculated frequency curve, not a source row",
      id: "iso_717_1_rw_rating_adapter_owner",
      ownerStatus: "contracted_no_runtime",
      requiredInputs: ["calculatedFrequencyCurve", "ISO717-1 rating adapter"],
      runtimePromotionRequired: true
    },
    {
      formula: "STC = ASTM E413 adapter boundary over the calculated curve; STC is not aliased to Rw",
      id: "stc_rating_adapter_boundary_owner",
      ownerStatus: "contracted_no_runtime",
      requiredInputs: ["calculatedFrequencyCurve", "ASTM E413 rating adapter"],
      runtimePromotionRequired: true
    }
  ];
}

function buildCandidateBasis(input: {
  benchmarkRange: GateRDoubleLeafFramedBridgeBenchmarkRange;
  candidateFamily: DynamicAirborneFamily;
  physicalInputs: GateRDoubleLeafFramedBridgePhysicalInputs;
  sourceEvidenceAvailable?: boolean;
}): AirborneResultBasis {
  const advancedWallPrecisionInputs =
    input.physicalInputs.absorberCoverageRatio === null ? [] : ["absorberCoverageRatio"];
  const advancedWallThicknessInput =
    input.physicalInputs.absorberThicknessMm === null ? [] : ["absorberThicknessMm"];

  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Gate R defines the double-leaf/framed solver candidate only; runtime candidate selection stays unchanged.",
      "Exact full-stack or calibrated source rows may override later only through the Gate H source-promotion policy.",
      "Rw and STC are separate rating-adapter outputs over a calculated curve, not informal aliases."
    ],
    calculationStandard: "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: input.benchmarkRange.toleranceDb,
    family: input.candidateFamily,
    frequencyBands: {
      bandSet: "gate_r_double_leaf_framed_bridge_solver_contract",
      frequenciesHz: [...DOUBLE_LEAF_BANDS_HZ]
    },
    kind: "airborne_physics_prediction",
    method: "gate_r_double_leaf_framed_bridge_mass_air_mass_bridge_damping_candidate",
    missingPhysicalInputs: [],
    missingSourceEvidence: input.sourceEvidenceAvailable === true ? [] : ["exact_full_stack_source_absent"],
    origin: "family_physics_prediction",
    propertyDefaults: buildPropertyDefaults(input.physicalInputs),
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "sideALeafGroup",
      "sideBLeafGroup",
      "cavity1DepthMm",
      "flowResistivityPaSM2",
      ...advancedWallPrecisionInputs,
      ...advancedWallThicknessInput,
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm",
      "massAirMassResonanceOwner",
      "bridgeCouplingOwner",
      "porousCavityDampingOwner",
      "ISO717-1 Rw adapter",
      "ASTM E413 STC adapter boundary"
    ],
    toleranceClass: "uncalibrated_prediction"
  });
}

export function buildGateRDoubleLeafFramedBridgeSolverContract(input: {
  airborneContext?: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourceEvidenceAvailable?: boolean;
  targetOutputs?: readonly RequestedOutputId[];
}): GateRDoubleLeafFramedBridgeSolverContract {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const targetOutputs = input.targetOutputs ?? WALL_AIRBORNE_OUTPUTS;
  const inputContract = buildGateQDoubleLeafFramedBridgeInputContract({
    airborneContext: input.airborneContext,
    catalog,
    layers: input.layers,
    sourceEvidenceAvailable: input.sourceEvidenceAvailable,
    targetOutputs
  });
  const physicalInputs = buildPhysicalInputs({
    airborneContext: input.airborneContext,
    bridgeClass: inputContract.bridgeClass,
    catalog,
    layers: input.layers
  });
  const equationOwners = buildEquationOwners();
  const isExplicitDoubleLeafFramed =
    input.airborneContext?.wallTopology?.topologyMode === "double_leaf_framed";
  const negativeBoundaryReasons: string[] = [];

  if (!isExplicitDoubleLeafFramed) {
    negativeBoundaryReasons.push(
      "gate_r_rejects_non_explicit_double_leaf_framed_topology_before_solver_candidate"
    );
  }

  if (inputContract.bridgeClass === "direct_fixed_bridge") {
    negativeBoundaryReasons.push(
      "direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned"
    );
  }

  const candidateFamily = candidateFamilyForBridge(inputContract.bridgeClass);
  const benchmarkRange =
    isExplicitDoubleLeafFramed && inputContract.missingPhysicalInputs.length === 0
      ? buildBenchmarkRange({
          airborneContext: input.airborneContext,
          bridgeClass: inputContract.bridgeClass,
          physicalInputs
        })
      : null;
  const readinessStatus: GateRDoubleLeafFramedBridgeReadinessStatus = !isExplicitDoubleLeafFramed
    ? "family_boundary_rejected"
    : inputContract.missingPhysicalInputs.length > 0
      ? "needs_input"
      : negativeBoundaryReasons.length > 0 || !candidateFamily || !benchmarkRange
        ? "negative_boundary"
        : "solver_candidate_ready";
  const candidateBasis =
    readinessStatus === "solver_candidate_ready" && candidateFamily && benchmarkRange
      ? buildCandidateBasis({
          benchmarkRange,
          candidateFamily,
          physicalInputs,
          sourceEvidenceAvailable: input.sourceEvidenceAvailable
        })
      : null;

  return {
    benchmarkRange,
    bridgeClass: inputContract.bridgeClass,
    candidateBasis,
    candidateFamily: readinessStatus === "solver_candidate_ready" ? candidateFamily : null,
    equationOwners,
    inputContract,
    missingPhysicalInputs: inputContract.missingPhysicalInputs,
    negativeBoundaryReasons,
    physicalInputs,
    readinessStatus,
    requiredRuntimeParityBeforePromotion: [
      "route card selected candidate and value parity",
      "visible output card origin/basis/tolerance parity",
      "proposal PDF snapshot origin/basis/tolerance parity",
      "proposal DOCX snapshot origin/basis/tolerance parity",
      "nearby negative boundaries for direct-fixed, missing side count, and multi-cavity flat-list cases"
    ],
    runtimePromotionAllowed: false,
    runtimeValueMovement: false,
    scenarioIds: [
      "gate_r_independent_absorbed_cavity_solver_candidate_ready",
      "gate_r_resilient_bridge_both_sides_solver_candidate_ready",
      "gate_r_resilient_bridge_missing_side_count_needs_input",
      "gate_r_direct_fixed_bridge_negative_boundary",
      "gate_r_multicavity_flat_list_rejected_family_boundary"
    ],
    selectedNextAction: "gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts",
    sourceRowsRequiredForSolverCandidate: false,
    solverMethodId: "gate_r_double_leaf_framed_bridge_mass_air_mass_bridge_damping_candidate",
    tolerancePosture: "uncalibrated_prediction_error_budget"
  };
}

export function buildGateRDoubleLeafFramedBridgeScenarioPack(): readonly GateRDoubleLeafFramedBridgeScenarioPackEntry[] {
  const independentAbsorbedLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 90 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const independentAbsorbedContext: AirborneContext = {
    airtightness: "good",
    contextMode: "element_lab",
    sharedTrack: "independent",
    studSpacingMm: 600,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 90,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "independent_frames",
      topologyMode: "double_leaf_framed"
    }
  };
  const resilientReadyContext: AirborneContext = {
    connectionType: "resilient_channel",
    contextMode: "element_lab",
    resilientBarSideCount: "both_sides",
    studSpacingMm: 600,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 75,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "resilient_channel",
      topologyMode: "double_leaf_framed"
    }
  };
  const resilientMissingSideContext: AirborneContext = {
    connectionType: "resilient_channel",
    contextMode: "element_lab",
    studSpacingMm: 600,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 75,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "resilient_channel",
      topologyMode: "double_leaf_framed"
    }
  };
  const directFixedContext: AirborneContext = {
    connectionType: "direct_fix",
    contextMode: "element_lab",
    studSpacingMm: 400,
    wallTopology: {
      cavity1AbsorptionClass: "none",
      cavity1DepthMm: 45,
      cavity1FillCoverage: "empty",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "direct_fixed",
      topologyMode: "double_leaf_framed"
    }
  };
  const directFixedLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 45 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const multicavityFlatListLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const entries: readonly {
    context: AirborneContext;
    description: string;
    expectedStatus: GateRDoubleLeafFramedBridgeReadinessStatus;
    id: GateRDoubleLeafFramedBridgeScenarioId;
    layers: readonly LayerInput[];
  }[] = [
    {
      context: independentAbsorbedContext,
      description:
        "Explicit independent absorbed double-leaf cavity has complete solver-candidate equations with source-absent tolerance.",
      expectedStatus: "solver_candidate_ready",
      id: "gate_r_independent_absorbed_cavity_solver_candidate_ready",
      layers: independentAbsorbedLayers
    },
    {
      context: resilientReadyContext,
      description:
        "Resilient bridge with both-side side count is a solver candidate but remains no-runtime until Gate S parity pins land.",
      expectedStatus: "solver_candidate_ready",
      id: "gate_r_resilient_bridge_both_sides_solver_candidate_ready",
      layers: independentAbsorbedLayers
    },
    {
      context: resilientMissingSideContext,
      description:
        "Resilient bridge without side count propagates the Gate Q missing-input posture instead of guessing the bridge delta.",
      expectedStatus: "needs_input",
      id: "gate_r_resilient_bridge_missing_side_count_needs_input",
      layers: independentAbsorbedLayers
    },
    {
      context: directFixedContext,
      description:
        "Direct-fixed complete input is a negative boundary because it is mechanically coupled, not safe for this bridge solver.",
      expectedStatus: "negative_boundary",
      id: "gate_r_direct_fixed_bridge_negative_boundary",
      layers: directFixedLayers
    },
    {
      context: { contextMode: "element_lab" },
      description:
        "A multi-cavity flat list without explicit double-leaf/framed topology is rejected at the family boundary.",
      expectedStatus: "family_boundary_rejected",
      id: "gate_r_multicavity_flat_list_rejected_family_boundary",
      layers: multicavityFlatListLayers
    }
  ];

  return entries.map((entry) => ({
    contract: buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: entry.context,
      layers: entry.layers,
      targetOutputs: WALL_AIRBORNE_OUTPUTS
    }),
    description: entry.description,
    expectedStatus: entry.expectedStatus,
    id: entry.id,
    includedInRuntimePromotion: false
  }));
}
