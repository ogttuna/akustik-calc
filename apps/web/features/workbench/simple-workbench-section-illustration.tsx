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
  detail:
    | "air_gap"
    | "board_panel"
    | "concrete_core"
    | "fiber_batt"
    | "foam_mat"
    | "masonry_block"
    | "plaster_skin"
    | "steel_frame"
    | "surface_sheet"
    | "timber_grain";
  front: string;
  pattern: "board" | "bubbles" | "cavity" | "fiber" | "masonry" | "speckle" | "steel" | "timber";
  patternOpacity: number;
  side: string;
  stroke: string;
  top: string;
};

const CUE_APPEARANCES: Record<ReturnType<typeof getIllustrationMaterialCue>, CueAppearance> = {
  board: {
    badgeFill: "#f7f6f2",
    badgeText: "#55606a",
    detail: "board_panel",
    front: "#ddd8cf",
    pattern: "board",
    patternOpacity: 0.34,
    side: "#c6baab",
    stroke: "#938779",
    top: "#ece7de"
  },
  cavity: {
    badgeFill: "#f4f5f6",
    badgeText: "#485560",
    detail: "air_gap",
    front: "#d8dde2",
    pattern: "cavity",
    patternOpacity: 0.42,
    side: "#bcc4cc",
    stroke: "#86929f",
    top: "#eef1f4"
  },
  concrete: {
    badgeFill: "#f8f9fa",
    badgeText: "#46525d",
    detail: "concrete_core",
    front: "#ced1d0",
    pattern: "speckle",
    patternOpacity: 0.58,
    side: "#b5bbbd",
    stroke: "#7f878a",
    top: "#e2e5e4"
  },
  fiber: {
    badgeFill: "#fff8e8",
    badgeText: "#70552a",
    detail: "fiber_batt",
    front: "#d5bf78",
    pattern: "fiber",
    patternOpacity: 0.5,
    side: "#b59a58",
    stroke: "#8e7440",
    top: "#e9d89e"
  },
  mass: {
    badgeFill: "#f8f9fa",
    badgeText: "#44505a",
    detail: "concrete_core",
    front: "#d6d8db",
    pattern: "speckle",
    patternOpacity: 0.38,
    side: "#bec5cb",
    stroke: "#88939d",
    top: "#e8ecef"
  },
  masonry: {
    badgeFill: "#fff7ee",
    badgeText: "#6b4f34",
    detail: "masonry_block",
    front: "#d4b79b",
    pattern: "masonry",
    patternOpacity: 0.44,
    side: "#ba9a7a",
    stroke: "#8e7258",
    top: "#ead5bf"
  },
  plaster: {
    badgeFill: "#fffaf4",
    badgeText: "#6b5842",
    detail: "plaster_skin",
    front: "#ebdecd",
    pattern: "board",
    patternOpacity: 0.18,
    side: "#cfbca6",
    stroke: "#9f8d79",
    top: "#f5ecdf"
  },
  resilient: {
    badgeFill: "#f3faf6",
    badgeText: "#2d5e4e",
    detail: "foam_mat",
    front: "#97c2b6",
    pattern: "bubbles",
    patternOpacity: 0.42,
    side: "#79a493",
    stroke: "#5a8578",
    top: "#c6ddd6"
  },
  steel_support: {
    badgeFill: "#f8fafc",
    badgeText: "#45505e",
    detail: "steel_frame",
    front: "#ccd4dd",
    pattern: "steel",
    patternOpacity: 0.34,
    side: "#aeb8c2",
    stroke: "#798796",
    top: "#e2e7ed"
  },
  support: {
    badgeFill: "#fff9f3",
    badgeText: "#624f3e",
    detail: "timber_grain",
    front: "#d7c2aa",
    pattern: "timber",
    patternOpacity: 0.24,
    side: "#b79d81",
    stroke: "#8d755d",
    top: "#e7d6c5"
  },
  surface: {
    badgeFill: "#f4f8fb",
    badgeText: "#345266",
    detail: "surface_sheet",
    front: "#bfd0de",
    pattern: "board",
    patternOpacity: 0.18,
    side: "#9aaebd",
    stroke: "#6f8395",
    top: "#dde7ee"
  },
  timber: {
    badgeFill: "#fff8f1",
    badgeText: "#654728",
    detail: "timber_grain",
    front: "#cfac84",
    pattern: "timber",
    patternOpacity: 0.28,
    side: "#aa845c",
    stroke: "#846141",
    top: "#e6cdae"
  },
  timber_support: {
    badgeFill: "#fff8f1",
    badgeText: "#654728",
    detail: "timber_grain",
    front: "#c79f72",
    pattern: "timber",
    patternOpacity: 0.32,
    side: "#9f774e",
    stroke: "#7c5d3b",
    top: "#e1c39d"
  }
};

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
      <pattern height="18" id={`${prefix}-pattern-board`} patternUnits="userSpaceOnUse" width="24">
        <rect fill="rgba(255,255,255,0.1)" height="18" width="24" />
        <path d="M0 3H24 M0 15H24" stroke="rgba(255,255,255,0.52)" strokeWidth="0.95" />
        <path d="M0 6H24 M0 12H24" stroke="rgba(126,116,103,0.08)" strokeWidth="0.8" />
        <circle cx="7" cy="9" fill="rgba(144,136,123,0.10)" r="0.8" />
        <circle cx="18" cy="8" fill="rgba(255,255,255,0.18)" r="0.9" />
      </pattern>
      <pattern height="16" id={`${prefix}-pattern-fiber`} patternUnits="userSpaceOnUse" width="18">
        <path d="M-2 16L12 2 M4 18L18 4" stroke="rgba(255,255,255,0.46)" strokeWidth="0.95" />
        <path d="M0 6L10 -4 M8 20L18 10" stroke="rgba(124,96,40,0.22)" strokeWidth="0.95" />
        <path d="M2 16L8 10L14 16 M10 0L14 4L18 0" fill="none" stroke="rgba(255,244,214,0.34)" strokeWidth="0.8" />
        <circle cx="6" cy="5" fill="rgba(255,255,255,0.22)" r="0.9" />
        <circle cx="14" cy="11" fill="rgba(124,96,40,0.16)" r="0.7" />
      </pattern>
      <pattern height="18" id={`${prefix}-pattern-cavity`} patternUnits="userSpaceOnUse" width="18">
        <path d="M0 9H18" stroke="rgba(104,122,140,0.18)" strokeDasharray="3 3" strokeWidth="0.8" />
        <circle cx="4" cy="4" fill="rgba(54,67,80,0.26)" r="1.1" />
        <circle cx="14" cy="9" fill="rgba(54,67,80,0.22)" r="0.9" />
        <circle cx="8" cy="15" fill="rgba(255,255,255,0.3)" r="0.9" />
      </pattern>
      <pattern height="24" id={`${prefix}-pattern-speckle`} patternUnits="userSpaceOnUse" width="24">
        <circle cx="5" cy="6" fill="rgba(255,255,255,0.34)" r="1.2" />
        <circle cx="15" cy="10" fill="rgba(89,100,112,0.20)" r="1" />
        <circle cx="10" cy="18" fill="rgba(255,255,255,0.22)" r="1" />
        <circle cx="20" cy="4" fill="rgba(89,100,112,0.16)" r="0.9" />
        <circle cx="18" cy="18" fill="rgba(89,100,112,0.12)" r="1.3" />
        <circle cx="7" cy="12" fill="rgba(255,255,255,0.16)" r="0.9" />
        <ellipse cx="12" cy="5" fill="rgba(102,111,118,0.14)" rx="1.8" ry="1.1" />
        <ellipse cx="4" cy="17" fill="rgba(255,255,255,0.16)" rx="1.4" ry="1" />
      </pattern>
      <pattern height="20" id={`${prefix}-pattern-masonry`} patternUnits="userSpaceOnUse" width="32">
        <path d="M0 10H32 M0 20H32" stroke="rgba(120,88,58,0.2)" strokeWidth="1" />
        <path d="M8 0V10 M24 0V10 M16 10V20" stroke="rgba(120,88,58,0.16)" strokeWidth="1" />
        <path d="M2 3H12 M18 15H30" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
      </pattern>
      <pattern height="18" id={`${prefix}-pattern-timber`} patternUnits="userSpaceOnUse" width="24">
        <path d="M0 4C5 2 8 8 12 6C17 4 19 8 24 6" fill="none" stroke="rgba(120,76,32,0.22)" strokeWidth="1" />
        <path d="M0 12C4 10 8 14 12 12C16 10 20 14 24 12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <ellipse cx="17" cy="8" fill="none" rx="2.2" ry="1.3" stroke="rgba(120,76,32,0.16)" strokeWidth="0.8" />
      </pattern>
      <pattern height="18" id={`${prefix}-pattern-steel`} patternUnits="userSpaceOnUse" width="18">
        <path d="M3 0V18 M9 0V18 M15 0V18" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <path d="M0 4H18 M0 14H18" stroke="rgba(92,110,128,0.12)" strokeWidth="0.8" />
      </pattern>
      <pattern height="20" id={`${prefix}-pattern-bubbles`} patternUnits="userSpaceOnUse" width="20">
        <path d="M0 11C4 8 7 15 11 11S17 8 20 11" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <rect fill="none" height="5.2" rx="2.6" stroke="rgba(255,255,255,0.26)" strokeWidth="0.9" width="7.6" x="2.4" y="3.1" />
        <rect fill="none" height="4.4" rx="2.2" stroke="rgba(74,123,109,0.18)" strokeWidth="0.9" width="6.2" x="11.2" y="10.6" />
        <circle cx="6" cy="6" fill="none" r="2.1" stroke="rgba(255,255,255,0.2)" strokeWidth="0.9" />
      </pattern>
    </defs>
  );
}

function renderMaterialDetail(input: {
  clipId: string;
  detail: CueAppearance["detail"];
  stroke: string;
  width: number;
  x: number;
  y: number;
  height: number;
}) {
  const insetX = input.x + Math.min(16, Math.max(6, input.width * 0.06));
  const insetY = input.y + Math.min(10, Math.max(4, input.height * 0.18));
  const insetRight = Math.min(14, Math.max(6, input.width * 0.06));
  const insetBottom = Math.min(8, Math.max(4, input.height * 0.14));
  const innerWidth = Math.max(0, input.width - (insetX - input.x) - insetRight);
  const innerHeight = Math.max(0, input.height - (insetY - input.y) - insetBottom);

  if (innerWidth < 12 || innerHeight < 8) {
    return null;
  }

  const subtleStroke = `${input.stroke}${alphaHex(0.28)}`;
  const faintStroke = `${input.stroke}${alphaHex(0.18)}`;
  const brightStroke = "rgba(255,255,255,0.32)";
  const midY = insetY + innerHeight / 2;

  switch (input.detail) {
    case "board_panel":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.84">
          <line stroke={brightStroke} strokeWidth="1.1" x1={insetX} x2={insetX + innerWidth} y1={insetY + 2.5} y2={insetY + 2.5} />
          <line stroke={subtleStroke} strokeWidth="0.9" x1={insetX} x2={insetX + innerWidth} y1={insetY + 6.5} y2={insetY + 6.5} />
          <line stroke={brightStroke} strokeWidth="1" x1={insetX} x2={insetX + innerWidth} y1={insetY + innerHeight - 2.5} y2={insetY + innerHeight - 2.5} />
          <line stroke={faintStroke} strokeWidth="0.85" x1={insetX} x2={insetX + innerWidth} y1={insetY + innerHeight - 6.5} y2={insetY + innerHeight - 6.5} />
          {innerHeight > 28 ? (
            <line
              stroke={faintStroke}
              strokeDasharray="5 4"
              strokeWidth="0.9"
              x1={insetX + innerWidth * 0.42}
              x2={insetX + innerWidth * 0.42}
              y1={insetY}
              y2={insetY + innerHeight}
            />
          ) : null}
          <ellipse cx={insetX + innerWidth * 0.22} cy={midY} fill={faintStroke} rx="1.6" ry="1" />
          <ellipse cx={insetX + innerWidth * 0.74} cy={midY + innerHeight * 0.08} fill={brightStroke} rx="1.2" ry="0.9" />
        </g>
      );
    case "surface_sheet":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.78">
          <line stroke={brightStroke} strokeWidth="1" x1={insetX} x2={insetX + innerWidth} y1={midY - innerHeight * 0.14} y2={midY - innerHeight * 0.14} />
          <line stroke={subtleStroke} strokeWidth="1.1" x1={insetX} x2={insetX + innerWidth} y1={midY + innerHeight * 0.16} y2={midY + innerHeight * 0.16} />
          <path
            d={`M ${insetX} ${midY + innerHeight * 0.3} C ${insetX + innerWidth * 0.18} ${midY + innerHeight * 0.12}, ${insetX + innerWidth * 0.44} ${midY + innerHeight * 0.46}, ${insetX + innerWidth} ${midY + innerHeight * 0.22}`}
            fill="none"
            stroke={faintStroke}
            strokeWidth="0.9"
          />
        </g>
      );
    case "plaster_skin":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.72">
          <path
            d={`M ${insetX} ${midY - innerHeight * 0.06} C ${insetX + innerWidth * 0.22} ${midY - innerHeight * 0.18}, ${insetX + innerWidth * 0.48} ${midY + innerHeight * 0.08}, ${insetX + innerWidth} ${midY - innerHeight * 0.02}`}
            fill="none"
            stroke={brightStroke}
            strokeWidth="1"
          />
          <path
            d={`M ${insetX} ${midY + innerHeight * 0.24} C ${insetX + innerWidth * 0.2} ${midY + innerHeight * 0.1}, ${insetX + innerWidth * 0.56} ${midY + innerHeight * 0.34}, ${insetX + innerWidth} ${midY + innerHeight * 0.18}`}
            fill="none"
            stroke={faintStroke}
            strokeWidth="0.9"
          />
        </g>
      );
    case "foam_mat":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.84">
          <path
            d={`M ${insetX} ${midY} C ${insetX + innerWidth * 0.15} ${midY - innerHeight * 0.28}, ${insetX + innerWidth * 0.34} ${midY + innerHeight * 0.28}, ${insetX + innerWidth * 0.5} ${midY} S ${insetX + innerWidth * 0.84} ${midY - innerHeight * 0.28}, ${insetX + innerWidth} ${midY}`}
            fill="none"
            stroke={subtleStroke}
            strokeWidth="1.3"
          />
          <path
            d={`M ${insetX} ${midY + innerHeight * 0.18} C ${insetX + innerWidth * 0.18} ${midY - innerHeight * 0.06}, ${insetX + innerWidth * 0.36} ${midY + innerHeight * 0.36}, ${insetX + innerWidth * 0.54} ${midY + innerHeight * 0.12} S ${insetX + innerWidth * 0.84} ${midY + innerHeight * 0.02}, ${insetX + innerWidth} ${midY + innerHeight * 0.18}`}
            fill="none"
            stroke={brightStroke}
            strokeWidth="1"
          />
          <rect
            fill="none"
            height={Math.max(5, innerHeight * 0.18)}
            rx={Math.max(2.2, innerHeight * 0.09)}
            stroke={faintStroke}
            strokeWidth="0.9"
            width={Math.max(10, innerWidth * 0.22)}
            x={insetX + innerWidth * 0.18}
            y={midY - innerHeight * 0.34}
          />
          <rect
            fill="none"
            height={Math.max(4, innerHeight * 0.14)}
            rx={Math.max(2, innerHeight * 0.07)}
            stroke={brightStroke}
            strokeWidth="0.8"
            width={Math.max(9, innerWidth * 0.18)}
            x={insetX + innerWidth * 0.58}
            y={midY + innerHeight * 0.12}
          />
        </g>
      );
    case "air_gap":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.88">
          <line
            stroke={subtleStroke}
            strokeDasharray="5 4"
            strokeWidth="1.1"
            x1={insetX}
            x2={insetX + innerWidth}
            y1={midY}
            y2={midY}
          />
          <circle cx={insetX + innerWidth * 0.28} cy={midY} fill={faintStroke} r="1.6" />
          <circle cx={insetX + innerWidth * 0.72} cy={midY} fill={brightStroke} r="1.4" />
        </g>
      );
    case "fiber_batt":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.84">
          <path
            d={`M ${insetX - 2} ${insetY + innerHeight - 2} L ${insetX + innerWidth * 0.32} ${insetY + innerHeight * 0.35} L ${insetX + innerWidth * 0.6} ${insetY + innerHeight * 0.72} L ${insetX + innerWidth + 2} ${insetY + 2}`}
            fill="none"
            stroke={subtleStroke}
            strokeWidth="1.1"
          />
          <path
            d={`M ${insetX + innerWidth * 0.1} ${insetY - 1} L ${insetX + innerWidth * 0.44} ${insetY + innerHeight * 0.42} L ${insetX + innerWidth * 0.7} ${insetY + innerHeight * 0.12} L ${insetX + innerWidth + 1} ${insetY + innerHeight * 0.52}`}
            fill="none"
            stroke={brightStroke}
            strokeWidth="0.95"
          />
          <path
            d={`M ${insetX} ${midY} C ${insetX + innerWidth * 0.16} ${midY - innerHeight * 0.12}, ${insetX + innerWidth * 0.34} ${midY + innerHeight * 0.14}, ${insetX + innerWidth * 0.54} ${midY - innerHeight * 0.02} S ${insetX + innerWidth * 0.84} ${midY + innerHeight * 0.16}, ${insetX + innerWidth} ${midY - innerHeight * 0.04}`}
            fill="none"
            stroke={faintStroke}
            strokeWidth="0.9"
          />
          <circle cx={insetX + innerWidth * 0.28} cy={midY - innerHeight * 0.12} fill={brightStroke} r="1" />
          <circle cx={insetX + innerWidth * 0.68} cy={midY + innerHeight * 0.1} fill={faintStroke} r="0.9" />
        </g>
      );
    case "masonry_block":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.78">
          <line stroke={subtleStroke} strokeWidth="1" x1={insetX} x2={insetX + innerWidth} y1={insetY + innerHeight * 0.35} y2={insetY + innerHeight * 0.35} />
          <line stroke={subtleStroke} strokeWidth="1" x1={insetX} x2={insetX + innerWidth} y1={insetY + innerHeight * 0.7} y2={insetY + innerHeight * 0.7} />
          <line stroke={faintStroke} strokeWidth="1" x1={insetX + innerWidth * 0.24} x2={insetX + innerWidth * 0.24} y1={insetY} y2={insetY + innerHeight * 0.35} />
          <line stroke={faintStroke} strokeWidth="1" x1={insetX + innerWidth * 0.6} x2={insetX + innerWidth * 0.6} y1={insetY + innerHeight * 0.35} y2={insetY + innerHeight * 0.7} />
          <line stroke={brightStroke} strokeWidth="0.8" x1={insetX + innerWidth * 0.08} x2={insetX + innerWidth * 0.36} y1={insetY + innerHeight * 0.18} y2={insetY + innerHeight * 0.18} />
        </g>
      );
    case "concrete_core":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.8">
          <ellipse cx={insetX + innerWidth * 0.22} cy={insetY + innerHeight * 0.36} fill={subtleStroke} rx="3.2" ry="2.3" />
          <ellipse cx={insetX + innerWidth * 0.58} cy={insetY + innerHeight * 0.58} fill={brightStroke} rx="2.4" ry="1.7" />
          <ellipse cx={insetX + innerWidth * 0.82} cy={insetY + innerHeight * 0.3} fill={faintStroke} rx="2.1" ry="1.4" />
          <ellipse cx={insetX + innerWidth * 0.42} cy={insetY + innerHeight * 0.18} fill={faintStroke} rx="1.9" ry="1.3" />
          <ellipse cx={insetX + innerWidth * 0.3} cy={insetY + innerHeight * 0.74} fill={subtleStroke} rx="2.6" ry="1.8" />
          <ellipse cx={insetX + innerWidth * 0.74} cy={insetY + innerHeight * 0.66} fill={brightStroke} rx="1.8" ry="1.3" />
          <ellipse cx={insetX + innerWidth * 0.12} cy={insetY + innerHeight * 0.58} fill={faintStroke} rx="2.4" ry="1.5" />
          <path
            d={`M ${insetX + innerWidth * 0.06} ${insetY + innerHeight * 0.18} C ${insetX + innerWidth * 0.22} ${insetY + innerHeight * 0.12}, ${insetX + innerWidth * 0.38} ${insetY + innerHeight * 0.24}, ${insetX + innerWidth * 0.56} ${insetY + innerHeight * 0.16}`}
            fill="none"
            stroke={brightStroke}
            strokeWidth="0.8"
          />
        </g>
      );
    case "steel_frame":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.82">
          {Array.from({ length: Math.max(2, Math.min(4, Math.floor(innerWidth / 26))) }).map((_, index) => {
            const x = insetX + ((index + 1) * innerWidth) / (Math.max(2, Math.min(4, Math.floor(innerWidth / 26))) + 1);

            return <line key={`${input.clipId}-rib-${index}`} stroke={subtleStroke} strokeWidth="1" x1={x} x2={x} y1={insetY} y2={insetY + innerHeight} />;
          })}
          <line stroke={brightStroke} strokeWidth="0.9" x1={insetX} x2={insetX + innerWidth} y1={insetY + 3} y2={insetY + 3} />
        </g>
      );
    case "timber_grain":
      return (
        <g clipPath={`url(#${input.clipId})`} opacity="0.84">
          <path
            d={`M ${insetX} ${insetY + innerHeight * 0.28} C ${insetX + innerWidth * 0.18} ${insetY + innerHeight * 0.12}, ${insetX + innerWidth * 0.32} ${insetY + innerHeight * 0.42}, ${insetX + innerWidth * 0.5} ${insetY + innerHeight * 0.3} S ${insetX + innerWidth * 0.84} ${insetY + innerHeight * 0.16}, ${insetX + innerWidth} ${insetY + innerHeight * 0.28}`}
            fill="none"
            stroke={subtleStroke}
            strokeWidth="1.1"
          />
          <path
            d={`M ${insetX} ${insetY + innerHeight * 0.64} C ${insetX + innerWidth * 0.2} ${insetY + innerHeight * 0.48}, ${insetX + innerWidth * 0.34} ${insetY + innerHeight * 0.82}, ${insetX + innerWidth * 0.54} ${insetY + innerHeight * 0.66} S ${insetX + innerWidth * 0.86} ${insetY + innerHeight * 0.52}, ${insetX + innerWidth} ${insetY + innerHeight * 0.64}`}
            fill="none"
            stroke={brightStroke}
            strokeWidth="1"
          />
          {innerWidth > 42 && innerHeight > 18 ? (
            <ellipse
              cx={insetX + innerWidth * 0.72}
              cy={insetY + innerHeight * 0.48}
              fill="none"
              rx="4.8"
              ry="2.4"
              stroke={faintStroke}
              strokeWidth="0.9"
            />
          ) : null}
        </g>
      );
    default:
      return null;
  }
}

function facePatternUrl(prefix: string, pattern: CueAppearance["pattern"]) {
  return `url(#${prefix}-pattern-${pattern})`;
}

function formatTotalThickness(thicknessMm: number) {
  const rounded = Math.round(thicknessMm * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} mm` : `${rounded.toFixed(1)} mm`;
}

export function SectionIllustration(props: SectionIllustrationProps) {
  const { axis, compact = false, layers, orientation } = props;
  const allocations = distributeIllustrationSizes(
    layers.map((layer) => layer.thicknessMm),
    axis
  );
  const idPrefix = useId().replaceAll(":", "");
  const totalThickness = layers.reduce((sum, layer) => sum + (layer.thicknessMm ?? 0), 0);

  if (orientation === "floor") {
    const viewWidth = compact ? 560 : 640;
    const viewHeight = compact ? 336 : 384;
    const sectionX = compact ? 92 : 108;
    const sectionWidth = compact ? 270 : 316;
    const totalHeight = allocations.reduce((sum, entry) => sum + entry.sizePx, 0);
    const sectionY = Math.max(42, viewHeight - totalHeight - 54);
    const calloutX = compact ? 406 : 474;
    const dimensionX = sectionX - 24;
    const topRuleY = sectionY - 12;
    const bottomRuleY = sectionY + totalHeight + 12;
    let currentY = sectionY;

    return (
      <div className="relative overflow-hidden rounded-[1.15rem] border border-[rgba(255,255,255,0.82)] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(244,241,236,0.96)_58%,rgba(237,233,227,0.98))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_36px_rgba(55,48,39,0.10)]">
        <svg
          aria-hidden="true"
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        >
          {renderDefs(idPrefix)}
          <rect fill="rgba(255,255,255,0.26)" height={viewHeight - 2} rx="22" stroke="rgba(255,255,255,0.68)" width={viewWidth - 2} x="1" y="1" />
          <rect fill="rgba(255,251,245,0.46)" height={viewHeight - 34} rx="18" stroke="rgba(158,145,129,0.14)" width={viewWidth - 36} x="18" y="16" />
          <g opacity="0.32" stroke="rgba(133,122,108,0.16)" strokeDasharray="3 8">
            {Array.from({ length: 6 }).map((_, index) => (
              <line key={`grid-h-${index}`} x1="30" x2={viewWidth - 28} y1={60 + index * 38} y2={60 + index * 38} />
            ))}
          </g>
          <rect
            fill="rgba(255,255,255,0.48)"
            height={totalHeight}
            rx="18"
            stroke="rgba(134,120,102,0.2)"
            strokeWidth="1.2"
            width={sectionWidth}
            x={sectionX}
            y={sectionY}
          />
          <line stroke="rgba(114,96,74,0.18)" strokeWidth="1" x1={sectionX - 16} x2={sectionX + sectionWidth + 16} y1={topRuleY} y2={topRuleY} />
          <line
            stroke="rgba(114,96,74,0.18)"
            strokeWidth="1"
            x1={sectionX - 16}
            x2={sectionX + sectionWidth + 16}
            y1={bottomRuleY}
            y2={bottomRuleY}
          />
          <line stroke="#314454" strokeWidth="1.2" x1={dimensionX} x2={dimensionX} y1={sectionY} y2={sectionY + totalHeight} />
          <line stroke="#314454" strokeWidth="1" x1={dimensionX - 7} x2={dimensionX + 7} y1={sectionY} y2={sectionY} />
          <line
            stroke="#314454"
            strokeWidth="1"
            x1={dimensionX - 7}
            x2={dimensionX + 7}
            y1={sectionY + totalHeight}
            y2={sectionY + totalHeight}
          />
          {totalThickness > 0 ? (
            <text
              fill="#314454"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
              transform={`rotate(-90 ${dimensionX - 9} ${sectionY + totalHeight / 2})`}
              x={dimensionX - 9}
              y={sectionY + totalHeight / 2 + 3}
            >
              {formatTotalThickness(totalThickness)}
            </text>
          ) : null}

          {layers.map((layer, index) => {
            const allocation = allocations[index]!;
            const appearance = CUE_APPEARANCES[getIllustrationMaterialCue(layer.material)];
            const height = allocation.sizePx;
            const frontY = currentY;
            const leaderY = frontY + height / 2;
            const badgeHeight = height < 28 ? 18 : 22;
            const badgeY = Math.max(frontY + 4, Math.min(frontY + height - badgeHeight - 4, frontY + height / 2 - badgeHeight / 2));
            const pillW = labelWidth(layer.thicknessLabel);
            const frontOpacity = layer.ready === false ? 0.5 : 1;
            const clipId = `${idPrefix}-floor-layer-${index}`;
            const edgeWidth = Math.min(18, Math.max(8, sectionWidth * 0.045));
            const topCapHeight = Math.min(8, Math.max(3, height * 0.16));
            const seamHeight = Math.min(7, Math.max(2, height * 0.14));
            currentY += height;

            return (
              <g key={layer.key} opacity={frontOpacity}>
                <clipPath id={clipId}>
                  <rect height={height} width={sectionWidth} x={sectionX} y={frontY} />
                </clipPath>
                <rect
                  fill={appearance.front}
                  height={height}
                  stroke={layer.active ? "#2d7cf6" : appearance.stroke}
                  strokeWidth={layer.active ? "2.1" : "1.05"}
                  width={sectionWidth}
                  x={sectionX}
                  y={frontY}
                />
                <rect fill={appearance.side} height={height} opacity="0.78" width={edgeWidth} x={sectionX} y={frontY} />
                <rect fill={appearance.top} height={topCapHeight} opacity="0.92" width={sectionWidth} x={sectionX} y={frontY} />
                <rect fill={facePatternUrl(idPrefix, appearance.pattern)} height={height} opacity={appearance.patternOpacity} width={sectionWidth} x={sectionX} y={frontY} />
                {renderMaterialDetail({
                  clipId,
                  detail: appearance.detail,
                  height,
                  stroke: appearance.stroke,
                  width: sectionWidth,
                  x: sectionX,
                  y: frontY
                })}
                <rect fill={`url(#${idPrefix}-front-sheen)`} height={height} opacity="0.55" width={sectionWidth} x={sectionX} y={frontY} />
                <rect fill="rgba(44,57,70,0.08)" height={seamHeight} opacity="0.72" width={sectionWidth} x={sectionX} y={frontY + height - seamHeight} />
                <line stroke="rgba(255,255,255,0.38)" strokeWidth="1" x1={sectionX} x2={sectionX + sectionWidth} y1={frontY + 1} y2={frontY + 1} />
                {renderPill({
                  fill: appearance.badgeFill,
                  height: badgeHeight,
                  stroke: `${appearance.stroke}${alphaHex(0.42)}`,
                  text: layer.indexLabel,
                  textColor: appearance.badgeText,
                  width: badgeHeight,
                  x: sectionX + 10,
                  y: badgeY
                })}
                <line
                  stroke={`${appearance.stroke}${alphaHex(0.48)}`}
                  strokeDasharray="4 5"
                  strokeWidth="1.1"
                  x1={sectionX + sectionWidth + 8}
                  x2={calloutX - 10}
                  y1={leaderY}
                  y2={leaderY}
                />
                <circle cx={sectionX + sectionWidth + 8} cy={leaderY} fill={appearance.stroke} r="2" />
                {renderPill({
                  fill: layer.ready === false ? "#fff5eb" : "#fffdf9",
                  height: 22,
                  stroke: `${appearance.stroke}${alphaHex(0.38)}`,
                  text: layer.thicknessLabel,
                  textColor: "#243041",
                  width: pillW,
                  x: calloutX,
                  y: leaderY - 11
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  const viewWidth = compact ? 560 : 640;
  const viewHeight = compact ? 310 : 356;
  const sectionX = compact ? 74 : 90;
  const sectionY = compact ? 82 : 96;
  const sectionHeight = compact ? 132 : 152;
  const totalWidth = allocations.reduce((sum, entry) => sum + entry.sizePx, 0);
  const dimensionY = sectionY + sectionHeight + 26;
  const labelY = sectionY + sectionHeight - 34;
  let currentX = sectionX;

  return (
    <div className="relative overflow-hidden rounded-[1.15rem] border border-[rgba(255,255,255,0.82)] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(244,241,236,0.96)_58%,rgba(237,233,227,0.98))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_36px_rgba(55,48,39,0.10)]">
      <svg
        aria-hidden="true"
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      >
        {renderDefs(idPrefix)}
        <rect fill="rgba(255,255,255,0.26)" height={viewHeight - 2} rx="22" stroke="rgba(255,255,255,0.68)" width={viewWidth - 2} x="1" y="1" />
        <rect fill="rgba(255,251,245,0.46)" height={viewHeight - 30} rx="18" stroke="rgba(158,145,129,0.14)" width={viewWidth - 36} x="18" y="14" />
        <g opacity="0.28" stroke="rgba(133,122,108,0.15)" strokeDasharray="3 8">
          {Array.from({ length: 7 }).map((_, index) => (
            <line key={`grid-v-${index}`} x1={48 + index * 66} x2={48 + index * 66} y1="32" y2={viewHeight - 28} />
          ))}
        </g>
        <rect
          fill="rgba(255,255,255,0.48)"
          height={sectionHeight}
          rx="18"
          stroke="rgba(134,120,102,0.2)"
          strokeWidth="1.2"
          width={totalWidth}
          x={sectionX}
          y={sectionY}
        />
        <line stroke="rgba(114,96,74,0.18)" strokeWidth="1" x1={sectionX - 14} x2={sectionX + totalWidth + 14} y1={sectionY - 12} y2={sectionY - 12} />
        <line
          stroke="rgba(114,96,74,0.18)"
          strokeWidth="1"
          x1={sectionX - 14}
          x2={sectionX + totalWidth + 14}
          y1={sectionY + sectionHeight + 12}
          y2={sectionY + sectionHeight + 12}
        />
        <line stroke="#314454" strokeWidth="1.2" x1={sectionX} x2={sectionX + totalWidth} y1={dimensionY} y2={dimensionY} />
        <line stroke="#314454" strokeWidth="1" x1={sectionX} x2={sectionX} y1={dimensionY - 7} y2={dimensionY + 7} />
        <line
          stroke="#314454"
          strokeWidth="1"
          x1={sectionX + totalWidth}
          x2={sectionX + totalWidth}
          y1={dimensionY - 7}
          y2={dimensionY + 7}
        />
        {totalThickness > 0 ? (
          <text fill="#314454" fontSize="11" fontWeight="700" textAnchor="middle" x={sectionX + totalWidth / 2} y={dimensionY - 10}>
            {formatTotalThickness(totalThickness)}
          </text>
        ) : null}

        {layers.map((layer, index) => {
          const allocation = allocations[index]!;
          const appearance = CUE_APPEARANCES[getIllustrationMaterialCue(layer.material)];
          const width = allocation.sizePx;
          const x = currentX;
          const frontOpacity = layer.ready === false ? 0.5 : 1;
          const badgeX = Math.max(x + 5, Math.min(x + width - 25, x + width / 2 - 10));
          const pillW = labelWidth(layer.thicknessLabel);
          const clipId = `${idPrefix}-wall-layer-${index}`;
          const leadStripWidth = Math.min(8, Math.max(3, width * 0.18));
          const trailingStripWidth = Math.min(10, Math.max(4, width * 0.16));
          const topCapHeight = Math.min(7, Math.max(3, sectionHeight * 0.08));
          currentX += width;

          return (
            <g key={layer.key} opacity={frontOpacity}>
              <clipPath id={clipId}>
                <rect height={sectionHeight} width={width} x={x} y={sectionY} />
              </clipPath>
              <rect
                fill={appearance.front}
                height={sectionHeight}
                stroke={layer.active ? "#2d7cf6" : appearance.stroke}
                strokeWidth={layer.active ? "2.1" : "1.05"}
                width={width}
                x={x}
                y={sectionY}
              />
              <rect fill={appearance.top} height={sectionHeight} opacity="0.78" width={leadStripWidth} x={x} y={sectionY} />
              <rect fill={appearance.side} height={sectionHeight} opacity="0.54" width={trailingStripWidth} x={x + width - trailingStripWidth} y={sectionY} />
              <rect fill={appearance.top} height={topCapHeight} opacity="0.92" width={width} x={x} y={sectionY} />
              <rect fill={facePatternUrl(idPrefix, appearance.pattern)} height={sectionHeight} opacity={appearance.patternOpacity} width={width} x={x} y={sectionY} />
              {renderMaterialDetail({
                clipId,
                detail: appearance.detail,
                height: sectionHeight,
                stroke: appearance.stroke,
                width,
                x,
                y: sectionY
              })}
              <rect fill={`url(#${idPrefix}-front-sidewash)`} height={sectionHeight} opacity="0.45" width={width} x={x} y={sectionY} />
              <rect fill="rgba(44,57,70,0.06)" height={sectionHeight} opacity="0.78" width={trailingStripWidth} x={x + width - trailingStripWidth} y={sectionY} />
              <line stroke="rgba(255,255,255,0.34)" strokeWidth="1" x1={x + 1} x2={x + width - 1} y1={sectionY + 1} y2={sectionY + 1} />
              {renderPill({
                fill: appearance.badgeFill,
                height: 20,
                stroke: `${appearance.stroke}${alphaHex(0.42)}`,
                text: layer.indexLabel,
                textColor: appearance.badgeText,
                width: 20,
                x: badgeX,
                y: sectionY + 10
              })}
              {width < 58 ? (
                <g transform={`translate(${x + width / 2}, ${labelY + 11}) rotate(-90)`}>
                  {renderPill({
                    fill: layer.ready === false ? "#fff5eb" : "#fffdf9",
                    height: 22,
                    stroke: `${appearance.stroke}${alphaHex(0.38)}`,
                    text: layer.thicknessLabel,
                    textColor: "#243041",
                    width: pillW,
                    x: -pillW / 2,
                    y: -11
                  })}
                </g>
              ) : (
                renderPill({
                  fill: layer.ready === false ? "#fff5eb" : "#fffdf9",
                  height: 22,
                  stroke: `${appearance.stroke}${alphaHex(0.38)}`,
                  text: layer.thicknessLabel,
                  textColor: "#243041",
                  width: pillW,
                  x: Math.max(x + 4, x + width / 2 - pillW / 2),
                  y: labelY
                })
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
