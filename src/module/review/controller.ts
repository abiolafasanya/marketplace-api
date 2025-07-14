import { Request, Response } from "express";
import { Review } from "./model"; // adjust path
import catchAsync from "../../shared/request";

export const ReviewController = {
  create: async (req: Request, res: Response) => {
    const review = await Review.create({ ...req.body, user: req.user.id });
    res
      .status(201)
      .json({ status: true, message: "Review added", data: review });
  },

  getForListing: async (req: Request, res: Response) => {
    const reviews = await Review.find({
      listing: req.params.listingId,
    }).populate("user", "name");
    res.json({ status: true, message: "Reviews fetched", data: reviews });
  },
};
