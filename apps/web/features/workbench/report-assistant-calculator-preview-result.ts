import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultAuthority,
  type ReportAssistantResultEnvelope
} from "./report-assistant-result-contract";
import type {
  WorkbenchV2CalculatorAssistantPreview,
  WorkbenchV2CalculatorAssistantToolName
} from "../workbench-rebuild/workbench-v2-calculator-assistant";

export type ReportAssistantCalculatorPreviewResultInput = {
  name: WorkbenchV2CalculatorAssistantToolName;
  preview: WorkbenchV2CalculatorAssistantPreview;
};

function outputRowUnit(value: string): string | undefined {
  return value.includes("dB") ? "dB" : undefined;
}

function previewTasks(input: {
  preview: WorkbenchV2CalculatorAssistantPreview;
  routeStatus: WorkbenchV2CalculatorAssistantPreview["calculationSummary"]["status"];
}): {
  code: string;
  message: string;
  severity: "info" | "warning";
}[] {
  const severity: "info" | "warning" = input.routeStatus === "ready" ? "info" : "warning";
  const tasks = [
    ...input.preview.tasks.map((task) => ({
      code: task.id,
      message: `${task.label}: ${task.detail}`,
      severity
    })),
    ...(input.preview.layerStackDraft?.validation.missingInputs ?? []).map((missingInput) => ({
      code: missingInput.code,
      message: `${missingInput.message} ${missingInput.question}`,
      severity
    }))
  ];
  const seen = new Set<string>();

  return tasks.filter((task) => {
    if (seen.has(task.code)) {
      return false;
    }

    seen.add(task.code);
    return true;
  });
}

export function calculatorPreviewToAssistantResult(
  input: ReportAssistantCalculatorPreviewResultInput
): ReportAssistantResultEnvelope {
  const preview = input.preview;
  const routeStatus = preview.calculationSummary.status;
  const liveRows = preview.outputRows.filter((row) => row.status === "live");
  const basis = routeStatus === "ready"
    ? liveRows.map((row) => ({
        basis: preview.engineSummary?.calculatorId ?? preview.engineSummary?.method ?? "workbench_v2_calculator_preview",
        metricId: row.label,
        routeStatus: "ready" as const,
        unit: outputRowUnit(row.value),
        valueLabel: row.value
      }))
    : [];
  const authority: ReportAssistantResultAuthority = routeStatus === "ready" && basis.length > 0
    ? "calculator_backed"
    : routeStatus === "ready"
      ? "preview_only"
      : routeStatus;
  const previewWarnings = [
    ...(preview.describedConfiguration?.warnings ?? []),
    ...(preview.engineSummary?.warnings ?? [])
  ];

  return createReportAssistantResultEnvelope({
    authority,
    basis,
    capabilityName: input.name,
    confidenceReason: routeStatus === "ready"
      ? "The numeric rows are copied from the preview-only calculator route."
      : "The calculator preview route returned a non-numeric boundary.",
    evidence: [
      {
        label: input.name === "preview_workbench_v2_calculator_snapshot"
          ? "Calculator preview from Workbench V2 snapshot"
          : "Calculator preview from described layer configuration",
        detail: preview.calculationSummary.primaryOutput
          ? `Primary output: ${preview.calculationSummary.primaryOutput}`
          : undefined
      }
    ],
    routeStatus,
    sourceTrace: [
      {
        kind: "calculator_preview",
        label: input.name,
        detail: preview.engineSummary?.calculatorLabel ?? preview.engineSummary?.method
      }
    ],
    tasks: previewTasks({ preview, routeStatus }),
    warnings: previewWarnings
  });
}
