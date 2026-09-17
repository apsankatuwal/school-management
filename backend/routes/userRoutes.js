import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import validate from "../middlewares/validate.js";
import {
    createUserValidator,
    updateUserValidator,
} from "../validators/userValidator.js";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// EVERY route below requires you to already be logged in AND be an admin.
router.use(auth, role("admin"));

router.post("/", createUserValidator, validate, createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserValidator, validate, updateUser);
router.delete("/:id", deleteUser);

export default router;