import { Schema, model } from "mongoose";

const TeacherSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        qualification: {
            type: String,
            required: true,
        },

        experience: {
            type: Number,
            default: 0,
        },

        phone: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        salary: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Teacher = model("Teacher", TeacherSchema);

export default Teacher;