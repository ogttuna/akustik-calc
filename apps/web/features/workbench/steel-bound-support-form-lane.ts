import type { AssemblyCalculation } from "@dynecho/shared";

const LIGHTWEIGHT_STEEL_MISSING_SUPPORT_FORM_BASIS = "predictor_lightweight_steel_missing_support_form_bound_estimate";

export const STEEL_BOUND_SUPPORT_FORM_GAP_VALUE = "Fix support form";
export const STEEL_BOUND_SUPPORT_FORM_GAP_DETAIL =
  "This lightweight-steel bound lane is still conservative because the live stack leaves the carrier open between steel joist / purlin and open-web / rolled steel. Fix the base-structure row to one support form so DynEcho can stay inside the narrower FL-32 or FL-33 family-bound corridor.";
export const STEEL_BOUND_SUPPORT_FORM_ROUTE_NOTE =
  "Lightweight-steel support form is still open. Ln,w stays on the conservative crossover bound until the carrier is fixed to steel joist / purlin or open-web / rolled steel.";
export const STEEL_BOUND_SUPPORT_FORM_LNW_DETAIL =
  "Ln,w is still coming from the conservative lightweight-steel crossover bound because the carrier is open between steel joist / purlin and open-web / rolled steel.";
export const STEEL_BOUND_SUPPORT_FORM_AIRBORNE_DETAIL =
  "This airborne companion is being carried on the same lightweight-steel crossover corridor while the carrier stays unspecified. Fix the support form before reading it as the narrower family companion.";

export function isSteelBoundSupportFormLane(result: AssemblyCalculation | null): boolean {
  return result?.lowerBoundImpact?.basis === LIGHTWEIGHT_STEEL_MISSING_SUPPORT_FORM_BASIS;
}
