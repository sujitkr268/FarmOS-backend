const { pool } = require("../config/db");

// ================= GET ALL USERS =================

const getAllUsers = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        role,
        phone,
        location,
        created_at

      FROM users

      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      count: result.rows.length,
      users: result.rows
    });

  } catch (error) {

    console.error(
      "Get All Users Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= EXPORT =================

// ================= GET ALL HARVESTS (ADMIN) =================

const getAllHarvests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        harvests.id,
        harvests.crop_name,
        harvests.quantity,
        harvests.unit,
        harvests.price,
        harvests.location,
        harvests.status,
        harvests.created_at,

        users.id AS farmer_id,
        users.name AS farmer_name,
        users.email AS farmer_email

      FROM harvests

      JOIN users
      ON harvests.farmer_id = users.id

      ORDER BY harvests.created_at DESC
    `);

    return res.status(200).json({
      count: result.rows.length,
      harvests: result.rows
    });

  } catch (error) {

    console.error(
      "Get All Harvests Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// ================= GET ALL ORDERS (ADMIN) =================

const getAllOrders = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        orders.id,
        orders.quantity,
        orders.total_price,
        orders.status,
        orders.created_at,

        harvests.id AS harvest_id,
        harvests.crop_name,
        harvests.unit,

        farmers.id AS farmer_id,
        farmers.name AS farmer_name,
        farmers.phone AS farmer_phone,

        buyers.id AS buyer_id,
        buyers.name AS buyer_name,
        buyers.phone AS buyer_phone

      FROM orders

      JOIN harvests
      ON orders.harvest_id = harvests.id

      JOIN users AS farmers
      ON orders.farmer_id = farmers.id

      JOIN users AS buyers
      ON orders.buyer_id = buyers.id

      ORDER BY orders.created_at DESC
    `);

    return res.status(200).json({
      count: result.rows.length,
      orders: result.rows
    });

  } catch (error) {

    console.error(
      "Get All Orders Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// ================= ADMIN DASHBOARD STATS =================

const getDashboardStats = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT

        (SELECT COUNT(*) FROM users) AS total_users,

        (SELECT COUNT(*)
         FROM users
         WHERE role = 'farmer') AS total_farmers,

        (SELECT COUNT(*)
         FROM users
         WHERE role = 'buyer') AS total_buyers,

        (SELECT COUNT(*)
         FROM harvests) AS total_harvests,

        (SELECT COUNT(*)
         FROM harvests
         WHERE status = 'available') AS available_harvests,

        (SELECT COUNT(*)
         FROM orders) AS total_orders,

        (SELECT COUNT(*)
         FROM orders
         WHERE status = 'pending') AS pending_orders,

        (SELECT COUNT(*)
         FROM orders
         WHERE status = 'accepted') AS accepted_orders
    `);

    return res.status(200).json({
      stats: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Dashboard Stats Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
module.exports = {
  getAllUsers,
  getAllHarvests,
  getAllOrders,
getDashboardStats
};
