import { authorizeApi } from "../../middlewares";
import {
  signin,
  issueToken,
  decodeToken,
  logout,
  validateSession,
  deleteSession,
  decodeSession,
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/auth/authorize", signin);
  router.post("/auth/token", issueToken);
  router.get("/auth/token/decode", authorizeApi, decodeToken);
  router.post("/auth/logout", logout);
  router.get("/auth/oa/session/:id", (req: any, res: any) =>
    validateSession(selfRealm, req, res)
  );
  router.delete("/auth/oa/session/:id", (req: any, res: any) =>
    deleteSession(selfRealm, req, res)
  );
  router.get("/auth/oa/session/:id/decode", (req: any, res: any) =>
    decodeSession(selfRealm, req, res)
  );
  // Realm endpoints
  router.get("/auth/realm/:realm/session/:id", (req: any, res: any) =>
    validateSession(req.params.realm, req, res)
  );
  router.get("/auth/realm/:realm/session/:id/decode", (req: any, res: any) =>
    decodeSession(req.params.realm, req, res)
  );
  router.delete("/auth/realm/:realm/session/:id", (req: any, res: any) =>
    deleteSession(req.params.realm, req, res)
  );
};
