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

function polygonPoints(points: readonly Point[]): string {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
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

function getMaterialAppearance(
  family: SimpleWorkbenchProposalConstructionSection["bands"][number]["materialFamily"],
  id: string
): MaterialAppearance {
  switch (family) {
    case "mass":
      return {
        accent: "#616a74",
        definition: `
          <pattern id="${id}-fill" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#ddd7cd"></rect>
            <path d="M0 18 L18 0" stroke="#bdb4a8" stroke-width="0.9"></path>
            <path d="M-4 4 L4 -4 M14 22 L22 14" stroke="#cdc6bb" stroke-width="0.75"></path>
            <circle cx="5" cy="6" r="0.9" fill="#958d81"></circle>
            <circle cx="12" cy="11" r="0.9" fill="#a49c90"></circle>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#c9c1b5",
        stroke: "#66717b",
        topFill: "#eee9df"
      };
    case "insulation":
      return {
        accent: "#8b7345",
        definition: `
          <pattern id="${id}-fill" width="28" height="18" patternUnits="userSpaceOnUse">
            <rect width="28" height="18" fill="#f1e7d0"></rect>
            <path d="M0 12 C4 4, 10 4, 14 12 S24 20, 28 12" fill="none" stroke="#c0a062" stroke-width="1"></path>
            <path d="M0 7 C4 15, 10 15, 14 7 S24 -1, 28 7" fill="none" stroke="#dcc28d" stroke-width="0.85"></path>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#dec89f",
        stroke: "#8c7547",
        topFill: "#f7edd7"
      };
    case "resilient":
      return {
        accent: "#4d7274",
        definition: `
          <pattern id="${id}-fill" width="20" height="12" patternUnits="userSpaceOnUse">
            <rect width="20" height="12" fill="#d8ebe8"></rect>
            <path d="M0 7 H4 L6 3 L10 9 L14 3 L16 9 L20 7" fill="none" stroke="#6d9a9a" stroke-width="1"></path>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#bedbda",
        stroke: "#4d7476",
        topFill: "#edf7f6"
      };
    case "gap":
      return {
        accent: "#6e8290",
        definition: `
          <pattern id="${id}-fill" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#f2f5f8"></rect>
            <path d="M2 7 H12" stroke="#91a5b5" stroke-width="0.9" stroke-dasharray="3 2"></path>
            <circle cx="7" cy="7" r="0.85" fill="#c6d2db"></circle>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#dde6ec",
        stroke: "#738595",
        topFill: "#fbfdfe"
      };
    case "board":
      return {
        accent: "#9a6c48",
        definition: `
          <pattern id="${id}-fill" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="12" height="12" fill="#efe2d3"></rect>
            <path d="M0 0 V12" stroke="#c49c79" stroke-width="1"></path>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#dfc3a7",
        stroke: "#9d6f4a",
        topFill: "#f7eadc"
      };
    case "generic":
    default:
      return {
        accent: "#6d7782",
        definition: `
          <pattern id="${id}-fill" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#e9edf0"></rect>
            <path d="M0 12 L12 0 M-2 2 L2 -2 M10 14 L14 10" stroke="#bcc4cb" stroke-width="0.9"></path>
          </pattern>
        `,
        fill: `url(#${id}-fill)`,
        sideFill: "#d8dfe4",
        stroke: "#717c88",
        topFill: "#f7f9fb"
      };
  }
}

function buildAnnotationRows(
  bands: readonly AxisBand[],
  rowYs: readonly number[],
  rowX: number,
  rowWidth: number,
  lineLimit: number
): string {
  return bands
    .map(({ appearance, band }, index) => {
      const rowY = rowYs[index]!;
      const labelLines = multilineText(band.label, lineLimit);
      const metaLines = multilineText(band.metaLabel, lineLimit + 4);

      return `
        <line x1="${rowX}" y1="${rowY + 20}" x2="${rowX + rowWidth}" y2="${rowY + 20}" stroke="#d5dde4" stroke-width="1"></line>
        <rect x="${rowX}" y="${rowY - 16}" width="22" height="22" rx="6" fill="#223241"></rect>
        <text x="${rowX + 11}" y="${rowY - 1}" text-anchor="middle" font-family="Arial, Helvetica Neue, sans-serif" font-size="10" font-weight="700" fill="#ffffff">${escapeMarkup(band.indexLabel)}</text>
        <text x="${rowX + 34}" y="${rowY - 1}" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" fill="#20303f">${escapeMarkup(labelLines[0] ?? band.label)}</text>
        ${
          labelLines[1]
            ? `<text x="${rowX + 34}" y="${rowY + 11}" font-family="Arial, Helvetica Neue, sans-serif" font-size="9.2" fill="#5f6f7d">${escapeMarkup(labelLines[1])}</text>`
            : ""
        }
        <text x="${rowX + 34}" y="${rowY + 23}" font-family="Arial, Helvetica Neue, sans-serif" font-size="8.8" fill="#71818e">${escapeMarkup(metaLines[0] ?? band.metaLabel)}</text>
        <text x="${rowX + rowWidth}" y="${rowY - 1}" text-anchor="end" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.2" font-weight="700" fill="${appearance.accent}">${escapeMarkup(band.thicknessLabel)}</text>
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
  const scale = rawTotalHeight > 0 ? 232 / rawTotalHeight : 1;
  const allocations = rawAllocations.map((allocation) => ({
    ...allocation,
    sizePx: Math.round(allocation.sizePx * scale * 10) / 10
  }));
  const width = 860;
  const height = 370;
  const sectionX = 150;
  const sectionY = 82;
  const sectionWidth = 210;
  const depthX = 118;
  const depthY = -34;
  const totalHeight = allocations.reduce((sum, allocation) => sum + allocation.sizePx, 0);
  const rowX = 560;
  const rowWidth = 232;
  const rowTargets = allocations.map((_, index) => {
    const offset = allocations.slice(0, index).reduce((sum, entry) => sum + entry.sizePx, 0);
    return sectionY + offset + allocations[index]!.sizePx / 2;
  });
  const rowYs = distributeAxisPositions(rowTargets, 50, 104, height - 92);

  let defs = createArrowHead("construction-arrow-floor", "#223241");
  let frontFaces = "";
  let sideFaces = "";
  let leaders = "";
  let currentY = sectionY;

  const axisBands: AxisBand[] = section.bands.map((band, index) => {
    const appearance = getMaterialAppearance(band.materialFamily, `construction-floor-band-${index}`);
    defs += appearance.definition;

    const bandHeight = allocations[index]!.sizePx;
    const centerY = currentY + bandHeight / 2;
    const rowY = rowYs[index]!;
    const sidePolygon = [
      { x: sectionX + sectionWidth, y: currentY },
      { x: sectionX + sectionWidth + depthX, y: currentY + depthY },
      { x: sectionX + sectionWidth + depthX, y: currentY + depthY + bandHeight },
      { x: sectionX + sectionWidth, y: currentY + bandHeight }
    ];

    sideFaces += `
      <polygon points="${polygonPoints(sidePolygon)}" fill="${appearance.sideFill}" stroke="${appearance.stroke}" stroke-width="1.1"></polygon>
    `;
    frontFaces += `
      <rect x="${sectionX}" y="${currentY.toFixed(2)}" width="${sectionWidth}" height="${bandHeight.toFixed(2)}" fill="${appearance.fill}" stroke="${appearance.stroke}" stroke-width="1.15"></rect>
    `;

    leaders += `
      <path d="${buildElbowLeader(
        { x: sectionX + sectionWidth + depthX + 8, y: centerY + depthY / 2 },
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

  const topBand = axisBands[0];
  const topPolygon =
    topBand
      ? [
          { x: sectionX, y: sectionY },
          { x: sectionX + sectionWidth, y: sectionY },
          { x: sectionX + sectionWidth + depthX, y: sectionY + depthY },
          { x: sectionX + depthX, y: sectionY + depthY }
        ]
      : null;
  const totalDimX = sectionX - 64;
  const totalCenterY = sectionY + totalHeight / 2;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="display:block;width:100%;height:auto;max-height:340px;">
      <defs>${defs}</defs>
      <text x="${sectionX - 2}" y="${sectionY - 28}" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorFromLabel.toUpperCase())}</text>
      <text x="${sectionX - 2}" y="${sectionY + totalHeight + 44}" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorToLabel.toUpperCase())}</text>
      <line x1="${sectionX - 22}" y1="${sectionY - 14}" x2="${sectionX + sectionWidth + depthX + 18}" y2="${sectionY - 14}" stroke="#dce3e9" stroke-width="1"></line>
      <line x1="${sectionX - 22}" y1="${sectionY + totalHeight + 22}" x2="${sectionX + sectionWidth + depthX + 18}" y2="${sectionY + totalHeight + 22}" stroke="#dce3e9" stroke-width="1"></line>
      ${sideFaces}
      ${
        topPolygon && topBand
          ? `<polygon points="${polygonPoints(topPolygon)}" fill="${topBand.appearance.topFill}" stroke="${topBand.appearance.stroke}" stroke-width="1.15"></polygon>`
          : ""
      }
      ${frontFaces}
      <rect x="${sectionX}" y="${sectionY}" width="${sectionWidth}" height="${totalHeight}" fill="none" stroke="#243545" stroke-width="1.2"></rect>
      ${leaders}
      <line x1="${totalDimX}" y1="${sectionY}" x2="${totalDimX}" y2="${sectionY + totalHeight}" stroke="#223241" stroke-width="1.1" marker-start="url(#construction-arrow-floor)" marker-end="url(#construction-arrow-floor)"></line>
      <line x1="${totalDimX - 8}" y1="${sectionY}" x2="${totalDimX + 8}" y2="${sectionY}" stroke="#223241" stroke-width="1"></line>
      <line x1="${totalDimX - 8}" y1="${sectionY + totalHeight}" x2="${totalDimX + 8}" y2="${sectionY + totalHeight}" stroke="#223241" stroke-width="1"></line>
      <text x="${(totalDimX - 6).toFixed(2)}" y="${totalCenterY.toFixed(2)}" text-anchor="middle" transform="rotate(-90 ${totalDimX - 6} ${totalCenterY.toFixed(2)})" font-family="Arial, Helvetica Neue, sans-serif" font-size="11.2" font-weight="700" fill="#223241">${escapeMarkup(section.totalThicknessLabel)}</text>
      ${buildAnnotationRows(axisBands, rowYs, rowX, rowWidth, 18)}
    </svg>
  `;
}

function buildWallSvg(section: SimpleWorkbenchProposalConstructionSection): string {
  const rawAllocations = distributeIllustrationSizes(
    section.bands.map((band) => band.thicknessMm),
    "proposalWall"
  );
  const rawTotalWidth = rawAllocations.reduce((sum, allocation) => sum + allocation.sizePx, 0);
  const scale = rawTotalWidth > 0 ? 264 / rawTotalWidth : 1;
  const allocations = rawAllocations.map((allocation) => ({
    ...allocation,
    sizePx: Math.round(allocation.sizePx * scale * 10) / 10
  }));
  const width = 860;
  const height = 326;
  const sectionX = 104;
  const sectionY = 110;
  const sectionHeight = 154;
  const depthX = 52;
  const depthY = -18;
  const totalWidth = allocations.reduce((sum, allocation) => sum + allocation.sizePx, 0);
  const rowX = 564;
  const rowWidth = 228;
  const rowTargets = allocations.map((_, index) => {
    const offset = allocations.slice(0, index).reduce((sum, entry) => sum + entry.sizePx, 0);
    return 78 + index * 42;
  });
  const rowYs = distributeAxisPositions(rowTargets, 42, 72, height - 64);

  let defs = createArrowHead("construction-arrow-wall", "#223241");
  let frontFaces = "";
  let topFaces = "";
  let leaders = "";
  let currentX = sectionX;

  const axisBands: AxisBand[] = section.bands.map((band, index) => {
    const appearance = getMaterialAppearance(band.materialFamily, `construction-wall-band-${index}`);
    defs += appearance.definition;

    const bandWidth = allocations[index]!.sizePx;
    const centerX = currentX + bandWidth / 2;
    const rowY = rowYs[index]!;
    const topPolygon = [
      { x: currentX, y: sectionY },
      { x: currentX + bandWidth, y: sectionY },
      { x: currentX + bandWidth + depthX, y: sectionY + depthY },
      { x: currentX + depthX, y: sectionY + depthY }
    ];

    topFaces += `
      <polygon points="${polygonPoints(topPolygon)}" fill="${appearance.topFill}" stroke="${appearance.stroke}" stroke-width="1.1"></polygon>
    `;
    frontFaces += `
      <rect x="${currentX.toFixed(2)}" y="${sectionY}" width="${bandWidth.toFixed(2)}" height="${sectionHeight}" fill="${appearance.fill}" stroke="${appearance.stroke}" stroke-width="1.15"></rect>
    `;
    leaders += `
      <path d="${buildVerticalLeader(
        { x: centerX + depthX * 0.5, y: sectionY + depthY * 0.5 - 4 },
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

  const trailingBand = axisBands.at(-1);
  const trailingSide =
    trailingBand
      ? [
          { x: sectionX + totalWidth, y: sectionY },
          { x: sectionX + totalWidth + depthX, y: sectionY + depthY },
          { x: sectionX + totalWidth + depthX, y: sectionY + depthY + sectionHeight },
          { x: sectionX + totalWidth, y: sectionY + sectionHeight }
        ]
      : null;
  const totalDimY = sectionY + sectionHeight + 48;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="display:block;width:100%;height:auto;max-height:300px;">
      <defs>${defs}</defs>
      <text x="${sectionX}" y="${sectionY - 54}" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorFromLabel.toUpperCase())}</text>
      <text x="${sectionX + totalWidth + depthX}" y="${sectionY - 54}" text-anchor="end" font-family="Arial, Helvetica Neue, sans-serif" font-size="10.8" font-weight="700" letter-spacing="1.8" fill="#5a6a79">${escapeMarkup(section.anchorToLabel.toUpperCase())}</text>
      <line x1="${sectionX - 10}" y1="${sectionY - 20}" x2="${sectionX + totalWidth + depthX + 12}" y2="${sectionY - 20}" stroke="#dce3e9" stroke-width="1"></line>
      ${trailingSide && trailingBand ? `<polygon points="${polygonPoints(trailingSide)}" fill="${trailingBand.appearance.sideFill}" stroke="${trailingBand.appearance.stroke}" stroke-width="1.1"></polygon>` : ""}
      ${topFaces}
      ${frontFaces}
      <rect x="${sectionX}" y="${sectionY}" width="${totalWidth}" height="${sectionHeight}" fill="none" stroke="#243545" stroke-width="1.2"></rect>
      ${leaders}
      <line x1="${sectionX}" y1="${totalDimY}" x2="${sectionX + totalWidth}" y2="${totalDimY}" stroke="#223241" stroke-width="1.1" marker-start="url(#construction-arrow-wall)" marker-end="url(#construction-arrow-wall)"></line>
      <line x1="${sectionX}" y1="${totalDimY - 8}" x2="${sectionX}" y2="${totalDimY + 8}" stroke="#223241" stroke-width="1"></line>
      <line x1="${sectionX + totalWidth}" y1="${totalDimY - 8}" x2="${sectionX + totalWidth}" y2="${totalDimY + 8}" stroke="#223241" stroke-width="1"></line>
      <text x="${(sectionX + totalWidth / 2).toFixed(2)}" y="${(totalDimY - 10).toFixed(2)}" text-anchor="middle" font-family="Arial, Helvetica Neue, sans-serif" font-size="11.2" font-weight="700" fill="#223241">${escapeMarkup(section.totalThicknessLabel)}</text>
      ${buildAnnotationRows(axisBands, rowYs, rowX, rowWidth, 18)}
    </svg>
  `;
}

export function buildSimpleWorkbenchProposalConstructionRender(
  layers: readonly SimpleWorkbenchProposalConstructionLayer[],
  studyModeLabel: string
): ProposalConstructionRender {
  const section = buildSimpleWorkbenchProposalConstructionSection(layers, studyModeLabel);
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
