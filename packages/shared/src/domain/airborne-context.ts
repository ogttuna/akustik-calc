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

const AirborneContextShape = {
  airtightness: AirtightnessClassSchema.optional(),
  contextMode: AirborneContextModeSchema.optional(),
  electricalBoxes: ElectricalBoxStateSchema.optional(),
  junctionQuality: JunctionQualitySchema.optional(),
  penetrationState: PenetrationStateSchema.optional(),
  perimeterSeal: PerimeterSealClassSchema.optional(),
  receivingRoomRt60S: z.number().positive().optional(),
  receivingRoomVolumeM3: z.number().positive().optional(),
  sharedTrack: SharedTrackClassSchema.optional()
} satisfies z.ZodRawShape;

const AirborneContextSchemaInternal = z.object(AirborneContextShape);

export type AirborneContext = z.infer<typeof AirborneContextSchemaInternal>;

export const AirborneContextSchema: z.ZodType<
  AirborneContext,
  z.ZodTypeDef,
  z.input<typeof AirborneContextSchemaInternal>
> = AirborneContextSchemaInternal;
