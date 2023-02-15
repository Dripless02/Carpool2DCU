import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Driver from "../models/Driver.js";

const router = express.Router();

router.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hashedPassword => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
        });

        user.save()
        .then(result => {
            Driver.create({ userID: result._id, acceptedPassengers: [] })
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

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email })
    .then((user) => {
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
