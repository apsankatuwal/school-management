import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import validate from "../middlewares/validate.js";
import { studentValidator } from "../validators/studentValidator.js";

import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.post(
    "/",
    auth,
    role("admin"),
    studentValidator,
    validate,
    createStudent
);

router.get(
    "/",
    auth,
    role("admin"),
    getAllStudents
);

router.get(
    "/:id",
    auth,
    role("admin"),
    getStudentById
);

router.put(
    "/:id",
    auth,
    role("admin"),
    updateStudent
);

router.delete(
    "/:id",
    auth,
    role("admin"),
    deleteStudent
);

export default router;