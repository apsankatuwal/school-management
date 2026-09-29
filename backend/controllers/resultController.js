import Result from "../models/result.js";
import Student from "../models/student.js";
import { getTeacherScope } from "../utils/teacherScope.js";

export const createResult = async (req, res) => {
    try {
        const payload = { ...req.body };

        if (req.user.role === "teacher") {
            const scope = await getTeacherScope(req.user._id);
            if (!scope) {
                return res.status(404).json({
                    success: false,
                    message: "No teacher profile is linked to this account. Ask your admin.",
                });
            }

            if (!scope.subjectIdSet.has(String(payload.subject))) {
                return res.status(403).json({
                    success: false,
                    message: "You can only add results for subjects you teach.",
                });
            }
        }

        const result = await Result.create(payload);

        res.status(201).json({
            success: true,
            message: "Result created successfully",
            result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllResults = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === "teacher") {
            const scope = await getTeacherScope(req.user._id);
            if (!scope) {
                return res.status(404).json({
                    success: false,
                    message: "No teacher profile is linked to this account. Ask your admin.",
                });
            }

            query = { subject: { $in: scope.subjectIds } };
        }

        const results = await Result.find(query)
            .populate("student")
            .populate("exam")
            .populate("subject");

        res.status(200).json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyResults = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student profile is linked to this account. Ask your admin.",
            });
        }

        const results = await Result.find({ student: student._id })
            .populate("exam")
            .populate("subject")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateResult = async (req, res) => {
    try {
        if (req.user.role === "teacher") {
            const existing = await Result.findById(req.params.id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Result not found" });
            }

            const scope = await getTeacherScope(req.user._id);
            if (!scope || !scope.subjectIdSet.has(String(existing.subject))) {
                return res.status(403).json({
                    success: false,
                    message: "You can only edit results for subjects you teach.",
                });
            }
        }

        const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!result) {
            return res.status(404).json({ success: false, message: "Result not found" });
        }

        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteResult = async (req, res) => {
    try {
        await Result.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Result deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};