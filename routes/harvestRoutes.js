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
