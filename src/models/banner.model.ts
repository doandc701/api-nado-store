import mongoose, { Schema } from "mongoose";

const banner = new Schema(
  {
    thumbnail: {
      type: Array,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    alias: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("banner", banner);
