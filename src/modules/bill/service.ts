import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import { userSchema, userCollection } from "../user/model";
import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const updateBill = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const bill: any = await Helper.updateBill(req.params.space, req.body, userId);
  res.status(200);
  res.send(bill);
  res.end();
};

export const getBill = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const billList: any = await Helper.getBill(req.params.space);
  res.status(200);
  res.send(billList);
  res.end();
};

export const getBillById = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const bill: any = await Helper.getBillById(req.params.space, req.params.id);
  res.status(200);
  res.send(bill);
  res.end();
};
