import type { FloorSystemEstimateResult, ImpactPredictorInput } from "@dynecho/shared";

import { deriveCompositePanelPublishedInteractionEstimate } from "./composite-panel-published-interaction-estimate";
import { deriveHeavyConcretePublishedUpperTreatmentEstimate } from "./heavy-concrete-published-upper-treatment-estimate";
import { derivePredictorLowConfidenceFamilyEstimate } from "./predictor-low-confidence-family-estimate";
import { derivePredictorPublishedFamilyEstimate } from "./predictor-published-family-estimate";

export function derivePredictorSpecificFloorSystemEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  return (
    derivePredictorLowConfidenceFamilyEstimate(input) ??
    deriveHeavyConcretePublishedUpperTreatmentEstimate(input) ??
    deriveCompositePanelPublishedInteractionEstimate(input) ??
    derivePredictorPublishedFamilyEstimate(input) ??
    null
  );
}
