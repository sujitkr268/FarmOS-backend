const { pool } = require("../config/db");

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,

      name VARCHAR(100) NOT NULL,

      email VARCHAR(255) NOT NULL UNIQUE,

      password VARCHAR(255) NOT NULL,

      role VARCHAR(20) NOT NULL DEFAULT 'farmer'
        CHECK (role IN ('farmer', 'buyer', 'admin')),

      phone VARCHAR(20) NOT NULL,

      location VARCHAR(255) NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Users table ready");
  } catch (error) {
    console.error("Error creating users table:", error.message);
  }
};

const User = {
  createUsersTable,
};

module.exports = User;
