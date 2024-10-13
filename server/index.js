const express = require("express");
const dbConnect = require("./config/database");
const userRoutes = require("./routes/user");
const friendRequestRoutes = require("./routes/friendrequest");
const postRoutes = require("./routes/post");
const cors = require("cors");

//Connect to database
dbConnect.database();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/friend-request", friendRequestRoutes);
app.use("/api/v1/post", postRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running perfectly...",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
