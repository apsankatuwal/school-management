import { body } from "express-validator";

export const studentValidator = [
    body("admissionNumber")
        .notEmpty()
        .withMessage("Admission number is required"),

    body("className")
        .notEmpty()
        .withMessage("Class is required"),

    body("section")
        .notEmpty()
        .withMessage("Section is required"),

    body("rollNumber")
        .isNumeric()
        .withMessage("Roll number must be a number"),

    body("guardianPhone")
        .notEmpty()
        .withMessage("Guardian phone is required"),
];