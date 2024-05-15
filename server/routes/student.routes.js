// routes/student.routes.js

const router = require("express").Router();

const mongoose = require("mongoose");

const Student = require("../models/Student.model");
const Cohort = require("../models/Cohort.model");

//  POST /api/students  -  Creates a new project
router.post("/students", (req, res) => {
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

// GET /api/students -  Retrieves all of the projects
router.get("/students", (req, res) => {
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
router.get("/students/cohort/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  if (!mongoose.Types.ObjectId.isValid(cohortId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

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
router.get("/students/:studentId", (req, res) => {
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
router.put("/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

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
router.delete("/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Student.findByIdAndDelete(studentId)
    .then((result) => {
      console.log("Student deleted!");
      res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
    })
    .catch((error) => {
      console.log("Error while deleting the student ->", error);
      res.status(500).json({ error: "Deleting student failed" });
    });
});

module.exports = router;
