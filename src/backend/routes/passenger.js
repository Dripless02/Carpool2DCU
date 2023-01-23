import express from "express";
import Passenger from "../models/Passenger.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    const data = new Passenger({
        name: req.body.name,
        departureTime: req.body.departureTime,
        gender: req.body.gender,
        noOfPassengers: req.body.noOfPassengers
    })
    try {
        const dataToSave = await data.save();
        res.status(201).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const data = await Passenger.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;