import { describe, expect, it } from "vitest";

import {
  getReportAssistantMetricBasis,
  getReportAssistantMetricDirection,
  getReportAssistantMetricId,
  type ReportAssistantContext
} from "./report-assistant-context";
import {
  buildReportAssistantCurrentCalculatorReviewPacketFromCalculatorPreview,
  buildReportAssistantCurrentCalculatorReviewPacketFromContext
} from "./report-assistant-current-calculator-review-packet";
import type { WorkbenchV2CalculatorAssistantPreview } from "../workbench-rebuild/workbench-v2-calculator-assistant";

const RW_METRIC_ID = getReportAssistantMetricId("Rw");
const IIC_METRIC_ID = getReportAssistantMetricId("IIC");

function context(input?: {
  engineDisplayValue?: string;
  missingInputs?: readonly string[];
  outputId?: "IIC" | "Rw";
  reportDisplayValue?: string;
  status?: "live" | "needs_input" | "unsupported";
}): ReportAssistantContext {
  const outputId = input?.outputId ?? "Rw";
  const metricId = getReportAssistantMetricId(outputId);
  const status = input?.status ?? "live";
  const reportDisplayValue = input?.reportDisplayValue ?? "54 dB";
  const engineDisplayValue = input?.engineDisplayValue;
  const missingInputs = input?.missingInputs ?? [];

  return {
    assistantContextSignature: "report-context:review-packet-test",
    assistantOutputFacts: [
      {
        basis: getReportAssistantMetricBasis(outputId),
        basisCategory: status === "unsupported" ? "unsupported" : status === "needs_input" ? "needs_input" : "formula_corridor",
        ...(engineDisplayValue ? { engineDisplayValue } : {}),
        label: outputId,
        metricId,
        missingInputs,
        outputId,
        ...(status === "unsupported" ? { parkedReason: `${outputId} is unsupported for this stack.` } : {}),
        reportDisplayValue,
        status,
        usedInputs: ["Current layer stack"],
        warnings: status === "live" ? ["Check source comparability."] : []
      }
    ],
    createdAtIso: "2026-06-19T10:00:00.000Z",
    documentComparisonSummaries: [],
    documentSignature: "report:review-packet-test",
    layersSummary: [
      "1. Gypsum Board | side A | 12.5 mm",
      "2. Rock Wool | cavity | 50 mm",
      "3. Gypsum Board | side B | 12.5 mm"
    ],
    metrics: [
      {
        basis: getReportAssistantMetricBasis(outputId),
        direction: getReportAssistantMetricDirection(outputId),
        ...(engineDisplayValue ? { engineDisplayValue } : {}),
        id: metricId,
        label: outputId,
        locations: [{ kind: "metricRow", index: 0 }],
        metric: outputId,
        ...(status === "live" ? { numericDb: 54 } : {}),
        outputId,
        reportDisplayValue,
        status
      }
    ],
    reportAdjustments: [],
    reportId: "review-packet-test",
    traceSummary: {
      basis: "formula_corridor",
      missingPhysicalInputs: missingInputs,
      route: "wall",
      unsupportedOutputs: status === "unsupported" ? [outputId] : [],
      warnings: []
    },
    warnings: []
  };
}

function readyPreview(): WorkbenchV2CalculatorAssistantPreview {
  return {
    calculationSummary: {
      primaryOutput: "Rw",
      primaryValueLabel: "41 dB",
      selectedOutputs: ["Rw", "STC"],
      status: "ready"
    },
    describedConfiguration: {
      description: "gypsum + rock wool + gypsum",
      layers: [
        { materialId: "gypsum_board", materialName: "Gypsum Board", role: "side_a", thicknessMm: 12.5 },
        { materialId: "rockwool", materialName: "Rock Wool", role: "cavity", thicknessMm: 50 },
        { materialId: "gypsum_board", materialName: "Gypsum Board", role: "side_b", thicknessMm: 12.5 }
      ],
      parser: "deterministic_wall_layer_description_v1",
      warnings: []
    },
    engineSummary: {
      calculatorId: "wall.double_leaf",
      calculatorLabel: "Double leaf wall",
      method: "formula",
      supportedImpactOutputs: [],
      supportedTargetOutputs: ["Rw", "STC"],
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: [],
      warnings: []
    },
    outputRows: [
      { detail: "Calculated", label: "Rw", status: "live", value: "41 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "41 dB" }
    ],
    requestedSnapshot: {
      customMaterialCount: 0,
      layerCount: 3,
      mode: "wall",
      name: "Described wall layer configuration",
      selectedOutputs: ["Rw", "STC"]
    },
    tasks: []
  };
}

describe("report assistant current calculator review packet", () => {
  it("builds a ready source-review packet from report context with captured engine value", () => {
    const result = buildReportAssistantCurrentCalculatorReviewPacketFromContext({
      context: context({
        engineDisplayValue: "61 dB",
        reportDisplayValue: "54 dB"
      }),
      metricId: RW_METRIC_ID
    });

    expect(result).toMatchObject({
      ok: true,
      packet: {
        metric: {
          calculatorDisplayValue: "61 dB",
          metricId: RW_METRIC_ID,
          reportDisplayValue: "54 dB",
          valueAuthority: "captured_engine_value"
        },
        numericReviewAllowed: true,
        reviewStatus: "ready",
        route: "wall",
        source: "report_context"
      }
    });
    expect(result.ok && result.packet.layers).toHaveLength(3);
    expect(result.ok && result.packet.warnings).toContain("Check source comparability.");
  });

  it("keeps needs-input outputs reviewable only as blocked non-numeric packets", () => {
    const result = buildReportAssistantCurrentCalculatorReviewPacketFromContext({
      context: context({
        missingInputs: ["supportSpacingMm", "impactFieldContext.ci50_2500Db"],
        status: "needs_input"
      }),
      metricId: RW_METRIC_ID
    });

    expect(result).toMatchObject({
      ok: true,
      packet: {
        metric: {
          status: "needs_input"
        },
        missingInputs: ["supportSpacingMm", "impactFieldContext.ci50_2500Db"],
        numericReviewAllowed: false,
        numericReviewBlocker: "Missing calculator inputs: support spacing, CI,50-2500.",
        reviewStatus: "needs_input"
      }
    });
  });

  it("blocks numeric source recommendations for unsupported outputs", () => {
    const result = buildReportAssistantCurrentCalculatorReviewPacketFromContext({
      context: context({
        outputId: "IIC",
        status: "unsupported"
      }),
      metricId: IIC_METRIC_ID
    });

    expect(result).toMatchObject({
      ok: true,
      packet: {
        metric: {
          metricId: IIC_METRIC_ID,
          outputId: "IIC",
          status: "unsupported"
        },
        numericReviewAllowed: false,
        numericReviewBlocker: "Unsupported calculator outputs: IIC.",
        reviewStatus: "unsupported",
        unsupportedOutputs: ["IIC"]
      }
    });
  });

  it("does not carry stale captured engine values for non-live report-context metrics", () => {
    const result = buildReportAssistantCurrentCalculatorReviewPacketFromContext({
      context: context({
        engineDisplayValue: "61 dB",
        outputId: "IIC",
        status: "unsupported"
      }),
      metricId: IIC_METRIC_ID
    });

    expect(result).toMatchObject({
      ok: true,
      packet: {
        metric: {
          metricId: IIC_METRIC_ID,
          outputId: "IIC",
          status: "unsupported",
          valueAuthority: "report_metric_without_engine_capture"
        },
        numericReviewAllowed: false,
        numericReviewBlocker: "Unsupported calculator outputs: IIC.",
        reviewStatus: "unsupported",
        unsupportedOutputs: ["IIC"]
      }
    });
    expect(result.ok && result.packet.metric.calculatorDisplayValue).toBeUndefined();
  });

  it("builds a ready packet from calculator preview rows and described layers", () => {
    const result = buildReportAssistantCurrentCalculatorReviewPacketFromCalculatorPreview({
      contextSignature: "report-context:current-browser",
      outputId: "Rw",
      preview: readyPreview(),
      snapshotSignature: "workbench-snapshot:abc"
    });

    expect(result).toMatchObject({
      ok: true,
      packet: {
        contextSignature: "report-context:current-browser",
        metric: {
          calculatorDisplayValue: "41 dB",
          metricId: "output:Rw",
          outputId: "Rw",
          valueAuthority: "calculator_preview"
        },
        numericReviewAllowed: true,
        requestedOutputs: ["Rw", "STC"],
        reviewStatus: "ready",
        route: "wall",
        snapshotSignature: "workbench-snapshot:abc",
        source: "calculator_preview"
      }
    });
    expect(result.ok && result.packet.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "rockwool",
      "gypsum_board"
    ]);
  });

  it("blocks numeric review from calculator preview when the row is not live", () => {
    const preview: WorkbenchV2CalculatorAssistantPreview = {
      ...readyPreview(),
      calculationSummary: {
        primaryOutput: "Rw",
        selectedOutputs: ["Rw"],
        status: "needs_input"
      },
      outputRows: [
        { detail: "Needs support spacing", label: "Rw", status: "needs_input", value: "--" }
      ],
      tasks: [
        {
          detail: "Enter support spacing before preview.",
          id: "support-spacing-missing",
          label: "Support spacing",
          source: "calculator_route"
        }
      ]
    };

    const result = buildReportAssistantCurrentCalculatorReviewPacketFromCalculatorPreview({
      outputId: "Rw",
      preview
    });

    expect(result).toMatchObject({
      ok: true,
      packet: {
        missingInputs: ["Support spacing"],
        numericReviewAllowed: false,
        numericReviewBlocker: "Missing calculator inputs: Support spacing.",
        reviewStatus: "needs_input"
      }
    });
  });
});
