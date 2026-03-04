import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  job_id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  created_at: string;
}

const ApplicationSchema: Schema<IApplication> = new Schema<IApplication>({
  job_id: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resume_link: { type: String, required: true },
  cover_note: { type: String, required: true },
  created_at: { type: String, required: true },
});

export const Application = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);

