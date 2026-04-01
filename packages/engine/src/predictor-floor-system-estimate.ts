import type { FloorSystemEstimateResult, ImpactPredictorInput } from "@dynecho/shared";

import { deriveCompositePanelPublishedInteractionEstimate } from "./composite-panel-published-interaction-estimate";
import { deriveHeavyConcretePublishedUpperTreatmentEstimate } from "./heavy-concrete-published-upper-treatment-estimate";
import { derivePredictorLowConfidenceFamilyEstimate } from "./predictor-low-confidence-family-estimate";
import { derivePredictorPublishedFamilyEstimate } from "./predictor-published-family-estimate";

type PredictorEstimateStrategy = {
  derive: (input: ImpactPredictorInput) => FloorSystemEstimateResult | null;
  id: string;
  priority: number;
};

const PREDICTOR_ESTIMATE_STRATEGIES: readonly PredictorEstimateStrategy[] = [
  {
    id: "low_confidence_family",
    priority: 10,
    derive: derivePredictorLowConfidenceFamilyEstimate
  },
  {
    id: "heavy_concrete_published_upper_treatment",
    priority: 20,
    derive: deriveHeavyConcretePublishedUpperTreatmentEstimate
  },
  {
    id: "composite_panel_published_interaction",
    priority: 30,
    derive: deriveCompositePanelPublishedInteractionEstimate
  },
  {
    id: "published_family",
    priority: 40,
    derive: derivePredictorPublishedFamilyEstimate
  }
].sort((left, right) => left.priority - right.priority);

export function derivePredictorSpecificFloorSystemEstimate(
  input: ImpactPredictorInput
): FloorSystemEstimateResult | null {
  for (const strategy of PREDICTOR_ESTIMATE_STRATEGIES) {
    const estimate = strategy.derive(input);
    if (estimate) {
      return estimate;
    }
  }

  return null;
}
