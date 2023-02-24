import { model, Schema } from "mongoose";

const driverSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    acceptedPassengers: [{ type: Object }]
});

export default model("Driver", driverSchema);
