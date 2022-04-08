import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import { userSchema, userCollection } from "../user/model";
import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const updateTag = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const tag: any = await Helper.updateTag(req.params.space, req.body, userId);
  res.status(200);
  res.send(tag);
  res.end();
};

export const getTag = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const tagList: any = await Helper.getTag(req.params.space);
  res.status(200);
  res.send(tagList);
  res.end();
};
