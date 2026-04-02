import type { AssemblyCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildSimpleWorkbenchOutputPosture, getFallbackSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

describe("simple workbench output posture", () => {
  it("labels floor Rw as a companion airborne value instead of a primary live route", () => {
    const companionRw = buildSimpleWorkbenchOutputPosture({
      output: "Rw",
      result: {
        floorSystemRatings: {
          Rw: 63,
          RwCtr: 56,
          RwCtrSemantic: "rw_plus_ctr",
          basis: "official_floor_system_bound_support"
        }
      } as AssemblyCalculation,
      status: "live",
      studyMode: "floor"
    });

    expect(companionRw).toMatchObject({ label: "Companion airborne", tone: "neutral" });
    expect(companionRw.detail).toMatch(/active floor lane/i);
    expect(companionRw.detail).toMatch(/differ from the live airborne estimate/i);
  });

  it("distinguishes exact, estimated, and low-confidence floor lanes", () => {
    const exact = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w",
      result: {
        dynamicImpactTrace: {
          evidenceTier: "exact",
          selectionKindLabel: "Exact floor system"
        }
      } as AssemblyCalculation,
      status: "live",
      studyMode: "floor"
    });
    const estimate = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w",
      result: {
        dynamicImpactTrace: {
          evidenceTier: "estimate",
          selectionKindLabel: "Published family estimate"
        }
      } as AssemblyCalculation,
      status: "live",
      studyMode: "floor"
    });
    const lowConfidence = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w",
      result: {
        dynamicImpactTrace: {
          estimateTier: "low_confidence",
          estimateTierLabel: "Low-confidence family fallback",
          evidenceTier: "estimate",
          selectionKindLabel: "Published family fallback"
        }
      } as AssemblyCalculation,
      status: "live",
      studyMode: "floor"
    });

    expect(exact).toMatchObject({ label: "Exact source row", tone: "success" });
    expect(estimate).toMatchObject({ label: "Benchmark-backed estimate", tone: "accent" });
    expect(lowConfidence).toMatchObject({ label: "Low-confidence fallback", tone: "warning" });
  });

  it("keeps field and companion metrics separate from the core route evidence class", () => {
    const fieldContinuation = buildSimpleWorkbenchOutputPosture({
      output: "DnT,w",
      result: null,
      status: "live",
      studyMode: "floor"
    });
    const companion = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w+CI",
      result: null,
      status: "live",
      studyMode: "floor"
    });

    expect(fieldContinuation).toMatchObject({ label: "Field continuation", tone: "accent" });
    expect(companion).toMatchObject({ label: "Companion carry-over", tone: "neutral" });
  });

  it("falls back to explicit pending and unsupported posture language when no live route exists", () => {
    expect(getFallbackSimpleWorkbenchOutputPosture("needs_input")).toMatchObject({
      label: "Awaiting route input",
      tone: "warning"
    });
    expect(buildSimpleWorkbenchOutputPosture({
      output: "LnT,A",
      result: null,
      status: "unsupported",
      studyMode: "floor"
    })).toMatchObject({
      label: "Unsupported on route",
      tone: "neutral"
    });
  });

  it("keeps bound posture explicit as one-sided support even when other live companions remain visible", () => {
    const bound = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w",
      result: {
        boundFloorSystemMatch: {
          system: {
            id: "ubiq_fl33_open_web_steel_300_lab_2026"
          }
        }
      } as AssemblyCalculation,
      status: "bound",
      studyMode: "floor"
    });

    expect(bound).toMatchObject({ label: "Conservative bound", tone: "warning" });
    expect(bound.detail).toMatch(/one-sided support value/i);
    expect(bound.detail).toMatch(/other live cards can still stay visible/i);
  });
});
