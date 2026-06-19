# Next Agent Brief

Last reviewed: 2026-06-19

## Documentation Map

Use `docs/calculator/DOCUMENTATION_MAP.md` first when you need to know
which document owns which part of the handoff. It confirms that the
source-of-truth, current state, active plan, checkpoint, system map,
current gate runner, and user-material route-input implementation files
are synchronized at the current checkpoint.

Calculator drift lock:

- DynEcho is an acoustic prediction calculator, not a catalog, UI polish
  project, generic library, or source-crawl workflow.
- Work is valid only when it increases calculable layer combinations,
  improves numeric accuracy, opens or validates a physics/formula route,
  captures route-required physical inputs, or protects metric/route
  boundaries.
- Measured rows and compatible anchors are first-class evidence, but the
  long-term engine must calculate arbitrary user-entered combinations
  through owned formulas when no exact source row exists.
- Do not pick a new slice whose main output is docs, process,
  refactoring, frontend polish, confidence copy, or broad source
  gathering unless the user explicitly asks for that separate work.
- Before selecting or implementing anything, name the layer family,
  target output(s), formula/anchor route, required inputs, and boundary
  being improved or protected.

Fast path:

- current selected implementation action:
  `post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`;
- current selected implementation file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`;
- current selected implementation plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`;
- latest checkpoint reconciliation:
  `docs/calculator/CHECKPOINT_2026-06-19_DOUBLE_LEAF_FRAMED_PHYSICAL_INPUT_SENSITIVITY.md`;
- latest landed no-runtime coverage refresh:
  `post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_cavity_depth_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh follows owner status:
  `post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh selected candidate:
  `wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh behavior:
  re-probes `absorberThicknessMm = 90`, `45`, and `20` lab pins,
  thickness-sensitive field/building adapter values, no-thickness legacy
  behavior, missing `flowResistivityPaSM2` and missing
  `supportSpacingMm` as `needs_input`, impact aliases as
  `unsupported`, and direct-fixed double-leaf ownership;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 wall double-leaf/framed cavity-depth numeric sensitivity owner`;
- this is not a broad source crawl;
- latest landed runtime owner:
  `post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`;
- latest landed runtime owner status:
  `post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_absorber_thickness_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh action/file:
  `post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh selected candidate:
  `wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- previous runtime owner before that refresh:
  `post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_plan`
  /
  `packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-owner-contract.test.ts`
  /
  `post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`;
- previous runtime owner selected candidate:
  `wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner`;
- previous runtime owner selected next action/file:
  `post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- previous runtime owner counters:
  `accuracyPromotedRequestShapes: 3`,
  `accuracyPromotedTargetOutputs: 13`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 13`, `runtimeFormulaRetunes: 1`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed runtime owner selected candidate:
  `wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner`;
- latest landed runtime owner behavior:
  `advancedWall.cavities[].absorberThicknessMm` is now numerically
  active in the owned double-leaf/framed porous damping route.
  Full-depth `90 mm` in a `90 mm` cavity keeps lab `Rw/STC 46`,
  `C -1`, and `Ctr -6.1`; half-depth `45 mm` returns lab `Rw/STC 44`;
  thin `20 mm` returns lab `Rw/STC 43`. Field/building adapters move
  from the same owned base curve. No-thickness input preserves legacy
  behavior and does not add `absorberThicknessMm` to `requiredInputs`.
  Missing `flowResistivityPaSM2` and missing `supportSpacingMm` remain
  `needs_input`; impact aliases remain `unsupported`;
- latest landed runtime owner counters:
  `accuracyPromotedRequestShapes: 3`,
  `accuracyPromotedTargetOutputs: 13`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 13`, `runtimeFormulaRetunes: 1`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed runtime owner selected next action:
  `post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`;
- latest landed runtime owner selected next label:
  `post-V1 wall double-leaf/framed porous absorber thickness numeric sensitivity coverage refresh`;
- this is not a broad source crawl;
- latest landed no-runtime coverage refresh:
  `post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_bridge_support_spacing_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh follows owner status:
  `post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh selected candidate:
  `wall.double_leaf_framed.porous_absorber_coverage_ratio_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh behavior:
  re-probes ratio `1`, `0.5`, and `0.25` lab pins,
  ratio-sensitive field/building adapter values, no-ratio legacy
  behavior, missing `flowResistivityPaSM2` as `needs_input`, and impact
  aliases as `unsupported`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-owner-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_BRIDGE_SUPPORT_SPACING_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 wall double-leaf/framed bridge support-spacing numeric sensitivity owner`;
- this is not a broad source crawl;
- latest landed runtime owner:
  `post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`;
- latest landed runtime owner status:
  `post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`
  /
  `post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_coverage_ratio_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh selected candidate:
  `wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner`;
- latest landed no-runtime coverage refresh follows owner status:
  `post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed runtime owner selected candidate:
  `wall.double_leaf_framed.porous_absorber_coverage_ratio_numeric_sensitivity_owner`;
- latest landed runtime owner behavior:
  `advancedWall.cavities[].absorberCoverageRatio` is now numerically
  active for context-owned double-leaf/framed porous walls. Ratio `1`
  keeps `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`; ratio `0.5` returns
  lab `Rw 44` / `STC 44` and field/building `R'w 38`, `Dn,w 39`,
  `Dn,A 37.5`, `DnT,w 41`, and `DnT,A 39.9`; ratio `0.25` returns
  lab `Rw 43` / `STC 43` and field/building `R'w 37`, `Dn,w 38`,
  `Dn,A 36.5`, `DnT,w 40`, and `DnT,A 38.9`; no ratio preserves legacy
  enum behavior, missing flow remains `needs_input`, and impact aliases
  remain unsupported;
- latest landed runtime owner counters:
  `accuracyPromotedRequestShapes: 3`,
  `accuracyPromotedTargetOutputs: 13`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 13`, `runtimeFormulaRetunes: 1`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed runtime owner selected next action:
  `post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`;
- latest landed runtime owner selected next label:
  `post-V1 wall double-leaf/framed porous absorber coverage-ratio numeric sensitivity coverage refresh`;
- this is not a broad source crawl;
- latest landed runtime owner:
  `post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`;
- latest landed runtime owner status:
  `post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed runtime owner selected candidate:
  `wall.double_leaf_framed.porous_flow_resistivity_numeric_sensitivity_owner`;
- latest landed runtime owner behavior:
  `flowResistivityPaSM2` is now a numeric damping input for
  double-leaf/framed porous cavity formula routes. Nominal
  `15000 Pa*s/m2` keeps `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`,
  `R'w 40`, `Dn,w 41`, `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
  off-nominal `5000` and `50000 Pa*s/m2` move the same route to
  lab `Rw 45` / `STC 45` and field/building `R'w 39`, `Dn,w 40`,
  `Dn,A 38.5`, `DnT,w 42`, and `DnT,A 40.9`; missing user flow stays
  `needs_input`;
- latest landed runtime owner counters:
  `accuracyPromotedRequestShapes: 4`,
  `accuracyPromotedTargetOutputs: 18`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 18`, `runtimeFormulaRetunes: 1`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed runtime owner selected next action:
  `post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`;
- latest landed runtime owner selected next label:
  `post-V1 wall double-leaf/framed porous flow-resistivity numeric sensitivity coverage refresh`;
- latest landed no-runtime coverage refresh:
  `post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-19.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after wall context-owned porous-cavity field/building lab-companion basis integrity`;
- latest landed runtime owner:
  `post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-19.md`;
- latest landed runtime owner status:
  `post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner`;
- latest landed runtime owner selected candidate:
  `wall.context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner`;
- latest landed runtime owner behavior:
  context-owned double-leaf/framed wall field/building lab companions now
  use the owned direct lab curve (`Rw 46`, `STC 46`, `C -1`,
  `Ctr -6.1`) when side leaf groups, independent frame topology,
  absorptive cavity depth/fill, and
  `advancedWall.cavities[].absorberFlowResistivityPaSM2` are supplied;
  field/building adapter values remain `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- latest landed runtime owner counters:
  `accuracyPromotedRequestShapes: 4`,
  `accuracyPromotedTargetOutputs: 16`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 4`,
  `runtimeValuesMoved 16`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`;
- latest landed runtime owner selected next action:
  `post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_WALL_CONTEXT_OWNED_POROUS_CAVITY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`;
- latest landed runtime owner selected next label:
  `post-V1 wall context-owned porous-cavity field/building lab-companion basis integrity coverage refresh`;
- older fast-path entries below are historical unless they agree with
  the current selected implementation action above.
- historical checkpoint reconciliation:
  `docs/calculator/CHECKPOINT_2026-06-18_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_TARGET_OUTPUT_COVERAGE.md`;
- previous selected implementation action after that checkpoint:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`;
- previous selected implementation file after that checkpoint:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- previous selected implementation plan after that checkpoint:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh follows:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`
  and previous owner
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan`
  /
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh`;
- latest landed runtime owner:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime owner status:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`;
- latest landed runtime owner selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`;
- latest landed runtime owner counters:
  `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 4`,
  `newCalculableTargetOutputs: 16`,
  `runtimeBasisPromotions: 4`,
  `runtimeValuesMoved 16`,
  `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`,
  `frontendImplementationFilesTouched: 0`, and
  `unsupportedBoundariesProtected: 8`.
- latest landed runtime owner selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime owner selected next label:
  `post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence coverage refresh`;
- latest landed no-runtime rerank:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed no-runtime rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime rerank plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`;
- latest landed no-runtime rerank follows:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime rerank selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner`;
- latest landed no-runtime rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextCalculableRequestShapes: 4`,
  `estimatedNextCalculableTargetOutputs: 16`,
  `estimatedNextLabCompanionTargetOutputs: 16`,
  `estimatedNextRuntimeBasisPromotions: 4`,
  `estimatedNextRuntimeValuesMoved: 16`,
  `estimatedNextUnsupportedBoundariesProtected: 8`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime rerank selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_owner_plan`;
- latest landed no-runtime rerank selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-owner-contract.test.ts`;
- latest landed no-runtime rerank selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank selected next label:
  `post-V1 project/user measured wall airborne frequency field/building lab-companion target-output independence owner`;
- latest landed no-runtime coverage refresh:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh follows:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan`
  /
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh`;
- latest landed runtime owner:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime owner status:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts`
  /
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-18.md`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`;
- latest landed runtime owner selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`;
- latest landed runtime owner counters:
  `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 4`,
  `newCalculableTargetOutputs: 4`,
  `runtimeBasisPromotions: 4`,
  `runtimeValuesMoved 4`,
  `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`,
  `frontendImplementationFilesTouched: 0`, and
  `unsupportedBoundariesProtected: 8`.
- latest landed runtime owner selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime owner selected next label:
  `post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity coverage refresh`;
- latest landed no-runtime rerank:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan`;
- latest landed no-runtime rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts`;
- latest landed no-runtime rerank plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank status:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`;
- latest landed no-runtime rerank follows:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime rerank previous owner:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime rerank selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner`;
- latest landed no-runtime rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextCalculableRequestShapes: 4`,
  `estimatedNextCalculableTargetOutputs: 4`,
  `estimatedNextLabCompanionTargetOutputs: 4`,
  `estimatedNextRuntimeBasisPromotions: 4`,
  `estimatedNextRuntimeValuesMoved: 4`,
  `estimatedNextUnsupportedBoundariesProtected: 8`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime rerank selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_lab_companion_basis_integrity_owner_plan`;
- latest landed no-runtime rerank selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest landed no-runtime rerank selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank selected next label:
  `post-V1 project/user measured wall airborne frequency field/building lab-companion basis integrity owner`;
- latest landed no-runtime coverage refresh:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh follows:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh selected candidate:
  `wall.advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building lab-companion target-output independence`;
- latest landed runtime owner:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime owner status:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-contract.test.ts`
  /
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner`;
- latest landed runtime owner selected candidate:
  `wall.advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner`;
- latest landed runtime owner summary:
  field lab-only and building lab-only advanced-wall requests now return
  `Rw 65`, `STC 65`, `C -1.1`, and `Ctr -6.4`; mixed field `R'w 63`
  and building `DnT,w 66` remain unchanged.
- latest landed runtime owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 8`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 8`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`,
  and `unsupportedBoundariesProtected: 7`.
- latest landed runtime owner selected next action:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime owner selected next label:
  `post-V1 wall advanced-wall source-absent field/building lab-companion target-output independence coverage refresh`;
- latest landed no-runtime rerank:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_plan`;
- latest landed no-runtime rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-contract.test.ts`;
- latest landed no-runtime rerank plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank status:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner`;
- latest landed no-runtime rerank follows:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime rerank previous owner:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime rerank selected candidate:
  `wall.advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner`;
- latest landed no-runtime rerank summary:
  complete field/building contexts already publish Gate AY lab
  companions in mixed requests, but lab-only target sets still return
  unsupported. The selected owner should make `Rw`, `STC`, `C`, and
  `Ctr` target-output independent for this route.
- latest landed no-runtime rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextCalculableRequestShapes: 2`,
  `estimatedNextCalculableTargetOutputs: 8`,
  `estimatedNextLabCompanionTargetOutputs: 8`,
  `estimatedNextRuntimeBasisPromotions: 2`,
  `estimatedNextRuntimeValuesMoved: 8`,
  `estimatedNextUnsupportedBoundariesProtected: 7`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime rerank selected next action:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan`;
- latest landed no-runtime rerank selected next file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts`;
- latest landed no-runtime rerank selected next plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank selected next label:
  `post-V1 wall advanced-wall source-absent field/building lab-companion target-output independence owner`;
- latest landed no-runtime coverage refresh:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh follows:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh selected candidate:
  `wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner`;
- latest landed no-runtime coverage refresh summary:
  field mixed remains `R'w 63`, `Rw 65`, `STC 65`, `C -1.1`,
  `Ctr -6.4`; building mixed remains `DnT,w 66`, `Rw 65`, `STC 65`,
  `C -1.1`, `Ctr -6.4`; lab-only field/building requests, missing
  context, and Gate AY field/building publishing remain unsupported.
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building lab-companion basis integrity`;
- latest landed runtime owner:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime owner status:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner`;
- latest landed runtime owner selected candidate:
  `wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner`;
- latest landed runtime owner summary:
  field mixed requests now support `R'w 63`, `Rw 65`, `STC 65`,
  `C -1.1`, and `Ctr -6.4`; building mixed requests support
  `DnT,w 66`, `Rw 65`, `STC 65`, `C -1.1`, and `Ctr -6.4`.
  Lab companions are sourced from Gate AY, not field-adapted scalar
  values.
- latest landed runtime owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 8`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 8`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`,
  and `unsupportedBoundariesProtected: 7`.
- latest landed runtime owner selected next action:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime owner selected next label:
  `post-V1 wall advanced-wall source-absent field/building lab-companion basis integrity coverage refresh`;
- latest landed no-runtime rerank:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`;
- latest landed no-runtime rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed no-runtime rerank plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank status:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner`;
- latest landed no-runtime rerank follows:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime rerank previous owner:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime rerank selected candidate:
  `wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner`;
- latest landed no-runtime rerank summary:
  Gate AY already owns lab `Rw 65`, `STC 65`, `C -1.1`, and
  `Ctr -6.4`; mixed field/building requests currently park those lab
  outputs as unsupported. The selected owner should publish the lab
  companions from Gate AY while keeping field/building outputs on
  Gate I / Gate AR and not relabeling field-adapted `STC 63`,
  `C -0.9`, or `Ctr -6`.
- latest landed no-runtime rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextCalculableRequestShapes: 2`,
  `estimatedNextCalculableTargetOutputs: 8`,
  `estimatedNextLabCompanionTargetOutputs: 8`,
  `estimatedNextRuntimeBasisPromotions: 2`,
  `estimatedNextRuntimeValuesMoved: 8`,
  `estimatedNextUnsupportedBoundariesProtected: 7`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime rerank selected next action:
  `post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan`;
- latest landed no-runtime rerank selected next file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest landed no-runtime rerank selected next plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank selected next label:
  `post-V1 wall advanced-wall source-absent field/building lab-companion basis integrity owner`;
- latest landed no-runtime coverage refresh:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh follows:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`
  /
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`
  /
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`;
- latest landed no-runtime coverage refresh selected candidate:
  `wall.advanced_wall_source_absent_field_building_adapter_owner`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building adapter coverage refresh`;
- latest landed runtime owner:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime owner status:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner follows:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_advanced_wall_source_absent_field_building_adapter_owner`;
- latest landed runtime owner selected candidate:
  `wall.advanced_wall_source_absent_field_building_adapter_owner`;
- latest landed runtime owner summary:
  complete Gate AY advanced-wall source-absent field/building requests
  now feed the owned direct TL curve through Gate I / Gate AR for
  `R'w 63`, `Dn,w 64`, `Dn,A 62.6`, `DnT,w 66`, and `DnT,A 65`;
  Gate AY lab `Rw 65`, `STC 65`, `C -1.1`, and `Ctr -6.4` remain lab
  values, and mixed field/lab requests keep lab outputs unsupported.
- latest landed runtime owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 10`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 10`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`,
  and `unsupportedBoundariesProtected: 6`.
- latest landed runtime owner selected next action:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime owner selected next label:
  `post-V1 wall advanced-wall source-absent field/building adapter coverage refresh`;
- latest landed no-runtime rerank:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`;
- latest landed no-runtime rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed no-runtime rerank plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_advanced_wall_source_absent_field_building_adapter_owner`;
- latest landed no-runtime rerank follows:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`
  /
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime rerank selected candidate:
  `wall.advanced_wall_source_absent_field_building_adapter_owner`;
- latest landed no-runtime rerank selected next action:
  `post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan`;
- latest landed no-runtime rerank selected next file:
  `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts`;
- latest landed no-runtime rerank selected next plan:
  `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`;
- latest landed no-runtime rerank selected next label:
  `post-V1 wall advanced-wall source-absent field/building adapter owner`;
- latest landed no-runtime rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextCalculableRequestShapes: 2`,
  `estimatedNextCalculableTargetOutputs: 10`,
  `estimatedNextRequiredPhysicalInputsCaptured: 10`,
  `estimatedNextRuntimeBasisPromotions: 2`,
  `estimatedNextRuntimeValuesMoved: 10`,
  `estimatedNextUnsupportedBoundariesProtected: 6`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime coverage refresh:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_adapter_owner`;
- latest landed no-runtime coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency field/building adapter coverage refresh`;
- latest landed runtime owner:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts`;
- latest landed runtime owner status:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner selected candidate:
  `project_user_measured_wall_airborne_frequency_field_building_adapter_owner`;
- latest landed runtime owner summary:
  exact full-stack and compatible exterior-board project/user measured
  wall airborne frequency curves now feed Gate I / Gate AR
  field-building adapters for `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
  `DnT,A`; lab `Rw`, `STC`, `C`, and `Ctr` stay on lab bases.
- latest landed runtime owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 4`,
  `newCalculableTargetOutputs: 20`, `runtimeBasisPromotions: 4`,
  `runtimeValuesMoved 20`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`,
  and `unsupportedBoundariesProtected: 7`.
- latest landed runtime owner selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime owner selected next label:
  `post-V1 project/user measured wall airborne frequency field/building adapter coverage refresh`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_field_building_adapter_owner`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh selected
  candidate:
  `project_user_measured_wall_airborne_frequency_field_building_adapter_owner`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh summary:
  exact and compatible project/user measured wall airborne frequency
  curves are now owned as direct TL curves; next runtime work should
  feed those curves into Gate I / Gate AR for `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, and `DnT,A` only with explicit field/building context.
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextCalculableRequestShapes: 4`,
  `estimatedNextCalculableTargetOutputs: 20`,
  `estimatedNextRequiredPhysicalInputsCaptured: 9`,
  `estimatedNextRuntimeBasisPromotions: 4`,
  `estimatedNextRuntimeValuesMoved: 20`,
  `estimatedNextUnsupportedBoundariesProtected: 7`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh selected next
  action:
  `post_v1_project_user_measured_wall_airborne_frequency_field_building_adapter_owner_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh selected next
  file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-field-building-adapter-owner-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh selected next
  plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency compatible-delta coverage refresh selected next
  label:
  `post-V1 project/user measured wall airborne frequency field/building adapter owner`;
- latest landed no-runtime coverage refresh:
  `post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed no-runtime coverage refresh status:
  `post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed no-runtime coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`;
- latest landed no-runtime coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`;
- latest landed no-runtime coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime owner:
  `post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts`;
- latest landed runtime owner status:
  `post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_landed_runtime_selected_coverage_refresh`;
- latest landed runtime owner method:
  `post_v1_project_user_measured_wall_airborne_frequency_compatible_delta`;
- latest landed runtime owner summary:
  active project/user measured wall airborne TL curves can now anchor a
  bounded compatible exterior-board delta for element-lab `Rw`, `STC`,
  `C`, and `Ctr`; exact full-stack measured curves outrank it and
  field/building, impact aliases, non-board changes, missing rating
  standards, and ambiguous reduced-stack anchors stay out.
- latest landed runtime owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 4`,
  `newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 1`,
  `runtimeValuesMoved 4`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`,
  and `unsupportedBoundariesProtected: 7`.
- latest landed runtime owner selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_coverage_refresh_plan`;
- latest landed runtime owner selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-coverage-refresh-contract.test.ts`;
- latest landed runtime owner selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_compatible_delta_owner`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh follows:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh follows file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh follows status:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh selected
  candidate:
  `project_user_measured_wall_airborne_frequency_compatible_delta_owner`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh summary:
  exact measured curve full-stack matching is live; next runtime work
  is the bounded compatible-delta owner for element-lab walls that
  differ from an active measured curve anchor only by one-side or paired
  exterior board additions.
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextCalculableRequestShapes: 4`,
  `estimatedNextCalculableTargetOutputs: 4`,
  `estimatedNextRequiredPhysicalInputsCaptured: 6`,
  `estimatedNextRuntimeBasisPromotions: 1`,
  `estimatedNextRuntimeValuesMoved: 4`,
  `estimatedNextUnsupportedBoundariesProtected: 7`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh selected next
  action:
  `post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_owner_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh selected next
  file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-compatible-delta-owner-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh selected next
  plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency exact curve bridge coverage refresh selected next
  label:
  `post-V1 project/user measured wall airborne frequency compatible-delta owner`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh status:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh follows:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh follows file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh follows status:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_landed_runtime_selected_coverage_refresh`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh protected runtime method:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh summary:
  active `airborneMeasuredFrequencySourceAnchors`, exact element-lab
  wall fingerprint matching, curve-rated `Rw`, `STC`, `C`, and `Ctr`,
  scalar `Rw` separation, missing rating-standard and ambiguous
  exact-row boundaries, field/building/impact outside boundaries, and
  exact measured resolver trace are now frozen without runtime value
  movement.
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge coverage refresh selected next label:
  `post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency exact curve bridge coverage refresh`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge owner:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge owner file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge owner status:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_landed_runtime_selected_coverage_refresh`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge runtime method:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge summary:
  active `airborneMeasuredFrequencySourceAnchors` can now publish
  exact measured element-lab `Rw`, `STC`, `C`, and `Ctr` from a
  canonical fingerprint-matched TL curve when the required rating
  standard is declared; scalar aliases, field/building, impact,
  compatible deltas, source imports, formula retunes, and UI/storage
  remain outside.
- latest landed project/user measured wall airborne frequency exact curve
  bridge counters:
  `sharedApiFilesTouched: 1`, `apiRouteBridgeFilesTouched: 1`,
  `engineRuntimeFilesTouched: 4`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 4`,
  `runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed project/user measured wall airborne frequency exact curve
  bridge selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_coverage_refresh_plan`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-coverage-refresh-contract.test.ts`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed project/user measured wall airborne frequency exact curve
  bridge selected next label:
  `post-V1 project/user measured wall airborne frequency exact curve bridge coverage refresh`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema + fingerprint:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema follows:
  `post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema follows file:
  `packages/shared/src/domain/project-user-measured-source-anchor.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema follows status:
  `post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema previous implemented candidate:
  `project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema selected candidate:
  `project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `activeMeasuredFrequencyAnchorCandidateSchemas: 1`,
  `estimatedNextSharedApiFilesTouched: 1`,
  `estimatedNextExactMeasuredCurveRuntimeFamilies: 1`,
  `estimatedNextCalculableRequestShapes: 4`,
  `estimatedNextTargetOutputsMoved: 4`,
  `estimatedNextRuntimeBasisPromotions: 1`,
  `estimatedNextRuntimeValuesMoved: 4`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge_owner_plan`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-airborne-frequency-exact-curve-bridge-owner-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank after project/user measured wall
  airborne frequency anchor schema selected next label:
  `post-V1 project/user measured wall airborne frequency exact curve bridge owner`;
- latest landed project/user measured wall airborne frequency anchor
  schema + fingerprint:
  `post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`;
- latest landed project/user measured wall airborne frequency anchor
  schema file:
  `packages/shared/src/domain/project-user-measured-source-anchor.test.ts`;
- latest landed project/user measured wall airborne frequency anchor
  schema status:
  `post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed project/user measured wall airborne frequency anchor
  schema follows:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`;
- latest landed project/user measured wall airborne frequency anchor
  schema follows file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`;
- latest landed project/user measured wall airborne frequency anchor
  schema follows status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint`;
- latest landed project/user measured wall airborne frequency anchor
  schema implemented candidate:
  `project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint`;
- latest landed project/user measured wall airborne frequency anchor
  schema counters:
  `sharedDomainFilesTouched: 2`,
  `newExactMeasuredFrequencyAnchorInputFamilies: 1`,
  `activeMeasuredFrequencyAnchorCandidateSchemas: 1`,
  `canonicalFingerprintBuilders: 1`, `estimateRequestSchemaChanged: 0`,
  `engineRuntimeFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed project/user measured wall airborne frequency anchor
  schema selected next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`;
- latest landed project/user measured wall airborne frequency anchor
  schema selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-anchor-schema-fingerprint-contract.test.ts`;
- latest landed project/user measured wall airborne frequency anchor
  schema selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`;
- latest landed project/user measured wall airborne frequency anchor
  schema selected next label:
  `post-V1 runtime-first route-family rerank after project/user measured wall airborne frequency anchor schema + fingerprint`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh follows:
  `post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh follows file:
  `packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh follows status:
  `post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh protected runtime method:
  `post_v1_project_user_measured_wall_rw_exact_bridge`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh selected candidate:
  `project_user_measured_wall_lab_airborne_frequency_curve_anchor_schema_fingerprint`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextSharedDomainFilesTouched: 1`,
  `estimatedNextFrequencyCurveAnchorSchemas: 1`,
  `estimatedNextMeasuredCurveMetricFamilies: 1`,
  `estimatedNextCompanionTargetOutputsUnlockedAfterBridge: 4`,
  `estimatedNextRuntimeBasisPromotionsAfterBridge: 1`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh selected next action:
  `post_v1_project_user_measured_wall_airborne_frequency_anchor_schema_fingerprint_plan`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh selected next file:
  `packages/shared/src/domain/project-user-measured-source-anchor.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` exact bridge coverage refresh selected next label:
  `post-V1 project/user measured wall airborne frequency anchor schema + fingerprint`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh:
  `post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh file:
  `packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh status:
  `post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh follows:
  `post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh follows file:
  `packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh follows status:
  `post_v1_project_user_measured_wall_rw_exact_bridge_owner_landed_runtime_selected_coverage_refresh`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh protected runtime method:
  `post_v1_project_user_measured_wall_rw_exact_bridge`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh selected next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed project/user measured wall `Rw` exact bridge coverage
  refresh selected next label:
  `post-V1 runtime-first route-family rerank after project/user measured wall Rw exact bridge coverage refresh`;
- latest landed project/user measured wall `Rw` exact bridge owner:
  `post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan`;
- latest landed project/user measured wall `Rw` exact bridge owner file:
  `packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts`;
- latest landed project/user measured wall `Rw` exact bridge owner status:
  `post_v1_project_user_measured_wall_rw_exact_bridge_owner_landed_runtime_selected_coverage_refresh`;
- latest landed project/user measured wall `Rw` exact bridge runtime method:
  `post_v1_project_user_measured_wall_rw_exact_bridge`;
- latest landed project/user measured wall `Rw` exact bridge follows:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`;
- latest landed project/user measured wall `Rw` exact bridge follows file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts`;
- latest landed project/user measured wall `Rw` exact bridge follows status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_rw_exact_bridge_owner`;
- latest landed project/user measured wall `Rw` exact bridge selected candidate:
  `project_user_measured_wall_rw_exact_bridge_owner`;
- latest landed project/user measured wall `Rw` exact bridge counters:
  `sharedApiFilesTouched: 1`, `apiRouteBridgeFilesTouched: 1`,
  `engineRuntimeFilesTouched: 3`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 1`,
  `runtimeBasisPromotions: 1`, `runtimeValuesMoved 1`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed project/user measured wall `Rw` exact bridge selected
  next action:
  `post_v1_project_user_measured_wall_rw_exact_bridge_coverage_refresh_plan`;
- latest landed project/user measured wall `Rw` exact bridge selected
  next file:
  `packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-coverage-refresh-contract.test.ts`;
- latest landed project/user measured wall `Rw` exact bridge selected
  next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-18.md`;
- latest landed project/user measured wall `Rw` exact bridge selected
  next label:
  `post-V1 project/user measured wall Rw exact bridge coverage refresh`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema + fingerprint:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema status:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_project_user_measured_wall_rw_exact_bridge_owner`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema selected candidate:
  `project_user_measured_wall_rw_exact_bridge_owner`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema follows:
  `post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema follows file:
  `packages/shared/src/domain/project-user-measured-source-anchor.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema follows status:
  `post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema counters:
  `candidateCount: 6`, `roiAnalysisIterations: 4`,
  `activeMeasuredAnchorCandidateSchemas: 1`,
  `estimatedNextExactMeasuredAnchorRuntimeFamilies: 1`,
  `estimatedNextCalculableRequestShapes: 1`,
  `estimatedNextTargetOutputsMoved: 1`,
  `estimatedNextRuntimeBasisPromotions: 1`,
  `estimatedNextRuntimeValuesMoved: 1`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema selected next action:
  `post_v1_project_user_measured_wall_rw_exact_bridge_owner_plan`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema selected next file:
  `packages/engine/src/post-v1-project-user-measured-wall-rw-exact-bridge-owner-contract.test.ts`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_OWNER_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank after project/user measured wall
  `Rw` anchor schema selected next label:
  `post-V1 project/user measured wall Rw exact bridge owner`;
- latest landed project/user measured wall `Rw` anchor schema +
  fingerprint:
  `post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`;
- latest landed project/user measured wall `Rw` anchor schema file:
  `packages/shared/src/domain/project-user-measured-source-anchor.test.ts`;
- latest landed project/user measured wall `Rw` anchor schema status:
  `post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed project/user measured wall `Rw` anchor schema selected
  candidate:
  `project_user_measured_wall_rw_anchor_schema_fingerprint`;
- latest landed project/user measured wall `Rw` anchor schema follows
  rerank:
  `post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`;
- latest landed project/user measured wall `Rw` anchor schema follows
  rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- latest landed project/user measured wall `Rw` anchor schema follows
  rerank status:
  `post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_project_user_measured_wall_rw_anchor_schema_fingerprint`;
- latest landed project/user measured wall `Rw` anchor schema follows
  packet:
  `post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`;
- latest landed project/user measured wall `Rw` anchor schema follows
  packet file:
  `packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- latest landed project/user measured wall `Rw` anchor schema follows
  packet status:
  `post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed project/user measured wall `Rw` anchor schema previous
  packet candidate:
  `wall.opening_leak_common_wall_same_basis_holdout_packet`;
- latest landed project/user measured wall `Rw` anchor schema counters:
  `sharedDomainFilesTouched: 3`,
  `newExactMeasuredAnchorInputFamilies: 1`,
  `activeMeasuredAnchorCandidateSchemas: 1`,
  `canonicalFingerprintBuilders: 1`,
  `estimateRequestSchemaChanged: 0`, `engineRuntimeFilesTouched: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed project/user measured wall `Rw` anchor schema selected
  next action:
  `post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`;
- latest landed project/user measured wall `Rw` anchor schema selected
  next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-rw-anchor-schema-fingerprint-contract.test.ts`;
- latest landed project/user measured wall `Rw` anchor schema selected
  next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_RW_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`;
- latest landed project/user measured wall `Rw` anchor schema selected
  next label:
  `post-V1 runtime-first route-family rerank after project/user measured wall Rw anchor schema + fingerprint`;
- latest landed runtime-first rerank after wall opening/leak common-wall
  same-basis holdout packet:
  `post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`;
- latest landed runtime-first rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- latest landed runtime-first rerank status:
  `post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_project_user_measured_wall_rw_anchor_schema_fingerprint`;
- latest landed runtime-first rerank selected candidate:
  `project_user_measured_wall_rw_anchor_schema_fingerprint`;
- latest landed runtime-first rerank follows packet:
  `post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`;
- latest landed runtime-first rerank follows packet file:
  `packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- latest landed runtime-first rerank follows packet status:
  `post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed runtime-first rerank previous packet candidate:
  `wall.opening_leak_common_wall_same_basis_holdout_packet`;
- latest landed runtime-first rerank counters:
  `candidateCount: 9`, `roiAnalysisIterations: 4`,
  `estimatedNextExactMeasuredAnchorInputFamilies: 1`,
  `estimatedNextSharedDomainFilesTouched: 1`,
  `estimatedNextRuntimeValuesMovedAfterBridge: 1`,
  `acceptedSameBasisHoldoutRows: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed runtime-first rerank selected next action:
  `post_v1_project_user_measured_wall_rw_anchor_schema_fingerprint_plan`;
- latest landed runtime-first rerank selected next file:
  `packages/shared/src/domain/project-user-measured-source-anchor.test.ts`;
- latest landed runtime-first rerank selected next plan:
  `docs/calculator/POST_V1_PROJECT_USER_MEASURED_WALL_RW_ANCHOR_SCHEMA_FINGERPRINT_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank selected next label:
  `post-V1 project/user measured wall Rw anchor schema + fingerprint`;
- latest landed wall opening/leak common-wall same-basis holdout packet:
  `post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`;
- latest landed wall opening/leak common-wall same-basis holdout packet
  file:
  `packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- latest landed wall opening/leak common-wall same-basis holdout packet
  status:
  `post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed wall opening/leak common-wall same-basis holdout packet
  plan:
  `docs/calculator/POST_V1_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md`;
- latest opening/leak common-wall selected candidate:
  `wall.opening_leak_common_wall_same_basis_holdout_packet`;
- latest opening/leak common-wall packet counters:
  `evidencePacketsReviewed: 1`, `localCandidateRowsReviewed: 7`,
  `benchmarkOnlyRows: 4`, `rejectedCandidateRows: 3`,
  `acceptedSameBasisHoldoutRows: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest opening/leak common-wall packet selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`;
- latest opening/leak common-wall packet selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- latest opening/leak common-wall packet selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md`;
- latest opening/leak common-wall packet selected next label:
  `post-V1 runtime-first route-family rerank after wall opening/leak common-wall same-basis holdout packet`;
- latest landed runtime-first rerank after wall timber-stud + CLT
  formula building lab-companion basis integrity:
  `post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_plan`;
- latest landed runtime-first rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts`;
- latest landed runtime-first rerank status:
  `post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_landed_no_runtime_selected_wall_opening_leak_common_wall_same_basis_holdout_packet`;
- latest landed runtime-first rerank selected candidate:
  `wall.opening_leak_common_wall_same_basis_holdout_packet`;
- latest landed runtime-first rerank selected next action:
  `post_v1_wall_opening_leak_common_wall_same_basis_holdout_packet_plan`;
- latest landed runtime-first rerank selected next file:
  `packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts`;
- latest landed runtime-first rerank selected next plan:
  `docs/calculator/POST_V1_WALL_OPENING_LEAK_COMMON_WALL_SAME_BASIS_HOLDOUT_PACKET_PLAN_2026-06-18.md`;
- latest landed runtime-first rerank selected next label:
  `post-V1 wall opening/leak common-wall same-basis holdout packet`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity coverage refresh:
  `post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity coverage refresh file:
  `packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity coverage refresh status:
  `post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity coverage refresh plan:
  `docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest building lab-companion coverage selected candidate:
  `wall.timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`;
- latest building lab-companion coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- latest building lab-companion coverage values and boundaries:
  timber-stud `Rw 50`, `STC 50`, `C 0.5`, `Ctr -4.2`; CLT `Rw 42`,
  `STC 43`, `C -1.1`, `Ctr -7.1`; Gate AR building values,
  exact/source LSF boundaries, missing building input, ASTM
  unsupported, and impact `needs_input` boundaries remain protected.
- latest building lab-companion coverage selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_plan`;
- latest building lab-companion coverage selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts`;
- latest building lab-companion coverage selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md`;
- latest building lab-companion coverage selected next label:
  `post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula building lab-companion basis integrity`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity owner:
  `post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_plan`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity owner file:
  `packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity owner status:
  `post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed wall timber-stud + CLT formula building lab-companion
  basis integrity owner plan:
  `docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md`;
- latest building lab-companion selected candidate:
  `wall.timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`;
- latest building lab-companion owner counters:
  `accuracyPromotedRequestShapes: 4`,
  `accuracyPromotedTargetOutputs: 8`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 8`,
  `runtimeBasisPromotions: 2`, `runtimeValuesMoved 16`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest building lab-companion owner selected next action:
  `post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest building lab-companion owner selected next file:
  `packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest building lab-companion owner selected next plan:
  `docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest building lab-companion owner selected next label:
  `post-V1 wall timber-stud + CLT formula building lab-companion basis integrity coverage refresh`;
- latest landed runtime-first rerank after wall timber-stud + CLT
  formula field lab-companion target-output independence:
  `post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan`;
- latest landed runtime-first rerank file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts`;
- latest landed runtime-first rerank status:
  `post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`;
- latest landed runtime-first rerank plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`;
- latest rerank selected candidate:
  `wall.timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`;
- latest rerank selected next action:
  `post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_plan`;
- latest rerank selected next file:
  `packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest rerank selected next plan:
  `docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md`;
- latest rerank selected next label:
  `post-V1 wall timber-stud + CLT formula building lab-companion basis integrity owner`;
- latest rerank counters:
  `candidateCount: 9`, `roiAnalysisIterations: 4`,
  `estimatedNextAccuracyPromotedRequestShapes: 4`,
  `estimatedNextAccuracyPromotedTargetOutputs: 8`,
  `estimatedNextNewCalculableRequestShapes: 2`,
  `estimatedNextNewCalculableTargetOutputs: 8`,
  `estimatedNextRuntimeBasisPromotions: 2`,
  `estimatedNextRuntimeValuesMoved: 16`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence coverage refresh:
  `post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`;
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence coverage refresh file:
  `packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence coverage refresh status:
  `post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence coverage refresh plan:
  `docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest timber-stud + CLT coverage refresh follows owner:
  `post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_plan`
  /
  `packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`
  /
  `post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest timber-stud + CLT coverage refresh previous coverage:
  `post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`
  /
  `post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest timber-stud + CLT coverage refresh previous rerank:
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`;
- latest timber-stud + CLT coverage refresh selected candidate:
  `wall.timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`;
- latest timber-stud + CLT coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- latest timber-stud + CLT coverage refresh values:
  timber-stud lab companions `Rw 50`, `STC 50`, `C 0.5`, `Ctr -4.2`;
  timber-stud field outputs `R'w 42`, `Dn,w 42`, `DnT,w 43`,
  `DnT,A 43.9`; CLT lab companions `Rw 42`, `STC 43`, `C -1.1`,
  `Ctr -7.1`; CLT field outputs `R'w 41`, `Dn,w 41`, `DnT,w 42`,
  and `DnT,A 40.7`;
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence owner:
  `post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_plan`;
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence owner file:
  `packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`;
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence owner status:
  `post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest landed wall timber-stud + CLT formula field lab-companion
  target-output independence owner plan:
  `docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-17.md`;
- latest timber-stud + CLT owner follows rerank:
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`;
- latest timber-stud + CLT selected candidate:
  `wall.timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`;
- latest timber-stud + CLT owner counters:
  `accuracyPromotedRequestShapes: 4`,
  `accuracyPromotedTargetOutputs: 8`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 3`,
  `runtimeBasisPromotions: 2`, `runtimeValuesMoved 6`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest timber-stud + CLT owner values:
  timber-stud lab companions `Rw 50`, `STC 50`, `C 0.5`, `Ctr -4.2`;
  timber-stud field outputs `R'w 42`, `Dn,w 42`, `DnT,w 43`,
  `DnT,A 43.9`; CLT lab companions `Rw 42`, `STC 43`, `C -1.1`,
  `Ctr -7.1`; CLT field outputs `R'w 41`, `Dn,w 41`, `DnT,w 42`,
  and `DnT,A 40.7`;
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula field lab-companion target-output independence`;
- latest landed wall user-material formula field lab-companion
  target-output independence coverage refresh:
  `post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`;
- latest landed wall user-material formula field lab-companion
  target-output independence coverage refresh file:
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed wall user-material formula field lab-companion
  target-output independence coverage refresh status:
  `post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed wall user-material formula field lab-companion
  target-output independence coverage refresh plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest target-output independence coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- latest target-output independence coverage values:
  `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after wall user-material formula field lab-companion target-output independence`;
- latest landed wall user-material formula field lab-companion
  target-output independence owner:
  `post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_plan`;
- latest landed wall user-material formula field lab-companion
  target-output independence owner file:
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`;
- latest landed wall user-material formula field lab-companion
  target-output independence owner status:
  `post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest landed wall user-material formula field lab-companion
  target-output independence owner plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-17.md`;
- latest target-output independence owner follows:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`
  and
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-basis-integrity-contract.test.ts`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_target_output_independence_owner`;
- latest target-output independence selected candidate:
  `wall.user_material_formula_field_lab_companion_target_output_independence_owner`;
- latest target-output independence rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextAccuracyPromotedRequestShapes: 2`,
  `estimatedNextAccuracyPromotedTargetOutputs: 4`,
  `estimatedNextRuntimeBasisPromotions: 1`,
  `estimatedNextRuntimeValuesMoved: 3`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`;
- latest target-output independence owner counters:
  `accuracyPromotedRequestShapes: 2`,
  `accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest target-output independence owner values:
  `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- current selected next action:
  `post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`;
- current selected next file:
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 wall user-material formula field lab-companion target-output independence coverage refresh`;
- latest landed wall user-material formula field lab-companion basis
  integrity coverage refresh:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest landed wall user-material formula field lab-companion basis
  integrity coverage refresh file:
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed wall user-material formula field lab-companion basis
  integrity coverage refresh status:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed wall user-material formula field lab-companion basis
  integrity coverage refresh plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest landed wall user-material formula field lab-companion basis
  integrity owner:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_plan`;
- latest landed wall user-material formula field lab-companion basis
  integrity owner file:
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest landed wall user-material formula field lab-companion basis
  integrity owner status:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest landed wall user-material formula field lab-companion basis
  integrity owner plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md`;
- latest field lab-companion owner follows:
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts`
  /
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`
  and
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-companion-completeness-contract.test.ts`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_basis_integrity_owner`;
- latest field lab-companion selected candidate:
  `wall.user_material_formula_field_lab_companion_basis_integrity_owner`;
- latest field lab-companion rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextAccuracyPromotedTargetOutputs: 4`,
  `estimatedNextRuntimeValuesMoved: 3`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`;
- latest field lab-companion owner counters:
  `accuracyPromotedRequestShapes: 2`,
  `accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest field lab-companion owner values:
  `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- latest field lab-companion coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
  This is not a broad source crawl.
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-basis-integrity-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after wall user-material formula field lab-companion basis integrity`;
- latest landed wall user-material formula companion completeness
  coverage refresh:
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan`;
- latest landed wall user-material formula companion completeness
  coverage refresh file:
  `packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts`;
- latest landed wall user-material formula companion completeness
  coverage refresh status:
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest landed wall user-material formula companion completeness
  coverage refresh plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest landed wall user-material formula companion completeness owner:
  `post_v1_wall_user_material_formula_companion_completeness_owner_plan`;
- latest landed wall user-material formula companion completeness owner
  file:
  `packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-owner-contract.test.ts`;
- latest landed wall user-material formula companion completeness owner
  status:
  `post_v1_wall_user_material_formula_companion_completeness_owner_landed_runtime_selected_coverage_refresh`;
- latest landed wall user-material formula companion completeness owner
  plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_OWNER_PLAN_2026-06-17.md`;
- latest wall owner follows:
  `post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts`
  /
  `post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_landed_no_runtime_selected_wall_user_material_formula_companion_completeness_owner`;
- that rerank followed:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest wall owner selected candidate:
  `wall.user_material_formula_companion_completeness_owner`;
- latest wall coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest rerank counters:
  `candidateCount: 9`, `roiAnalysisIterations: 4`,
  `estimatedNextRuntimeValuesMoved: 8`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`;
- latest wall owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 8`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 8`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest wall owner values:
  `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-companion-completeness-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after wall user-material formula companion completeness`;
- latest landed low-density exact ASTM lab-airborne impact target-output
  independence coverage refresh:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`;
- latest landed low-density exact ASTM lab-airborne impact target-output
  independence coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`;
- latest landed low-density exact ASTM lab-airborne impact target-output
  independence coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest coverage refresh follows:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest coverage refresh previous owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest coverage refresh selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after floor user-material low-density exact ASTM lab-airborne impact target-output independence`;
- latest landed low-density exact ASTM lab-airborne impact target-output
  independence owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_plan`;
- latest landed low-density exact ASTM lab-airborne impact target-output
  independence owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-owner-contract.test.ts`;
- latest landed low-density exact ASTM lab-airborne impact target-output
  independence owner status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence owner follows:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence predecessor owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence predecessor coverage:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest no-runtime rerank action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`;
- latest no-runtime rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`;
- latest no-runtime rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest no-runtime rerank counters:
  `candidateCount: 8`, `estimatedNextRuntimeValuesMoved: 7`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest runtime owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 4`,
  `newCalculableTargetOutputs: 7`, `runtimeBasisPromotions: 4`,
  `runtimeValuesMoved 7`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- historical selected next action at the owner checkpoint:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`;
- historical selected next file at the owner checkpoint:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`;
- historical selected next plan at the owner checkpoint:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- historical selected next label at the owner checkpoint:
  `post-V1 floor user-material low-density exact ASTM lab-airborne impact target-output independence coverage refresh`;
- owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-16.md`;

- historical selected implementation action at the basis-integrity checkpoint:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`;
- historical selected implementation file at the basis-integrity checkpoint:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`;
- historical selected implementation plan at the basis-integrity checkpoint:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-16.md`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity coverage refresh:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM lab-airborne companion
  basis-integrity coverage refresh follows:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest low-density exact ASTM lab-airborne companion
  basis-integrity coverage refresh previous owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne companion
  basis-integrity coverage refresh selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest low-density exact ASTM lab-airborne companion
  basis-integrity coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`;
- current selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 next numeric coverage gap after floor user-material low-density exact ASTM lab-airborne companion basis-integrity`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity runtime owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity runtime owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity runtime owner status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne companion
  basis-integrity owner counters:
  `runtimeValuesMoved 4`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan`;
- current selected next file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 floor user-material low-density exact ASTM lab-airborne companion basis-integrity coverage refresh`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity rerank predecessor owner:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest landed low-density exact ASTM lab-airborne companion
  basis-integrity rerank predecessor coverage:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM lab-airborne companion
  basis-integrity selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest low-density exact ASTM lab-airborne companion
  basis-integrity rerank counters:
  `candidateCount: 9`, `estimatedNextRuntimeValuesMoved: 4`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`;
- current selected next file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 floor user-material low-density exact ASTM lab-airborne companion basis-integrity owner`;
- latest landed low-density exact ASTM field direct-flanking coverage refresh:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_plan`;
- latest landed low-density exact ASTM field direct-flanking coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts`;
- latest landed low-density exact ASTM field direct-flanking coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM field direct-flanking coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan`;
- current selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 next numeric coverage gap after floor user-material low-density exact ASTM field direct-flanking companion`;
- latest landed low-density exact ASTM field direct-flanking companion rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_plan`;
- latest landed low-density exact ASTM field direct-flanking companion rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-direct-flanking-companion-contract.test.ts`;
- latest landed low-density exact ASTM field direct-flanking companion rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner`;
- latest landed low-density exact ASTM field direct-flanking predecessor owner:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest landed low-density exact ASTM field direct-flanking predecessor coverage:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM field direct-flanking selected candidate:
  `floor.user_material_low_density_exact_astm_field_direct_flanking_companion_owner`;
- latest low-density exact ASTM field direct-flanking rerank counters:
  `candidateCount: 8`, `estimatedNextRuntimeValuesMoved: 6`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed low-density exact ASTM field direct-flanking runtime owner:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_plan`;
- latest landed low-density exact ASTM field direct-flanking runtime owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts`;
- latest landed low-density exact ASTM field direct-flanking runtime owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest landed low-density exact ASTM field direct-flanking runtime owner status:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM field direct-flanking owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 6`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 6`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_plan`;
- current selected next file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 floor user-material low-density exact ASTM field direct-flanking companion coverage refresh`;
- latest landed low-density exact ASTM direct-flanking companion coverage refresh:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan`;
- latest landed low-density exact ASTM direct-flanking companion coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts`;
- latest landed low-density exact ASTM direct-flanking companion coverage refresh plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest landed low-density exact ASTM direct-flanking companion coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM direct-flanking coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_plan`;
- current selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-direct-flanking-companion-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 next numeric coverage gap after floor user-material low-density exact ASTM direct-flanking companion`;
- latest landed low-density exact ASTM direct-flanking companion rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`;
- latest landed low-density exact ASTM direct-flanking companion rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`;
- latest landed low-density exact ASTM direct-flanking companion rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner`;
- latest landed low-density exact ASTM direct-flanking companion rerank predecessor:
  `post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest landed low-density exact ASTM direct-flanking companion coverage predecessor:
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM direct-flanking selected candidate:
  `floor.user_material_low_density_exact_astm_direct_flanking_companion_owner`;
- latest low-density exact ASTM direct-flanking rerank counters:
  `candidateCount: 8`, `estimatedNextRuntimeValuesMoved: 17`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed low-density exact ASTM direct-flanking runtime owner:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`;
- latest landed low-density exact ASTM direct-flanking runtime owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts`;
- latest landed low-density exact ASTM direct-flanking runtime owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest landed low-density exact ASTM direct-flanking runtime owner status:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM direct-flanking owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 17`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 17`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan`;
- current selected next file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 floor user-material low-density exact ASTM direct-flanking companion coverage refresh`;
- latest landed low-density exact ASTM companion coverage refresh:
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`;
- latest landed low-density exact ASTM companion coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`;
- latest landed low-density exact ASTM companion coverage refresh plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest landed low-density exact ASTM companion coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest landed low-density exact ASTM companion runtime owner:
  `post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`;
- latest landed low-density exact ASTM companion runtime owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`;
- latest landed low-density exact ASTM companion runtime owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest landed low-density exact ASTM companion runtime owner status:
  `post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM predecessor rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_companion_owner`;
- latest low-density exact ASTM predecessor coverage refresh:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM selected candidate:
  `floor.user_material_low_density_exact_astm_companion_owner`;
- latest low-density exact ASTM rerank counters:
  `candidateCount: 11`, `estimatedNextRuntimeValuesMoved: 12`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest low-density exact ASTM owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 10`, `runtimeBasisPromotions: 4`,
  `runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`;
- current selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 next numeric coverage gap after floor user-material low-density exact ASTM companion`;
- latest landed field impact companion coverage refresh:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`;
- latest landed field impact companion coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`;
- latest landed field impact companion coverage refresh status:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest landed field impact companion coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`;
- current selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band field impact companion`;
- latest landed field impact companion runtime owner:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan`;
- latest landed field impact companion runtime owner file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`;
- latest landed field impact companion runtime owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest landed field impact companion runtime owner status:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest field impact companion selected candidate:
  `floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner`;
- latest field impact companion owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 6`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 6`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest field impact companion predecessor rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner`;
- latest field impact companion predecessor rerank counters:
  `candidateCount: 10`, `estimatedNextRuntimeValuesMoved: 6`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest field impact companion selected coverage refresh:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`
  /
  `post-V1 floor user-material visible floating ASTM exact-band field impact companion coverage refresh`;
- latest landed runtime owner:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`;
- latest landed runtime owner file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`;
- latest landed runtime owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest landed runtime owner status:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest landed coverage refresh:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan`;
- latest landed coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`;
- latest landed coverage refresh plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest landed coverage refresh status:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest landed coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan`;
- current selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band mixed ISO companion`;
- previous landed coverage refresh:
  `post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`;
- previous landed coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`;
- previous landed coverage refresh plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- previous landed coverage refresh status:
  `post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest landed no-runtime rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`;
- latest landed no-runtime rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`;
- latest landed no-runtime rerank plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_PLAN_2026-06-16.md`;
- latest landed no-runtime rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`;
- previous landed no-runtime rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`;
- previous landed no-runtime rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`;
- previous landed no-runtime rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner`;
- previous rerank counters: `candidateCount 8`,
  `estimatedNextRuntimeBasisPromotions: 1`,
  `estimatedNextRuntimeValuesMoved: 2`,
  `estimatedNextCalculableRequestShapes: 1`,
  `estimatedNextCalculableTargetOutputs: 4`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest rerank predecessor owner:
  `post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest rerank predecessor coverage refresh:
  `post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- historical heavy-airborne selected candidate:
  `floor.user_material_visible_floating_heavy_airborne_companion_owner`;
- selected candidate:
  `floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`;
- latest mixed ASTM/ISO owner counters: `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 12`,
  `runtimeBasisPromotions: 2`, `runtimeValuesMoved 12`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest selected coverage refresh:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest owner counters: `accuracyPromotedRequestShapes: 1`,
  `accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- latest rerank counters: `candidateCount 9`,
  `roiAnalysisIterations: 4`, `estimatedNextRuntimeBasisPromotions: 2`,
  `estimatedNextRuntimeValuesMoved: 12`,
  `estimatedNextCalculableRequestShapes: 2`,
  `estimatedNextCalculableTargetOutputs: 12`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`. This is not a broad source
  crawl.
- current constraint: implement only the selected post-refresh numeric
  coverage-gap rerank unless the user explicitly redirects. Subtract the
  closed visible floating load-basis, mixed lab-companion, heavy airborne
  companion, and exact ASTM mixed ISO companion lanes. Select the next
  highest-ROI calculator slice only when it improves scope, accuracy,
  formula ownership, input capture, or metric/basis integrity. Do not
  broaden to UI, source crawling, formula retuning without evidence,
  low-frequency defaults, CI defaults, or generic ASTM `IIC` / `AIIC`
  aliasing.
- latest pushed calculator implementation checkpoint:
  `2637679 feat(engine): support low-density floating floor calculations`;
- latest analysis-only calculator excellence and cleanup review:
  `docs/calculator/CALCULATOR_EXCELLENCE_AND_CLEANUP_REVIEW_2026-06-15.md`;
- previous surface-parity checkpoint: `docs/calculator/CHECKPOINT_2026-06-11_DIRECT_FIXED_A_WEIGHTED_SURFACE_PARITY.md`;
- historical direct-fixed rerank: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`;
- historical user-material route-input runtime owner: `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`;
- historical user-material route-input coverage refresh: `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`;
- latest post-user-material rerank: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`;
- latest user-material missing-topology owner: `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`;
- latest post-missing-topology rerank: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`;
- latest porous flow-resistivity input owner: `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`;
- latest porous flow-resistivity coverage refresh: `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`;
- latest post-flow numeric coverage-gap rerank: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`;
- latest floor user-material impact context dynamic-stiffness owner: `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`;
- latest floor user-material impact context dynamic-stiffness coverage refresh: `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`;
- latest floor user-material impact context field-only adapter rerank: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`;
- latest floor user-material impact context field-only adapter rerank plan: `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`;
- latest floor user-material impact context field-only adapter owner: `packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`;
- latest floor user-material impact context field-only adapter owner plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_OWNER_PLAN_2026-06-15.md`;
- latest floor user-material impact context field-only adapter coverage refresh: `packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`;
- latest floor user-material impact context field-only adapter coverage refresh plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-15.md`;
- latest floor user-material low-density rerank: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`;
- latest floor user-material low-density rerank plan: `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_PLAN_2026-06-15.md`;
- latest floor user-material low-density owner: `packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`;
- latest floor user-material low-density owner plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_OWNER_PLAN_2026-06-15.md`;
- latest floor user-material low-density coverage refresh: `packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`;
- latest floor user-material low-density coverage refresh plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_COVERAGE_REFRESH_PLAN_2026-06-15.md`;
- latest floor user-material low-density post-refresh rerank action: `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`;
- latest floor user-material low-density post-refresh rerank file: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-floating-floor-family-contract.test.ts`;
- latest floor user-material low-density post-refresh rerank plan: `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_PLAN_2026-06-15.md`;
- latest floor user-material visible floating load-basis owner: `packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`;
- latest floor user-material visible floating load-basis owner plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_OWNER_PLAN_2026-06-15.md`;
- latest floor user-material visible floating load-basis coverage refresh: `packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts`;
- latest floor user-material visible floating load-basis coverage refresh plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_COVERAGE_REFRESH_PLAN_2026-06-15.md`;
- latest floor user-material visible floating load-basis post-refresh rerank action: `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan`;
- latest floor user-material visible floating load-basis post-refresh rerank file: `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts`;
- latest floor user-material visible floating load-basis post-refresh rerank plan: `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_PLAN_2026-06-16.md`;
- latest floor user-material visible floating mixed lab-companion owner: `packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`;
- latest floor user-material visible floating mixed lab-companion owner plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest floor user-material visible floating mixed lab-companion coverage refresh: `packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`;
- latest floor user-material visible floating mixed lab-companion coverage refresh plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest floor user-material visible floating mixed lab-companion post-refresh rerank plan: `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_PLAN_2026-06-16.md`;
- latest floor user-material visible floating heavy airborne companion owner action:
  `post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan`;
- latest floor user-material visible floating heavy airborne companion owner file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`;
- latest floor user-material visible floating heavy airborne companion owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest floor user-material visible floating heavy airborne companion coverage refresh action:
  `post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`;
- latest floor user-material visible floating heavy airborne companion coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`;
- latest floor user-material visible floating heavy airborne companion coverage refresh plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest floor user-material visible floating heavy airborne companion post-refresh rerank plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_PLAN_2026-06-16.md`;
- latest floor user-material visible floating heavy airborne companion post-refresh rerank action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`;
- latest floor user-material visible floating heavy airborne companion post-refresh rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`;
- latest floor user-material visible floating ASTM exact-band mixed ISO companion owner action:
  `post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`;
- latest floor user-material visible floating ASTM exact-band mixed ISO companion owner file:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`;
- latest floor user-material visible floating ASTM exact-band mixed ISO companion owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest floor owner action: `post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`;
- latest floor coverage refresh action: `post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`;
- latest floor field-only rerank action: `post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`;
- latest floor field-only owner action: `post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`;
- latest floor field-only coverage refresh action: `post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`;
- latest floor low-density rerank action: `post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`;
- latest floor low-density owner action: `post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`;
- latest floor low-density coverage refresh action: `post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`;
- latest floor visible floating load-basis owner action: `post_v1_floor_user_material_visible_floating_load_basis_owner_plan`;
- latest floor visible floating load-basis coverage refresh action: `post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan`;
- latest floor visible floating mixed lab-companion owner action: `post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`;
- latest floor visible floating mixed lab-companion coverage refresh action: `post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`;
- latest post-flow rerank status:
  `post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`;
- latest floor owner status:
  `post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`;
- latest floor coverage refresh status:
  `post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest floor field-only rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`;
- latest floor field-only owner status:
  `post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`;
- latest floor field-only coverage refresh status:
  `post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest floor low-density rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`;
- latest floor low-density owner status:
  `post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`;
- latest floor low-density coverage refresh status:
  `post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest floor visible floating load-basis owner status:
  `post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh`;
- latest floor visible floating load-basis coverage refresh status:
  `post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest floor visible floating load-basis post-refresh rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_landed_no_runtime_selected_floor_user_material_visible_floating_mixed_lab_companion_owner`;
- latest floor visible floating mixed lab-companion owner status:
  `post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest floor visible floating mixed lab-companion coverage refresh status:
  `post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest floor visible floating mixed lab-companion post-refresh rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner`;
- latest floor visible floating heavy airborne companion owner status:
  `post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest floor visible floating heavy airborne companion coverage refresh status:
  `post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest floor visible floating heavy airborne companion post-refresh rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`;
- next action: `post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`;
- next plan: `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_OWNER_PLAN_2026-06-16.md`;
- next file: `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`;
- closed candidate: `floor.user_material_impact_context_dynamic_stiffness_owner`;
- historical visible floating load-basis selected candidate: `floor.user_material_visible_floating_load_basis_owner`;
- historical mixed lab-companion selected candidate:
  `floor.user_material_visible_floating_mixed_lab_companion_owner`;
- selected candidate:
  `floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`;
- next status: selected runtime owner after heavy airborne companion
  post-refresh rerank;
- constraint: preserve exact ASTM impact ratings while restoring the
  owned ISO impact and heavy-airborne companion outputs for the same
  custom visible floating-floor stack. Do not import broad source rows,
  retune formulas without evidence, add material-editor UI, invent
  CI/CI50/field context, broaden low-density support, or alias ASTM
  impact outputs.
- latest mixed lab-companion coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`.
- temporary cleanup pause: local Playwright cleanup, Playwright env
  caps, narrow engine runtime export plus web route import migration,
  tsconfig cleanup, and stale generated `.next-*` cleanup may happen
  before the next runtime slice. Treat them as tooling hygiene only.
  Stop if they alter calculator API output shape, metric IDs, basis
  IDs, route selection, saved replay/report behavior, current-gate
  registration, calculator coverage, or project-wide Next type glue.
  In particular, do not commit `apps/web/next-env.d.ts` while it points
  at a transient `.next-playwright-*` routes file instead of the normal
  generated Next route types.

The post-flow rerank ran `roiAnalysisIterations: 3` with
`candidateCount 11`, `estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 2`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. The landed floor owner counters
are `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. The floor coverage refresh
counters are `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl. Historical entries later in this
brief keep older selected-next chains for traceability. Use the fast
path above as the current handoff.

The field-only rerank ran `roiAnalysisIterations: 4` with
`candidateCount 12`, `estimatedNextRuntimeValuesMoved: 3`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Mixed custom floor requests
already calculate `Ln,w 50.3`, `DeltaLw 24.3`, `L'n,w 52.3`,
`L'nT,w 49.9`, and `L'nT,50 52.9`; direct field-only requests are the
selected runtime gap. This is not a broad source crawl.

The field-only owner moved `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. It landed direct field-only
custom heavy floating-floor values at `L'n,w 52.3`, `L'nT,w 49.9`, and
`L'nT,50 52.9` from the existing `Ln,w 50.3` / `DeltaLw 24.3` lab
anchor. This is not a broad source crawl.

The low-density rerank ran `roiAnalysisIterations: 4` with
`candidateCount 9`, selected
`floor.user_material_low_density_floating_floor_family_owner`, and
rejected CI50 defaulting, generic `IIC`/`AIIC` aliasing, broad source
crawl, and UI work. The owner moved
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 6`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
It calculates `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`, `L'n,w 66.3`,
`L'nT,w 63.9`, and `L'nT,50 66.9` for a custom visible low-density
concrete floating-floor stack through the lightweight-concrete family,
DeltaLw, and field-adapter corridors.

The low-density coverage refresh
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`
/
`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`.
It re-probes
`floor.user_material_low_density_floating_floor_family_owner` without
moving runtime values. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

The field-only coverage refresh
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
It re-probes
`floor.user_material_impact_context_field_only_adapter_owner` without
moving runtime values. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Latest User-Material Porous Flow-Resistivity Input Coverage Refresh

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`
and the prior rerank
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`.
It closes
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`
without moving values: numeric user flow, explicit engineering default,
and context-owned absorber flow remain pinned; missing user/unknown
`flowResistivityPaSM2` remains `needs_input`. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next action:
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`.
Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md`.
Selected next label:
`post-V1 next numeric coverage gap after user-material porous flow-resistivity input`.

## Latest User-Material Porous Flow-Resistivity Input Owner

Historical start was
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`.
The owner
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`.
It owns
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`.
Numeric user-supplied porous flow remains calculable; explicit
engineering-default flow remains calculable with widened budget;
context-owned absorber flow remains accepted; and missing user-supplied
or unknown `flowResistivityPaSM2` stays at `needs_input` for lab, field,
and building requests. Counters include `accuracyBoundaryRowsMoved: 2`,
`needsInputBoundaryRowsAdded: 1`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed user-material porous flow-resistivity input coverage refresh`.

## Latest Post-Missing-Topology Numeric Gap Rerank

Historical start was
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`.
The rerank
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`.
It follows
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`.
It selected
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`
after `roiAnalysisIterations: 3`. Counters include
`candidateCount 10`, `estimatedNextAccuracyBoundaryRowsMoved: 2`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesProtectedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed user-material porous flow-resistivity input owner`.

## Latest User-Material Missing-Topology Input-Surface Owner

Start next with
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`.
The previous owner
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`.
It owns
`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`.
Explicit custom user-material double-leaf/framed stacks still calculate
lab `Rw 46 / STC 46 / C -1 / Ctr -6.1` and field/building
`R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`; missing
topology asks for `sideALeafGroup`, `cavity1DepthMm`, `sideBLeafGroup`,
`frameBridgeClass`, `supportTopology`, and `supportSpacingMm` instead of
guessing support details. Counters:
`inputSurfaceOwnerContractFilesTouched: 1`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md`.
Selected next label:
`post-V1 next numeric coverage gap after user-material missing-topology input surface`.

## Latest Post-User-Material Numeric Gap Rerank

Historical start was
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`.
The previous rerank
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner`.
It selected
`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`
after `roiAnalysisIterations: 3`. Counters include
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_OWNER_PLAN_2026-06-12.md`.
Selected next label:
`post-V1 wall double-leaf/framed user-material missing-topology input-surface owner`.

## Latest User-Material Double-Leaf Route-Input Owner

Historical start was
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`.
The previous rerank
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner`.
It selected `wall.double_leaf_framed.user_material_route_input_owner`
after `roiAnalysisIterations: 3`; counters include
`estimatedNextRuntimeValuesMoved: 12`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

The runtime owner
`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh`.
Custom explicit user-material double-leaf/framed stacks now calculate
lab `Rw 46 / STC 46 / C -1 / Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and field/building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 /
DnT,A 41.9` through Gate I / Gate AR. Unknown custom material IDs,
ASTM/IIC/AIIC, and impact outputs remain outside the owner. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 3`,
`newCalculableTargetOutputs: 12`, `runtimeBasisPromotions: 3`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 0`. This is not a broad source
crawl.

The coverage refresh
`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It re-probes lab `Rw 46 / STC 46 / C -1 / Ctr -6.1`,
field `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`,
and building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 /
DnT,A 41.9`. Unknown custom material IDs, missing explicit topology,
ASTM/IIC/AIIC, and impact outputs remain outside the owner. This is not
a broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md`.
Selected next label:
`post-V1 next numeric coverage gap after user-material route input`.

## Latest Direct-Fixed A-Weighted Field/Building Coverage Refresh

Start with
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`.
The previous coverage refresh
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
The refresh re-probes empty direct-fixed `Dn,A 24.9` / `DnT,A 27`,
full absorptive `Dn,A 28.9` / `DnT,A 31`, and partial absorptive
`Dn,A 26.9` / `DnT,A 29`. Field uses
`gate_i_airborne_field_apparent_context_adapter_runtime`; building uses
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
keep `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO base curve. The Gate I / Gate AR rows remain
`ready_with_budget` and `allowed_with_budget`. Missing absorber
ownership, Gate AY panelized input, non-direct-fixed stacks, lab
aliases, ASTM/IIC/AIIC, and impact outputs remain outside this route.
This is not a broad source crawl. Counters:
`coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-12.md`.
Selected next label:
`post-V1 next numeric coverage gap after direct-fixed A-weighted field/building`.

## Checkpoint - 2026-06-11

Current reconciliation checkpoint:

`docs/calculator/CHECKPOINT_2026-06-11_DIRECT_FIXED_A_WEIGHTED_SURFACE_PARITY.md`

The checkpoint compares the active docs with the current implementation,
records the passing validation state, and confirms that the selected
next action at that checkpoint was the direct-fixed A-weighted
field/building coverage refresh. That refresh is now closed, and the
selected next contract file is now:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`

## Latest Direct-Fixed A-Weighted Field/Building Surface Parity

Start with
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`.
The previous surface parity
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now keep direct-fixed A-only values aligned: empty
`Dn,A 24.9` / `DnT,A 27`, full absorptive `Dn,A 28.9` / `DnT,A 31`,
and partial absorptive `Dn,A 26.9` / `DnT,A 29`. Field uses
`gate_i_airborne_field_apparent_context_adapter_runtime`; building uses
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
use `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building coverage refresh`.

## Latest Direct-Fixed A-Weighted Field/Building Owner

Start with
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`.
The previous runtime owner
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
Runtime moved A-only direct-fixed `Dn,A` / `DnT,A` onto the Gate EO +
Gate I / Gate AR route: empty `24.9 / 27`, full absorptive
`28.9 / 31`, partial absorptive `26.9 / 29`. This is not a broad source
crawl. Counters: `newCalculableRequestShapes: 4`,
`correctedRequestShapes: 2`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_SURFACE_PARITY_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building surface parity`.

## Latest Numeric Gap After Direct-Fixed Context Absorptive Cavity Field/Building Adapter

Start with
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`.
The previous no-runtime rerank
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows the landed direct-fixed context-owned absorptive cavity
field/building adapter coverage refresh. The rerank ran
`roiAnalysisIterations: 3`, found that mixed base+A Gate ER requests
already calculate `Dn,A` / `DnT,A`, and selected the A-weighted owner
because A-only full/partial absorptive rows remain unsupported while
empty direct-fixed A-only rows can fall through a non-Gate-ER path. This
is not a broad source crawl. Counters: `candidateCount 7`,
`aWeightedOnlyUnsupportedRowsRechecked 4`,
`aWeightedOnlyMisroutedRowsRechecked 2`,
`estimatedNextRuntimeValuesMoved: 12`,
`immediateRuntimeValuesMoved: 0`, `runtimeBasisPromotions: 0`,
`runtimeFormulaRetunes: 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building owner`.

## Latest Direct-Fixed Context Absorptive Cavity Field/Building Adapter Coverage Refresh

Start with
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`.
The previous slice
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
Closed values are full `R'w 29`, `Dn,w 30`, `DnT,w 32` and partial
`R'w 27`, `Dn,w 28`, `DnT,w 30` on
`gate_i_airborne_field_apparent_context_adapter_runtime` /
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`, using
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO base curve. The coverage posture remains
`ready_with_budget` / `allowed_with_budget`. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 next numeric coverage gap after direct-fixed context absorptive cavity field/building adapter`.

## Latest Direct-Fixed Context Absorptive Cavity Field/Building Adapter Surface Parity

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
has landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now show the same values and basis: full `R'w 29`,
`Dn,w 30`, `DnT,w 32`; partial `R'w 27`, `Dn,w 28`, `DnT,w 30`;
field basis `gate_i_airborne_field_apparent_context_adapter_runtime`;
building basis
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`;
base curve `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter coverage refresh`.

## Latest Direct-Fixed Context Absorptive Cavity Field/Building Adapter Owner

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
The owner opens full/partial direct-fixed context-owned absorptive
cavity field/building outputs through
`gate_i_airborne_field_apparent_context_adapter_runtime` and
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`, using
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO base curve. Full absorptive values are `R'w 29`,
`Dn,w 30`, and `DnT,w 32`; partial absorptive values are `R'w 27`,
`Dn,w 28`, and `DnT,w 30`. Lab pins remain `Rw 35`, `STC 35`,
`C -1.2`, `Ctr -5.9`; `Rw 33`, `STC 33`, `C -1.2`, `Ctr -5.9`; and
`Rw 31`, `STC 31`, `C -1.2`, `Ctr -5.9`. This is not a broad source
crawl. Counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 3`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`.
Selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_SURFACE_PARITY_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter surface parity`.

## Latest Direct-Fixed Context Absorptive Cavity Coverage Refresh

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
The refresh keeps
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`
pinned: full `Rw 35`, `STC 35`, `C -1.2`, `Ctr -5.9`; partial
`Rw 33`, `STC 33`, `C -1.2`, `Ctr -5.9`; direct-fixed empty `Rw 31`,
`STC 31`, `C -1.2`, `Ctr -5.9`. It freezes the current numeric gap
where full/partial direct-fixed context-owned absorptive cavity
field/building requests remain unsupported through the Gate AY boundary.
This is not a broad source crawl. Counters:
`coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextRuntimeValuesMoved: 12`, and
`broadSourceCrawlSelected false`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter owner`.

## Latest Direct-Fixed Context Absorptive Cavity Surface Parity

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
has landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, output cards, target-output status, and report
summaries now expose
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full direct-fixed context-owned absorptive cavity remains `Rw 35`,
`STC 35`, `C -1.2`, `Ctr -5.9`; partial remains `Rw 33`, `STC 33`,
`C -1.2`, `Ctr -5.9`; direct-fixed empty remains `Rw 31`, `STC 31`,
`C -1.2`, `Ctr -5.9`. Missing absorber ownership, Gate AY panellized
inputs, field/building aliases, ASTM/IIC/AIIC, and impact outputs
remain outside this lab owner. This is not a broad source crawl.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner coverage refresh`.

## Latest Direct-Fixed Context Absorptive Cavity Owner

`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
The owner promotes complete element-lab direct-fixed context-owned
absorptive cavity two-leaf stacks from Gate AY `needs_input` to
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full absorptive cavity calculates `Rw 35`, `STC 35`, `C -1.2`,
`Ctr -5.9`; partial calculates `Rw 33`, `STC 33`, `C -1.2`,
`Ctr -5.9`; direct-fixed empty remains `Rw 31`, `STC 31`, `C -1.2`,
`Ctr -5.9`. Missing absorber ownership, Gate AY panellized inputs,
field/building aliases, ASTM/IIC/AIIC, and impact outputs remain outside
this lab owner. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Historical selected surface-parity follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`.
Historical surface-parity file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`.
Historical surface-parity plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`.
Historical surface-parity label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner surface parity`.

## Latest Context Absorptive Cavity Coverage Refresh

`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
has landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
It closes
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
The refresh freezes the double-leaf/framed source-absent route through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
as `ready_with_budget` / `allowed_with_budget`. Full context-owned
absorptive cavity remains `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`;
partial remains `Rw 44`, `STC 44`, `C -1`, `Ctr -6.1`; empty remains
`Rw 42`, `STC 42`, `C -1`, `Ctr -6.1`. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextNewCalculableRequestShapes: 1`,
`estimatedNextNewCalculableTargetOutputs: 4`, and
`estimatedNextRuntimeBasisPromotions: 1`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner`.
Route family: `wall.double_leaf_framed`. Target outputs: `Rw`, `STC`,
`C`, `Ctr`. Required physical inputs: side leaf groups, side leaf masses,
cavity depth, direct-fixed support topology, support spacing, absorptive
cavity coverage/class, and context-level absorber flow-resistivity
ownership. Expected scope: direct-fixed context-owned absorptive cavity
assemblies calculate through an owned direct-fixed bridge-loss formula
path instead of Gate AY `needs_input`.

## Previous Surface Parity Closeout

Latest landed surface parity:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`.
Surface parity file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`.
Surface parity status:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`
and
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
The surface keeps workbench live calculation, calculator API payloads,
saved replay, server snapshot replay, output cards, target-output status,
and report summaries aligned on `Rw 46`, `STC 46`, `C -1`, and
`Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action after that surface parity:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`.
Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner coverage refresh`.

Latest landed runtime owner:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`.
Owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`.
Owner status:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.

The owner opens context-owned full absorptive cavity double-leaf/framed
assemblies by mapping explicit absorber input to
`flowResistivitySource=user_supplied`. The pinned values are `Rw 46`,
`STC 46`, `C -1`, and `Ctr -6.1` on runtime basis
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Historical selected next action after that owner:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`.
Historical selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner surface parity`.

Latest landed closeout:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.
Closeout file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.
Closeout status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
It closes
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`.
The route freezes `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`,
remaining `ready_with_budget` / `allowed_with_budget`. This is not a
broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action after that route-input closeout:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`.
Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_PLAN_2026-06-11.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner`.
This is value-moving calculator work: route family
`wall.double_leaf_framed`, target outputs `Rw`, `STC`, `C`, and `Ctr`,
required physical inputs are side leaf groups, cavity depth,
non-direct-fixed support topology, support spacing, explicit absorptive
cavity coverage/class, and context-level absorber flow-resistivity
ownership. Expected scope: absorptive cavity assemblies calculate
without requiring a visible porous layer.

Document role: fastest safe handoff for a new calculator agent. Read this
first to understand the mission, current checkpoint, selected next action,
and non-negotiable boundaries. Then use
`CALCULATOR_SOURCE_OF_TRUTH.md`, `CURRENT_STATE.md`, and
`NEXT_IMPLEMENTATION_PLAN.md` for the full detail. For the current
product-goal reconciliation and the required value-moving follow-up shape,
read `CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md`.

## Mission

DynEcho must become an industry-grade acoustic calculator, not a catalog
of finite assemblies and not a documentation/process project. Users enter
wall, floor, or ceiling layer combinations and route-required physical
inputs; the engine should return defensible acoustic outputs such as `Rw`,
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `Ln,w`, `L'n,w`, `L'nT,w`,
`DeltaLw`, `IIC`, and `AIIC`.

Use this answer order:

1. exact owned measured/source row when available;
2. owned anchor, similarity, or same-basis measured path when the metric
   basis and construction boundary are proven;
3. dynamic formula route using the layer stack and required physical inputs;
4. precise `needs_input` or `unsupported` when ownership, metric basis, or
   physical input is missing.

A missing measured row is normal. It is not a reason to stop calculator
work or build a source-row library. Source research is useful only when it
feeds a bounded formula, measured-anchor delta, calibration/holdout, or
accuracy retune.

## Current Checkpoint

Latest commit at this handoff:
`5d2891d Land compatible anchor-delta building DnA checkpoint`.

Latest checkpoint:
`docs/calculator/CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md`.

Previous numeric gap action:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`.

Previous numeric gap file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.

Previous numeric gap status:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.

Latest value-moving runtime owner:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`.

Owner contract:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.

Owner status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.

What now calculates:

- Knauf `416889` compatible anchor-delta paired exterior-board building
  request: building `Dn,A 49.5`;
- Knauf `416889` compatible anchor-delta one-side exterior-board building
  request: building `Dn,A 48`;
- paired building `DnT,A 51.9` and one-side building `DnT,A 50.4` remain
  live on the same Gate AR route;
- field `Dn,A 49.5 / DnT,A 51.9` and one-side field
  `Dn,A 48 / DnT,A 50.4` remain live on the Gate I route.

What must stay pinned:

- lab aliases do not become field/building `Dn,A` or `DnT,A`;
- missing `buildingPredictionOutputBasis` remains `needs_input`;
- non-selected anchors remain outside this owner;
- ASTM/IIC/AIIC remain unsupported for this wall airborne route;
- no source rows were imported;
- no direct curve, Gate I, Gate AR, or ISO 717 adapter formula was retuned.

Counters for the landed owner: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

## Latest Owner And Selected Next

Latest landed closeout:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.

Closeout file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.

Closeout status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner`.

Closeout label:
`post-V1 wall compatible anchor-delta building Dn,A coverage refresh`.

This no-runtime closeout freezes the landed building `Dn,A` owner through
current-gate coverage, resolver registry/runtime candidate surfaces,
coverage matrix, and company-internal V0 expectations. It moves no runtime
values: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
`sourceRowsImported: 0`.

Latest landed value-moving owner:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`.

Owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.

Owner plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.

Owner status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity`.

Owner label:
`post-V1 wall compatible anchor-delta STC-only lab companion owner`.

This owner is value-moving. It opens only paired and one-side Knauf
`416889` STC-only element-lab request shapes from the already-owned
shifted direct curve: paired exterior-board `STC 59` and one-side
exterior-board `STC 57`. It does not claim measured STC evidence and
keeps direct `Rw`, mixed `Rw+STC/C/Ctr`, field/building, A-weighted,
C/Ctr-only, ASTM/IIC/AIIC, non-selected-anchor, and missing-input
boundaries pinned. Counters: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed compatible anchor-delta STC-only lab companion surface
parity:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.

Surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.

Surface parity plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

Surface parity label:
`post-V1 wall compatible anchor-delta STC-only lab companion surface parity`.

Surface parity status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.

Workbench live calculation, calculator API payloads, saved/server replay,
output cards, target-output status, and report summaries now carry paired
exterior-board `STC 59` and one-side exterior-board `STC 57` for the
supported Knauf compatible anchor-delta element-lab STC-only requests
through `wall.compatible_anchor_delta.calculated_lab_companions` on
runtime basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
This is not a broad source crawl.

Latest landed compatible anchor-delta STC-only lab companion coverage
refresh:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan`.

Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`.

Coverage refresh plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.

Coverage refresh label:
`post-V1 wall compatible anchor-delta STC-only lab companion coverage refresh`.

Coverage refresh status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_landed_no_runtime_selected_c_ctr_only_lab_companion_owner`.

The refresh freezes `STC 59` / `STC 57`, preserves direct `Rw`, mixed
`Rw+STC/C/Ctr`, field/building, A-weighted, C/Ctr-only, ASTM/IIC/AIIC,
non-selected-anchor, and missing-input boundaries, and keeps
`wall.compatible_anchor_delta.calculated_lab_companions` on runtime basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
visible as `ready_with_budget` / `allowed_with_budget`. This is not a
broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableRequestShapes: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextCalculableRequestShapes: 4`, and
`estimatedNextRuntimeBasisPromotions: 1`.

Latest landed compatible anchor-delta C/Ctr-only lab companion owner:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan`.

Owner file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`.

Owner plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.

Owner label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion owner`.

Owner status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_landed_runtime_selected_surface_parity`.

The owner is value-moving. Standalone C-only and Ctr-only element-lab
requests now calculate through the mixed lab companion route: paired
`C -1.1`, paired `Ctr -6`, one-side `C -0.6`, and one-side `Ctr -5.5`.
These are calculated values from the owned shifted curve, not measured
C/Ctr source evidence. Counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest landed compatible anchor-delta C/Ctr-only lab companion surface
parity:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`.

Surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`.

Surface parity plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.

Surface parity label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion surface parity`.

Surface parity status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.

The surface proves live calculation, calculator API payloads, saved
replay, server snapshot replay, output cards, target-output status, and
report summaries keep paired `C -1.1`, paired `Ctr -6`, one-side
`C -0.6`, and one-side `Ctr -5.5` aligned through
`wall.compatible_anchor_delta.calculated_lab_companions` on runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Latest landed compatible anchor-delta C/Ctr-only lab companion coverage
refresh:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_plan`.

Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts`.

Coverage refresh plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.

Coverage refresh label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion coverage refresh`.

Coverage refresh status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_landed_no_runtime_selected_wall_double_leaf_framed_route_input_runtime_widening`.

The refresh freezes paired `C -1.1`, paired `Ctr -6`, one-side
`C -0.6`, and one-side `Ctr -5.5` through
`wall.compatible_anchor_delta.calculated_lab_companions` on runtime basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
The route remains `ready_with_budget` in coverage and
`allowed_with_budget` in company-internal V0. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Latest landed route-input runtime widening:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan`.

Runtime owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts`.

Runtime owner plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_PLAN_2026-06-11.md`.

Runtime owner status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_landed_runtime_selected_surface_parity`.

Runtime owner label:
`post-V1 wall double-leaf/framed route-input runtime widening`.

What now calculates: context-only empty-cavity double-leaf/framed walls
where two visible board leaves plus explicit `cavity1DepthMm`,
`cavity1FillCoverage empty`, `cavity1AbsorptionClass none`, side leaf
groups, support topology, and support spacing calculate element-lab
`Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`.
Context-only absorptive cavities without a visible porous-fill layer
remain `needs_input` for `cavity1FillCoverage` and `absorberClass`.
Runtime declaration: route family `wall.double_leaf_framed`; target
outputs `Rw`, `STC`, `C`, and `Ctr`; required physical inputs include
side leaf groups, side leaf masses, cavity depth, absorber class/fill and
flow resistivity, support topology, support spacing, resilient side count
when needed, and bridge class.
expected scope movement: more board/panel/context-cavity
double-leaf/framed walls calculate through the owned formula route when
those inputs are present.
Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `frontendImplementationFilesTouched: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`, and
`sourceRowsImported: 0`.

Latest landed route-input surface parity:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`.

Surface parity file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts`.

Surface parity label:
`post-V1 wall double-leaf/framed route-input runtime widening surface parity`.

Surface parity status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`.

Surface parity closeout: live workbench calculation, calculator API,
saved replay, server snapshot replay, output cards, target-output status,
and report summaries preserve the context-only empty-cavity two-board
result `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1`. Missing cavity
classification stays `needs_input` for `cavity1FillCoverage` and
`absorberClass`; field/building aliases plus ASTM/IIC/AIIC remain outside
this owner. Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Historical selected next action after that surface parity:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.

Historical selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.

Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_COVERAGE_REFRESH_PLAN_2026-06-11.md`.

Historical selected next label:
`post-V1 wall double-leaf/framed route-input runtime widening coverage refresh`.

Do not skip directly to broad source crawling, report polish, auth/storage,
or UI polish. Those are outside the selected calculator slice unless they
directly unblock a named formula/input/anchor/calibration route.

## How To Proceed

1. Read this file, then `CALCULATOR_SOURCE_OF_TRUTH.md`, `CURRENT_STATE.md`,
   and the top/current section of `NEXT_IMPLEMENTATION_PLAN.md`.
2. Implement the selected double-leaf/framed route-input coverage
   refresh:
   `packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.
3. Start from the landed context-only empty-cavity runtime and surface
   shape and freeze it in resolver registry, runtime surface, coverage
   matrix, and company-internal V0 posture as the bounded source-absent
   formula route.
4. Preserve direct-fixed, thick-board Auto, field/building, ASTM/IIC/AIIC,
   grouped triple-leaf/multicavity, floor-impact, exact-source, and
   missing-input boundaries.
5. Run focused tests first, then `pnpm calculator:gate:current` before a
   checkpoint commit.

Expected focused tests after the next slice should include:

- `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`;
- `packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`;
- `packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`;
- `apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`;
- related compatible anchor-delta A-weighted and surface parity contracts.

Latest full validation at this handoff:

- `pnpm calculator:gate:current`;
- engine: 688 test files, 3810 tests passed;
- web: 119 test files, 464 tests passed and 18 skipped;
- repo build: 5 packages successful;
- whitespace guard passed.

Known non-fatal warnings: test-environment Zustand persist storage warning
and optional `sharp/@img` build warnings.
