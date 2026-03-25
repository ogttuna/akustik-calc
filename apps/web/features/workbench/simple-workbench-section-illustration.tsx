"use client";

import type { MaterialDefinition } from "@dynecho/shared";
import { useId } from "react";

import {
  distributeIllustrationSizes,
  getIllustrationMaterialCue,
  type IllustrationAxis,
  type LayerVisualMaterial
} from "./simple-workbench-illustration";

type SectionIllustrationLayer = {
  active?: boolean;
  indexLabel: string;
  key: string;
  material: MaterialDefinition | LayerVisualMaterial;
  ready?: boolean;
  thicknessLabel: string;
  thicknessMm: number | null;
};

type SectionIllustrationProps = {
  axis: IllustrationAxis;
  compact?: boolean;
  layers: readonly SectionIllustrationLayer[];
  orientation: "floor" | "wall";
};

type CueAppearance = {
  badgeFill: string;
  badgeText: string;
  front: string;
  pattern: "board" | "bubbles" | "cavity" | "fiber" | "masonry" | "speckle" | "steel" | "timber";
  patternOpacity: number;
  side: string;
  stroke: string;
  top: string;
};

const CUE_APPEARANCES: Record<ReturnType<typeof getIllustrationMaterialCue>, CueAppearance> = {
  board: {
    badgeFill: "#f6fbff",
    badgeText: "#23405d",
    front: "#bfd9f0",
    pattern: "board",
    patternOpacity: 0.42,
    side: "#88acc8",
    stroke: "#6b8ba3",
    top: "#d8e8f5"
  },
  cavity: {
    badgeFill: "#f4f8fb",
    badgeText: "#334454",
    front: "#cbd3da",
    pattern: "cavity",
    patternOpacity: 0.55,
    side: "#a1acb8",
    stroke: "#7a8795",
    top: "#d9e1e8"
  },
  concrete: {
    badgeFill: "#fafcff",
    badgeText: "#324250",
    front: "#c8d0d8",
    pattern: "speckle",
    patternOpacity: 0.56,
    side: "#a6b0bb",
    stroke: "#808c99",
    top: "#dbe2e9"
  },
  fiber: {
    badgeFill: "#f5fcf8",
    badgeText: "#1f4f43",
    front: "#a7d7ce",
    pattern: "fiber",
    patternOpacity: 0.5,
    side: "#7eb3ab",
    stroke: "#5d8d86",
    top: "#cae9e3"
  },
  mass: {
    badgeFill: "#fafcff",
    badgeText: "#33404c",
    front: "#d1d7de",
    pattern: "speckle",
    patternOpacity: 0.42,
    side: "#adb7c1",
    stroke: "#828d99",
    top: "#e0e6ec"
  },
  masonry: {
    badgeFill: "#fff8f0",
    badgeText: "#65462d",
    front: "#dbc2a8",
    pattern: "masonry",
    patternOpacity: 0.48,
    side: "#ba9c80",
    stroke: "#8d7259",
    top: "#ead7c2"
  },
  plaster: {
    badgeFill: "#fffaf2",
    badgeText: "#6b5339",
    front: "#e6d7c1",
    pattern: "board",
    patternOpacity: 0.22,
    side: "#cbb79f",
    stroke: "#9b876e",
    top: "#f0e5d5"
  },
  resilient: {
    badgeFill: "#f3fcf6",
    badgeText: "#215a46",
    front: "#a4d8b6",
    pattern: "bubbles",
    patternOpacity: 0.42,
    side: "#79b192",
    stroke: "#5b8d73",
    top: "#cce9d5"
  },
  steel_support: {
    badgeFill: "#f9fbfd",
    badgeText: "#364250",
    front: "#c5d0db",
    pattern: "steel",
    patternOpacity: 0.42,
    side: "#9ba8b5",
    stroke: "#718191",
    top: "#dbe3eb"
  },
  support: {
    badgeFill: "#fffaf5",
    badgeText: "#5b4938",
    front: "#d8c0aa",
    pattern: "timber",
    patternOpacity: 0.28,
    side: "#b79b83",
    stroke: "#8b735f",
    top: "#ead8c8"
  },
  surface: {
    badgeFill: "#f6fbff",
    badgeText: "#26445f",
    front: "#9fc8eb",
    pattern: "board",
    patternOpacity: 0.24,
    side: "#6f99be",
    stroke: "#55799a",
    top: "#cfe3f5"
  },
  timber: {
    badgeFill: "#fff9f2",
    badgeText: "#5f4328",
    front: "#d4b18c",
    pattern: "timber",
    patternOpacity: 0.34,
    side: "#ac875f",
    stroke: "#836342",
    top: "#e8cfb1"
  },
  timber_support: {
    badgeFill: "#fff9f2",
    badgeText: "#5f4328",
    front: "#cfa77c",
    pattern: "timber",
    patternOpacity: 0.38,
    side: "#a27b50",
    stroke: "#7c5d3b",
    top: "#e4c8a4"
  }
};

function pointsToString(points: readonly [number, number][]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function labelWidth(text: string) {
  return Math.max(38, Math.min(86, text.length * 6.4 + 16));
}

function alphaHex(opacity: number) {
  const normalized = Math.max(0, Math.min(1, opacity));
  return Math.round(normalized * 255)
    .toString(16)
    .padStart(2, "0");
}

function renderPill(input: {
  fill: string;
  height: number;
  stroke: string;
  text: string;
  textColor: string;
  width: number;
  x: number;
  y: number;
}) {
  return (
    <g>
      <rect
        fill={input.fill}
        height={input.height}
        rx={input.height / 2}
        stroke={input.stroke}
        strokeWidth="1"
        width={input.width}
        x={input.x}
        y={input.y}
      />
      <text
        dominantBaseline="middle"
        fill={input.textColor}
        fontSize="10.5"
        fontWeight="700"
        textAnchor="middle"
        x={input.x + input.width / 2}
        y={input.y + input.height / 2 + 0.5}
      >
        {input.text}
      </text>
    </g>
  );
}

function renderDefs(prefix: string) {
  return (
    <defs>
      <linearGradient id={`${prefix}-front-sheen`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.46)" />
        <stop offset="34%" stopColor="rgba(255,255,255,0.10)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
      </linearGradient>
      <linearGradient id={`${prefix}-front-sidewash`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="rgba(255,255,255,0.26)" />
        <stop offset="18%" stopColor="rgba(255,255,255,0.06)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
      </linearGradient>
      <linearGradient id={`${prefix}-top-sheen`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.54)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
      </linearGradient>
      <linearGradient id={`${prefix}-side-sheen`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
      </linearGradient>
      <pattern height="20" id={`${prefix}-pattern-board`} patternUnits="userSpaceOnUse" width="20">
        <path d="M0 5H20 M0 13H20" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      </pattern>
      <pattern height="14" id={`${prefix}-pattern-fiber`} patternUnits="userSpaceOnUse" width="14">
        <path d="M-2 14L14 -2 M0 16L16 0" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
        <path d="M-2 2L4 -4 M8 16L16 8" stroke="rgba(17,77,61,0.16)" strokeWidth="1" />
      </pattern>
      <pattern height="18" id={`${prefix}-pattern-cavity`} patternUnits="userSpaceOnUse" width="18">
        <circle cx="4" cy="4" fill="rgba(54,67,80,0.28)" r="1.1" />
        <circle cx="14" cy="9" fill="rgba(54,67,80,0.24)" r="0.9" />
        <circle cx="8" cy="15" fill="rgba(255,255,255,0.28)" r="0.9" />
      </pattern>
      <pattern height="24" id={`${prefix}-pattern-speckle`} patternUnits="userSpaceOnUse" width="24">
        <circle cx="5" cy="6" fill="rgba(255,255,255,0.34)" r="1.2" />
        <circle cx="15" cy="10" fill="rgba(89,100,112,0.20)" r="1" />
        <circle cx="10" cy="18" fill="rgba(255,255,255,0.22)" r="1" />
        <circle cx="20" cy="4" fill="rgba(89,100,112,0.16)" r="0.9" />
      </pattern>
      <pattern height="20" id={`${prefix}-pattern-masonry`} patternUnits="userSpaceOnUse" width="32">
        <path d="M0 10H32 M0 20H32" stroke="rgba(120,88,58,0.22)" strokeWidth="1" />
        <path d="M8 0V10 M24 10V20" stroke="rgba(120,88,58,0.18)" strokeWidth="1" />
      </pattern>
      <pattern height="18" id={`${prefix}-pattern-timber`} patternUnits="userSpaceOnUse" width="24">
        <path d="M0 4C5 2 8 8 12 6C17 4 19 8 24 6" fill="none" stroke="rgba(120,76,32,0.22)" strokeWidth="1" />
        <path d="M0 12C4 10 8 14 12 12C16 10 20 14 24 12" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      </pattern>
      <pattern height="18" id={`${prefix}-pattern-steel`} patternUnits="userSpaceOnUse" width="18">
        <path d="M3 0V18 M9 0V18 M15 0V18" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
      </pattern>
      <pattern height="20" id={`${prefix}-pattern-bubbles`} patternUnits="userSpaceOnUse" width="20">
        <circle cx="6" cy="6" fill="none" r="2.3" stroke="rgba(255,255,255,0.36)" strokeWidth="1" />
        <circle cx="14" cy="12" fill="none" r="1.8" stroke="rgba(48,111,79,0.18)" strokeWidth="1" />
      </pattern>
    </defs>
  );
}

function facePatternUrl(prefix: string, pattern: CueAppearance["pattern"]) {
  return `url(#${prefix}-pattern-${pattern})`;
}

export function SectionIllustration(props: SectionIllustrationProps) {
  const { axis, compact = false, layers, orientation } = props;
  const allocations = distributeIllustrationSizes(
    layers.map((layer) => layer.thicknessMm),
    axis
  );
  const idPrefix = useId().replaceAll(":", "");

  if (orientation === "floor") {
    const viewWidth = compact ? 560 : 640;
    const viewHeight = compact ? 340 : 400;
    const faceWidth = compact ? 312 : 380;
    const depthX = compact ? 48 : 58;
    const depthY = compact ? -38 : -46;
    const baseY = compact ? 286 : 334;
    const startX = compact ? 72 : 82;
    const totalHeight = allocations.reduce((sum, entry) => sum + entry.sizePx, 0);
    let currentY = baseY - totalHeight;

    return (
      <div className="relative overflow-hidden rounded-[1.15rem] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(236,241,246,0.78)_64%,rgba(227,234,241,0.86))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_22px_40px_rgba(17,24,39,0.09)]">
        <svg
          aria-hidden="true"
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        >
          {renderDefs(idPrefix)}
          <rect fill="rgba(255,255,255,0.14)" height={viewHeight - 2} rx="22" stroke="rgba(255,255,255,0.58)" width={viewWidth - 2} x="1" y="1" />
          <rect fill="rgba(255,255,255,0.18)" height={viewHeight - 46} rx="18" stroke="rgba(110,125,146,0.16)" width={viewWidth - 42} x="21" y="20" />
          <g opacity="0.34" stroke="rgba(111,126,147,0.16)" strokeDasharray="4 8">
            {Array.from({ length: 6 }).map((_, index) => (
              <line key={`grid-h-${index}`} x1="34" x2={viewWidth - 34} y1={58 + index * 44} y2={58 + index * 44} />
            ))}
          </g>
          <ellipse cx={startX + faceWidth / 2 + depthX * 0.74} cy={baseY + 28} fill="rgba(15,23,42,0.14)" rx={faceWidth * 0.44} ry="20" />

          {layers.map((layer, index) => {
            const allocation = allocations[index]!;
            const appearance = CUE_APPEARANCES[getIllustrationMaterialCue(layer.material)];
            const height = allocation.sizePx;
            const frontY = currentY;
            const frontX = startX;
            const topPoints: [number, number][] = [
              [frontX, frontY],
              [frontX + faceWidth, frontY],
              [frontX + faceWidth + depthX, frontY + depthY],
              [frontX + depthX, frontY + depthY]
            ];
            const sidePoints: [number, number][] = [
              [frontX + faceWidth, frontY],
              [frontX + faceWidth, frontY + height],
              [frontX + faceWidth + depthX, frontY + height + depthY],
              [frontX + faceWidth + depthX, frontY + depthY]
            ];
            const leaderY = frontY + height / 2 + depthY * 0.16;
            const pillW = labelWidth(layer.thicknessLabel);
            const calloutX = viewWidth - pillW - 26;
            const badgeY = Math.max(frontY + 12, Math.min(frontY + height - 28, frontY + height / 2 - 12));
            const frontOpacity = layer.ready === false ? 0.48 : 1;

            currentY += height;

            return (
              <g key={layer.key} opacity={frontOpacity}>
                {index === 0 ? (
                  <g>
                    <polygon fill={appearance.top} points={pointsToString(topPoints)} stroke={appearance.stroke} strokeWidth="1.4" />
                    <polygon fill={facePatternUrl(idPrefix, appearance.pattern)} opacity={appearance.patternOpacity * 0.6} points={pointsToString(topPoints)} />
                    <polygon fill={`url(#${idPrefix}-top-sheen)`} points={pointsToString(topPoints)} />
                  </g>
                ) : null}
                <polygon fill={appearance.side} points={pointsToString(sidePoints)} stroke={appearance.stroke} strokeWidth={layer.active ? "2.1" : "1.1"} />
                <polygon fill={facePatternUrl(idPrefix, appearance.pattern)} opacity={appearance.patternOpacity * 0.36} points={pointsToString(sidePoints)} />
                <polygon fill={`url(#${idPrefix}-side-sheen)`} points={pointsToString(sidePoints)} />
                <rect
                  fill={appearance.front}
                  height={height}
                  rx="0"
                  stroke={layer.active ? "#2d7cf6" : appearance.stroke}
                  strokeWidth={layer.active ? "2.2" : "1.1"}
                  width={faceWidth}
                  x={frontX}
                  y={frontY}
                />
                <rect fill={facePatternUrl(idPrefix, appearance.pattern)} height={height} opacity={appearance.patternOpacity} width={faceWidth} x={frontX} y={frontY} />
                <rect fill={`url(#${idPrefix}-front-sheen)`} height={height} width={faceWidth} x={frontX} y={frontY} />
                <rect fill={`url(#${idPrefix}-front-sidewash)`} height={height} width={faceWidth} x={frontX} y={frontY} />
                {renderPill({
                  fill: appearance.badgeFill,
                  height: 24,
                  stroke: `${appearance.stroke}${alphaHex(0.48)}`,
                  text: layer.indexLabel,
                  textColor: appearance.badgeText,
                  width: 24,
                  x: frontX + 14,
                  y: badgeY
                })}
                <line stroke={`${appearance.stroke}${alphaHex(0.5)}`} strokeDasharray="3 4" strokeWidth="1.2" x1={frontX + faceWidth + depthX * 0.9} x2={calloutX - 10} y1={leaderY} y2={leaderY} />
                <circle cx={frontX + faceWidth + depthX * 0.9} cy={leaderY} fill={appearance.stroke} r="2.1" />
                {renderPill({
                  fill: layer.ready === false ? "#fff4ea" : "#ffffff",
                  height: 24,
                  stroke: `${appearance.stroke}${alphaHex(0.42)}`,
                  text: layer.thicknessLabel,
                  textColor: "#243041",
                  width: pillW,
                  x: calloutX,
                  y: leaderY - 12
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  const viewWidth = compact ? 560 : 640;
  const viewHeight = compact ? 320 : 380;
  const faceHeight = compact ? 150 : 182;
  const depthX = compact ? 38 : 46;
  const depthY = compact ? -30 : -36;
  const startX = compact ? 84 : 96;
  const startY = compact ? 92 : 108;
  const totalWidth = allocations.reduce((sum, entry) => sum + entry.sizePx, 0);
  const endX = startX + totalWidth;
  const baseLabelY = startY + faceHeight - 34;
  let currentX = startX;

  return (
    <div className="relative overflow-hidden rounded-[1.15rem] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(236,241,246,0.78)_64%,rgba(227,234,241,0.86))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_22px_40px_rgba(17,24,39,0.09)]">
      <svg
        aria-hidden="true"
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      >
        {renderDefs(idPrefix)}
        <rect fill="rgba(255,255,255,0.14)" height={viewHeight - 2} rx="22" stroke="rgba(255,255,255,0.58)" width={viewWidth - 2} x="1" y="1" />
        <rect fill="rgba(255,255,255,0.18)" height={viewHeight - 40} rx="18" stroke="rgba(110,125,146,0.16)" width={viewWidth - 42} x="21" y="16" />
        <g opacity="0.34" stroke="rgba(111,126,147,0.16)" strokeDasharray="4 8">
          {Array.from({ length: 7 }).map((_, index) => (
            <line key={`grid-v-${index}`} x1={52 + index * 74} x2={52 + index * 74} y1="36" y2={viewHeight - 36} />
          ))}
        </g>
        <ellipse cx={startX + totalWidth / 2 + depthX * 0.64} cy={startY + faceHeight + 26} fill="rgba(15,23,42,0.14)" rx={Math.max(88, totalWidth * 0.48)} ry="18" />

        {layers.map((layer, index) => {
          const allocation = allocations[index]!;
          const appearance = CUE_APPEARANCES[getIllustrationMaterialCue(layer.material)];
          const width = allocation.sizePx;
          const x = currentX;
          const topPoints: [number, number][] = [
            [x, startY],
            [x + width, startY],
            [x + width + depthX, startY + depthY],
            [x + depthX, startY + depthY]
          ];
          const frontOpacity = layer.ready === false ? 0.48 : 1;
          const badgeX = Math.max(x + 6, Math.min(x + width - 30, x + width / 2 - 12));
          const pillW = width < 52 ? 24 : labelWidth(layer.thicknessLabel);
          const pillX = width < 52 ? x + width / 2 - 12 : Math.max(x + 5, x + width / 2 - pillW / 2);

          currentX += width;

          return (
            <g key={layer.key} opacity={frontOpacity}>
              <polygon fill={appearance.top} points={pointsToString(topPoints)} stroke={appearance.stroke} strokeWidth={layer.active ? "2" : "1.1"} />
              <polygon fill={facePatternUrl(idPrefix, appearance.pattern)} opacity={appearance.patternOpacity * 0.56} points={pointsToString(topPoints)} />
              <polygon fill={`url(#${idPrefix}-top-sheen)`} points={pointsToString(topPoints)} />
              <rect
                fill={appearance.front}
                height={faceHeight}
                stroke={layer.active ? "#2d7cf6" : appearance.stroke}
                strokeWidth={layer.active ? "2.1" : "1.1"}
                width={width}
                x={x}
                y={startY}
              />
              <rect fill={facePatternUrl(idPrefix, appearance.pattern)} height={faceHeight} opacity={appearance.patternOpacity} width={width} x={x} y={startY} />
              <rect fill={`url(#${idPrefix}-front-sheen)`} height={faceHeight} width={width} x={x} y={startY} />
              <rect fill={`url(#${idPrefix}-front-sidewash)`} height={faceHeight} width={width} x={x} y={startY} />
              {renderPill({
                fill: appearance.badgeFill,
                height: 24,
                stroke: `${appearance.stroke}${alphaHex(0.48)}`,
                text: layer.indexLabel,
                textColor: appearance.badgeText,
                width: 24,
                x: badgeX,
                y: startY + 16
              })}
              {width < 52 ? (
                <g transform={`translate(${x + width / 2}, ${baseLabelY + 12}) rotate(-90)`}>
                  {renderPill({
                    fill: layer.ready === false ? "#fff4ea" : "#ffffff",
                    height: 24,
                    stroke: `${appearance.stroke}${alphaHex(0.42)}`,
                    text: layer.thicknessLabel,
                    textColor: "#243041",
                    width: labelWidth(layer.thicknessLabel),
                    x: -labelWidth(layer.thicknessLabel) / 2,
                    y: -12
                  })}
                </g>
              ) : (
                renderPill({
                  fill: layer.ready === false ? "#fff4ea" : "#ffffff",
                  height: 24,
                  stroke: `${appearance.stroke}${alphaHex(0.42)}`,
                  text: layer.thicknessLabel,
                  textColor: "#243041",
                  width: pillW,
                  x: pillX,
                  y: baseLabelY
                })
              )}
            </g>
          );
        })}

        {layers.length > 0 ? (
          <g>
            <polygon
              fill={CUE_APPEARANCES[getIllustrationMaterialCue(layers[layers.length - 1]!.material)].side}
              points={pointsToString([
                [endX, startY],
                [endX, startY + faceHeight],
                [endX + depthX, startY + faceHeight + depthY],
                [endX + depthX, startY + depthY]
              ])}
              stroke={CUE_APPEARANCES[getIllustrationMaterialCue(layers[layers.length - 1]!.material)].stroke}
              strokeWidth="1.2"
            />
            <polygon
              fill={facePatternUrl(
                idPrefix,
                CUE_APPEARANCES[getIllustrationMaterialCue(layers[layers.length - 1]!.material)].pattern
              )}
              opacity={CUE_APPEARANCES[getIllustrationMaterialCue(layers[layers.length - 1]!.material)].patternOpacity * 0.34}
              points={pointsToString([
                [endX, startY],
                [endX, startY + faceHeight],
                [endX + depthX, startY + faceHeight + depthY],
                [endX + depthX, startY + depthY]
              ])}
            />
            <polygon
              fill={`url(#${idPrefix}-side-sheen)`}
              points={pointsToString([
                [endX, startY],
                [endX, startY + faceHeight],
                [endX + depthX, startY + faceHeight + depthY],
                [endX + depthX, startY + depthY]
              ])}
            />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
