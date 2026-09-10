import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";

// validasi & convert appliedAt, skip jika tdk dikirim
const parseAppliedAt = (appliedAt) => {
  if (appliedAt === undefined) return undefined;

  const date = new Date(appliedAt);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid applied date", 400);
  }

  return date;
};

// GET job by id
export async function GET(req, { params }) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) throw new AppError("Unauthorized", 401);

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (Number.isNaN(id)) throw new AppError("Invalid job id", 400);

    // filter id + userId, supya tdk bisa akses job orang lain
    const job = await prisma.job.findFirst({
      where: { id, userId: parseInt(userId) },
    });

    if (!job) throw new AppError("Job not found", 404);

    return Response.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);

    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    return Response.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PUT update job
export async function PUT(req, { params }) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) throw new AppError("Unauthorized", 401);

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (Number.isNaN(id)) throw new AppError("Invalid job id", 400);

    const existing = await prisma.job.findFirst({
      where: { id, userId: parseInt(userId) },
    });
    if (!existing) throw new AppError("Job not found", 404);

    const body = await req.json();
    const { company, position, location, status, referenceLink, notes, appliedAt } = body;

    // Kalau field dikirim, pastikan tidak kosong
    if (company !== undefined && !company) {
      throw new AppError("Company is required", 400, "company");
    }
    if (position !== undefined && !position) {
      throw new AppError("Position is required", 400, "position");
    }

    const job = await prisma.job.update({
      where: { id },
      data: { company, position, location, status, referenceLink, notes, appliedAt: parseAppliedAt(appliedAt) },
    });

    return Response.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }
    return Response.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// DELETE job
export async function DELETE(req, { params }) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) throw new AppError("Unauthorized", 401);

    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (Number.isNaN(id)) throw new AppError("Invalid job id", 400);

    const existing = await prisma.job.findFirst({
      where: { id, userId: parseInt(userId) },
    });

    if (!existing) throw new AppError("Job not found", 404);

    await prisma.job.delete({ where: { id } });

    return Response.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);

    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    return Response.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
