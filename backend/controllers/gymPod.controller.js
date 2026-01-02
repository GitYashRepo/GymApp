const GymPod = require("../models/GymPod");

/**
 * ADMIN: Create Gym Pod
 */
exports.createGymPod = async (req, res) => {
  try {
    const {
      name,
      locationName,
      latitude,
      longitude,
      pricePer30Min,
      description,
      images
    } = req.body;

    const pod = await GymPod.create({
      name,
      locationName,
      latitude,
      longitude,
      pricePer30Min,
      description,
      images,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Gym pod created",
      data: pod
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * USER: Home Page Pods
 */
exports.getHomePods = async (req, res) => {
  try {
    const now = new Date();

    // 1️⃣ Get all active pods
    const pods = await GymPod.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("name locationName pricePer30Min images latitude longitude");

    const podIds = pods.map(p => p._id);

    // 2️⃣ Find pods that are currently booked
    const activeBookings = await Booking.find({
      gymPod: { $in: podIds },
      startTime: { $lte: now },
      endTime: { $gt: now },
      status: "booked"
    }).select("gymPod");

    const bookedPodIds = new Set(
      activeBookings.map(b => b.gymPod.toString())
    );

    // 3️⃣ Attach status to each pod
    const response = pods.map(pod => ({
      _id: pod._id,
      name: pod.name,
      locationName: pod.locationName,
      pricePer30Min: pod.pricePer30Min,
      images: pod.images,
      latitude: pod.latitude,
      longitude: pod.longitude,
      status: bookedPodIds.has(pod._id.toString())
        ? "BOOKED"
        : "BOOK_NOW"
    }));

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * USER: Pod Details Screen
 */
exports.getPodDetails = async (req, res) => {
  try {
    const pod = await GymPod.findById(req.params.id);
    if (!pod) {
      return res.status(404).json({ message: "Pod not found" });
    }

    res.status(200).json({
      success: true,
      data: pod
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN: Activate / Deactivate Pod
 */
exports.togglePodStatus = async (req, res) => {
  const pod = await GymPod.findById(req.params.id);
  if (!pod) return res.status(404).json({ message: "Pod not found" });

  pod.isActive = !pod.isActive;
  await pod.save();

  res.status(200).json({
    success: true,
    message: "Pod status updated",
    isActive: pod.isActive
  });
};
