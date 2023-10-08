import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        classify: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Product", ProductSchema);
