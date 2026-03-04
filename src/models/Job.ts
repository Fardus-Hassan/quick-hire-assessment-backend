import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  category: string;
  short_description: string;
  main_description: string;
  created_at: string;
}

const JobSchema: Schema<IJob> = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  short_description: { type: String, required: true },
  main_description: { type: String, required: true },
  created_at: { type: String, required: true },
});

export const Job = mongoose.model<IJob>("Job", JobSchema);

