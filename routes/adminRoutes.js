const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllHarvests,
  getAllOrders,
  getDashboardStats
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ================= ADMIN ROUTES =================

// Get all users
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);
// ================= GET ALL HARVESTS =================

router.get(
  "/harvests",
  protect,
  authorizeRoles("admin"),
  getAllHarvests
);
// ================= GET ALL ORDERS =================

router.get(
  "/orders",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);
// ================= ADMIN DASHBOARD STATS =================

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);
module.exports = router;
