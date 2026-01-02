const express = require("express");
const router = express.Router();

const {
  createBooking,
  getPodAvailability,
  getMyBookings,
  cancelBooking
} = require("../controllers/booking.controller");

const { protect } = require("../middlewares/auth.middleware");

// User routes
router.post("/", protect, createBooking);
router.get("/availability/:podId", getPodAvailability);
router.get("/my", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
