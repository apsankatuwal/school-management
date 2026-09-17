import bcrypt from "bcrypt";
import User from "../models/user.js";
import Student from "../models/student.js";

export const createStudent = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            admissionNumber,
            className,
            section,
            rollNumber,
            gender,
            dateOfBirth,
            address,
            guardianName,
            guardianPhone,
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
            role: "student",
        });

        let student;
        try {
            student = await Student.create({
                user: user._id,
                admissionNumber,
                className,
                section,
                rollNumber,
                gender,
                dateOfBirth,
                address,
                guardianName,
                guardianPhone,
            });
        } catch (studentError) {
            await User.findByIdAndDelete(user._id);
            throw studentError;
        }

        const populatedStudent = await student.populate("user", "-password");

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: populatedStudent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                  $or: [
                      { admissionNumber: { $regex: search, $options: "i" } },
                      { className: { $regex: search, $options: "i" } },
                      { section: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const [students, totalStudents] = await Promise.all([
            Student.find(searchQuery)
                .populate("user", "-password")
                .skip(skip)
                .limit(limit),
            Student.countDocuments(searchQuery),
        ]);

        res.status(200).json({
            success: true,
            students,
            pagination: {
                page,
                limit,
                totalStudents,
                totalPages: Math.ceil(totalStudents / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("user", "-password");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// NEW — a student looking up their own profile. No :id needed, it comes from their token.
export const getMyProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id }).populate(
            "user",
            "-password"
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student profile is linked to this account. Ask your admin.",
            });
        }

        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const { firstName, lastName, email, phone, password, ...profileFields } = req.body;

        const userUpdate = {};
        if (firstName) userUpdate.firstName = firstName;
        if (lastName) userUpdate.lastName = lastName;
        if (email) userUpdate.email = email;
        if (phone) userUpdate.phone = phone;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);

        if (Object.keys(userUpdate).length > 0) {
            await User.findByIdAndUpdate(student.user, userUpdate, { runValidators: true });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            profileFields,
            { new: true, runValidators: true }
        ).populate("user", "-password");

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student: updatedStudent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        await User.findByIdAndDelete(student.user);

        res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};