import { Router } from "express";
import { authenticate } from "../../commons/middleware/auth";
import { StoreController } from "./controller";


export default function (router: Router) {
 router.get("/store", authenticate, StoreController.getMyStore);
 router.get("/store/:slug", authenticate, StoreController.findMyStore);
 router.put("/store", authenticate, StoreController.updateMyStore);
}


