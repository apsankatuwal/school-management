import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    createExam,
    getAllExams,
    updateExam,
    deleteExam,
} from "../controllers/examController.js";

const router = express.Router();

router.post("/", auth, role("admin"), createExam);

router.get("/", auth, role("admin", "teacher"), getAllExams);

router.put("/:id", auth, role("admin"), updateExam);

router.delete("/:id", auth, role("admin"), deleteExam);

export default router;