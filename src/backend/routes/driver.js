import express from "express";
import Driver from "../models/Driver.js";
import Passenger from "../models/Passenger.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    const data = new Driver({
        userID: req.body.userID,
        acceptedPassengers: []
    })
    data.save()
    .then(result => { res.status(201).send({ message: "Driver added successfully", result }) })
    .catch(error => { res.status(400).send({ message: "Error adding driver", error }) })
});

router.post("/addPassenger/:driverID", async (req, res) => {
    Driver.findById(req.params.driverID)
    .then((driver) => {
        const totalNoOfPassengers = driver.acceptedPassengers.reduce((acc, passenger) => acc + passenger.noOfPassengers, 0);
        if (totalNoOfPassengers + req.body.passenger.noOfPassengers > 4) {
            console.log("Too many passengers")
            return res.status(500).send({ message: "Passenger cannot be added. Total number of passengers exceeds 4" })
        } else {console.log("Space for passengers")}

        const filtered = driver.acceptedPassengers.filter(passenger => passenger._id === req.body.passenger._id);
        if (filtered.length > 0) {
            return res.status(500).send({ message: "Passenger already added" })
        } else {
            console.log(`Passenger ${req.body.passenger.name} added`)
            req.body.passenger.acceptedDriverID = req.params.driverID;
            req.body.passenger.accepted = true;
            driver.acceptedPassengers.push(req.body.passenger);
        }

        Passenger.updateOne({ _id: req.body.passenger._id }, { accepted: true, acceptedDriverID: req.params.driverID })
        .then(result => { console.log("Passenger accepted") })
        .catch(error => { return res.status(500).send({ message: "Error updating passenger", error }) })

        driver.save()
        .then(result => {
            res.status(201).send({ message: "Passenger added successfully", result })
        })
        .catch(error => {
            res.status(500).send({ message: "Error adding passenger", error })
        })
    })
    .catch(error => {
        res.status(500).send({ message: "Error adding passenger", error })
    })
});

router.get("/getPassengers/:driverID", async (req, res) => {
    Driver.findById(req.params.driverID)
    .then((driver) => {
        res.status(201).send(driver.acceptedPassengers);
    })
    .catch(error => {
        res.status(500).send({ message: "Error getting passengers", error })
    })
});

router.delete("/deletePassenger/:driverID/", async (req, res) => {
    Driver.findById(req.params.driverID)
    .then((driver) => {
        const filtered = driver.acceptedPassengers.filter(passenger => passenger._id !== req.body.passengerID);
        if (filtered.length !== driver.acceptedPassengers.length) {
            driver.acceptedPassengers = filtered;
        } else {
            return res.status(500).send({ message: "Passenger not found" })
        }

        Passenger.findOneAndUpdate({ _id: req.body.passengerID }, { accepted: false, acceptedDriverID: null })
        .then(() => { console.log("Passenger accepted set to false and acceptedDriverID set to null") })
        .catch(error => { return res.status(500).send({ message: "Error deleting passenger", error }) })

        driver.save()
        .then(result => {
            res.status(201).send({ message: "Passenger deleted successfully", result })
        })
        .catch(error => {
            res.status(500).send({ message: "Error deleting passenger", error })
        })
    })
    .catch(error => {
        res.status(500).send({ message: "Error deleting passenger", error })
    })
});

router.get("/getDriverID/:userID", async (req, res) => {
    Driver.findOne({ userID: req.params.userID })
    .then((driver) => {
        res.send(driver._id);
    })
    .catch(error => {
        res.status(500).send({ message: "Error getting driver", error })
    })
})

export default router;
