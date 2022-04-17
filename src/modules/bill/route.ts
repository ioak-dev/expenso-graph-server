import { authorizeApi } from "../../middlewares";
import {
  updateBill,
  getBill,
  getBillById,
  searchReceipt,
  getDuplicate,
  fixDuplicate,
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.put("/bill/:space", authorizeApi, updateBill);
  router.get("/bill/:space", authorizeApi, getBill);
  router.post("/receipt/:space", authorizeApi, searchReceipt);
  router.post(
    "/receipt/:space/action/getduplicate",
    authorizeApi,
    getDuplicate
  );
  router.post(
    "/receipt/:space/action/fixduplicate",
    authorizeApi,
    fixDuplicate
  );
  router.get("/bill/:space/:id", authorizeApi, getBillById);
  // router.post("/bill/:space", authorizeApi, searchBill);
};
