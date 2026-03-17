import { z } from "zod";

export const StudyContextSchema = z.enum(["concept", "coordination", "pre_tender"]);
export const ReportProfileSchema = z.enum(["developer", "consultant", "lab_ready"]);

export const STUDY_CONTEXT_IDS = StudyContextSchema.options;
export const REPORT_PROFILE_IDS = ReportProfileSchema.options;

export type StudyContext = z.infer<typeof StudyContextSchema>;
export type ReportProfile = z.infer<typeof ReportProfileSchema>;
