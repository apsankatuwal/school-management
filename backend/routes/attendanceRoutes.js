import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    markAttendance,
    getAttendance,
    getMyAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", auth, role("teacher", "admin"), markAttendance);

router.get("/", auth, role("teacher", "admin"), getAttendance);

router.get("/me", auth, role("student"), getMyAttendance);

export default router;