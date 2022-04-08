const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { tagCollection, tagSchema } from "./model";
const { getCollection } = require("../../lib/dbutils");
import * as Helper from "./helper";

export const updateTag = async (space: string, data: any, userId: string) => {
  const model = getCollection(space, tagCollection, tagSchema);
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

export const getTag = async (space: string) => {
  const model = getCollection(space, tagCollection, tagSchema);

  return await model.find();
};
