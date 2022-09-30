const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const ParkingLot = new mongoose.Schema(
  {
    name: { type: String, required: true },
    floor: { type: Number, unique: true, required: true },
    slots: Object,
  },
  { versionKey: false, timestamps: true }
).plugin(uniqueValidator);
module.exports = mongoose.model("parking_lot", ParkingLot);
