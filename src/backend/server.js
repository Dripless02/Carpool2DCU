import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/routes.js";
import pasengerRoutes from "./routes/passenger.js";

dotenv.config();

const mongoUrl = process.env.DATABASE_URL;

mongoose.connect(mongoUrl);
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(`Error connecting to database: ${error}`);
});

database.once("connected", () => {
    console.log("Connected to database");
});

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

app.use("/api", routes);
app.use("/api/passengers", pasengerRoutes);