import { IUser } from "@/interfaces";
import mongoose, { Schema, model, Model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ["client", "admin", "super-user", "SEO"],
        message: "{VALUE} is not supported",
        default: "client",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || model("User", userSchema);

export default User;
