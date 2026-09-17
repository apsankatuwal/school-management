import bcrypt from "bcrypt";
import User from "../models/user.js";
import Teacher from "../models/teacher.js";

export const createTeacher = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            employeeId,
            department,
            qualification,
            experience,
            phone,
            address,
            salary,
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            role: "teacher", // hard-coded on purpose — this endpoint can only ever create teachers
        });

        let teacher;
        try {
            teacher = await Teacher.create({
                user: user._id,
                employeeId,
                department,
                qualification,
                experience,
                phone,
                address,
                salary,
            });
        } catch (teacherError) {
            await User.findByIdAndDelete(user._id);
            throw teacherError;
        }

        const populatedTeacher = await teacher.populate("user", "-password");

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher: populatedTeacher,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllTeachers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                  $or: [
                      { employeeId: { $regex: search, $options: "i" } },
                      { department: { $regex: search, $options: "i" } },
                      { qualification: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const [teachers, totalTeachers] = await Promise.all([
            Teacher.find(searchQuery)
                .populate("user", "-password")
                .skip(skip)
                .limit(limit),
            Teacher.countDocuments(searchQuery),
        ]);

        res.status(200).json({
            success: true,
            teachers,
            pagination: {
                page,
                limit,
                totalTeachers,
                totalPages: Math.ceil(totalTeachers / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate("user", "-password");

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.json({ success: true, teacher });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        const { firstName, lastName, email, phone, password, ...profileFields } = req.body;

        const userUpdate = {};
        if (firstName) userUpdate.firstName = firstName;
        if (lastName) userUpdate.lastName = lastName;
        if (email) userUpdate.email = email;
        if (phone) userUpdate.phone = phone;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);

        if (Object.keys(userUpdate).length > 0) {
            await User.findByIdAndUpdate(teacher.user, userUpdate, { runValidators: true });
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            profileFields,
            { new: true, runValidators: true }
        ).populate("user", "-password");

        res.json({ success: true, message: "Teacher updated successfully", teacher: updatedTeacher });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        await User.findByIdAndDelete(teacher.user);

        res.json({ success: true, message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};