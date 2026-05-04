import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];

const ROLE_ORDER = [
  "ceiling_board",
  "ceiling_fill",
  "ceiling_cavity",
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "base_structure"
] as const satisfies readonly FloorRole[];

function exactSystem(id: string): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function criteriaForRole(system: ExactFloorSystem, role: FloorRole): FloorSystemRoleCriteria | undefined {
  switch (role) {
    case "base_structure":
      return system.match.baseStructure;
    case "ceiling_board":
      return system.match.ceilingBoard;
    case "ceiling_cavity":
      return system.match.ceilingCavity;
    case "ceiling_fill":
      return system.match.ceilingFill;
    case "floating_screed":
      return system.match.floatingScreed;
    case "floor_covering":
      return system.match.floorCovering;
    case "resilient_layer":
      return system.match.resilientLayer;
    case "upper_fill":
      return system.match.upperFill;
    default:
      return undefined;
  }
}

function criteriaToRows(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria | undefined,
  mode: "raw" | "tagged"
): readonly Omit<LayerDraft, "id">[] {
  if (!criteria) {
    return [];
  }

  if (criteria.materialScheduleIds || criteria.thicknessScheduleMm) {
    const materialSchedule = criteria.materialScheduleIds ?? criteria.materialIds ?? [];
    const thicknessSchedule = criteria.thicknessScheduleMm ?? [];

    return thicknessSchedule.map((thicknessMm, index) => ({
      ...(mode === "tagged" ? { floorRole: role } : {}),
      materialId: materialSchedule[index] ?? materialSchedule[0] ?? criteria.materialIds?.[0] ?? "generic_fill",
      thicknessMm: String(thicknessMm)
    }));
  }

  const materialId = criteria.materialIds?.[0] ?? "generic_fill";
  const thicknessMm = String(criteria.thicknessMm ?? 1);

  return Array.from({ length: criteria.layerCount ?? 1 }).map(() => ({
    ...(mode === "tagged" ? { floorRole: role } : {}),
    materialId,
    thicknessMm
  }));
}

function rowsFromExactSystem(id: string, mode: "raw" | "tagged"): LayerDraft[] {
  const system = exactSystem(id);
  return ROLE_ORDER.flatMap((role) => criteriaToRows(role, criteriaForRole(system, role), mode)).map((row, index) => ({
    ...row,
    id: `${id}-${mode}-${index + 1}`
  }));
}

function scenarioFor(id: string, mode: "raw" | "tagged") {
  return evaluateScenario({
    id: `${id}-${mode}`,
    name: `${id}-${mode}`,
    rows: rowsFromExactSystem(id, mode),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

describe("floor raw role prompt guard route/output card visibility", () => {
  it("shows a floor-role prompt warning for raw tagged-drift stacks", () => {
    const scenario = scenarioFor("tuas_x4_clt140_measured_2026", "raw");
    const lnwCard = buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.warnings.some((warning) => /Floor roles needed before impact output promotion/i.test(warning))).toBe(true);
    expect(scenario.warnings.some((warning) => /defended exact impact row/i.test(warning))).toBe(true);
    expect(lnwCard).toEqual(
      expect.objectContaining({
        detail: "Assign floor roles before treating this impact output as supported.",
        status: "unsupported",
        value: "Not ready"
      })
    );
  });

  it("does not promote Ln,w or Ln,w+CI output cards when raw roles cannot be safely inferred", () => {
    const scenario = scenarioFor("dataholz_gdsnxn01a_timber_frame_lab_2026", "raw");
    const lnwCard = buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" });
    const lnwCiCard = buildOutputCard({ output: "Ln,w+CI", result: scenario.result, studyMode: "floor" });

    expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw"]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(scenario.warnings.some((warning) => /could not safely infer the base, ceiling, and upper-floor roles/i.test(warning))).toBe(true);
    expect(lnwCard.status).toBe("unsupported");
    expect(lnwCiCard.status).toBe("unsupported");
    expect(lnwCard.value).toBe("Not ready");
    expect(lnwCiCard.value).toBe("Not ready");
  });

  it("keeps raw parity-green exact rows live without claiming arbitrary raw reorder invariance", () => {
    const scenario = scenarioFor("tuas_r5b_open_box_timber_measured_2026", "raw");
    const lnwCard = buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" });

    expect(scenario.result?.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(lnwCard.status).toBe("live");
    expect(scenario.warnings.some((warning) => /does not claim arbitrary raw floor reorder value invariance/i.test(warning))).toBe(true);
    expect(scenario.warnings.some((warning) => /guarantees arbitrary raw floor reorder/i.test(warning))).toBe(false);
  });

  it("keeps duplicate-role warnings visible before any exact copy", () => {
    const scenario = scenarioFor("tuas_r7b_open_box_timber_measured_2026", "raw");

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(scenario.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(scenario.warnings.some((warning) => /single-entry floor roles are duplicated/i.test(warning))).toBe(true);
    expect(scenario.warnings.some((warning) => /Floor roles needed before exact floor-family promotion/i.test(warning))).toBe(true);
  });
});
