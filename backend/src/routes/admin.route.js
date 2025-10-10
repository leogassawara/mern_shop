import express from "express";
import { adminLogin, getAdmin, registerAdmin } from "../controllers/admin.controller";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.get("/profile", getAdmin);

export default router;