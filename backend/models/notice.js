import { Schema, model } from "mongoose";

const NoticeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
        },

        datePosted: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Notice = model("Notice", NoticeSchema);

export default Notice;
