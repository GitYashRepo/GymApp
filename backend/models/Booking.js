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

  // SLOT INFO
  slotDate: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true
  },

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    required: true
  },

  // CAPACITY
  personsCount: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },

  // PAYMENT FLOW
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
