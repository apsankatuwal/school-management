import Subject from "../models/subject.js";

export const createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            subject,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
            .populate("class")
            .populate("teacher");

        res.status(200).json({
            success: true,
            subjects,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            subject,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Subject deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};