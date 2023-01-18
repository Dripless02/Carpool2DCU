import { model, Schema } from "mongoose";

const passengerSchema = new Schema({
    name: { type: String, required: true },
    departureTime: { type: String, required: true },
    gender: String,
    noOfPassengers: Number,
});

export default model("Passenger", passengerSchema);