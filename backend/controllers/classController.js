import ClassModel from "../models/Class.js";

export const createClass = async (req, res) => {
    try {
        const newClass = await ClassModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            class: newClass,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const classes = await ClassModel.find()
            .populate("classTeacher")
            .populate("students");

        res.status(200).json({
            success: true,
            classes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateClass = async (req, res) => {
    try {
        const updated = await ClassModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            class: updated,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteClass = async (req, res) => {
    try {
        await ClassModel.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Class deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};