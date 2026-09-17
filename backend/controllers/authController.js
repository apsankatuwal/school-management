import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "This account has been deactivated. Contact your admin.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};