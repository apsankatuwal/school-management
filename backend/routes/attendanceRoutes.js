import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    markAttendance,
    getAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post(
    "/",
    auth,
    role("teacher", "admin"),
    markAttendance
);

router.get(
    "/",
    auth,
    role("teacher", "admin"),
    getAttendance
);

export default router;