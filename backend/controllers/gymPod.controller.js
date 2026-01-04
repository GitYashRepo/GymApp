const GymPod = require("../models/GymPod");
const Booking = require("../models/Booking");


/**
 * ADMIN: Create Gym Pod
 */
exports.createGymPod = async (req, res) => {
  try {
    const {
      name,
      locationName,
      pricePer30Min,
      description,
      images
    } = req.body;

    const pod = await GymPod.create({
      name,
      locationName,
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
    const pods = await GymPod.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("name locationName pricePer30Min description maxCapacity");

    res.status(200).json({
      success: true,
      data: pods,
    });
  } catch (err) {
    console.error("GET HOME PODS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
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
