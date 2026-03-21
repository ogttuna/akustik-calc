import { describe, expect, it } from "vitest";

import type { AssemblyCalculation } from "@dynecho/shared";

import { evaluateScenario } from "./scenario-analysis";
import {
  getFieldAirborneProvenanceSummary,
  getFieldAirborneReportLines
} from "./field-airborne-provenance";

const FIELD_WALL_ROWS = [
  { id: "wall-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "wall-2", materialId: "air_gap", thicknessMm: "75" },
  { id: "wall-3", materialId: "rockwool", thicknessMm: "75" },
  { id: "wall-4", materialId: "gypsum_board", thicknessMm: "12.5" }
] as const;

describe("field airborne provenance", () => {
  it("describes standardized apparent field derivations when DnT outputs are live", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 2800,
        panelWidthMm: 3000,
        receivingRoomVolumeM3: 42
      },
      id: "field-provenance-standardized",
      name: "Field provenance standardized",
      rows: FIELD_WALL_ROWS,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
    });

    const summary = getFieldAirborneProvenanceSummary(scenario.result);
    const reportLines = getFieldAirborneReportLines(scenario.result);

    expect(summary?.label).toBe("Room-standardized apparent derivation");
    expect(summary?.detail).toContain("receiving-room volume");
    expect(reportLines).toContain("- Airborne field route: Room-to-room field");
    expect(reportLines).toContain("- DnT,w provenance: room-standardized apparent derivation via 10log10(0.32V/S)");
    expect(reportLines).toContain("- Dn,w provenance: area-normalized apparent derivation via 10log10(A0/S)");
  });

  it("keeps official DnT,A,k companions explicit as source companions", () => {
    const result = {
      airborneOverlay: {
        contextMode: "field_between_rooms"
      },
      ratings: {
        field: {
          DnTAk: 58,
          basis: "screening_mass_law_curve_seed_v3+official_approximate_field_companion"
        },
        iso717: {
          C: 0,
          Ctr: 0,
          Rw: 54,
          composite: "R'w 54 dB",
          descriptor: "R'w"
        }
      }
    } as AssemblyCalculation;

    const summary = getFieldAirborneProvenanceSummary(result);
    const reportLines = getFieldAirborneReportLines(result);

    expect(summary?.label).toBe("Source companion");
    expect(summary?.detail).toMatch(/official approximate source companion/i);
    expect(reportLines).toContain("- DnT,A,k provenance: official approximate project-dependent source companion");
  });
});
