import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  responses: json("responses").$type<AssessmentResponses>().notNull(),
  generatedTrack: json("generated_track").$type<TrainingTrack>(),
  createdAt: text("created_at").notNull().default('now()'),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Training track types
export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: string[];
  objectives: string[];
  learningActivities?: string[];
  assessmentMethods?: string[];
  transferStrategies?: string[];
}

export interface TrainingTrack {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  modules: TrainingModule[];
  targetAudience: string;
  mainObjective: string;
}

export interface QuestionOption {
  value: string;
  text: string;
}

export interface Question {
  id: number;
  block: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'open';
  options: QuestionOption[];
  required: boolean;
}

export interface AssessmentResponses {
  [key: string]: string | string[];
}
