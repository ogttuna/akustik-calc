import { describe, expect, it } from "vitest";

import {
  buildSnapshotReader,
  collectSilentSwapOffenders,
  DEEP_HYBRID_AAC_G5_SWAP_SCAN_COHORTS,
  ROUTE_DEEP_HYBRID_SWAP_TIMEOUT_MS
} from "./dynamic-route-deep-hybrid-test-helpers";

describe("dynamic route deep hybrid AAC-G5 swap contracts", () => {
  const readSnapshot = buildSnapshotReader();

  for (const cohort of DEEP_HYBRID_AAC_G5_SWAP_SCAN_COHORTS) {
    it(
      `finds no silent >=8 dB adjacent-swap jumps for AAC-G5 deep-hybrid route cohort ${cohort.label}`,
      async () => {
        const offenders = await collectSilentSwapOffenders(readSnapshot, cohort);
        expect(offenders).toEqual([]);
      },
      ROUTE_DEEP_HYBRID_SWAP_TIMEOUT_MS
    );
  }
});
