const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ================= AUTH ROUTES =================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *               - phone
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test Farmer
 *               email:
 *                 type: string
 *                 example: farmer@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: farmer
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               location:
 *                 type: string
 *                 example: Kolkata
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);


// ================= PROTECTED ROUTE =================

// Any logged-in user can access this
router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    message: "You are authorized",
    user: req.user
  });
});


// ================= ROLE TEST ROUTES =================

// Only farmers can access this
router.get(
  "/farmer-only",
  protect,
  authorizeRoles("farmer"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Farmer! You have access."
    });
  }
);


// Only buyers can access this
router.get(
  "/buyer-only",
  protect,
  authorizeRoles("buyer"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Buyer! You have access."
    });
  }
);


// Admin and farmer can access this
router.get(
  "/admin-farmer",
  protect,
  authorizeRoles("admin", "farmer"),
  (req, res) => {
    res.status(200).json({
      message: "You have permission to access this route."
    });
  }
);
// ================= GET PROFILE =================

router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;
