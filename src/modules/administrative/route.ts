import { authorizeApi } from "../../middlewares";
import { importExpense } from "./service";
const multer = require("multer");
var upload = multer();

const selfRealm = 100;

module.exports = function (router: any) {
  router.post(
    "/administrative/:space/importexpense",
    upload.single("file"),
    authorizeApi,
    importExpense
  );
  // router.post("/auth/token", issueToken);
  // router.get("/auth/token/decode", authorizeApi, decodeToken);
  // router.post("/auth/logout", logout);
  // router.get("/auth/oa/session/:id", (req: any, res: any) =>
  //   validateSession(selfRealm, req, res)
  // );
};
