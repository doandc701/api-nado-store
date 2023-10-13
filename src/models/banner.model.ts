import mongoose, { Schema } from "mongoose";

const banner = new Schema(
  {
    thumbnail: { type: String },
    alias: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("banner", banner);
