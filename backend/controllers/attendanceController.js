import Attendance from "../models/attendance.js";
import Student from "../models/student.js";
import ClassModel from "../models/class.js";
import Subject from "../models/subject.js";
import { getTeacherScope } from "../utils/teacherScope.js";

export const markAttendance = async (req, res) => {
    try {
        const payload = { ...req.body };

        if (req.user.role === "teacher") {
            const scope = await getTeacherScope(req.user._id);
            if (!scope) {
                return res.status(404).json({
                    success: false,
                    message: "No teacher profile is linked to this account. Ask your admin.",
                });
            }
            if (!scope.subjectIdSet.has(String(payload.subject))) {
                return res.status(403).json({
                    success: false,
                    message: "You can only mark attendance for subjects you teach.",
                });
            }
            payload.teacher = scope.teacher._id;
        }

        const attendance = await Attendance.create(payload);

        res.status(201).json({ success: true, message: "Attendance marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendance = async (req, res) => {
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
                    { subject: { $in: scope.subjectIds } },
                    { class: { $in: scope.classIds } },
                    { teacher: scope.teacher._id },
                ],
            };
        }

        const attendance = await Attendance.find(query)
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
        if (req.user.role === "teacher") {
            const existing = await Attendance.findById(req.params.id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Attendance record not found" });
            }
            const scope = await getTeacherScope(req.user._id);
            if (!scope || !scope.subjectIdSet.has(String(existing.subject))) {
                return res.status(403).json({
                    success: false,
                    message: "You can only edit attendance for subjects you teach.",
                });
            }
        }

        const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
                total, present, absent, late,
                percentage: total > 0 ? Math.round((present / total) * 100) : 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// NEW — which classes/subjects this user is allowed to take attendance for
export const getAttendanceOptions = async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const [classes, subjects] = await Promise.all([
                ClassModel.find(),
                Subject.find().populate("class"),
            ]);
            return res.json({ success: true, classes, subjects });
        }

        const scope = await getTeacherScope(req.user._id);
        if (!scope) {
            return res.status(404).json({
                success: false,
                message: "No teacher profile is linked to this account. Ask your admin.",
            });
        }

        const [classes, subjects] = await Promise.all([
            ClassModel.find({ _id: { $in: scope.classIds } }),
            Subject.find({ _id: { $in: scope.subjectIds } }).populate("class"),
        ]);

        res.json({ success: true, classes, subjects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// NEW — the class roster for a given class/subject/date, pre-filled with any existing marks
export const getRoster = async (req, res) => {
    try {
        const { classId, subjectId, date } = req.query;

        if (!classId || !subjectId || !date) {
            return res.status(400).json({
                success: false,
                message: "classId, subjectId and date are all required.",
            });
        }

        if (req.user.role === "teacher") {
            const scope = await getTeacherScope(req.user._id);
            if (!scope || !scope.subjectIdSet.has(String(subjectId))) {
                return res.status(403).json({
                    success: false,
                    message: "You can only take attendance for subjects you teach.",
                });
            }
        }

        const classDoc = await ClassModel.findById(classId).populate({
            path: "students",
            populate: { path: "user", select: "-password" },
        });

        if (!classDoc) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const existing = await Attendance.find({
            subject: subjectId,
            class: classId,
            date: { $gte: dayStart, $lte: dayEnd },
        });

        const existingByStudent = Object.fromEntries(
            existing.map((record) => [String(record.student), record.status])
        );

        const roster = classDoc.students
            .map((student) => ({
                studentId: student._id,
                name: `${student.user?.firstName || ""} ${student.user?.lastName || ""}`.trim(),
                admissionNumber: student.admissionNumber,
                rollNumber: student.rollNumber,
                status: existingByStudent[String(student._id)] || "Present",
            }))
            .sort((a, b) => (a.rollNumber ?? 0) - (b.rollNumber ?? 0));

        res.json({ success: true, roster });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// NEW — save the whole class's attendance in one request
export const markBulkAttendance = async (req, res) => {
    try {
        const { class: classId, subject: subjectId, date, records } = req.body;

        if (!classId || !subjectId || !date || !Array.isArray(records) || !records.length) {
            return res.status(400).json({
                success: false,
                message: "class, subject, date and a non-empty records array are required.",
            });
        }

        let teacherId;

        if (req.user.role === "teacher") {
            const scope = await getTeacherScope(req.user._id);
            if (!scope || !scope.subjectIdSet.has(String(subjectId))) {
                return res.status(403).json({
                    success: false,
                    message: "You can only mark attendance for subjects you teach.",
                });
            }
            teacherId = scope.teacher._id;
        } else {
            const subjectDoc = await Subject.findById(subjectId);
            if (!subjectDoc?.teacher) {
                return res.status(400).json({
                    success: false,
                    message: "This subject has no teacher assigned yet. Assign one before taking attendance.",
                });
            }
            teacherId = subjectDoc.teacher;
        }

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);

        const results = await Promise.all(
            records.map(({ student, status }) =>
                Attendance.findOneAndUpdate(
                    { student, subject: subjectId, date: dayStart },
                    { student, subject: subjectId, class: classId, teacher: teacherId, date: dayStart, status },
                    { upsert: true, new: true, runValidators: true }
                )
            )
        );

        res.status(200).json({
            success: true,
            message: `Attendance saved for ${results.length} student${results.length === 1 ? "" : "s"}.`,
            attendance: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};