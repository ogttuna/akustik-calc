# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate C Handoff

Date: 2026-04-30

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: C

Status: LANDED / RESEARCH PLAN / NUMERIC HOLD

Follow-up status: SECOND SOURCE-READINESS ITERATION COMPLETE on
2026-04-30. This follow-up did not move runtime. It sharpened Gate D so
the next agent can extract source rows in priority order instead of
guessing a fixed triple-leaf penalty.

Gate C status:

`gate_c_researched_triple_leaf_physics_and_selected_source_pack_extraction_before_any_numeric_promotion`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`

## Decision

Gate C keeps the current split-rockwool answer on the existing
low-confidence `multileaf_screening_blend`. It does not promote,
retune, or re-label the `Rw 41` result as accurate.

The researched evidence is strong enough to define the implementation
path, but not enough to approve runtime numeric movement:

- NRC's 2024 measured triple-leaf paper shows that putting gypsum board
  inside a double-stud cavity can create two mass-air-mass resonances
  and large low-frequency transmission-loss dips. That validates the
  defect family and makes a large drop plausible.
- NRC's 1998 gypsum-board wall transmission-loss report is the strongest
  local parser-ready corpus because it carries one-third-octave
  transmission-loss data and construction details. It is baseline /
  negative-boundary evidence until Gate D proves which rows, if any,
  map into the triple-leaf lane.
- Uris et al. 2006 is a measured Applied Acoustics internal-gypsum-board
  double-frame paper and is promising for Gate D, but only if full
  curves and exact topology can be accessed. Abstract-level weighted
  index deltas are not runtime truth.
- Warnock / NRC concrete-block drywall guidance is adjacent
  negative-boundary evidence for lined masonry and attached drywall
  resonance behavior. It must not calibrate steel-stud internal-board
  rows directly.
- Ballagh's triple-panel low-frequency model gives a plausible solver
  shape: three masses and two air springs with two interacting
  resonances. It still needs local damping/coupling calibration and
  mid/high-frequency handling before it can own `Rw`.
- ISO 10140-2, ISO 717-1, and ISO 12354-1 define the measurement,
  single-number rating, and building-prediction boundaries. They do not
  authorize a hand-tuned single number.

Primary source locators now pinned in the plan:

- `https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2`
- `https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f`
- `https://www.sciencedirect.com/science/article/pii/S0003682X05001799`
- `https://nrc-publications.canada.ca/eng/view/object/?id=8fe95aff-adf1-4a91-bc2e-f150870a5aee`
- `https://new.acoustics.org.nz/wp-content/uploads/Ballagh_K_NZA2013.pdf`
- `https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79487.html?browse=tc`
- `https://www.iso.org/standard/77435.html`
- `https://www.iso.org/standard/70242.html`

Follow-up extraction priority:

1. `P0` NRC 2024 internal-gypsum double-stud: extract assembly short
   codes, STC values, resonance estimates, and determine whether plotted
   curves can be digitized for bounded calibration.
2. `P0` NRC 1998 gypsum-board wall TL data: extract parser-ready `TestID`
   rows, `STC`, band TL, element descriptions, densities, stud spacing,
   insulation, double-stud baselines, and negative boundaries.
3. `P1` Uris 2006 internal gypsum board: use only after full curves and
   construction topology are available; otherwise qualitative.
4. `P1` Ballagh 2013: solver equations and assumptions only.
5. `P2` Warnock / NRC concrete-block drywall: adjacent negative boundary
   for lined masonry / attached drywall, not steel-stud runtime
   calibration.

## Numeric Hold Reasons

Gate C blocks runtime movement because the project still lacks:

- a local triple-leaf source corpus with extracted band curves;
- a validated local material mapping for the user stack
  (`gypsum_board`, `mlv`, `rockwool`, `gypsum_plaster`);
- calibrated damping and bridge/coupling parameters;
- holdout tolerance for the triple-leaf solver family;
- web-visible grouped topology route/report tests;
- field `R'w` / `DnT,w` overlay ownership after the lab curve is owned.

## Next Sequence

1. Gate D - source-pack extraction and calibration corpus:
   `packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`.
   Extract candidate rows and classify whether band curves,
   construction details, topology, metric, and tolerance are complete
   enough for local use. Every row stays `directRuntimeReadyNow: false`
   until Gate G/H provide calibration and fail-closed integration.
2. Gate E - source-corpus classifier and negative boundaries:
   exact row, bounded calibration, qualitative-only, and rejection-only
   classes; protect double-leaf, lined-masonry, one-side lining,
   simple-stud, and floor rows.
3. Gate F - frequency-band solver skeleton:
   three-leaf/two-cavity curve builder that predicts resonance bands and
   produces ISO 717-ready curves without moving dynamic runtime.
4. Gate G - calibration and holdout tolerance:
   damping/coupling parameters, source-family MAE/max-error thresholds,
   and explicit reject behavior when thresholds fail.
5. Gate H - engine integration fail-closed:
   promote only grouped topology plus source-calibrated solver pass;
   otherwise keep `multileaf_screening_blend` low confidence.
6. Gate I - web-visible grouped topology inputs:
   Side A, cavity 1, internal leaf, cavity 2, Side B, coupling, support
   topology, route-card, output-card, and proposal/report visibility.
7. Gate J - Company-Internal Acceptance Rehearsal:
   user PDF repro, exact rows, near rows, hostile reorder, many-layer,
   missing-input, lab, `R'w`, and `DnT,w` scenarios pinned together.

## Frozen Surfaces

Gate C freezes:

- runtime numeric values;
- support status;
- confidence promotion;
- evidence promotion;
- route-card values;
- output-card status;
- proposal/report copy;
- workbench UI behavior.

## Validation

Pre-edit current gate completed green on 2026-04-30:

- `pnpm calculator:gate:current`
  green before Gate C edits: engine 163 files / 825 tests, web 45 files
  / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate C focused validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts src/wall-triple-leaf-accuracy-recovery-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30: 3 files / 14 tests.

Post-edit current gate completed:

- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate C to the current runner: engine
  164 files / 829 tests, web 45 files / 216 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.

Second source-readiness iteration validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts --maxWorkers=1`
  green on 2026-04-30 after adding the Gate D extraction-priority
  contract: 1 file / 5 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after the follow-up research iteration: engine
  164 files / 830 tests, web 45 files / 216 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
- `git diff --check`
  clean on 2026-04-30.
