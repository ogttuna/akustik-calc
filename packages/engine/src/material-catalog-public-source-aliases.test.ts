import { describe, expect, it } from "vitest";

import { resolveMaterial } from "./material-catalog";

describe("public-source material aliases", () => {
  it("resolves common user-facing product names to seeded public material rows", () => {
    expect(resolveMaterial("wallboard_ten").id).toBe("gyproc_wallboard_ten_12_5");
    expect(resolveMaterial("knauf_pro_hd").id).toBe("knauf_pro_hd_12_5");
    expect(resolveMaterial("fermacell").id).toBe("fermacell_gypsum_fibreboard_1150");
    expect(resolveMaterial("fiber_cement").id).toBe("fiber_cement_board_1290");
    expect(resolveMaterial("rwa45").id).toBe("rockwool_rwa45");
    expect(resolveMaterial("rw5").id).toBe("rockwool_rw5");
    expect(resolveMaterial("oc703").id).toBe("owens_corning_703");
    expect(resolveMaterial("basotect").id).toBe("basotect_melamine_foam");
    expect(resolveMaterial("eps_100").id).toBe("eps_100_insulation_board");
    expect(resolveMaterial("xps").id).toBe("xps_foam_board_40");
    expect(resolveMaterial("pir").id).toBe("pir_board_30");
    expect(resolveMaterial("quietcork").id).toBe("cork_underlay_184");
    expect(resolveMaterial("scan_825").id).toBe("scanrubber_825_underlay");
  });
});
