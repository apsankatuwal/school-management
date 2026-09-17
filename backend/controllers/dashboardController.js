import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import ClassModel from "../models/class.js";
import Subject from "../models/subject.js";
import Attendance from "../models/attendance.js";
import Exam from "../models/exam.js";
import Fee from "../models/fee.js";

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