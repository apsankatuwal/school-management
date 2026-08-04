import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import { dashboard } from "../controllers/adminController.js";

const router = express.Router();

router.get(
    "/dashboard",
    auth,
    role("admin"),
    dashboard
);

export default router;