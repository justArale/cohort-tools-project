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

// Student Routes
// POST /api/students - Creates a new student
app.post("/api/students", (req, res) => {
  Student.create(req.body)
    .then((createdStudent) => {
      console.log("Student created ->", createdStudent);
      res.status(201).json(createdStudent);
    })
    .catch((error) => {
      console.log("Error while creating the student ->", error);
      res.status(500).json({ error: "Failed to create the student" });
    });
});

// GET /api/students - Retrieves all of the students in the database collection
app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.log("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

// GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Student.find({ Cohort: cohortId })
    .populate("cohort")
    .then((student) => {
      console.log("Retrieved student ->", student);
      res.status(200).json(student);
    })
    .catch((error) => {
      console.log("Error while retrieving student ->", error);
      res.status(500).json({ error: "Failed to retrieve student" });
    });
});

// GET /api/students/:studentId - Retrieves a specific student by id
app.get("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      console.log("Retrieved student ->", student);
      res.status(200).json(student);
    })
    .catch((error) => {
      console.log("Error while retrieving student ->", error);
      res.status(500).json({ error: "Failed to retrieve student" });
    });
});

// PUT /api/students/:studentId - Updates a specific student by id
app.put("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }
      console.log("Updated student ->", updatedStudent);
      res.status(200).json(updatedStudent);
    })
    .catch((error) => {
      console.log("Error while updating the student ->", error);
      res.status(500).json({ error: "Failed to update the student" });
    });
});

// DELETE /api/students/:studentId - Deletes a specific student by id
app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then((result) => {
      console.log("Student deleted!");
      res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
    })
    .catch((error) => {
      console.log("Error while deleting the student ->", error);
      res.status(500).json({ error: "Deleting student failed" });
    });
});

// Cohort Routes
// POST /api/cohorts - Creates a new cohort
app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
    .then((createdCohort) => {
      console.log("Cohort created ->", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.log("Error while creating the cohort ->", error);
      res.status(500).json({ error: "Failed to create the cohort" });
    });
});

// GET /api/cohorts - Retrieves all of the cohorts in the database collection
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.log("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

// GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res) => {
  const cohortID = req.params.cohortId;

  Cohort.findById(cohortID)
    .then((cohort) => {
      console.log("Retrieved cohort ->", cohort);
      res.status(200).json(cohort);
    })
    .catch((error) => {
      console.log("Error while retrieving cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

// PUT /api/cohorts/:cohortId - Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      console.log("Updated cohort ->", updatedCohort);
      res.status(200).json(updatedCohort); // Verwende den Statuscode 200 für erfolgreiche Aktualisierungen
    })
    .catch((error) => {
      console.error("Error while updating the cohort ->", error);
      res.status(500).json({ error: "Failed to update the cohort" });
    });
});

// DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
    .then((result) => {
      console.log("Cohort deleted!");
      res.status(204).send();
    })
    .catch((error) => {
      console.log("Error while deleting the cohort ->", error);
      res.status(500).json({ error: "Deleting cohort failed" });
    });
});

require("./error-handling")(app);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
