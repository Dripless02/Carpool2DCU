import { model, Schema } from "mongoose";

const passengerSchema = new Schema({
    name: { type: String, required: true },
    departureTime: { type: String, required: true },
    gender: { type: String, enum: { values: ["Male", "Female", "Other"], message: "{VALUE} is not supported"}},
    noOfPassengers: Number,
});

export default model("Passenger", passengerSchema);