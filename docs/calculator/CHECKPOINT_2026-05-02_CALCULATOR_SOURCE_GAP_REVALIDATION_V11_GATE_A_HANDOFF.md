# Checkpoint - 2026-05-02 - Calculator Source Gap Revalidation v11 Gate A

Slice:

`calculator_source_gap_revalidation_v11`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`

Status:

`selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`

Selected next slice:

`national_gypsum_fire_sound_selector_source_pack_extraction_v1`

Selected next action:

`gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`

Selected next file:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md`

## Summary

Gate A re-ranks source-readiness after USG Acoustical Assemblies Gate C
closed no-runtime. It keeps USG, ROCKWOOL, British Gypsum, Knauf, and
historical source rows out of runtime import, keeps the Uris 2006
split-rockwool lane paused, and selects National Gypsum Fire & Sound
Assembly Selector source-pack extraction as the next no-runtime source
step.

It does not select runtime import, value movement, support promotion,
confidence promotion, evidence promotion, output support movement, API
movement, route-card movement, output-card movement, proposal/report
copy movement, or workbench-input behavior movement.

## Rerank Result

Rank 1, selected for no-runtime extraction:

- National Gypsum Fire & Sound Assembly Selector:
  `https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector`
  - examples: selector UL designs with related sound-test context,
    including `V438` / `W419`-family examples that still need row
    payload or report capture before any import;
  - metrics: sound-test results and fire-design context, with
    `STC` / `IIC` policy pending row payload extraction;
  - first missing requirement: selector row payloads, downloadable sound
    reports, exact topology, acoustic metric owner, National Gypsum
    material alias boundaries, tolerance owner, protected negative
    boundaries, and paired visible tests.

Ranked but not selected:

- Georgia-Pacific Fire & Sound Assemblies remains planning context until
  actual directory rows or test reports are resolved.
- Uris 2006 triple-leaf / two-cavity lane remains
  `paused_waiting_rights_safe_source_packet`.
- USG Levelrock / steel partition rows remain closed no-runtime after
  Gate B / Gate C.
- ROCKWOOL ISS / IWS / ESS rows remain closed no-runtime after Gate B /
  Gate C.
- British Gypsum White Book and Knauf rows remain closed no-runtime.
- CLT / mass-timber, generated floor, no-stud, lined-heavy, and
  historical blockers remain below the concrete National Gypsum source
  locator for this no-runtime extraction step.

## Rockwool Defect Posture

This gate still does not fix or retune the original rockwool reorder /
triple-leaf defect. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated.

## Frozen Surfaces

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Next Step

Implement:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`

with:

`gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`

Gate A must extract selector/report locators and blockers. It may only
select runtime work if exact topology, metric owner, tolerance owner,
local material mapping, protected negative boundaries, and paired
engine/web visible tests are named together.

## Validation

Validation completed on 2026-05-02:

- focused v11 Gate A contract: 1 file / 8 tests passed;
- v11 / USG Gate C / Gate B / Gate A / v10 / ROCKWOOL Gate C /
  ROCKWOOL Gate B / ROCKWOOL Gate A / post-British-Gypsum acquisition /
  v9 / route-source-risk continuity: 11 files / 76 tests passed;
- `pnpm calculator:gate:current`: engine 202 files / 1093 tests passed,
  web 47 files / 227 tests passed / 18 skipped, build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.

Run `pnpm check` only if a later gate selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
