import { asyncHandler } from "../../handler";
import {
  authorizeApi,
  authorizePortal,
  readAuthorizationPortal,
} from "../../middlewares";
import { createPortalSession, getBaseSchema } from "./service";

module.exports = function (router: any) {
  router.get("/portal/token/:space/:name", asyncHandler(createPortalSession));
  router.get(
    "/portal/schema",
    asyncHandler(getBaseSchema)
  );
};
