import type { AssemblyCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  buildSimpleWorkbenchAssistantTraceSnapshot,
  parseSimpleWorkbenchAssistantTraceSnapshot
} from "./simple-workbench-assistant-trace-snapshot";

describe("simple workbench assistant trace snapshot", () => {
  it("builds a compact provenance snapshot from the current engine result", () => {
    const result = {
      airborneCandidateResolution: {
        candidates: [
          {
            id: "candidate-exact",
            metricIds: ["output:Rw"],
            origin: "measured_exact_full_stack",
            outputIds: ["Rw"],
            rejectionReasons: [{ code: "missing_required_input", detail: "Exact source is incomplete." }],
            selected: false
          },
          {
            id: "candidate-calibrated",
            metricIds: ["output:Rw"],
            origin: "calibrated_family_physics",
            outputIds: ["Rw"],
            rejectionReasons: [],
            selected: true
          }
        ],
        rejectedCandidateIds: ["candidate-exact"],
        runtimeValueMovement: false,
        selectedBasis: {
          origin: "calibrated_family_physics"
        },
        selectedCandidateId: "candidate-calibrated",
        selectedOrigin: "calibrated_family_physics"
      },
      dynamicAirborneTrace: {
        candidateMethods: [
          { label: "Mass law", method: "mass_law", rwDb: 48, selected: false },
          { label: "KS calibrated", method: "ks_rw_calibrated", rwDb: 55, selected: true }
        ],
        confidenceClass: "medium",
        confidenceScore: 0.71,
        detectedFamily: "double_leaf",
        detectedFamilyLabel: "Double leaf",
        notes: ["Selected calibrated double-leaf lane."],
        selectedLabel: "KS calibrated double-leaf lane",
        selectedMethod: "ks_rw_calibrated",
        solverSpreadRwDb: 7,
        strategy: "double_leaf_calibrated"
      },
      dynamicImpactTrace: {
        availableMetricLabels: ["Ln,w", "L'nT,w"],
        candidateRowCount: 12,
        confidenceClass: "medium",
        confidenceScore: 0.66,
        detectedSupportFamily: "reinforced_concrete",
        detectedSupportFamilyLabel: "Reinforced concrete",
        evidenceTier: "estimate",
        evidenceTierLabel: "Estimate",
        fieldContinuation: "standardized_room_volume",
        fieldContinuationLabel: "Standardized room volume",
        fitPercent: 84,
        impactBasis: "family_estimate",
        impactBasisLabel: "Family estimate",
        notes: ["Field continuation is active."],
        selectedLabel: "Heavy concrete combined upper/lower formula corridor",
        selectedSourceIds: ["floor-system-heavy"],
        selectedSourceLabels: ["Heavy concrete source row"],
        selectionKind: "formula_estimate",
        selectionKindLabel: "Formula estimate",
        systemType: "combined_upper_lower_system",
        systemTypeLabel: "Combined upper/lower system"
      },
      impactSupport: {
        basis: "family_estimate",
        formulaNotes: ["Heavy concrete formula corridor."],
        labOrField: "field",
        notes: ["Support family detected from slab."],
        primaryCurveType: "impact_curve",
        primaryCurveUnaffected: true,
        referenceFloorType: "reinforced concrete"
      },
      layerCombinationResolverTrace: {
        basis: "building_prediction",
        boundaryCandidateIds: ["candidate-bound"],
        candidateKind: "calibrated_family_solver",
        errorBudgetMetrics: ["Rw"],
        rejectedCandidateIds: ["candidate-bound"],
        requestedBasis: "building_prediction",
        requiredInputs: ["floorAreaM2"],
        route: "floor",
        runtimeBasisId: "runtime-heavy-concrete",
        selectedCandidateId: "candidate-calibrated",
        supportBucket: "calibrated_estimate",
        supportedMetrics: ["Rw", "Ln,w"],
        surfaceDetail: "Resolver selected a calibrated heavy concrete family solver.",
        surfaceLabel: "Calibrated heavy concrete",
        valuePins: [{ metric: "Rw", value: 55 }]
      }
    } as unknown as AssemblyCalculation;

    const snapshot = buildSimpleWorkbenchAssistantTraceSnapshot(result);

    expect(snapshot?.airborne).toMatchObject({
      selectedLabel: "KS calibrated double-leaf lane",
      selectedMethod: "ks_rw_calibrated",
      solverSpreadRwDb: 7
    });
    expect(snapshot?.airborneCandidateResolution).toMatchObject({
      rejectedCandidateIds: ["candidate-exact"],
      selectedCandidateId: "candidate-calibrated",
      selectedOrigin: "calibrated_family_physics"
    });
    expect(snapshot?.impact).toMatchObject({
      fieldContinuation: "standardized_room_volume",
      selectedLabel: "Heavy concrete combined upper/lower formula corridor",
      supportFamily: "reinforced_concrete"
    });
    expect(snapshot?.layerCombinationResolver).toMatchObject({
      requiredInputs: ["floorAreaM2"],
      route: "floor",
      selectedCandidateId: "candidate-calibrated",
      supportedMetrics: ["Rw", "Ln,w"]
    });
  });

  it("drops malformed fields and caps large arrays while parsing stored snapshots", () => {
    const parsed = parseSimpleWorkbenchAssistantTraceSnapshot({
      airborne: {
        candidateMethods: Array.from({ length: 12 }, (_, index) => ({
          label: `candidate-${index + 1}`,
          method: "mass_law",
          rwDb: 40 + index,
          selected: index === 0
        })),
        notes: ["one", "two", "three", "four", "five", "six", "seven"],
        selectedLabel: "A".repeat(300)
      },
      impact: "not-an-object",
      layerCombinationResolver: {
        valuePins: [
          { metric: "Rw", value: 55 },
          { metric: "bad", value: "not-a-number" }
        ]
      }
    });

    expect(parsed?.airborne?.candidateMethods).toHaveLength(6);
    expect(parsed?.airborne?.notes).toHaveLength(6);
    expect(parsed?.airborne?.selectedLabel?.length).toBe(240);
    expect(parsed?.impact).toBeUndefined();
    expect(parsed?.layerCombinationResolver?.valuePins).toEqual([{ metric: "Rw", value: 55 }]);
  });
});
