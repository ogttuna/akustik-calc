import React from "react";

import {
  createReportAssistantResultCardModel,
  formatReportAssistantResultToken
} from "./report-assistant-result-card-model";
import type { ReportAssistantResultEnvelope } from "./report-assistant-result-contract";
import type { WorkbenchV2CalculatorAssistantPreview } from "../workbench-rebuild/workbench-v2-calculator-assistant";

export function AssistantCalculatorPreviewBlock(props: {
  preview: WorkbenchV2CalculatorAssistantPreview;
}) {
  const summary = props.preview.calculationSummary;
  const routeLabel =
    props.preview.engineSummary?.calculatorLabel ??
    props.preview.engineSummary?.calculatorId ??
    props.preview.engineSummary?.method;
  const layers = props.preview.describedConfiguration?.layers ?? [];

  return (
    <div className="report-assistant-calculator-preview" data-status={summary.status}>
      <div className="calc-assistant-preview-summary" data-status={summary.status}>
        <span>
          <strong>{summary.primaryValueLabel ?? summary.status}</strong>
          <small>{summary.primaryOutput ?? "Calculator preview"}</small>
        </span>
        <span>
          <strong>{props.preview.requestedSnapshot.layerCount}</strong>
          <small>Layers</small>
        </span>
        <span>
          <strong>{summary.selectedOutputs.length}</strong>
          <small>Outputs</small>
        </span>
        <span>
          <strong>{props.preview.tasks.length}</strong>
          <small>Tasks</small>
        </span>
      </div>

      {layers.length > 0 ? (
        <div className="report-assistant-calculator-stack">
          {layers.map((layer, index) => (
            <span key={`${layer.materialId}-${index}`}>
              <strong>{index + 1}. {layer.materialName}</strong>
              <small>{layer.thicknessMm} mm / {layer.role}</small>
            </span>
          ))}
        </div>
      ) : null}

      {routeLabel ? (
        <div className="calc-assistant-route-summary">
          <span>
            <strong>{routeLabel}</strong>
            <small>Route</small>
          </span>
          <span>
            <strong>{props.preview.engineSummary?.supportedTargetOutputs.length ?? 0}</strong>
            <small>Supported</small>
          </span>
          <span>
            <strong>{props.preview.engineSummary?.unsupportedTargetOutputs.length ?? 0}</strong>
            <small>Unsupported</small>
          </span>
        </div>
      ) : null}

      {props.preview.outputRows.length > 0 ? (
        <div className="calc-output-rows">
          {props.preview.outputRows.map((row) => (
            <div className="calc-output-row" data-status={row.status} key={row.label}>
              <span>
                <strong>{row.label}</strong>
                <small>{row.detail}</small>
              </span>
              <em>{row.value}</em>
            </div>
          ))}
        </div>
      ) : null}

      {props.preview.tasks.length > 0 ? (
        <div className="calc-task-list">
          {props.preview.tasks.map((task) => (
            <div className="calc-task-row calc-assistant-task-row" key={task.id}>
              <span>
                <strong>{task.label}</strong>
                <small>{task.detail}</small>
              </span>
              <em>{task.source}</em>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AssistantResultCard(props: {
  calculatorPreview?: WorkbenchV2CalculatorAssistantPreview;
  result: ReportAssistantResultEnvelope;
}) {
  const result = props.result;
  const card = createReportAssistantResultCardModel(result);
  const calculatorPreview = props.calculatorPreview;
  const showCalculatorPreview = card.rendersCalculatorPreview && calculatorPreview;

  return (
    <div
      className="report-assistant-result-card"
      data-authority={result.authority}
      data-renderer={result.rendererKind}
      data-route-status={result.routeStatus}
      data-tone={card.tone}
    >
      <div className="report-assistant-result-card-head">
        <span>
          <strong>{card.rendererLabel}</strong>
          <small>{result.capabilityName}</small>
        </span>
        <em>{card.routeStatusLabel}</em>
      </div>

      <div className="report-assistant-result-meta">
        {card.metaRows.map((row) => (
          <span key={row.label}>
            <strong>{row.value}</strong>
            <small>{row.label}</small>
          </span>
        ))}
      </div>

      {result.confidenceReason ? (
        <p className="report-assistant-result-note">{result.confidenceReason}</p>
      ) : null}

      {showCalculatorPreview ? <AssistantCalculatorPreviewBlock preview={calculatorPreview} /> : null}

      {result.basis.length > 0 ? (
        <div className="report-assistant-result-section">
          <strong>Metric basis</strong>
          <div className="calc-output-rows">
            {result.basis.map((basis) => (
              <div className="calc-output-row" data-status={basis.routeStatus} key={`${basis.metricId}-${basis.basis}`}>
                <span>
                  <strong>{basis.metricId}</strong>
                  <small>{basis.basis}</small>
                </span>
                <em>{basis.valueLabel ?? basis.unit ?? basis.routeStatus}</em>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.tasks.length > 0 ? (
        <div className="report-assistant-result-section">
          <strong>Tasks</strong>
          <div className="calc-task-list">
            {result.tasks.map((task) => (
              <div className="calc-task-row calc-assistant-task-row" data-severity={task.severity} key={task.code}>
                <span>
                  <strong>{task.code}</strong>
                  <small>{task.message}</small>
                </span>
                <em>{task.severity}</em>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.warnings.length > 0 ? (
        <div className="report-assistant-result-section">
          <strong>Warnings</strong>
          <ul className="report-assistant-result-list">
            {result.warnings.map((warning, index) => (
              <li key={`${warning}-${index}`}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.evidence.length > 0 || result.sourceTrace.length > 0 ? (
        <div className="report-assistant-result-section">
          <strong>Trace</strong>
          <div className="report-assistant-result-trace">
            {result.sourceTrace.map((trace, index) => (
              <span key={`${trace.kind}-${trace.label}-${index}`}>
                <strong>{formatReportAssistantResultToken(trace.kind)}</strong>
                <small>{trace.detail ? `${trace.label}: ${trace.detail}` : trace.label}</small>
              </span>
            ))}
            {result.evidence.map((entry, index) => (
              <span key={`${entry.label}-${index}`}>
                <strong>{entry.label}</strong>
                <small>{entry.detail ?? entry.href ?? "Evidence"}</small>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
