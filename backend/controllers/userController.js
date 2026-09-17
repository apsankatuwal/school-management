import bcrypt from "bcrypt";
import User from "../models/user.js";

// Only reachable by an already-logged-in admin (enforced in the route file).
// This is the ONLY place in the whole app where a role gets assigned to a new account.
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, phone } = req.body;

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
            role,
            phone,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                  $or: [
                      { firstName: { $regex: search, $options: "i" } },
                      { lastName: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const [users, totalUsers] = await Promise.all([
            User.find(searchQuery).select("-password").skip(skip).limit(limit),
            User.countDocuments(searchQuery),
        ]);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                page,
                limit,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, role, isActive, password } = req.body;

        // Stop an admin from accidentally locking themselves out
        if (req.user._id.toString() === req.params.id && role && role !== "admin") {
            return res.status(400).json({
                success: false,
                message: "You cannot remove your own admin role",
            });
        }

        const update = { firstName, lastName, email, phone, role };

        if (typeof isActive !== "undefined") {
            update.isActive = isActive === "true" || isActive === true;
        }

        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }

        Object.keys(update).forEach(
            (key) => update[key] === undefined && delete update[key]
        );

        const user = await User.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account",
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};