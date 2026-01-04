const express = require("express");
const router = express.Router();
const {
  createGymPod,
  getHomePods,
  getPodDetails,
  togglePodStatus
} = require("../controllers/gymPod.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");


// ADMIN
router.post("/create-pods", protect, adminOnly, createGymPod);
router.patch("/:id/toggle", protect, adminOnly, togglePodStatus);

// USER
router.get("/get-pods", getHomePods);
router.get("/:id", getPodDetails);

module.exports = router;
