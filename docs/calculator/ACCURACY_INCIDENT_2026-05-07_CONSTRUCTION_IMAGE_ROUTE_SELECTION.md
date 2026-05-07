# Accuracy Incident 2026-05-07: Construction Image Route Selection

Document role: post-Gate-Z accuracy incident plan for Dynamic Calculator.
This file records why the construction-image examples exposed a real
calculation risk, what external research says, and what must be fixed
after Gate Z. It does not supersede the active Gate Z field-impact
runtime work.

## Status

Status: Gate AA wall route-selection recovery landed; Gate AB floor
family/source guard remains next.

Do not solve this as a narrow `50 mm -> 80 mm` patch. The important
defect is that the calculator can have a physically relevant solver
available, miss it because the route selector is benchmark-fixture
specific, and then let a low-order screening/family blend produce the
visible result.

## Incident Summary

The user supplied five realistic construction details: two internal
walls, one exterior wall, one modular ceiling, and one modular floor.
The strongest repro is the shared-wall detail with gypsum/MLV/80 mm
mineral wool/internal gypsum/air/gypsum/80 mm mineral wool/gypsum/MLV
leaves.

Observed local probe before Gate AA:

- Flat or incomplete route selection produced roughly `Rw 40-42`, via
  the generic multi-leaf screening blend.
- Calling the existing three-leaf/two-cavity frequency solver directly
  on the explicit grouped 80/80 mm topology produced a materially higher
  result than screening, proving the primary defect was route selection.
- The app path therefore underpredicted primarily because it failed to
  route the stack to the better physics solver, not because no physics
  solver existed.

Gate AA result:

- the explicit grouped shared-wall construction-image stack now selects
  `triple_leaf_two_cavity_frequency_solver`;
- app path and direct solver agree at `Rw 61`, `STC 61`, `C -1.7`, and
  `Ctr -6.8`;
- the selector accepts a physical grouped triple-leaf cavity domain
  rather than a `50/50 mm` or `80/80 mm` fixture;
- flat-list ACON-like input remains `needs_input` until grouped topology
  is provided.

Gate AA validation completed on 2026-05-07: focused Gate I/AA/G/J/M
regression passed 5 files / 32 tests. Engine typecheck passed. `pnpm
calculator:gate:current` passed with engine 307 files / 1749 tests, web
62 files / 275 tests plus 18 skipped, repo build, and whitespace guard.
Known optional `sharp/@img` Next build warnings remain non-fatal.

This is an accuracy bug. Confidence labels, caveats, or final-answer
wording are not the fix. The calculator must select and run the correct
algorithm when the physical inputs are present.

## Root Cause

1. Benchmark fixture leaked into solver eligibility.

   `dynamic-airborne-gate-g-rockwool.ts` currently recognizes the grouped
   Rockwool triple-leaf runtime path only when both cavities are
   approximately 50 mm. That was enough for the Gate G fixture, but it is
   not the physical domain of the three-leaf/two-cavity solver.

2. Fallback can win after a missed solver.

   `dynamic-airborne.ts` classifies `visibleLeafCount >= 3` or
   `cavityCount >= 2` as `multileaf_multicavity`, then falls back to
   `multileaf_screening_blend` if the narrow Gate G selector returns
   null. For a complete grouped topology, this should be illegal when
   a domain-compatible solver can compute a curve.

3. Tests protected route boundaries, not real numeric coverage.

   Existing tests prove that a 50/50 mm grouped fixture reaches the Gate
   G solver and that some ACON-like flat-list stacks do not incorrectly
   enter double-leaf/framed lanes. They do not yet prove that realistic
   grouped 80/80 mm construction details reach the correct solver and
   stay inside a defensible numeric band.

4. Source absence and physics eligibility are still too easy to confuse.

   Exact measured/source rows should override or calibrate only when
   topology/material/metric/tolerance ownership is present. Their absence
   must not demote a complete physical topology from a family solver to
   screening.

5. The floor path has the same class of risk.

   Lightweight steel floor stacks can drift toward broad published-family
   blending. If the explicit support is steel joist/purlin, nearby
   concrete or timber rows must not become numeric anchors. They may be
   diagnostics only. Same-family measured rows, steel-family bound
   interpolation, or a floor-impact physics model must own the value.

## Implementation Comparison - 2026-05-07

This incident is not caused by a missing acoustic concept. The current
engine already contains several of the right building blocks, but they
are not yet composed as a domain-first calculator.

| Area | Current implementation | Accuracy risk | Gate AA action |
| --- | --- | --- | --- |
| Grouped triple-leaf wall route | `dynamic-airborne-gate-g-rockwool.ts` only accepts `grouped_triple_leaf` when both cavities are about `50 mm` and the basis text says both cavities are `50 mm` Rockwool. | A real 80/80 mm grouped wall misses the available solver and falls to screening. | Replace fixture eligibility with a physical domain: three owned leaf groups, two positive cavity depths in an allowed range, absorber coverage, internal leaf group, support/coupling class, and material-family compatibility. |
| Dynamic airborne precedence | `dynamic-airborne.ts` tries Gate G, then Gate S, then `chooseBlend`. For `multileaf_multicavity`, `chooseBlend` selects `multileaf_screening_blend`. | A missed solver silently becomes a visible numeric answer. | Add a route invariant: complete grouped multi-cavity topology must select a compatible family solver, exact/calibrated source, bound, `needs_input`, or `unsupported`; generic screening cannot own the value. |
| Triple-leaf frequency solver | `wall-triple-leaf-frequency-solver.ts` groups side A / internal / side B leaves, computes two mass-air-mass resonances, resonance dips, porous damping, cavity-depth lift, coupling penalties, and ISO/STC ratings from a curve. | The direct solver can produce the right family candidate, but runtime eligibility is too narrow. | Generalize the selector around solver input readiness, then test app-path and direct-solver parity on the incident stack. |
| Double-leaf/framed bridge route | `dynamic-airborne-gate-s-double-leaf-framed.ts` already shows the desired pattern: build a curve, expose exact/calibrated/physics candidates, keep STC separate from Rw, and select by precedence. | Triple/multi-leaf route lacks the same mature candidate-resolution shape. | Reuse this resolver posture for triple/multi-leaf: exact source, calibrated family, anchored delta, uncalibrated physics, screening as last resort only. |
| Rating and field overlays | `curve-rating.ts` implements mass-law curves, ISO 717-style Rw/C/Ctr adapters, ASTM STC adapter separation, and `DnT,w` geometry normalization from curve overlays. | Formula work can regress basis separation if new routes return only a single number. | Gate AA tests must assert curve basis, rating adapter, `Rw != STC` ownership, and lab/field/report parity. |
| Heavy floor impact path | `impact-estimate.ts` owns narrow heavy-concrete formulas only: bare floor `Ln,w ~= 164 - 35 log10(m')`, floating floor `DeltaLw ~= 13 log10(m'load) - 14.2 log10(s') + 20.8`, and `f0 ~= 160 sqrt(s'/m'load)`. | These formulas are not valid ownership for lightweight steel modular floors. | Keep the heavy-concrete path narrow and add explicit negative tests proving steel floors cannot borrow it. |
| Lightweight steel bound path | `lightweight-steel-bound-estimate.ts` can interpolate UBIQ FL-32/FL-33 style rows, but only when the exact INEX/engineered timber/resilient ceiling/2 x firestop-board topology is present. | The user modular floor is steel-family but not necessarily UBIQ-topology. The engine may need a same-family bound or `needs_input`, not a fabricated exact `Ln,w`. | Add steel-family route decisions: exact UBIQ bound, same-family steel measured bound, steel physics route, or missing-input prompt. |
| Floor family matching | `floor-system-estimate.ts` still has broad family/archetype thresholds and diagnostic lanes. | A broad nearby row can look convenient even when structural support is wrong. | Enforce hard same-structural-family ownership before any numeric source anchor for `Ln,w`, `L'n,w`, `L'nT,w`, `Rw`, or `Rw+Ctr`. |

## External Research Baseline

Sources checked on 2026-05-07:

- INSUL manual, Marshall Day Acoustics:
  https://www.insul.co.nz/media/30049/Insul-Manual-2017-word-version.pdf

  INSUL separates Wall, Ceiling, Floor, Roof, Glazing, and Porous routes.
  Wall/Ceiling calculate transmission loss or sound reduction levels for
  cavity constructions; Floor calculates impact sound insulation with or
  without ceilings; Porous materials can be modelled by density,
  thickness, and flow resistivity. The lesson for DynEcho is route- and
  family-specific calculation, not finite catalog lookup.

  The manual also shows the direction DynEcho should take for missing
  material data: custom materials are defined by density, the
  critical-frequency/surface-mass product or elastic modulus, and
  damping. Its double-panel section is built around mass-air-mass
  resonance, cavity behavior, absorber, and frame connection type. Its
  triple-panel section explicitly treats two-air-gap constructions as an
  extension of double-panel theory and warns that accuracy decreases as
  the number of elements rises. DynEcho should therefore expose required
  material/coupling inputs and widen tolerance for multi-leaf predictions
  until measured calibration exists; it must not demote them to screening
  when physical inputs are complete.

- INSUL product feature summary, Navcon:
  https://navcon.com/resources/software/insul/

  The distributor page confirms that INSUL predicts walls, floors,
  ceilings, glazing, single/double/triple/quad panels, Rw/STC/OITC,
  DnT,w, Ln,w/IIC, profiled metal sheets, and frequency results from
  50 Hz to 5 kHz using quick theoretical models plus a material
  database. This reinforces the calculator architecture: material data is
  input support, not the product itself.

- ISO 12354-1:2017:
  https://www.iso.org/standard/70242.html

  ISO describes airborne building-acoustic estimation from measured
  direct/indirect element data plus theoretical propagation models, with
  detailed 1/3-octave frequency-band calculation from 100 Hz to 3150 Hz,
  optionally down to 50 Hz when element and junction data exist. The
  lesson is basis separation: element/lab, field/apparent, flanking, and
  uncertainty are different owners.

- ISO 12354-2:2017:
  https://www.iso.org/standard/70243.html

  Impact sound prediction likewise uses measured element data, direct and
  indirect/flanking transmission, theoretical propagation, and frequency
  bands. The floor path must not relabel lab `Ln,w` as field `L'n,w` /
  `L'nT,w`; Gate Z owns this boundary.

- ISO 717-1:2020 and ISO 717-2:2020:
  https://www.iso.org/standard/77435.html
  https://www.iso.org/standard/69867.html

  ISO 717 defines single-number rating quantities from one-third-octave
  or octave-band measurements. DynEcho acceptance must therefore check
  curve basis and rating adapter basis, not only final `Rw` or `Ln,w`.

- Mass-air-mass resonance model reference:
  https://app.impulsion-acoustique.fr/doublewall

  The published calculator presents the standard reduced-mass oscillator
  form: `f_msm = (1 / 2pi) * sqrt(s'_g / m'_red)`, where
  `m'_red = (m1 * m2) / (m1 + m2)` and the gas stiffness is
  `s'_g = rho0 * c0^2 / d`. This is the same physical shape as the
  current DynEcho triple-leaf solver's per-cavity resonance term. Gate AA
  should make that relationship explicit in tests and basis metadata.

- British Gypsum GypWall Twin Frame Independent:
  https://www.british-gypsum.com/Systems/internal-partitions-walls/gypwall-twin-frame-independent

  British Gypsum publishes high-performance twin-frame separating walls
  in the `Rw 63-70 dB` range to BS EN ISO 10140-2. This is not an exact
  match to the user image, but it is a strong sanity check that a
  massive, insulated, twin-frame-like gypsum assembly should not casually
  collapse to `Rw 40-42` unless bridging, leakage, or a modeled
  triple-leaf penalty justifies it.

- NRC / Canadian Acoustics 2024 triple-leaf wall paper:
  https://nrc-publications.canada.ca/eng/view/object/?id=768bf32f-8313-435f-ab85-8680efba61b2

  The paper reports that installing gypsum board inside double steel-stud
  cavities can create a triple-leaf wall with two mass-air-mass
  resonances and sharply reduced low-frequency transmission loss below
  200 Hz. The observed low-frequency reductions were material, but this
  supports running a triple-leaf frequency solver, not replacing it with
  a generic screening blend.

- Crocker and Price, Sound Transmission Using Statistical Energy
  Analysis:
  https://internoise2018.org/assets/documents/6_Crocker_and_Price.pdf

  This is a primary reference for SEA-style transmission prediction. It
  explains why mass law alone is incomplete: stiffness, damping, finite
  panel size, modal radiation, and coincidence-region behavior matter.
  DynEcho does not need to land a full SEA solver in Gate AA, but the
  roadmap should reserve it as the next model family when empirical
  calibration and current mass-air-mass solvers are not enough.

- SONarchitect ISO method page:
  https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/isoen12354

  SONarchitect references matrix transfer function methods and classic
  double/triple partition literature such as Crocker/Price, Brekke, and
  London. This is a research queue for DynEcho's generalized multi-layer
  solver roadmap.

- UBIQ INEX floor fire/acoustic data:
  https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FIRE-ACOUSTIC_250602_1.pdf

  UBIQ publishes lightweight steel/open-web floor systems with `Rw`,
  `Rw+Ctr`, and `Ln,w` / `Ln,w+CI` data. Those rows can be same-family
  bounds or validation fixtures for steel floor/ceiling systems, but they
  should not license unrelated concrete/timber rows as numeric anchors.

- Caniato et al. 2024, floating floors on CLT:
  https://www.sciencedirect.com/science/article/pii/S2352710224012476

  The paper is useful as a warning for the floor side. It reports that
  models and standards based on heavyweight floors do not transfer
  cleanly to CLT/lightweight floors. DynEcho should treat lightweight
  steel modular floors the same way: same-family measured rows and
  steel/lightweight physics can own values, but heavyweight concrete
  impact formulas cannot.

## Formula / Algorithm Workbench

Gate AA should not try to invent one universal equation. It should route
each physical family to the best owned algorithm and make source rows
calibration/override evidence, not the whole calculator.

Airborne wall/ceiling families:

1. Single or laminated leaf.

   Current engine support: mass-law curve
   `R(f) = 20 log10(f * m') - 48`, Sharp/Kurtovic-style delegates, ISO
   Rw/C/Ctr and ASTM STC adapters. Next improvement is not source lookup;
   it is better material-property ownership: density, surface mass,
   modulus or critical-frequency owner, damping/loss factor, panel size,
   and laminated/viscoelastic coupling.

2. Double leaf / framed / resilient bridge.

   Required inputs: leaf masses, cavity depth, frame/support type,
   stud/joist spacing, resilient channel/clip side, absorber coverage,
   absorber flow-resistivity or class, and bridge/coupling owner. Core
   formula family: mass-air-mass resonance from reduced mass and cavity
   stiffness, plus structural bridge coupling and porous damping. Current
   Gate S route is the pattern to reuse.

3. Triple leaf / two cavity.

   Required inputs: three leaf groups, two cavity depths, two cavity fill
   states, internal leaf mass/stiffness, support/coupling class, and
   absorber properties. Current solver already computes two resonance
   dips and their interaction; Gate AA must promote it by physical
   domain, not by the `50/50 mm Rockwool` benchmark fixture.

4. Four or more panel / arbitrary multi-layer.

   Short-term rule: normalize into owned leaf/cavity groups where the
   physics is valid; otherwise return `needs_input` or `unsupported`.
   Medium-term model: transfer-matrix / impedance matrix for layered
   airspaces and plates, with SEA-style correction or calibration for
   finite panels, bridges, and coincidence.

5. Field and building prediction basis.

   `Rw` is an element/lab curve rating; `R'w`, `Dn,w`, and `DnT,w` need
   field geometry, absorption, flanking, and room normalization. Current
   curve overlay already has the `10log10(0.32V/S)` shape for `DnT,w`.
   Gate Z owns impact field promotion; Gate AA must keep airborne field
   values separate from lab values in tests and reports.

Impact floor families:

1. Heavy concrete bare/floating floors.

   Current engine support is intentionally narrow and should stay narrow:
   `Ln,w ~= 164 - 35 log10(m')`, `DeltaLw ~= 13 log10(m'load) -
   14.2 log10(s') + 20.8`, and `f0 ~= 160 sqrt(s'/m'load)`. These are
   useful for massive concrete and floating floors when dynamic stiffness
   and load mass are known.

2. Lightweight steel / open-web / modular floors.

   Do not use heavy-concrete formulas as owners. First use exact measured
   same-family rows. If topology is near an owned UBIQ/INEX-style family,
   use same-family bound interpolation as a bound, not an exact `Ln,w`.
   If no row exists, the next algorithm should account for deck/support
   mobility, ceiling suspension, cavity absorption, fastener/bridge
   coupling, impact mat dynamic stiffness under load, and modal/SEA
   behavior.

3. Timber / CLT / lightweight non-steel floors.

   Treat as separate structural families. Recent literature shows
   heavyweight floor models can fail on CLT/lightweight floors. DynEcho
   needs family-specific calibration and negative tests that stop steel,
   timber, CLT, and concrete rows from anchoring each other.

Rating and source use:

- ISO 717 and ASTM rating adapters consume curves; they are not solver
  substitutes.
- Exact measured rows can win only on true topology/material/metric
  match.
- Similar rows can calibrate, bound, or validate only within their owned
  family and metric basis.
- When required physical inputs are missing, the result must ask for
  those inputs. It should not fall back to an unrelated numeric anchor.

## Post-Gate-Z Plan

Gate Z remains the selected next action:
`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`.

After Gate Z, open a new bounded incident gate:

`gate_aa_construction_image_accuracy_incident_route_selection`

Proposed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts`

Implementation order:

0. Freeze the post-Gate-Z baseline.

   Before changing Gate AA runtime, run the current gate and record the
   selected candidate, visible value, basis, and report output for the
   five incident scenarios. The expected initial state is allowed to be
   red for the shared-wall route; the purpose is to prevent hidden
   movement while fixing it.

1. Build a construction-image scenario pack.

   Add the five user-supplied examples as named engineering scenarios:
   shared wall, corridor wall, exterior wall/facade, modular ceiling, and
   modular floor. Each scenario must have role-defined layers, explicit
   topology where needed, requested output basis, structural support
   family, required material properties, and an expected numeric band or
   explicit `needs_input` reason.

2. Add route-selection invariants before formula tuning.

   If explicit grouped multi-leaf topology is complete and a
   domain-compatible family solver can produce a curve, screening
   fallback cannot be selected. The rejected-candidate metadata must say
   why exact/calibrated sources lost without demoting physics.

3. Replace fixture-specific eligibility with physical solver domains.

   The triple-leaf selector must describe a domain such as:
   grouped topology, three positive leaf groups, two cavities in an owned
   depth range, porous absorber coverage, internal leaf coupling, support
   topology, and material-family compatibility. It must not be pinned to
   `50 mm` unless a specific calibrated source row is being promoted.

4. Create app-path/direct-solver parity tests.

   The shared-wall 80/80 mm scenario should call the same solver route as
   the direct `solveWallTripleLeafFrequencyBands` probe. The test should
   assert selected strategy, candidate resolution, curve basis, Rw/STC
   adapter separation, and that the app-path value cannot underpredict by
   a route miss.

5. Add numeric acceptance bands and source reference owners.

   Initial bands should be conservative and research-backed:

   - shared wall: the app must not return the `Rw 40-42` screening path
     for the explicit 80/80 grouped topology; it should route to a
     triple/multi-cavity solver and land in a defended band around the
     current direct-solver result until exact source calibration improves
     it;
   - corridor wall and modular ceiling: lock plausible current bands and
     ensure solver method/basis is correct;
   - exterior wall: keep facade/building output basis separate from
     room-to-room `Rw`/`R'w`;
   - modular floor: steel-joist support must not select concrete/timber
     source rows as numeric anchors; use same-family steel bound,
     same-family measured row, a named steel/lightweight impact physics
     route, or `needs_input`.

6. Research and benchmark against INSUL-like outputs.

   Run or reproduce an INSUL-style comparison at the frequency-curve
   level, not only the single-number rating. Record which inputs INSUL
   needs for wall/ceiling/floor routes and which assumptions DynEcho must
   expose to users: material density, modulus/critical frequency,
   damping, cavity depth, absorber class, frame/support type, joist or
   stud spacing, panel size, room volume, RT60, and output basis.

7. Harden floor impact source selection.

   For explicit structural support families, enforce hard same-family
   filters before any source-anchored numeric result. Broader family
   rows may remain diagnostics, but they cannot own `Ln,w`, `L'n,w`,
   `L'nT,w`, `Rw`, or `Rw+Ctr` for a different structural family.

8. Add lightweight-steel route options.

   Classify the modular floor as exact same-family source, same-family
   bound, steel-family physics, `needs_input`, or `unsupported`.
   Required missing inputs should be explicit: support span/spacing,
   ceiling suspension/cavity, absorber density/flow class, impact mat
   dynamic stiffness under load, deck/profile mass, and bridge/coupling
   condition.

9. Update report/card parity tests.

   Workbench visible cards, saved replay, PDF, and DOCX reports must show
   the same selected algorithm, basis, output support, uncertainty, and
   numeric value for the incident scenarios.

10. Open the next model-family backlog only after Gate AA is green.

   If Gate AA still shows large residual error against measured/INSUL
   curves, create a follow-up solver gate for generalized transfer-matrix
   / SEA-style multi-layer airborne prediction and steel/lightweight
   impact prediction. Do not hide that residual behind confidence copy.

## Acceptance Criteria

- The shared-wall 80/80 grouped topology does not select
  `multileaf_screening_blend` when the triple/multi-cavity solver can
  compute a curve.
- Exact/calibrated source candidates may be blocked, but
  `family_physics_prediction` remains eligible when physical inputs are
  complete.
- The app-path result and direct solver result cannot diverge by a
  route-selection miss.
- Floor steel examples cannot borrow concrete/timber nearby rows as
  numeric anchors.
- Tests assert numeric acoustic bands, selected strategy, candidate
  precedence, basis, supported outputs, and negative boundaries.
- Source rows are used as exact overrides, calibration, bounds, or
  validation references; they are not the primary product model.

## Non-Goals / Guardrails

- Do not hardcode the five image examples as a finite lookup table.
- Do not replace the `50/50 mm` fixture guard with a new `80/80 mm`
  fixture guard.
- Do not let source-row absence demote a complete physical topology to
  screening.
- Do not use concrete, timber, CLT, or steel floor rows as numeric
  anchors for each other unless a documented cross-family calibration
  and holdout test explicitly owns that transfer.
- Do not collapse lab `Rw`/`Ln,w`, field `R'w`/`L'n,w`, and normalized
  `DnT,w`/`L'nT,w` into one output basis.

## Open Research Items

- Acquire ACON Probarrier and CDM/Damtec product acoustic properties:
  surface mass, dynamic stiffness, loss factor, flow resistivity where
  applicable, tested assembly data if available.
- Collect exact or near-exact measured rows for the five local image
  scenarios, especially twin-frame gypsum/mineral-wool/MLV walls and
  lightweight steel modular floors.
- Evaluate whether the current three-leaf solver should evolve into a
  generalized transfer-matrix / SEA-style multi-layer solver for four or
  more leaves.
- Compare DynEcho, INSUL, and published measured curves on the same
  explicit inputs. Differences above the owned tolerance must become
  solver backlog, not just warning copy.
- Verify the heavy-floor formula constants and scope against licensed
  ISO 12354-2 Annex C or another rights-safe technical source before
  broadening them beyond their current narrow implementation.
- Acquire product data for 0.70 mm trapezoidal steel deck, 200 mm C
  purlin, Betopan, Flameboard, OSB3, facade gypsum, high-density stone
  wool, and local gypsum/MLV products used in the images.
