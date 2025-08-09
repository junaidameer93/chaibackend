import { Schema, model } from 'mongoose';

const settleUpSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  settledAt: {
    type: Date,
    default: Date.now,
  },
});

export const SettleUp = model('SettleUp', settleUpSchema);
