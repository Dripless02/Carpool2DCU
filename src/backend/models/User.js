import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    driverAverageRating: { type: Number, default: 3, min: 0, max: 5 },
    passengerAverageRating: { type: Number, default: 3, min: 0, max: 5 },
    driverRatings: [{ type: Number, min: 0, max: 5 }],
    passengerRatings: [{ type: Number, min: 0, max: 5 }],
});

export default model("User", userSchema);
