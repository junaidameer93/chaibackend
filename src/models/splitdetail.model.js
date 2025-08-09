import mongoose, { Schema, model } from "mongoose";

const splitDetailSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User', 
         required: true 
    },
    expense: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expense', 
        required: true 
    },
    amountOwed: { 
        type: Number, 
        required: true,
        min: 0 
    },
    status: { 
        type: String, 
        enum: ['pending', 'settled'], 
        default: 'pending' 
    }
},{ 
    timestamps: true 
})

export const SplitDetail = model("SplitDetail", splitDetailSchema);