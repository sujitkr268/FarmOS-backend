const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Check required fields
    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Validate role
    const allowedRoles = ["farmer", "buyer", "admin"];
    const userRole = role || "farmer";

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password,
        role,
        phone,
        location
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role, phone, location, created_at
      `,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
        userRole,
        phone.trim(),
        location.trim()
      ]
    );

    const user = result.rows[0];

    // Send response
    return res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error("Register Error:", error.message);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user in PostgreSQL
    const result = await pool.query(
      `
      SELECT id, name, email, password, role
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    // User not found
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Send successful response
    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= EXPORT =================

module.exports = {
  registerUser,
  loginUser
};
