const { pool } = require("../config/db");

// ================= CREATE HARVEST =================

const createHarvest = async (req, res) => {
  try {
    const {
      crop_name,
      quantity,
      unit,
      price,
      location,
      description
    } = req.body;

    // Check required fields
    if (
      !crop_name ||
      !quantity ||
      !unit ||
      !price ||
      !location
    ) {
      return res.status(400).json({
        message: "Please provide all required harvest fields"
      });
    }

    // Get farmer ID from authenticated user
    const farmerId = req.user.id;

    // Insert harvest into PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO harvests (
        farmer_id,
        crop_name,
        quantity,
        unit,
        price,
        location,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        farmerId,
        crop_name.trim(),
        quantity,
        unit.trim(),
        price,
        location.trim(),
        description || null
      ]
    );

    // Get created harvest
    const harvest = result.rows[0];

    return res.status(201).json({
      message: "Harvest created successfully",
      harvest
    });

  } catch (error) {
    console.error("Create Harvest Error:", error.message);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= GET ALL HARVESTS =================

const getAllHarvests = async (req, res) => {
  try {

    // Get all available harvests
    const result = await pool.query(
      `
      SELECT
        harvests.id,
        harvests.crop_name,
        harvests.quantity,
        harvests.unit,
        harvests.price,
        harvests.location,
        harvests.description,
        harvests.status,
        harvests.created_at,

        users.id AS farmer_id,
        users.name AS farmer_name,
        users.phone AS farmer_phone

      FROM harvests

      JOIN users
      ON harvests.farmer_id = users.id

      ORDER BY harvests.created_at DESC
      `
    );

    return res.status(200).json({
      count: result.rows.length,
      harvests: result.rows
    });

  } catch (error) {

    console.error(
      "Get Harvests Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ================= GET SINGLE HARVEST =================

const getHarvestById = async (req, res) => {
  try {
    // Get harvest ID from URL
    const { id } = req.params;

    // Find harvest by ID
    const result = await pool.query(
      `
      SELECT
        harvests.*,

        users.name AS farmer_name,
        users.phone AS farmer_phone

      FROM harvests

      JOIN users
      ON harvests.farmer_id = users.id

      WHERE harvests.id = $1
      `,
      [id]
    );

    // Check if harvest exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Harvest not found"
      });
    }

    return res.status(200).json({
      harvest: result.rows[0]
    });

  } catch (error) {
    console.error(
      "Get Harvest Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// ================= UPDATE HARVEST =================

const updateHarvest = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      crop_name,
      quantity,
      unit,
      price,
      location,
      description,
      status
    } = req.body;

    // Find the harvest first
    const existingHarvest = await pool.query(
      `
      SELECT *
      FROM harvests
      WHERE id = $1
      `,
      [id]
    );

    // Check if harvest exists
    if (existingHarvest.rows.length === 0) {
      return res.status(404).json({
        message: "Harvest not found"
      });
    }

    const harvest = existingHarvest.rows[0];

    // Check ownership
    if (harvest.farmer_id !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own harvest"
      });
    }

    // Update the harvest
    const result = await pool.query(
      `
      UPDATE harvests
      SET
        crop_name = $1,
        quantity = $2,
        unit = $3,
        price = $4,
        location = $5,
        description = $6,
        status = $7,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $8

      RETURNING *
      `,
      [
        crop_name || harvest.crop_name,
        quantity || harvest.quantity,
        unit || harvest.unit,
        price || harvest.price,
        location || harvest.location,
        description || harvest.description,
        status || harvest.status,
        id
      ]
    );

    return res.status(200).json({
      message: "Harvest updated successfully",
      harvest: result.rows[0]
    });

  } catch (error) {
    console.error(
      "Update Harvest Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// ================= DELETE HARVEST =================

const deleteHarvest = async (req, res) => {
  try {
    // Get harvest ID from URL
    const { id } = req.params;

    // Find harvest first
    const existingHarvest = await pool.query(
      `
      SELECT *
      FROM harvests
      WHERE id = $1
      `,
      [id]
    );

    // Check if harvest exists
    if (existingHarvest.rows.length === 0) {
      return res.status(404).json({
        message: "Harvest not found"
      });
    }

    const harvest = existingHarvest.rows[0];

    // Check ownership
    if (harvest.farmer_id !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own harvest"
      });
    }

    // Delete harvest
    await pool.query(
      `
      DELETE FROM harvests
      WHERE id = $1
      `,
      [id]
    );

    return res.status(200).json({
      message: "Harvest deleted successfully"
    });

  } catch (error) {

    console.error(
      "Delete Harvest Error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
module.exports = {
  createHarvest,
  getAllHarvests,
  getHarvestById,
  updateHarvest,
   deleteHarvest
};
