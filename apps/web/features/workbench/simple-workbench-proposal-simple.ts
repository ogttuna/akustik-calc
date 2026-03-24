import type { SimpleWorkbenchProposalCoverageStatus, SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalFilename } from "./simple-workbench-proposal";

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

function renderWarningItems(document: SimpleWorkbenchProposalDocument): string {
  const items =
    document.warnings.length > 0 ? document.warnings : ["No live warning flags on the active route."];

  return items.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("");
}

export function buildSimpleWorkbenchProposalSimpleHtml(document: SimpleWorkbenchProposalDocument): string {
  const metricRows =
    document.metrics.length > 0
      ? document.metrics
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
            <td colspan="3">No live outputs are packaged on this proposal yet.</td>
          </tr>
        `;

  const coverageRows =
    document.coverageItems.length > 0
      ? document.coverageItems
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
            <td colspan="4">No coverage register rows are packaged on this proposal yet.</td>
          </tr>
        `;

  const layerRows =
    document.layers.length > 0
      ? document.layers
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
            <td colspan="6">No layer schedule is packaged on this proposal yet.</td>
          </tr>
        `;

  const citationItems =
    document.citations.length > 0
      ? document.citations
          .map(
            (citation) =>
              `<li><strong>${escapeHtml(citation.label)}</strong> ${escapeHtml(citation.detail)}${
                citation.href ? ` <span class="muted">${escapeHtml(citation.href)}</span>` : ""
              }</li>`
          )
          .join("")
      : "<li>No source citations are packaged on this issue.</li>";

  const assumptionItems =
    document.assumptionItems.length > 0
      ? document.assumptionItems
          .map((item) => `<li><strong>${escapeHtml(item.label)}</strong> ${escapeHtml(item.detail)}</li>`)
          .join("")
      : "<li>No explicit assumption lines are packaged on this issue.</li>";

  const consultantNote =
    document.briefNote.trim().length > 0 ? escapeHtml(document.briefNote.trim()) : "No additional consultant note entered.";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(buildSimpleWorkbenchProposalFilename(document.projectName))}-simple</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #1b302d;
        --ink-soft: #5b6e69;
        --line: #d4ddd8;
        --paper: #fbfaf6;
        --panel: #ffffff;
        --accent: #1f6a73;
        --accent-soft: #e7f1f2;
        --warn: #8e4e2c;
        --warn-soft: #f4e6dc;
      }

      @page {
        margin: 14mm;
        size: A4;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--paper);
        color: var(--ink);
        font-family: Arial, Helvetica, sans-serif;
      }

      .sheet {
        max-width: 210mm;
        margin: 0 auto;
        padding: 10mm;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
      }

      h1 {
        margin: 0;
        font-size: 24px;
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .meta {
        margin-top: 6px;
        color: var(--ink-soft);
        font-size: 12px;
        line-height: 1.5;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--line);
        background: var(--panel);
        padding: 8px 10px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      .kpi-row,
      .fact-grid,
      .section-grid {
        display: grid;
        gap: 8px;
      }

      .kpi-row {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-bottom: 12px;
      }

      .fact-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-bottom: 12px;
      }

      .section-grid {
        grid-template-columns: 1fr 1fr;
      }

      .card,
      .section,
      .warning-box {
        border: 1px solid var(--line);
        background: var(--panel);
      }

      .card {
        padding: 10px;
      }

      .card span,
      .section-title {
        display: block;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      .card strong {
        display: block;
        margin-top: 6px;
        font-size: 18px;
        line-height: 1.2;
        color: var(--ink);
      }

      .card small {
        display: block;
        margin-top: 6px;
        font-size: 12px;
        line-height: 1.5;
        color: var(--ink-soft);
      }

      .card.primary {
        border-color: color-mix(in srgb, var(--accent) 34%, transparent);
        background: var(--accent-soft);
      }

      .section {
        margin-bottom: 12px;
        padding: 12px;
      }

      .section h2 {
        margin: 0 0 10px;
        font-size: 17px;
        letter-spacing: -0.03em;
      }

      .lede {
        margin: 0 0 12px;
        font-size: 13px;
        line-height: 1.65;
        color: var(--ink-soft);
      }

      .fact-row {
        border-top: 1px solid var(--line);
        padding-top: 8px;
      }

      .fact-row:first-child {
        border-top: 0;
        padding-top: 0;
      }

      .fact-row strong {
        display: block;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }

      .fact-row span {
        display: block;
        margin-top: 4px;
        font-size: 13px;
        line-height: 1.5;
        color: var(--ink);
        word-break: break-word;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }

      th,
      td {
        border: 1px solid var(--line);
        padding: 8px;
        text-align: left;
        vertical-align: top;
      }

      th {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-soft);
        background: #f5f7f5;
      }

      .warning-box {
        background: var(--warn-soft);
        border-color: color-mix(in srgb, var(--warn) 24%, transparent);
        padding: 10px 12px;
      }

      .warning-box h2 {
        margin-bottom: 8px;
      }

      ul {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 5px;
      }

      li {
        font-size: 12px;
        line-height: 1.55;
      }

      .muted {
        color: var(--ink-soft);
      }

      .disclaimer,
      .footer {
        font-size: 11px;
        line-height: 1.6;
        color: var(--ink-soft);
      }

      .footer {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--line);
      }

      @media (max-width: 900px) {
        .kpi-row,
        .fact-grid,
        .section-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <header class="page-header">
        <div>
          <h1>Calculation Summary</h1>
          <div class="meta">
            ${escapeHtml(document.projectName)} · ${escapeHtml(document.studyModeLabel)} · ${escapeHtml(document.contextLabel)}<br />
            ${escapeHtml(document.issuedOnLabel)} · ${escapeHtml(document.consultantCompany)}
          </div>
        </div>
        <div class="pill">Simple PDF</div>
      </header>

      <section class="kpi-row">
        <div class="card primary">
          <span>Primary read</span>
          <strong>${escapeHtml(document.primaryMetricValue)}</strong>
          <small>${escapeHtml(document.primaryMetricLabel)}</small>
        </div>
        <div class="card">
          <span>Route</span>
          <strong>${escapeHtml(document.dynamicBranchLabel)}</strong>
          <small>${escapeHtml(document.validationLabel)}</small>
        </div>
        <div class="card">
          <span>Issue</span>
          <strong>${escapeHtml(document.proposalReference)}</strong>
          <small>${escapeHtml(document.proposalRevision)}</small>
        </div>
        <div class="card">
          <span>Visible rows</span>
          <strong>${document.layers.length}</strong>
          <small>${document.metrics.length} live metric${document.metrics.length === 1 ? "" : "s"}</small>
        </div>
      </section>

      <section class="fact-grid">
        <div class="section">
          <h2>Project & Issue</h2>
          <div class="fact-row"><strong>Project</strong><span>${escapeHtml(document.projectName)}</span></div>
          <div class="fact-row"><strong>Client</strong><span>${escapeHtml(document.clientName)}</span></div>
          <div class="fact-row"><strong>Issued to</strong><span>${escapeHtml(document.proposalRecipient)} · ${escapeHtml(document.proposalAttention)}</span></div>
          <div class="fact-row"><strong>Subject</strong><span>${escapeHtml(document.proposalSubject)}</span></div>
        </div>
        <div class="section">
          <h2>Deliverable Basis</h2>
          <div class="fact-row"><strong>Purpose</strong><span>${escapeHtml(document.proposalIssuePurpose)}</span></div>
          <div class="fact-row"><strong>Validity</strong><span>${escapeHtml(document.proposalValidityNote)}</span></div>
          <div class="fact-row"><strong>Prepared by</strong><span>${escapeHtml(document.preparedBy)} · ${escapeHtml(document.approverTitle)}</span></div>
          <div class="fact-row"><strong>Route note</strong><span>${escapeHtml(document.dynamicBranchDetail)}</span></div>
        </div>
      </section>

      <section class="section">
        <h2>Executive Summary</h2>
        <p class="lede">${escapeHtml(document.executiveSummary)}</p>
      </section>

      <section class="section">
        <h2>Live Outputs</h2>
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

      <section class="section">
        <h2>Output Coverage</h2>
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
      </section>

      <section class="section">
        <h2>Layer Schedule</h2>
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

      <section class="section-grid">
        <section class="section">
          <h2>Method & References</h2>
          <div class="fact-row"><strong>Dynamic route</strong><span>${escapeHtml(document.dynamicBranchLabel)} · ${escapeHtml(document.dynamicBranchDetail)}</span></div>
          <div class="fact-row"><strong>Validation</strong><span>${escapeHtml(document.validationLabel)} · ${escapeHtml(document.validationDetail)}</span></div>
          <div class="fact-row"><strong>Source citations</strong><span>${document.citations.length} citation${document.citations.length === 1 ? "" : "s"}</span></div>
          <ul>${citationItems}</ul>
        </section>
        <section class="section">
          <h2>Assumptions & Note</h2>
          <div class="fact-row"><strong>Consultant note</strong><span>${consultantNote}</span></div>
          <div class="fact-row"><strong>Assumptions</strong><span>${document.assumptionItems.length} line${document.assumptionItems.length === 1 ? "" : "s"}</span></div>
          <ul>${assumptionItems}</ul>
        </section>
      </section>

      <section class="warning-box">
        <h2>Warnings</h2>
        <ul>${renderWarningItems(document)}</ul>
      </section>

      <section class="section">
        <div class="disclaimer">
          Prepared from the DynEcho dynamic calculator. This summary reflects a calculated estimate and does not replace accredited laboratory or site measurements.
        </div>
      </section>

      <footer class="footer">
        <div>${escapeHtml(document.consultantCompany)} · Sound insulation performance summary</div>
        <div>${escapeHtml(document.issuedOnLabel)}</div>
      </footer>
    </main>
  </body>
</html>`;
}
