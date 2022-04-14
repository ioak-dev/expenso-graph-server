import { authorizeApi } from "../../middlewares";
import { updateBill, getBill, getBillById, searchReceipt } from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.put("/bill/:space", authorizeApi, updateBill);
  router.get("/bill/:space", authorizeApi, getBill);
  router.post("/receipt/:space", authorizeApi, searchReceipt);
  router.get("/bill/:space/:id", authorizeApi, getBillById);
  // router.post("/bill/:space", authorizeApi, searchBill);
};
