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

function renderOverflowNote(hiddenCount: number, label: string): string {
  if (hiddenCount <= 0) {
    return "";
  }

  return `<div class="overflow-note">${hiddenCount} additional ${escapeHtml(label)} remain in the packaged issue and stay available in the branded PDF.</div>`;
}

function renderWarningItems(document: SimpleWorkbenchProposalDocument): string {
  const visibleWarnings =
    document.warnings.length > 0
      ? document.warnings.slice(0, MAX_SIMPLE_WARNINGS)
      : ["No live warning flags remain on the active route at this issue stage."];

  return visibleWarnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("");
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

export function buildSimpleWorkbenchProposalSimpleHtml(document: SimpleWorkbenchProposalDocument): string {
  const standardReferences = inferStandardReferences(document);
  const visibleMetrics = document.metrics.slice(0, MAX_SIMPLE_METRICS);
  const visibleCoverageItems = document.coverageItems.slice(0, MAX_SIMPLE_COVERAGE_ITEMS);
  const visibleLayers = document.layers.slice(0, MAX_SIMPLE_LAYER_ROWS);
  const visibleCitations = document.citations.slice(0, MAX_SIMPLE_CITATIONS);
  const visibleAssumptions = document.assumptionItems.slice(0, MAX_SIMPLE_ASSUMPTIONS);
  const visibleWarnings = document.warnings.slice(0, MAX_SIMPLE_WARNINGS);
  const hasSecondPage =
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

  const standardCards = standardReferences
    .map(
      (reference) => `
        <article class="standard-card">
          <div class="standard-code">${escapeHtml(reference.code)}</div>
          <strong>${escapeHtml(reference.label)}</strong>
          <p>${escapeHtml(reference.detail)}</p>
        </article>
      `
    )
    .join("");

  const consultantNote =
    document.briefNote.trim().length > 0
      ? escapeHtml(document.briefNote.trim())
      : "No additional consultant note entered for this short-form issue.";

  const secondaryMetricCards =
    visibleMetrics.length > 1
      ? visibleMetrics
          .slice(1, 4)
          .map(
            (metric) => `
              <article class="metric-chip">
                <span>${escapeHtml(metric.label)}</span>
                <strong>${escapeHtml(metric.value)}</strong>
                <small>${escapeHtml(metric.detail)}</small>
              </article>
            `
          )
          .join("")
      : `
          <article class="metric-chip">
            <span>Validation</span>
            <strong>${escapeHtml(document.validationLabel)}</strong>
            <small>${escapeHtml(document.validationDetail)}</small>
          </article>
        `;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(buildSimpleWorkbenchProposalFilename(document.projectName))}-simple</title>
    <style>
      :root {
        color-scheme: light;
        --paper: #f5f1ea;
        --panel: #fffdfa;
        --panel-soft: #f1ebe2;
        --ink: #122523;
        --ink-soft: #52635f;
        --ink-faint: #7b8a86;
        --line: #d4ccc0;
        --line-strong: #b39d82;
        --accent: #1f5b5d;
        --accent-soft: #dfeceb;
        --accent-strong: #0e4647;
        --sand: #e7dbc9;
        --warn: #7a4a2e;
        --warn-soft: #f4e7da;
      }

      @page {
        margin: 0;
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

      strong,
      h1,
      h2,
      h3 {
        font-family: Georgia, "Times New Roman", serif;
      }

      .document {
        max-width: 210mm;
        margin: 0 auto;
      }

      .page {
        min-height: 297mm;
        padding: 13mm 14mm 12mm;
        display: grid;
        align-content: start;
        gap: 8mm;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

      .masthead {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: 10mm;
        align-items: start;
      }

      .brand-panel,
      .issue-panel,
      .section,
      .status-band,
      .metrics-table,
      .schedule-table,
      .standards-grid,
      .coverage-table,
      .list-panel,
      .warning-panel,
      .signoff-panel {
        border: 1px solid var(--line);
        background: var(--panel);
      }

      .brand-panel,
      .issue-panel,
      .section,
      .warning-panel,
      .signoff-panel {
        padding: 5mm;
      }

      .brand-panel {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(241, 235, 226, 0.95));
      }

      .brand-logo {
        display: block;
        max-width: 50mm;
        max-height: 16mm;
        object-fit: contain;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 2mm;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .brand-name {
        margin-top: 4mm;
        font-size: 18px;
        line-height: 1.1;
      }

      .brand-line {
        margin-top: 2mm;
        font-size: 11px;
        line-height: 1.55;
        color: var(--ink-soft);
      }

      .contact-list {
        margin-top: 4mm;
        display: grid;
        gap: 2.2mm;
      }

      .contact-row strong,
      .meta-row strong,
      .section h3,
      .table-title,
      .list-title {
        display: block;
        margin: 0;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .contact-row span,
      .meta-row span {
        display: block;
        margin-top: 1.5mm;
        font-size: 11.5px;
        line-height: 1.55;
        color: var(--ink);
        word-break: break-word;
      }

      .issue-chip {
        display: inline-flex;
        align-items: center;
        border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
        background: var(--accent-soft);
        padding: 2mm 3mm;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--accent-strong);
      }

      h1 {
        margin: 4mm 0 0;
        font-size: 31px;
        line-height: 0.98;
        letter-spacing: -0.05em;
      }

      .subject {
        margin: 3mm 0 0;
        font-size: 14px;
        line-height: 1.55;
        color: var(--ink-soft);
      }

      .issue-meta {
        margin-top: 5mm;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 3mm;
      }

      .meta-row {
        border-top: 1px solid var(--line);
        padding-top: 2.6mm;
      }

      .hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
        gap: 6mm;
      }

      .hero-panel {
        position: relative;
        overflow: hidden;
        padding: 5mm;
        border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--line));
        background:
          radial-gradient(circle at top right, rgba(31, 91, 93, 0.12), transparent 44%),
          linear-gradient(180deg, rgba(223, 236, 235, 0.78), rgba(255, 253, 250, 0.96));
      }

      .hero-panel::after {
        content: "";
        position: absolute;
        right: -18mm;
        top: -26mm;
        width: 48mm;
        height: 48mm;
        border-radius: 999px;
        border: 1px solid rgba(31, 91, 93, 0.12);
      }

      .hero-value {
        margin-top: 4mm;
        display: flex;
        align-items: baseline;
        gap: 3mm;
      }

      .hero-value strong {
        font-size: 48px;
        line-height: 0.9;
        letter-spacing: -0.07em;
      }

      .hero-value span {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .hero-copy {
        margin: 4mm 0 0;
        font-size: 12.4px;
        line-height: 1.62;
        color: var(--ink-soft);
      }

      .status-band {
        margin-top: 5mm;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0;
      }

      .status-card {
        padding: 3.2mm;
        border-right: 1px solid var(--line);
      }

      .status-card:last-child {
        border-right: 0;
      }

      .status-card strong {
        display: block;
        margin-top: 1.6mm;
        font-size: 17px;
        line-height: 1.15;
      }

      .status-card small {
        display: block;
        margin-top: 1.4mm;
        font-size: 10.5px;
        line-height: 1.45;
        color: var(--ink-soft);
      }

      .metric-chip-row {
        margin-top: 4mm;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 3mm;
      }

      .metric-chip {
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.78);
        padding: 3mm;
      }

      .metric-chip span {
        display: block;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .metric-chip strong {
        display: block;
        margin-top: 1.6mm;
        font-size: 16px;
        line-height: 1.1;
      }

      .metric-chip small {
        display: block;
        margin-top: 1.5mm;
        font-size: 10.5px;
        line-height: 1.45;
        color: var(--ink-soft);
      }

      .section-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 4mm;
        margin-bottom: 3mm;
      }

      .section h2,
      .table-title,
      .list-title {
        margin: 0;
        font-size: 16px;
        line-height: 1.08;
        letter-spacing: -0.03em;
        color: var(--ink);
      }

      .section-kicker {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .construction-sheet {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(231, 219, 201, 0.42), rgba(255, 253, 250, 0.92));
        padding: 3.5mm;
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
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.54), rgba(223, 236, 235, 0.2)),
          repeating-linear-gradient(135deg, rgba(31, 91, 93, 0.05) 0, rgba(31, 91, 93, 0.05) 2mm, transparent 2mm, transparent 6mm);
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
        background: rgba(223, 236, 235, 0.72);
      }

      .construction-band-interior {
        background: rgba(255, 255, 255, 0.76);
      }

      .construction-band-trailing {
        background: rgba(231, 219, 201, 0.62);
      }

      .construction-band-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 6mm;
        height: 6mm;
        border-radius: 999px;
        border: 1px solid rgba(18, 37, 35, 0.2);
        background: rgba(255, 255, 255, 0.88);
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
        padding: 8mm 5mm;
        font-size: 11px;
        line-height: 1.55;
        color: var(--ink-soft);
      }

      .section-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 6mm;
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

      .standards-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 3mm;
        padding: 4mm;
      }

      .standard-card {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(241, 235, 226, 0.9));
        padding: 3mm;
      }

      .standard-code {
        display: inline-flex;
        align-items: center;
        border: 1px solid color-mix(in srgb, var(--accent) 24%, transparent);
        background: var(--accent-soft);
        padding: 1mm 2mm;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--accent-strong);
      }

      .standard-card strong {
        display: block;
        margin-top: 2mm;
        font-size: 14px;
        line-height: 1.2;
      }

      .standard-card p {
        margin: 2mm 0 0;
        font-size: 10.5px;
        line-height: 1.5;
        color: var(--ink-soft);
      }

      .list-panel {
        padding: 4mm;
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
        color: var(--accent-strong);
        word-break: break-all;
      }

      .overflow-note {
        margin-top: 2.2mm;
        font-size: 10px;
        line-height: 1.45;
        color: var(--ink-faint);
      }

      .warning-panel {
        background: linear-gradient(180deg, rgba(244, 231, 218, 0.96), rgba(255, 253, 250, 0.96));
        border-color: color-mix(in srgb, var(--warn) 22%, var(--line));
      }

      .warning-panel ul li span,
      .warning-panel li {
        color: var(--ink);
      }

      .signoff-panel {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
        gap: 6mm;
        align-items: end;
      }

      .footnote {
        font-size: 10.5px;
        line-height: 1.6;
        color: var(--ink-soft);
      }

      .signature-block {
        border-top: 1px solid var(--line);
        padding-top: 4mm;
      }

      .signature-block strong {
        display: block;
        font-size: 14px;
        line-height: 1.2;
      }

      .signature-block span {
        display: block;
        margin-top: 1mm;
        font-size: 10.5px;
        line-height: 1.5;
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
        .masthead,
        .hero-grid,
        .issue-meta,
        .section-grid,
        .signoff-panel,
        .standards-grid,
        .metric-chip-row,
        .status-band {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="document">
      <section class="page">
        <header class="masthead">
          <section class="brand-panel">
            <div class="eyebrow">Consultant issue</div>
            ${document.consultantLogoDataUrl ? `<img class="brand-logo" src="${escapeHtml(document.consultantLogoDataUrl)}" alt="${escapeHtml(document.consultantCompany)} logo" />` : ""}
            <div class="brand-name">${escapeHtml(document.consultantCompany)}</div>
            <div class="brand-line">${escapeHtml(document.consultantWordmarkLine || "Building acoustics advisory")}</div>

            <div class="contact-list">
              <div class="contact-row">
                <strong>Office</strong>
                <span>${escapeHtml(document.consultantAddress)}</span>
              </div>
              <div class="contact-row">
                <strong>Contact</strong>
                <span>${escapeHtml(document.consultantEmail)} · ${escapeHtml(document.consultantPhone)}</span>
              </div>
              <div class="contact-row">
                <strong>Prepared by</strong>
                <span>${escapeHtml(document.preparedBy)} · ${escapeHtml(document.approverTitle)}</span>
              </div>
            </div>
          </section>

          <section class="issue-panel">
            <div class="issue-chip">Short-form acoustic issue</div>
            <h1>Acoustic Summary Sheet</h1>
            <p class="subject">${escapeHtml(document.proposalSubject)}</p>

            <div class="issue-meta">
              <div class="meta-row">
                <strong>Project</strong>
                <span>${escapeHtml(document.projectName)}</span>
              </div>
              <div class="meta-row">
                <strong>Issue</strong>
                <span>${escapeHtml(document.proposalReference)} · ${escapeHtml(document.proposalRevision)}</span>
              </div>
              <div class="meta-row">
                <strong>Issued to</strong>
                <span>${escapeHtml(document.proposalRecipient)} · ${escapeHtml(document.proposalAttention)}</span>
              </div>
              <div class="meta-row">
                <strong>Date</strong>
                <span>${escapeHtml(document.issuedOnLabel)}</span>
              </div>
              <div class="meta-row">
                <strong>Study</strong>
                <span>${escapeHtml(document.studyModeLabel)} · ${escapeHtml(document.contextLabel)} · ${escapeHtml(document.studyContextLabel)}</span>
              </div>
              <div class="meta-row">
                <strong>Purpose</strong>
                <span>${escapeHtml(document.proposalIssuePurpose)}</span>
              </div>
            </div>
          </section>
        </header>

        <section class="hero-grid">
          <article class="hero-panel">
            <div class="eyebrow">Primary decision read</div>
            <div class="hero-value">
              <strong>${escapeHtml(document.primaryMetricValue)}</strong>
              <span>${escapeHtml(document.primaryMetricLabel)}</span>
            </div>
            <p class="hero-copy">${escapeHtml(document.executiveSummary)}</p>

            <section class="status-band">
              <article class="status-card">
                <strong>${escapeHtml(document.dynamicBranchLabel)}</strong>
                <small>${escapeHtml(document.dynamicBranchDetail)}</small>
              </article>
              <article class="status-card">
                <strong>${escapeHtml(document.validationLabel)}</strong>
                <small>${escapeHtml(document.validationDetail)}</small>
              </article>
              <article class="status-card">
                <strong>${document.layers.length}</strong>
                <small>${document.layers.length} visible layer${document.layers.length === 1 ? "" : "s"} in solver order</small>
              </article>
            </section>

            <section class="metric-chip-row">
              ${secondaryMetricCards}
            </section>
          </article>

          <article class="section">
            <div class="section-header">
              <div>
                <div class="section-kicker">Technical section</div>
                <h2>Layer illustration</h2>
              </div>
              <div class="section-kicker">${escapeHtml(document.assemblyHeadline)}</div>
            </div>
            ${renderConstructionFigure(document)}
          </article>
        </section>

        <section class="section-grid">
          <section class="metrics-table">
            <div class="section" style="padding:4mm;">
              <div class="section-header">
                <div>
                  <div class="section-kicker">Issue outputs</div>
                  <div class="table-title">Measured / predicted indices</div>
                </div>
                <div class="section-kicker">${visibleMetrics.length} shown</div>
              </div>
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
              ${renderOverflowNote(document.metrics.length - visibleMetrics.length, "metric lines")}
            </div>
          </section>

          <section class="standards-grid">
            ${standardCards}
          </section>
        </section>

        <section class="schedule-table">
          <div class="section" style="padding:4mm;">
            <div class="section-header">
              <div>
                <div class="section-kicker">Technical schedule</div>
                <div class="table-title">Visible layer schedule</div>
              </div>
              <div class="section-kicker">${visibleLayers.length} shown</div>
            </div>
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
            ${renderOverflowNote(document.layers.length - visibleLayers.length, "schedule rows")}
          </div>
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
              <section class="section-grid">
                <section class="coverage-table">
                  <div class="section" style="padding:4mm;">
                    <div class="section-header">
                      <div>
                        <div class="section-kicker">Coverage posture</div>
                        <div class="table-title">Output coverage register</div>
                      </div>
                      <div class="section-kicker">${visibleCoverageItems.length} shown</div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Metric</th>
                          <th>Status</th>
                          <th>Value</th>
                          <th>Evidence class</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${coverageRows}
                      </tbody>
                    </table>
                    ${renderOverflowNote(document.coverageItems.length - visibleCoverageItems.length, "coverage rows")}
                  </div>
                </section>

                <section class="list-panel">
                  <div class="section-header">
                    <div>
                      <div class="section-kicker">Sources</div>
                      <div class="list-title">Reference basis</div>
                    </div>
                    <div class="section-kicker">${visibleCitations.length} shown</div>
                  </div>
                  <ul>${citationItems}</ul>
                  ${renderOverflowNote(document.citations.length - visibleCitations.length, "citation lines")}
                </section>
              </section>

              <section class="section-grid">
                <section class="list-panel">
                  <div class="section-header">
                    <div>
                      <div class="section-kicker">Assumptions</div>
                      <div class="list-title">Consultant note and assumption register</div>
                    </div>
                    <div class="section-kicker">${visibleAssumptions.length} shown</div>
                  </div>
                  <div class="footnote" style="margin-bottom:3mm;">${consultantNote}</div>
                  <ul>${assumptionItems}</ul>
                  ${renderOverflowNote(document.assumptionItems.length - visibleAssumptions.length, "assumption lines")}
                </section>

                <section class="warning-panel">
                  <div class="section-header">
                    <div>
                      <div class="section-kicker">Caveats</div>
                      <div class="list-title">Warnings and issue guardrails</div>
                    </div>
                    <div class="section-kicker">${visibleWarnings.length > 0 ? `${visibleWarnings.length} shown` : "No live flags"}</div>
                  </div>
                  <ul>${renderWarningItems(document)}</ul>
                  ${renderOverflowNote(document.warnings.length - visibleWarnings.length, "warning lines")}
                </section>
              </section>

              <section class="signoff-panel">
                <div class="footnote">
                  Prepared from the DynEcho dynamic calculator as a short-form issue sheet. The document keeps the active route, standards posture, and source trail visible for client review, but it does not replace accredited laboratory or site measurement reports. For the full issue history, expanded citation appendix, and full audit trail, use the branded proposal export.
                </div>

                <div class="signature-block">
                  <strong>${escapeHtml(document.preparedBy)}</strong>
                  <span>${escapeHtml(document.approverTitle)}</span>
                  <span>${escapeHtml(document.consultantCompany)}</span>
                  <span>Validity: ${escapeHtml(document.proposalValidityNote)}</span>
                </div>
              </section>

              <footer class="page-footer">
                <span>${escapeHtml(document.issueBaseReference)} · next ${escapeHtml(document.issueNextReference)}</span>
                <span>${escapeHtml(document.consultantCompany)} · Short-form acoustic issue</span>
              </footer>
            </section>
          `
          : ""
      }
    </main>
  </body>
</html>`;
}
