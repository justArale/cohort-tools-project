// routes/cohort.routes.js

const router = require("express").Router();

const mongoose = require("mongoose");

const Student = require("../models/Student.model");
const Cohort = require("../models/Cohort.model");

// POST /api/cohorts - Creates a new cohort
router.post("/cohorts", (req, res) => {
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
router.get("/cohorts", (req, res) => {
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
router.get("/cohorts/:cohortId", (req, res) => {
  const cohortID = req.params.cohortId;

  if (!mongoose.Types.ObjectId.isValid(cohortID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

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
router.put("/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  if (!mongoose.Types.ObjectId.isValid(cohortId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

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
router.delete("/cohorts/:cohortId", (req, res) => {
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

module.exports = router;
