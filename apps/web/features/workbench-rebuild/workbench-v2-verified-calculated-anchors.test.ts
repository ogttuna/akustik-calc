import { describe, expect, it } from "vitest";

import {
  formatWorkbenchV2VerifiedCalculatedAnchorContext,
  formatWorkbenchV2VerifiedCalculatedAnchorMetrics,
  formatWorkbenchV2VerifiedCalculatedAnchorValues,
  getApplicableWorkbenchV2VerifiedCalculatedAnchors,
  parseWorkbenchV2VerifiedCalculatedAnchorSummaries,
  parseWorkbenchV2VerifiedCalculatedAnchorSummary
} from "./workbench-v2-verified-calculated-anchors";

const SUMMARY = {
  createdAtIso: "2026-06-22T09:00:00.000Z",
  createdFromProjectId: "project-42",
  description: "Saved current result",
  fingerprint: "dynecho:user-verified-calculated-anchor:v1:0123456789abcdef",
  id: "anchor-1",
  mode: "wall",
  name: "Verified wall result",
  revision: 1,
  scope: "project_evidence",
  status: "active",
  updatedAtIso: "2026-06-22T09:00:00.000Z",
  valueMetrics: ["Rw", "STC", "DnT,w"],
  valueSummaries: [
    {
      metric: "Rw",
      metricBasis: "airborne_lab",
      valueDb: 52
    },
    {
      metric: "STC",
      metricBasis: "airborne_lab",
      valueDb: 51
    },
    {
      metric: "DnT,w",
      metricBasis: "airborne_building_prediction",
      valueDb: 48.6
    }
  ]
};

describe("workbench verified calculated anchor summaries", () => {
  it("parses valid summary payloads", () => {
    const parsed = parseWorkbenchV2VerifiedCalculatedAnchorSummary(SUMMARY);

    expect(parsed).toMatchObject({
      id: "anchor-1",
      mode: "wall",
      scope: "project_evidence",
      status: "active",
      valueMetrics: ["Rw", "STC", "DnT,w"]
    });
    expect(parsed && formatWorkbenchV2VerifiedCalculatedAnchorMetrics(parsed)).toBe("Rw, STC, DnT,w");
    expect(parsed && formatWorkbenchV2VerifiedCalculatedAnchorValues(parsed)).toBe("Rw 52 dB, STC 51 dB, DnT,w 48.6 dB");
    expect(parsed && formatWorkbenchV2VerifiedCalculatedAnchorContext(parsed)).toBe("Wall / Project / exact match only");
  });

  it("drops invalid rows from API list payloads", () => {
    expect(
      parseWorkbenchV2VerifiedCalculatedAnchorSummaries({
        anchors: [
          SUMMARY,
          {
            ...SUMMARY,
            id: "invalid-metric",
            valueMetrics: ["not-a-real-output"]
          },
          {
            ...SUMMARY,
            id: "invalid-status",
            status: "measured"
          },
          {
            ...SUMMARY,
            id: "invalid-value-summary",
            valueSummaries: [
              {
                metric: "Rw",
                metricBasis: "airborne_lab",
                valueDb: "52"
              }
            ]
          }
        ]
      })
    ).toEqual([expect.objectContaining({ id: "anchor-1" })]);
  });

  it("filters applicable references to active exact-fingerprint matches", () => {
    const anchors = parseWorkbenchV2VerifiedCalculatedAnchorSummaries({
      anchors: [
        SUMMARY,
        {
          ...SUMMARY,
          fingerprint: "dynecho:user-verified-calculated-anchor:v1:fedcba9876543210",
          id: "other-stack"
        },
        {
          ...SUMMARY,
          id: "retired-match",
          status: "retired"
        }
      ]
    });

    expect(getApplicableWorkbenchV2VerifiedCalculatedAnchors(anchors, SUMMARY.fingerprint)).toEqual([
      expect.objectContaining({ id: "anchor-1" })
    ]);
    expect(getApplicableWorkbenchV2VerifiedCalculatedAnchors(anchors, null)).toEqual([]);
  });
});
