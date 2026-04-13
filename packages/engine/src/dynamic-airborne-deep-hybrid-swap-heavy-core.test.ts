import { describe, expect, it } from "vitest";

import {
  buildSnapshotReader,
  collectSilentSwapOffenders,
  DEEP_HYBRID_NON_AAC_SWAP_SCAN_COHORTS,
  DEEP_HYBRID_SWAP_TIMEOUT_MS
} from "./dynamic-airborne-deep-hybrid-test-helpers";

describe("dynamic airborne deep hybrid non-AAC swap contracts", () => {
  const readSnapshot = buildSnapshotReader();

  for (const cohort of DEEP_HYBRID_NON_AAC_SWAP_SCAN_COHORTS) {
    it(
      `finds no silent >=8 dB adjacent-swap jumps for non-AAC deep-hybrid cohort ${cohort.label}`,
      async () => {
        const offenders = await collectSilentSwapOffenders(readSnapshot, cohort);
        expect(offenders).toEqual([]);
      },
      DEEP_HYBRID_SWAP_TIMEOUT_MS
    );
  }
});
