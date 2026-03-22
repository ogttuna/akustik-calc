export type SimpleWorkbenchProposalConstructionLayer = {
  categoryLabel: string;
  index: number;
  label: string;
  roleLabel?: string;
  thicknessLabel: string;
};

export type SimpleWorkbenchProposalConstructionBand = {
  flexGrow: number;
  indexLabel: string;
  label: string;
  metaLabel: string;
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
    flexGrow: Math.max(parseThicknessMm(layer.thicknessLabel) ?? 12, 12),
    indexLabel: String(layer.index).padStart(2, "0"),
    label: layer.label,
    metaLabel: layer.roleLabel ?? layer.categoryLabel,
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
