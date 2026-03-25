import type {
  SimpleWorkbenchProposalCoverageStatus,
  SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";
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
const MAX_SIMPLE_COVERAGE_ITEMS = 6;
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

function formatCoverageStatus(status: SimpleWorkbenchProposalCoverageStatus): string {
  switch (status) {
    case "live":
      return "Live now";
    case "bound":
      return "Bound";
    case "needs_input":
      return "Needs input";
    case "unsupported":
    default:
      return "Unsupported";
  }
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
      detail:
        "Weighted airborne indices on this sheet are stated in ISO 717-1 single-number rating language, including airborne adaptation terms where the active route supports them.",
      label: "Weighted airborne ratings"
    });
  }

  if (hasImpact) {
    standards.push({
      code: "ISO 717-2",
      detail:
        "Impact indices on this sheet are stated in ISO 717-2 rating language, including Ln,w, L'n,w, L'nT,w, CI, or DeltaLw only when the active route can defend them.",
      label: "Weighted impact ratings"
    });
  }

  if (fieldAirborne) {
    standards.push({
      code: "ISO 16283-1",
      detail:
        "Where field airborne continuation is active, the packaged issue keeps the room-to-room field posture explicit instead of relabeling the result as a laboratory claim.",
      label: "Field airborne route"
    });
  }

  if (fieldImpact) {
    standards.push({
      code: "ISO 16283-2",
      detail:
        "Where field impact continuation is active, the sheet keeps the field-side normalization posture explicit and does not present it as direct laboratory evidence.",
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
      detail:
        "Prediction or normalization routes remain labelled as estimates on this summary sheet. DynEcho does not present these paths as accredited measurements.",
      label: "Prediction route posture"
    });
  }

  if (standards.length === 0) {
    standards.push({
      code: "Standards posture",
      detail:
        "This short-form sheet keeps the active calculator route, evidence posture, and source trail explicit so the packaged result can be reviewed without overstating confidence.",
      label: "Explicit route disclosure"
    });
  }

  return standards;
}

function renderConstructionFigure(document: SimpleWorkbenchProposalDocument): string {
  const section = buildSimpleWorkbenchProposalConstructionSection(document.layers, document.studyModeLabel);

  if (section.bands.length === 0) {
    return `
      <div class="construction-empty">
        No visible rows are packaged on this summary sheet yet. Build a supported stack first so DynEcho can draw the solver-order section.
      </div>
    `;
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
    return `<div class="curve-empty">No frequency-response graph is available on the active route for this issue snapshot.</div>`;
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
                    <div>
                      <strong>${escapeHtml(series.label)}</strong>
                      <small>${series.active ? "Active plotted answer" : "Supporting comparison curve"}</small>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
          <p class="curve-note">${escapeHtml(figure.note)}</p>
        </article>
      `
    )
    .join("");
}

export function buildSimpleWorkbenchProposalSimpleHtml(document: SimpleWorkbenchProposalDocument): string {
  const standardReferences = inferStandardReferences(document);
  const visibleMetrics = document.metrics.slice(0, MAX_SIMPLE_METRICS);
  const visibleCoverageItems = document.coverageItems.slice(0, MAX_SIMPLE_COVERAGE_ITEMS);
  const visibleLayers = document.layers.slice(0, MAX_SIMPLE_LAYER_ROWS);
  const visibleCitations = document.citations.slice(0, MAX_SIMPLE_CITATIONS);
  const visibleAssumptions = document.assumptionItems.slice(0, MAX_SIMPLE_ASSUMPTIONS);
  const visibleWarnings = document.warnings.slice(0, MAX_SIMPLE_WARNINGS);
  const hasSecondPage =
    document.layers.length > 0 ||
    visibleCoverageItems.length > 0 ||
    visibleCitations.length > 0 ||
    visibleAssumptions.length > 0 ||
    visibleWarnings.length > 0;

  const metricRows =
    visibleMetrics.length > 0
      ? visibleMetrics
          .map(
            (metric) => `
              <tr>
                <td>${escapeHtml(metric.label)}</td>
                <td>${escapeHtml(metric.value)}</td>
                <td>${escapeHtml(metric.detail)}</td>
              </tr>
            `
          )
          .join("")
      : `
          <tr>
            <td colspan="3">No live outputs are packaged on this short-form issue yet.</td>
          </tr>
        `;

  const coverageRows =
    visibleCoverageItems.length > 0
      ? visibleCoverageItems
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(item.label)}</td>
                <td>${escapeHtml(formatCoverageStatus(item.status))}</td>
                <td>${escapeHtml(item.value)}</td>
                <td>${escapeHtml(item.postureLabel)}</td>
              </tr>
            `
          )
          .join("")
      : `
          <tr>
            <td colspan="4">No additional coverage register rows are packaged on this summary sheet.</td>
          </tr>
        `;

  const layerRows =
    visibleLayers.length > 0
      ? visibleLayers
          .map(
            (layer) => `
              <tr>
                <td>${layer.index}</td>
                <td>${escapeHtml(layer.label)}</td>
                <td>${escapeHtml(layer.thicknessLabel)}</td>
                <td>${escapeHtml(layer.densityLabel ?? "Not listed")}</td>
                <td>${escapeHtml(layer.surfaceMassLabel ?? "Not listed")}</td>
                <td>${escapeHtml(layer.roleLabel ?? layer.categoryLabel)}</td>
              </tr>
            `
          )
          .join("")
      : `
          <tr>
            <td colspan="6">No layer schedule is packaged on this issue yet.</td>
          </tr>
        `;

  const citationItems =
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
      : "<li><strong>Source posture</strong><span>No explicit source citation is packaged on this issue.</span></li>";

  const assumptionItems =
    visibleAssumptions.length > 0
      ? visibleAssumptions
          .map(
            (item) => `
              <li>
                <strong>${escapeHtml(item.label)}</strong>
                <span>${escapeHtml(item.detail)}</span>
              </li>
            `
          )
          .join("")
      : "<li><strong>Assumption posture</strong><span>No explicit assumption lines are packaged on this issue.</span></li>";

  const consultantNote =
    document.briefNote.trim().length > 0
      ? escapeHtml(document.briefNote.trim())
      : "No additional consultant note entered for this short-form issue.";

  const supportRows =
    visibleCoverageItems.length > 0
      ? visibleCoverageItems
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(item.label)}</td>
                <td>${escapeHtml(formatCoverageStatus(item.status))}</td>
                <td>${escapeHtml(item.value)}</td>
              </tr>
            `
          )
          .join("")
      : `
          <tr>
            <td colspan="3">No additional coverage posture rows are packaged on this issue.</td>
          </tr>
        `;

  const methodBasisRows = [
    {
      detail: document.dynamicBranchDetail,
      label: "Route",
      value: document.dynamicBranchLabel
    },
    {
      detail: document.validationDetail,
      label: "Validation",
      value: document.validationLabel
    },
    {
      detail: `${document.studyModeLabel} · ${document.contextLabel} · ${document.studyContextLabel}`,
      label: "Scope",
      value: document.reportProfileLabel
    },
    {
      detail: `Issued to ${document.proposalRecipient}. ${document.proposalValidityNote}`,
      label: "Issue basis",
      value: document.proposalIssuePurpose
    }
  ]
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.label)}</td>
          <td>${escapeHtml(row.value)}</td>
          <td>${escapeHtml(row.detail)}</td>
        </tr>
      `
    )
    .join("");

  const standardsRows = standardReferences
    .map(
      (reference) => `
        <tr>
          <td>${escapeHtml(reference.code)}</td>
          <td>${escapeHtml(reference.label)}</td>
          <td>${escapeHtml(reference.detail)}</td>
        </tr>
      `
    )
    .join("");

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
      : "<li><strong>Source posture</strong><span>No citation line is packaged on this short report.</span></li>";

  const noteAndAssumptionItems = [
    `<li><strong>Consultant note</strong><span>${consultantNote}</span></li>`,
    ...visibleAssumptions.map(
      (item) => `<li><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></li>`
    )
  ].join("");

  const warningItems =
    visibleWarnings.length > 0
      ? visibleWarnings.map((warning) => `<li><strong>Warning</strong><span>${escapeHtml(warning)}</span></li>`).join("")
      : "<li><strong>Warnings</strong><span>No live warning flags remain on the active route.</span></li>";

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
        gap: 5mm;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

      .report-header {
        display: grid;
        gap: 3mm;
        border-bottom: 1.2px solid var(--ink);
        padding-bottom: 4mm;
      }

      .report-kicker {
        font-size: 9px;
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
        font-size: 26px;
        line-height: 1.05;
        letter-spacing: -0.03em;
      }

      .report-subject {
        margin: 0;
        font-size: 12px;
        line-height: 1.5;
        color: var(--ink-soft);
      }

      .report-meta {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 3mm;
      }

      .meta-item strong,
      .panel-title,
      .table-title {
        display: block;
        margin: 0;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .meta-item span {
        display: block;
        margin-top: 1.2mm;
        font-size: 11px;
        line-height: 1.45;
        color: var(--ink);
      }

      .result-strip {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 3mm;
      }

      .result-card,
      .panel,
      .table-panel,
      .notes-panel {
        border: 1px solid var(--line);
        background: #ffffff;
        padding: 3.2mm;
      }

      .result-card strong {
        display: block;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .result-card span {
        display: block;
        margin-top: 1.4mm;
        font-size: 16px;
        line-height: 1.15;
        font-weight: 700;
      }

      .result-card small {
        display: block;
        margin-top: 1.4mm;
        font-size: 10.5px;
        line-height: 1.45;
        color: var(--ink-soft);
      }

      .page-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
        gap: 4mm;
      }

      .curve-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4mm;
      }

      .curve-card {
        border: 1px solid var(--line);
        padding: 3mm;
      }

      .curve-head {
        display: flex;
        justify-content: space-between;
        gap: 4mm;
        align-items: start;
      }

      .curve-head strong {
        display: block;
        font-size: 11px;
        line-height: 1.3;
        color: var(--ink);
      }

      .curve-head span,
      .curve-head small,
      .curve-note {
        display: block;
        font-size: 10.5px;
        line-height: 1.45;
        color: var(--ink-soft);
      }

      .curve-shell {
        margin-top: 2.5mm;
        border: 1px solid var(--line);
        padding: 2mm;
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
        display: grid;
        gap: 1.6mm;
        margin-top: 2.5mm;
      }

      .curve-legend-row {
        display: flex;
        gap: 2mm;
        align-items: start;
      }

      .curve-legend-row strong {
        display: block;
        font-size: 10px;
        line-height: 1.35;
      }

      .curve-legend-row small {
        display: block;
        font-size: 9px;
        line-height: 1.35;
        color: var(--ink-soft);
      }

      .curve-swatch {
        width: 10px;
        height: 10px;
        flex: 0 0 10px;
        margin-top: 2px;
      }

      .construction-axis {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 3mm;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .construction-stack {
        margin: 3.5mm 0;
        overflow: hidden;
        border: 1px solid var(--line-strong);
        background: #ffffff;
      }

      .construction-stack-floor {
        display: flex;
        flex-direction: column;
        min-height: 62mm;
      }

      .construction-stack-wall {
        display: flex;
        min-height: 44mm;
      }

      .construction-band {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 3mm;
        align-items: center;
        border-bottom: 1px solid rgba(18, 37, 35, 0.14);
        border-right: 1px solid rgba(18, 37, 35, 0.14);
        padding: 3mm;
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
        width: 6mm;
        height: 6mm;
        border: 1px solid rgba(18, 37, 35, 0.2);
        background: #ffffff;
        font-size: 9px;
        font-weight: 700;
      }

      .construction-band-copy strong {
        display: block;
        font-size: 11px;
        line-height: 1.2;
      }

      .construction-band-copy small {
        display: block;
        margin-top: 1mm;
        font-size: 9.5px;
        line-height: 1.4;
        color: var(--ink-soft);
      }

      .construction-empty {
        border: 1px dashed var(--line);
        padding: 6mm 5mm;
        font-size: 11px;
        line-height: 1.55;
        color: var(--ink-soft);
      }

      .notes-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 4mm;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }

      th,
      td {
        border: 1px solid var(--line);
        padding: 2.4mm;
        text-align: left;
        vertical-align: top;
      }

      th {
        background: var(--panel-soft);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      td {
        line-height: 1.5;
      }

      .notes-panel {
        padding: 3.2mm;
      }

      ul {
        margin: 0;
        padding-left: 4.5mm;
        display: grid;
        gap: 2.2mm;
      }

      li {
        line-height: 1.52;
      }

      li strong {
        display: block;
        font-size: 11px;
        line-height: 1.3;
      }

      li span {
        display: block;
        margin-top: 0.8mm;
        font-size: 10.5px;
        color: var(--ink-soft);
      }

      .source-link {
        color: var(--accent);
        word-break: break-all;
      }

      .footnote {
        font-size: 10.5px;
        line-height: 1.6;
        color: var(--ink-soft);
      }

      .page-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4mm;
        padding-top: 2mm;
        border-top: 1px solid var(--line);
        font-size: 10px;
        line-height: 1.45;
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
              <p class="report-subject">${escapeHtml(document.proposalSubject)}</p>
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
              <span>${escapeHtml(document.projectName)}</span>
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
              <span>${escapeHtml(document.preparedBy)} · ${escapeHtml(document.approverTitle)}</span>
            </div>
          </div>
        </header>

        <section class="result-strip">
          <article class="result-card">
            <strong>Primary answer</strong>
            <span>${escapeHtml(document.primaryMetricLabel)} ${escapeHtml(document.primaryMetricValue)}</span>
            <small>${escapeHtml(document.executiveSummary)}</small>
          </article>
          <article class="result-card">
            <strong>Route</strong>
            <span>${escapeHtml(document.dynamicBranchLabel)}</span>
            <small>${escapeHtml(document.dynamicBranchDetail)}</small>
          </article>
          <article class="result-card">
            <strong>Validation</strong>
            <span>${escapeHtml(document.validationLabel)}</span>
            <small>${escapeHtml(document.validationDetail)}</small>
          </article>
          <article class="result-card">
            <strong>Assembly</strong>
            <span>${document.layers.length} rows</span>
            <small>${escapeHtml(document.assemblyHeadline)}</small>
          </article>
        </section>

        <section class="panel">
          <div class="panel-title">Frequency response curves</div>
          <div class="curve-grid">
            ${renderSimpleCurveFigures(document)}
          </div>
        </section>

        <section class="page-grid">
          <section class="table-panel">
            <div class="table-title">Measured / predicted indices</div>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Reading note</th>
                </tr>
              </thead>
              <tbody>
                ${metricRows}
              </tbody>
            </table>
          </section>

          <section class="table-panel">
            <div class="table-title">Method basis</div>
            <table>
              <thead>
                <tr>
                  <th>Basis</th>
                  <th>Active reading</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                ${methodBasisRows}
              </tbody>
            </table>
          </section>
        </section>

        <section class="table-panel">
          <div class="table-title">Reference basis</div>
          <table>
            <thead>
              <tr>
                <th>Standard</th>
                <th>Use on this report</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              ${standardsRows}
            </tbody>
          </table>
        </section>

        <footer class="page-footer">
          <span>${escapeHtml(document.consultantCompany)} · ${escapeHtml(document.reportProfileLabel)}</span>
          <span>${escapeHtml(document.proposalReference)} · ${escapeHtml(document.issuedOnLabel)}</span>
        </footer>
      </section>

      ${
        hasSecondPage
          ? `
        <section class="page">
          <section class="page-grid">
            <section class="panel">
              <div class="panel-title">Layer illustration</div>
              ${renderConstructionFigure(document)}
            </section>
            <section class="table-panel">
              <div class="table-title">Visible layer schedule</div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Layer</th>
                    <th>Thickness</th>
                    <th>Density</th>
                    <th>Surface mass</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  ${layerRows}
                </tbody>
              </table>
            </section>
          </section>

          ${
            visibleCoverageItems.length > 0
              ? `
          <section class="table-panel">
            <div class="table-title">Output coverage register</div>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Status</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${supportRows}
              </tbody>
            </table>
          </section>`
              : ""
          }

          <section class="notes-grid">
            <section class="notes-panel">
              <div class="table-title">Source notes</div>
              <ul>${sourceItems}</ul>
            </section>
            <section class="notes-panel">
              <div class="table-title">Consultant note and assumptions</div>
              <ul>${noteAndAssumptionItems}</ul>
            </section>
          </section>

          <section class="notes-panel">
            <div class="table-title">Warnings and issue guardrails</div>
            <ul>${warningItems}</ul>
          </section>

          <section class="footnote">
            Prepared from the DynEcho dynamic calculator as a short-form report. This sheet summarizes a project estimate and does not replace accredited laboratory or site measurements.
          </section>

          <footer class="page-footer">
            <span>${escapeHtml(document.issueBaseReference)} · next ${escapeHtml(document.issueNextReference)}</span>
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
