import { Request, Response } from "express";
import catchAsync from "../../shared/request";
import { Store } from "./model";
import { updateStoreProfileSchema } from "./validation";
import { StoreService } from "./service";
import { NotFoundException } from "../../commons/middleware/errors";
import { Listing } from "../listing/model";

export const StoreController = {
  getMyStore: catchAsync(async (req: Request, res: Response) => {
    const store = await Store.findOne({ owner: req.user?.id });
    if (!store) throw new NotFoundException("Store not found");

    res.json({ status: true, data: store });
  }),

  updateMyStore: catchAsync(async (req: Request, res: Response) => {
    const values = await updateStoreProfileSchema.validateAsync(req.body);
    const storeService = new StoreService();
    const store = await storeService.updateStore(values, req.user?.id);
    res.json({ status: true, message: "Store updated", data: store });
  }),

  findMyStore: catchAsync(async (req: Request, res: Response) => {
    const store = await Store.findOne({ slug: req.params.slug }).populate([
      { path: "owner", select: "email name phone avatar" },
    ]);
    const listings = await Listing.find({ listedBy: req.user?.id });

    if (!store) throw new NotFoundException("Store not found");

    res.json({ status: true, message: "Store retrieved", data: store });
  }),
};
