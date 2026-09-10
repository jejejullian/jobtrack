import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { comparePassword, hashPassword } from "@/lib/auth";

const userSelect = {
  id: true,
  email: true,
  username: true,
  isVerified: true,
  createdAt: true,
};

// change password
export async function PATCH(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) throw new AppError("Unauthorized", 401);

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword) throw new AppError("Current password is required", 400, "currentPassword");
    if (!newPassword) throw new AppError("New password is required", 400, "newPassword");
    if (newPassword.length < 8) throw new AppError("Password must be at least 8 characters", 400, "newPassword");
    if (!/[a-zA-Z]/.test(newPassword)) throw new AppError("Password must contain at least one letter", 400, "newPassword");
    if (!/[0-9]/.test(newPassword)) throw new AppError("Password must contain at least one number", 400, "newPassword");

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await comparePassword(currentPassword, existingUser.password);
    if (!isPasswordValid) throw new AppError("Current password is incorrect", 400, "currentPassword");

    const hashed = await hashPassword(newPassword);

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { password: hashed },
      select: userSelect,
    });

    return Response.json({ message: "Password updated successfully", user });
  } catch (error) {
    console.error("Error change password:", error);
    // Cek apakah error berasal dari AppError
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }
    return Response.json({ error: "Failed to change password" }, { status: 500 });
  }
}
