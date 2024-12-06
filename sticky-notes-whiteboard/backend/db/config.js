const { Client } = require("pg");
const dotenv = require("dotenv")

dotenv.config()

const client = new Client({
  connectionString: process.env.POSTGRES_DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Render databases
});

client.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to database");
  }
});

module.exports = { client };