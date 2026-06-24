import { describe, expect, it } from "vitest";

import { resolveWorkbenchRequiredInputPresentation } from "./route-input-presentation";

describe("route input presentation", () => {
  it("maps floor impact layer requirements to friendly copy without losing trace codes", () => {
    const presentation = resolveWorkbenchRequiredInputPresentation("toppingOrFloatingLayer");

    expect(presentation.label).toBe("Upper topping / floating layer");
    expect(presentation.detail).toContain("topping / floating layer");
    expect(presentation.targetIntent).toBe("layer_stack");
    expect(presentation.traceCode).toBe("toppingOrFloatingLayer");
  });

  it("maps grouped impact field context to visible impact controls", () => {
    const presentation = resolveWorkbenchRequiredInputPresentation("impactFieldContext");

    expect(presentation.label).toBe("Impact field context");
    expect(presentation.targetFields).toEqual(["fieldKDb", "impactReceivingRoomVolumeM3", "ciDb", "ci50_2500Db"]);
  });

  it("maps nested impact receiving-room context to the impact room control", () => {
    const presentation = resolveWorkbenchRequiredInputPresentation(
      "impactFieldContext.guideHdDb_or_receivingRoomVolumeM3"
    );

    expect(presentation.label).toBe("Impact room volume");
    expect(presentation.targetFields).toEqual(["impactReceivingRoomVolumeM3"]);
  });

  it("maps area-family result paths to both panel dimensions", () => {
    const presentation = resolveWorkbenchRequiredInputPresentation("ratings.field.partitionAreaM2");

    expect(presentation.label).toBe("Panel area");
    expect(presentation.targetFields).toEqual(["panelWidthMm", "panelHeightMm"]);
  });

  // AGENT COORDINATION 2026-06-24 (Codex): route-input ids arrive from
  // engine, API result paths, and assistant envelopes with different
  // punctuation/prefixing; these variants must stay semantically equivalent.
  it("normalizes prefixed and underscored area-family paths to panel area targets", () => {
    for (const code of [
      "estimate:ratings.field.partition_area_m2",
      "fieldContext.partitionAreaM2_or_panelWidthHeight",
      "route-input:fieldContext.partition_area_m2-or-panel_width_height"
    ]) {
      const presentation = resolveWorkbenchRequiredInputPresentation(code);

      expect(presentation.label).toBe("Panel area");
      expect(presentation.targetFields).toEqual(["panelWidthMm", "panelHeightMm"]);
      expect(presentation.traceCode).toBe(code);
    }
  });

  it("keeps direct panel dimension targets narrow", () => {
    expect(resolveWorkbenchRequiredInputPresentation("panelWidthMm").targetFields).toEqual(["panelWidthMm"]);
    expect(resolveWorkbenchRequiredInputPresentation("panelHeightMm").targetFields).toEqual(["panelHeightMm"]);
  });

  it("maps core direct route-input ids to their expected semantic target fields", () => {
    const cases: Array<{
      code: string;
      label: string;
      targetFields: readonly string[];
    }> = [
      { code: "receivingRoomRt60S", label: "RT60", targetFields: ["receivingRoomRt60S"] },
      { code: "receivingRoomVolumeM3", label: "Room volume", targetFields: ["receivingRoomVolumeM3"] },
      { code: "sourceRoomVolumeM3", label: "Source room volume", targetFields: ["sourceRoomVolumeM3"] },
      { code: "buildingPredictionOutputBasis", label: "Building output basis", targetFields: ["buildingPredictionOutputBasis"] },
      { code: "flankingJunctionClass", label: "Flanking junction", targetFields: ["flankingJunctionClass"] },
      {
        code: "conservativeFlankingAssumption",
        label: "Flanking assumption",
        targetFields: ["conservativeFlankingAssumption"]
      },
      { code: "junctionCouplingLengthM", label: "Coupling length", targetFields: ["junctionCouplingLengthM"] },
      { code: "impactFieldContext.ciDb", label: "CI", targetFields: ["ciDb"] },
      { code: "impactFieldContext.ci50_2500Db", label: "CI,50-2500", targetFields: ["ci50_2500Db"] },
      { code: "loadBasisKgM2", label: "Load basis", targetFields: ["loadBasisKgM2"] },
      {
        code: "resilientLayerDynamicStiffnessMNm3",
        label: "Dynamic stiffness",
        targetFields: ["resilientLayerDynamicStiffnessMNm3"]
      }
    ];

    for (const testCase of cases) {
      const presentation = resolveWorkbenchRequiredInputPresentation(testCase.code);

      expect(presentation.label, testCase.code).toBe(testCase.label);
      expect(presentation.targetFields, testCase.code).toEqual(testCase.targetFields);
    }
  });

  it("presents prefixed report-envelope task codes by their semantic tail", () => {
    const presentation = resolveWorkbenchRequiredInputPresentation(
      "wall-candidate-2:assistant_layer_material_missing",
      { fallbackDetail: "Candidate 2: Layer 2 has no normalized material id." }
    );

    expect(presentation.label).toBe("Layer material");
    expect(presentation.detail).not.toContain("assistant_layer_material_missing");
    expect(presentation.traceCode).toBe("wall-candidate-2:assistant_layer_material_missing");
  });

  it("keeps unknown route-input codes readable and preserves fallback detail", () => {
    const presentation = resolveWorkbenchRequiredInputPresentation(
      "route-x:some.deep.unknown_input_code",
      { fallbackDetail: "Fallback detail from the route." }
    );

    expect(presentation.label).toBe("Unknown Input Code");
    expect(presentation.detail).toBe("Fallback detail from the route.");
    expect(presentation.targetFields).toEqual([]);
    expect(presentation.traceCode).toBe("route-x:some.deep.unknown_input_code");
  });
});
