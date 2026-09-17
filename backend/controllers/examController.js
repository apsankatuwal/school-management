import Exam from "../models/exam.js";

export const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);

        res.status(201).json({
            success: true,
            message: "Exam created successfully",
            exam,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate("class")
            .populate("subject");

        res.status(200).json({
            success: true,
            exams,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            exam,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteExam = async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Exam deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};