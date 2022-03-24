const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { categoryCollection, categorySchema } from "./model";
const { getCollection } = require("../../lib/dbutils");
import * as Helper from "./helper";

export const updateCategory = async (
  space: string,
  data: any,
  userId: string
) => {
  const model = getCollection(space, categoryCollection, categorySchema);
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

export const getCategory = async (space: string) => {
  const model = getCollection(space, categoryCollection, categorySchema);

  return await model.find();
};
