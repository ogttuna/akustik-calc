import type { StudyMode } from "./preset-definitions";

export type GuidedRouteSignalTone = "neutral" | "ready" | "warning";

export type GuidedRouteSignalCard = {
  detail: string;
  tone: GuidedRouteSignalTone;
  value: string;
};

export type GuidedRouteSignals = {
  nextAction: GuidedRouteSignalCard;
  primaryRead: GuidedRouteSignalCard;
  stackStatus: GuidedRouteSignalCard;
};

export function deriveGuidedRouteSignals(input: {
  missingFloorRoleCount: number;
  primaryReadyCard: { label: string; value: string } | null;
  rowsLength: number;
  studyMode: StudyMode;
  topologyGap?: { detail: string; value: string } | null;
  validationPosture?: "bound" | "estimate" | "exact" | "inactive" | "low_confidence";
  validThicknessCount: number;
  warningCount: number;
}): GuidedRouteSignals {
  const {
    missingFloorRoleCount,
    primaryReadyCard,
    rowsLength,
    studyMode,
    topologyGap,
    validationPosture,
    validThicknessCount,
    warningCount
  } = input;
  const warningLabel = `${warningCount} warning${warningCount === 1 ? "" : "s"}`;

  const stackStatus: GuidedRouteSignalCard =
    rowsLength === 0
      ? {
          detail: "Load a sample or add the first material row to start the live build-up.",
          tone: "neutral",
          value: "Waiting for layers"
        }
      : validThicknessCount === rowsLength
        ? {
            detail: "Every visible row currently contributes live thickness.",
            tone: "ready",
            value: `${validThicknessCount}/${rowsLength} rows ready`
          }
        : {
            detail: "Rows without a valid thickness stay parked and do not affect the live calculation.",
            tone: "warning",
            value: `${validThicknessCount}/${rowsLength} rows ready`
          };

  const primaryRead: GuidedRouteSignalCard = primaryReadyCard
    ? {
        detail: `${primaryReadyCard.value} is already defensible on the active route.`,
        tone: "ready",
        value: `${primaryReadyCard.label} ready`
      }
    : {
        detail: "Finish the stack and required route inputs to unlock the first defensible read.",
        tone: "neutral",
        value: "Primary read pending"
      };

  const nextAction: GuidedRouteSignalCard =
    rowsLength === 0
      ? {
          detail: "Use Load sample or Add layer to start the assembly before checking outputs.",
          tone: "warning",
          value: "Add the first layer"
        }
      : validThicknessCount < rowsLength
        ? {
            detail: "Complete missing or zero thickness values so every intended row can enter the live calculation.",
            tone: "warning",
            value: "Finish thickness"
          }
        : studyMode === "floor" && missingFloorRoleCount > 0
          ? {
              detail: `${missingFloorRoleCount} row still needs a floor role before exact family matching is fully trustworthy.`,
              tone: "warning",
              value: "Tag floor roles"
            }
          : validationPosture === "bound"
            ? {
                detail: "The current lane is conservative support only. Prefer an exact or narrower supported family before treating this as a delivery-ready result.",
                tone: "warning",
                value: "Prefer exact evidence"
              }
            : validationPosture === "low_confidence"
              ? {
                  detail:
                    topologyGap?.detail ??
                    "The current lane is on the final published-family fallback. Tighten the topology or land an exact family before trusting this as a final claim.",
                  tone: "warning",
                  value: topologyGap?.value ?? "Narrow the topology"
                }
          : warningCount > 0
            ? {
                detail: `${warningLabel} are active. Review them before trusting the result as a field-ready read.`,
                tone: "warning",
                value: "Review warnings"
              }
              : primaryReadyCard
                ? {
                    detail: "The current route is live; compare the main read and companion metrics below.",
                    tone: "ready",
                    value: "Read the outputs"
                  }
                : {
                    detail: "The stack is ready, but this route still needs more context before the lead metric can go live.",
                    tone: "neutral",
                    value: "Add route inputs"
                  };

  return {
    nextAction,
    primaryRead,
    stackStatus
  };
}
