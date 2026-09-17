import Result from "../models/result.js";
import Student from "../models/student.js";

export const createResult = async (req, res) => {
    try {
        const result = await Result.create(req.body);

        res.status(201).json({
            success: true,
            message: "Result created successfully",
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate("student")
            .populate("exam")
            .populate("subject");

        res.status(200).json({
            success: true,
            results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// NEW — only this student's own results
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

        res.status(200).json({
            success: true,
            results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteResult = async (req, res) => {
    try {
        await Result.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Result deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};