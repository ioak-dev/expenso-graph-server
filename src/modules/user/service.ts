import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import { userSchema, userCollection } from "../user/model";
import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const validateSession = async (req: any, res: any) => {
  const session: any = await Helper.validateSession(
    req.body.accessToken,
    req.body.refreshToken,
    req.params.realmId
  );
  if (!session) {
    res.status(404);
    res.send("Session not found");
    res.end();
    return;
  }
  res.status(200);
  res.send(session);
  res.end();
};
