import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    markAttendance,
    getAttendance,
    updateAttendance,
    deleteAttendance,
    getMyAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", auth, role("teacher", "admin"), markAttendance);

router.get("/", auth, role("teacher", "admin"), getAttendance);

router.get("/me", auth, role("student"), getMyAttendance);

router.put("/:id", auth, role("teacher", "admin"), updateAttendance);

router.delete("/:id", auth, role("admin"), deleteAttendance);

export default router;