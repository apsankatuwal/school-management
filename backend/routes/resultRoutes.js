import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    createResult,
    getAllResults,
    updateResult,
    deleteResult,
} from "../controllers/resultController.js";

const router = express.Router();

router.post("/", auth, role("teacher", "admin"), createResult);

router.get("/", auth, role("teacher", "admin"), getAllResults);

router.put("/:id", auth, role("teacher", "admin"), updateResult);

router.delete("/:id", auth, role("admin"), deleteResult);

export default router;