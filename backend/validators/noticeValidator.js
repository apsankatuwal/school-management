import { body } from "express-validator";

export const noticeValidator = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("class")
        .optional({ values: "falsy" })
        .isMongoId()
        .withMessage("Class must be a valid id"),
];

export const updateNoticeValidator = [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("content")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Content cannot be empty"),
    body("class")
        .optional({ values: "falsy" })
        .isMongoId()
        .withMessage("Class must be a valid id"),
];
