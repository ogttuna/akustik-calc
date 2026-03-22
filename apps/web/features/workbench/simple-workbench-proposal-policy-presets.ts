export const DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE = "Client review and acoustic coordination";
export const DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE =
  "Valid for 30 calendar days unless superseded by a later issue.";

export type SimpleWorkbenchProposalPolicyPresetId =
  | "client_review"
  | "tender_pricing"
  | "developer_coordination"
  | "lab_follow_up";

export type SimpleWorkbenchProposalPolicyPreset = {
  id: SimpleWorkbenchProposalPolicyPresetId;
  issuePurpose: string;
  label: string;
  note: string;
  validityNote: string;
};

export const SIMPLE_WORKBENCH_PROPOSAL_POLICY_PRESETS: readonly SimpleWorkbenchProposalPolicyPreset[] = [
  {
    id: "client_review",
    issuePurpose: DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
    label: "Client review",
    note: "Use when the issue is being released to the client team for coordination, comment, and commercial review.",
    validityNote: DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE
  },
  {
    id: "tender_pricing",
    issuePurpose: "Tender review and design coordination",
    label: "Tender pricing",
    note: "Use when the stack is being packaged for pricing, tender comparison, and design-team alignment.",
    validityNote: "Budget pricing valid for 21 calendar days."
  },
  {
    id: "developer_coordination",
    issuePurpose: "Developer coordination and design freeze review",
    label: "Developer memo",
    note: "Use when the issue is supporting developer-side design freeze, consultant alignment, or pre-issue sign-off.",
    validityNote: "For coordination use on this revision and subject to superseding design updates."
  },
  {
    id: "lab_follow_up",
    issuePurpose: "Laboratory follow-up and assembly alignment",
    label: "Lab follow-up",
    note: "Use when the document is supporting laboratory planning, specimen alignment, or post-test clarification.",
    validityNote: "Valid for this laboratory follow-up issue and subject to test-lab confirmation."
  }
] as const;

function normalizePolicyValue(value: string): string {
  return value.trim().replace(/\s+/gu, " ").toLowerCase();
}

export function findSimpleWorkbenchProposalPolicyPresetById(
  presetId: SimpleWorkbenchProposalPolicyPresetId
): SimpleWorkbenchProposalPolicyPreset | null {
  return SIMPLE_WORKBENCH_PROPOSAL_POLICY_PRESETS.find((preset) => preset.id === presetId) ?? null;
}

export function matchSimpleWorkbenchProposalPolicyPreset(input: {
  issuePurpose: string;
  validityNote: string;
}): SimpleWorkbenchProposalPolicyPreset | null {
  const normalizedPurpose = normalizePolicyValue(input.issuePurpose);
  const normalizedValidity = normalizePolicyValue(input.validityNote);

  return (
    SIMPLE_WORKBENCH_PROPOSAL_POLICY_PRESETS.find(
      (preset) =>
        normalizePolicyValue(preset.issuePurpose) === normalizedPurpose &&
        normalizePolicyValue(preset.validityNote) === normalizedValidity
    ) ?? null
  );
}
