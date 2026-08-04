import express from "express";
import {
    register,
    login,
    getProfile,
} from "../controllers/authController.js";

import {
    registerValidator,
    loginValidator,
} from "../validators/authValidator.js";

import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.get("/profile", auth, getProfile);

export default router;
