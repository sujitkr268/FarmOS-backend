const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing from .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log(
      `PostgreSQL Connected Successfully: ${client.connectionParameters.host}`
    );

    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL Connection Error");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB,
};
