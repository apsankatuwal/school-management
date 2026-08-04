import { Schema, model } from "mongoose";

const ClassSchema = new Schema(
    {
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

        classTeacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
        },

        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "Student",
            },
        ],

        academicYear: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ClassModel = model("Class", ClassSchema);

export default ClassModel;