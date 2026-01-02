const mongoose = require("mongoose");

const gymPodSchema = new mongoose.Schema({
  name: { type: String, required: true,trim: true},
  locationName: {type: String, required: true},
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true},
  pricePer30Min: {type: Number, required: true},
  description: {type: String},
  images: [String],
  isActive: {type: Boolean, default: true},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "Admin"}
}, { timestamps: true });

module.exports = mongoose.model("GymPod", gymPodSchema);
