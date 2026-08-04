import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import validate from "../middlewares/validate.js";
import { teacherValidator } from "../validators/teacherValidator.js";

import {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.post(
    "/",
    auth,
    role("admin"),
    teacherValidator,
    validate,
    createTeacher
);

router.get("/", auth, role("admin"), getAllTeachers);

router.get("/:id", auth, role("admin"), getTeacherById);

router.put("/:id", auth, role("admin"), updateTeacher);

router.delete("/:id", auth, role("admin"), deleteTeacher);

export default router;