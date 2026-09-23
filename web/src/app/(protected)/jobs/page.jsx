import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import JobsPageClient from "@/components/jobs/JobsPageClient";

export default async function JobsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

  const jobs = await prisma.job.findMany({
    where: { userId: parseInt(decoded.userId) },
    orderBy: { appliedAt: "desc" },
  });

  const initialJobs = jobs.map((job) => ({
    ...job,
    appliedAt: job.appliedAt.toISOString(),
    updateAt: job.updateAt.toISOString(),
  }));

  return <JobsPageClient initialJobs={initialJobs} />;
}