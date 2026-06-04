import { Router } from "express";
import { register, login, verifyEmail, forgotPassword, resetPassword, resendVerification } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", resendVerification);

export default router;
