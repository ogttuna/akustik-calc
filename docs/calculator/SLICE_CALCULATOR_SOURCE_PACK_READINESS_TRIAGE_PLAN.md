# Slice Plan - Calculator Source Pack Readiness Triage v1

Status: GATE A LANDED / SELECTED NEXT SLICE (selected 2026-04-29 by
`post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`;
Gate A landed 2026-04-29 in
`calculator-source-pack-readiness-triage-gate-a-contract.test.ts`).

Landed implementation file:

`packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`

Selected follow-up:

`clt_mass_timber_wall_source_pack_extraction_v1`

Next implementation file:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

Selection reason: `internal_use_operating_envelope_v1` closed at Gate C.
The company internal operating envelope is now explicit, but no
source-ready accuracy pack can be promoted without more topology,
metric, tolerance, and negative-boundary evidence. The next bounded
calculator action is therefore to rank source-pack readiness before any
runtime import.

Gate A result: no runtime import is selected. CLT / mass-timber is the
highest-ranked no-runtime extraction candidate because concrete
WoodWorks/NRC source surfaces can now be named, but STC/ASTC-to-ISO
metric handling, exact row extraction, tolerance ownership, and paired
runtime-visible tests remain blockers before any import or confidence
promotion.

## Objective

Rank candidate source packs and decide whether any one can become an
active source/research slice with:

- exact topology and material/thickness mapping;
- metric owner and lab/field context;
- tolerance owner;
- protected negative boundaries;
- paired engine and web route-card or report tests.

This slice must not change acoustic formulas, runtime values, support
classes, confidence classes, evidence tiers, API shape, route-card
values, or output-card statuses.

## Candidate Families

| Candidate | Current posture | First missing prerequisite |
|---|---|---|
| timber double-board stud wall | formula-owned, low-confidence, source-gated | direct double-board timber topology row or bounded formula tolerance owner |
| CLT / mass-timber wall | formula-owned, medium-confidence, source-gated | wall-specific CLT/NLT/DLT row pack or laminated-leaf tolerance owner |
| lined-massive / heavy-core wall | screening | wall-specific lined concrete/heavy masonry row or bounded lining rule |
| no-stud double-leaf wall | formula-owned/source-blocked | no-stud/no-rail direct row mapping or local Davy/Sharp tolerance owner |
| generated floor fallback | low-confidence/screening | exact Pliteq/UBIQ topology match or bounded steel/open-web family rule |
| historical blocked families | fail-closed | new source evidence for `GDMTXA04A`, `C11c`, or true bare carrier impact behavior |

## Implementation And Source Recheck - 2026-04-29

This planning iteration re-read the active Gate C contract, the prior
source-research contracts, the source-gap ledger, the comprehensive
roadmap, and current external source surfaces. The result does not
change runtime posture.

Implementation anchors:

- Gate C selected this slice in
  `packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`.
- Timber double-board blockers are already executable in
  `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`.
- CLT / mass-timber blockers are already executable in
  `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`.
- Lined-massive / heavy-core blockers are already executable in
  `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`.
- No-stud double-leaf blockers are already executable in
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`.
- Floor fallback blockers are already executable in
  `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`.

External source recheck:

- Knauf UK Drywall Systems Performance Guide, April 2026:
  `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
  remains useful for timber stud and resilient-bar timber rows. It does
  not by itself unlock the live direct double-board generated stack:
  the known resilient-bar and adjacent rows still have side-count,
  board, fill, or direct-connection mismatches.
- Knauf AU Systems+ October 2025:
  `https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus`
  is a current source-intake surface for lightweight systems including
  CLT context, but table-level row extraction and local topology mapping
  are still required before any contract can use it.
- WoodWorks mass-timber acoustic inventory:
  `https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf`
  is the strongest newly rechecked wall-side source reservoir because it
  has explicit mass-timber wall tables. It is still not an import pack:
  many values are STC/ASTC oriented and must be mapped or rejected
  against DynEcho ISO `Rw` / field outputs.
- WoodWorks Mass Timber Fire & Acoustic Database:
  `https://www.woodworks.org/resources/inventory-of-fire-resistance-tested-mass-timber-assemblies-penetrations/`
  should be treated as a living pointer to test reports, not as a
  copied source row. Any selected row must name its report and metric
  context.
- NRC mass-timber report archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=e38fb723-6a4c-4a78-9e47-5a73c92c448f`
  and the NLT addendum
  `https://nrc-publications.canada.ca/eng/view/ft/?id=9e3b39be-e0ed-415b-9649-3e7ec228f52c`
  are useful for mass-timber measured transmission-loss and flanking
  context. They may support a later tolerance-owner or frequency-band
  extraction slice, but Gate A must keep single-number import blocked
  until the metric mapping is explicit.
- UBIQ INEX FLOOR fire/acoustic tables:
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`
  remain useful for steel/open-web floor topology checks. They do not
  promote `floor-steel-fallback`: the generated fallback still lacks
  the exact INEX deck, covering, ceiling, and support topology required
  by the existing floor fallback contract.

## Provisional Readiness Ladder

Gate A should encode this ladder as evidence, not as a runtime decision.
Every row remains `runtimeImportReadyNow: false`.

| Rank | Candidate | Strongest current evidence | Gate A decision shape |
|---|---|---|---|
| 1 | CLT / mass-timber wall | WoodWorks wall tables plus NRC measured mass-timber data make this the strongest extraction candidate | select no-runtime row/metric extraction only if exact table/report locators, metric owner, and negative boundaries can be named |
| 2 | timber double-board stud wall | Knauf UK 2026 and existing timber source corpus contain adjacent timber/resilient rows | hold runtime; extract only if a direct live-stack row or bounded timber formula tolerance can be named |
| 3 | no-stud double-leaf wall | Davy/Sharp scope plus NRC archive remain relevant | hold runtime; derive local formula inputs and single-number tolerance before any value movement |
| 4 | generated floor fallback | Pliteq/UBIQ exact and bound rows already prove precedence when topology matches | hold fallback; build topology-delta evidence before any exact/bound promotion |
| 5 | lined-massive / heavy-core wall | current source research found only floor-only or adjacent lining context | hold screening; require a wall-specific lined-heavy source row or bounded lining rule |
| 6 | historical blocked families | prior dedicated designs closed fail-closed | keep closed unless new source evidence directly satisfies the old blocker |

The practical next hypothesis is therefore:

- Gate A should not select a runtime import.
- Gate A may select a no-runtime `clt_mass_timber_wall_source_pack_extraction_v1`
  follow-up only if it names concrete WoodWorks/NRC table or report
  locators and makes STC/ASTC-to-ISO handling an explicit blocker.
- If Gate A cannot name those locators cleanly, it should select no
  source-research slice and leave the comprehensive roadmap as context.

## Gate A - Rank Source Pack Readiness - Landed

Gate A added:

`packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`

The contract is no-runtime and ranks candidate packs by
readiness and blocker type. It may select a narrow source-research slice
only if it can name topology, metric, tolerance, negative boundaries,
and paired tests. If no candidate reaches that bar, it should keep
[CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
as roadmap context and select no runtime import.

Landed decision:

- `runtimeImportSelectedNow: false`
- `supportConfidenceEvidencePromotion: false`
- `nextSliceCandidate: clt_mass_timber_wall_source_pack_extraction_v1`
- `targetFirstGateFile:
  packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`
- `selectedPlanningSurface:
  docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`

Required Gate A evidence fields:

- candidate id, current posture, and user-visible risk;
- source or formula owner, if any;
- missing topology, metric, tolerance, or negative-boundary prerequisite;
- positive and negative test shape required before runtime import;
- selected next action or roadmap-only reason.

Recommended contract shape:

1. `SOURCE_PACK_READINESS_DIMENSIONS`
   - `topologyMappingComplete`;
   - `metricContextMapped`;
   - `toleranceOwnerNamed`;
   - `negativeBoundariesExecutable`;
   - `pairedEngineTestsNamed`;
   - `pairedWebTestsNamed`;
   - `runtimeImportReadyNow`.
2. `SOURCE_PACK_CANDIDATES`
   - one object for each ladder row above;
   - each object must include existing implementation evidence owners,
     external source pointers when relevant, blockers, allowed next
     action, and `runtimeBehaviorChange: false`.
3. `GATE_A_DECISION`
   - `runtimeImportSelectedNow: false`;
   - `supportConfidenceEvidencePromotion: false`;
   - `nextSliceCandidate` is either
     `clt_mass_timber_wall_source_pack_extraction_v1` as no-runtime
     extraction work, or `roadmap_only_no_source_pack_ready`;
   - `reason` must mention the first missing requirement for every
     candidate that was not selected.

Minimum tests in the Gate A contract:

- asserts the slice lands no-runtime and all required planning surfaces
  exist;
- asserts every candidate is represented exactly once and has at least
  one missing requirement before runtime import;
- asserts no candidate has `runtimeImportReadyNow: true`;
- asserts CLT/mass-timber can outrank the others only for source-row
  extraction, not runtime import;
- asserts timber, no-stud double-leaf, floor fallback, lined-massive,
  and historical blocked families keep their existing negative
  boundaries;
- asserts any selected follow-up names the first target file and docs to
  update.

Expected first target if Gate A selects extraction:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

Expected planning doc if Gate A selects extraction:

`docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`

That follow-up must still be no-runtime unless a later contract extracts
an exact row, maps metric context, names tolerance ownership, and pairs
engine plus web route-card/report tests.

## Validation

- Run `pnpm calculator:gate:current` before and after touching the
  selected slice.
- Use the Gate A engine contract test while iterating.
- Add the Gate A contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run `git diff --check`.
- Run `pnpm check` when the slice changes broad repo contracts or when
  a commit needs a full green gate.
