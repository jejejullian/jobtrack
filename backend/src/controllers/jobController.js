import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const parseAppliedAt = (appliedAt) => {
  if (appliedAt === undefined) return undefined;

  const date = new Date(appliedAt);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid applied date", 400);
  }

  return date;
};

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await prisma.job.findMany({
    where: { userId: req.user.id },
    orderBy: { appliedAt: "desc" },
  });
  res.json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) throw new AppError("Invalid job id", 400);

  const job = await prisma.job.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!job) throw new AppError("Job not found", 404);

  res.json(job);
});

const createJob = asyncHandler(async (req, res) => {
  const { company, position, location, status, referenceLink, notes, appliedAt } = req.body;
  const userId = req.user.id;

  const job = await prisma.job.create({
    data: { company, position, location, status, referenceLink, notes, appliedAt: parseAppliedAt(appliedAt), userId },
  });

  res.status(201).json(job);
});

const updateJob = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) throw new AppError("Invalid job id", 400);

  const existing = await prisma.job.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) throw new AppError("Job not found", 404);

  const { company, position, location, status, referenceLink, notes, appliedAt } = req.body;
  const job = await prisma.job.update({
    where: { id },
    data: { company, position, location, status, referenceLink, notes, appliedAt: parseAppliedAt(appliedAt) },
  });

  res.json(job);
});

const deleteJob = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) throw new AppError("Invalid job id", 400);

  const existing = await prisma.job.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) throw new AppError("Job not found", 404);

  await prisma.job.delete({ where: { id } });

  res.json({ message: "Job deleted successfully" });
});

export { getAllJobs, getJobById, createJob, updateJob, deleteJob };
