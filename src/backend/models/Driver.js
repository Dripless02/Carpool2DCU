import { model, Schema } from "mongoose";

const driverSchema = new Schema({
    name: { type: String, required: true },
    acceptedPassengers: { type: Array, required: true },
});

export default model("Driver", driverSchema);
