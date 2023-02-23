import express from "express";
import Passenger from "../models/Passenger.js";
import User from "../models/User.js";

const router = express.Router();

// Route to add a new passenger
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
        acceptedDriverName: null,
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

// Route to get all passengers
router.get("/getAll", async (req, res) => {
    // If a userID is provided, return all passengers that are not the user's
    const findArgs = req.query.userID ? { status: "Pending", userID: { $ne: req.query.userID } } : { status: "Pending" };

    Passenger.find(findArgs)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Route to get a passenger by ID
router.get("/get", (req, res) => {
    // If a passengerID is provided, return the passenger with that ID
    // If a userID is provided, return the passenger with that userID
    // If neither is provided, return an error
    let findArgs = {};
    if (req.query.passengerID) {
        findArgs = { _id: req.query.passengerID };
    } else if (req.query.userID) {
        findArgs = { userID: req.query.userID };
    } else {
        res.status(400).send({ message: "No passengerID or userID provided" })
    }

    Passenger.find(findArgs)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Route to rate a passenger
router.post("/rate", async (req, res) => {
    Passenger.findById(req.body.passengerID)
    .then((data) => {
        // Find the passengers user
        User.findById(data.userID)
        .then((user) => {
            // Add the rating to the user's passengerRatings array
            user.passengerRatings.push(req.body.rating)

            // Calculate the user's new passengerAverageRating
            user.passengerAverageRating = user.passengerRatings.reduce((a, b) => a + b, 0) / user.passengerRatings.length

            user.save()
            .then(() => { res.status(200).send({ message: "Passenger rated successfully", body: req.body }) })
            .catch((error) => res.status(500).send({ message: "Error rating passenger", error }))
        })
        .catch((error) => res.status(500).send({ message: "Error rating passenger", error }))
    })
    .catch((error) => res.status(500).send({ message: "Error rating passenger", error }))
});

// Route to acknowledge if a ride has been accepted or completed
router.post("/acknowledge", async (req, res) => {
    Passenger.findById(req.query.passengerID)
        .then((passenger) => {
            // If the status is Accepted-NotACK, change it to Accepted-ACK
            // If the status is Completed-NotACK, change it to Completed-ACK
            // If the status is anything else, return an error
            if (passenger.status === "Accepted-NotACK") {
                passenger.status = "Accepted-ACK"
            } else if (passenger.status === "Completed-NotACK") {
                passenger.status = "Completed-ACK"
            } else {
                return res.status(400).send({ message: "Invalid status" })
            }

            passenger.save()
                .then(() => {
                    res.status(200).send({ message: "Passenger acknowledged successfully" })
                })
                .catch((error) => {
                    res.status(404).json({ message: error.message })
                })
        })
        .catch((error) => {
            res.status(404).json({ message: error.message })
        })
})

export default router;
