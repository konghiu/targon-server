import mongoose from "mongoose";

const Like = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Comment = mongoose.Schema(
    {
        assessor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        like: [Like],
        dislike: [Like],
    },
    {
        timestamps: true,
    }
);

const BlogSChema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        like: [Like],
        dislike: [Like],
        comments: [Comment],
    },
    { timestamps: true }
);

export default mongoose.model("Blog", BlogSChema);
