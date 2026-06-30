import { z } from "zod";

import { RequestedOutputSchema } from "./output";
import { TransmissionLossCurveSchema } from "./rating";

export const AirborneContextModeSchema = z.enum(["element_lab", "field_between_rooms", "building_prediction"]);
export type AirborneContextMode = z.infer<typeof AirborneContextModeSchema>;

export const AirtightnessClassSchema = z.enum(["unknown", "good", "average", "poor"]);
export type AirtightnessClass = z.infer<typeof AirtightnessClassSchema>;

export const PerimeterSealClassSchema = z.enum(["unknown", "good", "average", "poor"]);
export type PerimeterSealClass = z.infer<typeof PerimeterSealClassSchema>;

export const PenetrationStateSchema = z.enum(["unknown", "none", "minor", "major"]);
export type PenetrationState = z.infer<typeof PenetrationStateSchema>;

export const JunctionQualitySchema = z.enum(["unknown", "good", "average", "poor"]);
export type JunctionQuality = z.infer<typeof JunctionQualitySchema>;

export const SharedTrackClassSchema = z.enum(["unknown", "shared", "independent"]);
export type SharedTrackClass = z.infer<typeof SharedTrackClassSchema>;

export const ElectricalBoxStateSchema = z.enum(["unknown", "none", "separated", "back_to_back", "many"]);
export type ElectricalBoxState = z.infer<typeof ElectricalBoxStateSchema>;

export const AirborneConnectionTypeSchema = z.enum([
  "auto",
  "none",
  "line_connection",
  "point_connection",
  "mixed_connection",
  "direct_fix",
  "resilient_channel"
]);
export type AirborneConnectionType = z.infer<typeof AirborneConnectionTypeSchema>;

export const AirborneStudTypeSchema = z.enum([
  "auto",
  "light_steel_stud",
  "resilient_stud",
  "wood_stud"
]);
export type AirborneStudType = z.infer<typeof AirborneStudTypeSchema>;

export const AirborneResilientBarSideCountSchema = z.enum(["auto", "one_side", "both_sides"]);
export type AirborneResilientBarSideCount = z.infer<typeof AirborneResilientBarSideCountSchema>;

export const AirborneFlankingJunctionClassSchema = z.enum([
  "unknown",
  "rigid_cross_junction",
  "rigid_t_junction",
  "lightweight_junction",
  "isolated_junction",
  "mixed_junction"
]);
export type AirborneFlankingJunctionClass = z.infer<typeof AirborneFlankingJunctionClassSchema>;

export const AirborneConservativeFlankingAssumptionSchema = z.enum([
  "unknown",
  "single_conservative_path",
  "multi_path_conservative",
  "worst_case_screening"
]);
export type AirborneConservativeFlankingAssumption = z.infer<
  typeof AirborneConservativeFlankingAssumptionSchema
>;

export const AirborneBuildingPredictionOutputBasisSchema = z.enum([
  "unknown",
  "apparent",
  "standardized",
  "apparent_and_standardized"
]);
export type AirborneBuildingPredictionOutputBasis = z.infer<
  typeof AirborneBuildingPredictionOutputBasisSchema
>;

export const AirborneOpeningRatingBasisSchema = z.enum([
  "unknown",
  "rw_single_number",
  "stc_single_number",
  "iso_717_1_curve",
  "catalog_row",
  "measured_lab"
]);
export type AirborneOpeningRatingBasis = z.infer<typeof AirborneOpeningRatingBasisSchema>;

export const AirborneOpeningSealLeakageClassSchema = z.enum([
  "unknown",
  "sealed",
  "average",
  "leaky",
  "open_gap"
]);
export type AirborneOpeningSealLeakageClass = z.infer<
  typeof AirborneOpeningSealLeakageClassSchema
>;

export const AirborneOpeningOriginSchema = z.enum(["unknown", "measured", "catalogued", "source_absent"]);
export type AirborneOpeningOrigin = z.infer<typeof AirborneOpeningOriginSchema>;

export const AirborneOpeningElementTypeSchema = z.enum([
  "unknown",
  "generic_opening",
  "door",
  "window",
  "facade_element",
  "louver",
  "penetration"
]);
export type AirborneOpeningElementType = z.infer<typeof AirborneOpeningElementTypeSchema>;

export const AirborneFacadeOutdoorContextSchema = z.enum([
  "unknown",
  "indoor_partition",
  "outdoor_indoor_facade"
]);
export type AirborneFacadeOutdoorContext = z.infer<typeof AirborneFacadeOutdoorContextSchema>;

export const AirborneOpeningFacadeBoundaryIntentSchema = z.enum([
  "door_window_facade_frequency_input_boundary"
]);
export type AirborneOpeningFacadeBoundaryIntent = z.infer<
  typeof AirborneOpeningFacadeBoundaryIntentSchema
>;

export const AirborneAdvancedWallPanelMaterialClassSchema = z.enum([
  "cement_board",
  "engineered_timber",
  "gypsum_board",
  "masonry_lining",
  "wood_board"
]);
export type AirborneAdvancedWallPanelMaterialClass = z.infer<
  typeof AirborneAdvancedWallPanelMaterialClassSchema
>;

export const AirborneAdvancedWallCavitySealStateSchema = z.enum(["average", "leaky", "sealed"]);
export type AirborneAdvancedWallCavitySealState = z.infer<
  typeof AirborneAdvancedWallCavitySealStateSchema
>;

export const AirborneAdvancedWallFrameMaterialClassSchema = z.enum(["light_steel", "timber", "mixed"]);
export type AirborneAdvancedWallFrameMaterialClass = z.infer<
  typeof AirborneAdvancedWallFrameMaterialClassSchema
>;

export const AirborneAdvancedWallResilientConnectionTypeSchema = z.enum([
  "direct_fixed",
  "independent_frame",
  "none",
  "resilient_channel"
]);
export type AirborneAdvancedWallResilientConnectionType = z.infer<
  typeof AirborneAdvancedWallResilientConnectionTypeSchema
>;

export const AirborneAdvancedWallOpeningIntentSchema = z.enum(["none", "present"]);
export type AirborneAdvancedWallOpeningIntent = z.infer<
  typeof AirborneAdvancedWallOpeningIntentSchema
>;

export const WallTopologyModeSchema = z.enum([
  "auto",
  "flat_layer_order",
  "double_leaf_framed",
  "grouped_triple_leaf",
  "lined_massive_wall",
  "mass_timber_panel"
]);
export type WallTopologyMode = z.infer<typeof WallTopologyModeSchema>;

export const WallInternalLeafCouplingSchema = z.enum([
  "unknown",
  "independent",
  "attached_to_side_a",
  "attached_to_side_b",
  "shared_stud_bridge",
  "direct_bridge"
]);
export type WallInternalLeafCoupling = z.infer<typeof WallInternalLeafCouplingSchema>;

export const WallCavityFillCoverageSchema = z.enum(["unknown", "empty", "partial", "full"]);
export type WallCavityFillCoverage = z.infer<typeof WallCavityFillCoverageSchema>;

export const WallCavityAbsorptionClassSchema = z.enum(["unknown", "none", "porous_absorptive"]);
export type WallCavityAbsorptionClass = z.infer<typeof WallCavityAbsorptionClassSchema>;

export const WallSupportTopologySchema = z.enum([
  "unknown",
  "independent_frames",
  "single_shared_stud",
  "twin_frame",
  "resilient_channel",
  "direct_fixed"
]);
export type WallSupportTopology = z.infer<typeof WallSupportTopologySchema>;

const WallLayerIndicesSchema = z.array(z.number().int().nonnegative()).min(1);

export const AirborneCeilingPlenumLeafGroupingSchema = z.enum([
  "single_leaf_below_plenum",
  "double_layer_single_leaf_below_plenum",
  "double_leaf_decoupled_plenum"
]);
export type AirborneCeilingPlenumLeafGrouping = z.infer<
  typeof AirborneCeilingPlenumLeafGroupingSchema
>;

export const AirborneCeilingPlenumSupportCouplingSchema = z.enum([
  "direct_fixed",
  "resilient_channel",
  "resilient_hanger",
  "isolated_hanger"
]);
export type AirborneCeilingPlenumSupportCoupling = z.infer<
  typeof AirborneCeilingPlenumSupportCouplingSchema
>;

export const AirborneRouteIntentSchema = z.enum([
  "unknown",
  "ceiling_airborne",
  "roof_airborne",
  "suspended_ceiling_airborne_lining",
  "suspended_ceiling_floor_impact_lower_treatment"
]);
export type AirborneRouteIntent = z.infer<typeof AirborneRouteIntentSchema>;

export const AirborneRoofOrCeilingMountingContextSchema = z.enum([
  "unknown",
  "indoor_ceiling",
  "roof_or_facade_element",
  "suspended_ceiling_below_floor",
  "ceiling_lining_below_roof"
]);
export type AirborneRoofOrCeilingMountingContext = z.infer<
  typeof AirborneRoofOrCeilingMountingContextSchema
>;

export const AirborneSuspendedCeilingIntentSchema = z.enum([
  "unknown",
  "not_suspended_ceiling",
  "airborne_ceiling_plenum",
  "floor_impact_lower_treatment",
  "both_require_separate_routes"
]);
export type AirborneSuspendedCeilingIntent = z.infer<
  typeof AirborneSuspendedCeilingIntentSchema
>;

const AirborneCeilingPlenumInputSchemaInternal = z.object({
  absorberFlowResistivityPaSM2: z.number().positive().optional(),
  absorberThicknessMm: z.number().positive().optional(),
  cavityOrPlenumDepthMm: z.number().positive().optional(),
  leafGrouping: AirborneCeilingPlenumLeafGroupingSchema.optional(),
  leafSurfaceMassKgM2: z.number().positive().optional(),
  supportCouplingOrHangerClass: AirborneCeilingPlenumSupportCouplingSchema.optional()
});
export type AirborneCeilingPlenumInput = z.infer<typeof AirborneCeilingPlenumInputSchemaInternal>;

export const AirborneCeilingPlenumInputSchema: z.ZodType<
  AirborneCeilingPlenumInput,
  z.ZodTypeDef,
  z.input<typeof AirborneCeilingPlenumInputSchemaInternal>
> = AirborneCeilingPlenumInputSchemaInternal;

const WallTopologySchemaInternal = z.object({
  cavity1AbsorptionClass: WallCavityAbsorptionClassSchema.optional(),
  cavity1DepthMm: z.number().positive().optional(),
  cavity1FillCoverage: WallCavityFillCoverageSchema.optional(),
  cavity1LayerIndices: WallLayerIndicesSchema.optional(),
  cavity2AbsorptionClass: WallCavityAbsorptionClassSchema.optional(),
  cavity2DepthMm: z.number().positive().optional(),
  cavity2FillCoverage: WallCavityFillCoverageSchema.optional(),
  cavity2LayerIndices: WallLayerIndicesSchema.optional(),
  internalLeafCoupling: WallInternalLeafCouplingSchema.optional(),
  internalLeafLayerIndices: WallLayerIndicesSchema.optional(),
  sideALeafLayerIndices: WallLayerIndicesSchema.optional(),
  sideBLeafLayerIndices: WallLayerIndicesSchema.optional(),
  supportTopology: WallSupportTopologySchema.optional(),
  topologyMode: WallTopologyModeSchema.optional()
});
export type WallTopology = z.infer<typeof WallTopologySchemaInternal>;

export const WallTopologySchema: z.ZodType<
  WallTopology,
  z.ZodTypeDef,
  z.input<typeof WallTopologySchemaInternal>
> = WallTopologySchemaInternal;

const AirborneOpeningLeakElementSchemaInternal = z.object({
  areaM2: z.number().positive().optional(),
  count: z.number().int().positive().optional(),
  elementType: AirborneOpeningElementTypeSchema.optional(),
  elementRwDb: z.number().positive().optional(),
  elementTransmissionLossCurve: TransmissionLossCurveSchema.optional(),
  frequencyBandSet: z.enum(["third_octave_100_3150", "one_third_octave_80_4000"]).optional(),
  id: z.string().min(1).optional(),
  origin: AirborneOpeningOriginSchema.optional(),
  ratingBasis: AirborneOpeningRatingBasisSchema.optional(),
  sealLeakageClass: AirborneOpeningSealLeakageClassSchema.optional()
});
export type AirborneOpeningLeakElement = z.infer<typeof AirborneOpeningLeakElementSchemaInternal>;

export const AirborneOpeningLeakElementSchema: z.ZodType<
  AirborneOpeningLeakElement,
  z.ZodTypeDef,
  z.input<typeof AirborneOpeningLeakElementSchemaInternal>
> = AirborneOpeningLeakElementSchemaInternal;

const AirborneAdvancedWallPanelSchemaInternal = z.object({
  bendingStiffnessNm: z.number().positive().optional(),
  criticalFrequencyHz: z.number().positive().optional(),
  id: z.string().min(1).optional(),
  layerIds: z.array(z.string().min(1)).min(1).optional(),
  leafId: z.string().min(1).optional(),
  lossFactor: z.number().positive().optional(),
  materialClass: AirborneAdvancedWallPanelMaterialClassSchema.optional(),
  sequence: z.number().positive().optional(),
  surfaceMassKgM2: z.number().positive().optional(),
  thicknessMm: z.number().positive().optional()
});
export type AirborneAdvancedWallPanel = z.infer<typeof AirborneAdvancedWallPanelSchemaInternal>;

export const AirborneAdvancedWallPanelSchema: z.ZodType<
  AirborneAdvancedWallPanel,
  z.ZodTypeDef,
  z.input<typeof AirborneAdvancedWallPanelSchemaInternal>
> = AirborneAdvancedWallPanelSchemaInternal;

const AirborneAdvancedWallCavitySchemaInternal = z.object({
  absorberCoverageRatio: z.number().min(0).max(1).optional(),
  absorberFlowResistivityPaSM2: z.number().positive().optional(),
  absorberThicknessMm: z.number().positive().optional(),
  depthMm: z.number().positive().optional(),
  id: z.string().min(1).optional(),
  sealState: AirborneAdvancedWallCavitySealStateSchema.optional(),
  sequence: z.number().positive().optional()
});
export type AirborneAdvancedWallCavity = z.infer<typeof AirborneAdvancedWallCavitySchemaInternal>;

export const AirborneAdvancedWallCavitySchema: z.ZodType<
  AirborneAdvancedWallCavity,
  z.ZodTypeDef,
  z.input<typeof AirborneAdvancedWallCavitySchemaInternal>
> = AirborneAdvancedWallCavitySchemaInternal;

const AirborneAdvancedWallFrameCouplingSchemaInternal = z.object({
  depthMm: z.number().positive().optional(),
  frameMaterialClass: AirborneAdvancedWallFrameMaterialClassSchema.optional(),
  lineCouplingStiffnessMNPerM3: z.number().positive().optional(),
  mechanicalBridgeAreaRatio: z.number().min(0).max(1).optional(),
  resilientConnectionStiffnessMNPerM3: z.number().positive().optional(),
  resilientConnectionType: AirborneAdvancedWallResilientConnectionTypeSchema.optional(),
  spacingMm: z.number().positive().optional()
});
export type AirborneAdvancedWallFrameCoupling = z.infer<
  typeof AirborneAdvancedWallFrameCouplingSchemaInternal
>;

export const AirborneAdvancedWallFrameCouplingSchema: z.ZodType<
  AirborneAdvancedWallFrameCoupling,
  z.ZodTypeDef,
  z.input<typeof AirborneAdvancedWallFrameCouplingSchemaInternal>
> = AirborneAdvancedWallFrameCouplingSchemaInternal;

const AirborneAdvancedWallOpeningSchemaInternal = z.object({
  areaM2: z.number().positive().optional(),
  count: z.number().positive().optional(),
  elementRwDb: z.number().positive().optional(),
  id: z.string().min(1).optional(),
  origin: z.enum(["catalogued", "measured"]).optional(),
  ratingBasis: z.enum(["measured_lab", "rw_single_number"]).optional(),
  sealLeakageClass: z.enum(["average", "leaky", "open_gap", "sealed"]).optional()
});
export type AirborneAdvancedWallOpening = z.infer<typeof AirborneAdvancedWallOpeningSchemaInternal>;

export const AirborneAdvancedWallOpeningSchema: z.ZodType<
  AirborneAdvancedWallOpening,
  z.ZodTypeDef,
  z.input<typeof AirborneAdvancedWallOpeningSchemaInternal>
> = AirborneAdvancedWallOpeningSchemaInternal;

const AirborneAdvancedWallInputSchemaInternal = z.object({
  cavities: z.array(AirborneAdvancedWallCavitySchema).optional(),
  directTransmissionCurveOwner: z.literal(true).optional(),
  duplicateOwnershipGuard: z.literal(true).optional(),
  exactSourcePrecedenceApplied: z.boolean().optional(),
  exactSourcePrecedenceCheck: z.literal(true).optional(),
  existingOwnedDelegateRoute: z.enum(["triple_leaf_two_cavity_frequency_solver"]).nullable().optional(),
  fieldBuildingAdapterBoundary: z.literal(true).optional(),
  frameCoupling: AirborneAdvancedWallFrameCouplingSchema.optional(),
  frequencyBandSet: z.enum(["third_octave_100_3150", "one_third_octave_80_4000"]).optional(),
  hostWallAreaM2: z.number().positive().optional(),
  iso717RwCAdapterOwner: z.literal(true).optional(),
  openingIntent: AirborneAdvancedWallOpeningIntentSchema.optional(),
  openings: z.array(AirborneAdvancedWallOpeningSchema).optional(),
  outputBasis: AirborneContextModeSchema.optional(),
  panels: z.array(AirborneAdvancedWallPanelSchema).optional(),
  sourceAbsentErrorBudgetOwner: z.literal(true).optional(),
  splitLayerGuard: z.literal(true).optional(),
  stcAdapterOwner: z.literal(true).optional(),
  targetOutputs: z.array(RequestedOutputSchema).optional(),
  wallSolverIntent: z.literal("advanced_source_absent_wall").optional()
});
export type AirborneAdvancedWallInput = z.infer<typeof AirborneAdvancedWallInputSchemaInternal>;

export const AirborneAdvancedWallInputSchema: z.ZodType<
  AirborneAdvancedWallInput,
  z.ZodTypeDef,
  z.input<typeof AirborneAdvancedWallInputSchemaInternal>
> = AirborneAdvancedWallInputSchemaInternal;

const AirborneContextShape = {
  advancedWall: AirborneAdvancedWallInputSchema.optional(),
  airtightness: AirtightnessClassSchema.optional(),
  ceilingPlenum: AirborneCeilingPlenumInputSchema.optional(),
  connectionType: AirborneConnectionTypeSchema.optional(),
  contextMode: AirborneContextModeSchema.optional(),
  electricalBoxes: ElectricalBoxStateSchema.optional(),
  junctionQuality: JunctionQualitySchema.optional(),
  panelHeightMm: z.number().positive().optional(),
  panelWidthMm: z.number().positive().optional(),
  sourceRoomVolumeM3: z.number().positive().optional(),
  penetrationState: PenetrationStateSchema.optional(),
  perimeterSeal: PerimeterSealClassSchema.optional(),
  receivingRoomRt60S: z.number().positive().optional(),
  receivingRoomVolumeM3: z.number().positive().optional(),
  resilientBarSideCount: AirborneResilientBarSideCountSchema.optional(),
  flankingJunctionClass: AirborneFlankingJunctionClassSchema.optional(),
  conservativeFlankingAssumption: AirborneConservativeFlankingAssumptionSchema.optional(),
  facadeOutdoorContext: AirborneFacadeOutdoorContextSchema.optional(),
  junctionCouplingLengthM: z.number().positive().optional(),
  buildingPredictionOutputBasis: AirborneBuildingPredictionOutputBasisSchema.optional(),
  frequencyBandSet: z.enum(["third_octave_100_3150", "one_third_octave_80_4000"]).optional(),
  hostWallAreaM2: z.number().positive().optional(),
  openingFacadeBoundaryIntent: AirborneOpeningFacadeBoundaryIntentSchema.optional(),
  openingLeakFieldBuildingAdapterBoundary: z.literal(true).optional(),
  openingLeakElements: z.array(AirborneOpeningLeakElementSchema).optional(),
  hangerOrSupportCouplingClass: AirborneCeilingPlenumSupportCouplingSchema.optional(),
  roofOrCeilingMountingContext: AirborneRoofOrCeilingMountingContextSchema.optional(),
  routeIntent: AirborneRouteIntentSchema.optional(),
  sharedTrack: SharedTrackClassSchema.optional(),
  studSpacingMm: z.number().positive().optional(),
  studType: AirborneStudTypeSchema.optional(),
  suspendedCeilingAirborneOrImpactIntent: AirborneSuspendedCeilingIntentSchema.optional(),
  wallTopology: WallTopologySchema.optional()
} satisfies z.ZodRawShape;

const AirborneContextSchemaInternal = z.object(AirborneContextShape);

export type AirborneContext = z.infer<typeof AirborneContextSchemaInternal>;

export const AirborneContextSchema: z.ZodType<
  AirborneContext,
  z.ZodTypeDef,
  z.input<typeof AirborneContextSchemaInternal>
> = AirborneContextSchemaInternal;
