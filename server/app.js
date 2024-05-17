// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");
const { isAuthenticated } = require("./middleware/jwt.middleware");
// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// Student Routes
const studentRouter = require("./routes/student.routes");
app.use("/api", studentRouter);

// Cohort Routes
const cohortRouter = require("./routes/cohort.routes");
app.use("/api", cohortRouter);

// Auth Routes
const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

// User Routes - Nach den Authentifizierungsrouten platzieren, um Endlosschleifen zu vermeiden
const userRouter = require("./routes/user.routes");
app.use("/api", isAuthenticated, userRouter);

// const userRouter = require(“./routes/user.routes”);
// app.use(“/”, userRouter);

require("./error-handling")(app);

module.exports = app;
