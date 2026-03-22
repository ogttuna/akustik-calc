import { describe, expect, it } from "vitest";

import {
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
  findSimpleWorkbenchProposalPolicyPresetById,
  matchSimpleWorkbenchProposalPolicyPreset,
  SIMPLE_WORKBENCH_PROPOSAL_POLICY_PRESETS
} from "./simple-workbench-proposal-policy-presets";

describe("simple workbench proposal policy presets", () => {
  it("exposes a consultant-safe default clause pair", () => {
    const preset = findSimpleWorkbenchProposalPolicyPresetById("client_review");

    expect(preset).not.toBeNull();
    expect(preset?.issuePurpose).toBe(DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE);
    expect(preset?.validityNote).toBe(DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE);
    expect(SIMPLE_WORKBENCH_PROPOSAL_POLICY_PRESETS).toHaveLength(4);
  });

  it("matches saved clause text back to a known preset even with spacing noise", () => {
    const matched = matchSimpleWorkbenchProposalPolicyPreset({
      issuePurpose: "  Tender review   and design coordination  ",
      validityNote: "Budget pricing valid for 21 calendar days."
    });

    expect(matched?.id).toBe("tender_pricing");
    expect(matched?.label).toBe("Tender pricing");
  });

  it("returns null when the clause pair has been customized beyond the standard library", () => {
    const matched = matchSimpleWorkbenchProposalPolicyPreset({
      issuePurpose: "Tender review and design coordination",
      validityNote: "Budget pricing valid until commercial confirmation."
    });

    expect(matched).toBeNull();
  });
});
