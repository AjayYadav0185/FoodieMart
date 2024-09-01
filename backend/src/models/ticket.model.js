import { model, Schema } from "mongoose";

export const TicketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: true },
    mark: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const TicketModel = model("ticket", TicketSchema);
