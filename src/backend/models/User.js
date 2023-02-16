import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    }
});

export default model("User", userSchema);
