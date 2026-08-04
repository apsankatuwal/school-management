import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    createClass,
    getAllClasses,
    updateClass,
    deleteClass,
} from "../controllers/classController.js";

const router = express.Router();

router.post("/", auth, role("admin"), createClass);

router.get("/", auth, role("admin"), getAllClasses);

router.put("/:id", auth, role("admin"), updateClass);

router.delete("/:id", auth, role("admin"), deleteClass);

export default router;