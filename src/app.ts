import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jobRoutes from "./routes/jobRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err: Error) => console.log(err));

app.get("/", (req: Request, res: Response) => {
  res.send("API Running...");
});

app.use("/api", jobRoutes);

export { app };

