const { pool } = require("../config/db");

// ================= CREATE ORDER =================

const createOrder = async (req, res) => {
  try {
    const { harvest_id, quantity } = req.body;

    // Check required fields
    if (!harvest_id || !quantity) {
      return res.status(400).json({
        message: "Harvest ID and quantity are required"
      });
    }

    // Check quantity is valid
    if (Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than zero"
      });
    }

    // Get buyer ID from logged-in user
    const buyerId = req.user.id;

    // Find the harvest
    const harvestResult = await pool.query(
      `
      SELECT *
      FROM harvests
      WHERE id = $1
      `,
      [harvest_id]
    );

    // Check if harvest exists
    if (harvestResult.rows.length === 0) {
      return res.status(404).json({
        message: "Harvest not found"
      });
    }

    const harvest = harvestResult.rows[0];

    // Check harvest availability
    if (harvest.status !== "available") {
      return res.status(400).json({
        message: "This harvest is not available"
      });
    }

    // Check buyer is not buying own harvest
    if (harvest.farmer_id === buyerId) {
      return res.status(400).json({
        message: "You cannot order your own harvest"
      });
    }

    // Check available quantity
    if (Number(quantity) > Number(harvest.quantity)) {
      return res.status(400).json({
        message: "Requested quantity is greater than available quantity"
      });
    }

    // Calculate total price on backend
    const totalPrice =
      Number(quantity) * Number(harvest.price);

    // Create order
    const result = await pool.query(
      `
      INSERT INTO orders (
        harvest_id,
        buyer_id,
        farmer_id,
        quantity,
        total_price
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        harvest_id,
        buyerId,
        harvest.farmer_id,
        quantity,
        totalPrice
      ]
    );

    return res.status(201).json({
      message: "Order created successfully",
      order: result.rows[0]
    });

  } catch (error) {
    console.error(
      "Create Order Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// ================= GET BUYER ORDERS =================

const getBuyerOrders = async (req, res) => {
  try {
    // Get logged-in buyer ID
    const buyerId = req.user.id;

    // Get all orders created by this buyer
    const result = await pool.query(
      `
      SELECT
        orders.*,

        harvests.crop_name,
        harvests.unit,
        harvests.location,

        users.name AS farmer_name,
        users.phone AS farmer_phone

      FROM orders

      JOIN harvests
      ON orders.harvest_id = harvests.id

      JOIN users
      ON orders.farmer_id = users.id

      WHERE orders.buyer_id = $1

      ORDER BY orders.created_at DESC
      `,
      [buyerId]
    );

    return res.status(200).json({
      count: result.rows.length,
      orders: result.rows
    });

  } catch (error) {

    console.error(
      "Get Buyer Orders Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// ================= GET FARMER ORDERS =================

const getFarmerOrders = async (req, res) => {
  try {
    // Get logged-in farmer ID
    const farmerId = req.user.id;

    // Get all orders received by this farmer
    const result = await pool.query(
      `
      SELECT
        orders.*,

        harvests.crop_name,
        harvests.unit,
        harvests.location,

        users.name AS buyer_name,
        users.phone AS buyer_phone

      FROM orders

      JOIN harvests
      ON orders.harvest_id = harvests.id

      JOIN users
      ON orders.buyer_id = users.id

      WHERE orders.farmer_id = $1

      ORDER BY orders.created_at DESC
      `,
      [farmerId]
    );

    return res.status(200).json({
      count: result.rows.length,
      orders: result.rows
    });

  } catch (error) {

    console.error(
      "Get Farmer Orders Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// ================= UPDATE ORDER STATUS =================

const updateOrderStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow accepted or rejected
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected"
      });
    }

    // Start database transaction
    await client.query("BEGIN");

    // Find and lock the order
    const existingOrder = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    );

    // Check if order exists
    if (existingOrder.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Order not found"
      });
    }

    const order = existingOrder.rows[0];

    // Check ownership
    if (order.farmer_id !== req.user.id) {
      await client.query("ROLLBACK");

      return res.status(403).json({
        message: "You can only update orders for your own harvests"
      });
    }

    // Only pending orders can be processed
    if (order.status !== "pending") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "This order has already been processed"
      });
    }

    // If accepting order, update harvest quantity
    if (status === "accepted") {

      // Lock harvest row
      const harvestResult = await client.query(
        `
        SELECT *
        FROM harvests
        WHERE id = $1
        FOR UPDATE
        `,
        [order.harvest_id]
      );

      if (harvestResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          message: "Harvest not found"
        });
      }

      const harvest = harvestResult.rows[0];

      // Check enough quantity still exists
      if (Number(order.quantity) > Number(harvest.quantity)) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          message: "Not enough harvest quantity available"
        });
      }

      // Calculate remaining quantity
      const remainingQuantity =
        Number(harvest.quantity) - Number(order.quantity);

      // Update harvest
      await client.query(
        `
        UPDATE harvests
        SET
          quantity = $1,
          status = CASE
            WHEN $1 <= 0 THEN 'unavailable'
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [
          remainingQuantity,
          order.harvest_id
        ]
      );
    }

    // Update order status
    const result = await client.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    // Commit transaction
    await client.query("COMMIT");

    return res.status(200).json({
      message: `Order ${status} successfully`,
      order: result.rows[0]
    });

  } catch (error) {

    // Undo changes if something fails
    await client.query("ROLLBACK");

    console.error(
      "Update Order Status Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });

  } finally {

    // Release database connection
    client.release();
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
updateOrderStatus
};
