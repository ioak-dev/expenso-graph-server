import { authorizeApi } from "../../middlewares";
import { importExpense, deleteTransaction } from "./service";
const multer = require("multer");
var upload = multer();

const selfRealm = 100;

module.exports = function (router: any) {
  router.post(
    "/import/:space",
    upload.single("file"),
    authorizeApi,
    importExpense
  );
  router.delete(
    "/import/:space/transaction/:transactionId",
    authorizeApi,
    deleteTransaction
  );
  // router.post("/auth/token", issueToken);
  // router.get("/auth/token/decode", authorizeApi, decodeToken);
  // router.post("/auth/logout", logout);
  // router.get("/auth/oa/session/:id", (req: any, res: any) =>
  //   validateSession(selfRealm, req, res)
  // );
};
