import express from "express";
import Passenger from "../models/Passenger.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    const data = new Passenger({
        userID: req.body.userID,
        name: req.body.name,
        departureTime: req.body.departureTime,
        gender: req.body.gender,
        noOfPassengers: req.body.noOfPassengers,
        searchQuery: req.body.searchQuery,
        location: req.body.location,
        status: "Pending",
        acceptedDriverID: null
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
    const findArgs = req.query.userID ? { status: "Pending", userID: { $ne: req.query.userID } } : { status: "Pending" };

    Passenger.find(findArgs)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

router.get("/get/:id",  (req, res) => {
    Passenger.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((error) => res.status(404).json({ message: error.message }));
});

router.post("/rate", async (req, res) => {
    Passenger.findById(req.body.passengerID)
    .then((data) => {
        User.findById(data.userID)
        .then((user) => {
            user.passengerRatings.push(req.body.rating)
            user.passengerAverageRating = user.passengerRatings.reduce((a, b) => a + b, 0) / user.passengerRatings.length
            user.save()
            .then(() => {
                res.status(200).send({ message: "Passenger rated successfully", body: req.body })
            })
            .catch((error) => res.status(404).json({ message: error.message }))
        })
        .catch((error) => res.status(404).json({ message: error.message }))
    })
    .catch((error) => res.status(404).json({ message: error.message }))
});

export default router;
