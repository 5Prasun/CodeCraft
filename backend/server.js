// server.js
import express from "express";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// Add your other routes here
// Example: app.use("/api/users", userRoutes);

// Catch-all route (must be last)
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
