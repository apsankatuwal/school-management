import Attendance from "../models/attendance.js";
import Student from "../models/student.js";

export const markAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate("student")
            .populate("teacher")
            .populate("class")
            .populate("subject");

        res.json({ success: true, attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        res.json({ success: true, message: "Attendance updated successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        res.json({ success: true, message: "Attendance deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyAttendance = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student profile is linked to this account. Ask your admin.",
            });
        }

        const attendance = await Attendance.find({ student: student._id })
            .populate("class")
            .populate("subject")
            .sort({ date: -1 });

        const total = attendance.length;
        const present = attendance.filter((a) => a.status === "Present").length;
        const absent = attendance.filter((a) => a.status === "Absent").length;
        const late = attendance.filter((a) => a.status === "Late").length;

        res.json({
            success: true,
            attendance,
            summary: {
                total,
                present,
                absent,
                late,
                percentage: total > 0 ? Math.round((present / total) * 100) : 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};