import type { AssemblyCalculation, MaterialDefinition } from "@dynecho/shared";

import type { StudyMode } from "./preset-definitions";

export function describeAssembly(
  result: AssemblyCalculation | null,
  studyMode: StudyMode
): { headline: string; detail: string } {
  if (!result) {
    return {
      headline: "No valid stack yet.",
      detail: "Add at least one valid layer to generate a readable assembly narrative."
    };
  }

  const finishCount = result.layers.filter((layer: AssemblyCalculation["layers"][number]) => layer.material.category === "finish").length;
  const massCount = result.layers.filter((layer: AssemblyCalculation["layers"][number]) => layer.material.category === "mass").length;
  const gapCount = result.metrics.airGapCount;
  const insulationCount = result.metrics.insulationCount;
  const modeLabel = studyMode === "wall" ? "wall" : "floor";

  const headline = `${massCount} mass layer${massCount === 1 ? "" : "s"}, ${finishCount} finish layer${finishCount === 1 ? "" : "s"}, ${gapCount} cavity.`;

  let detail =
    `${modeLabel[0]?.toUpperCase() ?? ""}${modeLabel.slice(1)} study currently reads as a ` +
    `${gapCount > 0 ? "split" : "single-block"} assembly with ` +
    `${insulationCount > 0 ? `${insulationCount} porous fill zone${insulationCount === 1 ? "" : "s"}` : "no porous fill"}.`;

  if (studyMode === "floor" && result.impact) {
    if (typeof result.impact.LPrimeNTw === "number") {
      detail += ` Impact output is live at L'nT,w ${result.impact.LPrimeNTw.toFixed(1)} dB.`;
    } else if (typeof result.impact.LPrimeNW === "number") {
      detail += ` Impact output is live at L'n,w ${result.impact.LPrimeNW.toFixed(1)} dB.`;
    } else if (typeof result.impact.LnW === "number") {
      detail += ` Impact output is live at Ln,w ${result.impact.LnW.toFixed(1)} dB.`;
    }
  }

  return { headline, detail };
}

export function getMaterialCategoryLabel(material: MaterialDefinition): string {
  switch (material.category) {
    case "mass":
      return "Mass";
    case "finish":
      return "Finish";
    case "insulation":
      return "Insulation";
    case "gap":
      return "Gap";
    case "support":
      return "Support";
    default:
      return material.category;
  }
}
