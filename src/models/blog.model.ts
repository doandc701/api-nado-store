import mongoose from "mongoose";

const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    name: String,
    author: String,
    hidden: Boolean,
    slug: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blogs", blogSchema);
