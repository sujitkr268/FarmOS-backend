const express = require("express");
const router = express.Router();

const {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
   updateOrderStatus
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ================= CREATE ORDER =================

router.post(
  "/",
  protect,
  authorizeRoles("buyer"),
  createOrder
);
// ================= GET BUYER ORDERS =================

router.get(
  "/my-orders",
  protect,
  authorizeRoles("buyer"),
  getBuyerOrders
);


// ================= GET FARMER INCOMING ORDERS =================

router.get(
  "/incoming",
  protect,
  authorizeRoles("farmer"),
  getFarmerOrders
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("farmer"),
  updateOrderStatus
);


module.exports = router;
