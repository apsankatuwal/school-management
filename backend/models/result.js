import { Schema, model } from "mongoose";

const ResultSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        exam: {
            type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },

        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        obtainedMarks: {
            type: Number,
            required: true,
        },

        grade: {
            type: String,
            default: "",
        },

        remarks: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Result = model("Result", ResultSchema);

export default Result;