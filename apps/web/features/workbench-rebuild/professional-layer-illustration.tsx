"use client";

import { useId } from "react";

import {
  createIllustrationMaterial,
  getIllustrationThresholds,
  getIllustrationMaterialCue,
  type IllustrationAxis,
  type IllustrationMaterialCue,
  type LayerVisualMaterial
} from "../workbench/simple-workbench-illustration";

export type ProfessionalLayerIllustrationLayer = {
  active?: boolean;
  categoryLabel?: string;
  id: string;
  label: string;
  material?: LayerVisualMaterial;
  roleLabel: string;
  solverLabel?: string;
  thicknessLabel?: string;
  thicknessMm: number | null;
};

type ProfessionalLayerIllustrationProps = {
  layers: readonly ProfessionalLayerIllustrationLayer[];
  orientation: "floor" | "wall";
  title?: string;
};

type VisualLayer = ProfessionalLayerIllustrationLayer & {
  cue: IllustrationMaterialCue;
  material: LayerVisualMaterial;
  resolvedThicknessLabel: string;
};

const FALLBACK_THICKNESS_MM = 10;

function formatThickness(thicknessMm: number | null, fallback?: string): string {
  if (fallback) {
    return fallback;
  }

  if (typeof thicknessMm !== "number" || !Number.isFinite(thicknessMm) || thicknessMm <= 0) {
    return "Missing";
  }

  const rounded = Math.round(thicknessMm * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} mm` : `${rounded.toFixed(1)} mm`;
}

function formatTotalThickness(layers: readonly ProfessionalLayerIllustrationLayer[]): string {
  const total = layers.reduce((sum, layer) => sum + (layer.thicknessMm ?? 0), 0);

  if (total <= 0) {
    return "--";
  }

  return formatThickness(total);
}

function toVisualLayer(layer: ProfessionalLayerIllustrationLayer): VisualLayer {
  const material =
    layer.material ??
    createIllustrationMaterial({
      categoryLabel: layer.categoryLabel,
      label: layer.label,
      metaLabel: layer.roleLabel
    });

  return {
    ...layer,
    cue: getIllustrationMaterialCue(material),
    material,
    resolvedThicknessLabel: formatThickness(layer.thicknessMm, layer.thicknessLabel)
  };
}

function normalizeThickness(thicknessMm: number | null | undefined): number {
  return typeof thicknessMm === "number" && Number.isFinite(thicknessMm) && thicknessMm > 0 ? thicknessMm : FALLBACK_THICKNESS_MM;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function distributeProfessionalLayerSizes(
  thicknessesMm: readonly (number | null | undefined)[],
  axis: IllustrationAxis
): number[] {
  const preset = getIllustrationThresholds(axis);
  const normalized = thicknessesMm.map(normalizeThickness);
  const groups = new Map<string, { count: number; indexes: number[]; thicknessMm: number }>();

  normalized.forEach((thicknessMm, index) => {
    const key = String(Math.round(thicknessMm * 1000) / 1000);
    const existing = groups.get(key);

    if (existing) {
      existing.count += 1;
      existing.indexes.push(index);
      return;
    }

    groups.set(key, { count: 1, indexes: [index], thicknessMm });
  });

  const grouped = [...groups.values()];
  const desiredTotal = normalized.reduce((sum, value) => sum + value, 0) * preset.basePxPerMm;
  const feasibleMinimum = normalized.length * preset.minLayerPx;
  const feasibleMaximum = normalized.length * preset.maxLayerPx;
  const targetTotal = clamp(
    desiredTotal,
    Math.max(preset.minTotalPx, feasibleMinimum),
    Math.min(preset.maxTotalPx, feasibleMaximum)
  );
  const groupSizes = new Array<number>(grouped.length).fill(0);
  const locked = new Array<boolean>(grouped.length).fill(false);
  let remainingTarget = targetTotal;

  while (true) {
    const openIndexes = grouped.flatMap((group, index) => (locked[index] ? [] : [{ group, index }]));

    if (!openIndexes.length) {
      break;
    }

    const remainingWeight = openIndexes.reduce((sum, entry) => sum + entry.group.thicknessMm * entry.group.count, 0);

    if (remainingWeight <= 0 || remainingTarget <= 0) {
      const evenLayerSize = remainingTarget > 0 ? remainingTarget / openIndexes.reduce((sum, entry) => sum + entry.group.count, 0) : preset.minLayerPx;
      for (const entry of openIndexes) {
        groupSizes[entry.index] = clamp(evenLayerSize, preset.minLayerPx, preset.maxLayerPx);
      }
      break;
    }

    let constrainedThisPass = false;
    for (const entry of openIndexes) {
      const proposedGroupSize = ((entry.group.thicknessMm * entry.group.count) / remainingWeight) * remainingTarget;
      const proposedLayerSize = proposedGroupSize / entry.group.count;

      if (proposedLayerSize < preset.minLayerPx) {
        groupSizes[entry.index] = preset.minLayerPx;
        locked[entry.index] = true;
        remainingTarget -= preset.minLayerPx * entry.group.count;
        constrainedThisPass = true;
      } else if (proposedLayerSize > preset.maxLayerPx) {
        groupSizes[entry.index] = preset.maxLayerPx;
        locked[entry.index] = true;
        remainingTarget -= preset.maxLayerPx * entry.group.count;
        constrainedThisPass = true;
      }
    }

    if (!constrainedThisPass) {
      for (const entry of openIndexes) {
        groupSizes[entry.index] = (((entry.group.thicknessMm * entry.group.count) / remainingWeight) * remainingTarget) / entry.group.count;
      }
      break;
    }
  }

  const sizes = new Array<number>(normalized.length).fill(preset.minLayerPx);
  grouped.forEach((group, groupIndex) => {
    const size = Math.round(groupSizes[groupIndex]! * 10) / 10;
    group.indexes.forEach((index) => {
      sizes[index] = size;
    });
  });

  return sizes;
}

function renderTexture(input: {
  clipId: string;
  cue: IllustrationMaterialCue;
  height: number;
  width: number;
  x: number;
  y: number;
}) {
  const { clipId, cue, height, width, x, y } = input;
  const centerY = y + height / 2;
  const centerX = x + width / 2;

  switch (cue) {
    case "cavity":
      return (
        <g clipPath={`url(#${clipId})`}>
          <line className="rebuild-layer-texture-stroke" strokeDasharray="5 7" x1={x + 12} x2={x + width - 12} y1={centerY} y2={centerY} />
          <circle className="rebuild-layer-texture-fill" cx={x + width * 0.28} cy={y + height * 0.36} r="2.4" />
          <circle className="rebuild-layer-texture-fill" cx={x + width * 0.68} cy={y + height * 0.62} r="1.8" />
        </g>
      );
    case "fiber":
    case "resilient":
      return (
        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: 7 }).map((_, index) => {
            const offset = index * 28 - 18;
            return (
              <path
                className="rebuild-layer-texture-stroke"
                d={`M ${x + offset} ${y + height + 8} C ${x + offset + 20} ${y + height * 0.42}, ${x + offset + 44} ${y + height * 0.62}, ${x + offset + 66} ${y - 8}`}
                key={index}
              />
            );
          })}
        </g>
      );
    case "masonry":
      return (
        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <line
              className="rebuild-layer-texture-stroke"
              key={`h-${index}`}
              x1={x}
              x2={x + width}
              y1={y + ((index + 1) * height) / 5}
              y2={y + ((index + 1) * height) / 5}
            />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <line
              className="rebuild-layer-texture-stroke"
              key={`v-${index}`}
              x1={x + ((index + 1) * width) / 6}
              x2={x + ((index + 1) * width) / 6}
              y1={y}
              y2={y + height}
            />
          ))}
        </g>
      );
    case "timber":
    case "timber_support":
    case "support":
      return (
        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: 4 }).map((_, index) => {
            const lineY = y + ((index + 1) * height) / 5;
            return (
              <path
                className="rebuild-layer-texture-stroke"
                d={`M ${x} ${lineY} C ${x + width * 0.25} ${lineY - 9}, ${x + width * 0.38} ${lineY + 8}, ${centerX} ${lineY} S ${x + width * 0.78} ${lineY - 7}, ${x + width} ${lineY}`}
                key={index}
              />
            );
          })}
        </g>
      );
    case "steel_support":
      return (
        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <line
              className="rebuild-layer-texture-stroke"
              key={index}
              x1={x + ((index + 1) * width) / 6}
              x2={x + ((index + 1) * width) / 6}
              y1={y}
              y2={y + height}
            />
          ))}
        </g>
      );
    case "concrete":
    case "mass":
      return (
        <g clipPath={`url(#${clipId})`}>
          {[
            [0.18, 0.28, 2.2],
            [0.42, 0.58, 1.8],
            [0.66, 0.34, 2.6],
            [0.82, 0.72, 1.7],
            [0.28, 0.76, 1.5]
          ].map(([cx, cy, r], index) => (
            <circle className="rebuild-layer-texture-fill" cx={x + width * cx!} cy={y + height * cy!} key={index} r={r} />
          ))}
        </g>
      );
    case "board":
    case "plaster":
    case "surface":
    default:
      return (
        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <line
              className="rebuild-layer-texture-stroke"
              key={index}
              x1={x + 8}
              x2={x + width - 8}
              y1={y + ((index + 1) * height) / 6}
              y2={y + ((index + 1) * height) / 6}
            />
          ))}
        </g>
      );
  }
}

function renderLayerIndex(input: { index: number; x: number; y: number }) {
  return (
    <g>
      <circle className="rebuild-layer-index-badge" cx={input.x} cy={input.y} r="13" />
      <text className="rebuild-layer-index-text" dominantBaseline="middle" textAnchor="middle" x={input.x} y={input.y + 0.5}>
        {input.index + 1}
      </text>
    </g>
  );
}

function renderWallSection(layers: readonly VisualLayer[], idPrefix: string) {
  const allocations = distributeProfessionalLayerSizes(layers.map((layer) => layer.thicknessMm), "wall");
  const viewWidth = 780;
  const viewHeight = 330;
  const sectionX = 112;
  const sectionY = 104;
  const sectionHeight = 132;
  const totalWidth = allocations.reduce((sum, width) => sum + width, 0);
  const dimensionY = sectionY + sectionHeight + 34;
  let currentX = sectionX;

  return (
    <svg className="rebuild-layer-svg" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
      <rect className="rebuild-layer-grid-bg" height="290" rx="10" width="704" x="38" y="20" />
      <g className="rebuild-layer-grid-lines">
        {Array.from({ length: 9 }).map((_, index) => (
          <line key={`v-${index}`} x1={78 + index * 76} x2={78 + index * 76} y1="44" y2="286" />
        ))}
        {Array.from({ length: 4 }).map((_, index) => (
          <line key={`h-${index}`} x1="68" x2="710" y1={72 + index * 54} y2={72 + index * 54} />
        ))}
      </g>
      <text className="rebuild-layer-side-label" x={sectionX} y={sectionY - 26}>
        Side A
      </text>
      <text className="rebuild-layer-side-label" textAnchor="end" x={sectionX + totalWidth} y={sectionY - 26}>
        Side B
      </text>
      <rect className="rebuild-layer-section-backplate" height={sectionHeight + 28} rx="8" width={totalWidth + 28} x={sectionX - 14} y={sectionY - 14} />
      {layers.map((layer, index) => {
        const width = allocations[index]!;
        const clipId = `${idPrefix}-wall-${index}`;
        const x = currentX;
        currentX += width;

        return (
          <g
            className="rebuild-layer-block"
            data-active={layer.active ? "true" : "false"}
            data-cue={layer.cue}
            data-layer-id={layer.id}
            data-layer-size-px={width}
            data-layer-thickness-mm={layer.thicknessMm ?? undefined}
            key={layer.id}
          >
            <clipPath id={clipId}>
              <rect height={sectionHeight} width={width} x={x} y={sectionY} />
            </clipPath>
            <rect className="rebuild-layer-face" height={sectionHeight} width={width} x={x} y={sectionY} />
            <rect className="rebuild-layer-face-side" height={sectionHeight} width={Math.min(12, width * 0.18)} x={x} y={sectionY} />
            {renderTexture({ clipId, cue: layer.cue, height: sectionHeight, width, x, y: sectionY })}
            <line className="rebuild-layer-seam" x1={x + width} x2={x + width} y1={sectionY} y2={sectionY + sectionHeight} />
            {renderLayerIndex({ index, x: x + width / 2, y: sectionY + sectionHeight / 2 })}
          </g>
        );
      })}
      <line className="rebuild-layer-dimension-line" x1={sectionX} x2={sectionX + totalWidth} y1={dimensionY} y2={dimensionY} />
      <line className="rebuild-layer-dimension-line" x1={sectionX} x2={sectionX} y1={dimensionY - 8} y2={dimensionY + 8} />
      <line className="rebuild-layer-dimension-line" x1={sectionX + totalWidth} x2={sectionX + totalWidth} y1={dimensionY - 8} y2={dimensionY + 8} />
      <text className="rebuild-layer-dimension-text" textAnchor="middle" x={sectionX + totalWidth / 2} y={dimensionY + 24}>
        {formatTotalThickness(layers)}
      </text>
    </svg>
  );
}

function renderFloorSection(layers: readonly VisualLayer[], idPrefix: string) {
  const allocations = distributeProfessionalLayerSizes(layers.map((layer) => layer.thicknessMm), "floor");
  const viewWidth = 780;
  const viewHeight = 420;
  const sectionX = 180;
  const sectionWidth = 330;
  const totalHeight = allocations.reduce((sum, height) => sum + height, 0);
  const sectionY = Math.max(54, (viewHeight - totalHeight) / 2);
  const dimensionX = sectionX - 34;
  let currentY = sectionY;

  return (
    <svg className="rebuild-layer-svg" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
      <rect className="rebuild-layer-grid-bg" height="372" rx="10" width="704" x="38" y="24" />
      <g className="rebuild-layer-grid-lines">
        {Array.from({ length: 8 }).map((_, index) => (
          <line key={`v-${index}`} x1={86 + index * 76} x2={86 + index * 76} y1="54" y2="366" />
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <line key={`h-${index}`} x1="68" x2="710" y1={72 + index * 48} y2={72 + index * 48} />
        ))}
      </g>
      <text className="rebuild-layer-side-label" x={sectionX} y={sectionY - 22}>
        Walking side
      </text>
      <text className="rebuild-layer-side-label" x={sectionX} y={sectionY + totalHeight + 34}>
        Ceiling side
      </text>
      <rect className="rebuild-layer-section-backplate" height={totalHeight + 28} rx="8" width={sectionWidth + 28} x={sectionX - 14} y={sectionY - 14} />
      {layers.map((layer, index) => {
        const height = allocations[index]!;
        const clipId = `${idPrefix}-floor-${index}`;
        const y = currentY;
        currentY += height;

        return (
          <g
            className="rebuild-layer-block"
            data-active={layer.active ? "true" : "false"}
            data-cue={layer.cue}
            data-layer-id={layer.id}
            data-layer-size-px={height}
            data-layer-thickness-mm={layer.thicknessMm ?? undefined}
            key={layer.id}
          >
            <clipPath id={clipId}>
              <rect height={height} width={sectionWidth} x={sectionX} y={y} />
            </clipPath>
            <rect className="rebuild-layer-face" height={height} width={sectionWidth} x={sectionX} y={y} />
            <rect className="rebuild-layer-face-side" height={height} width="16" x={sectionX} y={y} />
            {renderTexture({ clipId, cue: layer.cue, height, width: sectionWidth, x: sectionX, y })}
            <line className="rebuild-layer-seam" x1={sectionX} x2={sectionX + sectionWidth} y1={y + height} y2={y + height} />
            {renderLayerIndex({ index, x: sectionX + 24, y: y + height / 2 })}
            <text className="rebuild-layer-thickness-callout" dominantBaseline="middle" x={sectionX + sectionWidth + 24} y={y + height / 2}>
              {layer.resolvedThicknessLabel}
            </text>
          </g>
        );
      })}
      <line className="rebuild-layer-dimension-line" x1={dimensionX} x2={dimensionX} y1={sectionY} y2={sectionY + totalHeight} />
      <line className="rebuild-layer-dimension-line" x1={dimensionX - 8} x2={dimensionX + 8} y1={sectionY} y2={sectionY} />
      <line className="rebuild-layer-dimension-line" x1={dimensionX - 8} x2={dimensionX + 8} y1={sectionY + totalHeight} y2={sectionY + totalHeight} />
      <text
        className="rebuild-layer-dimension-text"
        textAnchor="middle"
        transform={`rotate(-90 ${dimensionX - 16} ${sectionY + totalHeight / 2})`}
        x={dimensionX - 16}
        y={sectionY + totalHeight / 2}
      >
        {formatTotalThickness(layers)}
      </text>
    </svg>
  );
}

export function ProfessionalLayerIllustration({ layers, orientation, title }: ProfessionalLayerIllustrationProps) {
  const idPrefix = useId().replaceAll(":", "");
  const visualLayers = layers.map(toVisualLayer);
  const activeLayer = visualLayers.find((layer) => layer.active);

  return (
    <section className="rebuild-layer-figure" data-orientation={orientation}>
      <header className="rebuild-layer-header">
        <div>
          <div className="eyebrow">{orientation === "floor" ? "Floor section" : "Wall section"}</div>
          <h3 className="rebuild-layer-title">{title ?? "Construction layer stack"}</h3>
        </div>
        <div className="rebuild-layer-meta">
          <span>{visualLayers.length} layers</span>
          <span>{formatTotalThickness(visualLayers)}</span>
        </div>
      </header>

      <div className="rebuild-layer-body">
        <figure className="rebuild-layer-visual" aria-label={`${orientation} construction section`}>
          {orientation === "floor" ? renderFloorSection(visualLayers, idPrefix) : renderWallSection(visualLayers, idPrefix)}
        </figure>

        <div className="rebuild-layer-schedule" aria-label="Technical layer schedule">
          <div className="rebuild-layer-schedule-head">
            <span>Technical layer schedule</span>
            <strong>{activeLayer ? `Selected: ${activeLayer.label}` : "No selected layer"}</strong>
          </div>
          <ol className="rebuild-layer-schedule-list">
            {visualLayers.map((layer, index) => (
              <li className="rebuild-layer-schedule-row" data-active={layer.active ? "true" : "false"} data-cue={layer.cue} key={layer.id}>
                <span className="rebuild-layer-schedule-index">{index + 1}</span>
                <span className="rebuild-layer-schedule-main">
                  <strong>{layer.label}</strong>
                  <small>{layer.roleLabel}</small>
                </span>
                <span className="rebuild-layer-schedule-value">{layer.resolvedThicknessLabel}</span>
                {layer.solverLabel ? <span className="ui-badge ui-badge-compact">{layer.solverLabel}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
