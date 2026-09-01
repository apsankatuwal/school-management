import Fee from "../models/fee.js";

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