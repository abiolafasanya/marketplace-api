import { Router } from "express";
import ListingRoute from "./module/listing/route";
import StoreRoute from "./module/store/route"
import { authenticate } from "./commons/middleware/auth";
import {
  uploadImageHandler,
  uploadMultipleImagesHandler,
} from "./commons/utils/upload";
import AuthRoute from "./module/user/route";
export default function (router: Router) {
  router.get("/", (req, res) => {
    res.json({ status: "success", message: "Health Check" });
  });

  router.post("/upload", authenticate, uploadImageHandler);
  router.post("/uploads", authenticate, uploadMultipleImagesHandler);

  AuthRoute(router);
  ListingRoute(router);
  StoreRoute(router);
}
