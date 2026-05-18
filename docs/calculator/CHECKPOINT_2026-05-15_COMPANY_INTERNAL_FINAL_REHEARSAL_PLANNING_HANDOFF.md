# Checkpoint - Company-Internal Final Rehearsal Planning Handoff

Date: 2026-05-15

This checkpoint is a planning and implementation-vs-doc audit before the
final company-internal rehearsal. It does not add runtime physics by
itself. Its purpose is to make the next implementation step precise:
prove the current supported wall/floor routes, blocked inputs, visible
surfaces, and operating envelope in one final acceptance rehearsal.

## Implementation Read

Current selected action:

`company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`

Current selected test file:

`packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`

Current selected label:

final internal-use rehearsal and operating envelope.

Operating envelope doc:

`COMPANY_INTERNAL_OPERATING_ENVELOPE.md`

Code state checked in this planning iteration:

- The final rehearsal test file does not exist yet. That is the next
  implementation file, not a drift by itself.
- `packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts`
  already selects the final rehearsal through
  `COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION`
  and
  `COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE`.
- Boundary revalidation reports `finalRehearsalReady: true`; the
  remaining work is proof and operating-envelope declaration, not a new
  physics lane unless the rehearsal exposes a real mismatch.
- Current Matrix V6 contains 71 rows:
  - route: wall 36, floor 35;
  - basis: element lab 44, field/apparent 15, ASTM boundary 4,
    building prediction 8;
  - posture: family physics 39, `needs_input` 17, exact 5,
    source-anchored delta 2, unsupported 8;
  - failure class: none 42, correct block 15, hostile refusal 4,
    unsupported metric 4, basis boundary 6.
- There are 47 supported rows and no complete in-scope row should finish
  as `low_confidence`, `screening_fallback`, live nearby-row proxy, or
  lab/field/building alias in the final rehearsal.
- `pnpm calculator:gate:current` passed before this planning checkpoint;
  the final rehearsal test must be added to that gate when implemented.
- The remaining untracked worktree entries observed during planning are
  unrelated local output/PDF folders and files. Do not delete or commit
  them as part of this calculator checkpoint.

## Correct Scope

The final rehearsal is a release-readiness proof, not another broad
research pass.

In scope:

- lock supported wall/floor routes by value, basis, origin, budget, and
  support bucket;
- lock `needs_input` rows by exact missing physical fields and absence
  of guessed values/budgets;
- lock unsupported rows by basis boundary, metric boundary, or hostile
  input reason;
- prove exact-source precedence still wins over formula corridors;
- prove representative workbench/API/report/card parity is already
  covered by live surface tests and included in the current gate;
- write the operating envelope that says which scenarios are ready,
  which ask for input, and which are intentionally unsupported.

Out of scope for this final rehearsal:

- broad source crawl;
- ASTM `IIC` / `AIIC` runtime adapter;
- new measured packet ingestion;
- retuning formula values or budgets;
- aliasing lab values into field, building, or ASTM metrics.

## Ordered Implementation Plan

1. Create the final rehearsal contract test.

   File:

   `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`

   It should import the current Matrix V6 rows and the building/ASTM
   boundary revalidation summary from the mainline matrix module instead
   of re-creating fixtures. The test should read as the final release
   proof for the calculator routes, not as another source-library gate.

2. Classify every matrix row into release buckets.

   Required buckets:

   - `release_supported`: supported numeric or exact results with named
     family/source basis and visible tolerance or error budget where
     source-absent;
   - `release_needs_input`: rows that are blocked only because a named
     physical input is missing;
   - `release_unsupported_boundary`: rows intentionally unsupported
     because the requested basis/metric is not owned;
   - `release_hostile_refusal`: duplicate, unsafe, excessive, invalid,
     ambiguous, or out-of-range user input refused without a fake value;
   - `release_exact_precedence`: exact measured/source rows that must
     beat formula corridors and nearby candidates.

3. Assert global matrix invariants before scenario details.

   The rehearsal should fail fast if the shape of the calculator changes
   unnoticed:

   - total rows remain 71;
   - wall rows remain 36 and floor rows remain 35;
   - basis counts remain element lab 44, field/apparent 15, ASTM
     boundary 4, building prediction 8;
   - posture counts remain family physics 39, `needs_input` 17, exact 5,
     source-anchored delta 2, unsupported 8;
   - failure-class counts remain none 42, correct block 15, hostile
     refusal 4, unsupported metric 4, basis boundary 6;
   - no complete in-scope row resolves to `low_confidence`,
     `screening_fallback`, live nearby-row proxy, or basis alias;
   - boundary revalidation still selects the final rehearsal file and
     reports `finalRehearsalReady: true`.

4. Pin representative supported routes by family and basis.

   Do not manually duplicate all 47 supported rows as long prose. Build a
   compact representative pack that covers each ready family:

   - wall lab: heavy masonry/concrete, AAC/non-homogeneous masonry,
     laminated board, double/framed, resilient bar, grouped multi-cavity,
     lined massive/masonry, CLT/mass-timber, double split board,
     opening/leak composite, heavy composite;
   - wall field/building: field room-context `R'w` / `DnT,w`, complete
     building prediction, opening/leak field/building, A-weighted
     opening/leak field/building;
   - floor lab: heavy concrete floating floor, lightweight steel
     formula/exact, timber/CLT impact, steel suspended ceiling,
     reinforced concrete combined and bare/upper-only variants;
   - floor field/building: impact field adapters, low-frequency
     `L'nT,50`, steel field adapter, exact field precedence.

   Pin the values that form the acceptance spine, including:

   - opening/leak lab `Rw 38.2` and A-weighted field/building
     `Dn,A 35.9`, `DnT,A 36.1`, `DnT,A 31.3`;
   - heavy composite lab `Rw 63` and field `R'w 60` / `DnT,w 61`;
   - lightweight steel formula `Ln,w 55.6` / `DeltaLw 22.4`;
   - timber `Ln,w 51` / `DeltaLw 25.2`;
   - CLT `Ln,w 50` / `DeltaLw 22.6`;
   - steel suspended ceiling `Ln,w`, `DeltaLw`, and `L'nT,50` rows;
   - reinforced-concrete combined formula/exact/bare/field rows;
   - exact-source rows staying exact.

5. Pin blocked rows by reason, not by generic failure.

   The rehearsal must prove the calculator asks for the right missing
   inputs instead of silently inventing values:

   - building partial context still names owners such as
     `sourceRoomVolumeM3`;
   - A-weighted routes without `frequencyBandSet` remain blocked;
   - lab-to-field/building and ISO-to-ASTM aliases remain unsupported;
   - building `Dn,A` remains unsupported while building `DnT,A` is the
     owned A-weighted runtime;
   - duplicate/ambiguous/excessive opening packages remain refused;
   - duplicate steel carriers, wrong steel support families, invalid
     thickness, ASTM requests, and unsafe topology edits remain refused;
   - blocked rows do not expose source-absent budgets or misleading
     numeric value pins.

6. Add a visible-surface proof-owner ledger.

   The final rehearsal does not need to click every UI card again if the
   surface parity tests already own those paths. It should instead prove
   the current gate includes the relevant proof-owner files for:

   - workbench live evaluation;
   - local saved replay;
   - server snapshot replay;
   - output cards;
   - Markdown report payload;
   - calculator API payload;
   - impact-only API payload where floor impact routes are involved.

   If a supported family has no current proof-owner test for its visible
   surface, add the smallest missing surface assertion before declaring
   internal readiness.

7. Integrate the final rehearsal into the current gate.

   Add the new final rehearsal test to:

   `tools/dev/run-calculator-current-gate.ts`

   The gate should fail if a future change updates Matrix V6 or boundary
   behavior without updating the final internal-use rehearsal and
   operating envelope.

8. Write the operating envelope after the test proves green.

   The operating envelope should be a short, plain document section in
   the living docs. Keep `COMPANY_INTERNAL_OPERATING_ENVELOPE.md`
   aligned with the executable rehearsal. It must state:

   - ready-for-internal-use supported routes;
   - routes that ask for additional input;
   - routes intentionally unsupported;
   - exact-source precedence behavior;
   - tolerance/error-budget posture for source-absent formulas;
   - known non-blocking follow-ups.

9. Validate in this order.

   - Run the new focused final rehearsal test.
   - Run the related Matrix V6 and boundary revalidation tests.
   - Run the surface proof-owner tests touched by any fix.
   - Run `pnpm calculator:gate:current`.
   - Run `git diff --check`.

## Ready Declaration Criteria

The project can be called controlled company-internal ready when all of
these are true:

- the final rehearsal test is green and part of
  `pnpm calculator:gate:current`;
- all complete in-scope supported rows have values, basis, origin, and
  tolerance/error-budget posture locked;
- all incomplete rows name exact missing physical fields;
- all unsupported rows explain the metric/basis boundary without
  leaking values;
- workbench/API/report/card parity has proof-owner coverage for the
  supported runtime families;
- the living docs contain the operating envelope and no longer point to
  boundary revalidation as the active next slice.

## Stop Conditions

Do not declare company-internal readiness if any of these appears:

- a complete in-scope row still resolves to `low_confidence`,
  `screening_fallback`, live nearby-row proxy fallback, or basis alias;
- a row with missing physical context returns a numeric value or
  source-absent budget;
- a supported runtime family has no visible-surface proof owner;
- final rehearsal forces new runtime physics rather than only proving
  existing Matrix V6 behavior;
- a UI/API/report surface shows different value, basis, or budget from
  the engine row.

If a stop condition appears, make a narrow implementation fix and update
the operating envelope honestly. Do not broaden into a source crawl or
ASTM runtime adapter from this final rehearsal.

## Non-Blocking Follow-Ups

These remain useful after controlled internal readiness but should not
block the final rehearsal if the current Matrix V6 proof stays green:

- ASTM `IIC` / `AIIC` runtime adapter;
- larger source-owned calibration and holdout packets;
- tighter formula budgets after enough same-family evidence exists;
- broader exact-source promotion;
- richer UI copy and product polish.
