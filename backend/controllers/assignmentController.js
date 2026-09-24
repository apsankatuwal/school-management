import Assignment from "../models/assignment.js";
import Student from "../models/student.js";
import ClassModel from "../models/class.js";

const findStudentClass = async (student) => {
    const classWithStudent = await ClassModel.findOne({ students: student._id });
    if (classWithStudent) {
        return classWithStudent;
    }

    return ClassModel.findOne({
        className: student.className,
        section: student.section,
    });
};

export const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, class: classId } = req.body;
        const classExists = await ClassModel.exists({ _id: classId });

        if (!classExists) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        const assignment = await Assignment.create({
            title,
            description,
            dueDate,
            class: classId,
            createdBy: req.user._id,
        });

        const populatedAssignment = await assignment.populate([
            { path: "createdBy", select: "-password" },
            { path: "class" },
        ]);

        res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            assignment: populatedAssignment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAssignments = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === "student") {
            const student = await Student.findOne({ user: req.user._id });
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "No student profile is linked to this account. Ask your admin.",
                });
            }

            const studentClass = await findStudentClass(student);
            if (!studentClass) {
                return res.status(404).json({
                    success: false,
                    message: "No class is linked to this student profile. Ask your admin.",
                });
            }

            query = { class: studentClass._id };
        }

        const assignments = await Assignment.find(query)
            .populate("createdBy", "-password")
            .populate("class")
            .sort({ dueDate: 1 });

        res.status(200).json({ success: true, assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, class: classId } = req.body;

        if (classId) {
            const classExists = await ClassModel.exists({ _id: classId });
            if (!classExists) {
                return res.status(404).json({ success: false, message: "Class not found" });
            }
        }

        const update = { title, description, dueDate, class: classId };
        Object.keys(update).forEach(
            (key) => update[key] === undefined && delete update[key]
        );

        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        )
            .populate("createdBy", "-password")
            .populate("class");

        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        res.status(200).json({
            success: true,
            message: "Assignment updated successfully",
            assignment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        res.status(200).json({ success: true, message: "Assignment deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
