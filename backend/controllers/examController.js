import Exam from "../models/exam.js";
import { getTeacherScope } from "../utils/teacherScope.js";

export const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);

        res.status(201).json({ success: true, message: "Exam created successfully", exam });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllExams = async (req, res) => {
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

            query = {
                $or: [
                    { class: { $in: scope.classIds } },
                    { subject: { $in: scope.subjectIds } },
                ],
            };
        }

        const exams = await Exam.find(query).populate("class").populate("subject");

        res.status(200).json({ success: true, exams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json({ success: true, exam });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteExam = async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};