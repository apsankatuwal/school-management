import { body } from "express-validator";

export const assignmentValidator = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("dueDate").isISO8601().withMessage("Due date must be a valid date"),
    body("class")
        .notEmpty()
        .withMessage("Class is required")
        .isMongoId()
        .withMessage("Class must be a valid id"),
];

export const updateAssignmentValidator = [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),
    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid date"),
    body("class")
        .optional()
        .notEmpty()
        .withMessage("Class cannot be empty")
        .isMongoId()
        .withMessage("Class must be a valid id"),
];
