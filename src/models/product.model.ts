import mongoose, { Schema } from "mongoose";

const products = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    image_url: String,
    image_url_1: String,
    image_url_2: String,
    image_url_3: String,
    quantity: Number,
    price: Number,
    size: Array,
    status: Boolean,
    content: String,
    alias: String,
    category_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("products", products);
