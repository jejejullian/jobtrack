import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProfilePageClient from "@/components/profile/ProfilePageClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: parseInt(decoded.userId) },
    select: {
      id: true,
      email: true,
      username: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  const initialUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };

  return <ProfilePageClient initialUser={initialUser} />;
}