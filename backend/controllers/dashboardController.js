import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import ClassModel from "../models/Class.js";
import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";
import Exam from "../models/Exam.js";
import Fee from "../models/Fee.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const [
            totalStudents,
            totalTeachers,
            totalClasses,
            totalSubjects,
            totalExams,
            totalAttendance,
            paidFees,
            pendingFees,
        ] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            ClassModel.countDocuments(),
            Subject.countDocuments(),
            Exam.countDocuments(),
            Attendance.countDocuments(),
            Fee.aggregate([
                { $match: { status: "Paid" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Fee.aggregate([
                { $match: { status: "Pending" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            dashboard: {
                totalStudents,
                totalTeachers,
                totalClasses,
                totalSubjects,
                totalExams,
                totalAttendance,
                fees: {
                    paid: paidFees[0]?.total || 0,
                    pending: pendingFees[0]?.total || 0,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};