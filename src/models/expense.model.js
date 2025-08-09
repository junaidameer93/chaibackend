import mongoose, { Schema, model } from "mongoose";

const expenseSchema = new Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    splitDetails:[{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SplitDetail' 
    }]
},{
    timestamps: true
  });

export const Expense = model("Expense", expenseSchema);