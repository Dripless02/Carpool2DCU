import express from "express";
import Passenger from "../models/Passenger.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    const data = new Passenger({
        userID: req.body.userID,
        name: req.body.name,
        departureTime: req.body.departureTime,
        gender: req.body.gender,
        noOfPassengers: req.body.noOfPassengers,
        location: req.body.location
    })
    data.save()
    .then(result => {
        res.status(201).send({ message: "Passenger added successfully", result })
    })
    .catch(error => {
        res.status(400).send({ message: "Error adding passenger", error })
    })
});

router.get("/getAll", async (req, res) => {
    Passenger.find()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

router.get("/get/:id",  (req, res) => {
    Passenger.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((error) => res.status(404).json({ message: error.message }));
});

export default router;
