import type { AssemblyCalculation, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import type { WorkbenchV2StudyMode } from "./workbench-v2-project-snapshot";

export type MaterialRouteInputFieldId =
  | "absorberClass"
  | "behavior"
  | "category"
  | "densityKgM3"
  | "dynamicStiffnessMNm3"
  | "flowResistivityPaSM2"
  | "lossFactor"
  | "notes"
  | "poissonRatio"
  | "porosity"
  | "propertySourceStatus"
  | "tags"
  | "youngModulusPa";
export type MaterialRouteInputEffectivenessStatus = "inactive" | "needed" | "used";
export type MaterialRouteInputEffectiveness = {
  status: MaterialRouteInputEffectivenessStatus;
  title: string;
};
export type MaterialRouteInputEffectivenessMap = Partial<
  Record<MaterialRouteInputFieldId, MaterialRouteInputEffectiveness>
>;

type MaterialRouteInputLayer = {
  materialId: string;
};

const AIRBORNE_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "Rw",
  "STC"
]);

const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "ISR",
  "LIIC",
  "LIR",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A",
  "NISR"
]);

function normalizeRouteFieldId(value: string): string {
  return value.replace(/[^a-z0-9]/giu, "").toLowerCase();
}

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function selectedOutputsInclude(
  selectedOutputs: readonly RequestedOutputId[],
  outputSet: ReadonlySet<RequestedOutputId>
): boolean {
  return selectedOutputs.some((outputId) => outputSet.has(outputId));
}

function readOutputValue(result: AssemblyCalculation, outputId: RequestedOutputId): number | null {
  switch (outputId) {
    case "AIIC":
      return result.impact?.AIIC ?? null;
    case "C":
      return result.metrics?.estimatedCDb ?? result.ratings?.iso717?.C ?? null;
    case "CI":
      return result.impact?.CI ?? null;
    case "CI,50-2500":
      return result.impact?.CI50_2500 ?? null;
    case "Ctr":
      return result.metrics?.estimatedCtrDb ?? result.ratings?.iso717?.Ctr ?? null;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? null;
    case "Dn,A":
      return result.ratings?.field?.DnA ?? result.metrics?.estimatedDnADb ?? null;
    case "Dn,w":
      return result.ratings?.field?.DnW ?? result.metrics?.estimatedDnWDb ?? null;
    case "DnT,A":
      return result.ratings?.field?.DnTA ?? result.metrics?.estimatedDnTADb ?? null;
    case "DnT,A,k":
      return result.ratings?.field?.DnTAk ?? result.metrics?.estimatedDnTAkDb ?? null;
    case "DnT,w":
      return result.ratings?.field?.DnTw ?? result.metrics?.estimatedDnTwDb ?? null;
    case "IIC":
      return result.impact?.IIC ?? null;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? null;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? null;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? null;
    case "Ln,w":
      return result.impact?.LnW ?? null;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI ?? null;
    case "LnT,A":
      return result.impact?.LnTA ?? null;
    case "Rw":
      return result.metrics?.estimatedRwDb ?? result.ratings?.iso717?.Rw ?? null;
    case "R'w":
      return result.ratings?.field?.RwPrime ?? result.metrics?.estimatedRwPrimeDb ?? null;
    case "STC":
      return result.metrics?.estimatedStc ?? result.ratings?.astmE413?.STC ?? null;
    case "OITC":
    case "HIIC":
    case "ISR":
    case "LIIC":
    case "LIR":
    case "NISR":
      return null;
    default:
      return null;
  }
}

function hasLiveSelectedOutput(
  result: AssemblyCalculation | null,
  selectedOutputs: readonly RequestedOutputId[],
  outputSet: ReadonlySet<RequestedOutputId>
): boolean {
  if (!result) {
    return false;
  }

  return selectedOutputs.some((outputId) => {
    if (!outputSet.has(outputId) || !result.supportedTargetOutputs.includes(outputId)) {
      return false;
    }

    const value = readOutputValue(result, outputId);
    return typeof value === "number" && Number.isFinite(value);
  });
}

function collectMissingPhysicalInputs(result: AssemblyCalculation | null): readonly string[] {
  const missing = new Set<string>();

  if (result?.airborneBasis?.origin === "needs_input") {
    for (const fieldId of result.airborneBasis.missingPhysicalInputs) {
      missing.add(fieldId);
    }
  }

  if (result?.acousticAnswerBoundary?.origin === "needs_input") {
    for (const fieldId of result.acousticAnswerBoundary.missingPhysicalInputs) {
      missing.add(fieldId);
    }
  }

  return Array.from(missing);
}

function missingInputsReference(result: AssemblyCalculation | null, fieldTokens: readonly string[]): boolean {
  return collectMissingPhysicalInputs(result).some((fieldId) => {
    const normalized = normalizeRouteFieldId(fieldId);
    return fieldTokens.some((token) => normalized.includes(token));
  });
}

function airborneBasisReferencesFlowResistivity(result: AssemblyCalculation | null): boolean {
  const basis = result?.airborneBasis;

  if (!basis || basis.origin === "measured_exact_full_stack") {
    return false;
  }

  const fields = [
    basis.family ?? "",
    basis.method,
    ...basis.assumptions,
    ...basis.requiredInputs,
    ...basis.propertyDefaults.map((propertyDefault: { field: string }) => propertyDefault.field)
  ];
  const normalized = normalizeRouteFieldId(fields.join(" "));
  return (
    normalized.includes("flowresistivity") ||
    normalized.includes("porouscavitydamping") ||
    normalized.includes("porousabsorber")
  );
}

function routeBasisReferencesTokens(result: AssemblyCalculation | null, fieldTokens: readonly string[]): boolean {
  const fields: string[] = [];
  const airborneBasis = result?.airborneBasis;

  if (airborneBasis && airborneBasis.origin !== "measured_exact_full_stack") {
    fields.push(
      airborneBasis.family ?? "",
      airborneBasis.method,
      ...airborneBasis.assumptions,
      ...airborneBasis.requiredInputs,
      ...airborneBasis.propertyDefaults.map((propertyDefault: { field: string }) => propertyDefault.field)
    );
  }

  const impact = result?.impact;
  if (impact && !isExactImpactRoute(result)) {
    fields.push(
      impact.basis ?? "",
      impact.scope ?? "",
      ...(Array.isArray(impact.notes) ? impact.notes : [])
    );
  }

  const normalized = normalizeRouteFieldId(fields.join(" "));
  return fieldTokens.some((token) => normalized.includes(token));
}

function isMeasuredExactAirborneRoute(result: AssemblyCalculation | null): boolean {
  return result?.airborneBasis?.origin === "measured_exact_full_stack" || result?.airborneBasis?.kind === "airborne_measured_exact";
}

function isExactImpactRoute(result: AssemblyCalculation | null): boolean {
  const basis = result?.impact?.basis;
  return Boolean(basis?.startsWith("exact_") || basis?.includes("exact_source"));
}

function isPorousAbsorberMaterial(material: MaterialDefinition): boolean {
  return material.acoustic?.behavior === "porous_absorber" || material.acoustic?.absorberClass === "porous_absorptive";
}

function isResilientLayerMaterial(material: MaterialDefinition): boolean {
  return material.acoustic?.behavior === "resilient_layer" || hasPositiveNumber(material.impact?.dynamicStiffnessMNm3);
}

function materialIsInLayerStack(material: MaterialDefinition, layers: readonly MaterialRouteInputLayer[]): boolean {
  return layers.some((layer) => layer.materialId === material.id);
}

function setMaterialEffectiveness(
  target: MaterialRouteInputEffectivenessMap,
  fieldId: MaterialRouteInputFieldId,
  status: MaterialRouteInputEffectivenessStatus,
  title: string
): void {
  if (target[fieldId]) {
    return;
  }

  target[fieldId] = { status, title };
}

function impactResultUsesMaterialDynamicStiffness(result: AssemblyCalculation | null, material: MaterialDefinition): boolean {
  const materialDynamicStiffness = material.impact?.dynamicStiffnessMNm3;
  const resultDynamicStiffness = result?.impact?.resilientDynamicStiffnessMNm3;

  if (!hasPositiveNumber(materialDynamicStiffness) || !hasPositiveNumber(resultDynamicStiffness)) {
    return false;
  }

  return Math.abs(materialDynamicStiffness - resultDynamicStiffness) < 0.001;
}

function liveFormulaRouteAvailable(input: {
  result: AssemblyCalculation | null;
  selectedOutputs: readonly RequestedOutputId[];
}): boolean {
  const liveFormulaAirborneOutput =
    hasLiveSelectedOutput(input.result, input.selectedOutputs, AIRBORNE_OUTPUTS) && !isMeasuredExactAirborneRoute(input.result);
  const liveFormulaImpactOutput =
    hasLiveSelectedOutput(input.result, input.selectedOutputs, IMPACT_OUTPUTS) && !isExactImpactRoute(input.result);

  return liveFormulaAirborneOutput || liveFormulaImpactOutput;
}

function setNotInStackMaterialEffectiveness(
  target: MaterialRouteInputEffectivenessMap,
  fieldId: MaterialRouteInputFieldId
): void {
  setMaterialEffectiveness(
    target,
    fieldId,
    "inactive",
    "This material is not in the active layer stack, so changing it will not affect the current result"
  );
}

function setExactSourceMaterialEffectiveness(
  target: MaterialRouteInputEffectivenessMap,
  fieldId: MaterialRouteInputFieldId
): void {
  setMaterialEffectiveness(
    target,
    fieldId,
    "inactive",
    "Exact source owns the current output; this material field is not used by a formula route"
  );
}

function buildMechanicalMaterialFieldUsedTitle(fieldId: "lossFactor" | "poissonRatio" | "youngModulusPa"): string {
  switch (fieldId) {
    case "youngModulusPa":
      return "Used by the current formula route as the Young modulus input for panel bending stiffness";
    case "poissonRatio":
      return "Used by the current formula route as the Poisson ratio input";
    case "lossFactor":
      return "Used by the current formula route as the panel loss factor input";
  }
}

function buildMechanicalMaterialFieldNeededTitle(fieldId: "lossFactor" | "poissonRatio" | "youngModulusPa"): string {
  switch (fieldId) {
    case "youngModulusPa":
      return "Needed: this panel material is missing Young modulus, so the active formula route cannot calculate the current output";
    case "poissonRatio":
      return "Needed: this panel material is missing Poisson ratio, so the active formula route cannot calculate the current output";
    case "lossFactor":
      return "Needed: this panel material is missing loss factor, so the active formula route cannot calculate the current output";
  }
}

export function buildMaterialRouteInputEffectiveness(input: {
  layers: readonly MaterialRouteInputLayer[];
  material: MaterialDefinition | null;
  mode: WorkbenchV2StudyMode;
  result: AssemblyCalculation | null;
  selectedOutputs: readonly RequestedOutputId[];
}): MaterialRouteInputEffectivenessMap {
  const effectiveness: MaterialRouteInputEffectivenessMap = {};
  const material = input.material;

  if (!material) {
    return effectiveness;
  }

  const materialInStack = materialIsInLayerStack(material, input.layers);
  const hasAirborneSelection = selectedOutputsInclude(input.selectedOutputs, AIRBORNE_OUTPUTS);
  const hasImpactSelection = selectedOutputsInclude(input.selectedOutputs, IMPACT_OUTPUTS);
  const liveAirborneOutput = hasLiveSelectedOutput(input.result, input.selectedOutputs, AIRBORNE_OUTPUTS);
  const liveImpactOutput = hasLiveSelectedOutput(input.result, input.selectedOutputs, IMPACT_OUTPUTS);
  const liveFormulaOutput = liveFormulaRouteAvailable(input);
  const missingFlowResistivity = missingInputsReference(input.result, ["absorberflowresistivitypasm2", "flowresistivitypasm2"]);
  const missingDynamicStiffness = missingInputsReference(input.result, [
    "dynamicstiffnessmnm3",
    "resilientlayerdynamicstiffnessmnm3"
  ]);
  const exactSourceRoute =
    (hasAirborneSelection && isMeasuredExactAirborneRoute(input.result)) ||
    (hasImpactSelection && isExactImpactRoute(input.result));

  setMaterialEffectiveness(effectiveness, "propertySourceStatus", "inactive", "Source status is provenance metadata; it does not change the current dB calculation");
  setMaterialEffectiveness(effectiveness, "tags", "inactive", "Tags are catalog/search metadata and are not used by the acoustic solver");
  setMaterialEffectiveness(effectiveness, "notes", "inactive", "Notes are saved with the material but are not used by the acoustic solver");

  for (const fieldId of ["category", "behavior", "densityKgM3"] as const) {
    if (!materialInStack) {
      setNotInStackMaterialEffectiveness(effectiveness, fieldId);
    } else if (exactSourceRoute && !liveFormulaOutput) {
      setExactSourceMaterialEffectiveness(effectiveness, fieldId);
    } else if (liveFormulaOutput) {
      const title =
        fieldId === "densityKgM3"
          ? "Used with layer thickness by the current formula route"
          : "Used by the current formula route to classify the material";
      setMaterialEffectiveness(effectiveness, fieldId, "used", title);
    }
  }

  for (const fieldId of ["youngModulusPa", "poissonRatio", "lossFactor"] as const) {
    const fieldTokens =
      fieldId === "youngModulusPa"
        ? ["youngmoduluspa", "panelbendingstiffness", "criticalfrequency", "bendingstiffness"]
        : fieldId === "poissonRatio"
          ? ["poissonratio"]
          : ["lossfactor", "panellossfactor"];

    if (!materialInStack) {
      setNotInStackMaterialEffectiveness(effectiveness, fieldId);
    } else if (missingInputsReference(input.result, fieldTokens)) {
      setMaterialEffectiveness(effectiveness, fieldId, "needed", buildMechanicalMaterialFieldNeededTitle(fieldId));
    } else if (exactSourceRoute && !liveFormulaOutput) {
      setExactSourceMaterialEffectiveness(effectiveness, fieldId);
    } else if (liveFormulaOutput && routeBasisReferencesTokens(input.result, fieldTokens)) {
      setMaterialEffectiveness(effectiveness, fieldId, "used", buildMechanicalMaterialFieldUsedTitle(fieldId));
    } else if (liveAirborneOutput || liveImpactOutput) {
      setMaterialEffectiveness(effectiveness, fieldId, "inactive", "The current route does not report using this material field");
    }
  }

  if (!materialInStack) {
    setNotInStackMaterialEffectiveness(effectiveness, "absorberClass");
    setNotInStackMaterialEffectiveness(effectiveness, "porosity");
  } else if (exactSourceRoute && !liveFormulaOutput) {
    setExactSourceMaterialEffectiveness(effectiveness, "absorberClass");
    setExactSourceMaterialEffectiveness(effectiveness, "porosity");
  } else if (missingFlowResistivity && material.acoustic?.absorberClass === "unknown") {
    setMaterialEffectiveness(
      effectiveness,
      "absorberClass",
      "needed",
      "Needed: this porous absorber material is missing absorber class, so the active formula route cannot calculate the current output"
    );
  } else if (liveAirborneOutput && airborneBasisReferencesFlowResistivity(input.result)) {
    setMaterialEffectiveness(
      effectiveness,
      "absorberClass",
      "used",
      "Used by the current porous absorber airborne formula route as the absorber class input"
    );
  } else if (liveAirborneOutput || liveImpactOutput) {
    setMaterialEffectiveness(effectiveness, "absorberClass", "inactive", "The current route does not report using absorber class");
  }

  if (materialInStack && !effectiveness.porosity) {
    if (missingInputsReference(input.result, ["porosity"])) {
      setMaterialEffectiveness(
        effectiveness,
        "porosity",
        "needed",
        "Needed: this porous absorber material is missing porosity, so the active formula route cannot calculate the current output"
      );
    } else if (liveFormulaOutput && routeBasisReferencesTokens(input.result, ["porosity"])) {
      setMaterialEffectiveness(effectiveness, "porosity", "used", "Used by the current formula route as the porosity input");
    } else if (liveAirborneOutput || liveImpactOutput) {
      setMaterialEffectiveness(effectiveness, "porosity", "inactive", "The current route does not report using porosity");
    }
  }

  if (isPorousAbsorberMaterial(material)) {
    const materialHasFlowResistivity = hasPositiveNumber(material.acoustic?.flowResistivityPaSM2);

    if (!materialInStack) {
      setMaterialEffectiveness(
        effectiveness,
        "flowResistivityPaSM2",
        "inactive",
        "This material is not in the active layer stack, so changing flow resistivity will not affect the current result"
      );
    } else if (missingFlowResistivity && !materialHasFlowResistivity) {
      setMaterialEffectiveness(
        effectiveness,
        "flowResistivityPaSM2",
        "needed",
        "Needed: this porous absorber material is missing flow resistivity, so the active porous cavity damping route cannot calculate the current output"
      );
    } else if (hasImpactSelection && !hasAirborneSelection) {
      setMaterialEffectiveness(
        effectiveness,
        "flowResistivityPaSM2",
        "inactive",
        "Flow resistivity belongs to airborne porous cavity damping, so it does not affect the current impact output set"
      );
    } else if (hasAirborneSelection && isMeasuredExactAirborneRoute(input.result)) {
      setMaterialEffectiveness(
        effectiveness,
        "flowResistivityPaSM2",
        "inactive",
        "Exact airborne source owns the current output; flow resistivity is not used by a formula route"
      );
    } else if (
      materialHasFlowResistivity &&
      liveAirborneOutput &&
      airborneBasisReferencesFlowResistivity(input.result)
    ) {
      setMaterialEffectiveness(
        effectiveness,
        "flowResistivityPaSM2",
        "used",
        "Used: this material's flow resistivity feeds the current porous absorber airborne formula route"
      );
    }
  }

  if (isResilientLayerMaterial(material)) {
    const materialHasDynamicStiffness = hasPositiveNumber(material.impact?.dynamicStiffnessMNm3);

    if (!materialInStack) {
      setMaterialEffectiveness(
        effectiveness,
        "dynamicStiffnessMNm3",
        "inactive",
        "This material is not in the active layer stack, so changing dynamic stiffness will not affect the current result"
      );
    } else if (missingDynamicStiffness && !materialHasDynamicStiffness) {
      setMaterialEffectiveness(
        effectiveness,
        "dynamicStiffnessMNm3",
        "needed",
        "Needed: this resilient layer material is missing dynamic stiffness, so the active floor impact route cannot calculate the current output"
      );
    } else if (hasAirborneSelection && !hasImpactSelection) {
      setMaterialEffectiveness(
        effectiveness,
        "dynamicStiffnessMNm3",
        "inactive",
        "Dynamic stiffness is not used by the current airborne output set"
      );
    } else if (hasImpactSelection && isExactImpactRoute(input.result)) {
      setMaterialEffectiveness(
        effectiveness,
        "dynamicStiffnessMNm3",
        "inactive",
        "Exact impact source owns the current output; dynamic stiffness is not used by a formula route"
      );
    } else if (
      input.mode === "floor" &&
      materialHasDynamicStiffness &&
      liveImpactOutput &&
      impactResultUsesMaterialDynamicStiffness(input.result, material)
    ) {
      setMaterialEffectiveness(
        effectiveness,
        "dynamicStiffnessMNm3",
        "used",
        "Used: this material's dynamic stiffness feeds the current floor impact formula route"
      );
    }
  }

  return effectiveness;
}
