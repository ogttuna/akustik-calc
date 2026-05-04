# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate J Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: J

Status: LANDED / COMPANY-INTERNAL ACCEPTANCE REHEARSAL / NO RUNTIME

Gate J status:

`gate_j_landed_company_internal_acceptance_rehearsal_no_runtime_selected_runtime_promotion_readiness_gate_k`

Next implementation file:

`packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`

## Decision

Gate J adds the web-side company-internal acceptance rehearsal for the
user-reported triple-leaf / rockwool reorder defect. It does not move
runtime numbers, support status, confidence, evidence tier, API shape,
output-card status/value, or proposal metric claims.

The Gate J contract is:

`apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`

The current family is still blocked/caveated, not ready for exact
runtime.

## Acceptance Coverage

Gate J rehearses:

- adjacent and split rockwool user PDF stacks;
- missing grouped topology and complete grouped topology;
- exact source and near-source local-substitution controls;
- ordinary double-leaf, lined-masonry, and one-side-lining negatives;
- many-layer and reorder hostile inputs;
- lab `Rw`, field `R'w`, and `DnT,w`;
- proposal/report text and HTML visibility.

Pinned current behavior:

- adjacent rockwool stack: `Rw 50`, `double_leaf`,
  `double_leaf_porous_fill_delegate`, medium confidence;
- split rockwool stack without topology: `Rw 41`,
  `multileaf_multicavity`, `multileaf_screening_blend`, low
  confidence, `Grouped topology missing`;
- split rockwool stack with complete grouped topology: `Rw 41`,
  `multileaf_multicavity`, `multileaf_screening_blend`, low
  confidence, `Source validation blocked`;
- field/building grouped split stack: `R'w 34`, `DnT,w 36`, `Rw`
  unsupported on the field issue surface, and report warnings carrying
  the grouped triple-leaf source-validation blocker.

## Runtime Hold

The live split-rockwool PDF repro still returns low-confidence
`multileaf_screening_blend` `Rw 41`. Gate J proves the current UI and
report surfaces do not hide the caveat, but it does not prove the local
stack is a source-validated exact calculation.

Runtime remains blocked because the following are still not owned
together:

- local `gypsum_board` / Type C mapping;
- local `rockwool` / NRC glass-fiber batt equivalence;
- local `mlv` effect model;
- local `gypsum_plaster` effect model;
- local 50 mm two-cavity source rows;
- generic support topology / gauge / depth / spacing owner;
- runtime-ready route-flip and duplicate-stack topology guards;
- paired engine and web visible runtime tests.

## Next Gate

Gate K should decide runtime-promotion readiness and source-gap
closure:

`packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`

Gate K may only promote runtime if local material mapping, usable local
source-pack/tolerance ownership, source-gap closure, runtime-ready
topology guards, and paired engine/web visible runtime tests all pass.
Otherwise it must keep the solver fail-closed on
`multileaf_screening_blend` and select the next source-gap closure step.

## Validation

Focused Gate J validation:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-01 after docs alignment: 1 file / 7 tests.
- `pnpm --filter @dynecho/web typecheck`
  green on 2026-05-01.
- `pnpm --filter @dynecho/web lint`
  green on 2026-05-01.
- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate J to the current runner:
  engine 178 files / 925 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
