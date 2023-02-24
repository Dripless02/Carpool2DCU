import { model, Schema } from "mongoose";

const passengerSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    departureTime: { type: String, required: true },
    gender: { type: String, enum: { values: ["Male", "Female", "Other"], message: "{VALUE} is not supported" }, required: true },
    noOfPassengers: { type: Number, required: true, max: 4, min: 1 },
    searchQuery: { type: String, required: true },
    location: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    acceptedDriverID: { type: Schema.Types.ObjectId, ref: "Driver", default: null },
    acceptedDriverName: { type: String, default: null },
    status: { type: String, enum: { values: ["Pending", "Accepted-NotACK", "Accepted-ACK", "Completed-NotACK", "Completed-ACK"], message: "{VALUE} is not supported" }, default: "Pending" },
});

export default model("Passenger", passengerSchema);
