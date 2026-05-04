# Checkpoint - 2026-05-01 - Wall Triple Leaf Accuracy Recovery Gate O

Slice:

`wall_triple_leaf_accuracy_recovery_v1`

Gate O status:

`gate_o_verified_uris_locator_but_full_curves_not_runtime_ready_no_runtime_selected_source_access_gate_p`

Selected next file:

`packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`

## Summary

Gate O lands full-curve retrieval and provenance QC with no runtime
movement. It adds:

- `packages/engine/src/wall-triple-leaf-source-locator-provenance.ts`
- `packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`

The gate verifies the Uris 2006 locator selected by Gate N, records why
it is not yet a runtime-ready numeric curve pack, and keeps every
runtime, support, confidence, evidence, API, route-card, output-card,
proposal/report, and workbench-input behavior frozen.

## Source Access Decision

Primary locator verified:

- `uris_2006_internal_gypsum_50mm_mineral_wool_double_frame`
- source: Uris, Bravo, Gomez-Lozano, Ramirez, Llinares 2006, Applied
  Acoustics 67(9), 918-925, DOI `10.1016/j.apacoust.2005.11.006`
- URL: `https://www.sciencedirect.com/science/article/pii/S0003682X05001799`

Gate O access checks:

- `sciencedirect_article_page_public_summary`: article summary /
  metadata confirms measured sound reduction data, test specimen
  context, and the 7-8 dB weighted-index decrease, but it is not a
  source-owned one-third-octave band vector.
- `doi_linkinghub_redirect`: DOI / LinkingHub confirms the article PII
  and redirects to ScienceDirect, but does not expose page images,
  plots, or band data.
- `crossref_doi_metadata_and_elsevier_tdm_links`: Crossref confirms
  title, journal, volume, issue, pages, DOI, PII, authors, and Elsevier
  TDM links, but this is metadata, not usable acoustic curve data.
- `sciencedirect_pdf_route_local_http_403`: local unauthenticated
  article/PDF route checks returned HTTP 403, so no source PDF/page
  image is available in the local corpus for axis locking.

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

Do not present `Rw 41` as fixed, correct, or source-validated. Gate O
only proves that the current Uris 2006 locator is not yet a runtime-ready
full-curve source pack.

## Rejected Shortcut

The source-reported 7-8 dB weighted-index decrease must not become a
fixed runtime penalty. Gate O blocks it with
`fixed_weighted_index_penalty_not_curve` because a weighted-index delta
does not provide one-third-octave TL curves, Rw/STC derivation,
uncertainty, material mapping, support topology, or negative-boundary
proof.

## Gate P Selection

Gate P should continue source access or alternative measured-row
acquisition:

`packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`

Gate P must keep runtime frozen unless it can name:

- source-owned full one-third-octave curves or a direct numeric table;
- source PDF/page image, page/figure/table locator, extraction method,
  plot axes, and curve identity;
- Rw/STC derivation and uncertainty owner;
- local material/support topology mapping blockers;
- negative boundaries against fixed-penalty or near-source promotion.

## Validation

Focused Gate O validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.

Continuity validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-locator-intake-gate-n.test.ts src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts src/wall-triple-leaf-source-gap-closure-gate-l.test.ts src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-01: 4 files / 28 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.
- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate O after Gate N: engine 183
  files / 960 tests, web 47 files / 227 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean. Runtime and visible behavior remain frozen.
