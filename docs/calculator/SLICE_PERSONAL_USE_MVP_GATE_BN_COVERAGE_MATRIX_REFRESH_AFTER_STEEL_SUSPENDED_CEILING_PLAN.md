# Gate BN Coverage Matrix Refresh After Steel Suspended-Ceiling Plan

Date: 2026-05-14

Gate BN is a no-runtime matrix refresh after Gate BM. It does not
change calculator values, tolerance budgets, source precedence, input
surfaces, API payloads, cards, or reports.

## Purpose

Gate BM proved that the Gate BL steel suspended-ceiling input surface is
stable. Gate BN adds that new posture to the executable Personal-Use MVP
coverage matrix so future agents can see the supported and blocked
steel suspended-ceiling outcomes in the main map.

Gate BN also carries forward the 2026-05-14 company-internal
calculation-grade review: complete common company scenarios should not
end as live `low_confidence` or screening final answers when an owned
physics corridor or precise `needs_input` boundary can be built.

## Required Matrix Rows

Gate BN adds:

- complete steel suspended-ceiling lab `Ln,w`;
- safe explicit steel suspended-ceiling reorder;
- partial steel suspended-ceiling missing-owner prompt;
- duplicate steel carrier hostile refusal;
- steel exact-source precedence;
- steel field adapter row with `L'n,w` / `L'nT,w` and `L'nT,50`
  blocked;
- steel suspended-ceiling `DeltaLw` unsupported boundary;
- steel suspended-ceiling ASTM `IIC` / `AIIC` unsupported boundary;
- steel suspended-ceiling `L'nT,50` unsupported boundary;
- remaining reinforced-concrete combined low-confidence cleanup
  candidate.

## Frozen Values

Gate BN must keep:

- Gate BK steel suspended-ceiling lab `Ln,w 62.2`;
- Gate BK steel suspended-ceiling `+/-6 dB` source-absent budget;
- Gate AD steel upper/lower `Ln,w 55.6` / `DeltaLw 22.4`;
- exact source precedence;
- Gate BJ field/building basis separation;
- `DeltaLw`, ASTM `IIC` / `AIIC`, and `L'nT,50` non-alias boundaries
  for the suspended-ceiling-only steel lane.

## Selected Next Gate

Gate BN selects:

`gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan`

Selected file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts`

Reason: after the steel suspended-ceiling low-confidence lane is cleaned
up and matrixed, the highest-risk complete company route still ending as
`low_confidence` is the reinforced-concrete combined upper/lower
fallback. Unsupported `DeltaLw`, ASTM, and low-frequency adapters remain
important but are less dangerous than a misleading final low-confidence
answer.

## Validation

Focused Gate BN:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-bn-coverage-matrix-refresh-after-steel-suspended-ceiling-contract.test.ts --maxWorkers=1`

Also run:

- Gate BM focused test;
- Gate BK / BL steel focused tests;
- reinforced-concrete low-confidence follow-up tests;
- engine typecheck;
- web steel input-surface tests;
- `pnpm calculator:gate:current`;
- `git diff --check`.
