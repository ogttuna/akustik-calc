# Dynamic Calculator Source Gap Ledger

Last reviewed: 2026-04-08

Purpose:

- keep a living map of the current floor-dynamic support gaps
- record which families are already source-backed enough to tighten
- record which families must stay fail-closed until stronger evidence exists

Read together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)
- [../foundation/SOURCE_REPO_POLICY.md](../foundation/SOURCE_REPO_POLICY.md)

Important scope note:

- this ledger is floor-dominant
- wall-side dynamic behavior still stays mostly under benchmark and stability guardrails
- if wall-family widening becomes active work, add a separate wall ledger instead of overloading this one

## Current Audited Posture

### Bare CLT Slab

- current posture:
  - lab: live `Rw`, `Ln,w`, `Ln,w+CI`
  - impact field: live `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
  - current lab basis: `predictor_mass_timber_clt_bare_interpolation_estimate`
- why it is open:
  - the current CLT lane is already narrowed to same-family anchors and guarded by CLT-specific monotonicity tests
  - this is no longer a blind generic lightweight-floor fallback
- next work:
  - keep tightening monotonicity and treatment-strength relations
  - do not widen CLT by inventing a broader generic lane first
- current test anchors:
  - `packages/engine/src/clt-floor-monotonicity.test.ts`
  - `packages/engine/src/bare-floor-raw-support.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`

### Bare Open-Box Timber Slab

- current posture:
  - lab: `Rw` only
  - impact field: fail-closed
  - no live impact basis is exposed
- why it stays closed:
  - the current TUAS open-box rows are defended combined systems, not a defended raw bare open-box impact lane
  - the fail-closed posture now also explicitly covers raw and tagged lower-only ceiling-helper packages plus upper-only dry packages
  - widening this lane without stronger same-family evidence would create fake confidence
- next research question:
  - can the TUAS measured corpus defend a narrow near-bare or single-side-treatment open-box lane
  - if not, keep the raw bare open-box lane fail-closed
- current test anchors:
  - `packages/engine/src/bare-floor-raw-support.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `packages/engine/src/raw-floor-weaker-carrier-posture.test.ts`

### Role-Gated Timber Carriers

- current posture:
  - raw bare, lower-only, and upper-only `timber_frame_floor`, `timber_joist_floor`, and `engineered_timber_structural` rows stay fail-closed on impact
  - explicit `base_structure` rows can still reopen the predictor/family lane
  - raw combined rows can still use the defended exact/family corridors when the visible package carries upper-plus-lower evidence
- why it stays gated:
  - current timber evidence is strong enough for explicit-role and defended combined-package corridors
  - it is not strong enough to let helper-only or top-side-only raw rows auto-promote into the same-family lane
- next work:
  - widen timber only through explicit-role or defended combined-package evidence
  - do not let helper-only raw timber rows become an accidental generic widening shortcut
- current test anchors:
  - `packages/engine/src/raw-floor-weaker-carrier-posture.test.ts`
  - `apps/web/features/workbench/raw-floor-weaker-carrier-route-posture.test.ts`
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/impact-raw-layer-inference.test.ts`

### TUAS Open-Box Dry Exact Package

- current posture:
  - exact live lane
  - exact id: `tuas_r5b_open_box_timber_measured_2026`
  - lab: live `Rw`, `Ln,w`, `Ln,w+CI`
  - impact field: live `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
- why it matters:
  - it is the strongest current open-box anchor for future same-family widening
  - it proves that open-box timber can stay exact and stable when the package is fully described
- next work:
  - prefer widening around this defended package before attempting any raw bare open-box lane
- current test anchors:
  - `packages/engine/src/calculate-assembly.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `apps/web/features/workbench/floor-stack-invariance.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`

### Bare Open-Web Steel Carrier

- current posture:
  - lab: `Rw` only
  - impact field: fail-closed
  - no live impact basis is exposed
- why it stays closed:
  - the current UBIQ source is strongest on combined upper-plus-lower system tables
  - that does not defend a raw bare open-web impact lane by itself
- next research question:
  - can a narrow same-family open-web lane be defended from official rows or measured sources without guessing across support-form ambiguity
  - if not, keep the raw bare open-web lane fail-closed
- current test anchors:
  - `packages/engine/src/bare-floor-raw-support.test.ts`
  - `packages/engine/src/bare-floor-tagged-family-contract.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts`

### Open-Web Lower-Only Packaged Ceiling Lane

- current posture:
  - raw and tagged lower-only `2 x 16 mm` open-web ceiling packages are live
  - lab: `family_general`
  - field: `mixed_predicted_plus_estimated_local_guide`
  - candidate ids:
    - `ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026`
    - `ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026`
    - `ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026`
- why this does not contradict the bare closure:
  - this is a packaged lower-only ceiling lane, not a bare open-web carrier lane
  - the current family estimate stays inside explicit open-web support-form rows instead of borrowing from ambiguous generic steel families
  - schedule-equivalent contiguous lower-board splits now stay on that same branch instead of parking predictor derivation
  - neutral same-total non-packable mixed lower-board schedules also stay on that same `FL-26` branch even though the predictor blocker remains visible
  - disjoint/intervening lower-board topology no longer stays on that defended `FL-26` family-general tier; it now steps down to `low_confidence` and surfaces explicit blocker copy
  - disjoint/intervening lower-helper topology in `ceiling_fill` or `ceiling_cavity` also no longer stays on that defended `FL-26` family-general tier; it now steps down to `low_confidence` on the same conservative surface where predictor derivation was already fail-closed
  - direct final-row entry and duplicate/swap/remove-rebuild store detours now also converge back onto that same branch
- current test anchors:
  - `packages/engine/src/floor-role-topology.test.ts`
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/raw-floor-packaged-lane-audit.test.ts`
  - `apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts`
  - `packages/engine/src/floor-packaged-lane-disjoint-detour.test.ts`
  - `packages/engine/src/floor-packaged-lane-helper-disjoint-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-disjoint-route-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-disjoint-route-detour.test.ts`
  - `packages/engine/src/floor-split-layer-parity.test.ts`
  - `packages/engine/src/floor-packaged-lane-order-parity.test.ts`
  - `apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-edit-path-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-edit-path-parity.test.ts`
  - `packages/engine/src/floor-core-coverage-matrix.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts`

### UBIQ Open-Web Combined FL-28 Package

- current posture:
  - exact live lane
  - exact id: `ubiq_fl28_open_web_steel_300_exact_lab_2026`
  - lab: live `Rw`, `Ln,w`, `Ln,w+CI`
  - impact field: live `Ln,w`, `L'n,w`, `L'nT,w`, `L'nT,50`
- why it matters:
  - it is the strongest current open-web steel anchor
  - it already supports defended exact rows and family interpolation inside the FL-28 branch
- next work:
  - widen supported combined open-web families from this branch first
  - do not skip directly to a raw bare open-web lane
- current test anchors:
  - `packages/engine/src/lightweight-steel-fl28-estimate.ts`
  - `packages/engine/src/predictor-published-family-estimate.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `apps/web/features/workbench/floor-stack-invariance.test.ts`
  - `apps/web/features/workbench/complex-stack-audit.test.ts`
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-profile-boundary-matrix.test.ts`
  - `apps/web/features/workbench/floor-profile-boundary-route-matrix.test.ts`

### Composite Ceiling-Only Conservative Lane

- current posture:
  - raw and tagged composite ceiling-only packaged rows are live
  - lab: `low_confidence`
  - field: `mixed_predicted_plus_estimated_standardized_field_volume_normalization`
  - candidate ids:
    - `pmc_m1_bare_composite_lab_2026`
    - `pmc_m1_dry_floating_plus_c2x_lab_2026`
    - `pmc_m1_dry_floating_plus_c1x_lab_2026`
    - `pmc_m1_dry_floating_floor_lab_2026`
- why it stays conservative:
  - the PMC source family does support a ceiling-side continuation
  - but the visible lower-only package still does not justify silently promoting that continuation into a broader family-general reopen
  - schedule-equivalent contiguous lower-board splits now stay on the same conservative continuation instead of drifting into the bare-composite family lane
  - neutral same-total mixed-thickness lower-board schedules now also stay on that same conservative continuation even though the predictor blocker remains active
  - disjoint/intervening lower-board topology still stays on that same conservative continuation, but it now carries explicit topology notes and blocker copy instead of reading like the canonical packaged shape
  - disjoint/intervening lower-helper topology in `ceiling_fill` or `ceiling_cavity` also now stays on that same conservative continuation instead of drifting up into `family_general`
  - direct final-row entry and duplicate/swap/remove-rebuild store detours now also converge back onto that same conservative continuation
- neighboring negative guard:
  - CLT lower-only stays fail-closed on both engine and route surfaces
  - open-box lower-only also stays fail-closed on the adjacent split surface
- current test anchors:
  - `packages/engine/src/floor-role-topology.test.ts`
  - `packages/engine/src/raw-floor-packaged-lane-audit.test.ts`
  - `apps/web/features/workbench/raw-floor-packaged-lane-route-audit.test.ts`
  - `packages/engine/src/floor-packaged-lane-disjoint-detour.test.ts`
  - `packages/engine/src/floor-packaged-lane-helper-disjoint-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-disjoint-route-detour.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-disjoint-route-detour.test.ts`
  - `packages/engine/src/floor-split-layer-parity.test.ts`
  - `packages/engine/src/floor-packaged-lane-order-parity.test.ts`
  - `apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-edit-path-parity.test.ts`
  - `apps/web/features/workbench/floor-packaged-lane-helper-edit-path-parity.test.ts`
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/predictor-floor-system-estimate.test.ts`
  - `packages/engine/src/composite-panel-published-interaction-estimate.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

### Wall Stability Guardrail

- current posture:
  - wall-side work is still benchmark- and stability-driven, not widening-driven
  - the first deterministic wall audit pack now freezes the contiguous split behavior of the baseline mineral-wool row
- why it matters:
  - mixed floor/wall torture work should not quietly widen floor logic while regressing wall edit stability
- current test anchors:
  - `apps/web/features/workbench/complex-stack-audit.test.ts`
  - `apps/web/features/workbench/wall-seeded-edit-stability.test.ts`

## Current Widening And Tightening Candidates

### Open-Box Timber: Widening-First

- current implementation-backed branches:
  - `open_box basic archetype`
    - candidate id: `tuas_r2b_open_box_timber_measured_2026`
    - current gate:
      - `combined_upper_lower_system`
      - laminate floor covering
      - suspended ceiling with `2 x 13 mm` board and `~100 mm` cavity fill
      - generic `resilient_stud_ceiling` visible-layer shorthand
  - `open_box basic family_a exact`
    - candidate id: `tuas_r2a_open_box_timber_measured_2026`
    - current gate:
      - all `basic archetype` conditions except the ceiling support is explicit `tuas_open_box_ceiling_family_a`
  - `open_box dry archetype`
    - candidate id: `tuas_r5b_open_box_timber_measured_2026`
    - current gate:
      - all `basic` gate conditions
      - `generic_fill ~50 mm`
      - `dry_floating_gypsum_fiberboard ~60 mm`
      - resilient layer `~3 mm`
- why this is widening-first:
  - the family already has a defended `b` corridor anchor and stronger same-family branches
  - the explicit `family_a` surface is now available, so family splits no longer need to alias through one generic ceiling token
  - widening can stay inside the same upper-plus-lower package semantics instead of inventing a raw bare lane
- safe next move:
  - mine the TUAS measured corpus for near-match rows that preserve the same laminate-plus-ceiling family logic
  - treat `R7a` and `R6b` as branch-design questions, not blind exact imports
  - prefer tolerance and same-package widening before any new topology widening
- do not do next:
  - do not reinterpret these rows as a bare open-box impact lane
  - do not widen through disjoint upper-fill patterns or non-laminate coverings without source-backed anchors
- current contract anchors:
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

### Open-Web Steel: Widening-First

- current implementation-backed branches:
  - `ubiq_open_web_suspended_vinyl`
    - candidate ids:
      - `ubiq_fl33_open_web_steel_200_lab_2026`
      - `ubiq_fl33_open_web_steel_300_lab_2026`
      - `ubiq_fl28_open_web_steel_200_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_300_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_400_exact_lab_2026`
    - current gate:
      - `suspended_ceiling_only`
      - vinyl floor covering
      - elastic suspended ceiling
      - open-web support form explicit
  - `steel_open_web_carpet_combined`
    - candidate ids:
      - `ubiq_fl28_open_web_steel_300_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_200_exact_lab_2026`
      - `ubiq_fl28_open_web_steel_400_exact_lab_2026`
    - current gate:
      - `combined_upper_lower_system`
      - carpet with acoustic underlay
      - open-web support form explicit
- why this is widening-first:
  - the UBIQ source is strongest on defended combined or suspended packaged systems, not raw bare carriers
  - widening can continue inside the FL-28 and FL-33 style package families first
- safe next move:
  - the first same-family UBIQ sibling import pass is now complete:
    - FL-28 exact `16 mm INEX>FLOOR` open-web rows at `200`, `300`, and `400` are now imported
    - the visible `FL-28 (FRL/D)` open-web `400` row for the conservative `2 x 16 mm` ceiling family is now imported
  - the next widening move is to audit weaker open-web finish-plus-ceiling package families without leaving the explicit open-web support form
  - prefer official-table neighborhoods before any generic lightweight-steel broadening
- do not do next:
  - do not open a bare open-web impact lane from these rows
  - do not blur `open_web_or_rolled` into ambiguous steel families without an explicit support-form rule
- current contract anchors:
  - `packages/engine/src/floor-gap-ledger-contract.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `packages/engine/src/ubiq-candidate-backlog-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`
  - `apps/web/features/workbench/complex-stack-audit.test.ts`

### CLT And Dataholz CLT: Tightening-First

- current implementation-backed branches:
  - `clt_bare`
    - candidate ids:
      - `tuas_x2_clt140_measured_2026`
      - `tuas_c2_clt260_measured_2026`
    - posture:
      - measured interpolation lane
      - conservative raw-slab penalty only for truly bare slabs
  - `clt_dry`
    - candidate ids:
      - `tuas_x5_clt140_measured_2026`
      - `tuas_c5c_clt260_measured_2026`
    - posture:
      - dry upper-only and dry combined interaction branches
  - `dataholz_clt_dry`
    - candidate ids:
      - `dataholz_gdmtxn01_dry_clt_lab_2026`
      - `dataholz_gdmtxa01a_clt_lab_2026`
  - `clt_wet`
    - candidate ids:
      - `dataholz_gdmnxn06_fill_clt_lab_2026`
      - `dataholz_gdmnxn05_wet_clt_lab_2026`
  - `dataholz_clt_wet_suspended`
    - candidate ids:
      - `dataholz_gdmnxa02a_00_clt_lab_2026`
      - `dataholz_gdmnxa02a_02_clt_lab_2026`
- why this is tightening-first:
  - CLT already has multiple defended measured and published branches
  - the highest value is now deviation tightening, monotonicity, and package-strength relations, not a broader generic timber lane
- safe next move:
  - tighten within measured and published CLT subfamilies first
  - keep dry, wet, and suspended variants distinct instead of collapsing them into one universal CLT formula
- do not do next:
  - do not widen CLT by bypassing the existing TUAS and Dataholz branch structure
  - do not merge dry and wet packages into a single generic predictor lane
- current contract anchors:
  - `packages/engine/src/clt-floor-monotonicity.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/floor-family-regressions.test.ts`

## Current Local Source Corpus Snapshot

This section is implementation-backed from the current local catalog import, not from wishful roadmap assumptions.

### TUAS Exact Corpus

- open-box exact rows in the catalog: `7`
  - `tuas_r2a_open_box_timber_measured_2026`
  - `tuas_r2b_open_box_timber_measured_2026`
  - `tuas_r3a_open_box_timber_measured_2026`
  - `tuas_r3b_open_box_timber_measured_2026`
  - `tuas_r5a_open_box_timber_measured_2026`
  - `tuas_r5b_open_box_timber_measured_2026`
  - `tuas_r11b_open_box_timber_measured_2026`
- CLT exact rows in the catalog: `4`
  - `tuas_x2_clt140_measured_2026`
  - `tuas_x5_clt140_measured_2026`
  - `tuas_c2_clt260_measured_2026`
  - `tuas_c5c_clt260_measured_2026`
- current meaning:
  - the TUAS open-box and CLT branches are already using the full currently imported TUAS floor slice
  - widening here means mining additional source rows from the broader TUAS corpus, not unlocking dormant imported rows that already exist locally
  - the TUAS article reports `15` open-box floors and `15` CLT floors tested in total, so the local import is still a deliberately narrow subset rather than the full published corpus

### TUAS Candidate Import Backlog

- source universe seen in `TUAS2023FloorSoundInsulationDataR1.xlsx`:
  - open-box timber ids:
    - `R2a`, `R3a`, `R5a`, `R6a`, `R7a`, `R10a`, `R2b`, `R3b`, `R5b`, `R6b`, `R7b`, `R8b`, `R9b`, `R11b`, `R2c`
  - CLT ids:
    - `X2`, `X3`, `X4`, `X5`, `C2`, `C3`, `C4`, `C5`, `C7`, `C2c`, `C3c`, `C4c`, `C5c`, `C7c`, `C11c`
- installation-family hints from `TUAS2023FloorDetails.pdf`:
  - `R2a-R10a` share one suspended-ceiling installation family
  - `R2b-R11b` share a second suspended-ceiling installation family
  - `C2c-C11c` share a combined CLT suspended-ceiling installation family
  - explicit physical difference called out in `TUAS2023FloorDetails.pdf`:
    - `R2a-R10a` uses `25 mm` wooden laths under the open-box slab
    - `R2b-R11b` uses `25 mm` resilient steel studs under the open-box slab
- current imported subset:
  - open-box:
    - `R2a`
    - `R2b`
    - `R3a`
    - `R3b`
    - `R5a`
    - `R5b`
    - `R11b`
  - CLT:
    - `X2`
    - `X5`
    - `C2`
    - `C5c`
- completed safe open-box `b`-family tier:
  - `R2b`
    - reason:
      - `TUAS2023FloorConstructionDrawingsR1.pdf` confirms this is the basic `b`-family laminate + EPS package on the resilient-stud ceiling
      - it closes the missing lower-end `b` anchor without inventing a new visible-layer abstraction
  - `R3b`
    - reason:
      - same `b` suspended-ceiling family as imported `R5b`
      - adds a defended mid-strength packaged row instead of jumping straight from `R2b` to `R5b`
  - `R11b`
    - reason:
      - same `b` family with a wet screed top package
      - brackets the stronger end of the current `b` corridor without inventing a new ceiling-support abstraction
- completed explicit open-box `a`-family tier:
  - `R3a`
    - reason:
      - same open-box family ladder as `R2a`
      - now lands exactly because the visible-layer route can carry the family split through `tuas_open_box_ceiling_family_a`
  - `R5a`
    - reason:
      - same `a` family, materially stronger than `R3a`
      - now lands without aliasing `R5b` because the exact route distinguishes the two suspended-ceiling families explicitly
- current engine groundwork:
  - predictor-side exact inference carries an explicit `tuas_open_box_family_a` vs `tuas_open_box_family_b` support-class signal
  - the visible-layer / workbench surface now exposes `family_a` via `tuas_open_box_ceiling_family_a`
  - the generic `resilient_stud_ceiling` material stays as the shorthand for the imported `b` corridor
- deferred open-box tier:
  - `R6a`, `R7a`, `R10a`, `R6b`, `R7b`, `R8b`, `R9b`, `R2c`
  - reason:
    - still useful, but lower value than the now-completed `a/b` corridor and the remaining CLT tightening work
- post-corridor numeric screening from `TUAS2023FloorSoundInsulationDataR1.xlsx`:
  - geometry-cleared and now imported:
    - `R2b`
      - `Ln,w 55`, `Rw 62`
      - drawing result:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` shows the same visible-layer shorthand already used by the imported `b` corridor:
          - 8 mm laminate
          - 3 mm EPS underlay
          - 25 mm resilient stud ceiling
          - 2 x 13 mm gypsum board
          - 100 mm glass wool
      - implementation outcome:
        - `R2b` is now the basic `b`-family anchor
        - the generic `resilient_stud_ceiling` surface now lands on the `b` corridor rather than aliasing family `a`
  - current geometry-audit shortlist:
    - `R7a`
      - `Ln,w 60`, `Rw 60`
      - reason:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` shows a materially heavier top package:
          - 50 mm EPS
          - 40 mm screed
          - 3 mm EPS underlay
          - 8 mm laminate
        - this looks more like a separate wet/heavy `a` branch than a trivial extension of the imported `R3a -> R5a` dry corridor
    - `R6b`
      - `Ln,w 44`, `Rw 71`
      - reason:
        - `TUAS2023FloorConstructionDrawingsR1.pdf` shows a materially reinforced lower treatment:
          - four 15 mm gypsum boards total instead of the current two-board shorthand
        - this sits numerically close to the imported stronger `b` corridor, but likely needs a separate lower-treatment branch rather than a blind exact import
  - numeric deferred set until drawings prove otherwise:
    - `R6a` (`Ln,w 64`, `Rw 56`)
    - `R10a` (`Ln,w 63`, `Rw 56`)
    - `R7b` (`Ln,w 47`, `Rw 72`)
    - `R8b` (`Ln,w 50`, `Rw 72`)
    - `R9b` (`Ln,w 46`, `Rw 68`)
    - `R2c` (`Ln,w 60`, `Rw 54`)
  - why this stays research-first:
    - the spreadsheet gives trustworthy single-number values, but not enough by itself to encode the visible-layer recipe safely
    - the next safe move is to audit `TUAS2023FloorConstructionDrawingsR1.pdf` against this shortlist before importing any of these rows
- deferred TUAS CLT tier:
  - `X3`, `X4`
  - `C3`, `C4`, `C5`, `C7`
  - `C2c`, `C3c`, `C4c`, `C7c`, `C11c`
  - reason:
    - these remain worthwhile future imports, but current CLT tightening should first consume the already imported dormant Dataholz CLT slack
- current contract anchors:
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `packages/engine/src/tuas-candidate-backlog-contract.test.ts`
  - `packages/engine/src/tuas-post-corridor-screening-contract.test.ts`

### Dataholz CLT Exact Corpus

- Dataholz CLT exact rows in the catalog: `9`
- predictor-active CLT family rows today: `6`
  - `dataholz_gdmtxn01_dry_clt_lab_2026`
  - `dataholz_gdmtxa01a_clt_lab_2026`
  - `dataholz_gdmnxn06_fill_clt_lab_2026`
  - `dataholz_gdmnxn05_wet_clt_lab_2026`
  - `dataholz_gdmnxa02a_00_clt_lab_2026`
  - `dataholz_gdmnxa02a_02_clt_lab_2026`
- exact-only CLT tightening slack today: `3`
  - `dataholz_gdmnxn02_wet_clt_lab_2026`
  - `dataholz_gdmnxn02_05_wet_clt_lab_2026`
  - `dataholz_gdmtxa04a_clt_lab_2026`
- current meaning:
  - CLT has real imported slack for exact-preserving tightening without inventing a broader generic lane
  - these three dormant exact rows are the cleanest local next candidates for tightening work before any broader CLT widening

### UBIQ Open-Web Steel Corpus

- exact open-web rows in the catalog: `18`
  - `ubiq_fl24_open_web_steel_200_16mm_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_200_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_300_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_400_16mm_exact_lab_2026`
  - `ubiq_fl24_open_web_steel_400_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_200_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_300_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026`
  - `ubiq_fl26_open_web_steel_400_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_200_16mm_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_200_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_300_16mm_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_300_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_400_16mm_exact_lab_2026`
  - `ubiq_fl28_open_web_steel_400_exact_lab_2026`
- bound FL-33 open-web rows in the catalog: `3`
  - `ubiq_fl33_open_web_steel_200_lab_2026`
  - `ubiq_fl33_open_web_steel_300_lab_2026`
  - `ubiq_fl33_open_web_steel_400_lab_2026`
  - current meaning:
  - the active predictor branches already cite the full currently imported UBIQ open-web neighborhood
  - the first same-family UBIQ sibling import pass is complete, so exact-match and bound-match coverage include the missing FL-28 `16 mm` siblings and the `400 mm` conservative bound sibling
  - the adjacent-family widening passes are complete for `FL-24` and `FL-26`, so direct exact coverage now reaches both source-backed neighbors below the FL-28 corridor without dropping into the much weaker `FL-23/25/27` band
  - the lightweight-steel `lower_only` family-general fallback can now legitimately prefer the imported `FL-26` `2 x 16 mm` corridor when the visible ceiling package matches that lower profile more closely than `FL-28`
  - widening here should next mine adjacent packaged-system variants from the official UBIQ tables before any raw open-web impact lane is considered
  - the current source trace also has a visible-code drift:
    - the exact `3 x 16 mm` open-web family is visibly labeled `UBIQ FL-28` in the May 2023 brochure
    - the bound `2 x 16 mm` open-web FRL/D family is visibly labeled `UBIQ FL-28 (FRL/D)` there
    - local `ubiq_fl33_*` ids should therefore be treated as stable internal ids pending cleanup, not as the authoritative visible row code from the current source URL

### UBIQ Candidate Import Backlog

- visible source rows from the May 2023 official acoustic table on page `7`:
  - `UBIQ FL-28`
  - open-web trusses
  - `3 x 16 mm` resilient ceiling package
  - joist depths `200`, `300`, `400`
  - both `16 mm` and `19 mm INEX>FLOOR` variants are published
- visible source rows from the May 2023 official FRL/D table on page `14`:
  - `UBIQ FL-28 (FRL/D)`
  - open-web trusses
  - `2 x 16 mm` resilient ceiling package
  - joist depths `200`, `300`, `400`
  - `19 mm INEX>FLOOR`
- current imported exact subset:
  - `UBIQ FL-24`
  - `UBIQ FL-26`
  - open-web trusses
  - resilient `2 x 16 mm` fire-rated plasterboard ceiling package with `145 mm` insulation and `65 mm` cavity
  - joist depths `200`, `300`, `400`
  - both `16 mm` and `19 mm INEX>FLOOR` variants are now imported
  - `UBIQ FL-28`
  - open-web trusses
  - direct `2 x 13 mm` plasterboard ceiling package for `FL-24`
  - joist depths `200`, `300`, `400`
  - resilient `3 x 16 mm` fire-rated plasterboard ceiling package with `145 mm` insulation and `65 mm` cavity for `FL-28`
  - imported depths: `200`, `300`, `400` across all three imported families
- current imported bound subset:
  - the `200`, `300`, and `400` local `ubiq_fl33_*` open-web bound rows are imported
  - the visible May 2023 source family behind that bound package is `UBIQ FL-28 (FRL/D)`
- completed first UBIQ import tier:
  - same-family exact siblings from visible `UBIQ FL-28`:
    - `200 mm` joist, `16 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 62 / 55`
      - `Ln,w / Ln,w+Ci` with timber + underlay: `52 / 51`
    - `300 mm` joist, `16 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 63 / 57`
      - `Ln,w / Ln,w+Ci` with timber + underlay: `51 / 49`
    - `400 mm` joist, `16 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 63 / 57`
      - `Ln,w / Ln,w+Ci` with timber + underlay: `50 / 48`
  - same-family bound sibling from visible `UBIQ FL-28 (FRL/D)`:
    - `400 mm` joist, `19 mm INEX>FLOOR`
      - `Rw / Rw+Ctr = 63 / 58`
      - timber + underlay: `Ln,w <= 51`
      - carpet + underlay: `Ln,w+Ci <= 45`
  - current value:
    - exact-match and bound-match coverage now include the missing siblings inside the exact same published open-web package families the product already uses
    - this tightened corridor coverage without inventing a new topology or broadening across support-form ambiguity
- completed adjacent-family import tier:
  - visible `UBIQ FL-24`:
    - `200 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 59 / 52`, timber + underlay `Ln,w / Ln,w+Ci = 55 / 54`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 53`, timber + underlay `Ln,w / Ln,w+Ci = 55 / 54`
    - `300 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 54`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 52`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 52`
    - `400 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 54`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
  - current value:
    - this extends direct exact coverage one step below FL-28 while still staying inside the `45 or less` carpet corridor
  - visible `UBIQ FL-26`:
    - `200 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 60 / 53`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 53`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 54 / 53`
    - `300 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 62 / 57`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
    - `400 mm` joist:
      - `16 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 61 / 55`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
      - `19 mm INEX>FLOOR` -> `Rw / Rw+Ctr = 62 / 57`, timber + underlay `Ln,w / Ln,w+Ci = 53 / 51`
  - current value:
    - exact coverage now spans the defended `FL-24 -> FL-26 -> FL-28` open-web corridor while still staying inside the `45 or less` carpet band
    - the next widening question is therefore whether to stop at this corridor or deliberately enter the materially weaker `FL-23/25/27` band
- active remaining UBIQ open-web backlog:
  - imported adjacent-family exact corridor:
    - `FL-24`
    - `FL-26`
    - current reason:
      - both families stay at `45 or less` on carpet + underlay across the visible `200 / 300 / 400 mm` corridor
      - their timber + underlay values stay inside the defended `55 -> 53` band immediately below FL-28
      - this makes them credible one-step and two-step widenings without broadening into the much weaker band
  - explicitly deferred weaker families from the same acoustic table:
    - `FL-23`
    - `FL-25`
    - `FL-27`
    - current reason:
      - their timber + underlay values stay around `71 / 70 / 70` or `70 / 69 / 69`
      - their carpet + underlay values stay around `64 / 63` or `63 / 62`
      - that is materially below the current supported FL-28 corridor, so importing them next would broaden the lightweight-steel family too aggressively
  - implementation note:
    - the next step is no longer another automatic adjacent-family import
    - decide deliberately whether the product should stop at the defended `FL-24 -> FL-26 -> FL-28` corridor or widen into `FL-23/25/27` with a weaker posture
- source-trace note:
  - the current `sourceUrl` for local `ubiq_fl32_*` and `ubiq_fl33_*` rows resolves to the May 2023 brochure
  - in that brochure the visible FRL/D steel-joist family code is `FL-17 (FRL/D)` and the visible open-web FRL/D family code is `FL-28 (FRL/D)`
  - until provenance is cleaned up explicitly, keep the current internal ids stable and document the drift instead of renaming published-family lanes ad hoc
- current contract anchors:
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `packages/engine/src/ubiq-candidate-backlog-contract.test.ts`

### Dataholz Timber-Frame Corpus

- Dataholz timber-frame exact rows in the catalog: `10`
- current meaning:
  - this is a meaningful future tightening and widening surface
  - but it is not the immediate next dynamic-floor family to push while open-box and open-web widening decisions are still source-ledger work
  - keep it as a later track rather than mixing it into the current open-box/open-web research sprint

## Immediate Research Order

1. TUAS measured corpus
   - first mining target for open-box timber and CLT
   - strongest current open-access source for measured lightweight timber floor families with drawings and resilient-layer metadata
2. UBIQ official system tables
   - first widening target for open-web steel combined families
   - treat bare open-web support as a separate research question
3. Dataholz component sheets
   - first tightening target for CLT and timber family calibration
   - use them to tighten deviation, not to justify a generic universal lightweight-floor lane
4. Broader modeling literature
   - useful for later model research
   - not enough by itself to open new production lanes without family-specific source anchors

## External Sources

- TUAS open measured dataset article:
  - https://www.diva-portal.org/smash/get/diva2%3A1781019/FULLTEXT01.pdf
  - current value:
    - 30 wooden and 8 concrete floors
    - ISO 10140 / ISO 717 results
    - construction drawings and resilient-layer metadata
- TUAS raw dataset:
  - https://data.mendeley.com/datasets/y83p8mpryd/2
- UBIQ official floor systems:
  - https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf
  - current value:
    - official system tables for timber and steel joists
    - strongest current source for defended open-web combined families
- Dataholz example CLT sheet:
  - https://www.dataholz.eu/en/index/download/en/gdmtxa04a-0.pdf
  - current value:
    - exact component-level `Rw`, `Ln,w`, and `CI50` style anchors with full layer schedules
- CLT laboratory review:
  - https://www.mdpi.com/2076-3417/12/15/7642
  - current value:
    - supports the direction that multilayered CLT packages outperform bare slabs
- ANN-based wooden-floor study:
  - https://www.mdpi.com/2624-599X/4/1/13
  - current value:
    - useful as later model-research context, not as direct production evidence
- FEM timber-floor study:
  - https://www.sciencedirect.com/science/article/pii/S0141029624006928
  - current value:
    - shows model-based prediction can be reasonable with good inputs, but does not replace source-backed family lanes

## Decision Rules

- do not open a new lane merely because a family looks physically plausible
- prefer narrow same-family widening over broad cross-family formula widening
- if the best available source only supports a combined upper-plus-lower system, do not reinterpret it as a bare-carrier lane
- if the source does not defend `CI`, `DeltaLw`, or `L'nT,50`, keep those metrics conditional or unsupported
- treat this ledger as the decision checkpoint before any new floor-family widening PR
