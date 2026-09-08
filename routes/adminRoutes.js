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
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Admin access required
 */

// Get all users
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);
// ================= GET ALL HARVESTS =================

/**
 * @swagger
 * /api/admin/harvests:
 *   get:
 *     summary: Get all harvests
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Harvests retrieved successfully
 *       403:
 *         description: Admin access required
 */

router.get(
  "/harvests",
  protect,
  authorizeRoles("admin"),
  getAllHarvests
);
// ================= GET ALL ORDERS =================


/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       403:
 *         description: Admin access required
 */

router.get(
  "/orders",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);
// ================= ADMIN DASHBOARD STATS =================

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       403:
 *         description: Admin access required
 */

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);
module.exports = router;
