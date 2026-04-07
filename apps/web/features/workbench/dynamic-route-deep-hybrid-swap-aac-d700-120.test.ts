import { describe, expect, it } from "vitest";

import {
  buildSnapshotReader,
  collectSilentSwapOffenders,
  DEEP_HYBRID_AAC_D700_120_SWAP_SCAN_COHORTS,
  ROUTE_DEEP_HYBRID_SWAP_TIMEOUT_MS
} from "./dynamic-route-deep-hybrid-test-helpers";

describe("dynamic route deep hybrid AAC-D700-120 swap contracts", () => {
  const readSnapshot = buildSnapshotReader();

  for (const cohort of DEEP_HYBRID_AAC_D700_120_SWAP_SCAN_COHORTS) {
    it(
      `finds no silent >=8 dB adjacent-swap jumps for AAC-D700-120 deep-hybrid route cohort ${cohort.label}`,
      () => {
        const offenders = collectSilentSwapOffenders(readSnapshot, cohort);
        expect(offenders).toEqual([]);
      },
      ROUTE_DEEP_HYBRID_SWAP_TIMEOUT_MS
    );
  }
});
