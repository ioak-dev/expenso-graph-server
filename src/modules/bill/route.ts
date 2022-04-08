import { authorizeApi } from "../../middlewares";
import { updateBill, getBill, getBillById } from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.put("/bill/:space", authorizeApi, updateBill);
  router.get("/bill/:space", authorizeApi, getBill);
  router.get("/bill/:space/:id", authorizeApi, getBillById);
  // router.post("/bill/:space", authorizeApi, searchBill);
};
