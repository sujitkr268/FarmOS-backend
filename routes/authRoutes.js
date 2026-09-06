const protect = require("../middleware/authMiddleware");


const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

module.exports = router;
// Protected route for testing JWT
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user
  });
});
module.exports = router;
