import Notice from "../models/notice.js";
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

export const createNotice = async (req, res) => {
    try {
        const { title, content, class: classId } = req.body;

        if (classId) {
            const classExists = await ClassModel.exists({ _id: classId });
            if (!classExists) {
                return res.status(404).json({ success: false, message: "Class not found" });
            }
        }

        const notice = await Notice.create({
            title,
            content,
            class: classId || undefined,
            postedBy: req.user._id,
        });

        const populatedNotice = await notice.populate([
            { path: "postedBy", select: "-password" },
            { path: "class" },
        ]);

        res.status(201).json({
            success: true,
            message: "Notice created successfully",
            notice: populatedNotice,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNotices = async (req, res) => {
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
            query = studentClass
                ? { $or: [{ class: { $exists: false } }, { class: null }, { class: studentClass._id }] }
                : { $or: [{ class: { $exists: false } }, { class: null }] };
        }

        const notices = await Notice.find(query)
            .populate("postedBy", "-password")
            .populate("class")
            .sort({ datePosted: -1 });

        res.status(200).json({ success: true, notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNotice = async (req, res) => {
    try {
        const { title, content, class: classId } = req.body;

        if (classId) {
            const classExists = await ClassModel.exists({ _id: classId });
            if (!classExists) {
                return res.status(404).json({ success: false, message: "Class not found" });
            }
        }

        const update = { title, content };
        if (Object.prototype.hasOwnProperty.call(req.body, "class")) {
            update.class = classId || undefined;
        }

        Object.keys(update).forEach(
            (key) => update[key] === undefined && delete update[key]
        );

        const notice = await Notice.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true,
        })
            .populate("postedBy", "-password")
            .populate("class");

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({ success: true, message: "Notice updated successfully", notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
