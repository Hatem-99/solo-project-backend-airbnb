import mongoose from "mongoose";


const { Schema, model } = mongoose;

const accommodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "user" },
    description: { type: String, required: true },
    maxGusts: { type: Number, required: true},
    city: { type: String, required: true},
  },
  { timestamps: true }
);

export default model("Accommodations", accommodationsSchema)