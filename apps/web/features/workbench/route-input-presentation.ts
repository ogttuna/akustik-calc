export type WorkbenchRequiredInputTargetField =
  | "airborneMode"
  | "airborneResilientBarSideCount"
  | "buildingPredictionOutputBasis"
  | "ci50_2500Db"
  | "ciDb"
  | "conservativeFlankingAssumption"
  | "fieldKDb"
  | "flankingJunctionClass"
  | "impactReceivingRoomVolumeM3"
  | "junctionCouplingLengthM"
  | "loadBasisKgM2"
  | "panelHeightMm"
  | "panelWidthMm"
  | "receivingRoomRt60S"
  | "receivingRoomVolumeM3"
  | "resilientLayerDynamicStiffnessMNm3"
  | "sourceRoomVolumeM3"
  | "supportSpacingMm"
  | "wallCavity1AbsorptionClass"
  | "wallCavity1DepthMm"
  | "wallCavity1FillCoverage"
  | "wallSideALeafLayerIndices"
  | "wallSideBLeafLayerIndices"
  | "wallSupportTopology"
  | "wallTopologyMode";

export type WorkbenchRequiredInputPresentation = {
  actionLabel?: string;
  detail: string;
  label: string;
  severity: "info" | "warning";
  targetFields: readonly WorkbenchRequiredInputTargetField[];
  targetIntent?: "layer_stack" | "material_properties";
  traceCode: string;
};

type PresentationMatch = {
  actionLabel?: string;
  detail: string;
  label: string;
  match: (normalized: string, normalizedTail: string) => boolean;
  targetFields?: readonly WorkbenchRequiredInputTargetField[];
  targetIntent?: WorkbenchRequiredInputPresentation["targetIntent"];
};

function normalizeRequiredInputCode(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function requiredInputTail(value: string): string {
  return value.split(":").at(-1) ?? value;
}

function humanizeRequiredInputCode(value: string): string {
  const tail = requiredInputTail(value).split(".").at(-1) ?? value;
  return tail
    .replace(/_/gu, " ")
    .replace(/([a-z])([A-Z])/gu, "$1 $2")
    .replace(/\b\w/gu, (match) => match.toUpperCase())
    .replace(/\bM2\b/gu, "m2")
    .replace(/\bM3\b/gu, "m3")
    .replace(/\bMm\b/gu, "mm")
    .replace(/\bDb\b/gu, "dB")
    .replace(/\bRt60\b/gu, "RT60")
    .trim();
}

function includesAny(normalized: string, normalizedTail: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => normalized.includes(pattern) || normalizedTail.includes(pattern));
}

const PRESENTATION_MATCHES: readonly PresentationMatch[] = [
  {
    actionLabel: "Edit material",
    detail: "The active porous cavity damping route needs flow resistivity on the selected porous absorber material.",
    label: "Flow resistivity",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["flowresistivitypasm2"]),
    targetIntent: "material_properties"
  },
  {
    actionLabel: "Review material",
    detail: "The active leaf route needs positive surface mass from the leaf material or its density and thickness.",
    label: "Leaf surface mass",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["surfacemasskgm2"]),
    targetIntent: "material_properties"
  },
  {
    actionLabel: "Review",
    detail: "Classify or add the upper topping / floating layer required by the selected floor impact route.",
    label: "Upper topping / floating layer",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["toppingorfloatinglayer"]),
    targetIntent: "layer_stack"
  },
  {
    actionLabel: "Group",
    detail: "Set Wall topology to Double leaf, then enter the visible row number(s) for the Side A leaf.",
    label: "Side A leaf rows",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["sidealeafgroup"]),
    targetFields: ["wallSideALeafLayerIndices"]
  },
  {
    actionLabel: "Group",
    detail: "Enter the visible row number(s) for the Side B leaf.",
    label: "Side B leaf rows",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["sidebleafgroup"]),
    targetFields: ["wallSideBLeafLayerIndices"]
  },
  {
    actionLabel: "Review",
    detail: "Leaf and cavity row groups must be non-empty, non-overlapping, and inside the current layer list.",
    label: "Layer ownership",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["leafgrouping"]),
    targetFields: ["wallTopologyMode"]
  },
  {
    actionLabel: "Enter",
    detail: "Enter the cavity depth in millimetres or use the current cavity layer role to fill it.",
    label: "Cavity depth",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["cavity1depthmm", "cavitydepthmm"]),
    targetFields: ["wallCavity1DepthMm"]
  },
  {
    actionLabel: "Select",
    detail: "Select whether the cavity is empty, partially filled, or fully filled.",
    label: "Cavity fill",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["cavity1fillcoverage", "fillstate"]),
    targetFields: ["wallCavity1FillCoverage"]
  },
  {
    actionLabel: "Select",
    detail: "Select the cavity absorption class for the fill layer.",
    label: "Cavity absorption",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["absorberclass"]),
    targetFields: ["wallCavity1AbsorptionClass"]
  },
  {
    actionLabel: "Select",
    detail: "Choose the support topology; the dynamic route derives the frame bridge class from that support path.",
    label: "Frame bridge path",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["framebridgeclass"]),
    targetFields: ["wallSupportTopology"]
  },
  {
    actionLabel: "Select",
    detail: "Select the support path used by the framed wall route.",
    label: "Support topology",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["supporttopology"]),
    targetFields: ["wallSupportTopology"]
  },
  {
    actionLabel: "Enter",
    detail: "Enter support or stud spacing in millimetres.",
    label: "Support spacing",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["supportspacingmm", "studspacingmm"]),
    targetFields: ["supportSpacingMm"]
  },
  {
    actionLabel: "Select",
    detail: "Select whether resilient bars/channels are on one side or both sides.",
    label: "Resilient bars",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["resilientbarsidecount"]),
    targetFields: ["airborneResilientBarSideCount"]
  },
  {
    actionLabel: "Select",
    detail: "Select Field or Building mode for apparent airborne outputs.",
    label: "Airborne mode",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["contextmode"]),
    targetFields: ["airborneMode"]
  },
  {
    actionLabel: "Enter",
    detail: "Enter panel width and height; the route derives partition area from those dimensions.",
    label: "Panel area",
    match: (normalized, normalizedTail) =>
      includesAny(normalized, normalizedTail, ["partitionaream2", "partitionarea"]) ||
      includesAny(normalized, normalizedTail, ["panelwidthheight"]),
    targetFields: ["panelWidthMm", "panelHeightMm"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for building prediction.",
    label: "Source room volume",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["sourceroomvolumem3"]),
    targetFields: ["sourceRoomVolumeM3"]
  },
  {
    actionLabel: "Select",
    detail: "Select the flanking junction class used by the building route.",
    label: "Flanking junction",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["flankingjunctionclass"]),
    targetFields: ["flankingJunctionClass"]
  },
  {
    actionLabel: "Select",
    detail: "Select the conservative flanking assumption for the route.",
    label: "Flanking assumption",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["conservativeflankingassumption"]),
    targetFields: ["conservativeFlankingAssumption"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for the building prediction flanking path.",
    label: "Coupling length",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["junctioncouplinglengthm"]),
    targetFields: ["junctionCouplingLengthM"]
  },
  {
    actionLabel: "Select",
    detail: "Select whether the building route should publish apparent, standardized, or both outputs.",
    label: "Building output basis",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["buildingpredictionoutputbasis"]),
    targetFields: ["buildingPredictionOutputBasis"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for low-frequency impact field output.",
    label: "CI,50-2500",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["ci502500db"]),
    targetFields: ["ci50_2500Db"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for impact spectrum adaptation.",
    label: "CI",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["cidb"]),
    targetFields: ["ciDb"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for field correction.",
    label: "K correction",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["fieldkdb"]),
    targetFields: ["fieldKDb"]
  },
  {
    actionLabel: "Review",
    detail: "Complete the impact field context required by the selected field impact output.",
    label: "Impact field context",
    match: (normalized, normalizedTail) => normalized === "impactfieldcontext" || normalizedTail === "impactfieldcontext",
    targetFields: ["fieldKDb", "impactReceivingRoomVolumeM3", "ciDb", "ci50_2500Db"]
  },
  {
    actionLabel: "Enter",
    detail: "Enter impact receiving-room volume.",
    label: "Impact room volume",
    match: (normalized, normalizedTail) =>
      (normalized.includes("impactfieldcontext") && normalized.includes("receivingroomvolumem3")) ||
      includesAny(normalized, normalizedTail, ["impactfieldcontextreceivingroomvolumem3", "impactreceivingroomvolumem3"]),
    targetFields: ["impactReceivingRoomVolumeM3"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for standardized receiving-room output.",
    label: "RT60",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["receivingroomrt60s"]),
    targetFields: ["receivingRoomRt60S"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for field or standardized output.",
    label: "Room volume",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["receivingroomvolumem3"]),
    targetFields: ["receivingRoomVolumeM3"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for field/building airborne output.",
    label: "Panel width",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["panelwidthmm"]),
    targetFields: ["panelWidthMm"]
  },
  {
    actionLabel: "Enter",
    detail: "Required for field/building airborne output.",
    label: "Panel height",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["panelheightmm"]),
    targetFields: ["panelHeightMm"]
  },
  {
    actionLabel: "Enter",
    detail: "Required by the floor impact route.",
    label: "Load basis",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["loadbasiskgm2"]),
    targetFields: ["loadBasisKgM2"]
  },
  {
    actionLabel: "Enter",
    detail: "Required by the resilient layer route.",
    label: "Dynamic stiffness",
    match: (normalized, normalizedTail) => includesAny(normalized, normalizedTail, ["resilientlayerdynamicstiffnessmnm3"]),
    targetFields: ["resilientLayerDynamicStiffnessMNm3"]
  },
  {
    detail: "Enter the missing layer material before the calculator can preview this candidate.",
    label: "Layer material",
    match: (_normalized, normalizedTail) => includesAny(normalizedTail, normalizedTail, ["layermaterialmissing"]),
    targetIntent: "layer_stack"
  },
  {
    detail: "Enter the missing layer thickness before the calculator can preview this candidate.",
    label: "Layer thickness",
    match: (_normalized, normalizedTail) => includesAny(normalizedTail, normalizedTail, ["layerthicknessmissing", "missinglayerthickness"]),
    targetIntent: "layer_stack"
  }
];

// AGENT COORDINATION 2026-06-24 (Codex): this helper is UI-neutral on
// purpose. Engine ids stay available as traceCode, while each Workbench
// surface adapts semantic targetFields to its own DOM ids or task controls.
export function resolveWorkbenchRequiredInputPresentation(
  code: string,
  options: { fallbackDetail?: string; severity?: "info" | "warning" } = {}
): WorkbenchRequiredInputPresentation {
  const normalized = normalizeRequiredInputCode(code);
  const normalizedTail = normalizeRequiredInputCode(requiredInputTail(code));
  const match = PRESENTATION_MATCHES.find((candidate) => candidate.match(normalized, normalizedTail));

  if (match) {
    return {
      actionLabel: match.actionLabel,
      detail: match.detail,
      label: match.label,
      severity: options.severity ?? "warning",
      targetFields: match.targetFields ?? [],
      targetIntent: match.targetIntent,
      traceCode: code
    };
  }

  return {
    detail: options.fallbackDetail ?? "The active formula route needs this physical input before it can calculate the selected output.",
    label: humanizeRequiredInputCode(code),
    severity: options.severity ?? "warning",
    targetFields: [],
    traceCode: code
  };
}
