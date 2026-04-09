import { describe, expect, it } from "vitest";

import { getPresetById } from "./preset-definitions";
import { buildSimpleWorkbenchPresetGroups } from "./simple-workbench-preset-groups";
import { MODE_PRESETS } from "./simple-workbench-constants";

describe("simple workbench preset groups", () => {
  it("separates current floor presets into readable starter, bound, and fallback groups", () => {
    const groups = buildSimpleWorkbenchPresetGroups(MODE_PRESETS.floor.map(getPresetById));

    expect(groups.map((group) => group.label)).toEqual([
      "Quick starts",
      "Measured examples",
      "Conservative examples",
      "Diagnostics"
    ]);
    expect(groups[0]?.options.map((option) => option.label)).toEqual(["Impact Floor", "Floor Study"]);
    expect(groups[1]?.options.map((option) => option.label)).toEqual(["Dataholz CLT Dry"]);
    expect(groups[2]?.options.map((option) => option.label)).toEqual([
      "UBIQ Bound 300",
      "UBIQ Bound Unified 200",
      "UBIQ Bound Unspecified"
    ]);
    expect(groups[3]?.options.map((option) => option.label)).toEqual([
      "Steel Suspended Family",
      "Timber Bare Low-Confidence"
    ]);
  });

  it("creates an explicit exact-reference group when exact presets are present", () => {
    const groups = buildSimpleWorkbenchPresetGroups([
      getPresetById("heavy_concrete_impact_floor"),
      getPresetById("dataholz_clt_dry_exact"),
      getPresetById("ubiq_open_web_300_bound"),
      getPresetById("timber_bare_impact_only_fallback")
    ]);

    expect(groups.map((group) => group.label)).toEqual([
      "Quick starts",
      "Measured examples",
      "Conservative examples",
      "Diagnostics"
    ]);
    expect(groups[1]?.options.map((option) => option.label)).toEqual(["Dataholz CLT Dry"]);
    expect(groups[0]?.description).toContain("starter stacks");
    expect(groups[1]?.description).toContain("exact match");
  });
});
