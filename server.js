const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const express = require("express");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const harvestRoutes = require("./routes/harvestRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/harvests", harvestRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Home Route
app.get("/", (req, res) => {
  res.send("🌾 FarmOS Backend is Running!");
});

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
