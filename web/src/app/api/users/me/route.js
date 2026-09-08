import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import bcrypt from "bcryptjs";

const userSelect = {
  id: true,
  email: true,
  username: true,
  isVerified: true,
  createdAt: true,
};

// get profile
export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) throw new AppError("Unauthorized", 401);

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: userSelect,
    });

    if (!user) throw new AppError("User not found", 404);

    return Response.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// update username
export async function PATCH(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) throw new AppError("Unauthorized", 401);

    const body = await req.json();
    const username = body.username?.trim();

    if (!username) throw new AppError("Username is required", 400, "username");
    if (username.length < 3) throw new AppError("Username must be at least 3 characters", 400, "username");

    const existingUsername = await prisma.user.findFirst({
      where: { username, id: { not: parseInt(userId) } },
    });

    if (existingUsername) throw new AppError("Username already taken", 409, "username");

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { username },
      select: userSelect,
    });

    return Response.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating username:", error);
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }
    return Response.json({ error: "Failed to update username" }, { status: 500 });
  }
}

// delete account
export async function DELETE(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) throw new AppError("Unauthorized", 401);

    const body = await req.json();
    const { password } = body;

    if (!password) throw new AppError("Password is required", 400, "password");

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    }); // full record perlu di sini karena harus baca user.password buat bcrypt.compare

    if (!user) throw new AppError("User not found", 404);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError("Password is incorrect", 400, "password");

    await prisma.$transaction([
      prisma.job.deleteMany({ where: { userId: parseInt(userId) } }),
      prisma.user.delete({ where: { id: parseInt(userId) } }),
    ]);

    return Response.json({ message: "Account deleted successfully" }); // ⬅ "user" dihapus dari response
  } catch (error) {
    console.error("Error deleting account:", error);
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }
    return Response.json({ error: "Failed to delete account" }, { status: 500 });
  }
}