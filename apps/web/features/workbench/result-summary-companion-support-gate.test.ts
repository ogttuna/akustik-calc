import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ResultSummary } from "./result-summary";

const ALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

function buildAirborneResult(input: {
  metrics?: Partial<AssemblyCalculation["metrics"]>;
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputs?: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
}): AssemblyCalculation {
  return {
    calculatorId: "dynamic",
    calculatorLabel: "Dynamic",
    floorSystemRecommendations: [],
    layers: [],
    metrics: {
      airGapCount: 1,
      estimatedCDb: -1,
      estimatedCtrDb: -6,
      estimatedRwDb: 55,
      estimatedStc: 54,
      insulationCount: 1,
      method: "result_summary_support_gate_fixture",
      surfaceMassKgM2: 42,
      totalThicknessMm: 100,
      ...input.metrics
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 55 (-1;-6)",
        descriptor: "Rw"
      }
    },
    supportedTargetOutputs: [...input.supportedTargetOutputs],
    targetOutputs: [...(input.targetOutputs ?? ALL_LAB_OUTPUTS)],
    unsupportedTargetOutputs: [...input.unsupportedTargetOutputs],
    warnings: []
  } as AssemblyCalculation;
}

function renderResultSummary(result: AssemblyCalculation): string {
  vi.stubGlobal("React", React);

  return renderToStaticMarkup(
    React.createElement(ResultSummary, {
      result,
      targetLnwDb: null,
      targetRwDb: null,
      warnings: []
    })
  );
}

describe("result summary companion support gate", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not render unsupported STC/C/Ctr cards just because finite companion metrics exist", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: ["STC", "C", "Ctr"]
      })
    );

    expect(html).toContain("Rw estimate");
    expect(html).toContain("55 dB");
    expect(html).not.toContain(">STC<");
    expect(html).not.toContain("ASTM E413");
    expect(html).not.toContain("Spectrum adaptation");
    expect(html).not.toContain("-1 dB / -6 dB");
  });

  it("renders only the supported spectrum adaptation term when one companion is live", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        supportedTargetOutputs: ["Rw", "C"],
        unsupportedTargetOutputs: ["STC", "Ctr"]
      })
    );

    expect(html).toContain("Spectrum adaptation");
    expect(html).toContain("-1 dB");
    expect(html).toContain("C for the supported airborne lane");
    expect(html).not.toContain(">STC<");
    expect(html).not.toContain("-6 dB");
    expect(html).not.toContain("C / Ctr for pink-noise");
  });

  it("renders only Ctr when only the traffic-noise adaptation term is live", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        supportedTargetOutputs: ["Rw", "Ctr"],
        unsupportedTargetOutputs: ["STC", "C"]
      })
    );

    expect(html).toContain("Spectrum adaptation");
    expect(html).toContain("-6 dB");
    expect(html).toContain("Ctr for the supported airborne lane");
    expect(html).not.toContain(">STC<");
    expect(html).not.toContain("-1 dB");
    expect(html).not.toContain("C / Ctr for pink-noise");
  });

  it("renders STC-only companion answers without leaking unsupported Rw or ISO composite cards", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        supportedTargetOutputs: ["STC"],
        unsupportedTargetOutputs: ["Rw", "C", "Ctr"]
      })
    );

    expect(html).toContain(">STC<");
    expect(html).toContain("54 dB");
    expect(html).not.toContain("Rw estimate");
    expect(html).not.toContain("ISO 717 composite");
    expect(html).not.toContain("55 dB");
    expect(html).not.toContain("Spectrum adaptation");
  });

  it("renders C/Ctr-only companion answers without leaking unsupported primary or ISO cards", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        supportedTargetOutputs: ["C", "Ctr"],
        unsupportedTargetOutputs: ["Rw", "STC"]
      })
    );

    expect(html).toContain("Spectrum adaptation");
    expect(html).toContain("-1 dB / -6 dB");
    expect(html).not.toContain("Rw estimate");
    expect(html).not.toContain("ISO 717 composite");
    expect(html).not.toContain("55 dB");
    expect(html).not.toContain(">STC<");
  });

  it("does not render unsupported field/building cards from finite helper metrics", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        metrics: {
          estimatedDnADb: 49,
          estimatedDnTADb: 50,
          estimatedDnTwDb: 51,
          estimatedDnWDb: 48,
          estimatedRwPrimeDb: 52
        },
        supportedTargetOutputs: ["Rw"],
        targetOutputs: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
        unsupportedTargetOutputs: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
      })
    );

    expect(html).toContain("Rw estimate");
    expect(html).toContain("55 dB");
    expect(html).not.toContain("R&#x27;w");
    expect(html).not.toContain("Dn,w");
    expect(html).not.toContain("Dn,A");
    expect(html).not.toContain("DnT,w");
    expect(html).not.toContain("DnT,A");
    expect(html).not.toContain("52 dB");
    expect(html).not.toContain("51 dB");
    expect(html).not.toContain("50 dB");
    expect(html).not.toContain("49 dB");
    expect(html).not.toContain("48 dB");
  });

  it("renders supported A-weighted field/building metrics without leaking finite base metrics", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        metrics: {
          estimatedDnADb: 49,
          estimatedDnTADb: 50,
          estimatedDnTwDb: 51,
          estimatedRwDb: 55
        },
        supportedTargetOutputs: ["Dn,A", "DnT,A"],
        targetOutputs: ["Dn,A", "DnT,A", "Rw", "DnT,w"],
        unsupportedTargetOutputs: ["Rw", "DnT,w"]
      })
    );

    expect(html).toContain("Dn,A");
    expect(html).toContain("49 dB");
    expect(html).toContain("DnT,A");
    expect(html).toContain("50 dB");
    expect(html).not.toContain("Rw estimate");
    expect(html).not.toContain("ISO 717 composite");
    expect(html).not.toContain("55 dB");
    expect(html).not.toContain("DnT,w estimate");
    expect(html).not.toContain("51 dB");
  });

  it("renders the full companion card set when STC, C, and Ctr are all supported", () => {
    const html = renderResultSummary(
      buildAirborneResult({
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
        unsupportedTargetOutputs: []
      })
    );

    expect(html).toContain(">STC<");
    expect(html).toContain("54 dB");
    expect(html).toContain("Spectrum adaptation");
    expect(html).toContain("-1 dB / -6 dB");
    expect(html).toContain("C / Ctr for pink-noise and traffic-noise use cases");
  });
});
