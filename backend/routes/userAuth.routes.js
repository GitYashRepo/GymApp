const express = require("express");
const router = express.Router();
const { register, login, profile } = require("../controllers/userAuth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, profile);

module.exports = router;
