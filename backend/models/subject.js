import { Schema, model } from "mongoose";

const SubjectSchema = new Schema(
    {
        subjectCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        subjectName: {
            type: String,
            required: true,
            trim: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },

        creditHours: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

const Subject = model("Subject", SubjectSchema);

export default Subject;