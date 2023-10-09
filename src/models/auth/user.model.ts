import mongoose from "mongoose";

interface I_USER {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  roles: any[];
}

const { Schema } = mongoose;

const User = new Schema<I_USER>(
  {
    username: String,
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: String,
    avatar: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const ObjectUsers = mongoose.model("user", User);
