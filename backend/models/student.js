import { Schema, model } from "mongoose";

const StudentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        admissionNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        className: {
            type: String,
            required: true,
            trim: true,
        },

        section: {
            type: String,
            required: true,
            trim: true,
        },

        rollNumber: {
            type: Number,
            required: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        guardianName: {
            type: String,
            required: true,
        },

        guardianPhone: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Student = model("Student", StudentSchema);

export default Student;