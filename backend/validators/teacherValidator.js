import { body } from "express-validator";

export const teacherValidator = [
    body("employeeId")
        .notEmpty()
        .withMessage("Employee ID is required"),

    body("department")
        .notEmpty()
        .withMessage("Department is required"),

    body("qualification")
        .notEmpty()
        .withMessage("Qualification is required"),

    body("salary")
        .isNumeric()
        .withMessage("Salary must be a number"),
];