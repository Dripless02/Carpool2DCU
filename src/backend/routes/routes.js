import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Driver from "../models/Driver.js";

const router = express.Router();

// Route to register a new user
router.post("/register", (req, res) => {
    // Encrypt the password before saving it to the database
    bcrypt.hash(req.body.password, 10)
    .then(hashedPassword => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
            coordinates: {
                longitude: req.body.coordinates.longitude,
                latitude: req.body.coordinates.latitude
            },
            driverAverageRating: req.body.driverAverageRating || 3,
            passengerAverageRating: req.body.passengerAverageRating || 3,
            driverRatings: req.body.driverRatings || [],
            passengerRatings: req.body.passengerRatings || []
        });

        user.save()
        .then(result => {
            // Create a new driver document for the user
            Driver.create({ userID: result._id, acceptedPassengers: [], name: result.name })
            res.status(201).send({ message: "User registered successfully", result })
        })
        .catch(error => {
            res.status(500).send({ message: "Error registering user", error })
        })
    })
    .catch(error => {
        res.status(500).send({ message: "Error registering user", error })
    })
})

// Route to login a user
router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email })
    .then((user) => {
        // Check if the password is correct
        bcrypt.compare(req.body.password, user.password)
        .then((passwordCheck) => {
            if (!passwordCheck) {
                return res.status(401).send({ message: "Incorrect password" })
            }

            res.status(200).send({ message: "Login successful", id: user._id })
        })
        .catch(error => {
            res.status(500).send({ message: "Error logging in", error })
        })
    })
    .catch(error => {
        res.status(500).send({ message: "Error logging in", error })
    })
})

// Route to get a user's details by ID
router.get("/getUserDetails/:id", (req, res) => {
    User.findById({ _id: req.params.id })
    .then((user) => {
        res.status(200).send(user)
    })
    .catch(error => {
        res.status(500).send({ message: "Error getting user details", error })
    })
});

export default router;
