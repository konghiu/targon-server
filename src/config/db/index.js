import mongoose from "mongoose";

export async function connect() {
    mongoose
        .connect(process.env.MONGODB_CONNECT)
        .then(() => console.log("Connected to MongoDB"))
        .catch((e) => console.log("Could not connect to MongoDB", e));
}
