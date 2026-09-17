import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    createFee,
    getAllFees,
    updateFee,
    deleteFee,
    getMyFees,
} from "../controllers/feeController.js";

const router = express.Router();

router.post("/", auth, role("admin"), createFee);

router.get("/", auth, role("admin"), getAllFees);

router.get("/me", auth, role("student"), getMyFees);

router.put("/:id", auth, role("admin"), updateFee);

router.delete("/:id", auth, role("admin"), deleteFee);

export default router;