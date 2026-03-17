"use client";

import type {
  AirborneContextMode,
  AirborneOverlay,
  AirtightnessClass,
  ElectricalBoxState,
  JunctionQuality,
  PerimeterSealClass,
  PenetrationState,
  SharedTrackClass
} from "@dynecho/shared";

import type { StudyMode } from "./preset-definitions";
import type { WorkbenchFieldStatus } from "./workbench-field-status";

type GuideId =
  | "airtightness"
  | "contextMode"
  | "electricalBoxes"
  | "junctionQuality"
  | "penetrationState"
  | "perimeterSeal"
  | "sharedTrack";

function ignored(message: string, meaning: string): WorkbenchFieldStatus {
  return {
    currentUse: message,
    kind: "ignored",
    meaning
  };
}

export function buildAirborneFieldGuides(input: {
  airtightness: AirtightnessClass;
  contextMode: AirborneContextMode;
  electricalBoxes: ElectricalBoxState;
  junctionQuality: JunctionQuality;
  overlay: AirborneOverlay | null;
  penetrationState: PenetrationState;
  perimeterSeal: PerimeterSealClass;
  sharedTrack: SharedTrackClass;
  studyMode: StudyMode;
}): Record<GuideId, WorkbenchFieldStatus> {
  if (input.studyMode !== "wall") {
    return {
      airtightness: ignored("Floor studies do not use the airborne overlay lane.", "This field only affects the wall-side airborne context lane."),
      contextMode: ignored("Floor studies are currently driven by the impact field path instead.", "Airborne context mode is only relevant for the wall-side Rw screening lane."),
      electricalBoxes: ignored("Floor studies do not use wall electrical-box leakage assumptions.", "Electrical-box detailing is only modeled on the wall airborne lane."),
      junctionQuality: ignored("Floor studies already use the dedicated impact flanking editor instead.", "Junction quality here belongs to airborne wall-side field drift."),
      penetrationState: ignored("Floor studies do not use this wall-side penetration overlay.", "Service-penetration leakage is only modeled on the wall airborne lane."),
      perimeterSeal: ignored("Floor studies do not use this wall-side perimeter seal overlay.", "Perimeter seal here belongs to the airborne wall lane."),
      sharedTrack: ignored("Floor studies do not route through a shared-stud / shared-track airborne model.", "Shared-track assumptions are only relevant for cavity-wall airborne field drift.")
    };
  }

  const fieldMode = input.contextMode !== "element_lab";

  return {
    airtightness:
      input.overlay?.leakagePenaltyApplied && input.airtightness !== "good" && input.airtightness !== "unknown"
        ? {
            currentUse: "Leakage overlay is active and airtightness is directly reducing the airborne curve right now.",
            kind: "active",
            meaning: "Airtightness controls the broad leakage penalty applied on top of the screening TL curve."
          }
        : input.airtightness === "good"
          ? {
              currentUse: "Airtightness is explicitly held at a clean lab-side assumption, so no extra leakage penalty is being added from this field.",
              kind: "anchored",
              meaning: "Good airtightness keeps the leakage lane explicit without fabricating an optimistic boost."
            }
          : {
              currentUse: "No extra airtightness penalty is active until you move this away from the current clean assumption.",
              kind: "conditional",
              meaning: "Airtightness becomes important when you want the wall lane to reflect workmanship-driven leakage."
            },
    contextMode:
      fieldMode
        ? {
            currentUse: "Field-side overlay is active. The airborne lane is now being treated as a room-to-room or building prediction path instead of a pure lab element.",
            kind: "active",
            meaning: "Context mode switches the wall lane between lab-side element screening and field-side conservative flanking behavior."
          }
        : {
            currentUse: "The wall lane is currently staying on the lab-side element path. No field-flanking penalty is applied from this selector.",
            kind: "anchored",
            meaning: "Use field or building mode only when you want conservative room-to-room airborne drift."
          },
    electricalBoxes:
      input.overlay?.leakagePenaltyApplied && input.electricalBoxes !== "none" && input.electricalBoxes !== "unknown"
        ? {
            currentUse: "Electrical-box leakage is part of the active airborne leakage penalty on this wall result.",
            kind: "active",
            meaning: "Back-to-back or repeated boxes create local weak points that lower apparent airborne performance."
          }
        : {
            currentUse: "No electrical-box penalty is active right now.",
            kind: "conditional",
            meaning: "This field matters only when box placement is known and you want the leakage lane to reflect it."
          },
    junctionQuality:
      fieldMode && input.junctionQuality !== "good" && input.junctionQuality !== "unknown"
        ? {
            currentUse: "Junction quality is active in the field-flanking path graph right now.",
            kind: "active",
            meaning: "Poorer edge workmanship raises indirect transmission risk on the room-to-room airborne lane."
          }
        : fieldMode
          ? {
              currentUse: "The field path is active, but junction quality is currently held at a clean assumption.",
              kind: "anchored",
              meaning: "This field only affects the field-side airborne graph, not the pure lab-side curve."
            }
          : {
              currentUse: "Junction quality is parked because the wall lane is still in element-lab mode.",
              kind: "ignored",
              meaning: "Switch to field or building mode before this assumption becomes relevant."
            },
    penetrationState:
      input.overlay?.leakagePenaltyApplied && input.penetrationState !== "none" && input.penetrationState !== "unknown"
        ? {
            currentUse: "Service-penetration leakage is active and is lowering the current airborne result.",
            kind: "active",
            meaning: "Minor or major penetrations add a leakage penalty and also contribute to field-side bypass risk."
          }
        : {
            currentUse: "No service-penetration penalty is active right now.",
            kind: "conditional",
            meaning: "This field matters when penetrations are unresolved and you want the airborne lane to stay conservative."
          },
    perimeterSeal:
      input.overlay?.leakagePenaltyApplied && input.perimeterSeal !== "good" && input.perimeterSeal !== "unknown"
        ? {
            currentUse: "Perimeter seal is active in the leakage overlay and is lowering the airborne curve right now.",
            kind: "active",
            meaning: "Perimeter detailing affects both direct leakage and indirect field-side drift on wall assemblies."
          }
        : input.perimeterSeal === "good"
          ? {
              currentUse: "Perimeter seal is explicitly kept at a clean assumption, so this field is anchored but not penalizing the current result.",
              kind: "anchored",
              meaning: "Good perimeter detailing avoids an added leakage penalty without inventing a performance bonus."
            }
          : {
              currentUse: "Perimeter detailing is available but not currently pushing the airborne lane down.",
              kind: "conditional",
              meaning: "Use it when you want the wall result to reflect perimeter execution quality."
            },
    sharedTrack:
      fieldMode && input.sharedTrack === "shared"
        ? {
            currentUse: "Shared-track coupling is active in the field-flanking graph right now.",
            kind: "active",
            meaning: "A common stud or track line reopens a structural path between both wall leaves in the field."
          }
        : fieldMode && input.sharedTrack === "independent"
          ? {
              currentUse: "Independent support is explicitly reducing the conservative field-path penalty on cavity-wall surrogates.",
              kind: "anchored",
              meaning: "Independent framing is a stabilizing assumption, but it only matters once the airborne lane leaves lab mode."
            }
          : fieldMode
            ? {
                currentUse: "Support separation is still unresolved, so the field graph is holding a cautious assumption.",
                kind: "conditional",
                meaning: "Resolve this when you need a clearer airborne field-side trace on stud-based walls."
              }
            : {
                currentUse: "Shared-track assumptions are parked because the wall lane is still in element-lab mode.",
                kind: "ignored",
                meaning: "This selector only matters for the field-side airborne graph."
              }
  };
}
