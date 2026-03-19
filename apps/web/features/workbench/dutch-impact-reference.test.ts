import { describe, expect, it } from "vitest";

import type { AssemblyCalculation } from "@dynecho/shared";

import {
  getDutchResidentialImpactReferenceReportLines,
  getDutchResidentialImpactReferenceRows
} from "./dutch-impact-reference";

describe("Dutch impact references", () => {
  it("turns Dutch contact-sound references into direct pass/gap checks when exact LnT,A exists", () => {
    const rows = getDutchResidentialImpactReferenceRows({
      impact: {
        LnTA: 53.8
      }
    } as AssemblyCalculation);

    expect(rows).toHaveLength(4);
    expect(rows[0]).toMatchObject({
      id: "nl_bbl_impact_residential",
      statusLabel: "Pass +0.2 dB",
      tone: "success",
      valueDb: 53.8
    });
    expect(rows[3]).toMatchObject({
      id: "nl_comfortklasse_impact_residential",
      statusLabel: "Gap 4.8 dB",
      tone: "warning"
    });
    expect(rows[0]?.detail).toMatch(/direct reference check/i);
  });

  it("keeps Dutch contact-sound references staged when only L'nT,w is available", () => {
    const rows = getDutchResidentialImpactReferenceRows({
      impact: {
        LPrimeNTw: 50
      }
    } as AssemblyCalculation);

    expect(rows).toHaveLength(4);
    expect(rows[0]).toMatchObject({
      id: "nl_bbl_impact_residential",
      statusLabel: "Need LnT,A",
      tone: "neutral"
    });
    expect(rows[0]?.detail).toMatch(/L'nT,w 50.0 dB/i);
    expect(rows[3]).toMatchObject({
      id: "nl_comfortklasse_impact_residential",
      thresholdDb: 49
    });
  });

  it("keeps upper-bound wording fail-closed when only conservative support exists", () => {
    const lines = getDutchResidentialImpactReferenceReportLines({
      lowerBoundImpact: {
        LPrimeNTwUpperBound: 54
      }
    } as AssemblyCalculation);

    expect(lines[0]).toMatch(/L'nT,w upper bound <= 54.0 dB/i);
    expect(lines[0]).toMatch(/pending/i);
    expect(lines[0]).toMatch(/LnT,A <= 54 dB/i);
  });

  it("returns no Dutch impact rows without a live scenario result", () => {
    expect(getDutchResidentialImpactReferenceRows(null)).toEqual([]);
    expect(getDutchResidentialImpactReferenceReportLines(null)).toEqual([]);
  });
});
