const mongoose = require("mongoose");
const Ticket = new mongoose.Schema(
  {
    plateNumber: { type: String, required: true },
    size: { type: String, enum: ["s", "m", "l", "xl"], required: true },
    slotID: Number,
    parkingId: String,
    parkingFloor: Number,
    parkedAt: { type: Date },
    exitedAt: { type: Date },
  },
  { versionKey: false, timestamps: false }
);
module.exports = mongoose.model("ticket", Ticket);
