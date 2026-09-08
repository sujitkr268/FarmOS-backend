const express = require("express");
const router = express.Router();

const {
  createHarvest,
  getAllHarvests,
  getHarvestById,
  updateHarvest,
  deleteHarvest
} = require("../controllers/harvestController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ================= CREATE HARVEST =================

router.post(
  "/",
  protect,
  authorizeRoles("farmer"),
  createHarvest
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

router.get("/", getAllHarvests);
// ================= GET SINGLE HARVEST =================

router.get("/:id", getHarvestById);

// ================= UPDATE HARVEST =================

router.put(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  updateHarvest
);
// ================= DELETE HARVEST =================

router.delete(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  deleteHarvest
);
module.exports = router;
