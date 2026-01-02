const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gymPod: { type: mongoose.Schema.Types.ObjectId, ref: "GymPod", required: true},
  startTime: { type: Date, required: true},
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" },
  amountPaid: Number
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
