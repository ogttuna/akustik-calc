export type SimpleWorkbenchProposalConstructionLayer = {
  categoryLabel: string;
  index: number;
  label: string;
  roleLabel?: string;
  thicknessLabel: string;
};

export type SimpleWorkbenchProposalConstructionBand = {
  category: string;
  flexGrow: number;
  indexLabel: string;
  label: string;
  materialFamily: "board" | "generic" | "gap" | "insulation" | "mass" | "resilient";
  metaLabel: string;
  thicknessMm: number | null;
  thicknessLabel: string;
  tone: "interior" | "leading" | "trailing";
};

export type SimpleWorkbenchProposalConstructionSection = {
  anchorFromLabel: string;
  anchorToLabel: string;
  bands: readonly SimpleWorkbenchProposalConstructionBand[];
  headline: string;
  isWall: boolean;
  totalThicknessLabel: string;
};

function parseThicknessMm(value: string): number | null {
  const match = value.match(/-?\d+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatMillimetres(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function inferConstructionMaterialFamily(input: {
  categoryLabel: string;
  label: string;
  roleLabel?: string;
}): SimpleWorkbenchProposalConstructionBand["materialFamily"] {
  const joined = [input.categoryLabel, input.label, input.roleLabel ?? ""].join(" ").toLowerCase();

  if (
    joined.includes("concrete") ||
    joined.includes("masonry") ||
    joined.includes("brick") ||
    joined.includes("block") ||
    joined.includes("mass") ||
    joined.includes("slab") ||
    joined.includes("screed")
  ) {
    return "mass";
  }

  if (
    joined.includes("wool") ||
    joined.includes("insulation") ||
    joined.includes("mineral") ||
    joined.includes("porous") ||
    joined.includes("felt") ||
    joined.includes("fibre") ||
    joined.includes("fiber") ||
    joined.includes("cavity fill") ||
    joined.includes("fill")
  ) {
    return "insulation";
  }

  if (
    joined.includes("resilient") ||
    joined.includes("underlay") ||
    joined.includes("mat") ||
    joined.includes("isolator") ||
    joined.includes("spring")
  ) {
    return "resilient";
  }

  if (
    joined.includes("gap") ||
    joined.includes("air") ||
    joined.includes("void") ||
    joined.includes("channel") ||
    joined.includes("support") ||
    joined.includes("hanger") ||
    joined.includes("clip")
  ) {
    return "gap";
  }

  if (
    joined.includes("board") ||
    joined.includes("gypsum") ||
    joined.includes("plaster") ||
    joined.includes("finish") ||
    joined.includes("tile") ||
    joined.includes("plywood") ||
    joined.includes("osb") ||
    joined.includes("lining")
  ) {
    return "board";
  }

  return "generic";
}

export function buildSimpleWorkbenchProposalConstructionSection(
  layers: readonly SimpleWorkbenchProposalConstructionLayer[],
  studyModeLabel: string
): SimpleWorkbenchProposalConstructionSection {
  const normalizedStudyMode = studyModeLabel.trim().toLowerCase();
  const isWall = normalizedStudyMode.includes("wall");
  const anchorFromLabel = isWall ? "Side A" : "Walking side";
  const anchorToLabel = isWall ? "Side B" : "Ceiling side";
  const totalThicknessMm = layers.reduce((sum, layer) => sum + (parseThicknessMm(layer.thicknessLabel) ?? 0), 0);
  const bands: SimpleWorkbenchProposalConstructionBand[] = layers.map((layer, index) => ({
    category: layer.categoryLabel.toLowerCase(),
    flexGrow: Math.max(parseThicknessMm(layer.thicknessLabel) ?? 5, 12),
    indexLabel: String(layer.index).padStart(2, "0"),
    label: layer.label,
    materialFamily: inferConstructionMaterialFamily(layer),
    metaLabel: layer.roleLabel ?? layer.categoryLabel,
    thicknessMm: parseThicknessMm(layer.thicknessLabel),
    thicknessLabel: layer.thicknessLabel,
    tone:
      index === 0
        ? "leading"
        : index === layers.length - 1
          ? "trailing"
          : "interior"
  }));

  return {
    anchorFromLabel,
    anchorToLabel,
    bands,
    headline: layers.length > 0 ? `${layers.length} visible row${layers.length === 1 ? "" : "s"} in solver order.` : "No visible rows are packaged yet.",
    isWall,
    totalThicknessLabel: totalThicknessMm > 0 ? `${formatMillimetres(totalThicknessMm)} mm total` : "Thickness not entered",
  };
}
