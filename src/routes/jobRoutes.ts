import { Router, Request, Response } from "express";
import { Job, IJob } from "../models/Job";

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

router.get("/jobs", async (req: Request, res: Response) => {
  try {
    const { search, category, location, page = "1" } = req.query;

    const filters: any = {};

    if (search && typeof search === "string") {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (category && typeof category === "string") {
      filters.category = category;
    }

    if (location && typeof location === "string") {
      filters.location = location;
    }

    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limit = 20;
    const skip = (pageNumber - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(filters)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      data: jobs,
      pagination: {
        total,
        page: pageNumber,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

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

router.post(
  "/admin/jobs",
  async (req: Request<{}, {}, JobInput>, res: Response) => {
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
  }
);

export default router;

