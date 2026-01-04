const express = require("express");
const router = express.Router();

const {
  createBooking,
  getPodAvailability,
  getMyBookings,
  cancelBooking,
  uploadPaymentProof
} = require("../controllers/booking.controller");

const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// Create booking (pending)
router.post("/", protect, createBooking);

// Upload payment screenshot
router.patch(
  "/:id/verify-payment",
  protect,
  upload.single("payment"),
  uploadPaymentProof
);

// Availability
router.get("/availability/:podId", getPodAvailability);

// User bookings
router.get("/my", protect, getMyBookings);

// Cancel
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
