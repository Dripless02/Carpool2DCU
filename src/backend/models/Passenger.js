import { model, Schema } from "mongoose";

const passengerSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    departureTime: { type: String, required: true },
    gender: { type: String, enum: { values: ["Male", "Female", "Other"], message: "{VALUE} is not supported" }, required: true },
    noOfPassengers: { type: Number, required: true },
    location: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    }
});

export default model("Passenger", passengerSchema);
