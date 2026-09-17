import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },

        date: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["Present", "Absent", "Late"],
            default: "Present",
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = model("Attendance", AttendanceSchema);

export default Attendance;