import { authorizeApi } from "../../middlewares";
import { getTrend, getWeeklyTrend } from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/statistics/:space/trend", authorizeApi, getTrend);
  router.post("/statistics/:space/weekly-trend", authorizeApi, getWeeklyTrend);
  // router.post("/auth/token", issueToken);
  // router.get("/auth/token/decode", authorizeApi, decodeToken);
  // router.post("/auth/logout", logout);
  // router.get("/auth/oa/session/:id", (req: any, res: any) =>
  //   validateSession(selfRealm, req, res)
  // );
};
