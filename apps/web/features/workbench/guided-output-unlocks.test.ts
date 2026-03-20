import { describe, expect, it } from "vitest";

import { formatUnlockOutputs, getGuidedOutputUnlocks } from "./guided-output-unlocks";

describe("getGuidedOutputUnlocks", () => {
  it("asks for a context switch before field airborne outputs in lab mode", () => {
    const unlocks = getGuidedOutputUnlocks({
      airborneContextMode: "element_lab",
      airbornePanelHeightMm: "",
      airbornePanelWidthMm: "",
      airborneReceivingRoomRt60S: "",
      airborneReceivingRoomVolumeM3: "",
      impactGuideKDb: "",
      impactGuideReceivingRoomVolumeM3: "",
      parkedOutputs: ["R'w", "Dn,w"],
      studyMode: "wall"
    });

    expect(unlocks).toHaveLength(1);
    expect(unlocks[0]?.title).toBe("Switch project context");
    expect(formatUnlockOutputs(unlocks[0]?.outputs ?? [])).toBe("R'w · Dn,w");
  });

  it("stays linear by asking for geometry and K before downstream room-normalization fields", () => {
    const unlocks = getGuidedOutputUnlocks({
      airborneContextMode: "building_prediction",
      airbornePanelHeightMm: "",
      airbornePanelWidthMm: "",
      airborneReceivingRoomRt60S: "",
      airborneReceivingRoomVolumeM3: "",
      impactGuideKDb: "",
      impactGuideReceivingRoomVolumeM3: "",
      parkedOutputs: ["DnT,w", "L'n,w", "L'nT,w"],
      studyMode: "floor"
    });

    expect(unlocks.map((group) => group.title)).toEqual(["Enter partition width and height", "Enter impact K correction"]);
    expect(unlocks[0]?.outputs).toEqual(["DnT,w"]);
    expect(unlocks[1]?.outputs).toEqual(["L'n,w", "L'nT,w"]);
  });

  it("asks for room-normalization details only after upstream blockers are already present", () => {
    const unlocks = getGuidedOutputUnlocks({
      airborneContextMode: "building_prediction",
      airbornePanelHeightMm: "2800",
      airbornePanelWidthMm: "3600",
      airborneReceivingRoomRt60S: "",
      airborneReceivingRoomVolumeM3: "",
      impactGuideKDb: "2",
      impactGuideReceivingRoomVolumeM3: "",
      parkedOutputs: ["DnT,w", "L'nT,w", "Ln,w+CI"],
      studyMode: "floor"
    });

    expect(unlocks.map((group) => group.title)).toEqual([
      "Enter airborne room volume and RT60",
      "Enter impact room volume",
      "Choose a CI-capable impact lane"
    ]);
    expect(formatUnlockOutputs(unlocks[0]?.outputs ?? [])).toBe("DnT,w");
    expect(formatUnlockOutputs(unlocks[1]?.outputs ?? [])).toBe("L'nT,w");
    expect(formatUnlockOutputs(unlocks[2]?.outputs ?? [])).toBe("Ln,w+CI");
  });
});
