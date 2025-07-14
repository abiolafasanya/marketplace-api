import mongoose, { Document, model, Schema } from "mongoose";
import { IUser } from "../user/model";
import shortId from "../../commons/utils/shortId";

export interface ListingType {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  slug: string;
  images: [string];
  listedBy: mongoose.Types.ObjectId | IUser;
  isAvailable: boolean;
  popularity: number;
  visits: number;
  clicks: number;
  likes: number;
  metadata: {
    bedrooms: number;
    bathrooms: number;
    type: string; // rent/sale
    productType: string;
    serviceType: string;
    availability: string;
  };
}

export interface IListing extends ListingType, Document {}

const MetaData = new Schema(
  {
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    type: { type: String },
    productType: { type: String },
    serviceType: { type: String },
    availability: { type: String },
  },
  { _id: false }
);

const ListingSchema: Schema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    category: {
      type: String,
      enum: ["house", "product", "service"],
    },
    location: String,
    slug: { type: String, unique: true },
    images: [String],
    listedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: { type: Boolean, default: true },
    popularity: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    metadata: MetaData,
  },
  { timestamps: true }
);

ListingSchema.pre("save", function (next) {
  const listing = this as any;
  const uuid = shortId();
  const rawSlug = `${listing.title}-${listing.category}-${listing.location}-${uuid}`;
  listing.slug = rawSlug
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  next();
});

export const Listing = model<IListing>("Listing", ListingSchema);
