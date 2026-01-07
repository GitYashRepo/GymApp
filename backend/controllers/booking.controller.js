const Booking = require("../models/Booking");
const GymPod = require("../models/GymPod");
const { generateSlots } = require("../utils/slotGenerator");

/**
 * 1️⃣ CREATE BOOKING (30 min)
 * POST /api/bookings
 */
exports.createBooking = async (req, res) => {
  try {
    const { gymPodId, slotDate, startTime, personsCount } = req.body;

    if (!gymPodId || !slotDate || !startTime || !personsCount) {
      return res.status(400).json({ message: "Missing booking data" });
    }

    const pod = await GymPod.findById(gymPodId);
    if (!pod) {
      return res.status(404).json({ message: "Pod not found" });
    }

    if (personsCount > pod.maxCapacity) {
      return res.status(400).json({
        message: `Maximum ${pod.maxCapacity} persons allowed`
      });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    // 🔢 Count already booked persons
    const result = await Booking.aggregate([
      {
        $match: {
          gymPod: new mongoose.Types.ObjectId(gymPodId),
          slotDate,
          startTime: start,
          status: { $ne: "cancelled" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$personsCount" }
        }
      }
    ]);

    const alreadyBooked = result[0]?.total || 0;

    if (alreadyBooked + personsCount > pod.maxCapacity) {
      return res.status(400).json({
        message: "Slot capacity full, please select another slot"
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      gymPod: gymPodId,
      slotDate,
      startTime: start,
      endTime: end,
      personsCount
    });

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const pod = await GymPod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: "Pod not found" });
    }

    const slots = generateSlots(date);

    const bookings = await Booking.find({
      gymPod: podId,
      slotDate: date,
      status: { $ne: "cancelled" }
    });

    const slotMap = {};

    bookings.forEach(b => {
      const key = b.startTime.toISOString();
      slotMap[key] = (slotMap[key] || 0) + b.personsCount;
    });

    const response = slots.map(slot => {
      const key = slot.startTime.toISOString();
      const booked = slotMap[key] || 0;

      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        bookedPersons: booked,
        maxCapacity: pod.maxCapacity,
        isFull: booked >= pod.maxCapacity
      };
    });

    res.json({ success: true, data: response });

  } catch (err) {
    res.status(500).json({ message: err.message });
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

/**
 * UPLOAD PAYMENT SCREENSHOT
 * PATCH /api/bookings/:id/upload-payment
 */
exports.uploadPaymentProof = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending_payment") {
      return res.status(400).json({
        message: "Payment already uploaded or booking processed"
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Payment screenshot required" });
    }

    booking.paymentProof = {
      image: `/uploads/payments/${req.file.filename}`,
      uploadedAt: new Date()
    };

    booking.status = "payment_uploaded";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment proof uploaded successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
