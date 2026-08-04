import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

import {
    getAdminDashboard,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
    "/admin",
    auth,
    role("admin"),
    getAdminDashboard
);

export default router;