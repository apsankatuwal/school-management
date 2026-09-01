import Teacher from "../models/teacher.js";

export const createTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
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
                      {
                          employeeId: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                      {
                          department: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                      {
                          qualification: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                  ],
              }
            : {};

        const [teachers, totalTeachers] = await Promise.all([
            Teacher.find(searchQuery)
                .populate("user")
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
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate("user");

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        res.json({
            success: true,
            teacher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.json({
            success: true,
            teacher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Teacher deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};