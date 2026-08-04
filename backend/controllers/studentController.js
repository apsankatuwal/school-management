import Student from "../models/Student.js";

export const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
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
                      {
                          admissionNumber: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                      {
                          className: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                      {
                          section: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                  ],
              }
            : {};

        const [students, totalStudents] = await Promise.all([
            Student.find(searchQuery)
                .populate("user")
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
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("user");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            student,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};