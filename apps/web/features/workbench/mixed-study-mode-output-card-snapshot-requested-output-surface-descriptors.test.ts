import { describe, expect, it } from "vitest";

import {
  SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS,
} from "./mixed-study-mode-generated-test-helpers";
import { CARD_HISTORY_VARIANTS } from "./mixed-study-mode-output-card-snapshot-test-helpers";
import {
  createBroadRequestedOutputPartialRestoreDescriptor,
  createRepresentativeRequestedOutputPartialRestoreDescriptor,
  createSelectedRequestedOutputGeneratedHistoryRestoreDescriptor,
  createSelectedRequestedOutputPartialRestoreDescriptor,
} from "./mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors";

describe("mixed study-mode requested-output surface descriptors", () => {
  it("keeps broad and representative partial-restore descriptors on the compact replay branch", () => {
    const broad = createBroadRequestedOutputPartialRestoreDescriptor();
    const representative = createRepresentativeRequestedOutputPartialRestoreDescriptor();

    expect(broad.variants).toEqual(CARD_HISTORY_VARIANTS);
    expect(representative.variants).toEqual(CARD_HISTORY_VARIANTS);
  });

  it("keeps selected requested-output restore descriptors on the reverse-mask replay branch", () => {
    const selectedPartial = createSelectedRequestedOutputPartialRestoreDescriptor();
    const selectedGeneratedHistory = createSelectedRequestedOutputGeneratedHistoryRestoreDescriptor();

    expect(selectedPartial.variants).toEqual(SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS);
    expect(selectedGeneratedHistory.variants).toEqual(SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS);
    expect(
      selectedPartial.variants.some((variant) => (variant.reversePlanIndexes?.length ?? 0) > 0),
    ).toBe(true);
  });
});
