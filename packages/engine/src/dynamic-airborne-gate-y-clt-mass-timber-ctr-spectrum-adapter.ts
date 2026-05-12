import type {
  AirborneContext,
  AirborneResultBasis,
  RequestedOutputId
} from "@dynecho/shared";

import { GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD } from "./dynamic-airborne-gate-h-lined-masonry-clt";

export const GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD =
  "gate_y_clt_mass_timber_ctr_spectrum_adapter_runtime";

export const GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID =
  "candidate_clt_mass_timber_ctr_spectrum_adapter_family_physics_prediction";

export const GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_WARNING =
  "CLT / mass-timber Ctr spectrum adapter is active from the calculated ISO 717-1 dynamic delegate curve. It is source-absent, does not retune Rw/STC/C/Ctr, and keeps the visible uncalibrated error budget.";

const REQUIRED_GATE_H_CLT_INPUTS = new Set([
  "materialClass:mass_timber",
  "densityKgM3",
  "surfaceMassKgM2",
  "thicknessMm"
]);

const GATE_Y_CTR_ADAPTER_REQUIRED_INPUT =
  "GateYCtrSpectrumAdapter:ISO717-1 traffic spectrum term from calculated TL curve";

function isElementLabContext(context?: AirborneContext | null): boolean {
  return !context?.contextMode || context.contextMode === "element_lab";
}

function hasRequiredGateHCltInputs(basis: AirborneResultBasis): boolean {
  const requiredInputs = new Set(basis.requiredInputs);

  for (const input of REQUIRED_GATE_H_CLT_INPUTS) {
    if (!requiredInputs.has(input)) {
      return false;
    }
  }

  return true;
}

export function maybeBuildGateYCltMassTimberCtrSpectrumAdapterBasis(input: {
  airborneContext?: AirborneContext | null;
  basis?: AirborneResultBasis | null;
  ctrDb?: number | null;
  sourceAnchorApplied: boolean;
  targetOutputs: readonly RequestedOutputId[];
}): AirborneResultBasis | null {
  if (
    input.sourceAnchorApplied ||
    !input.targetOutputs.includes("Ctr") ||
    !isElementLabContext(input.airborneContext) ||
    !input.basis ||
    !Number.isFinite(input.ctrDb)
  ) {
    return null;
  }

  const basis = input.basis;
  const frequenciesHz = basis.frequencyBands?.frequenciesHz;

  if (
    basis.method !== GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD ||
    basis.origin !== "family_physics_prediction" ||
    basis.curveBasis !== "calculated_frequency_curve" ||
    basis.ratingStandard !== "ISO 717-1" ||
    basis.missingPhysicalInputs.length > 0 ||
    !frequenciesHz?.length ||
    !hasRequiredGateHCltInputs(basis)
  ) {
    return null;
  }

  return {
    ...basis,
    assumptions: [
      ...basis.assumptions,
      "Gate Y promotes the calculated ISO 717-1 Ctr spectrum-adaptation term for CLT / mass-timber only when the Gate H lab family-physics curve is already complete",
      "no measured source row, calibration anchor, field output, or ASTM-only rating is consumed by this Ctr support adapter",
      "Rw, STC, C, Ctr, and the uncalibrated error budget remain unchanged from the parent dynamic curve rating"
    ],
    method: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
    requiredInputs: [...basis.requiredInputs, GATE_Y_CTR_ADAPTER_REQUIRED_INPUT]
  };
}
