import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const DBConnection = async () => {
    const MONGO_URI = process.env.mongodb_URL;

    try {
        await mongoose.connect(MONGO_URI); // removed deprecated options
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error while connecting to the database:", error.message);
    }
}

export default DBConnection;
