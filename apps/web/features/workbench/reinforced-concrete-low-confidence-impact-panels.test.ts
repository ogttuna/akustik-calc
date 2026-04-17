import type { AssemblyCalculation } from "@dynecho/shared";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CRITERIA_PACKS } from "./criteria-packs";
import { DeliveryAssistPanel } from "./delivery-assist-panel";
import { ExactFloorSystemPanel } from "./exact-floor-system-panel";
import { summarizeFieldRisk } from "./field-risk-model";
import { getImpactLaneHeadline, getImpactLaneKind, getImpactLaneNarrative, getImpactLanePillLabel } from "./impact-lane-view";
import { ImpactResultPanel } from "./impact-result-panel";
import { ResultSummary } from "./result-summary";

function buildReinforcedConcreteLowConfidenceResult(): AssemblyCalculation {
  return {
    calculatorId: "dynamic",
    calculatorLabel: "Dynamic",
    dynamicImpactTrace: {
      confidenceClass: "low",
      detectedSupportFamily: "reinforced_concrete",
      estimateTier: "low_confidence",
      estimateTierLabel: "Low-confidence fallback · reinforced concrete",
      evidenceTier: "estimate",
      fieldContinuation: "none",
      fitPercent: 29,
      impactBasisLabel: "Published family low-confidence estimate",
      selectedLabel: "Low-confidence fallback · reinforced concrete",
      selectionKindLabel: "Low-confidence fallback",
      systemType: "combined_upper_lower_system",
      systemTypeLabel: "Combined upper and lower system"
    } as AssemblyCalculation["dynamicImpactTrace"],
    floorSystemRecommendations: [],
    floorSystemEstimate: {
      airborneRatings: {
        Rw: 65.9,
        RwCtr: 57,
        RwCtrSemantic: "rw_plus_ctr"
      },
      fitPercent: 29,
      impact: {
        basis: "predictor_floor_system_low_confidence_estimate",
        confidence: {
          level: "low",
          provenance: "published_family_estimate",
          score: 0.29,
          summary:
            "Low-confidence reinforced-concrete fallback stays source-backed, but it remains a mixed nearby-row lane rather than a narrow same-stack family fit."
        },
        LnW: 50
      },
      kind: "low_confidence",
      notes: [],
      sourceSystems: [
        {
          airborneRatings: { Rw: 77 },
          id: "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
          impactRatings: { LnW: 43 },
          label: "140 mm concrete slab | elastic hanger ceiling | 2 x 13 mm boards",
          sourceLabel: "Euracoustics FA2023 concrete ceiling study",
          sourceType: "open_measured_dataset",
          sourceUrl: "https://example.com/euracoustics-f2",
          trustTier: "peer_reviewed_open_access"
        },
        {
          airborneRatings: { Rw: 70 },
          id: "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
          impactRatings: { LnW: 58 },
          label: "140 mm concrete slab | rigid hanger ceiling | 2 x 13 mm boards",
          sourceLabel: "Euracoustics FA2023 concrete ceiling study",
          sourceType: "open_measured_dataset",
          sourceUrl: "https://example.com/euracoustics-f1",
          trustTier: "peer_reviewed_open_access"
        },
        {
          airborneRatings: { Rw: 63, RwCtr: 57, RwCtrSemantic: "rw_plus_ctr" },
          id: "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
          impactRatings: { LnW: 51 },
          label: "Knauf CC60.1A | 150 mm concrete | timber + acoustic underlay",
          sourceLabel: "Knauf official system table",
          sourceType: "official_manufacturer_system_table",
          sourceUrl: "https://example.com/knauf",
          trustTier: "official_manufacturer"
        }
      ],
      structuralFamily: "reinforced concrete"
    } as AssemblyCalculation["floorSystemEstimate"],
    floorSystemRatings: {
      Rw: 65.9,
      RwCtr: 57,
      RwCtrSemantic: "rw_plus_ctr",
      basis: "predictor_floor_system_low_confidence_estimate"
    },
    impact: {
      basis: "predictor_floor_system_low_confidence_estimate",
      confidence: {
        level: "low",
        provenance: "published_family_estimate",
        score: 0.29,
        summary:
          "Low-confidence reinforced-concrete fallback stays source-backed, but it remains a mixed nearby-row lane rather than a narrow same-stack family fit."
      },
      estimateCandidateIds: [
        "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
        "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
        "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
      ],
      labOrField: "lab",
      LnW: 50,
      notes: [],
      scope: "family_estimate"
    } as AssemblyCalculation["impact"],
    layers: [],
    metrics: {
      airGapCount: 1,
      estimatedCDb: -2,
      estimatedCtrDb: -8.9,
      estimatedRwDb: 65.9,
      estimatedStc: 65,
      insulationCount: 1,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 410,
      totalThicknessMm: 446
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 66 (-2;-9)",
        descriptor: "Rw"
      }
    },
    supportedTargetOutputs: ["Rw", "Ln,w"],
    unsupportedTargetOutputs: [],
    warnings: []
  } as AssemblyCalculation;
}

describe("reinforced-concrete low-confidence impact panels", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("classifies the lane as a low-confidence fallback instead of a generic published family estimate", () => {
    const result = buildReinforcedConcreteLowConfidenceResult();
    const laneKind = getImpactLaneKind({
      impact: result.impact,
      lowerBoundImpact: result.lowerBoundImpact
    });

    expect(laneKind).toBe("low_confidence_fallback");
    expect(getImpactLanePillLabel(laneKind)).toBe("Low-confidence live");
    expect(getImpactLaneHeadline(laneKind)).toBe("Low-confidence fallback");
    expect(getImpactLaneNarrative(laneKind, false)).toContain("final low-confidence fallback built from nearby published rows");
  });

  it("keeps high-visibility result panels explicit about the low-confidence fallback posture", () => {
    vi.stubGlobal("React", React);
    const result = buildReinforcedConcreteLowConfidenceResult();

    const impactPanelHtml = renderToStaticMarkup(React.createElement(ImpactResultPanel, { result }));
    expect(impactPanelHtml).toContain("Low-confidence live");
    expect(impactPanelHtml).toContain("Low-confidence floor fallback");
    expect(impactPanelHtml).toContain("Low-confidence fallback");
    expect(impactPanelHtml).toContain("Ranked nearby published row ids:");
    expect(impactPanelHtml).not.toContain("Candidate lineage:");
    expect(impactPanelHtml).not.toContain(">Published family estimate<");

    const resultSummaryHtml = renderToStaticMarkup(
      React.createElement(ResultSummary, {
        result,
        targetLnwDb: null,
        targetRwDb: null,
        warnings: []
      })
    );
    expect(resultSummaryHtml).toContain("Low-confidence live");
    expect(resultSummaryHtml).toContain("Low-confidence floor fallback");
    expect(resultSummaryHtml).not.toContain(">Estimated floor family<");

    const exactFamilyPanelHtml = renderToStaticMarkup(
      React.createElement(ExactFloorSystemPanel, { result })
    );
    expect(exactFamilyPanelHtml).toContain("Low-confidence fallback active");
    expect(exactFamilyPanelHtml).toContain("Low-confidence fallback estimate");
    expect(exactFamilyPanelHtml).toContain("Low-confidence fallback provenance");
    expect(exactFamilyPanelHtml).toContain("Nearby published rows");
    expect(exactFamilyPanelHtml).toContain("Nearby row 1 · elastic-ceiling anchor");
    expect(exactFamilyPanelHtml).toContain("Nearby row 3 · farther fallback");
    expect(exactFamilyPanelHtml).not.toContain("Blended published rows");
    expect(exactFamilyPanelHtml).not.toContain(">Family estimate active<");
  });

  it("keeps delivery assist next moves explicit about the published low-confidence fallback", () => {
    vi.stubGlobal("React", React);

    const html = renderToStaticMarkup(
      React.createElement(DeliveryAssistPanel, {
        activeCriteriaPack: CRITERIA_PACKS[0],
        briefNote: "",
        fieldRiskSummary: summarizeFieldRisk([]),
        guideResult: null,
        reportProfile: "consultant",
        requestedOutputs: ["Rw", "Ln,w"],
        result: buildReinforcedConcreteLowConfidenceResult(),
        savedScenarioCount: 1,
        studyContext: "coordination"
      })
    );

    expect(html).toContain("Published low-confidence fallback is active");
    expect(html).not.toContain("Published family estimate is active");
  });
});
