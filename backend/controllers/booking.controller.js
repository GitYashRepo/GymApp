const Booking = require("../models/Booking");
const GymPod = require("../models/GymPod");

/**
 * 1️⃣ CREATE BOOKING (30 min)
 * POST /api/bookings
 */
exports.createBooking = async (req, res) => {
  try {
    const { gymPodId, startTime } = req.body;

    if (!gymPodId || !startTime) {
      return res.status(400).json({ message: "Missing booking data" });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    // 🔴 Prevent overlapping bookings
    const conflict = await Booking.findOne({
      gymPod: gymPodId,
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: "booked"
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      gymPod: gymPodId,
      startTime: start,
      endTime: end,
      amountPaid: 0
    });

    res.status(201).json({
      success: true,
      message: "Booking confirmed",
      data: booking
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 2️⃣ GET POD AVAILABILITY (SLOTS)
 * GET /api/bookings/availability/:podId?date=YYYY-MM-DD
 */
exports.getPodAvailability = async (req, res) => {
  try {
    const { podId } = req.params;
    const { date } = req.query;

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const bookings = await Booking.find({
      gymPod: podId,
      startTime: { $gte: dayStart, $lte: dayEnd },
      status: "booked"
    });

    res.status(200).json({
      success: true,
      bookedSlots: bookings.map(b => ({
        startTime: b.startTime,
        endTime: b.endTime
      }))
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 3️⃣ GET USER BOOKINGS
 * GET /api/bookings/my
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("gymPod", "name locationName images")
      .sort({ startTime: -1 });

    // Auto mark completed
    const now = new Date();
    bookings.forEach(b => {
      if (b.status === "booked" && b.endTime < now) {
        b.status = "completed";
        b.save();
      }
    });

    res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 4️⃣ CANCEL BOOKING
 * PATCH /api/bookings/:id/cancel
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.startTime <= new Date()) {
      return res.status(400).json({
        message: "Cannot cancel ongoing or past booking"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
