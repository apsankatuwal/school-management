import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "../config/database.js";
import User from "../models/user.js";

dotenv.config();

const run = async () => {
    await connectDB();

    const firstName = process.env.SEED_ADMIN_FIRST_NAME || "Super";
    const lastName = process.env.SEED_ADMIN_LAST_NAME || "Admin";
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in your .env first.");
        process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
        if (existing.role === "admin") {
            console.log(`An admin with email ${email} already exists. Nothing to do.`);
            process.exit(0);
        }

        console.error(
            `Seed admin email already exists with role ${existing.role}. Choose a different SEED_ADMIN_EMAIL.`
        );
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const admin = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "admin",
    });

    console.log(`Admin account created: ${admin.email}`);
    process.exit(0);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});