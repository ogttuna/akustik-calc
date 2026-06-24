import React from "react";

import {
  createReportAssistantResultCardModel,
  formatReportAssistantResultToken
} from "./report-assistant-result-card-model";
import type { ReportAssistantResultEnvelope } from "./report-assistant-result-contract";
import { resolveWorkbenchRequiredInputPresentation } from "./route-input-presentation";
import type { WorkbenchV2CalculatorAssistantPreview } from "../workbench-rebuild/workbench-v2-calculator-assistant";

const SOURCE_REVIEW_SUMMARY_EVIDENCE_LABELS = new Set([
  "Calculator value",
  "Citation count",
  "Comparability",
  "Review source",
  "Review verdict",
  "Source quality",
  "Source range",
  "Suggested report value",
  "Value reviewed"
]);

function getResultEvidenceDetail(result: ReportAssistantResultEnvelope, label: string): string | undefined {
  return result.evidence.find((entry) => entry.label === label)?.detail;
}

function getVisibleAssistantTaskCopy(task: ReportAssistantResultEnvelope["tasks"][number]): {
  detail: string;
  label: string;
} {
  const presentation = resolveWorkbenchRequiredInputPresentation(task.code, {
    fallbackDetail: task.message,
    severity: task.severity === "info" ? "info" : "warning"
  });
  const rawTail = task.code.split(":").at(-1) ?? task.code;
  const messageContainsRawCode = task.message.includes(task.code) || task.message.includes(rawTail);
  const hasOwnedPresentation =
    presentation.targetFields.length > 0 || Boolean(presentation.targetIntent) || Boolean(presentation.actionLabel);
  const messageLooksLikeRawValidation = /\b(number must|expected|required|too_small|too_big|invalid)\b/iu.test(task.message);

  // AGENT COORDINATION 2026-06-24 (Codex): result envelopes keep raw
  // task.code for trace/eval compatibility; this render path owns the
  // user-visible copy so raw engine ids and low-level validation text are not
  // primary UI labels/details when a route-input presentation is known.
  return {
    detail: messageContainsRawCode || (hasOwnedPresentation && messageLooksLikeRawValidation)
      ? presentation.detail
      : task.message,
    label: presentation.label
  };
}

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

function AssistantSourceReviewSummaryBlock(props: {
  result: ReportAssistantResultEnvelope;
}) {
  if (props.result.rendererKind !== "research_review_card") {
    return null;
  }

  const calculatorValue = getResultEvidenceDetail(props.result, "Calculator value");
  const verdict = getResultEvidenceDetail(props.result, "Review verdict");
  const comparability = getResultEvidenceDetail(props.result, "Comparability");
  const sourceQuality = getResultEvidenceDetail(props.result, "Source quality");
  const citationCount = getResultEvidenceDetail(props.result, "Citation count");
  const sourceRange = getResultEvidenceDetail(props.result, "Source range");
  const suggestedReportValue = getResultEvidenceDetail(props.result, "Suggested report value");

  return (
    <div className="report-assistant-source-review-summary">
      <div className="report-assistant-source-review-main">
        <span>
          <strong>{calculatorValue ?? "Not available"}</strong>
          <small>Calculator result</small>
        </span>
        <span>
          <strong>{verdict ? formatReportAssistantResultToken(verdict) : "Review pending"}</strong>
          <small>Research verdict</small>
        </span>
        <span>
          <strong>{suggestedReportValue ?? "No advisory value"}</strong>
          <small>Suggested report value</small>
        </span>
      </div>
      <div className="report-assistant-source-review-meta">
        <span>{comparability ? formatReportAssistantResultToken(comparability) : "comparability unknown"}</span>
        <span>{sourceQuality ? formatReportAssistantResultToken(sourceQuality) : "source quality unknown"}</span>
        <span>{citationCount ?? "0"} source{citationCount === "1" ? "" : "s"}</span>
        {sourceRange ? <span>{sourceRange}</span> : null}
      </div>
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
  const traceEvidence = result.rendererKind === "research_review_card"
    ? result.evidence.filter((entry) => !SOURCE_REVIEW_SUMMARY_EVIDENCE_LABELS.has(entry.label))
    : result.evidence;

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

      <AssistantSourceReviewSummaryBlock result={result} />

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
            {result.tasks.map((task) => {
              const visibleTask = getVisibleAssistantTaskCopy(task);

              return (
                <div className="calc-task-row calc-assistant-task-row" data-severity={task.severity} key={task.code}>
                  <span>
                    <strong>{visibleTask.label}</strong>
                    <small>{visibleTask.detail}</small>
                  </span>
                  <em>{task.severity}</em>
                </div>
              );
            })}
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

      {traceEvidence.length > 0 || result.sourceTrace.length > 0 ? (
        <div className="report-assistant-result-section">
          <strong>Trace</strong>
          <div className="report-assistant-result-trace">
            {result.sourceTrace.map((trace, index) => (
              <span key={`${trace.kind}-${trace.label}-${index}`}>
                <strong>{formatReportAssistantResultToken(trace.kind)}</strong>
                <small>{trace.detail ? `${trace.label}: ${trace.detail}` : trace.label}</small>
              </span>
            ))}
            {traceEvidence.map((entry, index) => (
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
