import { z } from "zod";

import { ImpactFlankingPathSchema } from "./impact-flanking";

export const ImpactFieldContextSchema = z.object({
  ciDb: z.number().optional(),
  ci50_2500Db: z.number().optional(),
  directPathOffsetDb: z.number().optional(),
  enableSmallRoomEstimate: z.boolean().optional(),
  fieldKDb: z.number().optional(),
  flankingPaths: z.array(ImpactFlankingPathSchema).optional(),
  guideHdDb: z.number().optional(),
  guideMassRatio: z.number().optional(),
  lowerTreatmentReductionDb: z.number().optional(),
  receivingRoomVolumeM3: z.number().positive().optional()
});

export type ImpactFieldContext = z.infer<typeof ImpactFieldContextSchema>;
