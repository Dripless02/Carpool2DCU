import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/routes.js";
import pasengerRoutes from "./routes/passenger.js";
import driverRoutes from "./routes/driver.js";

dotenv.config();

const mongoUrl = process.env.DATABASE_URL;

// Connect to the database
mongoose.connect(mongoUrl);
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(`Error connecting to database: ${error}`);
});

database.once("connected", () => {
    console.log("Connected to database");
});

// Create the express app and set up middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server started on port 3000");
});

// Set up routes
app.use("/api", routes);
app.use("/api/passengers", pasengerRoutes);
app.use("/api/driver", driverRoutes);
