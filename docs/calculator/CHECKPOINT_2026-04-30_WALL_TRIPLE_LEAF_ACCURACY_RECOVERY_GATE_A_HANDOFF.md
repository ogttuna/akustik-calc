# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate A Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

Gate A status:

`selected_wall_triple_leaf_accuracy_recovery_v1_after_user_pdf_repro_showed_current_multileaf_blend_is_not_a_validated_calculation`

## Decision

`packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts`
lands the user-reported split-rockwool wall repro as an executable
accuracy defect.

Gate A does not claim the current answer is correct. It records that:

- the adjacent-rockwool stack currently lands on `double_leaf`,
  `double_leaf_porous_fill_delegate`, medium confidence, `Rw 51`;
- the split-rockwool stack currently lands on
  `multileaf_multicavity`, `multileaf_screening_blend`, low
  confidence, `Rw 41`;
- adding existing advanced metadata for connection type, stud type,
  stud spacing, dimensions, receiving-room volume, and RT60 still
  leaves the split stack on the same low-confidence multi-leaf blend;
- the current multi-leaf number is not accepted for the
  company-internal accuracy checkpoint.

Next selected action:

`gate_b_topology_input_model_and_missing_field_policy`

Next selected file:

`packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts`

## Why This Interrupts The Source Slice

The active British Gypsum White Book Gate B remains useful, but the user
found a higher-priority correctness defect in a realistic wall assembly.
The product goal is accurate calculation across realistic combinations,
so this defect takes priority over more source-locator cleanup.

British Gypsum extraction is paused, not discarded. Resume it after the
triple-leaf recovery slice has a bounded input/solver path.

## Required Next Inputs

Gate B must make these first-class rather than inferred from flat layer
order alone:

- side A leaf;
- cavity 1 depth and fill;
- internal leaf;
- internal leaf coupling / bridge class;
- cavity 2 depth and fill;
- side B leaf;
- stud or support topology;
- lab / field metric policy;
- source tolerance owner;
- paired engine and web visible tests.

If those inputs are missing for a detected triple-leaf wall, the
calculator should ask for the missing topology instead of allowing a
screening blend to look like a precise answer.

## Frozen Surfaces

These surfaces remain frozen in Gate A:

- runtime numeric values;
- support status;
- confidence;
- evidence;
- API;
- route-card values;
- output-card status;
- proposal/report;
- workbench input behavior.

## Validation

Gate A validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts src/dynamic-airborne-order-sensitivity.test.ts --maxWorkers=1`
  green on 2026-04-30.
- `git diff --check`
  clean on 2026-04-30.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding the Gate A repro file to the current
  runner: engine 162 files / 819 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
