import { describe, expect, it } from "vitest";

import type {
  ReportAssistantContext,
  ReportAssistantMetric
} from "./report-assistant-context";
import {
  appendReportAssistantTraceExplanation,
  buildReportAssistantContextTraceAnswer,
  buildReportAssistantTraceExplanationLines
} from "./report-assistant-trace-explanation";

const BASE_CONTEXT: ReportAssistantContext = {
  assistantContextSignature: "report-context:trace-test",
  assistantOutputFacts: [
    {
      basis: "lab",
      basisCategory: "formula_corridor",
      engineDisplayValue: "55 dB",
      formulaOrSupportNote: "Resolver selected a calibrated heavy concrete family solver.",
      label: "Rw",
      metricId: "output:Rw",
      missingInputs: [],
      outputId: "Rw",
      reportDisplayValue: "55 dB",
      selectedCandidateId: "candidate-calibrated",
      status: "live",
      supportBucket: "calibrated_estimate",
      usedInputs: ["airborne lane: KS calibrated double-leaf lane", "value pin: Rw 55 dB"],
      valuePinDb: 55,
      warnings: []
    },
    {
      basis: "field",
      basisCategory: "field_adapter",
      engineDisplayValue: "48 dB",
      formulaOrSupportNote: "Heavy concrete formula corridor.",
      label: "Ln,w",
      metricId: "output:Ln,w",
      missingInputs: [],
      outputId: "Ln,w",
      reportDisplayValue: "48 dB",
      selectedCandidateId: "candidate-calibrated",
      status: "live",
      supportBucket: "calibrated_estimate",
      usedInputs: ["impact lane: Heavy concrete combined upper/lower formula corridor", "reference floor: reinforced concrete"],
      warnings: []
    },
    {
      basis: "lab",
      basisCategory: "formula_corridor",
      engineDisplayValue: "18 dB",
      formulaOrSupportNote: "DeltaLw corridor uses resilient finish support.",
      label: "DeltaLw",
      metricId: "output:DeltaLw",
      missingInputs: [],
      outputId: "DeltaLw",
      reportDisplayValue: "18 dB",
      selectedCandidateId: "candidate-calibrated",
      status: "live",
      supportBucket: "calibrated_estimate",
      usedInputs: [
        "impact lane: Heavy concrete combined upper/lower formula corridor",
        "resolver required inputs: finish dynamic stiffness",
        "reference floor: reinforced concrete"
      ],
      valuePinDb: 18,
      warnings: []
    },
    {
      basis: "lab",
      basisCategory: "unsupported",
      engineDisplayValue: "Not ready",
      label: "Ln,w+CI",
      metricId: "output:Ln,w+CI",
      missingInputs: ["CI adaptation evidence"],
      outputId: "Ln,w+CI",
      parkedReason: "Add CI support evidence before publishing Ln,w+CI.",
      reportDisplayValue: "Not ready",
      selectedCandidateId: "candidate-calibrated",
      status: "unsupported",
      supportBucket: "calibrated_estimate",
      usedInputs: ["Ln,w live value"],
      warnings: []
    }
  ],
  assistantTraceSnapshot: {
    airborne: {
      confidenceClass: "medium",
      detectedFamilyLabel: "Double leaf",
      selectedLabel: "KS calibrated double-leaf lane",
      selectedMethod: "ks_rw_calibrated",
      solverSpreadRwDb: 7
    },
    airborneCandidateResolution: {
      rejectedCandidateIds: ["candidate-exact"],
      selectedCandidateId: "candidate-calibrated",
      selectedOrigin: "calibrated_family_physics"
    },
    impact: {
      evidenceTierLabel: "Estimate",
      fieldContinuationLabel: "Standardized room volume",
      fitPercent: 84,
      impactBasisLabel: "Family estimate",
      selectedLabel: "Heavy concrete combined upper/lower formula corridor",
      supportFamilyLabel: "Reinforced concrete"
    },
    impactSupport: {
      basis: "family_estimate",
      formulaNotes: ["Heavy concrete formula corridor."],
      labOrField: "field",
      primaryCurveType: "impact_curve",
      primaryCurveUnaffected: true,
      referenceFloorType: "reinforced concrete"
    },
    layerCombinationResolver: {
      basis: "building_prediction",
      candidateKind: "calibrated_family_solver",
      requiredInputs: ["floorAreaM2", "finish dynamic stiffness"],
      route: "floor",
      selectedCandidateId: "candidate-calibrated",
      supportBucket: "calibrated_estimate",
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"],
      surfaceDetail: "Resolver selected a calibrated heavy concrete family solver.",
      surfaceLabel: "Calibrated heavy concrete",
      valuePins: [
        { metric: "Rw", value: 55 },
        { metric: "DeltaLw", value: 18 }
      ]
    }
  },
  createdAtIso: "2026-06-03T09:00:00.000Z",
  documentSignature: "report:trace-test",
  layersSummary: ["Concrete slab"],
  metrics: [],
  reportId: "trace-test",
  traceSummary: {
    basis: "building_prediction",
    missingPhysicalInputs: [],
    route: "floor",
    selectedCandidateId: "candidate-calibrated",
    selectedOrigin: "calibrated_family_physics",
    unsupportedOutputs: ["Ln,w+CI"],
    warnings: []
  },
  warnings: []
};

const RW_METRIC: ReportAssistantMetric = {
  basis: "lab",
  direction: "higher_is_better",
  engineDisplayValue: "55 dB",
  id: "output:Rw",
  label: "Rw",
  locations: [],
  metric: "Rw",
  outputId: "Rw",
  reportDisplayValue: "55 dB",
  status: "live"
};

const LNW_METRIC: ReportAssistantMetric = {
  basis: "field",
  direction: "lower_is_better",
  engineDisplayValue: "48 dB",
  id: "output:Ln,w",
  label: "Ln,w",
  locations: [],
  metric: "Ln,w",
  outputId: "Ln,w",
  reportDisplayValue: "48 dB",
  status: "live"
};

const DELTALW_METRIC: ReportAssistantMetric = {
  basis: "lab",
  direction: "higher_is_better",
  engineDisplayValue: "18 dB",
  id: "output:DeltaLw",
  label: "DeltaLw",
  locations: [],
  metric: "DeltaLw",
  outputId: "DeltaLw",
  reportDisplayValue: "18 dB",
  status: "live"
};

const LNW_CI_METRIC: ReportAssistantMetric = {
  basis: "lab",
  direction: "lower_is_better",
  engineDisplayValue: "Not ready",
  id: "output:Ln,w+CI",
  label: "Ln,w+CI",
  locations: [],
  metric: "Ln,w+CI",
  outputId: "Ln,w+CI",
  reportDisplayValue: "Not ready",
  status: "unsupported"
};

describe("report assistant trace explanation", () => {
  it("explains the selected airborne lane and resolver candidate for airborne metrics", () => {
    const lines = buildReportAssistantTraceExplanationLines({
      context: BASE_CONTEXT,
      metric: RW_METRIC
    });

    expect(lines.join(" ")).toContain("Engine route:");
    expect(lines.join(" ")).toContain("Output fact Rw:");
    expect(lines.join(" ")).toContain("basis category formula corridor");
    expect(lines.join(" ")).toContain("Rw intermediate logic:");
    expect(lines.join(" ")).toContain("Airborne calculation:");
    expect(lines.join(" ")).toContain("KS calibrated double-leaf lane");
    expect(lines.join(" ")).toContain("Layer resolver:");
    expect(lines.join(" ")).toContain("value pin Rw 55 dB");
  });

  it("uses impact support and formula notes for impact metrics", () => {
    const lines = buildReportAssistantTraceExplanationLines({
      context: BASE_CONTEXT,
      metric: LNW_METRIC
    });

    expect(lines.join(" ")).toContain("Impact calculation:");
    expect(lines.join(" ")).toContain("Output fact Ln,w:");
    expect(lines.join(" ")).toContain("basis category field adapter");
    expect(lines.join(" ")).toContain("Ln,w intermediate logic:");
    expect(lines.join(" ")).toContain("Input coverage Ln,w:");
    expect(lines.join(" ")).toContain("Heavy concrete combined upper/lower formula corridor");
    expect(lines.join(" ")).toContain("Impact formula/support:");
    expect(lines.join(" ")).toContain("Heavy concrete formula corridor.");
  });

  it("appends trace lines without changing empty-trace answers", () => {
    expect(
      appendReportAssistantTraceExplanation({
        answerText: "Context-only answer.",
        lines: []
      })
    ).toBe("Context-only answer.");
    expect(
      appendReportAssistantTraceExplanation({
        answerText: "Context-only answer.",
        lines: ["Engine route: route floor."]
      })
    ).toContain("Engine trace:");
  });

  it("builds a non-mutating conversation answer from current context", () => {
    const answer = buildReportAssistantContextTraceAnswer({
      context: {
        ...BASE_CONTEXT,
        metrics: [RW_METRIC, LNW_METRIC]
      },
      instruction: "hangi lane secildi?",
      metric: RW_METRIC
    });

    expect(answer).toMatchObject({
      metricId: "output:Rw",
      summary: "Rw: engine trace context"
    });
    expect(answer.detail).toContain("Current report context for Rw:");
    expect(answer.detail).toContain("basis category formula corridor");
    expect(answer.detail).toContain("Engine trace:");
    expect(answer.detail).toContain("Layer combination:");
    expect(answer.detail).toContain("No report value was changed.");
  });

  it("answers direct metric trace prompts with metric-specific intermediate logic", () => {
    const lnwAnswer = buildReportAssistantContextTraceAnswer({
      context: {
        ...BASE_CONTEXT,
        metrics: [RW_METRIC, LNW_METRIC, DELTALW_METRIC, LNW_CI_METRIC]
      },
      instruction: "Ln,w neden hesaplandi?",
      metric: LNW_METRIC
    });
    const deltaLwAnswer = buildReportAssistantContextTraceAnswer({
      context: {
        ...BASE_CONTEXT,
        metrics: [RW_METRIC, LNW_METRIC, DELTALW_METRIC, LNW_CI_METRIC]
      },
      instruction: "DeltaLw hangi inputlarla geldi?",
      metric: DELTALW_METRIC
    });
    const lnwCiAnswer = buildReportAssistantContextTraceAnswer({
      context: {
        ...BASE_CONTEXT,
        metrics: [RW_METRIC, LNW_METRIC, DELTALW_METRIC, LNW_CI_METRIC]
      },
      instruction: "Ln,w+CI neden park edildi?",
      metric: LNW_CI_METRIC
    });
    const rwAnswer = buildReportAssistantContextTraceAnswer({
      context: {
        ...BASE_CONTEXT,
        metrics: [RW_METRIC, LNW_METRIC, DELTALW_METRIC, LNW_CI_METRIC]
      },
      instruction: "Rw hangi lane ve basis?",
      metric: RW_METRIC
    });

    expect(lnwAnswer.detail).toContain("Ln,w intermediate logic:");
    expect(lnwAnswer.detail).toContain("basis category field adapter");
    expect(deltaLwAnswer.detail).toContain("DeltaLw intermediate logic:");
    expect(deltaLwAnswer.detail).toContain("finish dynamic stiffness");
    expect(lnwCiAnswer.detail).toContain("Ln,w+CI intermediate logic:");
    expect(lnwCiAnswer.detail).toContain("Parked output Ln,w+CI");
    expect(lnwCiAnswer.detail).toContain("Add CI support evidence");
    expect(rwAnswer.detail).toContain("Rw intermediate logic:");
    expect(rwAnswer.detail).toContain("airborne lane");
    expect(rwAnswer.detail).toContain("basis category formula corridor");
  });
});
