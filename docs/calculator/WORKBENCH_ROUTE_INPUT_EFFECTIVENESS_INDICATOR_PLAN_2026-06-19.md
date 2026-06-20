# Workbench Route Input Effectiveness Indicator Plan - 2026-06-19

## Status

Implemented route, material, and layer-row slices. This is a
calculator-integrity/UI-clarity slice requested after the custom
wall/floor route ownership work. It does not replace the current runtime
calculator roadmap, but it directly supports it by making route-required
and route-ignored physical inputs visible to the user.

Landed files:

- `apps/web/features/workbench-rebuild/calculator-workbench.tsx`
- `apps/web/features/workbench-rebuild/route-input-effectiveness.test.ts`
- `apps/web/features/workbench-rebuild/material-route-input-effectiveness.ts`
- `apps/web/features/workbench-rebuild/material-route-input-effectiveness.test.ts`
- `apps/web/features/workbench-rebuild/material-editor-panel.tsx`
- `apps/web/features/workbench-rebuild/material-editor-panel.test.ts`
- `apps/web/app/globals.css`

Implemented behavior:

- Route inputs can now show compact `Needed`, `Used`, `Inactive`, and
  `Default` badges beside the field label.
- `Needed` is still driven by engine `needs_input` tasks and remains the
  strongest state.
- Composite panel-area missing input now marks both panel width and
  panel height as needed.
- `Used` is conservative and appears when a selected route/output state
  actively sends or consumes the input and changing it can change a
  currently requested output. Lab-only companions such as `Rw`, `STC`,
  `C`, and `Ctr` do not mark building-prediction fields as active just
  because `Airborne mode = Building` is selected; those fields become
  active only when the requested output set includes a field/building
  metric such as `R'w`, `Dn,w`, or `DnT,w`.
- `Default` appears for visible active-context inputs that have no user
  value yet and are not currently reported as `needs_input`; the tooltip
  explains that the active route is using a fallback assumption.
- `Inactive` appears for proven request-shape cases such as RT60 while
  `R'w` is still waiting for Field/Building mode, building-prediction
  inputs outside Building mode, or route-family inputs shown while no
  airborne output is selected.
- The Building prediction section is only shown when an airborne/spectrum
  output is selected. If the current output set is impact-only or
  otherwise non-airborne, the stale `Airborne mode = Building` state no
  longer keeps a misleading all-`Inactive` building panel visible.
- Exact source routes do not mark manual wall topology as used.
- Material editor route-critical physical fields now use the same
  conservative status idea for `flowResistivityPaSM2` and material-owned
  `dynamicStiffnessMNm3`.
- Material `Needed` is derived from route `needs_input` only when the
  selected material is active in the layer stack and the selected
  material does not already carry the missing property.
- Material `Used` requires live route proof: airborne formula basis must
  reference flow/porous damping for flow resistivity, and floor impact
  output must echo the material dynamic stiffness for material-owned
  dynamic stiffness.
- Material `Inactive` covers exact source ownership, wrong output
  family, and selected materials that are not in the active layer stack.
- Material editor now keeps route-critical physical fields visible when
  a saved material already carries the property, even if the catalog
  acoustic behavior label is broader than the solver property. This
  prevents material-owned impact dynamic stiffness from being hidden on
  support products such as resilient underlays.
- Layer-row labels now show route effectiveness for `Material`, `Role`,
  and `Thickness`.
- Wall layer `Role` is marked `Inactive` because wall layer roles are
  not sent in the estimate payload; explicit Wall topology inputs own
  leaf/cavity grouping.
- Floor layer `Role` is marked `Used` for live floor impact formula
  routes and `Inactive` for airborne-only floor output sets.
- Material editor solver-adjacent fields now include selected-route
  badges for `category`, `behavior`, `densityKgM3`, `absorberClass`,
  `porosity`, `youngModulusPa`, `poissonRatio`, `lossFactor`, and
  route-critical flow/dynamic fields.
- Material editor metadata fields `propertySourceStatus`, `tags`, and
  `notes` are marked `Inactive` with hover text explaining that they do
  not change the current dB calculation.
- Exact source ownership keeps layer `Material`, layer `Thickness`, and
  floor impact `Role` labeled as `Used` for exact construction matching,
  while formula-only material physical tuning fields are not labeled
  `Used` unless a live formula/bounded-delta route is also present.

Validation:

- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-editor-surface-parity.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts`
- `pnpm --filter @dynecho/web exec vitest run features/workbench-rebuild/material-route-input-effectiveness.test.ts features/workbench-rebuild/material-editor-panel.test.ts features/workbench-rebuild/route-input-effectiveness.test.ts features/workbench-rebuild/material-editor-surface-parity.test.ts`
- `pnpm --filter @dynecho/web typecheck`
- Playwright manual workbench smoke at `http://localhost:3010/workbench-v2`
  after local login:
  - `R'w` missing field context showed `Needed` badges.
  - After switching to Field mode and entering panel width, panel height,
    and room volume, the same inputs showed `Used` and `R'w` calculated.
  - The later route-input regression smoke supersedes the earlier
    `Rw + Building` default/active interpretation.
  - Console reported zero errors; estimate API calls returned 200.
- Playwright manual material editor smoke at `http://localhost:3011/workbench-v2`
  after local login:
  - Floor impact with missing load basis showed route `Needed`.
  - Selecting Rock Wool while the active floor stack no longer used it
    showed material `Flow resistivity` as `Inactive`.
  - After entering load basis, `Ln,w` calculated and selecting GenieMat
    RST05 showed material `Dynamic stiffness` as `Used`.
- Playwright manual expanded input-effectiveness smoke at
  `http://localhost:3011/workbench-v2` after local login:
  - Wall `Rw` formula route showed layer `Material` and `Thickness` as
    `Used`, while wall layer `Role` showed `Inactive` with hover text
    pointing users to Wall topology inputs.
  - Material editor showed Gypsum Board `Category`, `Behavior`, and
    `Density` as `Used`, `Source`, `Tags`, `Notes`, `Young modulus`,
    `Poisson ratio`, and `Loss factor` as `Inactive`, with hover text
    explaining each route status.
  - Floor `Ln,w` first showed `Load basis` as `Needed`; after entering
    `100 kg/m2`, `Ln,w` calculated at `56.4 dB`, floor layer `Role`
    changed to `Used`, and GenieMat RST05 `Dynamic stiffness` remained
    `Used`.
- Playwright manual route-input regression smoke at
  `http://localhost:3011/workbench-v2` after local login:
  - `R'w + Lab` showed `Airborne mode`, panel width/height, and room
    volume as `Needed`; RT60 showed `Inactive` with hover text saying it
    is not used until Field or Building mode is selected.
  - `R'w + Building` showed `Airborne mode` as `Used`, missing physical
    building inputs as `Needed`, and blank RT60 as `Default`.
  - `Rw + Building` showed visible building-context controls as
    `Inactive` when `Rw` was the only selected output, because changing
    those controls does not change a lab-only output.
  - Floor `Ln,w` impact-only output did not show the stale Building
    prediction panel even if the previous wall state had `Airborne mode =
    Building`; only floor impact route inputs remained visible.
- Playwright manual re-check after the user-reported Building screenshot
  issue at `http://localhost:3011/workbench-v2`:
  - `R'w + Lab` still shows panel width/height/room volume as `Needed`,
    RT60 as `Inactive`, and no Building prediction sub-panel.
  - `Rw + R'w + Building` shows panel width/height/room/source/flanking
    fields as `Needed`; they are not incorrectly labeled `Inactive`.
  - `Rw + Building` shows panel width/height/room/source/flanking fields
    as `Inactive` for lab-only output sets; they are not incorrectly
    labeled `Used` or `Default`.
  - Floor `Ln,w` impact-only state shows only floor impact inputs
    (`Load basis` as `Needed` plus dynamic stiffness) and does not show a
    stale Building prediction panel.
  - Browser console error filter returned zero current errors. The
    request log still included older dev-server/HMR 500 entries from
    Fast Refresh during code editing, but the latest projects, presets,
    and estimate calls in this re-check returned 200.
- Targeted route/output bug-hunt after the route-input smoke:
  - Lab-only `Rw` in Building mode now keeps `Airborne mode`,
    panel/room fields, and Building prediction fields `Inactive` before
    and after an estimate result returns.
  - Mixed `Rw + DnT,w` in Building mode still keeps the same fields
    active, so the inactive guard does not hide inputs that a selected
    field/building metric actually consumes.
  - Simple workbench output cards no longer surface requested helper
    metrics from stale `metrics.estimated*` fields when the engine did
    not place that target output in `supportedTargetOutputs`. Legitimate
    conservative lower/upper bound cards remain allowed.
  - Validation: targeted workbench bug-hunt suite passed with `74`
    tests, `pnpm --filter @dynecho/web typecheck` passed, `git diff
    --check` passed, and full `pnpm calculator:gate:current` passed with
    shared `2 files / 19 tests`, engine `787 files / 4318 tests`, web
    `127 files / 506 passed + 18 skipped`, and repo build `5/5`.

## Problem

The workbench already exposes route inputs for wall topology, airborne
building prediction, impact field context, and floor impact context. It
also marks inputs that are missing through `needs_input` tasks. That is
not enough.

Some visible inputs are only meaningful for specific selected outputs,
route families, topology modes, and metric bases. A user can change a
visible input repeatedly and reasonably expect the estimate to change,
while the current selected route does not consume that input at all. This
creates false feedback and makes the calculator feel unreliable even when
the numeric route is behaving correctly.

The fix is to show a small per-input effectiveness indicator beside the
input label when the current route can prove whether that input is used,
needed, defaulted, or inactive.

## Calculator Alignment

This is in scope because it improves physical input capture and route
basis integrity:

- Users can tell which physical inputs actually influence `Rw`, `R'w`,
  `Dn,w`, `DnT,w`, `Ln,w`, `DeltaLw`, `IIC`/`AIIC`, and companions.
- Missing route-owned physical inputs remain explicit `needs_input`
  instead of being hidden behind unchanged values.
- Inputs that do not affect the current selected route are not presented
  as silently effective.
- The engine remains calculator-first: no source crawling, no confidence
  relabeling, no metric aliasing, and no guessed physics.

## Current Implementation Notes

Main UI surface:
`apps/web/features/workbench-rebuild/calculator-workbench.tsx`.

Current route-input behavior:

- `requiredTasks` combines local validation tasks and remote
  `needs_input` tasks.
- `isRouteInputMissing(inputId)` only knows whether an input is missing.
- Route input sections are shown by selected outputs and missing fields:
  airborne, building prediction, impact, floor impact, and wall topology.
- Visible controls include wall topology grouping, cavity depth/fill,
  support spacing, resilient bar side count, airborne mode, panel
  dimensions, receiving/source room data, flanking context, output basis,
  field impact corrections, load basis, and dynamic stiffness.

Current limitation:

- The web can highlight missing inputs, but it cannot generally tell the
  user that a filled input is inactive for the selected route.
- The engine result does not yet expose a stable per-route input usage
  contract for the workbench.
- Some route warnings mention used or ignored assumptions, but they are
  not structured enough for per-field UI badges.

Existing nearby patterns:

- Older workbench input-surface helpers already use statuses such as
  `complete`, `inactive`, `needs_input`, and `unsupported`.
- Material editor copy already warns that some fields are not directly
  used by the solver, but that is static text and not selected-route
  aware.

## Effectiveness Semantics

Use conservative statuses. If the system cannot prove a status, show no
badge rather than misleading the user.

- `used`: the selected route consumed this input and changing it can
  change at least one currently requested output.
- `needed`: the selected route needs this input before it can publish the
  requested output. This should be derived from engine `needs_input`.
- `inactive`: the input has a value or is visible, but the current
  selected route/output set does not consume it.
- `not_applicable`: the input belongs to another route family, metric
  basis, topology mode, or output type.
- `defaulted`: the route used a default or assumed value instead of a
  user-entered value.
- `unknown`: internal status only. The UI should avoid displaying a badge
  when usage cannot be proven.

Suggested labels:

- `Used`
- `Needed`
- `Inactive`
- `Default`

Do not use long explanatory text in the form itself. A compact badge and
tooltip are enough.

## Field Families

Phase 1 should cover the route-input pane:

- Wall topology: `wallTopologyMode`, side/cavity layer indices,
  `wallCavity1DepthMm`, `wallCavity1FillCoverage`,
  `wallCavity1AbsorptionClass`, `wallSupportTopology`,
  `supportSpacingMm`, `airborneResilientBarSideCount`.
- Airborne lab/building: `airborneMode`, `panelWidthMm`,
  `panelHeightMm`, `receivingRoomVolumeM3`, `receivingRoomRt60S`.
- Building prediction/flanking: `sourceRoomVolumeM3`,
  `flankingJunctionClass`, `conservativeFlankingAssumption`,
  `junctionCouplingLengthM`, `buildingPredictionOutputBasis`.
- Impact field/building: `fieldKDb`, `ciDb`, `ci50_2500Db`,
  `impactReceivingRoomVolumeM3`.
- Floor impact: `loadBasisKgM2`,
  `resilientLayerDynamicStiffnessMNm3`.

Phase 2 covers material/layer physical and metadata fields where the
current runtime result can prove the status without inventing physics:

- `flowResistivityPaSM2`
- resilient layer dynamic stiffness when supplied as a material property
- material `category`, `behavior`, and `densityKgM3` for live formula
  routes
- `absorberClass`, `porosity`, `youngModulusPa`, `poissonRatio`, and
  `lossFactor` when needs-input or route-basis evidence exists
- metadata `propertySourceStatus`, `tags`, and `notes` as explicitly
  inactive for dB calculation

Phase 3 covers layer row controls:

- layer `Material`
- layer `Role`
- layer `Thickness`

Still outside this implemented UI slice:

- absorber coverage ratio
- a stable engine-owned per-field usage metadata contract for every
  formula family
- fine-grained same-family source anchor/delta usage labels beyond exact
  source ownership and live formula route evidence

## Implementation Plan

1. Add a shared route-input usage model.
   - Stable field ids must match existing workbench input ids.
   - Shape should support `fieldId`, `status`, `consumedByOutputs`,
     `routeFamily`, `basis`, and `reason`.
   - The engine should own statuses for runtime routes whenever possible.
   - The web may derive only obvious request-shape facts, such as a
     building-only input being inactive while `airborneMode` is
     `element_lab`.

2. Populate engine usage for highest-value owned routes first.
   - Floor low-density exact impact routes: load basis and dynamic
     stiffness are `needed` until present, then `used` for owned impact
     outputs such as `Ln,w`, `DeltaLw`, `AIIC`, and `L'nT,50`.
   - Building prediction adapter routes: panel dimensions, room volume,
     RT60, source room volume, and flanking/junction fields should be
     `needed` or `used` for field/building outputs.
   - Wall user-material double-leaf/framed routes: topology, cavity, fill,
     support spacing, and resilient-bar fields should be `used` only when
     the selected route actually consumes explicit topology context.

3. Add a conservative web bridge.
   - Merge engine usage metadata with current `needs_input` tasks.
   - Preserve existing missing-input red styling.
   - Do not invent `used` from visibility alone.
   - If a field is visible only because of a mode selection but is not
     sent in the estimate payload, mark it `inactive` only when this can
     be proven from request construction.

4. Add the UI badge component.
   - Small badge next to field labels in the route-input pane.
   - Tooltip examples:
     - `Used by current route`
     - `Required before this route can calculate`
     - `Not used by current route`
     - `Using route default`
   - Keep the form compact and avoid adding instructional paragraphs.

5. Add focused tests.
   - Engine contract tests for usage metadata on the selected high-value
     routes.
   - Web tests for badge rendering and no-badge behavior when usage is
     unknown.
   - Playwright smoke:
     - Select a lab-only wall output and confirm building inputs are not
       presented as used.
     - Select building prediction outputs and confirm room/flanking
       inputs become needed/used.
     - Select floor impact outputs and confirm load basis/dynamic
       stiffness move from needed to used after entry.

## Acceptance Scenarios

1. A user selects only a lab airborne output such as `Rw`.
   Building prediction fields must not imply that changing them affects
   the lab result.

2. A user selects building airborne outputs such as `R'w` or `DnT,w`.
   Building prediction inputs must show `needed` when missing and `used`
   when consumed by the route.

3. A user selects an owned floor impact output.
   Load basis and dynamic stiffness must be visibly required or used by
   the route.

4. A user enters floor impact inputs while only requesting wall airborne
   metrics.
   The UI must not suggest those impact inputs affect the wall result.

5. A route uses an exact measured/source row.
   Formula-only physical tuning inputs must not be shown as used unless
   the exact-row route actually applies a bounded delta that consumes
   them.

6. A wall route is in auto topology mode.
   Manual leaf/cavity grouping inputs must not appear effective unless
   the explicit topology route consumes them.

## Non-Goals

- Do not change acoustic formulas in this slice.
- Do not add new source rows.
- Do not crawl sources.
- Do not retune formulas.
- Do not alias unsupported companion metrics.
- Do not hide unsupported states behind `inactive`.
- Do not claim an input is `used` unless the runtime route can prove it.

## Implemented Slice Notes

Implemented route-input pane badges with conservative metadata:

1. Wired `needed` from existing engine `needs_input` tasks.
2. Added route-aware `used` metadata for floor impact load/dynamic
   inputs, wall topology inputs, and building prediction context inputs.
3. Added web-only `inactive` only for request-shape-proven cases.
4. Added material editor input effectiveness for solver-adjacent
   physical fields and explicit metadata non-inputs.
5. Added layer-row input effectiveness for material, role, and
   thickness so users can see why changing wall `Role` does not change
   dB while floor impact roles do.

This UI slice is implemented. Remaining work should move toward an
engine-owned per-field usage contract when the runtime can expose more
fine-grained formula evidence for every formula family.
