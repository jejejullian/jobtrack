import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import { getMe, updateMe, changePassword, deleteMe } from "../controllers/userController.js";

const router = Router();

router.use(authenticateToken);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/password", changePassword);
router.delete("/me", deleteMe);

export default router;
