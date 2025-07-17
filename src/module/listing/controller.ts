import { Request, Response, NextFunction } from "express";
import { Listing, ListingType } from "./model"; // adjust path
import { paginate } from "../../common/utils/pagination";
import catchAsync from "../../shared/request";
import validateCategoryMetadata from "./validation/validateCategoryMetadata";
import { createListingSchema } from "./validation/listing";

export const ListingController = {
  findAll: catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filters: any = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.location)
      filters.location = { $regex: req.query.location, $options: "i" };
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }

    const { data, meta } = await paginate(Listing, filters, page, limit);

    res.json({
      status: true,
      message: "Listings fetched",
      data,
      meta,
    });
  }),

  findOne: catchAsync(async (req: Request, res: Response) => {
    const listing = await Listing.findById(req.params.id).populate([
      { path: "listedBy", select: "name email role" },
    ]);
    if (!listing)
      return res.status(404).json({ status: false, message: "Not found" });
    res.json({ status: true, message: "Listing fetched", data: listing });
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const value = await createListingSchema.validateAsync(req.body);
    console.log(value);
    console.log(req.user?.id);
    validateCategoryMetadata(value.category, value.metadata);
    const listing = await Listing.create({
      ...value,
      listedBy: req.user?.id,
    });
    res
      .status(201)
      .json({ status: true, message: "Listing created", data: listing });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ status: true, message: "Listing updated", data: listing });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Listing deleted" });
  }),

  incrementVisit: async (req: Request, res: Response) => {
    await Listing.findByIdAndUpdate(req.params.id, {
      $inc: { visits: 1, popularity: 1 },
    });
    res.json({ status: true, message: "Visit recorded" });
  },

  incrementClick: async (req: Request, res: Response) => {
    await Listing.findByIdAndUpdate(req.params.id, {
      $inc: { clicks: 1, popularity: 1 },
    });
    res.json({ status: true, message: "Click recorded" });
  },

  like: async (req: Request, res: Response) => {
    await Listing.findByIdAndUpdate(req.params.id, {
      $inc: { likes: 1, popularity: 1 },
    });
    res.json({ status: true, message: "Like recorded" });
  },
};
