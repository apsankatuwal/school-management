import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import validate from "../middlewares/validate.js";
import {
    assignmentValidator,
    updateAssignmentValidator,
} from "../validators/assignmentValidator.js";
import {
    createAssignment,
    getAssignments,
    updateAssignment,
    deleteAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/", auth, role("admin", "teacher", "student"), getAssignments);

router.post(
    "/",
    auth,
    role("admin", "teacher"),
    assignmentValidator,
    validate,
    createAssignment
);

router.put(
    "/:id",
    auth,
    role("admin", "teacher"),
    updateAssignmentValidator,
    validate,
    updateAssignment
);

router.delete("/:id", auth, role("admin", "teacher"), deleteAssignment);

export default router;
