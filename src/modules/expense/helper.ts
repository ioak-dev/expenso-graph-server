const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { expenseCollection, expenseSchema } from "./model";
const { getCollection } = require("../../lib/dbutils");
import * as Helper from "./helper";

export const updateExpense = async (
  space: string,
  data: any,
  userId: string
) => {
  const model = getCollection(space, expenseCollection, expenseSchema);
  if (data._id) {
    const response = await model.findByIdAndUpdate(
      data._id,
      {
        ...data,
      },
      { new: true, upsert: true }
    );
    return response;
  }

  return await model.create(data);
};

export const getExpense = async (space: string) => {
  const model = getCollection(space, expenseCollection, expenseSchema);

  return await model.find();
};
