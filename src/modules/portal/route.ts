import { asyncHandler } from "../../handler";
import {
  authorizeApi,
  authorizePortal,
  readAuthorizationPortal,
} from "../../middlewares";
import { createPortalSession, getBaseSchema, getModules, getModuleOperations } from "./service";

module.exports = function (router: any) {
  router.get("/portal/token/:space/:name", asyncHandler(createPortalSession));
  router.get(
    "/portal/schema",
    asyncHandler(getBaseSchema)
  );
  router.get(
    "/portal/schema/module",
    readAuthorizationPortal,
    asyncHandler(getModules)
  );
  router.get(
    "/portal/schema/module/:name",
    readAuthorizationPortal,
    asyncHandler(getModuleOperations)
  );
};
