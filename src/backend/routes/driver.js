import express from "express";
import Driver from "../models/Driver.js";
import Passenger from "../models/Passenger.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    const data = new Driver({
        name: req.body.name,
        userID: req.body.userID,
        acceptedPassengers: []
    })
    try {
        const dataToSave = await data.save();
        res.status(201).json(dataToSave);
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
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
