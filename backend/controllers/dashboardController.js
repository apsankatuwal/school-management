import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import ClassModel from "../models/class.js";
import Subject from "../models/subject.js";
import Attendance from "../models/attendance.js";
import Exam from "../models/exam.js";
import Fee from "../models/fee.js";
import Assignment from "../models/assignment.js";

const daysAway = (date, now) => {
    const diff = Math.ceil((new Date(date) - now) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
};

export const getAdminDashboard = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const horizon = new Date();
        horizon.setDate(horizon.getDate() + 30);

        const [
            totalStudents,
            totalTeachers,
            totalClasses,
            totalSubjects,
            totalExams,
            totalAttendance,
            paidFees,
            pendingFees,
            monthAttendance,
            atRiskAgg,
            upcomingExams,
            upcomingAssignments,
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
            Attendance.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }),
            Attendance.aggregate([
                {
                    $group: {
                        _id: "$student",
                        total: { $sum: 1 },
                        present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
                    },
                },
                { $match: { total: { $gte: 5 } } },
                {
                    $addFields: {
                        percentage: {
                            $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0],
                        },
                    },
                },
                { $match: { percentage: { $lt: 75 } } },
                { $sort: { percentage: 1 } },
                { $limit: 20 },
                { $lookup: { from: "students", localField: "_id", foreignField: "_id", as: "student" } },
                { $unwind: "$student" },
                { $lookup: { from: "users", localField: "student.user", foreignField: "_id", as: "user" } },
                { $unwind: "$user" },
            ]),
            Exam.find({ examDate: { $gte: now, $lte: horizon } }).sort({ examDate: 1 }).limit(10),
            Assignment.find({ dueDate: { $gte: now, $lte: horizon } }).sort({ dueDate: 1 }).limit(10),
        ]);

        const presentThisMonth = monthAttendance.filter((a) => a.status === "Present").length;
        const attendanceThisMonth =
            monthAttendance.length > 0
                ? Math.round((presentThisMonth / monthAttendance.length) * 100)
                : 0;

        const studentsAtRisk = atRiskAgg.map((row) => ({
            studentId: row.student._id,
            name: `${row.user.firstName} ${row.user.lastName || ""}`.trim(),
            admissionNumber: row.student.admissionNumber,
            className: row.student.className,
            section: row.student.section,
            percentage: row.percentage,
        }));

        const upcoming = [
            ...upcomingExams.map((exam) => ({
                type: "exam",
                label: exam.examName,
                date: exam.examDate,
                daysAway: daysAway(exam.examDate, now),
            })),
            ...upcomingAssignments.map((assignment) => ({
                type: "assignment",
                label: assignment.title,
                date: assignment.dueDate,
                daysAway: daysAway(assignment.dueDate, now),
            })),
        ].sort((a, b) => new Date(a.date) - new Date(b.date));

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
                attendanceThisMonth,
                studentsAtRisk,
                upcoming,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};