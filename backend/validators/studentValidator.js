import { body } from "express-validator";

export const studentValidator = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("admissionNumber").notEmpty().withMessage("Admission number is required"),
    body("className").notEmpty().withMessage("Class is required"),
    body("section").notEmpty().withMessage("Section is required"),
    body("rollNumber").isNumeric().withMessage("Roll number must be a number"),
    body("guardianPhone").notEmpty().withMessage("Guardian phone is required"),
];