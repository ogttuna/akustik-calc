import { describe, expect, it } from "vitest";

import type { AssemblyCalculation } from "@dynecho/shared";

import {
  getDutchResidentialDnTAkComplianceReportLines,
  getDutchResidentialDnTAkComplianceRows,
  getDutchResidentialDnTAkComplianceSummary
} from "./dutch-airborne-compliance";

function withDnTAk(dntak: number, basis: string): AssemblyCalculation {
  return {
    ratings: {
      iso717: { Rw: 0, C: 0, Ctr: 0, composite: "Rw 0 dB (C; Ctr) = 0; 0 dB", descriptor: "Rw" },
      astmE413: { STC: 0 },
      field: {
        DnTAk: dntak,
        basis
      }
    }
  } as AssemblyCalculation;
}

describe("Dutch airborne compliance", () => {
  it("evaluates exact DnT,A,k source anchors against Dutch residential references", () => {
    const rows = getDutchResidentialDnTAkComplianceRows(
      withDnTAk(53, "screening_mass_law_curve_seed_v3+exact_verified_field_proxy_anchor")
    );

    expect(rows).toHaveLength(4);
    expect(rows[0]).toMatchObject({
      id: "nl_bbl_residential",
      sourceLabel: "IPLO BBL airborne minimum",
      statusLabel: "Pass +1.0 dB",
      tone: "success"
    });
    expect(rows[0]?.detail).toMatch(/source-anchored through the local field proxy lane/i);
    expect(rows[1]).toMatchObject({
      id: "nl_bbl_residential_ancillary",
      sourceLabel: "IPLO BBL airborne ancillary-room minimum",
      statusLabel: "Pass +6.0 dB",
      tone: "success"
    });
    expect(rows[2]).toMatchObject({
      id: "nl_bbl_same_dwelling",
      sourceLabel: "IPLO BBL same-dwelling minimum",
      statusLabel: "Pass +21.0 dB",
      tone: "success"
    });
    expect(rows[3]).toMatchObject({
      id: "nl_comfortklasse_residential",
      sourceLabel: "Wienerberger comfort reference",
      statusLabel: "Gap 4.0 dB",
      tone: "warning"
    });
    expect(getDutchResidentialDnTAkComplianceReportLines(withDnTAk(53, "screening_mass_law_curve_seed_v3+exact_verified_field_proxy_anchor"))[0]).toMatch(
      /Dutch BBL minimum .* passes by 1.0 dB/i
    );
  });

  it("keeps approximate companions on an indicative compliance lane", () => {
    const rows = getDutchResidentialDnTAkComplianceRows(
      withDnTAk(58, "screening_mass_law_curve_seed_v3+official_approximate_field_companion")
    );

    expect(rows[0]).toMatchObject({
      id: "nl_bbl_residential",
      statusLabel: "Indicative +6.0 dB",
      tone: "accent"
    });
    expect(rows[1]).toMatchObject({
      id: "nl_bbl_residential_ancillary",
      statusLabel: "Indicative +11.0 dB",
      tone: "accent"
    });
    expect(rows[2]).toMatchObject({
      id: "nl_bbl_same_dwelling",
      statusLabel: "Indicative +26.0 dB",
      tone: "accent"
    });
    expect(rows[3]).toMatchObject({
      id: "nl_comfortklasse_residential",
      statusLabel: "Indicative +1.0 dB",
      tone: "accent"
    });
    expect(rows[0]?.detail).toMatch(/project-dependent official companion/i);
    expect(getDutchResidentialDnTAkComplianceReportLines(withDnTAk(58, "screening_mass_law_curve_seed_v3+official_approximate_field_companion"))[3]).toMatch(
      /indicative passes by 1.0 dB/i
    );
  });

  it("builds a compact compare summary without promoting companions to exact checks", () => {
    expect(
      getDutchResidentialDnTAkComplianceSummary(
        withDnTAk(53, "screening_mass_law_curve_seed_v3+exact_verified_field_proxy_anchor")
      )
    ).toMatchObject({
      detail: "BBL +1.0 dB · Comfort -4.0 dB",
      statusLabel: "BBL pass",
      tone: "success"
    });

    expect(
      getDutchResidentialDnTAkComplianceSummary(
        withDnTAk(58, "screening_mass_law_curve_seed_v3+official_approximate_field_companion")
      )
    ).toMatchObject({
      detail: "BBL indicative +6.0 dB · Comfort indicative +1.0 dB",
      statusLabel: "Indicative",
      tone: "accent"
    });
  });

  it("returns no compliance rows when DnT,A,k is unavailable", () => {
    expect(getDutchResidentialDnTAkComplianceRows(null)).toEqual([]);
    expect(getDutchResidentialDnTAkComplianceReportLines(null)).toEqual([]);
    expect(getDutchResidentialDnTAkComplianceSummary(null)).toBeNull();
  });
});
