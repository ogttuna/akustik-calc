import { describe, expect, it } from "vitest";

import {
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId,
  type ReportAssistantContext
} from "./report-assistant-context";
import {
  buildReportAssistantFollowUpPatchInstruction,
  classifyReportAssistantInstructionIntent,
  shouldRequestExplicitFollowUpPatchTarget
} from "./report-assistant-intent";

const RW_METRIC_ID = getReportAssistantMetricId("Rw");
const LNW_METRIC_ID = getReportAssistantMetricId("Ln,w");

function context(metricIds: readonly ("Ln,w" | "Rw")[] = ["Rw", "Ln,w"]): ReportAssistantContext {
  const metrics = metricIds.map((outputId, index) => ({
    basis: getReportAssistantMetricBasis(outputId),
    direction: getReportAssistantMetricDirection(outputId),
    engineDisplayValue: outputId === "Rw" ? "61 dB" : "50 dB",
    id: getReportAssistantMetricId(outputId),
    label: outputId,
    locations: [{ kind: "metricRow" as const, index }],
    metric: outputId,
    numericDb: outputId === "Rw" ? 54 : 52,
    outputId,
    reportDisplayValue: outputId === "Rw" ? "54 dB" : "52 dB",
    status: "live" as const
  }));

  return {
    assistantContextSignature: "report-context:intent-test",
    assistantOutputFacts: metrics.map((metric) => ({
      basis: metric.basis,
      basisCategory: "unknown",
      engineDisplayValue: metric.engineDisplayValue,
      label: metric.label,
      metricId: metric.id,
      missingInputs: [],
      outputId: metric.outputId,
      reportDisplayValue: metric.reportDisplayValue,
      status: metric.status,
      usedInputs: [],
      warnings: []
    })),
    createdAtIso: "2026-06-03T09:00:00.000Z",
    documentSignature: "report:intent-test",
    layersSummary: ["1. Concrete slab, 200 mm"],
    metrics,
    reportId: "intent-test",
    traceSummary: {
      missingPhysicalInputs: [],
      route: "floor",
      unsupportedOutputs: [],
      warnings: []
    },
    warnings: []
  };
}

describe("report assistant instruction intent classifier", () => {
  it("routes natural metric questions to research", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "sence bunun rw değeri doğru mu"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "research_metric_plausibility",
      metric: {
        id: RW_METRIC_ID
      }
    });
  });

  it("routes explicit source or analysis requests to research", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "Rw değerini internetteki kaynaklarla karşılaştırıp kontrol eder misin?"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "research_metric_plausibility",
      metric: {
        id: RW_METRIC_ID
      },
      reason: "explicit_research"
    });
  });

  it("routes trace and formula questions to context explanation", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "Rw nasıl hesaplandı, hangi lane seçildi?"
      })
    ).toMatchObject({
      intent: "explain",
      intentClass: "explain_metric_trace",
      metric: {
        id: RW_METRIC_ID
      },
      reason: "context_explanation"
    });

    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "hangi route ve formül kullanıldı?"
      })
    ).toMatchObject({
      intent: "explain",
      intentClass: "explain_metric_trace",
      reason: "context_explanation"
    });
  });

  it("keeps explicit internet research ahead of trace explanation wording", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "Rw için internette kaynak ara, sonra hangi route kullanıldı anlat"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "research_metric_plausibility",
      metric: {
        id: RW_METRIC_ID
      },
      reason: "explicit_research"
    });
  });

  it("uses the single current metric for non-mutating questions without a metric name", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(["Rw"]),
        instruction: "bu değer mantıklı mı?"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "research_metric_plausibility",
      metric: {
        id: RW_METRIC_ID
      }
    });
  });

  it("routes explicit numeric edit instructions to patch preview", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "set Rw to 55 dB"
      })
    ).toMatchObject({
      intent: "patch",
      intentClass: "propose_report_patch",
      metric: {
        id: RW_METRIC_ID
      },
      reason: "explicit_edit"
    });

    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "make Ln,w 3 dB lower"
      })
    ).toMatchObject({
      intent: "patch",
      intentClass: "propose_report_patch",
      metric: {
        id: LNW_METRIC_ID
      },
      reason: "explicit_edit"
    });
  });

  it("uses the single current metric for explicit numeric edits without a metric name", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(["Rw"]),
        instruction: "2 dB düşür"
      })
    ).toMatchObject({
      intent: "patch",
      intentClass: "propose_report_patch",
      metric: {
        id: RW_METRIC_ID
      },
      reason: "explicit_edit"
    });
  });

  it("keeps hypothetical numeric questions non-mutating", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "Rw'yi 2 dB düşürürsem mantıklı olur mu?"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "research_metric_plausibility",
      metric: {
        id: RW_METRIC_ID
      }
    });
  });

  it("classifies assembly and layer alternative questions separately from metric plausibility", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "şu layerın alternatifi ne, daha makul Rw için ne önerirsin?"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "research_assembly_alternatives",
      metric: {
        id: RW_METRIC_ID
      },
      reason: "assembly_alternative_research"
    });

    expect(
      classifyReportAssistantInstructionIntent({
        context: context(),
        instruction: "bu döşeme sistemine alternatif malzeme araştır"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "research_assembly_alternatives",
      reason: "assembly_alternative_research"
    });
  });

  it("classifies retry and challenge prompts without turning them into patch requests", () => {
    expect(
      classifyReportAssistantInstructionIntent({
        context: context(["Ln,w"]),
        instruction: "bence yanılıyorsun, bir daha araştır"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "challenge_or_retry",
      metric: {
        id: LNW_METRIC_ID
      },
      reason: "challenge_or_retry"
    });

    expect(
      classifyReportAssistantInstructionIntent({
        context: context(["Rw"]),
        instruction: "şu kaynağı dikkate al ve tekrar değerlendir"
      })
    ).toMatchObject({
      intent: "research",
      intentClass: "challenge_or_retry",
      metric: {
        id: RW_METRIC_ID
      },
      reason: "challenge_or_retry"
    });
  });

  it("turns a clear follow-up approval into a guarded patch instruction from the previous recommendation", () => {
    const followUp = buildReportAssistantFollowUpPatchInstruction({
      instruction: "düşür o zaman",
      previousMetric: context().metrics[0],
      previousRecommendationText: "Rw değerini 2 dB düşürmek uygun görünüyor."
    });

    expect(followUp).toMatchObject({
      metric: {
        id: RW_METRIC_ID
      }
    });
    expect(followUp?.instruction).toContain("Previous assistant recommendation");
    expect(followUp?.instruction).toContain("2 dB");
  });

  it("does not create a follow-up patch instruction when the follow-up conflicts with the recommendation", () => {
    expect(
      buildReportAssistantFollowUpPatchInstruction({
        instruction: "düşür o zaman",
        previousMetric: context().metrics[0],
        previousRecommendationText: "Rw değerini 2 dB yükseltmek uygun görünüyor."
      })
    ).toBeNull();
  });

  it("detects target-value direction conflicts even when the recommendation uses neutral wording", () => {
    expect(
      buildReportAssistantFollowUpPatchInstruction({
        instruction: "düşür o zaman",
        previousMetric: context().metrics[0],
        previousRecommendationText: "Mevcut 54 dB değerini koruyun veya 56 dB seviyesine çekin."
      })
    ).toBeNull();

    expect(
      buildReportAssistantFollowUpPatchInstruction({
        instruction: "uygula o zaman",
        previousMetric: context().metrics[0],
        previousRecommendationText: "Mevcut 54 dB değerini koruyun veya 56 dB seviyesine çekin."
      })
    ).toBeNull();

    expect(
      buildReportAssistantFollowUpPatchInstruction({
        instruction: "56 dB yap o zaman",
        previousMetric: context().metrics[0],
        previousRecommendationText: "Mevcut 54 dB değerini koruyun veya 56 dB seviyesine çekin."
      })
    ).toMatchObject({
      metric: {
        id: RW_METRIC_ID
      }
    });
  });

  it("asks for an explicit target when a follow-up edit references a conditional non-edit recommendation", () => {
    const previousMetric = context().metrics[0];
    const previousRecommendationText =
      "Raporda 57 dB değerini koruyabilirsiniz; ancak rijit bağlantı durumunda bu değer 50-52 dB bandına düşebilir.";

    expect(
      buildReportAssistantFollowUpPatchInstruction({
        instruction: "düşür o zaman",
        previousMetric,
        previousRecommendationText
      })
    ).toBeNull();

    expect(
      shouldRequestExplicitFollowUpPatchTarget({
        instruction: "düşür o zaman",
        previousMetric,
        previousRecommendationText
      })
    ).toBe(true);

    expect(
      shouldRequestExplicitFollowUpPatchTarget({
        instruction: "52 dB yap o zaman",
        previousMetric,
        previousRecommendationText
      })
    ).toBe(false);
  });
});
