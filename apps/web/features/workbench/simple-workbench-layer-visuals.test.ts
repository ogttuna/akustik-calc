import { describe, expect, it } from "vitest";

import { getLayerVisualSurface, layerFillClass, layerStrokeClass } from "./simple-workbench-layer-visuals";

describe("simple workbench layer visuals", () => {
  it("uses material-like neutral swatches instead of accent-blue fallbacks", () => {
    const concrete = { category: "mass" as const, densityKgM3: 2400, id: "concrete", name: "Concrete", tags: ["structural"] };
    const finish = { category: "finish" as const, densityKgM3: 1400, id: "local_finish", name: "Local finish", tags: ["finish"] };
    const support = { category: "support" as const, densityKgM3: 0, id: "furring_channel", name: "Furring Channel", tags: ["ceiling-support"] };

    expect(layerFillClass(concrete)).toBe("bg-[#ced1d0]");
    expect(layerStrokeClass(concrete)).toBe("border-[#747d82]");
    expect(layerFillClass(finish)).toBe("bg-[#d8d6cf]");
    expect(layerStrokeClass(finish)).toBe("border-[#74766f]");
    expect(layerFillClass(support)).toBe("bg-[#c6ccd0]");
    expect(layerStrokeClass(support)).toBe("border-[#66737c]");
  });

  it("keeps proposal legend surfaces on the same neutral finish palette", () => {
    const finish = { category: "finish" as const, densityKgM3: 1400, id: "local_finish", name: "Local finish", tags: ["finish"] };
    const surface = getLayerVisualSurface(finish);

    expect(surface.frontStyle.backgroundColor).toBe("#d8d6cf");
    expect(surface.sideStyle.backgroundColor).toBe("#c0bdb4");
    expect(surface.topStyle.backgroundColor).toBe("#ebe8de");
  });
});
