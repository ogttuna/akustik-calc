import type { CSSProperties } from "react";
import type { MaterialDefinition } from "@dynecho/shared";

import type { WorkbenchSectionTone } from "./simple-workbench-constants";
import { getIllustrationMaterialCue, type LayerVisualMaterial } from "./simple-workbench-illustration";

// ---------------------------------------------------------------------------
// Layer fill / stroke utilities
// ---------------------------------------------------------------------------

export function layerFillClass(material: MaterialDefinition): string {
  switch (getIllustrationMaterialCue(material)) {
    case "board":
      return "bg-[#ddd8cf]";
    case "plaster":
      return "bg-[#ebdecd]";
    case "fiber":
      return "bg-[#d5bf78]";
    case "cavity":
      return "bg-[#eceeed]";
    case "concrete":
      return "bg-[#ced1d0]";
    case "masonry":
      return "bg-[#d4b79b]";
    case "resilient":
      return "bg-[#97c2b6]";
    case "steel_support":
    case "support":
      return "bg-[#c6ccd0]";
    case "surface":
      return "bg-[#d8d6cf]";
    case "timber":
    case "timber_support":
      return "bg-[#cfac84]";
    case "mass":
    default:
      return "bg-[#d6d8db]";
  }
}

export function layerStrokeClass(material: MaterialDefinition): string {
  switch (getIllustrationMaterialCue(material)) {
    case "board":
      return "border-[#938779]";
    case "plaster":
      return "border-[#8f7e6b]";
    case "fiber":
      return "border-[#806638]";
    case "cavity":
      return "border-[#87908e]";
    case "concrete":
      return "border-[#747d82]";
    case "masonry":
      return "border-[#7f6048]";
    case "resilient":
      return "border-[#4f7669]";
    case "steel_support":
    case "support":
      return "border-[#66737c]";
    case "surface":
      return "border-[#74766f]";
    case "timber":
    case "timber_support":
      return "border-[#745536]";
    case "mass":
    default:
      return "border-[#7f8b95]";
  }
}

// ---------------------------------------------------------------------------
// 3-D layer visual surface
// ---------------------------------------------------------------------------

export type LayerVisualSurface = {
  badgeStyle: CSSProperties;
  dimensionStyle: CSSProperties;
  frontStyle: CSSProperties;
  labelToneClass: string;
  sideStyle: CSSProperties;
  topStyle: CSSProperties;
};

export function buildLayerFaceStyle(input: {
  backgroundColor: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  boxShadow?: string;
  filter?: string;
  outline?: string;
}): CSSProperties {
  return {
    backgroundColor: input.backgroundColor,
    backgroundImage: input.backgroundImage,
    backgroundPosition: input.backgroundPosition,
    backgroundRepeat: input.backgroundRepeat,
    backgroundSize: input.backgroundSize,
    boxShadow: input.boxShadow,
    filter: input.filter,
    outline: input.outline
  };
}

function buildLabelStyle(input: {
  backgroundColor: string;
  borderColor: string;
  color: string;
}): CSSProperties {
  return {
    backgroundColor: input.backgroundColor,
    border: `1px solid ${input.borderColor}`,
    boxShadow: "0 8px 16px rgba(18, 24, 38, 0.08)",
    color: input.color
  };
}

export function getLayerVisualSurface(material: MaterialDefinition | LayerVisualMaterial): LayerVisualSurface {
  switch (getIllustrationMaterialCue(material)) {
    case "concrete":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(247, 249, 252, 0.92)",
          borderColor: "rgba(95, 108, 124, 0.22)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(253, 254, 255, 0.9)",
          borderColor: "rgba(95, 108, 124, 0.26)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 24%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(0,0,0,0.08)), radial-gradient(circle at 14px 16px, rgba(255,255,255,0.18) 0 1.6px, transparent 1.7px), radial-gradient(circle at 26px 10px, rgba(0,0,0,0.14) 0 1.2px, transparent 1.3px), radial-gradient(circle at 10px 28px, rgba(0,0,0,0.08) 0 1.1px, transparent 1.2px), linear-gradient(90deg, rgba(255,255,255,0.05), rgba(0,0,0,0.05))",
          backgroundRepeat: "no-repeat, repeat, repeat, repeat, no-repeat",
          backgroundSize: "100% 100%, 28px 28px, 24px 24px, 32px 32px, 100% 100%",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 42%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(0,0,0,0.16)), radial-gradient(circle at 10px 12px, rgba(255,255,255,0.10) 0 1.2px, transparent 1.3px)",
          backgroundRepeat: "no-repeat, repeat",
          backgroundSize: "100% 100%, 22px 22px"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 16%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.36), rgba(0,0,0,0.05)), radial-gradient(circle at 12px 12px, rgba(0,0,0,0.1) 0 1px, transparent 1.2px)",
          backgroundRepeat: "no-repeat, repeat",
          backgroundSize: "100% 100%, 24px 24px"
        })
      };
    case "masonry":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(253, 248, 242, 0.94)",
          borderColor: "rgba(159, 125, 90, 0.22)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 250, 244, 0.92)",
          borderColor: "rgba(159, 125, 90, 0.24)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 18%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(0,0,0,0.06)), repeating-linear-gradient(180deg, transparent 0 22px, rgba(120,93,61,0.12) 22px 24px), radial-gradient(circle at 14px 14px, rgba(255,255,255,0.16) 0 1.4px, transparent 1.6px)",
          backgroundRepeat: "no-repeat, repeat, repeat",
          backgroundSize: "100% 100%, 100% 24px, 28px 28px"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning-ink) 30%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(0,0,0,0.12))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 12%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(0,0,0,0.04))"
        })
      };
    case "board":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(247, 246, 242, 0.94)",
          borderColor: "rgba(147, 135, 121, 0.24)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 253, 248, 0.92)",
          borderColor: "rgba(147, 135, 121, 0.24)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "#ddd8cf",
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.48), rgba(255,255,255,0.1) 22%, rgba(0,0,0,0.06) 100%), repeating-linear-gradient(180deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 16px), linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.05))",
          backgroundRepeat: "no-repeat, repeat, no-repeat",
          backgroundSize: "100% 100%, 100% 16px, 100% 100%"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "#c6baab",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.12))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "#ece7de",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.32), rgba(0,0,0,0.05))"
        })
      };
    case "plaster":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 253, 248, 0.94)",
          borderColor: "rgba(177, 148, 112, 0.18)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 253, 250, 0.9)",
          borderColor: "rgba(177, 148, 112, 0.22)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 10%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.3), rgba(0,0,0,0.04)), repeating-linear-gradient(165deg, rgba(187,155,114,0.08) 0 10px, transparent 10px 24px)",
          backgroundRepeat: "no-repeat, repeat",
          backgroundSize: "100% 100%, 100% 24px"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 18%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(0,0,0,0.1))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 8%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.36), rgba(0,0,0,0.04))"
        })
      };
    case "timber":
    case "timber_support":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 249, 241, 0.94)",
          borderColor: "rgba(176, 128, 84, 0.24)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 251, 246, 0.92)",
          borderColor: "rgba(176, 128, 84, 0.24)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 26%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(0,0,0,0.08)), repeating-linear-gradient(0deg, rgba(145,97,55,0.18) 0 2px, transparent 2px 12px), linear-gradient(90deg, rgba(255,255,255,0.12), rgba(0,0,0,0.08))",
          backgroundRepeat: "no-repeat, repeat, no-repeat",
          backgroundSize: "100% 100%, 100% 12px, 100% 100%"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning-ink) 36%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(0,0,0,0.14))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--warning) 18%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(0,0,0,0.05))"
        })
      };
    case "steel_support":
    case "support":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(248, 250, 252, 0.94)",
          borderColor: "rgba(91, 108, 132, 0.22)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(252, 253, 255, 0.92)",
          borderColor: "rgba(91, 108, 132, 0.26)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "#c6ccd0",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.26), rgba(0,0,0,0.12)), repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 3px, rgba(79,94,117,0.12) 3px 12px)",
          backgroundRepeat: "no-repeat, repeat",
          backgroundSize: "100% 100%, 12px 100%"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "#a7afb5",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(0,0,0,0.14))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "#dfe2e4",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(0,0,0,0.06))"
        })
      };
    case "resilient":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(244, 252, 247, 0.94)",
          borderColor: "rgba(72, 141, 110, 0.2)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(248, 253, 249, 0.92)",
          borderColor: "rgba(72, 141, 110, 0.22)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "#97c2b6",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.05)), radial-gradient(circle at 10px 10px, rgba(255,255,255,0.18) 0 2px, transparent 2.2px), radial-gradient(circle at 24px 20px, rgba(0,0,0,0.08) 0 2px, transparent 2.2px)",
          backgroundRepeat: "no-repeat, repeat, repeat",
          backgroundSize: "100% 100%, 22px 22px, 26px 26px"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "#79a493",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(0,0,0,0.12))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "#c6ddd6",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(0,0,0,0.04))"
        })
      };
    case "fiber":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 248, 232, 0.94)",
          borderColor: "rgba(128, 102, 56, 0.24)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(255, 251, 241, 0.92)",
          borderColor: "rgba(128, 102, 56, 0.24)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "#d5bf78",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.06)), repeating-linear-gradient(135deg, rgba(255,255,255,0.24) 0 2px, transparent 2px 12px), repeating-linear-gradient(45deg, rgba(18,77,57,0.08) 0 1px, transparent 1px 10px)",
          backgroundRepeat: "no-repeat, repeat, repeat",
          backgroundSize: "100% 100%, 12px 12px, 10px 10px"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "#b59a58",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(0,0,0,0.12))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "#e9d89e",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 12px)"
        })
      };
    case "cavity":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(240, 245, 249, 0.94)",
          borderColor: "rgba(73, 86, 103, 0.22)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(245, 248, 251, 0.92)",
          borderColor: "rgba(73, 86, 103, 0.24)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 9%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.16)), radial-gradient(circle at 2px 2px, rgba(43,56,69,0.34) 0 1px, transparent 1.2px), linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 42%, rgba(0,0,0,0.12) 100%)",
          backgroundRepeat: "no-repeat, repeat, no-repeat",
          backgroundSize: "100% 100%, 10px 10px, 100% 100%"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 20%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.14))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 6%, var(--paper))",
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(43,56,69,0.22) 0 0.9px, transparent 1px)",
          backgroundRepeat: "repeat",
          backgroundSize: "10px 10px"
        })
      };
    case "surface":
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(247, 249, 248, 0.94)",
          borderColor: "rgba(111, 124, 118, 0.24)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(252, 253, 251, 0.92)",
          borderColor: "rgba(111, 124, 118, 0.24)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "#d8d6cf",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(0,0,0,0.08)), linear-gradient(90deg, rgba(255,255,255,0.18), transparent 38%, rgba(255,255,255,0.08) 66%, rgba(0,0,0,0.06) 100%)"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "#c0bdb4",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(0,0,0,0.12))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "#ebe8de",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(0,0,0,0.05))"
        })
      };
    case "mass":
    default:
      return {
        badgeStyle: buildLabelStyle({
          backgroundColor: "rgba(246, 248, 250, 0.94)",
          borderColor: "rgba(87, 103, 123, 0.22)",
          color: "var(--ink)"
        }),
        dimensionStyle: buildLabelStyle({
          backgroundColor: "rgba(251, 252, 254, 0.92)",
          borderColor: "rgba(87, 103, 123, 0.24)",
          color: "var(--ink-soft)"
        }),
        frontStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 20%, var(--paper))",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(0,0,0,0.08)), linear-gradient(90deg, rgba(255,255,255,0.04), rgba(0,0,0,0.06)), radial-gradient(circle at 16px 14px, rgba(255,255,255,0.12) 0 1.2px, transparent 1.3px)",
          backgroundRepeat: "no-repeat, no-repeat, repeat",
          backgroundSize: "100% 100%, 100% 100%, 30px 30px"
        }),
        labelToneClass: "text-[color:var(--ink)]",
        sideStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 34%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(0,0,0,0.14))"
        }),
        topStyle: buildLayerFaceStyle({
          backgroundColor: "color-mix(in oklch,var(--ink) 14%, var(--paper))",
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.32), rgba(0,0,0,0.04))"
        })
      };
  }
}

// ---------------------------------------------------------------------------
// Workbench section style helpers
// ---------------------------------------------------------------------------

export function workbenchSectionPanelClass(tone: WorkbenchSectionTone): string {
  void tone;
  return "border-[color:var(--line)] bg-[color:var(--paper)]";
}

export function workbenchSectionCardClass(tone: WorkbenchSectionTone): string {
  void tone;
  return "border-[color:var(--line)] bg-[color:var(--panel)]";
}

export function workbenchSectionMutedCardClass(tone: WorkbenchSectionTone): string {
  void tone;
  return "border-[color:var(--line)] bg-[color:var(--paper-strong)]";
}

export function workbenchSectionAccentRailClass(tone: WorkbenchSectionTone): string {
  void tone;
  return "bg-[color:var(--accent)]";
}

export function workbenchSectionTitleClass(tone: WorkbenchSectionTone): string {
  void tone;
  return "text-[color:var(--ink)]";
}

export function workbenchSectionEyebrowClass(tone: WorkbenchSectionTone): string {
  void tone;
  return "text-[color:var(--ink-faint)]";
}
