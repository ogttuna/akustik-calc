# DynEcho Agent Notes

Start here before changing calculator behavior.

## Product Goal

DynEcho is an acoustic calculator, not a source-library/catalog app.
The priority is personal-use readiness: a user selects wall or floor,
enters the physical inputs required for that route, adds layer materials
and thicknesses, and receives defensible `Rw`, `R'w`, `DnT,w`, `Ln,w`,
and related outputs.

The calculator must maximize both coverage and accuracy. Exact measured
or trusted source rows win when they truly match, and nearby measured
rows can anchor or calibrate predictions when their topology and metric
scope allow it. But source rows cannot be the whole product because
layer combinations are effectively unbounded. When source rows are
absent, DynEcho must calculate with the best family-specific physics
model available, label the basis/origin honestly, expose tolerance or
error budget, and ask for missing physical inputs instead of guessing.

Dynamic calculator north star:

- user chooses `wall` or `floor`;
- the app opens only the physical input fields required by that route and
  output basis;
- the user adds layer materials, order, thicknesses, and explicit
  topology/context where needed;
- the engine calculates `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `STC`,
  `C`, `Ctr`, and related outputs from the best available candidate;
- if a physical field is missing, the answer is `needs_input` with the
  exact missing fields, not a guessed high-confidence result.

Do not drift this project back into a library/catalog exercise. Source
rows are candidates, anchors, calibration evidence, holdouts, bounds, and
exact overrides. They are not the product. If a change primarily gathers
more rows while leaving source-absent family solvers, input contracts, and
accuracy tests untouched, it is probably the wrong next step unless the
active plan explicitly selected exact-source promotion.

Treat lab, field, and building-prediction contexts as different output
bases. Do not casually alias `Rw` with `STC`, `Ln,w` with `IIC`, or lab
values with field/apparent values. Tests must prove acoustic correctness
and boundaries, not just that code runs: expected values, basis/origin,
support bucket, visible card/report parity, tolerance, nearby negatives,
and hostile input cases such as many layers, duplicates, splits, and
safe/unsafe reorders.

Personal-use readiness means the dynamic calculator can handle realistic
and hostile layer combinations across wall and floor routes with named
algorithms, bounded uncertainty, and visible missing-input prompts. It is
not ready just because a finite catalog of known assemblies passes.

Before implementing calculator behavior, re-read the current local engine
shape in `packages/engine/src/airborne-calculator.ts` and
`packages/engine/src/dynamic-airborne.ts`. The existing KS, mass-law,
Sharp, and Kurtovic paths are useful delegate engines and benchmark
signals, but they are not complete dynamic coverage for double/framed,
triple/multi-cavity, floor-impact, field, or building-prediction routes.
Gate V has defined the floor-impact dynamic-stiffness input and adapter
contract after Gate U selected that lane, without turning the calculator
back into a finite source catalog or aliasing `Ln,w` with `IIC`. Gate W
promoted only the complete lab `Ln,w` / `DeltaLw` lane. Gate X selected
the floor-impact field-context boundary, and Gate Y landed that
no-runtime boundary. Gate Z promoted field-only `L'n,w` and `L'nT,w`
runtime through the owned Gate W lab anchor plus explicit field context,
while keeping `L'nT,50` blocked until a low-frequency owner exists.
Gate AA recovered the construction-image shared-wall route selection:
complete grouped mineral-wool triple-leaf topology now reaches the
triple-leaf two-cavity frequency solver by physical domain instead of
the old 50/50 mm fixture gate. Gate AB has now landed the floor-side
source guard: generic lightweight-steel floors no longer borrow UBIQ
open-web or Pliteq steel-joist rows until the steel support form and
impact package inputs are explicit. Gate AC has now landed the
steel-floor physics input/formula-readiness contract: source-absent
steel floors name support form, carrier depth/spacing, upper dynamic
stiffness/load basis, and lower isolation requirements before any
formula corridor can promote. Gate AD has now landed that first runtime
steel-floor impact formula corridor: complete explicit steel predictor
input calculates lab `Ln,w` / `DeltaLw` through
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`,
while exact rows stay first and missing carrier/lower-isolation inputs
block broad fallback. Gate AE has now landed card/report parity for
that formula corridor: cards, posture, dynamic trace, support notes,
validation mode, proposal dossier, and Markdown report all show
`Lightweight-steel formula corridor` with the same source-absent lab
tolerances. Gate AF has now landed the first-class Dynamic Calculator
floor input surface for the same physical steel-floor fields. Workbench
controls, scenario analysis, local/server snapshots, and the engine
bridge now feed the Gate AD predictor input; complete UI-derived steel
returns lab `LnW 55.6` / `DeltaLw 22.4`, partial fields stay parked,
unsafe duplicate steel carriers are refused, and exact source rows still
win. Gate AG has now landed input-surface acceptance: live workbench
evaluation, local saved replay, server snapshot replay, output cards,
Markdown report payload, estimate API payload, impact-only API payload,
and hostile UI edits all preserve the steel formula basis while precise
missing-input warnings name the blocked physical fields. Gate AH has now
landed the steel-floor formula accuracy benchmark matrix:
three same-family Pliteq lab `Ln,w` holdouts run residual checks, UBIQ
open-web exact rows stay calibration anchors only when `s'`, load, or
topology inputs are missing, and the current `+/-4.5 dB Ln,w` /
`+/-2.0 dB DeltaLw` corridor is kept until a larger holdout set supports
retune. Gate AI has now landed the steel-floor residual policy:
`Ln,w` and `DeltaLw` each get executable `hold`, `tighten`, `widen`, or
`retune_candidate` decisions. Current evidence holds the corridor,
keeps runtime values unchanged, keeps UBIQ open-web rows as anchors, and
requires paired negative boundaries plus measured `DeltaLw` holdouts
before any retune/tightening. Gate AJ has now landed the paired
negative-boundary and measured `DeltaLw` intake gate: wrong support
family, exact source precedence, lab-to-field/building leakage, and
source-absent design references are protected, product/inferred/wrong
basis `DeltaLw` values cannot tighten the lab corridor. Gate AK landed
the source-owned same-stack lab `DeltaLw` holdout packet contract:
metric value, topology/support family, carrier spacing, load basis,
dynamic stiffness, lower support class, upper-resilient topology, and
paired negative boundary owner must all be source-owned before a row can
tighten the steel-floor formula residual. Gate AL has now landed the
first-holdout guard for that rule: current Pliteq/UBIQ `Ln,w`/`Rw` rows,
product-only `DeltaLw`, inferred Annex/companion values, and the checked
REGUPOL ASTM/IIC/STC steel C-joist source do not count as source-owned
ISO lab `DeltaLw` holdouts. Gate AM has now landed the narrow source
packet acquisition ledger: REGUPOL steel deck/joist and steel C-joist
leads are wrong-basis STC/IIC evidence, REGUPOL ISO `DeltaLw` leads are
solid/concrete reference-floor evidence, and SoundAdvisor is a useful
ISO `DeltaLw` scope boundary rather than a steel packet. Runtime values
remain unchanged, broad source-library crawl is still blocked. Gate AN
landed the source-absent steel-floor formula error-budget contract:
`Ln,w` keeps the existing `+/-4.5 dB` corridor and `DeltaLw` keeps the
existing `+/-2.0 dB` corridor, but each metric now has a structured
uncertainty decomposition for missing source-owned holdouts, bare steel
reference modelling, transfer efficiency, input precision, and topology
simplification. Gate AO has now landed that structured payload on the
runtime impact schema, support trace, output cards, method/corridor
dossiers, Markdown report, calculator API, and impact-only API without
moving `Ln,w 55.6` / `DeltaLw 22.4` or presenting the budget as measured
evidence. Gate AP has now landed the hostile-input guard around that
budget surface: complete, safe-reordered, and saved/API-replayed steel
formula cases keep the same structured `Ln,w` / `DeltaLw` budget, while
missing physical inputs, duplicate/ambiguous steel carriers, and exact
source precedence remain budget-free. Field requests stay explicit:
`L'n,w` and `L'nT,w` remain unsupported unless a field-context route owns
them, and the lab budget is not aliased onto field metric ids. Gate AQ has
now landed the calibration-readiness contract for that budget: every
runtime budget term is mapped to a source-owned evidence owner and
current blocker, current `Ln,w` / `DeltaLw` evidence still resolves to
`hold`, wrong evidence cannot tighten the corridor, and future `hold`,
`tighten`, `widen`, and `retune_candidate` branches are executable
without moving runtime values. Gate AR has now landed the calibration
evidence-intake ledger: current Gate AK/AM local evidence is classified
against the Gate AQ owner map, accepted source-owned calibration packet
count remains zero, wrong basis/reference/product/boundary evidence
stays rejected, and a future source-owned same-stack ISO `DeltaLw`
packet still cannot move runtime values until residual thresholds are
met. Gate AS has now landed the owner-evidence targeting decision:
same-stack ISO lab `DeltaLw` packet ownership is the selected next
narrow target, with all other Gate AQ owners ranked behind it and no
runtime movement. Gate AT has now landed the same-stack ISO lab
`DeltaLw` packet target fixture contract: the future source-owned
same-stack fixture can become calibration evidence only, product/wrong
basis/reference/missing-owner/rights-blocked packets stay rejected, and
runtime values remain frozen. Gate AU has now landed the narrow
rights-safe source-lead plan: manufacturer lab-report index, accredited
lab-report index, and internal measurement packet leads can proceed to a
later packet intake gate only as metadata-only acquisition targets,
while product/wrong-basis/reference/missing-owner/rights-blocked leads
stay rejected. Gate AV has now landed that metadata-only source-lead
intake ledger: the three Gate AU accepted lead categories become
acquisition request targets only, source text and measured metric values
are not ingested, rejected lead buckets stay blocked, and runtime values
remain frozen. Gate AW has now landed packet-acquisition readiness:
only Gate AV accepted intake rows can become metadata-only packet
request targets, rights-safe locator metadata and Gate AT/AK owner
fields are required, rejected intake rows remain blocked, source
documents and measured values are not ingested, and runtime values remain
frozen. Gate AX has now landed the rights-safe packet request ledger:
only Gate AW ready rows enter the ledger, blocked rows stay out, locator
metadata and the Gate AT/AK owner checklist are preserved, source
documents and measured values are not ingested, and request ledger
entries remain separate from packet acceptance. Gate AY has now landed
the packet acceptance boundary: current request-ledger entries remain in
request status until a source-owned packet exists, a complete future
same-stack ISO `DeltaLw` packet probe can leave request status, and
wrong-basis, wrong-reference, product/inferred, rights-blocked,
missing-owner, and blocked-ledger probes remain rejected. Accepted
boundary packets are not calibration evidence, exact rows, retune input,
or runtime movement at Gate AY. Gate AZ has now landed the calibration
candidate boundary: current request-status rows stay blocked, only the
accepted future same-stack ISO `DeltaLw` boundary probe can become a
calibration evidence candidate, rights-safe citation/locator metadata is
required, and calibration candidates still cannot enter residual
admission, tighten/widen tolerance, retune, exact-promote, alias field
or building metrics, or move runtime values. Gate BA has now landed the
residual-admission boundary: only Gate AZ
accepted calibration candidates can enter same-stack ISO lab `DeltaLw`
residual-policy evaluation, current request-status rows and rejected
candidates stay blocked, rights-safe citation/locator metadata and all
source-owned owner fields are required, and the accepted future probe
evaluates to residual-policy `hold` with threshold blockers still
present. Residual admission remains separate from exact-source
promotion, field/building aliases, tolerance movement, formula retune,
and runtime movement. Gate BB has now landed the residual-policy
decision surface: only Gate
BA residual-admitted rows can reach policy decision, current blocked
rows and rejected probes remain blocked, the admitted future row is
still `hold` with holdout-count, paired-negative, open-web-input, and
field/building owner blockers explicit, and even future
retune/tighten/widen policy labels are later-gate signals rather than
runtime or tolerance movement. Gate BC has now landed blocker-closure
ranking: only Gate BB accepted policy decisions feed closure lanes, the
source-owned same-stack ISO `DeltaLw` holdout-count lane is selected as
the narrow next lane, paired-negative/open-web/field-building owner
lanes stay ranked follow-ups, and broad source crawl/runtime/tolerance
movement remain blocked. Gate BD has now landed the holdout-count
closure boundary: only Gate BC's selected holdout-count lane can feed
closure evidence, two additional source-owned same-stack ISO lab
`DeltaLw` holdouts must own the metric value, same-stack steel
reference, ISO lab basis, all Gate AT/AK owner fields, paired
negative-boundary ownership, and rights-safe locator metadata, and
accepted rows remain residual-readiness evidence only. Gate BE has now
landed the paired-negative closure boundary: only Gate BD's selected
paired-negative lane can feed closure evidence, three additional
source-owned paired negatives must own the target metric family, ISO lab
basis, explicit wrong-support or wrong-reference boundary, boundary
identity, same-stack exclusion reason, not-holdout scope, and
rights-safe locator metadata, and accepted rows remain residual-policy
readiness evidence only. Gate BF has now landed the open-web formula
input ownership closure boundary: only Gate BE's selected open-web input
ownership lane can feed closure evidence, a source-owned open-web packet
must own support form, carrier depth/spacing, load basis, dynamic
stiffness, lower support class, upper resilient topology, and rights-safe
locator metadata, and accepted rows remain residual-policy readiness
evidence only. Gate BG has now landed the field/building basis owner
closure boundary: only Gate BF's selected field/building lane can feed
closure evidence, field apparent impact and building-prediction owners
must be separate, each must own room geometry/volume, separating element
area, junction/flanking context, reverberation/normalization basis, and
rights-safe locator or project-context metadata, and lab `Ln,w` /
`DeltaLw` still cannot alias to field or building outputs. Gate BH is
now landed as the residual-policy closed-owner revalidation boundary:
the owner map is closed by Gate BD holdout-count evidence, Gate BE
paired-negative evidence, Gate BF open-web input ownership, and Gate BG
field/building basis owners. The closed map revalidates as a
policy-only `tighten` candidate, but no closure row becomes measured
runtime evidence, no exact row is promoted, and `Ln,w 55.6` /
`DeltaLw 22.4` with `+/-4.5 dB` / `+/-2.0 dB` remains frozen. Gate BI has
now landed as the no-runtime tighten-candidate governance guard:
`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
It keeps `tighten` as a proposal label only and freezes runtime,
tolerance, source, exact-row, formula, card/report/API, and
lab/field/building behavior. It selected
`personal_use_mvp_coverage_sprint_after_gate_bi`. Personal-Use MVP
Coverage Sprint Gate A has now landed the executable wall/floor scenario
matrix:
`gate_a_personal_use_mvp_coverage_matrix_plan`. It asserts route,
family, requested metrics, basis, input completeness, current and
expected posture, value or blocked reason, origin/support bucket,
tolerance/error budget, visible-surface parity target, hostile variant,
failure class, and next action for 24 common/hostile wall/floor
scenarios through current public engine entry points. Personal-Use MVP
Coverage Sprint Gate B has now landed the timber/CLT floor-impact
`DeltaLw` input and formula-readiness contract:
`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`.
It names timber joist and CLT/mass-timber physical inputs, keeps current
timber `Ln,w 51` and CLT `Ln,w 50` runtime behavior unchanged, blocks
missing dynamic stiffness/load/topping/lower-assembly inputs, refuses
ASTM and field aliases, and preserves exact `Ln,w` source precedence
without inventing `DeltaLw`. Personal-Use MVP Coverage Sprint Gate C
has now landed the timber/CLT floor-impact `DeltaLw` formula-corridor
contract:
`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`.
It names separate timber-joist and mass-timber CLT source-absent
formula corridors, required formula terms, `+/-7.5 dB` design budgets,
and exact missing-input / basis-alias negative boundaries without moving
runtime values. Personal-Use MVP Coverage Sprint Gate D has now landed
the first runtime timber/CLT `DeltaLw` formula corridor:
`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`.
Explicit complete timber joist input returns exact `Ln,w 51` plus
source-absent lab `DeltaLw 25.2`; explicit complete CLT input returns
family `Ln,w 50` plus source-absent lab `DeltaLw 22.6`. Both `DeltaLw`
values carry `+/-7.5 dB` `source_absent_formula_error_budget` payloads
and metric-specific basis labels. Personal-Use MVP Coverage Sprint Gate
E has now landed visible/API/report parity for those values:
`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan`.
Cards, posture, dynamic trace, support notes, metric-basis copy,
corridor/method dossiers, Markdown report, calculator API, and
impact-only API preserve the same `DeltaLw` basis and `+/-7.5 dB`
not-measured error budget. Personal-Use MVP Coverage Sprint Gate F has
now landed the first-class Dynamic Calculator input surface for the same
timber/CLT physical fields:
`gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan`.
Workbench controls, scenario analysis, local/server snapshots,
calculator API payload, and impact-only API payload now feed the Gate
D/E predictor input; complete UI-derived timber returns exact `Ln,w 51`
plus formula `DeltaLw 25.2`, complete UI-derived CLT returns family
`Ln,w 50` plus formula `DeltaLw 22.6`, and partial/hostile inputs stay
parked. Personal-Use MVP Coverage Sprint Gate G has now landed:
`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan`.
It generalizes grouped wall multi-cavity / triple-leaf route readiness
without retuning the current mineral-wool pins: complete grouped 50/50
keeps `Rw 50 / STC 55`, complete grouped non-50/50 keeps
`Rw 55 / STC 56`, unequal cavities and safe explicit group reorders stay
stable, flat-list and partial grouped topology ask for precise missing
physical fields, duplicate/overlapping/out-of-range layer ownership is
refused with `leafGrouping`, lined masonry/CLT negatives stay out of the
triple-leaf route, field outputs are not lab aliases, and exact source
precedence remains first. Gate G selection status:
`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h`.
Personal-Use MVP Coverage Sprint Gate H has now landed:
`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan`.
It promotes complete source-absent lab lined massive/masonry wall and
CLT/mass-timber wall stacks from screening fallback to named
family-physics bases without retuning current values: lined massive
stays `Rw 60 / STC 60` through the cavity-aware dynamic delegate and
CLT stays `Rw 42 / STC 42` through the timber-panel delegate, both with
visible uncalibrated error budgets and exact-source precedence. Explicit
partial lined or mass-timber wall intent returns `needs_input`, ordinary
single leaf, double/framed, grouped triple-leaf, and field outputs stay
out of the Gate H lab corridor. Gate H selection status:
`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i`.
Gate I has now landed:
`gate_i_personal_use_mvp_airborne_field_context_continuation_plan`.
It promotes complete `field_between_rooms` requests for owned airborne
lab-family routes to a field/apparent family-physics basis without
numeric retune, while missing physical context, building prediction, and
exact-source precedence remain protected. Gate I selection status:
`gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j`.
Gate J has now landed:
`gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan`.
It keeps Gate I field values unchanged while making candidate id,
method, warning, actual field error budget, and not-measured-evidence
posture visible across cards, dossiers, saved replay, report text, and
the calculator API. Gate J selection status:
`gate_j_personal_use_mvp_airborne_field_context_surface_parity_landed_selected_input_surface_gate_k`.
Gate K has now landed:
`gate_k_personal_use_mvp_airborne_field_context_input_surface_plan`.
It makes the Gate I/J airborne field-context physical inputs first-class
on the Dynamic Calculator wall input surface: `field_between_rooms`,
panel geometry, receiving-room volume, receiving-room RT60, and optional
airtightness now feed the same runtime path through workbench, scenario
analysis, saved replay, report, and API payloads. Complete UI-derived
lined massive/masonry, CLT/mass-timber, and grouped triple-leaf examples
keep Gate I values unchanged. Partial field contexts stay `needs_input`
with precise missing fields and no Gate I field budget or live field
card. Gate K selection status:
`gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l`.
Gate L has now landed:
`gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan`.
It parks airborne `building_prediction` as `needs_input` until
`flankingJunctionClass` and `conservativeFlankingAssumption` are
explicit flanking/junction owners. In plain terms, the conservative
flanking assumption must be selected before any building-prediction
runtime can promote; this is the Gate L conservative flanking assumption
boundary. Gate L blocks lab-looking outputs requested under building
context, suppresses parked building overlay warnings, and keeps workbench
building cards out of Gate I field posture. Gate L selection status:
`gate_l_personal_use_mvp_airborne_building_prediction_boundary_landed_selected_building_prediction_input_contract_gate_m`.
Gate M has now landed:
`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan`.
It defines the first complete airborne `building_prediction` input
contract without promoting numeric building runtime. Complete building
prediction now requires separating element area, source-room volume,
receiving-room volume/RT60, flanking/junction class, conservative
flanking assumption, junction coupling length, and building output basis.
Partial owner sets stay `needs_input`; complete physical input sets
select `unsupported` with
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`
after Gate N, because the ISO 12354-1 flanking formula terms are not
owned yet. Gate M
selection status:
`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_landed_no_runtime_selected_runtime_adapter_gate_n`.
Gate N has now landed:
`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`.
It defines the building-prediction runtime adapter owner boundary
without numeric runtime movement. Complete Gate M physical and adapter
owner sets now name the missing direct separating-element frequency
curve owner, flanking path transmission terms owner, junction vibration
reduction index owner, room absorption normalization owner, and
building-prediction uncertainty budget owner. Complete building requests
remain `unsupported`; field/apparent Gate I values and lab `Rw`/`STC`
are not reused as building metrics. Gate N selection status:
`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_landed_no_runtime_selected_formula_corridor_gate_o`.
Gate O has now landed:
`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`.
It defines the building-prediction formula corridor and `+/-9 dB`
source-absent design budget for `R'w` and `DnT,w`, but keeps runtime
parked because current flanking path terms are still design-owned rather
than runtime-owned. The corridor requires the direct separating-element
curve, flanking path energy sum, junction vibration reduction index,
room absorption standardization, and same-building holdout uncertainty
before promotion. Gate O selection status:
`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_p`.
Gate P has now landed:
`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`.
The 2026-05-11 INSUL / ISO refresh tightened Gate P without changing the
selected next file: public INSUL docs state that INSUL does not directly
calculate building flanking transmission, and ISO 12354-1 frames airborne
building prediction around element performance plus direct/indirect
flanking and structural propagation terms. Gate P can promote runtime
only if direct curve, flanking-energy, junction/coupling,
room-standardization, and `+/-9 dB` budget owners are executable and
visible. Otherwise complete building requests must stay `unsupported`
and Gate P should select the next highest-ROI personal-use lane. Gate P
closed no-runtime with selection status:
`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_closed_no_runtime_selected_opening_leak_composite_gate_q`.
Gate Q has now landed:
`gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan`.
Gate Q is an opening/leak composite transmission-loss input ownership
gate, not a broad source crawl. It adds `hostWallAreaM2` and per-opening
area, count, element `Rw`, rating basis, seal/leakage class, and origin
as first-class inputs, keeps runtime no-runtime, and closes with
selection status:
`gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r`.
Gate R has now landed:
`gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan`.
Gate R defines the no-runtime opening/leak composite lab `Rw` formula
corridor with host-wall and opening area-energy terms, explicit
sealed/average/leaky/open-gap leakage penalties, a `+/-6 dB`
source-absent design budget, and negative boundaries for STC-only,
field, and building aliases. Gate R closes with selection status:
`gate_r_personal_use_mvp_opening_leak_composite_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_s`.
Gate S has now landed:
`gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan`.
Gate S promotes complete element-lab opening/leak composite `Rw`
runtime through the Gate R area-energy formula. The runtime case host
wall plus one average-seal `Rw 32` opening returns `Rw 38.2` with the
`gate_s_opening_leak_composite_area_energy_runtime_corridor` basis and
`+/-6 dB` source-absent budget. `STC`, `R'w`, `DnT,w`, field, and
building outputs stay unsupported unless a later adapter owns them;
source-absent, STC-only, missing, duplicate, and excessive opening
inputs fail closed instead of returning host-wall `Rw` as supported.
Gate S closes with selection status:
`gate_s_personal_use_mvp_opening_leak_composite_runtime_corridor_landed_selected_surface_parity_gate_t`.
Gate T has now landed:
`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan`.
Gate T adds visible parity for that opening/leak runtime corridor across
route/card posture, output cards, scenario analysis, saved replay,
calculator API payloads, and Markdown report lines without moving
`Rw 38.2` or the `+/-6 dB` budget. `STC`, `R'w`, `DnT,w`, field, and
building outputs remain unsupported with explicit opening/leak boundary
copy, and missing/hostile/source-absent/STC-only opening inputs remain
`needs_input` or `unsupported` without a promoted budget. Gate T closes
with selection status:
`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_landed_selected_input_surface_gate_u`.
Gate U has now landed:
`gate_u_personal_use_mvp_opening_leak_composite_input_surface_plan`.
Gate U makes the opening/leak physical terms first-class in the Dynamic
Calculator wall input surface: host wall area, stable opening ids,
opening area/count, element `Rw`, rating basis, seal/leakage class, and
origin now flow through live evaluation, local saved replay, server
snapshot replay, output cards, Markdown report payloads, estimate API
payloads, and hostile UI edits. Complete UI-derived input still returns
the Gate S lab `Rw 38.2` / `+/-6 dB` runtime basis; partial input stays
`needs_input`, duplicate/excessive/source-absent/STC-only openings stay
`unsupported`, and no STC/field/building adapter is added. Gate U closes
with selection status:
`gate_u_personal_use_mvp_opening_leak_composite_input_surface_landed_selected_revalidation_gate_v`.
Gate V has now landed:
`gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_plan`.
Gate V is a no-runtime post-input-surface revalidation gate. It proves
the first-class opening/leak UI surface did not move the Gate S lab
`Rw 38.2` / `+/-6 dB` corridor, did not promote STC/field/building
opening adapters, and did not disturb Gate G/H/I/J/K wall route or Gate
L/M/N/O/P building-prediction boundaries. Gate V closes with selection
status:
`gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w`.
Gate W has now landed:
`gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan`.
Gate W refreshes the executable Personal-Use MVP matrix to 28 rows
after Gates B-U, keeps supported value pins separate from unsupported
outputs, preserves timber/CLT `DeltaLw`, opening/leak `Rw 38.2`, field,
building, ASTM/IIC, hostile, and exact-source boundaries, and selects
the bounded AAC / non-homogeneous masonry family solver for Gate X with
selection status:
`gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_landed_selected_aac_masonry_gate_x`.
Gate X has now landed:
`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan`.
Gate X promotes the complete element-lab AAC / non-homogeneous masonry
route from `screening_fallback` to named `family_physics_prediction`
through
`gate_x_aac_nonhomogeneous_masonry_sharp_davy_family_physics_runtime`
without retuning `Rw 44 / STC 44 / C -0.7 / Ctr -5.2`. It owns
material class, density, thickness, surface mass, optional stiffness /
loss-factor defaults, exact-source precedence, and field/building
non-aliasing. Gate X closes with selection status:
`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y`.
Gate Y has now landed:
`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan`.
The post-Gate X broad revalidation is complete: `pnpm check` passed
with lint/typecheck clean, engine 490 files / 2911 tests, web 179 files /
989 passed + 18 skipped, and repo build 5/5. The revalidation only
aligned stale lint/test expectations: unused Gate R/S imports/helpers,
JSX escaping for `R'w`, proposal copy now expecting `Airborne
field-context prediction`, and wall-selector building-prediction cards
remaining `needs_input` until building owners are explicit. Runtime
values, tolerances, source precedence, and lab/field/building basis rules
did not move.
Gate Y promotes the already finite CLT lab `Ctr -6.1` only for complete
element-lab CLT / mass-timber single-panel inputs with finite density,
thickness, surface mass, calculated dynamic frequency bands, and
ISO 717-1 spectrum-adapter basis. Complete CLT now supports
`Rw 42 / STC 42 / C -1.2 / Ctr -6.1` through
`gate_y_clt_mass_timber_ctr_spectrum_adapter_runtime` with the same
`+/-6 dB` uncalibrated budget. Exact-source precedence, missing custom
CLT density prompts, wrong-family and duplicate/ambiguous CLT
boundaries, STC-only non-promotion, and all field/building/ASTM
boundaries stay pinned. Gate Y validation completed on 2026-05-11:
focused Gate Y 1 file / 7 tests, Gate H/X/Y continuity 3 files / 21
tests, targeted Gate W/O/P expectation refresh 3 files / 15 tests,
engine typecheck, `pnpm calculator:gate:current`, `pnpm check`, and
`git diff --check` all passed. Gate Y closes with selection status:
`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z`.
Gate Z has now landed:
`gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan`.
Gate Z is a no-runtime post-Gate-Y revalidation: the 28-row matrix is
gap-free after Gate X/Y (`coverage_gap: 0`), runtime values and basis
rules do not move, and the next selected lane is scenario matrix v2
expansion with status
`gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_landed_selected_matrix_v2_expansion_gate_aa`.
Gate Z validation passed on 2026-05-11: focused Gate Z 1 file / 6
tests, Gate X/Y/Z continuity 3 files / 20 tests, engine typecheck,
`pnpm calculator:gate:current` with engine 367 files / 2122 tests, web
73 files / 314 passed + 18 skipped, repo build 5/5, and whitespace
guard clean.
Gate AA has now landed:
`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan`.
Gate AA is a no-runtime scenario matrix v2 expansion: the matrix is now
40 rows, still `coverage_gap: 0`, and broader realistic/hostile
calculator rows select the flat multicavity topology input surface with
status
`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_landed_selected_flat_multicavity_input_surface_gate_ab`.
Gate AA validation passed on 2026-05-11: focused Gate AA 1 file / 6
tests, Gate X/Y/Z/AA continuity 4 files / 26 tests, engine typecheck,
`pnpm calculator:gate:current` with engine 368 files / 2128 tests, web
73 files / 314 passed + 18 skipped, repo build 5/5, and whitespace
guard clean.
Gate AB has now landed:
`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan`.
Gate AB is a no-runtime engine/shared input contract: ambiguous
flat/many-layer multicavity schedules stay `needs_input`, complete
grouped topology owner sets include cavity depth/fill/absorption,
stale `flat_layer_order` groups plus duplicate/empty invalid ownership
are blocked by `leafGrouping`, and the existing grouped triple-leaf
runtime pin remains `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`.
Gate AB selection status:
`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_landed_selected_surface_parity_gate_ac`.
Gate AB validation passed on 2026-05-11: focused Gate AB 1 file / 6
tests, Gate G/K/L/X/Y/Z/AA/AB continuity 8 files / 57 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 369 files / 2134
tests, web 73 files / 314 passed + 18 skipped, repo build 5/5, and
whitespace guard clean.
Gate AC has now landed:
`gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan`.
Gate AC carries the explicit grouped topology owner set through live
workbench evaluation, saved replay, calculator API payloads, output
cards, and Markdown report lines under the Gate AC topology surface
label `Wall multicavity topology owner set`. No solver retune,
source-row promotion, tolerance movement, or
lab/field/building/ASTM aliasing landed. The flat grouped stack remains
explicit source-absent screening at `Rw 38 / STC 38 / C -1 / Ctr -5.6`;
the existing grouped triple-leaf solver pin remains
`Rw 50 / STC 55 / C 0.8 / Ctr -7.3`. Gate AC selection status:
`gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_landed_selected_broad_revalidation_gate_ad`.
Gate AC validation passed on 2026-05-11: focused Gate AC engine 1 file /
4 tests, focused Gate AC web 1 file / 4 tests, Gate AB/AC engine
continuity 2 files / 10 tests, grouped-wall/AC web continuity 2 files /
8 tests, engine typecheck, web typecheck, `pnpm
calculator:gate:current` with engine 370 files / 2138 tests, web 74
files / 318 passed + 18 skipped, repo build 5/5, and whitespace guard
clean.
Gate AD has now landed:
`gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan`.
Gate AD is no-runtime broad revalidation plus internal-pilot rehearsal:
the 40-row matrix remains gap-free, 23 rows are numeric supported, 17
rows are explicit blocked/unsupported/basis/hostile cases, and the
complete grouped flat/many-layer wall stays visible but broad
screening-only at `Rw 38 / STC 38 / C -1 / Ctr -5.6`. Gate AD selection
status:
`gate_ad_personal_use_mvp_broad_revalidation_landed_selected_flat_multicavity_solver_broadening_gate_ae`.
Gate AD validation passed on 2026-05-11: focused Gate AD 1 file / 5
tests, Gate AA/AB/AC/AD engine continuity 4 files / 21 tests, Gate AC
web continuity 2 files / 8 tests, engine typecheck, web typecheck,
`pnpm calculator:gate:current` with engine 371 files / 2143 tests, web
74 files / 318 passed + 18 skipped, repo build 5/5, whitespace guard
clean, and explicit `git diff --check`.
Gate AE has now landed:
`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan`.
It is a bounded algorithmic runtime promotion, not a source crawl. The
complete explicit `element_lab` grouped flat/many-layer multicavity wall
now uses `gate_ae_flat_multicavity_two_cavity_frequency_solver` /
`family_physics_prediction`, returns `Rw 53 / STC 57 / C -0.6 / Ctr -8`,
and carries a `+/-7 dB` uncalibrated error budget. Exact/calibrated
source candidates remain rejected until source-owned same-family curve
or holdout evidence exists. Gate G full mineral-wool grouped triple-leaf
remains first and unchanged at `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`.
Stale, duplicate, missing-topology, field/building, ASTM, and IIC
routes remain behind explicit basis/input owners. Gate AE selection
status:
`gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af`.
Gate AE validation passed on 2026-05-11: focused Gate AE/AC/AD engine
contracts 3 files / 14 tests, focused flat-multicavity web parity 1
file / 4 tests, engine typecheck, web typecheck, focused dynamic-airborne
split line-count contract 1 file / 5 tests, and `pnpm
calculator:gate:current` with engine 372 files / 2148 tests, web 74
files / 318 passed + 18 skipped, repo build 5/5, and whitespace guard
clean. The Next build kept the known optional `sharp/@img` warnings but
completed. The 2026-05-12 post-Gate-AE checkpoint then passed broad
`pnpm check` after one lint-only unused Gate AA type-import cleanup:
lint, typecheck, engine Vitest 497 files / 2950 tests, all web Vitest
split batches, and repo build 5/5. Runtime values and basis boundaries
remain unchanged.
Gate AF has now landed:
`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan`.
Gate AF is no-runtime post-promotion revalidation: the 40-row matrix
remains gap-free, Gate AE flat multicavity stays `Rw 53 / STC 57 / C
-0.6 / Ctr -8` with `+/-7 dB`, Gate G grouped triple-leaf stays `Rw 50 /
STC 55 / C 0.8 / Ctr -7.3` with `+/-5 dB`, and stale topology,
duplicate groups, missing topology, field/building, ASTM, IIC, and
broad source crawl boundaries remain blocked. Gate AF selection status:
`gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_landed_selected_floor_formula_surface_polish_gate_ag`.
Gate AG has now landed:
`gate_ag_personal_use_mvp_floor_formula_surface_polish_plan`.
Gate AG is no-runtime floor formula prompt/input polish: steel floor
stays lab `LnW 55.6 / DeltaLw 22.4`, timber joist stays exact
`Ln,w 51` plus formula `DeltaLw 25.2`, CLT stays `Ln,w 50` plus
formula `DeltaLw 22.6`, and heavy concrete safe reorder stays
`Ln,w 39.2 / DeltaLw 32.6`. Workbench missing-input warnings now use
engine-owned labels like `Steel carrier spacing (mm)`,
`Upper resilient dynamic stiffness (MN/m3)`, and
`Resilient-layer load basis (kg/m2)`. Exact-source precedence and
lab/field/building boundaries remain unchanged. Gate AG selection
status:
`gate_ag_personal_use_mvp_floor_formula_surface_polish_landed_selected_opening_leak_stc_spectrum_adapter_gate_ah`.
Gate AH has now landed:
`gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan`.
Gate AH promotes complete element-lab opening/leak `STC` through the
ASTM E413 rating adapter
`astm_e413_stc_from_airborne_transmission_loss_curve` by applying the
Gate S area-energy `Rw` loss to the selected host-wall frequency curve
and re-rating the shifted spectrum. The pinned complete fixture now
returns lab `Rw 38.2 / STC 39` with the same `+/-6 dB` source-absent
opening/leak budget; the high-leakage two-opening matrix row returns
`Rw 33.7 / STC 34`. `STC` is not copied from `Rw`, STC-only opening
input basis remains blocked, and field/building outputs still do not
alias from lab values. Gate AH selection status:
`gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_landed_selected_surface_parity_gate_ai`.
Gate AI has now landed:
`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan`.
Gate AI is no-runtime visible-surface parity for that Gate AH adapter:
cards, target-output status/corridor, route/posture copy, method and
corridor dossiers, saved replay, calculator API payloads, and Markdown
reports all preserve the same Gate S lab `Rw 38.2`, Gate AH lab
`STC 39`, Gate AH ASTM E413 adapter id, `+/-6 dB` source-absent
budget, and not-measured-evidence posture. Missing, source-absent,
STC-only opening basis, `R'w`, `DnT,w`, field, and building requests
stay blocked without a Gate AH budget or adapter. Gate AI selection status:
`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_landed_selected_revalidation_gate_aj`.
Gate AI selected next action:
`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan`.
Gate AI selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts`.
Gate AJ has now landed:
`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan`.
Gate AJ is no-runtime revalidation after the Gate AI surface. It proves
Gate S lab `Rw 38.2`, Gate AH lab `STC 39`, high-leakage
`Rw 33.7 / STC 34`, the `+/-6 dB` not-measured-evidence budget, Gate U
input surface, field-context routes, building-prediction boundaries, and
Gate W/AA matrix supported/unsupported separation remain unchanged.
Gate AJ selection status:
`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_ak`.
Selected next action:
`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts`.
Gate AK is an STC-aware matrix refresh, not a broad source crawl.
Gate AK has now landed:
`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan`.
It keeps the Gate AA 40-row matrix intact, adds no runtime movement,
preserves opening/leak `Rw 38.2 / STC 39`, high-leakage
`Rw 33.7 / STC 34`, and `STC`-only target `STC 39`, and keeps
unsupported `R'w`, `DnT,w`, field, building, source-absent, duplicate,
and wrong-basis opening routes budget-free. Gate AK selection status:
`gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_landed_selected_building_prediction_owner_gap_gate_al`.
Selected next action:
`gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-al-airborne-building-prediction-owner-gap-refresh-contract.test.ts`.
Gate AL is a building prediction owner gap refresh, not a building
runtime promotion: direct curve, flanking energy, junction/coupling,
room standardization, and uncertainty owners must be executable before
building `R'w` or `DnT,w` can promote.
Gate AL has now landed:
`gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_plan`.
It maps the Gate O/P building formula terms into explicit runtime-unowned
owners: direct separating-element frequency curve, flanking path energy
sum, junction vibration reduction index, room absorption standardization,
and building prediction uncertainty budget. Complete building requests
remain `unsupported`; partial building requests remain `needs_input`;
lab `Rw`/`STC`, field `R'w`/`DnT,w`, opening/leak lab adapters, and
source single numbers without curves remain blocked as building aliases.
Gate AL selection status:
`gate_al_personal_use_mvp_airborne_building_prediction_owner_gap_refresh_landed_no_runtime_selected_direct_curve_owner_gate_am`.
Gate AL validation passed on 2026-05-12: focused Gate AL 1 file /
6 tests, Gate AK/Gate AL continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 379 files /
2187 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 504 files /
2989 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-am-airborne-building-prediction-direct-curve-owner-contract.test.ts`.
Gate AM has now landed:
`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_contract_plan`.
Gate AM is a no-runtime direct separating-element frequency curve owner
contract for airborne building prediction. It requires selected dynamic
airborne frequency-curve ownership, frequency-band resolution, ISO 717-1
rating basis, selected candidate trace ownership, and basis-compatible
metric scope before the direct-energy term can be used. Lab `Rw` /
`STC`, field `R'w` / `DnT,w`, opening/leak lab adapters, source single
numbers without curves, and legacy raw dynamic field/building
continuation snapshots stay blocked as building-output aliases. Complete
building requests remain `unsupported`; partial building requests remain
`needs_input`.
Gate AM selection status:
`gate_am_personal_use_mvp_airborne_building_prediction_direct_curve_owner_landed_no_runtime_selected_flanking_path_energy_gate_an`.
Gate AM validation passed on 2026-05-12: focused Gate AM 1 file /
6 tests, Gate AL/Gate AM continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 380 files /
2193 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 505 files /
2995 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-an-airborne-building-prediction-flanking-path-energy-owner-contract.test.ts`.
Gate AN has now landed:
`gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_contract_plan`.
Gate AN is a no-runtime flanking path energy owner contract for
airborne building prediction. It requires the Gate AM direct curve
dependency, named flanking path topology, path identity/count ownership,
basis-compatible indirect transmission terms, coupling surface area
ownership, source-absent conservative assumption ownership, and
basis-compatible metric scope before the flanking-energy term can be
used. Generic conservative flanking labels, lab `Rw` / `STC`, field
`R'w` / `DnT,w`, opening/leak lab adapters, source single numbers
without path terms, and legacy raw dynamic field/building continuation
snapshots stay blocked as building-output aliases. Complete building
requests remain `unsupported`; partial building requests remain
`needs_input`.
Gate AN selection status:
`gate_an_personal_use_mvp_airborne_building_prediction_flanking_path_energy_owner_landed_no_runtime_selected_junction_vibration_gate_ao`.
Gate AN validation passed on 2026-05-12: focused Gate AN 1 file /
6 tests, Gate AM/Gate AN continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 381 files /
2199 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 506 files /
3001 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ao-airborne-building-prediction-junction-vibration-owner-contract.test.ts`.
Gate AO has now landed:
`gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_contract_plan`.
Gate AO is a no-runtime junction vibration reduction owner contract for
airborne building prediction. It requires the Gate AN flanking path
energy dependency, explicit junction class ownership, coupling length
ownership, basis-compatible vibration reduction index ownership,
path-specific junction coupling ownership, and basis-compatible metric
scope before the junction term can be used. Generic junction class
labels, lab `Rw` / `STC`, field `R'w` / `DnT,w`, opening/leak lab
adapters, source single numbers without junction terms, and legacy raw
dynamic field/building continuation snapshots stay blocked as
building-output aliases. Complete building requests remain
`unsupported`; partial building requests remain `needs_input`.
Gate AO selection status:
`gate_ao_personal_use_mvp_airborne_building_prediction_junction_vibration_owner_landed_no_runtime_selected_room_standardization_gate_ap`.
Gate AO validation passed on 2026-05-12: focused Gate AO 1 file /
6 tests, Gate AN/Gate AO continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 382 files /
2205 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 507 files /
3007 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts`.
Gate AP has now landed:
`gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_contract_plan`.
Gate AP is a no-runtime room absorption / standardization owner
contract for airborne building prediction. It requires the Gate AO
junction vibration dependency, separating element area ownership,
receiving-room volume ownership, receiving-room RT60 ownership,
building standardization basis ownership, basis-compatible room
absorption ownership, and basis-compatible metric scope before the room
term can be used. Generic room labels, apparent `R'w` relabelled as
`DnT,w`, lab `Rw` / `STC`, field `R'w` / `DnT,w`, opening/leak lab
adapters, source single numbers without room terms, and legacy raw
dynamic field/building continuation snapshots stay blocked as
building-output aliases. Complete building requests remain
`unsupported`; partial building requests remain `needs_input`.
Gate AP selection status:
`gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_landed_no_runtime_selected_uncertainty_budget_gate_aq`.
Gate AP validation passed on 2026-05-12: focused Gate AP 1 file /
6 tests, Gate AO/Gate AP continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 383 files /
2211 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 508 files /
3013 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5.
Selected next action:
`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`.
Selected next file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts`.
Post-Gate-AP checkpoint:
`docs/calculator/CHECKPOINT_2026-05-12_POST_GATE_AP_CHECKPOINT_AND_BROAD_REVALIDATION_HANDOFF.md`.
The checkpoint re-read docs and implementation, found no mismatch, and
keeps Gate AQ as the selected no-runtime uncertainty-budget owner before
any later all-owner building-prediction runtime corridor. Focused Gate
AP, `pnpm calculator:gate:current`, and broad `pnpm check` validation
passed at this checkpoint.
Company-internal daily-use final path:
`docs/calculator/CHECKPOINT_2026-05-12_INTERNAL_DAILY_USE_FINAL_PATH_AND_REVALIDATION_HANDOFF.md`.
The old internal-use operating envelope is a narrower historical
controlled-use bar. Gate AR has now promoted the all-owner building
runtime corridor, and Gate AS has made it visible across surface/API/
report paths; the current daily-use bar remains open until acceptance
matrix refresh and release handoff pass.
Gate AQ implementation-ready plan:
`docs/calculator/CHECKPOINT_2026-05-12_GATE_AQ_PLAN_REVALIDATION_AND_IMPLEMENTATION_READY_HANDOFF.md`.
Gate AQ must be a no-runtime uncertainty-budget owner contract and
select Gate AR all-owner building-prediction runtime corridor. Do not
promote building `R'w` / `DnT,w` runtime before Gate AQ is executable and
visible.
Gate AQ has now landed:
`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`.
Gate AQ selection status:
`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_landed_no_runtime_selected_all_owner_runtime_corridor_gate_ar`.
It owns the metric-specific `+/-9 dB` source-absent uncertainty-budget
surface for building `R'w` and `DnT,w`, preserves not-measured posture,
keeps runtime parked, blocks lab/field/opening/source-single-number and
generic safety-factor aliases, and selects the Gate AR all-owner runtime corridor:
`gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan`.
Selected Gate AR file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts`.
Gate AQ handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_HANDOFF.md`.
Gate AQ validation passed on 2026-05-12: focused Gate AQ 1 file /
6 tests, Gate AP/Gate AQ continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 384 files /
2217 tests, web 74 files / 318 passed + 18 skipped, build 5/5,
whitespace guard clean, and full `pnpm check` with engine 509 files /
3019 tests, web 180 files / 993 passed + 18 skipped, lint/typecheck
clean, and build 5/5. `git diff --check` passed after validation-note
sync.
Gate AR has now landed:
`gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan`.
Gate AR selection status:
`gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_landed_selected_surface_parity_gate_as`.
Gate AR promotes complete airborne `building_prediction` requests to
source-absent `R'w` / `DnT,w` runtime through
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
The first complete lined massive fixture returns `R'w 58` and
`DnT,w 59` with the Gate AQ `+/-9 dB` not-measured uncertainty budget.
Partial building context remains `needs_input`; field context remains
Gate I; lab `Rw` / `STC` remains lab; opening/leak building outputs
remain blocked. Gate AR selects:
`gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_plan`.
Selected Gate AS file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as-airborne-building-prediction-surface-parity-contract.test.ts`.
Gate AR validation passed on 2026-05-12: focused Gate AR 1 file /
7 tests, Gate AQ/Gate AR continuity 2 files / 13 tests, airborne
building-prediction continuity 12 files / 72 tests, matrix/split
revalidation 7 files / 40 tests, `pnpm calculator:gate:current` with
engine 385 files / 2224 tests, web 74 files / 318 passed + 18 skipped,
build 5/5, and full `pnpm check` with lint/typecheck clean, engine
510 files / 3026 tests, web 180 files / 993 passed + 18 skipped, and
build 5/5. `git diff --check` passed after validation-note sync.
Gate AR handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_HANDOFF.md`.
Gate AS has now landed:
`gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_plan`.
Gate AS selection status:
`gate_as_personal_use_mvp_airborne_building_prediction_surface_api_report_parity_landed_selected_acceptance_matrix_gate_at`.
Gate AS preserves Gate AR `R'w 58` / `DnT,w 59` and the `+/-9 dB`
not-measured budget while surfacing the Gate AR candidate, method,
values, warning, and lab-alias boundaries across output cards, route
posture, scenario summary, target-output status/corridor,
method/corridor dossiers, saved replay, Markdown report, and estimate
API payloads. Gate AS selects:
`gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan`.
Selected Gate AT file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at-acceptance-matrix-refresh-after-building-prediction-contract.test.ts`.
Gate AS handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_HANDOFF.md`.
Gate AS validation passed on 2026-05-12: focused Gate AS engine 1 file /
4 tests, focused Gate AS web 1 file / 3 tests, Gate AR/Gate AS engine
continuity 2 files / 11 tests, related web surface regression 5 files /
22 tests, engine/web typecheck, `pnpm calculator:gate:current` with
engine 386 files / 2228 tests, web 75 files / 321 passed + 18 skipped,
build 5/5, whitespace guard clean, and full `pnpm check` with
lint/typecheck clean, engine 511 files / 3030 tests, web 181 files /
996 passed + 18 skipped, and build 5/5.
Gate AT has now landed:
`gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_plan`.
Gate AT selection status:
`gate_at_personal_use_mvp_acceptance_matrix_refresh_after_building_prediction_landed_selected_daily_use_release_handoff_gate_au`.
Gate AT is the post-building-prediction acceptance matrix refresh: it
refreshes the executable daily-use acceptance matrix to 41 rows after
Gate AS, retires the stale complete-building `unsupported` row id, pins
`R'w 58` / `DnT,w 59` building runtime with the `+/-9 dB` not-measured
budget, adds the broad-target lab-alias boundary row, and keeps partial
building, opening/leak building, ASTM/IIC, exact-source precedence,
hostile layer-edit, and high-layer-count rows explicit.
Gate AT selects the daily-use release handoff as the next slice:
`gate_au_personal_use_mvp_daily_use_release_handoff_plan`.
Selected Gate AU file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-au-daily-use-release-handoff-contract.test.ts`.
Gate AT handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_HANDOFF.md`.
Gate AT validation passed on 2026-05-12: focused Gate AT engine
contract 1 file / 6 tests, Gate AS + Gate AT continuity 2 files / 10
tests, engine typecheck, `pnpm calculator:gate:current` with engine 387
files / 2234 tests, web 75 files / 321 passed + 18 skipped, build 5/5,
and `git diff --check` clean.
Gate AU has now landed:
`gate_au_personal_use_mvp_daily_use_release_handoff_plan`.
Gate AU selection status:
`gate_au_personal_use_mvp_daily_use_release_handoff_landed_selected_post_release_accuracy_roadmap_gate_av`.
Gate AU is the company-internal daily-use ready handoff: it consumes
the Gate AT 41-row matrix, preserves 26 supported value rows, accepts
16 fail-closed boundary rows, confirms zero coverage gaps and zero
daily-use release blockers, and records
`company_internal_daily_use_ready_with_visible_basis_budgets_needs_input_and_unsupported_boundaries`.
Gate AU does not move runtime values, tolerances, source precedence,
inputs, API shape, cards, or report copy. Gate AU selects the
post-release accuracy roadmap:
`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`.
Selected Gate AV file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts`.
Gate AV roadmap analysis is captured in
`docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_AV_POST_RELEASE_ACCURACY_AND_ADAPTER_ROADMAP_PLAN.md`.
It keeps Gate AV no-runtime and selects source-absent solver gap
cartography as the recommended next lane. Gate AV has now landed with
selection status:
`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw`.
Selected Gate AW action:
`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`.
Selected Gate AW file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`.
Gate AW has now landed:
`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`.
Gate AW selection status:
`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_landed_no_runtime_selected_advanced_wall_source_absent_solver_contract_gate_ax`.
Gate AW is no-runtime source-absent solver gap cartography. It maps
20 wall/floor layer-combination surfaces across runtime-owned,
`needs_input`, unsupported, adapter-gap, and solver-gap states, then
selects the advanced wall source-absent solver contract as the next
calculator-first lane rather than broad source-row crawling.
Selected Gate AX action:
`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`.
Selected Gate AX file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ax-advanced-wall-source-absent-solver-contract.test.ts`.
Gate AW validation passed on 2026-05-13: focused Gate AW 1 file / 6
tests, Gate AV + Gate AW continuity 2 files / 13 tests,
`pnpm calculator:gate:current` with engine 390 files / 2253 tests, web
75 files / 321 passed + 18 skipped, build 5/5, and whitespace guard
clean.
Gate AX has now landed:
`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan`.
Gate AX selection status:
`gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay`.
Gate AX is no-runtime advanced wall source-absent solver input
contracting. It owns the physical fields for multi-panel /
multi-cavity direct-curve wall prediction and keeps complete input at
`ready_for_runtime_gate` until a later runtime corridor promotes a
number.
Selected Gate AY action:
`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`.
Selected Gate AY file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts`.
Gate AX validation passed on 2026-05-13: focused Gate AX 1 file / 6
tests, Gate AW + Gate AX continuity 2 files / 12 tests,
`pnpm calculator:gate:current` with engine 391 files / 2259 tests, web
75 files / 321 passed + 18 skipped, build 5/5, and whitespace guard
clean.
Gate AY has now landed:
`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan`.
Gate AY selection status:
`gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az`.
Gate AY is the bounded advanced wall source-absent solver runtime
corridor. Complete explicit Gate AX owner input returns lab `Rw 65` /
`STC 65` / `C -1.1` / `Ctr -6.4` through
`gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor` with
visible `+/-8 dB` `Rw` / `STC` and `+/-3 dB` `C` / `Ctr`
source-absent budgets. Weak opening/leak sub-elements are not ignored,
exact source precedence and existing grouped triple-leaf delegates remain
first, missing physical owners return `needs_input`, hostile duplicate
or split ownership fails closed, and field/building outputs stay
unsupported. Gate AZ is selected to make the same physical fields
first-class on the Dynamic Calculator wall input surface.
Gate AY short label: advanced wall source-absent solver runtime corridor.
Selected Gate AZ action:
`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`.
Selected Gate AZ file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts`.
Gate AY validation passed on 2026-05-13: focused Gate AY 1 file / 8
tests, Gate AX + Gate AY continuity 2 files / 14 tests, Gate AW + Gate
AX + Gate AY continuity 3 files / 20 tests,
`pnpm calculator:gate:current` with engine 392 files / 2267 tests, web
75 files / 321 passed + 18 skipped, build 5/5, and whitespace guard
clean.
Gate AZ has now landed:
`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan`.
Gate AZ selection status:
`gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba`.
Gate AZ wires the Gate AY advanced wall physical owner fields into
shared `AirborneContext.advancedWall`, the dynamic-airborne adapter,
route-input assessment, workbench live/scenario/saved/server snapshot
flows, output cards, posture, corridor dossier, Markdown report, API
payloads, and the current-gate runner. Complete UI-derived advanced
wall input preserves Gate AY lab `Rw 65` / `STC 65` / `C -1.1` /
`Ctr -6.4` with visible `+/-8 dB` `Rw` / `STC` and `+/-3 dB` `C` /
`Ctr` source-absent budgets. Partial inputs stay `needs_input`,
field/building targets stay unsupported, duplicate/split ownership is
refused, and exact-source / existing delegate precedence remains first.
Gate AZ selects the bounded floor-impact source-absent solver gap
cartography lane next, not broad source crawling.
Selected Gate BA action:
`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`.
Selected Gate BA file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts`.
Gate BA has now landed:
`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan`.
Gate BA selection status:
`gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_landed_no_runtime_selected_floor_impact_source_absent_input_contract_gate_bb`.
Gate BA is no-runtime floor-impact source-absent solver gap
cartography. It maps exact floor-system precedence, heavy concrete
bare/floating formulas, published-family concrete anchors,
steel/timber/CLT formula corridors, field-impact context, ASTM/building
unsupported boundaries, missing-owner prompts, and remaining
dynamic-stiffness/load/lower-treatment/mixed-support solver gaps. It
pins current probes including exact `Ln,w 51`, heavy concrete
`Ln,w 50.3` / `DeltaLw 24.3`, missing-load `DeltaLw` unsupported,
field `L'n,w 52.3` / `L'nT,w 50.3`, and ASTM unsupported without
moving runtime values. Gate BA selects the floor-impact source-absent
input contract as the next bounded lane rather than broad source-row
crawling.
Next plain label: floor-impact source-absent input contract.
Selected Gate BB action:
`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`.
Selected Gate BB file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb-floor-impact-source-absent-input-contract.test.ts`.
Gate BB has now landed:
`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_plan`.
Gate BB selection status:
`gate_bb_personal_use_mvp_floor_impact_source_absent_input_contract_landed_no_runtime_selected_formula_corridor_gate_bc`.
Gate BB is no-runtime floor-impact source-absent input ownership. It
names base/carrier family, upper topping/floating mass, resilient-layer
dynamic stiffness or source-owned product curve, load basis, lower
treatment coupling, steel carrier geometry, field/building/ASTM basis
boundaries, and duplicate/split/mixed-support topology guards before
any wider floor-impact formula corridor can promote. Runtime stays
frozen: exact `Ln,w 51`, heavy concrete `Ln,w 50.3` / `DeltaLw 24.3`,
missing-load published-family `Ln,w 47` with `DeltaLw` unsupported,
and ASTM unsupported behavior do not move. Gate BB selects the bounded
floor-impact source-absent formula corridor as Gate BC.
Next plain label: floor-impact source-absent formula corridor.
Selected Gate BC action:
`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`.
Selected Gate BC file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bc-floor-impact-source-absent-formula-corridor-contract.test.ts`.
Gate BC has now landed:
`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_plan`.
Gate BC selection status:
`gate_bc_personal_use_mvp_floor_impact_source_absent_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_bd`.
Gate BC is no-runtime and defines the bounded heavy-concrete combined
upper/lower formula corridor with source-absent not-measured budgets of
`+/-6.5 dB` for `Ln,w` and `+/-5.5 dB` for `DeltaLw`. Gate BC selected
the floor-impact source-absent runtime corridor as Gate BD.
Selected Gate BD action:
`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`.
Selected Gate BD file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bd-floor-impact-source-absent-runtime-corridor-contract.test.ts`.
Gate BD has now landed:
`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan`.
Gate BD selection status:
`gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be`.
Gate BD promotes complete explicit heavy-concrete combined upper/lower
input to lab `Ln,w 44.4` / `DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`,
with `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured budgets.
Exact source, existing heavy floating, steel/timber/CLT, missing-input,
field/building, and ASTM/IIC boundaries remain protected. Gate BD
selects Gate BE surface parity next, not broad source-row crawling.
Next plain label: floor-impact source-absent surface parity.
Selected Gate BE action:
`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`.
Selected Gate BE file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts`.
Gate BD validation completed on 2026-05-13: focused Gate BD 1 file / 6
tests, Gate BC + Gate BD continuity 2 files / 14 tests, Gate BA + Gate
BB + Gate BC + Gate BD continuity 4 files / 29 tests, impact regression
guard 3 files / 109 tests, Gate AZ fixture type-safety guard 1 file / 5
tests, engine typecheck, engine build, `pnpm calculator:gate:current`
with engine 397 files / 2301 tests, web 76 files / 325 passed + 18
skipped, repo build 5/5, whitespace guard clean, and `git diff --check`
clean. Known non-fatal build warnings remain the optional `sharp/@img`
resolution warnings from `@turbodocx/html-to-docx`.
Post-Gate BD full revalidation is now recorded in
`docs/calculator/CHECKPOINT_2026-05-13_POST_GATE_BD_FULL_REVALIDATION_AND_GATE_BE_PLAN_HANDOFF.md`.
The first `pnpm check` attempt caught two lint-only issues: an unused
Gate BA import and redundant `Boolean(...)` calls in the Gate AY
advanced-wall adapter. After those behavior-neutral cleanups, full
`pnpm check` passed with lint, typecheck, engine 522 files / 3103 tests,
web 182 files / 985 passed + 18 skipped, and build 5/5. Gate BE has now
landed:
`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan`.
Gate BE selection status:
`gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf`.
Gate BE keeps the Gate BD runtime frozen at lab `Ln,w 44.4` /
`DeltaLw 30.1` through the `Heavy concrete combined formula corridor`
and makes the basis plus source-absent not-measured budgets visible
across cards, posture, support trace, dossiers, scenario/saved replay,
API payloads, and Markdown report. Gate BE selects Gate BF input
surface next.
Selected Gate BF action:
`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`.
Selected Gate BF file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts`.
Next plain label: floor-impact source-absent input surface.
Gate BE validation completed on 2026-05-13: focused Gate BE 1 file / 4
tests, Gate BD + Gate BE continuity 2 files / 10 tests, focused web
surface parity 1 file / 3 tests, engine/web typecheck, `pnpm
calculator:gate:current` with engine 398 files / 2305 tests, web 76
files / 325 passed + 18 skipped, repo build 5/5, and full `pnpm check`
with lint/typecheck clean, engine 523 files / 3107 tests, web 183 files
/ 1003 passed + 18 skipped, and build 5/5. Gate BF has now landed:
`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`.
Gate BF selection status:
`gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_landed_selected_revalidation_gate_bg`.
Gate BF makes the `Heavy concrete combined input surface` first-class
on the Dynamic Calculator floor route. Complete UI-derived
heavy-concrete combined input still returns lab `Ln,w 44.4` /
`DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
with the same `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured
budgets. Workbench controls, scenario analysis, saved replay, server
snapshot replay, output cards, Markdown report payloads, calculator API
payloads, and impact-only API payloads now feed the same predictor
input. Partial physical fields stay `needs_input`, ambiguous concrete
base ownership is unsafe, exact source precedence remains first, and
field/building/ASTM/IIC aliases remain blocked.
Selected Gate BG action:
`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`.
Selected Gate BG file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts`.
Next plain label: floor-impact source-absent post-input-surface
revalidation.
Gate BF validation completed on 2026-05-13: focused Gate BF 1 file / 5
tests, focused web heavy-concrete combined input-surface acceptance 1
file / 3 tests, server snapshot replay 1 file / 4 tests, engine/web
typecheck, and `pnpm calculator:gate:current` with engine 399 files /
2310 tests, web 77 files / 328 passed + 18 skipped, repo build 5/5,
and whitespace guard clean. Full `pnpm check` passed with
lint/typecheck clean, engine 524 files / 3112 tests, web 184 files /
1006 passed + 18 skipped, and build 5/5 after timeout-only hardening on
three pre-existing long-running engine tests.
Gate BG has now landed:
`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan`.
Gate BG selection status:
`gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_landed_no_runtime_selected_coverage_matrix_refresh_gate_bh`.
Gate BG is a no-runtime revalidation after Gate BF's
`Heavy concrete combined input surface`: complete and safe-reordered
heavy-concrete combined input remain lab `Ln,w 44.4` / `DeltaLw 30.1`
through `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
with unchanged `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured
budgets. Missing load basis, duplicate/ambiguous concrete base
ownership, exact source precedence, and field/ASTM basis requests remain
out of promoted runtime support.
Selected Gate BH action:
`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`.
Selected Gate BH file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts`.
Next plain label: floor-impact source-absent coverage matrix refresh.
Gate BG validation completed on 2026-05-13: focused Gate BG 1 file / 4
tests, Gate BF + Gate BG continuity 2 files / 9 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 400 files / 2314
tests, web 77 files / 328 passed + 18 skipped, repo build 5/5, full
`pnpm check` with lint/typecheck clean, engine 525 files / 3116 tests,
web 184 files / 1006 passed + 18 skipped, repo build 5/5, and
whitespace guard clean.
Gate BH has now landed:
`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`.
Gate BH selection status:
`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi`.
Gate BH is a no-runtime floor-impact source-absent coverage matrix
refresh after Gates BA-BG. It keeps the `Heavy concrete combined input
surface` complete and safe-reordered rows at lab `Ln,w 44.4` /
`DeltaLw 30.1` with unchanged source-absent budgets, adds
`floor.building_impact.prediction_adapter_boundary`, and preserves
heavy floating, steel, timber/CLT, exact source, field, ASTM/IIC,
missing-input, hostile-topology, and many-layer boundaries.
Selected Gate BI action:
`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`.
Selected Gate BI file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`.
Next plain label: floor-impact field/building adapter contract.
Gate BH validation completed on 2026-05-13: focused Gate BH 1 file / 6
tests, Gate BG + Gate BH continuity 2 files / 10 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 401 files / 2320
tests, web 77 files / 328 passed + 18 skipped, repo build 5/5,
whitespace guard clean, and full `pnpm check` with lint/typecheck clean,
engine 526 files / 3122 tests, web 184 files / 1006 passed + 18
skipped, and repo build 5/5.
Known non-fatal build
warnings remain the optional `sharp/@img` warnings from
`@turbodocx/html-to-docx`.
Gate AU handoff:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AU_HANDOFF.md`.
Gate AU validation completed on 2026-05-13: focused Gate AU 1 file / 6
tests, Gate AT + Gate AU continuity 2 files / 12 tests, engine
typecheck, `pnpm calculator:gate:current` with engine 388 files / 2240
tests, web 75 files / 321 passed + 18 skipped, build 5/5, full engine
suite 513 files / 3042 tests, targeted web heavy-core rerun 1 file / 3
tests, full web test rerun 181 files / 996 passed + 18 skipped, repo
build 5/5, and whitespace guard clean. The first broad `pnpm check`
attempt passed lint/typecheck and engine before a transient web
deep-hybrid heavy-core timeout; reruns proved the web invariant green
without runtime movement.
Do not keep adding narrow steel-floor source/packet gates unless the
active matrix or a later runtime proposal names a specific source-owned
unblocker.
Selected Gate Y CLT / mass-timber Ctr spectrum adapter file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts`.
Landed Gate Z post-CLT-Ctr coverage revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts`.
Landed Gate AA scenario matrix v2 expansion file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts`.
Landed Gate AB flat multicavity topology input-surface file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts`.
Landed Gate AC flat multicavity topology surface-parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ac-flat-multicavity-topology-surface-parity-contract.test.ts`.
Landed Gate AD flat multicavity broad-revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts`.
Landed Gate AE flat multicavity solver-broadening file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts`.
Landed Gate AF post-flat-multicavity solver-broadening revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts`.
Landed Gate AG floor formula surface polish file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ag-floor-formula-surface-polish-contract.test.ts`.
Landed Gate AH opening/leak STC spectrum adapter file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts`.
Landed Gate AI opening/leak STC surface parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts`.
Selected Gate X AAC/non-homogeneous masonry solver file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts`.
Landed Gate W coverage matrix refresh file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts`.
Landed Gate V opening/leak revalidation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts`.
Selected Gate BI file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`.
Selected Gate A coverage matrix file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`.
Selected Gate B timber/CLT DeltaLw file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`.
Selected Gate C timber/CLT DeltaLw formula corridor file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`.
Selected Gate D timber/CLT DeltaLw runtime corridor file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`.
Selected Gate E timber/CLT DeltaLw surface parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts`.
Selected Gate F timber/CLT DeltaLw input surface file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts`.
Selected Gate G generalized wall multicavity route-readiness file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`.
Selected Gate H lined masonry / CLT wall upgrade file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`.
Selected Gate I airborne field-context continuation file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`.
Selected Gate J airborne field-context surface parity file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`.
Selected Gate K airborne field-context input surface file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`.
Selected Gate L airborne building-prediction boundary file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts`.
Selected Gate M airborne building-prediction input contract file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts`.
Selected Gate N airborne building-prediction runtime adapter file:
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts`.
Latest landed calculator gate checkpoint:
`docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md`.
Latest strategic ROI revalidation:
`docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`.
It selected Gate G after Gate F; Gate G has now landed and selected
Gate H, Gate H selected Gate I, Gate I selected Gate J, Gate J selected
Gate K, Gate K selected the building-prediction boundary, Gate L
selected the building-prediction input contract, and Gate M has now
selected the building-prediction runtime adapter before any return to
steel-floor tolerance tightening.
Gate BH landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`.
Gate BH landed action:
`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`.
Gate BG landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`.
Gate BG landed action:
`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`.
Gate BF landed file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`.
Gate BF landed action:
`gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`.
The 2026-05-07 broad revalidation after Gate AK is complete: `pnpm
check` passed after aligning steel-floor validation corpora and
ambiguous duplicate/disjoint lightweight-steel floor schedule
expectations. Runtime values remain unchanged.

## Authority Order

1. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
2. `docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md`
3. `docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AH_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-12_POST_GATE_AE_CHECKPOINT_AND_BROAD_REVALIDATION_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AB_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_RESEARCH_PLAN_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_BROAD_REVALIDATION_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_W_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_V_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_U_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_T_HANDOFF.md`
20. `docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_S_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-11_INSUL_ISO_RESEARCH_AND_GATE_P_REPLAN_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_M_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_L_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_K_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_J_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_I_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_H_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_F_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_E_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BI_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BH_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BG_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BF_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BE_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BD_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BC_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BB_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BA_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AZ_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AY_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AX_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AW_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AV_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AU_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AT_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AS_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AR_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AQ_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_GATE_AP_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AP_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AO_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AN_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AM_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AL_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_BROAD_REVALIDATION_GATE_AK_TO_GATE_AL_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-07_GATE_AK_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AK_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AJ_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AI_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AH_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AG_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AF_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-07_GATE_AE_REVALIDATION_GATE_AF_PLAN_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AE_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AD_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AC_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AB_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AA_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Z_HANDOFF.md`
4. `docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Y_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_X_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_W_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_V_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_T_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_S_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_R_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md`
20. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md`
21. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md`
22. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md`
23. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`
24. `docs/calculator/CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md`
25. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md`
26. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md`
27. `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md`
28. `docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_MILESTONE_RESEARCH_HANDOFF.md`
29. `docs/calculator/CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md`
30. `docs/calculator/CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md`
31. `docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md`
32. `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Entries below are historical/backlog authority context unless the
current workflow above promotes them again.

4. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-05_PRE_UBIQ_PACKAGED_FINISH_GATE_A_ANALYSIS_REPLAN_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-05_BROAD_REVALIDATION_AND_NEXT_STEP_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A_HANDOFF.md`
10. `docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`
11. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md`
12. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
15. `docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`
16. `docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`
17. `docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`
18. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md`
9. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md`
11. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A_HANDOFF.md`
13. `docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md`
14. `docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_B_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_C_CLOSEOUT_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md`
10. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_GATE_B_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md`
6. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md`
2. `docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md`
3. `docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md`
4. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md`
7. `docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`
9. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md`
9. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
6. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
5. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
6. `docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
7. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md`
8. `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md`
10. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md`
4. `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_T_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_S_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_R_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_Q_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_P_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_O_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_N_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_M_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_L_HANDOFF.md`
4. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_K_HANDOFF.md`
5. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_J_HANDOFF.md`
6. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_I_HANDOFF.md`
7. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_H_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G9_HANDOFF.md`
9. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G8_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G7_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G6_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G5_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G4_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md`
10. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2B_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2_HANDOFF.md`
12. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G_HANDOFF.md`
13. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_F_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_E_HANDOFF.md`
15. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_D_HANDOFF.md`
16. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C_HANDOFF.md`
17. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B_HANDOFF.md`
18. `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A_HANDOFF.md`
19. `docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
8. `docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md`
7. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
8. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md`
9. `docs/calculator/SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md`
10. `docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
11. `docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
12. `docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md`
13. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md`
14. `docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
15. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md`
16. `docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
17. `docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md`
18. `docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
19. `docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
20. `docs/calculator/SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md`
21. `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
22. `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
23. `docs/calculator/SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md`
24. `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md`
25. `docs/calculator/CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md`
26. `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
27. `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
28. `docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md`
29. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A_HANDOFF.md`
30. `docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md`
31. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md`
32. `docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md`
33. `docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md`
34. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_C_CLOSEOUT_HANDOFF.md`
35. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_A_HANDOFF.md`
36. `docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md`
37. `docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md`
38. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md`
39. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_PILOT_HANDOFF_GATE_A_HANDOFF.md`
40. `docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md`
41. `docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md`
42. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md`
43. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_A_HANDOFF.md`
44. `docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md`
45. `docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
46. `docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
47. `docs/calculator/CHECKPOINT_2026-04-29_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
48. `docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`
49. `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_GATE_A_HANDOFF.md`
50. `docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md`
51. `docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT_HANDOFF.md`
52. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md`
53. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md`
54. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md`
55. `docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md`
56. `docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md`
57. `docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md`
58. `docs/calculator/CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md`
59. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md`
60. `docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md`
61. `docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md`
62. `docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md`
63. `docs/calculator/CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_A_HANDOFF.md`
64. `docs/calculator/SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md`
65. `docs/calculator/CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_CLOSEOUT_HANDOFF.md`
66. `docs/calculator/CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md`
67. `docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md`
68. `docs/calculator/CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_HANDOFF.md`
69. `docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
70. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md`
71. `docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
72. `docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md`
73. `docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
74. `docs/calculator/CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
75. `docs/calculator/SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md`
76. `docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
77. `docs/calculator/CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
78. `docs/calculator/SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md`
79. `docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md`
80. `docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_B_HANDOFF.md`
81. `docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md`
82. `docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md`
83. `docs/calculator/CURRENT_STATE.md`
84. `docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md`
85. `docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md`
86. `docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md`
87. `docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md`
88. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md`
89. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md`
90. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md`
91. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md`
92. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md`
93. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md`
94. `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md`
95. `docs/calculator/CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md`
96. `docs/calculator/CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md`
97. `docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md`
98. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_CLOSEOUT_HANDOFF.md`
99. `docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md`
100. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_B_HANDOFF.md`
101. `docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_A_HANDOFF.md`
102. `docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md`
103. `docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`
104. `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
105. `docs/calculator/SOURCE_GAP_LEDGER.md`
106. `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
107. `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
108. `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
109. `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
110. `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
Use the long-form plan files only for backlog context after reading the current
plan.

## Current Workflow

- current selected slice:
  `personal_use_mvp_coverage_sprint_after_gate_be_floor_impact_source_absent_surface_parity`
- current next decision:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts`
  should run
  `gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan`.
- current selected status:
  `gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf`.
- current strategic replan:
  `docs/calculator/CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md`.
  Gate BI and Personal-Use MVP Coverage Sprint Gates A through BC have
  landed. Gate AU is the company-internal daily-use ready handoff:
  the Gate AT matrix has zero coverage gaps and zero daily-use release
  blockers, with unsupported and missing-input boundaries kept explicit.
  Gate AV is landed no-runtime post-release accuracy/adapters planning.
  Gate AW is landed no-runtime source-absent solver gap cartography.
  Gate AX is landed no-runtime advanced wall source-absent solver
  contract. Gate AY is landed advanced wall source-absent solver runtime
  corridor. Gate AZ is landed advanced wall source-absent solver input
  surface. Gate BA is landed floor-impact source-absent solver gap
  cartography. Gate BB is landed floor-impact source-absent input
  contract. Gate BC is landed no-runtime bounded floor-impact
  source-absent formula corridor. Gate BD is landed runtime corridor for
  complete heavy-concrete combined upper/lower input at `Ln,w 44.4` /
  `DeltaLw 30.1` with source-absent not-measured budgets. Gate BE is
  landed surface parity for the `Heavy concrete combined formula corridor`
  and selected Gate BF input surface rather than adapter,
  retune, or broad source-row crawling.
  Next plain label: floor-impact source-absent input surface.
  Gate BE validation is recorded in
  `docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md`.
- latest strategic ROI revalidation:
  `docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`.
- latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md`.
- latest landed calculator gate checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate BH:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`
  landed
  `gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`.
  It consumes Gate BG's selected closed-owner lane, revalidates the
  owner map as a policy-only `tighten` candidate with `max 0.6 dB` /
  `mean 0.6 dB`, and keeps runtime values, tolerances, exact-source
  promotion, formula retune, source text/document ingestion, and
  lab/field/building aliases closed. Selection status:
  `gate_bh_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_landed_no_runtime_selected_tighten_candidate_governance_gate_bi`.
  Selected next action:
  `gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`.
  Validation result for Gate BH is recorded in the Gate BH checkpoint.
- older per-gate bullets below are historical handoff context unless the
  current plan explicitly promotes them again.
- previous landed model-first physics prediction pivot Gate BE:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`
  landed
  `gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`.
  It consumes Gate BD's selected paired-negative lane, defines the
  three additional paired-negative boundary requirements, accepts only
  complete future source-owned wrong-support or wrong-reference ISO lab
  `DeltaLw` boundary packets as residual-policy readiness evidence,
  rejects missing boundary owner/locator, wrong metric/basis,
  product/inferred, rights-blocked, non-explicit, and same-stack
  non-boundary rows, and keeps exact promotion, tolerance movement,
  formula retune, field/building alias, source text/document ingestion,
  and runtime movement closed. Selection status:
  `gate_be_same_stack_iso_delta_lw_paired_negative_closure_landed_no_runtime_selected_open_web_input_ownership_gate_bf`.
  Selected next action:
  `gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`.
  Validation result for Gate BE is recorded in the Gate BE checkpoint.
- previous landed model-first physics prediction pivot Gate BD:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`
  landed
  `gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`.
  It consumes only Gate BC's selected source-owned same-stack ISO
  `DeltaLw` holdout-count closure lane, defines the two additional
  holdout evidence requirements, accepts only complete future
  source-owned ISO lab same-stack steel `DeltaLw` holdout packets as
  residual-readiness evidence, rejects missing metric/owner/locator,
  wrong basis/reference, product/inferred, and rights-blocked packets,
  and keeps exact promotion, tolerance movement, formula retune, field/
  building alias, source text/document ingestion, and runtime movement
  closed. Selection status:
  `gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be`.
  Selected next action:
  `gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`.
  Validation result for Gate BD is recorded in the Gate BD checkpoint.
- previous landed model-first physics prediction pivot Gate BC:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`
  landed
  `gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`.
  It ranks only Gate BB accepted policy-decision rows, selects the
  source-owned same-stack ISO `DeltaLw` holdout-count closure lane for
  Gate BD, keeps paired-negative, open-web input ownership, and
  field/building owner closure lanes as ranked follow-ups, and keeps
  broad source crawl, exact promotion, tolerance movement, and runtime
  movement closed. Selection status:
  `gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd`.
  Selected next action:
  `gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`.
  Validation result for Gate BC is recorded in the Gate BC checkpoint.
- previous landed model-first physics prediction pivot Gate BB:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`
  landed
  `gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`.
  It consumes only Gate BA residual-admitted rows as policy-decision
  inputs, keeps blocked admission rows out, records the admitted future
  row as `hold_current_corridor_policy_decision`, exposes the blocker
  shortfalls required before retune/tighten/widen could be selected, and
  keeps policy labels separate from runtime movement, exact-source
  promotion, field/building aliases, and tolerance changes. Selection
  status:
  `gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc`.
  Selected next action:
  `gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`.
  Validation result for Gate BB is recorded in the Gate BB checkpoint.
- previous landed model-first physics prediction pivot Gate BA:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`
  landed
  `gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`.
  It admits only Gate AZ accepted calibration candidates to same-stack
  ISO lab `DeltaLw` residual-policy evaluation, keeps current
  request-status rows and rejected candidates blocked, requires
  rights-safe citation/locator metadata plus all Gate AT/AK owner fields,
  and evaluates the accepted future probe as residual-policy `hold` with
  holdout-count, paired-negative, open-web-input, and field/building
  owner blockers still present. Selection status:
  `gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb`.
  Selected next action:
  `gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`.
  Validation result for Gate BA is recorded in the Gate BA checkpoint.
- previous landed model-first physics prediction pivot Gate AZ:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`
  landed
  `gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`.
  It uses Gate AY accepted packet boundary rows as the only calibration
  candidate source, keeps current request-status rows and rejected AY
  probes blocked, admits only the accepted future same-stack ISO
  `DeltaLw` boundary probe as a calibration evidence candidate, requires
  rights-safe citation/locator metadata, and keeps candidate status
  separate from residual admission, exact-source promotion, field/building
  aliases, tolerance movement, retune, and runtime movement. Selection
  status:
  `gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba`.
  Selected next action:
  `gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`.
  Validation result for Gate AZ is recorded in the Gate AZ checkpoint.
- just landed model-first physics prediction pivot Gate AY:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`
  landed
  `gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`.
  It uses only Gate AX request-ledger rows as current packet acceptance
  boundary rows, keeps current entries in request status until a
  source-owned packet exists, accepts only a complete future same-stack
  ISO lab `DeltaLw` packet boundary probe, rejects wrong-basis,
  wrong-reference, product/inferred, rights-blocked, missing-owner, and
  blocked-ledger probes, and keeps accepted boundary packets out of
  calibration evidence, exact-source promotion, retune, field/building
  aliases, and runtime movement. Selection status:
  `gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az`.
  Selected next action:
  `gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`.
  Validation result for Gate AY is recorded in the Gate AY checkpoint.
- just landed model-first physics prediction pivot Gate AX:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`
  landed
  `gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`.
  It converts only Gate AW ready packet request rows into rights-safe
  request ledger entries, keeps blocked readiness rows out, preserves
  locator-only metadata and the Gate AT/AK owner checklist, and keeps
  ledger entries separate from source packets, measured rows,
  calibration evidence, exact overrides, retune evidence, and runtime
  movement. Selection status:
  `gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay`.
  Selected next action:
  `gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`.
  Validation result for Gate AX is recorded in the Gate AX checkpoint.
- previous landed model-first physics prediction pivot Gate AW:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`
  landed
  `gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`.
  It uses only Gate AV accepted source-lead intake rows as packet request
  candidates, requires rights-safe locator metadata plus all Gate AT/AK
  packet owner fields, blocks rejected intake rows, and keeps ready
  packet requests separate from source packets, measured rows,
  calibration evidence, exact overrides, retune evidence, and runtime
  movement. Selection status:
  `gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax`.
  Selected next action:
  `gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`.
  Validation result for Gate AW is recorded in the Gate AW checkpoint.
- previous landed model-first physics prediction pivot Gate AV:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`
  landed
  `gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`.
  It converts Gate AU's accepted manufacturer lab-report index,
  accredited lab-report index, and internal measurement packet leads into
  metadata-only acquisition request targets, does not ingest source text
  or measured metric values, keeps all rejected Gate AU buckets blocked,
  and keeps source packets, calibration evidence, exact overrides,
  retune evidence, and runtime movement unavailable. Selection status:
  `gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw`.
  Selected next action:
  `gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`.
  Validation result for Gate AV is recorded in the Gate AV checkpoint.
- previous landed model-first physics prediction pivot Gate AU:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`
  landed
  `gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`.
  It uses the Gate AT same-stack ISO lab `DeltaLw` packet surface as
  the only source-lead scope, lets only rights-safe manufacturer
  lab-report index, accredited lab-report index, and internal measurement
  packet leads proceed as metadata-only packet acquisition targets, and
  keeps product-only, wrong-basis, concrete-reference, boundary-only,
  missing-owner, and rights-blocked leads rejected. Selection status:
  `gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av`.
  Selected next action:
  `gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`.
  Validation result for Gate AU is recorded in the Gate AU checkpoint.
- previous landed model-first physics prediction pivot Gate AT:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`
  landed
  `gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`.
  It uses Gate AS selected same-stack ISO lab `DeltaLw` packet ownership
  as the only acceptance surface, accepts only the source-owned
  same-stack fixture as calibration evidence, rejects product-only,
  wrong-basis, concrete-reference, boundary-only, missing-owner, and
  rights-blocked packets, and keeps residual policy on `hold` without
  moving runtime values. Selection status:
  `gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au`.
  Selected next action:
  `gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`.
  Validation result for Gate AT is recorded in the Gate AT checkpoint.
- previous landed model-first physics prediction pivot Gate AS:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`
  landed
  `gate_as_steel_floor_formula_owner_evidence_targeting_plan`.
  It ranks all seven Gate AQ steel-floor formula evidence owners by
  calculator impact and acquisition feasibility, keeps the Gate AR
  accepted local packet count at zero, selects same-stack ISO lab
  `DeltaLw` packet ownership as the next narrow target, and keeps exact
  source precedence, lab/field/building separation, and runtime values
  unchanged. Selection status:
  `gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at`.
  Selected next action:
  `gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`.
  Validation result for Gate AS is recorded in the Gate AS checkpoint.
- previous landed model-first physics prediction pivot Gate AR:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`
  landed
  `gate_ar_steel_floor_formula_calibration_evidence_intake_plan`.
  It classifies the current Gate AK/AM local steel-floor formula
  calibration evidence against the Gate AQ owner map, keeps accepted
  local source-owned packet count at zero, rejects wrong-basis,
  wrong-reference-floor, product/inferred, missing-owner-field, and
  boundary-only evidence, and proves a future accepted packet still
  cannot move runtime values until residual-policy thresholds are met.
  Selection status:
  `gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as`.
  Selected next action:
  `gate_as_steel_floor_formula_owner_evidence_targeting_plan`.
  Validation result for Gate AR is recorded in the Gate AR checkpoint.
- previous landed model-first physics prediction pivot Gate AQ:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`
  landed
  `gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`.
  It maps every current steel-floor formula error-budget term to a
  source-owned evidence owner and blocker, proves the mapping exhaustive
  against runtime `ImpactErrorBudget.terms`, keeps current `Ln,w` and
  `DeltaLw` policies on `hold`, rejects wrong evidence from tightening,
  and defines future `hold`, `tighten`, `widen`, and `retune_candidate`
  branches without moving runtime values.
  Selection status:
  `gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar`.
  Selected next action:
  `gate_ar_steel_floor_formula_calibration_evidence_intake_plan`.
  Validation result for Gate AQ is recorded in the Gate AQ checkpoint.
- just landed model-first physics prediction pivot Gate AO:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`
  landed
  `gate_ao_steel_floor_formula_error_budget_surface_parity_plan`.
  It moves Gate AN's source-absent steel-floor error-budget payload into
  the shared impact schema/runtime, impact-support formula notes,
  output cards, method/corridor dossiers, Markdown report, estimate API,
  and impact-only API. Runtime values stay pinned at `Ln,w 55.6` /
  `DeltaLw 22.4`; exact-source, needs-input, and unsafe topology lanes
  stay budget-free; `origin source_absent_formula_error_budget` and
  `notMeasuredEvidence true` remain visible.
  Selection status:
  `gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap`.
  Selected Gate AP file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`.
  Selected next action:
  `gate_ap_steel_floor_formula_error_budget_hostile_input_plan`.
  Validation completed on 2026-05-07: focused Gate AE/AN/AO engine
  contracts passed 3 files / 15 tests, focused web steel-floor card /
  budget-surface / input-surface parity passed 3 files / 7 tests, full
  `pnpm calculator:gate:current` passed with engine 321 files / 1818
  tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean. Broad `pnpm check` passed
  after a transient Google Fonts fetch timeout was isolated by a
  successful build retry: lint, typecheck, engine 446 files / 2620
  tests, web 172 files / 961 passed + 18 skipped, and build all passed.
  `git diff --check` passed. Known non-fatal warnings remain the
  Node/Vitest Zustand persist storage warning and optional `sharp` /
  `@img` Next build warnings via the DOCX export dependency.
- just landed model-first physics prediction pivot Gate AN:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`
  landed
  `gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`.
  It adds the structured source-absent steel-floor formula error budget
  for `Ln,w` and `DeltaLw` without moving runtime values or retuning the
  corridor. Complete source-absent steel formula cases keep the same
  `Ln,w 55.6` / `DeltaLw 22.4` estimates, while exact-source,
  needs-input, and unsafe-topology cases do not expose a formula budget.
  Selection status:
  `gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao`.
  Selected next action:
  `gate_ao_steel_floor_formula_error_budget_surface_parity_plan`.
  Focused validation completed on 2026-05-07: Gate AN engine contract
  1 file / 6 tests, engine typecheck, focused Gate AM/AN contracts 2
  files / 11 tests, focused Gate AJ/AK/AL/AM/AN contracts 5 files / 25
  tests, full `pnpm calculator:gate:current`, and `git diff --check`
  passed before validation-doc sync. Current gate totals: engine 320
  files / 1813 tests, web 65 files / 284 passed + 18 skipped, repo
  build 5/5 successful, and whitespace guard clean.
- just landed model-first physics prediction pivot Gate AM:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`
  landed
  `gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`.
  It adds the narrow source-packet acquisition ledger after Gate AL:
  REGUPOL steel deck/joist and steel C-joist leads stay rejected as
  wrong-basis STC/IIC evidence, REGUPOL ISO `DeltaLw` leads stay
  rejected as solid/concrete reference-floor evidence, and SoundAdvisor
  is kept as a metric-scope boundary rather than a candidate packet.
  There are still zero accepted source-owned same-stack ISO lab
  `DeltaLw` steel-floor holdouts. Runtime values stay unchanged.
  Selection status:
  `gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an`.
  Focused validation completed on 2026-05-07: Gate AM engine contract
  passed 1 file / 5 tests, engine typecheck passed, focused Gate
  AJ/AK/AL/AM contracts passed 4 files / 19 tests, and full `pnpm
  calculator:gate:current` passed with engine 319 files / 1807 tests,
  web 65 files / 284 passed + 18 skipped, repo build 5/5 successful,
  and whitespace guard clean. `git diff --check` passed.
  Selected next action:
  `gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`.
- just landed model-first physics prediction pivot Gate AL:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`
  landed
  `gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`.
  It adds the first-holdout guard for source-owned same-stack ISO lab
  `DeltaLw` steel-floor packets. Current inventory still has zero
  accepted measured `DeltaLw` holdouts: Pliteq and UBIQ are `Ln,w`/`Rw`
  evidence without owned `DeltaLw`, product catalog `DeltaLw` rows are
  not same-stack steel-floor formula holdouts, Annex/companion values are
  inferred, and the checked REGUPOL steel C-joist source is ASTM/IIC/STC
  basis rather than ISO lab `DeltaLw`. Runtime values stay unchanged.
  Selection status:
  `gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am`.
  Focused validation completed on 2026-05-07: Gate AL engine contract
  passed 1 file / 4 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed after the Gate AJ/AK/AL doc-alignment
  repair: engine 318 files / 1802 tests, web 65 files / 284 passed + 18
  skipped, repo build 5/5 successful, and whitespace guard clean. `git
  diff --check` passed.
  Selected next action:
  `gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`.
- latest broad revalidation / Gate AL handoff:
  `docs/calculator/CHECKPOINT_2026-05-07_BROAD_REVALIDATION_GATE_AK_TO_GATE_AL_HANDOFF.md`
  confirms `pnpm check` passed after stale lint pins, impact validation
  fixture drift, and ambiguous duplicate/disjoint lightweight-steel
  floor schedule expectations were corrected. Gate AD steel-floor
  formula corridor coverage is now represented in the real-world floor
  and impact validation benchmark corpora as an explicit predictor-input
  estimate lane. Runtime values remain unchanged.
- latest report export/manual edit revalidation:
  `docs/calculator/CHECKPOINT_2026-05-07_GATE_AP_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`
  confirms the report editor remains a packaged proposal snapshot editor
  rather than a solver mutation surface. Manual edits can change issue
  export values/text/curves/layers/warnings, and both PDF and DOCX use
  the same edited snapshot. Real exports were generated:
  `gate-ap-manual-edit-checkpoint-simple.pdf` and
  `gate-ap-manual-edit-checkpoint-simple.docx`; PDF text extraction, PDF
  PNG rendering and visual review, DOCX zip integrity, and DOCX XML
  value checks passed. Focused report editor/export tests passed 6 files
  / 29 tests. Full `pnpm calculator:gate:current` passed with engine
  322 files / 1825 tests, web 66 files / 286 passed + 18 skipped, repo
  build 5/5 successful, and whitespace guard clean. `soffice` was not
  available, so DOCX visual rendering was not available in this
  environment.
- just landed model-first physics prediction pivot Gate AK:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`
  landed
  `gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`.
  It adds an executable source-owned same-stack lab `DeltaLw` holdout
  packet contract for the steel-floor formula lane. A candidate can
  count toward formula residual tightening only when the measured metric
  value, topology/support family, carrier spacing, load basis, dynamic
  stiffness, lower support class, upper-resilient topology, and paired
  negative boundary owner are all source-owned. Current Pliteq steel
  joist rows remain `Ln,w` holdouts only; UBIQ open-web exact rows
  remain anchors only; product-only, Annex-C/companion inferred,
  field/ASTM, and building-basis values are rejected from lab `DeltaLw`
  residual tightening. Runtime values stay unchanged. Selection status:
  `gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al`.
  Focused validation completed on 2026-05-07: Gate AK engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 317 files / 1798 tests,
  web 65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and
  whitespace guard clean; `git diff --check` passed. Known non-fatal
  warnings remain the Node/Vitest Zustand persist storage warning and
  optional `sharp` / `@img` Next build warnings via the DOCX export
  dependency.
  Selected next action:
  `gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`.
- just landed model-first physics prediction pivot Gate AJ:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`
  landed
  `gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`.
  It adds four paired negative-boundary cases for the steel-floor
  formula lane: wrong support family, exact source precedence,
  lab-to-field/building basis leakage, and source-absent design
  references that cannot count as measured residuals. It also separates
  measured `DeltaLw` holdout intake from product-catalog, Annex-C or
  companion inferred, field/ASTM, and building-basis values. Runtime
  values stay unchanged; exact measured rows remain first; UBIQ
  open-web rows remain exact rows or calibration anchors until carrier
  spacing, load basis, dynamic stiffness, lower support class, and
  upper-resilient topology are source-owned. Selection status:
  `gate_aj_steel_formula_negative_boundary_delta_lw_intake_landed_selected_source_owned_delta_lw_gate_ak`.
  Focused validation completed on 2026-05-07: Gate AJ engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 316 files / 1793 tests,
  web 65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and
  whitespace guard clean. Known non-fatal warnings remain the
  Node/Vitest Zustand persist storage warning and optional `sharp` /
  `@img` Next build warnings via the DOCX export dependency.
  Selected next action:
  `gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`.
- previously landed model-first physics prediction pivot Gate AI:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`
  landed
  `gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`.
  It converts Gate AH residual evidence into an executable residual
  policy with explicit `hold`, `tighten`, `widen`, and
  `retune_candidate` decisions. Current evidence holds the `+/-4.5 dB
  Ln,w` and `+/-2.0 dB DeltaLw` corridors: `Ln,w` residuals are low but
  only three same-family Pliteq holdouts exist, `DeltaLw` measured
  residual count is zero, UBIQ open-web formula inputs are not
  source-owned, and field/building basis owners are absent. Runtime
  values stay unchanged; exact measured rows remain first; source rows
  remain calibration evidence rather than the product. Selection status:
  `gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj`.
  Focused validation completed on 2026-05-07: Gate AI engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 315 files / 1788 tests,
  web 65 files / 284 passed + 18 skipped, and repo build 5/5 tasks.
  Known non-fatal warnings remain the Node/Vitest Zustand persist
  storage warning and optional `sharp` / `@img` Next build warnings via
  the DOCX export dependency.
  Selected next action:
  `gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`.
- previously landed model-first physics prediction pivot Gate AH:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`
  landed
  `gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`.
  It adds a source-bounded steel-floor formula accuracy benchmark matrix
  without moving runtime values. Three same-family Pliteq steel-joist
  lab `Ln,w` holdouts compare against the Gate AD formula with max
  residual `0.6 dB` and mean residual `0.4 dB`, all inside the current
  `+/-4.5 dB Ln,w` corridor. UBIQ open-web exact rows are counted as 36
  exact anchors but do not become residual rows when formula inputs such
  as carrier spacing, load basis, resilient dynamic stiffness, lower
  isolation support, or upper-resilient topology are missing. `DeltaLw`
  measured residual count remains zero, so the `+/-2.0 dB DeltaLw`
  tolerance is kept but not tightened. Selection status:
  `gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai`.
  Focused validation completed on 2026-05-07: Gate AH engine contract
  passed 1 file / 5 tests, and engine typecheck passed. Full `pnpm
  calculator:gate:current` passed with engine 314 files / 1783 tests,
  web 65 files / 284 passed + 18 skipped, and repo build 5/5 tasks.
  Known non-fatal warnings remain the Node/Vitest Zustand persist
  storage warning and optional `sharp` / `@img` Next build warnings via
  the DOCX export dependency.
  Selected next action:
  `gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`.
- previously landed model-first physics prediction pivot Gate AG:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`
  landed
  `gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`.
  It keeps the Gate AD steel-floor formula values unchanged while proving
  the Gate AF input surface through live workbench evaluation, local saved
  replay, server snapshot replay, output cards, Markdown report payload,
  estimate API payload, impact-only API payload, and hostile UI edits.
  Complete UI-derived steel rows still return lab `LnW 55.6`,
  `DeltaLw 22.4`, and
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.
  Missing/invalid steel physical fields now name the precise blockers;
  field impact requests such as `L'n,w` and `L'nT,w` remain unsupported
  instead of being promoted from lab `Ln,w`. Selection status:
  `gate_ag_steel_floor_formula_input_surface_acceptance_landed_selected_accuracy_benchmark_gate_ah`.
  Validation completed on 2026-05-07: Gate AG engine contract 1 file / 3
  tests, web steel formula input-surface acceptance 1 file / 4 tests,
  Gate AF + Gate AG web focused suite 2 files / 8 tests, engine
  typecheck, web typecheck, preflight `git diff --check`, and final
  `pnpm calculator:gate:current` all passed. The final current gate
  covered engine 313 files / 1778 tests, web 65 files / 284 tests plus
  18 skipped, repo build, and whitespace guard. The Gate AG web
  acceptance test emits known non-fatal Zustand persist storage warnings
  under Node/Vitest; the web build still emits the known non-fatal
  optional `sharp/@img` package warnings.
  Selected next action:
  `gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`.
- previously landed model-first physics prediction pivot Gate AF:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`
  landed
  `gate_af_steel_floor_formula_input_surface_plan`.
  It adds a first-class Dynamic Calculator steel-floor formula input
  surface for `steelSupportForm`, `steelCarrierDepthMm`,
  `steelCarrierSpacingMm`, `resilientLayerDynamicStiffnessMNm3`,
  `loadBasisKgM2`, and `lowerCeilingIsolationSupportForm`. The workbench
  route controls, scenario analysis, local/server snapshots, and engine
  helper now bridge those user-facing fields into the Gate AD
  `ImpactPredictorInput`. Complete construction-image style steel rows
  plus the UI surface return lab `LnW 55.6`, `DeltaLw 22.4`, and
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`;
  partial fields stay parked, unsafe duplicate steel carrier topology is
  refused, and exact measured full-stack rows remain above the formula
  corridor. Selection status:
  `gate_af_steel_floor_formula_input_surface_landed_selected_acceptance_revalidation_gate_ag`.
  Validation completed on 2026-05-07: focused Gate AF engine contract 1
  file / 5 tests, focused web steel formula input-surface test 1 file /
  4 tests, engine typecheck, web typecheck, and final `pnpm
  calculator:gate:current` with engine 312 files / 1775 tests and web 64
  files / 280 tests plus 18 skipped, repo build, and whitespace guard all
  passed. The Next build still emits the known non-fatal optional
  `sharp/@img` package warnings. Selected next action:
  `gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`.
- previously landed model-first physics prediction pivot Gate AE:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`
  landed
  `gate_ae_steel_floor_formula_card_and_report_parity_plan`.
  It keeps Gate AD runtime values unchanged but exposes
  `Lightweight-steel formula corridor` consistently across workbench
  cards, output posture, dynamic impact trace, impact-support formula
  notes, validation mode, proposal method dossier, and Markdown report.
  Selection status:
  `gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af`.
  Validation completed on 2026-05-07: focused Gate AE engine contract 1
  file / 4 tests, focused web steel formula card/report parity 1 file /
  1 test, focused Gate AD regression 1 file / 6 tests, focused web
  output/model/dossier/formula report regressions 3 files / 16 tests,
  final `pnpm calculator:gate:current` with engine 311 files / 1770
  tests and web 63 files / 276 tests plus 18 skipped, repo build, and
  whitespace guard all passed. The Next build still emits the known
  non-fatal optional `sharp/@img` package warnings. Selected next
  action: `gate_af_steel_floor_formula_input_surface_plan`.
- just landed model-first physics prediction pivot Gate AD:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`
  landed
  `gate_ad_steel_floor_impact_formula_numeric_corridor_plan`.
  It adds `steel-floor-impact-formula-corridor.ts`, promotes complete
  source-absent steel floors to
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`,
  pins the open-web example at `LnW 55.6` / `DeltaLw 22.4`, keeps exact
  measured rows above the formula, and blocks broad steel-family fallback
  when carrier spacing or lower isolation is missing. Selection status:
  `gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae`.
  Validation completed on 2026-05-07: focused Gate AD 1 file / 6 tests,
  Gate AC/Gate AD plus predictor-input regression 3 files / 55 tests,
  impact-only fallback regression 1 file / 102 tests, engine typecheck,
  final `pnpm calculator:gate:current` with engine 310 files / 1766
  tests and web 62 files / 275 tests plus 18 skipped, repo build,
  whitespace guard, and final `git diff --check` all passed. The Next
  build still emits the known non-fatal `sharp` optional `@img` package
  warnings.
  Selected next action:
  `gate_ae_steel_floor_formula_card_and_report_parity_plan`.
- just landed model-first physics prediction pivot Gate AC:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`
  landed
  `gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`.
  It adds `steel-floor-impact-physics-input-contract.ts`, extends the
  shared impact predictor input with `carrierSpacingMm`, and adds steel
  floor prompt field ids for support form, carrier depth/spacing, and
  lower ceiling isolation. It does not move runtime values: complete
  open-web steel input becomes formula-corridor ready only, exact source
  rows remain highest precedence, and missing spacing/lower isolation are
  protected nearby negatives. Selection status:
  `gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad`.
  Selected next action:
  `gate_ad_steel_floor_impact_formula_numeric_corridor_plan`.
- just landed model-first physics prediction pivot Gate AB:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`
  landed
  `gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`.
  It adds `floor-family-source-guard.ts`, withholds generic
  `lightweight_steel_floor` family estimates when support form is
  unspecified, and surfaces missing-input warnings instead of borrowing
  UBIQ open-web or Pliteq steel-joist rows. Exact same-family steel rows
  and same-family bound rows remain visible. Selection status:
  `gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac`.
  Selected next action:
  `gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`.
- just landed model-first physics prediction pivot Gate AA:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts`
  landed
  `gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`.
  It replaces the 50/50 mm grouped Rockwool fixture selector with a
  domain-based grouped triple-leaf path. The shared-wall construction
  image with explicit 80/80 mm mineral-wool cavities now selects
  `triple_leaf_two_cavity_frequency_solver`, returns `Rw 61`, `STC 61`,
  `C -1.7`, and `Ctr -6.8`, and rejects
  `multileaf_screening_blend` as lower precedence. Flat-list ACON-like
  input remains `needs_input`. Selection status:
  `gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab`.
  Selected next action:
  `gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`.
- just landed model-first physics prediction pivot Gate Z:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`
  landed
  `gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`.
  It promotes Dynamic Calculator field-only floor-impact `L'n,w` and
  `L'nT,w` when the Gate W lab `Ln,w` / `DeltaLw` anchor and Gate Y
  field context are complete. The promoted reference scenario pins
  `LnW 50.3`, `DeltaLw 24.3`, `LPrimeNW 52.3`, and `LPrimeNTw 49.9`
  on basis
  `mixed_predicted_plus_estimated_standardized_field_volume_normalization`.
  `L'nT,50` stays unsupported until
  `lowFrequencyImpactSpectrumOrCI50_2500Owner` exists. Selection status:
  `gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa`.
  Selected next action:
  `gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`.
- just landed model-first physics prediction pivot Gate Y:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`
  landed
  `gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`.
  It defines the Dynamic Calculator floor-impact field-context adapter
  boundary without runtime value movement. Required fields are
  `contextMode`, `partitionAreaM2`, `receivingRoomVolumeM3`,
  `receivingRoomRt60S`, and `impactFieldContext`; required owners are
  the Gate W lab impact anchor, field K / mass-ratio /
  direct-flanking policy, flanking path or junction policy, and a
  low-frequency owner before `L'nT,50`. Field-only requests stay blocked
  until Gate Z; lab-anchored mixed requests already reach the existing
  field supplement and Gate Z must own that as a coherent runtime/card/
  report path. Selection status:
  `gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z`.
  Validation passed: focused Gate Y 1 file / 5 tests; focused
  Gate V/W/X/Y 4 files / 22 tests; engine typecheck; current gate;
  broad `pnpm check`; and `git diff --check`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`.
  Selected next action:
  `gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`.
- just landed model-first physics prediction pivot Gate X:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts`
  landed
  `gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`.
  It compares the remaining high-impact Dynamic Calculator gaps after
  Gate W and selects floor-impact field-context ownership for Gate Y.
  The selected path is explicitly no-runtime: lab `Ln,w` / `DeltaLw`
  pins stay on Gate W, `L'n,w` / `L'nT,w` remain blocked until room
  geometry, RT60/absorption, impact field context, flanking policy, and
  ISO 717-2 field adapter ownership are contracted, and source rows stay
  as anchors/calibration/overrides rather than the product. Selection
  status:
  `gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`.
  Selected next action:
  `gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`.
- just landed model-first physics prediction pivot Gate W:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`
  landed
  `gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`.
  It promotes the complete Dynamic Calculator resilient floating-floor
  ISO 717-2 lab lane for `Ln,w` / `DeltaLw` only when Gate V's physical
  input boundary is ready. The runtime predictor now carries explicit
  `loadBasisKgM2` plus dynamic stiffness into the heavy floating-floor
  formula, pins the visible support bucket and trace basis to
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`, and keeps
  missing load, missing dynamic stiffness, field impact without room
  context, and ASTM `IIC` / `AIIC` as non-promoted boundaries.
  Selection status:
  `gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x`.
  Selected next action:
  `gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`.
- just landed model-first physics prediction pivot Gate V:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`
  landed
  `gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`.
  It adds the no-runtime floor-impact dynamic-stiffness input/adapter
  contract for Dynamic Calculator. `resilientLayerDynamicStiffnessMNm3`
  and `loadBasisKgM2` are executable physical inputs for resilient
  floating-floor `Ln,w` / `DeltaLw`; missing values produce targeted
  `needs_input`. `L'n,w` / `L'nT,w` require explicit field context, and
  `IIC` / `AIIC` remain unsupported until an ASTM E989 adapter owner
  exists. Safe role-defined floor reorders normalize without moving
  runtime values. Selection status:
  `gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`.
  Selected next action:
  `gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`.
- latest Gate U revalidation / commit-prep checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`
  confirms `main` was even with `origin/main`,
  `pnpm calculator:gate:current` was green, broad `pnpm check` was green after
  fixing two proposal-surface regressions, and Gate V was the right
  first implementation step.
- just landed model-first physics prediction pivot Gate U:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`
  landed
  `gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`.
  It ranks the next solver/calibration candidates after Gate T material
  gap closure and selects floor-impact dynamic-stiffness input/adapter
  ownership for Gate V. Calibration holdouts remain useful later for
  error-budget tightening, but they are not selected ahead of the
  larger floor coverage gap. `Ln,w`, `L'n,w`, `L'nT,w`, and `IIC` stay
  basis-separated; runtime values and support buckets stay unchanged.
  Selection status:
  `gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_HANDOFF.md`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`.
  Selected next action:
  `gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`.
- just landed model-first physics prediction pivot Gate T:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`
  landed
  `gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`.
  It closes the high-impact material-property gaps needed by Dynamic
  Calculator family physics without creating a finite source catalog.
  Shared material acoustic metadata now includes `absorberClass`; seed
  materials carry engineering-default acoustic properties for board
  leaves/finishes, masonry cores, porous absorbers, floor decks/screeds,
  limp membranes, and resilient impact layers. Required property gaps
  remain executable `needs_input`; optional precision gaps widen
  uncertainty through explicit defaults. Runtime values and support
  buckets stay unchanged, and Gate S double-leaf/framed value pins remain
  stable. Selection status:
  `gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_T_HANDOFF.md`.
  Selected next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`.
  Selected next action:
  `gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`.
- just landed model-first physics prediction pivot Gate S:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`
  landed
  `gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`.
  It wires the Gate R double-leaf / framed bridge solver into Dynamic
  Calculator runtime for explicit complete contexts only. Independent
  absorbed gypsum / rockwool / gypsum now selects the family physics
  candidate with `Rw 45`, `STC 45`, `C -1`, `Ctr -6.1`, and a `7 dB`
  uncalibrated error budget; resilient both-side bridge selects
  `Rw 46` / `STC 46` with an `8 dB` error budget. Exact source rows
  remain higher precedence through the Gate H policy. Missing
  `resilientBarSideCount` stays `needs_input` and explicit
  double-leaf/framed visible cards are parked instead of showing
  fallback numbers; direct-fixed and multi-cavity flat-list boundaries
  do not promote. Selection status:
  `gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_S_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate R:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`
  landed
  `gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`.
  It adds the no-runtime double-leaf / framed bridge solver-candidate
  contract in
  `dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts`.
  Gate R owns the formula/method contract before runtime selection:
  explicit side-leaf surface masses, mass-air-mass resonance, bridge
  coupling, porous cavity damping, ISO 717-1 `Rw` adapter, and ASTM E413
  `STC` adapter boundary. It creates positive benchmark corridors for
  independent absorbed and resilient bridge cases, carries Gate Q
  `needs_input` for missing resilient side count, and protects
  direct-fixed plus multi-cavity flat-list negative boundaries. Runtime
  values stay unchanged. Selection status:
  `gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_R_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate Q:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`
  landed
  `gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`.
  It adds the explicit Dynamic Calculator double-leaf / framed bridge
  input contract in
  `dynamic-calculator-double-leaf-framed-bridge-input-contract.ts`,
  extends `wallTopology.topologyMode` with `double_leaf_framed`, and
  wires explicit double-leaf/framed contexts into
  `dynamic-calculator-route-input-topology.ts`. Missing grouping,
  cavity depth, bridge class, support topology, support spacing, and
  resilient-bar side count become targeted `needs_input` prompts;
  source absence remains exact/calibration-only. Runtime values stay
  unchanged. Selection status:
  `gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate P:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`
  landed
  `gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`.
  It adds the no-runtime next-family solver selection helper in
  `dynamic-calculator-next-family-solver-upgrade-selection.ts`. Gate P
  excludes the Gate O single-leaf family from the next ranking and
  selects double-leaf / framed bridge as the next calculator family
  because it unlocks common wall coverage without requiring source rows.
  Runtime promotion is explicitly blocked until `frameBridgeClass`,
  `studSpacingMm`, `resilientSideCount`, `supportTopology`, porous
  cavity damping, and mass-air-mass resonance owners are contracted with
  positive and nearby-negative benchmarks. Selection status:
  `gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate O:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`
  landed
  `gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`.
  It adds the narrow Dynamic Calculator single-leaf / laminated
  single-leaf / rigid massive panel runtime promotion helper in
  `dynamic-airborne-gate-o-single-leaf.ts` and wires it into
  `dynamic-airborne.ts`. Ordinary single 12.5 mm gypsum board, laminated
  double gypsum board, and 150 mm concrete keep the same values and
  target-output support, but their selected candidate origin is now
  `family_physics_prediction` with `runtimeValueMovement: false`.
  Exact source rows still win when eligible, grouped Rockwool Gate G
  stays unchanged, and CLT/mass timber remains screening until
  orthotropic/directional properties are owned. Selection status:
  `gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate N:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`
  landed
  `gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`.
  It adds the no-runtime Dynamic Calculator family-solver upgrade
  selection helper in
  `dynamic-calculator-family-solver-upgrade-selection.ts`. Gate N
  selects single-leaf / laminated single-leaf / rigid massive panel as
  the first runtime family upgrade because the current family candidate
  is already visible but still selected as `screening_fallback`, the
  material inputs are complete, and the blast radius is lower than
  double/framed, generalized multi-cavity, lined masonry/CLT, floor
  impact, or field/building continuations. Runtime numeric values,
  support buckets, confidence, evidence, and report/workbench behavior
  stay unchanged. Selection status:
  `gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate M:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`
  landed
  `gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`.
  It adds the Dynamic Calculator candidate resolver runtime surface in
  `dynamic-calculator-candidate-resolver-runtime.ts` and wires it into
  `calculateAssembly` for dynamic calculator results. Runtime numeric
  values and support buckets stay unchanged, but selected/rejected
  candidates are now visible for exact source, anchored delta,
  calibrated family, uncalibrated family physics, bounded, screening,
  `needs_input`, and `unsupported` lanes. ACON-like flat-list
  multi-cavity walls now expose `needs_input` candidate metadata instead
  of a silent screening-only surface. Selection status:
  `gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate L:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`
  landed
  `gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`.
  It adds the no-runtime Dynamic Calculator topology normalizer and
  hostile input guard in `dynamic-calculator-topology-normalizer.ts`.
  Role-defined floor input can be canonicalized/coalesced where the
  physics is invariant to split rows or UI reorder; grouped multi-cavity
  wall order is preserved; ambiguous flat-list multi-cavity walls are not
  auto-grouped and delegate missing topology prompts to Gate K; unsafe
  multi-cavity reorders and hostile layer inputs fail closed with trace.
  Runtime values stay unchanged. Selection status:
  `gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate K:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`
  landed
  `gate_k_define_route_input_topology_contracts_for_dynamic_calculator`.
  It adds the no-runtime Dynamic Calculator route/input topology
  contract in `dynamic-calculator-route-input-topology.ts`: wall/floor
  route assessment, lab/field/building output-basis requirements,
  grouped multi-cavity wall topology prompts, field/building room and
  flanking prompts, floating-floor dynamic-stiffness/load prompts, and
  unsupported output posture for `IIC`/`AIIC` style outputs. Source
  absence remains a source-promotion blocker only and never becomes a
  physical `needs_input` prompt by itself. Runtime values stay
  unchanged. Selection status:
  `gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate J:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`
  landed
  `gate_j_build_personal_use_readiness_scenario_pack`.
  It adds the personal-use readiness scenario pack and engine-inventory
  guard in `airborne-personal-use-readiness-scenario-pack.ts`, proving
  wall/floor coverage, exact/source-anchored/calibrated/uncalibrated/
  bounded/screening/needs_input/unsupported method selection, ACON-like
  flat-list multi-cavity guarding, current grouped Rockwool source-absent
  family prediction, and floor impact support gaps without moving runtime
  values. Selection status:
  `gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate I:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`
  landed
  `gate_i_expand_family_material_properties_and_benchmark_scenarios`.
  It adds optional acoustic material properties to the shared material
  schema, nominal engineering defaults for common wall/floor materials,
  and the `airborne-family-material-expansion.ts` benchmark/readiness
  helper. Missing required material properties now have an executable
  `needs_input` posture, while optional precision gaps widen uncertainty
  through explicit defaults. Runtime values stay unchanged. Selection
  status:
  `gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md`.
- latest checkpoint / manual export validation:
  `docs/calculator/CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md`
  confirms Gate I is still the landed gate, Gate J remains next, and
  manual report edits were verified with generated PDF and DOCX files.
  PDF was rendered to PNG and visually checked; DOCX package integrity
  and Word XML content confirmed the same manual snapshot values. The
  environment lacked `soffice`/LibreOffice, so DOCX visual rendering was
  not available in this checkpoint.
- latest wrap-up checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`
  confirms Gate H is validated, `pnpm calculator:gate:current` is green,
  broad `pnpm check` is green, the report editor edits only the packaged
  proposal snapshot, and PDF plus DOCX exports both use the same
  manually editable snapshot.
- just landed model-first physics prediction pivot Gate H:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`
  landed
  `gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`.
  It adds the source-promotion readiness policy for exact full-stack,
  calibrated family, and exact-subassembly-plus-delta candidates without
  moving runtime values. Source rows can promote only when rights-safe
  evidence, topology/material/metric/tolerance owners, paired positive
  and negative tests, and calibration holdout metadata are present.
  Exact, calibrated, anchored-delta, and uncalibrated physics candidates
  coexist in the resolver; eligible source candidates can win by
  precedence, but the Gate G family-physics prediction candidate is not
  deleted. Selection status:
  `gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate G:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`
  landed
  `gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`.
  It makes the first model-first runtime prediction movement for the
  explicit grouped Rockwool triple-leaf case. Complete grouped topology
  with two 50 mm full porous Rockwool cavities and an internal gypsum
  leaf now selects `family_physics_prediction` on
  `triple_leaf_two_cavity_frequency_solver`, returning lab `Rw 50 /
  STC 55 / C 0.8 / Ctr -7.3` and building-prediction `R'w 50 /
  DnT,w 51 / DnT,A 51.3`. Exact/source-validated promotion remains
  false; missing source evidence rejects exact/calibrated candidates
  only. Flat-list split/internal Rockwool remains guarded at diagnostic
  `Rw 41` with unsupported target outputs. Selection status:
  `gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate E:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`
  landed
  `gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`.
  It added shared optional `airborneCandidateResolution` metadata and a
  model-first resolver policy without moving runtime values. It records
  selected and rejected airborne candidates, pins precedence from exact
  full-stack rows through anchored delta, calibrated family physics,
  uncalibrated family physics prediction, bounded/screening fallbacks,
  `needs_input`, and `unsupported`, and makes rejection reasons
  executable. It proves source absence blocks exact/calibration
  promotion only, missing topology selects `needs_input`, deterministic
  tie-breakers survive duplicate rows and safe candidate reorders, and
  grouped Rockwool remains frozen at `Rw 41` / `multileaf_screening_blend`.
  Selection status:
  `gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate D:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`
  landed
  `gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`.
  It added shared optional `inputCompletenessSet` metadata and
  `input-completeness` schemas without moving runtime values. It defines
  the minimum physical input matrix for single-leaf airborne,
  double/framed airborne, triple-leaf/multicavity airborne, porous-fill
  modifiers, floating-floor impact, and field/apparent output contexts.
  It proves source absence remains an exact/calibration blocker only,
  physical input absence yields `needs_input`, and optional precision
  gaps widen uncertainty rather than blocking when documented defaults
  exist. It freezes Rockwool values and selects Gate E airborne
  candidate resolver as the next no-runtime step. Selection status:
  `gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate C:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`
  landed
  `gate_c_inventory_rating_adapter_integrity_without_value_movement`.
  It added shared optional `ratingAdapterBasisSet` metadata and
  `rating-adapter` schemas without moving runtime values. It inventories
  ISO 717-1, ISO 717-2, ASTM E413, and ASTM E989 rating lanes, proves
  `Rw`/`STC` and `Ln,w`/`IIC` are not silent aliases, marks ASTM E989
  IIC as planned/not implemented until a real adapter or exact source
  owner exists, freezes Rockwool values, and selects Gate D physical
  input completeness / `needs_input` matrix as the next no-runtime step.
  Selection status:
  `gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate B:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`
  landed
  `gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement`.
  It added shared airborne `airborneBasis` / `airborneCandidateSet`
  schema support without moving runtime values. It kept source absence
  and physical-input absence separate, kept legacy `AssemblyCalculation`
  payloads parse-compatible, required uncertainty metadata for
  formula-backed prediction candidates, froze Rockwool values, and
  selected Gate C rating-adapter integrity as the next no-runtime step.
  Selection status:
  `gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`.
- just landed model-first physics prediction pivot Gate A:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`
  landed
  `gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime`.
  It kept runtime values, support buckets, confidence, evidence, route
  cards, output cards, proposal/report copy, and workbench input behavior
  frozen. It made the model-first rule executable: source absence blocks
  exact/calibration promotion only, not formula-backed prediction. It
  named airborne candidate origins, basis fields, standards fields,
  B0-B12 benchmark lanes, runtime stop rules, and selected Gate B shared
  airborne basis/candidate schema. Grouped Rockwool remains unchanged at
  `Rw 41` / `multileaf_screening_blend` until M6.
  Gate A selected Gate B action:
  `gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement`.
  Latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md`.
- checkpoint/revalidation after Gate A:
  `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md`
  confirms the plan is still correct, Gate B remains next, runtime values
  are still frozen, grouped Rockwool is still `Rw 41` screening until M6,
  and INSUL should be treated as a competitor/category benchmark rather
  than the target ceiling. The project goal remains stronger than a
  lookup table: exact rows win when they match, but family-specific
  physics must calculate unknown stacks with explicit basis, assumptions,
  tolerance/error budget, and tests.
- standards research and plan detail completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md`.
  It expanded the active plan around ISO 12354-1/2, ISO 717-1/2,
  ISO 10140, ISO 16283, ASTM E90/E336/E413, ASTM E492/E989, INSUL as a
  competitor prediction-engine reference, and double-leaf cavity
  research. At that time Gate A was still next; Gate A has now landed
  and Gate B is the current next step.
- doc/implementation reconciliation completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md`.
  It inventoried `docs`, scanned all calculator docs for active/current
  drift, compared the active authority docs with engine/shared/web
  implementation surfaces, updated stale entry docs, and confirmed the
  active runtime reality: grouped Rockwool still uses
  `multileaf_screening_blend` at `Rw 41`, the triple-leaf frequency
  solver is research/runtime-ineligible, and airborne lacks a
  first-class candidate/basis resolver. At that time the model-first
  Gate A target file was still next; Gate A has now landed and Gate B is
  the next file to create.
- model-first physics prediction replan completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md`
  superseded
  `rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2` as
  the active next step and selected
  `calculator_model_first_physics_prediction_pivot_v1`. The corrected
  rule is: DynEcho is an acoustic calculator first. Exact/lab/source
  rows can override, anchor, calibrate, validate, and benchmark results,
  but missing source packets must not block formula-backed calculation.
  A missing Rockwool/Uris packet still blocks measured-exact or
  source-validated promotion; it does not block a labelled
  `family_physics_prediction`. The active Gate A is no-runtime and must
  define airborne candidate origins and precedence before any runtime
  movement. The old Rockwool source-packet refresh plan is retained only
  for later exact-source/calibration backlog.
- just landed calculator source-gap revalidation V28 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`
  closed prior selected source-gap slice
  `calculator_source_gap_revalidation_v28` and landed
  `selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish`.
  It selected
  `rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`
  with target file
  `packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`
  and action
  `gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime`.
  It added `ubiq_packaged_finish_current_gate_pack_preserved_after_v28`,
  `rockwool_numeric_boundaries_after_v28`,
  `rockwool_rights_safe_source_packet_refresh_selected_after_v28`, and
  `raw_open_web_and_company_internal_blockers_carry_forward_after_v28`.
  Runtime values, source rows, support semantics, confidence, evidence,
  API, route-card values, output-card statuses, proposal/report copy,
  and workbench input behavior stay frozen. UBIQ packaged-finish remains
  current-gate owned for `90 exact` and `21 bound` rows. Adjacent
  Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`; flat-list
  split/internal gypsum-leaf Rockwool remains withheld from supported
  outputs at diagnostic `Rw 41 / R'w 39 / DnT,w 40`; direct exact
  runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`. Generic/raw open-web
  widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused V28 Gate A 1 file / 5 tests, focused
  UBIQ continuity 7 files / 25 tests, focused Rockwool/source-packet
  continuity 4 files / 21 tests, final doc-contract continuity 4 files
  / 20 tests after validation-note updates, final
  `pnpm calculator:gate:current` with engine 281 files / 1587 tests,
  web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Final
  `git diff --check` passed. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts`
  was restored to `.next-typecheck` after the Next build.
- just landed UBIQ packaged-finish current-gate guard Gate C closeout:
  `packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_ubiq_open_web_packaged_finish_current_gate_guard_selected_source_gap_revalidation_v28`.
  It selected
  `packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`
  with action
  `gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout`
  and plan
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md`.
  It added `closed_ubiq_packaged_finish_current_gate_guard_summary`,
  `packaged_finish_current_gate_pack_carry_forward`,
  `source_gap_revalidation_v28_selected_after_ubiq_packaged_finish_closeout`,
  and
  `rockwool_and_raw_open_web_blockers_carry_forward_after_ubiq_packaged_finish_closeout`.
  Runtime values, source rows, support semantics, confidence, evidence,
  API, route-card values, output-card statuses, proposal/report copy,
  and workbench input behavior stay frozen. Rockwool exact runtime
  remains blocked by `rights_safe_source_owned_curve_payload_absent`;
  generic/raw open-web widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused Gate C 1 file / 5 tests, focused
  packaged-finish continuity with engine 5 files / 15 tests and web
  4 files / 5 tests, final `pnpm calculator:gate:current` with engine
  280 files / 1582 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Final
  `git diff --check` passed. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts`
  was restored to `.next-typecheck` after the Next build.
- just landed UBIQ packaged-finish current-gate guard Gate A:
  `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
  landed
  `gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout`.
  It selected
  `packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  with action
  `gate_c_closeout_ubiq_open_web_packaged_finish_current_gate_guard_and_select_next_accuracy_slice`.
  It added `ubiq_packaged_finish_current_gate_guard_gate_a_summary`,
  `current_gate_promoted_ubiq_packaged_finish_engine_visible_pack`,
  `source_verified_ubiq_packaged_finish_pdf_status`, and
  `rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`.
  The current gate now owns UBIQ packaged-finish engine family-design,
  near-miss, packaged-lane trace, visible card, and saved/edit history
  replay guards for `90 exact` and `21 bound` source-backed open-web
  rows. Runtime values, source rows, support semantics, confidence,
  evidence, API, route-card values, output-card statuses,
  proposal/report copy, and workbench input behavior stay frozen.
  Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`; generic/raw open-web
  widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused Gate A 1 file / 5 tests, focused
  packaged-finish continuity with engine 4 files / 10 tests and web
  4 files / 5 tests, final `pnpm calculator:gate:current` with engine
  279 files / 1577 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Known non-fatal
  `sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build.
- pre-Gate A analysis replan completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_PRE_UBIQ_PACKAGED_FINISH_GATE_A_ANALYSIS_REPLAN_HANDOFF.md`
  confirmed implementation and docs agree. The selected Gate A contract
  file is still absent, the seven existing UBIQ packaged-finish
  engine/web guard files exist, and they are not yet owned by
  `tools/dev/run-calculator-current-gate.ts` as one pack. Focused
  continuity passed with engine 4 files / 10 tests and web 4 files /
  5 tests. The official UBIQ PDF source is accessible. No runtime
  retune, Rockwool exact promotion, or generic/raw open-web widening is
  part of this Gate A.
- broad validation and next-step refresh completed on 2026-05-05:
  `docs/calculator/CHECKPOINT_2026-05-05_BROAD_REVALIDATION_AND_NEXT_STEP_HANDOFF.md`
  recorded `pnpm check` green: lint clean, typecheck clean, engine
  full suite 403 files / 2374 tests, web full suite 166 files / 936
  passed + 18 skipped, and repo build 5 / 5 tasks. There is no broad
  test failure requiring emergency repair before the selected next
  slice. The correct immediate step remains
  `ubiq_open_web_packaged_finish_current_gate_guard_v1` Gate A. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed calculator source-gap revalidation V27 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`
  landed
  `selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers`.
  It selected
  `ubiq_open_web_packaged_finish_current_gate_guard_v1` with target file
  `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
  and action
  `gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`.
  It added `remaining_accuracy_gap_order_after_ubiq_supported_band_closeout`,
  `ubiq_packaged_finish_ready_surfaces_after_v27`,
  `packaged_finish_current_gate_guard_selected_after_v27`, and
  `rockwool_source_blockers_carry_forward_after_v27`.
  The selected guard promotes existing UBIQ packaged-finish coverage for
  `90 exact` and `21 bound` source-backed open-web rows across engine
  family-design, near-miss, packaged-lane trace, visible card, and
  saved/edit history replay tests. Runtime values, support semantics,
  confidence, evidence, API, route-card values, output-card statuses,
  proposal/report copy, and workbench input behavior stay frozen.
  Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`; generic/raw open-web
  widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`. Validation
  passed on 2026-05-05: focused V27 Gate A 1 file / 5 tests, focused
  UBIQ packaged-finish engine continuity 5 files / 15 tests, focused
  UBIQ packaged-finish visible continuity 4 files / 5 tests, final
  `pnpm calculator:gate:current` with engine 275 files / 1567 tests,
  web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Known non-fatal `sharp/@img` warnings remain
  through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
  restored to `.next-typecheck` after the Next build.
- just landed UBIQ open-web supported-band current-gate guard Gate C closeout:
  `packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27`.
  It closed `ubiq_open_web_supported_band_current_gate_guard_v1`
  no-runtime and selected `calculator_source_gap_revalidation_v27`
  with target file
  `packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`
  and action
  `gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout`.
  It added `closed_ubiq_supported_band_current_gate_guard_summary`,
  `supported_band_current_gate_pack_carry_forward`,
  `source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout`,
  and
  `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout`.
  The UBIQ weak-band and supported-band source-backed guard packs remain
  in `pnpm calculator:gate:current`. Rockwool exact runtime remains
  blocked by `rights_safe_source_owned_curve_payload_absent`, and
  generic/raw open-web widening remains blocked until V27 names
  source-owned negative boundaries. Validation passed on 2026-05-05:
  focused supported-band Gate C closeout 1 file / 5 tests, focused UBIQ
  continuity with engine 7 files / 27 tests and web 3 files / 5 tests,
  final `pnpm calculator:gate:current` with engine 274 files / 1562
  tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green. Known non-fatal `sharp/@img`
  warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build.
- just landed UBIQ open-web supported-band current-gate guard Gate A:
  `packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
  landed
  `gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout`.
  It promoted the source-backed UBIQ FL-24/26/28 supported-band
  current-gate pack:
  `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`,
  `src/ubiq-open-web-supported-band-finish-completion.test.ts`,
  `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`,
  `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`,
  `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`,
  and
  `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`.
  It added `ubiq_supported_band_current_gate_guard_gate_a_summary`,
  `current_gate_promoted_ubiq_supported_band_engine_visible_pack`, and
  `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a`.
  Protected values include FL-24 bare `Rw 61 / Ln,w 62 / Ln,w+CI 60`,
  FL-26 bare `Rw 60 / Ln,w 62 / Ln,w+CI 61`, FL-28 bare
  `Rw 64 / Ln,w 58 / Ln,w+CI 56`, and FL-28 carpet bound `Rw 64 /
  Ln,w+CI <= 45` with no exact `Ln,w`. Runtime values, source rows,
  support semantics, confidence, evidence, API, route-card values,
  output-card statuses, proposal/report copy, and workbench input
  behavior stayed frozen. Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`. It selected
  `packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_ubiq_open_web_supported_band_current_gate_guard_and_select_next_accuracy_slice`.
  Validation passed on 2026-05-05: focused supported-band Gate A
  1 file / 5 tests, focused supported-band continuity with engine
  3 files / 7 tests and web 2 files / 3 tests, focused V26 +
  weak-band + supported-band doc continuity 4 files / 20 tests, final
  `pnpm calculator:gate:current` with engine 273 files / 1557 tests,
  web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Known non-fatal `sharp/@img` warnings remain
  through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
  restored to `.next-typecheck` after the Next build.
- just landed UBIQ open-web weak-band current-gate guard Gate C closeout:
  `packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard`.
  It closed `ubiq_open_web_weak_band_current_gate_guard_v1` no-runtime
  and selected `ubiq_open_web_supported_band_current_gate_guard_v1` with
  target file
  `packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
  and action
  `gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate`.
  It added `closed_ubiq_weak_band_current_gate_guard_summary`,
  `weak_band_current_gate_pack_carry_forward`,
  `ubiq_supported_band_source_ready_next`, and
  `rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout`.
  The selected next guard protects 36 UBIQ FL-24/26/28 exact
  bare/timber rows and 18 carpet bound rows before any generic open-web
  widening. Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`.
- just landed UBIQ open-web weak-band current-gate guard Gate A:
  `packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
  landed
  `gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout`.
  It promoted the UBIQ FL-23/25/27 weak-band current-gate pack:
  `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`,
  `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`,
  `src/ubiq-open-web-weaker-band-posture-guard.test.ts`, and
  `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`.
  It added `ubiq_weak_band_current_gate_guard_gate_a_summary`,
  `current_gate_promoted_ubiq_weak_band_engine_visible_pack`, and
  `rockwool_source_blockers_carry_forward_after_ubiq_gate_a`. Runtime
  values, source rows, support semantics, confidence, evidence, API,
  route-card values, output-card statuses, proposal/report copy, and
  workbench input behavior stayed frozen. Rockwool exact runtime
  remains blocked by `rights_safe_source_owned_curve_payload_absent`.
  It selected
  `packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_ubiq_open_web_weak_band_current_gate_guard_and_select_next_accuracy_slice`.
  Validation passed on 2026-05-05: focused UBIQ Gate A 1 file / 5
  tests, focused UBIQ continuity with engine 2 files / 6 tests and web
  1 file / 2 tests, final `pnpm calculator:gate:current` with engine
  268 files / 1540 tests, web 55 files / 265 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts`
  was restored to `.next-typecheck` after the Next build.
- just landed V26 source-gap revalidation Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`
  landed
  `selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap`.
  It selected `ubiq_open_web_weak_band_current_gate_guard_v1` with
  target file
  `packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
  and action
  `gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate`.
  It added `remaining_accuracy_gap_order_after_rockwool_closeout`,
  `rockwool_source_blockers_carry_forward_after_v26`, and
  `selected_ubiq_open_web_weak_band_current_gate_guard`. The selected
  guard is source-backed and calculation-relevant: UBIQ FL-23/25/27
  exact lower-board stacks must stay live on published `Rw`, `Ln,w`,
  `Ln,w+CI`, `R'w`, `DnT,w`, `L'n,w`, and `L'nT,w` values, while
  upper-only open-web weak-band stacks must keep impact outputs
  fail-closed. Rockwool exact runtime remains blocked by
  `rights_safe_source_owned_curve_payload_absent`; adjacent Rockwool
  stays supported at `Rw 51 / R'w 49 / DnT,w 51`, flat-list split
  Rockwool stays withheld with diagnostic `Rw 41 / R'w 39 / DnT,w 40`,
  and grouped Rockwool stays `Rw 41` screening-only on
  `multileaf_screening_blend`.
- just landed Rockwool split triple-leaf numeric source closure Gate C:
  `packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26`.
  It closed `rockwool_split_triple_leaf_numeric_source_closure_v1` and
  selected `calculator_source_gap_revalidation_v26` with target file
  `packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`
  and action
  `gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout`.
  It carried forward `rockwool_split_numeric_closure_gate_c_summary`,
  `flat_list_split_output_withhold_carry_forward`,
  `adjacent_rockwool_51_49_51_carry_forward`,
  `grouped_rockwool_screening_source_blocker_status`,
  `remaining_accuracy_gap_order_after_rockwool_closeout`, and
  `selected_gate_a_source_gap_revalidation_v26_with_target_file`.
  Protected boundaries: flat-list split/internal gypsum-leaf Rockwool
  still calculates `Rw 41 / R'w 39 / DnT,w 40` but requested wall
  airborne outputs stay out of `supportedTargetOutputs`; adjacent
  Rockwool stays corrected and supported at `Rw 51 / R'w 49 / DnT,w 51`;
  grouped Rockwool stays live screening-only/source-blocked at `Rw 41`,
  not exact and not source-validated. V26 must re-rank remaining
  accuracy/source gaps and select one implementable next slice, not a
  confidence-only or productization pass.
  Validation passed on 2026-05-05: focused Gate C 1 file / 6 tests, and
  final `pnpm calculator:gate:current` with engine 264 files / 1524
  tests, web 54 files / 263 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- just landed Rockwool split triple-leaf numeric source closure Gate B:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`
  landed
  `gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`.
  Selection status:
  `gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout`.
  It added runtime output-support withholding for flat-list
  split/internal gypsum-leaf Rockwool stacks: the finite diagnostic
  values remain internally visible as `Rw 41 / R'w 39 / DnT,w 40`, but
  requested wall airborne outputs are moved out of `supportedTargetOutputs`
  into `unsupportedTargetOutputs` until grouped topology and a
  source-owned calibrated model exist. Workbench output cards now show
  `Not ready` with explicit grouped-topology/source-owned-model copy for
  the flat-list split stack. Adjacent Rockwool remains corrected and
  supported at `Rw 51 / R'w 49 / DnT,w 51`; grouped Rockwool remains
  screening-only/live with source validation blocked, not exact. Gate B
  selected
  `packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_split_triple_leaf_numeric_source_closure_and_select_next_accuracy_slice`.
  Gate B checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B_HANDOFF.md`.
  Validation passed on 2026-05-05: focused engine Gate B 1 file / 5
  tests, focused web Gate B 1 file / 3 tests, web Rockwool continuity 5
  files / 28 tests, focused Rockwool engine continuity 7 files / 38
  tests, and final `pnpm calculator:gate:current` with engine 263 files
  / 1518 tests, web 54 files / 263 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green. Known non-fatal `sharp/@img`
  warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build. Broad validation after Gate B: lint and typecheck passed,
  engine full suite passed 396 files / 2338 tests, web full suite passed
  on rerun with 166 files / 936 passed + 18 skipped, repo build passed
  5 / 5 tasks, and final `git diff --check` passed. The first
  monolithic `pnpm check` run hit a transient timeout in the long AAC-G5
  web route scan; the isolated rerun and full web-suite rerun passed.
- just landed Rockwool split triple-leaf numeric source closure Gate A:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`
  landed
  `gate_a_kept_split_internal_leaf_finite_screening_diagnostic_but_rejected_exact_numeric_closure_selected_runtime_withhold_gate_b`.
  Gate action:
  `gate_a_decided_split_internal_leaf_requires_source_owned_topology_before_exact_numeric_closure`.
  It added
  `rockwool_split_internal_leaf_exact_numeric_rejected_without_source_owned_topology`.
  Adjacent Rockwool stays corrected at `Rw 51 / R'w 49 / DnT,w 51`.
  The split/internal gypsum-leaf stack still returns the finite
  screening diagnostic `Rw 41 / R'w 39 / DnT,w 40` through
  `multileaf_screening_blend`, but Gate A rejects treating it as a
  defended physical triple-leaf penalty. NRC 2024, Uris 2006, and
  Ballagh 2013 remain source/model context only; exact closure still
  needs source-owned curves, topology/coupling owner, local Rockwool
  material mapping, metric/tolerance owner, negative boundaries,
  calibration holdout, and paired visible/API tests. Selected next file:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`;
  selected next action:
  `gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 4 tests,
  Rockwool triple-leaf engine continuity 9 files / 49 tests, and final
  `pnpm calculator:gate:current` with engine 262 files / 1513 tests, web
  53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Broad `pnpm check` was not run because Gate A
  made no runtime, shared-schema, API, report/proposal, or visible-output
  behavior movement. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
  `.next-typecheck` after the Next build.
- just landed calculator source-gap revalidation V25 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`
  landed
  `v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure`
  with a runtime numeric correction. It added
  `rockwool_adjacent_flat_list_numeric_recovery`: the PDF-like adjacent
  Rockwool stack now stays on the double-leaf numeric lane at `Rw 51`,
  `R'w 49`, and `DnT,w 51` using
  `double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`
  instead of being pulled down to the prior bad
  `multileaf_screening_blend_fail_closed_until_grouped_topology`
  corridor. It also added
  `rockwool_split_internal_leaf_remains_numeric_open`: the split/internal
  gypsum-leaf stack still returns `Rw 41`, `R'w 39`, and `DnT,w 40` via
  `multileaf_screening_blend`, and that value is not closed as correct.
  Selected next slice:
  `rockwool_split_triple_leaf_numeric_source_closure_v1`; selected next
  file:
  `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`;
  selected next action:
  `gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop`.
- just landed Rockwool triple-leaf support posture Gate A:
  `packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`
  landed
  `gate_a_kept_rockwool_source_required_values_screening_supported_no_runtime_selected_source_gap_revalidation_v25`
  no-runtime and selected `calculator_source_gap_revalidation_v25` with
  target file
  `packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`.
  It added `rockwool_support_semantics_decision`,
  `rockwool_screening_supported_values_not_exact`,
  `rockwool_posture_surface_map`,
  `rockwool_unsupported_without_preview_rejected`, and
  `source_gap_revalidation_v25_selected`. `supportedTargetOutputs`
  stays a finite-screening-metric availability surface, not
  source-backed exactness. Unsupported exact posture is rejected until a
  separate screening-preview value channel exists, because otherwise the
  workbench would hide the useful `Rw 41` diagnostic as `Not ready`.
  Runtime values, support, confidence, evidence, API shape, route-card
  values, output-card status, proposal/report values, visible behavior,
  and workbench-input behavior stayed frozen. Rockwool remains grouped
  `Rw 41` / `STC 41`, flat-list adjacent swap `Rw 42` / `STC 42`, and
  field `R'w 34` / `DnT,w 36`, screening-supported, not exact, not
  source-validated, and not design-grade.
  Validation passed on 2026-05-05: focused Gate A 1 file / 5 tests,
  engine continuity 8 files / 49 tests, web Rockwool/output continuity
  4 files / 29 tests, final `pnpm calculator:gate:current` with engine
  260 files / 1505 tests, web 53 files / 260 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  passed with lint and typecheck clean, engine 393 files / 2325 tests,
  web 165 files / 933 passed + 18 skipped, and repo build 5 / 5 tasks.
  Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
  `.next-typecheck` after the Next build.
- just landed Rockwool triple-leaf resolution Gate A:
  `packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`
  landed
  `gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture`
  and selected `rockwool_triple_leaf_support_posture_v1` with target
  file
  `packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`.
  It added `rockwool_exact_source_packet_decision`,
  `rockwool_source_required_screening_boundary`,
  `rockwool_flat_list_reorder_boundary`, and
  `rockwool_support_posture_selected`. Exact/source-backed Rockwool
  runtime remains blocked by `rights_safe_source_owned_curve_payload_absent`;
  source acquisition is not repeated without a new packet. Runtime
  values stay grouped `Rw 41`, flat-list `Rw 42`, and field `R'w 34` /
  `DnT,w 36`, but grouped topology now carries the source-required
  runtime warning:
  `Grouped triple-leaf topology is present, but DynEcho still needs a source-calibrated triple-leaf solver, rights-safe source-owned curve payload, local Rockwool/material mapping, metric context owner, tolerance owner, negative boundaries, and paired visible tests before promoting this beyond the screening blend; treat it as source-required screening, not exact or design-grade.`
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 9 files / 55 tests, web Rockwool continuity 2 files
  / 14 tests, split-refactor size pin 1 file / 5 tests after updating
  `dynamic-airborne.ts` from 1829 to 1828 physical lines, final `pnpm
  calculator:gate:current` with engine 259 files / 1500 tests, web 53
  files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Broad `pnpm check` passed after removing one
  unused source-promotion Gate A import: lint and typecheck clean,
  engine 392 files / 2320 tests, web 165 files / 933 passed + 18
  skipped, and repo build 5 / 5 tasks. Known non-fatal `sharp/@img`
  warnings remain through `@turbodocx/html-to-docx`;
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build.
- just landed source-promotion owner-set readiness Gate A:
  `packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`
  landed
  `gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution`
  no-runtime and selected `rockwool_triple_leaf_resolution_v1` with
  target file
  `packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`.
  It added `source_promotion_owner_set_inventory`,
  `ownerless_source_promotion_blocked`,
  `hostile_import_snapshot_not_evidence_carry_forward`, and
  `rockwool_resolution_selected_as_next_accuracy_target`. Runtime
  values, support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, visible behavior, and
  workbench-input behavior stayed frozen. Source-like names, near-source
  aliases, source locators, imported snapshots, finite copied numbers,
  and visible copy cannot promote runtime evidence without source
  provenance, topology owner, material mapping owner, metric context
  owner, tolerance owner, negative boundaries, paired engine tests, and
  paired visible tests. Rockwool remains screening-only: grouped
  `Rw 41`, flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`, not
  exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`. The next slice must decide
  exact/source-backed runtime if a rights-safe packet and full owner set
  exist, otherwise fail closed or keep the result explicitly
  screening-only.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 7 files / 42 tests, web continuity 2 files / 15
  tests, `pnpm calculator:gate:current` with engine 258 files / 1494
  tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green; final `git diff --check` green
  after restoring `apps/web/next-env.d.ts` to `.next-typecheck`. Broad
  `pnpm check` was not run because Gate A made no runtime, visible,
  shared-schema, API, report/proposal, or workbench-input behavior
  movement.
- just landed calculator source-gap revalidation V24 Gate A:
  `packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`
  landed
  `selected_source_promotion_owner_set_readiness_guard_after_v24_confirmed_rockwool_uris_blocked_and_controlled_use_handoff_closed`
  no-runtime and selected
  `source_promotion_owner_set_readiness_guard_v1` with target file
  `packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`.
  It consumed the controlled-use handoff closeout and added
  `controlled_use_handoff_gate_c_closeout_consumed`,
  `rockwool_uris_exact_runtime_still_blocked_after_controlled_use`,
  `source_promotion_owner_set_guard_selected`,
  `hostile_api_import_and_frequent_combination_green_carry_forward`,
  and `field_outputs_non_design_grade_carry_forward`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Rockwool remains screening-only: grouped
  `Rw 41`, flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`, not
  exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`. The next slice must
  require source provenance, topology owner, material mapping owner,
  metric context owner, tolerance owner, negative boundaries, paired
  engine tests, and paired visible tests before any future
  exact/source-backed promotion.
  Validation passed on 2026-05-05: focused V24 Gate A 1 file / 7
  tests, engine continuity 8 files / 47 tests, web visible
  frequent-combination continuity 1 file / 8 tests, `pnpm
  calculator:gate:current` with engine 257 files / 1488 tests, web 53
  files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green; final `git diff --check` green after
  restoring `apps/web/next-env.d.ts` to `.next-typecheck`. Broad
  `pnpm check` was not run because V24 Gate A made no runtime, visible,
  shared-schema, API, report/proposal, or workbench-input behavior
  movement.
- just landed company-internal controlled-use handoff Gate C closeout:
  `packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24`
  no-runtime and selected `calculator_source_gap_revalidation_v24`
  with target file
  `packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`.
  It consumed `current_operator_workflow`,
  `current_acceptance_bucket_table`, `ready_values_snapshot`,
  `caveated_blocked_stop_rules`, `validation_command_log`,
  `rockwool_screening_only_notice`, and
  `selected_closeout_or_source_gap_followup`; it added
  `company_internal_controlled_use_handoff_closed`,
  `controlled_use_pack_is_current_operator_handoff`, and
  `calculator_source_gap_revalidation_v24_selected`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Controlled use remains bounded to the handoff
  envelope and is not a broad high-accuracy opening. V24 must carry
  forward `rockwool_screening_only_not_fixed`,
  `field_outputs_non_design_grade`,
  `source_promotion_owner_set_required`,
  `hostile_api_import_fail_closed`, and
  `frequent_combination_snapshots_stay_green`. Rockwool remains
  screening-only: grouped `Rw 41`, flat-list `Rw 42`, field `R'w 34`
  and `DnT,w 36`, not exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate C 1 file / 5 tests,
  continuity 8 files / 43 tests, `pnpm calculator:gate:current` with
  engine 256 files / 1481 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green; broad
  `pnpm check` with lint/typecheck clean, engine 389 files / 2301
  tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
  tasks, and final `git diff --check` green. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` stayed restored
  to `.next-typecheck`.
- just landed company-internal controlled-use handoff Gate A:
  `packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`
  landed
  `gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout`
  no-runtime and selected
  `packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`.
  It created
  `docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md` and added
  `current_operator_workflow`, `current_acceptance_bucket_table`,
  `ready_values_snapshot`, `caveated_blocked_stop_rules`,
  `validation_command_log`, `rockwool_screening_only_notice`, and
  `selected_closeout_or_source_gap_followup`. Runtime values, support,
  confidence, evidence, API shape, route-card values, output-card
  status, proposal/report values, and workbench-input behavior stayed
  frozen. Ready controlled-use values are pinned as LSF exact `Rw=55`,
  `R'w=48`, building `DnT,w=50`; AAC benchmark `Rw=47`, `R'w=45`,
  building `DnT,w=47`; masonry benchmark `Rw=43`, `R'w=41`, building
  `DnT,w=43`; Pliteq floor `Rw=60`, `Ln,w=58`, `L'n,w=61`,
  `L'nT,w=58.2`; Ubiq bound floor `Rw=62`, `Ln,w=52`, `L'n,w=55`,
  `L'nT,w=52.2`. Direct high-accuracy copy remains forbidden.
  Rockwool remains screening-only: grouped `Rw 41`, flat-list `Rw 42`,
  field `R'w 34` and `DnT,w 36`, not exact/source-validated, Uris 2006
  still `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  continuity 6 files / 33 tests, `pnpm calculator:gate:current` with
  engine 255 files / 1476 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green. Final
  `git diff --check` passed after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` is reserved for the selected
  Gate C closeout or later runtime/user-visible movement.
- just landed company-internal high-accuracy opening rehearsal Gate C closeout:
  `packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_company_internal_high_accuracy_opening_rehearsal_no_runtime_and_selected_controlled_use_handoff`
  no-runtime and selected
  `company_internal_controlled_use_handoff_v1` with target file
  `packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`.
  It consumed `company_internal_opening_acceptance_matrix`,
  `final_validation_evidence_map`,
  `rockwool_screening_and_source_blocker_registry`,
  `source_promotion_no_runtime_boundary_register`,
  `hostile_api_import_fail_closed_evidence`,
  `operator_caveat_and_usage_handoff_pack`, and
  `selected_opening_handoff_or_backlog_followup`; it added
  `company_internal_controlled_use_handoff_selected`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Direct high-accuracy opening copy remains
  blocked; the next slice must prepare a current controlled-use handoff
  with updated values, Rockwool screening-only language, caveats, and
  stop rules before any use label is refreshed.
  Validation passed on 2026-05-05: focused Gate C 1 file / 5 tests,
  continuity 9 files / 47 tests, `pnpm calculator:gate:current` with
  engine 254 files / 1470 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green, broad
  `pnpm check` with lint/typecheck clean, engine 387 files / 2290
  tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
  tasks, and final `git diff --check` green.
- just landed company-internal high-accuracy opening rehearsal Gate A:
  `packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`
  landed
  `gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout`
  no-runtime and selected
  `packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`.
  It added `company_internal_opening_acceptance_matrix`,
  `final_validation_evidence_map`,
  `rockwool_screening_and_source_blocker_registry`,
  `source_promotion_no_runtime_boundary_register`,
  `hostile_api_import_fail_closed_evidence`,
  `operator_caveat_and_usage_handoff_pack`, and
  `selected_opening_handoff_or_backlog_followup`. Runtime values,
  support, confidence, evidence, API shape, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Ready source/benchmark wall/floor corridors
  are pinned to current values; Rockwool triple-leaf, generated and
  screening lanes, field continuations, near-source rows, Uris 2006,
  hostile API/import payloads, many-layer, and reorder edges remain
  caveated, blocked, or fail-closed. High-accuracy opening is not
  allowed by Gate A alone and needs closeout validation evidence first.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  continuity 8 files / 42 tests, `pnpm calculator:gate:current` with
  engine 253 files / 1465 tests, web 53 files / 260 passed + 18 skipped,
  repo build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  passed with lint/typecheck clean, engine 386 files / 2285 tests, web
  165 files / 933 passed + 18 skipped, repo build 5 / 5 tasks. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
  `.next-typecheck` after Next rewrote it.
- just landed source-promotion hostile-input readiness Gate C closeout:
  `packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_source_promotion_hostile_input_readiness_guard_no_runtime_and_selected_company_internal_high_accuracy_opening_rehearsal`
  no-runtime and selected
  `company_internal_high_accuracy_opening_rehearsal_v1` with target file
  `packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`.
  It consumed `source_promotion_surface_inventory`,
  `hostile_api_import_fail_closed_surface_inventory`,
  `estimate_json_1e309_rejected_by_finite_layer_schema`,
  `server_import_snapshot_not_runtime_promotion_surface`,
  `near_source_rows_context_only_until_owner_set_exists`,
  `rockwool_gate_c_policy_freeze_carry_forward`, and
  `selected_source_promotion_hostile_closeout_with_target_file`; it
  added `company_internal_high_accuracy_opening_rehearsal_selected`.
  Runtime values, support, confidence, evidence, route-card values,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Estimate / impact-only `1e309` payloads stay
  rejected by finite layer schema before calculation. Rockwool remains
  explicit screening-only, not exact/source-validated: grouped `Rw 41`,
  flat-list `Rw 42`, field `R'w 34`, `DnT,w 36`, Uris 2006
  `paused_waiting_rights_safe_source_packet`. Company-internal
  high-accuracy opening remains blocked until the selected rehearsal
  produces a current acceptance matrix, validation evidence, and green
  current-gate plus broad `pnpm check` evidence.
  Validation passed on 2026-05-05: focused Gate C 1 file / 5 tests,
  engine continuity 7 files / 36 tests, `pnpm calculator:gate:current`
  with engine 252 files / 1459 tests, web 53 files / 260 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard green. Broad
  `pnpm check` passed with lint/typecheck clean, engine 385 files / 2279
  tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
  tasks. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`; final `git diff --check` was green and
  `apps/web/next-env.d.ts` had no final diff.
- just landed source-promotion hostile-input readiness Gate A:
  `packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`
  landed
  `gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout`
  and selected
  `packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`.
  It added `source_promotion_surface_inventory`,
  `hostile_api_import_fail_closed_surface_inventory`,
  `estimate_json_1e309_rejected_by_finite_layer_schema`,
  `server_import_snapshot_not_runtime_promotion_surface`,
  `near_source_rows_context_only_until_owner_set_exists`,
  `rockwool_gate_c_policy_freeze_carry_forward`, and
  `selected_source_promotion_hostile_closeout_with_target_file`.
  Gate A found and fixed a bounded hostile API validation gap:
  JSON `1e309` parses to `Infinity`, so shared layer validation now
  requires `thicknessMm: z.number().finite().positive()` and estimate /
  impact-only routes reject the payload before calculation. Numeric
  calculator runtime values, support, confidence, evidence,
  route-card values, output-card status, proposal/report values, and
  workbench-input behavior stayed frozen. Exact source controls and
  near-source rows remain separated; server import remains snapshot
  persistence only, not runtime promotion. Rockwool remains frozen:
  grouped `Rw 41`, flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`,
  screening-only, not exact/source-validated, Uris 2006 still
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  focused web API validation 1 file / 3 tests, engine continuity 8
  files / 44 tests, `pnpm calculator:gate:current` with engine 251
  files / 1454 tests, web 53 files / 260 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  passed after removing a lint-only unused test constant: lint and
  typecheck clean, engine 384 files / 2274 tests, web 165 files / 933
  passed + 18 skipped, repo build 5 / 5 tasks. Known non-fatal
  `sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
  final `git diff --check` was green after `apps/web/next-env.d.ts` was
  restored to `.next-typecheck` after Next build rewrote the route-types
  path.
- just landed Rockwool triple-leaf explicit screening-only policy Gate C:
  `packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`
  landed
  `closed_rockwool_triple_leaf_explicit_screening_only_policy_no_runtime_and_selected_source_promotion_hostile_input_readiness_guard`
  no-runtime and selected
  `source_promotion_hostile_input_readiness_guard_v1` with target file
  `packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`.
  It added `rockwool_policy_gate_c_closeout_summary`,
  `rockwool_exact_or_screening_company_criterion_closed`,
  `source_promotion_hostile_input_opening_blockers_carry_forward`,
  `source_promotion_hostile_input_readiness_guard_selected`, and
  `selected_gate_a_source_promotion_hostile_input_readiness_with_target_file`.
  Runtime values, support, confidence, evidence, API behavior,
  route-card values, output-card status, proposal/report values, and
  workbench-input behavior stayed frozen. The Rockwool company-internal
  criterion is closed as explicit screening-only, not exact runtime.
  Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated. Flat-list adjacent swaps remain
  `Rw 42` fail-closed until grouped topology is supplied. Field `R'w 34`
  and `DnT,w 36` remain continuations from the Rockwool screening lane.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  Company-internal high-accuracy opening remains blocked by source
  promotion ownership, hostile API/import fail-closed proof, and final
  current-gate plus broad-check evidence at opening handoff.
  Validation passed on 2026-05-05: focused Gate C 1 file / 6 tests,
  engine continuity 6 files / 37 tests, focused web Gate B compatibility
  1 file / 7 tests, final `pnpm calculator:gate:current` with engine
  250 files / 1448 tests, web 53 files / 259 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` was not run because Gate C made
  no runtime, API, shared-schema, route/report, or workbench-input
  behavior change. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed Rockwool triple-leaf explicit screening-only policy Gate B:
  `apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`
  landed
  `gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy` with
  `gate_b_pinned_visible_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_gate_c_closeout`
  visible-copy only and selected
  `packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`.
  It added `visible_rockwool_screening_only_policy_guard`,
  `rockwool_output_card_screening_only_copy`,
  `rockwool_proposal_report_screening_only_copy`,
  `rockwool_field_continuation_screening_bridge`,
  `rockwool_non_target_boundary_copy_guard`, and
  `selected_gate_c_closeout_or_next_slice_with_target_file`.
  Runtime values, support, confidence, evidence, API, route-card
  values, output-card status, proposal/report values, and
  workbench-input behavior stayed frozen. Grouped split-rockwool remains
  `Rw 41`, `multileaf_screening_blend`, low confidence, screening-only,
  not exact, and not source-validated, but visible output-card and
  proposal/report copy now names `Rockwool screening-only`. Flat-list
  adjacent swaps remain `Rw 42` and visibly fail closed until grouped
  topology is supplied. Field `R'w 34` and `DnT,w 36` remain
  continuations from the Rockwool screening lane, not independent
  measured field or design-grade results. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate B 1 file / 7 tests,
  web visible continuity 5 files / 31 tests, engine continuity 5 files
  / 29 tests, final `pnpm calculator:gate:current` with engine 249
  files / 1442 tests, web 53 files / 259 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, broad `pnpm check` with
  lint/typecheck clean, engine 382 files / 2262 tests, web 165 files /
  932 passed + 18 skipped, repo build 5 / 5 tasks, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Known non-fatal `sharp/@img` warnings remain
  through `@turbodocx/html-to-docx`.
- just landed Rockwool triple-leaf explicit screening-only policy Gate A:
  `packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`
  landed
  `gate_a_inventoried_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_visible_gate_b`
  no-runtime and selected
  `apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`.
  It added `rockwool_triple_leaf_screening_surface_inventory`,
  `grouped_rw41_and_flat_rw42_runtime_freeze`,
  `visible_route_output_report_policy_gap`,
  `rockwool_visible_gate_b_selected`,
  `source_promotion_hostile_input_carry_forward`, and
  `pre_company_internal_use_exit_criteria`. Runtime values, support,
  confidence, evidence, API, route-card values, output-card status,
  proposal/report values, and workbench-input behavior stayed frozen.
  Grouped split-rockwool remains `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated. Flat-list adjacent swaps remain
  `Rw 42` on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`. Field
  `R'w 34` and `DnT,w 36` remain continuations from the screening lane,
  not design-grade field results. Gate A selected visible Gate B because
  output-card/report surfaces can still show generic live/screening copy
  without a Rockwool-specific screening-only label. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 5 files / 29 tests, web visible continuity 3 files
  / 16 tests, final `pnpm calculator:gate:current` with engine 249
  files / 1442 tests, web 52 files / 252 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` was not run because Gate A made
  no runtime, visible, API, shared-schema, route/report, or
  workbench-input behavior change. Known non-fatal `sharp/@img` warnings
  remain through `@turbodocx/html-to-docx`.
- just landed V23 source-gap revalidation:
  `packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts`
  landed
  `selected_rockwool_triple_leaf_explicit_screening_only_policy_after_v23_confirmed_uris_source_blocked_and_field_output_owner_closed`
  no-runtime and selected
  `rockwool_triple_leaf_explicit_screening_only_policy_v1` with target
  file
  `packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`.
  It added `field_output_owner_policy_gate_c_closeout_summary`,
  `rockwool_uris_exact_runtime_still_blocked`,
  `rockwool_explicit_screening_only_policy_selected`,
  `source_promotion_and_hostile_input_ownership_carry_forward`,
  `repeat_uris_acquisition_blocked_without_new_packet`, and
  `pre_company_internal_use_exit_criteria`. Runtime values, support,
  confidence, evidence, API, route-card values, output-card status,
  proposal/report values, and workbench-input behavior stayed frozen.
  Direct Rockwool/Uris exact runtime promotion remains blocked by the
  missing rights-safe source-owned curve payload, local material
  mapping, metric context, tolerance owner, source-curve provenance,
  and complete negative-boundary / paired visible tests. Grouped
  split-rockwool remains `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening-only, not exact, and not source-validated. V23
  selected the bounded no-runtime Rockwool explicit screening-only
  policy slice because company-internal opening requires Rockwool to be
  exact or explicitly screening-only before higher-trust private use.
  Validation passed on 2026-05-05: focused V23 1 file / 7 tests,
  engine continuity 6 files / 36 tests, web visible continuity 3 files
  / 16 tests, final `pnpm calculator:gate:current` with engine 248
  files / 1436 tests, web 52 files / 252 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and final
  `git diff --check` green after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`. Broad `pnpm check` was not run because V23 made no
  runtime, visible, API, shared-schema, route/report, or workbench-input
  behavior change. Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed field-output owner/design-grade policy Gate C:
  `packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`
  closed `field_output_owner_and_design_grade_policy_v1` no-runtime
  with
  `closed_field_output_owner_design_grade_policy_no_runtime_and_selected_source_gap_revalidation_v23`
  and selected `calculator_source_gap_revalidation_v23`. It added
  `field_output_owner_policy_gate_c_closeout_summary`,
  `field_output_owner_and_design_grade_policy_closed_carry_forward`,
  `rockwool_rw41_screening_and_uris_packet_status`,
  `pre_company_internal_use_exit_criteria`, and
  `selected_source_gap_revalidation_v23_with_target_file_and_validation_scope`.
  Runtime values, support, confidence, evidence, API, route-card,
  output-card status, proposal/report values, and workbench-input
  behavior stayed frozen. Field-output owner policy is closed as a
  visibility/honesty boundary, not runtime source evidence; finite
  `R'w`, `DnT,w`, `DnT,A`, `L'n,w`, `L'nT,w`, and `L'nT,50` remain
  non-design-grade until metric/source/geometry/tolerance/
  negative-boundary and paired engine/web/report ownership exists.
  Rockwool triple-leaf remains not fixed: grouped split-rockwool is
  still `Rw 41`, `multileaf_screening_blend`, low confidence,
  screening only, not exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  `pre_company_internal_use_exit_criteria` remains active. The
  field-output criterion is closed, but company-internal high-accuracy
  opening remains blocked by Rockwool exact-or-explicit-screening,
  source-promotion ownership, hostile-input proof, and final validation
  at opening handoff. Validation completed on 2026-05-05: focused Gate C
  1 file / 6 tests, engine continuity 5 files / 30 tests, web
  continuity 7 files / 73 passed + 18 skipped, `pnpm
  calculator:gate:current` with engine 247 files / 1429 tests, web 52
  files / 252 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green, and broad `pnpm check` with lint/typecheck
  clean, engine 380 files / 2249 tests, web 164 files / 925 passed + 18
  skipped, and build 5 / 5 tasks. Final `git diff --check` was green.
  Known non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed field-output owner/design-grade policy Gate B:
  `apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts`
  landed
  `gate_b_pinned_visible_field_output_design_grade_owner_policy_no_runtime_selected_gate_c_closeout`
  visible-copy only and selected
  `packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`.
  It added `visible_field_output_design_grade_policy_guard`,
  `output_card_owner_policy_copy`, `proposal_report_owner_policy_copy`,
  `needs_input_field_policy_visible_boundaries`,
  `rockwool_field_output_screening_policy_carry_forward`, and
  `selected_gate_c_closeout_or_next_slice_with_target_file`. Runtime
  values, support, confidence, evidence,
  API, route-card, output-card status, and workbench-input behavior
  stayed frozen. Output-card and proposal/report wording now explicitly
  says no design-grade field owner is active until source basis,
  geometry, tolerance, negative-boundary, and report-test ownership
  close. Rockwool triple-leaf remains not fixed: grouped
  split-rockwool is still `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening only, not exact, and not source-validated.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  `pre_company_internal_use_exit_criteria` remains active.
  Validation completed on 2026-05-05: focused Gate B 1 file / 6 tests,
  engine continuity 4 files / 24 tests, web continuity 7 files / 73
  passed + 18 skipped, `pnpm calculator:gate:current` with engine 246
  files / 1423 tests, web 52 files / 252 passed + 18 skipped, repo
  build 5 / 5 tasks, whitespace guard green, and broad `pnpm check`
  with lint/typecheck clean, engine 379 files / 2243 tests, web 164
  files / 925 passed + 18 skipped, and build 5 / 5 tasks. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed field-output owner/design-grade policy Gate A:
  `packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`
  landed
  `gate_a_inventoried_field_output_owner_design_grade_policy_no_runtime_selected_visible_policy_gate_b`
  no-runtime and selected
  `gate_b_pin_visible_field_output_design_grade_owner_policy` at
  `apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts`.
  It added `field_output_owner_design_grade_policy_inventory`,
  `field_metric_owner_matrix`,
  `source_basis_and_tolerance_requirement_matrix`,
  `missing_geometry_and_missing_field_input_negative_boundaries`,
  `rockwool_screening_field_output_carry_forward`, and the visible Gate B
  selection. Runtime values, support, confidence, evidence, API,
  route-card, output-card, proposal/report, and workbench-input
  behavior stayed frozen. Finite `R'w`, `DnT,w`, `DnT,A`, `L'n,w`,
  `L'nT,w`, and `L'nT,50` values remain non-design-grade without
  metric/source/geometry/tolerance/negative-boundary and paired
  engine/web/report ownership. Rockwool triple-leaf remains not fixed:
  grouped split-rockwool is still `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening only, not
  exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  `pre_company_internal_use_exit_criteria` remains active.
  Validation passed on 2026-05-05: focused Gate A 1 file / 6 tests,
  engine continuity 4 files / 24 tests, web continuity 4 files /
  50 passed + 18 skipped, `pnpm calculator:gate:current` with engine
  246 files / 1423 tests, web 51 files / 246 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Broad `pnpm check`
  also passed with lint/typecheck clean, engine full suite 379 files /
  2243 tests, web full suite 163 files / 919 passed + 18 skipped, and
  repo build 5 / 5 tasks.
- just landed V22 source-gap revalidation:
  `packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`
  landed
  `selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green`
  no-runtime and selected `field_output_owner_and_design_grade_policy_v1`.
  It added `company_internal_gate_c_closeout_summary`,
  `rockwool_rw41_screening_and_uris_packet_status`,
  `repeat_uris_acquisition_blocked_without_new_packet`,
  `field_output_near_source_hostile_input_and_curve_provenance_status`,
  `company_internal_high_accuracy_opening_blocker_status`, and
  `selected_next_slice_with_target_file_and_validation_scope`.
  Runtime values, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input behavior stayed
  frozen. Rockwool triple-leaf remains not fixed: grouped
  split-rockwool is still `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening only, not exact, and not source-validated.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  The next actionable correctness boundary is field-output owner and
  design-grade policy: finite `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, and
  related outputs must never become design-grade without metric/source/
  tolerance/geometry/visible-test ownership. Selected next plan:
  `docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`.
  Validation passed on 2026-05-05: focused V22 Gate A 1 file / 7 tests,
  engine continuity 8 files / 52 tests, web continuity 4 files / 22
  tests, and final `pnpm calculator:gate:current` with engine 245 files
  / 1417 tests, web 51 files / 246 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green. Broad `pnpm check` also
  passed after the V22 test typecheck issue was fixed: lint/typecheck
  clean, engine full suite 378 files / 2237 tests, web full suite
  163 files / 919 passed + 18 skipped, and repo build 5 / 5 tasks.
- just landed company-internal frequent-combination Gate C closeout:
  `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`
  closed `company_internal_frequent_combination_lane_snapshot_guard_v1`
  and selected `calculator_source_gap_revalidation_v22`. It
  landed
  `closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22`
  no-runtime. It added `company_internal_gate_c_closeout_summary`,
  `rockwool_rw41_screening_and_uris_packet_status`,
  `frequent_combination_guard_green_carry_forward`,
  `field_output_near_source_hostile_input_and_curve_provenance_status`,
  `repeat_uris_acquisition_blocked_without_new_packet`,
  `company_internal_high_accuracy_opening_still_blocked`, and
  `selected_next_slice_with_target_file_and_validation_scope`.
  Runtime values, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input behavior stayed
  frozen. Rockwool triple-leaf remains not fixed: grouped
  split-rockwool is still `Rw 41`, `multileaf_screening_blend`, low
  confidence, screening only, not exact, and not source-validated.
  Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-04: focused Gate C 1 file / 6 tests,
  engine continuity 6 files / 38 tests, final
  `pnpm calculator:gate:current` with engine 244 files / 1410 tests,
  web 51 files / 246 passed + 18 skipped, repo build 5 / 5 tasks,
  whitespace guard green, broad `pnpm check` with lint/typecheck clean,
  engine 377 files / 2230 tests, web 163 files / 919 passed + 18
  skipped, build 5 / 5 tasks, and final `git diff --check` green after
  restoring `apps/web/next-env.d.ts` to `.next-typecheck`. Known
  non-fatal `sharp/@img` warnings remain through
  `@turbodocx/html-to-docx`.
- just landed company-internal Gate C checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`
  and selected V22 plan:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md`
- just landed company-internal frequent-combination Gate B:
  `apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`
  landed
  `company_internal_frequent_combination_visible_guard_landed_no_runtime_selected_gate_c_closeout`
  no-runtime. It added
  `company_internal_visible_route_output_snapshot_guard`,
  `rockwool_triple_leaf_visible_screening_not_fixed`,
  `flat_list_swap_visible_fail_closed`,
  `near_source_alias_visible_context_only`,
  `hostile_input_visible_no_numeric_estimate`, and
  `field_outputs_never_design_grade_without_owner`. Runtime values,
  support, confidence, evidence, API, route-card, output-card,
  proposal/report, and workbench-input behavior stayed frozen.
  Rockwool triple-leaf remains not fixed: grouped split-rockwool is
  still `Rw 41`, `multileaf_screening_blend`, low confidence,
  screening only, not exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-04: focused web validation 1 file / 8
  tests, engine continuity 7 files / 50 tests, web continuity 6 files /
  27 tests, final `pnpm calculator:gate:current` with engine 243 files /
  1404 tests, web 51 files / 246 passed + 18 skipped, repo build
  5 / 5 tasks, whitespace guard green, and `git diff --check` green.
- just landed company-internal Gate B checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md`
  and selected Gate C closeout file:
  `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`
- just landed company-internal frequent-combination Gate A:
  `packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`
  landed
  `company_internal_frequent_combination_snapshot_matrix_landed_no_runtime_selected_visible_gate_b`
  no-runtime. It added
  `company_internal_frequent_combination_snapshot_matrix`,
  `rockwool_triple_leaf_screening_and_flat_swap_negative_rows`,
  `near_source_alias_and_hostile_input_negative_rows`,
  `field_outputs_never_design_grade_without_owner`,
  `standing_lane_misclassification_monitoring_mandate`, and
  `note_test_document_or_easy_fix` posture. Runtime values, support,
  confidence, evidence, API, route-card, output-card, proposal/report,
  and workbench-input behavior stayed frozen.
  Rockwool triple-leaf remains not fixed: grouped split-rockwool is
  still `Rw 41`, `multileaf_screening_blend`, low confidence,
  screening only, not exact, and not source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
  Validation passed on 2026-05-04: focused Gate A 1 file / 8 tests,
  engine continuity 7 files / 50 tests, web continuity 4 files / 15
  tests, and final `pnpm calculator:gate:current` with engine 243 files
  / 1404 tests, web 50 files / 238 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green.
- just landed company-internal Gate A checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md`
  and selected visible Gate B file:
  `apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`
- just landed V21 source-gap revalidation:
  `packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts`
  landed
  `selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked`
  no-runtime. It consumed the field-output visible-basis guard,
  confirmed `Rw 41` remains screening and not exact/source-validated,
  kept Uris 2006 on `paused_waiting_rights_safe_source_packet`, and
  selected
  `packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`
  as the next bounded company-internal lane snapshot guard.
  Validation passed on 2026-05-04: focused V21 1 file / 8 tests,
  engine continuity 5 files / 31 tests, web continuity 3 files / 14
  tests, and final `pnpm calculator:gate:current` with engine 242 files
  / 1396 tests, web 50 files / 238 passed + 18 skipped, repo build
  5 / 5 tasks, and whitespace guard green.
- just landed V21 checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md`
  and selected plan:
  `docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md`
- just landed field-output Gate B:
  `apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`
  strengthened visible output/report copy no-runtime. `R'w`, `DnT,w`,
  `L'n,w`, `L'nT,w`, and related field outputs are now framed as
  continuations from active lab/screening/apparent/bound basis, not
  independent exact field measurements. Runtime values, support,
  confidence, evidence promotion, API shape, route-card values,
  output-card status, and workbench input behavior stayed frozen. Gate B
  selected `calculator_source_gap_revalidation_v21` with
  `gate_b_strengthened_visible_field_output_basis_copy_no_runtime_selected_source_gap_revalidation_with_rockwool_and_misclassification_blockers`.
  Validation completed on 2026-05-04: focused Gate B passed 1 file / 4
  tests; continuity with output-card model, flat-list multileaf guard,
  triple-leaf company-internal rehearsal, and floor field continuation
  passed 4 files / 24 tests; `pnpm calculator:gate:current` passed
  engine 241 files / 1388 tests, web 50 files / 238 passed + 18
  skipped, repo build 5 / 5 tasks, and whitespace guard. A first build
  attempt hit a transient `next-font-manifest.json` artifact miss; the
  immediate web-build rerun and full current-gate rerun passed without
  calculator/runtime changes.
- prior field-output Gate A:
  `gate_a_inventoried_field_output_lab_screening_leakage_no_runtime_selected_visible_wording_guard_gate_b`
  landed at
  `packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`
  and selected
  `apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`.
- 2026-05-04 broad validation / UI integration pass:
  user-authored workbench UI changes were validated as navigation and
  layout-only changes around setup/assembly/results/review/proposal,
  command palette, and material picker surfaces. The pass fixed stale
  `partitionAreaM2` engine test-fixture fields and raised the
  full-suite `dynamic-airborne-family-boundary-scan` hold-scan timeout
  to 45 s. Final `pnpm check` passed: lint and typecheck clean; engine
  full suite 373 files / 2204 tests; web full suite 161 files / 907
  passed + 18 skipped; repo build 5 / 5 tasks with known non-fatal
  `sharp/@img` warnings. This does not move the selected calculator
  slice or promote rockwool triple-leaf.
- company-internal high-accuracy opening blocker:
  `company_internal_high_accuracy_opening_blocked_until_misclassification_blockers_close`.
  The old internal-use envelope remains only controlled / caveated pilot
  context. Before the calculator is opened as high-accuracy
  company-internal tooling, treat
  `triple_leaf_like_lane_source_field_errors_are_company_use_blockers`
  as active. `pre_company_internal_use_exit_criteria`: rockwool
  triple-leaf must be exact with source-owned topology/material/metric/
  tolerance/negative-boundary/visible-test ownership or explicitly
  screening-only; field outputs must not look design-grade without a
  field owner; frequent wall/floor lane snapshots must stay green;
  source promotion must require topology, material, metric, tolerance,
  negative-boundary, and paired visible tests; hostile API/import inputs
  must fail closed; `pnpm calculator:gate:current` and `pnpm check`
  must pass. Current next action:
  `gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker`.
- prior selected slice:
  `field_output_lab_screening_leakage_guard_v1`
- prior decision inside the slice:
  `calculator_source_gap_revalidation_v20` Gate A landed
  `selected_field_output_lab_screening_leakage_guard_after_v20_rerank_found_no_source_ready_runtime_candidate_and_uris_packet_absent`
  at
  `packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`.
  V20 confirmed that Uris 2006 remains blocked by
  `rights_safe_source_owned_curve_payload_absent`, no source-ready
  runtime candidate exists, and the grouped split-rockwool `Rw 41`
  answer remains low-confidence `multileaf_screening_blend`, not fixed
  and not source-validated. The selected planning surface is
  `docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md`.
- prior selected slice:
  `calculator_source_gap_revalidation_v20`
- prior decision inside the slice:
  `wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`
  Gate U landed
  `gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20`
  at
  `packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`.
  Gate U confirmed Uris 2006 identity metadata and authorized access
  paths, but found no rights-safe local source packet, page image,
  numeric table, authorized TDM payload, source-owned curve, or band
  vector.
- prior selected slice:
  `wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`
- prior decision inside the slice:
  `calculator_source_gap_revalidation_v19` Gate A landed
  `selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate`
  at
  `packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`.
  It selected the Uris 2006 / equivalent rockwool two-cavity
  source-packet acquisition lane as the next no-runtime action because
  the grouped split-rockwool `Rw 41` answer remains unfixed screening
  and no rights-safe packet is available in the repo.
  The selected planning surface is
  `docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md`.
  Runtime remains blocked until source packet, curve/rating derivation,
  local material mapping, grouped topology guard, negative boundaries,
  and paired engine plus web-visible tests all pass.
- prior selected slice:
  `calculator_source_gap_revalidation_v19`
- prior decision inside the slice:
  The just-closed slice is `floor_tolerance_edge_promotion_guard_v1`
  with
  `floor_tolerance_edge_gate_b_closeout_summary` and
  `closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19`.
  It carries forward
  `gate_b_exact_bound_edges_remained_protected_no_support_promotion`.
  Gate B lives at
  `packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`
  and selected v19 no-runtime. Gate A already landed
  `floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`
  at
  `packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`.
  It consumed `calculator_source_gap_revalidation_v18`,
  `common_combination_gate_b_reprobe_summary`,
  `sentinel_guard_green_and_fail_closed_boundary_carry_forward`,
  `post_sentinel_source_ready_runtime_candidate_rerank`,
  `rockwool_uris_2006_source_packet_status`, and
  `floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`.
  It kept `gate_b_reprobe_findings`,
  `standing_lane_misclassification_monitoring_mandate`,
  `note_test_document_or_easy_fix`,
  `paused_waiting_rights_safe_source_packet`,
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  `raw_floor_role_inference`, and
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  active. Gate A produced
  `role_tagged_exact_floor_tolerance_edge_inventory`,
  `bound_floor_near_miss_and_exact_drop_snapshot_matrix`,
  `just_inside_just_outside_thickness_corridor_tests`,
  `raw_role_prompt_and_duplicate_role_negative_boundaries`,
  `visible_exact_bound_screening_support_wording_requirements`, and
  `next_guard_or_closeout_decision_before_any_floor_support_promotion`.
  Gate A did not move runtime, support, confidence, evidence, API,
  route-card, output-card, proposal/report, or workbench-input behavior.
- 2026-05-04 v19 planning refresh:
  `v19_candidate_matrix_must_rank_uris_field_alias_hostile_and_closeout_paths`.
  The next file is still
  `packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`
  and it is intentionally absent until implementation begins. V19 must
  rank the Uris 2006 / equivalent rockwool two-cavity source-packet or
  source-acquisition lane first because it is the highest-impact
  unresolved user defect, but runtime remains blocked unless a
  rights-safe packet provides source-owned band data, rating derivation,
  uncertainty, local material mapping, grouped topology guard, negative
  boundaries, and paired engine plus web-visible tests. It must also
  explicitly evaluate field-output leakage, material alias /
  near-source false promotion, hostile API/import and curve-provenance
  risks, then select exactly one next slice or no-runtime closeout.
- 2026-05-04 planning pass:
  `gate_b_closeout_file_currently_absent_and_next_to_create`.
  Historical note: this pass was consumed by the landed Gate B closeout.
  The selected next file above is now v19 Gate A, not the Gate B
  closeout. Keep `wrong_measurement_triage_loop`,
  `frequent_combination_lane_suspicion_reproduce_trace_document_or_bounded_fix`,
  `external_source_research_deferred_until_source_acquisition_gate_or_source_packet`,
  and
  `exact_promotion_requires_source_topology_material_metric_tolerance_negative_visible_proof`
  active for every following calculator slice. If a frequent
  wall/floor combination appears to switch route family/source lane
  after a small reorder, duplicate-stack edit, material alias, hostile
  input, or tolerance-edge edit, reproduce it in a focused contract,
  compare engine trace and visible copy, then document it or land only a
  bounded easy fix with paired engine and visible tests. Do not open
  internet/source-packet research for the immediate Gate B closeout
  unless a source-acquisition gate is selected or a rights-safe source
  locator/source packet arrives.
- follow-up 2026-05-04 implementation inspection:
  `inspected_floor_exact_bound_implementation_surfaces`,
  `gate_b_contract_blueprint_snapshot_matrix`,
  `exact_bound_screening_visible_surface_parity_check`,
  `contiguous_duplicate_vs_disjoint_duplicate_role_boundary`,
  `current_gate_runner_must_include_gate_b_after_creation`,
  `source_gap_revalidation_v19_candidate_after_floor_closeout`, and
  `no_internet_research_before_gate_b_selects_source_acquisition`.
  Gate B should use `floor-system-evaluation.ts`,
  `floor-system-match.ts`, `bound-floor-system-match.ts`,
  `impact-lane.ts`, `floor-system-ratings.ts`,
  `calculate-assembly.ts`, `impact-result-panel.tsx`, and
  `simple-workbench-evidence.ts` as inspected surfaces. After the
  closeout file is created, add it to
  `tools/dev/run-calculator-current-gate.ts`; otherwise the selected
  active closeout can be absent from the current-gate runner.
- second follow-up 2026-05-04 preflight:
  `gate_b_preflight_exact_bound_fixture_map`,
  `gate_b_plus_2mm_inside_plus_2p1mm_outside_boundary`,
  `direct_floor_system_id_bypass_is_not_layer_match_promotion`,
  `field_context_warning_copy_not_field_metric_promotion`,
  `gate_b_validation_order_engine_contract_then_runner_then_current_gate`,
  and
  `web_visible_changes_deferred_until_gate_b_selects_bounded_fix`.
  Gate B should start from `tuas_x3_clt140_measured_2026` exact
  `base_structure` and `ubiq_fl33_open_web_steel_300_lab_2026`
  bound-only `base_structure`: `+2 mm` stays inside tolerance, `+2.1 mm`
  must drop out of the exact/bound source lane. Keep raw
  `tuas_x4_clt140_measured_2026` and raw
  `tuas_r7b_open_box_timber_measured_2026` as prompt/duplicate-role
  negative controls. Treat direct `officialFloorSystemId` resolution as
  a known-id bypass, not layer-match proof; treat field-context warnings
  as visible-copy evidence, not new field source ownership.
- latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md`
  lands `floor_tolerance_edge_promotion_guard_v1` Gate A no-runtime
  with
  `floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`.
  It pins exact/bound floor tolerance-edge behavior, raw-role and
  duplicate-role negative boundaries, hostile API/import fail-closed
  behavior, and visible support wording requirements, then selects
  `packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`
  with `gate_b_no_runtime_closeout_and_next_slice_selection`.
  Validation completed on 2026-05-04: focused Gate A 1 file / 7
  tests, continuity with v18 / common-combination Gate C / Gate B /
  Gate A / floor raw-role Gate C / route-family lane-drift Gate E /
  Gate F / route-source risk register 9 files / 64 tests, `pnpm
  calculator:gate:current` engine 235 files / 1349 tests, web 49 files
  / 234 passed + 18 skipped, repo build 5 / 5 successful with known
  non-fatal `sharp/@img` warnings, `apps/web/next-env.d.ts` restored
  to `.next-typecheck`, and final `git diff --check` passed.
- latest general revalidation:
  a 2026-05-04 broad `pnpm check` pass caught non-runtime strictness
  drift before commit: several new contract callbacks needed explicit
  `warning: string` annotations, the triple-leaf frequency solver needed
  nullish defaults for already-required grouped topology fields, and
  `dynamic-airborne-order-sensitivity` still expected the old unsafe
  double-leaf promotion for lightweight flat-list triple-leaf swaps.
  The current correct behavior is low-confidence
  `multileaf_screening_blend_fail_closed_until_grouped_topology` with a
  flat-list adjacent-swap guard warning until grouped topology and
  source validation exist.
- follow-up broad audit:
  `broad_check_2026_05_04_toolbar_copy_alignment_passed`,
  `full_check_found_toolbar_copy_test_drift_not_calculator_runtime_drift`,
  `wrong_lane_broad_suites_green_no_runtime_movement_selected`,
  `gate_b_closeout_remains_first_implementation_step_after_broad_check`,
  and `rockwool_uris_status_unchanged_after_broad_check`.
  Full `pnpm check` passed after updating the toolbar test to current
  commands `Report` and `PDF setup` while confirming `Example Stack`
  is absent; this was UI-copy drift, not
  calculator runtime drift. Engine passed 368 files / 2170 tests; web
  passed 161 files / 907 passed + 18 skipped; build passed 5 / 5 with
  known non-fatal `sharp/@img` warnings. Wrong-lane suites remained
  green across dynamic family-boundary scans, deep hybrid and AAC swap
  scans, floor order/duplicate/many-layer histories, raw floor role and
  hostile-input guards, wall flat-list multileaf guards, grouped-topology
  route cards, and wall reorder invariance. Historical note: this audit
  happened before Gate B existed. Gate B has since landed no-runtime and
  selected v19. Rockwool/Uris `Rw 41` remains unfixed screening output.
- follow-up planning cross-check:
  `gate_b_implementation_cross_check_passed`,
  `gate_b_file_absent_runner_absent_by_design_until_creation`,
  `gate_a_fixture_ids_verified_in_catalog_and_existing_tests`,
  `packed_same_role_merge_safe_but_split_single_entry_schedules_blocked`,
  `official_floor_system_id_bypass_must_not_seed_layer_match_proof`,
  `gate_b_no_external_research_needed_until_source_acquisition_selected`,
  `gate_b_next_steps_order_contract_runner_current_gate_then_rerank`,
  and `targeted_gate_a_v18_risk_register_validation_green`.
  Historical note: this cross-check is now consumed by the landed Gate
  B closeout. Gate A fixture ids exist in the catalogs and already pin
  `+2 mm` / `+2.1 mm` exact and bound behavior. Keep packed same-role
  equivalents separate from split or disjoint duplicate schedules; keep
  direct `officialFloorSystemId` lookup as a known-row bypass, not
  layer-match proof. No internet/source research is selected before v19
  chooses source acquisition or a rights-safe packet appears. Targeted
  planning validation passed 3 files / 21 tests plus `git diff --check`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v18` Gate A no-runtime with
  `selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed`.
  It consumes `common_combination_gate_b_reprobe_summary`,
  `sentinel_guard_green_and_fail_closed_boundary_carry_forward`,
  `post_sentinel_source_ready_runtime_candidate_rerank`,
  `rockwool_uris_2006_source_packet_status`, and
  `floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`.
  It selects `floor_tolerance_edge_promotion_guard_v1` and
  `packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`
  with `gate_a_inventory_exact_floor_tolerance_edges_no_runtime`.
  Validation completed on 2026-05-04: focused v18 Gate A 1 file / 9
  tests, continuity with common-combination Gate C / Gate B / Gate A /
  v17 / floor raw-role Gate C / route-family lane-drift Gate E / Gate
  F / route-source risk register 9 files / 67 tests, `pnpm
  calculator:gate:current` engine 234 files / 1342 tests, web 49 files
  / 234 passed + 18 skipped, repo build 5 / 5 successful with known
  non-fatal `sharp/@img` warnings, `apps/web/next-env.d.ts` restored
  to `.next-typecheck`, and final `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `common_combination_lane_misclassification_sentinel_v1`
  no-runtime with
  `closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18`.
  It selects `calculator_source_gap_revalidation_v18` and
  `packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout`.
  Validation completed on 2026-05-04: focused Gate C closeout 1 file /
  6 tests, continuity with Gate A / Gate B / v17 / floor raw-role Gate
  C / route-family lane-drift Gate E / Gate F / route-source risk
  register 8 files / 58 tests, `pnpm calculator:gate:current` engine
  233 files / 1333 tests, web 49 files / 234 passed + 18 skipped, repo
  build 5 / 5 successful with known non-fatal `sharp/@img` warnings,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and final
  `git diff --check` passed.
- just closed slice:
  `common_combination_lane_misclassification_sentinel_v1`.
  Gate C closed it no-runtime and selected
  `calculator_source_gap_revalidation_v18` with
  `packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`.
  Gate B already landed
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`
  with
  `gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`
  and
  `common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice`.
  It produced `gate_b_reprobe_findings` for
  `split_rockwool_grouped_rw41_blocked_source_packet`,
  `split_rockwool_flat_swap_fail_closed_guard_green`,
  `classic_framed_adjacent_swap_fail_closed_guard_green`,
  `aac_board_fill_gap_lined_massive_boundary_documented_fail_closed`,
  `duplicate_many_layer_classic_stack_finite_watch`,
  `raw_floor_open_box_parity_green`,
  `raw_floor_clt_role_prompt_guard_green`,
  `near_source_alias_context_only_watch`,
  `field_output_copy_leakage_watch`,
  `hostile_api_import_fail_closed_green`, and
  `curve_digitization_provenance_blocked_source_qc`. It made no runtime,
  source, value, support, confidence, evidence, API, route-card,
  output-card, proposal/report, or workbench-input movement.
  Gate A already landed
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`
  with
  `common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`.
  It produced `frequent_wall_floor_combination_inventory`,
  `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`,
  `small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`,
  `note_test_document_or_easy_fix_decision_log`,
  `paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`,
  and `next_closeout_or_bounded_easy_fix_decision`. Gate C keeps
  Gate B's findings active for v18; any later runtime move still needs
  a small bounded fix or source-ready row with paired engine and
  web-visible regression tests. It must keep
  `frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk`,
  `easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests`,
  `paused_waiting_rights_safe_source_packet`,
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  and `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  active.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md`
  lands the common-combination sentinel Gate B no-runtime reprobes. It
  confirms grouped split-rockwool remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, not source validated, and still
  blocked by `paused_waiting_rights_safe_source_packet`; split-rockwool
  and classic framed flat-list swaps are guard-green under
  `multileaf_screening_blend_fail_closed_until_grouped_topology`;
  AAC / board / fill / gap lined-massive boundary drift remains
  documented fail-closed risk; raw floor parity/prompt, near-source
  alias, field-output leakage, hostile input, and curve provenance
  remain sentinel rows. It selects
  `packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime`.
  Validation completed on 2026-05-04: focused Gate B 1 file / 9 tests,
  continuity with Gate A / v17 / floor raw-role Gate C / route-family
  lane-drift Gate E / Gate F / route-source risk register 7 files / 52
  tests, `pnpm calculator:gate:current` engine 232 files / 1327 tests,
  web 49 files / 234 passed + 18 skipped, repo build 5 / 5 successful
  with known non-fatal `sharp/@img` warnings, `apps/web/next-env.d.ts`
  restored to `.next-typecheck`, and final `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md`
  lands the common-combination sentinel Gate A no-runtime inventory.
  It pins frequent wall/floor wrong-lane snapshots, confirms grouped
  split-rockwool remains low-confidence `multileaf_screening_blend`,
  `Rw 41` and not source validated, keeps hostile inputs fail-closed,
  carries `raw_floor_role_inference`, and selects
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`
  with
  `gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`.
  Validation completed on 2026-05-04: focused Gate A 1 file / 8 tests,
  continuity 6 files / 43 tests, `pnpm calculator:gate:current` engine
  231 files / 1318 tests, web 49 files / 234 passed + 18 skipped, repo
  build 5 / 5 successful with known non-fatal `sharp/@img` warnings,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and final
  `git diff --check` passed.
- latest source-gap checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v17` Gate A with
  `selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring`.
  It selects
  `common_combination_lane_misclassification_sentinel_v1` and
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`.
  This gate does not move runtime, support, confidence, evidence, API,
  route-card, output-card, proposal/report, or workbench-input behavior.
  Validation completed on 2026-05-03: focused v17 Gate A 1 file / 10
  tests, continuity with floor raw-role Gate C / Gate B / Gate A, v16,
  lane-drift Gate E / Gate F, and the route-source risk register 8
  files / 59 tests, `pnpm calculator:gate:current` engine 230 files /
  1310 tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed. `apps/web/next-env.d.ts` was restored to
  `.next-typecheck`.
- paused user-defect slice:
  `wall_triple_leaf_accuracy_recovery_v1` is paused at Gate T on
  `paused_waiting_rights_safe_source_packet`. Do not present the
  split-rockwool `Rw 41` screening answer as fixed, correct, or
  source-validated.
- focused user-defect handoff:
  `docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md`
  explains the rockwool placement / flat-list ambiguity symptom, why it
  is a real triple-leaf modeling/input defect rather than simple user
  error, why the current `Rw 41` screening answer must not be presented
  as fixed/correct, why the Uris 2006 lane is paused at Gate T, and
  what source/mapping/topology/test owners must still prove before any
  runtime movement.
- active adjacent-risk register:
  `docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md`
  tracks flat-list route-family flips, duplicate/many-layer drift,
  masonry / lined-massive boundary drift, raw floor role inference,
  near-source false promotion, field-output leakage, material
  alias/coalescing, hostile API input, and curve provenance. Gate P and
  later runtime-promotion work must keep these risks fail-closed or
  explicitly tested.
- standing route/source-lane monitoring mandate:
  `standing_lane_misclassification_monitoring_mandate`.
  Every future calculator slice must keep looking for wrong route-family
  or source-lane behavior on frequent wall/floor stacks. If a stack
  drops into the wrong lane, jumps after a small layer edit, promotes a
  near-source row as exact, leaks field metrics, or returns an absurd
  value, use `note_test_document_or_easy_fix`: reproduce it with a
  focused test, fix it when the fix is bounded, or document it and keep
  output fail-closed.
- prior source-gap decision:
  `packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`
  ran
  `gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`
  after Gate C landed
  `floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`.
  Gate C keeps role-tagged exact floors as the promoted path, keeps
  raw-parity green controls bounded with visible copy that
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`,
  and now surfaces
  `raw_tagged_drift_requires_floor_role_prompt`,
  `raw_no_safe_inference_requires_floor_role_prompt`, and
  `duplicate_single_entry_role_requires_floor_role_prompt` before exact
  floor-family promotion. Gate C proved
  `paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`.
  `raw_floor_role_inference` stays guarded, and
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  remains an active boundary for source-gap revalidation v17.
- latest checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md`
  lands `floor_raw_role_inference_guardrail_v1` Gate C with
  `floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`.
  It closes the prior Gate B selection action
  `gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`.
  It adds
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`
  and
  `apps/web/features/workbench/floor-raw-role-prompt-guard-route-card.test.ts`,
  keeps runtime import/support/confidence/evidence/API/output support/
  proposal/workbench-input behavior frozen while moving bounded
  route/output warning copy,
  confirms Uris 2006 remains `paused_waiting_rights_safe_source_packet`,
  keeps the Gate E guard
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  keeps `standing_lane_misclassification_monitoring_mandate` and
  `note_test_document_or_easy_fix` active, and
  selects
  `packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`.
  Required floor boundary:
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
  Prompt boundaries:
  `raw_tagged_drift_requires_floor_role_prompt`,
  `raw_no_safe_inference_requires_floor_role_prompt`,
  `duplicate_single_entry_role_requires_floor_role_prompt`, and
  `paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`.
  Gate C validation completed on 2026-05-03: focused Gate C engine 1
  file / 9 tests, focused Gate C web 1 file / 4 tests, engine
  continuity 7 files / 30 tests, web continuity 4 files / 7 tests,
  Dataholz CLT / lane-drift raw-tagged warning regression continuity 3
  files / 24 tests, `pnpm calculator:gate:current` engine 229 files /
  1300 tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed. `apps/web/next-env.d.ts` was restored to
  `.next-typecheck`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md`
  lands `floor_raw_role_inference_guardrail_v1` Gate B with
  `floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation`.
  It adds
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`
  and closes
  `gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md`
  lands `floor_raw_role_inference_guardrail_v1` Gate A with
  `floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design`.
  It adds
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`.
  It selects
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`
  with
  `gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`.
  Gate A validation completed on 2026-05-03: focused floor raw-role Gate
  A 1 file / 7 tests; continuity with v16 Gate A, floor-library raw
  parity, raw-floor inferred split parity, floor order invariance/edit
  stability, raw-floor hostile input, and route-source risk register 8
  files / 39 tests; `pnpm calculator:gate:current` engine 227 files /
  1284 tests, web 48 files / 230 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v16` with
  `selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk`.
  It adds
  `packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`
  and selects `floor_raw_role_inference_guardrail_v1`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md`
  closes `route_family_lane_drift_common_stack_watchlist_v1` with
  `closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16`.
  It adds
  `packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`,
  keeps the Gate E guard
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  confirms no runtime import/support/confidence/evidence/API/output
  support/proposal/workbench-input promotion, keeps the original
  rockwool triple-leaf exact calculation blocked on
  `paused_waiting_rights_safe_source_packet`, and selects
  `calculator_source_gap_revalidation_v16` with
  `packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`.
  Gate F is the closeout selected by Gate E:
  `packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`
  with
  `gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing`
  after Gate E status
  `common_stack_lane_drift_flat_list_guard_runtime_landed_selected_gate_f_closeout_next_slice`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate E with
  bounded runtime movement. It adds
  `packages/engine/src/dynamic-airborne-flat-list-multileaf-guard.ts`,
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`,
  and
  `apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts`.
  The guard keeps ambiguous swapped flat-list multileaf walls on
  low-confidence `multileaf_multicavity`
  `multileaf_screening_blend_fail_closed_until_grouped_topology` rather
  than overconfident `double_leaf`. Positive proofs include
  `engine_split_rockwool_swapped_flat_list_holds_multileaf_fail_closed`
  and `engine_classic_swapped_flat_list_holds_multileaf_fail_closed`.
  Visible proofs include
  `web_route_card_shows_fail_closed_multileaf_screening_not_exact` and
  `web_output_card_does_not_promote_rw_prime_or_dntw_as_exact`.
  Negative boundaries still include `ordinary_double_leaf_negative_boundary`
  and `lined_massive_boundary_hold_negative_boundary`. Runtime moved
  only for the guarded wrong-lane flat-list cases; source/evidence/
  confidence/API/workbench-input promotion did not move. The standing
  `standing_lane_misclassification_monitoring_mandate` and
  `note_test_document_or_easy_fix` rule stay active.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate D
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`,
  designs `flat_list_adjacent_swap_sensitivity_probe`, keeps the future
  target fail-closed on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`, proves
  `ordinary_double_leaf_negative_boundary`,
  `lined_massive_boundary_hold_negative_boundary`,
  `paired_engine_and_web_visible_tests_before_runtime`, plus simple
  stud / grouped topology / duplicate / floor / near-source /
  field-output boundaries, keeps
  runtime and visible behavior frozen, and selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`
  with
  `gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`
  and
  `common_stack_lane_drift_flat_list_guard_design_landed_no_runtime_selected_gate_e_implementation`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate C
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`,
  classifies `split_rockwool_flat_swap_3_4_wrong_lane_reproduced` and
  `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced` as
  `bounded_fix_candidate`, classifies
  `heavy_multileaf_lined_massive_boundary_reproduced` as
  `negative_boundary_for_fix`, keeps duplicate/many-layer, raw floor,
  near-source alias, field-output, hostile-input, and curve provenance
  findings no-runtime, and selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`
  with
  `gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`
  and
  `common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate B
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`,
  reproduces the split-rockwool flat-list wrong-lane jump
  `split_rockwool_flat_swap_3_4_wrong_lane_reproduced` (`Rw 41`
  low-confidence `multileaf_screening_blend` -> `Rw 51`
  medium-confidence `double_leaf`), the ordinary framed-wall jump
  `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced` (`Rw 32`
  -> `Rw 44`), and the masonry / lined-massive boundary jump
  `heavy_multileaf_lined_massive_boundary_reproduced` (`Rw 39` ->
  `Rw 49`). Duplicate stacks remain finite but watchlisted; known raw
  floor role inference stays green; near-source gypsum alias, field
  output, hostile input, and curve provenance risks remain no-runtime.
  Runtime and visible surfaces remain frozen. It selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`
  with
  `gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`
  and
  `common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md`
  lands `route_family_lane_drift_common_stack_watchlist_v1` Gate A
  no-runtime. It adds
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`,
  inventories nine common route/source-lane risk classes, pins live
  snapshots for split-rockwool `Rw 41` `multileaf_screening_blend`,
  classic triple-leaf to double-leaf reorder (`Rw 32` -> `Rw 44`),
  heavy multileaf to lined-massive boundary (`Rw 39` -> `Rw 49`), raw
  floor role parity, and hostile input fail-closed behavior. Runtime and
  visible surfaces remain frozen. It selects
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`
  with
  `gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`
  and
  `common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v15` Gate A no-runtime. It
  adds
  `packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`,
  keeps every source/runtime candidate fail-closed, keeps the Uris 2006
  source lane paused on `paused_waiting_rights_safe_source_packet`,
  keeps the split-rockwool `Rw 41` `multileaf_screening_blend` answer
  not fixed, creates the
  `standing_lane_misclassification_monitoring_mandate`, and selects
  `route_family_lane_drift_common_stack_watchlist_v1` with
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`
  and
  `gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`.
  Gate A status:
  `selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors`.
  Selected planning surface:
  `docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands `certainteed_silentfx_nrc_astc_source_pack_extraction_v1` Gate
  C no-runtime closeout. It adds
  `packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  keeps
  `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018`,
  `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`, and
  `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`
  context-only because ASTC / field / flanking metric policy, product
  `STC` -> `Rw` policy, rights-safe OneSource payload, SilentFX /
  Type X material mapping, tolerance ownership, exact live topology,
  and paired visible tests remain missing. It keeps the split-rockwool
  `Rw 41` `multileaf_screening_blend` answer not fixed, keeps every
  runtime and visible surface frozen, closes the source pack
  no-runtime, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`.
  Gate C status:
  `closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row`.
  Selected v15 slice:
  `calculator_source_gap_revalidation_v15`.
  Selected v15 planning surface:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md`.
  Prior Gate C file:
  `packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`.
  Gate B status:
  `certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Gate B action:
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Prior Gate A file:
  `packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`.
  Prior Gate A status:
  `certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Gate A status:
  `certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Gate A action:
  `gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`.
  Source label:
  CertainTeed SilentFX NRC ASTC.
  Selected planning surface:
  `docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`.
  Source locators:
  `https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb`,
  `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`,
  `https://www.certainteed.com/acoustic-gypsum-board`, and
  `https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall`.
  Protected boundaries:
  `certainteed_nrc_astc_high_rise_examples_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_ctg_2481_u465_stc57_product_row_does_not_replace_existing_lsf_or_generic_gypsum_routes`,
  `certainteed_ctg_2481_u309_stc51_product_row_does_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw`,
  `certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests`,
  `silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner`,
  `certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result`,
  `certainteed_ctg_2481_onesource_login_redirect_blocks_current_product_pdf_payload_runtime_claim`,
  and
  `certainteed_astc_and_stc_context_does_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_or_knauf_rows`.
  Gate B protected boundaries:
  `certainteed_gate_b_source_rows_are_not_runtime_import_approval`,
  `certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`,
  `certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance`,
  `certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion`,
  `certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`,
  `certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes`,
  `certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors`,
  `certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases`,
  and
  `certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload`.
  Material alias tokens:
  `silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`,
  `certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy`,
  `certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping`,
  `nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors`,
  `astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs`,
  and
  `silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route`.
  Prior v14 planning surface:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md`.
  Prior v14 slice:
  `calculator_source_gap_revalidation_v14`.
  Prior v14 file:
  `packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`.
  Prior v14 status:
  `selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`.
  Prior PABCO Gate C status:
  `closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands CertainTeed Gate A no-runtime and selects Gate B mapping /
  tolerance decision.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands `pabco_quietrock_sound_design_guide_source_pack_extraction_v1`
  Gate B no-runtime. It adds
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`,
  keeps all six PABCO / QuietRock rows context-only, blocks `STC`,
  report locators, field outputs, material aliases, family-boundary
  flips, and tolerance claims from runtime promotion, keeps the
  split-rockwool `Rw 41` `multileaf_screening_blend` answer not fixed,
  keeps every runtime and visible surface frozen, and selects
  `packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Gate B status:
  `pabco_gate_b_found_no_runtime_ready_row_selected_closeout`.
  PABCO Gate B row boundaries:
  `pabco_pgd_w_646_16_gate_b_stc41_does_not_replace_existing_timber_or_generic_wood_stud_routes`,
  `pabco_pgd_w_445_16_gate_b_resilient_channel_stc57_does_not_promote_dyn_echo_rw_or_generic_resilient_bar`,
  `pabco_pgd_w_449_24_gate_b_indexed_locator_missing_payload_blocks_runtime_and_confidence_promotion`,
  `pabco_pgd_68_534_16_gate_b_68mil_steel_resilient_channel_row_does_not_replace_lsf_anchors`,
  `pabco_pgd_546_407_16_gate_b_stc60_does_not_promote_field_outputs_or_existing_lsf_anchors`,
  and
  `pabco_pgd_w6_467_24_gate_b_quietrock_530_row_does_not_promote_generic_wood_stud_route`.
  PABCO Gate B protected boundaries:
  `pabco_gate_b_source_rows_are_not_runtime_import_approval`,
  `pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`,
  `pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006`,
  `pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes`,
  `pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import`,
  `pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`,
  `pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes`,
  `pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors`,
  `pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes`,
  `pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes`,
  `pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay`,
  `pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-03: focused PABCO Gate B 1 file / 8
  tests, PABCO Gate B / Gate A / post-Georgia-Pacific / v13 /
  route-source risk continuity 5 files / 36 tests,
  `pnpm calculator:gate:current` engine 213 files / 1175 tests, web 47
  files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, whitespace guard passed,
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect, and `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands `pabco_quietrock_sound_design_guide_source_pack_extraction_v1`
  Gate A no-runtime. It adds
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`,
  source label: PABCO Gypsum / QuietRock Sound Design Guide and Sound
  Assembly Tool.
  extracts `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730`,
  `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745`,
  `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`,
  `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`,
  `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`,
  and `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053`
  from PABCO row locators, keeps `STC` and report numbers
  context-only, keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer not fixed, keeps every runtime
  and visible surface frozen, and selects
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`
  with
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `pabco_quietrock_sound_design_guide_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Selected planning surface:
  `docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`.
  PABCO source locators:
  `https://go.pabcogypsum.com/tsdg` and
  `https://quietrock.com/resources/sound-control-assembly-selector/`.
  PABCO row boundaries:
  `pabco_pgd_w_646_16_stc41_does_not_replace_generic_wood_stud_or_quietrock_runtime_route`,
  `pabco_pgd_w_445_16_stc57_resilient_channel_context_does_not_promote_dyn_echo_rw_or_field_outputs`,
  `pabco_pgd_w_449_24_indexed_locator_is_not_runtime_truth_until_payload_is_retrieved`,
  `pabco_pgd_68_534_16_68mil_steel_stud_row_does_not_replace_existing_lsf_anchors`,
  `pabco_pgd_546_407_16_stc60_is_not_a_dyn_echo_field_or_lsf_runtime_anchor`,
  and
  `pabco_pgd_w6_467_24_quietrock_530_row_does_not_promote_generic_wood_stud_route`.
  PABCO protected boundaries:
  `pabco_quietrock_stc_row_pages_do_not_promote_dyn_echo_rw_or_field_outputs_without_metric_policy`,
  `quietrock_es_510_530_545_and_generic_pabco_type_x_do_not_coalesce_with_generic_gypsum_or_mlv_without_material_mapping`,
  `pabco_single_staggered_double_stud_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `pabco_glass_fiber_wood_steel_rc_rows_do_not_reopen_closed_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_or_knauf_decisions`,
  `pabco_summary_report_download_links_are_not_runtime_truth_until_payloads_are_retrieved_and_curve_or_metric_policy_is_owned`,
  `pabco_pgd_w_449_24_indexed_locator_requires_fresh_payload_before_runtime_or_confidence_promotion`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-03: focused PABCO Gate A 1 file / 8
  tests, continuity 21 files / 150 tests, current gate engine
  212 files / 1167 tests, web 47 files / 227 passed + 18 skipped,
  build 5 / 5 with known non-fatal `sharp/@img` warnings, whitespace
  guard clean, `apps/web/next-env.d.ts` restored to `.next-typecheck`
  after the build side-effect, and `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
  lands `calculator_post_georgia_pacific_source_acquisition_v1` Gate A
  no-runtime. It adds
  `packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`,
  source label: post-Georgia-Pacific source acquisition.
  ranks PABCO Gypsum / QuietRock, CertainTeed SilentFX / NRC ASTC,
  Gypsum Association GA-600, and the closed official locator chain,
  keeps the split-rockwool `Rw 41` `multileaf_screening_blend` answer
  not fixed, keeps every runtime and visible surface frozen, and
  selects
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`
  with
  `gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`.
  Gate A status:
  `selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import`.
  Validation completed on 2026-05-02: focused post-Georgia-Pacific
  Gate A 1 file / 8 tests, continuity 20 files / 142 tests, current
  gate engine 211 files / 1159 tests, web 47 files / 227 passed + 18
  skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings, and
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v13` Gate A no-runtime. It
  adds
  `packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`,
  re-ranks the backlog after Georgia-Pacific Gate C, keeps the
  split-rockwool `Rw 41` `multileaf_screening_blend` answer not fixed,
  keeps every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`
  with
  `gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`.
  Gate A status:
  `selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime`.
  Selected planning surface:
  `docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md`.
  Validation completed on 2026-05-02: focused v13 Gate A 1 file / 8
  tests, route-source risk register 1 file / 4 tests, continuity
  19 files / 134 tests, current gate engine 210 files / 1151 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, whitespace guard passed,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and
  `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands Georgia-Pacific Fire & Sound Assemblies source-pack extraction
  Gate C closeout no-runtime. It adds
  `packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes
  `georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1`
  after Gate B found no runtime-ready row, keeps the split-rockwool
  `Rw 41` `multileaf_screening_blend` answer not fixed, keeps every
  runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout`.
  Gate C status:
  `closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`.
  Selected v13 planning surface:
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md`.
  Validation completed on 2026-05-02: focused Gate C closeout 1 file /
  7 tests, route-source risk register 1 file / 4 tests, continuity
  18 files / 126 tests, current gate engine 209 files / 1143 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, whitespace guard passed,
  `apps/web/next-env.d.ts` restored to `.next-typecheck`, and
  `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands Georgia-Pacific Fire & Sound Assemblies source-pack extraction
  Gate B no-runtime. It adds
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`,
  keeps `GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103`,
  `GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331`,
  `GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761`,
  and `GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363`
  context-only because actual directory/report payloads, metric policy,
  local material/topology mapping, tolerance owners, and paired visible
  tests remain missing. It keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer not fixed, selects
  `packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`, and
  records `georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Protected Gate B boundaries:
  `georgia_pacific_gate_b_actual_directory_or_test_report_payload_missing_blocks_runtime_import`,
  `georgia_pacific_gate_b_source_rows_are_not_runtime_import_approval`,
  `georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `georgia_pacific_gate_b_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`,
  `georgia_pacific_gate_b_exterior_sheathing_shaftliner_area_separation_and_stairwell_rows_do_not_promote_generic_wall_routes`,
  `georgia_pacific_gate_b_rows_do_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`,
  `georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`, and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-02: focused Gate B 1 file / 7
  tests, continuity 17 files / 119 tests, current gate engine 208
  files / 1136 tests, web 47 files / 227 passed + 18 skipped, build
  5 / 5 with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands Georgia-Pacific Fire & Sound Assemblies source-pack extraction
  Gate A no-runtime. It adds
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`,
  captures the official planning page plus ToughRock / DensGlass /
  DensGlass Shaftliner guide rows, keeps `STC` ranges/values and
  sound-report locators context-only, protects DensGlass / ToughRock /
  SoundBreak / generic gypsum alias boundaries, keeps the
  split-rockwool `Rw 41` `multileaf_screening_blend` answer not fixed,
  and selects
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime` and
  `georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Validation completed on 2026-05-02: focused Gate A 1 file / 8
  tests, continuity 16 files / 112 tests, current gate engine 207
  files / 1129 tests, web 47 files / 227 passed + 18 skipped, build
  5 / 5 with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v12` Gate A no-runtime. It
  adds
  `packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`,
  re-ranks Georgia-Pacific, the paused Uris 2006 lane, closed National
  Gypsum / USG / ROCKWOOL / British Gypsum / Knauf rows, CLT / floor /
  no-stud / lined-heavy followups, and historical blockers, keeps every
  candidate `runtimeImportReadyNow: false`, keeps the split-rockwool
  `Rw 41` `multileaf_screening_blend` answer paused and not fixed, and
  selects
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  with
  `gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import`
  and
  `selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import`.
  Validation completed on 2026-05-02: focused v12 Gate A 1 file / 8
  tests, continuity 15 files / 104 tests, current gate engine 206
  files / 1121 tests, web 47 files / 227 passed + 18 skipped, build
  5 / 5 with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands National Gypsum Fire & Sound Assembly Selector source-pack
  extraction Gate C closeout no-runtime. It adds
  `packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes the National Gypsum selector pack after Gate B found no
  runtime-ready row, keeps representative `V438`, `W419`, `W469`,
  `W454`, and `P540` rows context-only, keeps STC/report/STC-N-A
  context out of runtime, keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed,
  keeps every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`.
  Gate C status:
  `closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row`.
  Closed National Gypsum slice:
  `national_gypsum_fire_sound_selector_source_pack_extraction_v1`.
  Validation completed on 2026-05-02: focused National Gypsum Gate C
  closeout 1 file / 7 tests; continuity 14 files / 96 tests; current
  gate engine 205 files / 1113 tests, web 47 files / 227 passed + 18
  skipped, build 5 / 5 with known non-fatal sharp/@img warnings and
  whitespace guard passed; `apps/web/next-env.d.ts` restored to
  `.next-typecheck`; `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands National Gypsum Fire & Sound Assembly Selector source-pack extraction
  Gate B no-runtime. It adds
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`,
  keeps representative selector rows
  `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`,
  `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`,
  `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`,
  `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`, and
  `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA` context-only because
  exact report payloads, one-third-octave curves, metric owners, local
  material/topology mapping, tolerance owners, and paired visible tests
  are missing. It keeps STC/report locator context out of runtime,
  keeps the split-rockwool `Rw 41` `multileaf_screening_blend` answer
  low-confidence and not fixed, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Gate B status:
  `national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Protected Gate B boundaries:
  `national_gypsum_gate_b_source_rows_are_not_runtime_import_approval`,
  `national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv`,
  `national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool`,
  `national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes`,
  `national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`, and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-02: focused National Gypsum Gate B 1
  file / 7 tests; continuity 13 files / 89 tests; current gate engine
  204 files / 1106 tests, web 47 files / 227 passed + 18 skipped,
  build 5 / 5 with known non-fatal sharp/@img warnings and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`;
  `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands National Gypsum Fire & Sound Assembly Selector source-pack extraction
  Gate A no-runtime. It adds
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`,
  extracts representative selector rows, keeps STC/report locator
  context out of runtime, and selects
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md`
  lands source-gap revalidation v11 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`,
  keeps closed USG / ROCKWOOL / British Gypsum / Knauf rows context-only,
  keeps the Uris 2006 lane paused on
  `paused_waiting_rights_safe_source_packet`, keeps the original
  split-rockwool `Rw 41` `multileaf_screening_blend` answer
  low-confidence and not fixed, keeps every runtime and visible surface
  frozen, closes `calculator_source_gap_revalidation_v11`, and selects
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`
  with
  `selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`.
  The selected action is
  `gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`.
  Validation completed on 2026-05-02: focused v11 Gate A 1 file / 8
  tests; continuity 11 files / 76 tests; current gate engine 202 files /
  1093 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; `git diff --check`
  passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  closes USG Acoustical Assemblies source-pack extraction no-runtime. It
  adds
  `packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  carries forward the USG Gate B row blockers for
  `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8`, keeps `STC` / `IIC` / range / test-number
  context out of runtime, keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed, and
  selects
  `packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`.
  Gate C status:
  `closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`.
  Validation completed on 2026-05-02: focused USG Gate C 1 file / 7
  tests; continuity 10 files / 68 tests; current gate engine 201 files /
  1085 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck`; `git diff --check` passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands USG Acoustical Assemblies source-pack extraction Gate B
  no-runtime. It adds
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`,
  keeps `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8` context-only, blocks `STC` / `IIC` / range /
  test-number over-read, protects
  `usg_gate_b_source_rows_are_not_runtime_import_approval`,
  `usg_gate_b_stc_iic_test_numbers_do_not_promote_dyn_echo_rw_lnw_or_field_outputs`,
  `usg_gate_b_levelrock_srm_srb_i_joist_truss_do_not_promote_generated_floor_or_wall_routes`,
  `usg_gate_b_floor_rows_do_not_override_exact_or_bound_floor_catalog_without_mapping_tolerance`,
  `usg_gate_b_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `usg_gate_b_sheetrock_thermafiber_rc_channel_do_not_coalesce_with_generic_gypsum_rockwool_glass_fiber_or_resilient_bar`,
  `usg_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`;
  keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed; and
  selects
  `packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`. Gate B
  status: `usg_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Validation completed on 2026-05-02: focused USG Gate B 1 file / 7
  tests; continuity 9 files / 61 tests; current gate engine 200 files /
  1078 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck` after the build side-effect; whitespace
  guard passed through `pnpm calculator:gate:current`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands USG Acoustical Assemblies source-pack extraction Gate A
  no-runtime. It adds
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`,
  extracts `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8` from the official USG SA200 locator
  `https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`;
  keeps `STC`, `IIC`, ranges, and test numbers source-context only;
  protects
  `usg_stc_iic_rows_do_not_directly_promote_dyn_echo_rw_lnw_or_field_outputs`,
  `usg_floor_ceiling_rows_do_not_become_wall_or_triple_leaf_truth`,
  `usg_levelrock_srm_srb_i_joist_truss_rows_do_not_promote_generated_floor_without_mapping_tolerance`,
  `usg_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `usg_sheetrock_thermafiber_rows_do_not_coalesce_with_generic_gypsum_rockwool_or_glass_fiber_without_mapping`,
  `usg_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`;
  keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed; and
  selects
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`. Gate A status:
  `usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Validation completed on 2026-05-02: focused USG Gate A 1 file / 6
  tests; continuity 8 files / 54 tests; current gate engine 199 files /
  1071 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck` after the build side-effect; whitespace
  guard passed through `pnpm calculator:gate:current`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md`
  lands source-gap revalidation v10 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`,
  keeps ROCKWOOL `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05`
  closed as source context only, keeps the original split-rockwool
  `Rw 41` `multileaf_screening_blend` answer low-confidence and not
  fixed, keeps the Uris 2006 lane paused on
  `paused_waiting_rights_safe_source_packet`, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  in `usg_acoustical_assemblies_source_pack_extraction_v1`
  with
  `selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import`.
  The selected action is
  `gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import`.
  The selected plan is
  `docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`.
  The prior v10 action was
  `gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout`,
  selected by
  `closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`.
  Validation completed on 2026-05-02: focused v10 Gate A 1 file / 8
  tests; continuity 7 files / 48 tests; current gate engine 198 files /
  1065 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck` after the build side-effect; `git diff --check`
  passed.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate C
  closeout no-runtime. It adds
  `packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes `rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`,
  keeps `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05` as source
  context only, preserves AFB / Comfortbatt / Cavityrock material-alias
  boundaries, keeps the original split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not fixed, keeps
  every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`
  with
  `closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`.
  Validation completed on 2026-05-02: focused ROCKWOOL Gate C closeout
  1 file / 6 tests; ROCKWOOL Gate C / Gate B / Gate A /
  post-British-Gypsum acquisition / v9 / route-source-risk continuity 6
  files / 40 tests; current gate engine 197 files / 1057 tests, web 47
  files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
  `.next-typecheck` after the build side-effect, and `git diff --check`
  passed after docs-only validation-count updates.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate B
  no-runtime. It adds
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`,
  compares `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and `ESS-05` from
  the `ROCKWOOL Acoustic Wall Assemblies Catalog` against live
  topology/material/metric/tolerance/test requirements,
  keeps every row out of runtime import, blocks `STC` / `OITC` /
  report-number over-read, preserves AFB / Comfortbatt / Cavityrock
  material-alias boundaries, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `rockwool_gate_b_found_no_runtime_ready_row_selected_closeout`.
  The selected action is
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation completed on 2026-05-02: focused ROCKWOOL Gate B 1 file /
  8 tests; ROCKWOOL Gate B / Gate A / post-British-Gypsum acquisition /
  v9 / route-source-risk continuity 5 files / 34 tests; current gate
  engine 196 files / 1051 tests, web 47 files / 227 passed + 18
  skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the build
  side-effect, and `git diff --check` passed after docs-only
  validation-count updates.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate A
  no-runtime. It adds
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`,
  extracts representative `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and
  `ESS-05` source rows, keeps STC/OITC/report-number context out of
  DynEcho runtime metrics, blocks AFB / Comfortbatt / Cavityrock /
  local rockwool / glass-fiber coalescing, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with
  `rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  The selected action is `gate_b_mapping_tolerance_decision_no_runtime`.
  The prior post-British-Gypsum selection status was
  `selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import`,
  selected with
  `gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`.
  Validation completed on 2026-05-02: focused ROCKWOOL Gate A 1 file /
  6 tests; ROCKWOOL Gate A + post-BG continuity 7 files / 48 tests;
  current gate engine 195 files / 1043 tests, web 47 files / 227 passed
  + 18 skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings;
  `git diff --check` clean after restoring the build side-effect in
  `apps/web/next-env.d.ts`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_GATE_A_HANDOFF.md`
  lands calculator source-gap revalidation v9 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`,
  confirms the Uris 2006 triple-leaf lane remains paused on
  `paused_waiting_rights_safe_source_packet`, keeps British Gypsum and
  Knauf closeouts authoritative, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`
  with
  `selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime`.
  The selected next slice is
  `calculator_post_british_gypsum_source_acquisition_v1`; the selected
  action is
  `gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`.
  Validation completed on 2026-05-02: focused v9 Gate A 1 file / 8 tests,
  v9 / Gate C / Gate B / v8 continuity 4 files / 30 tests, and
  `pnpm calculator:gate:current` engine 192 files / 1025 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  lands British Gypsum White Book Gate C closeout no-runtime. It adds
  `packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`,
  closes `british_gypsum_white_book_source_pack_extraction_v1`, keeps
  the Gate B row boundaries for `C204006`, `C204003`, `A206A290`,
  `A046006`, `A326017B`, and `B226010`, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`
  with
  `closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row`.
  The selected next slice is `calculator_source_gap_revalidation_v9`;
  the selected action is
  `gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout`.
  Validation completed on 2026-05-02: focused Gate C 1 file / 6 tests,
  Gate C / Gate B / v8 continuity 3 files / 22 tests, and
  `pnpm calculator:gate:current` engine 191 files / 1017 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands British Gypsum White Book Gate B no-runtime. It adds
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`,
  keeps `C204006`, `C204003`, `A206A290`, `A326017B`, and `B226010`
  out of runtime import, keeps `A046006` as the already-landed exact
  timber anchor with no duplicate import, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with
  `british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`.
  The selected action is
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation is green on 2026-05-02: focused Gate B 1 file / 8 tests,
  Gate B / Gate A / v8 continuity 3 files / 24 tests, and
  `pnpm calculator:gate:current` engine 190 files / 1011 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_GATE_A_HANDOFF.md`
  lands calculator source-gap revalidation v8 no-runtime. It adds
  `packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
  and
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md`,
  confirms the Uris 2006 triple-leaf source lane remains paused on
  `paused_waiting_rights_safe_source_packet`, re-ranks the remaining
  source/accuracy backlog, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`
  with
  `selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping`.
  The selected action is `gate_b_mapping_tolerance_decision_no_runtime`.
  Validation is green on 2026-05-02: focused v8 1 file / 8 tests, v8
  / Gate T / British Gypsum Gate A continuity 3 files / 23 tests, and
  `pnpm calculator:gate:current` engine 189 files / 1003 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_T_HANDOFF.md`
  lands Gate T manual source-packet acquisition handoff no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff.ts`
  and
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts`,
  formalizes the acquisition checklist
  `authorized_source_file_or_tdm_payload`,
  `rights_and_storage_note`, `source_identity_metadata`,
  `page_figure_table_locator`, `curve_identity_map`,
  `band_vector_or_digitization_payload`,
  `rating_derivation_and_uncertainty`, and
  `chain_of_custody_review`, pauses the Uris 2006 source lane with
  `paused_waiting_rights_safe_source_packet`, keeps the split-rockwool
  answer frozen at low-confidence `multileaf_screening_blend` `Rw 41`,
  and selects
  `packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
  with
  `gate_t_paused_uris_2006_source_lane_no_runtime_selected_source_gap_revalidation_v8`.
  Validation is green on 2026-05-02: focused Gate T 1 file / 7 tests,
  Gate T/S/R/Q/P/O/N/M/K engine continuity 9 files / 63 tests, Gate J
  web continuity 1 file / 7 tests, and `pnpm calculator:gate:current`
  engine 188 files / 995 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_S_HANDOFF.md`
  lands Gate S source-packet availability no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-packet-availability.ts`
  and
  `packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`,
  confirms `rights_safe_packet_absent`, keeps Uris 2006 metadata as
  identity context only, keeps
  `tmp_nrc_2024_graph_digitization_packet` as an adjacent comparator
  rather than the primary packet, keeps user repro PDFs and unrelated
  local PDFs out of source evidence, keeps the split-rockwool answer
  frozen at low-confidence `multileaf_screening_blend` `Rw 41`, and
  selects
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts`
  with
  `gate_s_confirmed_no_rights_safe_uris_2006_packet_no_runtime_selected_manual_source_packet_handoff_gate_t`.
  Validation is green on 2026-05-02: focused Gate S 1 file / 7 tests,
  Gate S/R/Q/P/O/N/M/K engine continuity 8 files / 56 tests, Gate J web
  continuity 1 file / 7 tests, and `pnpm calculator:gate:current`
  engine 187 files / 988 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_R_HANDOFF.md`
  lands Gate R manual source-packet intake no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-manual-source-packet.ts` and
  `packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`,
  formalizes the required artifacts
  `rights_safe_source_file`, `source_locator_metadata`,
  `page_figure_table_locator`, `curve_identity_map`,
  `band_vector_or_digitization_payload`,
  `rating_derivation_and_uncertainty`, and
  `chain_of_custody_and_rights_note`, records that no source packet is
  currently provided, keeps digitization/runtime blocked, keeps the
  split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`
  with
  `gate_r_formalized_manual_source_packet_intake_no_runtime_selected_source_packet_availability_gate_s`.
  Validation is green on 2026-05-02: focused Gate R 1 file / 7 tests,
  Gate Q/P/O/N/M/K engine continuity 6 files / 42 tests, Gate J web
  continuity 1 file / 7 tests, and `pnpm calculator:gate:current`
  engine 186 files / 981 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_Q_HANDOFF.md`
  lands Gate Q source-access backlog and runtime-blocker revalidation
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-access-followup.ts` and
  `packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`,
  turns Uris 2006 source access into an ordered manual backlog, keeps
  source packet, digitization QC, local material/effect mapping, support
  topology, paired visible runtime tests, and Uris 2008 separate-lane
  work out of runtime, revalidates all Gate P blockers as still open,
  keeps the split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`
  with
  `gate_q_landed_source_access_backlog_and_blocker_revalidation_no_runtime_selected_manual_source_packet_gate_r`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_P_HANDOFF.md`
  lands Gate P source access or alternative measured-row acquisition
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-access.ts` and
  `packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`,
  keeps Uris 2006 as the primary source-access target but blocks
  authorized Elsevier/TDM, manual source-packet, local PDF/page-image,
  and public-summary paths from runtime because none provides
  source-owned one-third-octave curves/table data now. It classifies
  Uris 2008 perforated absorptive-facing data as accessible adjacent
  negative-boundary context, keeps Utley/Brekke/Vinokur as method
  context, rejects glazing rows, preserves the NRC 2024 comparator as
  non-runtime, keeps the split-rockwool answer frozen at
  low-confidence `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`
  with
  `gate_p_found_no_runtime_ready_access_or_equivalent_measured_row_no_runtime_selected_source_access_followup_gate_q`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_O_HANDOFF.md`
  lands Gate O full-curve retrieval and provenance QC no-runtime. It
  adds `packages/engine/src/wall-triple-leaf-source-locator-provenance.ts`
  and
  `packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`,
  verifies the Uris 2006 DOI/PII/pages/metadata and ScienceDirect
  locator, records that the public/local paths expose only summary /
  metadata or HTTP 403 and not source-owned band curves, rejects the
  reported 7-8 dB weighted-index decrease as a reusable runtime penalty,
  keeps the split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`
  with
  `gate_o_verified_uris_locator_but_full_curves_not_runtime_ready_no_runtime_selected_source_access_gate_p`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_N_HANDOFF.md`
  lands Gate N source locator intake no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-locator-intake.ts` and
  `packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`,
  selects
  `uris_2006_internal_gypsum_50mm_mineral_wool_double_frame` as the
  primary full-curve retrieval target, keeps NRC 2024 as a graph-owned
  adjacent comparator, keeps rockwool-density and stone/glass-wool
  double-leaf papers as equivalence context only, rejects NRC 1998
  baseline rows from this lane, keeps the split-rockwool answer frozen
  at low-confidence `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`
  with
  `gate_n_classified_rockwool_two_cavity_source_locators_no_runtime_selected_full_curve_retrieval_and_provenance_gate_o`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_M_HANDOFF.md`
  lands Gate M source evidence acquisition no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition.ts`
  and
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`,
  selects `rockwool_two_cavity_band_curve_source_pack` as the first
  evidence path, keeps Type C board mapping, support topology, MLV, and
  gypsum plaster as follow-on blockers, keeps the split-rockwool answer
  frozen at low-confidence `multileaf_screening_blend` `Rw 41`, and
  selects
  `packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`
  with
  `gate_m_selected_rockwool_two_cavity_source_evidence_first_no_runtime_selected_source_locator_intake_gate_n`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_L_HANDOFF.md`
  lands Gate L source-gap closure no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-source-gap-closure.ts` and
  `packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`,
  confirms all six local gaps remain open from current evidence, refuses
  to promote adjacent NRC Type C / glass-fiber / 92.1 mm cavity /
  support references as local runtime evidence, keeps the split-rockwool
  answer frozen at low-confidence `multileaf_screening_blend` `Rw 41`,
  and selects
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`
  with
  `gate_l_confirmed_source_gaps_remain_open_no_runtime_selected_source_evidence_acquisition_gate_m`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_K_HANDOFF.md`
  lands Gate K runtime-promotion readiness no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness.ts`
  and
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`,
  passes the source-family curves, calibration/holdout,
  negative-boundary, complete grouped topology, and Gate J acceptance
  prerequisites, but blocks runtime promotion on local material
  mapping, usable local source pack, source-gap closure, runtime-ready
  topology guards, and paired engine/web visible runtime tests. It keeps
  the split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, selects
  `packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`
  with
  `gate_k_blocked_runtime_promotion_no_runtime_selected_source_gap_closure_gate_l`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_J_HANDOFF.md`
  lands Gate J company-internal acceptance rehearsal no-runtime. It
  adds
  `apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`,
  rehearses the adjacent and split rockwool user PDF stacks, missing
  and complete grouped topology, exact and near-source controls,
  double-leaf / lined-masonry / one-side-lining negatives,
  many-layer/reorder hostile inputs, lab `Rw`, field `R'w` and
  `DnT,w`, and proposal/report visibility. It keeps the split-rockwool
  answer frozen at low-confidence `multileaf_screening_blend` `Rw 41`,
  keeps field metrics visibly caveated, and selects
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`
  with
  `gate_j_landed_company_internal_acceptance_rehearsal_no_runtime_selected_runtime_promotion_readiness_gate_k`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_I_HANDOFF.md`
  lands Gate I web-visible grouped topology inputs no-runtime. It adds
  `apps/web/features/workbench/simple-workbench-wall-topology.ts`,
  plumbs grouped wall topology through the workbench store and live
  `AirborneContext.wallTopology`, adds route-card topology-gap handling
  for missing grouped roles vs source-validation-blocked complete
  topology, keeps the live split-rockwool answer frozen at
  low-confidence `multileaf_screening_blend` `Rw 41`, and selects
  `apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`
  with
  `gate_i_landed_web_visible_grouped_topology_inputs_no_runtime_selected_company_internal_acceptance_rehearsal_gate_j`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_H_HANDOFF.md`
  lands the Gate H engine-integration fail-closed prerequisite check
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, passes source-family curves /
  calibration / negative-boundary / complete grouped test topology,
  blocks local material mapping, usable local source pack, source-gap
  closure, runtime-ready topology guards, and paired engine/web-visible
  runtime tests, and selects
  `apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts`
  with
  `gate_h_landed_engine_integration_fail_closed_prerequisite_check_no_runtime_selected_web_visible_grouped_topology_inputs_gate_i`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G9_HANDOFF.md`
  lands the Gate G9 visible diagnostics and grouped topology guard
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, records visible diagnostic ids
  for the source gaps and route-flip guards, owns grouped topology guard
  definitions for `triple_leaf_double_leaf_route_flip` and
  `duplicate_stack_family_flip`, keeps web-visible runtime tests not
  ready, and selects
  `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts`
  with
  `gate_g9_landed_visible_diagnostics_and_grouped_topology_guard_no_runtime_selected_engine_integration_fail_closed_gate_h`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G8_HANDOFF.md`
  lands the Gate G8 source-gap and order-risk register no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-source-gap-and-order-risk.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, classifies source acquisition,
  bounded effect-model, and topology-input-owner gaps, selects
  `triple_leaf_double_leaf_route_flip` and
  `duplicate_stack_family_flip` for Gate G9 visible diagnostics /
  grouped topology guard work, preserves existing sibling order-risk
  tests, and selects
  `packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts`
  with
  `gate_g8_landed_source_gap_and_order_risk_register_no_runtime_selected_visible_diagnostics_and_topology_guard_gate_g9`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G7_HANDOFF.md`
  lands the Gate G7 local source-pack intake and order-risk register
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-local-source-pack-acquisition.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, keeps every source-pack candidate
  blocked, records `triple_leaf_double_leaf_route_flip`,
  `heavy_multileaf_lined_massive_boundary_flip`,
  `masonry_lined_massive_swap_flip`, `duplicate_stack_family_flip`, and
  `raw_floor_order_role_inference_sensitivity`, and selects
  `packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts`
  with
  `gate_g7_landed_local_source_pack_intake_no_runtime_selected_source_gap_and_order_risk_register_gate_g8`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G6_HANDOFF.md`
  lands the Gate G6 local source acquisition and bounded effect-model
  requirements no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-local-source-acquisition.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, blocks local Type C board
  mapping, rockwool/mineral-wool absorber substitution, local 50 mm
  cavities, MLV, gypsum plaster, and support gauge/depth/spacing before
  runtime, and selects
  `packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts`
  with
  `gate_g6_landed_local_source_and_effect_model_requirements_no_runtime_selected_source_pack_acquisition_gate_g7`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G5_HANDOFF.md`
  lands the Gate G5 blocked diagnostics and source-acquisition decision
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-blocked-diagnostics.ts`,
  keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, turns Gate G4 blockers into
  user/developer diagnostics, and selects
  `packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts`
  with
  `gate_g5_landed_blocked_diagnostics_no_runtime_selected_local_source_acquisition_gate_g6`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G4_HANDOFF.md`
  lands the Gate G4 local material mapping and runtime eligibility
  decision no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-local-material-mapping.ts`,
  proves the Gate G3 source-family calibration still passes, blocks
  local `gypsum_board`, `rockwool`, `mlv`, `gypsum_plaster`, local
  50 mm cavities, and generic support topology from exact NRC-like
  runtime, keeps the live split-rockwool answer frozen at low-confidence
  `multileaf_screening_blend` `Rw 41`, and selects
  `packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts`
  with
  `gate_g4_blocked_local_material_and_topology_mapping_no_runtime_selected_blocked_diagnostics_and_source_acquisition_gate_g5`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md`
  lands the Gate G3 NRC-like source-family calibration fit and
  negative-boundary proof no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-calibration-fit.ts`, predicts
  calibration rows A/B and holdout row D against Gate G tolerance,
  keeps Assembly C as separate fill-regime context, protects ordinary
  double-leaf / simple stud / lined masonry / missing curve /
  floor-impact / field-only negatives, keeps runtime and visible
  behavior frozen, and selects
  `packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`
  with
  `gate_g3_passed_nrc_2024_source_family_calibration_holdout_and_negative_boundaries_no_runtime_selected_local_mapping_gate_g4`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2B_HANDOFF.md`
  lands the Gate G2B reproducible curve digitization QC no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.ts`,
  locks NRC 2024 Figure 4 / Figure 5 render provenance and axes,
  digitizes Type C plus assemblies A-D into one-third-octave TL vectors,
  derives STC/Rw as 64/63, 64/58, 60/49, 57/51, and 65/55, keeps runtime
  and visible calculator behavior frozen, and selects
  `packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`
  with
  `gate_g2b_landed_reproducible_curve_digitization_qc_no_runtime_and_selected_calibration_fit_gate_g3`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2_HANDOFF.md`
  lands the Gate G2 source-curve digitization intake no-runtime. It
  adds
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.ts`,
  pins the NRC 2024 Type C base wall and assemblies A-D as immutable
  graph rows, records reported STC values 64 / 64 / 60 / 57 / 65, keeps
  `transmissionLossDb`, `derivedRw`, and `digitizationUncertaintyDb`
  null until reproducible QC exists, and keeps runtime and visible
  calculator behavior frozen. The next file is
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`
  with
  `gate_g2_landed_source_curve_digitization_intake_no_runtime_and_selected_reproducible_digitization_qc`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G_HANDOFF.md`
  lands the Gate G calibration / holdout tolerance regime no-runtime.
  It adds `packages/engine/src/wall-triple-leaf-calibration-regime.ts`,
  sets the source-owned pass corridor to at least two calibration rows,
  at least one holdout row, MAE <= 2 dB, max error <= 4 dB, and dip-band
  placement within one neighboring one-third-octave band. Runtime and
  visible calculator behavior stay frozen, and the next file is
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`
  with
  `gate_g_defined_calibration_holdout_regime_no_runtime_and_selected_source_curve_digitization_intake`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_F_HANDOFF.md`
  lands the Gate F three-leaf/two-cavity frequency-band solver skeleton
  no-runtime. It adds
  `packages/engine/src/wall-triple-leaf-frequency-solver.ts`, derives
  grouped leaf masses, two cavity spring resonances, interacting
  resonance penalties, fill damping, coupling/support parameters, and
  ISO 717-ready TL curves. Runtime and visible calculator behavior stay
  frozen, and the next file is
  `packages/engine/src/wall-triple-leaf-calibration-regime.test.ts`
  with
  `gate_f_landed_frequency_band_solver_skeleton_no_runtime_and_selected_calibration_holdout_gate_g`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_E_HANDOFF.md`
  lands source-corpus classification no-runtime, keeps every source out
  of exact/runtime evidence, and selects Gate F frequency-band solver
  skeleton at
  `packages/engine/src/wall-triple-leaf-frequency-solver.test.ts` with
  `gate_e_classified_triple_leaf_source_corpus_no_runtime_and_selected_frequency_band_solver_gate_f`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_D_HANDOFF.md`
  lands source-pack extraction no-runtime, keeps every candidate
  `directRuntimeReadyNow: false`, and selects
  `packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts`
  for Gate E source-corpus classifier with
  `gate_d_extracted_triple_leaf_source_pack_no_runtime_and_selected_source_corpus_classifier_gate_e`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C_HANDOFF.md`
  lands the triple-leaf research plan no-runtime, keeps the current
  split-rockwool numeric answer on low-confidence
  `multileaf_screening_blend`, documents the second source-readiness
  iteration, and selects
  `packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`
  for Gate D source-pack extraction with
  `gate_c_researched_triple_leaf_physics_and_selected_source_pack_extraction_before_any_numeric_promotion`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B_HANDOFF.md`
  lands the grouped wall-topology input contract no-runtime, keeps the
  current split-rockwool numeric answer on low-confidence
  `multileaf_screening_blend`, and selects Gate C source-calibrated
  solver work with
  `landed_wall_triple_leaf_topology_input_contract_no_numeric_promotion_and_selected_source_calibrated_solver_gate_c`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A_HANDOFF.md`
  lands the split-rockwool PDF repro no-runtime, confirms existing
  stud/connection fields do not provide enough topology, and selects
  Gate B topology-input recovery with
  `selected_wall_triple_leaf_accuracy_recovery_v1_after_user_pdf_repro_showed_current_multileaf_blend_is_not_a_validated_calculation`.
- paused source checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands British Gypsum White Book source-pack extraction Gate A
  no-runtime, keeps every runtime and visible surface frozen, confirms
  `A046006` is already landed in the timber exact corpus, and selects
  Gate B mapping/tolerance decision with
  `british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_GATE_A_HANDOFF.md`
  lands `calculator_post_knauf_source_acquisition_v1` no-runtime, keeps
  every runtime and visible surface frozen, and selects
  `british_gypsum_white_book_source_pack_extraction_v1` with
  `selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`.
- just landed British Gypsum extraction decision:
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`
  extracts `C204006`, `C204003`, `A206A290`, `A046006`, `A326017B`,
  and `B226010` no-runtime. `A046006` is not new runtime movement
  because it is already represented by
  `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`.
  `C204006`, `C204003`, `A206A290`, `A326017B`, and `B226010` proceed
  only to Gate B mapping/tolerance decision; runtime/support/confidence/
  evidence/API/route-card/output-card/proposal-report/workbench-input
  behavior stays frozen. The next file is
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
- just landed post-Knauf source acquisition decision:
  `packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`
  classifies fresh official locators after v7 found no runtime-ready
  pack. British Gypsum White Book row locators cover GypFloor Silent
  `C204006` / `C204003`, GypWall Single Frame `A206A290`, timber stud
  `A046006`, GypWall Twin Frame Audio `A326017B`, and GypLyner Single
  `B226010`. Stora Enso CLT stays context. No runtime or visible
  surface moved; the next first-gate file is
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v7` no-runtime, keeps
  every runtime and visible surface frozen, and selects
  `calculator_post_knauf_source_acquisition_v1` with
  `selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`.
- just landed v7 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`
  re-ranks the post-Knauf source / accuracy backlog after `TB.5A`,
  `MWI.2A`, `TTF30.2A`, and
  `EN-PC-50-055-6-2-12.5-WB-25` all closed no-runtime. It finds no
  source-ready runtime candidate, keeps every runtime and visible
  surface frozen, and selects
  `packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`
  as the next first-gate file.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `steel_stud_knauf_enpc_mapping_tolerance_v1` no-runtime and
  selects `calculator_source_gap_revalidation_v7`.
- just closed EN-PC mapping/tolerance decision:
  `packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `EN-PC-50-055-6-2-12.5-WB-25` no-runtime because Wallboard,
  25 mm Acoustic Roll, 50 mm / 0.55 gauge stud detail, field-output
  policy, spectrum-term policy, tolerance ownership, and paired
  visible tests remain incomplete. Because `TB.5A`, `MWI.2A`,
  `TTF30.2A`, and `EN-PC-50-055-6-2-12.5-WB-25` all closed
  no-runtime, it selects
  `packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`
  as the next first-gate file with
  `closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership`.
- just landed EN-PC mapping/tolerance decision:
  `packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf UK `EN-PC-50-055-6-2-12.5-WB-25` lab context:
  50 mm 0.55 gauge Knauf C metal stud at 600 mm centres,
  `2x12.5 mm` Wallboard each side, `25 mm` Knauf Insulation Acoustic
  Roll, single metal stud non-deflection frame, and lab `Rw 49`.
  Runtime remains blocked because the live LSF route is anchored to
  `knauf_lab_416889_primary_2026` (`Rw 55`) with acoustic gypsum
  board, 70 mm glasswool, 5 mm air gap, no stud-depth/gauge input,
  no EN-PC field-output owner, no spectrum-term owner, no tolerance
  owner, and no paired visible tests. It selects
  `packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  as the next file with `gate_c_no_runtime_closeout_and_next_slice_selection`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v6` no-runtime, keeps every
  runtime and visible surface frozen, and selects
  `steel_stud_knauf_enpc_mapping_tolerance_v1` with
  `selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate`.
- just landed v6 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`
  re-ranks the post-Knauf mapping chain after `TB.5A`, `MWI.2A`, and
  `TTF30.2A` closed no-runtime. It selects
  `packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`
  because `EN-PC-50-055-6-2-12.5-WB-25` is the highest-value remaining
  concrete Knauf locator for a common steel-stud lane, while Wallboard /
  Acoustic Roll mapping, stud-gauge equivalence, lab/field policy,
  tolerance owner, existing steel-anchor precedence, and paired visible
  tests remain incomplete.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `twin_timber_knauf_ttf302a_mapping_tolerance_v1` no-runtime,
  keeps Knauf `TTF30.2A` as source context only, keeps every runtime
  and visible surface frozen, and selects
  `calculator_source_gap_revalidation_v6` with
  `closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`.
- just closed TTF30.2A mapping/tolerance decision:
  `packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `TTF30.2A` no-runtime because exact twin-frame topology,
  `FIBEROCK AQUA-TOUGH` mapping, side asymmetry, glasswool placement,
  field-output policy, tolerance ownership, and paired visible tests
  remain missing. It selects
  `packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed TTF30.2A mapping/tolerance decision:
  `packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf `TTF30.2A` lab context: asymmetric `1x13 mm`
  side 1 / `2x13 mm` side 2 `FIBEROCK AQUA-TOUGH`, twin timber studs
  separated by a 20 mm gap, 70 / 90 mm stud columns, 199 / 239 mm
  minimum wall widths, `Nil` / `KI 50G11` / `KI 75G11` / `KI 90G11`
  variants, and source ratings spanning `Rw 49-64` / `Rw+Ctr 41-54`.
  Runtime remains blocked because live timber is a single-frame
  formula-owned generic gypsum / rockwool / air-gap route without
  twin-frame gap, side asymmetry, exact column, field-output policy, or
  tolerance owner. It selects
  `packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  as the next file with `gate_c_no_runtime_closeout_and_next_slice_selection`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `lined_masonry_knauf_mwi2a_mapping_tolerance_v1` no-runtime,
  keeps Knauf `MWI.2A` as source context only, keeps every runtime and
  visible surface frozen, and selects
  `twin_timber_knauf_ttf302a_mapping_tolerance_v1` with
  `closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`.
- just closed MWI.2A mapping/tolerance decision:
  `packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `MWI.2A` no-runtime because exact substrate mass,
  furring/coupling model, `SHEETROCK ONE` mapping, `KI 25G24` /
  `KI 50G11` mapping, field-output policy, and tolerance ownership
  remain missing. It selects
  `packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed MWI.2A mapping/tolerance decision:
  `packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf `MWI.2A` lab context: `1x13 mm SHEETROCK ONE`
  each side, side 2 on 28 mm furring channels, 30 / 50 mm cavity
  variants, `Nil` / `KI 25G24` / `KI 50G11` insulation variants,
  concrete panel and core-filled block substrate variants, and source
  ratings spanning `Rw 52-61` / `Rw+Ctr 44-51`. Runtime remains blocked
  because the live route does not exact-match the board, substrate
  mass, furring/cavity coupling, insulation, field-output policy, or
  tolerance owner.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md`
  closes `timber_double_board_knauf_tb5a_mapping_tolerance_v1`
  no-runtime, keeps Knauf `TB.5A` as source context only, keeps every
  runtime and visible surface frozen, and selects
  `lined_masonry_knauf_mwi2a_mapping_tolerance_v1` with
  `closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`.
- just closed TB.5A mapping/tolerance decision:
  `packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `TB.5A` no-runtime because exact stud-depth column selection,
  `SHEETROCK ONE` mapping, `KI 75G11` mapping, field-output policy,
  and tolerance ownership remain missing. It selects
  `packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`
  as the next first-gate file.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md`
  lands `timber_double_board_knauf_tb5a_mapping_tolerance_v1` Gate A
  no-runtime, records Knauf `TB.5A` as source context only, keeps every
  runtime and visible surface frozen, and selects Gate C closeout /
  next-slice selection with
  `gate_c_no_runtime_closeout_and_next_slice_selection`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v5` Gate A no-runtime,
  keeps every runtime and visible surface frozen, and selects
  `timber_double_board_knauf_tb5a_mapping_tolerance_v1` with
  `selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`.
- just landed TB.5A mapping/tolerance decision:
  `packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`
  pins official Knauf `TB.5A` lab context: 70 mm / 122 mm column
  `Rw 46 (Rw+Ctr 39)` and 90 mm / 142 mm column
  `Rw 47 (Rw+Ctr 40)` for `KI 75G11`. Runtime remains blocked because
  the live route does not exact-match `2x13 mm SHEETROCK ONE`,
  `75 mm KI 75G11`, or a selected stud-depth column, and no field
  output or tolerance owner is named.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md`
  confirmed docs and implementation aligned at a clean pre-Gate A stop:
  v5 was selected, the v5 Gate A contract was intentionally absent and
  next, the current-gate runner included Knauf Gate C but not v5 yet,
  and no source-ready runtime candidate was selected.
- just landed v5 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`
  re-ranks Knauf `TB.5A`, Knauf `MWI.2A`, CLT / mass timber, generated
  floor fallback, no-stud double-leaf, historical blocked families,
  internal-use promotion, and productization-only work. It keeps every
  candidate `runtimeImportReadyNow: false`, freezes
  `runtime/support/confidence/evidence/API/route-card/output-card` and
  `proposal/report/workbench-input`, and selects the no-runtime
  `TB.5A` mapping / tolerance slice.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`
  closes Knauf source-pack extraction no-runtime, carries forward
  `no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership`,
  and selects `calculator_source_gap_revalidation_v5` with
  `closed_knauf_wall_systems_source_pack_no_runtime_and_selected_source_gap_revalidation_v5_because_gate_b_found_no_import_ready_row`.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`
  lands Knauf source-pack Gate B no-runtime. It compared the extracted
  locator rows against the live implementation, blocked every row from
  runtime/import/visible promotion, and selected Gate C closeout /
  next-slice selection.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`
  lands Knauf source-pack Gate A no-runtime. It extracted official
  Knauf UK/AU locators and selected Gate B mapping/tolerance decision;
  runtime/support/confidence/evidence/API/card/report/input behavior
  stayed frozen.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A_HANDOFF.md`
  lands `calculator_source_gap_revalidation_v4` Gate A no-runtime and
  selects `knauf_wall_systems_source_pack_extraction_v1`. Official
  Knauf UK/AU source locators are concrete enough for no-runtime
  extraction, but not for import or confidence promotion.
- just landed Knauf extraction decision:
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`
  blocks `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`, `TTF30.2A`, and
  `MWI.2A` from import because exact topology / local material mapping
  / tolerance ownership / field-output policy remain incomplete; keeps
  `TO120.1A` negative and `TSF120.1A` / `AAC.1A` adjacent context; and
  selects Gate C no-runtime.
- just landed Knauf extraction Gate A:
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`
  extracted UK steel-stud, AU timber stud/twin/staggered, and AU
  masonry/AAC locator rows. `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`,
  `TTF30.2A`, and `MWI.2A` proceed only to Gate B mapping/tolerance
  decision; `TO120.1A` stays a one-side-lined negative boundary, and
  `TSF120.1A` / `AAC.1A` stay adjacent context.
- just landed v4 source-gap revalidation decision:
  `packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`
  re-ranks the current source/accuracy backlog, keeps every runtime and
  visible surface frozen, and selects
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`
  as the next first-gate file.
- prior checkpoint:
  `docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md`
  closes generated floor fallback topology-delta no-runtime and selects
  `calculator_source_gap_revalidation_v4`. The live fallback stays
  low-confidence/screening; Pliteq exact and UBIQ FL-32 bound
  precedence still fire only on source topology; Gate B was skipped
  because no source-ready runtime candidate was found.
- just closed generated floor fallback decision:
  `packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`
  closes `generated_floor_fallback_topology_delta_v1` no-runtime, keeps
  every runtime and visible surface frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed generated floor fallback decision:
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  landed `generated_floor_fallback_topology_delta_v1` Gate A by mapping
  the live generated `floor-steel-fallback` stack against Pliteq exact
  and UBIQ FL-32 bound topologies. It keeps unsupported outputs explicit,
  keeps split variants finite and low-confidence, and selects Gate C
  closeout / next-slice selection with no runtime movement.
- just closed source-intake backlog cleanup decision:
  `packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`
  keeps every backlog family `runtimeImportReadyNow: false`, freezes
  every runtime and visible surface, and selects
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  as the next first-gate file.
- just landed source-intake backlog decision:
  `packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`
  consolidates CLT / mass-timber wall, timber double-board stud wall,
  no-stud double-leaf wall, generated floor fallback, lined massive /
  heavy-core wall, and historical blocked families into one
  agent-readable backlog. Public source locators remain context only
  until exact topology, metric owner, tolerance owner, negative
  boundaries, and paired engine/web visible tests are named.
- just closed pilot handoff decision:
  `packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`
  closes `internal_use_pilot_handoff_v1` no-runtime, keeps the handoff
  as controlled-use evidence rather than source-gated promotion, and
  selects `calculator_source_intake_backlog_cleanup_v1`.
- just landed pilot handoff decision:
  `packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts`
  creates `docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md`, tying the
  ready/caveated/blocked/hostile scenario buckets to validation
  evidence, known gaps, and operator steps without moving
  `runtime/support/confidence/evidence/API/route-card/output-card` or
  `proposal/report/workbench-input` behavior.
- just closed acceptance rehearsal decision:
  `packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`
  keeps runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input behavior frozen, treats Gate A as
  controlled-use evidence rather than promotion permission, and selects
  the pilot handoff slice.
- just landed acceptance rehearsal decision:
  `packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`
  pins 20 representative scenarios: ready wall benchmarks, exact/bound
  floor source corridors, caveated generated routes, many-layer/reorder
  edges, invalid thickness fail-closed behavior, unsupported-output
  partitioning, and cross-package proof-owner surfaces.
- just closed CLT / mass-timber decision:
  `packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  keeps all runtime/support/confidence/evidence/API/route-card/
  output-card surfaces frozen, confirms Gate B roadmap tracks are not
  source-ready runtime packs, and selects company-internal acceptance
  rehearsal as the next no-runtime slice.
- just landed Gate B decision:
  `packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`
  keeps STC/FSTC/ASTC as metric-policy research, rejects IIC for wall
  airborne outputs, allows one-third-octave TL only as future row
  recompute input, keeps Dataholz CLT floor `Rw` floor-only, and keeps
  every Gate A source group `runtimeImportReadyNow: false`.
- just landed extraction decision:
  `packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`
  classifies WoodWorks Table 7 Single CLT Wall and Table 9 Double CLT
  Wall as later row-mapping candidates only; WoodWorks Table 8 Single
  NLT Wall, NRC RR-335, and the NRC NLT addendum as formula/tolerance
  context; the WoodWorks database and Dataholz CLT floor rows as
  rejection-only context. Current `wall-clt-local` values and visible
  posture stayed frozen.
- just landed source-pack decision:
  `packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`
  ranked every candidate with `runtimeImportReadyNow: false`. CLT /
  mass-timber is first only for no-runtime extraction because WoodWorks
  and NRC locators are concrete enough to inspect next. STC/ASTC/IIC to
  ISO `Rw` handling, exact row extraction, tolerance ownership, and
  paired visible tests remain blockers.
- just closed internal-use decision:
  `packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`
  closed Gate C. Runtime, support, confidence, evidence tier, API
  shape, route-card values, and output-card statuses stayed frozen. The
  only behavior movement remains Gate B visible honesty copy: dynamic
  wall formula routes carry explicit formula-owned/source-gated
  scoped-estimate language through validation, evidence, and
  proposal/report surfaces.
- prior source/readiness rerank decision:
  `packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`
  selected the internal-use operating envelope because no fresh
  source-backed import, card dishonesty, or runtime drift outranked the
  short pilot pack.
- prior framed split decision:
  `packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
  fixed the LSF field/building board-split +1 dB value drift and
  split-only framed reinforcement monotonic-floor warning without global
  same-material board coalescing. Paired web route-card coverage is in
  `apps/web/features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts`.
- prior selection decision:
  `packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`
  closed `floor_layer_order_invariance_expansion_v1` Gate C no-runtime
  and selected `wall_framed_facing_split_warning_stability_v1`.
- prior floor-order decision:
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
  landed Gate A no-runtime for expanded floor layer-order behavior; Gate
  C then closed it without runtime/card drift.
- personal-use readiness chain:
  closed. Heavy-core/concrete remains screening; timber stud + CLT wall
  remain formula/source-gated until new source evidence appears; floor
  fallback remains low-confidence until new source evidence or a bounded
  family rule appears. UI/input/output honesty is closed and validated.
- do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete
  parity or formula scope, reinforced-concrete reopening, wall-selector
  behavior, timber-stud widening, or wall exact-row follow-ups from nearby
  green tests alone
- if a slice closes, update the current plan, current state, and the relevant
  checkpoint/handoff note together
- keep planning-contract tests in sync with the selected next slice
- `calculator_source_gap_revalidation_v7` is closed no-runtime and
  selected `calculator_post_knauf_source_acquisition_v1` because
  `TB.5A`, `MWI.2A`, `TTF30.2A`,
  `EN-PC-50-055-6-2-12.5-WB-25`, generated fallback, lined-heavy,
  no-stud, CLT, and historical blocked families all lack complete
  runtime prerequisites from the current source set. Do not promote any
  source locator alone without exact topology, metric owner, tolerance
  owner, local material mapping, protected negative boundaries, and
  paired engine/web visible tests.
- `calculator_post_knauf_source_acquisition_v1` is closed no-runtime
  and selected `british_gypsum_white_book_source_pack_extraction_v1`
  because British Gypsum White Book official row locators are concrete
  enough for extraction across GypFloor Silent, GypWall Single Frame,
  timber stud, GypWall Twin Frame Audio, and GypLyner Single. They are
  not runtime-ready until exact live topology, local material mapping,
  metric policy, tolerance owner, protected negative boundaries, and
  paired engine/web visible tests are extracted.
- prepared planning surfaces: internal-use acceptance rehearsal is in
  `SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md`; pilot handoff
  is in `SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md` and
  `INTERNAL_USE_PILOT_HANDOFF.md`; source-intake backlog cleanup is in
  `SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md` and
  `SOURCE_READY_INTAKE_BACKLOG.md`; generated floor fallback topology
  delta is in
  `SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md`; source
  gap revalidation v4 is in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md`; source gap
  revalidation v5 is landed in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md`; source gap
  revalidation v6 is landed in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md`; source gap
  revalidation v7 is landed in
  `SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md`; post-Knauf
  source acquisition is landed in
  `SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md`;
  British Gypsum White Book source extraction is selected in
  `SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md`;
  Knauf
  `EN-PC-50-055-6-2-12.5-WB-25` steel-stud mapping/tolerance is
  closed in
  `SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md`; Knauf
  `TTF30.2A` twin timber mapping/tolerance is closed in
  `SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md`;
  `MWI.2A` lined masonry mapping/tolerance is closed in
  `SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md`; Knauf
  `TB.5A` timber double-board mapping/tolerance is closed in
  `SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md`;
  Knauf wall
  systems source extraction is closed in
  `SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md`; CLT /
  mass-timber extraction is closed in
  `SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`; source-pack
  readiness triage is landed in
  `SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md`; short/regular
  internal use is closed in `SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md`;
  longer source-gated correctness work is in
  `CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md`. No runtime import is
  active until a contract selects it.

## Validation

- run `pnpm calculator:gate:current` before and after touching the active
  selected slice
- use `pnpm check` only when you need the broad full-repo gate
- latest focused validation: `pnpm calculator:gate:current` green on
  2026-05-11 after Personal-Use MVP Coverage Sprint Gate S; engine 360
  files / 2085 tests, web 71 files / 306 passed + 18 skipped, repo
  build 5/5 with the known optional `sharp/@img` warnings and existing
  Zustand unavailable test-storage warnings, whitespace guard clean.
- latest broad validation: `pnpm check` green on 2026-05-05 after
  Rockwool explicit screening-only policy Gate B; lint/typecheck clean,
  engine tests passed 382 files / 2262 tests, web tests passed 165
  files / 932 passed + 18 skipped, build 5 / 5 with the known non-fatal
  `sharp/@img` build warnings.
- web broad tests run through `tools/dev/run-web-vitest.ts`; it keeps
  the full web test file set in scope while isolating long route scans so
  Vitest worker RPC timeouts do not hide green test results
- keep `git diff --check` clean

## Boundaries

- treat `/home/ogttuna/Dev/Machinity/Acoustic2` as read-only upstream
- do not edit upstream from this repo
- keep workbench persistence assumptions honest:
  editing is still local-first, with explicit server sync/load available
