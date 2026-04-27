import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import {
  buildSimpleWorkbenchProposalFilename,
  getVisibleProposalMetrics,
  isPrimaryProposalMetricVisible
} from "./simple-workbench-proposal";
import { getSimpleWorkbenchProposalBranding } from "./simple-workbench-proposal-branding";
import {
  buildSimpleWorkbenchProposalConstructionRender,
  SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME,
  SIMPLE_WORKBENCH_REPORT_SERIES
} from "./simple-workbench-proposal-reporting";
import { buildSimpleWorkbenchReportMarkSvgMarkup } from "./simple-workbench-report-mark";

type SimplePdfStandardReference = {
  code: string;
  detail: string;
  label: string;
};

type SimpleCurveFigure = NonNullable<SimpleWorkbenchProposalDocument["responseCurves"]>[number];
type SimpleCurveSeries = SimpleCurveFigure["series"][number];
type SimpleCurveReadout = {
  label: string;
  note: string;
  valueLabel: string;
};

const MAX_SIMPLE_CITATIONS = 4;
const MAX_SIMPLE_LAYER_ROWS = 8;
const MAX_SIMPLE_ASSUMPTIONS = 5;
const MAX_SIMPLE_WARNINGS = 5;
const MAX_SIMPLE_METRICS = 6;

const SIMPLE_CURVE_BANDS = [
  {
    fill: "rgba(189, 109, 63, 0.08)",
    id: "low",
    label: "Low",
    note: "63-250 Hz",
    x1: 63,
    x2: 250
  },
  {
    fill: "rgba(44, 127, 118, 0.08)",
    id: "speech",
    label: "Speech",
    note: "500-1k Hz",
    x1: 500,
    x2: 1000
  },
  {
    fill: "rgba(163, 108, 54, 0.08)",
    id: "high",
    label: "High",
    note: "2k-4k Hz",
    x1: 2000,
    x2: 4000
  }
] as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugMetricLabels(document: SimpleWorkbenchProposalDocument): string[] {
  return [
    ...(isPrimaryProposalMetricVisible(document) ? [{ label: document.primaryMetricLabel }] : []),
    ...getVisibleProposalMetrics(document),
    ...document.coverageItems
  ]
    .map((item) => item.label.trim().toLowerCase())
    .filter((label) => label.length > 0);
}

function hasMetricLabel(labels: readonly string[], matchers: readonly RegExp[]): boolean {
  return labels.some((label) => matchers.some((matcher) => matcher.test(label)));
}

function formatSimpleCoverageStatus(status: SimpleWorkbenchProposalDocument["coverageItems"][number]["status"]): string {
  switch (status) {
    case "live":
      return "Live now";
    case "bound":
      return "Conservative bound";
    case "needs_input":
      return "Needs input";
    case "unsupported":
    default:
      return "Unsupported on lane";
  }
}

function hasFieldAirborne(document: SimpleWorkbenchProposalDocument, labels: readonly string[]): boolean {
  if (hasMetricLabel(labels, [/^r'w$/u, /^dnt,w$/u, /^dnt,a$/u])) {
    return true;
  }

  const joined = [
    document.contextLabel,
    document.dynamicBranchDetail,
    document.validationDetail,
    document.methodDossierHeadline,
    document.corridorDossierHeadline,
    ...document.citations.map((citation) => `${citation.label} ${citation.detail}`),
    ...document.methodTraceGroups.flatMap((group) => [group.label, group.detail, ...group.notes])
  ]
    .join(" ")
    .toLowerCase();

  return joined.includes("field airborne") || joined.includes("room-to-room field") || joined.includes("field route");
}

function hasFieldImpact(document: SimpleWorkbenchProposalDocument, labels: readonly string[]): boolean {
  if (hasMetricLabel(labels, [/^l'n,w$/u, /^l'nt,w$/u, /^l'nt,50$/u])) {
    return true;
  }

  const joined = [
    document.contextLabel,
    document.dynamicBranchDetail,
    document.validationDetail,
    document.methodDossierHeadline,
    document.corridorDossierHeadline,
    ...document.citations.map((citation) => `${citation.label} ${citation.detail}`),
    ...document.methodTraceGroups.flatMap((group) => [group.label, group.detail, ...group.notes])
  ]
    .join(" ")
    .toLowerCase();

  return (
    joined.includes("field impact") ||
    joined.includes("field-side") ||
    joined.includes("standardized room volume") ||
    joined.includes("field continuation")
  );
}

function inferStandardReferences(document: SimpleWorkbenchProposalDocument): SimplePdfStandardReference[] {
  const labels = slugMetricLabels(document);
  const standards: SimplePdfStandardReference[] = [];
  const hasAirborne = hasMetricLabel(labels, [/^rw$/u, /^r'w$/u, /^dnt,w$/u, /^dnt,a$/u, /^c$/u, /^ctr$/u]);
  const hasImpact = hasMetricLabel(labels, [/^ln,w$/u, /^l'n,w$/u, /^l'nt,w$/u, /^l'nt,50$/u, /^ci(?:,50-2500)?$/u, /^deltalw$/u]);
  const fieldAirborne = hasFieldAirborne(document, labels);
  const fieldImpact = hasFieldImpact(document, labels);
  const routeJoined = [
    document.studyModeLabel,
    document.dynamicBranchLabel,
    document.dynamicBranchDetail,
    document.validationLabel,
    document.validationDetail,
    document.executiveSummary,
    document.methodDossierHeadline,
    document.corridorDossierHeadline,
    ...document.methodTraceGroups.flatMap((group) => [group.label, group.detail, ...group.notes])
  ]
    .join(" ")
    .toLowerCase();

  if (hasAirborne) {
    standards.push({
      code: "ISO 717-1",
      detail: "Weighted airborne sound insulation rating",
      label: "Weighted airborne ratings"
    });
  }

  if (hasImpact) {
    standards.push({
      code: "ISO 717-2",
      detail: "Weighted impact sound insulation rating",
      label: "Weighted impact ratings"
    });
  }

  if (fieldAirborne) {
    standards.push({
      code: "ISO 16283-1",
      detail: "Field measurement of airborne sound insulation",
      label: "Field airborne route"
    });
  }

  if (fieldImpact) {
    standards.push({
      code: "ISO 16283-2",
      detail: "Field measurement of impact sound insulation",
      label: "Field impact route"
    });
  }

  if (
    routeJoined.includes("estimate") ||
    routeJoined.includes("floating floor") ||
    routeJoined.includes("bare floor") ||
    routeJoined.includes("standardized room volume") ||
    routeJoined.includes("predictor")
  ) {
    standards.push({
      code: document.studyModeLabel.trim().toLowerCase().includes("wall") ? "ISO 12354-1" : "ISO 12354-2",
      detail: "Building acoustics prediction model",
      label: "Prediction route"
    });
  }

  if (standards.length === 0) {
    standards.push({
      code: "Standards",
      detail: "Explicit route disclosure",
      label: "Explicit route disclosure"
    });
  }

  return standards;
}

function renderConstructionFigure(document: SimpleWorkbenchProposalDocument): string {
  const construction = buildSimpleWorkbenchProposalConstructionRender(document.layers, document.studyModeLabel, {
    totalThicknessLabelOverride: document.constructionTotalThicknessOverrideLabel
  });
  return construction.section.bands.length > 0 ? construction.svgMarkup : "";
}

function collectCurveFrequencies(figure: SimpleCurveFigure): number[] {
  return Array.from(
    new Set(figure.series.flatMap((series) => series.frequenciesHz.filter((value) => Number.isFinite(value) && value > 0)))
  ).sort((left, right) => left - right);
}

function buildCurveValueDomain(figure: SimpleCurveFigure) {
  const values = figure.series.flatMap((series) => series.valuesDb.filter((value) => Number.isFinite(value)));

  if (values.length === 0) {
    return { max: 70, min: 20 };
  }

  return {
    max: Math.ceil(Math.max(...values) / 5) * 5 + 5,
    min: Math.max(0, Math.floor(Math.min(...values) / 5) * 5 - 5)
  };
}

function formatCurveFrequencyLabel(frequencyHz: number): string {
  if (frequencyHz >= 1000) {
    const kiloHertz = frequencyHz / 1000;
    return `${Number.isInteger(kiloHertz) ? kiloHertz : kiloHertz.toFixed(kiloHertz >= 2 ? 1 : 2)}k`;
  }

  return String(frequencyHz);
}

function getCurveSeriesColor(series: SimpleCurveSeries): string {
  switch (series.id) {
    case "airborne":
      return "#bd6d3f";
    case "field":
      return "#a36c36";
    case "standardized":
      return "#2c7f76";
    case "source":
    default:
      return series.active ? "#233a4a" : "#526a78";
  }
}

function getActiveSimpleCurveSeries(figure: SimpleCurveFigure): SimpleCurveSeries | null {
  return figure.series.find((series) => series.id === figure.activeSeriesId) ?? figure.series[0] ?? null;
}

function findClosestSimpleCurvePoint(series: SimpleCurveSeries, targetHz: number): { frequencyHz: number; valueDb: number } | null {
  const pair = series.frequenciesHz
    .map((frequencyHz, index) => ({
      distance: Math.abs(frequencyHz - targetHz),
      frequencyHz,
      valueDb: series.valuesDb[index]
    }))
    .filter((entry) => Number.isFinite(entry.valueDb))
    .sort((left, right) => left.distance - right.distance)[0];

  if (!pair || !Number.isFinite(pair.valueDb)) {
    return null;
  }

  return {
    frequencyHz: pair.frequencyHz,
    valueDb: pair.valueDb
  };
}

function buildSimpleCurveReadouts(figure: SimpleCurveFigure): SimpleCurveReadout[] {
  const activeSeries = getActiveSimpleCurveSeries(figure);

  if (!activeSeries) {
    return [];
  }

  return [
    { label: "Low band", targetHz: 125 },
    { label: "Speech band", targetHz: 500 },
    { label: "High band", targetHz: 2000 }
  ]
    .map(({ label, targetHz }) => {
      const point = findClosestSimpleCurvePoint(activeSeries, targetHz);

      if (!point) {
        return null;
      }

      return {
        label,
        note: `${formatCurveFrequencyLabel(point.frequencyHz)} Hz`,
        valueLabel: `${point.valueDb.toFixed(1)} dB`
      };
    })
    .filter((entry): entry is SimpleCurveReadout => entry !== null);
}

function renderSimpleCurveReadoutStrip(figure: SimpleCurveFigure): string {
  const readouts = buildSimpleCurveReadouts(figure);

  if (readouts.length === 0) {
    return "";
  }

  return `
    <div class="curve-readouts">
      ${readouts
        .map(
          (readout) => `
            <div class="curve-readout-card">
              <strong>${escapeHtml(readout.label)}</strong>
              <span>${escapeHtml(readout.valueLabel)}</span>
              <small>${escapeHtml(readout.note)}</small>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderSimpleCurveSvg(figure: SimpleCurveFigure): string {
  const frequencies = collectCurveFrequencies(figure);

  if (frequencies.length === 0) {
    return "";
  }

  const width = 520;
  const height = 210;
  const marginTop = 14;
  const marginRight = 14;
  const marginBottom = 38;
  const marginLeft = 42;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;
  const minLog = Math.log10(Math.min(...frequencies));
  const maxLog = Math.log10(Math.max(...frequencies));
  const valueDomain = buildCurveValueDomain(figure);
  const valueRange = Math.max(1, valueDomain.max - valueDomain.min);
  const gridValues = Array.from(
    { length: Math.floor((valueDomain.max - valueDomain.min) / 10) + 1 },
    (_, index) => valueDomain.min + index * 10
  );

  const getX = (frequencyHz: number) => {
    if (maxLog === minLog) {
      return marginLeft + plotWidth / 2;
    }

    return marginLeft + ((Math.log10(frequencyHz) - minLog) / (maxLog - minLog)) * plotWidth;
  };

  const getY = (valueDb: number) => marginTop + ((valueDomain.max - valueDb) / valueRange) * plotHeight;

  return `
    <svg class="curve-plot" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(figure.title)}">
      ${SIMPLE_CURVE_BANDS
        .map((band) => {
          const startFrequency = Math.max(Math.min(...frequencies), band.x1);
          const endFrequency = Math.min(Math.max(...frequencies), band.x2);

          if (endFrequency <= startFrequency) {
            return "";
          }

          const x = getX(startFrequency);
          const bandWidth = Math.max(0, getX(endFrequency) - x);

          return `
            <rect fill="${band.fill}" x="${x.toFixed(2)}" y="${marginTop}" width="${bandWidth.toFixed(2)}" height="${plotHeight.toFixed(2)}"></rect>
            <text class="curve-band-label" x="${(x + bandWidth / 2).toFixed(2)}" y="${(marginTop + 10).toFixed(2)}" text-anchor="middle">${escapeHtml(band.label)}</text>
          `;
        })
        .join("")}
      ${gridValues
        .map((value) => {
          const y = getY(value);

          return `
            <line class="curve-grid-line" x1="${marginLeft}" x2="${width - marginRight}" y1="${y.toFixed(2)}" y2="${y.toFixed(2)}"></line>
            <text class="curve-axis-label" x="${marginLeft - 8}" y="${(y + 4).toFixed(2)}" text-anchor="end">${value}</text>
          `;
        })
        .join("")}
      ${frequencies
        .map((frequencyHz) => {
          const x = getX(frequencyHz);

          return `
            <line class="curve-grid-line curve-grid-line-vertical" x1="${x.toFixed(2)}" x2="${x.toFixed(2)}" y1="${marginTop}" y2="${height - marginBottom}"></line>
            <text class="curve-axis-label" x="${x.toFixed(2)}" y="${(height - marginBottom + 16).toFixed(2)}" text-anchor="middle">${escapeHtml(formatCurveFrequencyLabel(frequencyHz))}</text>
          `;
        })
        .join("")}
      <line class="curve-frame-line" x1="${marginLeft}" x2="${marginLeft}" y1="${marginTop}" y2="${height - marginBottom}"></line>
      <line class="curve-frame-line" x1="${marginLeft}" x2="${width - marginRight}" y1="${height - marginBottom}" y2="${height - marginBottom}"></line>
      ${figure.series
        .map((series) => {
          const points = series.frequenciesHz
            .map((frequencyHz, index) => {
              const value = series.valuesDb[index];

              if (!Number.isFinite(value)) {
                return null;
              }

              return `${getX(frequencyHz).toFixed(2)},${getY(value).toFixed(2)}`;
            })
            .filter((point): point is string => point !== null)
            .join(" ");
          const stroke = getCurveSeriesColor(series);

          return `
            <polyline fill="none" points="${points}" stroke="${stroke}" stroke-dasharray="${series.active ? "none" : "5 4"}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${series.active ? "2.6" : "1.7"}"></polyline>
            ${series.frequenciesHz
              .map((frequencyHz, index) => {
                const value = series.valuesDb[index];

                if (!Number.isFinite(value)) {
                  return "";
                }

                return `<circle cx="${getX(frequencyHz).toFixed(2)}" cy="${getY(value).toFixed(2)}" fill="${stroke}" r="${series.active ? "2.4" : "1.8"}"></circle>`;
              })
              .join("")}
          `;
        })
        .join("")}
      <text class="curve-axis-title" x="${(marginLeft + plotWidth / 2).toFixed(2)}" y="${(height - 6).toFixed(2)}" text-anchor="middle">Frequency (Hz)</text>
      <text class="curve-axis-title" transform="translate(12 ${(marginTop + plotHeight / 2).toFixed(2)}) rotate(-90)" text-anchor="middle">Level (dB)</text>
    </svg>
  `;
}

function renderSimpleCurveFigures(document: SimpleWorkbenchProposalDocument): string {
  const figures = (document.responseCurves ?? []).slice(0, 2);

  if (figures.length === 0) {
    return "";
  }

  return figures
    .map(
      (figure) => `
        <article class="curve-card">
          <div class="curve-head">
            <div>
              <strong>${escapeHtml(figure.title)}</strong>
              <span>${escapeHtml(figure.domainLabel)}</span>
            </div>
            <small>${escapeHtml(figure.direction === "lower_better" ? "Lower is better" : "Higher is better")}</small>
          </div>
          <div class="curve-band-strip">
            ${SIMPLE_CURVE_BANDS.map((band) => `<span class="curve-band-pill curve-band-pill-${band.id}">${escapeHtml(band.label)} · ${escapeHtml(band.note)}</span>`).join("")}
          </div>
          <div class="curve-shell">
            ${renderSimpleCurveSvg(figure)}
          </div>
          ${renderSimpleCurveReadoutStrip(figure)}
          <div class="curve-legend">
            ${figure.series
              .map(
                (series) => `
                  <div class="curve-legend-row">
                    <span class="curve-swatch" style="background:${getCurveSeriesColor(series)};"></span>
                    <strong>${escapeHtml(series.label)}</strong>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

export function buildSimpleWorkbenchProposalSimpleHtml(document: SimpleWorkbenchProposalDocument): string {
  const primaryMetricVisible = isPrimaryProposalMetricVisible(document);
  const branding = getSimpleWorkbenchProposalBranding({
    consultantCompany: document.consultantCompany,
    consultantWordmarkLine: document.consultantWordmarkLine,
    projectName: document.projectName,
    reportProfile: document.reportProfile,
    reportProfileLabel: document.reportProfileLabel
  });
  const reportMarkSvg = buildSimpleWorkbenchReportMarkSvgMarkup({
    accent: branding.accent,
    accentStrong: branding.accentStrong,
    ink: "#1c2f40",
    panel: "#fffdf9",
    variant: "symbol"
  });
  const standardReferences = inferStandardReferences(document);
  const visibleMetrics = getVisibleProposalMetrics(document).slice(0, MAX_SIMPLE_METRICS);
  const visibleLayers = document.layers.slice(0, MAX_SIMPLE_LAYER_ROWS);
  const hiddenLayerCount = Math.max(0, document.layers.length - visibleLayers.length);
  const visibleCitations = document.citations.slice(0, MAX_SIMPLE_CITATIONS);
  const visibleAssumptions = document.assumptionItems.slice(0, MAX_SIMPLE_ASSUMPTIONS);
  const visibleWarnings = document.warnings.slice(0, MAX_SIMPLE_WARNINGS);

  const metricRows =
    visibleMetrics.length > 0
      ? visibleMetrics
          .map(
            (metric) => `
              <tr>
                <td>${escapeHtml(metric.label)}</td>
                <td><strong>${escapeHtml(metric.value)}</strong></td>
                <td>${escapeHtml(metric.detail)}</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="3" style="color:var(--ink-faint)">—</td></tr>`;

  const coverageRows =
    document.coverageItems.length > 0
      ? document.coverageItems
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(item.label)}</td>
                <td>${escapeHtml(formatSimpleCoverageStatus(item.status))}</td>
                <td><strong>${escapeHtml(item.postureLabel)}</strong><br />${escapeHtml(item.postureDetail)}</td>
                <td>
                  <strong>${escapeHtml(item.value)}</strong><br />
                  ${escapeHtml(item.detail)}${item.nextStep ? `<br />Next action: ${escapeHtml(item.nextStep)}` : ""}
                </td>
              </tr>
            `
          )
          .join("")
      : `
              <tr>
                <td colspan="4" style="color:var(--ink-faint)">No output coverage register was packaged with this issue.</td>
              </tr>
            `;

  const layerRows =
    visibleLayers.length > 0
      ? `${visibleLayers
        .map(
          (layer) => `
              <tr>
                <td>${layer.index}</td>
                <td>${escapeHtml(layer.label)}</td>
                <td>${escapeHtml(layer.thicknessLabel)}</td>
                <td>${escapeHtml(layer.roleLabel ?? layer.categoryLabel)}</td>
              </tr>
            `
        )
        .join("")}${
        hiddenLayerCount > 0
          ? `
              <tr class="layer-overflow-note">
                <td colspan="4">${hiddenLayerCount} additional layer${hiddenLayerCount === 1 ? "" : "s"} omitted from this short-form layer table; the construction section still uses all ${document.layers.length} solver rows.</td>
              </tr>
            `
          : ""
      }`
      : "";

  const standardCodes = standardReferences.map((r) => r.code).join(" · ");

  const curvesHtml = renderSimpleCurveFigures(document);
  const construction = buildSimpleWorkbenchProposalConstructionRender(document.layers, document.studyModeLabel, {
    totalThicknessLabelOverride: document.constructionTotalThicknessOverrideLabel
  });
  const methodSnapshotItems = [
    {
      detail: document.dynamicBranchDetail,
      label: "Dynamic route",
      value: document.dynamicBranchLabel
    },
    {
      detail: document.validationDetail,
      label: "Validation posture",
      value: document.validationLabel
    },
    {
      detail: `${document.studyModeLabel} · ${document.contextLabel} · ${document.reportProfileLabel}`,
      label: "Study scope",
      value: primaryMetricVisible ? document.primaryMetricLabel : "Headline metric hidden"
    }
  ];
  const methodSnapshotHtml = methodSnapshotItems
    .map(
      (item) => `
        <li>
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.value)} · ${escapeHtml(item.detail)}</span>
        </li>
      `
    )
    .join("");
  const referenceBasisHtml = standardReferences
    .map(
      (reference) => `
        <li>
          <strong>${escapeHtml(reference.code)} · ${escapeHtml(reference.label)}</strong>
          <span>${escapeHtml(reference.detail)}</span>
        </li>
      `
    )
    .join("");

  const INTERNAL_SOURCE_PATTERNS = [
    /anchor/i, /delegate/i, /screening seed/i, /topology/i, /solver/i,
    /confidence/i, /sharp \(simple\)/i, /dynamic airborne/i, /operator/i
  ];
  const clientCitations = visibleCitations.filter(
    (citation) => !INTERNAL_SOURCE_PATTERNS.some((pattern) => pattern.test(citation.label) || pattern.test(citation.detail))
  );
  const sourceItems =
    clientCitations.length > 0
      ? clientCitations
          .map(
            (citation) => `
              <li>
                <strong>${escapeHtml(citation.label)}</strong>
                <span>${escapeHtml(citation.detail)}</span>
                ${citation.href ? `<span class="source-link">${escapeHtml(citation.href)}</span>` : ""}
              </li>
            `
          )
          .join("")
      : "";

  const INTERNAL_ASSUMPTION_PATTERNS = [
    /evidence posture/i, /active route/i, /issue frame/i, /live warning/i,
    /anchor is active/i, /sharp \(simple\)/i, /dynamic topology/i,
    /screening seed/i, /solver/i, /delegate/i, /operator deck/i
  ];
  const clientAssumptions = visibleAssumptions.filter(
    (item) => !INTERNAL_ASSUMPTION_PATTERNS.some((pattern) => pattern.test(item.label) || pattern.test(item.detail))
  );
  const noteAndAssumptionItems = [
    ...(document.briefNote.trim().length > 0
      ? [`<li><strong>Consultant note</strong><span>${escapeHtml(document.briefNote.trim())}</span></li>`]
      : []),
    ...clientAssumptions.map(
      (item) => `<li><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></li>`
    )
  ].join("");

  const hasNotes =
    clientCitations.length > 0 ||
    clientAssumptions.length > 0 ||
    document.briefNote.trim().length > 0;
  const warningItems =
    visibleWarnings.length > 0
      ? visibleWarnings.map((warning) => `<li><strong>Issue note</strong><span>${escapeHtml(warning)}</span></li>`).join("")
      : `<li><strong>Issue note</strong><span>No live warning flags are currently attached to the active route.</span></li>`;
  const hasSecondPage = true;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(buildSimpleWorkbenchProposalFilename(document.projectName))}-simple</title>
    <style>
      :root {
        color-scheme: light;
        --paper: #fcfcfb;
        --panel: #ffffff;
        --panel-soft: #f3f5f7;
        --ink: #182634;
        --ink-soft: #4b6177;
        --ink-faint: #738598;
        --line: #cfd7df;
        --line-strong: #8997a5;
        --accent: ${branding.accent};
        --accent-soft: ${branding.accentSoft};
        --accent-strong: ${branding.accentStrong};
      }

      @page {
        margin: 12mm;
        size: A4;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: var(--paper);
        color: var(--ink);
      }

      body {
        font-family: "Avenir Next", "Helvetica Neue", Arial, sans-serif;
      }

      .document {
        width: 100%;
      }

      .page {
        display: grid;
        gap: 4mm;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

      .report-header {
        display: grid;
        gap: 2.5mm;
        border-bottom: 1.2px solid var(--ink);
        padding-bottom: 3mm;
      }

      .report-kicker {
        display: flex;
        align-items: center;
        gap: 4mm;
        margin-bottom: 3mm;
      }

      .report-kicker-mark {
        width: 60px;
        height: 60px;
        flex: 0 0 auto;
      }

      .report-kicker-text {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink);
        line-height: 1.5;
      }

      .report-kicker-series {
        margin-top: 0.7mm;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .report-title-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 6mm;
        align-items: start;
      }

      .report-logo {
        display: block;
        max-width: 36mm;
        max-height: 12mm;
        object-fit: contain;
      }

      h1 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 24px;
        line-height: 1.06;
        letter-spacing: -0.03em;
      }

      .report-subject {
        margin: 1mm 0 0;
        font-size: 11px;
        line-height: 1.4;
        color: var(--ink-soft);
      }

      .report-meta {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 2mm;
      }

      .meta-item strong,
      .panel-title,
      .table-title {
        display: block;
        margin: 0;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .meta-item span {
        display: block;
        margin-top: 1mm;
        font-size: 10px;
        line-height: 1.4;
        color: var(--ink);
      }

      .result-strip {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
        gap: 2.5mm;
      }

      .result-card {
        border: 1px solid var(--line);
        background: #ffffff;
        padding: 2.5mm;
      }

      .result-card-primary {
        border-color: color-mix(in srgb, var(--accent) 45%, var(--ink));
        background: linear-gradient(180deg, #ffffff, var(--accent-soft));
      }

      .result-card strong {
        display: block;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .result-card span {
        display: block;
        margin-top: 1mm;
        font-size: 15px;
        line-height: 1.15;
        font-weight: 700;
      }

      .result-card small {
        display: block;
        margin-top: 1mm;
        font-size: 9.5px;
        line-height: 1.4;
        color: var(--ink-soft);
      }

      .page-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 3mm;
      }

      .page-grid-wide {
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
      }

      .curve-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 3mm;
      }

      .curve-card {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 251, 0.94));
        border-radius: 3.4mm;
        padding: 2.5mm;
      }

      .curve-head {
        display: flex;
        justify-content: space-between;
        gap: 3mm;
        align-items: start;
      }

      .curve-head strong {
        display: block;
        font-size: 10px;
        line-height: 1.3;
        color: var(--ink);
      }

      .curve-head span,
      .curve-head small,
      .curve-note {
        display: block;
        font-size: 9px;
        line-height: 1.4;
        color: var(--ink-soft);
      }

      .curve-band-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5mm;
        margin-top: 1.8mm;
      }

      .curve-band-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.8mm 1.5mm;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.88);
        font-size: 8px;
        line-height: 1.3;
        color: var(--ink-soft);
      }

      .curve-band-pill-low {
        border-color: rgba(189, 109, 63, 0.2);
        background: rgba(189, 109, 63, 0.08);
      }

      .curve-band-pill-speech {
        border-color: rgba(44, 127, 118, 0.18);
        background: rgba(44, 127, 118, 0.08);
      }

      .curve-band-pill-high {
        border-color: rgba(163, 108, 54, 0.18);
        background: rgba(163, 108, 54, 0.08);
      }

      .curve-shell {
        margin-top: 2mm;
        border: 1px solid var(--line);
        border-radius: 2.6mm;
        background: linear-gradient(180deg, rgba(247, 249, 251, 0.92), rgba(255, 255, 255, 0.98));
        padding: 1.5mm;
      }

      .curve-plot {
        display: block;
        width: 100%;
        height: auto;
      }

      .curve-grid-line {
        stroke: #d6dde3;
        stroke-width: 1;
        stroke-dasharray: 3 6;
      }

      .curve-grid-line-vertical {
        stroke: #ebeff2;
      }

      .curve-frame-line {
        stroke: #111111;
        stroke-width: 1;
      }

      .curve-axis-label,
      .curve-axis-title {
        fill: #666666;
        font-size: 9px;
        font-weight: 700;
      }

      .curve-axis-title {
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .curve-band-label {
        fill: #7a8792;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .curve-readouts {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.8mm;
        margin-top: 1.8mm;
      }

      .curve-readout-card {
        border: 1px solid var(--line);
        border-radius: 2.4mm;
        background: rgba(255, 255, 255, 0.84);
        padding: 1.4mm 1.6mm;
      }

      .curve-readout-card strong {
        display: block;
        font-size: 7.8px;
        line-height: 1.3;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .curve-readout-card span {
        display: block;
        margin-top: 0.8mm;
        font-size: 10.5px;
        line-height: 1.2;
        font-weight: 700;
        color: var(--ink);
      }

      .curve-readout-card small {
        display: block;
        margin-top: 0.6mm;
        font-size: 8px;
        line-height: 1.35;
        color: var(--ink-soft);
      }

      .curve-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 3mm;
        margin-top: 2mm;
      }

      .curve-legend-row {
        display: flex;
        gap: 1.5mm;
        align-items: center;
      }

      .curve-legend-row strong {
        font-size: 9px;
        line-height: 1.3;
      }

      .curve-swatch {
        width: 8px;
        height: 8px;
        flex: 0 0 8px;
      }

      .construction-figure-note {
        margin-top: 1.5mm;
        font-size: 9px;
        line-height: 1.5;
        color: var(--ink-soft);
      }

      .construction-summary {
        margin-top: 2mm;
        border: 1px solid var(--line);
        background: var(--panel-soft);
        padding: 2mm 2.4mm;
      }

      .construction-summary strong {
        display: block;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .construction-summary span {
        display: block;
        margin-top: 0.8mm;
        font-size: 13px;
        font-weight: 700;
        color: var(--ink);
      }

      .construction-summary small {
        display: block;
        margin-top: 0.8mm;
        font-size: 9px;
        line-height: 1.5;
        color: var(--ink-soft);
      }

      .notes-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 3mm;
      }

      .panel,
      .table-panel,
      .notes-panel {
        border: 1px solid var(--line);
        background: #ffffff;
        padding: 2.5mm;
        break-inside: avoid;
      }

      .standards-inline {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 2mm;
      }

      .standard-tag {
        display: inline-block;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 1.2mm 2.5mm;
        font: 600 8px/1.4 Arial, sans-serif;
        color: var(--ink-soft);
        background: var(--panel-soft);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 10px;
      }

      th,
      td {
        border: 1px solid var(--line);
        padding: 1.8mm;
        text-align: left;
        vertical-align: top;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      th {
        background: var(--panel-soft);
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      td {
        line-height: 1.4;
      }

      .layer-overflow-note td {
        color: var(--ink-soft);
        font-size: 9px;
        line-height: 1.5;
      }

      ul {
        margin: 0;
        padding-left: 4mm;
        display: grid;
        gap: 1.8mm;
      }

      li {
        line-height: 1.45;
      }

      li strong {
        display: block;
        font-size: 10px;
        line-height: 1.3;
      }

      li span {
        display: block;
        margin-top: 0.5mm;
        font-size: 9.5px;
        color: var(--ink-soft);
      }

      .source-link {
        color: var(--accent);
        word-break: break-all;
      }

      .footnote {
        font-size: 9px;
        line-height: 1.5;
        color: var(--ink-faint);
      }

      .page-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4mm;
        padding-top: 2mm;
        border-top: 1px solid var(--line);
        font-size: 9px;
        line-height: 1.4;
        color: var(--ink-faint);
      }

      @media (max-width: 900px) {
        .report-title-row,
        .report-meta,
        .result-strip,
        .page-grid,
        .curve-grid,
        .notes-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="document">
      <section class="page">
        <header class="report-header">
          <div class="report-kicker">
            <div class="report-kicker-mark">${reportMarkSvg}</div>
            <div>
              <div class="report-kicker-text">${escapeHtml(SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME)}</div>
              <div class="report-kicker-series">${escapeHtml(SIMPLE_WORKBENCH_REPORT_SERIES)}</div>
            </div>
          </div>
          <div class="report-title-row">
            <div>
              <h1>${escapeHtml(SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME)}</h1>
              <p class="report-subject">${escapeHtml(document.projectName)} · ${escapeHtml(document.proposalSubject)}</p>
            </div>
            ${document.consultantLogoDataUrl ? `<img class="report-logo" src="${escapeHtml(document.consultantLogoDataUrl)}" alt="${escapeHtml(document.consultantCompany)} logo" />` : ""}
          </div>
          <div class="report-meta">
            <div class="meta-item">
              <strong>Consultant</strong>
              <span>${escapeHtml(document.consultantCompany)}</span>
            </div>
            <div class="meta-item">
              <strong>Profile</strong>
              <span>${escapeHtml(document.reportProfileLabel)}</span>
            </div>
            <div class="meta-item">
              <strong>Issue</strong>
              <span>${escapeHtml(document.proposalReference)} · ${escapeHtml(document.proposalRevision)}</span>
            </div>
            <div class="meta-item">
              <strong>Issued to</strong>
              <span>${escapeHtml(document.proposalRecipient)}</span>
            </div>
            <div class="meta-item">
              <strong>Date</strong>
              <span>${escapeHtml(document.issuedOnLabel)}</span>
            </div>
            <div class="meta-item">
              <strong>Prepared by</strong>
              <span>${escapeHtml(document.preparedBy)}</span>
            </div>
          </div>
        </header>

        <section class="result-strip">
          ${
            primaryMetricVisible
              ? `
          <article class="result-card result-card-primary">
            <strong>Primary answer</strong>
            <span>${escapeHtml(document.primaryMetricLabel)} ${escapeHtml(document.primaryMetricValue)}</span>
            <small>${escapeHtml(document.executiveSummary)}</small>
          </article>
          `
              : ""
          }
          <article class="result-card">
            <strong>Dynamic route</strong>
            <span>${escapeHtml(document.dynamicBranchLabel)}</span>
            <small>${escapeHtml(document.dynamicBranchDetail)}</small>
          </article>
          <article class="result-card">
            <strong>Validation</strong>
            <span>${escapeHtml(document.validationLabel)}</span>
            <small>${escapeHtml(document.validationDetail)}</small>
          </article>
          <article class="result-card">
            <strong>Reference basis</strong>
            <span>${escapeHtml(standardCodes || "Explicit route disclosure")}</span>
            <small>${escapeHtml(document.studyModeLabel)} · ${escapeHtml(document.contextLabel)}</small>
          </article>
        </section>

        ${standardReferences.length > 0 ? `
        <div class="standards-inline">
          ${standardReferences.map((r) => `<span class="standard-tag">${escapeHtml(r.code)}</span>`).join(" ")}
        </div>
        ` : ""}

        ${curvesHtml ? `
        <section class="panel">
          <div class="panel-title">Frequency response curves</div>
          <div class="curve-grid">
            ${curvesHtml}
          </div>
        </section>
        ` : ""}

        <section class="page-grid">
          <section class="table-panel">
            <div class="table-title">Measured / predicted indices</div>
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Value</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                ${metricRows}
              </tbody>
            </table>
          </section>

          ${layerRows ? `
          <section class="table-panel">
            <div class="table-title">Visible layer schedule</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Material</th>
                  <th>Thickness</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                ${layerRows}
              </tbody>
            </table>
          </section>
          ` : `
          <section class="table-panel">
            <div class="table-title">Method snapshot</div>
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Route</td><td>${escapeHtml(document.dynamicBranchLabel)}</td></tr>
                <tr><td>Validation</td><td>${escapeHtml(document.validationLabel)}</td></tr>
                <tr><td>Scope</td><td>${escapeHtml(document.studyModeLabel)} · ${escapeHtml(document.contextLabel)}</td></tr>
              </tbody>
            </table>
          </section>
          `}
        </section>

        <footer class="page-footer">
          <span>${escapeHtml(document.consultantCompany)} · ${escapeHtml(document.reportProfileLabel)}</span>
          <span>${escapeHtml(standardCodes || SIMPLE_WORKBENCH_REPORT_SERIES)} · ${escapeHtml(document.proposalReference)}</span>
        </footer>
      </section>

      ${
        hasSecondPage
          ? `
        <section class="page">
          <section class="page-grid">
            <section class="notes-panel">
              <div class="table-title">Method basis</div>
              <ul>${methodSnapshotHtml}</ul>
            </section>
            <section class="notes-panel">
              <div class="table-title">Reference basis</div>
              <ul>${referenceBasisHtml}</ul>
            </section>
          </section>

          <section class="table-panel">
            <div class="table-title">Output coverage register</div>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Status</th>
                  <th>Evidence class</th>
                  <th>Current state</th>
                </tr>
              </thead>
              <tbody>
                ${coverageRows}
              </tbody>
            </table>
          </section>

          ${document.layers.length > 0 ? `
          <section class="panel">
            <div class="panel-title">Construction section</div>
            ${renderConstructionFigure(document)}
            <div class="construction-summary">
              <strong>Total thickness</strong>
              <span>${escapeHtml(construction.section.totalThicknessLabel)}</span>
              <small>${escapeHtml(construction.section.anchorFromLabel)} to ${escapeHtml(construction.section.anchorToLabel)} in solver order.</small>
            </div>
          </section>

          <section class="table-panel">
            <div class="table-title">Layer detail</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Material</th>
                  <th>Thickness</th>
                  <th>Density</th>
                  <th>Surface mass</th>
                </tr>
              </thead>
              <tbody>
                ${visibleLayers
                  .map(
                    (layer) => `
                      <tr>
                        <td>${layer.index}</td>
                        <td>${escapeHtml(layer.label)}</td>
                        <td>${escapeHtml(layer.thicknessLabel)}</td>
                        <td>${escapeHtml(layer.densityLabel ?? "—")}</td>
                        <td>${escapeHtml(layer.surfaceMassLabel ?? "—")}</td>
                      </tr>
                    `
                  )
                  .join("")}
                ${
                  hiddenLayerCount > 0
                    ? `
                      <tr class="layer-overflow-note">
                        <td colspan="5">${hiddenLayerCount} additional layer${hiddenLayerCount === 1 ? "" : "s"} omitted from this short-form detail table; the construction section still uses all ${document.layers.length} solver rows.</td>
                      </tr>
                    `
                    : ""
                }
              </tbody>
            </table>
          </section>
          ` : ""}

          ${hasNotes ? `
          <section class="notes-grid">
            ${sourceItems ? `
            <section class="notes-panel">
              <div class="table-title">Source notes</div>
              <ul>${sourceItems}</ul>
            </section>
            ` : ""}
            ${noteAndAssumptionItems ? `
            <section class="notes-panel">
              <div class="table-title">Consultant note and assumptions</div>
              <ul>${noteAndAssumptionItems}</ul>
            </section>
            ` : ""}
          </section>
          ` : ""}

          <section class="notes-panel">
            <div class="table-title">Warnings and issue guardrails</div>
            <ul>${warningItems}</ul>
          </section>

          <p class="footnote">
            This short-form report summarises the current ${escapeHtml(SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME)} reading. It states the active ISO basis, route posture, and visible build-up, but does not replace accredited laboratory or field measurements.
          </p>

          <footer class="page-footer">
            <span>${escapeHtml(document.issueBaseReference)}</span>
            <span>${escapeHtml(document.consultantCompany)} · Short-form issue</span>
          </footer>
        </section>
      `
          : ""
      }
    </main>
  </body>
</html>`;
}
