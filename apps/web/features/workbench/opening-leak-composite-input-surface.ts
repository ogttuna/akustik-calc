import type {
  AcousticInputFieldId,
  AirborneContext,
  AirborneOpeningOrigin,
  AirborneOpeningRatingBasis,
  AirborneOpeningSealLeakageClass,
  RequestedOutputId
} from "@dynecho/shared";

import { parsePositiveWorkbenchNumber } from "./parse-number";
import type { StudyMode } from "./preset-definitions";

export const WORKBENCH_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_ID =
  "gate_u_personal_use_mvp_opening_leak_composite_input_surface";

const OPENING_AFFECTED_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "Rw",
  "STC"
]);

export const WORKBENCH_OPENING_LEAK_INPUT_LABELS: Partial<Record<AcousticInputFieldId, string>> = {
  hostWallAreaM2: "Host wall area (m2)",
  openingAreaM2: "Opening area (m2)",
  openingCount: "Opening count",
  openingElementRwDb: "Opening element Rw (dB)",
  openingOrigin: "Opening origin",
  openingRatingBasis: "Opening rating basis",
  openingSealLeakageClass: "Seal/leakage class"
};

export type WorkbenchOpeningLeakElementDraft = {
  areaM2: string;
  count: string;
  elementRwDb: string;
  id: string;
  origin: "" | AirborneOpeningOrigin;
  ratingBasis: "" | AirborneOpeningRatingBasis;
  sealLeakageClass: "" | AirborneOpeningSealLeakageClass;
};

export type WorkbenchOpeningLeakCompositeInputSurfaceDraft = {
  elements: readonly WorkbenchOpeningLeakElementDraft[];
  hostWallAreaM2: string;
};

export type WorkbenchOpeningLeakCompositeInputSurfaceResult = {
  airborneContextPatch: Pick<AirborneContext, "hostWallAreaM2" | "openingLeakElements">;
  hostileInputBoundaries: readonly string[];
  id: typeof WORKBENCH_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_ID;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: "complete" | "inactive" | "needs_input" | "unsupported";
};

export function makeWorkbenchOpeningLeakElementDraft(
  seed?: Partial<WorkbenchOpeningLeakElementDraft>
): WorkbenchOpeningLeakElementDraft {
  return {
    areaM2: "",
    count: "",
    elementRwDb: "",
    id: crypto.randomUUID(),
    origin: "",
    ratingBasis: "",
    sealLeakageClass: "",
    ...seed
  };
}

function hasOpeningOutputs(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => OPENING_AFFECTED_OUTPUTS.has(output));
}

function hasElementInput(draft: WorkbenchOpeningLeakElementDraft): boolean {
  return (
    draft.areaM2.trim().length > 0 ||
    draft.count.trim().length > 0 ||
    draft.elementRwDb.trim().length > 0 ||
    draft.origin.length > 0 ||
    draft.ratingBasis.length > 0 ||
    draft.sealLeakageClass.length > 0
  );
}

function positiveIntegerFromDraft(value: string): number | undefined {
  const parsed = parsePositiveWorkbenchNumber(value);
  return typeof parsed === "number" && Number.isInteger(parsed) ? parsed : undefined;
}

function known(value: string | undefined): boolean {
  return typeof value === "string" && value.length > 0 && value !== "unknown";
}

function openingSignature(opening: NonNullable<AirborneContext["openingLeakElements"]>[number]): string {
  return [
    opening.id ?? "no-id",
    opening.areaM2 ?? "no-area",
    opening.count ?? "no-count",
    opening.elementRwDb ?? "no-rw",
    opening.ratingBasis ?? "no-rating-basis",
    opening.sealLeakageClass ?? "no-seal-class",
    opening.origin ?? "no-origin"
  ].join("|");
}

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function normalizeOpeningElements(drafts: readonly WorkbenchOpeningLeakElementDraft[]) {
  return drafts.filter(hasElementInput).map((draft) => ({
    areaM2: parsePositiveWorkbenchNumber(draft.areaM2),
    count: positiveIntegerFromDraft(draft.count),
    elementRwDb: parsePositiveWorkbenchNumber(draft.elementRwDb),
    id: draft.id.trim().length > 0 ? draft.id.trim() : undefined,
    origin: draft.origin || undefined,
    ratingBasis: draft.ratingBasis || undefined,
    sealLeakageClass: draft.sealLeakageClass || undefined
  }));
}

function collectMissing(input: {
  hostWallAreaM2: number | undefined;
  openings: NonNullable<AirborneContext["openingLeakElements"]>;
}): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];

  if (typeof input.hostWallAreaM2 !== "number") {
    missing.push("hostWallAreaM2");
  }

  if (input.openings.length === 0) {
    missing.push(
      "openingAreaM2",
      "openingElementRwDb",
      "openingRatingBasis",
      "openingSealLeakageClass",
      "openingCount",
      "openingOrigin"
    );
  }

  for (const opening of input.openings) {
    if (typeof opening.areaM2 !== "number") {
      missing.push("openingAreaM2");
    }
    if (typeof opening.elementRwDb !== "number") {
      missing.push("openingElementRwDb");
    }
    if (!known(opening.ratingBasis)) {
      missing.push("openingRatingBasis");
    }
    if (!known(opening.sealLeakageClass)) {
      missing.push("openingSealLeakageClass");
    }
    if (typeof opening.count !== "number") {
      missing.push("openingCount");
    }
    if (!known(opening.origin)) {
      missing.push("openingOrigin");
    }
  }

  return unique(missing);
}

function collectHostile(input: {
  hostWallAreaM2: number | undefined;
  openings: NonNullable<AirborneContext["openingLeakElements"]>;
}): string[] {
  const hostile: string[] = [];
  const ids = input.openings
    .map((opening) => opening.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  const signatures = input.openings.map(openingSignature);

  if (new Set(ids).size !== ids.length) {
    hostile.push("duplicateOpeningId");
  }
  if (new Set(signatures).size !== signatures.length) {
    hostile.push("duplicateOpeningSignature");
  }

  const effectiveOpeningArea = input.openings.reduce(
    (total, opening) => total + (opening.areaM2 ?? 0) * (opening.count ?? 0),
    0
  );
  if (
    typeof input.hostWallAreaM2 === "number" &&
    effectiveOpeningArea > input.hostWallAreaM2
  ) {
    hostile.push("openingAreaExceedsHostWallArea");
  }

  return unique(hostile);
}

export function buildWorkbenchOpeningLeakCompositeInputSurface(input: {
  studyMode: StudyMode;
  surface: WorkbenchOpeningLeakCompositeInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): WorkbenchOpeningLeakCompositeInputSurfaceResult {
  const hostWallAreaM2 = parsePositiveWorkbenchNumber(input.surface.hostWallAreaM2);
  const openings = normalizeOpeningElements(input.surface.elements);
  const routeActive =
    input.surface.hostWallAreaM2.trim().length > 0 || input.surface.elements.some(hasElementInput);

  if (input.studyMode !== "wall" || !routeActive || !hasOpeningOutputs(input.targetOutputs)) {
    return {
      airborneContextPatch: {},
      hostileInputBoundaries: [],
      id: WORKBENCH_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_ID,
      missingPhysicalInputs: [],
      status: "inactive"
    };
  }

  const airborneContextPatch: Pick<AirborneContext, "hostWallAreaM2" | "openingLeakElements"> = {
    hostWallAreaM2,
    openingLeakElements: openings
  };
  const missingPhysicalInputs = collectMissing({ hostWallAreaM2, openings });
  const hostileInputBoundaries = collectHostile({ hostWallAreaM2, openings });

  return {
    airborneContextPatch,
    hostileInputBoundaries,
    id: WORKBENCH_OPENING_LEAK_COMPOSITE_INPUT_SURFACE_ID,
    missingPhysicalInputs,
    status:
      hostileInputBoundaries.length > 0
        ? "unsupported"
        : missingPhysicalInputs.length > 0
          ? "needs_input"
          : "complete"
  };
}

export function formatWorkbenchOpeningLeakCompositeMissingInputWarning(
  result: WorkbenchOpeningLeakCompositeInputSurfaceResult
): string | null {
  if (result.status !== "needs_input" || result.missingPhysicalInputs.length === 0) {
    return null;
  }

  const missingLabels = result.missingPhysicalInputs.map(
    (field) => WORKBENCH_OPENING_LEAK_INPUT_LABELS[field] ?? field
  );

  return `Opening/leak composite lane needs these physical inputs before calculating lab/field/building opening outputs: ${missingLabels.join(", ")}.`;
}
