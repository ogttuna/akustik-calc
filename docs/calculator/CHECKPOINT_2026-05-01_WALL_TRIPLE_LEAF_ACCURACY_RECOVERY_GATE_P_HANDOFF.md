# Checkpoint - 2026-05-01 - Wall Triple Leaf Accuracy Recovery Gate P

Slice:

`wall_triple_leaf_accuracy_recovery_v1`

Gate P status:

`gate_p_found_no_runtime_ready_access_or_equivalent_measured_row_no_runtime_selected_source_access_followup_gate_q`

Selected next file:

`packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`

## Summary

Gate P lands source access / alternative measured-row acquisition with
no runtime movement. It adds:

- `packages/engine/src/wall-triple-leaf-source-access.ts`
- `packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`

The gate keeps Uris 2006 as the primary rockwool / 50 mm two-cavity
source-access target, but finds no source-owned one-third-octave curves
or direct numeric table in the current public/local corpus. It also
tests near alternatives and keeps them out of runtime.

## Source Access Decision

Primary target remains:

- `uris_2006_internal_gypsum_50mm_mineral_wool_double_frame`
- source: Uris, Bravo, Gomez-Lozano, Ramirez, Llinares 2006, Applied
  Acoustics 67(9), 918-925, DOI `10.1016/j.apacoust.2005.11.006`
- URL: `https://www.sciencedirect.com/science/article/pii/S0003682X05001799`

Gate P access paths:

- `authorized_elsevier_full_text_or_tdm`: future access path only; the
  current working corpus has no authorized source-owned curves/table.
- `manual_author_or_library_source_packet`: future access path only; a
  local page/figure/table packet with curve identity is still missing.
- `local_pdf_or_page_image_upload`: future access path only; no local
  source PDF/page image exists for reproducible axis locking.
- `public_summary_and_metadata_recheck`: identity evidence only; public
  summaries and DOI/Crossref metadata do not provide acoustic band
  vectors.

## Alternative Row Decision

Gate P records one accessible adjacent measured source:

- `uris_2008_perforated_absorptive_facing_accessible_adjacent`
- source: Uris, Bravo, Estelles 2008, Acta Acustica 94(2), 321-325,
  DOI `10.3813/AAA.918035`
- URL: `https://dael.euracoustics.org/landing_pages/aaua/64624.html`

This is not promoted because the source lane is a perforated
absorptive-facing system. It has useful 50 mm mineral-wool and plotted
measurement context, but perforation ratio / Helmholtz-facing behavior
and material role are not equivalent to the local internal gypsum-board
defect lane.

Other alternatives remain non-runtime:

- Utley / Mulholland 1968, Brekke 1981, and Vinokur 1990 are
  method/physics context only in the current corpus.
- Quirt 1983 and Tadeu 2001 are glazing rows and are rejected for the
  wall/mineral-wool lane.
- NRC 2024 remains a graph-owned comparator only, not the missing local
  rockwool / 50 mm measured row.

## Runtime Posture

Runtime remains fail-closed:

- split-rockwool grouped stack: `multileaf_screening_blend`, `Rw 41`,
  low confidence;
- no support promotion;
- no confidence promotion;
- no evidence promotion;
- no route-card or output-card value/status movement;
- no proposal/report copy movement;
- no API or workbench input behavior movement.

Do not present `Rw 41` as fixed, correct, or source-validated. Gate P
only proves that current source-access and near-alternative paths do not
yet close the runtime evidence gap.

## Gate Q Selection

Gate Q should continue source-access backlog and runtime-blocker
revalidation:

`packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`

Gate Q must keep runtime frozen unless it can name:

- source-owned full one-third-octave curves or a direct numeric table;
- source PDF/page image, page/figure/table locator, extraction method,
  plot axes, and curve identity;
- Rw/STC derivation and uncertainty owner;
- local material/support topology mapping blockers;
- usable source-pack / tolerance ownership and source-gap closure;
- runtime-ready topology guards and paired engine/web visible runtime
  tests.

## Validation

Focused Gate P validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-access-gate-p.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.

Continuity validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts src/wall-triple-leaf-source-locator-intake-gate-n.test.ts src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts src/wall-triple-leaf-source-gap-closure-gate-l.test.ts src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-01: 5 files / 35 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.
- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate P after Gate O: engine 184
  files / 967 tests, web 47 files / 227 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
- `git diff --check`
  green on 2026-05-01.
