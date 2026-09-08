import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";

// validasi & convert appliedAt, skip kalau ga dikirim
const parseAppliedAt = (appliedAt) => {
  if (appliedAt === undefined) return undefined;

  const date = new Date(appliedAt);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid applied date", 400);
  }

  return date;
};

// GET all jobs
export async function GET(req) {
  try {
    // ini dari proxy, bukan langsung dari client
    const userId = req.headers.get("x-user-id");

    if (!userId) throw new AppError("Unauthorized", 401);

    const jobs = await prisma.job.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { appliedAt: "desc" },
    });

    return Response.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);

    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST create job
export async function POST(req) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) throw new AppError("Unauthorized", 401);

    const body = await req.json();
    const { company, position, location, status, referenceLink, notes, appliedAt } = body;

    // required fields
    if (!company) throw new AppError("Company is required", 400, "company");
    if (!position) throw new AppError("Position is required", 400, "position");

    const job = await prisma.job.create({
      data: {
        company,
        position,
        location: location || null,
        status: status || "Applied",
        referenceLink: referenceLink || null,
        notes: notes || null,
        appliedAt: parseAppliedAt(appliedAt) || new Date(), // default hari ini kalau ga dikirim
        userId: parseInt(userId),
      },
    });

    return Response.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);

    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    return Response.json({ error: "Failed to create job" }, { status: 500 });
  }
}