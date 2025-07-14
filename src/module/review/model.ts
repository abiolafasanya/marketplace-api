import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "../user/model";
import { IListing } from "../listing/model";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId | IUser;
  listing: mongoose.Types.ObjectId | IListing;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

export const Review = model<IReview>("Review", ReviewSchema);
