import { Router, Request, Response } from "express";
import { Job } from "../models/Job";

interface JobInput {
  title: string;
  company: string;
  location: string;
  category: string;
  short_description: string;
  main_description: string;
  created_at: string;
}

const router = Router();

router.post("/jobs", async (req: Request<{}, {}, JobInput>, res: Response) => {
  try {
    const {
      title,
      company,
      location,
      category,
      short_description,
      main_description,
      created_at,
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !category ||
      !short_description ||
      !main_description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = new Job({
      title,
      company,
      location,
      category,
      short_description,
      main_description,
      created_at: created_at || new Date().toISOString(),
    });

    const savedJob = await job.save();

    return res.status(201).json(savedJob);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

