import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalFilename } from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalConstructionSection } from "./simple-workbench-proposal-construction-section";

type SimplePdfStandardReference = {
  code: string;
  detail: string;
  label: string;
};

type SimpleCurveFigure = NonNullable<SimpleWorkbenchProposalDocument["responseCurves"]>[number];
type SimpleCurveSeries = SimpleCurveFigure["series"][number];

const MAX_SIMPLE_CITATIONS = 4;
const MAX_SIMPLE_LAYER_ROWS = 8;
const MAX_SIMPLE_ASSUMPTIONS = 5;
const MAX_SIMPLE_WARNINGS = 5;
const MAX_SIMPLE_METRICS = 6;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugMetricLabels(document: SimpleWorkbenchProposalDocument): string[] {
  return [...document.metrics, ...document.coverageItems]
    .map((item) => item.label.trim().toLowerCase())
    .filter((label) => label.length > 0);
}

function hasMetricLabel(labels: readonly string[], matchers: readonly RegExp[]): boolean {
  return labels.some((label) => matchers.some((matcher) => matcher.test(label)));
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
  const section = buildSimpleWorkbenchProposalConstructionSection(document.layers, document.studyModeLabel);

  if (section.bands.length === 0) {
    return `<div class="construction-empty">No construction data available.</div>`;
  }

  return `
    <div class="construction-sheet">
      <div class="construction-axis">
        <span>${escapeHtml(section.anchorFromLabel)}</span>
        <span>${escapeHtml(section.totalThicknessLabel)}</span>
      </div>
      <div class="construction-stack ${section.isWall ? "construction-stack-wall" : "construction-stack-floor"}">
        ${section.bands
          .map(
            (band) => `
              <div class="construction-band construction-band-${band.tone}" style="flex-grow:${band.flexGrow};">
                <div class="construction-band-index">${escapeHtml(band.indexLabel)}</div>
                <div class="construction-band-copy">
                  <strong>${escapeHtml(band.label)}</strong>
                  <small>${escapeHtml(band.metaLabel)} · ${escapeHtml(band.thicknessLabel)}</small>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="construction-axis">
        <span>${escapeHtml(section.anchorToLabel)}</span>
        <span>${escapeHtml(section.headline)}</span>
      </div>
    </div>
  `;
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

function getCurveSeriesColor(series: SimpleCurveSeries): string {
  if (series.active) {
    return "#111111";
  }

  switch (series.id) {
    case "airborne":
      return "#4b4b4b";
    case "field":
      return "#8a8a8a";
    case "standardized":
      return "#262626";
    case "source":
    default:
      return "#6a6a6a";
  }
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
            <text class="curve-axis-label" x="${x.toFixed(2)}" y="${(height - marginBottom + 16).toFixed(2)}" text-anchor="middle">${escapeHtml(String(frequencyHz))}</text>
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
          <div class="curve-shell">
            ${renderSimpleCurveSvg(figure)}
          </div>
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
  const standardReferences = inferStandardReferences(document);
  const visibleMetrics = document.metrics.slice(0, MAX_SIMPLE_METRICS);
  const visibleLayers = document.layers.slice(0, MAX_SIMPLE_LAYER_ROWS);
  const visibleCitations = document.citations.slice(0, MAX_SIMPLE_CITATIONS);
  const visibleAssumptions = document.assumptionItems.slice(0, MAX_SIMPLE_ASSUMPTIONS);
  const visibleWarnings = document.warnings.slice(0, MAX_SIMPLE_WARNINGS);

  const hasNotes =
    visibleCitations.length > 0 ||
    visibleAssumptions.length > 0 ||
    document.briefNote.trim().length > 0;
  const hasSecondPage =
    document.layers.length > 0 || hasNotes || visibleWarnings.length > 0;

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

  const layerRows =
    visibleLayers.length > 0
      ? visibleLayers
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
          .join("")
      : "";

  const standardCodes = standardReferences.map((r) => r.code).join(" · ");

  const curvesHtml = renderSimpleCurveFigures(document);

  const sourceItems =
    visibleCitations.length > 0
      ? visibleCitations
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

  const noteAndAssumptionItems = [
    ...(document.briefNote.trim().length > 0
      ? [`<li><strong>Consultant note</strong><span>${escapeHtml(document.briefNote.trim())}</span></li>`]
      : []),
    ...visibleAssumptions.map(
      (item) => `<li><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></li>`
    )
  ].join("");

  const warningItems =
    visibleWarnings.length > 0
      ? visibleWarnings.map((warning) => `<li><strong>Warning</strong><span>${escapeHtml(warning)}</span></li>`).join("")
      : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(buildSimpleWorkbenchProposalFilename(document.projectName))}-simple</title>
    <style>
      :root {
        color-scheme: light;
        --paper: #ffffff;
        --panel: #ffffff;
        --panel-soft: #f5f5f5;
        --ink: #111111;
        --ink-soft: #444444;
        --ink-faint: #6a6a6a;
        --line: #cfcfcf;
        --line-strong: #9a9a9a;
        --accent: #1d3557;
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
        font-family: Arial, Helvetica, sans-serif;
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
        font-size: 22px;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }

      .report-subject {
        margin: 0;
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
        border-color: var(--ink);
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

      .curve-shell {
        margin-top: 2mm;
        border: 1px solid var(--line);
        padding: 1.5mm;
      }

      .curve-plot {
        display: block;
        width: 100%;
        height: auto;
      }

      .curve-grid-line {
        stroke: #dddddd;
        stroke-width: 1;
      }

      .curve-grid-line-vertical {
        stroke: #eeeeee;
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

      .construction-axis {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 3mm;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .construction-stack {
        margin: 3mm 0;
        overflow: hidden;
        border: 1px solid var(--line-strong);
        background: #ffffff;
      }

      .construction-stack-floor {
        display: flex;
        flex-direction: column;
        min-height: 52mm;
      }

      .construction-stack-wall {
        display: flex;
        min-height: 38mm;
      }

      .construction-band {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 2.5mm;
        align-items: center;
        border-bottom: 1px solid rgba(18, 37, 35, 0.14);
        border-right: 1px solid rgba(18, 37, 35, 0.14);
        padding: 2.5mm;
      }

      .construction-band:last-child {
        border-bottom: 0;
        border-right: 0;
      }

      .construction-band-leading {
        background: #f2f2f2;
      }

      .construction-band-interior {
        background: #ffffff;
      }

      .construction-band-trailing {
        background: #ebebeb;
      }

      .construction-band-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 5mm;
        height: 5mm;
        border: 1px solid rgba(18, 37, 35, 0.2);
        background: #ffffff;
        font-size: 8px;
        font-weight: 700;
      }

      .construction-band-copy strong {
        display: block;
        font-size: 10px;
        line-height: 1.2;
      }

      .construction-band-copy small {
        display: block;
        margin-top: 0.5mm;
        font-size: 9px;
        line-height: 1.3;
        color: var(--ink-soft);
      }

      .construction-empty {
        border: 1px dashed var(--line);
        padding: 4mm;
        font-size: 10px;
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
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 10px;
      }

      th,
      td {
        border: 1px solid var(--line);
        padding: 1.8mm;
        text-align: left;
        vertical-align: top;
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
          <div class="report-kicker">DAC Acoustic Report · Simple Issue</div>
          <div class="report-title-row">
            <div>
              <h1>Acoustic Summary Sheet</h1>
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
              <strong>Project</strong>
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
          <article class="result-card result-card-primary">
            <strong>Primary answer</strong>
            <span>${escapeHtml(document.primaryMetricLabel)} ${escapeHtml(document.primaryMetricValue)}</span>
            <small>${escapeHtml(document.executiveSummary)}</small>
          </article>
          <article class="result-card">
            <strong>Route</strong>
            <span>${escapeHtml(document.dynamicBranchLabel)}</span>
          </article>
          <article class="result-card">
            <strong>Validation</strong>
            <span>${escapeHtml(document.validationLabel)}</span>
          </article>
          <article class="result-card">
            <strong>Assembly</strong>
            <span>${document.layers.length} layer${document.layers.length === 1 ? "" : "s"}</span>
          </article>
        </section>

        ${curvesHtml ? `
        <section class="panel">
          <div class="panel-title">Frequency response</div>
          <div class="curve-grid">
            ${curvesHtml}
          </div>
        </section>
        ` : ""}

        <section class="page-grid">
          <section class="table-panel">
            <div class="table-title">Calculated indices</div>
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
            <div class="table-title">Layer schedule</div>
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
            <div class="table-title">Method</div>
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
          <span>${escapeHtml(standardCodes)} · ${escapeHtml(document.proposalReference)}</span>
        </footer>
      </section>

      ${
        hasSecondPage
          ? `
        <section class="page">
          ${document.layers.length > 0 ? `
          <section class="page-grid page-grid-wide">
            <section class="panel">
              <div class="panel-title">Construction section</div>
              ${renderConstructionFigure(document)}
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
                </tbody>
              </table>
            </section>
          </section>
          ` : ""}

          ${hasNotes ? `
          <section class="notes-grid">
            ${sourceItems ? `
            <section class="notes-panel">
              <div class="table-title">Sources</div>
              <ul>${sourceItems}</ul>
            </section>
            ` : ""}
            ${noteAndAssumptionItems ? `
            <section class="notes-panel">
              <div class="table-title">Notes &amp; assumptions</div>
              <ul>${noteAndAssumptionItems}</ul>
            </section>
            ` : ""}
          </section>
          ` : ""}

          ${warningItems ? `
          <section class="notes-panel">
            <div class="table-title">Warnings</div>
            <ul>${warningItems}</ul>
          </section>
          ` : ""}

          <p class="footnote">
            This sheet summarises a calculator estimate and does not replace accredited laboratory or field measurements.
          </p>

          <footer class="page-footer">
            <span>${escapeHtml(document.issueBaseReference)}</span>
            <span>${escapeHtml(document.consultantCompany)} · Simple issue</span>
          </footer>
        </section>
      `
          : ""
      }
    </main>
  </body>
</html>`;
}
