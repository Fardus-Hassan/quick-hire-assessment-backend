"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Job_1 = require("../models/Job");
const Application_1 = require("../models/Application");
const router = (0, express_1.Router)();
router.get("/jobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, category, location, page = "1" } = req.query;
        const filters = {};
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
            filters.location = { $regex: location, $options: "i" };
        }
        const pageNumber = Number(page) > 0 ? Number(page) : 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;
        const [jobs, total] = yield Promise.all([
            Job_1.Job.find(filters)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            Job_1.Job.countDocuments(filters),
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}));
router.post("/jobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, company, location, category, short_description, main_description, created_at, } = req.body;
        if (!title ||
            !company ||
            !location ||
            !category ||
            !short_description ||
            !main_description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const job = new Job_1.Job({
            title,
            company,
            location,
            category,
            short_description,
            main_description,
            created_at: created_at || new Date().toISOString(),
        });
        const savedJob = yield job.save();
        return res.status(201).json(savedJob);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}));
router.get("/jobs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const job = yield Job_1.Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.json(job);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}));
router.delete("/jobs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedJob = yield Job_1.Job.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.json({ message: "Job deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}));
router.post("/applications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { job_id, name, email, resume_link, cover_note, created_at } = req.body;
        if (!job_id || !name || !email || !resume_link || !cover_note) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const jobExists = yield Job_1.Job.findById(job_id);
        if (!jobExists) {
            return res.status(400).json({ message: "Invalid job_id" });
        }
        const application = new Application_1.Application({
            job_id,
            name,
            email,
            resume_link,
            cover_note,
            created_at: created_at || new Date().toISOString(),
        });
        const savedApplication = yield application.save();
        return res.status(201).json(savedApplication);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
