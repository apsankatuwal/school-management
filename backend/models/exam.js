import { Schema, model } from "mongoose";

const ExamSchema = new Schema(
    {
        examName: {
            type: String,
            required: true,
            trim: true,
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

        examDate: {
            type: Date,
            required: true,
        },

        totalMarks: {
            type: Number,
            required: true,
        },

        passingMarks: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Exam = model("Exam", ExamSchema);

export default Exam;