import { describe, expect, it } from "vitest";

import {
  buildSnapshotReader,
  collectSilentSwapOffenders,
  DEEP_HYBRID_AAC_D700_100_SWAP_SCAN_COHORTS,
  DEEP_HYBRID_SWAP_TIMEOUT_MS
} from "./dynamic-airborne-deep-hybrid-test-helpers";

describe("dynamic airborne deep hybrid AAC-D700-100 swap contracts", () => {
  const readSnapshot = buildSnapshotReader();

  for (const cohort of DEEP_HYBRID_AAC_D700_100_SWAP_SCAN_COHORTS) {
    it(
      `finds no silent >=8 dB adjacent-swap jumps for AAC-D700-100 deep-hybrid cohort ${cohort.label}`,
      async () => {
        const offenders = await collectSilentSwapOffenders(readSnapshot, cohort);
        expect(offenders).toEqual([]);
      },
      DEEP_HYBRID_SWAP_TIMEOUT_MS
    );
  }
});
