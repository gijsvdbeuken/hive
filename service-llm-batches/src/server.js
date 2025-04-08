require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || null;

if (!port) {
  console.error(
    "Error: The server port was not found in the environment variables. Please define the PORT variable in your .env file."
  );
  process.exit(1);
}

app.use(express.json());

const userRoutes = require("./routes/userRoutes");

app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`User Service running at http://localhost:${port}`);
});
