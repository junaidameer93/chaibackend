import mongoose, { Schema, model } from "mongoose";

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
},{
    timestamps: true
  });

export const Group = model("Group", groupSchema);