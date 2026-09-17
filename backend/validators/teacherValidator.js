import { body } from "express-validator";

export const teacherValidator = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("qualification").notEmpty().withMessage("Qualification is required"),
    body("salary").isNumeric().withMessage("Salary must be a number"),
];