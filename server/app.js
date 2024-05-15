const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5005;
const mongoose = require("mongoose");

const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// const cohorts = require("./cohorts.json");
// const students = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: [
      "http://localhost:5173",
      "http://example.com",
      "http://localhost:5005",
    ],
  })
);
// Use the CORS middleware with options to allow requests
// from specific IP addresses and domains.
/*
To ensure your CORS middleware is working properly, you should set it before any route or router definition. The easiest way to do this is to place cors as the first middleware right after instantiating the server (const app = express()).
*/

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// Student Routes
const studentRouter = require("./routes/student.routes"); // <== IMPORT
app.use("/api", studentRouter);

// Cohort Routes
const cohortRouter = require("./routes/cohort.routes");
app.use("/api", cohortRouter);

require("./error-handling")(app);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
