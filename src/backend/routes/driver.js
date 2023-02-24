import express from "express";
import Driver from "../models/Driver.js";
import Passenger from "../models/Passenger.js";
import User from "../models/User.js";

const router = express.Router();

// Route to add a new driver
router.post("/add", async (req, res) => {
    const data = new Driver({
        userID: req.body.userID,
        name: req.body.name,
        acceptedPassengers: []
    })

    data.save()
    .then(result => { res.status(201).send({ message: "Driver added successfully", result }) })
    .catch(error => { res.status(400).send({ message: "Error adding driver", error }) })
});

// Route to add a passenger to a driver
router.post("/addPassenger/:driverID", async (req, res) => {
    Driver.findById(req.params.driverID)
    .then((driver) => {
        // Check if the driver has space for the passenger
        const totalNoOfPassengers = driver.acceptedPassengers.reduce((acc, passenger) => acc + passenger.noOfPassengers, 0);
        if (totalNoOfPassengers + req.body.passenger.noOfPassengers > 4) {
            console.log("Too many passengers")
            return res.status(500).send({ message: "Passenger cannot be added. Total number of passengers exceeds 4" })
        } else {console.log("Space for passengers")}

        // Check if the passenger has already been added, if not add them to the driver's accepted passengers
        const filtered = driver.acceptedPassengers.filter(passenger => passenger._id === req.body.passenger._id);
        if (filtered.length > 0) {
            return res.status(500).send({ message: "Passenger already added" })
        } else {
            console.log(`Passenger ${req.body.passenger.name} added`)
            req.body.passenger.acceptedDriverID = req.params.driverID;
            req.body.passenger.accepted = true;
            driver.acceptedPassengers.push(req.body.passenger);
        }

        // Update the passenger's status, accepted driver ID and accepted driver name
        Passenger.updateOne({ _id: req.body.passenger._id }, { status: "Accepted-NotACK", acceptedDriverID: req.params.driverID, acceptedDriverName: driver.name })
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

// Route to get all of a driver's accepted passengers
router.get("/getPassengers/:driverID", async (req, res) => {
    // Find the driver and return their accepted passengers
    Driver.findById(req.params.driverID)
    .then((driver) => {
        res.status(201).send(driver.acceptedPassengers);
    })
    .catch(error => {
        res.status(500).send({ message: "Error getting passengers", error })
    })
});

// Route to delete a passenger from a driver
router.delete("/deletePassenger/:driverID/", async (req, res) => {
    Driver.findById(req.params.driverID)
    .then((driver) => {
        // Check if the passenger is in the driver's accepted passengers, if so remove them
        const filtered = driver.acceptedPassengers.filter(passenger => passenger._id !== req.body.passengerID);
        if (filtered.length !== driver.acceptedPassengers.length) {
            driver.acceptedPassengers = filtered;
        } else {
            return res.status(500).send({ message: "Passenger not found" })
        }

        // Update the passenger's status and accepted driver ID
        Passenger.findOneAndUpdate({ _id: req.body.passengerID }, { acceptedDriverID: null, status: "Pending", acceptedDriverName: null })
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

// Route to get a driver's ID from their userID
router.get("/getDriverID/:userID", async (req, res) => {
    // Find the driver and return their driverID
    Driver.findOne({ userID: req.params.userID })
    .then((driver) => {
        res.send(driver._id);
    })
    .catch(error => {
        res.status(500).send({ message: "Error getting driver", error })
    })
})

// Route to finish a ride
router.post("/finishRide/:driverID", async (req, res) => {
    Driver.findById(req.params.driverID)
    .then((driver) => {
        // Update the status of each passenger to completed
        driver.acceptedPassengers.forEach(passenger => {
            Passenger.updateOne({ _id: passenger._id }, { status: "Completed-NotACK" })
            .then(() => { console.log("Passenger status set to completed") })
            .catch(error => { return res.status(500).send({ message: "Error finishing ride", error }) })
        })

        // Clear the driver's accepted passengers
        driver.acceptedPassengers = [];

        driver.save()
        .then(result => {
            res.status(201).send({ message: "Ride finished successfully", result })
        })
        .catch(error => {
            res.status(500).send({ message: "Error finishing ride", error })
        })
    })
    .catch(error => {
        res.status(500).send({ message: "Error finishing ride", error })
    })
})

// Route to rate a driver
router.post("/rate", async (req, res) => {
    Driver.findById(req.body.driverID)
    .then((driver) => {
        // Find the driver's user
        User.findById(driver.userID)
        .then((user) => {
            // Add the rating to the user's driverRatings array
            user.driverRatings.push(req.body.rating);

            // Calculate the user's new driver average rating
            user.driverAverageRating = user.driverRatings.reduce((acc, rating) => acc + rating, 0) / user.driverRatings.length;

            user.save()
            .then(result => {
                res.status(201).send({ message: "Driver rated successfully", body: req.body })
            })
            .catch(error => {
                res.status(500).send({ message: "Error rating driver", error })
            })
        })
        .catch(error => {
            res.status(500).send({ message: "Error rating driver", error })
        })
    })
    .catch(error => {
        res.status(500).send({ message: "Error rating driver", error })
    })
})

export default router;
