import { Router } from "express";
import { ListingController } from "./controller";
import { authenticate } from "../../commons/middleware/auth";
import { ReviewController } from "../review/controller";

export default function (router: Router) {
  router.get("/listings", ListingController.findAll);
  router.get("/listing/:id", ListingController.findOne);
  router.post("/listing", authenticate, ListingController.create);
  router.put("/listing/:id", authenticate, ListingController.update);
  router.delete("/listing/:id", authenticate, ListingController.remove);

  router.post("/listings/:id/visit", ListingController.incrementVisit);
  router.post("/listings/:id/click", ListingController.incrementClick);
  router.post("/listings/:id/like", ListingController.like);

  router.get("/listings/:listingId/reviews", ReviewController.getForListing);
  router.post(
    "/listings/:listingId/reviews",
    authenticate,
    ReviewController.create
  );
}
