import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, require: true },
        email: { type: String, require: true },
        password: { type: String, require: true },
        admin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
export default User;
