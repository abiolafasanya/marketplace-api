import mongoose, { Schema, Document, model } from "mongoose";
import shortId from "../../commons/utils/shortId";

export interface IStore extends Document {
  name: string;
  description?: string;
  phone?: string;
  logo?: string;
  banner?: string;
  address?: string;
  owner: mongoose.Types.ObjectId;
  slug: string;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    description: String,
    phone: String,
    logo: String,
    banner: String,
    address: String,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

StoreSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      shortId();
  }
  next();
});


export const Store = model<IStore>("Store", StoreSchema);
