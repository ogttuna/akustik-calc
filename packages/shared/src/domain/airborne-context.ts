import { z } from "zod";

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

export const WallTopologyModeSchema = z.enum(["auto", "flat_layer_order", "grouped_triple_leaf"]);
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

const AirborneContextShape = {
  airtightness: AirtightnessClassSchema.optional(),
  connectionType: AirborneConnectionTypeSchema.optional(),
  contextMode: AirborneContextModeSchema.optional(),
  electricalBoxes: ElectricalBoxStateSchema.optional(),
  junctionQuality: JunctionQualitySchema.optional(),
  panelHeightMm: z.number().positive().optional(),
  panelWidthMm: z.number().positive().optional(),
  penetrationState: PenetrationStateSchema.optional(),
  perimeterSeal: PerimeterSealClassSchema.optional(),
  receivingRoomRt60S: z.number().positive().optional(),
  receivingRoomVolumeM3: z.number().positive().optional(),
  resilientBarSideCount: AirborneResilientBarSideCountSchema.optional(),
  sharedTrack: SharedTrackClassSchema.optional(),
  studSpacingMm: z.number().positive().optional(),
  studType: AirborneStudTypeSchema.optional(),
  wallTopology: WallTopologySchema.optional()
} satisfies z.ZodRawShape;

const AirborneContextSchemaInternal = z.object(AirborneContextShape);

export type AirborneContext = z.infer<typeof AirborneContextSchemaInternal>;

export const AirborneContextSchema: z.ZodType<
  AirborneContext,
  z.ZodTypeDef,
  z.input<typeof AirborneContextSchemaInternal>
> = AirborneContextSchemaInternal;
