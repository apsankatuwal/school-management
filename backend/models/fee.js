import { Schema, model } from "mongoose";

const FeeSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        paidDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["Pending", "Paid", "Overdue"],
            default: "Pending",
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "Card", "Bank Transfer", "Online"],
            default: "Cash",
        },
    },
    {
        timestamps: true,
    }
);

const Fee = model("Fee", FeeSchema);

export default Fee;