const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  gymPod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GymPod",
    required: true
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  status: {
    type: String,
    enum: [
      "pending_payment",
      "payment_uploaded",
      "confirmed",
      "completed",
      "cancelled"
    ],
    default: "pending_payment"
  },

  amountPaid: Number,

  paymentProof: {
    image: String,
    uploadedAt: Date
  },

  paymentVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  verifiedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
