import type { ImpactCalculation } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { ksRound1 } from "./math";

const HEAVY_REFERENCE_LNW_DB = 78;

export function deriveHeavyReferenceImpactFromDeltaLw(deltaLwDb: number): ImpactCalculation | null {
  if (!Number.isFinite(deltaLwDb) || deltaLwDb < 0) {
    return null;
  }

  const roundedDeltaLw = ksRound1(deltaLwDb);
  const derivedLnW = ksRound1(HEAVY_REFERENCE_LNW_DB - roundedDeltaLw);

  if (!(derivedLnW > 0)) {
    return null;
  }

  return {
    LnW: derivedLnW,
    DeltaLw: roundedDeltaLw,
    availableOutputs: ["Ln,w", "DeltaLw"],
    bareReferenceLnW: HEAVY_REFERENCE_LNW_DB,
    basis: "predictor_explicit_delta_heavy_reference_derived",
    confidence: getImpactConfidenceForBasis("predictor_explicit_delta_heavy_reference_derived"),
    labOrField: "lab",
    metricBasis: {
      DeltaLw: "predictor_explicit_delta_user_input",
      LnW: "predictor_explicit_delta_heavy_reference_derived"
    },
    notes: [
      "This quick lane derives Ln,w from a product-sheet DeltaLw value against a fixed 78 dB heavy-floor reference.",
      "Use it for fast product screening only. It does not replace the live stack-derived impact estimator or exact floor-system import."
    ],
    referenceFloorType: "heavy_standard",
    scope: "reference_heavy_floor_derived",
    treatedReferenceLnW: derivedLnW
  };
}
