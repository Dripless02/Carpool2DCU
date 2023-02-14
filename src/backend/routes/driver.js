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
        if (driver.acceptedPassengers.includes(req.body.passenger._id)) {
            return res.status(500).send({ message: "Passenger already added" })
        } else {
            console.log("Passenger not added")
            driver.acceptedPassengers.push(req.body.passenger);
        }

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
        Passenger.find({ _id: { $in: driver.acceptedPassengers } })
        .then((passengers) => {
            res.status(201).send(passengers);
        })
        .catch(error => {
            res.status(500).send({ message: "Error getting passengers", error })
        })

    })
    .catch(error => {
        res.status(500).send({ message: "Error getting passengers", error })
    })
});

router.delete("/deletePassenger/:driverID/", async (req, res) => {
    Driver.findById(req.params.driverID)
    .then((driver) => {
        if (driver.acceptedPassengers.includes(req.body.passengerID)) {
            const index = driver.acceptedPassengers.indexOf(req.body.passengerID);
            driver.acceptedPassengers.splice(index, 1);
        } else {
            return res.status(500).send({ message: "Passenger not found" })
        }

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
