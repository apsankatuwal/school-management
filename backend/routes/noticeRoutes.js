import express from "express";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import validate from "../middlewares/validate.js";
import {
    noticeValidator,
    updateNoticeValidator,
} from "../validators/noticeValidator.js";
import {
    createNotice,
    getNotices,
    updateNotice,
    deleteNotice,
} from "../controllers/noticeController.js";

const router = express.Router();

router.get("/", auth, role("admin", "teacher", "student"), getNotices);

router.post(
    "/",
    auth,
    role("admin", "teacher"),
    noticeValidator,
    validate,
    createNotice
);

router.put(
    "/:id",
    auth,
    role("admin", "teacher"),
    updateNoticeValidator,
    validate,
    updateNotice
);

router.delete("/:id", auth, role("admin", "teacher"), deleteNotice);

export default router;
