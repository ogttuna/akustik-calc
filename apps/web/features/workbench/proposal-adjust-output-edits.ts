import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

function normalizeOutputLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[’']/gu, "'")
    .replace(/\s+/gu, "");
}

function labelsMatch(left: string, right: string): boolean {
  return normalizeOutputLabel(left) === normalizeOutputLabel(right);
}

function applyOutputValueEdit(
  document: SimpleWorkbenchProposalDocument,
  label: string,
  value: string,
  options?: {
    metricIndex?: number;
    coverageIndex?: number;
  }
): SimpleWorkbenchProposalDocument {
  return {
    ...document,
    coverageItems: document.coverageItems.map((item, index) =>
      index === options?.coverageIndex || labelsMatch(item.label, label) ? { ...item, value } : item
    ),
    metrics: document.metrics.map((metric, index) =>
      index === options?.metricIndex || labelsMatch(metric.label, label) ? { ...metric, value } : metric
    ),
    primaryMetricValue: labelsMatch(document.primaryMetricLabel, label) ? value : document.primaryMetricValue
  };
}

export function applyPrimaryMetricLabelEdit(
  document: SimpleWorkbenchProposalDocument,
  label: string
): SimpleWorkbenchProposalDocument {
  const matchingOutput =
    document.metrics.find((metric) => labelsMatch(metric.label, label)) ??
    document.coverageItems.find((item) => labelsMatch(item.label, label));

  return {
    ...document,
    primaryMetricLabel: label,
    primaryMetricValue: matchingOutput?.value ?? document.primaryMetricValue
  };
}

export function applyPrimaryMetricValueEdit(
  document: SimpleWorkbenchProposalDocument,
  value: string
): SimpleWorkbenchProposalDocument {
  return applyOutputValueEdit(document, document.primaryMetricLabel, value);
}

export function applyProposalMetricLabelEdit(
  document: SimpleWorkbenchProposalDocument,
  metricIndex: number,
  label: string
): SimpleWorkbenchProposalDocument {
  const previousMetric = document.metrics[metricIndex];

  if (!previousMetric) {
    return document;
  }

  return {
    ...document,
    metrics: document.metrics.map((metric, index) => (index === metricIndex ? { ...metric, label } : metric)),
    primaryMetricLabel: labelsMatch(document.primaryMetricLabel, previousMetric.label) ? label : document.primaryMetricLabel
  };
}

export function applyProposalMetricValueEdit(
  document: SimpleWorkbenchProposalDocument,
  metricIndex: number,
  value: string
): SimpleWorkbenchProposalDocument {
  const metric = document.metrics[metricIndex];

  if (!metric) {
    return document;
  }

  return applyOutputValueEdit(document, metric.label, value, {
    metricIndex
  });
}

export function applyProposalCoverageLabelEdit(
  document: SimpleWorkbenchProposalDocument,
  coverageIndex: number,
  label: string
): SimpleWorkbenchProposalDocument {
  const previousItem = document.coverageItems[coverageIndex];

  if (!previousItem) {
    return document;
  }

  return {
    ...document,
    coverageItems: document.coverageItems.map((item, index) => (index === coverageIndex ? { ...item, label } : item)),
    primaryMetricLabel: labelsMatch(document.primaryMetricLabel, previousItem.label) ? label : document.primaryMetricLabel
  };
}

export function applyProposalCoverageValueEdit(
  document: SimpleWorkbenchProposalDocument,
  coverageIndex: number,
  value: string
): SimpleWorkbenchProposalDocument {
  const item = document.coverageItems[coverageIndex];

  if (!item) {
    return document;
  }

  return applyOutputValueEdit(document, item.label, value, {
    coverageIndex
  });
}
