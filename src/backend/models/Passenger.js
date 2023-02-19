import { model, Schema } from "mongoose";

const passengerSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    departureTime: { type: String, required: true },
    gender: { type: String, enum: { values: ["Male", "Female", "Other"], message: "{VALUE} is not supported" }, required: true },
    noOfPassengers: { type: Number, required: true, max: 4, min: 1 },
    location: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    accepted: { type: Boolean, default: false },
    acceptedDriverID: { type: Schema.Types.ObjectId, ref: "Driver", default: null },
});

export default model("Passenger", passengerSchema);
