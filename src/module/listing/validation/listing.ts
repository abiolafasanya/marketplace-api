// validators/listing.validator.ts
import Joi from "joi";
import { ListingType } from "../model";

export const createListingSchema = Joi.object<ListingType>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid("house", "product", "service").required(),
  location: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()).min(1).optional(),

  // optional boolean, defaults handled in schema
  isAvailable: Joi.boolean(),

  // metadata – dynamic per category, so allow optional and validate manually
  metadata: Joi.object({
    bedrooms: Joi.number().optional(),
    bathrooms: Joi.number().optional(),
    type: Joi.string().optional(),
    productType: Joi.string().optional(),
    serviceType: Joi.string().optional(),
    availability: Joi.string().optional(),
  }).optional(),
});
