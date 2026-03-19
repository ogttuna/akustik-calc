import { describe, expect, it } from "vitest";

import type { AssemblyCalculation } from "@dynecho/shared";

import {
  getDnTAkDetail,
  getDnTAkLiveLabel,
  getDnTAkReportLine,
  getDnTAkSourceMode
} from "./dntak-source-mode";

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

describe("DnT,A,k source mode", () => {
  it("recognizes exact verified field proxy anchors", () => {
    const result = withDnTAk(43, "screening_mass_law_curve_seed_v3+exact_verified_field_proxy_anchor");

    expect(getDnTAkSourceMode(result)).toBe("exact_field_proxy_anchor");
    expect(getDnTAkLiveLabel(result)).toBe("Exact source");
    expect(getDnTAkDetail(result)).toMatch(/anchored through the local DnT,A proxy lane/i);
    expect(getDnTAkReportLine(result)).toMatch(/DnT,A,k source anchor/i);
  });

  it("recognizes approximate official companions", () => {
    const result = withDnTAk(35, "screening_mass_law_curve_seed_v3+official_approximate_field_companion");

    expect(getDnTAkSourceMode(result)).toBe("approximate_companion");
    expect(getDnTAkLiveLabel(result)).toBe("Source companion");
    expect(getDnTAkDetail(result)).toMatch(/approximate field companion/i);
    expect(getDnTAkReportLine(result)).toMatch(/official approximate project-dependent companion/i);
  });

  it("returns null or generic labels when no tagged source mode is present", () => {
    const result = withDnTAk(31, "screening_mass_law_curve_seed_v3");

    expect(getDnTAkSourceMode(result)).toBe("unspecified");
    expect(getDnTAkLiveLabel(result)).toBe("Live");
    expect(getDnTAkDetail(result)).toMatch(/single-number value/i);
    expect(getDnTAkReportLine(result)).toBe("- DnT,A,k: 31.0 dB");
    expect(getDnTAkSourceMode(null)).toBeNull();
  });
});
