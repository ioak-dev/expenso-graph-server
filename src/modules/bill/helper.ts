const axios = require("axios");
import { parse } from "date-fns";
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { billCollection, billSchema } from "./model";
import { expenseCollection, expenseSchema } from "../expense/model";
import { isEmptyOrSpaces } from "../../lib/Utils";
import { format } from "date-fns";
const { getCollection } = require("../../lib/dbutils");

export const updateBill = async (space: string, data: any, userId: string) => {
  const billPayload = {
    _id: data._id,
    billDate: data.billDate,
    number: data.number,
    total: data.total,
    description: data.description,
  };

  const model = getCollection(space, billCollection, billSchema);
  const expenseModel = getCollection(space, expenseCollection, expenseSchema);
  let billResponse: any = {};
  if (data._id) {
    billResponse = await model.findByIdAndUpdate(
      billPayload._id,
      {
        ...billPayload,
      },
      { new: true, upsert: true }
    );
  } else {
    billResponse = await model.create(data);
  }

  await expenseModel.deleteMany({
    billId: billResponse._id,
  });

  const expensePayload: any[] = [];

  data.items.forEach((item: any) => {
    if (
      !isEmptyOrSpaces(item.category) &&
      !isEmptyOrSpaces(item.description) &&
      item.amount > 0
    ) {
      expensePayload.push({
        billId: billResponse._id,
        // billDate: parse(data.billDate, "yyyy-MM-dd", new Date()),
        billDate: new Date(data.billDate),
        category: item.category,
        description: item.description,
        amount: item.amount,
      });
    }
  });

  const expenseResponse = await expenseModel.insertMany(expensePayload);

  const response = {
    ...billResponse._doc,
    billDate: format(billResponse._doc.billDate, "yyyy-MM-dd"),
    items: expenseResponse,
  };

  return response;
};

export const getBill = async (space: string) => {
  const model = getCollection(space, billCollection, billSchema);

  return await model.find();
};

export const getBillById = async (space: string, id: string) => {
  const model = getCollection(space, billCollection, billSchema);
  const expenseModel = getCollection(space, expenseCollection, expenseSchema);

  const billResponse = await model.findOne({ _id: id });
  const expenseResponse = await expenseModel.find({ billId: billResponse._id });

  return {
    ...billResponse._doc,
    billDate: format(billResponse._doc.billDate, "yyyy-MM-dd"),
    items: expenseResponse,
  };
};
