import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", auth, role("admin"), createSubject);

router.get("/", auth, role("admin"), getAllSubjects);

router.put("/:id", auth, role("admin"), updateSubject);

router.delete("/:id", auth, role("admin"), deleteSubject);

export default router;