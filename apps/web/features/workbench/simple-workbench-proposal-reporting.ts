import {
  buildSimpleWorkbenchProposalConstructionSection,
  type SimpleWorkbenchProposalConstructionBand,
  type SimpleWorkbenchProposalConstructionLayer,
  type SimpleWorkbenchProposalConstructionSection
} from "./simple-workbench-proposal-construction-section";
import { distributeIllustrationSizes } from "./simple-workbench-illustration";

export const SIMPLE_WORKBENCH_REPORT_MARK = "DAC";
export const SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME = "DynEcho Acoustic Calculator";
export const SIMPLE_WORKBENCH_REPORT_SERIES = "ISO-aligned acoustic report";

type ProposalConstructionRender = {
  legendRowsHtml: string;
  section: SimpleWorkbenchProposalConstructionSection;
  svgMarkup: string;
};

type Point = {
  x: number;
  y: number;
};

type MaterialAppearance = {
  accent: string;
  detail: "air_gap" | "board_panel" | "concrete_core" | "fiber_batt" | "foam_mat" | "service_fill";
  definition: string;
  fill: string;
  sideFill: string;
  stroke: string;
  topFill: string;
};

type AxisBand = {
  appearance: MaterialAppearance;
  band: SimpleWorkbenchProposalConstructionBand;
  center: number;
  size: number;
  start: number;
};

export type ProposalConstructionAnnotationLayout = {
  compact: boolean;
  labelLineLimit: number;
  maxLabelLines: 1 | 2;
  minGap: number;
  rowMax: number;
  rowMin: number;
  showMeta: boolean;
};

function escapeMarkup(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createArrowHead(id: string, fill: string): string {
  return `
    <marker id="${id}" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L8,4 L0,8 z" fill="${fill}"></path>
    </marker>
  `;
}

function createSectionSheenDefs(prefix: string): string {
  return `
    <linearGradient id="${prefix}-front-sheen" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.42)"></stop>
      <stop offset="38%" stop-color="rgba(255,255,255,0.08)"></stop>
      <stop offset="100%" stop-color="rgba(20,31,42,0.12)"></stop>
    </linearGradient>
    <linearGradient id="${prefix}-front-sidewash" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"></stop>
      <stop offset="100%" stop-color="rgba(20,31,42,0.08)"></stop>
    </linearGradient>
  `;
}

function multilineText(value: string, limit: number): string[] {
  const tokens = value.trim().split(/\s+/u).filter(Boolean);

  if (tokens.length === 0) {
    return ["Unlabelled layer"];
  }

  const lines: string[] = [];
  let current = "";

  for (const token of tokens) {
    const next = current.length > 0 ? `${current} ${token}` : token;

    if (next.length > limit) {
      if (current.length > 0) {
        lines.push(current);
      }
      current = token;

      if (lines.length >= 1) {
        break;
      }
      continue;
    }

    current = next;
  }

  if (current.length > 0 && lines.length < 2) {
    lines.push(current);
  }

  return lines.slice(0, 2).map((line, index) =>
    index === 1 && tokens.join(" ").length > lines.join(" ").length
      ? `${line.slice(0, Math.max(0, limit - 1)).trimEnd()}…`
      : line
  );
}

function truncateSingleLineText(value: string, limit: number): string {
  const normalized = value.trim().replace(/\s+/gu, " ");

  if (normalized.length === 0) {
    return "Unlabelled layer";
  }

  if (normalized.length <= limit) {
    return normalized;
  }

  const safeLimit = Math.max(4, limit - 1);
  const truncated = normalized.slice(0, safeLimit);
  const cutAt = truncated.lastIndexOf(" ");

  return `${(cutAt >= Math.max(3, Math.floor(safeLimit * 0.55)) ? truncated.slice(0, cutAt) : truncated).trimEnd()}…`;
}

function distributeAxisPositions(
  targets: readonly number[],
  minGap: number,
  minimum: number,
  maximum: number
): number[] {
  if (targets.length === 0) {
    return [];
  }

  const positions = targets.map((target) => Math.min(maximum, Math.max(minimum, target)));

  for (let index = 1; index < positions.length; index += 1) {
    positions[index] = Math.max(positions[index], positions[index - 1]! + minGap);
  }

  for (let index = positions.length - 2; index >= 0; index -= 1) {
    positions[index] = Math.min(positions[index], positions[index + 1]! - minGap);
  }

  const lowest = positions[0]!;
  const highest = positions.at(-1)!;

  if (lowest < minimum) {
    const delta = minimum - lowest;
    for (let index = 0; index < positions.length; index += 1) {
      positions[index] += delta;
    }
  }

  if (highest > maximum) {
    const delta = highest - maximum;
    for (let index = 0; index < positions.length; index += 1) {
      positions[index] -= delta;
    }
  }

  return positions.map((position) => Math.min(maximum, Math.max(minimum, position)));
}

function buildElbowLeader(start: Point, end: Point, elbowX: number): string {
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} H${elbowX.toFixed(2)} V${end.y.toFixed(2)} H${end.x.toFixed(2)}`;
}

function buildVerticalLeader(start: Point, end: Point, elbowY: number): string {
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} V${elbowY.toFixed(2)} H${end.x.toFixed(2)} V${end.y.toFixed(2)}`;
}

export function resolveConstructionAnnotationLayout(input: {
  bandCount: number;
  height: number;
  orientation: "floor" | "wall";
}): ProposalConstructionAnnotationLayout {
  const standardBounds =
    input.orientation === "floor"
      ? { defaultGap: 48, rowMax: input.height - 88, rowMin: 98 }
      : { defaultGap: 42, rowMax: input.height - 64, rowMin: 72 };
  const compactBounds =
    input.orientation === "floor"
      ? { rowMax: input.height - 54, rowMin: 74 }
      : { rowMax: input.height - 40, rowMin: 58 };
  const availableSpan = Math.max(0, compactBounds.rowMax - compactBounds.rowMin);
  const naturalGap = input.bandCount > 1 ? availableSpan / (input.bandCount - 1) : availableSpan;
  const useCompactLayout = input.bandCount > 5 || naturalGap < 34;

  if (!useCompactLayout) {
    return {
      compact: false,
      labelLineLimit: 18,
      maxLabelLines: 2,
      minGap: standardBounds.defaultGap,
      rowMax: standardBounds.rowMax,
      rowMin: standardBounds.rowMin,
      showMeta: true
    };
  }

  return {
    compact: true,
    labelLineLimit: naturalGap < 20 ? 24 : naturalGap < 26 ? 26 : 28,
    maxLabelLines: 1,
    minGap: Math.max(20, Math.min(28, naturalGap || standardBounds.defaultGap)),
    rowMax: compactBounds.rowMax,
    rowMin: compactBounds.rowMin,
    showMeta: false
  };
}

function getMaterialAppearance(
  family: SimpleWorkbenchProposalConstructionSection["bands"][number]["materialFamily"],
  id: string
): MaterialAppearance {
  switch (family) {
    case "mass":
      return {
        accent: "#5f686f",
        detail: "concrete_core",
        definition: `
          <pattern id="${id}-fill" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#d7d8d5"></rect>
            <path d="M0 18 L18 0" stroke="#b6bbb9" stroke-width="0.9"></path>
            <path d="M-4 4 L4 -4 M14 22 L22 14" stroke="#c9cccc" stroke-width="0.75"></path>
            <ellipse cx="5" cy="6" rx="1.1" ry="0.8" fill="#8f9596"></ellipse>
            <ellipse cx="12" cy="11" rx="1" ry="0.75" fill="#a2a7a8"></ellipse>
            <ellipse cx="9" cy="15" rx="0.9" ry="0.7" fill="#c3c7c6"></ellipse>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#b5bbbd",
        stroke: "#7f878a",
        topFill: "#e2e5e4"
      };
    case "insulation":
      return {
        accent: "#8b7240",
        detail: "fiber_batt",
        definition: `
          <pattern id="${id}-fill" width="28" height="18" patternUnits="userSpaceOnUse">
            <rect width="28" height="18" fill="#f0e4c1"></rect>
            <path d="M0 12 C4 4, 10 4, 14 12 S24 20, 28 12" fill="none" stroke="#bea15b" stroke-width="1"></path>
            <path d="M0 7 C4 15, 10 15, 14 7 S24 -1, 28 7" fill="none" stroke="#ddc78e" stroke-width="0.85"></path>
            <path d="M4 18L11 11L17 18 M12 0L17 5L22 0" fill="none" stroke="#f8efd7" stroke-width="0.8"></path>
            <circle cx="8" cy="5" r="0.8" fill="#f9f2e4"></circle>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#b59b58",
        stroke: "#8e7440",
        topFill: "#e9d89e"
      };
    case "resilient":
      return {
        accent: "#5a8578",
        detail: "foam_mat",
        definition: `
          <pattern id="${id}-fill" width="20" height="12" patternUnits="userSpaceOnUse">
            <rect width="20" height="12" fill="#d4e7df"></rect>
            <path d="M0 7 H4 L6 3 L10 9 L14 3 L16 9 L20 7" fill="none" stroke="#6d9a9a" stroke-width="1"></path>
            <path d="M0 10 C4 8, 6 12, 10 10 S16 8, 20 10" fill="none" stroke="#eef8f7" stroke-width="0.8"></path>
            <rect x="2.4" y="2.2" width="7.2" height="4.6" rx="2.3" fill="none" stroke="#eef8f7" stroke-width="0.7"></rect>
            <rect x="11.2" y="7" width="6.1" height="3.8" rx="1.9" fill="none" stroke="#6a9f91" stroke-opacity="0.25" stroke-width="0.7"></rect>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#79a493",
        stroke: "#5a8578",
        topFill: "#c6ddd6"
      };
    case "gap":
      return {
        accent: "#6e8290",
        detail: "air_gap",
        definition: `
          <pattern id="${id}-fill" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#f2f5f8"></rect>
            <path d="M2 7 H12" stroke="#91a5b5" stroke-width="0.9" stroke-dasharray="3 2"></path>
            <circle cx="7" cy="7" r="0.85" fill="#c6d2db"></circle>
            <circle cx="4" cy="4" r="0.55" fill="#e7eef3"></circle>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#dde6ec",
        stroke: "#738595",
        topFill: "#fbfdfe"
      };
    case "board":
      return {
        accent: "#7f7367",
        detail: "board_panel",
        definition: `
          <pattern id="${id}-fill" width="24" height="18" patternUnits="userSpaceOnUse">
            <rect width="24" height="18" fill="#e1ddd3"></rect>
            <path d="M0 3H24 M0 15H24" stroke="#faf7f2" stroke-width="0.95"></path>
            <path d="M0 6H24 M0 12H24" stroke="#9f968b" stroke-opacity="0.08" stroke-width="0.8"></path>
            <circle cx="7" cy="9" r="0.8" fill="#a39a8d" fill-opacity="0.12"></circle>
            <circle cx="18" cy="8" r="0.9" fill="#ffffff" fill-opacity="0.18"></circle>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#c6baab",
        stroke: "#938779",
        topFill: "#ece7de"
      };
    case "generic":
    default:
      return {
        accent: "#6d7782",
        detail: "service_fill",
        definition: `
          <pattern id="${id}-fill" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#e9edf0"></rect>
            <path d="M0 12 L12 0 M-2 2 L2 -2 M10 14 L14 10" stroke="#bcc4cb" stroke-width="0.9"></path>
            <circle cx="8" cy="9" r="0.7" fill="#cfd7de"></circle>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#d8dfe4",
        stroke: "#717c88",
        topFill: "#f7f9fb"
      };
  }
}

function buildMaterialOverlayMarkup(input: {
  appearance: MaterialAppearance;
  clipId: string;
  height: number;
  width: number;
  x: number;
  y: number;
}): string {
  const { appearance, clipId, height, width, x, y } = input;
  const insetX = x + Math.min(14, Math.max(6, width * 0.06));
  const insetY = y + Math.min(10, Math.max(4, height * 0.18));
  const insetRight = Math.min(14, Math.max(6, width * 0.06));
  const insetBottom = Math.min(8, Math.max(4, height * 0.14));
  const innerWidth = Math.max(0, width - (insetX - x) - insetRight);
  const innerHeight = Math.max(0, height - (insetY - y) - insetBottom);

  if (innerWidth < 12 || innerHeight < 8) {
    return "";
  }

  const midY = insetY + innerHeight / 2;

  switch (appearance.detail) {
    case "board_panel":
      return `
        <g clip-path="url(#${clipId})" opacity="0.7">
          <line x1="${insetX}" y1="${insetY + 2.5}" x2="${insetX + innerWidth}" y2="${insetY + 2.5}" stroke="#ffffff" stroke-opacity="0.34" stroke-width="1.05"></line>
          <line x1="${insetX}" y1="${insetY + 6.5}" x2="${insetX + innerWidth}" y2="${insetY + 6.5}" stroke="${appearance.stroke}" stroke-opacity="0.14" stroke-width="0.85"></line>
          <line x1="${insetX}" y1="${insetY + innerHeight - 2.5}" x2="${insetX + innerWidth}" y2="${insetY + innerHeight - 2.5}" stroke="#ffffff" stroke-opacity="0.28" stroke-width="0.95"></line>
          <line x1="${insetX}" y1="${insetY + innerHeight - 6.5}" x2="${insetX + innerWidth}" y2="${insetY + innerHeight - 6.5}" stroke="${appearance.stroke}" stroke-opacity="0.12" stroke-width="0.8"></line>
          ${
            innerHeight > 28
              ? `<line x1="${insetX + innerWidth * 0.42}" y1="${insetY}" x2="${insetX + innerWidth * 0.42}" y2="${insetY + innerHeight}" stroke="${appearance.stroke}" stroke-opacity="0.16" stroke-dasharray="5 4" stroke-width="0.9"></line>`
              : ""
          }
          <ellipse cx="${insetX + innerWidth * 0.22}" cy="${midY}" rx="1.6" ry="1" fill="${appearance.stroke}" fill-opacity="0.12"></ellipse>
          <ellipse cx="${insetX + innerWidth * 0.74}" cy="${midY + innerHeight * 0.08}" rx="1.2" ry="0.9" fill="#ffffff" fill-opacity="0.18"></ellipse>
        </g>
      `;
    case "air_gap":
      return `
        <g clip-path="url(#${clipId})" opacity="0.82">
          <line x1="${insetX}" y1="${midY}" x2="${insetX + innerWidth}" y2="${midY}" stroke="${appearance.stroke}" stroke-opacity="0.3" stroke-dasharray="5 4" stroke-width="1.1"></line>
          <circle cx="${insetX + innerWidth * 0.28}" cy="${midY}" r="1.6" fill="${appearance.stroke}" fill-opacity="0.18"></circle>
          <circle cx="${insetX + innerWidth * 0.72}" cy="${midY}" r="1.4" fill="#ffffff" fill-opacity="0.28"></circle>
        </g>
      `;
    case "fiber_batt":
      return `
        <g clip-path="url(#${clipId})" opacity="0.76">
          <path d="M ${insetX - 2} ${insetY + innerHeight - 2} L ${insetX + innerWidth * 0.32} ${insetY + innerHeight * 0.35} L ${insetX + innerWidth * 0.6} ${insetY + innerHeight * 0.72} L ${insetX + innerWidth + 2} ${insetY + 2}" fill="none" stroke="${appearance.stroke}" stroke-opacity="0.24" stroke-width="1.1"></path>
          <path d="M ${insetX + innerWidth * 0.1} ${insetY - 1} L ${insetX + innerWidth * 0.44} ${insetY + innerHeight * 0.42} L ${insetX + innerWidth * 0.7} ${insetY + innerHeight * 0.12} L ${insetX + innerWidth + 1} ${insetY + innerHeight * 0.52}" fill="none" stroke="#ffffff" stroke-opacity="0.26" stroke-width="0.95"></path>
          <path d="M ${insetX} ${midY} C ${insetX + innerWidth * 0.16} ${midY - innerHeight * 0.12}, ${insetX + innerWidth * 0.34} ${midY + innerHeight * 0.14}, ${insetX + innerWidth * 0.54} ${midY - innerHeight * 0.02} S ${insetX + innerWidth * 0.84} ${midY + innerHeight * 0.16}, ${insetX + innerWidth} ${midY - innerHeight * 0.04}" fill="none" stroke="${appearance.stroke}" stroke-opacity="0.14" stroke-width="0.9"></path>
          <circle cx="${insetX + innerWidth * 0.28}" cy="${midY - innerHeight * 0.12}" r="1" fill="#ffffff" fill-opacity="0.22"></circle>
          <circle cx="${insetX + innerWidth * 0.68}" cy="${midY + innerHeight * 0.1}" r="0.9" fill="${appearance.stroke}" fill-opacity="0.14"></circle>
        </g>
      `;
    case "concrete_core":
      return `
        <g clip-path="url(#${clipId})" opacity="0.74">
          <ellipse cx="${insetX + innerWidth * 0.22}" cy="${insetY + innerHeight * 0.36}" rx="3.2" ry="2.3" fill="${appearance.stroke}" fill-opacity="0.18"></ellipse>
          <ellipse cx="${insetX + innerWidth * 0.58}" cy="${insetY + innerHeight * 0.58}" rx="2.4" ry="1.7" fill="#ffffff" fill-opacity="0.22"></ellipse>
          <ellipse cx="${insetX + innerWidth * 0.82}" cy="${insetY + innerHeight * 0.3}" rx="2.1" ry="1.4" fill="${appearance.stroke}" fill-opacity="0.12"></ellipse>
          <ellipse cx="${insetX + innerWidth * 0.32}" cy="${insetY + innerHeight * 0.74}" rx="2.6" ry="1.8" fill="${appearance.stroke}" fill-opacity="0.14"></ellipse>
          <ellipse cx="${insetX + innerWidth * 0.12}" cy="${insetY + innerHeight * 0.58}" rx="2.4" ry="1.5" fill="${appearance.stroke}" fill-opacity="0.12"></ellipse>
          <path d="M ${insetX + innerWidth * 0.06} ${insetY + innerHeight * 0.18} C ${insetX + innerWidth * 0.22} ${insetY + innerHeight * 0.12}, ${insetX + innerWidth * 0.38} ${insetY + innerHeight * 0.24}, ${insetX + innerWidth * 0.56} ${insetY + innerHeight * 0.16}" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="0.8"></path>
        </g>
      `;
    case "foam_mat":
      return `
        <g clip-path="url(#${clipId})" opacity="0.8">
          <path d="M ${insetX} ${midY} C ${insetX + innerWidth * 0.15} ${midY - innerHeight * 0.28}, ${insetX + innerWidth * 0.34} ${midY + innerHeight * 0.28}, ${insetX + innerWidth * 0.5} ${midY} S ${insetX + innerWidth * 0.84} ${midY - innerHeight * 0.28}, ${insetX + innerWidth} ${midY}" fill="none" stroke="${appearance.stroke}" stroke-opacity="0.28" stroke-width="1.25"></path>
          <path d="M ${insetX} ${midY + innerHeight * 0.18} C ${insetX + innerWidth * 0.18} ${midY - innerHeight * 0.06}, ${insetX + innerWidth * 0.36} ${midY + innerHeight * 0.36}, ${insetX + innerWidth * 0.54} ${midY + innerHeight * 0.12} S ${insetX + innerWidth * 0.84} ${midY + innerHeight * 0.02}, ${insetX + innerWidth} ${midY + innerHeight * 0.18}" fill="none" stroke="#ffffff" stroke-opacity="0.26" stroke-width="1"></path>
          <rect x="${insetX + innerWidth * 0.18}" y="${midY - innerHeight * 0.34}" width="${Math.max(10, innerWidth * 0.22)}" height="${Math.max(5, innerHeight * 0.18)}" rx="${Math.max(2.2, innerHeight * 0.09)}" fill="none" stroke="${appearance.stroke}" stroke-opacity="0.16" stroke-width="0.9"></rect>
          <rect x="${insetX + innerWidth * 0.58}" y="${midY + innerHeight * 0.12}" width="${Math.max(9, innerWidth * 0.18)}" height="${Math.max(4, innerHeight * 0.14)}" rx="${Math.max(2, innerHeight * 0.07)}" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="0.8"></rect>
        </g>
      `;
    case "service_fill":
      return `
        <g clip-path="url(#${clipId})" opacity="0.74">
          <line x1="${insetX}" y1="${insetY + innerHeight * 0.34}" x2="${insetX + innerWidth}" y2="${insetY + innerHeight * 0.34}" stroke="${appearance.stroke}" stroke-opacity="0.18" stroke-width="0.95"></line>
          <line x1="${insetX + innerWidth * 0.18}" y1="${insetY + innerHeight * 0.62}" x2="${insetX + innerWidth * 0.82}" y2="${insetY + innerHeight * 0.62}" stroke="#ffffff" stroke-opacity="0.24" stroke-width="0.9"></line>
          <circle cx="${insetX + innerWidth * 0.68}" cy="${insetY + innerHeight * 0.22}" r="1.4" fill="${appearance.stroke}" fill-opacity="0.12"></circle>
        </g>
      `;
    default:
      return "";
  }
}

function buildAnnotationRows(
  bands: readonly AxisBand[],
  rowYs: readonly number[],
  rowX: number,
  rowWidth: number,
  layout: ProposalConstructionAnnotationLayout
): string {
  return bands
    .map(({ appearance, band }, index) => {
      const rowY = rowYs[index]!;
      const labelLines =
        layout.maxLabelLines === 1
          ? [truncateSingleLineText(band.label, layout.labelLineLimit)]
          : multilineText(band.label, layout.labelLineLimit).slice(0, layout.maxLabelLines);
      const metaLines = layout.showMeta ? multilineText(band.metaLabel, layout.labelLineLimit + 4).slice(0, 1) : [];
      const separatorOffset = layout.compact ? 10 : 20;
      const badgeSize = layout.compact ? 14 : 22;
      const badgeY = rowY - (layout.compact ? 10 : 16);
      const labelPrimaryY = rowY - 1;
      const labelSecondaryY = rowY + 11;
      const metaY = rowY + 23;
      const titleFontSize = layout.compact ? "8.8" : "10.8";
      const secondaryFontSize = layout.compact ? "0" : "9.2";
      const metaFontSize = layout.compact ? "0" : "8.8";
      const thicknessFontSize = layout.compact ? "8.8" : "10.2";

      return `
        <line x1="${rowX}" y1="${rowY + separatorOffset}" x2="${rowX + rowWidth}" y2="${rowY + separatorOffset}" stroke="#d5dde4" stroke-width="1"></line>
        <rect x="${rowX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="${layout.compact ? 5 : 6}" fill="#223241"></rect>
        <text x="${rowX + badgeSize / 2}" y="${labelPrimaryY}" text-anchor="middle" font-family="Arial, Helvetica Neue, sans-serif" font-size="${layout.compact ? "8.2" : "10"}" font-weight="700" fill="#ffffff">${escapeMarkup(band.indexLabel)}</text>
        <text x="${rowX + (layout.compact ? 28 : 34)}" y="${labelPrimaryY}" font-family="Arial, Helvetica Neue, sans-serif" font-size="${titleFontSize}" font-weight="700" fill="#20303f">${escapeMarkup(labelLines[0] ?? band.label)}</text>
        ${
          labelLines[1] && !layout.compact
            ? `<text x="${rowX + 34}" y="${labelSecondaryY}" font-family="Arial, Helvetica Neue, sans-serif" font-size="${secondaryFontSize}" fill="#5f6f7d">${escapeMarkup(labelLines[1])}</text>`
            : ""
        }
        ${
          layout.showMeta
            ? `<text x="${rowX + 34}" y="${metaY}" font-family="Arial, Helvetica Neue, sans-serif" font-size="${metaFontSize}" fill="#71818e">${escapeMarkup(metaLines[0] ?? band.metaLabel)}</text>`
            : ""
        }
        <text x="${rowX + rowWidth}" y="${labelPrimaryY}" text-anchor="end" font-family="Arial, Helvetica Neue, sans-serif" font-size="${thicknessFontSize}" font-weight="700" fill="${appearance.accent}">${escapeMarkup(band.thicknessLabel)}</text>
      `;
    })
    .join("");
}

function buildFloorSvg(section: SimpleWorkbenchProposalConstructionSection): string {
  const rawAllocations = distributeIllustrationSizes(
    section.bands.map((band) => band.thicknessMm),
    "proposalFloor"
  );
  const rawTotalHeight = rawAllocations.reduce((sum, allocation) => sum + allocation.sizePx, 0);
  const scale = rawTotalHeight > 0 ? 236 / rawTotalHeight : 1;
  const allocations = rawAllocations.map((allocation) => ({
    ...allocation,
    sizePx: Math.round(allocation.sizePx * scale * 10) / 10
  }));
  const width = 860;
  const height = 380;
  const sectionX = 148;
  const sectionY = 76;
  const sectionWidth = 214;
  const totalHeight = allocations.reduce((sum, allocation) => sum + allocation.sizePx, 0);
  const rowX = 550;
  const rowWidth = 240;
  const annotationLayout = resolveConstructionAnnotationLayout({
    bandCount: section.bands.length,
    height,
    orientation: "floor"
  });
  const rowTargets = allocations.map((_, index) => {
    const offset = allocations.slice(0, index).reduce((sum, entry) => sum + entry.sizePx, 0);
    return sectionY + offset + allocations[index]!.sizePx / 2;
  });
  const rowYs = distributeAxisPositions(rowTargets, annotationLayout.minGap, annotationLayout.rowMin, annotationLayout.rowMax);

  let defs = createArrowHead("construction-arrow-floor", "#223241");
  defs += createSectionSheenDefs("construction-floor");
  let frontFaces = "";
  let leaders = "";
  let currentY = sectionY;

  const axisBands: AxisBand[] = section.bands.map((band, index) => {
    const appearance = getMaterialAppearance(band.materialFamily, `construction-floor-band-${index}`);
    defs += appearance.definition;

    const bandHeight = allocations[index]!.sizePx;
    const centerY = currentY + bandHeight / 2;
    const rowY = rowYs[index]!;
    const clipId = `construction-floor-band-${index}-clip`;
    const edgeWidth = Math.min(14, Math.max(8, sectionWidth * 0.05));
    const topCapHeight = Math.min(7, Math.max(3, bandHeight * 0.16));
    const seamHeight = Math.min(6, Math.max(2, bandHeight * 0.14));
    defs += `<clipPath id="${clipId}"><rect x="${sectionX}" y="${currentY.toFixed(2)}" width="${sectionWidth}" height="${bandHeight.toFixed(2)}"></rect></clipPath>`;
    frontFaces += `
      <rect x="${sectionX}" y="${currentY.toFixed(2)}" width="${sectionWidth}" height="${bandHeight.toFixed(2)}" fill="${appearance.fill}" stroke="${appearance.stroke}" stroke-width="1.15"></rect>
      <rect x="${sectionX}" y="${currentY.toFixed(2)}" width="${edgeWidth}" height="${bandHeight.toFixed(2)}" fill="${appearance.sideFill}" opacity="0.8"></rect>
      <rect x="${sectionX}" y="${currentY.toFixed(2)}" width="${sectionWidth}" height="${topCapHeight.toFixed(2)}" fill="${appearance.topFill}" opacity="0.92"></rect>
      ${buildMaterialOverlayMarkup({
        appearance,
        clipId,
        height: bandHeight,
        width: sectionWidth,
        x: sectionX,
        y: currentY
      })}
      <rect x="${sectionX}" y="${currentY.toFixed(2)}" width="${sectionWidth}" height="${bandHeight.toFixed(2)}" fill="url(#construction-floor-front-sheen)" opacity="0.55"></rect>
      <rect x="${sectionX}" y="${(currentY + bandHeight - seamHeight).toFixed(2)}" width="${sectionWidth}" height="${seamHeight.toFixed(2)}" fill="rgba(35,49,63,0.08)" opacity="0.78"></rect>
      <line x1="${sectionX + 1}" y1="${(currentY + 1).toFixed(2)}" x2="${sectionX + sectionWidth - 1}" y2="${(currentY + 1).toFixed(2)}" stroke="rgba(255,255,255,0.34)" stroke-width="1"></line>
    `;

    leaders += `
      <path d="${buildElbowLeader(
        { x: sectionX + sectionWidth + 10, y: centerY },
        { x: rowX - 12, y: rowY },
        rowX - 30
      )}" fill="none" stroke="#83919d" stroke-width="1"></path>
      <circle cx="${(rowX - 12).toFixed(2)}" cy="${rowY.toFixed(2)}" r="2.5" fill="${appearance.accent}"></circle>
    `;

    const axisBand = {
      appearance,
      band,
      center: centerY,
      size: bandHeight,
      start: currentY
    };

    currentY += bandHeight;
    return axisBand;
  });

  const totalDimX = sectionX - 50;
  const totalCenterY = sectionY + totalHeight / 2;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="display:block;width:100%;height:auto;max-height:340px;">
      <defs>${defs}</defs>
      <rect x="48" y="34" width="760" height="306" rx="26" fill="#faf7f1" stroke="#e4e8eb" stroke-width="1.2"></rect>
      <rect x="62" y="48" width="732" height="278" rx="20" fill="#fffdfa" stroke="#ece7de" stroke-width="1"></rect>
      <rect x="${sectionX - 2}" y="${sectionY + 8}" width="${sectionWidth + 22}" height="${totalHeight + 18}" rx="18" fill="rgba(79,64,48,0.08)"></rect>
      ${Array.from({ length: 6 })
        .map(
          (_, index) =>
            `<line x1="86" y1="${76 + index * 40}" x2="514" y2="${76 + index * 40}" stroke="rgba(142,128,112,0.12)" stroke-dasharray="3 7" stroke-width="1"></line>`
        )
        .join("")}
      <text x="${sectionX - 2}" y="${sectionY - 28}" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorFromLabel.toUpperCase())}</text>
      <text x="${sectionX - 2}" y="${sectionY + totalHeight + 44}" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorToLabel.toUpperCase())}</text>
      <line x1="${sectionX - 22}" y1="${sectionY - 14}" x2="${sectionX + sectionWidth + 18}" y2="${sectionY - 14}" stroke="#dce3e9" stroke-width="1"></line>
      <line x1="${sectionX - 22}" y1="${sectionY + totalHeight + 22}" x2="${sectionX + sectionWidth + 18}" y2="${sectionY + totalHeight + 22}" stroke="#dce3e9" stroke-width="1"></line>
      <rect x="${sectionX - 10}" y="${sectionY - 10}" width="${sectionWidth + 20}" height="${totalHeight + 20}" rx="16" fill="rgba(255,255,255,0.46)" stroke="rgba(137,121,99,0.18)" stroke-width="1.2"></rect>
      ${frontFaces}
      <rect x="${sectionX}" y="${sectionY}" width="${sectionWidth}" height="${totalHeight}" fill="none" stroke="#243545" stroke-width="1.2"></rect>
      ${leaders}
      <line x1="${totalDimX}" y1="${sectionY}" x2="${totalDimX}" y2="${sectionY + totalHeight}" stroke="#223241" stroke-width="1.1" marker-start="url(#construction-arrow-floor)" marker-end="url(#construction-arrow-floor)"></line>
      <line x1="${totalDimX - 8}" y1="${sectionY}" x2="${totalDimX + 8}" y2="${sectionY}" stroke="#223241" stroke-width="1"></line>
      <line x1="${totalDimX - 8}" y1="${sectionY + totalHeight}" x2="${totalDimX + 8}" y2="${sectionY + totalHeight}" stroke="#223241" stroke-width="1"></line>
      <text x="${(totalDimX - 6).toFixed(2)}" y="${totalCenterY.toFixed(2)}" text-anchor="middle" transform="rotate(-90 ${totalDimX - 6} ${totalCenterY.toFixed(2)})" font-family="Arial, Helvetica Neue, sans-serif" font-size="11.2" font-weight="700" fill="#223241">${escapeMarkup(section.totalThicknessLabel)}</text>
      ${buildAnnotationRows(axisBands, rowYs, rowX, rowWidth, annotationLayout)}
    </svg>
  `;
}

function buildWallSvg(section: SimpleWorkbenchProposalConstructionSection): string {
  const rawAllocations = distributeIllustrationSizes(
    section.bands.map((band) => band.thicknessMm),
    "proposalWall"
  );
  const rawTotalWidth = rawAllocations.reduce((sum, allocation) => sum + allocation.sizePx, 0);
  const scale = rawTotalWidth > 0 ? 274 / rawTotalWidth : 1;
  const allocations = rawAllocations.map((allocation) => ({
    ...allocation,
    sizePx: Math.round(allocation.sizePx * scale * 10) / 10
  }));
  const width = 860;
  const height = 326;
  const sectionX = 104;
  const sectionY = 108;
  const sectionHeight = 146;
  const totalWidth = allocations.reduce((sum, allocation) => sum + allocation.sizePx, 0);
  const rowX = 564;
  const rowWidth = 228;
  const annotationLayout = resolveConstructionAnnotationLayout({
    bandCount: section.bands.length,
    height,
    orientation: "wall"
  });
  const rowTargets = allocations.map((_, index) => 78 + index * 42);
  const rowYs = distributeAxisPositions(rowTargets, annotationLayout.minGap, annotationLayout.rowMin, annotationLayout.rowMax);

  let defs = createArrowHead("construction-arrow-wall", "#223241");
  defs += createSectionSheenDefs("construction-wall");
  let frontFaces = "";
  let leaders = "";
  let currentX = sectionX;

  const axisBands: AxisBand[] = section.bands.map((band, index) => {
    const appearance = getMaterialAppearance(band.materialFamily, `construction-wall-band-${index}`);
    defs += appearance.definition;

    const bandWidth = allocations[index]!.sizePx;
    const centerX = currentX + bandWidth / 2;
    const rowY = rowYs[index]!;
    const clipId = `construction-wall-band-${index}-clip`;
    const leadStripWidth = Math.min(8, Math.max(3, bandWidth * 0.18));
    const trailingStripWidth = Math.min(10, Math.max(4, bandWidth * 0.16));
    const topCapHeight = Math.min(7, Math.max(3, sectionHeight * 0.08));
    defs += `<clipPath id="${clipId}"><rect x="${currentX.toFixed(2)}" y="${sectionY}" width="${bandWidth.toFixed(2)}" height="${sectionHeight}"></rect></clipPath>`;
    frontFaces += `
      <rect x="${currentX.toFixed(2)}" y="${sectionY}" width="${bandWidth.toFixed(2)}" height="${sectionHeight}" fill="${appearance.fill}" stroke="${appearance.stroke}" stroke-width="1.15"></rect>
      <rect x="${currentX.toFixed(2)}" y="${sectionY}" width="${leadStripWidth.toFixed(2)}" height="${sectionHeight}" fill="${appearance.topFill}" opacity="0.78"></rect>
      <rect x="${(currentX + bandWidth - trailingStripWidth).toFixed(2)}" y="${sectionY}" width="${trailingStripWidth.toFixed(2)}" height="${sectionHeight}" fill="${appearance.sideFill}" opacity="0.58"></rect>
      <rect x="${currentX.toFixed(2)}" y="${sectionY}" width="${bandWidth.toFixed(2)}" height="${topCapHeight.toFixed(2)}" fill="${appearance.topFill}" opacity="0.92"></rect>
      ${buildMaterialOverlayMarkup({
        appearance,
        clipId,
        height: sectionHeight,
        width: bandWidth,
        x: currentX,
        y: sectionY
      })}
      <rect x="${currentX.toFixed(2)}" y="${sectionY}" width="${bandWidth.toFixed(2)}" height="${sectionHeight}" fill="url(#construction-wall-front-sheen)" opacity="0.44"></rect>
      <rect x="${currentX.toFixed(2)}" y="${sectionY}" width="${bandWidth.toFixed(2)}" height="${sectionHeight}" fill="url(#construction-wall-front-sidewash)" opacity="0.4"></rect>
      <line x1="${(currentX + 1).toFixed(2)}" y1="${sectionY + 1}" x2="${(currentX + bandWidth - 1).toFixed(2)}" y2="${sectionY + 1}" stroke="rgba(255,255,255,0.3)" stroke-width="1"></line>
    `;
    leaders += `
      <path d="${buildVerticalLeader(
        { x: centerX, y: sectionY - 10 },
        { x: rowX - 12, y: rowY },
        rowY
      )}" fill="none" stroke="#83919d" stroke-width="1"></path>
      <circle cx="${(rowX - 12).toFixed(2)}" cy="${rowY.toFixed(2)}" r="2.5" fill="${appearance.accent}"></circle>
    `;

    const axisBand = {
      appearance,
      band,
      center: centerX,
      size: bandWidth,
      start: currentX
    };

    currentX += bandWidth;
    return axisBand;
  });

  const totalDimY = sectionY + sectionHeight + 48;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="display:block;width:100%;height:auto;max-height:300px;">
      <defs>${defs}</defs>
      <rect x="48" y="30" width="760" height="262" rx="26" fill="#faf7f1" stroke="#e4e8eb" stroke-width="1.2"></rect>
      <rect x="62" y="44" width="732" height="234" rx="20" fill="#fffdfa" stroke="#ece7de" stroke-width="1"></rect>
      <rect x="${sectionX + 10}" y="${sectionY + 8}" width="${totalWidth + 18}" height="${sectionHeight + 16}" rx="18" fill="rgba(79,64,48,0.07)"></rect>
      ${Array.from({ length: 7 })
        .map(
          (_, index) =>
            `<line x1="${72 + index * 64}" y1="56" x2="${72 + index * 64}" y2="278" stroke="rgba(142,128,112,0.12)" stroke-dasharray="3 7" stroke-width="1"></line>`
        )
        .join("")}
      <text x="${sectionX}" y="${sectionY - 54}" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorFromLabel.toUpperCase())}</text>
      <text x="${sectionX + totalWidth}" y="${sectionY - 54}" text-anchor="end" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorToLabel.toUpperCase())}</text>
      <line x1="${sectionX - 10}" y1="${sectionY - 20}" x2="${sectionX + totalWidth + 12}" y2="${sectionY - 20}" stroke="#dce3e9" stroke-width="1"></line>
      <rect x="${sectionX - 10}" y="${sectionY - 10}" width="${totalWidth + 20}" height="${sectionHeight + 20}" rx="16" fill="rgba(255,255,255,0.46)" stroke="rgba(137,121,99,0.18)" stroke-width="1.2"></rect>
      ${frontFaces}
      <rect x="${sectionX}" y="${sectionY}" width="${totalWidth}" height="${sectionHeight}" fill="none" stroke="#243545" stroke-width="1.2"></rect>
      ${leaders}
      <line x1="${sectionX}" y1="${totalDimY}" x2="${sectionX + totalWidth}" y2="${totalDimY}" stroke="#223241" stroke-width="1.1" marker-start="url(#construction-arrow-wall)" marker-end="url(#construction-arrow-wall)"></line>
      <line x1="${sectionX}" y1="${totalDimY - 8}" x2="${sectionX}" y2="${totalDimY + 8}" stroke="#223241" stroke-width="1"></line>
      <line x1="${sectionX + totalWidth}" y1="${totalDimY - 8}" x2="${sectionX + totalWidth}" y2="${totalDimY + 8}" stroke="#223241" stroke-width="1"></line>
      <text x="${(sectionX + totalWidth / 2).toFixed(2)}" y="${(totalDimY - 10).toFixed(2)}" text-anchor="middle" font-family="Arial, Helvetica Neue, sans-serif" font-size="11.2" font-weight="700" fill="#223241">${escapeMarkup(section.totalThicknessLabel)}</text>
      ${buildAnnotationRows(axisBands, rowYs, rowX, rowWidth, annotationLayout)}
    </svg>
  `;
}

export function buildSimpleWorkbenchProposalConstructionRender(
  layers: readonly SimpleWorkbenchProposalConstructionLayer[],
  studyModeLabel: string,
  options?: {
    totalThicknessLabelOverride?: string | null;
  }
): ProposalConstructionRender {
  const section = buildSimpleWorkbenchProposalConstructionSection(layers, studyModeLabel, options);
  const svgMarkup = section.isWall ? buildWallSvg(section) : buildFloorSvg(section);
  const legendRowsHtml = section.bands
    .map(
      (band) => `
        <tr>
          <td>${escapeMarkup(band.indexLabel)}</td>
          <td><strong>${escapeMarkup(band.label)}</strong><span>${escapeMarkup(band.metaLabel)}</span></td>
          <td>${escapeMarkup(band.thicknessLabel)}</td>
        </tr>
      `
    )
    .join("");

  return {
    legendRowsHtml,
    section,
    svgMarkup
  };
}
