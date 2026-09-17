import { body } from "express-validator";

export const createUserValidator = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("role")
        .isIn(["admin", "teacher", "student"])
        .withMessage("Invalid role"),
];

export const updateUserValidator = [
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("role")
        .optional()
        .isIn(["admin", "teacher", "student"])
        .withMessage("Invalid role"),
];