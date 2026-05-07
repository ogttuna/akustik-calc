import type { AssemblyCalculation, ImpactCalculation, RequestedOutputId } from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const STEEL_FLOOR_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";

export function isSteelFloorFormulaCorridorImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return impact?.basis === STEEL_FLOOR_FORMULA_BASIS;
}

export function getSteelFloorFormulaCorridorOutputDetail(output: RequestedOutputId): string | null {
  switch (output) {
    case "Ln,w":
      return "Lab-side Ln,w from the Gate AD lightweight-steel formula corridor. Source-absent estimate with +/-4.5 dB corridor tolerance; exact measured rows still outrank it.";
    case "DeltaLw":
      return "Upper-package DeltaLw from the steel mass-spring relation before carrier-transfer correction. Source-absent estimate with +/-2.0 dB corridor tolerance.";
    default:
      return null;
  }
}

export function getSteelFloorFormulaCorridorPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Source-absent lab formula corridor using explicit steel carrier geometry, load mass, resilient dynamic stiffness, and lower isolation. Keep the +/-4.5 dB Ln,w and +/-2.0 dB DeltaLw tolerances visible until source calibration tightens the lane.",
    label: "Steel formula corridor",
    tone: "accent"
  };
}

export function getSteelFloorFormulaCorridorNarrative(): string {
  return "The current source-absent steel floor is using the Gate AD mass-spring formula corridor, not the broad steel-family blend. Exact measured rows still win on a true match; otherwise the lab Ln,w and DeltaLw stay tied to explicit carrier, load, stiffness, and lower-isolation inputs with +/-4.5 dB and +/-2.0 dB tolerances.";
}
