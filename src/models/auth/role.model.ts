import mongoose from "mongoose";

const { Schema } = mongoose;

const Role = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);
export const ObjectRole = mongoose.model("role", Role);
