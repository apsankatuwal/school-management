import { Schema, model } from "mongoose";

const AssignmentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Assignment = model("Assignment", AssignmentSchema);

export default Assignment;
