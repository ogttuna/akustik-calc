# Checkpoint - Rockwool Triple-Leaf Explicit Screening-Only Policy Gate C Closeout

Date: 2026-05-05

Slice id:

`rockwool_triple_leaf_explicit_screening_only_policy_v1`

Landed status:

`closed_rockwool_triple_leaf_explicit_screening_only_policy_no_runtime_and_selected_source_promotion_hostile_input_readiness_guard`

Landed action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Landed file:

`packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`

Selected next slice:

`source_promotion_hostile_input_readiness_guard_v1`

Selected next action:

`gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout`

Selected next file:

`packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`

Selected next file status:

Intentionally absent until the next implementation step.

Selected planning surface:

`docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md`

## What Landed

Gate C is no-runtime. Runtime values, support, confidence, evidence,
API behavior, route-card values, output-card status, proposal/report
values, and workbench-input behavior stayed frozen.

Frozen surfaces: runtime values, support, confidence, evidence, API
behavior, route-card values, output-card status, proposal/report values,
and workbench-input behavior.

Gate C artifacts:

- `rockwool_policy_gate_c_closeout_summary`
- `rockwool_exact_or_screening_company_criterion_closed`
- `source_promotion_hostile_input_opening_blockers_carry_forward`
- `source_promotion_hostile_input_readiness_guard_selected`
- `selected_gate_a_source_promotion_hostile_input_readiness_with_target_file`

## Findings

- The Rockwool company-internal criterion is closed as explicit
  screening-only, not as exact runtime.
- Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated.
- Flat-list adjacent swaps remain `Rw 42` on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`.
- Field `R'w 34` and `DnT,w 36` remain continuations from the Rockwool
  screening lane, not independent measured field or design-grade
  results.
- Uris 2006 remains `paused_waiting_rights_safe_source_packet`; this
  closeout does not create source-owned curve evidence.
- Company-internal high-accuracy opening remains blocked by source
  promotion ownership, hostile API/import fail-closed proof, and final
  current-gate plus broad-check evidence at opening handoff.

## Next Step

Implement:

`packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`

Gate A should inventory source-promotion and hostile-input readiness
after the Rockwool policy closeout. It should either name a concrete
small fix, select a visible guard, or close no-runtime. It must not
promote source rows or hostile/import inputs to exact runtime without
topology, material mapping, metric context, tolerance, negative
boundaries, source provenance, and paired engine/visible tests.

## Validation

Validation completed on 2026-05-05:

- focused Gate C passed 1 file / 6 tests;
- engine continuity passed 6 files / 37 tests;
- focused web Gate B compatibility passed 1 file / 7 tests after the
  selected Gate C file landed;
- `pnpm calculator:gate:current` passed with engine 250 files / 1448
  tests, web 53 files / 259 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- final `git diff --check` was green after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Broad `pnpm check` was not run because Gate C made no runtime, API,
shared-schema, route/report, or workbench-input behavior change. Known
non-fatal `sharp/@img` warnings remain through `@turbodocx/html-to-docx`.

Focused command:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts --maxWorkers=1
```

Continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/raw-wall-hostile-input-answer-matrix.test.ts src/raw-floor-hostile-input-answer-matrix.test.ts --maxWorkers=1
```

Final gates:

```sh
pnpm calculator:gate:current
git diff --check
```
