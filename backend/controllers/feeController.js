import Fee from "../models/fee.js";
import Student from "../models/student.js";

export const createFee = async (req, res) => {
    try {
        const fee = await Fee.create(req.body);

        res.status(201).json({
            success: true,
            message: "Fee record created successfully",
            fee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find().populate("student");

        res.status(200).json({
            success: true,
            fees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// NEW — only this student's own fee records
export const getMyFees = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student profile is linked to this account. Ask your admin.",
            });
        }

        const fees = await Fee.find({ student: student._id }).sort({ dueDate: -1 });

        const totalPaid = fees
            .filter((f) => f.status === "Paid")
            .reduce((sum, f) => sum + f.amount, 0);
        const totalPending = fees
            .filter((f) => f.status !== "Paid")
            .reduce((sum, f) => sum + f.amount, 0);

        res.status(200).json({
            success: true,
            fees,
            summary: { totalPaid, totalPending },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateFee = async (req, res) => {
    try {
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            fee,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteFee = async (req, res) => {
    try {
        await Fee.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Fee deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};